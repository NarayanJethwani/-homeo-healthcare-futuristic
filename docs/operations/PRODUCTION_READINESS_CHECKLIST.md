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

## 9. Practitioner Account Lifecycle & User Management Verification
- [ ] Confirm invitation generation prints the raw token exactly once on screen and never writes it to server logs or stores it in database raw fields.
- [ ] Verify `tokenHash` is never exposed in client list/detail API responses.
- [ ] Confirm invitation accept route `/api/admin/invitations/accept` is exempt from admin middleware session checks but timing-safely matches token hashes.
- [ ] Confirm accepting invitation forces the role matching the invite metadata, rejecting user-supplied role override attempts in client payload.
- [ ] Verify duplicate invitations or duplicate active accounts for the same email address are blocked on invitation creation.
- [ ] Verify modifying roles requires `USER_MANAGE` and blocks self-escalation or accidental self-downgrade.
- [ ] Verify subscription extension requires `SUBSCRIPTION_MANAGE` and that general user managers without it are blocked from changing licensing dates.
- [ ] Confirm suspended or deactivated accounts are instantly blocked from accessing the administrative backend.
- [ ] Verify all sensitive lifecycle modifications (inviting, revoking, accepting, role changes, suspensions) emit sanitized audit logger events.

## 10. Practitioner Workspace Profile & Settings Verification
- [ ] Confirm self-service profile edits are restricted to safe fields only (`displayName`, `clinicLocation`, `specialties`) and reject administrative overrides at API boundary.
- [ ] Verify that real-time status check in `authorizeRequest` instantly blocks suspended/deactivated users.
- [ ] Confirm expired subscription users are blocked from clinical routes but can access self-profile/settings.
- [ ] Verify visual preferences (density, default tab) do not alter repertory scoring or bypass legal safety regulations.
- [ ] Confirm security timeline logs retrieve events matching current user only and exclude tokens/secrets.
- [ ] Verify all self-service profile changes create sanitized audit events.

## 11. Patient Attachments & Lab Extraction Verification
- [ ] Confirm all patient attachment API routes are protected by `validatePractitionerPatientAccess`.
- [ ] Verify that unauthenticated dynamic requests return `401 Unauthorized` and unauthorized requests return `403 Forbidden`.
- [ ] Confirm `Cache-Control: no-store` header is present on attachments, details, download, and parameter routes.
- [ ] Verify signed URL expiration is capped at 5 minutes (300 seconds).
- [ ] Confirm archived/deleted attachments block download requests unless super-admin is in audit mode.
- [ ] Verify path matching of `patientId` against the attachment metadata on all detail endpoints.
- [ ] Confirm that storage path generation contains no patient name and matches the standard format.
- [ ] Verify that double extension upload attempts are blocked (e.g. `file.php.pdf`).
- [ ] Verify that binary signature checks successfully block executable files (`MZ`, `ELF`) and text script content.
- [ ] Confirm that lab parameters require manual clinician review and do not alter the Treatment Planner.
- [ ] Verify audit log sanitization completely blocks raw OCR, filenames, patient identifiers, and signed download URLs.

## 12. Clinician-Reviewed Lab Data & Clinical Workspace Verification
- [ ] Confirm all reviewed lab types exist in `src/features/patient-labs/types.ts`.
- [ ] Confirm all lab repository operations verify patient scoping and parameter belongs to active attachment.
- [ ] Verify that parameters from archived or deleted attachments block reviews/confirms.
- [ ] Confirm that only clinician-confirmed or corrected lab parameters enter the reviewed lab timeline.
- [ ] Confirm that corrected entries preserve original value and unit, and store the corrected values separately.
- [ ] Verify that rejected parameters are traceable but excluded from active summaries and timeline logs.
- [ ] Confirm that `confirmedAt` is used as the date for reviewed timeline entries.
- [ ] Confirm that Clinical OS context is read-only and safety comments are present in `clinicalLabContext.ts`.
- [ ] Verify that abnormal lab flags are purely informational and do not alter repertory scoring or prescribing.
- [ ] Verify that `TreatmentPlannerLabReference` cards are display-only and have zero impact on pricing, duration, or remedy recommendations.
- [ ] Confirm that POST review actions, GET timeline, and GET summary route responses contain strict `Cache-Control: no-store` headers.
- [ ] Confirm that audit events are generated for confirms, corrections, and rejections without logging PHI or OCR text.

