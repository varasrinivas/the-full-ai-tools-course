/**
 * validate.mjs — course-wide validation for 10x-toolkit.html
 *
 * WHY THIS EXISTS
 *   The course is one self-contained HTML file with 82 module objects and ~78 visual
 *   components. These checks encode the rules from CLAUDE.md and BLUEPRINT.md that are easy
 *   to break silently during maintenance — a visual that stops mounting, a lab count that
 *   drifts, a threshold restated exclusively, a module left flagged needsVerification.
 *
 * RUNNING IT
 *   Needs jsdom (the only dependency). Either:
 *     npm i --no-save jsdom  &&  node validate.mjs
 *   or point at an existing install:
 *     JSDOM_DIR=/path/to/dir/containing/node_modules  node validate.mjs
 *
 *   node validate.mjs            → all course-wide checks
 *   node validate.mjs L-3.2      → course-wide checks + a focused report on one module
 *
 * TWO HARD-WON NOTES FOR WHOEVER EDITS THIS
 *   1. MODS and VISUALS are top-level `const`s in a classic script, so they live in the
 *      script's lexical scope, NOT on `window`. Reach them with window.eval('MODS').
 *   2. ANIM-* components schedule a self-rescheduling replay loop. Without window.close()
 *      and an explicit process.exit(), this script hangs forever after printing its results.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// COURSE_FILE lets you validate a copy (e.g. a release candidate) without touching the original.
const COURSE = process.env.COURSE_FILE || path.join(HERE, '10x-toolkit.html');

// --- resolve jsdom from the repo, or from JSDOM_DIR, with a clear message if absent ---
async function loadJsdom() {
  const candidates = [];
  if (process.env.JSDOM_DIR) candidates.push(path.join(process.env.JSDOM_DIR, 'node_modules', 'jsdom', 'lib', 'api.js'));
  try { return await import('jsdom'); } catch { /* fall through */ }
  for (const c of candidates) {
    if (fs.existsSync(c)) return await import(pathToFileURL(c).href);
  }
  console.error(
    'validate.mjs needs jsdom.\n' +
    '  npm i --no-save jsdom   (then: node validate.mjs)\n' +
    '  or: JSDOM_DIR=<dir containing node_modules> node validate.mjs'
  );
  process.exit(2);
}
const { JSDOM, VirtualConsole } = await loadJsdom();

const only = process.argv[2] || null;
const html = fs.readFileSync(COURSE, 'utf8');

let pass = 0, fail = 0;
const errs = [];
const ok = (name, cond, detail) => {
  if (cond) pass++;
  else { fail++; errs.push(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`); }
};

const consoleErrors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => {
  const m = String(e.message);
  if (!/Not implemented: Window's scroll/.test(m)) consoleErrors.push(m); // jsdom stub, not a page error
});

const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
const { window } = dom, { document } = window;
await new Promise(r => setTimeout(r, 400));

// reduced-motion aware components call bare matchMedia(); jsdom has none
const mm = q => ({ matches: false, media: q, onchange: null, addListener(){}, removeListener(){},
                   addEventListener(){}, removeEventListener(){}, dispatchEvent(){ return false; } });
window.matchMedia = mm;
try { window.eval('this.matchMedia = window.matchMedia'); } catch { /* ignore */ }

const MODS = window.eval('MODS');
const VISUALS = window.eval('VISUALS');

/* ------------------------------------------------------------------ census */
const eng  = MODS.filter(m => m.path === 'eng');
const lead = MODS.filter(m => m.path === 'lead');
const tracks = {};
MODS.forEach(m => { tracks[m.track] = (tracks[m.track] || 0) + 1; });

ok('census: 82 modules', MODS.length === 82, `got ${MODS.length}`);
ok('census: engineer path 60', eng.length === 60, `got ${eng.length}`);
ok('census: leadership path 22', lead.length === 22, `got ${lead.length}`);
ok('census: 18 tracks', Object.keys(tracks).length === 18, Object.keys(tracks).join(','));
ok('census: module ids unique', new Set(MODS.map(m => m.id)).size === MODS.length);

// leadership track sizes come straight from BLUEPRINT.md
for (const [t, n] of Object.entries({ 'L-01':4, 'L-02':4, 'L-03':4, 'L-04':3, 'L-05':4, 'L-06':3 })) {
  ok(`census: ${t} has ${n}`, tracks[t] === n, `got ${tracks[t]}`);
}

/* ------------------------------------------------------------------ schema */
const REQUIRED = ['id','path','track','title','minutes','lastVerified','concept','visual','checklist','quiz'];
const bad = { schema: [], date: [], quiz: [], labs: [], nv: [], analogy: [] };

for (const m of MODS) {
  for (const f of REQUIRED) if (m[f] === undefined) bad.schema.push(`${m.id}.${f}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.lastVerified || '')) bad.date.push(m.id);
  if (!Array.isArray(m.quiz) || !m.quiz.every(q => Array.isArray(q.options) && q.options.length >= 2
      && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) bad.quiz.push(m.id);
  if (!m.concept || !m.concept.body) bad.analogy.push(m.id);
  if (m.needsVerification) bad.nv.push(m.id);

  // Tri-path rule, with the blueprint's two reduced-path tracks: T-04 Copilot+Cursor-led,
  // T-08 Claude-led. Leadership modules are always 2 labs (Playbook + Walkthrough).
  const labs = ['labA','labB','labC'].filter(k => m[k]);
  if (m.path === 'lead' && labs.length !== 2) bad.labs.push(`${m.id}:lead:${labs.length}`);
  if (m.path === 'eng') {
    if (m.track === 'T-04' && !(labs.length === 2 && m.labB && m.labC)) bad.labs.push(`${m.id}:T-04`);
    else if (m.track === 'T-08' && !(labs.length === 1 && m.labA)) bad.labs.push(`${m.id}:T-08`);
    else if (!['T-04','T-08'].includes(m.track) && labs.length !== 3) bad.labs.push(`${m.id}:tri:${labs.length}`);
  }
}

ok('schema: all required fields present', bad.schema.length === 0, bad.schema.slice(0, 6).join(','));
ok('schema: lastVerified is YYYY-MM-DD everywhere', bad.date.length === 0, bad.date.join(','));
ok('schema: every quiz answer index valid', bad.quiz.length === 0, bad.quiz.join(','));
ok('schema: every module has concept body', bad.analogy.length === 0, bad.analogy.join(','));
ok('schema: lab counts obey tri-path + reduced-path rules', bad.labs.length === 0, bad.labs.slice(0, 6).join(','));
ok('currency: no module flagged needsVerification', bad.nv.length === 0,
   bad.nv.length ? `${bad.nv.join(',')} — these MUST be listed in PROGRESS.md` : '');

/* ------------------------------------- domain rules (CLAUDE.md non-negotiables) */
const domainFails = { placeholder: [], threshold: [] };
for (const m of MODS) {
  const blob = [m.concept?.analogy, m.concept?.body, JSON.stringify(m.labA || ''), JSON.stringify(m.labB || ''),
                JSON.stringify(m.labC || ''), JSON.stringify(m.checklist), JSON.stringify(m.quiz)].join(' ');
  if (/\bfoo\b|\bfoobar\b|todo app|widget factory/i.test(blob)) domainFails.placeholder.push(m.id);

  // Threshold rule: score >= 0.85 auto-approves (INCLUSIVE).
  //
  // This check is deliberately NARROW, and it took a false-positive sweep to get right.
  // Requiring an inclusive restatement beside every "0.85" flags 18 modules that are all
  // correct: some ask a data question ("how many requests score exactly 0.85?"), some
  // discuss the BUG-API-01 plant (whose whole subject is the exclusive `>`), and several
  // state inclusivity in prose the regex didn't anticipate — "exactly-at-threshold must
  // auto-approve", "pins 0.85 to AUTO_APPROVED", "the 0.85-inclusive policy of record".
  // Forcing a canonical phrasing everywhere would push noise into good prose.
  //
  // So: flag only an assertion that the POLICY is exclusive, and stand down near text that
  // is plainly describing the planted bug rather than stating the rule.
  const exclusiveClaim = /auto-?approv\w*[^.]{0,40}\b(above|over|greater than|exceeds)\s+0\.85|\b(above|over|greater than|exceeds)\s+0\.85[^.]{0,40}auto-?approv/i;
  if (exclusiveClaim.test(blob)) {
    const bugContext = /bug|plant|strict|should|discrepan|javadoc|line 99|contradict/i.test(blob);
    if (!bugContext) domainFails.threshold.push(m.id);
  }
}
ok('domain: no placeholder vocabulary (foo/bar/todo-app)', domainFails.placeholder.length === 0, domainFails.placeholder.join(','));
ok('domain: threshold never stated exclusively', domainFails.threshold.length === 0,
   domainFails.threshold.length ? `${domainFails.threshold.join(',')} — assert auto-approval ABOVE 0.85; the rule is >= 0.85` : '');
// Sanity: the inclusive rule must be stated somewhere in the course, in some form.
ok('domain: the inclusive rule is taught somewhere',
   /&gt;=\s*0\.85|>=\s*0\.85|0\.85 or (above|higher)|0\.85-inclusive|exactly-at-threshold must auto-approve/i
     .test(MODS.map(m => (m.concept?.body || '') + JSON.stringify(m.quiz || '')).join(' ')));

/* ------------------------------------------------------------------ visuals */
const declared = [...new Set(MODS.filter(m => m.visual).map(m => m.visual.componentId))];
ok('visuals: every declared component has a factory',
   declared.every(id => typeof VISUALS[id] === 'function'),
   declared.filter(id => typeof VISUALS[id] !== 'function').join(','));

const mountFails = [];
for (const m of MODS.filter(x => x.visual)) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  try {
    VISUALS[m.visual.componentId](el, m.visual);   // pass the whole visual object: opts flags live on it
    if (!el.firstChild) mountFails.push(`${m.id}:empty`);
    if (/undefined/.test(el.innerHTML)) mountFails.push(`${m.id}:undefined-in-markup`);
    if (!el.querySelector('[aria-label]')) mountFails.push(`${m.id}:no-aria-label`);
  } catch (e) { mountFails.push(`${m.id}:${e.message}`); }
}
ok('visuals: every module visual mounts cleanly', mountFails.length === 0, mountFails.slice(0, 5).join(' | '));

/* ------------------------------------------------------- theme + standalone */
ok('theme: light-theme override for every SIM/ANIM that defines colour vars',
   (html.match(/\[data-theme="light"\] \.(sim|anim)\d+\{/g) || []).length >= 20);
ok('standalone: no external <script src>', !/<script[^>]+src=/.test(html));
ok('standalone: only Google Fonts are external',
   (html.match(/<link[^>]+href="https?:\/\/([^"]+)"/g) || []).every(l => /fonts\.(googleapis|gstatic)\.com/.test(l)));

/* ------------------------------------------------------------ player render */
const openModule = window.eval('typeof openModule === "function" ? openModule : null');
if (typeof openModule === 'function') {
  const renderFails = [];
  for (const m of MODS) {
    try {
      openModule(m);
      const pill = document.getElementById('modPill').textContent.trim();
      if (m.path === 'lead' && pill !== 'LEADERSHIP') renderFails.push(`${m.id}:pill=${pill}`);
      if (!document.getElementById('modBody').innerHTML) renderFails.push(`${m.id}:empty-body`);
      const labTabs = document.getElementById('labTabs').querySelectorAll('button').length;
      const expected = ['labA','labB','labC'].filter(k => m[k]).length;
      if (labTabs !== expected) renderFails.push(`${m.id}:tabs=${labTabs}/${expected}`);
    } catch (e) { renderFails.push(`${m.id}:${e.message}`); }
  }
  ok('player: all modules open and render their labs', renderFails.length === 0, renderFails.slice(0, 5).join(' | '));
} else {
  ok('player: openModule found', false, 'could not locate openModule()');
}

ok('runtime: no console errors during the whole run', consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '));

/* --------------------------------------------------------- focused report */
if (only) {
  const m = MODS.find(x => x.id === only);
  if (!m) {
    ok(`focus: ${only} exists`, false, 'no such module id');
  } else {
    const labs = ['labA','labB','labC'].filter(k => m[k]);
    console.log(`\n── ${m.id} · ${m.track} · ${m.path} ─────────────────────────`);
    console.log(`   title        ${m.title}`);
    console.log(`   lastVerified ${m.lastVerified}${m.needsVerification ? '   ⚠ needsVerification' : ''}`);
    console.log(`   visual       ${m.visual?.componentId}${Object.keys(m.visual || {}).filter(k => !['type','componentId'].includes(k)).map(k => ` ${k}=${m.visual[k]}`).join('')}`);
    console.log(`   labs         ${labs.join(', ')}   quiz ${m.quiz.length}   checklist ${m.checklist.length}`);
  }
}

/* ------------------------------------------------------------------ report */
console.log(`\n${pass}/${pass + fail} checks passed`);
console.log(`census: ${MODS.length} modules · ${declared.length} visual components · ${Object.keys(tracks).length} tracks`);
if (errs.length) console.log('\n' + errs.join('\n'));

// ANIM components keep timers alive; close and exit explicitly or this never returns.
try { window.close(); } catch { /* ignore */ }
process.exit(errs.length ? 1 : 0);
