# Admin Mode Restoration Plan

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory only  
Status: Planning only, no code changes made

## Goal

Restore the clinically useful integrated admin-mode repertory workspace as the main working experience inside Dr. Jethwani's Clinical Repertory.

The V2 Clinical engine should not appear as a narrow rubric-only replacement screen. It should support the same full clinical workspace that includes:

- AI Intake
- rubric search and filters
- rubric cards
- active workbench
- severity/frequency/impact modifiers
- repertorization scoring
- remedy contribution details
- reasoning engine
- remedy reasoning analysis
- V1 / Compare / V2 controls
- clinical review warning

## Current Findings

### 1. The integrated workspace still exists

File:

`src/features/repertory/components/RepertoryWorkbench.tsx`

This component already contains the integrated admin-mode experience:

- AI Intake textarea and `Parse Case Intake`
- Clinical rubric search
- category and organ system filters
- rubric catalog/cards
- add/remove rubric controls
- Active Workbench
- severity / frequency / impact adjust modal
- Repertorization Scoring Panel
- remedy ranking and score display
- margin / confidence display
- selected rubric contribution details
- Reasoning Engine
- Affinity, Differential, Coverage, Questions, Timeline tabs
- Remedy Reasoning Analysis
- clinical safety warnings
- V1 / Compare / V2 switcher

Important line references:

- Clinical safety header: `src/features/repertory/components/RepertoryWorkbench.tsx:380`
- V1 / Compare / V2 switcher: `src/features/repertory/components/RepertoryWorkbench.tsx:398`
- Compare panel currently rendered separately: `src/features/repertory/components/RepertoryWorkbench.tsx:400`
- V2 Clinical panel currently rendered separately: `src/features/repertory/components/RepertoryWorkbench.tsx:408`
- Integrated workspace currently gated behind V1 only: `src/features/repertory/components/RepertoryWorkbench.tsx:416`
- AI Intake and search: `src/features/repertory/components/RepertoryWorkbench.tsx:422`
- Rubric catalog: `src/features/repertory/components/RepertoryWorkbench.tsx:494`
- Active Workbench: `src/features/repertory/components/RepertoryWorkbench.tsx:636`
- Repertorization Scoring Panel: `src/features/repertory/components/RepertoryWorkbench.tsx:696`
- Reasoning Engine: `src/features/repertory/components/RepertoryWorkbench.tsx:847`

### 2. The dashboard already routes Dr. Jethwani mode to the integrated workspace

File:

`src/app/admin/dashboard/page.tsx`

The dashboard already renders `RepertoryWorkbench` when Dr. Jethwani's Clinical Repertory is selected.

Important line references:

- Dr. Jethwani switch button: `src/app/admin/dashboard/page.tsx:14136`
- `RepertoryWorkbench` mount: `src/app/admin/dashboard/page.tsx:14148`

This means the core issue is not that the admin workspace was deleted. The issue is that, inside `RepertoryWorkbench`, Compare and V2 Clinical modes currently replace the integrated workspace with separate V2 result panels.

### 3. V2 and Compare panels exist and work

Files:

- `src/features/repertory/components/V2LivePanel.tsx`
- `src/features/repertory/components/V2ComparisonPanel.tsx`
- `src/features/repertory/components/V2ClinicalEngineSwitcher.tsx`

Current behavior:

- V1 Classic shows the integrated workspace.
- Compare mode shows a separate side-by-side comparison panel.
- V2 Clinical mode shows a separate V2 rubric/ranking panel.

Desired behavior:

- V1 Classic keeps existing stable integrated workspace behavior.
- Compare mode shows V1/V2 comparison while keeping the integrated workspace visible.
- V2 Clinical shows V2 intelligence while keeping the integrated workspace visible.

## Exact Files Proposed To Modify

### Low-risk required change

1. `src/features/repertory/components/RepertoryWorkbench.tsx`

Purpose:

- Stop hiding the integrated workspace when `clinicalEngineMode` is `compare` or `v2-live`.
- Render the full AI Intake/Search/Workbench/Scoring/Reasoning workspace for all modes.
- Keep `V2ComparisonPanel` and `V2LivePanel` as integrated intelligence panels above or alongside the workspace instead of replacing it.
- Keep V1 Classic behavior unchanged.
- Keep safety warnings visible.

Risk level: Low to moderate.

Reason:

- This file is isolated under `src/features/repertory/**`.
- It affects Dr. Jethwani's Clinical Repertory UI only.
- It does not change APIs, database, auth, billing, patient, doctor, or public site.
- It does change visible repertory behavior, so it should be approved before editing.

### Optional low-risk polish, only if needed after first implementation

2. `src/features/repertory/components/V2LivePanel.tsx`

Purpose:

- Add a compact/integrated display option if the existing panel feels too large above the workspace.
- Improve fallback notice wording without changing endpoint behavior.

Risk level: Low.

3. `src/features/repertory/components/V2ComparisonPanel.tsx`

Purpose:

- Add a compact/integrated display option if the comparison panel takes too much vertical space.
- Keep side-by-side V1/V2 differences visible.

Risk level: Low.

### High-risk shared file, avoid unless explicitly approved

4. `src/app/admin/dashboard/page.tsx`

Current plan: do not modify.

Possible reason to touch later:

- If Dr. Jethwani Clinical Repertory should become the default initial tab when entering Nexus Atlas, this file would need a default-state change.

Risk level: High.

Reason:

- This is a very large shared dashboard file.
- It contains dashboard, patient, clinical OS, repertory, billing-adjacent, AI, and admin workflow state.
- Any edit here has broader regression risk.

Recommendation:

- Do not touch this file for the first restoration batch.
- Keep the existing Dr. Jethwani button and route.
- Restore integrated behavior inside `RepertoryWorkbench` only.

## Files That Must Not Be Touched

No changes should be made to:

- `src/app/api/repertory/search/route.ts`
- `src/app/api/repertory/repertorize/route.ts`
- `src/app/api/repertory/save/route.ts`
- `src/app/api/repertory/delete/route.ts`
- `src/app/api/repertory/seed/route.ts`
- `src/app/api/repertory/details/route.ts`
- `src/lib/firebaseAdmin.ts`
- `src/lib/repertoryData.ts`
- patient routes and components
- doctor routes and components
- billing code
- authentication/session code
- public site pages
- database schema or migration files

## Is This UI Wiring Or Engine Change?

This is mostly UI wiring.

No engine change is required for the first restoration batch.

The V2 APIs and engines already exist:

- `/api/repertory/v2-live`
- `/api/repertory/v2-compare`
- V2 search/repertorization components under `src/features/repertory/**`

The main problem is presentation flow:

- V1 mode renders the complete workspace.
- Compare and V2 modes currently hide that workspace.

The safe fix is to keep the full workspace mounted in all modes.

## Proposed Safe Implementation

### Step 1: Keep the engine switcher unchanged

Keep:

- V1 Classic
- Compare V1 vs V2
- V2 Clinical

Do not remove any mode.

### Step 2: Convert V2 panels from replacement views into integrated intelligence panels

Current structure:

```tsx
{clinicalEngineMode === 'compare' && <V2ComparisonPanel ... />}
{clinicalEngineMode === 'v2-live' && <V2LivePanel ... />}
{clinicalEngineMode === 'v1' && <IntegratedWorkspace />}
```

Proposed structure:

```tsx
{clinicalEngineMode === 'compare' && <V2ComparisonPanel ... />}
{clinicalEngineMode === 'v2-live' && <V2LivePanel ... />}
<IntegratedWorkspace />
```

Expected result:

- V1 Classic: same as current V1 behavior.
- Compare: comparison panel appears, and the full workspace remains available below.
- V2 Clinical: V2 panel appears, and the full workspace remains available below.

### Step 3: Add clear mode context to the workspace

Small text/badge only:

- V1 Classic: existing stable engine
- Compare V1 vs V2: comparison preview active, V1 remains available
- V2 Clinical: V2 intelligence active, clinician review required

No scoring algorithm change.

### Step 4: Preserve fallback behavior

If V2 fails:

- `V2LivePanel` already displays a fallback error notice.
- The integrated V1 workspace should remain visible because it will no longer be hidden behind the V2 panel.

This directly satisfies:

`If V2 fails, show fallback notice and keep V1 available.`

## Expected User Experience After Restoration

Inside Dr. Jethwani's Clinical Repertory:

### V1 Classic

- Full AI Intake/Search/Workbench/Scoring/Reasoning workspace.
- Existing stable behavior.

### Compare V1 vs V2

- V1/V2 comparison panel visible.
- Full AI Intake/Search/Workbench/Scoring/Reasoning workspace still available.
- Clinician can compare without losing the working repertory page.

### V2 Clinical

- V2 rubric/ranking/explainability panel visible.
- Full AI Intake/Search/Workbench/Scoring/Reasoning workspace still available.
- Clinician can continue selecting rubrics, adjusting severity/frequency/impact, and reviewing deterministic reasoning.

## Testing Plan

Local checks:

1. `git diff --check HEAD`
2. focused TypeScript/build check
3. `npm run build`
4. `npm test`
5. `npm run lint`

Browser verification:

1. Open `https://portal.homeo.healthcare/admin/dashboard?tab=nexus-atlas`
2. Click Dr. Jethwani's Clinical Repertory
3. Verify V1 Classic:
   - AI Intake visible
   - Search visible
   - Rubric cards visible
   - Add rubric works
   - Active Workbench updates
   - Adjust works
   - Remove works
   - Clear workbench works
   - Scoring panel updates
   - Reasoning panel updates
4. Verify Compare:
   - V1/V2 comparison visible
   - Integrated workspace remains visible
   - Workbench still works
   - Safety warning visible
5. Verify V2 Clinical:
   - V2 panel visible
   - Integrated workspace remains visible
   - Workbench still works
   - Reasoning panel still works
   - Safety warning visible
6. Verify fallback:
   - If V2 API fails, V2 error notice appears
   - V1 workspace remains usable

Production safety checks:

- Dashboard still loads.
- Patient module untouched.
- Doctor module untouched.
- Auth untouched.
- Billing untouched.
- Public site untouched.
- V1 Classic still available.

## Rollback Plan

If the restoration causes problems:

```bash
git revert <restoration_commit_sha>
git push origin main
```

Expected rollback result:

- V1 Classic remains as before.
- Compare and V2 Clinical return to current narrow panel behavior.
- No database cleanup required.

## Approval Needed

Approval is required before implementation because this changes the live visual behavior of Dr. Jethwani's Clinical Repertory.

Recommended first approved batch:

1. Modify only `src/features/repertory/components/RepertoryWorkbench.tsx`.
2. Keep dashboard page untouched.
3. Keep all APIs untouched.
4. Keep all database code untouched.
5. Run build/tests/lint.
6. Verify locally or through production after deploy.

After implementation, create:

- `ADMIN_MODE_RESTORATION_REPORT.md`
- `V2_INTEGRATED_WORKSPACE_DEPLOYMENT_REPORT.md`

