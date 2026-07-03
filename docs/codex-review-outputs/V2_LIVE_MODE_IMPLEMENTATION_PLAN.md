# V2 Live Mode Implementation Plan

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Status: Planning only, no code changes yet

## Goal

Add a selectable clinical engine mode inside Dr. Jethwani's Clinical Repertory:

```text
Clinical Engine: [V1] [Compare] [V2 Live]
```

V1 remains available as the stable fallback. V2 Live becomes a user-selected mode inside the working repertory module, not a silent replacement.

## Required Modes

### 1. V1 Mode

Purpose:

- Preserve existing stable behavior.
- Use current Jethwani repertory search/filtering.
- Use current remedy ranking/repertorization behavior.

Default:

- V1 should remain the default unless a feature flag and user selection explicitly choose another mode.

### 2. Compare Mode

Purpose:

- Show V1 and V2 side by side.
- Let clinicians compare without replacing current behavior.

Includes:

- V1 rubrics
- V2 rubrics
- common rubrics
- V1-only rubrics
- V2-only rubrics
- V1 remedy ranking
- V2 remedy ranking
- score differences
- why V2 ranked differently
- missing rubrics
- newly discovered rubrics
- synonym matches
- hierarchy/breadcrumb matches
- clinical explanation

### 3. V2 Live Mode

Purpose:

- Use V2 search, rubric intelligence, repertorization, and explainability for the active repertory view.

Includes:

- V2 rubric results
- V2 remedy ranking
- V2 score explanation
- remedy contribution breakdown
- clinical confidence
- missing rubric warnings
- clinician verification notice

Important:

- V2 Live must not remove V1.
- V2 Live must not auto-prescribe.
- V2 Live must always show the safety badge:

```text
Clinical review required — do not auto-prescribe
```

## Access Policy

Per instruction, V2 should not be restricted to only two users by code.

Recommended control:

- Platform access remains controlled by existing auth and roles.
- V2 visibility is controlled by environment feature flags.
- Any logged-in user who already has permission to use Dr. Jethwani's Clinical Repertory can use V2 if the flag is enabled.

## Proposed Feature Flags

Existing V2 flags:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE
REPERTORY_V2_USE_RUBRIC_INTELLIGENCE
REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE
REPERTORY_V2_SHOW_SCORE_BREAKDOWN
REPERTORY_V2_WRITE_ENABLED
```

New recommended flags:

```text
NEXT_PUBLIC_REPERTORY_V2_LIVE_MODE=false
NEXT_PUBLIC_REPERTORY_V2_COMPARE_MODE=false
REPERTORY_V2_ADMIN_COMPARISON_MODE=false
REPERTORY_V2_FEEDBACK_ENABLED=false
```

Deployment-safe defaults:

- V1 only.
- Compare hidden.
- V2 Live hidden.
- Feedback writes disabled.

## Exact Files to Modify

### Low Risk

| File | Change |
|---|---|
| `src/features/repertory/flags/repertoryFlags.ts` | Add live/compare/feedback flags with default OFF. |
| `src/features/repertory/__tests__/repertoryFlags.test.ts` | Add tests for new flags defaulting OFF. |
| `src/features/repertory/liveMode/types.ts` | New types for engine mode, V1/V2 comparison, live response, feedback. |
| `src/features/repertory/liveMode/comparisonEngine.ts` | New pure comparison utility for V1/V2 rubric/ranking differences. |
| `src/features/repertory/liveMode/liveEngine.ts` | New orchestrator that runs V2 search/intelligence/repertorization without touching existing V1 code. |
| `src/features/repertory/liveMode/feedbackModel.ts` | New feedback schema/types. |
| `src/features/repertory/__tests__/v2LiveMode.test.ts` | New isolated tests for V2 live orchestration. |
| `src/features/repertory/__tests__/v2ComparisonMode.test.ts` | New isolated tests for comparison output. |

### Medium Risk

| File | Change |
|---|---|
| `src/app/api/repertory/v2-live/route.ts` | New API endpoint for V2 Live results. |
| `src/app/api/repertory/v2-compare/route.ts` | New API endpoint for V1 vs V2 comparison results. |
| `src/app/api/repertory/v2-feedback/route.ts` | New API endpoint for clinical feedback; writes only to `v2ClinicalFeedback` if enabled. |
| `src/features/repertory/components/V2ClinicalEngineSwitcher.tsx` | New segmented control: V1 / Compare / V2 Live. |
| `src/features/repertory/components/V2ComparisonPanel.tsx` | New comparison display panel. |
| `src/features/repertory/components/V2LivePanel.tsx` | New V2 live results/explainability panel. |
| `src/features/repertory/components/V2ClinicalFeedbackPanel.tsx` | New feedback buttons and clinical note input. |
| `src/features/repertory/components/ClinicalSafetyBadge.tsx` | New reusable safety badge. |

### High Risk

| File | Change |
|---|---|
| `src/app/admin/dashboard/page.tsx` | Add engine mode state and mount the new panels inside Dr. Jethwani's Clinical Repertory only. |

Reason this file is high risk:

- It is very large.
- It contains existing dashboard, patient, doctor, billing, AI, and repertory workflows.
- Changes must be tiny, additive, and limited to the Jethwani repertory section.

## Files Not to Modify

- `src/app/api/repertory/search/route.ts` unless explicitly approved for shared V1 logic extraction.
- `src/app/api/repertory/repertorize/route.ts`
- `src/app/api/repertory/save/route.ts`
- `src/app/api/repertory/delete/route.ts`
- `src/app/api/patient/**`
- `src/app/api/admin/extend-subscription/route.ts`
- `src/app/api/admin/remove-doctor/route.ts`
- `src/app/api/invoice/**`
- `src/app/api/chat/**`
- `src/app/api/ai-diagnostics/**`
- `src/app/api/consult-ai/**`
- `src/app/patient/**`
- `src/app/doctors/**`
- `src/app/store/**`
- `src/app/page.tsx`
- `src/lib/repertoryDbService.ts`
- Firestore rules unless separately approved

## Implementation Strategy

### Step 1: Add V2 Live Types and Flags

- Add mode type:

```ts
type ClinicalEngineMode = "v1" | "compare" | "v2-live";
```

- Add default-off flags.
- Add tests.

Risk: low.

### Step 2: Add Isolated V2 Live Orchestrator

The orchestrator should:

- Accept query, filters, selected rubrics.
- Run V2 clinical search.
- Run rubric hierarchy/intelligence.
- Run V2 repertorization on selected V2 rubrics.
- Return explainability and confidence.
- Never write database.
- Never call AI.
- Never call existing V1 repertorization route.

Risk: low to medium.

### Step 3: Add New Read-Only API Endpoints

Create:

- `/api/repertory/v2-live`
- `/api/repertory/v2-compare`

These should:

- Require authenticated admin/doctor session.
- Require V2 flags.
- Read rubrics only.
- Return no-store responses.
- Never mutate data.

Risk: medium.

### Step 4: Add Feedback Endpoint

Create:

- `/api/repertory/v2-feedback`

Writes only if:

```text
REPERTORY_V2_FEEDBACK_ENABLED=true
```

Collection:

```text
v2ClinicalFeedback
```

Risk: medium because it introduces a new write path. Keep tightly scoped.

### Step 5: Add UI Components

Create new components under:

```text
src/features/repertory/components/
```

No dashboard wiring yet.

Risk: medium.

### Step 6: Add Tiny Dashboard Mount

In `src/app/admin/dashboard/page.tsx`:

- Add `clinicalEngineMode` state near Jethwani repertory state.
- Render `V2ClinicalEngineSwitcher`.
- Render safety badge.
- Render V1 unchanged when mode is `v1`.
- Render comparison panel when mode is `compare`.
- Render V2 live panel when mode is `v2-live`.

Risk: high. Keep patch minimal.

## Data Flow

### V1 Mode

```text
Dashboard local V1 Jethwani data/filtering -> current UI -> current ranking
```

### Compare Mode

```text
Dashboard query/filters/selected rubrics
  -> /api/repertory/v2-compare
  -> V1 snapshot + V2 engine
  -> Comparison panel
```

### V2 Live Mode

```text
Dashboard query/filters/selected rubrics
  -> /api/repertory/v2-live
  -> V2 search + hierarchy + repertorization + explainability
  -> V2 live panel
```

### Feedback

```text
Feedback button/note
  -> /api/repertory/v2-feedback
  -> v2ClinicalFeedback
```

Only if feedback flag is enabled.

## Safety Requirements

- Show safety badge in all modes.
- Never hide V1 fallback.
- Never auto-prescribe.
- Never write feedback unless feedback flag is on.
- Never change patient records from V2.
- Never change doctor records from V2.
- Never change billing/auth/public site.

## Testing Required

Commands:

```bash
npm run build
npm test
npm run lint
```

Additional targeted tests:

- V1 mode renders without calling V2 endpoints.
- Compare mode returns both V1 and V2.
- V2 Live mode returns V2-only results.
- V2 Live explains ranking.
- Feedback is rejected when feedback flag is OFF.
- Feedback is accepted only when feedback flag is ON and user is authenticated.
- V1 fallback remains available after switching modes.

## Deployment Plan After Approval

1. Implement in small commits.
2. Run local build/tests/lint.
3. Deploy with all new V2 UI flags OFF.
4. Enable Compare Mode first.
5. Verify.
6. Enable V2 Live Mode only after Compare Mode passes.
7. Enable feedback only after confirming write path.

## Approval Needed

Please approve before coding.

Recommended first approved batch:

1. Flags and types.
2. Read-only V2 compare/live API endpoints.
3. UI components without dashboard mount.
4. Dashboard mount.
5. Feedback endpoint last.
