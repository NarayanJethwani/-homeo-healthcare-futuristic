# V2 Deployment Risk Review

Date: 2026-07-03  
Scope: V2 Clinical Repertory Live Mode

## Overall Risk

Risk level: high.

Reason:

- This changes clinician-facing repertory behavior.
- It introduces live V2 search, V2 repertorization, explainability, and feedback.
- It touches the large admin dashboard file.

Mitigating factor:

- V1 remains available as fallback.
- New mode selector makes V2 explicit.
- Flags can disable Compare/V2 Live.

## Major Risks

### 1. Clinical Risk

Risk:

- Clinician may over-trust V2 rankings.

Mitigation:

- Always show:

```text
Clinical review required — do not auto-prescribe
```

- Add clinician verification notice.
- No auto-prescribe buttons.
- Keep V1 fallback visible.

### 2. UI Regression Risk

Risk:

- `src/app/admin/dashboard/page.tsx` is very large and shared by stable workflows.

Mitigation:

- Add isolated components.
- Make one small dashboard mount.
- Do not edit unrelated patient/doctor/billing/auth/public sections.

### 3. Search Behavior Risk

Risk:

- V2 search may return different rubrics than V1.

Mitigation:

- Keep V1 Mode default.
- Provide Compare Mode.
- Show V1-only and V2-only rubrics clearly.
- Collect feedback.

### 4. Repertorization Risk

Risk:

- V2 ranking may differ from current ranking.

Mitigation:

- Label V2 ranking clearly.
- Show explainability and contribution breakdown.
- Keep V1 ranking visible in Compare Mode.
- Do not remove V1 repertorization.

### 5. Database Write Risk

Risk:

- New feedback collection introduces a write path.

Mitigation:

- Only write to `v2ClinicalFeedback`.
- Feature flag:

```text
REPERTORY_V2_FEEDBACK_ENABLED=false
```

- No patient/rubric/remedy writes.
- No migration.

### 6. Knowledge Base Risk

Risk:

- Importing copyrighted data illegally.

Mitigation:

- Do not import copyrighted commercial repertory databases unless legally provided.
- Preserve provenance and source metadata.

## Exact Files by Risk Level

### Low Risk

- `src/features/repertory/flags/repertoryFlags.ts`
- `src/features/repertory/liveMode/types.ts`
- `src/features/repertory/liveMode/comparisonEngine.ts`
- `src/features/repertory/liveMode/feedbackModel.ts`
- `src/features/repertory/__tests__/v2LiveMode.test.ts`
- `src/features/repertory/__tests__/v2ComparisonMode.test.ts`

### Medium Risk

- `src/features/repertory/liveMode/liveEngine.ts`
- `src/app/api/repertory/v2-live/route.ts`
- `src/app/api/repertory/v2-compare/route.ts`
- `src/app/api/repertory/v2-feedback/route.ts`
- `src/features/repertory/components/V2ClinicalEngineSwitcher.tsx`
- `src/features/repertory/components/V2ComparisonPanel.tsx`
- `src/features/repertory/components/V2LivePanel.tsx`
- `src/features/repertory/components/V2ClinicalFeedbackPanel.tsx`

### High Risk

- `src/app/admin/dashboard/page.tsx`

## Files That Must Remain Untouched

- `src/app/api/patient/**`
- `src/app/patient/**`
- `src/app/doctors/**`
- `src/app/store/**`
- `src/app/api/invoice/**`
- `src/app/api/admin/extend-subscription/route.ts`
- `src/app/api/admin/remove-doctor/route.ts`
- `src/app/api/chat/**`
- `src/app/api/ai-diagnostics/**`
- `src/app/api/consult-ai/**`
- `src/app/page.tsx`
- `src/lib/repertoryDbService.ts`

## Rollback Plan

Immediate UI rollback:

```text
NEXT_PUBLIC_REPERTORY_V2_LIVE_MODE=false
NEXT_PUBLIC_REPERTORY_V2_COMPARE_MODE=false
REPERTORY_V2_FEEDBACK_ENABLED=false
```

Fallback behavior:

- V1 mode remains available.
- Clinicians can switch back to V1 immediately.

Code rollback:

```bash
git revert <v2-live-dashboard-mount-commit>
git revert <v2-live-api-commit>
git revert <v2-live-components-commit>
git revert <v2-live-flags-types-commit>
git push origin main
```

Database rollback:

- No migration expected.
- Feedback collection can be ignored or archived.
- No clinical patient data rollback required if scope is obeyed.

## Pre-Deployment Checklist

- `npm run build` passes.
- `npm test` passes.
- `npm run lint` has no errors.
- V1 mode tested.
- Compare mode tested.
- V2 Live mode tested.
- Feedback disabled tested.
- Feedback enabled tested in staging/local.
- Dashboard tested.
- Patient module smoke tested.
- Doctor module smoke tested.
- Repertory V1 fallback tested.

## Post-Deployment Health Checks

- Dashboard loads.
- Dr. Jethwani Clinical Repertory loads.
- V1 mode works.
- Compare mode works only when flag is enabled.
- V2 Live mode works only when flag is enabled.
- Safety badge visible.
- V1 fallback available.
- Feedback writes only to `v2ClinicalFeedback`.
- No patient/doctor/billing/auth errors.
- No database migrations executed.

## Deployment Recommendation

Do not deploy V2 Live directly in one large commit.

Recommended release order:

1. Deploy flags/types/components hidden.
2. Deploy read-only Compare Mode.
3. Enable Compare Mode.
4. Deploy V2 Live mode.
5. Enable V2 Live only after comparison confidence.
6. Deploy feedback write path.
7. Enable feedback after verifying collection permissions.

## Approval Boundary

Implementation should not begin until approved.

After approval, implement in small commits and do not deploy until build/tests/lint pass.
