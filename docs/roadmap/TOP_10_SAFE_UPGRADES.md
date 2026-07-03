# Top 10 Safe Upgrades For Dr. Jethwani's Clinical Repertory

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Status: Planning only. No code implementation approved yet.

## Simple Summary

The safest path is to improve the repertory by building a new protected engine beside the existing one, not by replacing the working dashboard. The existing Homeo Healthcare site, portal workflows, Clinical OS, patient flows, doctor flows, billing, Google Sheets, and public pages should remain untouched.

Every upgrade below is small, reversible, and designed to be disabled by default.

## 1. Add Repertory-Only Feature Flags

Purpose: make sure all new repertory work is off unless explicitly enabled.

Likely files:

- `src/features/repertory/flags/repertoryFlags.ts`
- `src/features/repertory/__tests__/repertoryFlags.test.ts`

Safety:

- No dashboard changes.
- No API behavior changes.
- No database changes.
- Rollback is simply deleting the new files or leaving all flags false.

## 2. Add Canonical Repertory Types Beside Existing Types

Purpose: define a clean internal shape for rubrics, remedies, grades, sources, and scoring without changing current production data.

Likely files:

- `src/features/repertory/engine/canonicalTypes.ts`
- `src/features/repertory/__tests__/canonicalTypes.test.ts`

Safety:

- Pure TypeScript types only.
- Existing `src/features/repertory/types/index.ts` remains untouched initially.
- No runtime behavior changes.

## 3. Add Pure Data Adapters

Purpose: safely translate existing data shapes into the new canonical shape in memory.

Likely files:

- `src/features/repertory/adapters/legacyJethwaniAdapter.ts`
- `src/features/repertory/adapters/kentBoerickeAdapter.ts`
- `src/features/repertory/adapters/firestoreRubricAdapter.ts`
- `src/features/repertory/__tests__/repertoryAdapters.test.ts`

Safety:

- Read-only.
- No Firestore writes.
- No data migration.
- Existing APIs and UI keep using current data until approved.

## 4. Add Remedy Abbreviation Normalization

Purpose: make remedy matching safer by normalizing aliases like `Nux-v`, `Nux Vomica`, and spelling variations.

Likely files:

- `src/features/repertory/engine/remedyNormalizer.ts`
- `src/features/repertory/__tests__/remedyNormalizer.test.ts`

Safety:

- Pure function.
- No existing scoring change until manually wired later.

## 5. Add A Transparent Scoring Engine In Parallel

Purpose: build a clearer scoring engine that returns per-rubric contribution details, while the current scoring stays unchanged.

Likely files:

- `src/features/repertory/engine/scoringEngine.ts`
- `src/features/repertory/engine/scoreBreakdown.ts`
- `src/features/repertory/__tests__/scoringEngine.test.ts`

Safety:

- Not connected to production UI initially.
- Does not replace `src/features/repertory/scoring/repertoryScoring.ts`.
- Output can be compared against current results before rollout.

## 6. Add Case Completeness And Missing Information Checks

Purpose: show clinicians what is missing before interpreting remedy rankings.

Likely files:

- `src/features/repertory/engine/caseCompleteness.ts`
- `src/features/repertory/__tests__/caseCompleteness.test.ts`

Safety:

- Pure analysis only.
- No prescription behavior.
- Supports clinician review language.

## 7. Add Read-Only Data Quality Validator

Purpose: identify duplicate rubrics, missing citations, unsupported claims, weak synonyms, and invalid remedy IDs without editing data.

Likely files:

- `src/features/repertory/engine/dataQualityValidator.ts`
- `src/features/repertory/__tests__/dataQualityValidator.test.ts`

Safety:

- Read-only.
- Does not change Firestore.
- Does not delete or rewrite rubrics.

## 8. Add Search Document Builder For Future Indexed Search

Purpose: prepare rubric records for better search later without changing the current search API.

Likely files:

- `src/features/repertory/engine/searchDocument.ts`
- `src/features/repertory/__tests__/searchDocument.test.ts`

Safety:

- Pure transformation.
- No search route changes.
- No external search service.

## 9. Add Disabled Repertory V2 API Routes

Purpose: create safe API shells that return "disabled" unless a server flag is enabled.

Likely files:

- `src/app/api/repertory-v2/search/route.ts`
- `src/app/api/repertory-v2/repertorize/route.ts`
- `src/app/api/repertory-v2/validate/route.ts`
- `src/features/repertory/api/repertoryApiSafety.ts`

Safety:

- New route namespace only.
- Existing `/api/repertory/*` routes stay unchanged.
- Disabled by default.
- Requires explicit approval before implementation.

## 10. Add A Feature-Flagged UI Preview Wrapper

Purpose: allow a future preview panel without disturbing the current dashboard or Nexus Atlas.

Likely files:

- `src/features/repertory/components-v2/RepertoryV2Preview.tsx`
- `src/features/repertory/components-v2/index.ts`

Safety:

- Not wired into dashboard initially.
- Renders nothing unless `NEXT_PUBLIC_REPERTORY_V2_ENABLED=true`.
- No changes to `src/app/admin/dashboard/page.tsx` unless separately approved.

## Files To Avoid For These First Upgrades

Do not touch these during the first safe upgrades:

- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/dashboard/CIEWorkspace.tsx`
- `src/features/dashboard/**`
- `src/app/page.tsx`
- `src/app/patient/**`
- `src/app/health-intelligence/**`
- `src/app/api/intake/route.ts`
- `src/app/api/patient/**`
- `src/app/api/invoice/route.ts`
- `src/lib/googleDrive.ts`
- public site, store, blog, billing, doctor management, and patient workflow files

## Approval Required Before Implementation

Before any code is written, approve the exact first batch and the exact file list. Any change touching shared files such as `package.json`, `firestore.rules`, `next.config.ts`, `src/lib/adminSession.ts`, or dashboard files needs separate risk documentation first.

