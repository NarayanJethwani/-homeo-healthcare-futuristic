# Governance Persistence Architecture & Schema

**Status**: Active — Phase 2.1 Architecture  
**Scope**: Clinical Knowledge Platform Governance Storage  

---

## 1. Overview

Phase 2.1 defines persistent storage structures for governance entities, separating runtime validation logic from process memory while preserving repository conventions.

---

## 2. Table / Entity Schema Mapping

| Table / Collection | Primary Key | References | Description |
| :--- | :--- | :--- | :--- |
| `contributors` | `id` (`ContributorId`) | — | Contributor identities, status (`pending`, `active`, `suspended`, `retired`), and professional roles. |
| `reviewer_qualification_decisions` | `id` | `contributorId` | Explicit verified qualification decisions and assigned review scopes. |
| `authorship_records` | `id` | `contributorId`, `entityId` | Immutable authorship and editor contribution logs. |
| `content_revisions` | `revisionId` | `entityId`, `createdBy` | SHA-256 canonical content revisions for governed clinical projections. |
| `clinical_review_records` | `id` | `reviewerId`, `entityId`, `reviewedVersion` | Atomic independent clinical review approvals. |
| `evidence_profiles` | `id` | `entityId`, `revisionId` | Structured evidence level profiles, limitations, and boundaries. |
| `clinical_claims` | `id` | `entityId`, `revisionId` | Material clinical claims and traditional-use claim structures with explicit `origin` markers. |
| `workflow_transitions` | `id` | `entityId`, `actorId` | State machine transition history. |
| `ai_ingestion_approvals` | `id` | `entityId`, `revisionId`, `approvedBy` | Revision-matched AI ingestion approvals. |
| `governance_audit_events` | `id` | `entityId`, `actorId` | Append-only SHA-256 hash-chained audit event trail. |

---

## 3. Governed Clinical Projection (`buildGovernedClinicalProjection`)

To prevent volatile metadata (e.g., `updatedAt`, `viewCount`) from invalidating clinical approvals, SHA-256 revision hashing operates strictly on the `GovernedClinicalProjection`:

- `title`, `summary`
- `clinicalSections` (`etiology`, `symptoms`, `safety`, `dosage`)
- `redFlags`, `emergencyEscalation`, `diagnosticLimitations`
- `conventionalManagement`, `complementaryCareBoundary`
- `claims`, `references`, `translations`
