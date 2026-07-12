# EMR Data Architecture, Migration, and Deployment Plan

Status: Draft for Version 2.14.0 planning  
Date: 2026-07-12

## Decision

Do not replace or directly modify the frozen Patient, Encounter, Consultation,
Treatment Episode, or Homeopathy domains during Version 2.14.0.

Build Version 2.14.0 as an additive compatibility release consisting of:

1. a canonical patient identity read model;
2. a legacy-to-canonical identity mapping registry;
3. duplicate detection and migration reporting;
4. server-authorized patient overview queries;
5. audit events for mapping and reconciliation actions; and
6. feature-flagged preview UI.

## Verified Current Foundation

The repository already contains:

- `Patient`, scoped by organization and optionally clinic, with schema and
  record versions, UHID, demographics, and active state;
- `Encounter`, linked to patient, practitioner, consultation, and treatment
  episode identifiers, with draft and ready-for-review states;
- `ClinicalIntake`, containing complaints, histories, mental and physical
  generals, modalities, follow-up details, provenance, and version fields;
- `TreatmentEpisode`, linked to patient and practitioner with lifecycle state;
- governed laboratory and attachment repositories;
- separate practitioner and patient access validation; and
- additive read-only clinical knowledge references.

The current domain contracts are useful foundations. The immediate gap is not
the absence of models; it is the lack of one persistent identity resolution and
migration boundary across every existing storage path.

## Version 2.14.0 Scope

### 1. Canonical patient identity projection

Create an additive read model, not a replacement Patient entity:

```ts
type CanonicalPatientIdentity = {
  canonicalPatientId: string;
  organizationId: string;
  clinicId?: string;
  uhid: string;
  sourcePatientIds: string[];
  identityStatus: "verified" | "possible-duplicate" | "merge-review" | "archived";
  schemaVersion: 1;
  projectionVersion: number;
  projectedAt: string;
};
```

This projection must reference the existing Patient domain without mutating it.

### 2. Identity mapping registry

Create a separately governed mapping record:

```ts
type PatientIdentityMapping = {
  mappingId: string;
  canonicalPatientId: string;
  sourceSystem: string;
  sourcePatientId: string;
  organizationId: string;
  matchMethod: "exact-id" | "uhid" | "reviewed-demographic-match";
  reviewStatus: "automatic" | "pending-review" | "approved" | "rejected";
  createdBy: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
};
```

No automatic process may merge or delete patient records. Possible duplicates
must enter a review queue.

### 3. Patient overview projection

Create a read-only overview that composes existing authoritative records:

- patient identity and demographics;
- active treatment episodes;
- recent encounters;
- reviewed laboratory results;
- attachments;
- read-only knowledge references; and
- care-plan linkage where an authoritative record exists.

The overview must not copy clinical content into a new source of truth.

### 4. Migration inventory

Produce counts and reconciliation status for every patient-bearing collection:

- canonical patient documents;
- legacy dashboard patients or cases;
- encounters and consultations;
- treatment episodes;
- laboratory records;
- attachments;
- invoices and care-plan assignments;
- patient sessions or portal identities; and
- external spreadsheet identifiers.

The migration runner must initially operate in dry-run mode only.

## Explicitly Deferred

The following belong to later releases and must not be mixed into 2.14.0:

- changing the frozen Patient schema;
- encounter sign-off and addendum workflow;
- prescription authoring;
- care-plan utilization writes;
- AI-generated longitudinal summaries;
- automatic patient merges;
- RAG ingestion of private patient data; and
- broad patient-portal redesign.

## Delivery Sequence

### Gate A — Repository stabilization

- Separate unrelated working-tree changes.
- Preserve all current user work.
- Create a reviewable Version 2.14.0 branch.
- Record exact changed files and migration assumptions.

### Gate B — Architecture and inventory

- Map every patient identifier and Firestore collection.
- Document ownership and authorization for each collection.
- Define identity-match and duplicate-review rules.
- Add dry-run migration and reconciliation reports.

### Gate C — Additive implementation

- Add canonical identity projection services.
- Add mapping and audit repositories.
- Add server-authorized overview endpoint.
- Add feature-flagged patient overview shell.
- Add rules and emulator coverage for new collections.

### Gate D — Preview validation

- Deploy to a protected preview environment.
- Use synthetic or specifically approved test patients only.
- Run build, type, unit, integration, route, rules, accessibility, and security
  checks.
- Verify zero writes to frozen domain collections during overview reads.
- Verify rollback by disabling the Version 2.14.0 flag.

### Gate E — Production rollout

- Complete a reviewed migration dry run against production metadata.
- Back up affected collections and export the mapping report.
- Enable read-only overview for internal practitioners first.
- Monitor authorization failures, unresolved mappings, duplicate candidates,
  query latency, and error rates.
- Keep all migration writes disabled until the reconciliation report is
  explicitly approved.

## Deployment Recommendation

### Deploy a preview after Gate C

The current four-project work is suitable for a protected preview only after it
is isolated into a reviewable change set and all required emulator tests pass.
Feature flags should remain disabled by default.

### Do not deploy the current dirty worktree directly to production

The working tree contains multiple milestones and unrelated changes. A green
build proves compilation, not release isolation or migration safety.

### First production candidate

The first production candidate should contain:

- additive read-only services;
- disabled feature flags;
- no migration writes;
- no frozen-domain schema changes;
- security rules for only the new collections;
- rollback through flag disablement; and
- a signed-off production migration report.

## Production Acceptance Criteria

- Production build and full typecheck pass.
- Complete repository tests pass.
- Firestore emulator ownership and schema tests pass.
- Route authorization tests pass.
- Patient A cannot access Patient B or another clinic's data.
- All new patient overview queries are server-authorized.
- Duplicate detection never merges automatically.
- No pending AI/OCR data is presented as trusted clinical truth.
- No private patient content enters RAG, analytics, URLs, or logs.
- Feature-flag rollback restores existing behavior without deleting data.
- Migration dry run reconciles all patient-linked records or lists every
  unresolved item.

## Recommended Next Release Order

1. **2.14.0 — EMR Identity and Read-Only Patient Overview**
2. **2.15.0 — Encounter Sign-Off, Versioning, and Addenda**
3. **2.16.0 — Structured Prescriptions and Care-Plan Integration**
4. **2.17.0 — Unified Timeline and Patient Portal Presentation**
5. **2.18.0 — Clinician-Governed Longitudinal Intelligence**

## Immediate Next Work

1. Inventory patient-bearing Firestore collections and legacy IDs.
2. Define the canonical identity projection and mapping interfaces.
3. Add a dry-run reconciliation service with no write capability.
4. Add duplicate-candidate scoring that always requires human approval.
5. Add tests for tenant isolation, idempotency, and zero-write dry runs.
6. Build the read-only patient overview behind a disabled feature flag.
7. Deploy that isolated branch to preview for clinician acceptance testing.
