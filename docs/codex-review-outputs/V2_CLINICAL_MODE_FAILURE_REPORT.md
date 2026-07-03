# V2 Clinical Mode Failure Report

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory V2 Clinical Mode investigation only  
Code changes made: **None**

## Summary

V2 Clinical Mode is failing after the browser calls the new V2 API route:

`POST /api/repertory/v2-live`

The visible message:

`V2 Clinical mode failed. V1 remains available.`

comes from the V2 live route catch block, not from the original V1 repertory engine.

V1 still works because it uses the existing stable path:

`GET /api/repertory/search`

That V1 endpoint was verified healthy in production with HTTP `200`.

## Browser Console Status

I attempted to inspect the live browser session.

Result:

- In-app browser had no authenticated Homeo Healthcare tab.
- Chrome opened `https://www.homeo.healthcare/admin/dashboard` but redirected to:
  - `https://www.homeo.healthcare/admin/login?next=%2Fadmin%2Fdashboard`
- Because the browser session was not authenticated, I could not reproduce the exact logged-in V2 Clinical switch interaction from this environment.

Expected browser-side exception path:

- File: `src/features/repertory/components/V2LivePanel.tsx`
- Line: `36`

```ts
if (!response.ok || !result.success) throw new Error(result.message || "V2 Clinical mode failed.");
```

That line throws the visible client error after the server returns `{ success: false }`.

## Network Request Path

V2 Clinical Mode sends:

- Method: `POST`
- URL: `/api/repertory/v2-live`
- Body:
  - `query`
  - `filters`
  - `selectedRubricIds`

Relevant file:

- `src/features/repertory/components/V2LivePanel.tsx`
- Lines: `26-36`

Production reachability:

- `HEAD /api/repertory/v2-live`: `401` unauthenticated
- This proves the route is deployed and protected, not missing.

Therefore the failure is **not** a missing route or deployment 404.

## Server Route Path

Relevant file:

- `src/app/api/repertory/v2-live/route.ts`

Execution path:

1. Auth check:
   - Lines `53-55`
   - `requireAdminApiSession(request)`

2. Request body parse:
   - Lines `57-58`

3. Firestore rubric read:
   - Lines `37-46`
   - Collection: `rubrics`
   - Filter: `status == "active"`
   - Limit: `5000`

4. V2 engine call:
   - Lines `60-66`
   - `runV2ClinicalLiveEngine(...)`

5. Failure response:
   - Lines `69-74`

```ts
return noStoreJson({
  success: false,
  message: "V2 Clinical mode failed. V1 remains available.",
  error: error?.message || String(error),
}, 500);
```

The UI displays only `message`, not the hidden `error` field.

## Exact Error Captured

Exact visible/client error:

`Error: V2 Clinical mode failed. V1 remains available.`

Client throw location:

- `src/features/repertory/components/V2LivePanel.tsx`
- Line `36`

Server catch location:

- `src/app/api/repertory/v2-live/route.ts`
- Lines `69-74`

Exact internal server exception:

- **Not captured from this environment**

Reason:

- Vercel runtime logs require authenticated Vercel CLI access.
- Authenticated browser network response could not be captured because Chrome/in-app browser were not logged into the admin session.
- The server route includes the actual `error` field in the JSON response, but the UI does not display it.

## Server Logs Status

Attempted:

`vercel logs https://www.homeo.healthcare --since 2h --limit 100`

Result:

- First attempt failed due local npm cache permissions.
- Retried with temporary npm cache.
- Vercel CLI then required device login.

No production runtime stack trace could be retrieved without Vercel authentication.

## Local Reproduction Checks

I executed the isolated V2 engine locally against the repo's built-in repertory-shaped data using these test queries:

- `bloating`
- `flatulence`
- `anxiety`
- `constipation`
- `diarrhoea`
- `diarrhea`
- `sweets`
- `salt`
- `milk`
- `abdomen pain`

Result:

- V2 engine completed successfully for all terms.
- No local exception was reproduced with the available fixture data.

This suggests the failure is more likely one of:

- production Firestore data format mismatch
- production runtime/environment issue
- production-only selected rubric payload issue
- hidden server exception inside `/api/repertory/v2-live`

It is less likely to be:

- build failure
- missing dependency
- missing API route
- basic V2 engine import failure

## Affected Files

Primary affected path:

- `src/features/repertory/components/V2LivePanel.tsx`
- `src/app/api/repertory/v2-live/route.ts`
- `src/features/repertory/liveMode/liveEngine.ts`

Likely downstream execution files:

- `src/features/repertory/adapters/firestoreRubricAdapter.ts`
- `src/features/repertory/search/clinicalSearch/searchIndex.ts`
- `src/features/repertory/search/clinicalSearch/clinicalSearchEngine.ts`
- `src/features/repertory/intelligence/clinicalRubricIntelligence/hierarchyIndex.ts`
- `src/features/repertory/repertorization/clinicalRepertorization/session.ts`
- `src/features/repertory/repertorization/clinicalRepertorization/rankingEngine.ts`

## Failure Classification

Current classification:

**Runtime exception in the V2 live API path.**

Evidence:

- V2 route exists and is deployed.
- V1 route remains healthy.
- UI message matches the V2 route catch block.
- Local V2 engine imports and runs successfully.

Not currently supported by evidence:

- Feature flag failure
- Missing API route
- Build issue
- Missing dependency
- V1 scoring issue
- V1 repertorization issue
- UI-only render failure

Still unconfirmed until authenticated network capture or Vercel logs:

- exact production exception message
- exact server stack trace
- whether the exception is Firestore data shape, Firestore permissions/config, selected rubric data, or response serialization

## Why V1 Still Works

V1 still works because V1 search is separate:

- File: `src/app/api/repertory/search/route.ts`
- Endpoint: `/api/repertory/search`

V2 Clinical Mode uses:

- File: `src/app/api/repertory/v2-live/route.ts`
- Endpoint: `/api/repertory/v2-live`

The V2 failure is caught and shown inside the V2 panel only. It does not replace or break the V1 search endpoint.

## Whether Compare Mode Is Affected

Compare Mode is **likely affected** if the server exception is inside shared V2 execution.

Reason:

- Compare route calls the same V2 engine:
  - File: `src/app/api/repertory/v2-compare/route.ts`
  - Lines `178-184`
  - Function: `runV2ClinicalLiveEngine(...)`

If the failure is caused by:

- `activeRubricCandidates()`
- `adaptFirestoreRubric(...)`
- `buildCanonicalSearchIndex(...)`
- `buildRubricHierarchyIndex(...)`
- `createClinicalRepertorizationSession(...)`
- `repertorizeClinicalSession(...)`

then Compare Mode should fail too.

If the failure is only in V2 Live panel rendering after a successful response, Compare Mode may not be affected. Current evidence points more strongly to the server route, not panel rendering.

## Minimal Fix Required

Do not apply a code fix until the hidden server `error` value is captured.

Minimal diagnostic step required first:

1. Capture the authenticated network response body for:

   `POST /api/repertory/v2-live`

2. Read the JSON field:

   `error`

or:

3. Retrieve Vercel runtime logs for the same failed request.

Minimal likely code fix after exact error is known:

- If data format mismatch:
  - harden `adaptFirestoreRubric(...)` or `runV2ClinicalLiveEngine(...)` around the exact field.
- If Firestore config/permission:
  - correct the production environment/service account.
- If response payload issue:
  - remove or slim the large nested `repertorization.result` from the API response.
- If selected rubric mismatch:
  - normalize selected rubric IDs before filtering.

## Risk Assessment

Current production risk:

- Low for existing V1 workflows.
- Medium for V2 Clinical Mode usability.

Clinical risk:

- Low while V2 fails closed and V1 remains available.
- No evidence that V2 is changing prescriptions, scoring, database records, or V1 results.

Operational risk:

- The current route catches the error and avoids crashing the whole dashboard.
- However, the UI hides the internal error, slowing diagnosis.

## Recommended Next Step

Capture the hidden server error before changing code.

Best option:

- Open the failing V2 Clinical Mode while signed in.
- Inspect the browser Network tab.
- Select `POST /api/repertory/v2-live`.
- Copy the JSON response field named `error`.

Alternative:

- Sign into Vercel CLI and run:

```bash
vercel logs https://www.homeo.healthcare --since 2h --limit 100
```

Only after that should we implement the minimal targeted fix.

