# Knowledge Governance Firestore Schema Architecture

**Version**: 1.0.0  
**Effective Date**: 2026-07-25  
**Scope**: NarayanJethwani/-homeo-healthcare-futuristic  

---

## 1. Overview & Isolation Rules

Knowledge Governance persistence is strictly isolated in dedicated collections. Governance records are never co-mingled with clinical repertory data (`rubrics`, `sources`) or practitioner workspace data (`practitioners/{uid}/...`).

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
| `knowledgeGovernanceOnboardingRecords` | `{recordId}` | `recordId`, immutable identity hash, `version` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceOnboardingIdentityLocks` | `{identityHash}` | `recordId`, `createdAt` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceOnboardingAuditEvents` | `{eventId}` | `recordId`, `action`, `actorId`, `recordVersion` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1Assignments` | `{entityId}:{role}` | `assignmentId`, `entityId`, `role`, `version` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1SourceAcquisition` | `{sourceId}` | `sourceId`, `version` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1AcquisitionAuditEvents` | `{eventId}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1AcquisitionJobs` | `KEP1-JOB-{sourceId}-R{rightsVersion}` | `jobId`, `sourceId`, `sourceVersion`, `rightsDecisionVersion` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1SourceArtifacts` | `{jobId}-ART-{sha256:0:16}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1ArtifactVerifications` | `{artifactId}-VERIFY-1` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1AcquisitionJobAuditEvents` | `{entityId}-{version}-{action}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1DraftHeads` | `KEP1-DRAFT-{entityId}` | `draftId`, `entityId`, `currentRevisionId`, `currentRevisionNumber` | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1DraftRevisions` | `KEP1-DRAFT-{entityId}-V{revisionNumber}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1DraftAuditEvents` | `KEP1-DRAFT-AUD-{entityId}-V{revisionNumber}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1IndependentReviews` | `KEP1-REVIEW-{revisionId}-{clinical\|evidence}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1ReviewAuditEvents` | `KEP1-REVIEW-AUD-{revisionId}-{clinical\|evidence}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1OfflineEvaluations` | `KEP1-EVAL-{evaluationSha256}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1EvaluationAuditEvents` | `{evaluationId}-AUD` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1GoNoGoDecisions` | `KEP1-GNG-{evaluationId}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep1DecisionAuditEvents` | `{decisionId}-AUD` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep3CohortProposals` | `KEP3-PLAN-{proposalSha256:0:24}` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |
| `knowledgeGovernanceKep3CohortPlanningAuditEvents` | `{proposalId}-AUD` | **Entire Record Insert-Only** | **DENIED** (`allow read, write: if false`) |

---

## 3. Deletion & Modification Policy

1. **Insert-Only Collections**: `knowledgeGovernanceReviews`, `knowledgeGovernanceAuditEvents`, `knowledgeGovernanceAiApprovals`, `knowledgeGovernanceQualifications`, `knowledgeGovernanceKep1SourceArtifacts`, `knowledgeGovernanceKep1ArtifactVerifications`, `knowledgeGovernanceKep1DraftRevisions`, `knowledgeGovernanceKep1IndependentReviews`, `knowledgeGovernanceKep1OfflineEvaluations`, `knowledgeGovernanceKep1GoNoGoDecisions`, `knowledgeGovernanceKep3CohortProposals`, and all KEP-1/KEP-3 audit-event collections. Updates and deletes are prohibited at both database security rules level and application API level. Duplicate inserts with changed content fail closed.
2. **Superseding Corrections**: Review corrections MUST issue a new review record containing `supersedesReviewId`, `correctionReason`, and fresh `reviewedAt` timestamp. Original review records are never updated in place.
3. **Entity-Scoped Linear Audit Chains**: `knowledgeGovernanceAuditChainHeads/{entityId}` tracks the current linear sequence (`sequenceNumber`, `eventHash`) updated inside Firestore transactions to prevent audit chain forks under multi-client concurrency.
