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

---

## [2026-07-09] - Sprint 12: Security, Auth & Role-Based Access Control Hardening (v2.9.0)
- **Release Version**: `2.9.0`
- **Release Tag**: `v2.9.0-auth-rbac`
- **Deployment Status**: Success / Vercel Production
- **Build Verification**: Passed typecheck, eslint rules, and 64/64 unit tests
- **Files Changed**:
  - `src/lib/security/rbac.ts`
  - `src/lib/security/apiAuth.ts`
  - `src/lib/security/auditLogger.ts`
  - `src/lib/adminSession.ts`
  - `src/lib/adminApiAuth.ts`
  - `middleware.ts`
  - `src/app/api/admin/...` (various admin endpoints)
  - `src/app/admin/knowledge-editorial/page.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `src/components/dashboard/AdminSidebar.tsx`
  - `src/features/dashboard/components/AdminSidebar.tsx`
  - `src/app/admin/knowledge/page.tsx`
- **Major Changes**:
  - Implemented centralized RBAC type structures, normalizations, and permission mapping engine.
  - Integrated `authorizeRequest` API middleware guard across all admin routes.
  - Enabled path matching for `/admin/:path*` and `/api/admin/:path*` in global middleware block, excluding login paths.
  - Developed permission-aware UI gating that disables actions and shows an Access Denied panel on tabs for unauthorized roles.

---

## [2026-07-09] - Sprint 12.1: Security Enforcement Coverage & Audit Hardening (v2.9.1)
- **Release Version**: `2.9.1`
- **Release Tag**: `v2.9.1-security-hardening`
- **Deployment Status**: Success / Vercel Production
- **Build Verification**: Passed verification scripts, eslint, and 65/65 tests (with 21 test scenarios under rbacSecurity)
- **Files Changed**:
  - `src/lib/security/auditLogger.ts`
  - `src/lib/security/apiAuth.ts`
  - `src/lib/adminSession.ts`
  - `src/lib/adminApiAuth.ts`
  - `scripts/verify-production-readiness.ts`
  - `tests/rbacSecurity.test.ts`
  - `docs/operations/SECURITY_AND_RBAC.md`
  - `docs/operations/PRODUCTION_READINESS_CHECKLIST.md`
- **Major Changes**:
  - Enhanced audit log recursive payload sanitizer (`sanitizeAuditPayload`) and flattening metadata parser (`sanitizeAuditMetadata`) to strip credential/secret patterns and patient PII/PHI.
  - Standardized JSON responses for 401 and 403 errors across the API authorization layer.
  - Embedded local dev bypass checks (`ALLOW_DEV_ADMIN_BYPASS`) with strict production safety rules.
  - Upgraded verification script `verify-production-readiness.ts` to dynamically scan all admin API endpoints and enforce route-level auth coverage checks.
  - Expanded unit/integration testing suite with 21 security checks validating sanitizer, standardized responses, bypass restrictions, and route audits.

---

## [2026-07-09] - Sprint 13: Practitioner Account Lifecycle, Invitations & Admin User Management (v2.10.0)
- **Release Version**: `2.10.0`
- **Release Tag**: `v2.10.0-practitioner-lifecycle`
- **Deployment Status**: Success / Vercel Production
- **Build Verification**: Clean compile / 23 additional practitioner lifecycle tests passed / verify:production success
- **Files Changed**:
  - `src/lib/security/rbac.ts`
  - `src/features/admin-users/types.ts`
  - `src/features/admin-users/invitationTokenService.ts`
  - `src/features/admin-users/practitionerRepository.ts`
  - `src/features/admin-users/adminUsersClient.ts`
  - `src/components/dashboard/PractitionerManagementPanel.tsx`
  - `src/components/dashboard/AdminSidebar.tsx`
  - `src/features/dashboard/components/AdminSidebar.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `src/app/api/admin/users/*` (10 files)
  - `src/app/api/admin/invitations/accept/route.ts`
  - `middleware.ts`
  - `package.json`
  - `scripts/verify-production-readiness.ts`
  - `tests/practitionerLifecycle.test.ts`
  - `docs/operations/PRACTITIONER_ACCOUNT_LIFECYCLE.md`
  - `docs/operations/SECURITY_AND_RBAC.md`
  - `docs/operations/PRODUCTION_READINESS_CHECKLIST.md`
- **Major Changes**:
  - Registered `SUBSCRIPTION_MANAGE` permission and added user profile & invitation management models.
  - Developed cryptographic token generation (256-bit random) and Timing-Safe SHA-256 token hashing/verification.
  - Implemented secure API endpoints for list, profile view/patch, invite, revoke, role update, suspend, reactivate, and deactivate.
  - Implemented token-protected unauthenticated accept invite onboarding endpoint `/api/admin/invitations/accept`.
  - Built an high-density glassmorphism Practitioner Management cockpit dashboard tab.
  - Added 23 lifecycle automated test cases and pre-flight coverage audits.

---

## [2026-07-09] - Sprint 14: Practitioner Workspace Personalization, Profile Settings & Account Security (v2.11.0)
- **Release Version**: `2.11.0`
- **Release Tag**: `v2.11.0-practitioner-settings`
- **Deployment Status**: Pending Deployment
- **Build Verification**: Clean compile / 17 additional practitioner settings tests passed / verify:production success
- **Files Changed**:
  - `src/features/practitioner-profile/types.ts`
  - `src/features/practitioner-profile/preferences.ts`
  - `src/features/practitioner-profile/practitionerProfileRepository.ts`
  - `src/features/practitioner-profile/profileClient.ts`
  - `src/components/dashboard/PractitionerProfilePanel.tsx`
  - `src/app/api/account/profile/route.ts`
  - `src/app/api/account/security-activity/route.ts`
  - `src/app/api/account/preferences/route.ts`
  - `src/components/dashboard/AdminSidebar.tsx`
  - `src/features/dashboard/components/AdminSidebar.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `src/lib/security/apiAuth.ts`
  - `scripts/verify-production-readiness.ts`
  - `tests/practitionerProfile.test.ts`
  - `docs/operations/PRACTITIONER_PROFILE_AND_ACCOUNT_SETTINGS.md`
  - `docs/operations/PRACTITIONER_ACCOUNT_LIFECYCLE.md`
  - `docs/operations/SECURITY_AND_RBAC.md`
  - `docs/operations/PRODUCTION_READINESS_CHECKLIST.md`
- **Major Changes**:
  - Defined strict user-facing practitioner view models and visual preferences schemas.
  - Implemented client settings panel rendering forms, access parameters, and recent timeline lists.
  - Implemented `/api/account/` sub-routes for session-bound profile retrieval, patches, logs, and preferences.
  - Extended authorizeRequest to enforce real-time status queries and subscription expiry gates.
  - Wrote 17 test cases validating settings boundaries and updated verify scripts.

---

## [2026-07-10] - Sprint 15: Patient Attachment Portal, Lab Extraction & Attachments Repository (v2.12.0)
- **Release Version**: `2.12.0`
- **Release Tag**: `v2.12.0-patient-attachments`
- **Deployment Status**: Pending Deployment
- **Build Verification**: Clean compile / 22 patient attachments and lab extractions tests passed / verify:production success
- **Files Changed**:
  - `src/features/patient-attachments/types.ts`
  - `src/features/patient-attachments/uploadValidation.ts`
  - `src/features/patient-attachments/storageAdapter.ts`
  - `src/features/patient-attachments/attachmentRepository.ts`
  - `src/features/patient-attachments/labExtraction.ts`
  - `src/features/patient-attachments/attachmentClient.ts`
  - `src/features/patient-attachments/authHelper.ts`
  - `src/features/patient-attachments/PatientAttachmentsPanel.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `package.json`
  - `scripts/verify-production-readiness.ts`
  - `tests/patientAttachments.test.ts`
  - `docs/operations/PATIENT_ATTACHMENTS_AND_LAB_EXTRACTION.md`
- **Major Changes**:
  - Defined model interfaces for `PatientAttachment` and `ExtractedLabParameter` in a secure attachment repository.
  - Developed strict file upload validations enforcing 10MB size limits, MIME allowlists, and script injection blocklists.
  - Formulated dynamic, role-based patient access controls guarding patient record ownership boundary at API and DB layers.
  - Designed local deterministic lab extraction parsing parameters (TSH, Fasting Glucose, ALT, HbA1c, Hemoglobin) and flagging abnormal values.
  - Embedded tab navigation switcher in patient modal, enabling clinicians to view secure patient attachments/labs or chronological feeds.
  - Added 22 E2E test cases validating upload constraints, extraction correctness, API controls, and PII-sanitized logs.

---

## [2026-07-10] - Sprint 16: Patient Attachment Security, Storage & PHI Hardening (v2.12.1)
- **Release Version**: `2.12.1`
- **Release Tag**: `v2.12.1-attachments-hardening`
- **Deployment Status**: Pending Deployment
- **Build Verification**: Clean compile / 24 patient attachments and lab extractions tests passed / verify:production success
- **Files Changed**:
  - `src/features/patient-attachments/types.ts`
  - `src/features/patient-attachments/uploadValidation.ts`
  - `src/features/patient-attachments/storageAdapter.ts`
  - `src/features/patient-attachments/attachmentRepository.ts`
  - `src/features/patient-attachments/labExtraction.ts`
  - `src/features/patient-attachments/authHelper.ts`
  - `src/app/api/patients/[patientId]/attachments/route.ts`
  - `src/app/api/patients/[patientId]/attachments/[attachmentId]/route.ts`
  - `src/app/api/patients/[patientId]/attachments/[attachmentId]/download/route.ts`
  - `src/app/api/patients/[patientId]/attachments/[attachmentId]/lab-parameters/route.ts`
  - `scripts/verify-production-readiness.ts`
  - `tests/patientAttachments.test.ts`
  - `docs/operations/PATIENT_ATTACHMENTS_AND_LAB_EXTRACTION.md`
  - `docs/operations/PRODUCTION_READINESS_CHECKLIST.md`
- **Major Changes**:
  - Hardened file uploads by verifying file contents using binary signature checks (`MZ`, `ELF`) and text pattern scanners for script tags (`<script`, `<?php`, `<html`, `<svg`).
  - Added strict double-extension check preventing malicious file uploads like `.php.pdf`.
  - Enforced Cache-Control headers (`no-store, no-cache, must-revalidate, proxy-revalidate`) on all sensitive patient attachment dynamic routes.
  - Capped signed download URL expiration at 5 minutes (300 seconds) and ensured signed URLs are never persistent or logged.
  - Implemented parameter ownership validation checking on all lab parameter patch requests to prevent cross-scoping.
  - Restricted downloading of archived and deleted attachments to super-admins in explicit audit mode.
  - Excluded archived/deleted files from default list responses and added invalid state transitions to the metadata repository.
  - Upgraded verification script with safety gates checking for MIME allowlist, size cap, and no OCR/URL leaks in console outputs.
  - Expanded test suite to 24 E2E security assertions.






---

## [2026-07-10] - Sprint 17: Clinician-Reviewed Lab Data Layer & Clinical Workspace Integration (v2.13.0)
- **Release Version**: `2.13.0`
- **Release Tag**: `v2.13.0-lab-reviews`
- **Deployment Status**: Pending Deployment
- **Build Verification**: Clean compile / 14 reviewed lab data tests passed / 24 patient attachments tests passed / verify:production success
- **Files Changed**:
  - `src/features/patient-labs/types.ts`
  - `src/features/patient-labs/labRepository.ts`
  - `src/features/patient-labs/clinicalLabContext.ts`
  - `src/features/patient-labs/labClient.ts`
  - `src/features/patient-labs/PatientLabTimelinePanel.tsx`
  - `src/features/patient-labs/TreatmentPlannerLabReference.tsx`
  - `src/app/api/patients/[patientId]/labs/review/route.ts`
  - `src/app/api/patients/[patientId]/labs/timeline/route.ts`
  - `src/app/api/patients/[patientId]/labs/summary/route.ts`
  - `src/app/admin/dashboard/page.tsx`
  - `package.json`
  - `scripts/verify-production-readiness.ts`
  - `tests/patientLabs.test.ts`
  - `docs/operations/CLINICIAN_REVIEWED_LAB_DATA.md`
  - `docs/operations/PATIENT_ATTACHMENTS_AND_LAB_EXTRACTION.md`
  - `docs/operations/PRODUCTION_READINESS_CHECKLIST.md`
- **Major Changes**:
  - Implemented Clinician-Reviewed Lab Data types (`LabReviewStatus`, `ReviewedLabResult`, `PatientLabTimelineEntry`).
  - Created a robust reviewed lab repository checking metadata scope, active parameters, and preventing archived/deleted reviews.
  - Formulated Clinical OS read-only contexts (`clinicalLabContext.ts`) and warnings isolating clinical logic and remedy selection.
  - Implemented standard lab review API sub-routes (`review`, `timeline`, `summary`) and client fetchers.
  - Embedded `PatientLabTimelinePanel` displaying verified lab summaries, SVG sparkline graphs, and pending review counts.
  - Displayed verified lab summaries as read-only cards in the Treatment Planner column.
  - Added 14 unit and integration safety test assertions.

---

## [2026-07-11] - Sprint 20: Evidence Metadata and Deterministic Retrieval Priority (v2.14.0-B)
- **Release Version**: `2.14.0-B`
- **Release Tag**: `v2.14.0-b-evidence-scoring`
- **Deployment Status**: Deployed / Commit: `d4b213e43b93717b297f6eeee73e079e3635f207`
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:production
- **Files Changed**:
  - `src/features/dashboard/constants/featureFlags.ts`
  - `src/features/knowledge/types/index.ts`
  - `src/features/knowledge-admin/types/index.ts`
  - `src/features/knowledge-admin/cms/types.ts`
  - `src/features/knowledge/retrieval/evidenceScoringService.ts`
  - `src/lib/security/rbac.ts`
  - `src/features/knowledge-admin/cms/publicationReadiness.ts`
  - `src/lib/ragService.ts`
  - `src/features/knowledge-admin/cms/cmsManager.ts`
  - `src/app/api/admin/cms/route.ts`
  - `src/app/api/ai-diagnostics/route.ts`
  - `src/features/repertory/repositories/RepertoryRetrievalRepository.ts`
  - `firestore.rules`
  - `src/app/admin/knowledge-editorial/page.tsx`
  - `src/lib/firebaseAdmin.ts`
  - `src/features/knowledge-admin/workflow/workflowManager.ts`
- **Major Changes**:
  - Extended CMS metadata model with canonical evidence strength, source quality, and review expiry policy.
  - Implemented pure deterministic priority scoring (evidenceStrength, sourceQuality, clinical/editorial confidence, review freshness, citation completeness).
  - Wired strict server-side validation to block client-side injection of read-only metadata fields.
  - Locked down client-side writes to CMS drafts & version collections in `firestore.rules`.
  - Configured context-specific RAG retrieval policy gating AI clinical search from expired evidence content.
  - Added 25 focused evidence unit/integration tests confirming dates, context matrices, permissions, and rollback behavior.
  - Integrated RAG priority blending (85% relevance / 15% priority) in RAG query pipeline.

---

## [2026-07-12] - Sprint 21: Private Workspace Persistence & Security Rules (v2.15.0)
- **Release Version**: `2.15.0`
- **Release Tag**: `v2.15.0-private-workspace`
- **Deployment Status**: Deployed
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:release
- **Files Changed**:
  - `src/features/materia-medica/types/persistenceTypes.ts`
  - `src/features/materia-medica/services/annotationsService.ts`
  - `src/features/materia-medica/services/bookmarksService.ts`
  - `src/features/materia-medica/services/readerPositionService.ts`
  - `src/features/materia-medica/components/reader/MateriaMedicaReader.tsx`
  - `src/features/dashboard/constants/featureFlags.ts`
  - `firestore.rules`
  - `tests/materiaMedicaPersistence.test.ts`
- **Major Changes**:
  - Implemented client persistence models (`MateriaMedicaAnnotation`, `MateriaMedicaBookmark`, `MateriaMedicaReaderPosition`) supporting explicit sync states.
  - Built decoupled services handling practitioner-specific Firestore subcollections with client-side caching.
  - Added optimistic concurrency controls preventing last-write-wins (LWW) merge conflicts.
  - Implemented idempotent bookmark toggles and debounced scroll position tracking.
  - Enforced strict backend-level security in `firestore.rules` validating ownership and payload schemas.
  - Added 8 rules-unit-testing emulator assertions verifying read/write permissions, offset bounds, and note sizes.


---

## [2026-07-14] - Sprint 23: Knowledge Source Read Model Hardening (v2.17.0)
- **Release Version**: `2.17.0`
- **Release Tag**: `v2.17.0-source-read-model`
- **Deployment Status**: Committed — Pending Deployment
- **Build Verification**: Passed typecheck and foundation test gate (`knowledgeSourceReadModel.test.ts`, `fourProjectFoundations.test.ts` Sprint 23 block)
- **Files Changed**:
  - `src/features/knowledge/read-models/sourceVersionReadModel.ts`
  - `src/features/knowledge/read-models/sourceDiscrepancyQueue.ts`
  - `src/features/knowledge/read-models/sourceExpiry.ts` [NEW]
  - `src/features/knowledge/read-models/reviewerDiscrepancyQueueService.ts` [NEW]
  - `src/features/knowledge/read-models/auditExport.ts` [NEW]
  - `src/app/admin/knowledge-editorial/page.tsx`
  - `tests/knowledgeSourceReadModel.test.ts` [NEW]
- **Major Changes**:
  - Added `isSourceWithdrawn` and `propagateWithdrawal` utilities in `sourceExpiry.ts` for deterministic withdrawal state computation.
  - Added `buildReviewerQueueSummary` in `reviewerDiscrepancyQueueService.ts` producing blocking/review counts from live discrepancy queue.
  - Added `buildSourceAuditExport` and `verifyAuditExportIdempotency` in `auditExport.ts` for deterministic, schema-versioned (v1) audit exports.
  - Added Discrepancy Queue tab to Knowledge Editorial cockpit showing reviewer queue summary.
  - Added 15 assertions in `knowledgeSourceReadModel.test.ts` covering all read-model paths and idempotency.
- **Integration Status**: **Foundation-only.** `isSourceWithdrawn` and `propagateWithdrawal` compute withdrawal state but are not yet connected to live search or graph indexes. The Discrepancy Queue tab renders static mock sources. The audit export schema is defined and tested but not yet surfaced via an API endpoint. Full propagation integration is deferred to a separately approved future milestone.

---

## [2026-07-14] - Sprint 24: Repertory Export PHI Remediation (v2.18.0)
- **Release Version**: `2.18.0`
- **Release Tag**: `v2.18.0`
- **Deployment Status**: Deployed
- **Build Verification**: Passed production verification check (SHA af57029989cf2a33d0a503e91197e83dec9002c2)
- **Files Changed**:
  - `src/app/api/repertory/export/route.ts` [MODIFIED — POST uses authorizeRepertoryExportRequest to enforce export-json capability check]
  - `src/app/api/repertory/repertorize/route.ts` [MODIFIED — persistent session write gated on complete canAccessDoctorRepertory entitlement check]
  - `src/features/repertory/access/DoctorEntitlementService.ts` [MODIFIED — deleted unsafe createRepertorySessionExport]
  - `src/features/repertory/clinicalWorkspace/clinicalRepertoryService.ts` [MODIFIED — patientId passed properly; userId stripped from client payload]
  - `src/features/repertory/clinicalWorkspace/types.ts` [MODIFIED — added patientId to request and sessionToken to result]
  - `src/features/repertory/components/RepertoryWorkbench.tsx` [MODIFIED — Workbench passes patientId || undefined; clears sessionToken correctly on reset, restart, and failure; ignores stale responses]
  - `scripts/verify-production-readiness.ts` [MODIFIED — dirty-tree check scoped to production/release modes only; added authorization test to verify list]
  - `tests/fourProjectFoundations.test.ts` [MODIFIED — test updated to use buildClinicianExport instead of deleted helper]
  - `tests/repertoryExportAuthorization.test.ts` [NEW — unit tests for authorizeRepertoryExportRequest status and capability gates]
  - `tests/repertoryEntitlementExport.test.ts` [MODIFIED — updated for buildClinicianExport]
  - `tests/repertoryExportRoute.test.ts` [MODIFIED — updated to mock new exports]
- **Security Fixes**:
  - **PHI-free export**: sessionId and patientId structurally absent from RepertoryClinicianExportV1; value scan defense-in-depth.
  - **Enforce export capability**: authorizeRepertoryExportRequest hardcodes export-json check.
  - **Complete entitlement validation**: canAccessDoctorRepertory validates status, expiration, doctor ID, and tenant bounds before session creation.
  - **Identity boundary**: client-supplied userId stripped; server derives doctor identity from session cookie.
  - **Client session contract**: stale response detection, clear token on reset/failure, and show export options only on valid token.
  - **Readiness check logic**: dirty-tree check now only blocks production/release modes, allowing normal dev tasks.

---

## [2026-07-15] - Sprint 27A: AI Security and Resilient Routing Boundaries (v2.19.0)
- **Release Version**: `2.19.0`
- **Deployment Status**: Deployed (Commit: `130e70682e8476c4eb6d136f95869b5d5155db0`)
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:production (SHA-bound evidence: `c78be17c267678bd2dd24d9c70e364867fd11f22`)
- **Files Changed**:
  - `src/lib/aiRouter.ts`
  - `src/lib/ragService.ts`
  - `src/app/api/consult-ai/route.ts`
  - `src/features/ai-security/access/aiSecurityHeaders.ts`
  - `src/features/ai-security/protection/rateLimiter.ts`
  - `tests/aiSecurityBoundary.test.ts`
- **Security & Resilience Hardening**:
  - **PHI Redaction**: Gated EMR data logging, masked client exceptions, and scrubbed exception trace messages to prevent PHI exposure.
  - **Strict Schema Enforcement**: Required strict schemas on all consult-ai requests, rejecting any unexpected parameter or payload.
  - **Sequential Fallback Quarantine**: Implemented a fail-closed 60-second lease quarantine on orphaned providers to guarantee they settle before a lease is reacquired.
  - **Redis Readiness Checks**: Bypassed Redis operations and fell back gracefully to local caches if the connection was not fully established.
  - **Tenant & Entitlement Gates**: Validated EMR doctor workspace entitlement, organization bounds, patient consent, and clinic boundaries.

---

## [2026-07-16] - Sprint 27B: AI Security Observability & Rate Limiter Resilience (v2.20.0)
- **Release Version**: `2.20.0`
- **Deployment Status**: Deployed (Commit: `04e2599df9484b05681b2647c7d08f33cbb70fea`)
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:production (SHA-bound evidence: `b98664f8b8f9b269a1495d0e57480849b5ef382e`, bound to code commit `1b3862292bd045c5e4f54a5feb593e93dec4fcb2`)
- **Files Changed**:
  - `src/app/api/admin/observability/rag-health/route.ts`
  - `src/app/api/ai-router/health/route.ts`
  - `src/app/admin/observability/page.tsx`
  - `src/features/ai-security/access/aiSecurityHeaders.ts`
  - `src/features/ai-security/protection/rateLimiter.ts`
  - `src/features/knowledge/retrieval/embeddingQueue.ts`
  - `src/lib/aiRouter.ts`
  - `src/lib/ragService.ts`
  - `tests/aiSecurityBoundary.test.ts`
- **Security & Observability Hardening**:
  - **Strict Zod Body Validation**: Gated RAG health POST mutation endpoint with a strict Zod schema checking for action enums, rejecting extra fields, arrays, and malformed JSON with a `400 Bad Request` early.
  - **CORS Exact-Origin Checks**: Checked present request origins against an allowed list on health routes and rejected disallowed origins with `403 Forbidden`.
  - **Rotating Bounded Pruning**: Implemented a rotating prune cursor index checking up to 50 entries per insertion order, reclaiming capacity on mixed active/expired rate limiter entries to prevent starvation.
  - **Query Log Redaction**: Removed all raw search queries and error stack details from both RAG search and AI Router grounding logs.
  - **Sentinel Log and Isolation Tests**: Added verification tests validating log sentinel redactions across all log levels, isolated RAG grounding draft checks, disallowed origin POST checks, and Consult AI OPTIONS preflight regressions.

---

## [2026-07-16] - Sprint 27C: Repertory Admin Security Hardening & Safe Ingestion Boundaries (v2.21.0)
- **Release Version**: `2.21.0`
- **Deployment Status**: Success / Vercel Production (Merge commit: `4414d7a69276fd1f469e925a56c5f17a21aa292f`, timestamp: `2026-07-16T14:53:08Z`)
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:production (SHA-bound evidence: `f7037fc3b5646f8d8b22ca1090360df3b3396361` bound to code commit `a756188769639f6a11b3671392d69f9742150a39`)
- **Files Changed**:
  - `src/app/api/repertory/save/route.ts` [Gated with authorizeRequest, action-discriminated schema, error redact]
  - `src/app/api/repertory/delete/route.ts` [Gated with authorizeRequest, error redact]
  - `src/app/api/repertory/seed/route.ts` [Gated with authorizeRequest, POST-only, atomic Firestore transaction]
  - `src/app/api/repertory/v2-compare/route.ts` [Gated with authorizeRequest, 16KB body stream limit, error redact]
  - `src/app/api/repertory/v2-live/route.ts` [Zod schema, 16KB body stream limit, error redact]
  - `src/app/api/repertory/v2-feedback/route.ts` [No query/note PHI, authorizeRequest inside catch fallback, corpus rubric status checks, deduplicated checks]
  - `src/features/repertory/security/RepertoryApiSecurity.ts` [Shared byte-bounded stream reader]
  - `tests/repertoryRouteSecurity.test.ts` [30 comprehensive security and regression tests]
- **Security & Route Hardening**:
  - **Shared Bounded Stream Reader**: Implemented a secure stream byte reader that aborts instantly if the request body exceeds the limit (4KB for POST feedback, 16KB for compare/live).
  - **Standardized Admin Authorization**: Unified access control across all administrative routes using `authorizeRequest`, returning standard 401/403 audit logs and preventing doctor-entitlement bypasses.
  - **Atomic Ingestion Seed Protection**: Gated the seeding mutation endpoint to POST-only, executing seed mutations atomically under a Firestore transaction to prevent race conditions.
  - **Review Pseudonymization & PHI Strip**: Stripped free-text fields (query/note) from feedback database persistence; stored domain-separated HMAC review attributions using clinical secrets.
  - **Standard CORS OPTIONS Preflights**: Provided OPTIONS preflight endpoints on every changed route checking exact headers and methods.
  - **Generic Exceptions & Audit Hardening**: Redacted raw database exception stack details from logs and client JSON responses, logging only sanitized event summaries.

---

## [2026-07-16] - Sprint 28A: KnowledgeGraphExplorer Performance Hardening & Accessibility
- **Deployment Status**: Success / Vercel Production (Merge commit: `68d9e3fdf7b5a453f7c39b0f9b699af6ae9742bb`, timestamp: `2026-07-16 22:53:23 IST` / `2026-07-16T17:23:23Z`)
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:production (SHA-bound evidence: `646d878ac047444f143b44b5a25af040d8085da9` bound to code commit `59711eed53b0633c5d675751ef9361daa4fe47f9`)
- **Files Changed**:
  - `package.json`
  - `package-lock.json`
  - `vitest.config.ts`
  - `tests/setupVitest.ts`
  - `tests/knowledgeGraphExplorer.test.tsx`
  - `tests/KI-002_performance_report.md`
  - `src/features/knowledge/components/KnowledgeGraphExplorer.tsx`
  - `scripts/verify-production-readiness.ts`
  - `reports/production-readiness-report.json`
- **Performance Mitigation Status (KI-002)**: Mitigated pending field validation.
- **Live Verification Findings**:
  - The Knowledge Graph page loaded successfully.
  - Exactly one graph workspace existed inline and in fullscreen (no duplicate rendering).
  - The fullscreen dialog opened successfully.
  - Pressing the Escape key closed the fullscreen view and restored focus correctly to the trigger expand button.
  - Active console logs were not clean: React hydration mismatch error #418 and multiple `THREE.Clock` deprecation warnings were observed during render.
- **Performance & Accessibility Hardening Details**:
  - **Single-Instance Fullscreen Workspace**: Prevented double-rendering the Clinical Graph by conditionally unmounting the inline viewport workspace when the fullscreen modal portal is active.
  - **Satellites & Connectors Memoization**: Extracted satellite nodes and SVG connector lines into dedicated static sub-components wrapped in `React.memo` to reduce avoidable child rerenders.
  - **Callback Prop Stabilization**: Stabilized hover and focus callback references in the parent component using `useCallback` and static external scopes, ensuring memoized shallow prop comparisons succeed.
  - **Modal Accessibility & Focus Trap**: Built capture-phase keyboard listener trap handlers, Escape-to-close, initial focus timeout cleanups, and dynamic restoring of preexisting body style overflow values.
  - **Test Seam Elimination**: Completely removed mutable globals and render-phase test callbacks from the production client codebase to keep bundle output pure.

---

## [2026-07-17] - Sprint 28B: React Hydration Invariance & WebGL Timer Migration
- **Deployment Status**: Success / Vercel Production (Merge commit: `93654aeafde8da0f4c5182871e87367f22441d39`, timestamp: `2026-07-17 10:51:00 IST` / `2026-07-17T05:21:00Z`)
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:production (SHA-bound evidence: `a440a6436f9c5532dedc0ddf938402a38df69dc3` bound to code commit `ba282fa5aacbeba3934f16e5a07c5110db28d2b0`)
- **Files Changed**:
  - `package.json`
  - `scripts/verify-production-readiness.ts`
  - `src/features/knowledge/utils/dateFormatter.ts`
  - `src/features/knowledge/components/LastReviewedBadge.tsx`
  - `src/features/knowledge/components/EditorialConfidenceBadge.tsx`
  - `src/features/knowledge/components/ReviewedBy.tsx`
  - `src/features/knowledge/components/TimelineHistory.tsx`
  - `src/features/knowledge/components/AICitationBlock.tsx`
  - `src/app/knowledge/case-studies/page.tsx`
  - `src/app/knowledge/research/page.tsx`
  - `src/components/AntigravityBackground.tsx`
  - `tests/hydrationAndTiming.test.tsx`
  - `reports/hydration_and_timing_diagnostics.md`
  - `reports/production-readiness-report.json`
- **Major Changes**:
  - **Timezone-Invariant Date Formatter**: Implemented a pure, timezone-invariant `formatMedicalDate` and `formatMedicalDateLong` utility that validates date boundaries and strict ISO hours, minutes, and seconds ranges (rejecting invalid times like `99:99:99` or `24:00:00`), returning `""` on invalid inputs.
  - **React Hydration Mismatch Fix**: Swapped timezone-sensitive `toLocaleDateString()` methods for our new formatter in all date-rendering badges and pages to eliminate HTML structural and date value discrepancies.
  - **THREE.Timer Migration**: Replaced deprecated `THREE.Clock` in `AntigravityBackground.tsx` with `THREE.Timer`, implementing clamped tick updates (`Math.min(timer.getDelta(), 0.1)`) and accumulating ticks in `simulationElapsed` to prevent frame-drop rendering jumps.
  - **Deterministic Timezone Testing**: Added `tests/hydrationAndTiming.test.tsx` with forced UTC server renders and `America/New_York` client hydration checks to programmatically verify hydration resilience, along with static Three.js Clock usage assertions.

---

## [2026-07-17] - Sprint 28C: Knowledge Graph Mobile Performance Validation & KI-002 Mitigation
- **Deployment Status**: Success / Vercel Production (Merge commit: `1f434a617ef0551fa598c0088e76862d42786fe8`, timestamp: `2026-07-17 12:51:00 IST` / `2026-07-17T07:21:00Z`)
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:production (SHA-bound evidence: `ae9d460966eb2ce1ff62456f307deff2239bc2cf` bound to code commit `f57200465b72d3f1dd33c0424ee6939e1ef6ca86`)
- **Files Changed**:
  - `docs/KNOWN_ISSUES_REGISTER.md`
  - `package.json`
  - `package-lock.json`
  - `scripts/verify-production-readiness.ts`
  - `scripts/measure_mobile_performance.ts`
  - `tests/graphPerformance.test.tsx`
  - `reports/KI-002_mobile_performance_data.json`
  - `reports/KI-002_mobile_performance_report.md`
  - `reports/production-readiness-report.json`
  - `reports/traces/baseline_representative.json.gz`
- **Performance Mitigation Status (KI-002)**: Mitigated pending physical-device validation.
- **Major Changes**:
  - **Clean-Code Performance Runner**: Added a Puppeteer-based automated browser sequence that emulates low-end mobile viewports (Moto G4, 360x640), CPU throttling (4x), and captures Event Timing and main-thread frame pacing.
  - **Strict Interactions & Invariance**: Refactored the test interaction loop to use non-navigating components (maximize and close explorer button) and added URL invariance assertions to prevent navigation.
  - **Grouped & Deduplicated Event Timing**: Implemented `interactionId` deduplication to report true user interactions rather than raw event streams.
  - **Verified Performance Budgets**: Confirmed baseline pacing stays below the animation frame duration budget (p95 = `22.60 ms` < `33.33 ms` target budget) with exactly `0` interaction-phase long tasks, rendering viewport gating unnecessary.
  - **Trace Sanitization**: Removed username sentinels and user environment variables from trace events, validating output before compressing to `baseline_representative.json.gz`.

---

## [2026-07-17] - Sprint 28D: Miasmatic Filter Read Model & Presentation-Only UI
- **Deployment Status**: Success / Vercel Production (Verified on current main commit `08f90dac193fee09ed3434f521f373a2fb13d18b`; original merge commit `4127f2cafc87d6f0054c4007a92bc93d7b08908b` had mixed results: Portal success, Futuristic site failure)
- **Build Verification**: Passed typecheck, eslint rules, Next.js build, and verify:production (SHA-bound evidence: `5778d94aa2a9d928253855212e89ce8d78cb5f00` bound to code commit `deeb0a11a89097e7e8d75051bb472f6284038254`)
- **Files Changed**:
  - `package.json`
  - `vitest.config.ts`
  - `src/features/repertory/projections/RubricMiasmProjectionV1.ts`
  - `src/features/repertory/components/RepertoryWorkbench.tsx`
  - `tests/miasmaticFiltering.test.tsx`
  - `scripts/verify-production-readiness.ts`
  - `reports/production-readiness-report.json`
- **Infrastructure Status**: Production-disabled infrastructure (no active clinical filter).
- **Major Changes**:
  - **Miasmatic Projection Model (Read Model)**: Shipped an empty and deeply frozen production projection dictionary `RubricMiasmProjectionV1` in `src/features/repertory/projections/RubricMiasmProjectionV1.ts` with strict schema validation rules enforcing literal version `1.0.0`, `approved` reviewStatus, opaque review IDs `rev_[a-zA-Z0-9_]+`, non-empty provenance and source metadata. Returns safe `['unclassified']` fallback arrays on validation failure or missing mappings.
  - **UI Presentation Seams & Toggles**: Cleaned up the dormant miasm filtering paths and the obsolete `MIASMS` constant. Wrapped the miasm filter controls in `RepertoryWorkbench.tsx` to remain completely disabled in production environments by default, only allowing enabling during test runs when `process.env.NODE_ENV === 'test'` and the explicit prop `enableMiasmaticFilter` is set.
  - **Accessibility & Reduced Motion**: Wired Left/Right/Up/Down arrow key focus cycling navigation, and Space/Enter selection controls on the miasm filter buttons. Handled reduced motion settings using `motion-reduce:transition-none` classes on transition boundaries.
  - **Automatic State Lifecycle Cleanups**: Added triggers to automatically reset all selected miasmatic filters upon patient switching or workspace session changes.
  - **Vitest Test Suite**: Verified the production model immutability, test-only override safety checks, schema validations, zero-write side-effects (0 database edits, 0 storage writes, 0 router modifications, and 0 console warnings) and unchanged read-count delta metrics, keyboard focus navigation, and score/calculation invariance before and after filtering.
