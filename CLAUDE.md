# CLAUDE.md — 10x Toolkit course authoring repo

## What this repo is
Single-file HTML course player + kickoff specs for "The 10x Toolkit" (Claude Code & GitHub Copilot productivity course). Author: Vara Srinivas. Read BLUEPRINT.md before any module work.

## Non-negotiables
- ONE module per session. Never build two. After validating a module, update PROGRESS.md, then stop.
- The course is a single self-contained HTML file: `10x-toolkit.html`. No external JS/CSS beyond Google Fonts. No localStorage assumptions beyond the existing progress pattern.
- Design tokens come from the preview reference (10x-toolkit-preview.html). Never invent new colors. Gold = Claude Code, cyan = Copilot, always.
- Domain: prior authorization. Threshold rule: score **>= 0.85** auto-approves (inclusive). Every example, visual, and lab uses PA vocabulary (requests, payers, CPT codes, denials, review queue). No foo/bar, no todo apps.
- Every module object gets `lastVerified: 'YYYY-MM-DD'`. If a module states a tool capability you have not verified against current docs this session, mark it `needsVerification: true` and list it in PROGRESS.md.
- Dual-path: engineer modules need labA (Claude Code) AND labB (Copilot) unless BLUEPRINT.md marks the track single-path (T-04 Copilot-led, T-08 Claude-led).
- Visuals are factory components per VISUALS.md ids. Reuse existing components; only create a new one if the module's spec block names a new id.
- Accessibility floor: reduced-motion fallbacks, keyboard focus, WCAG AA contrast in both themes.

## Commands
- Preview: open 10x-toolkit.html directly (no build step)
- Validate: /validate-module <id> (checks schema, links, both labs, visual mount, theme pass)

## Style
- Module prose: direct, second person, no filler. One real-world analogy per module, load-bearing not decorative.
- Lab steps are numbered, verifiable ("run X, you should see Y"), ≤30 min each.
- Terminal replays come from recorded sessions in /recordings — never fabricate output.

## What NOT to do
- Do not refactor the player shell while building modules.
- Do not add frameworks, build tools, or split files.
- Do not touch modules marked ✅ in PROGRESS.md without being asked.
