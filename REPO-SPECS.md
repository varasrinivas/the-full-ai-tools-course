# Teaching Repo Specifications v1.0

Two repos, one domain: a healthcare **Prior Authorization Portal**. Providers submit PA requests; an ML confidence score drives auto-approval; below-threshold requests route to a manual review queue.

Domain constants (appear everywhere, including CLAUDE.md):
- `AUTO_APPROVE_THRESHOLD = 0.85` (inclusive — score **>= 0.85** auto-approves)
- Statuses: SUBMITTED → ELIGIBLE → AUTO_APPROVED | DENIED | MANUAL_REVIEW → APPROVED | DENIED
- Sample payers: Aetna-like "Meridian", UHC-like "Northstar". CPT codes used in fixtures: 97110, 70553, 29881.

---

## Repo 1: `priorauth-api` — Spring Boot 3.x, Java 21, Maven

Structure:
```
src/main/java/com/priorauth/
  controller/  PriorAuthController, DenialController
  service/     ApprovalService, EligibilityService, ClaimHistoryService, NotificationService
  repository/  PriorAuthRequestRepo, ClaimRepo, DenialRepo (Spring Data JPA)
  model/       PriorAuthRequest, Claim, Denial, Payer
  config/      SecurityConfig (basic), OpenAPI
src/test/java/ ... (JUnit 5, Testcontainers Postgres, ~34 passing tests)
docker-compose.yml (Postgres 16), seed.sql (500 realistic PA requests)
```

### Planted defects
| ID | Location | Defect | Used in |
|----|----------|--------|---------|
| BUG-API-01 | ApprovalService:47 | `score > THRESHOLD` should be `>=` — 0.85-exactly requests wrongly routed to manual review | M-5.2, M-5.3, SIM-04, preview terminal |
| BUG-API-02 | EligibilityServiceTest | Flaky: asserts on `LocalDate.now()` window; fails near month boundaries | M-5.4 |
| BUG-API-03 | ClaimHistoryService | N+1: loads Claims per request in a loop instead of a join fetch; 500-row seed makes it measurably slow | M-3.5, M-5.6 |
| BUG-API-04 | NotificationService | Zero test coverage + a swallowed exception (`catch (Exception e) {}`) hiding failed denial notifications | M-6.1, M-6.2 |
| BUG-API-05 | DenialController | Returns 200 with empty body instead of 404 for unknown denial id | M-6.5 (test-first fixes it) |

### Deliberate design choices
- One overly long method (`ApprovalService.process`, ~80 lines) for refactoring labs.
- Inconsistent naming in DenialRepo (teachable via conventions in CLAUDE.md).
- No CLAUDE.md / AGENTS.md at start — students create them in T-07 and feel the before/after.

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

## Build order (Claude Code sessions)
1. Scaffold priorauth-api green (all tests passing), then plant bugs via dedicated commits tagged `plant/BUG-API-xx` (git history becomes teaching material — students can diff the plant).
2. Same for priorauth-web.
3. Verify each planted bug is (a) discoverable by the intended technique and (b) fixable in <30 min lab time.
4. Freeze `main`; labs branch from `lab/start`.
