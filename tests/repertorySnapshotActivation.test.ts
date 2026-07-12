process.env.NODE_ENV = 'test';
import assert from 'assert';
import { SnapshotPipeline } from '../src/features/repertory/import-export/snapshotPipeline';
import { PublishedCorpusRepository } from '../src/features/repertory/repositories/PublishedCorpusRepository';
import { getRuntimeEnvironment } from '../src/features/repertory/config/runtimeEnv';
import { 
  LocalFileActiveCorpusPointerRepository, 
  FirestoreActiveCorpusPointerRepository 
} from '../src/features/repertory/repositories/ActiveCorpusPointerRepository';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  console.log("🚀 Running Snapshot Activation & Rollback Tests...");
  let passed = 0;

  const versionA = "v_test_active_a";
  const versionB = "v_test_active_b";

  const env = getRuntimeEnvironment();
  const dirA = path.join(env.artifactRoot, 'published', versionA);
  const dirB = path.join(env.artifactRoot, 'published', versionB);
  if (fs.existsSync(dirA)) fs.rmSync(dirA, { recursive: true, force: true });
  if (fs.existsSync(dirB)) fs.rmSync(dirB, { recursive: true, force: true });

  // Reset pointer file to ensure a clean start
  const pointerFile = path.join(env.artifactRoot, 'published', 'active_pointer.json');
  if (fs.existsSync(pointerFile)) fs.unlinkSync(pointerFile);

  // 1. Build staged snapshot A
  const manifestA = await SnapshotPipeline.buildSnapshot({
    version: versionA,
    actorUid: "test-admin",
    actorRole: "super-admin",
    reason: "activation test A",
    sourceIds: ["boericke_1927"]
  });
  assert.strictEqual(manifestA.publicationStatus, "staged", "Should initially be staged, not active.");
  
  const initialPointer = await PublishedCorpusRepository.getActiveVersion();
  assert.notStrictEqual(initialPointer, versionA, "Active pointer should not switch on build.");
  passed++;

  // 2. Atomically activate snapshot A
  await SnapshotPipeline.activateSnapshot(versionA, "test-admin", "super-admin", "activate A");
  const pointerAfterA = await PublishedCorpusRepository.getActiveVersion();
  assert.strictEqual(pointerAfterA, versionA, "Active pointer must swap to A.");
  passed++;

  // 3. Build staged snapshot B
  const manifestB = await SnapshotPipeline.buildSnapshot({
    version: versionB,
    actorUid: "test-admin",
    actorRole: "super-admin",
    reason: "activation test B",
    sourceIds: ["boericke_1927"]
  });
  assert.strictEqual(manifestB.publicationStatus, "staged", "Snapshot B must be built as staged.");
  passed++;

  // 4. Activate snapshot B, and then roll back to A
  await SnapshotPipeline.activateSnapshot(versionB, "test-admin", "super-admin", "activate B");
  const pointerAfterB = await PublishedCorpusRepository.getActiveVersion();
  assert.strictEqual(pointerAfterB, versionB, "Active pointer must swap to B.");

  const rolledBackVersion = await SnapshotPipeline.rollbackSnapshot("test-admin", "super-admin", "rollback to A");
  assert.strictEqual(rolledBackVersion, versionA, "Rollback must return previous version.");
  
  const finalPointer = await PublishedCorpusRepository.getActiveVersion();
  assert.strictEqual(finalPointer, versionA, "Active pointer must return to A.");
  passed++;

  // 5. Multi-instance pointer consistency test using durable storage
  const repoA = process.env.TEST_WITH_FIRESTORE === 'true'
    ? new FirestoreActiveCorpusPointerRepository()
    : new LocalFileActiveCorpusPointerRepository();
  const repoB = process.env.TEST_WITH_FIRESTORE === 'true'
    ? new FirestoreActiveCorpusPointerRepository()
    : new LocalFileActiveCorpusPointerRepository();

  await repoA.activate({
    version: "v1.2.0",
    previousVersion: "v1.1.0",
    contentHash: "hash-test-active",
    actorUid: "test-admin",
    actorRole: "super-admin",
    reason: "multi-instance test",
    transactionId: "tx_123",
    auditLogId: "audit_123"
  });

  const activeB = await repoB.getActive();
  assert.strictEqual(activeB?.activeVersion, "v1.2.0", "Instance B must observe v1.2.0 activated by Instance A.");
  assert.strictEqual(activeB?.contentHash, "hash-test-active", "Instance B must see the correct contentHash.");
  assert.strictEqual(activeB?.status, "active", "Instance B must see status as active.");

  await repoB.rollback({
    version: "v1.1.0",
    previousVersion: "v1.2.0",
    contentHash: "hash-test-prev",
    actorUid: "test-admin",
    actorRole: "super-admin",
    reason: "multi-instance rollback",
    transactionId: "tx_124",
    auditLogId: "audit_124"
  });

  const activeA = await repoA.getActive();
  assert.strictEqual(activeA?.activeVersion, "v1.1.0", "Instance A must observe v1.1.0 rolled back by Instance B.");
  passed++;

  // Cleanup
  await PublishedCorpusRepository.setActiveVersion(initialPointer);
  fs.rmSync(dirA, { recursive: true, force: true });
  fs.rmSync(dirB, { recursive: true, force: true });
  if (fs.existsSync(pointerFile)) fs.unlinkSync(pointerFile);

  console.log(`✅ Snapshot Activation & Rollback Tests Passed: ${passed}/5`);
}

run().catch(err => {
  console.error("Activation & Rollback Test Failed:", err);
  process.exit(1);
});
