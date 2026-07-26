# Knowledge Governance Firestore Schema Architecture

**Version**: 1.0.0  
**Effective Date**: 2026-07-25  
**Scope**: NarayanJethwani/-homeo-healthcare-futuristic  

---

## 1. Overview & Isolation Rules

Knowledge Governance persistence is strictly isolated in 10 dedicated collections. Governance records are never co-mingled with clinical repertory data (`rubrics`, `sources`) or practitioner workspace data (`practitioners/{uid}/...`).

---

## 2. Firestore Collection Specifications

| Collection Name | Key Schema / ID Format | Immutable Fields | Client SDK Access |
| :--- | :--- | :--- | :--- |
| `knowledgeGovernanceContributors` | `CONTRIB-{id}` | `id`, `createdAt`, `registrationNumberHash` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceQualifications` | `QUAL-{contributorId}` | `id`, `contributorId`, `qualifiedAt` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceAuthorship` | `AUTH-{entityId}-{contributorId}` | `contributorId`, `entityId`, `recordedAt` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceRevisions` | `REV-{entityId}-{contentHash:0:12}` | `revisionId`, `contentHash`, `createdAt`, `createdBy` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceReviews` | `REV-{entityId}-{reviewerId}-{timestamp}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceEvidenceProfiles` | `EVD-{entityId}-{revisionId}` | `id`, `entityId`, `revisionId` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceClaims` | `CLM-{entityId}-{claimIndex}` | `id`, `entityId`, `revisionId` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceAiApprovals` | `AI-APP-{entityId}-{revisionId}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceAuditEvents` | `AUD-{entityId}-{seq}-{timestamp}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceAuditChainHeads` | `{entityId}` | `entityId` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceEntityState` | `{entityId}` | `entityId` | **DENIED** (`allow read, write: if false`) |

---

## 3. Deletion & Modification Policy

1. **Insert-Only Collections**: `knowledgeGovernanceReviews`, `knowledgeGovernanceAuditEvents`, `knowledgeGovernanceAiApprovals`, `knowledgeGovernanceQualifications`. Updates and deletes are prohibited at both database security rules level and application API level. Duplicate inserts with changed content fail with `RECORD_IMMUTABLE_CONFLICT`.
2. **Superseding Corrections**: Review corrections MUST issue a new review record containing `supersedesReviewId`, `correctionReason`, and fresh `reviewedAt` timestamp. Original review records are never updated in place.
3. **Entity-Scoped Linear Audit Chains**: `knowledgeGovernanceAuditChainHeads/{entityId}` tracks the current linear sequence (`sequenceNumber`, `eventHash`) updated inside Firestore transactions to prevent audit chain forks under multi-client concurrency.
