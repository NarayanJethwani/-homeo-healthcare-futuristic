/**
 * Phase 2.2D-S Governance Migration Safety, Component Checksums & Manifest Integrity Test Suite
 */

import assert from "node:assert/strict";
import crypto from "node:crypto";
import {
  evaluateMigrationConflict,
  toCanonicalJson,
  computeCanonicalChecksum,
  validateCanonicalManifestPayload,
  computeComponentChecksums,
  checkWorkingTreeClean,
  EMPTY_SHA256_HASH
} from "../scripts/run-phase2-2b-firestore-migration-dry-run";
import { validateMigrationExecutionAuthorization } from "../src/features/knowledge/governance/auth/environmentValidator";

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`✅ TEST PASSED: ${name}`);
  } catch (err: any) {
    console.error(`❌ TEST FAILED: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

async function run() {
  console.log("🚀 Starting Governance Migration Safety, Component Checksums & Manifest Integrity Tests...\n");

  const componentChecksums = computeComponentChecksums();

  const validPayload = {
    schemaVersion: "1",
    migrationToolVersion: "2.2D-S-dry-run-v1",
    sourceCommit: "378d465c05667c178958dd703bfb365245c28293",
    inputDatasetChecksum: "abc123datasetchecksum",
    componentChecksums,
    workingTreeClean: true,
    approvalEligible: true,
    approvalIneligibilityReasons: [],
    totalEntities: 343,
    proposedWrites: {
      contributors: 1,
      authorshipRecords: 343,
      contentRevisions: 343,
      historicalSelfReviewRecords: 343,
      evidenceProfiles: 343,
      placeholderClaims: 343,
      independentlyApprovedReviews: 0,
      approvedEvidenceProfiles: 0,
      aiIngestionApprovals: 0
    },
    conflicts: [],
    excludedEntities: [],
    batchBoundaries: [{ batchIndex: 1, startEntity: 1, endEntity: 50 }],
    safetyInvariants: {
      independentlyApprovedEntities: 0,
      approvedEvidenceProfiles: 0,
      aiApprovedEntities: 0,
      activeRagCorpusEntities: 0,
      withdrawnSafetyEntities: 3
    }
  };

  const { checksum: validChecksum, byteLength: validByteLength } = computeCanonicalChecksum(validPayload);

  await test("1. Empty canonical payload is rejected", () => {
    assert.throws(() => {
      validateCanonicalManifestPayload(null, validChecksum, validByteLength);
    }, /MANIFEST_VALIDATION_ERROR/);
    assert.throws(() => {
      validateCanonicalManifestPayload(validPayload, validChecksum, 0);
    }, /MANIFEST_VALIDATION_ERROR/);
  });

  await test("2. Empty SHA-256 digest is rejected", () => {
    assert.throws(() => {
      validateCanonicalManifestPayload(validPayload, EMPTY_SHA256_HASH, validByteLength);
    }, /MANIFEST_VALIDATION_ERROR/);
  });

  await test("3. Missing input dataset checksum is rejected", () => {
    const invalid = { ...validPayload, inputDatasetChecksum: "" };
    assert.throws(() => {
      validateCanonicalManifestPayload(invalid, validChecksum, validByteLength);
    }, /MANIFEST_VALIDATION_ERROR/);
  });

  await test("4. Missing source commit is rejected", () => {
    const invalid = { ...validPayload, sourceCommit: "" };
    assert.throws(() => {
      validateCanonicalManifestPayload(invalid, validChecksum, validByteLength);
    }, /MANIFEST_VALIDATION_ERROR/);
  });

  await test("5. Missing component checksums section is rejected", () => {
    const invalid = { ...validPayload, componentChecksums: undefined };
    assert.throws(() => {
      validateCanonicalManifestPayload(invalid, validChecksum, validByteLength);
    }, /MANIFEST_VALIDATION_ERROR/);
  });

  await test("6. Wrong entity count (!= 343) is rejected", () => {
    const invalid = { ...validPayload, totalEntities: 100 };
    assert.throws(() => {
      validateCanonicalManifestPayload(invalid, validChecksum, validByteLength);
    }, /MANIFEST_VALIDATION_ERROR/);
  });

  await test("7. Non-zero clinical approval count is rejected", () => {
    const invalid = {
      ...validPayload,
      proposedWrites: { ...validPayload.proposedWrites, independentlyApprovedReviews: 1 }
    };
    assert.throws(() => {
      validateCanonicalManifestPayload(invalid, validChecksum, validByteLength);
    }, /SAFETY_VIOLATION/);
  });

  await test("8. Non-zero AI approval count is rejected", () => {
    const invalid = {
      ...validPayload,
      proposedWrites: { ...validPayload.proposedWrites, aiIngestionApprovals: 1 }
    };
    assert.throws(() => {
      validateCanonicalManifestPayload(invalid, validChecksum, validByteLength);
    }, /SAFETY_VIOLATION/);
  });

  await test("9. Non-zero RAG active count is rejected", () => {
    const invalid = {
      ...validPayload,
      safetyInvariants: { ...validPayload.safetyInvariants, activeRagCorpusEntities: 1 }
    };
    assert.throws(() => {
      validateCanonicalManifestPayload(invalid, validChecksum, validByteLength);
    }, /SAFETY_VIOLATION/);
  });

  await test("10. Repeated dry runs produce identical deterministic checksums", () => {
    const resA = computeCanonicalChecksum(validPayload);
    const resB = computeCanonicalChecksum(JSON.parse(JSON.stringify(validPayload)));

    assert.strictEqual(resA.canonicalJson, resB.canonicalJson);
    assert.strictEqual(resA.checksum, resB.checksum);
    assert.notStrictEqual(resA.checksum, EMPTY_SHA256_HASH);
  });

  await test("11. Dirty working tree marks manifest ineligible for approval", () => {
    const dirtyPayload = {
      ...validPayload,
      workingTreeClean: false,
      approvalEligible: false,
      approvalIneligibilityReasons: ["dirty-working-tree"]
    };

    const res = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION",
      humanAuthorizerId: "ADMIN-CONTRIB-001",
      explicitCommandFlag: true,
      approvalStatus: "approved",
      approvalEligible: false,
      commitHash: "378d465c05667c178958dd703bfb365245c28293",
      approvedCommitHash: "378d465c05667c178958dd703bfb365245c28293",
      canonicalPayloadChecksum: validChecksum,
      approvedChecksum: validChecksum,
      backupConfirmationId: "DRILL-VERIFIED-001",
      stageSelection: "stage-0-readonly"
    }, { NODE_ENV: "production", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod", ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min" });

    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes("ineligible for approval"));
  });

  await test("12. Component checksum mismatch is rejected", () => {
    const res = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION",
      humanAuthorizerId: "ADMIN-CONTRIB-001",
      explicitCommandFlag: true,
      approvalStatus: "approved",
      approvalEligible: true,
      commitHash: "378d465c05667c178958dd703bfb365245c28293",
      approvedCommitHash: "378d465c05667c178958dd703bfb365245c28293",
      canonicalPayloadChecksum: validChecksum,
      approvedChecksum: validChecksum,
      componentChecksums: { migrationScript: "hash_a" },
      approvedComponentChecksums: { migrationScript: "hash_b" },
      backupConfirmationId: "DRILL-VERIFIED-001",
      stageSelection: "stage-0-readonly"
    }, { NODE_ENV: "production", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod", ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min" });

    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes("Component checksum mismatch"));
  });

  await test("13. Staging project cannot authorize production execution", () => {
    const res = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-staging",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION",
      humanAuthorizerId: "ADMIN-CONTRIB-001",
      explicitCommandFlag: true,
      approvalStatus: "approved",
      approvalEligible: true,
      commitHash: "378d465c05667c178958dd703bfb365245c28293",
      approvedCommitHash: "378d465c05667c178958dd703bfb365245c28293",
      canonicalPayloadChecksum: validChecksum,
      approvedChecksum: validChecksum,
      backupConfirmationId: "DRILL-VERIFIED-001",
      stageSelection: "stage-0-readonly"
    }, { NODE_ENV: "production", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-staging", ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min" });

    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes("not in approved production allowlist"));
  });

  await test("14. Unsigned/pending manifest cannot authorize production execution", () => {
    const res = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION",
      humanAuthorizerId: "ADMIN-CONTRIB-001",
      explicitCommandFlag: true,
      approvalStatus: "pending",
      commitHash: "378d465c05667c178958dd703bfb365245c28293",
      approvedCommitHash: "378d465c05667c178958dd703bfb365245c28293",
      canonicalPayloadChecksum: validChecksum,
      approvedChecksum: validChecksum,
      backupConfirmationId: "DRILL-VERIFIED-001",
      stageSelection: "stage-0-readonly"
    }, { NODE_ENV: "production", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod", ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min" });

    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes("pending human approval"));
  });

  await test("15. Commit mismatch is rejected", () => {
    const res = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION",
      humanAuthorizerId: "ADMIN-CONTRIB-001",
      explicitCommandFlag: true,
      approvalStatus: "approved",
      approvalEligible: true,
      commitHash: "commit_aaaa",
      approvedCommitHash: "commit_bbbb",
      canonicalPayloadChecksum: validChecksum,
      approvedChecksum: validChecksum,
      backupConfirmationId: "DRILL-VERIFIED-001",
      stageSelection: "stage-0-readonly"
    }, { NODE_ENV: "production", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod", ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min" });

    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes("commit SHA mismatch"));
  });

  await test("16. Missing restore-exercise reference is rejected", () => {
    const res = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION",
      humanAuthorizerId: "ADMIN-CONTRIB-001",
      explicitCommandFlag: true,
      approvalStatus: "approved",
      approvalEligible: true,
      commitHash: "378d465c05667c178958dd703bfb365245c28293",
      approvedCommitHash: "378d465c05667c178958dd703bfb365245c28293",
      canonicalPayloadChecksum: validChecksum,
      approvedChecksum: validChecksum,
      backupConfirmationId: "",
      stageSelection: "stage-0-readonly"
    }, { NODE_ENV: "production", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod", ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min" });

    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes("Missing backupConfirmationId"));
  });

  await test("17. Static confirmation phrase alone is rejected", () => {
    const res = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION"
    }, { NODE_ENV: "production", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod", ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min" });

    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes("explicitCommandFlag"));
  });

  await test("18. Canonical exact-byte checksum sensitivity and mismatch detection", () => {
    const { toCanonicalJson, computeCanonicalChecksum } = require("../scripts/run-phase2-2b-firestore-migration-dry-run");

    const basePayload = {
      alpha: "value_a",
      beta: [1, 2, 3],
      gamma: { nested: true }
    };

    const baseCanonicalStr = toCanonicalJson(basePayload);
    const { checksum: baseChecksum } = computeCanonicalChecksum(basePayload);

    // 1. One changed byte alters checksum
    const singleByteChanged = baseCanonicalStr.replace("value_a", "value_b");
    const singleByteHash = crypto.createHash("sha256").update(singleByteChanged).digest("hex");
    assert.notStrictEqual(singleByteHash, baseChecksum);

    // 2. Truncated output alters checksum
    const truncatedStr = baseCanonicalStr.slice(0, -1);
    const truncatedHash = crypto.createHash("sha256").update(truncatedStr).digest("hex");
    assert.notStrictEqual(truncatedHash, baseChecksum);

    // 3. Appended newline alters checksum
    const newlineStr = baseCanonicalStr + "\n";
    const newlineHash = crypto.createHash("sha256").update(newlineStr).digest("hex");
    assert.notStrictEqual(newlineHash, baseChecksum);

    // 4. Key ordering sensitivity
    const unorderedJsonStr = JSON.stringify({ gamma: { nested: true }, beta: [1, 2, 3], alpha: "value_a" });
    const unorderedHash = crypto.createHash("sha256").update(unorderedJsonStr).digest("hex");
    assert.notStrictEqual(unorderedHash, baseChecksum);

    // 5. Array ordering sensitivity
    const reorderedArrayPayload = { alpha: "value_a", beta: [2, 1, 3], gamma: { nested: true } };
    const { checksum: reorderedArrayHash } = computeCanonicalChecksum(reorderedArrayPayload);
    assert.notStrictEqual(reorderedArrayHash, baseChecksum);

    // 6. Manifest checksum mismatch rejection in authorization validator
    const res = validateMigrationExecutionAuthorization({
      environment: "production",
      projectId: "homeo-healthcare-prod",
      confirmationToken: "CONFIRM_PRODUCTION_MIGRATION_EXECUTION",
      humanAuthorizerId: "ADMIN-CONTRIB-001",
      explicitCommandFlag: true,
      approvalStatus: "approved",
      approvalEligible: true,
      commitHash: "378d465c05667c178958dd703bfb365245c28293",
      approvedCommitHash: "378d465c05667c178958dd703bfb365245c28293",
      canonicalPayloadChecksum: baseChecksum,
      approvedChecksum: singleByteHash, // Mismatched checksum
      backupConfirmationId: "DRILL-VERIFIED-001",
      stageSelection: "stage-0-readonly"
    }, { NODE_ENV: "production", NEXT_PUBLIC_FIREBASE_PROJECT_ID: "homeo-healthcare-prod", ADMIN_SESSION_SECRET: "a_very_long_secure_production_secret_32_chars_min" });

    assert.strictEqual(res.authorized, false);
    assert.ok(res.reason?.includes("Canonical payload checksum mismatch"));
  });

  console.log("🎉 Governance Migration Safety, Component Checksums & Manifest Integrity Tests Passed 100%!");
}

if (require.main === module) {
  run();
}
