/**
 * Phase 2.2D Audit Chain Concurrency Test Suite (Memory & Firestore Emulator Transaction Contention)
 */

import assert from "node:assert/strict";
import { MemoryGovernanceRepository, FirestoreGovernanceRepository } from "../src/features/knowledge/governance/repositories/FirestoreGovernanceRepository";
import { GovernanceAuditEvent } from "../src/features/knowledge/governance/types/governanceTypes";

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
  console.log("🚀 Starting Governance Audit Chain Concurrency & Transaction Contention Tests...\n");

  await test("1. Memory Repository: Multiple audit events produce a strict linear sequence with no gaps or forks", async () => {
    const repo = new MemoryGovernanceRepository();
    const entityId = "DIS-CONCURRENCY-01";

    await repo.appendAuditEvent({
      id: "AUD-01",
      entityId,
      action: "draft_created",
      actorId: "CONTRIB-001",
      role: "content-author",
      eventHash: "HASH-STEP-1",
      createdAt: "2026-07-25T00:00:00.000Z"
    });

    await repo.appendAuditEvent({
      id: "AUD-02",
      entityId,
      action: "clinical_review_submitted",
      actorId: "CONTRIB-002",
      role: "clinical-reviewer",
      eventHash: "HASH-STEP-2",
      createdAt: "2026-07-25T01:00:00.000Z"
    });

    await repo.appendAuditEvent({
      id: "AUD-03",
      entityId,
      action: "evidence_profile_created",
      actorId: "CONTRIB-003",
      role: "evidence-reviewer",
      eventHash: "HASH-STEP-3",
      createdAt: "2026-07-25T02:00:00.000Z"
    });

    const auditChain = await repo.listAuditEvents(entityId);

    assert.strictEqual(auditChain.length, 3);
    assert.strictEqual(auditChain[0].sequenceNumber, 1);
    assert.strictEqual(auditChain[0].previousEventHash, "GENESIS");
    assert.strictEqual(auditChain[0].eventHash, "HASH-STEP-1");

    assert.strictEqual(auditChain[1].sequenceNumber, 2);
    assert.strictEqual(auditChain[1].previousEventHash, "HASH-STEP-1");
    assert.strictEqual(auditChain[1].eventHash, "HASH-STEP-2");

    assert.strictEqual(auditChain[2].sequenceNumber, 3);
    assert.strictEqual(auditChain[2].previousEventHash, "HASH-STEP-2");
    assert.strictEqual(auditChain[2].eventHash, "HASH-STEP-3");
  });

  await test("2. Memory Repository: Independent entity-scoped audit chain heads do not interfere", async () => {
    const repo = new MemoryGovernanceRepository();
    const entityA = "DIS-ENTITY-A";
    const entityB = "REM-ENTITY-B";

    await repo.appendAuditEvent({
      id: "AUD-A1",
      entityId: entityA,
      action: "draft_created",
      actorId: "CONTRIB-001",
      eventHash: "HASH-A1",
      createdAt: "2026-07-25T00:00:00.000Z"
    });

    await repo.appendAuditEvent({
      id: "AUD-B1",
      entityId: entityB,
      action: "draft_created",
      actorId: "CONTRIB-001",
      eventHash: "HASH-B1",
      createdAt: "2026-07-25T00:00:00.000Z"
    });

    const chainA = await repo.listAuditEvents(entityA);
    const chainB = await repo.listAuditEvents(entityB);

    assert.strictEqual(chainA.length, 1);
    assert.strictEqual(chainA[0].sequenceNumber, 1);
    assert.strictEqual(chainB.length, 1);
    assert.strictEqual(chainB[0].sequenceNumber, 1);
  });

  // 3. Firestore Transaction Contention & Concurrency test under Emulator
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    await test("3. Firestore Emulator: Concurrent transactions produce contiguous sequence numbers and no chain forks", async () => {
      console.log("ℹ️ Executing Firestore transaction contention test against emulator...");
      const firestoreRepo = new FirestoreGovernanceRepository();
      const entityId = `DIS-TX-CONCURRENCY-${Date.now()}`;
      const NUM_CONCURRENT_EVENTS = 5;

      const eventPromises = Array.from({ length: NUM_CONCURRENT_EVENTS }, (_, i) => {
        return firestoreRepo.appendAuditEvent({
          id: `AUD-TX-${entityId}-${i + 1}`,
          entityId,
          action: `action_${i + 1}`,
          actorId: `CONTRIB-00${(i % 3) + 1}`,
          eventHash: `HASH-TX-${entityId}-${i + 1}`,
          createdAt: new Date(Date.now() + i * 100).toISOString()
        });
      });

      await Promise.all(eventPromises);

      const chain = await firestoreRepo.listAuditEvents(entityId);
      assert.strictEqual(chain.length, NUM_CONCURRENT_EVENTS, `All ${NUM_CONCURRENT_EVENTS} audit events must be persisted`);

      // Verify strict contiguity: sequence numbers 1..N
      const seqNumbers = chain.map(e => e.sequenceNumber).sort((a, b) => (a || 0) - (b || 0));
      for (let i = 0; i < NUM_CONCURRENT_EVENTS; i++) {
        assert.strictEqual(seqNumbers[i], i + 1, `Sequence numbers must be strictly contiguous 1..${NUM_CONCURRENT_EVENTS}`);
      }

      // Verify no duplicate IDs or forked previousEventHash
      const ids = new Set(chain.map(e => e.id));
      assert.strictEqual(ids.size, NUM_CONCURRENT_EVENTS, "All event IDs must be unique");

      // Sort chain by sequenceNumber to check linkage
      chain.sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
      assert.strictEqual(chain[0].previousEventHash, "GENESIS");
      for (let i = 1; i < NUM_CONCURRENT_EVENTS; i++) {
        assert.strictEqual(
          chain[i].previousEventHash,
          chain[i - 1].eventHash,
          `Event ${i + 1} previousEventHash must match Event ${i} eventHash`
        );
      }
      console.log("✅ TEST PASSED: Firestore transaction contention produced contiguous chain without forks");
    });
  } else {
    console.log("ℹ️ Skipping live Firestore Emulator transaction contention test (FIRESTORE_EMULATOR_HOST not set).");
  }

  console.log("🎉 Governance Audit Concurrency & Transaction Contention Tests Passed!");
}

if (require.main === module) {
  run();
}
