import assert from 'assert';
import { SnapshotPipeline } from '../src/features/repertory/import-export/snapshotPipeline';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  console.log("🚀 Running Repertory Sharding Tests...");
  let passed = 0;

  const version1 = "v_test_shard_1";
  const version2 = "v_test_shard_2";

  // Clean directories
  const dir1 = path.join(process.cwd(), 'data', 'repertory', 'published', version1);
  const dir2 = path.join(process.cwd(), 'data', 'repertory', 'published', version2);
  if (fs.existsSync(dir1)) fs.rmSync(dir1, { recursive: true, force: true });
  if (fs.existsSync(dir2)) fs.rmSync(dir2, { recursive: true, force: true });

  // 1. Compile Boericke twice
  const manifest1 = await SnapshotPipeline.buildSnapshot({
    version: version1,
    actorUid: "test-admin",
    actorRole: "super-admin",
    reason: "sharding test",
    sourceIds: ["boericke_1927"]
  });

  const manifest2 = await SnapshotPipeline.buildSnapshot({
    version: version2,
    actorUid: "test-admin",
    actorRole: "super-admin",
    reason: "sharding test",
    sourceIds: ["boericke_1927"]
  });

  // 2. Verify deterministic hashes
  for (const [relPath, checksum] of Object.entries(manifest1.artifactChecksums)) {
    assert.strictEqual(manifest2.artifactChecksums[relPath], checksum, `Checksum of ${relPath} must be deterministic.`);
  }
  passed++;

  // 3. Verify safe chapter ID generation
  const chaptersFile = path.join(dir1, 'sources', 'boericke_1927', 'chapters.json');
  const chapters = JSON.parse(fs.readFileSync(chaptersFile, 'utf-8'));
  assert.ok(chapters.length > 0);
  chapters.forEach((c: any) => {
    assert.ok(c.safeChapterId.length <= 20, "safeChapterId must be under 20 chars.");
    assert.ok(/^[a-f0-9]+$/.test(c.safeChapterId), "safeChapterId must be a hex string.");
    c.shards.forEach((s: any) => {
      assert.ok(fs.existsSync(path.join(dir1, s.path)), `Chapter shard file must exist: ${s.path}`);
    });
  });
  passed++;

  // 4. Verify rubric location shards
  const locationsDir = path.join(dir1, 'locations');
  const locationFiles = fs.readdirSync(locationsDir);
  assert.strictEqual(locationFiles.length, 64, "Must generate exactly 64 location shards.");
  
  // Verify every location file parses and contains mapped rubrics
  let sampleCount = 0;
  locationFiles.forEach(f => {
    const content = JSON.parse(fs.readFileSync(path.join(locationsDir, f), 'utf-8'));
    for (const [rId, loc] of Object.entries(content) as [string, any][]) {
      assert.strictEqual(loc.sourceId, "boericke_1927");
      assert.ok(loc.safeChapterId);
      assert.ok(loc.shardId);
      sampleCount++;
    }
  });
  assert.strictEqual(sampleCount, manifest1.totalRubrics, "All rubrics must be indexed in location shards.");
  passed++;

  // Cleanup
  fs.rmSync(dir1, { recursive: true, force: true });
  fs.rmSync(dir2, { recursive: true, force: true });

  console.log(`✅ Repertory Sharding Tests Passed: ${passed}/3`);
}

run().catch(err => {
  console.error("Sharding Test Failed:", err);
  process.exit(1);
});
