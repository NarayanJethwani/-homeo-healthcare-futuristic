# Release Governance Manual

This document defines the rules and policies governing releases on the Homeo Healthcare Knowledge Platform & Clinical OS.

## 1. Version Naming Policy
We follow Semantic Versioning (SemVer) with the structure: `MAJOR.MINOR.PATCH`
- **MAJOR**: Architecturally breaking changes, clinical decision safety logic restructuring, or major clinical modules.
- **MINOR**: Feature additions (e.g. new CMS tabs, new analytics routes, dashboard improvements) without breaking compatibility.
- **PATCH**: Hardening passes, security corrections, minor bug fixes, fallback configurations, and documentation improvements.

## 2. Release Tag Policy
- Every release must be tagged in version control with `vMAJOR.MINOR.PATCH` (e.g., `v2.8.0`).
- Tags are created only on the stable `main` branch after passing all staging gates.
- Tags must be signed and point to the validated production-ready commit.

## 3. Governance Roles & Approvals
- **Release Owner**: The engineer managing the release checklist, build verification, and deployment process.
- **Clinical Approver**: The medical director or senior clinician certifying that the release meets medical safety criteria, contains no prohibited cure claims, has reference gates active, and doesn't introduce incorrect clinical algorithms.
- **Technical Approver**: The lead software architect certifying that type safety is sound, unit tests pass, and Firestore fallback triggers are verified.

## 4. Deployment Gate Checklist
1. All changes are merged into the target branch.
2. Complete test runs succeed on the stable branch (`npm test`).
3. Build completes cleanly without warnings (`npm run build`).
4. Automated verification script completes (`npm run verify:production`).
5. A pre-deployment backup of CMS knowledge and active versions is triggered.

## 5. Rollback Procedures
In the event of a production failure (post-deployment regression or outage):
- **Verification**: Check Vercel build status and Firestore error logs.
- **Trigger**: An incident of Priority 1 (P1) triggers an immediate rollback.
- **Rollback Execution**: Redeploy the previous stable release commit tag.
- **Verification Post-Rollback**: Run the static verification script on the rolled back commit.

## 6. Incident Classification
- **P1 - Critical Outage**: Public site down, Clinical OS planner fails, or raw credentials/PII leaked. Time to resolve: **Immediate rollback (<15 mins)**.
- **P2 - Degraded State**: CMS publishing failing, RAG Index out-of-sync, or partial API degradation. Time to resolve: **Hotfix within 4 hours**.
- **P3 - Minor Issue**: Admin dashboard UI styling issues or out-of-date documentation. Time to resolve: **Next minor release**.

## 7. Hotfix Process
- Create a `hotfix/vX.Y.Z` branch from the latest release tag.
- Apply the fix and run all regression tests.
- Re-run build verification.
- Obtain rapid clinical and technical approvals.
- Merge the hotfix branch back into `main` and release.

## 8. Documentation Requirements
No release is complete unless:
- `docs/MASTER_DEVELOPMENT_LOG.md` is updated with the version summary.
- `docs/RELEASE_NOTES.md` is appended with detailed user-facing changes.
- Operations manuals are updated if new variables or services are added.

---

## Required Release Metadata Block
Every deployment log must declare this metadata block fully populated:
```md
- Release version:
- Release tag:
- Release owner:
- Clinical approver:
- Technical approver:
- Deployment environment:
- Build result:
- Test result:
- Rollback commit:
- Known risks:
- Post-deployment checks:
```
