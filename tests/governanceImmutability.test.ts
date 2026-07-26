/**
 * Phase 2.2C Governance Immutability Test Suite
 */

import assert from "node:assert/strict";
import { MemoryGovernanceRepository } from "../src/features/knowledge/governance/repositories/FirestoreGovernanceRepository";
import { ReviewerQualificationDecision } from "../src/features/knowledge/governance/repositories/GovernanceRepository";
import { ClinicalReviewRecord, GovernanceAuditEvent } from "../src/features/knowledge/governance/types/governanceTypes";

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
  console.log("🚀 Starting Governance Immutability & Conflict Policy Tests...\n");

  await test("1. ClinicalReviewRecord: insert succeeds, duplicate identical succeeds, duplicate modified fails", async () => {
    const repo = new MemoryGovernanceRepository();
    const review: ClinicalReviewRecord & { entityId: string } = {
      id: "REV-TEST-001",
      entityId: "DIS-001",
      reviewerId: "CONTRIB-001",
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: "REV-001-v1",
      reviewedAt: "2026-07-25T00:00:00.000Z",
      declarationOfIndependence: true,
      notes: "Initial clinical review"
    };

    await repo.createClinicalReview(review);
    const reviews = await repo.listClinicalReviews("DIS-001");
    assert.strictEqual(reviews.length, 1);
    assert.strictEqual(reviews[0].decision, "approved");

    await repo.createClinicalReview({ ...review });

    const modifiedReview = { ...review, decision: "rejected" as const, notes: "Altered decision" };
    await assert.rejects(async () => {
      await repo.createClinicalReview(modifiedReview);
    }, /RECORD_IMMUTABLE_CONFLICT/);
  });

  await test("2. Review correction creates a superseding record while original remains readable", async () => {
    const repo = new MemoryGovernanceRepository();
    const originalReview: ClinicalReviewRecord & { entityId: string } = {
      id: "REV-ORIGINAL-001",
      entityId: "DIS-002",
      reviewerId: "CONTRIB-001",
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: "REV-001-v1",
      reviewedAt: "2026-07-25T00:00:00.000Z",
      declarationOfIndependence: true,
      notes: "Original review with typo"
    };

    await repo.createClinicalReview(originalReview);

    const supersedingReview: ClinicalReviewRecord & { entityId: string; supersedesReviewId?: string; correctionReason?: string } = {
      id: "REV-SUPERSEDING-002",
      entityId: "DIS-002",
      reviewerId: "CONTRIB-001",
      reviewType: "clinical",
      decision: "approved",
      reviewedVersion: "REV-001-v1",
      reviewedAt: "2026-07-25T01:00:00.000Z",
      declarationOfIndependence: true,
      notes: "Corrected review wording",
      supersedesReviewId: "REV-ORIGINAL-001",
      correctionReason: "Typo correction in notes"
    };

    await repo.createClinicalReview(supersedingReview);

    const allReviews = await repo.listClinicalReviews("DIS-002");
    assert.strictEqual(allReviews.length, 2);

    const original = allReviews.find(r => r.id === "REV-ORIGINAL-001");
    const superseding = allReviews.find(r => r.id === "REV-SUPERSEDING-002");

    assert.ok(original);
    assert.strictEqual(original?.notes, "Original review with typo");

    assert.ok(superseding);
    assert.strictEqual((superseding as any).supersedesReviewId, "REV-ORIGINAL-001");
    assert.strictEqual((superseding as any).correctionReason, "Typo correction in notes");
  });

  await test("3. ReviewerQualificationDecision: duplicate modified fails with RECORD_IMMUTABLE_CONFLICT", async () => {
    const repo = new MemoryGovernanceRepository();
    const qual: ReviewerQualificationDecision = {
      id: "QUAL-001",
      contributorId: "CONTRIB-001",
      scope: "clinical",
      status: "qualified",
      qualifiedAt: "2026-07-25T00:00:00.000Z",
      expiresAt: "2028-07-25T00:00:00.000Z"
    };

    await repo.createQualificationDecision(qual);
    await repo.createQualificationDecision({ ...qual });

    const modifiedQual: ReviewerQualificationDecision = { ...qual, status: "suspended" };
    await assert.rejects(async () => {
      await repo.createQualificationDecision(modifiedQual);
    }, /RECORD_IMMUTABLE_CONFLICT/);
  });

  await test("4. GovernanceAuditEvent: linear sequence and immutability check", async () => {
    const repo = new MemoryGovernanceRepository();
    const event1: GovernanceAuditEvent = {
      id: "AUD-001",
      entityId: "DIS-001",
      action: "clinical_review_submitted",
      actorId: "CONTRIB-001",
      role: "clinical-reviewer",
      sequenceNumber: 1,
      eventHash: "HASH-1",
      previousEventHash: "GENESIS",
      createdAt: "2026-07-25T00:00:00.000Z"
    };

    await repo.appendAuditEvent(event1);

    const events = await repo.listAuditEvents("DIS-001");
    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0].sequenceNumber, 1);
    assert.strictEqual(events[0].previousEventHash, "GENESIS");

    const modifiedEvent = { ...event1, actorId: "CONTRIB-TAMPERED" };
    await assert.rejects(async () => {
      await repo.appendAuditEvent(modifiedEvent);
    }, /RECORD_IMMUTABLE_CONFLICT/);
  });

  console.log("🎉 Governance Immutability Tests Passed!");
}

if (require.main === module) {
  run();
}
