import assert from 'assert';
import { PublishedCorpusRepository } from '../src/features/repertory/repositories/PublishedCorpusRepository';
import { SnapshotPipeline } from '../src/features/repertory/import-export/snapshotPipeline';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  console.log("🚀 Running Repertory Cache Tests...");
  let passed = 0;

  // Clean / build a test snapshot to load
  const version = "v_test_cache";
  const dir = path.join(process.cwd(), 'data', 'repertory', 'published', version);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });

  await SnapshotPipeline.buildSnapshot({
    version,
    actorUid: "test-admin",
    actorRole: "super-admin",
    reason: "cache testing",
    sourceIds: ["boericke_1927"]
  });

  // Set active version
  await PublishedCorpusRepository.setActiveVersion(version);
  PublishedCorpusRepository.invalidateCache();

  // Test 1: Cache Miss on first lookup, Cache Hit on second lookup
  const initialStats = PublishedCorpusRepository.getCacheStats();
  const r1 = await PublishedCorpusRepository.getRubricById("boer_mind_nervous_system_0");
  assert.ok(r1, "Rubric should be retrieved.");

  const midStats = PublishedCorpusRepository.getCacheStats();
  assert.ok(midStats.missCount > initialStats.missCount, "Should register cache miss on initial load.");

  const r2 = await PublishedCorpusRepository.getRubricById("boer_mind_nervous_system_0");
  assert.ok(r2);

  const finalStats = PublishedCorpusRepository.getCacheStats();
  assert.ok(finalStats.hitCount > midStats.hitCount, "Should register cache hit on subsequent lookup.");
  passed++;

  // Test 2: In-flight load coalescing (concurrency check)
  const p1 = PublishedCorpusRepository.getRubricById("boer_mind_nervous_system_1");
  const p2 = PublishedCorpusRepository.getRubricById("boer_mind_nervous_system_1");
  const [res1, res2] = await Promise.all([p1, p2]);
  assert.ok(res1);
  assert.strictEqual(res1.rubricId, res2?.rubricId);
  passed++;

  // Test 3: Version change invalidates cache
  const statsBefore = PublishedCorpusRepository.getCacheStats();
  assert.ok(statsBefore.chapterCache.size > 0, "Chapter cache should be populated.");
  
  await PublishedCorpusRepository.setActiveVersion("v1.0.0");
  const statsAfter = PublishedCorpusRepository.getCacheStats();
  assert.strictEqual(statsAfter.chapterCache.size, 0, "Chapter cache must be cleared upon active version change.");
  passed++;

  // Cleanup
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`✅ Repertory Cache Tests Passed: ${passed}/3`);
}

run().catch(err => {
  console.error("Cache Test Failed:", err);
  process.exit(1);
});
