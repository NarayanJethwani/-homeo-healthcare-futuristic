# Pre-Deployment Shadow Mode Check

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory V2 search shadow mode  
Status: Verification completed, no deployment performed

## Summary

V2 repertory search shadow mode is structurally safe for a controlled deployment with flags OFF by default.

Production users will continue receiving only V1 search results because:

- the API response payload is created from V1 results only;
- the V2 branch runs only after V1 has completed;
- V2 output is never added to the API response;
- V2 execution requires disabled server flags;
- V2 failures are caught and logged without changing the V1 response.

## Files Touched

Implementation files:

- `work/homeo-healthcare-futuristic/src/app/api/repertory/search/route.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/integration/clinicalSearchShadow.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/flags/repertoryFlags.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/__tests__/repertoryFlags.test.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/__tests__/clinicalSearchShadow.test.ts`

Verification report:

- `outputs/PRE_DEPLOYMENT_SHADOW_MODE_CHECK.md`

## Feature Flag Status

Required flags for V2 shadow execution:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=true
REPERTORY_V2_SEARCH_SHADOW_MODE=true
```

Default status:

- OFF when unset.
- `repertoryFlags.test.ts` confirms `useClinicalSearchShadowMode: false` by default.

Flag OFF behavior:

- no V2 dynamic import;
- no V2 candidate rubric fetch;
- no V2 search index build;
- no V2 logs;
- V1 response unchanged.

## Safety Verification

### Flag OFF

Pass.

Confirmed by code inspection:

- V2 work is guarded by `shadowEnabled`.
- `shadowEnabled` is true only when both server flags are true.
- If flags are missing, `isEnabled(undefined)` returns false.
- No V2 import or Firestore candidate fetch occurs when the flags are off.

Expected production impact with flags off:

- zero V2 search execution;
- no V2 logs;
- response remains V1.

### Flag ON

Pass with controlled caveat.

Confirmed by code inspection and isolated test:

- V1 results are computed first.
- Response payload contains only V1 results.
- V2 runs in a fire-and-forget background task.
- V2 comparison logs are internal only.
- V2 result data is never returned to the clinician.

Caveat:

- In serverless runtimes, fire-and-forget background work may be cut short after response lifecycle. That is acceptable for observation; it affects metrics completeness, not user response safety.

## Failure Safety

| Failure case | Status | Notes |
|---|---|---|
| V2 search crashes | Pass | Route catches background V2 errors and V1 response is already independent. |
| V2 adapter fails | Pass | Failure is caught and logged as a shadow error. |
| Logging fails | Pass for user safety | Logging is not part of the response. A logging failure cannot replace V1 results. |
| Feature flag missing | Pass | Missing env values evaluate false. |
| V2 returns unexpected rankings | Pass for user safety | Rankings are logged only and never returned. |
| Database write risk | Pass | Shadow mode reads active rubrics only and performs no writes. |

## Search-Term Comparison

The requested terms were run against a local fixture corpus through the same shadow comparison bridge. This avoids production Firestore access and verifies the comparison metrics safely.

| Query | V1 count | V2 count | Top 10 overlap | Missing V1 rubrics | Extra V2 rubrics | V2 ms | Error |
|---|---:|---:|---:|---|---|---:|---|
| `bloating` | 1 | 2 | 1 | - | `flatulence` | 3 | - |
| `flatulence` | 2 | 2 | 2 | - | - | 1 | - |
| `anxiety` | 1 | 1 | 1 | - | - | 0 | - |
| `constipation` | 1 | 2 | 1 | - | `diarrhea` | 1 | - |
| `diarrhoea` | 1 | 2 | 1 | - | `constipation` | 0 | - |
| `diarrhea` | 1 | 2 | 1 | - | `constipation` | 1 | - |
| `sweets` | 1 | 1 | 1 | - | - | 0 | - |
| `salt` | 1 | 1 | 1 | - | - | 1 | - |
| `milk` | 1 | 1 | 1 | - | - | 0 | - |
| `abdomen pain` | 2 | 3 | 2 | - | `flatulence` | 1 | - |

Interpretation:

- V2 found all V1 fixture results.
- V2 added synonym/semantic extras for several terms.
- No fixture comparison errors occurred.
- These are local fixture results, not production clinical validation.

## Commands Run

### `git status`

Pass.

- Worktree clean after commits.

### `git diff --check HEAD`

Pass.

- No whitespace errors.

### `npm install`

Pass.

- Installed dependencies successfully.
- Audit reported 0 vulnerabilities.

### `npm run build`

Pass after one isolated type fix.

Initial result:

- Failed on a TypeScript mismatch in `clinicalSearchShadow.ts`.

Fix:

- Narrowed the adapter call type in the isolated bridge.
- Commit: `537d913 Fix clinical search shadow adapter typing`

Final result:

- Build completed successfully.
- `/api/repertory/search` included in successful Next.js build output.

### `npm test`

Pass.

First run:

- Existing clinical safety/router checks passed.
- Failed afterward because the home npm cache had permission issues.

Second run:

- Used local cache: `npm_config_cache=/private/tmp/homeo-npm-cache npm test`
- Passed:
  - 9 Clinical Portal Suite checks
  - 10 Clinical KMS checks
  - 6 Public API/Search boundary checks

### `npm run lint`

Pass with warnings.

- Exit code: 0.
- 326 existing warnings, 0 errors.
- Warnings are broad existing lint issues across dashboard/public/knowledge files, not specific to shadow mode.

### Isolated Shadow Test

Pass.

Command:

```text
npm_config_cache=/private/tmp/homeo-npm-cache npx ts-node -O '{"module":"commonjs","esModuleInterop":true}' -r tsconfig-paths/register src/features/repertory/__tests__/clinicalSearchShadow.test.ts
```

Result:

- `clinicalSearchShadow.test.ts passed`

## Pass/Fail Matrix

| Check | Status |
|---|---|
| Feature flag defaults OFF | Pass |
| Flag missing means V2 does not run | Pass |
| Flag OFF has no V2 import/fetch/search/log | Pass by code inspection |
| V1 response remains V1 only | Pass |
| V2 runs only in background when ON | Pass |
| API response shape unchanged | Pass by code inspection |
| UI unchanged | Pass |
| Scoring unchanged | Pass |
| Repertorization unchanged | Pass |
| No database writes | Pass |
| Patient/doctor workflows unchanged | Pass |
| Failure safety | Pass |
| Build | Pass |
| Test | Pass |
| Lint | Pass with warnings |

## Risks

1. Shadow metrics may not always complete in a serverless fire-and-forget model.
   - User safety impact: none.
   - Metrics impact: possible incomplete logs.

2. Shadow mode reads candidate active rubrics when enabled.
   - Mitigation: flags off by default; optional `REPERTORY_V2_SEARCH_MAX_RUBRICS` cap.

3. Logs contain query text and rubric IDs/titles.
   - Mitigation: do not enable broad logging without review; consider sampling or query hashing in a later approved step.

4. V2 result differences are not clinically validated yet.
   - Mitigation: V2 remains invisible to clinicians.

## Deployment Safety Recommendation

Safe to deploy with all V2 shadow flags OFF.

Do not enable production shadow mode yet until:

- deployment is reviewed;
- environment variables are confirmed false;
- rollback owner is identified;
- log sampling policy is approved.

## Rollback Steps

Immediate flag rollback:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=false
REPERTORY_V2_SEARCH_SHADOW_MODE=false
```

Code rollback if needed:

```text
git revert 537d913
git revert 44372ec
git revert 9ea1764
git revert d2f6592
```

Then redeploy previous known-good build.

## Final Status

Pre-deployment verification passed for safe flag-off deployment.

No deployment was performed.  
No push was performed.  
Production shadow flags must remain OFF until separately approved.
