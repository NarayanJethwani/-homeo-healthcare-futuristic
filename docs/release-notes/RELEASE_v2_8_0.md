# Release Notes - v2.8.0 (Production Deployment, Release Governance & Observability Runbooks)

## Release Information
- **Release Version**: `2.8.0`
- **Release Tag**: `v2.8.0-operations-runbooks`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Clean Next.js static build success

## Summary of Changes
V2.8.0 completes the operational reliability layer for production releases, introducing governance manuals, emergency runbooks, and a static pre-flight build verifier.

### 1. Operations manuals & checklists
- Created `PRODUCTION_READINESS_CHECKLIST.md` defining step-by-step verification steps.
- Formulated `RELEASE_GOVERNANCE.md` establishing roles, version semantics, and rollback criteria.
- Outlined `INCIDENT_RUNBOOKS.md` detailing operational steps for outages, CMS publishing failures, and credential leaks.
- Documented all environment parameters in `ENVIRONMENT_VARIABLES.md`.
- Formulated `DEPLOYMENT_LOG_TEMPLATE.md` to track release runs.

### 2. Pre-flight verification script
- Created `verify-production-readiness.ts` running static asset and script checks.
- Blocks build processes if critical operations documents or package configurations are missing.

### 3. Dashboard Health Cockpit
- Embedded an internal `Operational health summary — internal governance only` dashboard block showing database modes, RAG status counters, stale vectors, and queue states.
