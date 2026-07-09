# Production Readiness Checklist

This checklist defines the steps required to certify a release of the Homeo Healthcare Knowledge Platform & Clinical OS as production-ready.

## 1. Build Verification
- [ ] Run `npm run test` and confirm all test suites (including Clinical OS and Persistent Vector Store) pass without failures.
- [ ] Run `npm run lint` and verify there are no ESLint errors.
- [ ] Run `npm run build` and ensure Next.js compiles the optimized bundle successfully.
- [ ] Run `npm run verify:production` to validate operations assets, required file existence, and layout rules.
- [ ] Confirm static routes are generated during the Next.js build.
- [ ] Verify `sitemap.xml` and `robots.txt` are compiled and outputted correctly.
- [ ] Verify that schema validation of metadata passes.

## 2. Public Knowledge Verification
- [ ] Confirm the main Knowledge homepage loads without freezes or errors.
- [ ] Verify disease pages (/knowledge/diseases/[slug]) load correct details.
- [ ] Verify remedy pages (/knowledge/remedies/[slug]) load correct details.
- [ ] Verify symptom pages (/knowledge/symptoms/[slug]) load correct details.
- [ ] Verify lab test pages (/knowledge/lab-tests/[slug]) load correct details.
- [ ] Verify comparison pages (/knowledge/compare/[slug]) load correct details.
- [ ] Confirm the GERD learning path works correctly and saves progress in local storage.
- [ ] Validate canonical URLs (`<link rel="canonical" href="..." />`) on all public endpoints.
- [ ] Verify JSON-LD structured data is present and valid on disease/remedy routes.
- [ ] Ensure NO public UI redesign, style shifts, or layout updates are introduced (Strict UI Freeze).

## 3. Admin Verification
- [ ] Verify `/admin/dashboard` loads and displays the clinical indicators.
- [ ] Verify `/admin/knowledge-editorial` loads without errors.
- [ ] Confirm the Editorial dashboard list renders all CMS drafts and articles.
- [ ] Confirm the **Workflow Tasks** tab displays current tasks and state.
- [ ] Confirm the **CMS Manager** tab renders editor tools, actions, and revision snapshots.
- [ ] Confirm the **RAG Index Health** tab renders correct coverage stats, stale vectors, and queue tasks.
- [ ] Confirm the **Observability & Analytics** tab renders privacy-safe metrics.
- [ ] Verify that AI Assist features remain strictly internal-only and never leak to the public site.

## 4. CMS Verification
- [ ] Verify draft creation, updating, and saving work properly in-memory and in Firestore.
- [ ] Confirm that clinical approval alone does NOT promote content to the public index (requires explicit publish action).
- [ ] Verify that publish action requires explicit confirmation (`confirmPublish: true`).
- [ ] Verify that rollback action requires explicit confirmation (`confirmRollback: true`).
- [ ] Verify that PHI/PII validator blocks draft publication if patient identifiers are detected in the overview or description.
- [ ] Verify that prohibited claims validator blocks publication if cure/guarantee claims are detected.
- [ ] Verify that cornerstone articles must have at least one reference/citation to publish.
- [ ] Confirm the publication result object uses the structured `CmsPublishResult` format.
- [ ] Confirm that the public write-back status is visible on the editorial dashboard.

## 5. RAG Verification
- [ ] Confirm that the vector store status is visible (Online / Memory Fallback).
- [ ] Confirm the RAG index coverage ratio is calculated and displayed.
- [ ] Verify out-of-sync or stale vectors are listed under the stale vector section.
- [ ] Verify failed indexing jobs are listed and log the correct error reason.
- [ ] Verify that the "Process Queue" button executes the embedding job queue.
- [ ] Verify that the "Retry Failed Jobs" button retries failed items up to the attempt limit.
- [ ] Confirm public retrieval matches only published CMS entities; unapproved draft content must be strictly excluded.
- [ ] Confirm that fallback keyword search works if the embedding provider is offline.

## 6. Privacy Verification
- [ ] Confirm that search telemetry and analytics anonymize queries and redact PII patterns.
- [ ] Confirm no patient names, case identifiers, or raw logs are written to the database or telemetry logs.
- [ ] Confirm Clinical OS dashboard analytics are stored as aggregate metrics.
- [ ] Verify that Google API credentials are kept server-side and never exposed to the client bundle.
- [ ] Verify that API routes catch failures gracefully and do not return raw database stack traces in JSON responses.

## 7. Clinical OS Verification
- [ ] Verify the treatment planner logic, safety criteria checks, and contraindications are unchanged.
- [ ] Confirm repertory scoring and remedy rankings match expectations.
- [ ] Verify that Clinical OS reference links are read-only and missing Knowledge links fail safely (return `found: false` without crashing the planner UI).

## 8. Security & RBAC Verification
- [ ] Run `npm run verify:production` to confirm that all admin API routes (excluding `/api/admin/session`) are guarded by `authorizeRequest` or `requireAdminApiSession`.
- [ ] Confirm that no raw stack traces are returned by routes (monitored by the verify script).
- [ ] Confirm that unauthenticated requests to `/api/admin/*` receive the standardized `401 Unauthorized` JSON response.
- [ ] Confirm that authenticated but unauthorized requests to `/api/admin/*` receive the standardized `403 Forbidden` JSON response.
- [ ] Confirm that recursive audit log sanitizer correctly blocks sensitive credential keys, patient names, DOBs, SSNs, and long clinical notes from being logged.
- [ ] Verify that `ALLOW_DEV_ADMIN_BYPASS` bypass safety checks are active and that bypass is rejected when `NODE_ENV === "production"`.
- [ ] Confirm that client-side controls (buttons for Publish, Rollback, Assign) are disabled or hidden when the user role lacks authorization.

