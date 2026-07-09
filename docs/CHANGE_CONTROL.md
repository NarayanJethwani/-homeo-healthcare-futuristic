# Change Control Board Playbook

This document defines the strict governance procedures and operational workflows required for introducing changes to the Unified Clinical OS and Knowledge Platform.

---

## 1. Change Control Workflow Pipeline

Every bug fix, feature addition, or system modification must proceed step-wise through the following pipeline:

```
Idea & Intake
      │
      ▼
Implementation Plan (implementation_plan.md)
      │
      ▼
Development & Coding
      │
      ▼
Verification Walkthrough (walkthrough.md)
      │
      ▼
Internal Peer Review & Approval
      │
      ▼
Quality Verification Gates (Typecheck, Lint, Tests)
      │
      ▼
Documentation Update (update-docs.js compiler run)
      │
      ▼
Git Version Tagging (Semantic Version Disciplines)
      │
      ▼
Production Deployment (Vercel Build / Firebase Rules)
      │
      ▼
Release Notes Appended & Build History Logged
```

---

## 2. Phase-by-Phase Execution Guidelines

### Phase A: Proposals & Planning
- **Goal**: Clarify design architecture and prevent unverified implementations.
- **Rules**:
  1. Create a detailed `implementation_plan.md` outlining the proposed modification, affected files, design impacts, and verification methods.
  2. Document all architectural changes as **proposals** or **planned** in ADRs until verified as fully functional in the codebase.
  3. The user or team lead must explicitly review and sign off on the plan before any code edits are executed.

### Phase B: Coding & Testing
- **Goal**: Write functional, clean code with regression testing.
- **Rules**:
  1. All new API endpoints and core clinical logic must feature unit or integration test cases under the `tests/` directory.
  2. Implement comprehensive safety features, such as medical safety warnings and fallback parameters.

### Phase C: Compiler Verification & Release Gates
- **Goal**: Check documentation, sitemaps, and code health.
- **Rules**:
  1. Run the documentation compiler command `npm run docs:update` to sync version registries and regenerate dashboard metrics.
  2. The compiler runs automated checks ensuring ADR index links are resolved, and checks for orphaned `.md` files.
  3. Build must pass typechecking (`npx tsc --noEmit`) and routing compilation (`npm run build`).

### Phase D: Tagging & Build Archival
- **Goal**: Version control indexing and rollback security.
- **Rules**:
  1. Git tags must follow standard semantic version designations (e.g. `v2.0.1` for production patch, `v2.1.0` minor, `v2.0.2-rc1` for release candidate).
  2. Tag only builds that successfully complete the release gate checks.
  3. Log the successful run metrics directly inside `docs/BUILD_HISTORY.md` and append version highlights to the `docs/release-notes/` directory.
