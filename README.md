# Universal E2E Functional Test Runner & Documentation Hub (`e2e-tester`)

An interactive **Manual + Assisted End-to-End (E2E) Functional Test Plan, Execution Runner, and Audit Documentation Hub** engineered for testing any Web / SaaS application across **12 Functional Domains (55+ Core & Edge Test Cases)**.

---

## 1. Quick Start

```bash
# 1. Start the interactive Web E2E Test Runner & Audit Hub (default port 4190)
npm start
# Open http://localhost:4190 in Chrome

# 2. Run the fail-closed Forensic Quality Gate (Rule 25, Rule 26, Rule 54, 12-Domain Catalog)
npm run quality-gate

# 3. Regenerate the Master Test Catalog, Markdown Plan, and CSV Matrix
node scripts/generate_master_test_catalog.mjs

# 4. Run Headless Chrome Multi-Viewport (1600x950, 834x1194, 390x844) & DOM Containment Audit
node scripts/verify_e2e_hub_and_screenshots.mjs
```

---

## 2. Key Files & Artifacts

| File | Purpose |
| :--- | :--- |
| [`server.mjs`](file:///Users/nitinagga/Documents/e2e-tester/server.mjs) | Zero-dependency HTTP & REST API server (`GET /api/state`, `POST /api/test-cases/update`, `POST /api/test-cases/create`, `POST /api/assisted-check`, `POST /api/feedback/submit`, `GET /api/feedback/messages`, `POST /api/feedback/status`, `GET /admin/feedback`, `GET /api/export/markdown`, `GET /api/export/csv`, `GET /api/export/json`). |
| [`public/index.html`](file:///Users/nitinagga/Documents/e2e-tester/public/index.html) | Executive Light-Theme (`#f8fafc` / `#ffffff`) 4-Tab Workspace (`1. Test Matrix & Runner`, `2. Executive Readout & Defect Report`, `3. Execution Audit Log`, `4. IA, Workflows & 8-CUJ Verification`) with Rule 58 Give Feedback Modal (`#universalFeedbackTriggerBtn`). |
| [`public/styles.css`](file:///Users/nitinagga/Documents/e2e-tester/public/styles.css) | 100% fluid edge-to-edge layout (`Rule 25G`), rigid table cell containment (`Rule 26C` `overflow: hidden; max-width: 0;`), and docked right-side drawer (`Rule 25F`). |
| [`public/app.js`](file:///Users/nitinagga/Documents/e2e-tester/public/app.js) | Real-time multi-faceted filtering, URL query-state sync (`?tab=`, `?domain=`, `?status=`, `?q=`), interactive step-by-step drawer checklist, and 1-click payload copy. |
| [`E2E_MASTER_TEST_PLAN.md`](file:///Users/nitinagga/Documents/e2e-tester/E2E_MASTER_TEST_PLAN.md) | Standalone Markdown Master Test Plan with all 13 domains (`70` test cases), preconditions, payloads, procedural steps, and pass/fail checkboxes. |
| [`e2e_test_cases.csv`](file:///Users/nitinagga/Documents/e2e-tester/e2e_test_cases.csv) | RFC-4180 CSV spreadsheet matrix (with formula-injection protection) ready for Google Sheets or Excel import. |
| [`data/e2e_test_cases.json`](file:///Users/nitinagga/Documents/e2e-tester/data/e2e_test_cases.json) | Canonical 13-Domain (70-test) JSON seed catalog. |
| [`data/e2e_execution_state.json`](file:///Users/nitinagga/Documents/e2e-tester/data/e2e_execution_state.json) | Live persisted execution state, defect IDs, notes, and immutable chronological audit trail. |
| [`data/zyvoriq_e2e_report.json`](file:///Users/nitinagga/Documents/e2e-tester/data/zyvoriq_e2e_report.json) | Saved Target App End-to-End, 18-Issue Forensic RCA + Assigned Skill Matrix (`RCA-ZYV-01`..`RCA-ZYV-18`), Playable MP4 Video Registry (`12` authentic MP4 cuts, `0` duplicate jukebox clones), & Multi-Prompt Content Generation Report for **Zyvoriq (`v3.5.0-omni-swarm`)** covering **6 Content Modalities across 8 Unique Prompts**, **12/12 E2E Journeys**, and **10 `2x` Retina Before/After Screenshots** (`public/evidence/zyvoriq/*.png`). |
| [`scripts/stop_forensic_gate.mjs`](file:///Users/nitinagga/Documents/e2e-tester/scripts/stop_forensic_gate.mjs) | 9-Gate Fail-Closed Forensic Quality Gate verifying `Rule 25`, `Rule 26`, `Rule 54`, `Rule 58` (`/api/feedback/*` + `/admin/feedback` ACL), 13-Domain 70-Case Catalog, 8-CUJ 4-Dimension Verifier, and 18-RCA Zyvoriq Dossier. |
| [`scripts/capture_zyvoriq_e2e_screenshots.mjs`](file:///Users/nitinagga/Documents/e2e-tester/scripts/capture_zyvoriq_e2e_screenshots.mjs) | Automated multi-prompt content generator & Headless Chrome `2x` Retina screenshot harvester for Zyvoriq (`/swarm-MUI`, `/personas`, `/admin/feedback`). |

