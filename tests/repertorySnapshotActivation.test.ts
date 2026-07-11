import assert from 'assert';
import { SnapshotPipeline } from '../src/features/repertory/import-export/snapshotPipeline';
import { PublishedCorpusRepository } from '../src/features/repertory/repositories/PublishedCorpusRepository';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  console.log("🚀 Running Snapshot Activation & Rollback Tests...");
  let passed = 0;

  const versionA = "v_test_active_a";
  const versionB = "v_test_active_b";

  const dirA = path.join(process.cwd(), 'data', 'repertory', 'published', versionA);
  const dirB = path.join(process.cwd(), 'data', 'repertory', 'published', versionB);
  if (fs.existsSync(dirA)) fs.rmSync(dirA, { recursive: true, force: true });
  if (fs.existsSync(dirB)) fs.rmSync(dirB, { recursive: true, force: true });

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

  // Cleanup
  await PublishedCorpusRepository.setActiveVersion(initialPointer);
  fs.rmSync(dirA, { recursive: true, force: true });
  fs.rmSync(dirB, { recursive: true, force: true });

  console.log(`✅ Snapshot Activation & Rollback Tests Passed: ${passed}/4`);
}

run().catch(err => {
  console.error("Activation & Rollback Test Failed:", err);
  process.exit(1);
});
