# Release Notes — Version 2.5.0: Content Operations & Editorial Workflow Automation

Version v2.5.0 implements the operational workflow layer to manage clinical publication tasks and reviewer assignments.

## Release Metadata
- **Version**: `v2.5.0`
- **Release Tag**: `v2.5.0-editorial-workflow`
- **Sprint Name**: Sprint 8: Content Operations & Editorial Workflow Automation
- **Date**: 2026-07-09
- **Deployment Status**: Production-Ready

---

## Technical Highlights

### 1. Unified Types & States
Defined state transition interfaces (`EditorialTask`, `EditorialWorkflowEvent`) inside a central workflow type structure in `src/features/knowledge-admin/workflow/types.ts`.

### 2. Hybrid Persistence Engine
Implemented `workflowManager.ts` to manage task lifecycles, clinician reviewer assignments, and state transitions. It queries Firestore as primary storage, and falls back to in-memory buffers when credentials are empty, avoiding interface freezes.

### 3. Automated Curation Task Generator
Developed `taskGenerator.ts` to scan database articles and trigger tasks:
- **Clinical Review**: Cornerstones stale for $>12$ months (Critical priority)
- **Reference Update**: Empty or low citation health (Critical/Medium priority)
- **SEO Improvement**: Search Console CTR $<1.5\%$ or score $<70\%$ (Medium priority)
- **AI Readiness**: Missing summaries or `aiReadinessScore` $<75\%$ (Low priority)

### 4. Admin Workflow Cockpit
Added the **Editorial Workflow** workspace tab to `src/app/admin/knowledge-editorial/page.tsx` rendering task lists, deadline timelines, quick actions, and full chronological audit logging.
