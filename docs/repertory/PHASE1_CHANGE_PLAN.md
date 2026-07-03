# Phase 1 Change Plan: Dr. Jethwani's Clinical Repertory Foundation

Date: 2026-07-03  
Status: Approval required before implementation  
Scope: Dr. Jethwani's Clinical Repertory only

## Purpose

Phase 1 is not a feature launch. It is an engineering foundation pass for the repertory module so future upgrades can be added safely.

Production behavior must remain identical:

- no dashboard redesign;
- no API behavior change;
- no database migration;
- no scoring change;
- no repertorization change;
- no patient/doctor/billing/auth workflow change;
- no public site change.

## Implementation Boundary

Approved work should be isolated under:

- `src/features/repertory/**`

Do not modify in Phase 1 Batch 1:

- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/dashboard/CIEWorkspace.tsx`
- `src/features/dashboard/**`
- `src/app/api/repertory/**`
- `src/app/api/intake/route.ts`
- `src/app/api/patient/**`
- `src/app/api/invoice/route.ts`
- `src/app/patient/**`
- `src/app/health-intelligence/**`
- `src/lib/googleDrive.ts`
- `firestore.rules`
- `package.json`
- `next.config.ts`
- public website, store, blog, doctor-management, billing, and Clinical OS workflow files

## Exact Files To Modify Or Create

Batch 1 should create new files only. No existing production file should be edited.

New files:

- `src/features/repertory/flags/repertoryFlags.ts`
- `src/features/repertory/engine/canonicalTypes.ts`
- `src/features/repertory/engine/remedyNormalizer.ts`
- `src/features/repertory/adapters/legacyJethwaniAdapter.ts`
- `src/features/repertory/adapters/kentBoerickeAdapter.ts`
- `src/features/repertory/adapters/firestoreRubricAdapter.ts`
- `src/features/repertory/__tests__/repertoryFlags.test.ts`
- `src/features/repertory/__tests__/remedyNormalizer.test.ts`
- `src/features/repertory/__tests__/repertoryAdapters.test.ts`

Documentation to create after implementation:

- `outputs/CHANGELOG_PHASE1.md`
- `outputs/PHASE1_COMPLETION_REPORT.md`

## Why Each File Is Modified

### `src/features/repertory/flags/repertoryFlags.ts`

Why:

- centralizes future repertory enhancement switches;
- ensures all future advanced paths are disabled by default;
- prevents accidental production behavior changes.

Expected impact:

- none unless imported by future repertory code;
- no current UI/API behavior change.

Risk level:

- very low.

Rollback:

- delete the file or keep flags unused.

Testing required:

- unit test: all flags default to false when env variables are missing.

### `src/features/repertory/engine/canonicalTypes.ts`

Why:

- introduces clean internal TypeScript interfaces for:
  - Rubric;
  - Remedy;
  - Grade;
  - Category;
  - Clinical System;
  - Search Result;
  - Repertory Session;
  - Source/Citation;
  - Score Contribution.
- prepares future work without replacing current production types.

Expected impact:

- type-only foundation;
- no current behavior change.

Risk level:

- very low.

Rollback:

- delete the file.

Testing required:

- TypeScript compile check when implementation begins.

### `src/features/repertory/engine/remedyNormalizer.ts`

Why:

- centralizes remedy abbreviation and alias normalization;
- reduces future duplicate matching logic;
- keeps normalization pure and isolated.

Expected impact:

- none until explicitly used;
- no scoring change.

Risk level:

- low.

Rollback:

- delete the file.

Testing required:

- unit tests for common remedy abbreviations and full names.

### `src/features/repertory/adapters/legacyJethwaniAdapter.ts`

Why:

- converts the current Dr. Jethwani rubric shape into canonical internal records in memory;
- avoids database migration;
- allows future engines to work with current data safely.

Expected impact:

- none until explicitly used;
- read-only transformation.

Risk level:

- low.

Rollback:

- delete the file.

Testing required:

- fixture tests for Jethwani-style rubric records;
- test that the adapter does not mutate input objects.

### `src/features/repertory/adapters/kentBoerickeAdapter.ts`

Why:

- converts Kent/Boericke-style JSON records into canonical internal records;
- prepares future indexed search and scoring tests without changing current loaders.

Expected impact:

- none until explicitly used;
- no change to `public/data/*.json` or current dashboard hydration.

Risk level:

- low.

Rollback:

- delete the file.

Testing required:

- fixture tests using a few tiny representative records.

### `src/features/repertory/adapters/firestoreRubricAdapter.ts`

Why:

- converts deployed Firestore-style rubric records into canonical internal records;
- bridges the current API shape and future engine shape without migrating Firestore.

Expected impact:

- none until explicitly used;
- no Firestore read/write changes.

Risk level:

- low.

Rollback:

- delete the file.

Testing required:

- fixture tests for fields such as `id`, `name`, `remedies`, `keywords`, `modalities`, `miasms`, `organSystem`, and `researchCitation`.

### `src/features/repertory/__tests__/repertoryFlags.test.ts`

Why:

- proves the feature-flag safety contract.

Expected impact:

- test-only.

Risk level:

- very low.

Rollback:

- delete the file.

Testing required:

- run targeted test directly.

### `src/features/repertory/__tests__/remedyNormalizer.test.ts`

Why:

- protects remedy normalization from accidental regression.

Expected impact:

- test-only.

Risk level:

- very low.

Rollback:

- delete the file.

Testing required:

- run targeted test directly.

### `src/features/repertory/__tests__/repertoryAdapters.test.ts`

Why:

- proves adapters are read-only, safe, and tolerant of partial records.

Expected impact:

- test-only.

Risk level:

- very low.

Rollback:

- delete the file.

Testing required:

- run targeted test directly.

## Expected Impact

User-visible impact:

- none.

Production workflow impact:

- none.

Database impact:

- none.

API impact:

- none.

Dashboard/UI impact:

- none.

Performance impact:

- none in production, because new code is not wired into runtime paths.

Maintainability impact:

- positive;
- creates clean boundaries for future flags, types, normalization, and adapter work.

## Rollback Strategy

Because Batch 1 creates unused isolated files only, rollback is simple:

1. Delete the new files listed above.
2. Confirm no dashboard/API/database files changed.
3. Re-run targeted checks if needed.

No database rollback is needed.  
No Vercel config rollback is needed.  
No route rollback is needed.  
No dashboard rollback is needed.

## Risk Level

Overall risk: very low if implemented exactly as planned.

Risk becomes medium or high if the implementation edits:

- dashboard files;
- existing API routes;
- shared auth files;
- Firestore rules;
- package scripts/dependencies;
- public site files;
- patient/doctor/billing modules.

Those edits are explicitly not part of Batch 1.

## Estimated Testing Required

Minimum required tests after implementation:

- targeted TypeScript execution for:
  - `repertoryFlags.test.ts`;
  - `remedyNormalizer.test.ts`;
  - `repertoryAdapters.test.ts`.

Recommended checks:

- inspect `git diff --stat`;
- confirm changed files are only in `src/features/repertory/**`;
- confirm no route/dashboard/API/shared files changed;
- run existing repertory test if the local test runner is healthy.

Known test-runner caution:

- Previous `npm test` was blocked by local TypeScript/NPM resolution issues in this environment.
- Batch 1 should avoid changing `package.json`.
- If full test runner remains unhealthy, document the blocker in `CHANGELOG_PHASE1.md` and run direct targeted tests where possible.

## Proposed Small Commit Sequence

Commit 1: Repertory feature flags

- Add `src/features/repertory/flags/repertoryFlags.ts`.
- Add `src/features/repertory/__tests__/repertoryFlags.test.ts`.

Commit 2: Canonical repertory foundation types

- Add `src/features/repertory/engine/canonicalTypes.ts`.

Commit 3: Remedy normalization utility

- Add `src/features/repertory/engine/remedyNormalizer.ts`.
- Add `src/features/repertory/__tests__/remedyNormalizer.test.ts`.

Commit 4: Read-only data adapters

- Add `src/features/repertory/adapters/legacyJethwaniAdapter.ts`.
- Add `src/features/repertory/adapters/kentBoerickeAdapter.ts`.
- Add `src/features/repertory/adapters/firestoreRubricAdapter.ts`.
- Add `src/features/repertory/__tests__/repertoryAdapters.test.ts`.

Commit 5: Phase 1 changelog

- Add `outputs/CHANGELOG_PHASE1.md`.

Commit 6: Phase 1 completion report

- Add `outputs/PHASE1_COMPLETION_REPORT.md`.

## Explicit Non-Goals For Phase 1 Batch 1

Do not implement:

- UI redesign;
- dashboard tab changes;
- API route changes;
- database migration;
- Firestore repository wiring;
- scoring algorithm changes;
- repertorization behavior changes;
- AI intake changes;
- new production routes;
- import/export changes;
- public site edits.

## Approval Gate

Implementation should start only after explicit approval of this plan and the exact file list.

