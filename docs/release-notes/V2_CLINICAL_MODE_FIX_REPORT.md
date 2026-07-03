# V2 Clinical Mode Fix Report

Date: 2026-07-03  
Branch: `main`  
Latest deployed commit: `79020a0556eb678d3e93fa0190723738285aa088`

## Exact Error Found

The authenticated production dashboard showed:

`V2 Clinical mode failed. V1 remains available.`

Vercel runtime logs showed the underlying production exception:

`8 RESOURCE_EXHAUSTED: Quota exceeded.`

Affected production request:

`POST /api/repertory/v2-live`

Compare Mode was also affected after V2 Clinical was fixed because its internal V1-reference comparison lookup also depended on Firestore reads:

`POST /api/repertory/v2-compare`

## Root Cause

Firestore quota was exhausted in production.

The V2 live endpoint attempted to read active rubrics from Firestore and had no fallback path if that read failed. The existing V1 UI has local repertory fallback data available elsewhere in the app, but V2 live/compare endpoints were not using it.

Why V1 still worked visually:

- The V1 Classic screen in Dr. Jethwani's Clinical Repertory can render the local clinical rubric catalog.
- V1 fallback mode remained available in the UI.
- No V1 engine code was modified.

Important note:

Unauthenticated direct check of `/api/repertory/search?q=anxiety` currently returns the existing V1-shaped error body:

```json
{"success":false,"message":"Failed to search rubrics.","error":"8 RESOURCE_EXHAUSTED: Quota exceeded."}
```

That is the existing V1 API behavior under Firestore quota exhaustion. It was not changed by this fix.

## Files Changed

1. `src/features/repertory/liveMode/fallbackRubrics.ts`
   - New V2-only helper that maps existing local Dr. Jethwani repertory data into the shape expected by the V2 adapters.
   - No database writes.
   - No external repertory imports.

2. `src/app/api/repertory/v2-live/route.ts`
   - Added fallback handling around Firestore rubric loading.
   - If Firestore fails or returns no active rubrics, V2 Clinical uses local Dr. Jethwani repertory fallback data.
   - The route still returns the original safe failure envelope if an unexpected error occurs later.

3. `src/app/api/repertory/v2-compare/route.ts`
   - Added fallback handling for V2 rubric candidates.
   - Added fallback handling for the Compare endpoint's internal V1-reference search.
   - This does not modify the real `/api/repertory/search` V1 route.

## Code Paths Proving the Fix

V2 Clinical fallback:

- `src/app/api/repertory/v2-live/route.ts:38`
- Firestore read is wrapped in `try/catch`.
- On Firestore error: `getV2FallbackRubrics()` is returned.
- V2 engine receives `candidateRubrics` from that safe fallback at `src/app/api/repertory/v2-live/route.ts:65`.

V2 Compare fallback:

- `src/app/api/repertory/v2-compare/route.ts:58`
- V2 candidate rubric loading falls back to `getV2FallbackRubrics()`.
- `src/app/api/repertory/v2-compare/route.ts:134`
- Compare endpoint's internal V1-reference lookup is wrapped in `try/catch`.
- On Firestore error, it runs `runV1FallbackSearch()` at `src/app/api/repertory/v2-compare/route.ts:204`.

Local fallback data adapter:

- `src/features/repertory/liveMode/fallbackRubrics.ts:23`
- Uses existing `JETHWANI_REPERTORY_DATA`.
- Preserves remedies, index weights, research citation, category, generated slug, inferred organ system, and active status.

## Fix Applied

Minimal targeted fix:

- Add a V2-only local fallback rubric provider.
- Use that fallback only when V2 live/compare cannot load Firestore rubrics.
- Use the same fallback for Compare Mode's internal V1-reference panel when Firestore quota prevents comparison lookup.

No changes were made to:

- V1 engine
- V1 `/api/repertory/search`
- Current repertorization route
- Patient workflows
- Doctor workflows
- Billing
- Authentication
- Database schema
- Public site
- External repertory source data

## Tests Run

Passed:

- `git diff --check HEAD`
- `npx ts-node ... src/features/repertory/__tests__/v2ComparisonMode.test.ts`
- `npx ts-node ... src/features/repertory/__tests__/v2FeedbackModel.test.ts`
- `npm run build`
- `npm test`
- `npm run lint`

Lint result:

- 0 errors
- Existing warnings remain in unrelated files.

## Deployment

Pushed commits:

- `4a53409bfb55ae3afce2c7ea7e317fcd09f2a4ec` - V2 Clinical fallback for Firestore quota exhaustion
- `79020a0556eb678d3e93fa0190723738285aa088` - V2 Compare fallback for Firestore quota exhaustion

Production deployment URLs:

- Portal Vercel deployment: `https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-portal/9FVeEztHUNNDkoT4pKqCvuCQRGKv`
- Public Vercel deployment: `https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-futuristic/7NMfr7ES8HicfFJY3dtKYJL8MTkx`

Deployment status:

- `homeo-healthcare-portal`: success
- `homeo-healthcare-futuristic`: success

## Production Verification

Authenticated Chrome verification on:

`https://portal.homeo.healthcare/admin/dashboard?tab=nexus-atlas`

Verified:

- Dashboard loads while logged in.
- Dr. Jethwani's Clinical Repertory opens.
- V1 Classic mode works.
- V1 Classic shows `CLINICAL RUBRICS CATALOG (55 MATCHES)`.
- Compare Mode works.
- Compare Mode shows V1 and V2 side by side.
- Compare Mode no longer shows `V1 vs V2 comparison failed`.
- V2 Clinical Mode works.
- V2 Clinical Mode shows V2 rubric results.
- V2 Clinical Mode shows V2 remedy ranking.
- V2 Clinical Mode shows clinical explanation/explainability.
- V2 Clinical Mode no longer shows `V2 Clinical mode failed`.
- Safety warning remains visible: clinical review required / do not auto-prescribe.

Unauthenticated API checks:

- `https://portal.homeo.healthcare/api/repertory/v2-live?q=anxiety` returns authentication required, as expected.
- `https://portal.homeo.healthcare/api/repertory/search?q=anxiety` preserves the V1 response shape; it currently reports Firestore quota exhaustion.

## Warnings

Chrome console still shows an existing minified React hydration warning:

`Minified React error #418`

This warning was visible separately from the V2 endpoint failure and did not prevent V1, Compare, or V2 Clinical mode from rendering after the fix.

Firestore quota is still exhausted, so any route that depends strictly on Firestore without fallback may continue to show quota-related errors until quota recovers or additional approved fallback work is implemented.

## Risk Assessment

Risk level: Low to moderate.

Why:

- The fix is limited to V2 live/compare endpoints and a V2 fallback helper.
- V1 engine and existing V1 API route were not changed.
- No database migration.
- No database writes.
- No clinical scoring replacement.
- No UI redesign.
- No external repertory data import.

Clinical risk:

- Low for production stability.
- V2 still displays clinical review warnings and does not auto-prescribe.
- V1 Classic remains available as fallback.

## Rollback Command

To remove both fallback fixes:

```bash
git revert 79020a0556eb678d3e93fa0190723738285aa088 4a53409bfb55ae3afce2c7ea7e317fcd09f2a4ec
git push origin main
```

## Final Recommendation

The V2 Clinical Mode production failure is fixed.

It is safe for Dr. Narayan Jethwani to test:

- V1 Classic
- Compare V1 vs V2
- V2 Clinical

Do not treat the local fallback as a substitute for restoring Firestore capacity. The quota problem should still be monitored separately.
