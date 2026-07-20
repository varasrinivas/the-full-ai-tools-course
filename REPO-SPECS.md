# Teaching Repo Specifications v1.0

Two repos, one domain: a healthcare **Prior Authorization Portal**. Providers submit PA requests; an ML confidence score drives auto-approval; below-threshold requests route to a manual review queue.

Domain constants (appear everywhere, including CLAUDE.md):
- `AUTO_APPROVE_THRESHOLD = 0.85` (inclusive — score **>= 0.85** auto-approves)
- Statuses: SUBMITTED → ELIGIBLE → AUTO_APPROVED | DENIED | MANUAL_REVIEW → APPROVED | DENIED
- Sample payers: Aetna-like "Meridian", UHC-like "Northstar". CPT codes used in fixtures: 97110, 70553, 29881.

---

## Repo 1: `priorauth-api` — Spring Boot 4.1, Java 21, Maven (BUILT 2026-07-20)

Structure (as built):
```
src/main/java/com/priorauth/
  controller/  PriorAuthController, DenialController
  service/     ApprovalService, EligibilityService, ClaimHistoryService,
               NotificationService (+ NotificationGateway/LoggingNotificationGateway)
  repository/  PriorAuthRequestRepo, ClaimRepo, DenialRepo, PayerRepo (Spring Data JPA)
  model/       PriorAuthRequest, Claim, Denial, Payer, RequestStatus
  config/      SecurityConfig (permissive teaching posture), ClockConfig
src/test/java/ ... (JUnit 5, Testcontainers Postgres; 37 passing on lab/start, 41 on the green root commit)
docker-compose.yml (postgres:16-bookworm — keeps legacy tz aliases), seed.sql (500 PA requests, 435 claims, 111 denials, 13 rows scoring exactly 0.85)
```
Boot 4.1 supersedes the original "3.x" line (Vara's scaffold decision, 2026-07-20). No OpenAPI config in v1 — add later if a module needs it. Tests pin `user.timezone=UTC` via surefire.

### Planted defects (each plant is a tagged commit: `plant/BUG-API-xx` — diff the tag)
| ID | Location | Defect | Used in |
|----|----------|--------|---------|
| BUG-API-01 | ApprovalService:99 | `score > AUTO_APPROVE_THRESHOLD` should be `>=` — 0.85-exactly requests (13 in seed) wrongly routed to manual review | M-5.2, M-5.3, SIM-04, preview terminal |
| BUG-API-02 | EligibilityServiceTest `eligibilityDoesNotDependOnWhenInTheMonthTheCheckRuns` | Flaky: asserts `LocalDate.now().plusDays(3)` is the same month — fails the last ~3 days of every month | M-5.4 |
| BUG-API-03 | ClaimHistoryService.historyFor | N+1: loads claims per patient in a loop instead of the batch `findByPatientRefIn` query (which still exists, unused — and the class javadoc still promises ONE query); visible on /api/requests/review-queue/context with the 500-row seed | M-3.5, M-5.6 |
| BUG-API-04 | NotificationService | Swallowed exception (`catch (Exception e) { /* best effort */ }`) hiding failed denial notifications + its tests deleted in the same commit (zero coverage); class javadoc still says "must never fail silently" | M-6.1, M-6.2 |
| BUG-API-05 | DenialController.get | Returns 200 with empty body instead of 404 for unknown denial id; the 404 test was deleted in the plant commit | M-6.5 (test-first fixes it) |

### Deliberate design choices
- One long narrated method (`ApprovalService.process` — eligibility → history context → threshold, with a "resist tidying it" note) for refactoring labs.
- Inconsistent naming in DenialRepo (`findByReasonCode` vs `fetchForRequest`) — teachable via conventions in CLAUDE.md.
- No CLAUDE.md / AGENTS.md at start — students create them in T-07 and feel the before/after (M-1.4 uses a disposable copy).
- `main` frozen at the planted HEAD; labs branch from `lab/start` (same commit).

---

## Repo 2: `priorauth-web` — React 18, Vite, TypeScript

Structure:
```
src/
  pages/       Dashboard, RequestDetail, SubmitRequest, ReviewQueue
  components/  RequestTable, StatusBadge, DenialReasonsChart, ConfidenceGauge
  hooks/       usePriorAuthStatus, usePriorAuthForm, useReviewQueue
  api/         client.ts (fetch wrapper against priorauth-api)
  test/        Vitest + React Testing Library (~20 passing tests)
```

### Planted defects
| ID | Location | Defect | Used in |
|----|----------|--------|---------|
| BUG-WEB-01 | RequestTable | Slow re-render: unmemoized row mapping + inline handlers; visible jank at 500 rows | M-5.6 |
| BUG-WEB-02 | usePriorAuthStatus | Stale closure: polling interval captures initial status, never sees updates | M-5.5 |
| BUG-WEB-03 | usePriorAuthForm | Validation hook (CPT format, payer required) has zero tests | M-6.3 |
| BUG-WEB-04 | ConfidenceGauge | Renders 0.85 as "below threshold" — mirror of BUG-API-01 on the UI side; fixed in capstone |

### Deliberate design choices
- DenialReasonsChart is the vibe-coding target in T-02 (rebuilt from scratch both ways).
- One component intentionally over-abstracted (ReviewQueue) for "simplify this" labs.

---

## Bonus capstone target (M-12.5) — domain migration
The bonus capstone ports both repos from clinical prior auth to **pharmacy prior authorization (PBM)**. Same pipeline shape, new vocabulary: NDC codes replace CPT codes, eligibility adds formulary-tier and days-supply checks, payers become PBMs (CaremarkRx-like "ScriptGuard"). `AUTO_APPROVE_THRESHOLD` semantics unchanged (score **>= 0.85** inclusive). Detailed specs get elaborated when T-12 is planned — this section only fixes the target domain so earlier modules can foreshadow it.

## Build order (Claude Code sessions)
1. Scaffold priorauth-api green (all tests passing), then plant bugs via dedicated commits tagged `plant/BUG-API-xx` (git history becomes teaching material — students can diff the plant).
2. Same for priorauth-web.
3. Verify each planted bug is (a) discoverable by the intended technique and (b) fixable in <30 min lab time.
4. Freeze `main`; labs branch from `lab/start`.
