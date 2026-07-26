import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getAllKnowledgeEntities } from "../src/features/knowledge";
import { PUBLIC_INDEX_ALLOWLIST, WITHDRAWN_SAFETY_ENTITIES } from "../src/features/knowledge/governance/publicationGuard";
import { computeContentHash } from "../src/features/knowledge/governance/services/contentRevisionService";
import { buildGovernedClinicalProjection } from "../src/features/knowledge/governance/services/governedClinicalProjection";
import { createDraftEvidenceProfileShell } from "../src/features/knowledge/governance/services/evidenceProfileService";
import { Contributor, AuthorshipRecord, ClinicalReviewRecord, ClinicalClaim, EditorialWorkflowState, ContentRevision } from "../src/features/knowledge/governance/types/governanceTypes";

export function executePhase2_1PersistenceMigrationDryRun() {
  console.log("🚀 Executing Phase 2.1 Persistence & Governance Migration Dry-Run...");

  const entities = getAllKnowledgeEntities().sort((a, b) => a.id.localeCompare(b.id));
  console.log(`Auditing and formatting persistence payloads for ${entities.length} entities...`);

  const FIXED_TIMESTAMP = "2026-07-25T00:00:00.000Z";

  const contributor: Contributor = {
    id: "CONTRIB-001",
    displayName: "Dr. Narayan Jethwani",
    professionalRole: "Senior Clinical Homeopath & Medical Editor",
    qualifications: ["BHMS", "MD (Hom)"],
    organisation: "Homeo Healthcare Platform",
    active: true,
    createdAt: FIXED_TIMESTAMP,
    updatedAt: FIXED_TIMESTAMP,
  };

  const persistentRecords: any[] = [];
  let authorRecordsMigrated = 0;
  let historicalSelfReviewRecords = 0;
  let revisionsMigrated = 0;
  let placeholderClaimsCount = 0;

  for (const entity of entities) {
    const isWithdrawn = WITHDRAWN_SAFETY_ENTITIES.has(entity.id);
    const isAllowlisted = PUBLIC_INDEX_ALLOWLIST.has(entity.id);

    // 1. Authorship record
    const authorship: AuthorshipRecord = {
      contributorId: contributor.id,
      role: "author",
      contributionStatement: "Original medical authoring",
      recordedAt: entity.versionInfo?.created || FIXED_TIMESTAMP,
    };
    authorRecordsMigrated++;

    // 2. Historical self-review record
    const historicalReview: ClinicalReviewRecord = {
      reviewerId: contributor.id,
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: "historical-unhashed-v1",
      reviewedAt: entity.versionInfo?.reviewed || FIXED_TIMESTAMP,
      declarationOfIndependence: false,
      notes: "Historical self-reviewed entry — independent clinical review pending",
    };
    historicalSelfReviewRecords++;

    // 3. Governed Clinical Projection & SHA-256 Revision Hash
    const clinicalProjection = buildGovernedClinicalProjection(entity);
    const contentHash = computeContentHash(clinicalProjection);
    const revision: ContentRevision = {
      revisionId: `REV-${entity.id}-${contentHash.substring(0, 12)}`,
      entityId: entity.id,
      contentHash,
      createdAt: FIXED_TIMESTAMP,
      createdBy: contributor.id,
      changeSummary: "Phase 2.1 persistent revision baseline",
      isMaterialChange: true,
    };
    revisionsMigrated++;

    // 4. Draft Evidence Profile Shell
    const evidenceProfile = createDraftEvidenceProfileShell(entity.id, revision.revisionId);

    // 5. Placeholder Claim Structure with Explicit Origin Marker
    const overview = entity.content?.overview || entity.content?.description || "";
    const claims: (ClinicalClaim & { origin: string })[] = [
      {
        id: `CLM-${entity.id}-001`,
        entityId: entity.id,
        revisionId: revision.revisionId,
        text: overview.substring(0, 150),
        claimType: entity.entityType === "remedy" ? "traditional-use" : "definition",
        citationIds: entity.content?.references || [],
        evidenceStatus: entity.entityType === "remedy" ? "traditional-description" : "partially-supported",
        requiresClinicalReview: true,
        origin: "migration-placeholder",
      },
    ];
    placeholderClaimsCount++;

    // 6. Workflow State
    const workflowState: EditorialWorkflowState = isWithdrawn
      ? "withdrawn"
      : isAllowlisted
      ? "editorial-review"
      : "review-required" as any;

    persistentRecords.push({
      entityId: entity.id,
      slug: entity.slug,
      entityType: entity.entityType,
      authorship,
      historicalReview,
      independentReviewStatus: "unverified",
      revision,
      evidenceProfile,
      placeholderClaims: claims,
      workflowState,
      eligibleByClinicalGovernance: false,
      eligibleByTemporaryPublicIndexException: isAllowlisted,
      eligibleForIndexing: isAllowlisted,
      eligibleForAiIngestion: false,
    });
  }

  const payloadStr = JSON.stringify(persistentRecords);
  const dryRunChecksum = crypto.createHash("sha256").update(payloadStr).digest("hex");

  const migrationReport = {
    migratedAt: FIXED_TIMESTAMP,
    dryRunChecksum,
    totalEntitiesMigrated: persistentRecords.length,
    contributorsCreated: 1,
    authorRecordsMigrated,
    historicalSelfReviewRecords,
    revisionsMigrated,
    placeholderClaimsCount,
    independentlyApprovedEntities: 0,
    approvedEvidenceProfiles: 0,
    aiApprovedEntities: 0,
    activeRagCorpusSize: 0,
    summary: {
      fullyClinicallyPublicationEligible: 0,
      temporarilyIndexableByEditorialException: 8,
      independentlyReviewed: 0,
      approvedEvidenceProfiles: 0,
      aiApprovedEntities: 0,
      activeRagCorpusSize: 0,
      withdrawnEntities: 3,
    },
    records: persistentRecords,
  };

  const reportPath = path.resolve(__dirname, "../reports/knowledge-phase2-1-persistence-migration-dry-run.json");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(migrationReport, null, 2), "utf8");

  console.log(`✅ Phase 2.1 Persistence Migration Report written to: ${reportPath}`);
  console.log(`🔑 Deterministic Checksum: ${dryRunChecksum}`);
  console.log(`📊 Independently Approved: 0 | Evidence Approved: 0 | AI Approved: 0 | Active RAG: 0`);

  return migrationReport;
}

if (require.main === module) {
  executePhase2_1PersistenceMigrationDryRun();
}
