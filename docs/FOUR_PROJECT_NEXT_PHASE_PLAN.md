# Four-Project Next-Phase Program

## Operating constraints

- One shared repository and release pipeline.
- Frozen clinical domains are extended only through services, application layers, adapters, and read models.
- New capabilities remain disabled by default until their focused and integrated gates pass.
- Clinical source text, scoring, and patient records are never silently rewritten or synthesized.

## Workstream 1 — Materia Medica Online Library

**Next milestone:** Phase 7, Original Scan and Split Comparison Reader.

Deliver incrementally:

1. Governed scan-asset types and eligibility gate.
2. Local-only scan viewport with contained zoom, pan, rotation, fit-width, fit-page, and actual-size modes.
3. Split reader driven by verified page-to-text mappings.
4. Alignment-confidence warnings and fail-closed missing-asset states.
5. Desktop, tablet, mobile, keyboard, and performance verification.

No PDF/source download occurs in the browser unless the asset is locally approved and registered.

## Workstream 2 — Clinical Knowledge Platform

**Next milestone:** Editorial source-integration hardening.

Deliver:

1. Source-version read model joining rights, evidence, review freshness, graph eligibility, and publication state.
2. Expiry and withdrawal propagation into graph/search eligibility.
3. Reviewer-facing discrepancy queue without changing frozen knowledge entities.
4. Deterministic audit export and rollback tests.

## Workstream 3 — Repertory

**Next milestone:** Doctor-platform/export boundary foundation after D6 durability.

Deliver:

1. Organization/clinic/doctor entitlement read model.
2. Server-side access gate for repertory sessions and exports.
3. Versioned clinician JSON export and audit metadata.
4. PDF/case-summary exports only after privacy and clinical review.

Existing retrieval, grading, source identity, and active-corpus contracts remain frozen.

## Workstream 4 — EMR

**Next milestone:** Operational stabilization and additive knowledge integration.

Deliver:

1. Validate patient, encounter, attachment, laboratory, and treatment-planner integration boundaries.
2. Add read-only knowledge references through application services; do not alter frozen patient/encounter entities.
3. Add failure-state, permission, and regression coverage for the clinical workspace.
4. Produce deployment/rollback evidence before enabling any new cross-reference.

## Release sequence

1. Materia Medica scan foundation.
2. Knowledge source read model.
3. Repertory entitlement/export boundary.
4. EMR read-only integration.
5. Integrated static, security, corpus, emulator, build, and release verification.

