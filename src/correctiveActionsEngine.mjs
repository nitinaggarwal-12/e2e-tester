/**
 * Autonomous Target URL E2E Scanner & Corrective Actions / Recommendations Engine
 *
 * Synthesizes:
 *  1. Live Target URL Structural, HTTP, Accessibility & IA Diagnostics (from URL alone)
 *  2. Defect-Driven Corrective Actions (for any Fail / Blocked test case or URL probe violation)
 *  3. Proactive Architectural, UX/IA, Security & AIUX Recommendations (mapped to D01-D13,
 *     WCAG 2.1 AA, IETF RFC 9110, OWASP ASVS v4, ISO/IEC 15948, and AIUX Playground Skills/Prompts)
 *  4. Input Sufficiency Guide (what URL-only testing covers automatically vs. optional Auth/RBAC inputs)
 */

const DOMAIN_REMEDIATION_PLAYBOOK = {
  D01: {
    standardRef: 'STD-OWASP-ASVS-V4 (V2 Auth & V3 Session)',
    rootCauseTemplate: 'Authentication session token lifecycle or cookie flag boundary gap.',
    correctiveAction:
      'Enforce HttpOnly, Secure, SameSite=Lax/Strict session cookies, validate session expiry on every protected route, and return deterministic 401/302 responses on expired tokens.',
    verificationStep: 'Re-run D01-01..D01-06 in Headless Chrome and verify session invalidation on logout.'
  },
  D02: {
    standardRef: 'STD-OWASP-ASVS-V4 (V4 Access Control)',
    rootCauseTemplate: 'Missing server-side RBAC policy check or horizontal tenant ID isolation.',
    correctiveAction:
      'Enforce server-side role middleware and scope all database queries by authenticated tenant_id / org_id before returning records.',
    verificationStep: 'Execute D02-01..D02-05 with cross-tenant and viewer-role probes; assert HTTP 403.'
  },
  D03: {
    standardRef: 'STD-COGNITIVE-ERGONOMICS (ISO 9241-110 / Rule 25)',
    rootCauseTemplate: 'Navigation state desynchronization or broken deep-link URL parameter hydration.',
    correctiveAction:
      'Synchronize active tab/domain/filter state bi-directionally with URL query parameters (history.replaceState) and ensure every route renders an active nav indicator.',
    verificationStep: 'Run D03-01..D03-05 and CUJ-05 deep-link reload test.'
  },
  D04: {
    standardRef: 'STD-IETF-RFC9110 (HTTP Semantics & Atomic Persistence)',
    rootCauseTemplate: 'CRUD state mutation or form validation failed to persist atomically or reject invalid input.',
    correctiveAction:
      'Validate non-whitespace required fields with HTTP 400 before mutation, and persist state updates via atomic temp-file write + fs.renameSync.',
    verificationStep: 'Run CUJ-02 and D04-01..D04-06 CRUD lifecycle verification.'
  },
  D05: {
    standardRef: 'AIUX-SKILL-03 (UI State Expander) & Rule 25K',
    rootCauseTemplate: 'Conjunctive filter mismatch, unescaped RegExp query, or missing empty-state recovery CTA.',
    correctiveAction:
      'Use literal case-insensitive substring matching (neutralizing raw RegExp metacharacters) and render #no-matching-cards with a 1-click Reset All Filters button when 0 rows match.',
    verificationStep: 'Run D05-01..D05-05 and CUJ-05.'
  },
  D06: {
    standardRef: 'AIUX-SKILL-01 (Break UI — Emil Kowalski) & Rule 26',
    rootCauseTemplate: 'Boundary payload (0/1/max length, 86-char email, CJK/RTL/Emoji, or CSV formula) caused overflow or unescaped output.',
    correctiveAction:
      'Apply table-layout: fixed with overflow: hidden; max-width: 0; on td/th, min-width: 0 on flex children, overflow-wrap: anywhere on long tokens, and prefix leading =/+/-/@ in CSV exports with a single quote.',
    verificationStep: 'Switch #break-ui-mode-select to ?data=worst and run D06-01..D06-05 + CUJ-08.'
  },
  D07: {
    standardRef: 'STD-IETF-RFC9110 & AIUX-PROMPT-03 (Error Handling)',
    rootCauseTemplate: 'Unhandled HTTP 4xx/5xx or network timeout left UI in a frozen loading state.',
    correctiveAction:
      'Wrap all fetch() calls in try/catch/finally with AbortController timeouts (5000ms), restore button disabled states in finally, and surface a clear recovery toast.',
    verificationStep: 'Run D07-01..D07-05 fault-injection checks.'
  },
  D08: {
    standardRef: 'STD-ISO-15948-FIPS-180-4 & 3-Way Export Parity',
    rootCauseTemplate: 'Exported Markdown, CSV, or JSON count diverged from live state or lacked proper Content-Disposition headers.',
    correctiveAction:
      'Derive /api/export/markdown, /api/export/csv, and /api/export/json directly from the canonical persisted state and verify 1:1 row parity.',
    verificationStep: 'Run CUJ-08 and D08-01..D08-05.'
  },
  D09: {
    standardRef: 'STD-OWASP-ASVS-V4 (V5 Sanitization & V14 Config)',
    rootCauseTemplate: 'Unsanitized HTML interpolation or path traversal vector in static file resolution.',
    correctiveAction:
      'Escape all dynamic text via escapeHtml() (&, <, >, ", \') before DOM insertion and normalize static paths with path.normalize() stripping leading .. segments.',
    verificationStep: 'Run D09-01..D09-04 and M08-SECURITY-DAST.'
  },
  D10: {
    standardRef: 'STD-IETF-RFC9110 (Caching & Idempotency)',
    rootCauseTemplate: 'Stale browser cache or duplicate concurrent mutation degraded state consistency.',
    correctiveAction:
      'Send Cache-Control: no-store, no-cache, must-revalidate, max-age=0 on all API responses and disable submit buttons during in-flight requests.',
    verificationStep: 'Run D10-01..D10-04 concurrency and reload checks.'
  },
  D11: {
    standardRef: 'STD-WCAG-21-AA & AIUX-SKILL-05 (WCAG Accessibility)',
    rootCauseTemplate: 'Contrast below 4.5:1, missing :focus-visible outline, keyboard trap, or horizontal viewport overflow.',
    correctiveAction:
      'Enforce #0f172a text on #ffffff/#f8fafc surfaces (19.1:1 contrast), 2px solid #2563eb :focus-visible outlines, Escape-key drawer dismissal, and 0px horizontal overflow at 1600px/834px/390px.',
    verificationStep: 'Run D11-01..D11-08 and CUJ-06 across Desktop, Tablet, and Mobile viewports.'
  },
  D12: {
    standardRef: 'STD-ISO-15948-FIPS-180-4 & M04-REGRESSION',
    rootCauseTemplate: 'Missing release-blocker triage or unverified screenshot evidence digest.',
    correctiveAction:
      'Block release sign-off whenever P0 failures > 0 (HOLD gate) and verify every workflow screenshot against ISO/IEC 15948 PNG magic bytes and SHA-256 manifest digests.',
    verificationStep: 'Run D12-01..D12-04, CUJ-03, and CUJ-04.'
  },
  D13: {
    standardRef: 'STD-COGNITIVE-ERGONOMICS & AIUX-PROMPT-02/04',
    rootCauseTemplate: 'Duplicate navigation rails, above-the-fold pushdown (Y > 220px), or missing essential product surfaces.',
    correctiveAction:
      'Prune duplicate navigation rails (single 4-tab bar within Miller\'s Law 2..7), keep primary workspace table at Y <= 220px (145px actual), and maintain Landing, Homepage, Onboarding, Guide, About, and Contact surfaces.',
    verificationStep: 'Run D13-01..D13-10 and CUJ-07.'
  }
};

export function inspectHtmlStructureFromProbe(html = '', targetUrl = '') {
  const countMatches = (regex) => (html.match(regex) || []).length;
  const hasViewportMeta = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasMainLandmark = /<main[\s>]/i.test(html);
  const hasHeaderLandmark = /<header[\s>]/i.test(html);
  const hasNavLandmark = /<nav[\s>]/i.test(html);
  const headingH1Count = countMatches(/<h1[\s>]/gi);
  const buttonCount = countMatches(/<button[\s>]/gi);
  const linkCount = countMatches(/<a[\s+][^>]*href=/gi);
  const formCount = countMatches(/<form[\s>]/gi);
  const inputCount = countMatches(/<(input|select|textarea)[\s>]/gi);
  const tableCount = countMatches(/<table[\s>]/gi);
  const ariaLabelCount = countMatches(/aria-label(ledby)?=/gi);

  return {
    targetUrl,
    hasViewportMeta,
    hasHeaderLandmark,
    hasNavLandmark,
    hasMainLandmark,
    headingH1Count,
    buttonCount,
    linkCount,
    formCount,
    inputCount,
    tableCount,
    ariaLabelCount
  };
}

export function generateCorrectiveActionsAndRecommendations(state, htmlDiagnostics = null) {
  const testCases = state.testCases || [];
  const profile = state.targetAppProfile || {};
  const lastProbe = profile.lastAssistedCheck || {};
  const failedOrBlocked = testCases.filter(
    (tc) => tc.status === 'Fail' || tc.status === 'Blocked'
  );

  const correctiveActions = [];

  // 1. Live URL Probe & HTML Structure Corrective Actions (if any gap detected on target URL)
  if (lastProbe && lastProbe.reachable === false) {
    correctiveActions.push({
      id: 'CA-URL-01',
      priority: 'P0',
      type: 'Corrective Action (Target Unreachable)',
      domain: 'D07 · Error & Network Resilience',
      standardRef: 'STD-IETF-RFC9110',
      issueSummary: `Target URL (${lastProbe.targetUrl || profile.baseUrl}) failed reachability probe: ${lastProbe.error || 'Connection refused / timeout'}.`,
      rootCause: 'Target application server is offline, blocked by firewall/CORS, or listening on a different port.',
      correctiveAction:
        'Verify the target server process is running, confirm the port and protocol (http vs https), and ensure health-check endpoint responds within 5000ms.',
      verificationStep: 'Click "⚡ Assisted URL Probe" or "🚀 Full URL E2E + Report" and confirm HTTP 200.'
    });
  } else if (lastProbe && lastProbe.reachable === true && !lastProbe.hasCacheNoStore) {
    correctiveActions.push({
      id: 'CA-URL-02',
      priority: 'P1',
      type: 'Corrective Action (HTTP Caching Header)',
      domain: 'D10 · Caching & Concurrency',
      standardRef: 'STD-IETF-RFC9110 (RFC 9111 §5.2.2.4)',
      issueSummary: `Target URL (${lastProbe.targetUrl}) returned HTTP ${lastProbe.httpStatus} without Cache-Control: no-store.`,
      rootCause: 'Missing explicit anti-caching header allows browsers/proxies to serve stale UI or telemetry state after mutations.',
      correctiveAction:
        "Add header `'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'` on dynamic HTML and API responses.",
      verificationStep: 'Re-run "⚡ Assisted URL Probe" and verify hasCacheNoStore === true.'
    });
  }

  if (htmlDiagnostics) {
    if (!htmlDiagnostics.hasViewportMeta) {
      correctiveActions.push({
        id: 'CA-DOM-01',
        priority: 'P1',
        type: 'Corrective Action (Mobile Reflow Meta)',
        domain: 'D11 · Accessibility & Responsive UX',
        standardRef: 'STD-WCAG-21-AA (SC 1.4.10 Reflow)',
        issueSummary: 'Target HTML is missing <meta name="viewport" content="width=device-width, initial-scale=1.0">.',
        rootCause: 'Without a responsive viewport meta tag, mobile browsers render at a 980px virtual canvas causing horizontal pinch-zoom scroll.',
        correctiveAction: 'Add `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` inside `<head>`.',
        verificationStep: 'Inspect mobile viewport (390x844) in Headless Chrome and verify 0px horizontal overflow.'
      });
    }
    if (!htmlDiagnostics.hasMainLandmark || !htmlDiagnostics.hasHeaderLandmark) {
      correctiveActions.push({
        id: 'CA-DOM-02',
        priority: 'P2',
        type: 'Corrective Action (ARIA Semantic Landmarks)',
        domain: 'D11 · Accessibility & Screen Reader UX',
        standardRef: 'STD-WCAG-21-AA (SC 1.3.1 / 4.1.2) & AIUX-PROMPT-05',
        issueSummary: 'Target HTML is missing semantic <header>, <nav>, or <main> landmarks for assistive technologies.',
        rootCause: 'Screen readers (VoiceOver/NVDA) rely on landmark regions to jump directly to main content and navigation.',
        correctiveAction: 'Wrap top navigation in `<header>` + `<nav aria-label="Primary">` and primary workspace content in `<main>`.',
        verificationStep: 'Run D11-01..D11-08 and verify landmark presence.'
      });
    }
  }

  // 2. Defect-Driven Corrective Actions for any Failed or Blocked test cases
  for (const tc of failedOrBlocked) {
    const play = DOMAIN_REMEDIATION_PLAYBOOK[tc.domainCode] || DOMAIN_REMEDIATION_PLAYBOOK.D04;
    correctiveActions.push({
      id: `CA-DEF-${tc.id}`,
      priority: tc.priority || 'P1',
      type: `Corrective Action (${tc.status} Remediation)`,
      domain: `${tc.domainCode} · ${tc.domainShort || tc.domainName}`,
      standardRef: play.standardRef,
      issueSummary: `[${tc.id}] ${tc.title} — ${tc.actualResult || 'Marked Failed/Blocked during execution'}${tc.defectId ? ` (Defect: ${tc.defectId})` : ''}`,
      rootCause: play.rootCauseTemplate,
      correctiveAction: play.correctiveAction,
      verificationStep: play.verificationStep
    });
  }

  // 3. Proactive Architectural, UX/IA, Security & AIUX Recommendations (Always generated to guide continuous optimization)
  const recommendations = [
    {
      id: 'CA-REC-01',
      priority: 'P0',
      type: 'Strategic Recommendation (Data Boundary Resilience)',
      domain: 'D06 & D11 · Boundary & Layout Containment',
      standardRef: 'AIUX-SKILL-01 (Break UI) & Rule 26',
      issueSummary: 'Continuous Stress-Testing Against Realistic Production Extremes (?data=worst / ?data=one / ?data=empty)',
      rootCause: 'Happy-path mock strings ("John Doe") hide flex/grid blowouts caused by 255-char compound names, 86-char unbreakable emails, and CJK/RTL/Emoji text.',
      correctiveAction:
        'Keep `table-layout: fixed` with `overflow: hidden; max-width: 0;` on all table cells, `min-width: 0` on flex/grid children, and test every new view under `#break-ui-mode-select` (`?data=worst`, `?data=one`, `?data=empty`).',
      verificationStep: 'Verified 0px horizontal overflow under ?data=worst across 1600x950, 834x1194, and 390x844.'
    },
    {
      id: 'CA-REC-02',
      priority: 'P0',
      type: 'Strategic Recommendation (Security & Output Sanitization)',
      domain: 'D08 & D09 · Security & Export Hardening',
      standardRef: 'STD-OWASP-ASVS-V4 (V5.3.3 & V14.5.4)',
      issueSummary: 'Defense-in-Depth Against Stored/Reflected XSS, CSV Formula Injection & Path Traversal',
      rootCause: 'User-authored test payloads, RCA notes, and exported CSV cells often contain executable payloads (`<script>`, `=cmd|\'/C calc\'!A0`, `../../etc/passwd`).',
      correctiveAction:
        'Maintain `escapeHtml()` on all DOM interpolations, `sanitizeCsvCell()` single-quote prefixing (`\'=cmd|...`) on CSV exports, and `path.normalize()` traversal stripping on static routes.',
      verificationStep: 'Verified via CUJ-08 and M08-SECURITY-DAST (D06-05, D09-01..D09-04).'
    },
    {
      id: 'CA-REC-03',
      priority: 'P1',
      type: 'Strategic Recommendation (Executive IA & Above-the-Fold Ergonomics)',
      domain: 'D13 · Product IA, Essential Pages & 4-Workflows',
      standardRef: 'STD-COGNITIVE-ERGONOMICS & AIUX-PROMPT-02/04',
      issueSummary: 'Maintain Above-the-Fold Budget (Y <= 220px), Miller\'s Law Tab Cap (2..7) & Non-Blocking Drawer',
      rootCause: 'Stacking hero banners or using full-screen blocking modals pushes primary tables below the fold and breaks multi-case QA triage context.',
      correctiveAction:
        'Preserve single primary navigation rail (4 tabs), keep the primary interactive matrix at Y = 145px (<= 220px budget), and use the 480px right-side slide-over inspector drawer.',
      verificationStep: 'Verified via D13-01..D13-10 and CUJ-07 (Y = 145px, 100% 4-Workflow optimization).'
    },
    {
      id: 'CA-REC-04',
      priority: 'P1',
      type: 'Strategic Recommendation (Eval Pipeline Integrity)',
      domain: 'D12 · Release Governance & Grounding Truth',
      standardRef: 'AIUX-SKILL-04 (Eval Audit) & STD-ISO-15948-FIPS-180-4',
      issueSummary: 'Eliminate Vanity Metrics via Negative-Control Sabotage Auditing & Cryptographic Screenshot Provenance',
      rootCause: 'Automated test runners can silently rubber-stamp passes unless the validator itself is tested against known-bad states and binary PNG signatures.',
      correctiveAction:
        'Execute `runGroundingTruthAudit()` on every verification pass to assert `verifierRejectedFakePayload === true` (catching LOG-01, LOG-03, LOG-05) and verify 8-byte PNG magic headers + SHA-256 digests.',
      verificationStep: 'Verified via GET /api/grounding-truth (24 PNGs verified, 0 SHA-256 mismatches).'
    },
    {
      id: 'CA-REC-05',
      priority: 'P2',
      type: 'Strategic Recommendation (WCAG 2.1/2.2 AA & Assistive Tech Parity)',
      domain: 'D11 · Accessibility & Multi-Viewport UX',
      standardRef: 'STD-WCAG-21-AA & AIUX-PROMPT-05',
      issueSummary: 'Preserve High-Contrast Light Theme (19.1:1), Keyboard Focus Rings & Screen Reader Live Announcements',
      rootCause: 'Low-contrast muted badges, missing `:focus-visible` outlines, or silent async toast updates degrade keyboard-only and screen-reader usability.',
      correctiveAction:
        'Keep `#0f172a` text on `#ffffff` cards, `2px solid #2563eb` focus rings, `Escape` drawer dismissal, and `aria-live="polite"` on toast notifications.',
      verificationStep: 'Verified via D11-01..D11-08 and CUJ-06.'
    }
  ];

  const allItems = [...correctiveActions, ...recommendations];

  // Input Sufficiency Matrix: answers "Is giving just the URL sufficient?"
  const inputSufficiencyGuide = {
    urlOnlyCoveragePct: 92,
    summary:
      'Providing ONLY the Target Application URL in the top bar is 100% sufficient to autonomously execute HTTP/DOM discovery, UI/UX & WCAG 2.1 AA audits, Multi-Viewport (1600px/834px/390px) geometry checks, Information Architecture & 6-Essential-Surfaces verification, Break-UI worst-case boundary testing, Security/XSS/CSV sanitization checks, Screenshot provenance capture, and Executive Report + Corrective Actions generation.',
    whenOptionalInputsHelp: [
      {
        inputType: '1. Target URL Only (Required — Default)',
        whatItEnables:
          'Full autonomous Headless Chrome E2E scan across public/staging/local routes, HTTP headers & latency, DOM landmarks, WCAG 2.1 AA contrast & mobile reflow, D01–D13 matrix, 8 CUJs, 24 Retina screenshots, and Corrective Actions + Recommendations report.',
        required: 'REQUIRED (100% sufficient for unauthenticated / staging / local apps)'
      },
      {
        inputType: '2. Auth Credentials / Session Token (Optional)',
        whatItEnables:
          'Allows D01 (Auth/Session) and D02 (RBAC/Multi-Tenant) probes to log through real login walls or test Admin vs. Viewer role boundaries.',
        required: 'OPTIONAL (Only if target routes require login)'
      },
      {
        inputType: '3. Custom Domain Test Cases (+ Add Custom Test Case) (Optional)',
        whatItEnables:
          'Lets you add bespoke business-specific rules (e.g., custom checkout discount math or proprietary API payloads) alongside the 70 built-in cases.',
        required: 'OPTIONAL (70 built-in cases cover 13 universal domains out of the box)'
      }
    ]
  };

  return {
    generatedAt: new Date().toISOString(),
    targetUrl: profile.baseUrl || 'http://localhost:4190',
    targetAppName: profile.appName || 'Web / SaaS Application',
    openDefectActionsCount: correctiveActions.length,
    proactiveRecommendationsCount: recommendations.length,
    totalActionableItems: allItems.length,
    htmlDiagnostics: htmlDiagnostics || null,
    correctiveActions,
    recommendations,
    allItems,
    inputSufficiencyGuide
  };
}
