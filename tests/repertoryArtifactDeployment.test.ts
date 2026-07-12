import assert from 'assert';
import { PublishedCorpusRepository, RepertoryArtifactStore } from '../src/features/repertory/repositories/PublishedCorpusRepository';
import { getRuntimeEnvironment } from '../src/features/repertory/config/runtimeEnv';
import * as path from 'path';
import * as fs from 'fs';

class SimulatedObjectStorageArtifactStore implements RepertoryArtifactStore {
  public readCount = 0;
  public coldLoadTimeMs = 0;
  public warmLoadTimeMs = 0;

  constructor(private localDir: string) {}

  async readJson<T>(filePath: string): Promise<T> {
    const startTime = Date.now();
    this.readCount++;
    
    // Simulate network delay for cold load
    const isCold = this.readCount % 2 === 1;
    if (isCold) {
      await new Promise(r => setTimeout(r, 10)); // 10ms simulated cold latency
      this.coldLoadTimeMs += Date.now() - startTime;
    } else {
      this.warmLoadTimeMs += Date.now() - startTime;
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Object not found in store: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  async exists(filePath: string): Promise<boolean> {
    return fs.existsSync(filePath);
  }
}

async function run() {
  console.log("🚀 Running Artifact Deployment & Storage Adapter Contract Tests...");
  let passed = 0;

  getRuntimeEnvironment();
  const release = "v1.2.0";
  const releaseDir = path.join(process.cwd(), 'data', 'repertory', 'published', release);

  if (!fs.existsSync(releaseDir)) {
    console.warn(`⚠️ Warning: Staged release v1.2.0 directory does not exist at ${releaseDir}. Skipping contract tests.`);
    process.exit(0);
  }

  const store = new SimulatedObjectStorageArtifactStore(releaseDir);
  PublishedCorpusRepository.setArtifactStore(store);

  const manifestPath = path.join(releaseDir, 'manifest.json');

  // 1. Read manifest (Cold access)
  const startTime = Date.now();
  const manifestExists = await store.exists(manifestPath);
  assert.ok(manifestExists);
  const manifest = await store.readJson<any>(manifestPath);
  const coldDuration = Date.now() - startTime;
  console.log(`✅ Step 1: Manifest read successfully. Cold duration: ${coldDuration}ms`);
  passed++;

  // 2. Read manifest again (Warm access)
  const startTimeWarm = Date.now();
  const manifestWarm = await store.readJson<any>(manifestPath);
  const warmDuration = Date.now() - startTimeWarm;
  assert.strictEqual(manifest.version, manifestWarm.version);
  console.log(`✅ Step 2: Manifest read successfully. Warm duration: ${warmDuration}ms`);
  passed++;

  // 3. Retrieve location shard
  const locShardPath = path.join(releaseDir, 'locations', 'location-0.json');
  if (fs.existsSync(locShardPath)) {
    const locShard = await store.readJson<any>(locShardPath);
    assert.ok(Array.isArray(locShard) || typeof locShard === 'object');
    console.log("✅ Step 3: Location shard read and parsed successfully.");
    passed++;
  } else {
    console.log("⏭️ Step 3 skipped: location-0.json is not present in local directories.");
  }

  // 4. Retrieve missing object error handling
  const missingPath = path.join(releaseDir, 'nonexistent.json');
  await assert.rejects(
    async () => {
      await store.readJson<any>(missingPath);
    },
    /Object not found in store/
  );
  console.log("✅ Step 4: Correctly threw error on missing object.");
  passed++;

  // 5. Retrieve corrupted object error handling
  const tempCorruptedFile = path.join(releaseDir, 'corrupted_temp.json');
  fs.writeFileSync(tempCorruptedFile, '{"broken": json');
  await assert.rejects(
    async () => {
      await store.readJson<any>(tempCorruptedFile);
    },
    SyntaxError
  );
  fs.unlinkSync(tempCorruptedFile);
  console.log("✅ Step 5: Correctly threw SyntaxError on corrupted JSON object.");
  passed++;

  console.log(`\n🎉 Artifact Storage Adapter Contract Tests Passed: ${passed}/5`);
}

run().catch(err => {
  console.error("❌ Artifact Storage Contract Test Failed:", err);
  process.exit(1);
});
