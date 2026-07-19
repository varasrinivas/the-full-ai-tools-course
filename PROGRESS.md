# PROGRESS.md — 10x Toolkit build log
## Status board
Engineer path: 1/58 built · Leadership path: 0/22 · Player shell: scaffolded (2026-07-19)
| ID | Status | lastVerified | Notes |
|----|--------|--------------|-------|
| M-1.1 | ⚠ validated + Cursor retrofit 2026-07-19 — labs unrunnable until repos exist | 2026-07-19 | All checks pass; now TRI-PATH (labC added). ⚠ only because lab success-checks await priorauth-api/web scaffold; then clear needsVerification and flip to ✅ |
## Decisions log
- 2026-07-19 — Player shell scaffolded as a lean player (condensed hero + functional course area); marketing-only preview sections (orbit canvas, lesson preview, metrics, AI-DLC arc) intentionally not carried into the player.
- 2026-07-19 — Progress persistence: single localStorage key `tenx-progress` → `{theme, path, done:{modId:true}}`, try/catch-guarded.
- 2026-07-19 — Hero stats are computed from TRACKS/MODS per active path (tracks · modules · built · completed), not hardcoded.
- 2026-07-19 — Cursor added as a full third path (labC on every hands-on module). Accent: purple #6E5AAE from the reference palette (white text for AA) — no invented colors. Reduced-path tracks: T-04 Copilot+Cursor-led, T-08 stays Claude-led with a three-way cost comparison in M-8.4.
- 2026-07-19 — New modules from the Cursor expansion: M-2.5 (tool-fit scenario drills), L-1.4 (the fleet decision — tool per use case, for leaders), M-12.5 (bonus capstone: agent-driven migration of both repos from clinical PA to pharmacy PA — target fixed in REPO-SPECS.md). Counts now 58 eng / 22 lead.
- 2026-07-19 — Course repo published to github.com/varasrinivas/the-full-ai-tools-course. Lab repo references now link to github.com/varasrinivas/priorauth-api and /priorauth-web — these 404 until the teaching repos are pushed (tracked under Needs verification).
- 2026-07-19 — Tool-fit guidance table added to BLUEPRINT.md (editorial defaults, e.g. Cursor for rapid UI work, Claude Code for long-horizon backend/agentic work, Copilot for GitHub-native team flow); every module that recommends a tool must cite it and re-verify via /refresh-module.
## Needs verification
- M-1.1: lab success checks ("you should see ApprovalService / ConfidenceGauge") are authored from REPO-SPECS.md, not verified runs — priorauth-api and priorauth-web are not scaffolded yet. Re-run both labs and clear `needsVerification` once the repos exist.
- M-1.1 tool claims WERE verified 2026-07-19 against current docs: Claude Code (`claude` REPL, /help /clear /exit, VS Code extension + JetBrains plugin names) and Copilot (Ask/Edit/Agent modes, @workspace context in VS Code, agent mode in Visual Studio 2026).
- ~~M-1.1 Cursor retrofit~~ DONE 2026-07-19 (labC + crew beat + checklist; renders TRI-PATH LAB). Refresh changelog:
  - Crew beat now names Cursor (AI-native IDE; Agent panel Ctrl/Cmd+I; Plan Mode) — verified against cursor.com/docs 2026-07-19.
  - labC added: Cursor repo tour using Agent panel (Ctrl/Cmd+I) and Plan Mode via Shift+Tab — both verified against cursor.com/docs. Codebase-indexing-on-open wording corroborated by multiple 2026 guides; official docs confirm codebase search tooling.
  - Checklist color line adds purple = Cursor.
  - NOT adopted: "Ask mode" in Cursor (widely described in third-party guides) is not in current official docs — current modes are Agent and Plan — so the lab deliberately avoids it.
  - needsVerification stays true: unchanged reason (teaching repos not scaffolded); lastVerified already 2026-07-19.
- M-1.1 lab links to github.com/varasrinivas/priorauth-api and /priorauth-web are dead until those repos are created and pushed — re-check when the teaching repos ship.
- Remaining tool-fit table claims still editorial/unverified against official Cursor docs: "Cursor best for rapid UI iteration", Cursor Tab vs Copilot next-edit ranking, Composer naming, .cursor/rules *.mdc format. Verify when M-2.5 or T-04 is built.
## Recordings needed
- (none)
