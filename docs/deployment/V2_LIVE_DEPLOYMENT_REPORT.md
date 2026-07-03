# V2 Live Deployment Report

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory V2 Live/Compare mode only

## Deployment Summary

Status: **Deployed**

The V2 Clinical Repertory infrastructure and UI mode switch have been implemented, committed, pushed to GitHub `main`, and deployed by Vercel.

V1 remains available as the default fallback mode. V2 does not replace V1 globally.

## Git Commit Pushed

Branch: `main`

Latest commit:

`3feee657ccf5c518b3cfd50d6fb5d0cbee13cfd6`

Commits included:

- `4b6bd4b` Add V2 repertory live mode foundation
- `bfaa1aa` Add V2 repertory live APIs
- `3feee65` Add V2 repertory mode UI

Git status after push:

`main...origin/main`

## Deployment URLs

Vercel deployments completed successfully:

- Homeo Healthcare main app: `https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-futuristic/GKovjqjkuSfUHm6ufbAxXKLKyPmj`
- Homeo Healthcare portal: `https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-portal/Hjw6vTLS1RvXeAnxeTMLrhsPpF3R`

Production URLs checked:

- `https://www.homeo.healthcare`
- `https://www.homeo.healthcare/admin/dashboard`
- `https://portal.homeo.healthcare/admin/dashboard`

## Build, Test, and Lint Status

Build:

- `npm run build`: **passed**
- Next.js generated all pages successfully.
- New API routes were included in the production build:
  - `/api/repertory/v2-live`
  - `/api/repertory/v2-compare`
  - `/api/repertory/v2-feedback`

Tests:

- Focused V2 tests: **passed**
- Full project test script: **passed**
  - Clinical Portal Suite: 9 passed
  - Knowledge Management Suite: 10 passed
  - Public API/Search Boundary: 6 passed

Lint:

- `npm run lint`: **passed**
- Existing warnings remain; no blocking lint errors.

## Production Health Checks

Read-only production checks after deployment:

- Public site: `200`
- Admin dashboard: `200`
- Portal admin dashboard: `200`
- Patient dashboard route: `200`
- Doctors route: `200`
- AI health route: `200`
- Existing V1 repertory search: `200`

V2 route reachability:

- `/api/repertory/v2-live`: `401` unauthenticated, confirming the deployed route exists and is protected.
- `/api/repertory/v2-compare`: `401` unauthenticated, confirming the deployed route exists and is protected.
- `/api/repertory/v2-feedback`: `405` for read-style probe, confirming method protection.

## Feature Mode Status

Available repertory modes:

- **V1 Classic**
- **Compare V1 vs V2**
- **V2 Clinical**

Default mode:

- **V1 Classic**

Safety notice:

- The UI includes: **Clinical review required — do not auto-prescribe**

The V2 modes are opt-in through the repertory screen switch. V2 has not been made the only mode.

## Data and Migration Status

Database migration:

- **None**

Copyrighted repertory source import:

- **None**

Production clinical database changes:

- No rubric/remedy/patient/doctor/billing/auth schema changes.

Feedback storage:

- V2 clinical feedback is isolated to `v2ClinicalFeedback`.

## What Changed

New isolated V2 live-mode foundation:

- `src/features/repertory/liveMode/types.ts`
- `src/features/repertory/liveMode/comparisonEngine.ts`
- `src/features/repertory/liveMode/liveEngine.ts`
- `src/features/repertory/liveMode/feedbackModel.ts`
- `src/features/repertory/liveMode/index.ts`

New V2 APIs:

- `src/app/api/repertory/v2-live/route.ts`
- `src/app/api/repertory/v2-compare/route.ts`
- `src/app/api/repertory/v2-feedback/route.ts`

New V2 UI components:

- `src/features/repertory/components/ClinicalSafetyBadge.tsx`
- `src/features/repertory/components/V2ClinicalEngineSwitcher.tsx`
- `src/features/repertory/components/V2ComparisonPanel.tsx`
- `src/features/repertory/components/V2LivePanel.tsx`
- `src/features/repertory/components/V2ClinicalFeedbackPanel.tsx`

Updated repertory workbench:

- `src/features/repertory/components/RepertoryWorkbench.tsx`

Updated feature flag definitions:

- `src/features/repertory/flags/repertoryFlags.ts`

New tests:

- `src/features/repertory/__tests__/v2ComparisonMode.test.ts`
- `src/features/repertory/__tests__/v2FeedbackModel.test.ts`

## Safety Confirmation

Confirmed:

- V1 remains the default mode.
- V1 remains available as fallback.
- Existing V1 search endpoint remains healthy.
- V2 does not remove or replace existing repertorization.
- No database migration was added.
- No copyrighted repertory database was imported.
- No billing/auth/patient/doctor workflow changes were made.
- V2 API routes require admin API session protection.
- Clinical safety warning is present in the repertory mode switch.

## Warnings

- Production UI testing requiring authenticated admin interaction could not be fully completed from the unauthenticated deployment probe.
- V2 Clinical and Compare modes should be personally tested by Dr. Narayan Jethwani in the live admin repertory screen before wider use.
- Existing lint warnings remain in the project, but the lint command exits successfully.

## Rollback Procedure

Preferred rollback from Git:

```bash
git revert 3feee65
git revert bfaa1aa
git revert 4b6bd4b
git push origin main
```

Operational fallback:

- Select **V1 Classic** in the repertory screen.
- V1 remains available and is the default mode.

Vercel fallback:

- Use the Vercel dashboard to promote the previous successful production deployment if immediate rollback is required.

## Final Recommendation

Deployment is complete and production health checks are passing.

Recommendation: **Proceed with physician-led testing of Compare V1 vs V2 and V2 Clinical mode, while keeping V1 Classic available as the fallback.**

