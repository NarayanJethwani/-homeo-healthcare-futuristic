/**
 * Phase 2.2B — Authentication Boundary & Handler Security Tests
 */

process.env.NODE_ENV = "test";
process.env.ADMIN_SESSION_SECRET = "homeo-healthcare-test-session-secret-xyz123";

import assert from "node:assert/strict";
import { MemoryGovernanceRepository } from "../src/features/knowledge/governance/repositories/FirestoreGovernanceRepository";
import { createAdminSessionCookie } from "../src/lib/adminSession";
import {
  deriveGovernanceAuthContext,
  sanitizeGovernanceRequestBody,
} from "../src/features/knowledge/governance/auth/governanceAuthAdapter";
import {
  createDraftRevisionHandler,
  submitReviewDecisionHandler,
  createEvidenceProfileDraftHandler,
  emergencyWithdrawalHandler,
  getAuditHistoryHandler,
} from "../src/features/knowledge/governance/handlers/governanceWriteHandlers";
import { serializePublicContributor } from "../src/features/knowledge/governance/services/contributorRegistry";

async function test(name: string, fn: () => Promise<void>) {
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
  console.log("🚀 Starting Governance Authentication Boundary & Handler Security Tests...\n");

  const repo = new MemoryGovernanceRepository();

  // Synthetic Test Fixture (isolated inside test harness)
  const synthContributorId = "CONTRIB-SYNTH-REV-001";
  await repo.createContributor({
    id: synthContributorId,
    displayName: "Dr. Synthetic Reviewer",
    professionalRole: "Synthetic Reviewer Fixture",
    qualifications: ["MD (Hom)"],
    organisation: "Test Platform",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await repo.createQualificationDecision({
    id: `QUAL-${synthContributorId}`,
    contributorId: synthContributorId,
    scope: "clinical",
    status: "qualified",
    qualifiedAt: new Date().toISOString(),
  });

  // 1. No Session -> Handler returns 403 / unauthenticated
  await test("1. Handler returns 403 for unauthenticated request (no session)", async () => {
    const res = await createDraftRevisionHandler(repo, undefined, undefined, {
      entityId: "D0001",
      content: { overview: "Test overview" },
    });
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.success, false);
  });

  // 2. Invalid Session Token -> Handler returns 403
  await test("2. Handler returns 403 for invalid session cookie", async () => {
    const res = await submitReviewDecisionHandler(repo, "invalid.cookie.token", undefined, {
      entityId: "D0001",
      revisionId: "REV-D0001-123456",
      decision: "approved",
      declarationOfIndependence: true,
    });
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.success, false);
  });

  // 3. Account without Contributor Mapping -> Handler rejects with 403 UNMAPPED_CONTRIBUTOR
  await test("3. Account without contributor mapping is rejected", async () => {
    const unmappedSession = await createAdminSessionCookie({
      uid: "unmapped-uid-999",
      role: "doctor",
      exp: Date.now() + 3600000,
    });
    const ctx = await deriveGovernanceAuthContext(unmappedSession);
    assert.ok(ctx);
    assert.strictEqual(ctx.contributorId, undefined);

    const res = await submitReviewDecisionHandler(repo, unmappedSession, undefined, {
      entityId: "D0001",
      revisionId: "REV-D0001-123456",
      decision: "approved",
      declarationOfIndependence: true,
    });
    assert.strictEqual(res.statusCode, 403);
    assert.ok(res.error?.includes("linked contributor record") || res.error?.includes("UNMAPPED_CONTRIBUTOR"));
  });

  // 4. Contributor without Permission -> Handler rejects
  await test("4. Contributor without required permission is rejected", async () => {
    // Ordinary doctor has submit-review but lacks emergency-withdrawal
    const doctorSession = await createAdminSessionCookie({
      uid: synthContributorId,
      role: "doctor",
      exp: Date.now() + 3600000,
    });
    const res = await emergencyWithdrawalHandler(repo, doctorSession, undefined, {
      entityId: "D0001",
      reason: "Unauthorized attempt",
    });
    assert.strictEqual(res.statusCode, 403);
    assert.ok(res.error?.includes("lacks required permission") || res.error?.includes("PERMISSION_DENIED"));
  });

  // 5. Body-supplied Actor Spoofing & Role Spoofing -> Ignored by sanitizer & auth context
  await test("5. Body-supplied actor/role spoofing is strictly stripped and ignored", async () => {
    const rawBody = {
      entityId: "D0001",
      content: { overview: "Spoof test overview" },
      actorId: "SPOOFED-ACTOR-ADMIN",
      contributorId: "SPOOFED-CONTRIBUTOR-ID",
      roles: ["super-admin"],
      permissions: ["emergency-withdrawal"],
    };
    const sanitized = sanitizeGovernanceRequestBody(rawBody);
    assert.strictEqual(sanitized.actorId, undefined);
    assert.strictEqual(sanitized.contributorId, undefined);
    assert.strictEqual(sanitized.roles, undefined);

    const adminSession = await createAdminSessionCookie({
      uid: "CONTRIB-001",
      role: "admin",
      exp: Date.now() + 3600000,
    });
    const res = await createDraftRevisionHandler(repo, adminSession, undefined, rawBody);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data?.createdBy, "CONTRIB-001"); // Uses context, not body spoof
  });

  // 6. Private Contributor Verification Data Excluded from Public DTO
  await test("6. Private contributor verification fields are excluded from public DTO", async () => {
    const fullContributor = {
      id: "CONTRIB-001",
      displayName: "Dr. Narayan Jethwani",
      professionalRole: "Senior Clinical Homeopath",
      qualifications: ["BHMS", "MD (Hom)"],
      organisation: "Homeo Healthcare",
      registrationAuthority: "State Council of Homoeopathy",
      registrationNumber: "REG-12345-PRIVATE",
      verificationDocuments: ["doc1.pdf"],
      verificationNotes: "PRIVATE_NOTES_MUST_NOT_LEAK",
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const publicDto = serializePublicContributor(fullContributor as any);
    assert.strictEqual((publicDto as any).registrationAuthority, undefined);
    assert.strictEqual((publicDto as any).registrationNumber, undefined);
    assert.strictEqual((publicDto as any).verificationDocuments, undefined);
    assert.strictEqual((publicDto as any).verificationNotes, undefined);
    assert.strictEqual(publicDto.displayName, "Dr. Narayan Jethwani");
  });

  // 7. Correct Authenticated Reviewer Path using Synthetic Fixture
  await test("7. Correct authenticated reviewer path using synthetic fixture succeeds", async () => {
    const synthSession = await createAdminSessionCookie({
      uid: synthContributorId,
      role: "doctor",
      exp: Date.now() + 3600000,
    });

    // Create a revision and entity state first
    const revId = "REV-D0001-synth001";
    await repo.createContentRevision({
      revisionId: revId,
      entityId: "D0001",
      contentHash: "hash-synth-001",
      createdAt: new Date().toISOString(),
      createdBy: "CONTRIB-001", // Author is different from reviewer synthContributorId
      changeSummary: "Synthetic revision",
      isMaterialChange: true,
    });

    await repo.updateEntityGovernanceState({
      entityId: "D0001",
      currentRevisionId: revId,
      workflowState: "clinical-review",
      authorIds: ["CONTRIB-001"],
      validClinicalReviewIds: [],
      withdrawn: false,
      updatedAt: new Date().toISOString(),
    });

    const res = await submitReviewDecisionHandler(repo, synthSession, undefined, {
      entityId: "D0001",
      revisionId: revId,
      reviewType: "clinical",
      decision: "approved",
      declarationOfIndependence: true,
      notes: "Synthetic review approved",
    });

    if (res.statusCode !== 200) {
      console.error("Case 7 error response:", res);
    }
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.success, true);
    assert.ok(res.data?.reviewId);
  });

  console.log("\n🎉 All 7 Governance Auth Boundary & Handler Security Tests Passed 100%!");
}

run();
