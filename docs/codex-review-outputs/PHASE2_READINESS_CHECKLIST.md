# Phase 2 Readiness Checklist

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only

## Items Completed

- [x] Phase 1 foundation files are isolated under `src/features/repertory/**`.
- [x] No existing production files were modified in Phase 1.
- [x] No dashboard files were changed.
- [x] No existing API routes were changed.
- [x] No database files or migrations were changed.
- [x] No auth, billing, patient, doctor, public-site, or Clinical OS workflow files were changed.
- [x] Feature flags were added and default to disabled.
- [x] Canonical internal TypeScript interfaces were added.
- [x] Remedy normalization utility was added.
- [x] Read-only adapters were added for:
  - Jethwani-style records;
  - Kent/Boericke-style records;
  - Firestore-style records.
- [x] Isolated test scaffolding was added.
- [x] No production code imports the new foundation yet.
- [x] No live behavior has changed.
- [x] Phase 1.6 expanded the canonical rubric model to represent current production rubric/remedy fields.
- [x] Firestore rubric fields are now representable: `slug`, `parentRubricId`, `description`, `subcategory`, `clinicalPriority`, `createdDate`, `modifiedDate`, `searchWeight`, `clinicalConditions`.
- [x] Dr. Jethwani clinical fields are now representable: `section`, `indexWeights`, `researchCitation`.
- [x] Rich typed repertory fields are now representable: `plainLanguageMeaning`, `classicalWording`, `patientExpressions`, `clinicalKeywords`, `relatedSymptoms`, `relatedDiseases`, `miasmaticWeight`, `intensityScale`, `polarity`, `aggravations`, `ameliorations`, `clinicalNotes`, `author`, `reviewer`, and `confidence`.
- [x] Rich remedy fields are now representable: `keynoteReason`, `sourceReference`, `clinicalExperienceWeight`, `contraindicationNotes`, and `differentialNotes`.
- [x] Negative remedy grades are now preserved with `sourceGrade`, `polarity`, and `isEliminating`.
- [x] Remedy normalization is now reversible through `sourceRemedyId`.
- [x] Unknown future source fields are preserved in adapter `metadata`.
- [x] Adapter tests were expanded for data fidelity cases.

## Items Still Required Before Phase 2 Integration

- [ ] Expand remedy alias coverage using existing remedy metadata.
- [ ] Expand category and clinical-system mappings from the real current dataset.
- [ ] Add fixture-based adapter tests using representative exported records from the real current dataset.
- [ ] Expand canonical session result snapshot typing before any session migration work.
- [ ] Fix local test/build tooling in a separately approved change.

## Safe Next Steps

Recommended Phase 2A, still no live wiring:

1. Add adapter regression fixtures from current exported repertory data shapes.
2. Expand remedy alias coverage using existing remedy metadata.
3. Expand category and clinical-system mappings from the real current dataset.
4. Add canonical typing for session result snapshots, still disconnected from live workflows.
5. Add a pure search-document builder disconnected from live search.
6. Add a pure scoring mirror disconnected from current scoring.
7. Add comparison fixtures proving old and new foundation outputs match expectations.

Do not yet:

- wire into dashboard;
- change existing `/api/repertory/**`;
- change database;
- change current scoring;
- change current search;
- change current repertorization.

## Files Eligible For Phase 2 Work

Eligible isolated files/folders:

- `src/features/repertory/engine/canonicalTypes.ts`
- `src/features/repertory/engine/remedyNormalizer.ts`
- `src/features/repertory/flags/repertoryFlags.ts`
- `src/features/repertory/adapters/legacyJethwaniAdapter.ts`
- `src/features/repertory/adapters/kentBoerickeAdapter.ts`
- `src/features/repertory/adapters/firestoreRubricAdapter.ts`
- `src/features/repertory/__tests__/repertoryFlags.test.ts`
- `src/features/repertory/__tests__/remedyNormalizer.test.ts`
- `src/features/repertory/__tests__/repertoryAdapters.test.ts`

Eligible new files, if approved:

- `src/features/repertory/__tests__/fixtures/*.ts`
- `src/features/repertory/engine/searchDocument.ts`
- `src/features/repertory/engine/scoringMirror.ts`
- `src/features/repertory/engine/dataQualityValidator.ts`
- `src/features/repertory/__tests__/searchDocument.test.ts`
- `src/features/repertory/__tests__/scoringMirror.test.ts`
- `src/features/repertory/__tests__/dataQualityValidator.test.ts`

Existing repertory files that may be inspected for comparison only:

- `src/features/repertory/types/index.ts`
- `src/features/repertory/scoring/repertoryScoring.ts`
- `src/features/repertory/search/repertorySearch.ts`
- `src/features/repertory/data/repertorySeed.ts`
- `src/lib/repertoryData.ts`

Any modification to existing repertory runtime files should require a new approved change plan.

## Files That Must Remain Untouched

Must remain untouched unless a separate explicit approval is given:

- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/dashboard/CIEWorkspace.tsx`
- `src/features/dashboard/**`
- `src/app/api/repertory/**`
- `src/app/api/intake/route.ts`
- `src/app/api/patient/**`
- `src/app/api/invoice/route.ts`
- `src/app/api/onboard-doctor/route.ts`
- `src/app/api/provision-workspace/route.ts`
- `src/app/patient/**`
- `src/app/health-intelligence/**`
- `src/app/store/**`
- `src/app/blogs/**`
- `src/app/knowledge/**`
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/lib/googleDrive.ts`
- `src/lib/adminSession.ts`
- `src/lib/adminApiAuth.ts`
- `firestore.rules`
- `next.config.ts`
- `package.json`
- public site, billing, doctor management, patient management, and authentication files

## Phase 2 Entry Criteria

Phase 2 should start only after:

- [ ] `DATA_MODEL_COMPARISON.md` and `DATA_FIDELITY_REPORT.md` are reviewed.
- [x] The known adapter field-loss risks from Phase 1.5 are fixed in isolated files.
- [x] Negative grade handling is represented without changing scoring.
- [ ] A separate plan is approved for any test/build tooling change.
- [ ] A separate plan is approved before touching any existing runtime file.
