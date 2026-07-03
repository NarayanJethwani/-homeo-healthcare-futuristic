# Feature Flag Strategy

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 6 planning only

## Current V2 Flags

Existing isolated flags:

| Flag | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_REPERTORY_V2_ENABLED` | UI-level V2 enablement. Should remain off. | off |
| `REPERTORY_V2_API_ENABLED` | API-level V2 enablement. Should remain off for this rollout unless explicitly needed. | off |
| `REPERTORY_V2_READ_FROM_FIRESTORE` | V2 Firestore read behavior. Should remain off unless approved. | off |
| `REPERTORY_V2_WRITE_ENABLED` | V2 write behavior. Must remain off. | off |
| `REPERTORY_V2_SHOW_SCORE_BREAKDOWN` | Score breakdown UI. Must remain off. | off |
| `REPERTORY_V2_AI_MAPPING_REVIEW` | AI mapping review. Must remain off. | off |
| `REPERTORY_V2_USE_INDEXED_SEARCH` | Indexed search flag. Keep off until specific approval. | off |
| `REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE` | Master V2 clinical search flag. Candidate for first integration. | off |
| `REPERTORY_V2_USE_RUBRIC_INTELLIGENCE` | Rubric intelligence. Defer. | off |
| `REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE` | V2 repertorization. Defer. | off |
| `REPERTORY_V2_USE_CLINICAL_VALIDATION_FRAMEWORK` | Validation framework. Keep offline. | off |

## Proposed New Flags For First Integration

Do not add until approved.

| Flag | Type | Default | Purpose |
|---|---|---|---|
| `REPERTORY_V2_SEARCH_SHADOW_MODE` | server-only boolean | off | Run V2 search in parallel while returning V1 response. |
| `REPERTORY_V2_SEARCH_LOG_SAMPLE_RATE` | server-only number | `0` | Controls percent of requests that log comparison metrics. |
| `REPERTORY_V2_SEARCH_MAX_RUBRICS` | server-only number | unset | Caps V2 index size to avoid latency spikes. |
| `REPERTORY_V2_SEARCH_FAIL_CLOSED` | server-only boolean | off | Should stay off. V2 must fail open during shadow mode. |

## Flag Rules

### Rule 1: Server-Only For Shadow Mode

Shadow mode flags must not be public `NEXT_PUBLIC_*` flags.

Reason:

- users do not need to know;
- no UI change;
- easier rollback;
- lower exposure risk.

### Rule 2: Master Kill Switch First

V2 search should run only if:

`REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=true`

and

`REPERTORY_V2_SEARCH_SHADOW_MODE=true`

If either is false, no V2 search should execute.

### Rule 3: Fail Open

During first rollout, V2 failure must never break V1 search.

Expected behavior:

- catch V2 errors;
- log only sampled metadata;
- return existing V1 response unchanged.

### Rule 4: No Writes

No V2 flag should enable database writes during Phase 6A.

`REPERTORY_V2_WRITE_ENABLED` must remain false.

### Rule 5: No UI Flag

Do not enable `NEXT_PUBLIC_REPERTORY_V2_ENABLED` for Phase 6A.

Reason:

- shadow mode is server-only;
- no visible user change;
- avoids accidental UI activation.

## Flag Rollout Sequence

1. Deploy code with all flags off.
2. Confirm V1 behavior unchanged.
3. Set sample rate still `0`.
4. Enable master flag only in staging.
5. Enable shadow mode in staging.
6. Review metrics.
7. Enable master flag in production with shadow mode off.
8. Enable shadow mode at low sample rate.
9. Increase sample only after review.

## Emergency Disable

Set these to false:

- `REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=false`
- `REPERTORY_V2_SEARCH_SHADOW_MODE=false`

Keep these false:

- `NEXT_PUBLIC_REPERTORY_V2_ENABLED=false`
- `REPERTORY_V2_WRITE_ENABLED=false`
- `REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE=false`

## Acceptance Criteria

Feature flags are correctly implemented when:

- flag-off path does not import/execute V2 search in production request flow;
- flag-on shadow path returns identical V1 response;
- V2 exceptions do not affect response status;
- flag values can be changed without code changes;
- rollback is immediate through environment variables.
