# Incident Response Runbooks

This guide outlines action plans for responding to operational emergencies on the Homeo Healthcare Knowledge Platform.

---

## Runbook A: Public Site Down (Outage)

### Symptoms
- Next.js returns 500/504 errors on public routes.
- Front-end is unreachable or times out during loading.

### Action Plan
1. **Rollback**: Trigger an immediate deployment rollback on Vercel to the latest verified stable commit.
2. **Local Logs**: Query Vercel runtime logs and serverless function console logs.
3. **Database Checks**: Verify Firestore connectivity and credentials config.
4. **Build Verification**: Run `npm run verify:production` locally to ensure no missing build targets.
5. **Recovery Check**: Smoke test public routes: `/`, `/knowledge`, `/knowledge/diseases/gerd`.

### Communication Note
*"We are investigating a temporary service interruption on the Knowledge Portal. Clinical OS safety tools remain isolated and operational."*

---

## Runbook B: CMS Publish Failure

### Symptoms
- Editors get errors or timeouts when clicking "Confirm & Promote to Public".
- Approved drafts do not show as published on public routes.

### Action Plan
1. **Identify Draft**: Open `/admin/knowledge-editorial` and locate the draft in question.
2. **Publish Result**: Check the returned `CmsPublishResult` details (e.g., content validation warnings, slug conflicts, or PII blocks).
3. **Write-Back Audit**: Verify if write-back succeeded in `globalKmsRepository` but failed in Firestore due to permission rules.
4. **Rollback availability**: If partially promoted, trigger rollback to the previous version using the admin rollback action.
5. **Unlock Editor**: Clear locks if draft edit locks did not release.

---

## Runbook C: RAG Index / Embedding Queue Failure

### Symptoms
- Stats show out-of-sync or stale vector counts.
- Search queries fallback to keyword Jaccard scoring.
- Indexing queue contains multiple failed jobs with provider errors.

### Action Plan
1. **Check Status**: Open `/admin/knowledge-editorial` and select the **RAG Index Health** tab.
2. **Inspect Errors**: Identify failed embedding jobs and view the exact error details.
3. **Provider Fallback**: If the active provider (e.g. Gemini) is hitting quotas, fall back to keyword scoring. Keyword search is automatic and safe.
4. **Retry Jobs**: Click "Retry Failed Jobs" on the dashboard to process retries up to the 3-attempt limit.
5. **Reindex Stale**: If content mismatch exists, trigger "Reindex Stale Articles".
6. **Draft Leakage check**: Query the retrieval index to confirm no drafts or unapproved content are present.

---

## Runbook D: PHI/PII Telemetry Leakage Risk

### Symptoms
- Patient identifiers (names, IDs, clinical notes) are detected in search analytics or public telemetry logs.

### Action Plan
1. **Disable Telemetry**: Set `NEXT_PUBLIC_TELEMETRY_ENABLED=false` or disable telemetry writing in the API configuration.
2. **Scrub Logs**: Run database delete actions to purge any records containing PII/PHI.
3. **Sanitization Verify**: Check `sanitizePii` filters in the embedding queue payload parameters.
4. **Incident Documentation**: Document what variables leaked, the timeline, and the scrub confirmation.

---

## Runbook E: Google API / Firestore Offline Failures

### Symptoms
- Permission errors (`PERMISSION_DENIED`, status 7) appear in Firestore connections.
- Dashboard stats cards or active queues fail to load.

### Action Plan
1. **Verify Credentials**: Check if `google-services.json` or service account keys are expired or invalid.
2. **Circuit Breaker Check**: Ensure the vector store `isOffline` flag is active to bypass database queries.
3. **Validate Fallback**: Confirm that the platform automatically fell back to in-memory repos and static seed vectors.
4. **Confirm Isolation**: Verify that the public site and Treatment Planner continue working normally.

---

## Runbook F: Clinical OS Link Failure

### Symptoms
- Homeopathic Treatment Planner displays broken links to related remedies or diseases.
- Link clicks result in 404 pages.

### Action Plan
1. **Link Resolver**: Inspect the link resolver logic inside the planner components.
2. **Mock Fallback**: If a knowledge article is missing, the resolver must return `found: false` and the link must degrade to plain text rather than crash.
3. **No Scoring Change**: Confirm that planning logic, remedy scoring, and repertorization tables remain completely untouched.
