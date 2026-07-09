# Clinical OS Integration & Governance Policy

This document registers the architectural constraints, UI styling guidelines, and governance requirements governing the integration between the clinical practitioner-facing **Clinical OS** and the educational/scientific **Knowledge Platform**.

---

## 1. Read-Only Policy

> [!IMPORTANT]
> The Knowledge Platform is strictly **read-only** from the perspective of the Clinical OS. 
> Under no circumstances may lookup widgets, diagnostics interfaces, or repertory workbenches perform writes or update operations on Knowledge entities or vectors.

- **No Case Modification**: Educational context retrieval must never modify active case files, patient timelines, or treatment plans.
- **Decision Isolation**: Clinical scoring engines (repertory scoring, candidate sorting, remedy ranking, differential logic matrices) must compute values independently. Knowledge lookups are resolved post-computation as supplementary information.

---

## 2. Link Resolution Safety

All generated hyperlinks referencing Knowledge Platform sheets must resolve through normalized routes.

- **Normalized Path Resolver**: Use the lookup endpoints in [clinicalOsIntegration.ts](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/src/features/knowledge/governance/clinicalOsIntegration.ts) to map slugs and retrieve context bundles.
- **Strict Broken Link Elimination**: If an article does not exist in the database (resolved with `link.found === false`), the UI **must not** render an anchor `<a>` tag pointing to a fallback link. Instead, it must render the name as plain text and display a `Knowledge article pending` indicator (or hide the link entirely).
- **Target Handling**: All outgoing links targeting the Knowledge Platform must open in a new tab (`target="_blank" rel="noopener noreferrer"`) to prevent session loss in the active Clinical OS workspace.

---

## 3. Educational Safety Badges

To maintain regulatory compliance and editorial clarity, safety badges shown inside the practitioner cockpit must follow approved, informational-only labeling standards.

### Approved Informational Labels:
- `Clinically Reviewed` (For verified articles / cornerstone entities)
- `Review Needed` (For unreviewed or updated draft content)
- `Citation Caution` (For content missing robust references or showing low citation scores)
- `Knowledge article pending` (For out-of-scope or unwritten profiles)
- `Educational reference`

### Prohibited Prescriptive Labels:
- `Approved treatment`
- `Recommended remedy`
- `Verified cure`
- `Clinically proven`

---

## 4. Patient-Facing Boundaries

When preparing printed prescriptions, treatment summary exports, or educational booklets for patients:
- **Exclude Internal Noise**: Peer-review states, editorial review flags, and raw citation indices must be stripped.
- **Filter Draft Summaries**: Dynamic AI-generated summaries must not be included unless manually approved by the practitioner.
- **No Prescriptive Indications**: Links and references must remain purely educational, avoiding listing specific remedy potencies or dosage guides.

---

## 5. Operations & Decision Safety
To verify that updates to the Knowledge Platform do not interfere with the clinical decision support safety parameters:
- See the [Production Readiness Checklist (Section 7: Clinical OS Verification)](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/operations/PRODUCTION_READINESS_CHECKLIST.md)
- See the [Incident Response Runbooks (Runbook F: Clinical OS Link Failure)](file:///Users/drnarayanjethwani/Downloads/Website%20with%20Antigravity/docs/operations/INCIDENT_RUNBOOKS.md)

