# V2 Clinical Feedback Model

Date: 2026-07-03  
Scope: Clinical feedback for V2 repertory evaluation

## Goal

Store clinician feedback safely in:

```text
v2ClinicalFeedback
```

Feedback should support improving the V2 engine and future knowledge curation without changing current clinical records or prescribing behavior.

## Feature Flag

Recommended:

```text
REPERTORY_V2_FEEDBACK_ENABLED=false
```

Default:

- Feedback write endpoint rejects writes unless explicitly enabled.

## Collection Name

```text
v2ClinicalFeedback
```

## Feedback Actions

Allowed decisions:

```ts
type V2ClinicalFeedbackDecision =
  | "v2_better"
  | "v1_better"
  | "both_acceptable"
  | "v2_missed_important_rubric"
  | "v2_found_useful_rubric"
  | "needs_correction"
  | "clinical_note";
```

UI labels:

- V2 better
- V1 better
- Both acceptable
- V2 missed important rubric
- V2 found useful rubric
- Needs correction
- Add clinical note

## Proposed Document Shape

```ts
interface V2ClinicalFeedback {
  id: string;
  createdAt: string;
  environment: "production" | "preview" | "development";
  reviewer: {
    uid: string;
    email?: string | null;
    role: "admin" | "doctor";
    name?: string;
  };
  mode: "compare" | "v2-live";
  decision: V2ClinicalFeedbackDecision;
  note?: string;
  query: string;
  filters: {
    category?: string;
    organSystem?: string;
    miasm?: string;
    remedy?: string;
  };
  v1?: {
    resultCount: number;
    latencyMs?: number;
    topRubrics: FeedbackRubricSnapshot[];
    remedyRankings?: FeedbackRemedyRanking[];
  };
  v2: {
    resultCount: number;
    latencyMs?: number;
    topRubrics: FeedbackRubricSnapshot[];
    remedyRankings?: FeedbackRemedyRanking[];
    synonymMatches?: Array<{
      rubricId: string;
      terms: string[];
    }>;
    hierarchyMatches?: Array<{
      rubricId: string;
      breadcrumb: string[];
    }>;
    explanations?: string[];
  };
  comparison?: {
    commonRubricIds: string[];
    v1OnlyRubricIds: string[];
    v2OnlyRubricIds: string[];
    rankingDifferences: Array<{
      rubricId: string;
      v1Rank: number | null;
      v2Rank: number | null;
      rankDelta: number | null;
    }>;
    scoreDifferences?: Array<{
      remedyId: string;
      v1Score?: number;
      v2Score?: number;
      delta?: number;
    }>;
  };
  safety: {
    clinicianReviewed: boolean;
    autoPrescribed: false;
    patientRecordModified: false;
  };
}
```

Supporting types:

```ts
interface FeedbackRubricSnapshot {
  id: string;
  title: string;
  path?: string[];
  source?: string;
  score?: number;
}

interface FeedbackRemedyRanking {
  remedyId: string;
  remedyName?: string;
  rank: number;
  score: number;
  confidence?: number;
}
```

## Write Rules

Feedback writes are allowed only when:

- User has valid admin/doctor session.
- User already has platform access.
- `REPERTORY_V2_FEEDBACK_ENABLED=true`.
- Request body passes schema validation.

Feedback writes must never:

- Modify patients.
- Modify doctors.
- Modify billing.
- Modify rubrics.
- Modify remedies.
- Modify source knowledge database.
- Trigger AI.
- Trigger prescribing.

## API Endpoint

Proposed file:

- `src/app/api/repertory/v2-feedback/route.ts`

Methods:

- `POST`: create feedback document.

Response:

```ts
{ success: true, feedbackId: string }
```

Disabled response:

```ts
{ success: false, message: "V2 feedback is disabled." }
```

## Local Fallback

If feedback write flag is OFF:

- UI may store feedback in localStorage.
- Show label:

```text
Saved locally only
```

Local key:

```text
repertory_v2_clinical_feedback_local
```

## Risk Level

Medium.

Reason:

- Introduces a new write path.

Mitigation:

- New collection only.
- No patient/rubric/remedy writes.
- Feature flag OFF by default.
- Schema validation.
- No automatic clinical effect.

## Test Plan

Tests:

- Reject feedback when flag OFF.
- Reject unauthenticated request.
- Accept authenticated request when flag ON.
- Validate required fields.
- Enforce `autoPrescribed: false`.
- Confirm no patient/rubric write module is imported.

## Rollback

Immediate:

```text
REPERTORY_V2_FEEDBACK_ENABLED=false
```

Code rollback:

- Remove `src/app/api/repertory/v2-feedback/route.ts`.
- Remove feedback component mount.

Data rollback:

- No clinical data rollback required.
- Feedback documents can be archived or ignored.
