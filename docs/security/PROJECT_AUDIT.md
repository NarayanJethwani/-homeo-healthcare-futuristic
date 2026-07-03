# Project Audit: Dr. Jethwani's Clinical Repertory / Homeo Healthcare

Audit date: 2026-07-03  
Repository inspected: `work/homeo-healthcare-futuristic` cloned from `NarayanJethwani/-homeo-healthcare-futuristic`  
Live site checked: `https://www.homeo.healthcare/admin/dashboard`

## Executive Summary

The project has a serious clinical ambition and several good foundations: a protected admin route, Firebase-backed authentication, a modular repertory feature, classical Kent/Boericke datasets, structured remedy grading, reasoning panels, import/export work, and repeated "clinician review only" language inside the newer repertory UI.

The main risk is that the repertory exists in multiple partially connected systems:

- The newer typed repertory module uses an in-memory repository.
- The deployed API uses Firestore records with a different schema.
- The admin dashboard contains older, very large, client-heavy repertory logic.
- Public deployed API routes expose large repertory data without admin session checks.

This should be stabilized before adding more AI features. The next stage should focus on a canonical database schema, one scoring engine, role-protected APIs, indexed search, and a clinician-grade case workbench.

## Strengths

- Next.js app with clear deployment target and Vercel-compatible config.
- Firebase Auth and admin session cookie flow exist.
- `/admin/dashboard` on the live site redirects unauthenticated users to `/admin/login?next=/admin/dashboard`.
- Security headers are configured globally: CSP frame restrictions, referrer policy, `nosniff`, `X-Frame-Options`, permissions policy.
- Large repertory sources are present:
  - Kent JSON: 64,177 records, about 20.6 MB.
  - Boericke JSON: 7,288 records, about 2.7 MB.
  - Public static files exist under `public/data`.
- New repertory module has a strong typed model:
  - `RepertoryRubric`
  - `GradedRemedy`
  - `GraphTriple`
  - `AIIntakeMappingResult`
  - `ScoringResult`
  - reasoning/safety UI components.
- Remedy entries support grades, confidence, source references, clinical weight, contraindication notes, and differential notes.
- The modular workbench includes search, selected rubric workbench, intake parsing, scoring, differentiations, confidence breakdowns, missing information, and suggested questions.
- Safety language exists in the newer repertory components: "for clinician review only" and "Do not prescribe automatically."
- Firestore rules contain patient isolation logic for `patients/{patientId}` by assigned doctor or admin.
- There are early tests for repertory search/scoring/validation and AI routing/RAG behavior.

## Weaknesses

- Architecture is split between old and new repertory systems.
  - `src/features/repertory/database/repertoryDb.ts` always uses `MemoryRepertoryRepository`.
  - `src/features/repertory/repositories/FirestoreRepertoryRepository.ts` is a stub returning empty results.
  - `src/app/api/repertory/*` uses Firestore documents with fields like `id`, `name`, `remedies`, `keywords`.
  - New typed module uses fields like `rubricId`, `title`, `relatedRemedies`, `miasmaticWeight`.
- The admin dashboard is too large for safe iteration:
  - `src/app/admin/dashboard/page.tsx` is about 30,014 lines.
  - `src/app/admin/dashboard/CIEWorkspace.tsx` is about 5,478 lines.
- The app has both clinician-grade safety phrasing and stronger public marketing language such as "heal eczema", "dissolved my kidney stone", "natural dissolution", and "prevent future disease recurrences." These claims should be legally/clinically reviewed.
- Repertory search is keyword/token based, not a professional indexed search engine.
- AI intake parsing is rule-based matching, not a traceable clinical NLP workflow with candidate review, negative findings, uncertainty, and clinician approval states.
- Scoring is promising but not yet auditable enough for professional repertorization:
  - formula is code-embedded;
  - no per-remedy full contribution table in the API result;
  - confidence is partly coverage ratio, not calibrated clinical certainty;
  - thermal alignment logic appears fragile.
- Vercel deployment may be stressed by returning the full repertory JSON payload from `/api/repertory`.

## Bugs Or Risks

- Public deployed `/api/repertory` returns the full Kent, Boericke, and Jethwani datasets without an admin session. This is large and potentially unsuitable for a protected clinical workbench API.
- Public deployed `/api/repertory/search?q=panic` returns active Firestore rubric data without login.
- Several repertory API routes do not call `requireAdminApiSession`, including `route.ts`, `search`, and `repertorize`.
- `src/app/api/repertory/repertorize/route.ts` accepts `patientId` and `userId` from request JSON and writes a session to Firestore without server-side session identity.
- Firestore rules allow any authenticated user to write `rubrics`, `synonyms`, `repertorization_sessions`, `settings`, and `ai_telemetry_logs`. This is too broad for clinical data governance.
- `src/lib/adminSession.ts` logs signature values and decoded session payloads. This leaks sensitive operational/session details into logs.
- `dangerouslySetInnerHTML` is used for materia medica, print/report content, research digest, and chat/message content. If any upstream content is user-controlled or AI-generated, this is an XSS risk.
- Dashboard session state relies on `localStorage` for UI identity refresh, even though middleware uses an HttpOnly cookie for route protection.
- The test command failed in this environment:
  - first due to local npm cache permissions outside the project;
  - then with a temporary cache because `npx tsc` attempted to install deprecated `tsc@2.0.4`, meaning TypeScript was not resolvable from the current install path.
- The test suite is not currently a reliable deployment gate.

## Missing Features

- Canonical production database schema for repertory data.
- Schema migration path from current Firestore rubric shape to typed `RepertoryRubric`.
- Full rubric hierarchy: source -> chapter -> rubric -> subrubric -> modality/location/time/extension.
- Remedy synonym/abbreviation authority table.
- Source provenance model with author, edition, page/reference, license/public-domain status, reviewer, and confidence.
- Indexed search with typo tolerance, synonym expansion, filters, and ranked results at scale.
- Case session model that persists selected rubrics, exclusions, intensity, modality, chronology, and clinician notes.
- Explicit "AI-suggested" vs "clinician-confirmed" rubric state.
- Audit log for every AI mapping, rubric edit, repertorization run, and prescription export.
- Role-based permission matrix for admin, doctor, assistant, reviewer, and read-only auditor.
- Data quality dashboard for duplicates, weak citations, unsupported claims, invalid remedy codes, orphan rubrics, and generated synthetic-looking rubrics.
- Load/performance tests for 70k+ repertory records.

## Security Issues

- Protect all admin/workbench API routes with `requireAdminApiSession`.
- Enforce role checks on all write operations.
- Tighten Firestore rules:
  - `rubrics` write only admin/reviewer.
  - `synonyms` write only admin/reviewer.
  - `repertorization_sessions` read/write only owning doctor/admin.
  - `settings` write admin only.
  - `ai_telemetry_logs` write server only if possible; read admin only.
- Remove session signature and decoded payload logging.
- Sanitize all HTML before rendering or replace with safe Markdown rendering.
- Add request size limits and validation to repertory save/import/repertorize endpoints.
- Avoid public full-dataset API responses unless intentionally designed as a public dataset endpoint with pagination and caching.

## Database/Data Quality Issues

- Two incompatible repertory schemas coexist.
- `public/data/jethwaniRepertoryData.json` is small, while Firestore appears to hold a much larger generated clinical dataset.
- Deployed search results contain many synthetic-looking rubrics such as repeated "Panic disorder with palpitations and sweating..." combinations with generated journal-style citations. These need human clinical review before being treated as authoritative.
- Many records have empty synonyms in deployed search results.
- `category` values differ between systems: typed categories like `Mental & Emotional` versus deployed `Section A`, `Section D`, `Section F`.
- Remedy grades are inconsistent across systems:
  - typed module uses `relatedRemedies: GradedRemedy[]` with grade 1-4;
  - deployed Firestore/API uses `remedies: { [abbr]: number }`, often 1-3.
- Classical Kent/Boericke data is available but not normalized into the same hierarchy and provenance model as custom rubrics.

## File References

- `src/features/repertory/database/repertoryDb.ts`: in-memory repository selection.
- `src/features/repertory/repositories/FirestoreRepertoryRepository.ts`: unimplemented Firestore repository.
- `src/features/repertory/types/index.ts`: strongest current schema design.
- `src/features/repertory/search/repertorySearch.ts`: typed module search/intake matching.
- `src/features/repertory/scoring/repertoryScoring.ts`: typed module scoring.
- `src/app/api/repertory/route.ts`: public full dataset API.
- `src/app/api/repertory/search/route.ts`: Firestore search API.
- `src/app/api/repertory/repertorize/route.ts`: Firestore scoring/session API.
- `src/app/admin/dashboard/page.tsx`: legacy/large admin dashboard and repertory logic.
- `src/app/admin/dashboard/CIEWorkspace.tsx`: clinical workspace UI and report rendering.
- `firestore.rules`: current Firestore access rules.
- `middleware.ts`, `src/lib/adminSession.ts`, `src/lib/adminApiAuth.ts`: admin route/session layer.

## Live Site Notes

- `https://www.homeo.healthcare/admin/dashboard` returned HTTP 307 to `/admin/login?next=%2Fadmin%2Fdashboard`.
- Login page visible text: "Clinical Hub Login", "Dr. Jethwani's Professional Portal", "Clinical Email", "Secure Password", "Sign In".
- Authenticated dashboard screens could not be inspected without credentials.
- `https://www.homeo.healthcare/api/repertory/search?q=panic` returned HTTP 200 with 59 rubric records.
- `https://www.homeo.healthcare/api/repertory` returned HTTP 200 and streamed a very large JSON payload.

