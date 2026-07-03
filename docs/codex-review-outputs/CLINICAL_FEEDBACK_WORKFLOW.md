# Clinical Feedback Workflow for V1 vs V2 Repertory Comparison

Date: 2026-07-03  
Scope: Dr. Jethwani-only V2 clinical search evaluation

## Purpose

Create a safe workflow for Dr. Narayan Jethwani to evaluate whether the V2 clinical search engine is clinically better, equivalent, or incomplete compared with the current V1 repertory search.

This workflow is observational only.

## Feedback Principles

- V1 remains official.
- V2 is a candidate engine.
- No feedback changes production search.
- No feedback updates rubric data.
- No feedback changes scoring.
- No feedback triggers AI.
- No feedback is written to Firestore in the first version.

## Feedback Options

### Mark V2 better

Use when:

- V2 finds more clinically relevant rubrics.
- V2 ranks a key rubric higher.
- V2 understands synonym or spelling variation better.

### Mark V1 better

Use when:

- V1 gives more clinically accurate results.
- V2 adds distracting or irrelevant rubrics.
- V2 misses repertory conventions important in practice.

### Both acceptable

Use when:

- Both result sets are clinically useful.
- Differences are minor.
- Either output would support safe clinician review.

### V2 missed important rubric

Use when:

- A clinically essential rubric appears in V1 but not V2.
- A rubric exists in the source data but V2 fails to retrieve it.

### V2 found useful rubric

Use when:

- V2 retrieves an important rubric that V1 misses.
- V2 synonym expansion is clinically helpful.

### Needs review

Use when:

- The comparison is inconclusive.
- The query needs a human note.
- Source data quality may be involved.
- A synonym or hierarchy issue may need curation.

## Local Feedback Record

Each record should include:

```ts
interface AdminComparisonFeedbackRecord {
  id: string;
  createdAt: string;
  reviewerEmail: string;
  query: string;
  filters: {
    category: string;
    organSystem: string;
    miasm: string;
    remedy: string;
  };
  decision:
    | "v2_better"
    | "v1_better"
    | "both_acceptable"
    | "v2_missed_important_rubric"
    | "v2_found_useful_rubric"
    | "needs_review";
  notes?: string;
  v1: {
    count: number;
    latencyMs: number;
    top10RubricIds: string[];
  };
  v2: {
    count: number;
    latencyMs: number;
    top10RubricIds: string[];
    synonymMatches: Array<{
      rubricId: string;
      matchCount: number;
    }>;
  };
  comparison: {
    commonRubricIds: string[];
    v1OnlyRubricIds: string[];
    v2OnlyRubricIds: string[];
    rankingDifferences: Array<{
      rubricId: string;
      v1Rank: number | null;
      v2Rank: number | null;
      rankDelta: number | null;
    }>;
  };
}
```

## Storage Plan

Version 1 storage:

- Browser localStorage only.

Key:

```text
repertory_v2_admin_comparison_feedback
```

Benefits:

- No production database writes.
- Easy rollback.
- No migration.
- No privacy expansion.
- Dr. Jethwani can export manually.

Limitations:

- Feedback is browser-specific.
- Clearing browser storage deletes it.
- Not available across devices.

## Export Workflow

Buttons:

- `Copy JSON`
- `Download JSON`
- `Clear local feedback`

Recommended exported filename:

```text
repertory-v2-comparison-feedback-YYYY-MM-DD.json
```

## Review Workflow

1. Dr. Jethwani searches a real clinical term.
2. Panel shows V1 vs V2.
3. Dr. Jethwani reviews top 10 results.
4. Dr. Jethwani selects a feedback decision.
5. Optional note is added.
6. Record is saved locally.
7. At end of review session, export JSON.
8. Export is reviewed offline before any data curation or engine change.

## Future Approved Workflow

Only after separate approval:

- Create a Firestore collection for admin feedback.
- Add server-side audit logs.
- Add reviewer identity and environment.
- Add source rubric curation queue.
- Add synonym curation proposals.
- Add clinical validation benchmark cases from accepted feedback.

Future collection proposal:

```text
repertory_v2_admin_feedback
```

This must not be created in Phase 1 of comparison mode.

## Safety Checks Before Implementation

- Confirm no feedback database writes.
- Confirm no new patient record writes.
- Confirm no AI request.
- Confirm no repertorization endpoint call.
- Confirm no V2 "use result" action.
- Confirm doctors cannot access endpoint.
- Confirm other admins cannot access endpoint unless approved.
- Confirm feature flag defaults OFF.

## Acceptance Criteria

The workflow is acceptable when:

- Dr. Jethwani can compare V1/V2 side by side.
- Other users see no change.
- V1 remains official.
- Feedback stays local.
- Build/tests pass.
- The feature can be disabled instantly by setting:

```text
REPERTORY_V2_ADMIN_COMPARISON_MODE=false
```
