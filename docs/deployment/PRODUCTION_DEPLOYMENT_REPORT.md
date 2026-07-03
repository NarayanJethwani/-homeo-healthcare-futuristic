# Production Deployment Report

Date: 2026-07-03  
Release: V2 Clinical Repertory infrastructure release  
Scope: Infrastructure only, all V2 feature flags OFF  
Production behavior target: unchanged V1 platform behavior

## Summary

The V2 repertory infrastructure release was pushed to GitHub and deployed through the existing Vercel GitHub integration.

Production health checks passed at the HTTP/API level. The repertory search API continues to return the existing V1 response shape only.

No V2 feature flags were enabled by Codex.

## Git Commit Pushed

Commit:

```text
537d9130e62b8826315ba0837ca499ed291e65b6
```

Latest local commit:

```text
537d913 Fix clinical search shadow adapter typing
```

GitHub push result:

```text
main -> origin/main
```

Remote verification:

```text
537d9130e62b8826315ba0837ca499ed291e65b6 refs/heads/main
```

## Branch

```text
main
```

Local status after deployment:

```text
main...origin/main
```

The local branch is in sync with GitHub.

## Deployment URL

GitHub reported successful Vercel deployment statuses for the pushed commit:

1. Vercel project: `homeo-healthcare-portal`
   - Status: success
   - Description: Deployment has completed
   - Updated: `2026-07-03T12:26:56Z`
   - Vercel status URL: `https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-portal/FML9a1WqNPjyJyn5voDRoQVu8Cb4`

2. Vercel project: `homeo-healthcare-futuristic`
   - Status: success
   - Description: Deployment has completed
   - Updated: `2026-07-03T12:27:23Z`
   - Vercel status URL: `https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-futuristic/9FrpUmsRXviaJJA8ppdL1gt52ky1`

Note:

- Direct Vercel CLI deployment was attempted, but the current local CLI auth/project state was not reliable.
- The final production deployment completed through the existing GitHub-to-Vercel integration after pushing `main`.

## Production URL

Verified production URLs:

- `https://www.homeo.healthcare`
- `https://portal.homeo.healthcare/admin/dashboard`
- `https://www.homeo.healthcare/admin/dashboard`

## Build Status

Local production build:

```text
npm run build
```

Status: passed.

Build details:

- Next.js `16.2.9`
- Static generation completed: `76/76`
- `/api/repertory/search` included in successful build output

Initial build note:

- The first build attempt failed while network access was restricted because Next.js could not fetch Google Fonts.
- After network access was granted, the build passed.

Tests:

```text
npm_config_cache=/private/tmp/homeo-npm-cache npm test
```

Status: passed.

Suites passed:

- Clinical Portal Suite: 9 passed, 0 failed
- Clinical KMS Unit Tests: 10 passed, 0 failed
- Public API/Search Boundary Tests: 6 passed, 0 failed

Lint:

```text
npm run lint
```

Status: passed with warnings.

Warnings:

- 326 existing lint warnings
- 0 lint errors

## Health Checks

HTTP checks after deployment:

| Check | URL | Status |
|---|---|---:|
| Public site | `https://www.homeo.healthcare` | 200 |
| Admin dashboard route | `https://www.homeo.healthcare/admin/dashboard` | 200 after login redirect |
| Portal dashboard route | `https://portal.homeo.healthcare/admin/dashboard` | 200 after login redirect |
| Patient dashboard route | `https://www.homeo.healthcare/patient/dashboard` | 200 |
| Doctor/public doctors route | `https://www.homeo.healthcare/doctors` | 200 |
| AI router health | `https://www.homeo.healthcare/api/ai-router/health` | 200 |
| Public search API | `https://www.homeo.healthcare/api/public/search?q=homeopathy` | 200 |
| Repertory search API | `https://www.homeo.healthcare/api/repertory/search?q=anxiety` | 200 |
| Repertory search API | `https://www.homeo.healthcare/api/repertory/search?q=flatulence` | 200 |

Read-only repertory search checks:

| Query | Success | Count | V2 fields in response | Response keys |
|---|---:|---:|---:|---|
| `bloating` | true | 58 | false | `success,count,rubrics` |
| `flatulence` | true | 114 | false | `success,count,rubrics` |
| `anxiety` | true | 176 | false | `success,count,rubrics` |
| `constipation` | true | 115 | false | `success,count,rubrics` |
| `diarrhoea` | true | 0 | false | `success,count,rubrics` |
| `diarrhea` | true | 229 | false | `success,count,rubrics` |
| `sweets` | true | 1 | false | `success,count,rubrics` |
| `salt` | true | 1 | false | `success,count,rubrics` |
| `milk` | true | 0 | false | `success,count,rubrics` |
| `abdomen pain` | true | 344 | false | `success,count,rubrics` |

Interpretation:

- Existing V1 repertory search works.
- API response shape is unchanged.
- No V2 search, shadow, or comparison fields are exposed to clinicians.

## Feature Flag Status

All V2 flags are designed to default OFF when unset or false.

V2 flags:

| Feature | Environment variable | Default |
|---|---|---:|
| V2 UI | `NEXT_PUBLIC_REPERTORY_V2_ENABLED` | OFF |
| V2 API | `REPERTORY_V2_API_ENABLED` | OFF |
| V2 Firestore read | `REPERTORY_V2_READ_FROM_FIRESTORE` | OFF |
| V2 writes | `REPERTORY_V2_WRITE_ENABLED` | OFF |
| V2 score breakdown | `REPERTORY_V2_SHOW_SCORE_BREAKDOWN` | OFF |
| V2 AI mapping review | `REPERTORY_V2_AI_MAPPING_REVIEW` | OFF |
| V2 indexed search | `REPERTORY_V2_USE_INDEXED_SEARCH` | OFF |
| V2 clinical search engine | `REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE` | OFF |
| V2 rubric intelligence | `REPERTORY_V2_USE_RUBRIC_INTELLIGENCE` | OFF |
| V2 clinical repertorization engine | `REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE` | OFF |
| V2 clinical validation framework | `REPERTORY_V2_USE_CLINICAL_VALIDATION_FRAMEWORK` | OFF |
| V2 search shadow mode | `REPERTORY_V2_SEARCH_SHADOW_MODE` | OFF |

Production behavior verification:

- Repertory search response contains only V1 keys: `success`, `count`, `rubrics`.
- No clinician-facing V2 response fields are present.
- No UI wiring was enabled by this deployment.

Important limitation:

- Direct inspection of Vercel environment variables and runtime logs was not available from this local machine because the Vercel CLI auth/project state was unreliable.
- Code-level defaults are OFF, tests confirm missing flags are OFF, and production API responses show no clinician-visible V2 behavior.

## Migration Status

Migration executed: none.

Confirmed:

- No database migration was run.
- No schema migration was run.
- No Firestore write migration was run.
- No patient/doctor/auth/billing/dashboard data migration was run.

## Production Behavior Compatibility

The following were preserved:

- Existing Clinical OS behavior
- Existing dashboard route behavior
- Existing patient route availability
- Existing doctor/public route availability
- Existing public site
- Existing public APIs
- Existing repertory V1 search response shape
- Existing repertorization implementation
- Existing scoring implementation
- Existing clinician-visible UI behavior

## Any Warnings

1. Vercel CLI local deploy path was unreliable.
   - Newer CLI identified the account but failed while loading teams.
   - Older CLI reported the stored token was invalid.
   - Deployment still completed successfully through the existing GitHub-to-Vercel integration.

2. Runtime logs were not directly inspectable from this machine.
   - Production HTTP/API checks were clean.
   - GitHub/Vercel deployment statuses were successful.
   - Repertory search response shape confirmed V1-only output.

3. Lint has existing warnings.
   - 326 warnings, 0 errors.
   - These warnings existed outside this release scope and were not changed during deployment.

## Rollback Command

Immediate code rollback:

```bash
git revert 537d913
git revert 44372ec
git revert 9ea1764
git revert d2f6592
git push origin main
```

For a broader V2 infrastructure rollback, revert the V2 infrastructure commits in reverse chronological order, then push `main`.

Immediate feature rollback:

```text
NEXT_PUBLIC_REPERTORY_V2_ENABLED=false
REPERTORY_V2_API_ENABLED=false
REPERTORY_V2_READ_FROM_FIRESTORE=false
REPERTORY_V2_WRITE_ENABLED=false
REPERTORY_V2_SHOW_SCORE_BREAKDOWN=false
REPERTORY_V2_AI_MAPPING_REVIEW=false
REPERTORY_V2_USE_INDEXED_SEARCH=false
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=false
REPERTORY_V2_USE_RUBRIC_INTELLIGENCE=false
REPERTORY_V2_USE_CLINICAL_REPERTORIZATION_ENGINE=false
REPERTORY_V2_USE_CLINICAL_VALIDATION_FRAMEWORK=false
REPERTORY_V2_SEARCH_SHADOW_MODE=false
```

## Instructions for Enabling One Flag at a Time

Do not enable any flag for general users without Dr. Narayan Jethwani's explicit approval.

Recommended testing order:

1. Enable staging-only shadow observation:

```text
REPERTORY_V2_USE_CLINICAL_SEARCH_ENGINE=true
REPERTORY_V2_SEARCH_SHADOW_MODE=true
```

2. Test logs and compare V1/V2 results.

3. Disable shadow mode again:

```text
REPERTORY_V2_SEARCH_SHADOW_MODE=false
```

4. Only after separate approval, test the next flag in staging.

Do not enable:

- V2 UI
- V2 API replacement
- V2 scoring
- V2 repertorization
- V2 writes
- AI mapping review

without a separate written approval and a dedicated rollout plan.

## Final Recommendation

The V2 infrastructure release is acceptable to keep in production with all V2 feature flags OFF.

Do not enable V2 behavior automatically.

Recommended next step:

- Dr. Narayan Jethwani should personally test one feature flag at a time, beginning with staging-only shadow search observation, before any wider clinician exposure.
