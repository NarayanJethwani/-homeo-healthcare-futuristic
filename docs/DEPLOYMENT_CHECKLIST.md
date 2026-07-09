# Production Deployment Checklist

This document details the checklist that must be run before and after every production release of the Unified Clinical OS platform.

## Pre-Deployment Verification

### 1. Code Build & Verification
- [ ] **Clean Build**: Run `npm run build` locally and ensure it compiles successfully without warnings.
- [ ] **Typechecking**: Run `npx tsc --noEmit` to verify type safety across all modules.
- [ ] **Linter Check**: Run `npm run lint` or `npx eslint` to verify code quality standards.
- [ ] **Automated Tests**: Run `npm test` or specific integration suites (`tests/adminWorkflow.test.ts` and `tests/publicApi.test.ts`) to ensure zero regressions.

### 2. Search & Meta Configurations
- [ ] **Sitemap Validation**: Ensure the dynamic sitemap generation includes all active and indexable URLs (e.g. remedies, diseases, symptoms).
- [ ] **Robots.txt Verification**: Ensure `public/robots.txt` is configured to allow indexing of public content while disallowing admin routes (`/admin/*`).
- [ ] **Metadata Audit**: Verify all major page layouts contain valid meta title, description, and canonical link elements.

### 3. Route Audit & UI Freeze Check
- [ ] **Route Audit**: Verify there are no duplicate path names or routing conflicts (e.g., between student pages, practitioner pages, and client portals).
- [ ] **UI Freeze Status**: Confirm that no active UI elements are under development or in a half-finished state. All UI code must match the frozen release branch state.

---

## Post-Deployment Verification

### 1. Build & Server Check
- [ ] **Vercel Deployment URL**: Document the successful Vercel production deployment URL:
  - Futuristic App: `https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-futuristic/...`
  - Portal App: `https://vercel.com/dr-narayan-jethwani-s-projects/homeo-healthcare-portal/...`
- [ ] **Live Domain Health Check**: Access `https://www.homeo.healthcare` and verify standard HTTP status is `200 OK`.

### 2. Smoke Tests
- [ ] **Search Engine**: Perform a search for key terms (e.g. "Arnica", "Anemia") and verify synonyms resolve correctly.
- [ ] **AI Router**: Check the `/api/consult-ai` route using the health check `/api/ai-router/health` to confirm provider health checks are passing.
- [ ] **Firestore Read/Write**: Test connection parameters and check that no unauthorized writes can occur under restricted safety constraints.
- [ ] **Safety Warning Banner**: Verify the sticky header banner "Clinical review required — do not auto-prescribe." renders correctly on all interactive pages.

---

## Rollback & Fail-Safe Playbook

In the event of a critical failure on production, execute the following immediately:

1. **Identify Rollback Commit**: Identify the last stable commit hash (e.g., `7c1a381`).
2. **Revert Deployment**:
   - Via Vercel Dashboard: Select the previous successful deployment and click **Redeploy** to promote it.
   - Via Git CLI:
     ```bash
     git checkout <rollback-commit-hash>
     npm run build
     # Push to main to trigger vercel deploy pipeline
     ```
3. **Verify Restoration**: Re-run the post-deployment smoke tests to ensure clinical safety systems are restored.

---

## Git Tagging Discipline

We enforce strict semantic version tag structures on all branch releases to make deployments, tracking, and rollbacks reliable.

### 1. Versioning Formats

| Type | Naming Example | Purpose |
| :--- | :--- | :--- |
| **Production** | `v2.0.1` | Stable release ready for production deployment. |
| **Major** | `v3.0.0` | Heavy architectural rebuild or breaking API changes. |
| **Minor** | `v2.1.0` | Feature addition or new subsystem versioning baseline. |
| **Patch** | `v2.0.2` | Clean bug fixes and documentation compilations. |
| **Release Candidate** | `v2.1.0-rc1` | Release candidate for system testing. |
| **Beta** | `v2.1.0-beta1` | Initial release features opened to practitioners. |
| **Alpha** | `v2.1.0-alpha1` | Internal developer release. |
| **Hotfix** | `v2.0.1-hotfix1` | Emergency production patch. |

### 2. Tagging Guidelines
*   **Quality Verification**: Tag only builds that have completed and passed all quality gates (`PASS` for typecheck, build, test, lint, and audits).
*   **Never Overwrite**: Never delete, move, or overwrite existing git tags.
*   **Release Association**: Every production tag must correspond to a written release notes document in `docs/release-notes/RELEASE_v[version].md`.
*   **Index Updates**: Every release note must be linked inside the central [Release Notes Register](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/RELEASE_NOTES.md).
*   **Development Log**: Every production tag should correspond to a deployment log section in the [Master Development Log](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/MASTER_DEVELOPMENT_LOG.md).
