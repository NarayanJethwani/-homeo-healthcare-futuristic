# Implementation Tasks

## Priority 0: Safety And Access Control

- [ ] Add `requireAdminApiSession` to:
  - `src/app/api/repertory/route.ts`
  - `src/app/api/repertory/search/route.ts`
  - `src/app/api/repertory/repertorize/route.ts`
  - `src/app/api/repertory/save/route.ts`
  - `src/app/api/repertory/delete/route.ts`
  - `src/app/api/repertory/details/route.ts`
  - `src/app/api/repertory/seed/route.ts`
- [ ] Derive `userId` from the session in repertory APIs; do not trust request body `userId`.
- [ ] Add role checks: doctor read/run, admin/reviewer write/delete/seed.
- [ ] Remove sensitive logs from `src/lib/adminSession.ts`.
- [ ] Tighten `firestore.rules` for `rubrics`, `synonyms`, `repertorization_sessions`, `settings`, and `ai_telemetry_logs`.
- [ ] Sanitize or replace `dangerouslySetInnerHTML` surfaces in:
  - `src/app/admin/dashboard/CIEWorkspace.tsx`
  - `src/app/admin/dashboard/page.tsx`

## Priority 1: Stabilize Repertory Architecture

- [ ] Choose canonical rubric schema based on `src/features/repertory/types/index.ts`.
- [ ] Implement `FirestoreRepertoryRepository`.
- [ ] Switch `src/features/repertory/database/repertoryDb.ts` to choose memory only in test/dev demo mode, Firestore in production.
- [ ] Add adapters:
  - Firestore API shape -> canonical `RepertoryRubric`;
  - Kent/Boericke JSON -> canonical rubric;
  - legacy Jethwani data -> canonical rubric.
- [ ] Stop returning full repertory from `/api/repertory`; add pagination and source filters.
- [ ] Create a unified API response shape for search and repertorization.

## Priority 2: Search And Data Quality

- [ ] Add indexed fields:
  - normalized text;
  - path;
  - source;
  - chapter;
  - remedy IDs;
  - synonyms;
  - grade range;
  - review status.
- [ ] Add paginated search endpoint with `limit`, `cursor`, `source`, `chapter`, and `filters`.
- [ ] Add data validator route restricted to admin/reviewer.
- [ ] Add review status fields to rubrics: `draft`, `reviewed`, `active`, `deprecated`.
- [ ] Flag AI-generated/synthetic imported rubrics for clinical review.
- [ ] Add duplicate and weak-citation reports to the admin UI.

## Priority 3: Scoring Engine

- [ ] Centralize scoring in `src/features/repertory/scoring/repertoryScoring.ts`.
- [ ] Make `/api/repertory/repertorize` call the same scoring engine instead of its simpler separate formula.
- [ ] Return contribution-level scoring data.
- [ ] Add algorithm versioning.
- [ ] Separate:
  - classical grade;
  - source reliability;
  - clinical experience weight;
  - case intensity;
  - AI confidence.
- [ ] Add negative rubrics and contraindication handling.
- [ ] Add test cases for thermal alignment and miasmatic bonus logic.

## Priority 4: AI Intake Workflow

- [ ] Replace direct auto-add behavior with an AI suggestion review queue.
- [ ] Store AI mapping events:
  - original phrase;
  - candidate rubrics;
  - confidence;
  - matched fields;
  - model/prompt version;
  - clinician decision.
- [ ] Add red-flag triage before repertory mapping.
- [ ] Add clarification questions tied to missing generals.
- [ ] Add "AI suggested" and "clinician confirmed" states in selected rubrics.

## Priority 5: Clinician-Grade UI Refactor

- [ ] Extract repertory dashboard from `src/app/admin/dashboard/page.tsx`.
- [ ] Create route/module boundary:
  - `src/app/admin/repertory/page.tsx` or dashboard tab module;
  - `src/features/repertory/components/SearchPanel.tsx`;
  - `src/features/repertory/components/RubricResultList.tsx`;
  - `src/features/repertory/components/SelectedRubricsPanel.tsx`;
  - `src/features/repertory/components/ScoringPanel.tsx`;
  - `src/features/repertory/components/AiMappingReviewQueue.tsx`.
- [ ] Replace blocking `alert()` calls in repertory workflows.
- [ ] Add keyboard shortcuts for search/add/remove/score.
- [ ] Add responsive tablet layout with two panes.

## Priority 6: Deployment Readiness

- [ ] Fix `npm test` so it uses the local TypeScript compiler.
- [ ] Ensure `typescript` is installed and `node_modules/.bin/tsc` is available in CI.
- [ ] Add CI commands:
  - lint;
  - typecheck;
  - unit tests;
  - API permission tests;
  - build.
- [ ] Add Vercel smoke checks:
  - admin dashboard redirects unauthenticated;
  - protected repertory APIs return 401 unauthenticated;
  - public pages render;
  - large repertory endpoint does not exceed response limits.
- [ ] Add API payload limits and pagination tests.

## Small Safe Commit Plan

1. Remove sensitive session logging.
2. Protect repertory API routes with session checks.
3. Tighten Firestore rules for repertory writes.
4. Add pagination to `/api/repertory`.
5. Implement Firestore repository read methods.
6. Add canonical adapters for deployed Firestore rubric shape.
7. Make workbench use repository/API consistently.
8. Unify scoring API with modular scoring engine.
9. Add AI mapping review queue.
10. Split repertory UI out of the 30k-line dashboard.

## Exact Files Likely Needing Changes

- `src/lib/adminSession.ts`
- `src/lib/adminApiAuth.ts`
- `middleware.ts`
- `firestore.rules`
- `src/app/api/repertory/route.ts`
- `src/app/api/repertory/search/route.ts`
- `src/app/api/repertory/repertorize/route.ts`
- `src/app/api/repertory/save/route.ts`
- `src/app/api/repertory/delete/route.ts`
- `src/app/api/repertory/details/route.ts`
- `src/app/api/repertory/seed/route.ts`
- `src/features/repertory/database/repertoryDb.ts`
- `src/features/repertory/repositories/FirestoreRepertoryRepository.ts`
- `src/features/repertory/types/index.ts`
- `src/features/repertory/search/repertorySearch.ts`
- `src/features/repertory/scoring/repertoryScoring.ts`
- `src/features/repertory/components/RepertoryWorkbench.tsx`
- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/dashboard/CIEWorkspace.tsx`
- `package.json`
- `next.config.ts`

