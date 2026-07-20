# Visual Component Specs v1.0

All components: vanilla JS + SVG/canvas, no libraries, embedded in the single-file player. Each is a factory function `renderVisual(componentId, mountEl, opts)` so a module invokes one by id. Theme-aware via CSS variables (dark/light). All respect `prefers-reduced-motion` (static final frame + caption). All copy uses prior-auth vocabulary.

## Interactive simulations
| ID | Name | Behavior | Modules |
|----|------|----------|---------|
| SIM-01 | PA Pipeline Map | Request cards flow intake → eligibility → clinical review → auto-approve/deny/manual queue. Recurring course map: each track highlights the stage it improves. Click a stage for its module list. | M-1.1, track intros |
| SIM-02 | Vibe vs Spec Race | Split screen; vibe agent sprints then thrashes (red rewrite flickers, rework counter climbs), spec agent starts slow, finishes clean. Scrub bar to replay; toggle "add auth requirement" to trigger the break. | M-2.2, L-1.2 |
| SIM-03 | Context Budget | Window bar with token segments (system/CLAUDE.md/code/conversation/debris). Sliders: memory-file size, pasted logs, session length. Live cost-per-turn + quality meter. Buttons: /compact vs /clear — compare what survives. | M-7.3, M-8.3 |
| SIM-04 | Threshold Slider | Drag AUTO_APPROVE_THRESHOLD; 60 request dots re-route live between approve/manual lanes. The 0.85-exactly dot blinks; toggle `>` vs `>=` and watch it switch lanes. | M-5.2, L-1.1 |
| SIM-05 | Subagent Org Chart | Click "delegate": parent spawns reviewer/tester/security children, each with its own mini context bar filling independently; summaries flow back; parent bar stays lean. Toggle "no subagents" to see the parent bar flood. | M-9.4, M-9.5 |
| SIM-06 | Session Bill Meter | Replays a lab as a ticking cost meter; spikes annotated ("pasted 40K-token log ↑"). Toggle "reference by path instead" and re-run for the cheaper line. | M-8.2, L-4.1 |

## Animated diagrams (loop / scroll-triggered)
| ID | Name | Behavior | Modules |
|----|------|----------|---------|
| ANIM-07 | Ghost Text Editor | Fake editor types usePriorAuthForm; ghost suggestions appear, Tab-accept, next-edit suggestion hops to the related file tab. | M-4.1, M-4.2 |
| ANIM-08 | Debug Loop Orbit | Circular loop: run → red trace → read → patch → green. Loop radius tightens (fewer turns) as a "context quality" dial rises. | M-5.1 |
| ANIM-09 | Coverage Heatmap | ApprovalService methods color in as tests land; a mutation event flips an operator, one cell flashes red = caught. | M-6.4 |
| ANIM-10 | Memory Hierarchy | Three stacked cards: user-level → project-level → directory-level CLAUDE.md, framed as hospital policy → department policy → this procedure; a prompt beam passes through and picks lines up. | M-7.1 |
| ANIM-11 | Personal Delta Dashboard | Gauges animate from week-1 baseline to final-week values (cycle time, rework, tests-per-feature). Data injected from the student's own logged lab times. | M-11.3, L-5.4 |
| ANIM-12 | AI-DLC Ceremony Flow | Intent card ("cut manual review queue 20%") explodes into units of work (Mob Elaboration), agents pick them up (Mob Construction), converge into a PR node. | M-12.1–12.4, L-6.1 |
| ANIM-14 | One Repo, Three Constitutions | Bare priorauth-api card ("no instruction files") gets scan-swept; three instruction files materialize (CLAUDE.md gold, copilot-instructions.md cyan, .cursor/rules purple) with generated lines typing in, then a "YOU SIGN" threshold line stamped on each; a prompt card confirms the signed rule gets cited. Teaches: generators document what code does, owners sign what it should do. | M-1.4 |
| ANIM-13 | Copilot Mode Spectrum | Same PA task ("update denial-reason copy") flows down three lanes — Ask answers only; Plan writes a read-only workup; Agent crosses sign-off gates (tool confirmations with scope), shows Keep/Undo diffs, drops checkpoint markers. Lanes match the current agents dropdown (Agent/Plan/Ask — Edit mode deprecated, verified 2026-07-20). Abstract behavior diagram by design: no fake IDE chrome or fabricated screenshots. | M-1.3 |

## Terminal replays (TERM-xx)
Typing-animation component replaying trimmed real Claude Code sessions (recorded during repo build). One per Claude Code lab. Speed control ×1/×2/skip. Copilot and Cursor labs instead use annotated screenshot strips (their IDE UIs don't fake honestly in HTML) with step-highlight animation.

| ID | Name | Source & behavior | Modules |
|----|------|-------------------|---------|
| TERM-03 | Vibe Run Replay | Real recorded vibe mission against the real priorauth-web (source: recordings/TERM-03-m2.1-vibe-run.txt): one-sentence prompt → trimmed real output (extend-vs-new decision, files) → real elapsed/build/test tail (4.1 min, 21/21) → annotation on the "accepted by eye" contract. Reuses .term01 styles. | M-2.1 |
| TERM-02 | First Flight Replay | Real recorded headless run of M-1.5's actual mission against the real repo (source: recordings/TERM-02-m1.5-first-flight.txt): mission prompt → trimmed real agent summary (files it chose) → real `mvnw test` green tail → annotation card with the debrief questions. Reuses the .term01 styles; same honesty rules (annotations never fake output). | M-1.5 |
| TERM-01 | First Session Replay | Real capture (v2.1.215, 2026-07-19) in `recordings/TERM-01-m1.2-first-session.txt`: `claude --version` + headless `-p` Q&A citing ApprovalService and the inclusive >= 0.85 rule. Interactive-only mechanics (Shift+Tab, /clear, rewind menu) render as annotation cards, never as fake terminal output. Re-record when the real priorauth-api ships. | M-1.2 |

## Shared conventions
- Gold = Claude Code, cyan = Copilot, purple #6E5AAE = Cursor — everywhere. Purple comes from the reference palette (no invented colors); pair it with white text for AA.
- Every sim has a one-line "what to notice" caption and a reset button.
- Max one heavy canvas per viewport; sims below the fold lazy-init on IntersectionObserver.
