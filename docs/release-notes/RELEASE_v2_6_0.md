# Release Notes - v2.6.0 (CMS Approved Publication Workflow)

## Release Information
- **Release Version**: `2.6.0`
- **Release Tag**: `v2.6.0-cms-publishing`
- **Deployment Status**: Success / Built & Verified
- **Build Verification**: Clean Next.js static build success

## Summary of Changes
V2.6.0 introduces a quality-gated CMS publishing workflow to manage, review, and roll back Knowledge Base articles.

### 1. CMS Architecture & Schema
- Configured editorial draft manager engine to handle full edit/review states.
- Created schema validators for disease, remedy, lab-test, symptom, and comparison pages.
- Built separate in-memory snapshot and rollback repositories to store revision histories.

### 2. Publication Safety Gates
- Implemented double-confirmation checkboxes (`confirmPublish` and `confirmRollback`) to prevent accidental publish.
- Configured strict PII/PHI scanner to filter patient identifiers from body text.
- Added prohibited clinical claim blocker (cure guarantees).
- Requires cornerstone articles to define at least one valid medical citation.

### 3. Verification Metrics
- 58/58 content validation targets pass successfully.
- Fully isolated from public search index retrieval.
