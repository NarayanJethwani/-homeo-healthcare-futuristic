# Repertory-Only Upgrade Plan

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory module only  
Rule: preserve existing production behavior unless a specific change is reviewed and approved

## Operating Principle

This plan does not redesign Homeo Healthcare, the Clinical OS, the patient portal, doctor dashboard workflows, billing, Google Workspace automation, public site pages, AI assistant pages, or general dashboard modules.

The upgrade should happen as an isolated repertory engine behind feature flags, with small reversible changes. Existing flows should continue to use the current implementation until a new repertory path is explicitly enabled and validated.

## Exact Files Related Only To Dr. Jethwani's Clinical Repertory

Primary repertory feature folder:

- `src/features/repertory/README.md`
- `src/features/repertory/index.ts`
- `src/features/repertory/types/index.ts`
- `src/features/repertory/database/repertoryDb.ts`
- `src/features/repertory/repositories/RepertoryRepository.ts`
- `src/features/repertory/repositories/MemoryRepertoryRepository.ts`
- `src/features/repertory/repositories/FirestoreRepertoryRepository.ts`
- `src/features/repertory/search/repertorySearch.ts`
- `src/features/repertory/scoring/repertoryScoring.ts`
- `src/features/repertory/graph/repertoryGraph.ts`
- `src/features/repertory/import-export/importExportService.ts`
- `src/features/repertory/validators/databaseValidator.ts`
- `src/features/repertory/data/repertorySeed.ts`
- `src/features/repertory/data/caseScenarios.ts`
- `src/features/repertory/reasoning/confidenceEngine.ts`
- `src/features/repertory/reasoning/differentialEngine.ts`
- `src/features/repertory/reasoning/evidenceBreakdown.ts`
- `src/features/repertory/reasoning/explanationBuilder.ts`
- `src/features/repertory/reasoning/questionGenerator.ts`
- `src/features/repertory/reasoning/reasoningEngine.ts`
- `src/features/repertory/components/RepertoryWorkbench.tsx`
- `src/features/repertory/components/ConfidenceBreakdown.tsx`
- `src/features/repertory/components/ConfidenceBreakdownPanel.tsx`
- `src/features/repertory/components/DifferentialComparison.tsx`
- `src/features/repertory/components/MissingInformationCard.tsx`
- `src/features/repertory/components/ReasoningTimeline.tsx`
- `src/features/repertory/components/RemedyReasoningPanel.tsx`
- `src/features/repertory/components/RubricCoverageHeatmap.tsx`
- `src/features/repertory/components/SuggestedQuestions.tsx`
- `src/features/repertory/__tests__/repertory.test.ts`

Current repertory API routes:

- `src/app/api/repertory/route.ts`
- `src/app/api/repertory/search/route.ts`
- `src/app/api/repertory/repertorize/route.ts`
- `src/app/api/repertory/details/route.ts`
- `src/app/api/repertory/save/route.ts`
- `src/app/api/repertory/delete/route.ts`
- `src/app/api/repertory/seed/route.ts`

Repertory data files:

- `src/lib/repertoryData.ts`
- `src/lib/repertoryData.js`
- `src/lib/repertoryDbService.ts`
- `src/lib/kentRepertoryData.json`
- `src/lib/boerickeRepertoryData.json`
- `public/data/kentRepertoryData.json`
- `public/data/boerickeRepertoryData.json`
- `public/data/jethwaniRepertoryData.json`

Shared-but-repertory-adjacent files that require risk documentation before editing:

- `src/lib/citations.ts`
- `src/lib/remedyGenomeSchema.ts`
- `src/lib/remedyDataPack.json`
- `src/lib/searchAndCompare.ts`
- `src/lib/searchEngine.ts`
- `src/lib/clinicalDecisionSupport.ts`
- `src/lib/knowledgeGraph.ts`
- `src/lib/materiaMedicaData.ts`
- `src/lib/materiaMedicaService.ts`
- `src/lib/canonicalSchema.ts`
- `src/lib/normalizationEngine.ts`
- `firestore.rules`
- `src/lib/adminApiAuth.ts`
- `src/lib/adminSession.ts`
- `next.config.ts`
- `package.json`

Dashboard integration surfaces only. These should not be broadly refactored:

- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/dashboard/CIEWorkspace.tsx`
- `src/features/dashboard/components/AdminSidebar.tsx`
- `src/features/dashboard/components/GlobalCommandPalette.tsx`

Any edit to dashboard files must be a tiny feature-flagged insertion point or import boundary, never a dashboard restructure.

## Files That Must Not Be Touched

Unless separately approved, do not edit:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/about/page.tsx`
- `src/app/services/page.tsx`
- `src/app/store/**`
- `src/app/blogs/**`
- `src/app/contact*/**`
- `src/app/dr-narayan-jethwani/**`
- `src/app/evidence-based-homeopathy/**`
- `src/app/knowledge/**`
- `src/app/health-intelligence/**`
- `src/app/patient/**`
- `src/app/api/intake/route.ts`
- `src/app/api/patient/**`
- `src/app/api/invoice/route.ts`
- `src/app/api/onboard-doctor/route.ts`
- `src/app/api/provision-workspace/route.ts`
- `src/app/api/import-*`
- `src/app/api/export-*`, except only if specifically needed for repertory export and approved
- `src/app/api/consult-ai/route.ts`
- `src/app/api/ai-diagnostics/route.ts`, unless only adding a repertory-engine adapter and approved
- `src/components/**`, except no-touch unless a repertory component currently imports it
- `src/features/dashboard/**`, except narrow navigation/feature-flag entry point and approved
- Google Drive/Sheets workflow files such as `src/lib/googleDrive.ts`
- billing, invoice, doctor management, patient queue, public site, store, blog, SEO, and PWA modules

## Current Repertory Architecture

There are three current repertory layers:

1. Legacy dashboard repertory logic inside `src/app/admin/dashboard/page.tsx`
   - Loads Kent, Boericke, and Jethwani repertory data.
   - Manages `selectedRubrics`, `selectedJethwaniRubrics`, filters, custom rubric builder, favorites, recents, and scoring.
   - Uses `src/lib/repertoryData.ts` and `public/data/*.json`.
   - Integrates with existing dashboard case workflows and export-to-sheet behavior.

2. New modular repertory feature under `src/features/repertory`
   - Has stronger TypeScript models, search, scoring, reasoning, validation, and UI panels.
   - Currently uses `MemoryRepertoryRepository` through `src/features/repertory/database/repertoryDb.ts`.
   - `FirestoreRepertoryRepository` exists but is a stub.

3. Repertory API routes under `src/app/api/repertory`
   - Use Firestore and local JSON fallback.
   - Current API shape differs from the modular feature shape.
   - Important routes include search, repertorize, save, delete, seed, details, and full data load.

The safe upgrade path is to build an isolated canonical engine and adapters, then gradually route only the repertory module to it behind flags.

## Safe Upgrade Strategy

- Keep existing dashboard behavior as the default.
- Introduce new code inside `src/features/repertory` or a new isolated subfolder.
- Do not remove legacy functions.
- Do not modify patient, billing, doctor, public site, or Clinical OS modules.
- Use feature flags for every new path.
- Add compatibility adapters instead of database migration.
- Add read-only validation first.
- Add new APIs with new route names before changing existing APIs.
- Keep old APIs active until the new path has matched results in tests.
- Use small commits with one reversible purpose each.

## Proposed Isolated Folder/Module Structure

Add only under `src/features/repertory`:

- `src/features/repertory/engine/`
  - `canonicalTypes.ts`
  - `normalizeRubric.ts`
  - `remedyNormalizer.ts`
  - `scoringEngine.ts`
  - `scoreBreakdown.ts`
  - `caseCompleteness.ts`
  - `differentialRules.ts`

- `src/features/repertory/adapters/`
  - `legacyJethwaniAdapter.ts`
  - `kentBoerickeAdapter.ts`
  - `firestoreRubricAdapter.ts`
  - `apiResponseAdapter.ts`

- `src/features/repertory/flags/`
  - `repertoryFlags.ts`

- `src/features/repertory/api/`
  - shared route helpers for validation, pagination, and session-safe operations.

- `src/features/repertory/components-v2/`
  - only if a feature-flagged new UI is approved.
  - do not replace `RepertoryWorkbench.tsx` initially.

- `src/features/repertory/__tests__/`
  - add tests beside the existing repertory test file.

Optional new API namespace, safer than changing current APIs immediately:

- `src/app/api/repertory-v2/search/route.ts`
- `src/app/api/repertory-v2/repertorize/route.ts`
- `src/app/api/repertory-v2/validate/route.ts`

These routes should be disabled unless the feature flag is enabled.

## Feature Flag Plan

Use environment flags with safe defaults:

- `NEXT_PUBLIC_REPERTORY_V2_ENABLED=false`
- `REPERTORY_V2_API_ENABLED=false`
- `REPERTORY_V2_READ_FROM_FIRESTORE=false`
- `REPERTORY_V2_WRITE_ENABLED=false`
- `REPERTORY_V2_SHOW_SCORE_BREAKDOWN=false`
- `REPERTORY_V2_AI_MAPPING_REVIEW=false`
- `REPERTORY_V2_USE_INDEXED_SEARCH=false`

Rules:

- Public/client flags can only show or hide UI.
- Server flags must control API behavior.
- Write flags stay false until explicitly approved.
- If a flag is missing, default to old production behavior.
- Feature flags should be read in repertory-only files, not global platform files.

## Database Safety Plan

- No database migration in the first implementation wave.
- No destructive updates to existing Firestore collections.
- First database work should be read-only:
  - inspect rubric shape;
  - normalize in memory;
  - validate data quality;
  - compare output with existing search/scoring.
- Any new storage should use new collections only and only after approval, for example:
  - `repertory_v2_shadow_rubrics`
  - `repertory_v2_validation_reports`
  - `repertory_v2_runs`
- Never overwrite `rubrics` records during initial upgrade.
- Never delete existing rubrics.
- Any write path must:
  - require admin/reviewer role;
  - record old/new snapshots;
  - support rollback;
  - be feature-flagged.

## API Safety Plan

- Prefer new `repertory-v2` routes for experimental behavior.
- Existing `/api/repertory/*` routes should remain behavior-compatible unless specifically approved.
- New APIs must:
  - require admin/doctor session;
  - validate request bodies with Zod or equivalent;
  - paginate responses;
  - never return full Kent/Boericke data in one payload;
  - derive user identity from session, not request body;
  - return explicit algorithm version;
  - include no prescription wording.
- Existing API changes, if any, should initially be non-breaking hardening:
  - add optional pagination while preserving defaults;
  - add rate limits;
  - add no-store headers for clinical/session responses;
  - add logging that does not expose patient/session secrets.

## UI Safety Plan

- Do not redesign the dashboard.
- Do not move dashboard tabs.
- Do not change patient/doctor workflows.
- Add only a feature-flagged repertory entry point or panel.
- Keep existing `Nexus Atlas` and Dr. Jethwani repertory behavior as default.
- If adding v2 UI:
  - render it only when `NEXT_PUBLIC_REPERTORY_V2_ENABLED=true`;
  - otherwise render current UI;
  - provide an obvious "Back to current repertory" path;
  - keep selected patient/case context unchanged.
- Do not change billing, patient queue, doctor management, or intake screens.

## Test Plan

Unit tests:

- legacy data adapter normalization;
- Firestore rubric adapter normalization;
- remedy abbreviation normalization;
- search ranking;
- scoring formula;
- score breakdown math;
- missing information detection;
- no-auto-prescription safety labels.

Compatibility tests:

- same selected rubrics produce comparable top remedies between current engine and v2 engine;
- v2 engine does not mutate inputs;
- v2 disabled means old output path remains unchanged.

API tests:

- v2 APIs disabled return 404 or disabled response.
- unauthenticated requests rejected.
- doctor can run read/repertorize operations.
- only admin/reviewer can write if write flag enabled.
- pagination works.

UI smoke tests:

- dashboard loads with v2 flag off.
- existing repertory tab still loads with v2 flag off.
- v2 panel appears only with flag on.
- selected rubrics are not lost when toggling experimental panel.

Deployment tests:

- `npm run lint`
- typecheck
- repertory unit tests
- targeted API tests
- Vercel build

## Rollback Plan

- Default all new flags to false.
- Rollback step 1: set all `REPERTORY_V2_*` flags to false.
- Rollback step 2: remove v2 route usage from any feature-flagged UI entry point.
- Rollback step 3: keep old `/api/repertory/*` routes untouched or restore from previous commit.
- Rollback step 4: if any shadow collections were created, leave them unused; do not delete during emergency rollback.
- Rollback step 5: revert only the latest small commit, not broad dashboard files.

Successful rollback means:

- current admin dashboard opens;
- current repertory workflows behave as before;
- patient/doctor/billing flows are unaffected;
- no data deletion occurred.

## First 50 Safe Implementation Tasks

1. Add this plan and obtain approval before code changes.
2. Create a repertory-only feature flag file under `src/features/repertory/flags`.
3. Add tests proving all flags default to disabled.
4. Create `src/features/repertory/engine/canonicalTypes.ts`.
5. Copy, do not replace, the useful types from `src/features/repertory/types/index.ts`.
6. Add a legacy Jethwani rubric adapter as a pure function.
7. Add tests for the legacy Jethwani adapter.
8. Add a Kent/Boericke adapter as a pure function.
9. Add tests for Kent/Boericke adapter using 2-3 fixture records.
10. Add a Firestore rubric adapter as a pure function.
11. Add tests for deployed Firestore-style rubric shape.
12. Add remedy abbreviation normalization utility.
13. Add tests for common remedy aliases and abbreviations.
14. Add a non-mutating score contribution type.
15. Add v2 scoring engine as a pure function, no API integration.
16. Add tests for one-rubric scoring.
17. Add tests for multi-rubric coverage scoring.
18. Add tests for grade weighting.
19. Add tests for negative/eliminating rubric placeholder behavior.
20. Add case completeness utility.
21. Add missing-generals tests.
22. Add source reliability metadata type.
23. Add data quality issue type.
24. Add read-only data validator v2 as a pure function.
25. Add tests for duplicate detection.
26. Add tests for missing citation detection.
27. Add tests for prohibited clinical claim detection.
28. Add tests for empty synonym warning.
29. Add a search document builder for canonical rubrics.
30. Add tests for exact match, synonym match, remedy match.
31. Add an in-memory v2 search function for fixtures only.
32. Add comparison test between old seed and canonical adapted seed.
33. Add `src/app/api/repertory-v2/search/route.ts` disabled by default.
34. Add test or manual check that disabled v2 API does not affect old API.
35. Add session requirement to v2 API only.
36. Add paginated response shape to v2 search.
37. Add `src/app/api/repertory-v2/repertorize/route.ts` disabled by default.
38. Add v2 repertorize route using pure scoring engine and fixtures/adapters.
39. Add API input validation for v2 repertorize.
40. Add no-auto-prescription safety label in v2 API response.
41. Add score breakdown response behind `REPERTORY_V2_SHOW_SCORE_BREAKDOWN`.
42. Add read-only validation route disabled by default.
43. Add a dashboard-independent story/test fixture for the v2 workbench component.
44. Add optional `components-v2` search panel, not wired to production.
45. Add optional `components-v2` scoring panel, not wired to production.
46. Add v2 UI wrapper that renders nothing unless flag is enabled.
47. Add one tiny dashboard insertion point only after explicit approval.
48. Run targeted repertory tests.
49. Run build/typecheck.
50. Prepare a before/after report comparing old and v2 search/scoring on fixed cases.

## Approval Gates

Gate 1: plan approval.  
Gate 2: pure functions and tests only.  
Gate 3: disabled v2 APIs.  
Gate 4: feature-flagged UI preview.  
Gate 5: read-only production shadow testing.  
Gate 6: approved opt-in rollout.

