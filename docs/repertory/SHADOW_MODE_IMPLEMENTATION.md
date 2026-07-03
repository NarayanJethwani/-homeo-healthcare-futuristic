# Shadow Mode Implementation

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Mode: observational V2 Clinical Search shadow mode

## What Was Implemented

V2 Clinical Search now can run in server-side shadow mode after V1 search completes.

Clinicians still receive only V1 search results.

The V2 engine:

- does not replace search;
- does not affect API response;
- does not affect UI;
- does not affect scoring;
- does not affect repertorization;
- does not write to the database;
- runs only when server feature flags are enabled.

## Files Changed

| File | Change |
|---|---|
| `src/app/api/repertory/search/route.ts` | Adds guarded shadow-mode hook after V1 results are computed. Returns V1 response only. |
| `src/features/repertory/integration/clinicalSearchShadow.ts` | New isolated comparison bridge for adapting rubrics, running V2 search, and logging metrics. |
| `src/features/repertory/flags/repertoryFlags.ts` | Adds `useClinicalSearchShadowMode`, default off. |
| `src/features/repertory/__tests__/repertoryFlags.test.ts` | Confirms shadow flag defaults off. |
| `src/features/repertory/__tests__/clinicalSearchShadow.test.ts` | Adds isolated metrics test for the shadow bridge. |

## Feature Flags

V2 shadow mode runs only when both are true:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=true
REPERTORY_V2_SEARCH_SHADOW_MODE=true
```

Optional guardrail:

```text
REPERTORY_V2_SEARCH_MAX_RUBRICS=1000
```

Default behavior:

- flags unset or false;
- no V2 dynamic import;
- no V2 candidate fetch;
- no V2 index build;
- no V2 comparison log.

## Runtime Flow

1. Request enters `/api/repertory/search`.
2. Existing V1 search runs exactly as before.
3. Existing filters apply exactly as before.
4. V1 response payload is created:

```ts
{
  success: true,
  count: results.length,
  rubrics: results
}
```

5. If shadow flags are off, the response returns immediately.
6. If shadow flags are on:
   - a fire-and-forget background task starts;
   - V2 candidate rubrics are read from active Firestore rubrics with a limit;
   - V2 search runs on adapted canonical rubrics;
   - comparison metrics are logged;
   - V1 response remains unchanged.

## Fail-Safe Behavior

V2 shadow errors are caught and logged.

If V2 fails:

- V1 response still returns;
- user-visible behavior does not change;
- no database write occurs.

## Local Commits

- `d2f6592` Add repertory search shadow flag
- `9ea1764` Add clinical search shadow comparison metrics
- `44372ec` Run V2 repertory search in shadow mode

## Explicit Non-Changes

No changes were made to:

- dashboard UI
- current scoring
- current repertorization
- AI modules
- database schema
- auth
- billing
- patient workflows
- doctor workflows
- deployment configuration

No deploy or push was performed.
