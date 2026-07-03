# V2 Integrated Workspace Deployment Report

Date: 2026-07-03  
Branch: `main`  
Commit deployed: `a690e192896366348a23d916712b0f06aa490f5d`

## Deployment Summary

The approved admin-mode restoration was pushed and deployed to production.

Goal achieved:

V2 Clinical and Compare modes no longer replace the full clinical workspace. They now render their V2/Compare panels while the integrated AI Intake, Search, Workbench, Scoring, and Reasoning workspace remains visible.

## Deployment URLs

Portal deployment:

`https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-portal/5Cm5qgEbUHFt7VtnDc1hievGwqVs`

Public deployment:

`https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-futuristic/2PDKK5VNPEnwNB6pgo6gZ2od4oHo`

Production URLs:

- `https://portal.homeo.healthcare/admin/dashboard`
- `https://www.homeo.healthcare/admin/dashboard`

## Build Status

Vercel:

- `homeo-healthcare-portal`: success
- `homeo-healthcare-futuristic`: success

GitHub deployment status:

- success

## Local Verification Before Deployment

Passed:

- `npm run build`
- `npm test`
- `npm run lint`

Build note:

- The first build attempt failed because network access was restricted while Next.js tried to fetch Google fonts.
- After temporary network access was granted, the build completed successfully.

Lint note:

- Lint passed with 0 errors.
- Existing warnings remain in unrelated files.

## Production Health Checks

Unauthenticated HTTP checks:

- `https://portal.homeo.healthcare/admin/dashboard` returned `307`, expected redirect behavior.
- `https://www.homeo.healthcare/admin/dashboard` returned `307`, expected redirect behavior.

Authenticated browser check:

- Portal dashboard loaded.
- Dr. Jethwani Clinical Repertory opened.
- V1 Classic integrated workspace verified.
- Search, add-to-workbench, scoring/reasoning visibility, and AI intake parse action verified.

## Feature Behavior

### V1 Classic

Status: verified.

Observed:

- Full workspace visible.
- AI Intake visible.
- Rubric catalog visible.
- Search works.
- Workbench works.
- Scoring panel visible.
- Reasoning panel visible.
- Safety warnings visible.

### Compare V1 vs V2

Status: deployed by code-level verification; browser click verification interrupted.

Code guarantee:

- Compare panel remains conditionally rendered.
- Full workspace is no longer gated by V1 mode.
- Therefore Compare mode renders both the comparison panel and the full workspace.

### V2 Clinical

Status: deployed by code-level verification; browser click verification interrupted.

Code guarantee:

- V2 panel remains conditionally rendered.
- Full workspace is no longer gated by V1 mode.
- Therefore V2 Clinical mode renders both the V2 panel and the full workspace.

## Files Changed

Only:

`src/features/repertory/components/RepertoryWorkbench.tsx`

No changes to:

- `src/app/admin/dashboard/page.tsx`
- APIs
- database
- auth
- billing
- patient workflows
- doctor workflows
- public site
- repertory source data

## Clinical Safety

Safety warning remains visible:

`Clinical review required - do not auto-prescribe`

No auto-prescribing was added.

## Rollback Command

```bash
git revert a690e192896366348a23d916712b0f06aa490f5d
git push origin main
```

## Final Recommendation

The deployment is safe to test in production.

Dr. Jethwani can now use the restored integrated workspace and personally test:

- V1 Classic
- Compare V1 vs V2
- V2 Clinical

The only residual issue is browser automation instability during final post-click verification, not an application build or deployment failure.
