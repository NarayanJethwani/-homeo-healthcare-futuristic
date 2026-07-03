# Changelog Phase 1

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Deployment: not deployed, not pushed to production

## Summary

Implemented the approved Phase 1 foundation only. All code changes are isolated under:

- `src/features/repertory/**`

No dashboard, API, database, auth, billing, patient, doctor, public site, or existing production workflow files were changed.

## Commit 1: `ba71905` Add repertory canonical foundation types

Files changed:

- `src/features/repertory/engine/canonicalTypes.ts`

Purpose:

- Added internal TypeScript interfaces for the future repertory foundation:
  - rubric;
  - remedy;
  - grade;
  - category;
  - clinical system;
  - search result;
  - repertory session;
  - citation;
  - score contribution.
- Added initial centralized grade helpers inside the approved file:
  - `normalizeRemedyGrade`
  - `getRemedyGradeWeight`

Production risk:

- Very low.
- New file only.
- Not imported by live dashboard, APIs, or current scoring.

Rollback:

- Revert commit `ba71905` or delete `src/features/repertory/engine/canonicalTypes.ts`.

## Commit 2: `c15da1b` Add disabled repertory feature flags

Files changed:

- `src/features/repertory/flags/repertoryFlags.ts`
- `src/features/repertory/__tests__/repertoryFlags.test.ts`

Purpose:

- Added future repertory enhancement flags.
- All flags default to disabled unless explicitly set:
  - UI;
  - API;
  - Firestore read;
  - write;
  - score breakdown;
  - AI mapping review;
  - indexed search.

Production risk:

- Very low.
- New files only.
- Not wired into live UI or APIs.

Rollback:

- Revert commit `c15da1b` or delete the two files.

## Commit 3: `20be188` Add repertory remedy normalization utility

Files changed:

- `src/features/repertory/engine/remedyNormalizer.ts`
- `src/features/repertory/__tests__/remedyNormalizer.test.ts`

Purpose:

- Added a pure remedy alias/abbreviation normalizer.
- Added tests for common remedies and grade helper behavior.
- Does not change current scoring or repertorization.

Production risk:

- Very low.
- New files only.
- Not imported by live dashboard, APIs, or current scoring.

Rollback:

- Revert commit `20be188` or delete the two files.

## Commit 4: `c96f429` Add read-only repertory data adapters

Files changed:

- `src/features/repertory/adapters/legacyJethwaniAdapter.ts`
- `src/features/repertory/adapters/kentBoerickeAdapter.ts`
- `src/features/repertory/adapters/firestoreRubricAdapter.ts`
- `src/features/repertory/__tests__/repertoryAdapters.test.ts`

Purpose:

- Added read-only adapter skeletons for existing repertory formats:
  - legacy Dr. Jethwani records;
  - Kent/Boericke JSON records;
  - current Firestore-style rubric records.
- Adapters convert records in memory only.
- No database migration.
- No Firestore writes.
- No API or UI behavior changes.

Production risk:

- Very low.
- New files only.
- Not wired into live UI, APIs, database, or scoring.

Rollback:

- Revert commit `c96f429` or delete the adapter/test files.

## Tests And Checks Run

Passed:

- `git diff --check`

Blocked:

- `npm run build`
  - failed because `next` is not installed in the local workspace: `sh: next: command not found`.
- `npm test`
  - failed because the test script uses `npx tsc`, and without local TypeScript tooling it resolves to the wrong deprecated `tsc` package message: "This is not the tsc command you are looking for".
- Targeted `npx ts-node ...` tests
  - blocked because `ts-node` is not installed locally and network access is restricted, so `npx` could not fetch it.

No dependency or `package.json` changes were made because those were outside the approved Phase 1 file list.

## Production Risk

Overall production risk: very low.

Reason:

- New files only.
- All code isolated to `src/features/repertory/**`.
- No live imports added.
- No route changes.
- No dashboard changes.
- No database changes.
- No scoring changes.
- No deployment or push.

## Rollback Instructions

Fast rollback:

```bash
git revert c96f429 20be188 c15da1b ba71905
```

Manual rollback:

- Delete `src/features/repertory/engine/canonicalTypes.ts`.
- Delete `src/features/repertory/engine/remedyNormalizer.ts`.
- Delete `src/features/repertory/flags/repertoryFlags.ts`.
- Delete `src/features/repertory/adapters/`.
- Delete the three new test files:
  - `src/features/repertory/__tests__/repertoryFlags.test.ts`
  - `src/features/repertory/__tests__/remedyNormalizer.test.ts`
  - `src/features/repertory/__tests__/repertoryAdapters.test.ts`

No database rollback is required.

