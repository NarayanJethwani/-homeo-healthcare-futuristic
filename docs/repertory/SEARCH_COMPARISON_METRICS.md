# Search Comparison Metrics

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Mode: V2 Clinical Search shadow observation

## Log Label

Shadow logs use:

```text
[repertory-v2-search-shadow]
```

The log payload is JSON.

## Metrics Produced

| Metric | Meaning |
|---|---|
| `query` | Search query used for both engines. |
| `filters` | Category, organ system, miasm, and remedy filters. |
| `v1ExecutionMs` | Time from request start until V1 response payload was ready and V2 shadow task began. |
| `v2ExecutionMs` | Time spent adapting candidates, building V2 index, searching, and comparing. |
| `v1Count` | Count of V1 rubrics returned to clinicians. |
| `v2Count` | Count of V2 shadow rubrics. |
| `matchedRubricIds` | V1 rubric IDs also found by V2. |
| `missingRubricIds` | V1 rubric IDs not found by V2. |
| `additionalRubricIds` | V2 rubric IDs not present in V1. |
| `rankingDifferences` | Rank comparison for V1/V2 overlapping and non-overlapping rubric IDs. |
| `synonymMatches` | V2 rubrics where at least one synonym match contributed. |
| `searchScoreDifferences` | V2 score snapshot by rubric ID. V1 does not expose final scores after mapping, so this stores V2 scoring for review. |
| `topV1` | Top V1 result snapshot with ID/title only. |
| `topV2` | Top V2 result snapshot with ID/title/score/synonym count only. |
| `adapterWarningCount` | Count of warnings created while adapting Firestore-shaped rubrics to canonical rubrics. |
| `error` | Present only if V2 shadow comparison failed. |

## Ranking Difference Shape

```json
{
  "rubricId": "example-rubric",
  "v1Rank": 1,
  "v2Rank": 3,
  "rankDelta": 2
}
```

If a rubric exists in only one engine:

- missing rank is `null`;
- `rankDelta` is `null`.

## Synonym Match Shape

```json
{
  "rubricId": "flatulence",
  "matchCount": 1
}
```

This helps prove whether V2 improves synonym-aware retrieval.

## Search Score Snapshot

```json
{
  "rubricId": "abdominal-gas",
  "v2Score": 1234.5
}
```

V1 scores are not returned after the current API maps scored results back to rubrics, so Phase 1 logs V2 scores only. If later approved, V1 score capture can be added internally without changing the API response.

## Privacy And Safety

The log intentionally avoids:

- patient identifiers;
- user identifiers;
- clinical prescriptions;
- remedy recommendations as final advice;
- full patient case text.

The log contains query text and rubric IDs/titles. If query privacy becomes a concern, the next approved change should hash or sample queries.

## Review Criteria

Review V2 readiness using:

- V2 execution time;
- API latency impact;
- top 5 overlap;
- clinically useful additional rubrics;
- clinically concerning missing rubrics;
- synonym match rate;
- adapter warning rate;
- V2 error rate.

## Success Target Before Any Visible Integration

V2 should show:

- stable execution without affecting V1;
- low adapter warning count;
- useful additional results for synonym/misspelling queries;
- no clinically dangerous result drift;
- acceptable latency in shadow mode;
- reviewed rollback procedure.

Until then, V2 results remain invisible to clinicians.
