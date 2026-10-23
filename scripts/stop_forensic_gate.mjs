import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function assert(condition, msg) {
  if (!condition) {
    console.error(`❌ FORENSIC GATE FAILED: ${msg}`);
    process.exit(1);
  }
}

const html = fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'public/styles.css'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'public/app.js'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/e2e_test_cases.json'), 'utf8'));

// 1. Rule 54: Light Theme Default & Zero Dark Mode
assert(css.includes('#f8fafc') && css.includes('#ffffff'), 'Rule 54: Light theme tokens missing in styles.css');
assert(!html.includes('class="dark"') && !css.includes('#020617') && !css.includes('bg-slate-950'), 'Rule 54B: Prohibited dark mode tokens found');

// 2. Rule 26: Rigid Table Cell Containment & Truncate Safety
assert(css.includes('table.table-fixed') && css.includes('overflow: hidden;') && css.includes('max-width: 0;'), 'Rule 26C: Table cell containment missing');
assert(css.includes('span.truncate') && css.includes('display: inline-block;') && css.includes('max-width: 100%;'), 'Rule 26A: span.truncate safety missing');

// 3. Rule 25J: Zero thread-blocking browser dialogs
assert(!/window\.(alert|confirm|prompt)\s*\(/.test(js), 'Rule 25J: Prohibited window.alert/confirm/prompt found');

// 4. Rule 25H: 13 Domains & Strict Ascending ID Order
assert(catalog.domains.length === 13, `Expected 13 functional domains, found ${catalog.domains.length}`);
assert(catalog.testCases.length >= 70, `Expected >= 70 test cases, found ${catalog.testCases.length}`);
for (let i = 1; i < catalog.testCases.length; i++) {
  const prev = catalog.testCases[i - 1].id;
  const curr = catalog.testCases[i].id;
  assert(
    prev.localeCompare(curr, undefined, { numeric: true, sensitivity: 'base' }) <= 0,
    `Rule 25H: Out-of-order test case IDs: ${prev} before ${curr}`
  );
}

// 5. Artifacts existence check
assert(fs.existsSync(path.join(ROOT, 'E2E_MASTER_TEST_PLAN.md')), 'Missing E2E_MASTER_TEST_PLAN.md');
assert(fs.existsSync(path.join(ROOT, 'e2e_test_cases.csv')), 'Missing e2e_test_cases.csv');

// 6. Background Headless Chrome (Puppeteer / CDP Pipe) Runner & Auto-Documentation Check
const serverCode = fs.readFileSync(path.join(ROOT, 'server.mjs'), 'utf8');
assert(fs.existsSync(path.join(ROOT, 'src/headlessRunner.mjs')), 'Missing src/headlessRunner.mjs');
assert(
  serverCode.includes('/api/headless/run-test') && serverCode.includes('/api/headless/run-suite'),
  'Missing /api/headless/run-test or /api/headless/run-suite in server.mjs'
);
assert(
  html.includes('run-headless-suite-btn') && js.includes('drawer-run-headless-btn'),
  'Missing Headless Chrome UI controls in index.html / app.js'
);

// 7. 8-Critical-User-Journey (CUJ-01..CUJ-08) x 4-Dimension Verifier & Grounding Truth + 10-Methodology Check
assert(fs.existsSync(path.join(ROOT, 'src/cujVerifier.mjs')), 'Missing src/cujVerifier.mjs');
assert(fs.existsSync(path.join(ROOT, 'src/groundingTruthRegistry.mjs')), 'Missing src/groundingTruthRegistry.mjs');
assert(
  serverCode.includes('/api/cuj/verify-all') &&
    serverCode.includes('/api/cuj/report') &&
    serverCode.includes('/api/grounding-truth'),
  'Missing /api/cuj/* or /api/grounding-truth in server.mjs'
);
assert(
  html.includes('cuj-verification-matrix-table') &&
    html.includes('grounding-truth-table') &&
    html.includes('testing-methodologies-table') &&
    html.includes('aiux-top5-skills-table') &&
    html.includes('aiux-top5-prompts-table') &&
    html.includes('break-ui-mode-select'),
  'Missing CUJ, Grounding Truth, 10-Methodologies, or AIUX Top 5 Skills/Prompts tables in index.html'
);

console.log('✅ ALL FORENSIC QUALITY GATES PASSED (Rule 25, Rule 26, Rule 54, 13-Domain 70-Case Catalog, Headless Chrome Runner, 8-CUJ 4-Dim Verifier, Grounding Truth, 10-Methodologies & Top 5 AIUX Skills/Prompts).');
