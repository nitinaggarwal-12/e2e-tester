# Universal End-to-End (E2E) Functional & Edge-Case Manual Test Plan

> **Scope**: Complete 12-Domain Functional Testing Blueprint covering Common Happy-Path Workflows, Boundary & Edge Cases, Negative Error Paths, Concurrency, Accessibility (WCAG 2.1 AA), and Security Sanitization for any Web/SaaS Application.

## 1. Execution Methodology & Pass/Fail Governance

| Phase | Objective | Entry Criteria | Exit / Sign-Off Gate |
| :--- | :--- | :--- | :--- |
| **Phase 1: Smoke & P0 Critical Path** | Verify Authentication (`D01`), RBAC (`D02`), Core Navigation (`D03`), and Primary CRUD (`D04`) happy paths. | Target build deployed; test accounts & seed data available. | `100%` of `P0` Smoke test cases `PASS` (`0` blockers). |
| **Phase 2: Functional & Workflow Coverage** | Execute all common workflows across Search/Filter (`D06`), State Transitions (`D07`), Async (`D08`), and Exports (`D09`). | Phase 1 Smoke passed. | `>= 98%` `P1` workflow pass rate; zero open P0/P1 defects. |
| **Phase 3: Edge, Boundary & Negative Stress** | Stress-test forms (`D05`), network failure/race conditions (`D10`), keyboard/table geometry (`D11`), and XSS/IDOR security (`D12`). | Phase 2 workflows verified. | `100%` boundary & security payloads handled without crash or leak. |
| **Phase 4: Regression & Release Sign-Off** | Re-test all remediated `FAIL` items and export the signed Markdown/CSV Audit Report. | All defects triaged or fixed. | Signed `E2E_EXECUTION_REPORT.md` archived. |

---

## 2. The 12 Functional Testing Domains

| Code | Domain Name | Cases | Coverage Focus |
| :--- | :--- | :---: | :--- |
| `D01` | **D01: Authentication, Session Lifecycle & Identity** | 8 | Registration, login, SSO/OAuth, MFA, session token refresh, idle expiry, password reset, and logout cache invalidation. |
| `D02` | **D02: Authorization, RBAC & Multi-Tenant Isolation** | 5 | Role-based access control (Admin/Editor/Viewer), forced URL browsing, IDOR prevention, and strict tenant/customer data isolation. |
| `D03` | **D03: Navigation, Routing, Deep Linking & Fluid Geometry** | 5 | Primary sidebar/header routing, URL query state persistence, browser history stack, 404 recovery, and multi-viewport zero-overflow geometry. |
| `D04` | **D04: Core CRUD Workflows & Data Persistence** | 6 | Create, Read, Update, Delete lifecycle, optimistic UI rollback, inline editing, bulk actions, soft-delete undo, and double-submit idempotency. |
| `D05` | **D05: Forms, Input Validation & Boundary Edge Cases** | 7 | Required fields, min/max length boundaries, whitespace-only, Unicode/RTL/Emoji, numeric precision, date/timezone boundaries, and file upload edges. |
| `D06` | **D06: Search, Multi-Faceted Filtering, Sorting & Pagination** | 5 | Debounced live search, regex/special character safety, multi-filter intersection, empty-state reset CTA, multi-column sort, and pagination. |
| `D07` | **D07: State Machines, Multi-Step Wizards & Concurrency** | 3 | Multi-step wizard progression, dirty-form unsaved changes guard, valid/invalid FSM transitions, multi-tab sync, and 409 optimistic locking. |
| `D08` | **D08: Asynchronous Jobs, Polling, WebSockets & Notifications** | 3 | Skeleton loading states (CLS < 0.05), background job polling, webhook timeouts, 429 rate-limit backoff, and non-blocking toast queues. |
| `D09` | **D09: Import, Export, Reporting & Print/PDF Fidelity** | 4 | CSV/JSON/XLSX export accuracy, CSV formula-injection neutralization, UTF-8 BOM encoding, filtered exports, and Print/PDF layout alignment. |
| `D10` | **D10: Network Resilience, Offline Recovery & Storage Corruption** | 3 | Offline transition, Slow-3G out-of-order response race conditions, 500/503 error boundaries with non-destructive retry, and corrupt storage recovery. |
| `D11` | **D11: UI/UX Craft, Accessibility (WCAG 2.1 AA), Responsive Geometry & Table Containment** | 8 | Executive Light Theme, fluid edge-to-edge responsive layout (1600/834/390), zero visual redundancy, non-blocking drawers, keyboard focus order, WCAG AA contrast, and rigid table cell containment. |
| `D12` | **D12: Security Sanitization, Privacy Masking & Audit Trail** | 3 | Stored/reflected XSS neutralization, SQL/NoSQL injection defense, CSRF protection, PII/secret masking in UI and URLs, and immutable audit logs. |
| `D13` | **D13: Product IA, Essential Pages & 4-Workflow Optimization (Business/User/Tech/Ops)** | 10 | Right number of pages, tabs, links & buttons, Landing/Homepage/Onboarding/User Guide/About Us/Contact Us completeness, and Business, User, Technical & Operational workflow optimization. |

---

## 3. Complete Test Case Matrix & Execution Checklist

### D01: Authentication, Session Lifecycle & Identity

_Registration, login, SSO/OAuth, MFA, session token refresh, idle expiry, password reset, and logout cache invalidation._

#### `D01-01` — Standard Valid Login & Session Bootstrap (`P0` · `Common Workflow`)
- **Feature Area**: Authentication / Login
- **Preconditions**: Registered active user account exists; browser cookies/storage cleared.
- **Test Data / Payload**: `email: "qa.user@example.com" | password: "ValidPass!2026"`
- **Step-by-Step Procedure**:
  1. [ ] Navigate to the application login route (/login or root entry).
  2. [ ] Enter valid registered email/username and password.
  3. [ ] Press Enter (or click Sign In) and observe network + redirect behavior.
  4. [ ] Refresh the page (Cmd+R / F5) after landing on the dashboard.
- **Expected Result**: HTTP 200 auth response; secure session token/cookie issued; user redirected to primary workspace within <2s; hard page refresh preserves authenticated state without re-prompting.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D01-02` — Explicit Logout & Browser Back-Button Cache Invalidation (`P0` · `Common Workflow`)
- **Feature Area**: Authentication / Logout
- **Preconditions**: User is logged into an active authenticated session.
- **Test Data / Payload**: `Action: Click Sign Out -> Press Browser Back (Alt+Left / Cmd+[)`
- **Step-by-Step Procedure**:
  1. [ ] Click the user profile menu and trigger Sign Out / Logout.
  2. [ ] Verify redirection to the public login or landing screen.
  3. [ ] Press the browser Back button immediately after logout.
  4. [ ] Attempt to call a protected API endpoint or refresh a protected route.
- **Expected Result**: Session token and sensitive client storage keys are cleared; pressing Browser Back does NOT render cached protected data (Cache-Control: no-store enforced); protected route redirects to login.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D01-03` — Invalid Credentials & Generic Enumeration-Safe Error Message (`P0` · `Negative / Error`)
- **Feature Area**: Authentication / Security
- **Preconditions**: Login page is open.
- **Test Data / Payload**: `Case A: valid email + wrong password | Case B: unregistered email + any password`
- **Step-by-Step Procedure**:
  1. [ ] Enter a valid user email with an incorrect password and submit.
  2. [ ] Record the exact error message and HTTP response time.
  3. [ ] Enter a non-existent email with a password and submit.
  4. [ ] Compare both error messages and UI states.
- **Expected Result**: Both Case A and Case B return an identical, user-enumeration-safe message ("Invalid email or password") with HTTP 401; password field is cleared while email input is preserved so user does not have to retype.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D01-04` — Email Input Case-Insensitivity & Leading/Trailing Whitespace Trimming (`P1` · `Edge Case`)
- **Feature Area**: Authentication / Input Normalization
- **Preconditions**: Account registered as "qa.user@example.com".
- **Test Data / Payload**: `"   QA.User@Example.COM   "`
- **Step-by-Step Procedure**:
  1. [ ] Navigate to the login form.
  2. [ ] Paste email with leading/trailing spaces and mixed uppercase letters: "   QA.User@Example.COM   ".
  3. [ ] Enter valid password and submit.
- **Expected Result**: Application trims leading/trailing whitespace and normalizes email casing to lowercase before lookup; login succeeds seamlessly.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D01-05` — Brute-Force Rate Limiting & Account Lockout Threshold (`P0` · `Security / Resilience`)
- **Feature Area**: Authentication / Rate Limiting
- **Preconditions**: Active test user account.
- **Test Data / Payload**: `6 consecutive failed login attempts within 60 seconds`
- **Step-by-Step Procedure**:
  1. [ ] Submit 5 to 6 consecutive failed password attempts for the same account.
  2. [ ] Observe the HTTP status code and UI feedback on the 6th attempt.
  3. [ ] Immediately attempt login with the CORRECT password while locked/throttled.
- **Expected Result**: Account or IP is throttled (HTTP 429 Too Many Requests) with a clear cooldown timer; even a valid password is rejected during the active lockout window until cooldown expires or reset.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D01-06` — Password Reset Flow & Single-Use Token Expiration (`P1` · `Common Workflow`)
- **Feature Area**: Authentication / Recovery
- **Preconditions**: User account exists with accessible email inbox/log.
- **Test Data / Payload**: `Reset token replay after completion`
- **Step-by-Step Procedure**:
  1. [ ] Request a password reset link from /forgot-password.
  2. [ ] Open the reset link, set a new valid password, and complete reset.
  3. [ ] Verify old password no longer works and new password logs in.
  4. [ ] Click the exact same password reset link a second time.
- **Expected Result**: Password updates atomically; existing sessions are invalidated; reusing the same reset link a second time is rejected as expired/already used.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D01-07` — Silent Token Refresh & Mid-Form Session Expiry Preservation (`P1` · `Edge Case`)
- **Feature Area**: Session Management
- **Preconditions**: User is filling out a complex form while access token nears expiration.
- **Test Data / Payload**: `Expired short-lived access token + valid refresh token (or expired session)`
- **Step-by-Step Procedure**:
  1. [ ] Begin editing a multi-field form with unsaved text.
  2. [ ] Expire or delete the short-lived access token in DevTools -> Application.
  3. [ ] Click Save / Submit on the form.
- **Expected Result**: If refresh token is valid, silent refresh succeeds transparently and saves data; if session is fully expired, user is prompted to re-authenticate without losing their unsaved form draft.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D01-08` — Multi-Tab Login / Logout Synchronization (`P1` · `Edge Case`)
- **Feature Area**: Session Management / Multi-Tab
- **Preconditions**: App open in Tab A and Tab B of the same browser profile.
- **Test Data / Payload**: `Tab A: Logout -> Tab B: Perform action`
- **Step-by-Step Procedure**:
  1. [ ] Open the authenticated workspace in Browser Tab A and Browser Tab B.
  2. [ ] In Tab A, click Sign Out.
  3. [ ] Switch to Tab B and observe UI state or click an interactive control.
- **Expected Result**: Tab B detects session termination (via storage event / BroadcastChannel or 401 interceptor) and cleanly transitions to logged-out state without throwing unhandled JS exceptions.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D02: Authorization, RBAC & Multi-Tenant Isolation

_Role-based access control (Admin/Editor/Viewer), forced URL browsing, IDOR prevention, and strict tenant/customer data isolation._

#### `D02-01` — Role-Based UI Surface & Action Gating (Admin vs. Editor vs. Viewer) (`P0` · `Common Workflow`)
- **Feature Area**: RBAC / Permissions
- **Preconditions**: Three accounts provisioned: Admin, Editor, and Read-Only Viewer.
- **Test Data / Payload**: `Roles: ["ADMIN", "EDITOR", "VIEWER"]`
- **Step-by-Step Procedure**:
  1. [ ] Log in as ADMIN and verify access to system settings, user management, and delete actions.
  2. [ ] Log in as EDITOR and verify create/edit works while admin-only settings are hidden/disabled.
  3. [ ] Log in as VIEWER and verify all mutation controls (Create, Edit, Delete) are disabled or hidden.
- **Expected Result**: Each role renders only authorized controls; Viewer can inspect and export (if permitted) but cannot mutate any record.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D02-02` — Direct URL Forced Browsing to Admin Routes by Non-Admin User (`P0` · `Security / Resilience`)
- **Feature Area**: RBAC / Route Guard
- **Preconditions**: Logged in as standard non-admin Viewer user.
- **Test Data / Payload**: `Direct navigation to: /admin, /admin/settings, /admin/feedback, /users`
- **Step-by-Step Procedure**:
  1. [ ] While logged in as a standard Viewer, manually type /admin or /settings/billing in the browser address bar.
  2. [ ] Inspect both the rendered DOM and the underlying network API calls.
- **Expected Result**: Route guard immediately blocks access with a clean 403 Access Denied view or redirects to home; zero admin API payloads are leaked in the Network tab.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D02-03` — API-Level Privilege Escalation Attempt (Viewer Calling POST/PUT/DELETE) (`P0` · `Security / Resilience`)
- **Feature Area**: RBAC / API Enforcement
- **Preconditions**: Logged in as Read-Only Viewer with valid session token.
- **Test Data / Payload**: `POST /api/records or DELETE /api/records/:id with Viewer auth token`
- **Step-by-Step Procedure**:
  1. [ ] Copy a valid Viewer session cookie/Bearer token from DevTools.
  2. [ ] Replay a POST, PUT, or DELETE mutation request via fetch/curl.
  3. [ ] Verify database state afterwards.
- **Expected Result**: Server rejects the mutation with HTTP 403 Forbidden; record remains untouched in the database; failed attempt is logged.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D02-04` — Cross-Tenant / Cross-Customer Data Isolation & IDOR Prevention (`P0` · `Security / Resilience`)
- **Feature Area**: Multi-Tenancy / IDOR
- **Preconditions**: Two separate tenant/customer accounts exist (Tenant A and Tenant B).
- **Test Data / Payload**: `Tenant A user requesting /api/records/<Tenant_B_Record_UUID>`
- **Step-by-Step Procedure**:
  1. [ ] Log in as Tenant A and note the URL/API structure for viewing a specific record or switching customer selector.
  2. [ ] Substitute a valid Record ID or Customer ID belonging to Tenant B into the URL or API call.
  3. [ ] When switching between authorized customers in a multi-account selector, verify zero residual data from the previous customer remains on screen.
- **Expected Result**: Unauthorized cross-tenant ID returns HTTP 403/404 with zero data leakage; authorized customer switching purges 100% of prior customer state across cards, tables, and drawers.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D02-05` — Mid-Session Role Downgrade or Account Revocation Enforcement (`P1` · `Edge Case`)
- **Feature Area**: RBAC / Real-Time Revocation
- **Preconditions**: User is actively logged in as Editor/Admin.
- **Test Data / Payload**: `Admin downgrades target user role from Editor to Viewer while session is active`
- **Step-by-Step Procedure**:
  1. [ ] User B logs in as Editor and opens an edit drawer.
  2. [ ] Admin User A changes User B role to Read-Only Viewer (or deactivates User B).
  3. [ ] User B clicks Save on the open edit drawer.
- **Expected Result**: Server re-evaluates live permissions on mutation, rejects the save with HTTP 403/401, and refreshes User B UI permissions immediately.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D03: Navigation, Routing, Deep Linking & Fluid Geometry

_Primary sidebar/header routing, URL query state persistence, browser history stack, 404 recovery, and multi-viewport zero-overflow geometry._

#### `D03-01` — Primary Navigation Routing & Active State Synchronization (`P0` · `Common Workflow`)
- **Feature Area**: Navigation / IA
- **Preconditions**: Workspace loaded on desktop viewport.
- **Test Data / Payload**: `Click through all primary navigation tabs/links sequentially`
- **Step-by-Step Procedure**:
  1. [ ] Click each primary navigation item or domain tab in sequence.
  2. [ ] Verify active visual highlight matches the current view.
  3. [ ] Confirm zero duplicate navigation rails or redundant "Jump to Page" dropdowns exist inside sub-views.
- **Expected Result**: Every route/tab loads in <200ms with accurate active indicator; zero duplicate secondary navigation bars (Rule 25A).
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D03-02` — URL Query Parameter Deep-Linking & Hard Refresh State Restoration (`P1` · `Common Workflow`)
- **Feature Area**: Routing / Deep Links
- **Preconditions**: Application supports filtered or tabbed views.
- **Test Data / Payload**: `?domain=D05&status=Fail&q=boundary`
- **Step-by-Step Procedure**:
  1. [ ] Select a specific domain tab, status filter, or search query.
  2. [ ] Copy the full browser URL and open it in a brand-new browser tab (or press Cmd+R).
  3. [ ] Compare the rendered view against the original tab.
- **Expected Result**: URL query parameters (?domain=, ?status=, ?q=) hydrate the exact same active tab, filter selection, and table results on cold load.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D03-03` — Browser Back / Forward History Stack Across Views & Drawers (`P1` · `Edge Case`)
- **Feature Area**: Routing / History API
- **Preconditions**: User navigates across 3 distinct views/filters.
- **Test Data / Payload**: `View A -> View B -> View C -> Back -> Back -> Forward`
- **Step-by-Step Procedure**:
  1. [ ] Navigate from View A to View B to View C.
  2. [ ] Click the Browser Back button twice to return to View A.
  3. [ ] Click the Browser Forward button once to advance to View B.
- **Expected Result**: History stack transitions cleanly without infinite redirect loops, blank screens, or desynchronized tab highlights.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D03-04` — Unknown Route (404) & Malformed URL Parameter Resilience (`P1` · `Negative / Error`)
- **Feature Area**: Routing / Error Boundary
- **Preconditions**: Application server running.
- **Test Data / Payload**: `/non-existent-route-999 and /?domain=INVALID_CODE&page=-999%00`
- **Step-by-Step Procedure**:
  1. [ ] Navigate to an invalid path (/non-existent-route-999) or inject malformed query parameters (?domain=INVALID&page=-999).
  2. [ ] Observe page response and recovery CTA.
- **Expected Result**: Unknown route renders a clean 404 screen or falls back gracefully to default filter with a 1-click return CTA; malformed query params never crash the JS runtime.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D03-05` — Multi-Viewport Fluid Layout & Zero Horizontal Overflow (1600px / 834px / 390px) (`P0` · `Common Workflow`)
- **Feature Area**: Responsive Layout / Geometry
- **Preconditions**: Application open in Chrome DevTools Device Toolbar or Puppeteer.
- **Test Data / Payload**: `Viewports: Desktop 1600x950, Tablet 834x1194, Mobile 390x844`
- **Step-by-Step Procedure**:
  1. [ ] Inspect the application at Desktop (1600x950): verify 100% fluid edge-to-edge width with zero wide empty dead gutters.
  2. [ ] Resize to Tablet (834x1194) and Mobile (390x844).
  3. [ ] Measure document.documentElement.scrollWidth <= document.documentElement.clientWidth across all 3 viewports.
- **Expected Result**: horizontalOverflowPx === 0 across Desktop, Tablet, and Mobile; cards and toolbars wrap cleanly without clipping or overlapping text.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D04: Core CRUD Workflows & Data Persistence

_Create, Read, Update, Delete lifecycle, optimistic UI rollback, inline editing, bulk actions, soft-delete undo, and double-submit idempotency._

#### `D04-01` — Create New Record (Happy Path) & Immediate Persistence Verification (`P0` · `Common Workflow`)
- **Feature Area**: CRUD / Create
- **Preconditions**: User has permission to create records.
- **Test Data / Payload**: `Title: "Checkout Payment Timeout Test" | Priority: "P0" | Domain: "D04"`
- **Step-by-Step Procedure**:
  1. [ ] Open the docked right-side Create Drawer (+ Add Test Case / New Record).
  2. [ ] Populate all required fields with valid inputs and click Save.
  3. [ ] Verify the new item appears immediately in the list and increments KPI counters.
  4. [ ] Perform a hard page refresh (Cmd+R) and verify the created item persists from backend storage.
- **Expected Result**: Record returns HTTP 201/200, renders immediately in the table, updates summary KPIs atomically, and survives full page reload.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D04-02` — Read / Inspect Record Detail in Non-Blocking Right-Side Drawer (`P0` · `Common Workflow`)
- **Feature Area**: CRUD / Read
- **Preconditions**: At least 1 record exists in the primary data table.
- **Test Data / Payload**: `Click any row -> Inspect Drawer`
- **Step-by-Step Procedure**:
  1. [ ] Click "Inspect / Log" on any row in the data table.
  2. [ ] Verify the detail view opens in a docked right-side drawer (Rule 25F) without blocking or darkening the underlying table.
  3. [ ] While the drawer is open, click a different row in the background table.
- **Expected Result**: Docked right-side drawer displays 100% of record fields accurately; background table remains visible and clicking another row smoothly switches the drawer context.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D04-03` — Update Record Status, Notes & Defect Metadata (Inline + Drawer) (`P0` · `Common Workflow`)
- **Feature Area**: CRUD / Update
- **Preconditions**: Existing record in table.
- **Test Data / Payload**: `Status: "Pass" -> "Fail" | Defect ID: "BUG-40219" | Actual Result: "HTTP 502 on submit"`
- **Step-by-Step Procedure**:
  1. [ ] Click a quick status button (Pass / Fail / Blocked) directly in the table row.
  2. [ ] Open the drawer, enter Detailed Actual Results, Defect ID, and Evidence Path, then click Save Execution Log.
  3. [ ] Reload the browser page and re-open the same record.
- **Expected Result**: Both quick-toggle and drawer edits persist immediately to backend JSON/DB store; KPI telemetry strip recalculates Pass/Fail percentages in real time.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D04-04` — Delete / Reset Record with Inline Confirmation & KPI Recalculation (`P1` · `Common Workflow`)
- **Feature Area**: CRUD / Delete & Reset
- **Preconditions**: A custom record or logged test result exists.
- **Test Data / Payload**: `Delete custom record or Reset execution status to Untested`
- **Step-by-Step Procedure**:
  1. [ ] Select a custom-created test case or logged execution record.
  2. [ ] Trigger Delete or Reset using the inline confirmation control (never window.confirm()).
  3. [ ] Verify removal/reset in UI and after page reload.
- **Expected Result**: Action completes without thread-blocking browser popups; table and summary counters update immediately and persist across refresh.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D04-05` — Double-Click / Rapid Multi-Click Submit Idempotency Guard (`P0` · `Edge Case`)
- **Feature Area**: CRUD / Idempotency
- **Preconditions**: Create or Save form is populated and ready to submit.
- **Test Data / Payload**: `Rapidly click "Save" 5 times within 300ms`
- **Step-by-Step Procedure**:
  1. [ ] Fill in the Create form with valid data.
  2. [ ] Rapidly double-click or click the Save button 5 times in <300ms.
  3. [ ] Inspect the Network tab and the resulting table list.
- **Expected Result**: Submit button disables during in-flight request or deduplicates via idempotency guard; strictly 1 record is created (zero duplicate clones).
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D04-06` — Bulk Action Execution (Bulk Reset / Bulk Status Update) (`P1` · `Edge Case`)
- **Feature Area**: CRUD / Bulk Operations
- **Preconditions**: Multiple records have been marked Pass/Fail.
- **Test Data / Payload**: `Bulk Reset filtered domain or full suite`
- **Step-by-Step Procedure**:
  1. [ ] Mark 3 or more test cases as Pass/Fail.
  2. [ ] Trigger the Bulk Reset / Suite Reset workflow with inline confirmation.
  3. [ ] Verify all targeted rows and header KPIs update atomically.
- **Expected Result**: All targeted items update in a single atomic transaction without partial state corruption or UI freeze.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D05: Forms, Input Validation & Boundary Edge Cases

_Required fields, min/max length boundaries, whitespace-only, Unicode/RTL/Emoji, numeric precision, date/timezone boundaries, and file upload edges._

#### `D05-01` — Empty Required Fields & Field-Level Inline Validation Messages (`P0` · `Negative / Error`)
- **Feature Area**: Forms / Required Validation
- **Preconditions**: Create / Edit form drawer is open.
- **Test Data / Payload**: `Submit with all required fields blank ("")`
- **Step-by-Step Procedure**:
  1. [ ] Open the Create Test Case drawer and leave Title and Expected Result empty.
  2. [ ] Click Save.
  3. [ ] Observe field highlights, error text, and focus placement.
- **Expected Result**: Submission is blocked client-side and server-side (HTTP 400); specific inline error message appears below the missing field; zero network crash.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D05-02` — Whitespace-Only String Rejection ("     " and "\t\n") (`P0` · `Edge Case`)
- **Feature Area**: Forms / String Trimming
- **Preconditions**: Create / Edit form is open.
- **Test Data / Payload**: `Title: "        " | Expected Result: "   \n\t   "`
- **Step-by-Step Procedure**:
  1. [ ] Type 10 spaces into required text inputs (Title, Steps, Expected Result).
  2. [ ] Attempt to save the form.
- **Expected Result**: Validator trims input before checking length; whitespace-only strings are rejected as empty required fields.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D05-03` — Minimum & Maximum Character Boundary Values (1, 255, 256, 10,000 Chars) (`P1` · `Edge Case`)
- **Feature Area**: Forms / Boundary Analysis
- **Preconditions**: Text and textarea fields available.
- **Test Data / Payload**: `1-char: "A" | 256-char unbroken token: "A".repeat(256) | 5,000-char notes block`
- **Step-by-Step Procedure**:
  1. [ ] Enter a 1-character string, a 255-character string, and an unbroken 256-character string without spaces.
  2. [ ] Save and inspect how the table cell and drawer render the unbroken 256-character string.
- **Expected Result**: Valid boundary lengths save without silent truncation; unbroken 256-char strings are contained inside fixed table cells (overflow: hidden; max-width: 0; break-words) with 0px bleed into adjacent columns (Rule 26C).
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D05-04` — Unicode, Multi-Byte Emoji, CJK, Accents & Right-to-Left (RTL) Text Fidelity (`P1` · `Edge Case`)
- **Feature Area**: Forms / Internationalization (i18n)
- **Preconditions**: Form input fields and export features available.
- **Test Data / Payload**: `"Café résumé 日本語テスト हिन्दी परीक्षण مرحبا 🚀🧪✅"`
- **Step-by-Step Procedure**:
  1. [ ] Paste multi-script text ("Café résumé 日本語テスト हिन्दी परीक्षण مرحبا 🚀🧪✅") into Actual Result notes and Title.
  2. [ ] Save the record, refresh the page, and export to CSV/Markdown.
- **Expected Result**: 100% of UTF-8 characters, emojis, Devanagari, Arabic RTL, and CJK glyphs round-trip through UI, JSON storage, and CSV/Markdown exports without mojibake (Ã© or ???).
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D05-05` — Numeric Input Boundaries (0, -1, Max Safe Integer, Decimals, NaN, Scientific E-Notation) (`P1` · `Edge Case`)
- **Feature Area**: Forms / Numeric Validation
- **Preconditions**: Any numeric input field (quantity, price, port, threshold, pagination).
- **Test Data / Payload**: `0 | -1 | 9007199254740991 | 0.1 + 0.2 | "1e309" | "abc"`
- **Step-by-Step Procedure**:
  1. [ ] Enter 0, negative numbers (-1), floating-point values (0.1 + 0.2), and non-numeric strings ("abc", "NaN") into numeric fields.
  2. [ ] Verify calculation precision and boundary rejection.
- **Expected Result**: Negative values are rejected where non-negative is required; 0 is distinguished from null/empty; floating-point math rounds cleanly (0.30, not 0.30000000000000004).
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D05-06` — Date, Leap Year (Feb 29), End-of-Month & Timezone/DST Boundary Handling (`P1` · `Edge Case`)
- **Feature Area**: Forms / Date & Time
- **Preconditions**: Date range filter, scheduling input, or timestamp log.
- **Test Data / Payload**: `2028-02-29 (valid leap) | 2026-02-29 (invalid) | StartDate > EndDate | UTC vs Local midnight`
- **Step-by-Step Procedure**:
  1. [ ] Test leap day 2028-02-29 vs non-leap year 2026-02-29.
  2. [ ] Select a Date Range where Start Date is AFTER End Date.
  3. [ ] Verify timestamp display around midnight UTC vs local timezone (no off-by-one day shift).
- **Expected Result**: Invalid calendar dates and inverted date ranges (Start > End) are rejected with clear messages; ISO-8601 timestamps render consistently in local timezone.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D05-07` — File Upload Edge Cases (0-Byte File, Oversized File, Disallowed Extension, Renamed MIME Spoof) (`P1` · `Edge Case`)
- **Feature Area**: Forms / File Upload
- **Preconditions**: File upload or attachment input exists in target app.
- **Test Data / Payload**: `empty_0b.png (0 bytes) | huge_100mb.bin | exploit.exe renamed to exploit.png`
- **Step-by-Step Procedure**:
  1. [ ] Attempt to upload a 0-byte empty file.
  2. [ ] Attempt to upload a file exceeding the maximum size limit.
  3. [ ] Rename an executable/script file to .png or .csv and attempt upload.
- **Expected Result**: 0-byte, oversized, and MIME-mismatched files are rejected with clear user-facing validation errors and HTTP 400/413.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D06: Search, Multi-Faceted Filtering, Sorting & Pagination

_Debounced live search, regex/special character safety, multi-filter intersection, empty-state reset CTA, multi-column sort, and pagination._

#### `D06-01` — Real-Time Live Search Across ID, Title, Feature Area & Expected Result (`P0` · `Common Workflow`)
- **Feature Area**: Search & Filtering
- **Preconditions**: Full test catalog loaded in table.
- **Test Data / Payload**: `Search query: "IDOR" or "D02-04" or "Whitespace"`
- **Step-by-Step Procedure**:
  1. [ ] Type "IDOR" into #search-input (note: zero redundant Search submit button adjacent to input per Rule 25C).
  2. [ ] Verify immediate real-time filtering of rows and visible count badge.
  3. [ ] Clear the search input and verify full dataset restores immediately.
- **Expected Result**: Table filters instantaneously on keystroke without page reload; matching rows and domain counts update accurately.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D06-02` — Search Input Regex & Special Meta-Character Safety (.*+?^${}()|[]\) (`P0` · `Edge Case`)
- **Feature Area**: Search / Input Safety
- **Preconditions**: Live search input active.
- **Test Data / Payload**: `"[.*+?^${}()|[]\\" and "%_\"\'--"`
- **Step-by-Step Procedure**:
  1. [ ] Paste raw regular expression meta-characters "[.*+?^${}()|[]\" into #search-input.
  2. [ ] Observe browser console and empty-state rendering.
- **Expected Result**: Search treats input as literal substring (or escapes regex tokens); zero "Uncaught SyntaxError: Invalid regular expression" in console; clean empty state renders.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D06-03` — Multi-Faceted Filter Intersection (Domain + Category + Priority + Status) (`P0` · `Common Workflow`)
- **Feature Area**: Filtering / Facets
- **Preconditions**: Multiple domains, priorities, and statuses present.
- **Test Data / Payload**: `Domain = D01 + Category = Edge Case + Priority = P1`
- **Step-by-Step Procedure**:
  1. [ ] Select Domain tab "D01: Auth & Session".
  2. [ ] Select Category filter "Edge Case" and Priority filter "P1".
  3. [ ] Verify every displayed row satisfies ALL active filter criteria (logical AND).
- **Expected Result**: Only rows matching D01 AND Edge Case AND P1 are shown; visible counter reflects exact filtered subset.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D06-04` — Zero-Match Resilient Empty State & 1-Click "↺ Reset All Filters" Recovery (Rule 25K) (`P0` · `Edge Case`)
- **Feature Area**: Search & Filtering / Empty State
- **Preconditions**: Table loaded.
- **Test Data / Payload**: `Search query: "xyznonexistent999999"`
- **Step-by-Step Procedure**:
  1. [ ] Enter "xyznonexistent999999" into #search-input combined with a status filter.
  2. [ ] Verify #no-matching-cards empty state container appears.
  3. [ ] Click the "↺ Reset All Filters" button inside the empty state.
- **Expected Result**: Resilient empty state (#no-matching-cards) renders with clear explanation and "↺ Reset All Filters" button; clicking it clears search and all filter dropdowns, restoring all rows immediately.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D06-05` — Strict Sequential Alphanumerical Ordering (D01-01 -> D01-02 -> D01-03) (`P1` · `Common Workflow`)
- **Feature Area**: Sorting & Sequence (Rule 25H)
- **Preconditions**: Test matrix rendered.
- **Test Data / Payload**: `Verify ID sequence across all domains`
- **Step-by-Step Procedure**:
  1. [ ] Inspect the Test ID column from top to bottom in "ALL" view and within each individual domain tab.
  2. [ ] Verify natural ascending numerical order (D01-01, D01-02 ... D01-08, D02-01...).
- **Expected Result**: 100% of rows appear in strict ascending alphanumerical order; zero out-of-order stranded items.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D07: State Machines, Multi-Step Wizards & Concurrency

_Multi-step wizard progression, dirty-form unsaved changes guard, valid/invalid FSM transitions, multi-tab sync, and 409 optimistic locking._

#### `D07-01` — End-to-End Test Execution Lifecycle (Untested -> Pass / Fail / Blocked -> Re-Test Pass) (`P0` · `Common Workflow`)
- **Feature Area**: State Machine / Execution Workflow
- **Preconditions**: Test case starts in "Untested" state.
- **Test Data / Payload**: `Untested -> Fail (with BUG-101) -> Fix Verified -> Pass`
- **Step-by-Step Procedure**:
  1. [ ] Select an Untested test case and mark it as "Fail" with Defect ID "BUG-101" and failure notes.
  2. [ ] Verify the Failed KPI counter and Blocker counter increment.
  3. [ ] After simulated bug fix, re-test the same case, update notes to "Verified fixed in v1.0.2", and mark "Pass".
- **Expected Result**: State transitions cleanly from Untested -> Fail -> Pass; audit timestamp updates; Failed count decrements and Passed count increments accurately.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D07-02` — Step-by-Step Interactive Sub-Checklist Completion Tracking Inside Drawer (`P1` · `Edge Case`)
- **Feature Area**: Workflow / Step Progression
- **Preconditions**: Test case detail drawer open.
- **Test Data / Payload**: `Toggle Step 1, Step 2, Step 3 checkboxes in execution drawer`
- **Step-by-Step Procedure**:
  1. [ ] Open any test case in the right-side execution drawer.
  2. [ ] Check off individual procedural steps (Step 1, Step 2, Step 3) as you execute them manually.
  3. [ ] Save and re-open the test case.
- **Expected Result**: Individual completed step indices persist with the test case so testers can resume multi-step manual workflows without losing their place.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D07-03` — Concurrent Edit / Stale State Overwrite Protection Across Two Sessions (`P1` · `Edge Case`)
- **Feature Area**: Concurrency / Data Integrity
- **Preconditions**: Same record opened in two browser windows.
- **Test Data / Payload**: `Window A updates status=Pass; Window B updates status=Fail`
- **Step-by-Step Procedure**:
  1. [ ] Open the same record in Window A and Window B.
  2. [ ] Save an update in Window A.
  3. [ ] Trigger Refresh / Sync or save an update in Window B and verify deterministic last-write or conflict resolution.
- **Expected Result**: Server processes concurrent writes atomically without corrupting the JSON/SQLite file; refreshing Window A reflects the latest committed state.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D08: Asynchronous Jobs, Polling, WebSockets & Notifications

_Skeleton loading states (CLS < 0.05), background job polling, webhook timeouts, 429 rate-limit backoff, and non-blocking toast queues._

#### `D08-01` — Assisted Live Target URL Pre-Check Probe (HTTP Status, Latency & DOM Readiness) (`P0` · `Common Workflow`)
- **Feature Area**: Assisted Verification / Async Probe
- **Preconditions**: Target URL entered in the Target Application Profile bar.
- **Test Data / Payload**: `Target URL: http://localhost:4173 (or any live URL)`
- **Step-by-Step Procedure**:
  1. [ ] Enter the target application URL in the top Target Application bar.
  2. [ ] Click "⚡ Run Assisted Pre-Check".
  3. [ ] Observe the loading indicator, probe telemetry badge, and non-blocking toast notification.
- **Expected Result**: Backend probe fetches the target URL, measures round-trip latency (ms), extracts HTTP status code and <title>, and displays a live verification badge without blocking the UI.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D08-02` — Assisted Probe Timeout & Unreachable Host Graceful Degradation (`P1` · `Negative / Error`)
- **Feature Area**: Async Error Handling
- **Preconditions**: Target URL set to an unreachable port or invalid host.
- **Test Data / Payload**: `Target URL: http://127.0.0.1:59999`
- **Step-by-Step Procedure**:
  1. [ ] Set Target URL to an unreachable address (http://127.0.0.1:59999).
  2. [ ] Click "⚡ Run Assisted Pre-Check".
  3. [ ] Observe error badge and application responsiveness.
- **Expected Result**: Probe times out cleanly within 5s, displays a structured rose error badge ("Unreachable / ECONNREFUSED"), and keeps the E2E Runner 100% interactive.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D08-03` — Non-Blocking Toast Notification Queue & Auto-Dismissal (`P1` · `Edge Case`)
- **Feature Area**: Notifications / UX (Rule 25J)
- **Preconditions**: Workspace active.
- **Test Data / Payload**: `Trigger 4 status updates rapidly`
- **Step-by-Step Procedure**:
  1. [ ] Rapidly toggle status on 4 different rows.
  2. [ ] Observe the bottom-right toast notification container.
- **Expected Result**: Toasts stack cleanly in the bottom-right corner without obscuring the header or table actions, and auto-dismiss after ~3 seconds.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D09: Import, Export, Reporting & Print/PDF Fidelity

_CSV/JSON/XLSX export accuracy, CSV formula-injection neutralization, UTF-8 BOM encoding, filtered exports, and Print/PDF layout alignment._

#### `D09-01` — Executive Markdown E2E Execution Report Generation & Download (`P0` · `Common Workflow`)
- **Feature Area**: Reporting / Markdown Export
- **Preconditions**: Several test cases executed with Pass, Fail, and Blocked statuses.
- **Test Data / Payload**: `Export format: Markdown (.md)`
- **Step-by-Step Procedure**:
  1. [ ] Switch to Tab 2 ("2. Executive Readout & Defect Report") or open "📥 Export & Reports ▾".
  2. [ ] Click "Export Markdown Report (.md)" or "Copy Markdown Report".
  3. [ ] Inspect the generated Markdown report.
- **Expected Result**: Report contains Executive KPI Summary, Domain-by-Domain Pass/Fail Breakdown Table, P0/P1 Failed & Blocked Defect Register with RCA notes, and complete test execution log.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D09-02` — CSV Test Matrix & Execution Results Export (Excel / Google Sheets Ready) (`P0` · `Common Workflow`)
- **Feature Area**: Reporting / CSV Export
- **Preconditions**: Test suite loaded.
- **Test Data / Payload**: `Export format: CSV (.csv)`
- **Step-by-Step Procedure**:
  1. [ ] Open "📥 Export & Reports ▾" and click "Download CSV Matrix (.csv)".
  2. [ ] Inspect the CSV header row, quote escaping, and row count.
- **Expected Result**: CSV includes all columns (ID, Domain, Category, Priority, Title, Preconditions, Steps, Expected Result, Status, Actual Result, Defect ID, Tested At) with RFC-4180 double-quote escaping.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D09-03` — CSV Formula Injection (CSV-Macro) Neutralization on Export (=, +, -, @) (`P1` · `Security / Resilience`)
- **Feature Area**: Export Security
- **Preconditions**: Record contains a note starting with "=CMD|" or "+SUM(1,1)".
- **Test Data / Payload**: `Actual Result: "=1+1" or "=HYPERLINK(\"http://evil.example\")"`
- **Step-by-Step Procedure**:
  1. [ ] Enter "=1+1" as the Actual Result note on a test case and save.
  2. [ ] Download the CSV export and inspect the raw cell text.
- **Expected Result**: CSV serializer prefixes dangerous leading formula characters (=, +, -, @) with a single quote ('=1+1) so Excel/Google Sheets never execute injected formulas.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D09-04` — Print / PDF Executive Readout Target Alignment (Rule 25H) (`P1` · `Common Workflow`)
- **Feature Area**: Reporting / Print & PDF
- **Preconditions**: Test results logged.
- **Test Data / Payload**: `Click Print / PDF Executive Report`
- **Step-by-Step Procedure**:
  1. [ ] Click "🖨️ Print / PDF Readout" in the header.
  2. [ ] Verify that the UI switches to Tab 2 (Executive Readout & Defect Report) before invoking print styling.
- **Expected Result**: Print/PDF output targets the clean Executive Readout & Defect Summary view rather than dumping raw form inputs or open drawers.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D10: Network Resilience, Offline Recovery & Storage Corruption

_Offline transition, Slow-3G out-of-order response race conditions, 500/503 error boundaries with non-destructive retry, and corrupt storage recovery._

#### `D10-01` — Rapid Tab / Filter Switching Under Simulated High Latency (Race Condition Check) (`P1` · `Edge Case`)
- **Feature Area**: Network Resilience / Race Conditions
- **Preconditions**: Browser Network tab set to Fast 3G / Slow 3G or rapid user clicking.
- **Test Data / Payload**: `Rapidly click D01 -> D02 -> D03 -> D04 -> ALL within 400ms`
- **Step-by-Step Procedure**:
  1. [ ] Rapidly click across 6 different domain tabs and status filters in <500ms.
  2. [ ] Verify the final rendered table matches the LAST clicked tab.
- **Expected Result**: Earlier responses or renders never overwrite the most recently selected tab; UI state remains 100% deterministic.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D10-02` — Corrupt LocalStorage / SessionStorage Self-Healing on Boot (`P1` · `Negative / Error`)
- **Feature Area**: Resilience / Client Storage
- **Preconditions**: Application uses localStorage for UI preferences.
- **Test Data / Payload**: `localStorage.setItem("e2e_tester_prefs", "{corrupt_json_[[[")`
- **Step-by-Step Procedure**:
  1. [ ] Open DevTools Console and run: localStorage.setItem("e2e_tester_prefs", "{corrupt_json_[[[").
  2. [ ] Reload the page (Cmd+R).
- **Expected Result**: JSON.parse is wrapped in try/catch; corrupt storage key is automatically reset to clean defaults without a white screen of death.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D10-03` — Graceful Error State & Non-Destructive Retry When Backend API Returns 500 (`P1` · `Negative / Error`)
- **Feature Area**: Resilience / Error Boundary
- **Preconditions**: Simulated network failure or invalid API payload.
- **Test Data / Payload**: `Simulated API failure during save`
- **Step-by-Step Procedure**:
  1. [ ] Trigger a failed API request (e.g., offline mode in DevTools Network tab) while saving a note.
  2. [ ] Verify user input in the drawer is NOT lost and an inline retry message appears.
- **Expected Result**: Error notification alerts the user clearly; typed notes remain intact in the drawer so the user can click Save again once connectivity returns.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D11: UI/UX Craft, Accessibility (WCAG 2.1 AA), Responsive Geometry & Table Containment

_Executive Light Theme, fluid edge-to-edge responsive layout (1600/834/390), zero visual redundancy, non-blocking drawers, keyboard focus order, WCAG AA contrast, and rigid table cell containment._

#### `D11-01` — Keyboard Navigation: Tab Focus Order, Enter Action & Escape Drawer Dismissal (`P0` · `Common Workflow`)
- **Feature Area**: Accessibility / Keyboard
- **Preconditions**: Mouse set aside; using keyboard only.
- **Test Data / Payload**: `Keys: Tab, Shift+Tab, Enter, Space, Escape`
- **Step-by-Step Procedure**:
  1. [ ] Press Tab repeatedly from the top of the page through filters and table controls; verify visible focus ring.
  2. [ ] Open the right-side detail drawer and press the Escape key.
- **Expected Result**: All interactive buttons/inputs receive visible focus in logical DOM order; pressing Escape cleanly closes the open right-side drawer.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D11-02` — Rigid Table Cell Containment & Zero Text-Overlap Invariant (Rule 26) (`P0` · `Common Workflow`)
- **Feature Area**: UI Geometry / Table Containment
- **Preconditions**: Data table rendered with dense multi-line text and long tokens.
- **Test Data / Payload**: `table.table-fixed tbody td { overflow: hidden; max-width: 0; }`
- **Step-by-Step Procedure**:
  1. [ ] Inspect computed CSS styles on table.table-fixed tbody td and span.truncate.
  2. [ ] Run automated bounding-box collision detection across all visible text nodes.
- **Expected Result**: 100% of table cells enforce overflow: hidden; max-width: 0; span.truncate uses display: inline-block; max-width: 100%; zero text nodes overlap across columns.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D11-03` — Universal Executive Light Theme Default & WCAG AA Contrast (Rule 54) (`P0` · `Common Workflow`)
- **Feature Area**: Visual Design / Light Theme
- **Preconditions**: Application loaded with default settings.
- **Test Data / Payload**: `Root bg: #f8fafc | Card bg: #ffffff | Text: #0f172a`
- **Step-by-Step Procedure**:
  1. [ ] Inspect computed background-color of body (#f8fafc) and primary cards/tables (#ffffff).
  2. [ ] Verify zero unrequested dark-mode classes (class="dark", bg-slate-950, #020617) exist.
- **Expected Result**: 100% Executive Light Theme compliance with high-contrast slate typography and semantic status badges.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D11-04` — 100% Fluid Edge-to-Edge Responsive Reflow Across Desktop (1600px), Tablet (834px) & Mobile (390px) (Rule 25G) (`P0` · `Common Workflow`)
- **Feature Area**: UI/UX / Responsive Viewport Geometry
- **Preconditions**: Application rendered across Desktop, Tablet, and Mobile viewports.
- **Test Data / Payload**: `Viewports: 1600x950, 834x1194, 390x844 | scrollWidth <= clientWidth`
- **Step-by-Step Procedure**:
  1. [ ] Render the workspace at Desktop (1600x950) and verify 100% fluid edge-to-edge width (no narrow 1200px box).
  2. [ ] Resize to Tablet (834x1194) and Mobile (390x844) and inspect document.documentElement.scrollWidth vs. clientWidth.
  3. [ ] Verify KPI cards, domain tabs, and filter bars wrap cleanly without horizontal scrollbars.
- **Expected Result**: horizontalOverflowPx === 0 across all 3 viewports (1600x950, 834x1194, 390x844); fluid container utilizes full viewport width with clamp(16px, 1.8vw, 28px) padding.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D11-05` — Executive IA Zero Visual Redundancy & Non-Blocking Right-Side Inspector Drawer (Rule 25A-25I) (`P0` · `Common Workflow`)
- **Feature Area**: UI/UX / Information Architecture
- **Preconditions**: Workspace header, filter bar, and detail inspector active.
- **Test Data / Payload**: `1 primary nav rail | 0 duplicate search submit buttons | non-blocking aside.drawer-panel`
- **Step-by-Step Procedure**:
  1. [ ] Inspect the top header and workspace tabs to verify a single primary navigation pattern with zero duplicate tab bars.
  2. [ ] Inspect #search-input to verify real-time filtering with zero redundant adjacent "Search" submit button.
  3. [ ] Click "Inspect & Log ->" on any row and verify the right-side drawer opens without a dark full-screen backdrop blocking the main table.
- **Expected Result**: Zero duplicate navigation rails, zero redundant search buttons, and the docked right-side drawer allows simultaneous reading of the main test matrix while inspecting details.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D11-06` — Interactive Micro-States, Loading/Disabled Feedback & Zero Thread-Blocking Dialogs (Rule 25J) (`P1` · `Edge Case`)
- **Feature Area**: UI/UX / Interaction Ergonomics
- **Preconditions**: Interactive buttons, async probes, and bulk reset controls available.
- **Test Data / Payload**: `Zero window.alert/confirm/prompt | Inline confirmation (#inline-reset-confirm)`
- **Step-by-Step Procedure**:
  1. [ ] Click "Reset Run Status" (#bulk-reset-trigger-btn) and verify an inline Yes/Cancel confirmation appears instead of window.confirm().
  2. [ ] Click "⚡ Assisted URL Probe" or "🤖 Headless Run" and verify immediate disabled state + spinner/progress label restoration.
  3. [ ] Verify non-blocking bottom-right toast feedback (#toast-container).
- **Expected Result**: Zero thread-blocking browser dialogs (window.alert/confirm/prompt); all async buttons disable during flight and restore exact original label upon completion.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D11-07` — Typography Hierarchy, KPI Card Grid Symmetry, Hit-Target Sizing & Zero Clipped Labels (`P1` · `Common Workflow`)
- **Feature Area**: UI/UX / Visual Polish & Ergonomics
- **Preconditions**: 6-card KPI telemetry strip, 12-domain tab bar, and open inspector drawer visible.
- **Test Data / Payload**: `6 KPI cards equal row top/height | button height >= 24px | 0 clipped labels`
- **Step-by-Step Procedure**:
  1. [ ] Measure bounding boxes (getBoundingClientRect()) of all 6 KPI cards in #telemetry-grid on desktop.
  2. [ ] Verify all 6 KPI cards align on the exact same top Y coordinate and share equal card height.
  3. [ ] Open the right-side inspector drawer and verify all form labels, inputs, and buttons fit above the footer fold without vertical clipping.
- **Expected Result**: KPI cards form a symmetrical 6-column grid with equal heights (delta <= 1px); interactive controls have ergonomic hit targets; zero labels or inputs are clipped.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D11-08` — Print / PDF Executive Readout Stylesheet & Chrome Suppression (@media print) (`P2` · `Edge Case`)
- **Feature Area**: UI/UX / Print & Export Ergonomics
- **Preconditions**: CSS stylesheet loaded with @media print rules.
- **Test Data / Payload**: `@media print hides .app-header, .profile-bar, .filter-toolbar, .drawer-panel`
- **Step-by-Step Procedure**:
  1. [ ] Inspect stylesheet rules for @media print or click "🖨️ Print / PDF Executive Readout" in Export menu.
  2. [ ] Verify interactive chrome (.app-header, .profile-bar, .domain-tabs-bar, .filter-toolbar, .drawer-panel) is hidden in print mode while #tab-panel-report expands to 100% width.
- **Expected Result**: Print/PDF output cleanly suppresses interactive toolbars and drawers, rendering a crisp executive report table.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D12: Security Sanitization, Privacy Masking & Audit Trail

_Stored/reflected XSS neutralization, SQL/NoSQL injection defense, CSRF protection, PII/secret masking in UI and URLs, and immutable audit logs._

#### `D12-01` — Stored & Reflected XSS Payload Neutralization in Titles, Notes & Search (`P0` · `Security / Resilience`)
- **Feature Area**: Security / XSS Defense
- **Preconditions**: Form inputs and search query parameters available.
- **Test Data / Payload**: `"<img src=x onerror=window.__xss_triggered=true><script>alert(1)</script>"`
- **Step-by-Step Procedure**:
  1. [ ] Paste "<img src=x onerror=window.__xss_triggered=true>" into Actual Result notes, Defect ID, and Search.
  2. [ ] Save the record and view it in both the table and the Executive Readout tab.
- **Expected Result**: HTML entities (<, >, ", ', &) are strictly escaped on render; window.__xss_triggered remains undefined; payload displays harmlessly as literal text.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D12-02` — SQL / NoSQL Injection Payload Resilience in API Endpoints (`P0` · `Security / Resilience`)
- **Feature Area**: Security / Injection Defense
- **Preconditions**: API endpoints accepting string filters or updates.
- **Test Data / Payload**: `"' OR '1'='1' --" and "{\"$ne\": null}"`
- **Step-by-Step Procedure**:
  1. [ ] Submit SQLi ("' OR 1=1 --") and NoSQLi ("{\"$gt\": \"\"}") payloads in search, login, and record update fields.
  2. [ ] Verify backend response and data integrity.
- **Expected Result**: Payloads are treated strictly as literal parameter values; zero unauthorized records returned and zero database syntax errors leaked.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D12-03` — Immutable Execution Audit Trail (Tester, Timestamp, Old->New Status & Evidence) (`P1` · `Common Workflow`)
- **Feature Area**: Audit & Compliance
- **Preconditions**: Tester executes status updates.
- **Test Data / Payload**: `Update D01-01 status -> Inspect Tab 3 Audit & Provenance Log`
- **Step-by-Step Procedure**:
  1. [ ] Update the status and notes of any test case.
  2. [ ] Switch to Tab 3 ("3. Execution Audit & Provenance Log").
  3. [ ] Verify the chronological audit entry records timestamp, test ID, previous status, new status, tester, and notes.
- **Expected Result**: Every manual or assisted execution event appends a timestamped record to the Execution Audit Log and persists to disk.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

### D13: Product IA, Essential Pages & 4-Workflow Optimization (Business/User/Tech/Ops)

_Right number of pages, tabs, links & buttons, Landing/Homepage/Onboarding/User Guide/About Us/Contact Us completeness, and Business, User, Technical & Operational workflow optimization._

#### `D13-01` — Landing Page & Homepage Command Center Completeness (Value Prop, Above-the-Fold KPIs & Primary CTA) (`P0` · `Common Workflow`)
- **Feature Area**: Product IA / Landing & Homepage
- **Preconditions**: Application root route (/) loaded in browser.
- **Test Data / Payload**: `First KPI/Workspace card top Y <= 220px | Clear Brand Title & Primary Action`
- **Step-by-Step Procedure**:
  1. [ ] Navigate to the root entry URL (/) and inspect the brand header, value proposition subtitle, and primary action buttons.
  2. [ ] Measure the vertical Y offset of the primary KPI telemetry strip / workspace content (must start at Y <= 220px without marketing banner bloat per Rule 25C).
  3. [ ] Verify the Homepage / Command Center immediately surfaces live actionable metrics and entry points.
- **Expected Result**: Root landing/homepage clearly communicates application purpose, surfaces live KPI cards above the fold (Y <= 220px), and provides an immediate primary CTA without hero bloat.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-02` — Right Number of Pages & Workspace Tabs (Cognitive Load Bounds 2..10 & Single Navigation Rail — Rule 25A) (`P0` · `Common Workflow`)
- **Feature Area**: Product IA / Pages & Tabs Budget
- **Preconditions**: Workspace navigation and sub-views rendered.
- **Test Data / Payload**: `Primary Nav Rails == 1 | Workspace Tabs: 2 <= N <= 10 | Domain Sub-Tabs <= 15`
- **Step-by-Step Procedure**:
  1. [ ] Count all primary navigation rails (<nav class="workspace-tabs">) and verify exactly 1 primary workspace tab bar exists (zero duplicate navigation bars).
  2. [ ] Verify top-level workspace tabs (N = 4: Matrix, Executive Readout, Audit Log, IA & 4-Workflow Optimizer) fall within optimal Miller-Law cognitive bounds (2 <= N <= 7).
  3. [ ] Click through each workspace tab and verify every view renders distinct, non-overlapping functional content.
- **Expected Result**: Exactly 1 primary navigation rail with 4 focused workspace views and 13 domain filter pills; zero duplicate tab bars or orphan routes.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-03` — Right Number of Links & Buttons: Zero Dead Anchors, Zero Duplicate Sibling CTAs & Dropdown Consolidation (Rule 25B-25E) (`P0` · `Common Workflow`)
- **Feature Area**: Product IA / Links & Buttons Hygiene
- **Preconditions**: All header, toolbar, table, and drawer controls rendered.
- **Test Data / Payload**: `Dead href="#" links == 0 | Unlabeled buttons == 0 | Duplicate sibling CTAs == 0`
- **Step-by-Step Procedure**:
  1. [ ] Scan all <a href> elements across the DOM and verify zero dead placeholders (href="#", href="", or javascript:void(0)).
  2. [ ] Scan all <button> elements and verify 100% have accessible labels, ergonomic hit targets (>= 24px), and zero adjacent duplicate action labels.
  3. [ ] Verify secondary export utilities (Markdown, CSV, JSON, Print/PDF) are consolidated into a single clean dropdown ("📥 Export & Reports ▾").
- **Expected Result**: 100% of links and buttons are wired, labeled, and deduplicated; secondary utilities are consolidated into a single dropdown menu.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-04` — User Onboarding & First-Run Guided Quick-Start Experience (Zero Blank-Screen Dead End) (`P0` · `Common Workflow`)
- **Feature Area**: User Experience / Onboarding
- **Preconditions**: New user or fresh session opens the application.
- **Test Data / Payload**: `Interactive 4-Step Onboarding Checklist + Pre-Loaded 13-Domain / 70-Test Template`
- **Step-by-Step Procedure**:
  1. [ ] Click "📖 Guide · Onboarding · About · Contact" (#open-hub-guide-btn) in the top header or switch to Tab 4.
  2. [ ] Inspect the interactive User Onboarding & Quick-Start checklist (Step 1: Configure Target URL -> Step 2: Run Headless Chrome -> Step 3: Inspect & Log Evidence -> Step 4: Export Signed Report).
  3. [ ] Verify the workspace pre-loads a complete, actionable 70-test-case template so a new user never lands on an empty blank page.
- **Expected Result**: User Onboarding provides a clear 4-step guided workflow with interactive jump buttons and pre-populated baseline data.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-05` — Interactive User Guide & Standard Operating Procedure (SOP) Documentation Surface (`P1` · `Common Workflow`)
- **Feature Area**: User Experience / User Guide
- **Preconditions**: User Guide & Documentation panel accessible from header or Tab 4.
- **Test Data / Payload**: `In-App User Guide with keyboard shortcuts, CLI commands, API reference & SOP steps`
- **Step-by-Step Procedure**:
  1. [ ] Open the User Guide section via "📖 Guide · Onboarding · About · Contact" or Tab 4.
  2. [ ] Verify comprehensive documentation covering Manual Execution, Background Headless Chrome (Puppeteer/CDP) Automation, Screenshot Storage Paths, Keyboard Shortcuts (Esc), and CLI Quality Gates.
  3. [ ] Verify copyable commands and clear visual hierarchy.
- **Expected Result**: Complete, scannable in-app User Guide is accessible in 1 click without leaving the workspace.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-06` — About Us (System Architecture & Version Provenance) & Contact Us / Support Feedback Channel (Rule 58) (`P1` · `Common Workflow`)
- **Feature Area**: Product Completeness / About & Contact Us
- **Preconditions**: About Us and Contact Us / Give Feedback surfaces rendered.
- **Test Data / Payload**: `About Us: Version v1.1.0 + Architecture Stack | Contact Us: Support & Feedback Form`
- **Step-by-Step Procedure**:
  1. [ ] Inspect the "About Us & System Architecture" card/drawer section and verify version provenance, 13-domain taxonomy summary, and zero-dependency Node.js + CDP Pipe architecture details.
  2. [ ] Inspect the "Contact Us / Support & Feedback" surface (#contact-support-card / feedback form) and submit a test feedback/support message.
  3. [ ] Verify the feedback submission is persisted and confirmed via a non-blocking toast notification.
- **Expected Result**: Both About Us (version, architecture, governance) and Contact Us / Support Feedback (interactive message submission + escalation contact) are present and functional.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-07` — Business Workflow Optimization Audit (Value Realization, KPI Telemetry & Release Sign-Off Governance) (`P0` · `Common Workflow`)
- **Feature Area**: Workflow Optimization / Business Pillar
- **Preconditions**: Business KPI strip, domain coverage rollup, and Release Sign-Off Gate active.
- **Test Data / Payload**: `Business Score >= 95% | Live Pass/Fail/Blocker Gate (READY / HOLD / APPROVED)`
- **Step-by-Step Procedure**:
  1. [ ] Verify the 6-card Executive KPI strip computes real-time Pass Rate %, Execution Progress %, P0 Blocker count, and deterministic Release Sign-Off Gate status.
  2. [ ] Switch to Tab 2 ("2. Executive Readout & Defect Report") and verify the Open Defect Register and 13-Domain Coverage Matrix provide immediate executive decision readiness.
- **Expected Result**: Business workflow translates raw test executions into an instant go/no-go release decision with 100% mathematical parity across cards, tables, and exports.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-08` — User Workflow Optimization Audit (<= 3-Click Task Depth, Non-Blocking Context & Frictionless Recovery) (`P0` · `Common Workflow`)
- **Feature Area**: Workflow Optimization / User Pillar
- **Preconditions**: Main test runner matrix and right-side inspector drawer active.
- **Test Data / Payload**: `Quick Verdict = 1 click | Headless Run = 1 click | Drawer Inspect & Save = 2 clicks`
- **Step-by-Step Procedure**:
  1. [ ] Measure the click depth required for core user journeys: (a) 1-click inline Pass/Fail/Block/Skip verdict; (b) 1-click per-row Headless Chrome execution; (c) 2-click drawer inspection + payload copy.
  2. [ ] Verify zero thread-blocking popups and 1-click empty-state filter recovery.
- **Expected Result**: 100% of core user tasks complete in 1 to 2 clicks (strictly <= 3 clicks) with zero page reloads and zero modal context loss.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-09` — Technical Workflow Optimization Audit (Latency, Zero Runtime Errors, Fluid Geometry & Security) (`P0` · `Common Workflow`)
- **Feature Area**: Workflow Optimization / Technical Pillar
- **Preconditions**: Backend server and Headless Chrome CDP probe active.
- **Test Data / Payload**: `HTTP 200 latency < 250ms | 0 pageExceptions | 0 consoleErrors | 0px overflow on 1600/834/390`
- **Step-by-Step Procedure**:
  1. [ ] Execute the Technical Workflow probe and verify HTTP 200 response latency (< 250ms local), Cache-Control: no-store headers, and atomic JSON state persistence.
  2. [ ] Verify zero uncaught pageerror exceptions, zero console.error logs, and 0px horizontal overflow across Desktop, Tablet, and Mobile.
- **Expected Result**: Technical workflow achieves sub-250ms local response times, zero runtime exceptions, 100% multi-viewport fluidity, and strict XSS/CSV sanitization.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`

#### `D13-10` — Operational Workflow Optimization Audit (Health Probes, SHA-256 Evidence Manifest & Audit Provenance) (`P0` · `Common Workflow`)
- **Feature Area**: Workflow Optimization / Operational Pillar
- **Preconditions**: Audit log, evidence manifest, and multi-format exports active.
- **Test Data / Payload**: `GET /api/evidence/manifest (SHA-256) + Tab 3 Audit Log + .md/.csv/.json exports`
- **Step-by-Step Procedure**:
  1. [ ] Verify live target health probing (⚡ Assisted URL Probe), automated Headless Chrome screenshot archiving per workflow folder, and SHA-256 manifest indexing.
  2. [ ] Verify chronological mutation tracking in Tab 3 (Execution Audit Log) and 1-click export of Markdown, CSV, JSON, and Print/PDF reports.
- **Expected Result**: Operational workflow guarantees end-to-end observability, cryptographic screenshot evidence tracking, immutable audit trails, and portable compliance exports.
- **Execution Result**: `[ ] PASS` | `[ ] FAIL` | `[ ] BLOCKED` | `[ ] SKIPPED` — **Defect ID**: `_______` — **Notes**: `_______________________`
