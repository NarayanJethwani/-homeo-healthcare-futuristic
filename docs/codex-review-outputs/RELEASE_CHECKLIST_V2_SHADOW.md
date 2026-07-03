# Release Checklist: V2 Repertory Search Shadow Mode

Date: 2026-07-03  
Scope: Dr. Jethwani's Clinical Repertory search shadow mode only  
Deployment status: Not deployed by Codex  
Production recommendation: Safe only with all V2 feature flags OFF

## 1. Files Changed

Production route touched:

- `work/homeo-healthcare-futuristic/src/app/api/repertory/search/route.ts`

Isolated V2 repertory foundation files touched:

- `work/homeo-healthcare-futuristic/src/features/repertory/integration/clinicalSearchShadow.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/flags/repertoryFlags.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/__tests__/repertoryFlags.test.ts`
- `work/homeo-healthcare-futuristic/src/features/repertory/__tests__/clinicalSearchShadow.test.ts`

Release documentation:

- `outputs/PRE_DEPLOYMENT_SHADOW_MODE_CHECK.md`
- `outputs/RELEASE_CHECKLIST_V2_SHADOW.md`

Recent shadow-mode commits:

- `d2f6592 Add repertory search shadow flag`
- `9ea1764 Add clinical search shadow comparison metrics`
- `44372ec Run V2 repertory search in shadow mode`
- `537d913 Fix clinical search shadow adapter typing`

## 2. Feature Flags and Default Values

| Feature flag | Environment variable | Default | Required for shadow mode |
|---|---|---:|---:|
| V2 clinical search engine | `REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE` | OFF | Yes |
| V2 search shadow mode | `REPERTORY_V2_SEARCH_SHADOW_MODE` | OFF | Yes |

Default behavior:

- If either flag is missing, empty, or false, V2 shadow mode does not run.
- With flags OFF, production users receive the existing V1 search behavior only.
- With flags OFF, there is no V2 import, no V2 candidate fetch, no V2 search execution, and no V2 shadow logging.

## 3. Environment Variables Required

For safe production deployment with shadow mode disabled:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=false
REPERTORY_V2_SEARCH_SHADOW_MODE=false
```

Optional cap used only if shadow mode is later enabled:

```text
REPERTORY_V2_SEARCH_MAX_RUBRICS=1000
```

Notes:

- Do not set `REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=true` in production without separate approval.
- Do not set `REPERTORY_V2_SEARCH_SHADOW_MODE=true` in production without separate approval.
- No database credentials, schema changes, or new external services are required for this release.

## 4. Build Version

Package:

```text
next-app 0.1.0
```

Verified build:

- `npm run build` completed successfully after the isolated adapter typing fix.
- `/api/repertory/search` was included in the successful Next.js build output.

Git state at checklist creation:

- Worktree clean.
- Latest commit: `537d913 Fix clinical search shadow adapter typing`

## 5. Migration Status

Migration status: none.

Confirmed:

- No database migration added.
- No schema migration added.
- No Firestore write path added.
- No patient, doctor, billing, authentication, dashboard, or public-site data model changes.
- Shadow mode reads existing repertory rubric candidates only when both V2 flags are explicitly enabled.

## 6. Rollback Procedure

Fastest rollback:

1. Ensure both feature flags are OFF.
2. Redeploy or restart the runtime if environment variables require a runtime refresh.
3. Confirm `/api/repertory/search` still returns normal V1 search responses.

Immediate environment rollback:

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

Then redeploy the previous known-good build.

## 7. Health Checks After Deployment

Run these checks after deployment with all V2 flags OFF:

1. Open the existing repertory search flow in the admin dashboard.
2. Search for:
   - `bloating`
   - `flatulence`
   - `anxiety`
   - `constipation`
   - `diarrhoea`
   - `diarrhea`
   - `sweets`
   - `salt`
   - `milk`
   - `abdomen pain`
3. Confirm search responses load normally.
4. Confirm the UI is unchanged.
5. Confirm API response shape is unchanged.
6. Confirm there are no logs containing:

```text
[repertory-v2-search-shadow]
```

7. Confirm no increase in search latency compared with the previous deployment.
8. Confirm patient, doctor, billing, authentication, dashboard, and public-site workflows are unaffected.

## 8. Monitoring Checklist

With V2 flags OFF:

- Confirm there are no V2 shadow logs.
- Watch `/api/repertory/search` error rate.
- Watch `/api/repertory/search` latency.
- Watch admin dashboard repertory search behavior.
- Watch general application error logs.
- Confirm there are no unexpected Firestore read increases from repertory search.

If shadow mode is later enabled in staging only:

- Monitor V1 result count versus V2 result count.
- Monitor top-10 overlap.
- Monitor missing V1 rubrics.
- Monitor extra V2 rubrics.
- Monitor V2 execution time.
- Monitor shadow comparison errors.
- Monitor Firestore read volume.
- Monitor log volume and privacy exposure.

## 9. Success Criteria

Release success with V2 flags OFF means:

- Production users receive only V1 search results.
- No clinician can see V2 results.
- No UI changes are visible.
- API response shape remains unchanged.
- No scoring changes occur.
- No repertorization changes occur.
- No database writes occur.
- No patient, doctor, billing, authentication, dashboard, or public-site workflow changes occur.
- No `[repertory-v2-search-shadow]` logs are emitted.
- Build remains healthy.
- Existing tests remain healthy.
- Search latency remains consistent with the previous production version.

## 10. Exact Command to Disable Shadow Mode Immediately

For Vercel production:

```bash
vercel env rm REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE production --yes
vercel env rm REPERTORY_V2_SEARCH_SHADOW_MODE production --yes
```

Then redeploy or restart using the platform's normal production process so the removed variables take effect.

If the variables must remain present, set both to false in the Vercel dashboard:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=false
REPERTORY_V2_SEARCH_SHADOW_MODE=false
```

## Production Safety Confirmation

This deployment is safe for production only when all V2 feature flags remain OFF.

Reason:

- V2 shadow mode is disabled by default.
- Missing flags evaluate to OFF.
- With flags OFF, V2 search performs zero extra work.
- Production users continue receiving the existing V1 search response.
- No database migration, UI replacement, scoring replacement, or repertorization replacement is included.

Do not enable production shadow mode until separately approved.
