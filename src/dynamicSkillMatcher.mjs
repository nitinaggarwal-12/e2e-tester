/**
 * Multi-Repository Dynamic Skill & Prompt Discovery + App-Context Matcher Engine
 *
 * Stores and queries the 3 canonical external repositories:
 *  1. https://github.com/google/skills (21.5k★ — Official Agent Skills for Google Cloud, AI/ML, WAF, Security, Databases, Cloud Run)
 *  2. https://aiuxplayground.com/skills (182 Persistent UI/UX, Browser QA, Break-UI, Accessibility & Eval Skills)
 *  3. https://aiuxplayground.com/prompts (177 Structured QA, UX Architecture, Completeness & Accessibility Prompts)
 *
 * CRITICAL ANTI-FORCE-FIT INVARIANT:
 *  Never force-fit irrelevant skills onto a target app. The matcher fingerprints the target app
 *  (via URL, HTML DOM structure, forms/tables/landmarks, and selected App Archetype), selects ONLY
 *  the highest-relevance, most popular, and latest skills/prompts for that specific app, and
 *  explicitly records rejected/unfit skills in `excludedMisfitSkills` with exact rationale.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const EXTERNAL_REPOS_CATALOG_PATH = path.join(
  __dirname,
  '..',
  'data',
  'external_skill_repos_catalog.json'
);

export const EXTERNAL_SKILL_REPOSITORIES = [
  {
    repoId: 'REPO-GOOGLE-SKILLS',
    name: 'google/skills (Official Google & Google Cloud Agent Skills)',
    url: 'https://github.com/google/skills',
    installCmd: 'npx skills add google/skills',
    stars: '21.5k★',
    forks: '1.8k',
    totalItems: 124,
    license: 'Apache-2.0',
    categories: [
      'Getting started & IAM',
      'Multi-product solution skills',
      'AI/ML & Agent Platform',
      'Infrastructure & GKE',
      'Databases & Analytics (BigQuery, AlloyDB, Spanner, Cloud SQL)',
      'Developer tools & Cloud Build',
      'Management, Logging, Monitoring & Trace',
      'Well-Architected Framework (6 Pillars)',
      'Security, Identity (DPoP, SiwG, Apigee, SCC, SecOps)',
      'Web & App Hosting (Cloud Run, Firebase)',
      'Advertising & Google Analytics'
    ]
  },
  {
    repoId: 'REPO-AIUX-SKILLS',
    name: 'AI UX Playground — Persistent Agent Skills Directory',
    url: 'https://aiuxplayground.com/skills',
    installCmd: 'SKILL.md -> ~/.claude/skills/ or .agents/skills/',
    stars: 'Curated Top OSS (10.8k★ gstack, 4.2k★ Agent Browser)',
    forks: 'Community Verified',
    totalItems: 182,
    license: 'MIT / Open Skills',
    categories: [
      'Prototyping & Testing (27)',
      'AI Workflows (34)',
      'Design Systems (26)',
      'Visual Design (29)',
      'Engineering (22)',
      'UX Research (14)',
      'Content & Copy (13)',
      'Accessibility (7)',
      'Design Review (6)',
      'Analytics (4)'
    ]
  },
  {
    repoId: 'REPO-AIUX-PROMPTS',
    name: 'AI UX Playground — Structured QA, UX & Architecture Prompts',
    url: 'https://aiuxplayground.com/prompts',
    installCmd: 'Direct Prompt Execution / Harness Template',
    stars: '177 Curated Prompts',
    forks: '10 Categories',
    totalItems: 177,
    license: 'Open Prompts',
    categories: [
      'UX Research (28)',
      'AI Workflows (24)',
      'Design Systems (20)',
      'Accessibility (19)',
      'Design Review (17)',
      'Visual Design (17)',
      'Prototyping & Testing (16)',
      'Content & Copy (16)',
      'Analytics (12)',
      'Engineering (8)'
    ]
  }
];

export const APP_ARCHETYPES = [
  {
    code: 'auto',
    label: '✨ Auto-Detect from Target URL & Live DOM Fingerprint'
  },
  {
    code: 'web-saas-dashboard',
    label: '🖥️ Web / SaaS Dashboard, Data Tables & CRUD Portal'
  },
  {
    code: 'ai-agent-llm-rag',
    label: '🤖 AI Agent, LLM, RAG, Genkit or MCP Gateway App'
  },
  {
    code: 'cloud-api-serverless',
    label: '☁️ Cloud Run, Serverless Web App & REST API Service'
  },
  {
    code: 'data-analytics-bigquery',
    label: '📊 BigQuery, AlloyDB, Spanner & Data Analytics Pipeline App'
  },
  {
    code: 'auth-identity-zerotrust',
    label: '🔐 Identity, OAuth/DPoP, RBAC & High-Security Enterprise App'
  }
];

export const CURATED_MULTI_REPO_SKILLS_POOL = [
  // ================= REPO 1: https://github.com/google/skills =================
  {
    id: 'GSKILL-WAF-OPEX',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'Google Cloud Well-Architected Framework: Operational Excellence & Reliability',
    url: 'https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-operational-excellence',
    installCmd: 'npx skills add google/skills --skill google-cloud-waf-operational-excellence',
    popularity: '21.5k★ Repo · Core WAF Pillar',
    popularityScore: 98,
    recencyScore: 96,
    archetypes: ['web-saas-dashboard', 'cloud-api-serverless', 'ai-agent-llm-rag', 'data-analytics-bigquery', 'auth-identity-zerotrust'],
    domains: ['D07', 'D10', 'D12', 'D13'],
    whyItFits: 'Audits operational readiness, automated regression gates, observability, and incident recovery across web & cloud apps.',
    neverForceFitWhen: 'Never excluded for production web/cloud apps; foundational operational gate.'
  },
  {
    id: 'GSKILL-WAF-SEC',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'Google Cloud Well-Architected Framework: Security & Compliance Pillar',
    url: 'https://github.com/google/skills/blob/main/skills/cloud/google-cloud-waf-security',
    installCmd: 'npx skills add google/skills --skill google-cloud-waf-security',
    popularity: '21.5k★ Repo · Core Security',
    popularityScore: 97,
    recencyScore: 95,
    archetypes: ['web-saas-dashboard', 'auth-identity-zerotrust', 'cloud-api-serverless', 'ai-agent-llm-rag'],
    domains: ['D01', 'D02', 'D09'],
    whyItFits: 'Verifies zero-trust authentication, least-privilege IAM/RBAC, input sanitization, and encryption boundaries.',
    neverForceFitWhen: 'Static offline documentation mocks with zero user input or auth.'
  },
  {
    id: 'GSKILL-CLOUD-RUN',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'Cloud Run Basics, Serverless N-Tier Web App & SLO Alert Configuration',
    url: 'https://github.com/google/skills/blob/main/skills/cloud/cloud-run-basics',
    installCmd: 'npx skills add google/skills --skill cloud-run-basics',
    popularity: '21.5k★ Repo · Web Hosting',
    popularityScore: 95,
    recencyScore: 97,
    archetypes: ['web-saas-dashboard', 'cloud-api-serverless'],
    domains: ['D07', 'D10', 'D12'],
    whyItFits: 'Tests stateless HTTP container endpoints, health probes, request timeouts, concurrency, and SLO latency alerts.',
    neverForceFitWhen: 'Native Android/iOS mobile SDK binaries with no HTTP web server.'
  },
  {
    id: 'GSKILL-EVAL-FLYWHEEL',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'Agent Platform Eval Flywheel & GenAI Inference Skill',
    url: 'https://github.com/google/skills/blob/main/skills/cloud/agent-platform-eval-flywheel',
    installCmd: 'npx skills add google/skills --skill agent-platform-eval-flywheel',
    popularity: '21.5k★ Repo · Latest AI/ML',
    popularityScore: 96,
    recencyScore: 99,
    archetypes: ['ai-agent-llm-rag', 'web-saas-dashboard'],
    domains: ['D05', 'D12', 'D13'],
    whyItFits: 'Establishes continuous ground-truth evaluation flywheels, golden baseline regression diffing, and rubric verification.',
    neverForceFitWhen: 'Pure static brochure websites with zero evaluation or AI/data workflows.'
  },
  {
    id: 'GSKILL-AGENT-GATEWAY-MCP',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'Agent Gateway Multi-Agent Security & API Gateway Remote MCP Server',
    url: 'https://github.com/google/skills/blob/main/skills/cloud/google-cloud-solution-multi-agent-security',
    installCmd: 'npx skills add google/skills --skill google-cloud-solution-multi-agent-security',
    popularity: '21.5k★ Repo · Latest MCP/A2A',
    popularityScore: 94,
    recencyScore: 100,
    archetypes: ['ai-agent-llm-rag', 'auth-identity-zerotrust'],
    domains: ['D01', 'D02', 'D09'],
    whyItFits: 'Audits Model Context Protocol (MCP) tool permissions, multi-agent A2A security boundaries, and Apigee governance.',
    neverForceFitWhen: 'Excluded when testing standard CRUD web apps that do not expose MCP servers or multi-agent tool calls.'
  },
  {
    id: 'GSKILL-DPOP-SIWG',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'DPoP Adoption & Sign In With Google (SiwG) Identity Security Architecture',
    url: 'https://github.com/google/skills/blob/main/skills/identity/dpop-adoption',
    installCmd: 'npx skills add google/skills --skill dpop-adoption',
    popularity: '21.5k★ Repo · Identity Security',
    popularityScore: 92,
    recencyScore: 98,
    archetypes: ['auth-identity-zerotrust', 'web-saas-dashboard', 'cloud-api-serverless'],
    domains: ['D01', 'D02', 'D09'],
    whyItFits: 'Verifies OAuth 2.0 Demonstrating Proof-of-Possession (DPoP), token replay prevention, and session fixation defenses.',
    neverForceFitWhen: 'Excluded for unauthenticated calculators or local-only CLI tools.'
  },
  {
    id: 'GSKILL-BQ-ALLOYDB',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'BigQuery Observability, Asset Impact Analysis & AlloyDB Hybrid Search',
    url: 'https://github.com/google/skills/blob/main/skills/cloud/bigquery-observability',
    installCmd: 'npx skills add google/skills --skill bigquery-observability',
    popularity: '21.5k★ Repo · Data & Analytics',
    popularityScore: 93,
    recencyScore: 96,
    archetypes: ['data-analytics-bigquery'],
    domains: ['D04', 'D08', 'D10'],
    whyItFits: 'Audits SQL query cost/slot performance, data lineage impact, and vector/relational hybrid search accuracy.',
    neverForceFitWhen: 'Excluded when the target app does not use BigQuery, AlloyDB, Spanner, or analytical SQL pipelines.'
  },
  {
    id: 'GSKILL-GKE-TPU-MXLA',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'Troubleshoot GKE TPU Multi-Slice Hangs with MXLA Hang Analyzer',
    url: 'https://github.com/google/skills/blob/main/skills/cloud/gke-ai-troubleshooting-tpu-mxla-hang',
    installCmd: 'npx skills add google/skills --skill gke-ai-troubleshooting-tpu-mxla-hang',
    popularity: '21.5k★ Repo · Niche HPC/TPU',
    popularityScore: 82,
    recencyScore: 97,
    archetypes: ['gke-tpu-cluster-only'],
    domains: ['D07'],
    whyItFits: 'Diagnoses multi-slice Cloud TPU MXLA compiler deadlocks on GKE clusters.',
    neverForceFitWhen: 'EXCLUDED for Web/SaaS UIs, REST APIs, and E2E browser apps (irrelevant hardware-specific TPU kernel skill).'
  },
  {
    id: 'GSKILL-MOBILE-ADS-SDK',
    repoId: 'REPO-GOOGLE-SKILLS',
    repoLabel: 'github.com/google/skills',
    name: 'Google Mobile Ads SDK — Android Interstitial & Rewarded Ads Migration',
    url: 'https://github.com/google/skills/blob/main/skills/ads/google-mobile-ads-interstitial',
    installCmd: 'npx skills add google/skills --skill google-mobile-ads-interstitial',
    popularity: '21.5k★ Repo · Mobile Ads',
    popularityScore: 80,
    recencyScore: 94,
    archetypes: ['mobile-android-ads-only'],
    domains: ['D03'],
    whyItFits: 'Validates Android Mobile Ads SDK ad-unit lifecycle and reward callbacks.',
    neverForceFitWhen: 'EXCLUDED for Enterprise SaaS, B2B Portals, and Web Applications (contains zero mobile ad units).'
  },

  // ================= REPO 2: https://aiuxplayground.com/skills =================
  {
    id: 'AIUX-SKILL-01',
    repoId: 'REPO-AIUX-SKILLS',
    repoLabel: 'aiuxplayground.com/skills',
    name: 'Break UI (Worst-Case Data Boundary Toggle ?data=worst|one|empty)',
    url: 'https://aiuxplayground.com/skills/break-ui',
    installCmd: 'Wired live via #break-ui-mode-select (?data=demo|worst|one|empty)',
    popularity: 'Top Testing Skill · Emil Kowalski',
    popularityScore: 99,
    recencyScore: 99,
    archetypes: ['web-saas-dashboard', 'ai-agent-llm-rag', 'cloud-api-serverless', 'data-analytics-bigquery', 'auth-identity-zerotrust'],
    domains: ['D06', 'D11', 'D13'],
    whyItFits: 'Stress-tests tables, cards, and badges with 255-char compound names, 86-char unbreakable emails, 1-item pluralization, and CJK/RTL/Emoji.',
    neverForceFitWhen: 'Headless CLI daemons with zero HTML/CSS UI.'
  },
  {
    id: 'AIUX-SKILL-02',
    repoId: 'REPO-AIUX-SKILLS',
    repoLabel: 'aiuxplayground.com/skills',
    name: 'gstack & Agent Browser (Headless Chrome Dogfooding & DOM Diffing)',
    url: 'https://aiuxplayground.com/skills/gstack',
    installCmd: 'Wired live via src/headlessRunner.mjs (Puppeteer/CDP)',
    popularity: '10.8k★ (Garry Tan) + 4.2k★ (Vercel Labs)',
    popularityScore: 100,
    recencyScore: 99,
    archetypes: ['web-saas-dashboard', 'ai-agent-llm-rag', 'cloud-api-serverless', 'data-analytics-bigquery', 'auth-identity-zerotrust'],
    domains: ['D01', 'D03', 'D04', 'D11', 'D13'],
    whyItFits: 'Drives live browser dogfooding, element snapshotting, multi-viewport geometry checks (1600/834/390px), and 2x Retina screenshot evidence.',
    neverForceFitWhen: 'Never excluded for web UIs.'
  },
  {
    id: 'AIUX-SKILL-03',
    repoId: 'REPO-AIUX-SKILLS',
    repoLabel: 'aiuxplayground.com/skills',
    name: 'UI State Expander (6-Family Exhaustive State Matrix)',
    url: 'https://aiuxplayground.com/skills/ui-state-expander',
    installCmd: 'Wired live across D04, D05, D07, D11 & CUJ-05',
    popularity: 'Top Design Systems Skill · Figma Community',
    popularityScore: 96,
    recencyScore: 97,
    archetypes: ['web-saas-dashboard', 'ai-agent-llm-rag', 'data-analytics-bigquery', 'auth-identity-zerotrust'],
    domains: ['D04', 'D05', 'D07', 'D11'],
    whyItFits: 'Expands happy-path screens into Empty, Loading, Partial, Error, Disabled, Focus, and 1-Click Recovery states.',
    neverForceFitWhen: 'Backend-only batch cron jobs.'
  },
  {
    id: 'AIUX-SKILL-04',
    repoId: 'REPO-AIUX-SKILLS',
    repoLabel: 'aiuxplayground.com/skills',
    name: 'Eval Audit (Anti-Vanity Evaluator & Negative-Control Sabotage Check)',
    url: 'https://aiuxplayground.com/skills/eval-audit',
    installCmd: 'Wired live in src/groundingTruthRegistry.mjs',
    popularity: 'Top AI Eval Skill · Hamel Husain & Shreya Shankar',
    popularityScore: 98,
    recencyScore: 100,
    archetypes: ['ai-agent-llm-rag', 'web-saas-dashboard', 'data-analytics-bigquery'],
    domains: ['D12', 'D06', 'D07'],
    whyItFits: 'Enforces binary PASS/FAIL verdicts over vague 1-5 Likert scales and tests the validator itself with sabotaged payloads.',
    neverForceFitWhen: 'Never excluded when generating QA/Eval sign-off reports.'
  },
  {
    id: 'AIUX-SKILL-05',
    repoId: 'REPO-AIUX-SKILLS',
    repoLabel: 'aiuxplayground.com/skills',
    name: 'Review Loop & WCAG Accessibility (Worker-Critic Loop + POUR Gate)',
    url: 'https://aiuxplayground.com/skills/review-loop',
    installCmd: 'Wired live via D11-01..D11-08 & qa-puppeteer-engineer critic',
    popularity: '2.1k★ (Addy Osmani) + 2dmurali',
    popularityScore: 97,
    recencyScore: 98,
    archetypes: ['web-saas-dashboard', 'ai-agent-llm-rag', 'cloud-api-serverless', 'data-analytics-bigquery', 'auth-identity-zerotrust'],
    domains: ['D11', 'D12', 'D13'],
    whyItFits: 'Pairs independent adversarial critic verification with WCAG 2.2 AA contrast (19.1:1), keyboard navigation, and ARIA checks.',
    neverForceFitWhen: 'Never excluded for user-facing web interfaces.'
  },

  // ================= REPO 3: https://aiuxplayground.com/prompts =================
  {
    id: 'AIUX-PROMPT-01',
    repoId: 'REPO-AIUX-PROMPTS',
    repoLabel: 'aiuxplayground.com/prompts',
    name: 'Design an Agent Harness (7-Stage Loop & 3-Tier Tool Permissions)',
    url: 'https://aiuxplayground.com/prompts/design-agent-harness',
    installCmd: 'Prompt Framework · AI Workflows',
    popularity: 'Top AI Workflow Prompt',
    popularityScore: 97,
    recencyScore: 99,
    archetypes: ['ai-agent-llm-rag', 'web-saas-dashboard', 'cloud-api-serverless'],
    domains: ['D02', 'D09', 'D12'],
    whyItFits: 'Defines Intake -> Clarify -> Plan -> Act -> Verify -> Report -> Log execution loop and auto-execute vs approval-gated tool boundaries.',
    neverForceFitWhen: 'Static HTML pages with no automation or API actions.'
  },
  {
    id: 'AIUX-PROMPT-02',
    repoId: 'REPO-AIUX-PROMPTS',
    repoLabel: 'aiuxplayground.com/prompts',
    name: 'Generate a Full UX Architecture Doc (Sitemap, IA & Recovery Flows)',
    url: 'https://aiuxplayground.com/prompts/ux-architecture-document',
    installCmd: 'Prompt Framework · Kingsley Orji',
    popularity: 'Top UX Research Prompt',
    popularityScore: 96,
    recencyScore: 97,
    archetypes: ['web-saas-dashboard', 'data-analytics-bigquery', 'auth-identity-zerotrust'],
    domains: ['D03', 'D13'],
    whyItFits: 'Audits parent->child sitemap hierarchy, navigation rail count (1 rail, 4 tabs), and the 6 essential product surfaces.',
    neverForceFitWhen: 'Single-endpoint headless webhooks.'
  },
  {
    id: 'AIUX-PROMPT-03',
    repoId: 'REPO-AIUX-PROMPTS',
    repoLabel: 'aiuxplayground.com/prompts',
    name: 'Design Completeness Checklist (6-Category Pre-Handoff QA Gate)',
    url: 'https://aiuxplayground.com/prompts/design-completeness-checklist',
    installCmd: 'Prompt Framework · Visual Design',
    popularity: 'Top QA Completeness Prompt',
    popularityScore: 98,
    recencyScore: 98,
    archetypes: ['web-saas-dashboard', 'ai-agent-llm-rag', 'cloud-api-serverless', 'data-analytics-bigquery', 'auth-identity-zerotrust'],
    domains: ['D04', 'D05', 'D06', 'D07', 'D11'],
    whyItFits: 'Checks 7 interactive states, 7 form states, empty/loading/error states, and min/max boundary edge cases before release.',
    neverForceFitWhen: 'Never excluded for UI/API release sign-off.'
  },
  {
    id: 'AIUX-PROMPT-04',
    repoId: 'REPO-AIUX-PROMPTS',
    repoLabel: 'aiuxplayground.com/prompts',
    name: 'Visual Hierarchy Audit & Heuristic UX Review (Nielsen 10 Heuristics)',
    url: 'https://aiuxplayground.com/prompts/visual-hierarchy-audit',
    installCmd: 'Prompt Framework · Design Review',
    popularity: 'Top Design Review Prompt',
    popularityScore: 95,
    recencyScore: 97,
    archetypes: ['web-saas-dashboard', 'data-analytics-bigquery', 'ai-agent-llm-rag'],
    domains: ['D11', 'D13'],
    whyItFits: 'Audits 1st/2nd/3rd eye-tracking fixation, above-the-fold budget (Y <= 220px, actual 145px), and Nielsen usability heuristics.',
    neverForceFitWhen: 'Headless JSON-only microservices.'
  },
  {
    id: 'AIUX-PROMPT-05',
    repoId: 'REPO-AIUX-PROMPTS',
    repoLabel: 'aiuxplayground.com/prompts',
    name: 'Accessibility Audit Report & Screen Reader Testing Script (WCAG 2.2 AA)',
    url: 'https://aiuxplayground.com/prompts/accessibility-report-template',
    installCmd: 'Prompt Framework · Accessibility',
    popularity: 'Top Accessibility Prompt',
    popularityScore: 96,
    recencyScore: 98,
    archetypes: ['web-saas-dashboard', 'ai-agent-llm-rag', 'cloud-api-serverless', 'data-analytics-bigquery', 'auth-identity-zerotrust'],
    domains: ['D11', 'D12'],
    whyItFits: 'Standardizes P0/P1/P2 WCAG defect reporting and VoiceOver/NVDA landmark, heading, and focus-trap verification scripts.',
    neverForceFitWhen: 'Never excluded for web UIs.'
  }
];

export function detectAppArchetypeFromFingerprint(targetUrl = '', appName = '', htmlDiagnostics = null, requestedArchetype = 'auto') {
  if (requestedArchetype && requestedArchetype !== 'auto') {
    const found = APP_ARCHETYPES.find((a) => a.code === requestedArchetype);
    if (found) {
      return {
        detectedArchetype: found.code,
        detectedArchetypeLabel: found.label,
        detectionMode: 'User-Selected Override',
        signals: [`Explicit archetype override: ${found.label}`]
      };
    }
  }

  const combined = `${targetUrl} ${appName}`.toLowerCase();
  const signals = [];

  if (/(zyvoriq|swarm|veo|lyria|omni|cinema|reel|personas|avatar|agent|llm|gemini|rag|mcp|prompt|eval|chat|ai)/i.test(combined)) {
    if (/zyvoriq|swarm|veo|lyria|omni|cinema|reel/i.test(combined)) {
      signals.push(
        'Detected Zyvoriq AI-Native Generative Cinema & 12-Agent Dance Music Video Swarm (Omni 1.1, Veo 3.1, Lyria 3, 6-Persona Biometric Cast & Rule 58 Feedback)'
      );
    } else {
      signals.push('Detected AI/Agent/LLM/Eval keywords in Target URL / App Name');
    }
    return {
      detectedArchetype: 'ai-agent-llm-rag',
      detectedArchetypeLabel: '🤖 AI Agent, Multimodal GenMedia (Omni/Veo/Lyria), LLM, RAG or MCP App',
      detectionMode: 'Autonomous URL + DOM Fingerprint',
      signals
    };
  }

  if (/(bigquery|alloydb|spanner|analytics|warehouse|lakehouse|sql|bi)/i.test(combined)) {
    signals.push('Detected BigQuery / AlloyDB / Data Analytics keywords');
    return {
      detectedArchetype: 'data-analytics-bigquery',
      detectedArchetypeLabel: '📊 BigQuery, AlloyDB, Spanner & Data Analytics Pipeline App',
      detectionMode: 'Autonomous URL + DOM Fingerprint',
      signals
    };
  }

  if (/(auth|iam|oauth|login|sso|dpop|security|vault|zero-trust)/i.test(combined)) {
    signals.push('Detected Identity / OAuth / Zero-Trust Security keywords');
    return {
      detectedArchetype: 'auth-identity-zerotrust',
      detectedArchetypeLabel: '🔐 Identity, OAuth/DPoP, RBAC & High-Security Enterprise App',
      detectionMode: 'Autonomous URL + DOM Fingerprint',
      signals
    };
  }

  if (htmlDiagnostics) {
    if (htmlDiagnostics.tableCount > 0 || htmlDiagnostics.inputCount >= 3) {
      signals.push(
        `Live DOM has ${htmlDiagnostics.tableCount} <table>(s), ${htmlDiagnostics.buttonCount} <button>(s), ${htmlDiagnostics.inputCount} form control(s), and semantic landmarks (header/nav/main=${htmlDiagnostics.hasHeaderLandmark}/${htmlDiagnostics.hasNavLandmark}/${htmlDiagnostics.hasMainLandmark})`
      );
    }
  } else {
    signals.push('Interactive Web / SaaS Dashboard & CRUD Execution Matrix signature');
  }

  return {
    detectedArchetype: 'web-saas-dashboard',
    detectedArchetypeLabel: '🖥️ Web / SaaS Dashboard, Data Tables & CRUD Portal',
    detectionMode: 'Autonomous URL + DOM Fingerprint',
    signals
  };
}

export function matchSkillsForTargetApp({
  targetUrl = 'http://localhost:4190',
  appName = 'Web / SaaS Application',
  htmlDiagnostics = null,
  requestedArchetype = 'auto'
} = {}) {
  const fingerprint = detectAppArchetypeFromFingerprint(
    targetUrl,
    appName,
    htmlDiagnostics,
    requestedArchetype
  );
  const arch = fingerprint.detectedArchetype;

  const matched = [];
  const excludedMisfitSkills = [];

  for (const item of CURATED_MULTI_REPO_SKILLS_POOL) {
    const fitsArchetype = item.archetypes.includes(arch);
    // Also include cloud-api-serverless for localhost / http web servers when testing web-saas-dashboard
    const secondaryFit =
      arch === 'web-saas-dashboard' && item.archetypes.includes('cloud-api-serverless');

    if (fitsArchetype || secondaryFit) {
      const fitScore = fitsArchetype ? 100 : 88;
      const compositeScore = Number(
        (0.5 * fitScore + 0.3 * item.popularityScore + 0.2 * item.recencyScore).toFixed(1)
      );
      matched.push({
        ...item,
        compositeScore,
        fitVerdict: 'MATCHED (High App Relevance)'
      });
    } else {
      excludedMisfitSkills.push({
        id: item.id,
        repoLabel: item.repoLabel,
        name: item.name,
        url: item.url,
        reasonExcluded: item.neverForceFitWhen
      });
    }
  }

  matched.sort((a, b) => b.compositeScore - a.compositeScore);

  const googleSkillsMatched = matched.filter((m) => m.repoId === 'REPO-GOOGLE-SKILLS');
  const aiuxSkillsMatched = matched.filter((m) => m.repoId === 'REPO-AIUX-SKILLS');
  const aiuxPromptsMatched = matched.filter((m) => m.repoId === 'REPO-AIUX-PROMPTS');

  const payload = {
    ok: true,
    evaluatedAt: new Date().toISOString(),
    targetUrl,
    appName,
    fingerprint,
    availableArchetypes: APP_ARCHETYPES,
    repositories: EXTERNAL_SKILL_REPOSITORIES,
    matchedSummary: {
      totalPoolEvaluated: CURATED_MULTI_REPO_SKILLS_POOL.length,
      totalMatched: matched.length,
      googleSkillsCount: googleSkillsMatched.length,
      aiuxSkillsCount: aiuxSkillsMatched.length,
      aiuxPromptsCount: aiuxPromptsMatched.length,
      excludedMisfitCount: excludedMisfitSkills.length
    },
    matchedItems: matched,
    googleSkillsMatched,
    aiuxSkillsMatched,
    aiuxPromptsMatched,
    excludedMisfitSkills
  };

  // Persist catalog snapshot to disk so the repo registry is always stored locally
  try {
    fs.writeFileSync(EXTERNAL_REPOS_CATALOG_PATH, JSON.stringify(payload, null, 2), 'utf8');
  } catch {
    // ignore read-only fs errors
  }

  return payload;
}
