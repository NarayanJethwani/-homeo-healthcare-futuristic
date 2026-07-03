# First Implementation Batch: Repertory-Only, Safe, Reversible

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Status: Planning only. Do not implement until approved.

## Batch Goal

Create a safe foundation for a future world-class repertory engine without changing current production behavior.

This batch only adds isolated files under `src/features/repertory`. It does not touch the stable dashboard, public site, portal workflows, patient workflows, doctor workflows, billing, Google Drive/Sheets, or existing repertory APIs.

## Simple Explanation

The first batch should be boring on purpose. It should add flags, types, adapters, and tests. Nothing should be connected to production screens yet. Nothing should write to the database. Nothing should replace the current repertory workbench.

## Exact Files Proposed For First Batch

New files only:

- `src/features/repertory/flags/repertoryFlags.ts`
- `src/features/repertory/engine/canonicalTypes.ts`
- `src/features/repertory/engine/remedyNormalizer.ts`
- `src/features/repertory/adapters/legacyJethwaniAdapter.ts`
- `src/features/repertory/adapters/kentBoerickeAdapter.ts`
- `src/features/repertory/adapters/firestoreRubricAdapter.ts`
- `src/features/repertory/__tests__/repertoryFlags.test.ts`
- `src/features/repertory/__tests__/remedyNormalizer.test.ts`
- `src/features/repertory/__tests__/repertoryAdapters.test.ts`

No existing files should be edited in Batch 1 unless approval is given after reviewing this plan.

## Files Explicitly Not Touched In Batch 1

- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/dashboard/CIEWorkspace.tsx`
- `src/features/repertory/components/RepertoryWorkbench.tsx`
- `src/features/repertory/scoring/repertoryScoring.ts`
- `src/features/repertory/search/repertorySearch.ts`
- `src/app/api/repertory/**`
- `src/app/api/repertory-v2/**`
- `src/features/dashboard/**`
- `src/app/patient/**`
- `src/app/health-intelligence/**`
- `src/app/api/intake/route.ts`
- `src/app/api/patient/**`
- `src/app/api/invoice/route.ts`
- `src/lib/googleDrive.ts`
- `firestore.rules`
- `package.json`
- `next.config.ts`

## Batch 1 Tasks

1. Create `src/features/repertory/flags/repertoryFlags.ts`.
2. Default every repertory v2 flag to false.
3. Include flags for UI, API, Firestore read, write, score breakdown, AI mapping review, and indexed search.
4. Add tests proving missing environment variables produce disabled flags.
5. Add `src/features/repertory/engine/canonicalTypes.ts`.
6. Define canonical rubric, remedy, remedy grade, source, citation, and scoring contribution types.
7. Keep canonical types separate from existing production types.
8. Add `src/features/repertory/engine/remedyNormalizer.ts`.
9. Add a small alias map for common remedy abbreviation normalization.
10. Add tests for common abbreviations and full names.
11. Add `src/features/repertory/adapters/legacyJethwaniAdapter.ts`.
12. Convert current Jethwani-style records into canonical records in memory.
13. Do not import live dashboard state.
14. Do not write adapted records anywhere.
15. Add tests using small fixture objects.
16. Add `src/features/repertory/adapters/kentBoerickeAdapter.ts`.
17. Convert Kent/Boericke-style records into canonical records in memory.
18. Add tests using 2-3 fixture records only.
19. Add `src/features/repertory/adapters/firestoreRubricAdapter.ts`.
20. Convert deployed Firestore-style rubric records into canonical records in memory.
21. Add tests for `id`, `name`, `remedies`, `keywords`, `modalities`, and `miasms` fields.
22. Add tests proving adapters are non-mutating.
23. Add tests proving missing optional fields do not crash adapters.
24. Add tests proving unsupported or incomplete records are marked as warnings, not silently trusted.
25. Run only targeted repertory tests for the new pure functions.

## Acceptance Criteria

Batch 1 is successful if:

- all new flags default to disabled;
- all new code is isolated under `src/features/repertory`;
- no production dashboard files are changed;
- no existing APIs are changed;
- no database read/write behavior changes;
- adapter tests pass with fixture data;
- existing production behavior is untouched.

## Rollback Plan

Rollback is simple:

- delete the new files added in Batch 1;
- or leave them unused, since nothing is wired into production;
- no database rollback is needed;
- no dashboard rollback is needed;
- no public site rollback is needed.

## Risk Level

Low, if implemented exactly as listed.

Risk increases if Batch 1 edits any of these shared files:

- `src/app/admin/dashboard/page.tsx`
- `src/app/api/repertory/**`
- `firestore.rules`
- `package.json`
- `next.config.ts`
- `src/lib/**`

Any such edit should be moved to a later batch with separate approval.

## Not In This Batch

Do not implement:

- new dashboard UI;
- new API routes;
- existing API protection changes;
- Firestore repository implementation;
- database migration;
- import/export changes;
- scoring replacement;
- AI intake replacement;
- feature-flagged dashboard insertion;
- public site copy changes.

## Approval Request For Future Work

Before implementation, approve Batch 1 and the exact file list above. After Batch 1, the next safe batch should add a pure scoring engine and score breakdown tests, still disconnected from production UI and APIs.

