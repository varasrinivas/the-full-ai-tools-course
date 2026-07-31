# CLAUDE.md — 10x Toolkit course authoring repo

## What this repo is
Single-file HTML course player + kickoff specs for "The 10x Toolkit" (Claude Code, GitHub Copilot & Cursor productivity course). Author: Vara Srinivas. Read BLUEPRINT.md before any module work.

## Non-negotiables
- ONE module per session. Never build two. After validating a module, update PROGRESS.md, then stop.
- The course is a single self-contained HTML file: `10x-toolkit.html`. No external JS/CSS beyond Google Fonts. No localStorage assumptions beyond the existing progress pattern.
- Design tokens come from the preview reference (10x-toolkit-preview.html). Never invent new colors. Gold = Claude Code, cyan = Copilot, purple #6E5AAE (from the reference palette) = Cursor, always.
- Domain: prior authorization. Threshold rule: score **>= 0.85** auto-approves (inclusive). Every example, visual, and lab uses PA vocabulary (requests, payers, CPT codes, denials, review queue). No foo/bar, no todo apps.
- Every module object gets `lastVerified: 'YYYY-MM-DD'`. If a module states a tool capability you have not verified against current docs this session, mark it `needsVerification: true` and list it in PROGRESS.md.
- Tri-path: engineer modules need labA (Claude Code), labB (Copilot) AND labC (Cursor) unless BLUEPRINT.md marks the track reduced-path (T-04 Copilot+Cursor-led, T-08 Claude-led). Tool recommendations cite the tool-fit table in BLUEPRINT.md.
- Visuals are factory components per VISUALS.md ids. Reuse existing components; only create a new one if the module's spec block names a new id.
- Accessibility floor: reduced-motion fallbacks, keyboard focus, WCAG AA contrast in both themes.

## Commands
- Preview: open 10x-toolkit.html directly (no build step)
- Validate (one module): /validate-module <id> (checks schema, links, all labs, visual mount, theme pass)
- Validate (whole course): `npm i --no-save jsdom && node validate.mjs` — or `JSDOM_DIR=<dir with node_modules> node validate.mjs`. Add a module id (`node validate.mjs L-3.2`) for a focused report; `COURSE_FILE=<path>` validates a copy. Exits 1 on failure. Covers census, schema, tri-path/reduced-path lab counts, domain rules, every visual mounting, player render of all modules, and standalone integrity. **Run it after any module edit** — it catches the regressions that are invisible in a diff.
- Deploy: .\deploy.ps1 (uploads 10x-toolkit.html + index.html copy to the learning.varasrinivas.com S3 bucket; add -DryRun to preview). NO credentials in the repo — AWS auth is local CLI config; per-machine overrides go in deploy.config.json (gitignored, see deploy.config.example.json)

## Style
- Module prose: direct, second person, no filler. One real-world analogy per module, load-bearing not decorative.
- Lab steps are numbered, verifiable ("run X, you should see Y"), ≤30 min each.
- Terminal replays come from recorded sessions in /recordings — never fabricate output.

## What NOT to do
- Do not refactor the player shell while building modules.
- Do not add frameworks, build tools, or split files.
- Do not touch modules marked ✅ in PROGRESS.md without being asked.
