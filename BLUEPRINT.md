# The 10x Toolkit — Course Blueprint v1.0

**Working title:** The 10x Toolkit: Claude Code & GitHub Copilot for Working Engineers
**Author:** Vara Srinivas · varasrinivas.com
**Domain anchor:** Prior Auth Portal (healthcare prior-authorization pipeline)
**Teaching repos:** `priorauth-api` (Spring Boot 3.x) · `priorauth-web` (React 18 + Vite) — see REPO-SPECS.md
**Delivery:** Single-file HTML course player (existing ecosystem pattern: MODS array, track filters, progress persistence, mobile-first). Dark theme default with light toggle. Dual audience: Engineer Path + Leadership Path selectable at top of player.
**Design reference:** `10x-toolkit-preview.html` (token system, orbit hero, dual gold/cyan accent = Claude Code/Copilot).
**Visuals:** every module embeds at least one animated diagram, simulation, or terminal replay — see VISUALS.md for component specs. All visuals use prior-auth vocabulary (PA requests, confidence scores, payers, CPT codes, denial reasons).
**Currency:** every module carries a `lastVerified` date. Feature claims re-checked via /refresh-module (see .claude/commands/).

---

## Dual-path rule

Every hands-on module ships two labs on the same task:
- **Path A (gold):** Claude Code — CLI or IDE extension
- **Path B (cyan):** GitHub Copilot — VS Code and/or Visual Studio 2026 (call out IDE where they differ)
Where a capability exists in only one tool, the module says so explicitly and teaches the nearest equivalent workflow in the other.

---

# ENGINEER PATH — 12 tracks · 56 modules

## T-01 Foundations & Setup (4)
- M-1.1 Meet your crew — what agentic coding actually is; tour of both repos; the PA Pipeline map (SIM-01)
- M-1.2 Claude Code CLI — install, sessions, /clear, /help, permission modes, checkpoints, IDE extension
- M-1.3 Copilot in VS Code & Visual Studio 2026 — chat vs agent mode, agent picker, model selection, tool confirmations, multi-file diff & checkpoints
- M-1.4 First flight — same 15-minute task in both tools ("add a `deniedAt` timestamp to Denial entity"), side-by-side debrief

## T-02 Ways of Working: Vibe vs Spec (4)
- M-2.1 Vibe coding: when it works — 10-minute denial-reasons chart widget in priorauth-web, no spec
- M-2.2 Where vibe breaks — same widget + auth + error handling; watch drift and rework live (SIM-02 race)
- M-2.3 Spec-driven development — short spec for the auto-approve threshold feature; Plan Mode (Claude) & Plan agent (Copilot, saves to .copilot/plans/) as spec-lite
- M-2.4 The decision rubric — cost-of-wrong × lifespan of code; prototype=vibe, production=spec

## T-03 Reading & Analyzing Code (5)
- M-3.1 Onboarding to a strange codebase — "explain this repo" prompts that work; architecture map of priorauth-api
- M-3.2 Plan Mode deep dive (Claude) — read-only exploration, plan review, approve/steer
- M-3.3 Plan agent & symbol tools (Copilot) — read-only exploration, find_symbol / call-hierarchy navigation, plan handoff to Agent mode
- M-3.4 Tracing a request — follow one PA request from controller → service → repository with agent assistance
- M-3.5 Finding the smell — agent-assisted discovery of the N+1 query in ClaimHistoryService (BUG-API-03)

## T-04 Autocomplete & Inline Flow (4) — the Cursor-like layer
- M-4.1 Ghost text mastery — completions, partial accepts, when to type vs Tab (ANIM-07)
- M-4.2 Next edit suggestions — Copilot hopping to the related change across files
- M-4.3 Inline chat & quick edits — Ctrl+I flows, scoped selections, commit-message generation
- M-4.4 Autocomplete vs agent — decision drill: 12 real tasks, pick the right layer, compare cost & speed

## T-05 Debugging (6)
- M-5.1 The agentic debug loop — run test → read stack → hypothesize → fix → verify (ANIM-08)
- M-5.2 The threshold bug — fix BUG-API-01 (`>` vs `>=` at 0.85) with Claude Code, plan-first (SIM-04 threshold slider)
- M-5.3 Debugger agent (Visual Studio) — same class of bug validated against live runtime behavior; breakpoint-assisted flows
- M-5.4 The flaky test — diagnose BUG-API-02 (time-dependent test) in both tools
- M-5.5 Frontend ghosts — the stale-closure bug in usePriorAuthStatus (BUG-WEB-02); React DevTools + agent
- M-5.6 Performance debugging — the slow re-render (BUG-WEB-01) and the N+1 (BUG-API-03); Profile with Copilot in Test Explorer

## T-06 Testing (5)
- M-6.1 Test generation that isn't garbage — prompts, boundary cases, naming conventions
- M-6.2 JUnit + Testcontainers — service-layer tests for ApprovalService against real Postgres
- M-6.3 React Testing Library — testing the PA submission form and validation hook (BUG-WEB-03 has no tests — write them)
- M-6.4 Did the test actually catch it? — mutation drills: flip the operator, prove the suite fails (ANIM-09 heatmap)
- M-6.5 Test-first with agents — red/green/refactor where the agent writes the test before the code

## T-07 Context, Memory & Agent Constitutions (5)
- M-7.1 CLAUDE.md deep dive — the repo constitution: build commands, conventions, domain rules (the 0.85 rule lives here); hierarchy user→project→directory (ANIM-10)
- M-7.2 AGENTS.md & the cross-tool standard — one instruction file; relation to .github/copilot-instructions.md and .agent.md custom agents; lab: one AGENTS.md, verify both tools honor it
- M-7.3 The context window is a budget — astronaut's backpack; token composition; /compact vs /clear (SIM-03)
- M-7.4 Claude memory in practice — `#` capture mid-session, /memory editing, pruning discipline: every line pays rent
- M-7.5 Constitution anti-patterns — essays, stale commands, duplicated docs; the audit checklist

## T-08 The Token Economy (4)
- M-8.1 What you pay for — anatomy of a turn; reading /cost; per-agent cost attribution
- M-8.2 Context pollution — paste vs reference-by-path; log files; the session bill meter (SIM-06)
- M-8.3 Compaction strategy — when /compact loses the plot; checkpoint + /clear + re-anchor pattern
- M-8.4 Model selection economics — big model to plan, small model to grind; fallback chains

## T-09 Subagents, Skills & Custom Agents (7)
- M-9.1 SKILL.md anatomy — frontmatter, /name invocation, autonomous triggering
- M-9.2 One skill, two tools — Copilot discovers .claude/skills/ too; write once, verify in both (killer lab)
- M-9.3 Skills vs Hooks vs Subagents — "Skill teaches the how, Hook enforces the rule, Subagent isolates the work"
- M-9.4 Your first subagent — read-only code-review subagent for PA-domain rules (SIM-05 org chart)
- M-9.5 Parallel fan-out — three subagents review controller/service/repository layers concurrently
- M-9.6 Custom agents in Copilot — .agent.md definitions, user-level agents in ~/.github/agents/, @agent syntax, org-level sharing
- M-9.7 Agent team design — org-chart thinking; scoping tools per agent; SubagentStop-style quality gates

## T-10 Workflows, Hooks & MCP (5)
- M-10.1 Slash commands — encode your team's rituals; build /fix-and-test for the PA repos
- M-10.2 Hooks — PostToolUse formatter, pre-commit test gate, secret redaction
- M-10.3 MCP servers — connect a payer-policy lookup MCP; enterprise allowlists
- M-10.4 Cloud & background agents — Copilot cloud sessions from the IDE (issue+PR on remote infra); Claude Code headless/background runs
- M-10.5 The full workflow — issue → plan → branch → build → test → PR, agent-driven end to end

## T-11 Improving & Measuring Productivity (3)
- M-11.1 Your baseline — week-1 timed tasks without AI; capture cycle time, defects, rework
- M-11.2 Frameworks that survive contact — DORA, SPACE, DX Core 4; what AI changes and what it doesn't; vanity metrics to refuse (acceptance rate ≠ productivity)
- M-11.3 Your delta — re-run task class with full toolkit; personal dashboard (ANIM-11); improvement playbook: instruction files first, then workflows, then agents

## T-12 Graduate Arc: AWS AI-DLC + Capstone (4)
- M-12.1 From tools to method — AI-DLC in one hour: intent → units of work; where each tool skill slots into the lifecycle
- M-12.2 Mob Elaboration — turn "reduce manual review queue by 20%" into units of work, agent-facilitated
- M-12.3 Mob Construction — build the units with agents as crew; human as bouncer, not typist
- M-12.4 Capstone — ship one full feature (new API endpoint → React screen → tests → PR) twice, once per tool; defend the diff; final metrics read-out (ANIM-12)

---

# LEADERSHIP PATH — 6 tracks · 21 modules (no coding required)

## L-01 The Leader's Mental Model (3)
- L-1.1 What agents actually do all day — a shift-length in the life of an engineer+agent pair; watch, don't type
- L-1.2 Vibe vs spec as a risk lens — where AI-written code belongs on your risk register
- L-1.3 The instruction file is the asset — why CLAUDE.md/AGENTS.md quality predicts team ROI

## L-02 The Adoption Playbook (4)
- L-2.1 Pilot design — picking the first squad, the first repo, the first win
- L-2.2 Champions & cadence — office hours, show-the-diff demos, internal course drops
- L-2.3 From 2 power users to 200 — the enablement funnel; measuring adoption honestly
- L-2.4 Resistance patterns — senior-engineer skepticism, junior over-reliance, and what to do about each

## L-03 Governance & Guardrails (4)
- L-3.1 Permission architecture — modes, sandboxes, checkpoints; what "safe by default" looks like
- L-3.2 MCP & data boundaries — allowlists, enterprise policy, what agents may touch
- L-3.3 Reviewing AI-written code — policy that scales; rework radar as a control
- L-3.4 IP, compliance & the audit trail — provenance of generated code in a regulated (healthcare) context

## L-04 The Economics of Agents (3)
- L-4.1 Seats vs tokens — how the bills actually work; per-agent cost attribution
- L-4.2 Budgeting a team — the PA-pipeline team budget lab; big-model/small-model policy
- L-4.3 The ROI narrative — building the CFO deck from your own DORA deltas, not vendor claims

## L-05 Measuring Teams Honestly (4)
- L-5.1 DORA at org level — lead time, deploy frequency, change-failure rate, MTTR with AI in the loop
- L-5.2 SPACE & DX Core 4 — the human dimensions; survey cadence that people don't hate
- L-5.3 Vanity metrics to refuse — lines generated, acceptance rate, "AI usage %"
- L-5.4 The dashboard that changes behavior — leading vs lagging; the manual-review-queue initiative as case study

## L-06 Leading AI-DLC (3)
- L-6.1 The method for managers — intent, units of work, mob ceremonies; what changes about sprints
- L-6.2 Facilitating Mob Elaboration & Construction — the leader as facilitator; anti-patterns
- L-6.3 Restructuring the team — roles, rituals, and career paths when agents join the org chart

---

## Module template (both paths)

Each module = one object in the MODS array:
```
{ id, path: 'eng'|'lead', track, title, minutes, lastVerified,
  concept: {analogy, body},          // real-world analogy card + prose
  visual: {type, componentId},       // ANIM-xx | SIM-xx | TERM-xx per VISUALS.md
  labA: {...}, labB: {...},          // dual-path labs (eng path)
  checklist: [...], quiz: [...] }
```

## Authoring workflow (Claude Code)
1. Session 0: scaffold player from design reference + this blueprint (MODS empty).
2. One module per session: /plan-module ID → /build-module ID → /build-lab ID → /validate-module ID → update PROGRESS.md → /clear.
3. /refresh-module ID re-verifies feature claims against current docs and bumps lastVerified.
