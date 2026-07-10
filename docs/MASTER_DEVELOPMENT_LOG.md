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
