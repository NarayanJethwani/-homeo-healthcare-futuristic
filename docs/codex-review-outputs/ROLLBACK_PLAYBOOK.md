# Rollback Playbook

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 6 planning only

## Rollback Principle

The first integration must be reversible in minutes.

The safest rollback is:

1. turn flags off;
2. confirm V1 behavior;
3. revert code only if needed.

## Immediate Rollback: Feature Flags

Use this if:

- API errors increase;
- search latency increases;
- V2 shadow errors repeat;
- comparison metrics look clinically concerning;
- any unexpected response change is detected.

Set:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=false
REPERTORY_V2_SEARCH_SHADOW_MODE=false
REPERTORY_V2_SEARCH_LOG_SAMPLE_RATE=0
```

Confirm these remain false:

```text
NEXT_PUBLIC_REPERTORY_V2_ENABLED=false
REPERTORY_V2_WRITE_ENABLED=false
REPERTORY_V2_USE_RUBRIC_INTELLIGENCE=false
REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE=false
REPERTORY_V2_USE_CLINICAL_VALIDATION_FRAMEWORK=false
```

Expected result:

- V2 search no longer runs;
- `/api/repertory/search` returns existing V1 response;
- no dashboard behavior changes.

## Code Rollback

Use this if flag rollback is not enough.

Steps:

1. Revert the Phase 6A integration commit.
2. Redeploy previous known-good build.
3. Confirm no V2 search bridge file is imported by production API.
4. Confirm `/api/repertory/search` works for representative queries.

Expected touched files to revert:

- `src/app/api/repertory/search/route.ts`
- `src/features/repertory/integration/clinicalSearchShadow.ts`
- `src/features/repertory/__tests__/clinicalSearchShadow.test.ts`
- any newly added shadow flags in `src/features/repertory/flags/repertoryFlags.ts`

## Validation After Rollback

Run manual checks:

- query `panic`
- query `gas`
- query `constipation`
- query `anxiety`
- query `Acon`
- query with empty `q`
- query with filters

Expected:

- status 200;
- response shape unchanged;
- rubrics array returned;
- no V2 shadow logs;
- no new dashboard issues.

## Monitoring After Rollback

Watch for 30-60 minutes:

- `/api/repertory/search` error rate
- API latency
- Vercel function logs
- dashboard search behavior
- user-reported issues

## Stop Conditions During Rollout

Stop rollout and rollback if:

- any production response shape changes unexpectedly;
- API 500 rate increases;
- p95 latency exceeds threshold;
- V2 errors exceed 1%;
- V2 shadow mode affects V1 response;
- clinician review flags unsafe search matches;
- feature flag behavior is inconsistent.

## Communication Checklist

Before rollback:

- record current flag values;
- record error/latency symptoms;
- identify deployment version;
- notify reviewer.

After rollback:

- confirm flags disabled;
- confirm behavior restored;
- document incident;
- mark next integration attempt blocked until reviewed.

## Clinical Safety Note

Because Phase 6A is search shadow mode only, rollback should never affect clinical scoring or repertorization. If any scoring or repertorization behavior changes, that indicates an integration boundary violation and the release should be fully reverted.
