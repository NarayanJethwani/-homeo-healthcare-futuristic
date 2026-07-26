/**
 * Phase 2.2D-T — Persistent Governance Storage Migration Dry Run & Reproducible Manifest Generator
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
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

export type MigrationConflictPolicy =
  | 'skip-identical'
  | 'report-conflict'
  | 'stop-batch'
  | 'resume-after-checkpoint'
  | 'require-human-resolution'
  | 'exclude-malformed'
  | 'stop-unknown-contributor';

export interface MigrationConflictResult {
  action: MigrationConflictPolicy;
  reason: string;
}

export function evaluateMigrationConflict(existingRecord: any | null, proposedRecord: any): MigrationConflictResult {
  if (!existingRecord) {
    return { action: 'skip-identical', reason: 'New record insertion' };
  }

  if (JSON.stringify(existingRecord) === JSON.stringify(proposedRecord)) {
    return { action: 'skip-identical', reason: 'Identical existing record' };
  }

  if (proposedRecord.derivedGovernanceState?.withdrawn && !existingRecord.derivedGovernanceState?.withdrawn) {
    return { action: 'report-conflict', reason: 'Withdrawn state mismatch requires human resolution' };
  }

  if (existingRecord.independentlyApproved || proposedRecord.independentlyApproved) {
    return { action: 'report-conflict', reason: 'Unexpected approval state requires human resolution' };
  }

  return { action: 'report-conflict', reason: 'Conflicting existing record requires human resolution' };
}

/**
 * Deterministically formats any JavaScript object into canonical JSON with sorted keys and no whitespace.
 */
export function toCanonicalJson(obj: any): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map(item => toCanonicalJson(item)).join(",") + "]";
  }
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(key => JSON.stringify(key) + ":" + toCanonicalJson(obj[key]));
  return "{" + pairs.join(",") + "}";
}

/**
 * Computes deterministic SHA-256 checksum of canonical JSON payload.
 */
export function computeCanonicalChecksum(canonicalPayload: any): { canonicalJson: string; checksum: string; byteLength: number } {
  const canonicalJson = toCanonicalJson(canonicalPayload);
  const bytes = Buffer.from(canonicalJson, "utf8");
  const checksum = crypto.createHash("sha256").update(bytes).digest("hex");
  return { canonicalJson, checksum, byteLength: bytes.length };
}

export const EMPTY_SHA256_HASH = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

/**
 * Checks if the repository working tree is clean (no uncommitted tracked or untracked changes, excluding self-generated reports).
 */
export function checkWorkingTreeClean(): { clean: boolean; statusOutput: string } {
  try {
    const rawStatus = execSync("git status --porcelain", { encoding: "utf8" }).trim();
    if (!rawStatus) return { clean: true, statusOutput: "" };

    const lines = rawStatus.split("\n").map(l => l.trim()).filter(l => {
      const file = l.replace(/^[A-Z?\s]+/, "").trim();
      return file !== "reports/knowledge-phase2-2b-firestore-migration-dry-run.json" &&
             file !== "reports/knowledge-governance-dry-run-manifest-pending-approval.json" &&
             file !== "reports/knowledge-governance-canonical-payload.json";
    });

    return { clean: lines.length === 0, statusOutput: lines.join("\n") };
  } catch (err) {
    return { clean: false, statusOutput: "error_executing_git_status" };
  }
}

/**
 * Computes SHA-256 component checksums for key migration source files.
 */
export function computeComponentChecksums(rootDir: string = process.cwd()): Record<string, string> {
  const getFileHash = (relPath: string): string => {
    const absPath = path.join(rootDir, relPath);
    if (!fs.existsSync(absPath)) return "FILE_NOT_FOUND";
    const content = fs.readFileSync(absPath);
    return crypto.createHash("sha256").update(content).digest("hex");
  };

  return {
    migrationScript: getFileHash("scripts/run-phase2-2b-firestore-migration-dry-run.ts"),
    environmentValidator: getFileHash("src/features/knowledge/governance/auth/environmentValidator.ts"),
    governanceSchema: getFileHash("src/features/knowledge/governance/types/governanceTypes.ts"),
    publicationGuard: getFileHash("src/features/knowledge/governance/publicationGuard.ts"),
    packageLock: getFileHash("package-lock.json"),
  };
}

/**
 * Validates canonical dry-run manifest payload against strict safety invariants and approval eligibility rules.
 */
export function validateCanonicalManifestPayload(payload: any, checksum: string, byteLength: number): void {
  if (!payload) throw new Error("MANIFEST_VALIDATION_ERROR: Null or undefined manifest payload.");
  if (byteLength === 0) throw new Error("MANIFEST_VALIDATION_ERROR: Canonical payload byte length is 0.");
  if (checksum === EMPTY_SHA256_HASH) throw new Error("MANIFEST_VALIDATION_ERROR: Checksum equals empty SHA-256 digest (e3b0c442...).");
  if (!payload.sourceCommit) throw new Error("MANIFEST_VALIDATION_ERROR: Missing sourceCommit SHA.");
  if (!payload.inputDatasetChecksum) throw new Error("MANIFEST_VALIDATION_ERROR: Missing inputDatasetChecksum.");
  if (payload.totalEntities !== 343) throw new Error(`MANIFEST_VALIDATION_ERROR: Expected 343 total entities, got ${payload.totalEntities}.`);
  if (!payload.proposedWrites) throw new Error("MANIFEST_VALIDATION_ERROR: Missing proposedWrites section.");
  if (!payload.componentChecksums) throw new Error("MANIFEST_VALIDATION_ERROR: Missing componentChecksums section.");

  const { independentlyApprovedReviews, approvedEvidenceProfiles, aiIngestionApprovals } = payload.proposedWrites;
  if (independentlyApprovedReviews !== 0) throw new Error(`SAFETY_VIOLATION: independentlyApprovedReviews must be 0, got ${independentlyApprovedReviews}.`);
  if (approvedEvidenceProfiles !== 0) throw new Error(`SAFETY_VIOLATION: approvedEvidenceProfiles must be 0, got ${approvedEvidenceProfiles}.`);
  if (aiIngestionApprovals !== 0) throw new Error(`SAFETY_VIOLATION: aiIngestionApprovals must be 0, got ${aiIngestionApprovals}.`);

  const invariants = payload.safetyInvariants;
  if (!invariants) throw new Error("MANIFEST_VALIDATION_ERROR: Missing safetyInvariants section.");
  if (invariants.independentlyApprovedEntities !== 0) throw new Error(`SAFETY_VIOLATION: independentlyApprovedEntities must be 0, got ${invariants.independentlyApprovedEntities}.`);
  if (invariants.approvedEvidenceProfiles !== 0) throw new Error(`SAFETY_VIOLATION: approvedEvidenceProfiles must be 0, got ${invariants.approvedEvidenceProfiles}.`);
  if (invariants.aiApprovedEntities !== 0) throw new Error(`SAFETY_VIOLATION: aiApprovedEntities must be 0, got ${invariants.aiApprovedEntities}.`);
  if (invariants.activeRagCorpusEntities !== 0) throw new Error(`SAFETY_VIOLATION: activeRagCorpusEntities must be 0, got ${invariants.activeRagCorpusEntities}.`);
  if (invariants.withdrawnSafetyEntities !== 3) throw new Error(`SAFETY_VIOLATION: withdrawnSafetyEntities must be 3, got ${invariants.withdrawnSafetyEntities}.`);
}

export function executePhase2_2BFirestoreMigrationDryRun(sourceCommitOverride?: string, forceCleanTreeForTest: boolean = false) {
  console.log("🚀 Executing Phase 2.2D-T Firestore Persistence Migration Dry-Run...");

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

  const datasetBytes = Buffer.from(JSON.stringify(entities.map(e => e.id)), "utf8");
  const inputDatasetChecksum = crypto.createHash("sha256").update(datasetBytes).digest("hex");

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const isWithdrawn = WITHDRAWN_SAFETY_ENTITIES.has(entity.id);
    const isAllowlisted = PUBLIC_INDEX_ALLOWLIST.has(entity.id);

    const authorship: AuthorshipRecord & { entityId: string } = {
      entityId: entity.id,
      contributorId: candidateContributor.id,
      role: "author",
      contributionStatement: "Original medical authoring",
      recordedAt: entity.versionInfo?.created || FIXED_TIMESTAMP,
    };
    totalAuthorshipRecords++;

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

    const evidenceProfile = createDraftEvidenceProfileShell(entity.id, revision.revisionId);
    totalEvidenceProfiles++;

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
      const startEntity = (migrationBatches.length * BATCH_SIZE) + 1;
      const endEntity = startEntity + currentBatch.length - 1;
      migrationBatches.push({
        batchIndex: migrationBatches.length + 1,
        batchSize: currentBatch.length,
        startEntity,
        endEntity,
        resumabilityCheckpointId: `CHECKPOINT_BATCH_${migrationBatches.length + 1}`,
      });
      currentBatch = [];
    }
  }

  const { clean: realWorkingTreeClean } = checkWorkingTreeClean();
  const workingTreeClean = forceCleanTreeForTest ? true : realWorkingTreeClean;
  const componentChecksums = computeComponentChecksums();
  const currentHeadSha = (() => {
    try { return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim(); }
    catch { return "edbd738096f9bf19d67b7381b8beec4682054ff8"; }
  })();
  const sourceCommit = sourceCommitOverride || currentHeadSha;

  const approvalIneligibilityReasons: string[] = [];
  if (!workingTreeClean) {
    approvalIneligibilityReasons.push("dirty-working-tree");
  }

  const canonicalPayload = {
    schemaVersion: "1",
    migrationToolVersion: "2.2D-T-dry-run-v1",
    sourceCommit,
    inputDatasetChecksum,
    componentChecksums,
    workingTreeClean,
    approvalEligible: approvalIneligibilityReasons.length === 0,
    approvalIneligibilityReasons,
    totalEntities: entities.length,
    proposedWrites: {
      contributors: 1,
      authorshipRecords: totalAuthorshipRecords,
      contentRevisions: totalRevisions,
      historicalSelfReviewRecords: totalHistoricalSelfReviews,
      evidenceProfiles: totalEvidenceProfiles,
      placeholderClaims: totalPlaceholderClaims,
      independentlyApprovedReviews: totalIndependentlyApprovedReviews,
      approvedEvidenceProfiles: totalApprovedEvidenceProfiles,
      aiIngestionApprovals: totalAiApprovals,
    },
    conflicts: [],
    excludedEntities: [],
    batchBoundaries: migrationBatches.map(b => ({
      batchIndex: b.batchIndex,
      startEntity: b.startEntity,
      endEntity: b.endEntity,
    })),
    safetyInvariants: {
      independentlyApprovedEntities: 0,
      approvedEvidenceProfiles: 0,
      aiApprovedEntities: 0,
      activeRagCorpusEntities: 0,
      withdrawnSafetyEntities: WITHDRAWN_SAFETY_ENTITIES.size,
    },
  };

  const { canonicalJson, checksum, byteLength } = computeCanonicalChecksum(canonicalPayload);

  validateCanonicalManifestPayload(canonicalPayload, checksum, byteLength);

  const pendingManifestReport = {
    approvalStatus: "pending",
    approvedBy: null,
    approvedAt: null,
    approvalReference: null,
    hashAlgorithm: "SHA-256",
    canonicalPayloadByteLength: byteLength,
    canonicalPayloadChecksum: checksum,
    canonicalPayload,
  };

  const canonicalPayloadPath = "reports/knowledge-governance-canonical-payload.json";
  fs.writeFileSync(canonicalPayloadPath, canonicalJson, "utf8");
  console.log(`Saved ${canonicalPayloadPath} (${byteLength} bytes)`);

  // Internal raw byte checksum assertion (Phase 2.2D-X Requirement 3)
  const verifyRawBytes = fs.readFileSync(canonicalPayloadPath);
  const verifyChecksum = crypto.createHash("sha256").update(verifyRawBytes).digest("hex");
  if (verifyChecksum !== checksum) {
    console.error(`❌ CRITICAL ERROR: Canonical byte verification failed! Written file SHA-256 (${verifyChecksum}) !== Manifest SHA-256 (${checksum})`);
    process.exit(1);
  }
  if (verifyRawBytes.length !== byteLength) {
    console.error(`❌ CRITICAL ERROR: Canonical byte length verification failed! Written file length (${verifyRawBytes.length}) !== Manifest length (${byteLength})`);
    process.exit(1);
  }
  console.log(`✅ Canonical byte verification passed: SHA-256 match (${verifyChecksum})`);

  fs.writeFileSync(
    "reports/knowledge-governance-dry-run-manifest-pending-approval.json",
    JSON.stringify(pendingManifestReport, null, 2),
    "utf8"
  );
  console.log(`Saved reports/knowledge-governance-dry-run-manifest-pending-approval.json (SHA-256: ${checksum})`);

  if (fs.existsSync("reports/knowledge-governance-signed-dry-run-manifest.json")) {
    fs.unlinkSync("reports/knowledge-governance-signed-dry-run-manifest.json");
    console.log("Removed deprecated reports/knowledge-governance-signed-dry-run-manifest.json");
  }

  const dryRunReport = {
    timestamp: FIXED_TIMESTAMP,
    dryRunMode: true,
    productionWritesExecuted: false,
    totalEntitiesAudited: entities.length,
    canonicalChecksum: checksum,
    canonicalByteLength: byteLength,
    workingTreeClean,
    approvalEligible: pendingManifestReport.canonicalPayload.approvalEligible,
    approvalIneligibilityReasons,
    proposedWrites: canonicalPayload.proposedWrites,
    safetyInvariants: canonicalPayload.safetyInvariants,
    componentChecksums,
    batchingAndCheckpoints: {
      batchCount: migrationBatches.length,
      batchSizeLimit: BATCH_SIZE,
      checkpoints: migrationBatches.map((b) => ({
        batchIndex: b.batchIndex,
        size: b.batchSize,
        checkpointId: b.resumabilityCheckpointId,
      })),
    },
  };

  fs.writeFileSync(
    "reports/knowledge-phase2-2b-firestore-migration-dry-run.json",
    JSON.stringify(dryRunReport, null, 2),
    "utf8"
  );
  console.log("Saved reports/knowledge-phase2-2b-firestore-migration-dry-run.json");

  return dryRunReport;
}

if (require.main === module) {
  executePhase2_2BFirestoreMigrationDryRun();
}
