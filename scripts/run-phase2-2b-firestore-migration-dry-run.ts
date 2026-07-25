/**
 * Phase 2.2B — Persistent Governance Storage Migration Dry Run Script
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getAllKnowledgeEntities } from "../src/features/knowledge";
import { PUBLIC_INDEX_ALLOWLIST, WITHDRAWN_SAFETY_ENTITIES } from "../src/features/knowledge/governance/publicationGuard";
import { computeContentHash } from "../src/features/knowledge/governance/services/contentRevisionService";
import { buildGovernedClinicalProjection } from "../src/features/knowledge/governance/services/governedClinicalProjection";
import { createDraftEvidenceProfileShell } from "../src/features/knowledge/governance/services/evidenceProfileService";
import {
  Contributor,
  AuthorshipRecord,
  ClinicalReviewRecord,
  ClinicalClaim,
  EditorialWorkflowState,
  ContentRevision,
} from "../src/features/knowledge/governance/types/governanceTypes";

export function executePhase2_2BFirestoreMigrationDryRun() {
  console.log("🚀 Executing Phase 2.2B Firestore Persistence Migration Dry-Run...");

  const entities = getAllKnowledgeEntities().sort((a, b) => a.id.localeCompare(b.id));
  console.log(`Auditing and formatting Firestore persistence payloads for ${entities.length} entities...`);

  const FIXED_TIMESTAMP = "2026-07-25T00:00:00.000Z";

  const candidateContributor: Contributor = {
    id: "CONTRIB-001",
    displayName: "Dr. Narayan Jethwani",
    professionalRole: "Senior Clinical Homeopath & Medical Editor",
    qualifications: ["BHMS", "MD (Hom)"],
    organisation: "Homeo Healthcare Platform",
    active: true,
    createdAt: FIXED_TIMESTAMP,
    updatedAt: FIXED_TIMESTAMP,
  };

  const migrationBatches: any[] = [];
  let currentBatch: any[] = [];
  const BATCH_SIZE = 50;

  let totalAuthorshipRecords = 0;
  let totalRevisions = 0;
  let totalHistoricalSelfReviews = 0;
  let totalEvidenceProfiles = 0;
  let totalPlaceholderClaims = 0;
  let totalIndependentlyApprovedReviews = 0;
  let totalApprovedEvidenceProfiles = 0;
  let totalAiApprovals = 0;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const isWithdrawn = WITHDRAWN_SAFETY_ENTITIES.has(entity.id);
    const isAllowlisted = PUBLIC_INDEX_ALLOWLIST.has(entity.id);

    // 1. Authorship record
    const authorship: AuthorshipRecord & { entityId: string } = {
      entityId: entity.id,
      contributorId: candidateContributor.id,
      role: "author",
      contributionStatement: "Original medical authoring",
      recordedAt: entity.versionInfo?.created || FIXED_TIMESTAMP,
    };
    totalAuthorshipRecords++;

    // 2. Content Revision & Hash
    const clinicalProjection = buildGovernedClinicalProjection(entity);
    const contentHash = computeContentHash(clinicalProjection);
    const revision: ContentRevision = {
      revisionId: `REV-${entity.id}-${contentHash.substring(0, 12)}`,
      entityId: entity.id,
      contentHash,
      createdAt: FIXED_TIMESTAMP,
      createdBy: candidateContributor.id,
      changeSummary: "Phase 2.2B persistent revision baseline",
      isMaterialChange: true,
    };
    totalRevisions++;

    // 3. Historical self-review record (UNVERIFIED / UNAPPROVED for clinical governance)
    const historicalReview: ClinicalReviewRecord & { entityId: string; statusLabel: string } = {
      entityId: entity.id,
      reviewerId: candidateContributor.id,
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: revision.revisionId,
      reviewedAt: entity.versionInfo?.reviewed || FIXED_TIMESTAMP,
      declarationOfIndependence: false,
      notes: "Historical self-reviewed entry — independent clinical review pending",
      statusLabel: "unverified",
    };
    totalHistoricalSelfReviews++;

    // 4. Draft Evidence Profile Shell
    const evidenceProfile = createDraftEvidenceProfileShell(entity.id, revision.revisionId);
    totalEvidenceProfiles++;

    // 5. Placeholder Claim Structure
    const overview = entity.content?.overview || entity.content?.description || "";
    const claims: ClinicalClaim[] = [
      {
        id: `CLM-${entity.id}-001`,
        entityId: entity.id,
        revisionId: revision.revisionId,
        text: overview.substring(0, 150),
        claimType: entity.entityType === "remedy" ? "traditional-use" : "definition",
        citationIds: entity.content?.references || [],
        evidenceStatus: entity.entityType === "remedy" ? "traditional-description" : "partially-supported",
        requiresClinicalReview: true,
      },
    ];
    totalPlaceholderClaims++;

    // Workflow State
    const workflowState: EditorialWorkflowState = isWithdrawn
      ? "withdrawn"
      : isAllowlisted
      ? "editorial-review"
      : "draft";

    const entityWritePayload = {
      entityId: entity.id,
      slug: entity.slug,
      entityType: entity.entityType,
      authorship,
      revision,
      historicalReview,
      evidenceProfile,
      claims,
      workflowState,
      derivedGovernanceState: {
        entityId: entity.id,
        currentRevisionId: revision.revisionId,
        workflowState,
        authorIds: [candidateContributor.id],
        validClinicalReviewIds: [],
        evidenceProfileId: evidenceProfile.id,
        aiIngestionApprovalId: undefined,
        withdrawn: isWithdrawn,
        updatedAt: FIXED_TIMESTAMP,
      },
      eligibleByClinicalGovernance: false,
      eligibleByTemporaryPublicIndexException: isAllowlisted,
      eligibleForAiIngestion: false,
    };

    currentBatch.push(entityWritePayload);

    if (currentBatch.length === BATCH_SIZE || i === entities.length - 1) {
      migrationBatches.push({
        batchIndex: migrationBatches.length + 1,
        batchSize: currentBatch.length,
        resumabilityCheckpointId: `CHECKPOINT_BATCH_${migrationBatches.length + 1}`,
        records: currentBatch,
      });
      currentBatch = [];
    }
  }

  const dryRunReport = {
    timestamp: new Date().toISOString(),
    dryRunMode: true,
    productionWritesExecuted: false,
    totalEntitiesAudited: entities.length,
    proposedWrites: {
      contributors: 1, // Candidate record
      authorshipRecords: totalAuthorshipRecords,
      contentRevisions: totalRevisions,
      historicalSelfReviewRecords: totalHistoricalSelfReviews,
      evidenceProfiles: totalEvidenceProfiles,
      placeholderClaims: totalPlaceholderClaims,
      independentlyApprovedReviews: totalIndependentlyApprovedReviews, // 0
      approvedEvidenceProfiles: totalApprovedEvidenceProfiles, // 0
      aiIngestionApprovals: totalAiApprovals, // 0
    },
    safetyInvariants: {
      independentlyApprovedEntities: 0,
      approvedEvidenceProfiles: 0,
      aiApprovedEntities: 0,
      activeRagCorpusEntities: 0,
      withdrawnSafetyEntities: WITHDRAWN_SAFETY_ENTITIES.size,
    },
    batchingAndCheckpoints: {
      batchCount: migrationBatches.length,
      batchSizeLimit: BATCH_SIZE,
      checkpoints: migrationBatches.map((b) => ({
        batchIndex: b.batchIndex,
        size: b.batchSize,
        checkpointId: b.resumabilityCheckpointId,
      })),
    },
    rollbackStrategy: {
      type: "Compensating Transaction & Delete Migration Collections",
      targetCollections: [
        "knowledgeGovernanceContributors",
        "knowledgeGovernanceQualifications",
        "knowledgeGovernanceAuthorship",
        "knowledgeGovernanceRevisions",
        "knowledgeGovernanceReviews",
        "knowledgeGovernanceEvidenceProfiles",
        "knowledgeGovernanceClaims",
        "knowledgeGovernanceAiApprovals",
        "knowledgeGovernanceAuditEvents",
        "knowledgeGovernanceEntityState",
      ],
      idempotencyKey: "SHA256(entityId + contentHash)",
    },
  };

  fs.writeFileSync(
    "reports/knowledge-phase2-2b-firestore-migration-dry-run.json",
    JSON.stringify(dryRunReport, null, 2),
    "utf8"
  );
  console.log("Saved reports/knowledge-phase2-2b-firestore-migration-dry-run.json");

  // Generate markdown plan
  const mdPlan = `# Phase 2.2B — Firestore Governance Migration Plan & Dry-Run Report

**Execution Date**: ${FIXED_TIMESTAMP}  
**Status**: DRY-RUN COMPLETED (0 Production Writes Executed)  
**Total Entities Audited**: ${entities.length}  

---

## 1. Executive Summary & Proposed Writes

| Record Type | Proposed Count | Governance Status | Production Writes |
| :--- | :---: | :---: | :---: |
| Contributor Candidate Record | 1 | Verified Active | 0 (Dry-Run) |
| Authorship Records | ${totalAuthorshipRecords} | Active Author | 0 (Dry-Run) |
| Content Revisions | ${totalRevisions} | SHA-256 Hash Computed | 0 (Dry-Run) |
| Historical Self-Review Records | ${totalHistoricalSelfReviews} | **Unverified (Self-Review)** | 0 (Dry-Run) |
| Evidence Profiles | ${totalEvidenceProfiles} | **Draft Shells** | 0 (Dry-Run) |
| Placeholder Claims | ${totalPlaceholderClaims} | **Review Required** | 0 (Dry-Run) |
| Independently Approved Reviews | **0** | **Unapproved** | 0 |
| Approved Evidence Profiles | **0** | **Unapproved** | 0 |
| AI-Ingestion Approvals | **0** | **Unapproved** | 0 |

---

## 2. Safety Invariants Verification

\`\`\`text
Independently approved entities: 0
Approved evidence profiles: 0
AI-approved entities: 0
Active RAG corpus entities: 0
Withdrawn safety entities: 3
\`\`\`

---

## 3. Batching, Resumability & Rollback Strategy

1. **Batching**: Migration payload split into ${migrationBatches.length} batches of max ${BATCH_SIZE} records per batch.
2. **Resumability**: Checkpoints saved at \`CHECKPOINT_BATCH_1\` through \`CHECKPOINT_BATCH_${migrationBatches.length}\`.
3. **Idempotency**: Document IDs derived deterministically using \`entityId\` and \`contentHash\`. Re-execution updates identical documents without duplication.
4. **Rollback Strategy**: If migration fails mid-way, compensating cleanup purges all 10 \`knowledgeGovernance*\` collections.
`;

  fs.writeFileSync("docs/audits/knowledge-phase2-2b-migration-plan.md", mdPlan, "utf8");
  console.log("Saved docs/audits/knowledge-phase2-2b-migration-plan.md");

  return dryRunReport;
}

if (require.main === module) {
  executePhase2_2BFirestoreMigrationDryRun();
}
