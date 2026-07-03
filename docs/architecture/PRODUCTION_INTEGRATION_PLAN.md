# Production Integration Plan

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 6 planning only

## Decision

Recommended first production integration:

**Clinical Search Engine, shadow mode only.**

This is safer than integrating rubric intelligence, repertorization, validation, or knowledge curation because:

- search can run without changing scoring;
- search can run without changing repertorization;
- search can run without writing to database;
- search can run without UI changes;
- shadow mode can compare V1 and V2 while returning the existing V1 response;
- rollback is a feature flag flip plus revert if needed.

The first integration must not replace current search results.

## V2 Component Risk Review

| Component | Production risk | Clinical risk | Implementation complexity | Rollback complexity | Recommendation |
|---|---:|---:|---:|---:|---|
| Feature flags | Low | Low | Low | Low | Already isolated; safe to use as kill switches. |
| Canonical types and adapters | Low-medium | Medium | Medium | Low | Useful for search shadow mode, but must be monitored for field mapping gaps. |
| Clinical Search Engine | Medium | Low-medium | Medium | Low | Best first integration if shadow-only and response unchanged. |
| Rubric Intelligence | Medium | Medium | Medium | Low-medium | Defer. Relationship suggestions may influence clinician navigation. |
| Clinical Repertorization Engine | High | High | High | Medium | Defer. Directly affects remedy ranking. |
| Validation Framework | Low | Low | Medium | Low | Keep offline. Do not expose in production yet. |
| Knowledge Curation Architecture | Low | Medium | High | Low | Documentation only. Future data model requires separate approval. |

## Safest First Integration

### Phase 6A: Server-Side Search Shadow Mode

Goal:

Run V2 Clinical Search alongside existing `/api/repertory/search` logic, but return the existing V1 response unchanged.

What changes for users:

- Nothing.

What changes internally:

- When the shadow flag is enabled, the API computes V2 search results in parallel.
- The API logs lightweight comparison metrics.
- The API still returns the existing result format and ordering.

## Exact Production Files That Would Be Touched

Do not touch these until approval.

### Required for Phase 6A

| File | Change | Risk |
|---|---|---|
| `src/app/api/repertory/search/route.ts` | Add guarded shadow call after existing V1 results are computed. Response remains unchanged. | Medium because it is a production API route. |
| `src/features/repertory/flags/repertoryFlags.ts` | Add any missing shadow-specific flags if needed. Existing `useClinicalSearchEngine` remains off by default. | Low. |
| `src/features/repertory/integration/clinicalSearchShadow.ts` | New isolated bridge file to adapt Firestore rubrics, build V2 index, run V2 search, and produce comparison metrics. | Low-medium. New file only, but imported by API route. |
| `src/features/repertory/__tests__/clinicalSearchShadow.test.ts` | New isolated tests for parity metrics and fail-open behavior. | Low. |

### Must Not Be Touched In Phase 6A

- `src/app/admin/dashboard/page.tsx`
- `src/lib/repertoryDbService.ts`
- `src/app/api/repertory/repertorize/route.ts`
- `src/app/api/intake/route.ts`
- patient workflows
- doctor workflows
- billing
- auth
- database schema
- scoring files
- repertorization files
- AI modules

## Proposed Shadow Integration Flow

1. Existing API receives request.
2. Existing V1 search runs exactly as today.
3. Existing filters apply exactly as today.
4. Existing response object is prepared.
5. If `REPERTORY_V2_SEARCH_SHADOW_MODE=true`, run V2 search in a protected try/catch.
6. Compare V1 and V2:
   - top result overlap
   - top 5 overlap
   - result count difference
   - V2 execution time
   - adapter warning count
7. Log metrics only.
8. Return V1 response unchanged.
9. If V2 throws, log the error and still return V1 response.

## Feature Flag Wiring

Required flags:

| Flag | Default | Purpose |
|---|---|---|
| `REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE` | off | Master kill switch for V2 search. |
| `REPERTORY_V2_SEARCH_SHADOW_MODE` | off | Allows V2 search to run in shadow without changing response. |
| `REPERTORY_V2_SEARCH_MAX_RUBRICS` | unset or conservative | Optional guardrail to cap indexed rubrics during shadow mode. |
| `REPERTORY_V2_SEARCH_LOG_SAMPLE_RATE` | `0` | Optional sampling rate for comparison logs. |

No client-visible flag should be used for Phase 6A.

## Rollback Procedure

Immediate rollback:

1. Set `REPERTORY_V2_SEARCH_SHADOW_MODE=false`.
2. Set `REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=false`.
3. Redeploy environment variables if needed.
4. Confirm `/api/repertory/search` returns normal V1 results.

Code rollback:

1. Revert the approved Phase 6A commit.
2. Redeploy previous known-good production build.
3. Confirm no V2 search logs appear.

## Testing Plan

Before production:

- Unit test V2 shadow bridge with Firestore-shaped fixture records.
- Confirm V1 response is byte-for-byte unchanged when shadow flag is off.
- Confirm V1 response shape is unchanged when shadow flag is on.
- Confirm V2 exceptions are swallowed and logged without failing V1.
- Confirm filters still apply as before.
- Confirm no dashboard change.

Staging:

- Run representative queries:
  - `panic`
  - `gas`
  - `flatulence`
  - `diarrhoea`
  - `constipation`
  - `craving`
  - `anxiety`
  - remedy abbreviations such as `Acon`, `Ars`, `Nux-v`
- Compare V1 and V2 top 5 overlap.
- Record latency.

Production shadow:

- Enable for low sample rate first.
- Watch logs and latency.
- Increase only after stable results.

## Performance Metrics

Track:

- V1 execution time
- V2 execution time
- total API execution time
- result count difference
- top 1 match
- top 5 overlap percentage
- V2 error count
- adapter warning count
- memory usage if available
- API 500 rate

Initial thresholds:

- API error rate unchanged.
- p95 API latency increase under 50 ms.
- V2 shadow errors under 1%.
- Top 5 overlap reviewed manually before any response replacement.

## User Acceptance Criteria

For Phase 6A:

- Users see no UI change.
- Users receive the same response shape.
- Existing dashboard search behavior remains unchanged.
- No clinician workflow changes.
- No scoring or repertorization changes.
- Internal logs show stable V2 execution.

## Production Monitoring

Monitor:

- Vercel function errors
- API latency
- console error logs containing V2 shadow failures
- query volume
- top 5 overlap metrics
- memory/timeouts

Add alerts for:

- increased `/api/repertory/search` 500s
- repeated V2 shadow exceptions
- latency threshold breach
- timeout increase

## Success Criteria

Phase 6A is successful when:

- flag-off behavior is identical to current production;
- flag-on shadow mode does not change responses;
- no API error increase occurs;
- latency impact is acceptable;
- V2 results can be compared for at least 50-100 representative queries;
- clinician review confirms V2 search is at least as useful for relevant queries;
- rollback has been tested.

## Explicit Non-Goals

Do not:

- replace search results;
- change dashboard UI;
- change scoring;
- change repertorization;
- change AI intake;
- write database migrations;
- expose V2 result ordering to users;
- deploy without review.
