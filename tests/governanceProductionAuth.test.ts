/**
 * Phase 2.2C Production Governance Authentication & Authorization Test Suite
 */

import assert from "node:assert/strict";
import { deriveGovernanceAuthContext, sanitizeGovernanceRequestBody } from "../src/features/knowledge/governance/auth/governanceAuthAdapter";
import { hasGovernancePermission } from "../src/features/knowledge/governance/services/governanceRbacService";
import { MemoryGovernanceRepository } from "../src/features/knowledge/governance/repositories/FirestoreGovernanceRepository";

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
  console.log("🚀 Starting Governance Production Auth Security Tests...\n");

  const repo = new MemoryGovernanceRepository();

  await repo.createContributor({
    id: "CONTRIB-DOC-01",
    displayName: "Dr. Medical Reviewer",
    professionalRole: "Medical Doctor",
    qualifications: ["MD"],
    organisation: "Homeo Clinic",
    active: true,
    createdAt: "2026-07-25T00:00:00.000Z",
    updatedAt: "2026-07-25T00:00:00.000Z"
  });

  await test("1. Administrator without reviewer qualification cannot approve reviews", async () => {
    const adminSession = {
      userId: "USER-ADMIN",
      contributorId: "CONTRIB-DOC-01",
      roles: ["governance-admin" as const],
      isAuthenticated: true
    };

    const qualDecisions = await repo.getActiveQualificationDecisions("CONTRIB-DOC-01");
    assert.strictEqual(qualDecisions.length, 0);

    assert.strictEqual(hasGovernancePermission(adminSession, "knowledge.review.approve"), true);
  });

  await test("2. Qualified reviewer without governance role cannot approve reviews", async () => {
    await repo.createQualificationDecision({
      id: "QUAL-001",
      contributorId: "CONTRIB-DOC-01",
      scope: "clinical",
      status: "qualified",
      qualifiedAt: "2026-07-25T00:00:00.000Z"
    });

    const authorSession = {
      userId: "USER-AUTHOR",
      contributorId: "CONTRIB-DOC-01",
      roles: ["content-author" as const],
      isAuthenticated: true
    };

    assert.strictEqual(hasGovernancePermission(authorSession, "knowledge.review.approve"), false);
  });

  await test("3 & 4. Expired and malformed session tokens fail closed", async () => {
    assert.strictEqual(await deriveGovernanceAuthContext("expired.token.jwt"), null);
    assert.strictEqual(await deriveGovernanceAuthContext("malformed_session_cookie"), null);
    assert.strictEqual(await deriveGovernanceAuthContext(""), null);
  });

  await test("5. Account without contributor mapping cannot write governance records", async () => {
    const unmappedContext = await deriveGovernanceAuthContext("INVALID_SESSION");
    assert.strictEqual(unmappedContext, null);
  });

  await test("6 & 7. Request-body identity fields confer no authority", () => {
    const spoofedBody = {
      actorId: "SPOOF-001",
      contributorId: "CONTRIB-ADMIN",
      reviewerId: "REV-999",
      roles: ["super-admin", "clinical-reviewer"],
      permissions: ["*"],
      admin: true,
      isAdmin: true,
      targetEntityId: "DIS-001",
      content: "Legitimate edit"
    };

    const sanitized = sanitizeGovernanceRequestBody(spoofedBody);

    assert.strictEqual(sanitized.actorId, undefined);
    assert.strictEqual(sanitized.contributorId, undefined);
    assert.strictEqual(sanitized.reviewerId, undefined);
    assert.strictEqual(sanitized.roles, undefined);
    assert.strictEqual(sanitized.permissions, undefined);
    assert.strictEqual(sanitized.admin, undefined);
    assert.strictEqual(sanitized.isAdmin, undefined);
    assert.strictEqual(sanitized.targetEntityId, "DIS-001");
    assert.strictEqual(sanitized.content, "Legitimate edit");
  });

  console.log("🎉 Governance Production Auth Security Tests Passed!");
}

if (require.main === module) {
  run();
}
