# Master Development Log

This document serves as the chronological, single source of truth for all sprints, deployments, and major updates on the Unified Clinical OS and Repertory Platform.

---

## [2026-07-03] - Sprint 1: Unified Clinical Workspace Foundation (v1.0.0)
- **Release Version**: `1.0.0`
- **Release Tag**: `v1.0.0-clinical-os`
- **Deployment Status**: Success / Vercel Production
- **Build Verification**: Clean compile / Next.js static build success
- **Rollback commit**: `8fa5eb3`
- **Files Changed**:
  - `src/features/repertory/engine/canonicalTypes.ts`
  - `src/features/repertory/flags/repertoryFlags.ts`
  - `src/features/repertory/engine/remedyNormalizer.ts`
  - `src/features/repertory/adapters/`
- **Major Changes**:
  - Consolidated clinician workspace into a single pane of glass, avoiding parallel routing models.
  - Configured repertory graph traversals to query relations and differential pathways.
  - Implemented RAG-supported local caching, confidence thresholds, and explicit provenance markers.
  - Developed approval-status tracking (Draft, Review, Verified, Deprecated, Archived) to audit knowledge additions.
  - Established custom, configurable scoring weights and automated calibration case suites.
  - Activated indexing of Dr. Jethwani's clinical observations and completed thorough verification.
- **Architectural Decisions**:
  - **ADR-003**: Unified Single-Pane Workspace (accepted).
- **User-Facing Improvements**:
  - Implemented unified Treatment Planner dashboard, sticky safety banners, high-density symptom rows, and independent scroll regions.

---

## [2026-07-08] - Sprint 2: Scale-Up & Immersive Visualization (v2.0.0)
- **Release Version**: `2.0.0`
- **Release Tag**: `v2.0.0-knowledge-platform`
- **Deployment Status**: Success / Vercel Production
- **Build Verification**: Clean compile / 76/76 static routes completed
- **Rollback commit**: `7c1a381`
- **Files Changed**:
  - `src/app/admin/dashboard/page.tsx`
  - `src/app/api/chat/route.ts`
  - `src/app/api/consult-ai/route.ts`
  - `src/lib/aiRouter.ts`
  - `src/lib/cacheService.ts`
  - `src/lib/ragService.ts`
  - `src/lib/ollama.ts`
- **Major Changes**:
  - Scales knowledge database with 426 static routes, 387 indexable URLs, 343 knowledge articles (150 remedies, 75 diseases, 75 symptoms, 40 lab tests, 13 comparisons, 9 hubs).
  - Immersive `KnowledgeGraphExplorer` with custom line styles, legend, fullscreen explorer, and custom tooltip info.
  - Resolved empty graph satellite nodes rendering and search state hydration issues.
  - Resolved Server Component serialization error on `printAction` handler.
  - UI Freeze Status: Frozen and verified.
  - Production Readiness Status: Verified and deployed.
- **Architectural Decisions**:
  - **ADR-001**: Central AI Router and Provider Fallback Chain (accepted).
  - **ADR-002**: RAG-supported Caching and Confidence Thresholds (accepted).
- **User-Facing Improvements**:
  - Rich and interactive full-screen search mapping, responsive clinical dashboards, and high-performance interactive clinical graph visualization.

---

## [2026-07-08] - Sprint 3: AI Router Stability & Robustness (v2.0.1)
- **Release Version**: `2.0.1`
- **Release Tag**: `v2.0.1`
- **Deployment Status**: Success / Vercel Production
- **Build Verification**: Passed typecheck & build
- **Rollback commit**: `7c1a381`
- **Files Changed**:
  - `src/app/api/consult-ai/route.ts`
  - `src/features/knowledge/search/searchSynonyms.ts`
- **Major Changes**:
  - Refactored AI Router fallback sequence to retry DeepSeek if Gemini fails
  - Optimized local storage hydration for search queries in dashboard
- **Architectural Decisions**:
  - **ADR-004**: Strict Rate Limiting on AI Router Endpoint (Accepted)
- **User-Facing Improvements**:
  - Added status indicators to the search input field during hydration

---

## [2026-07-09] - Sprint 4: Editorial Excellence groundwork (v2.1.0)
- **Release Version**: `2.1.0`
- **Release Tag**: `v2.1.0-editorial-excellence`
- **Deployment Status**: Pending Deployment
- **Build Verification**: Passed typecheck & build
- **Rollback commit**: `9d6c41b`
- **Files Changed**:
  - `src/features/knowledge-admin/types/index.ts`
  - `src/features/knowledge/types/index.ts`
  - `src/features/knowledge-admin/repositories/MemoryRepository.ts`
  - `src/features/knowledge-admin/adapters/searchConsoleAdapter.ts`
  - `src/features/knowledge-admin/adapters/analyticsAdapter.ts`
  - `src/features/knowledge/retrieval/aiKnowledgeService.ts`
  - `src/features/knowledge/governance/clinicalOsIntegration.ts`
  - `src/app/admin/knowledge-editorial/page.tsx`
  - `docs/knowledge-platform/EDITORIAL_GOVERNANCE.md`
- **Major Changes**:
  - Implemented the core data models for Editorial Governance on knowledge entities.
  - Created internal-only Knowledge Editorial dashboard under `/admin/knowledge-editorial`.
  - Built Search Console and Analytics adapters showing mockup telemetry metrics.
  - Implemented AI retrieval service utilities to serve LLM RAG pipelines.
  - Designed Clinical OS integration link-resolution utilities.
  - Standardized safety review status defaulting to 'needs-review' for all non-verified articles.
- **Architectural Decisions**:
  - **ADR-005**: Centralized Clinical Editorial Governance Layer (Accepted)
- **User-Facing Improvements**:
  - Added internal-only editorial cockpits, cornerstone trackers, and data adapter monitoring components for clinical reviewers.

---

## [2026-07-09] - Sprint 5: AI Knowledge Layer & Performance Safety (v2.2.1)
- **Release Version**: `2.2.1`
- **Release Tag**: `v2.2.1-ai-knowledge-layer`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, and production next build
- **Files Changed**:
  - `src/features/knowledge/retrieval/vectorStore.ts`
  - `src/features/knowledge/retrieval/vectors.json`
  - `src/features/knowledge/retrieval/embeddingProvider.ts`
  - `src/lib/ragService.ts`
  - `src/app/api/admin/generate-summaries/route.ts`
  - `src/app/api/admin/audit-content/route.ts`
  - `src/app/api/admin/sync-vector/route.ts`
  - `src/app/admin/knowledge-editorial/page.tsx`
  - `tests/vectorStore.test.ts`
  - `tests/ragPerformanceSafety.test.ts`
  - `docs/knowledge-platform/AI_KNOWLEDGE_LAYER.md`
- **Major Changes**:
  - Implemented `MemoryVectorStore` caching system and preloaded cornerstone seed vectors.
  - Implemented `embeddingManager` abstracting Gemini, local Ollama, and NullProvider.
  - Hardened local hybrid search to run zero document embedding calls in the search loop, falling back to keyword scoring on cache misses and mismatched dimensions.
  - Developed and hardened AI endpoints for quality audit, summary drafts generation, and cache syncing.
  - Created tabbed AI workspace within Metadata Modal in Editorial Cockpit.
- **Architectural Decisions**:
  - **ADR-006**: High-Performance Session Vector Caching (Accepted)
- **User-Facing Improvements**:
  - Internal dashboard enables triggering compliance checks and auditing article readabilities, while RAG performance safety rules eliminate search latency.

---

## [2026-07-09] - Sprint 6: Clinical OS Integration (v2.3)
- **Release Version**: `2.3.0`
- **Release Tag**: `v2.3.0-clinical-os-integration`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, and production next build
- **Files Changed**:
  - `src/features/knowledge/governance/clinicalOsIntegration.ts`
  - `src/features/repertory/components/RemedyReasoningPanel.tsx`
  - `src/features/repertory/components/DifferentialComparison.tsx`
  - `src/features/repertory/components/V2LivePanel.tsx`
  - `src/features/repertory/components/V2ComparisonPanel.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `tests/clinicalOsIntegration.test.ts`
  - `package.json`
- **Major Changes**:
  - Implemented secure lookup utilities in `clinicalOsIntegration.ts` for symptoms, diseases, remedies, lab tests, and comparisons.
  - Linked candidate remedies in the decision support panel, live panel, and comparisons panel to authoritative Knowledge pages.
  - Wrapped diagnosed ICD conditions and recommended investigation lab tests in the Diagnostics dashboard with educational knowledge links.
  - Surfaced safety alerts, editorial metadata status badges, and citation warnings across Clinical OS components.
- **Architectural Decisions**:
  - **ADR-007**: Unidirectional Educational Context Lookup (Accepted)
- **User-Facing Improvements**:
  - Clinicians can now seamlessly hover and click from within patient case charts and repertory panels to view verified educational sheets, keeping clinician judgment primary and eliminating double document storage.

---

## [2026-07-09] - Sprint 6.1: Clinical OS Integration Production Hardening (v2.3.1)
- **Release Version**: `2.3.1`
- **Release Tag**: `v2.3.1-clinical-os-hardening`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, and production next build
- **Files Changed**:
  - `src/features/knowledge/governance/clinicalOsIntegration.ts`
  - `src/features/repertory/components/RemedyReasoningPanel.tsx`
  - `src/features/repertory/components/DifferentialComparison.tsx`
  - `src/features/repertory/components/V2LivePanel.tsx`
  - `src/features/repertory/components/V2ComparisonPanel.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `tests/clinicalOsIntegration.test.ts`
  - `docs/knowledge-platform/CLINICAL_OS_INTEGRATION.md`
- **Major Changes**:
  - Hardened link resolver lookups to return `url: ""` and `found: false` fallback structures for pending or out-of-scope articles, completely eliminating broken route references.
  - Rewrote link wrappers on all active repertory panels to conditionally render anchor tags only if `link.found` is true, falling back to clean plain text.
  - Standardized safety badge labels to be purely informational, avoiding treatment endorsement.
  - Formulated full governance integration rules in `docs/knowledge-platform/CLINICAL_OS_INTEGRATION.md`.
  - Expanded unit test coverage in `tests/clinicalOsIntegration.test.ts` for safety thresholds, weak citation handling, and non-prescriptive disclaimers.
- **Architectural Decisions**:
  - Decoupled client UI linking logic from fallback route redirects to prevent UI disruption on uncurated medical profiles.
- **User-Facing Improvements**:
  - Clinical repertory and diagnostic panels degrade gracefully and maintain layout integrity when referring to pending clinical profiles, while maintaining strict, read-only isolation boundaries.

---

## [2026-07-09] - Sprint 7: Production Observability & Editorial Analytics (v2.4.0)
- **Release Version**: `2.4.0`
- **Release Tag**: `v2.4.0-observability-analytics`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, and production next build
- **Files Changed**:
  - `src/features/knowledge-admin/adapters/searchConsoleAdapter.ts`
  - `src/features/knowledge-admin/adapters/server/searchConsoleServer.ts`
  - `src/features/knowledge-admin/adapters/analyticsAdapter.ts`
  - `src/features/knowledge-admin/adapters/server/analyticsServer.ts`
  - `src/features/knowledge/analytics/knowledgeSearchAnalytics.ts`
  - `src/app/api/public/search/route.ts`
  - `src/app/api/admin/observability/seo/route.ts`
  - `src/app/api/admin/observability/analytics/route.ts`
  - `tests/observabilityAnalytics.test.ts`
  - `package.json`
- **Major Changes**:
  - Implemented live `ProductionSearchConsoleAdapter` (using Webmasters API v3 client) and `ProductionAnalyticsAdapter` (using GA4 Data API v1beta client) via `googleapis`.
  - Structured client-facing adapters to fetch metrics dynamically from server-only API endpoints `/api/admin/observability/seo` and `/api/admin/observability/analytics` to guarantee isomorphic browser safety and prevent Next.js bundle bloat.
  - Implemented strict regex-based HIPAA/PII redaction and query normalization in `knowledgeSearchAnalytics.ts` to log only aggregate, non-identifying query metadata.
  - Automated dynamic fallback mechanisms to serve mock metrics when private key credentials are unconfigured or when API quotas are exceeded.
- **Architectural Decisions**:
  - Decoupled Node-dependent third-party client authentication libraries into isolated, server-only script chunks to ensure full Next.js static compilation compatibility.
- **User-Facing Improvements**:
  - Provides administrators and editors with real-time landing page views, CTR, bounce rates, and internal search queries directly inside the editorial cockpit, optimizing research curation without exposing patient PHI.

---

## [2026-07-09] - Sprint 8: Content Operations & Editorial Workflow Automation (v2.5.0)
- **Release Version**: `2.5.0`
- **Release Tag**: `v2.5.0-editorial-workflow`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, unit tests, and production Next.js build compilation
- **Files Changed**:
  - `src/features/knowledge-admin/workflow/types.ts`
  - `src/features/knowledge-admin/workflow/workflowManager.ts`
  - `src/features/knowledge-admin/workflow/taskGenerator.ts`
  - `src/features/knowledge-admin/workflow/workflowClient.ts`
  - `src/features/knowledge-admin/index.ts`
  - `src/app/api/admin/workflow/route.ts`
  - `src/app/admin/knowledge-editorial/page.tsx`
  - `tests/editorialWorkflow.test.ts`
  - `package.json`
  - `docs/knowledge-platform/EDITORIAL_WORKFLOW_AUTOMATION.md`
- **Major Changes**:
  - Defined unified types for `EditorialTask`, `EditorialWorkflowEvent`, and corresponding roles and statuses.
  - Implemented `workflowManager.ts` to manage task creation, assignments, transitions, audit event loggers, and a transparent fallback in-memory cache when Firebase Firestore throws permission exceptions.
  - Created a client-side wrapper `workflowClient.ts` to coordinate actions with the backend `/api/admin/workflow` endpoint, ensuring strict client-server boundary separation.
  - Developed `taskGenerator.ts` to automatically scan content and generate tasks for stale reviews (>12 months for cornerstones), weak citations, low click-through-rates, and missing summaries.
  - Designed the Admin Workflow cockpit UI tab rendering active tasks queues, timelines, assignment/transition forms, and full audit trail histories.
- **Architectural Decisions**:
  - Kept workflow tools strictly internal, requiring human verification for clinical status changes.
- **User-Facing Improvements**:
  - Streamlines content management and editorial coordination for clinical authors, ensuring high quality and relevance without blocking search.

---

## [2026-07-09] - Sprint 7.1: Observability Privacy & Hardening (v2.4.1)
- **Release Version**: `2.4.1`
- **Release Tag**: `v2.4.1-observability-hardening`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, and production next build
- **Files Changed**:
  - `src/features/knowledge/analytics/knowledgeSearchAnalytics.ts`
  - `src/features/knowledge/analytics/clinicalOsKnowledgeUsage.ts`
  - `src/features/knowledge-admin/services/editorialPriorityService.ts`
  - `src/features/knowledge-admin/index.ts`
  - `src/app/api/admin/observability/seo/route.ts`
  - `src/app/api/admin/observability/analytics/route.ts`
  - `src/app/admin/knowledge-editorial/page.tsx`
  - `tests/knowledgeAnalyticsPrivacy.test.ts`
  - `tests/observabilityAdapters.test.ts`
  - `tests/editorialPriorityService.test.ts`
  - `package.json`
  - `docs/knowledge-platform/OBSERVABILITY_AND_ANALYTICS.md`
  - `docs/knowledge-platform/EDITORIAL_GOVERNANCE.md`
- **Major Changes**:
  - Strengthened PII/PHI redaction regexes to block ZIP, multi-word addresses, case file markers, prescription potencies/dosages, and individual patient name patterns.
  - Added an in-memory rate-limiter guard (maximum 60 queries/min) to shield Firestore from write volume exhaustion.
  - Sanitized server-side route errors to return generic, safe failure messages, preventing stack traces or private key errors from leaking.
  - Added the mandatory disclaimer banner warning inside the editorial cockpit SEO and Analytics tabs.
  - Created `editorialPriorityService` to compute article curation urgency (Critical, High, Medium, Low) based on citation health, safety issues, and practitioner views.
  - Created a HIPAA-compliant `clinicalOsKnowledgeUsage` scaffold to track aggregate remedy lookups securely.
- **Architectural Decisions**:
  - Prevented any engagement-based prioritizing metrics from overriding clinical reviews or citation health boundaries.
- **User-Facing Improvements**:
  - Ensures complete privacy and security compliance when logging search queries, while the editorial priorities service suggests research gaps cleanly.

---

## [2026-07-09] - Sprint 9: CMS Approved Publication Workflow (v2.6.0)
- **Release Version**: `2.6.0`
- **Release Tag**: `v2.6.0-cms-publishing`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, and production Next.js build compilation
- **Files Changed**:
  - `src/features/knowledge-admin/cms/cmsManager.ts`
  - `src/features/knowledge-admin/cms/publicationReadiness.ts`
  - `src/features/knowledge-admin/pages/KmsDashboard.tsx`
  - `tests/editorialCms.test.ts`
- **Major Changes**:
  - Implemented core CMS schemas and `CmsManagerEngine` supporting versions, snapshots, and rollbacks.
  - Implemented double-confirmation gates (`confirmPublish`, `confirmRollback`) for editorial promotion.
  - Added strict PII filters, prohibited claims checks, and reference validators for cornerstone articles before publishing.
  - Maintained complete separation between raw editorial drafts and public search indexes.

---

## [2026-07-09] - Sprint 10: Persistent Vector Store & Production RAG Indexing (v2.7.0)
- **Release Version**: `2.7.0`
- **Release Tag**: `v2.7.0-persistent-vector`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, and production Next.js build compilation
- **Files Changed**:
  - `src/features/knowledge/retrieval/vectorStore.ts`
  - `src/features/knowledge/retrieval/embeddingQueue.ts`
  - `src/app/api/admin/observability/rag-health/route.ts`
  - `tests/persistentVector.test.ts`
- **Major Changes**:
  - Replaced temporary memory retrieval indexes with a Firestore-supported `HybridPersistentVectorStore`.
  - Implemented asynchronous embedding queue supporting retries, stale checking, and status monitoring.
  - Designed the admin observability RAG index health summary and status cockpit tab.

---

## [2026-07-09] - Sprint 11: Production Deployment, Release Governance & Observability Runbooks (v2.8.0)
- **Release Version**: `2.8.0`
- **Release Tag**: `v2.8.0-operations-runbooks`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Passed typecheck, eslint rules, and production Next.js build compilation
- **Files Changed**:
  - `docs/operations/PRODUCTION_READINESS_CHECKLIST.md`
  - `docs/operations/RELEASE_GOVERNANCE.md`
  - `docs/operations/INCIDENT_RUNBOOKS.md`
  - `docs/operations/ENVIRONMENT_VARIABLES.md`
  - `docs/operations/DEPLOYMENT_LOG_TEMPLATE.md`
  - `scripts/verify-production-readiness.ts`
  - `src/app/admin/knowledge-editorial/page.tsx`
  - `tests/productionReadiness.test.ts`
- **Major Changes**:
  - Formulated comprehensive operations documentation and checklists for deployment readiness.
  - Established a strict SemVer based release governance policy and incident response runbooks.
  - Developed a static pre-flight validation script `verify-production-readiness.ts` to block builds missing required operational artifacts.
  - Embedded internal-only Operational Health Summary section inside the Knowledge Editorial dashboard.

---

## [2026-07-09] - Sprint 11.1: Treatment Planner UX Refinements (v2.8.1)
- **Release Version**: `2.8.1`
- **Release Tag**: `v2.8.1-ux-refinements`
- **Deployment Status**: Success / Vercel Production
- **Build Verification**: Passed typecheck, eslint rules, and unit tests
- **Files Changed**:
  - `src/app/store/page.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `src/app/admin/mock-sheet/page.tsx`
  - `docs/release-notes/RELEASE_v2_8_1.md`
  - `docs/RELEASE_NOTES.md`
- **Major Changes**:
  - Defaulted public treatment planner to monthly billing cycles.
  - Renamed patient-facing concession labels to "Special Clinical Concession" instead of "Custom Override" or "Override" in breakdown views, checkout flows, and WhatsApp invoice message outputs.
- **User-Facing Improvements**:
  - Cleaner and more professional billing terminology for patients, and monthly options highlighted by default on public portals.


