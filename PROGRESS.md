# PROGRESS.md — 10x Toolkit build log
## Status board
Engineer path: 1/56 built · Leadership path: 0/21 · Player shell: scaffolded (2026-07-19)
| ID | Status | lastVerified | Notes |
|----|--------|--------------|-------|
| M-1.1 | ⚠ validated 2026-07-19 — labs unrunnable until repos exist | 2026-07-19 | All checks pass (schema, dual-path, domain, SIM-01 mount + reduced-motion, both themes, standalone). ⚠ only because lab success-checks await priorauth-api/web scaffold; then clear needsVerification and flip to ✅ |
## Decisions log
- 2026-07-19 — Player shell scaffolded as a lean player (condensed hero + functional course area); marketing-only preview sections (orbit canvas, lesson preview, metrics, AI-DLC arc) intentionally not carried into the player.
- 2026-07-19 — Progress persistence: single localStorage key `tenx-progress` → `{theme, path, done:{modId:true}}`, try/catch-guarded.
- 2026-07-19 — Hero stats are computed from TRACKS/MODS per active path (tracks · modules · built · completed), not hardcoded.
## Needs verification
- M-1.1: lab success checks ("you should see ApprovalService / ConfidenceGauge") are authored from REPO-SPECS.md, not verified runs — priorauth-api and priorauth-web are not scaffolded yet. Re-run both labs and clear `needsVerification` once the repos exist.
- M-1.1 tool claims WERE verified 2026-07-19 against current docs: Claude Code (`claude` REPL, /help /clear /exit, VS Code extension + JetBrains plugin names) and Copilot (Ask/Edit/Agent modes, @workspace context in VS Code, agent mode in Visual Studio 2026).
## Recordings needed
- (none)
