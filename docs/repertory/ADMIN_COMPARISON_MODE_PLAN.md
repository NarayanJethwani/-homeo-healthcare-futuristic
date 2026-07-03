# Admin-Only V1 vs V2 Repertory Comparison Mode Plan

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Status: Planning only, no code changes approved yet

## Goal

Create a developer preview that lets only Dr. Narayan Jethwani compare existing V1 repertory search results with isolated V2 clinical search results.

This must not replace V1 results, scoring, repertorization, UI for other users, APIs for existing clients, or database behavior.

## Non-Negotiable Safety Rules

- Existing doctors/users continue seeing only V1.
- V2 results never replace V1 results.
- No scoring replacement.
- No repertorization replacement.
- No production clinical database writes.
- No patient/doctor workflow changes.
- No billing/auth/public site changes.
- Do not deploy automatically.
- Do not enable for general clinicians.

## Proposed Feature Flag

```text
REPERTORY_V2_ADMIN_COMPARISON_MODE=true
```

Default:

```text
REPERTORY_V2_ADMIN_COMPARISON_MODE=false
```

This flag should be server-side only. The browser should not decide authorization by environment variable alone.

## Required Access Gate

The preview must require all of:

1. Valid admin session cookie.
2. `session.role === "admin"`.
3. `session.email === "narayan.jethwani@homeo.healthcare"`.
4. `REPERTORY_V2_ADMIN_COMPARISON_MODE === "true"`.

Optional staging allowance:

- `test-admin@homeo.healthcare` may be allowed only in local/staging if explicitly approved.

## Current Relevant Code

### Existing V1 Search API

File:

- `work/homeo-healthcare-futuristic/src/app/api/repertory/search/route.ts`

Current behavior:

- Uses Firestore `rubrics` and `synonyms`.
- Returns V1 response shape:

```ts
{
  success: true,
  count: results.length,
  rubrics: results
}
```

Existing shadow mode:

- Runs only when both:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=true
REPERTORY_V2_SEARCH_SHADOW_MODE=true
```

- It does not return V2 results.

### Existing V2 Search Engine

Files:

- `src/features/repertory/search/clinicalSearch/clinicalSearchEngine.ts`
- `src/features/repertory/search/clinicalSearch/searchIndex.ts`
- `src/features/repertory/search/clinicalSearch/tokenizer.ts`
- `src/features/repertory/search/clinicalSearch/synonyms.ts`
- `src/features/repertory/search/clinicalSearch/fuzzyMatcher.ts`
- `src/features/repertory/adapters/firestoreRubricAdapter.ts`

Current behavior:

- Pure in-memory adaptation/search.
- No database writes.
- No AI calls.
- No scoring/repertorization replacement.

### Existing Admin Auth Utilities

Files:

- `src/lib/adminApiAuth.ts`
- `src/lib/adminSession.ts`
- `src/app/api/admin/session/route.ts`

Current behavior:

- Admin session cookie can be verified server-side.
- Session includes `uid`, `email`, `role`, `name`, `exp`.
- Existing role is `admin` or `doctor`.

### Existing Repertory UI

File:

- `src/app/admin/dashboard/page.tsx`

Relevant areas:

- Jethwani state begins around the "Dr. Jethwani's Clinical Repertory State" section.
- Search/filter UI appears in the "Clinical Symptom Directory" block.
- Current UI uses `jethwaniSearchTerm`, local filters, and `jethwaniRubrics`.

Risk:

- This file is very large and shared with stable dashboard workflows.
- Any edit here is higher risk than adding isolated components/routes.

## Proposed Architecture

Use a new admin-only API endpoint plus an isolated preview component.

The normal `/api/repertory/search` endpoint should remain unchanged unless separately approved.

### New Server API

Proposed file:

- `src/app/api/repertory/admin-comparison/route.ts`

Purpose:

- Authenticate Dr. Jethwani/super-admin only.
- Check `REPERTORY_V2_ADMIN_COMPARISON_MODE`.
- Run V1 search logic read-only.
- Run V2 clinical search read-only.
- Return a comparison object only to the authorized admin preview panel.

Response shape:

```ts
{
  success: true,
  query: string,
  filters: {
    category: string,
    organSystem: string,
    miasm: string,
    remedy: string
  },
  v1: {
    count: number,
    latencyMs: number,
    top10: ComparisonRubric[]
  },
  v2: {
    count: number,
    latencyMs: number,
    top10: ComparisonRubric[],
    synonymMatches: Array<{ rubricId: string; matchCount: number }>,
    scores: Array<{ rubricId: string; score: number }>
  },
  comparison: {
    commonRubrics: ComparisonRubric[],
    v1OnlyRubrics: ComparisonRubric[],
    v2OnlyRubrics: ComparisonRubric[],
    rankingDifferences: Array<{
      rubricId: string,
      title?: string,
      v1Rank: number | null,
      v2Rank: number | null,
      rankDelta: number | null
    }>
  }
}
```

Forbidden response:

```ts
{ success: false, message: "Admin comparison mode is not available." }
```

### New Comparison Service

Proposed file:

- `src/features/repertory/adminComparison/v1V2Comparison.ts`

Purpose:

- Reuse existing V2 read-only search.
- Create comparison metrics.
- Keep route small.
- Avoid dashboard logic depending directly on V2 internals.

### New Types

Proposed file:

- `src/features/repertory/adminComparison/types.ts`

Purpose:

- Define comparison result, rubric snapshot, feedback option, and local feedback record.

### New Preview UI Component

Proposed file:

- `src/features/repertory/components/AdminV1V2ComparisonPanel.tsx`

Purpose:

- Render side-by-side V1 and V2 result panels.
- Only receives data from the admin-only API.
- Stores feedback in browser localStorage first.
- Exports/copies feedback as JSON for manual review.

### Minimal Dashboard Wiring

Proposed file:

- `src/app/admin/dashboard/page.tsx`

Purpose:

- Render the preview panel only inside Dr. Jethwani's Clinical Repertory area.
- Gate rendering by local session email/role plus server API availability.

Important:

- UI rendering should be additive only.
- Existing search/results must remain untouched.
- No existing button behavior should be replaced.

## Exact Files Proposed to Modify

| File | Change | Risk |
|---|---|---|
| `src/features/repertory/flags/repertoryFlags.ts` | Add `adminComparisonMode` flag mapping for `REPERTORY_V2_ADMIN_COMPARISON_MODE`. | Low |
| `src/features/repertory/__tests__/repertoryFlags.test.ts` | Add default-off and enabled tests for admin comparison flag. | Low |
| `src/features/repertory/adminComparison/types.ts` | New isolated types. | Low |
| `src/features/repertory/adminComparison/v1V2Comparison.ts` | New isolated comparison logic. | Low |
| `src/features/repertory/__tests__/adminComparison.test.ts` | New isolated tests for comparison math and no mutation. | Low |
| `src/app/api/repertory/admin-comparison/route.ts` | New admin-only read-only API endpoint. | Medium |
| `src/features/repertory/components/AdminV1V2ComparisonPanel.tsx` | New isolated preview panel. | Medium |
| `src/app/admin/dashboard/page.tsx` | Add gated preview panel mount only. | High because file is large/shared |

## Files That Must Not Be Touched

- `src/app/api/repertory/repertorize/route.ts`
- `src/app/api/repertory/save/route.ts`
- `src/app/api/repertory/delete/route.ts`
- `src/app/api/patient/**`
- `src/app/api/admin/extend-subscription/route.ts`
- `src/app/api/admin/remove-doctor/route.ts`
- `src/app/api/invoice/**`
- `src/app/api/chat/**`
- `src/app/api/ai-diagnostics/**`
- `src/app/api/consult-ai/**`
- `src/app/patient/**`
- `src/app/doctors/**`
- `src/app/store/**`
- `src/app/page.tsx`
- `src/lib/repertoryDbService.ts`
- Firestore rules or database schema files

## Risk Assessment

### Low Risk

- Adding isolated types, comparison utility, and tests.
- Adding flag parsing with default OFF.
- LocalStorage feedback only.

### Medium Risk

- New API route because it touches server auth and Firestore reads.
- Mitigation: strict admin email allowlist, no writes, no shared API behavior changes.

### High Risk

- Editing `src/app/admin/dashboard/page.tsx`.
- Mitigation: one small additive insertion, no existing search/render logic changes, no changes outside Dr. Jethwani Clinical Repertory section.

## Database Safety Plan

Allowed:

- Read active rubrics.
- Read synonyms if V1 search helper needs them.

Forbidden:

- No Firestore writes.
- No `setDoc`, `addDoc`, `updateDoc`, `deleteDoc`.
- No server-side clinical feedback writes.
- No migration.

Feedback storage for first version:

- Browser `localStorage` key:

```text
repertory_v2_admin_comparison_feedback
```

- Optional export button:

```text
Download JSON report
Copy JSON report
Clear local feedback
```

## API Safety Plan

The admin comparison endpoint must:

- Set `Cache-Control: no-store`.
- Require admin session cookie.
- Require exact Dr. Jethwani email.
- Require `REPERTORY_V2_ADMIN_COMPARISON_MODE=true`.
- Return 403 when disabled or unauthorized.
- Return V1 and V2 comparison only for preview.
- Never modify `/api/repertory/search`.
- Never alter existing V1 response.

## UI Safety Plan

The panel should:

- Appear only in Dr. Jethwani's Clinical Repertory section.
- Show a clear badge: `Developer Preview - Dr. Jethwani Only`.
- Never replace existing search results.
- Never auto-select rubrics.
- Never add rubrics to the workbench.
- Never trigger repertorization.
- Never call AI.
- Never write database feedback.

## Test Plan

Unit tests:

- Feature flag defaults OFF.
- Feature flag enables only when `"true"` or `"1"`.
- Comparison detects common rubrics.
- Comparison detects V1-only rubrics.
- Comparison detects V2-only rubrics.
- Ranking differences are calculated correctly.
- Feedback records serialize locally.

API tests if feasible:

- 401 without session.
- 403 for doctor role.
- 403 for admin email not allowlisted.
- 403 when flag is OFF.
- 200 for Dr. Jethwani admin session when flag is ON.
- Response includes V1 and V2 but does not write data.

Manual checks:

- Existing doctors still see current dashboard only.
- Dr. Jethwani sees preview only when flag is ON.
- Existing search still works without comparison panel.
- Existing repertorization still works.
- No V2 output replaces V1.

## Rollback Plan

Immediate:

```text
REPERTORY_V2_ADMIN_COMPARISON_MODE=false
```

Code rollback:

- Remove the gated dashboard insertion.
- Remove the new API route.
- Remove isolated admin comparison files.

No database rollback required because no database writes are planned.

## Approval Boundary

No implementation should begin until this plan is approved.

Recommended first implementation batch after approval:

1. Add flag mapping and tests.
2. Add isolated comparison types and utility tests.
3. Add admin-only API route.
4. Add preview component with localStorage feedback.
5. Add one small gated mount in dashboard.
6. Run build, tests, lint.
7. Do not deploy automatically.
