# Safe Rollout Strategy

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Phase: 6 planning only

## Recommended Rollout

Use a four-step rollout. Stop after each step for review.

## Step 0: Approval Gate

No code changes.

Before touching production files, approve:

- exact files;
- flag names;
- logging shape;
- test cases;
- rollback steps;
- latency thresholds.

## Step 1: Code Landed With Flags Off

Purpose:

Add the smallest possible bridge so production can run V2 search only when explicitly enabled.

Rules:

- All new behavior behind server-only flags.
- Flags default off.
- No UI change.
- No response change.
- No database change.
- No scoring change.
- No repertorization change.

Expected user impact:

- None.

Go/no-go:

- Build passes.
- Tests pass.
- Flag-off response is unchanged.
- Rollback commit ready.

## Step 2: Internal Shadow Mode

Purpose:

Run V2 search in parallel with V1 search for selected production requests.

Response:

- Still V1 only.

Metrics:

- V1/V2 top 1 match.
- V1/V2 top 5 overlap.
- V2 execution time.
- V2 error count.
- total API latency.

Sampling:

- Start at 0%.
- Move to 1%.
- Review.
- Move to 5%.
- Review.
- Move to 10% only if stable.

Stop conditions:

- API errors increase.
- p95 latency increases beyond threshold.
- V2 throws repeatedly.
- adapter warnings spike.
- result comparisons show clinically concerning differences.

## Step 3: Clinician Review Dataset

Purpose:

Use shadow logs and curated queries to compare V1 and V2.

Review set:

- common search terms
- misspellings
- synonyms
- remedy abbreviations
- clinical conditions
- modality terms
- edge cases with empty results

Acceptance:

- V2 must improve recall without creating clinically confusing top results.
- V2 must explain why matches occurred.
- V2 must not alter prescriptions, scoring, or repertorization.

## Step 4: Optional Admin-Only Compare Mode

This is not part of first integration unless separately approved.

Possible later behavior:

- existing V1 results remain primary;
- V2 results shown only to authorized admin/clinician reviewer;
- compare panel clearly marked experimental;
- no patient-facing or public exposure.

Files likely touched later:

- `src/app/admin/dashboard/page.tsx`

Do not proceed to this step without separate approval.

## Why Search First

Clinical Search is safest because:

- it is informational;
- it does not rank remedies for prescribing;
- it can run in parallel;
- it can fail open;
- it can be compared objectively;
- it has a simple rollback;
- no database migration is needed.

## Components Deferred

| Component | Reason deferred |
|---|---|
| Rubric Intelligence | May influence navigation and clinician interpretation. Needs review after search stability. |
| Repertorization Engine | Directly affects remedy ranking. High clinical risk. |
| Validation Framework | Offline tool first. No production need yet. |
| Knowledge Curation | Requires data governance and likely future database model approval. |

## Success Criteria For Rollout

The first rollout succeeds only if:

- production behavior remains unchanged;
- flags off means no V2 execution;
- shadow mode never breaks V1 response;
- metrics show acceptable latency;
- search comparisons are clinically reviewable;
- rollback is verified.
