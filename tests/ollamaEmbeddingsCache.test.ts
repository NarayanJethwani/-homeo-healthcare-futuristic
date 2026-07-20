process.env.NODE_ENV = "test";

import assert from "assert";
import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import {
  OllamaCorpusEmbeddingCacheService,
  ShardedCacheRecord,
  MAX_GLOBAL_SCAN_FILES
} from "@/features/knowledge/retrieval/ollamaCorpusEmbeddingCacheService";
import {
  CorpusEligibilityRegistry,
  TestCorpusEligibilityRegistry
} from "@/features/knowledge/retrieval/CorpusEligibilityRegistry";
import {
  canonicalJsonStringify,
  truncateUtf8Bytes,
  buildCanonicalEmbeddingText
} from "@/features/knowledge/retrieval/canonicalEmbeddingText";
import child_process from "child_process";
import { MemoryFileSystemAdapter, NodeFileSystemAdapter, FileSystemAdapter } from "@/features/knowledge/retrieval/adapters/FileSystemAdapter";
import { TestRuntimePolicyAdapter } from "@/features/knowledge/retrieval/adapters/RuntimePolicyAdapter";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { ollamaService } from "@/lib/ollama";

async function runUnitTests() {
  console.log("🚀 Starting Governed Ollama Embeddings Cache Unit Test Suite...");
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  const testEntityId = "DIS-UNIT-TEST-01";
  const mockEntity: any = {
    id: testEntityId,
    entityType: "disease",
    publishedVersionId: "1.0.0",
    editorialStatus: "published",
    versionInfo: { version: "1.0.0" },
    title: { en: "Unit Test Article" },
    summary: { en: "Unit Test Summary" },
    content: { overview: "Unit Test Overview" },
    categories: ["cardiology"],
    tags: ["unit-test"]
  };

  await globalKmsRepository.saveEntity(mockEntity, "Unit", "Administrator", "Setup unit test entity");

  // 1. Eligibility Registry Rejection
  await test("1. Eligibility Registry returns NOT_ELIGIBLE for unregistered entities", async () => {
    const testRegistry = new TestCorpusEligibilityRegistry();
    const service = new OllamaCorpusEmbeddingCacheService(
      new MemoryFileSystemAdapter(),
      new TestRuntimePolicyAdapter(),
      testRegistry
    );

    const res = await service.getCorpusEmbedding(testEntityId);
    assert.strictEqual(res.status, "bypass");
    if (res.status === "bypass") {
      assert.strictEqual(res.reasonCode, "NOT_ELIGIBLE");
    }
  });

  // 2. Strict Generation Execution
  await test("2. Registered eligible entity passes eligibility and executes strict generation", async () => {
    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.12345);

    try {
      const res = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res.status, "generated");
      if (res.status === "generated") {
        assert.strictEqual(res.dims, 768);
        assert.strictEqual(res.provider, "ollama");
        assert.strictEqual(res.source, "provider");
        assert.ok(res.vector);
        assert.strictEqual(res.vector.length, 768);
      }
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 3. Multibyte Safe Character Truncation
  await test("3. Code-point-aware UTF-8 truncation prevents multibyte character splitting", async () => {
    const multiByteText = "👨‍👩‍👧‍👦 Homeopathy Knowledge base testing multibyte unicode glyphs ❤️";
    const truncated = truncateUtf8Bytes(multiByteText, 32);
    assert.ok(Buffer.byteLength(truncated, "utf-8") <= 32);
    // Ensure valid string without replacement characters or broken code points
    assert.strictEqual(truncated, Buffer.from(truncated, "utf-8").toString("utf-8"));
  });

  // 4. Deterministic Canonical JSON Serializer
  await test("4. Canonical JSON serializer enforces key sorting, cycle rejection, and finite numbers", async () => {
    const unorganizedObj = {
      z: 1,
      a: "test",
      m: { c: true, b: false }
    };

    const jsonStr = canonicalJsonStringify(unorganizedObj);
    assert.strictEqual(jsonStr, '{"a":"test","m":{"b":false,"c":true},"z":1}');

    const cyclicObj: any = { a: 1 };
    cyclicObj.self = cyclicObj;

    assert.throws(() => canonicalJsonStringify(cyclicObj), /Circular/);
    assert.throws(() => canonicalJsonStringify({ a: NaN }), /Non-finite number/);
  });

  // 5. Strict Ollama Failure Handling
  await test("5. Strict Ollama failure returns PROVIDER_FAILURE without dummy vector fallback", async () => {
    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => {
      throw new Error("Ollama connection refused");
    };

    try {
      const res = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res.status, "bypass");
      if (res.status === "bypass") {
        assert.strictEqual(res.reasonCode, "PROVIDER_FAILURE");
        assert.strictEqual(res.vector, undefined);
      }
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 6. Disabled Cache Environment Execution
  await test("6. Disabled environment validates model descriptor and executes uncached generation with zero disk I/O", async () => {
    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = false; // Disable cache
    runtimeAdapter.cacheDir = "/cache_root";

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.999);

    try {
      const res = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res.status, "generated");
      assert.strictEqual(res.source, "provider");
      assert.strictEqual(memoryFs.existsSync("/cache_root"), false, "No disk directories created when disabled");
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 7. Telemetry Privacy & Overflow Protection
  await test("7. Telemetry records zero source text or entity IDs and saturates without overflow", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter);

    const telemetryBefore = service.getTelemetry();
    assert.strictEqual(telemetryBefore.hits, 0);

    // Simulate maximum telemetry saturation
    (service as any).telemetry.hits = Number.MAX_SAFE_INTEGER;
    (service as any).incrementTelemetry("hits");

    const telemetryAfter = service.getTelemetry();
    assert.strictEqual(telemetryAfter.hits, Number.MAX_SAFE_INTEGER, "Telemetry must saturate at MAX_SAFE_INTEGER");

    // Ensure telemetry object contains ONLY count keys
    const keys = Object.keys(telemetryAfter);
    assert.deepStrictEqual(keys.sort(), ["bypasses", "corruptions", "evictions", "hits", "misses"]);
  });

  // 8. 30-Day TTL Expiration Verification
  await test("8. Cache hit path evicts entries older than 30-day TTL", async () => {
    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    const modelDescriptor = {
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    };

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => modelDescriptor;
    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.777);

    try {
      // 1. Initial Generation
      const firstRes = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(firstRes.status, "generated");

      // Find created entry file in memory FS
      const v1EntriesDir = "/cache_root/v1/entries";
      const shards = memoryFs.readdirSync(v1EntriesDir);
      assert.strictEqual(shards.length, 1);
      const shard = shards[0];
      const files = memoryFs.readdirSync(path.join(v1EntriesDir, shard));
      assert.strictEqual(files.length, 1);

      const entryFilePath = path.join(v1EntriesDir, shard, files[0]);
      const rawRecord = JSON.parse(memoryFs.readFileSync(entryFilePath, "utf-8"));

      // Mutate createdAt timestamp to 31 days in the past
      rawRecord.createdAt = Date.now() - (31 * 24 * 3600 * 1000);
      rawRecord.recordChecksum = (service as any).computeRecordChecksum(rawRecord);
      memoryFs.writeFileSync(entryFilePath, canonicalJsonStringify(rawRecord));

      // 2. Second Call should detect TTL expiry, unlink entry, and execute re-generation
      const secondRes = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(secondRes.status, "generated");
      assert.strictEqual(service.getTelemetry().evictions, 1);
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 9. Corrupt Manifest Quarantine
  await test("9. Corrupt manifest is quarantined to quarantine directory", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter);

    // Inject corrupted manifest snapshot file
    memoryFs.mkdirSync("/cache_root/v1", { recursive: true });
    memoryFs.writeFileSync("/cache_root/v1/manifest.snapshot.json", "{ INVALID JSON STRUCTURE");

    const manifest = (service as any).loadOrCreateManifest("/cache_root");
    assert.strictEqual(manifest.schemaVersion, "1.0.0");
    assert.strictEqual(service.getTelemetry().corruptions, 1);

    const quarantineDir = "/cache_root/v1/quarantine";
    assert.ok(memoryFs.existsSync(quarantineDir));
    const quarantinedFiles = memoryFs.readdirSync(quarantineDir);
    assert.strictEqual(quarantinedFiles.length, 1);
  });

  // 10. Lock Loss During Active Generation
  await test("10. Lock loss during active generation aborts with LOCK_LOST_FAILURE and writes zero files", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    // Make atomicUpdateLock fail (simulate stolen lock lease)
    memoryFs.atomicUpdateLock = () => ({ updated: false, inode: 0 });

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.555);

    try {
      const res = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res.status, "bypass");
      if (res.status === "bypass") {
        assert.strictEqual(res.reasonCode, "LOCK_LOST_FAILURE");
      }
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 11. Lock Loss Post-Provider Completion
  await test("11. Lock loss after provider completion but before rename aborts and unlinks temp file", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    let updateCalls = 0;
    const originalUpdateLock = memoryFs.atomicUpdateLock.bind(memoryFs);
    memoryFs.atomicUpdateLock = (lockPath, ownerToken, inode, payload) => {
      updateCalls++;
      // Fail update on second call (after provider completion)
      if (updateCalls >= 2) {
        return { updated: false, inode: 0 };
      }
      return originalUpdateLock(lockPath, ownerToken, inode, payload);
    };

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.888);

    try {
      const res = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res.status, "bypass");
      if (res.status === "bypass") {
        assert.strictEqual(res.reasonCode, "LOCK_LOST_FAILURE");
      }
      // Verify zero orphan temp files or entries exist
      const entriesDir = "/cache_root/v1/entries";
      if (memoryFs.existsSync(entriesDir)) {
        const shards = memoryFs.readdirSync(entriesDir);
        for (const shard of shards) {
          const files = memoryFs.readdirSync(path.join(entriesDir, shard));
          assert.strictEqual(files.length, 0, "No temp or entry files must remain after lock loss");
        }
      }
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 12. Transactional Rollback on Manifest Save Failure
  await test("12. Manifest-write failure rolls back published entry and leaves zero orphan files", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    // Make writeFileSync fail on manifest.snapshot.json or manifest.tmp
    const originalWriteFileSync = memoryFs.writeFileSync.bind(memoryFs);
    memoryFs.writeFileSync = (filePath, data, options) => {
      if (typeof filePath === "string" && filePath.includes("manifest")) {
        throw new Error("Disk Write I/O Error on Manifest");
      }
      return originalWriteFileSync(filePath, data, options);
    };

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.333);

    try {
      const res = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res.status, "bypass");
      if (res.status === "bypass") {
        assert.strictEqual(res.reasonCode, "PROVIDER_FAILURE");
      }

      // Verify published entry file was unlinked and rolled back
      const entriesDir = "/cache_root/v1/entries";
      if (memoryFs.existsSync(entriesDir)) {
        const shards = memoryFs.readdirSync(entriesDir);
        for (const shard of shards) {
          const files = memoryFs.readdirSync(path.join(entriesDir, shard));
          assert.strictEqual(files.length, 0, "Published entry must be unlinked when manifest write fails");
        }
      }
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 13. Non-Hex Shard Directory Isolation Guard (Memory FS)
  await test("13. Non-hex shard directories are ignored and cannot escape cache root", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    // Inject hostile non-hex shard directory into entries
    memoryFs.mkdirSync("/cache_root/v1/entries/hostile_shard", { recursive: true });
    memoryFs.writeFileSync("/cache_root/v1/entries/hostile_shard/secret.json", '{"sensitive":true}');

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.123);

    try {
      await service.getCorpusEmbedding(testEntityId);
      // Hostile file must remain untouched because non-hex shard is skipped
      assert.ok(memoryFs.existsSync("/cache_root/v1/entries/hostile_shard/secret.json"));
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 14. Bounded File Scanning Protection
  await test("14. Disk scanning is bounded and ignores non-hex / non-64-hex filenames", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const testRegistry = new TestCorpusEligibilityRegistry();
    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    memoryFs.mkdirSync("/cache_root/v1/entries/ab", { recursive: true });
    memoryFs.writeFileSync("/cache_root/v1/entries/ab/not_a_valid_hex_hash.json", '{"foo":"bar"}');

    // Run manifest loading / reconciliation
    const manifest = (service as any).loadOrCreateManifest("/cache_root");
    service.planReconcileAndEvict(manifest, "/cache_root/v1", "/cache_root");

    // Invalid non-64-hex file is ignored and NOT processed as a valid entry
    assert.ok(memoryFs.existsSync("/cache_root/v1/entries/ab/not_a_valid_hex_hash.json"));
  });

  // 15. Actual Symlinked Shard Containment (NodeFileSystemAdapter)
  await test("15. Real symlinked shard directory cannot escape cache root or access outside paths", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_symlink_test_"));
    const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_outside_dir_"));
    fs.writeFileSync(path.join(outsideDir, "secret.json"), '{"secret":true}');

    try {
      const nodeFs = new NodeFileSystemAdapter();
      const runtimeAdapter = new TestRuntimePolicyAdapter();
      runtimeAdapter.enabled = true;
      runtimeAdapter.cacheDir = tempDir;

      const testRegistry = new TestCorpusEligibilityRegistry();
      const service = new OllamaCorpusEmbeddingCacheService(nodeFs, runtimeAdapter, testRegistry);

      const entriesDir = path.join(tempDir, "v1", "entries");
      nodeFs.mkdirSync(entriesDir, { recursive: true });

      // Create a real symlink pointing outside cache root
      const symlinkPath = path.join(entriesDir, "00");
      fs.symlinkSync(outsideDir, symlinkPath);

      const manifest = (service as any).loadOrCreateManifest(tempDir);
      const plan = service.planReconcileAndEvict(manifest, path.join(tempDir, "v1"), tempDir);

      // Verify no outside secret files were added to deletion plan or processed
      assert.strictEqual(plan.deletionPlan.length, 0);
      assert.ok(fs.existsSync(path.join(outsideDir, "secret.json")), "Outside secret file must remain untouched");
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        fs.rmSync(outsideDir, { recursive: true, force: true });
      } catch {}
    }
  });

  // 16. Mismatched Manifest entryPath Rejection
  await test("16. Mismatched, absolute, or traversal manifest entryPath fails validation", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    const modelDescriptor = {
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    };

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => modelDescriptor;
    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.444);

    try {
      // 1. Generate legitimate initial cache record
      const genRes = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(genRes.status, "generated");

      const manifest = (service as any).loadOrCreateManifest("/cache_root");
      const keyHash = Object.keys(manifest.entries)[0];
      assert.ok(keyHash);

      // Mutate manifest entryPath to point to mismatched relative path
      manifest.entries[keyHash].entryPath = "entries/ff/mismatched.json";
      (service as any).saveManifest(manifest, "/cache_root");

      // Fast-path validateCacheEntry must reject hit due to path mismatch
      const entryPath = path.join("/cache_root/v1", "entries", keyHash.substring(0, 2), `${keyHash}.json`);
      const val1 = (service as any).validateCacheEntry(entryPath, keyHash, genRes.contentHash, modelDescriptor, "/cache_root");
      assert.strictEqual(val1.valid, false, "Mismatched relative entryPath must fail validation");

      // Mutate manifest entryPath to point to traversal path
      manifest.entries[keyHash].entryPath = "../../etc/passwd";
      (service as any).saveManifest(manifest, "/cache_root");

      const val2 = (service as any).validateCacheEntry(entryPath, keyHash, genRes.contentHash, modelDescriptor, "/cache_root");
      assert.strictEqual(val2.valid, false, "Traversal entryPath must fail validation");

      // Mutate manifest entryPath to absolute path
      manifest.entries[keyHash].entryPath = "/absolute/secret.json";
      (service as any).saveManifest(manifest, "/cache_root");

      const val3 = (service as any).validateCacheEntry(entryPath, keyHash, genRes.contentHash, modelDescriptor, "/cache_root");
      assert.strictEqual(val3.valid, false, "Absolute entryPath must fail validation");
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 17. Expired Lock Recovery After Process Crash
  await test("17. Crashed process holding an expired lock is safely reclaimed", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    // Create a stale lock owned by a crashed process with expiresAt in the past
    memoryFs.mkdirSync("/cache_root/v1", { recursive: true });
    const lockPayload = JSON.stringify({
      ownerToken: "crashed-process-token-999",
      timestamp: Date.now() - 60000,
      expiresAt: Date.now() - 10000
    });
    memoryFs.atomicAcquireLock("/cache_root/v1/cache.lock", lockPayload);

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.666);

    try {
      const res = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res.status, "generated", "Service must reclaim expired lock and generate embedding");
    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 18. Manifest Failure Preserves Pre-existing Entries
  await test("18. Manifest persistence failure after projected eviction leaves prior entries intact on disk", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter, testRegistry);

    // Create pre-existing valid entry E1 on disk & in manifest
    memoryFs.mkdirSync("/cache_root/v1/entries/aa", { recursive: true });
    const e1Path = "/cache_root/v1/entries/aa/aaaa" + "a".repeat(60) + ".json";
    memoryFs.writeFileSync(e1Path, '{"valid":true}');

    const manifest = (service as any).loadOrCreateManifest("/cache_root");
    manifest.entries["aaaa" + "a".repeat(60)] = {
      entryPath: "entries/aa/aaaa" + "a".repeat(60) + ".json",
      accessedAt: Date.now() - (35 * 24 * 3600 * 1000), // Expired TTL item that would be planned for eviction
      bytes: 14,
      checksum: "dummy"
    };
    (service as any).saveManifest(manifest, "/cache_root");

    // Make saveManifest fail during generation of new entry
    const originalSaveManifest = (service as any).saveManifest.bind(service);
    (service as any).saveManifest = () => {
      throw new Error("Disk Full / Manifest Save Error");
    };

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.222);

    try {
      const res = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res.status, "bypass");

      // Verify prior entry E1 on disk remains 100% intact because deletion plan was not executed
      assert.ok(memoryFs.existsSync(e1Path), "Prior entry file must remain on disk when manifest save fails");
    } finally {
      (service as any).saveManifest = originalSaveManifest;
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
    }
  });

  // 19. Measurable Global File Scan Bound
  await test("19. Disk scanning enforces MAX_GLOBAL_SCAN_FILES bound", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    const service = new OllamaCorpusEmbeddingCacheService(memoryFs, runtimeAdapter);

    const shardDir = "/cache_root/v1/entries/ab";
    memoryFs.mkdirSync(shardDir, { recursive: true });

    // Populate 600 files (exceeding MAX_GLOBAL_SCAN_FILES = 500)
    for (let i = 0; i < 600; i++) {
      const keyHex = i.toString(16).padStart(64, "0");
      memoryFs.writeFileSync(path.join(shardDir, `${keyHex}.json`), '{"dummy":true}');
    }

    const manifest = (service as any).loadOrCreateManifest("/cache_root");
    const plan = service.planReconcileAndEvict(manifest, "/cache_root/v1", "/cache_root");

    // All 600 files were orphan candidates, but scan bound stops at MAX_GLOBAL_SCAN_FILES (500)
    assert.strictEqual(plan.deletionPlan.length, MAX_GLOBAL_SCAN_FILES, `Deletion plan must be capped at ${MAX_GLOBAL_SCAN_FILES}`);
  });

  // 20. Owner Renewal Race Test
  await test("20. Owner renewal after waiter observes expired lease survives and blocks reclamation", async () => {
    const memoryFs = new MemoryFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = "/cache_root";

    memoryFs.mkdirSync("/cache_root/v1", { recursive: true });
    const lockPath = "/cache_root/v1/cache.lock";

    const oldExpiresAt = Date.now() - 5000;
    const initialPayload = JSON.stringify({
      ownerToken: "owner-A-token",
      timestamp: Date.now() - 10000,
      expiresAt: oldExpiresAt
    });

    const acq = memoryFs.atomicAcquireLock(lockPath, initialPayload);
    assert.strictEqual(acq.acquired, true);

    const observedExpiresAt = oldExpiresAt;

    // Owner A renews lease in-place before waiter reclaims
    const newExpiresAt = Date.now() + 30000;
    const renewedPayload = JSON.stringify({
      ownerToken: "owner-A-token",
      timestamp: Date.now(),
      expiresAt: newExpiresAt
    });

    const updateRes = memoryFs.atomicUpdateLock(lockPath, "owner-A-token", acq.inode, renewedPayload);
    assert.strictEqual(updateRes.updated, true, "Owner A in-place renewal must succeed");

    // Waiter attempts atomic reclamation with stale observedExpiresAt
    const reclaimPayload = JSON.stringify({
      ownerToken: "waiter-B-token",
      timestamp: Date.now(),
      expiresAt: Date.now() + 30000
    });

    const reclaimRes = memoryFs.atomicReclaimExpiredLock(
      lockPath,
      "owner-A-token",
      acq.inode,
      observedExpiresAt,
      reclaimPayload
    );

    assert.strictEqual(reclaimRes.acquired, false, "Reclamation must fail when owner has renewed lease");

    // Verify lock on disk still belongs to Owner A with newExpiresAt
    const onDiskContent = memoryFs.readFileSync(lockPath, "utf-8");
    const parsedDisk = JSON.parse(onDiskContent);
    assert.strictEqual(parsedDisk.ownerToken, "owner-A-token");
    assert.strictEqual(parsedDisk.expiresAt, newExpiresAt);
  });

  // 21. Real Child Process Crash Recovery
  await test("21. Real child process exits without releasing lock, followed by safe parent reclamation", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_child_crash_test_"));
    try {
      const nodeFs = new NodeFileSystemAdapter();
      const runtimeAdapter = new TestRuntimePolicyAdapter();
      runtimeAdapter.enabled = true;
      runtimeAdapter.cacheDir = tempDir;

      const testRegistry = new TestCorpusEligibilityRegistry();
      testRegistry.registerTestEntry({
        entityId: testEntityId,
        entityType: "disease",
        publishedVersionId: "1.0.0",
        dataClassification: "non-phi",
        provenance: "KMS_REPOSITORY"
      });

      const lockPath = path.join(tempDir, "v1", "cache.lock");
      nodeFs.mkdirSync(path.join(tempDir, "v1"), { recursive: true });

      const childCode = `
        const fs = require('fs');
        const lockPath = ${JSON.stringify(lockPath)};
        const payload = JSON.stringify({
          ownerToken: 'child-crashed-owner',
          timestamp: Date.now(),
          expiresAt: Date.now() + 100
        });
        const fd = fs.openSync(lockPath, 'wx', 0o600);
        fs.writeFileSync(fd, payload, 'utf-8');
        fs.fsyncSync(fd);
        fs.closeSync(fd);
        process.exit(0);
      `;

      const childRes = child_process.spawnSync(process.execPath, ["-e", childCode]);
      assert.strictEqual(childRes.status, 0, "Child process must exit cleanly");
      assert.ok(fs.existsSync(lockPath), "Lock file created by child must exist on disk");

      // Wait 150ms for lock to expire
      await new Promise(r => setTimeout(r, 150));

      const service = new OllamaCorpusEmbeddingCacheService(nodeFs, runtimeAdapter, testRegistry);

      const originalGetModelDescriptor = ollamaService.getModelDescriptor;
      const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

      ollamaService.getModelDescriptor = async () => ({
        modelName: "nomic-embed-text",
        modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
        expectedDimensions: 768,
        normalizationEnum: "L2_NORM_V1" as const
      });

      ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.111);

      try {
        const res = await service.getCorpusEmbedding(testEntityId);
        assert.strictEqual(res.status, "generated", "Parent must reclaim expired child lock and generate embedding");
      } finally {
        ollamaService.getModelDescriptor = originalGetModelDescriptor;
        ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
      }
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  });

  // 22. Adapter Spy Proves Bounded Directory Enumeration
  await test("22. Adapter spy proves readdirBoundedSync enumerates no more than 500 entries from disk", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_bounded_spy_test_"));
    try {
      const realNodeFs = new NodeFileSystemAdapter();
      const shardDir = path.join(tempDir, "v1", "entries", "00");
      realNodeFs.mkdirSync(shardDir, { recursive: true });

      // Create 1,000 files in shard 00
      for (let i = 0; i < 1000; i++) {
        const hexName = i.toString(16).padStart(64, "0") + ".json";
        fs.writeFileSync(path.join(shardDir, hexName), '{"dummy":true}');
      }

      class SpyNodeFileSystemAdapter extends NodeFileSystemAdapter {
        totalEntriesEnumerated = 0;
        maxBatchRequested = 0;
        readdirBoundedSync(dirPath: string, maxEntries: number): string[] {
          this.maxBatchRequested = Math.max(this.maxBatchRequested, maxEntries);
          const results = super.readdirBoundedSync(dirPath, maxEntries);
          this.totalEntriesEnumerated += results.length;
          return results;
        }
      }

      const spyAdapter = new SpyNodeFileSystemAdapter();

      const runtimeAdapter = new TestRuntimePolicyAdapter();
      runtimeAdapter.enabled = true;
      runtimeAdapter.cacheDir = tempDir;

      const service = new OllamaCorpusEmbeddingCacheService(spyAdapter, runtimeAdapter);
      const manifest = (service as any).loadOrCreateManifest(tempDir);
      const plan = service.planReconcileAndEvict(manifest, path.join(tempDir, "v1"), tempDir);

      assert.strictEqual(plan.deletionPlan.length, MAX_GLOBAL_SCAN_FILES);
      assert.ok(spyAdapter.totalEntriesEnumerated <= MAX_GLOBAL_SCAN_FILES + 1, `Total enumerated entries (${spyAdapter.totalEntriesEnumerated}) must not exceed MAX_GLOBAL_SCAN_FILES (500)`);
      assert.ok(spyAdapter.maxBatchRequested <= MAX_GLOBAL_SCAN_FILES, "No readdirBoundedSync call requested > 500 entries");
    } finally {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  });

  // 23. Deterministic Concurrency Test with Barriers
  await test("23. Renewal vs Reclaim and Release vs Reclaim deterministic interleaving races", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_concurrency_race_test_"));
    const lockPath = path.join(tempDir, "v1", "cache.lock");
    fs.mkdirSync(path.join(tempDir, "v1"), { recursive: true });

    const nodeFs = new NodeFileSystemAdapter();

    // --- CASE 1: RENEWAL vs RECLAIM ---
    const oldExpiresAt = Date.now() - 5000;
    const initialPayload = JSON.stringify({
      ownerToken: "owner-A",
      timestamp: Date.now() - 10000,
      expiresAt: oldExpiresAt
    });
    const acq = nodeFs.atomicAcquireLock(lockPath, initialPayload);
    assert.ok(acq.acquired);

    class InterleavingFsAdapter extends NodeFileSystemAdapter {
      beforeWriteHook = () => {};

      atomicUpdateLock(pathStr: string, token: string, expectedIno: number, newContent: string) {
        if (!fs.existsSync(pathStr)) return { updated: false, inode: 0 };
        const currentStat = fs.lstatSync(pathStr);
        if (expectedIno > 0 && currentStat.ino !== expectedIno) return { updated: false, inode: 0 };

        const fd = fs.openSync(pathStr, "r+", 0o600);
        try {
          const fdStat = fs.fstatSync(fd);
          const content = fs.readFileSync(fd, "utf-8");
          const parsed = JSON.parse(content);
          if (!parsed || parsed.ownerToken !== token) return { updated: false, inode: 0 };

          // YIELD to simulate Reclaim running concurrently right before write
          this.beforeWriteHook();

          fs.ftruncateSync(fd, 0);
          fs.writeSync(fd, newContent, 0, "utf-8");
          fs.fsyncSync(fd);

          const postStat = fs.lstatSync(pathStr);
          if (postStat.ino !== fdStat.ino) return { updated: false, inode: 0 };

          const finalStat = fs.fstatSync(fd);
          return { updated: true, inode: finalStat.ino };
        } catch {
          return { updated: false, inode: 0 };
        } finally {
          fs.closeSync(fd);
        }
      }
    }

    const testAdapter = new InterleavingFsAdapter();

    let reclaimResult: any = null;
    testAdapter.beforeWriteHook = () => {
      reclaimResult = testAdapter.atomicReclaimExpiredLock(
        lockPath,
        "owner-A",
        acq.inode,
        oldExpiresAt,
        JSON.stringify({
          ownerToken: "reclaimer-B",
          timestamp: Date.now(),
          expiresAt: Date.now() + 30000
        })
      );
    };

    const renewalPayload = JSON.stringify({
      ownerToken: "owner-A",
      timestamp: Date.now(),
      expiresAt: Date.now() + 30000
    });
    const renewalResult = testAdapter.atomicUpdateLock(lockPath, "owner-A", acq.inode, renewalPayload);

    assert.strictEqual(reclaimResult.acquired, true, "Reclaim must successfully acquire lock via rename");
    assert.strictEqual(renewalResult.updated, false, "Renewal must fail because lock was isolated/renamed");

    const finalContent = fs.readFileSync(lockPath, "utf-8");
    const parsedFinal = JSON.parse(finalContent);
    assert.strictEqual(parsedFinal.ownerToken, "reclaimer-B");

    fs.unlinkSync(lockPath);

    // --- CASE 2: RELEASE vs RECLAIM ---
    const acq2 = testAdapter.atomicAcquireLock(lockPath, initialPayload);
    assert.ok(acq2.acquired);

    // Release and reclaim compete. Only one renameSync can succeed.
    const releaseRes = testAdapter.atomicReleaseLock(lockPath, "owner-A", acq2.inode);
    assert.strictEqual(releaseRes, true, "Release wins rename race and succeeds");

    const reclaimRes2 = testAdapter.atomicReclaimExpiredLock(
      lockPath,
      "owner-A",
      acq2.inode,
      oldExpiresAt,
      JSON.stringify({
        ownerToken: "reclaimer-B",
        timestamp: Date.now(),
        expiresAt: Date.now() + 30000
      })
    );
    assert.strictEqual(reclaimRes2.acquired, false, "Reclaim fails because lock was already released/renamed");
    assert.strictEqual(fs.existsSync(lockPath), false, "Lock must be released and not exist");

    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  // 24. Exclusive Marker Vacancy Protection Test
  await test("24. Exclusive marker prevents third-party acquisition during validation vacancy", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_vacancy_test_"));
    const lockPath = path.join(tempDir, "v1", "cache.lock");
    fs.mkdirSync(path.join(tempDir, "v1"), { recursive: true });

    const nodeFs = new NodeFileSystemAdapter();

    // 1. Exclusively acquire lock with expired lease
    const oldExpiresAt = Date.now() - 5000;
    const initialPayload = JSON.stringify({
      ownerToken: "owner-A",
      timestamp: Date.now() - 10000,
      expiresAt: oldExpiresAt
    });
    const acq = nodeFs.atomicAcquireLock(lockPath, initialPayload);
    assert.ok(acq.acquired);

    // Let's intercept validation to pause before validation/restoration
    // and try to acquire it from a third owner
    class VacancyInterceptFsAdapter extends NodeFileSystemAdapter {
      beforeValidationHook = () => {};

      atomicReclaimExpiredLock(pathStr: string, token: string, expectedIno: number, expectedExp: number, newContent: string) {
        if (!fs.existsSync(pathStr)) return { acquired: false, inode: 0 };
        const tombstonePath = pathStr + ".tombstone." + crypto.randomBytes(8).toString("hex");

        try {
          fs.renameSync(pathStr, tombstonePath);
        } catch {
          return { acquired: false, inode: 0 };
        }

        const markerPayload = JSON.stringify({
          ownerToken: "marker",
          expiresAt: Date.now() + 5000,
          tombstonePath: tombstonePath,
          phase: "reclaim"
        });

        const tempMarkerPath = pathStr + ".marker.tmp." + crypto.randomBytes(8).toString("hex");
        let markerFd: number;
        let markerStat: fs.Stats;

        try {
          fs.writeFileSync(tempMarkerPath, markerPayload, { mode: 0o600 });
          fs.linkSync(tempMarkerPath, pathStr);
          fs.unlinkSync(tempMarkerPath);

          markerFd = fs.openSync(pathStr, "r+");
          markerStat = fs.fstatSync(markerFd);
        } catch (err: any) {
          try { fs.unlinkSync(tempMarkerPath); } catch {}
          if (err.code === "EEXIST") {
            try { fs.unlinkSync(tombstonePath); } catch {}
            return { acquired: false, inode: 0 };
          } else {
            try {
              if (fs.existsSync(tombstonePath) && !fs.existsSync(pathStr)) {
                fs.renameSync(tombstonePath, pathStr);
              }
            } catch {}
            return { acquired: false, inode: 0 };
          }
        }

        // HOOK: Pause before validation/restoration
        this.beforeValidationHook();

        try {
          const tombstoneStat = fs.lstatSync(tombstonePath);
          const content = fs.readFileSync(tombstonePath, "utf-8");
          const parsed = JSON.parse(content);

          let isValid = false;
          let isCrashedMarker = false;

          if (parsed && parsed.ownerToken === "marker" && typeof parsed.expiresAt === "number" && Date.now() > parsed.expiresAt) {
            isCrashedMarker = true;
            isValid = true;
          } else if (
            parsed &&
            parsed.ownerToken === token &&
            parsed.expiresAt === expectedExp &&
            Date.now() > parsed.expiresAt
          ) {
            if (expectedIno <= 0 || tombstoneStat.ino === expectedIno) {
              isValid = true;
            }
          }

          if (!isValid) {
            fs.closeSync(markerFd);
            fs.renameSync(tombstonePath, pathStr);
            return { acquired: false, inode: 0 };
          }

          if (isCrashedMarker && parsed.tombstonePath) {
            try { fs.unlinkSync(parsed.tombstonePath); } catch {}
          }

          fs.ftruncateSync(markerFd, 0);
          fs.writeSync(markerFd, newContent, 0, "utf-8");
          fs.fsyncSync(markerFd);
          fs.closeSync(markerFd);
          fs.unlinkSync(tombstonePath);
          return { acquired: true, inode: markerStat.ino };
        } catch {
          try { fs.closeSync(markerFd); } catch {}
          try {
            if (fs.existsSync(tombstonePath) && !fs.existsSync(pathStr)) {
              fs.renameSync(tombstonePath, pathStr);
            }
          } catch {}
          return { acquired: false, inode: 0 };
        }
      }
    }

    const testAdapter = new VacancyInterceptFsAdapter();

    let thirdAcqResult: any = null;
    testAdapter.beforeValidationHook = () => {
      // Third owner attempts to acquire vacant path while marker is active
      thirdAcqResult = nodeFs.atomicAcquireLock(lockPath, JSON.stringify({
        ownerToken: "third-owner-C",
        timestamp: Date.now(),
        expiresAt: Date.now() + 30000
      }));
    };

    // Waiter attempts to reclaim the expired lock.
    // We intentionally pass a mismatching expectedExpiresAt to force validation failure!
    const reclaimResult = testAdapter.atomicReclaimExpiredLock(
      lockPath,
      "owner-A",
      acq.inode,
      oldExpiresAt - 9999, // Force validation failure
      JSON.stringify({
        ownerToken: "reclaimer-B",
        timestamp: Date.now(),
        expiresAt: Date.now() + 30000
      })
    );

    // Assert:
    // 1. Third owner C was blocked from acquisition because the marker file was present.
    assert.strictEqual(thirdAcqResult.acquired, false, "Third owner C cannot acquire lock while marker is present");
    // 2. Reclaim failed because of the validation mismatch.
    assert.strictEqual(reclaimResult.acquired, false, "Reclaim failed as expected due to validation mismatch");
    // 3. The original lock was restored safely and is not overwritten by C (since C was blocked).
    const currentPayload = fs.readFileSync(lockPath, "utf-8");
    const parsedCurrent = JSON.parse(currentPayload);
    assert.strictEqual(parsedCurrent.ownerToken, "owner-A", "Original owner-A lease must be restored intact");

    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  // --- CASE 2: RELEASE vs THIRD OWNER ---
  await test("24b. Exclusive marker prevents third-party acquisition during release vacancy", async () => {
    const tempDir2 = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_vacancy_test_2_"));
    const lockPath2 = path.join(tempDir2, "v1", "cache.lock");
    fs.mkdirSync(path.join(tempDir2, "v1"), { recursive: true });

    const nodeFs = new NodeFileSystemAdapter();

    const oldExpiresAt = Date.now() - 5000;
    const initialPayload = JSON.stringify({
      ownerToken: "owner-A",
      timestamp: Date.now() - 10000,
      expiresAt: oldExpiresAt
    });
    const acq2 = nodeFs.atomicAcquireLock(lockPath2, initialPayload);
    assert.ok(acq2.acquired);

    class VacancyInterceptReleaseFsAdapter extends NodeFileSystemAdapter {
      beforeValidationHook = () => {};

      atomicReleaseLock(pathStr: string, token: string, expectedIno: number): boolean {
        if (!fs.existsSync(pathStr)) return false;
        const tombstonePath = pathStr + ".tombstone." + crypto.randomBytes(8).toString("hex");

        try {
          fs.renameSync(pathStr, tombstonePath);
        } catch {
          return false;
        }

        const markerPayload = JSON.stringify({
          ownerToken: "marker",
          expiresAt: Date.now() + 5000,
          tombstonePath: tombstonePath,
          phase: "release"
        });

        const tempMarkerPath = pathStr + ".marker.tmp." + crypto.randomBytes(8).toString("hex");
        let markerFd: number;
        try {
          fs.writeFileSync(tempMarkerPath, markerPayload, { mode: 0o600 });
          fs.linkSync(tempMarkerPath, pathStr);
          fs.unlinkSync(tempMarkerPath);

          markerFd = fs.openSync(pathStr, "r+");
        } catch (err: any) {
          try { fs.unlinkSync(tempMarkerPath); } catch {}
          if (err.code === "EEXIST") {
            try { fs.unlinkSync(tombstonePath); } catch {}
            return false;
          } else {
            try {
              if (fs.existsSync(tombstonePath) && !fs.existsSync(pathStr)) {
                fs.renameSync(tombstonePath, pathStr);
              }
            } catch {}
            return false;
          }
        }

        // HOOK
        this.beforeValidationHook();

        try {
          const tombstoneStat = fs.lstatSync(tombstonePath);
          const content = fs.readFileSync(tombstonePath, "utf-8");
          const parsed = JSON.parse(content);

          let isValid = false;
          let isCrashedMarker = false;

          if (parsed && parsed.ownerToken === "marker" && typeof parsed.expiresAt === "number" && Date.now() > parsed.expiresAt) {
            isCrashedMarker = true;
            isValid = true;
          } else if (parsed && parsed.ownerToken === token) {
            if (expectedIno <= 0 || tombstoneStat.ino === expectedIno) {
              isValid = true;
            }
          }

          if (!isValid) {
            fs.closeSync(markerFd);
            fs.renameSync(tombstonePath, pathStr);
            return false;
          }

          if (isCrashedMarker && parsed.tombstonePath) {
            try { fs.unlinkSync(parsed.tombstonePath); } catch {}
          }

          fs.closeSync(markerFd);
          fs.unlinkSync(pathStr);
          fs.unlinkSync(tombstonePath);
          return true;
        } catch {
          try { fs.closeSync(markerFd); } catch {}
          try {
            if (fs.existsSync(tombstonePath) && !fs.existsSync(pathStr)) {
              fs.renameSync(tombstonePath, pathStr);
            }
          } catch {}
          return false;
        }
      }
    }

    const testAdapter2 = new VacancyInterceptReleaseFsAdapter();

    let thirdAcqResult2: any = null;
    testAdapter2.beforeValidationHook = () => {
      thirdAcqResult2 = nodeFs.atomicAcquireLock(lockPath2, JSON.stringify({
        ownerToken: "third-owner-C",
        timestamp: Date.now(),
        expiresAt: Date.now() + 30000
      }));
    };

    // Stale owner attempts to release (mismatch expectedInode to force validation failure)
    const releaseResult = testAdapter2.atomicReleaseLock(lockPath2, "owner-A", acq2.inode + 9999);

    assert.strictEqual(thirdAcqResult2.acquired, false, "Third owner C cannot acquire lock while marker is present");
    assert.strictEqual(releaseResult, false, "Release failed as expected due to validation mismatch");

    const currentPayload2 = fs.readFileSync(lockPath2, "utf-8");
    const parsedCurrent2 = JSON.parse(currentPayload2);
    assert.strictEqual(parsedCurrent2.ownerToken, "owner-A", "Original lease restored intact");

    try {
      fs.rmSync(tempDir2, { recursive: true, force: true });
    } catch {}
  });

  // 25. Crash Recovery Test: Reclaim exits immediately after marker publication, followed by successful recovery
  await test("25. Crash Recovery: Reclaim exits immediately after marker publication, and later process recovers it", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_crash_reclaim_"));
    const lockPath = path.join(tempDir, "v1", "cache.lock");
    fs.mkdirSync(path.join(tempDir, "v1"), { recursive: true });

    const nodeFs = new NodeFileSystemAdapter();

    const oldExpiresAt = Date.now() - 5000;
    const initialPayload = JSON.stringify({
      ownerToken: "owner-A",
      timestamp: Date.now() - 10000,
      expiresAt: oldExpiresAt
    });
    const acq = nodeFs.atomicAcquireLock(lockPath, initialPayload);
    assert.ok(acq.acquired);

    class CrashAfterMarkerFsAdapter extends NodeFileSystemAdapter {
      atomicReclaimExpiredLock(pathStr: string, token: string, expectedIno: number, expectedExp: number, newContent: string) {
        if (!fs.existsSync(pathStr)) return { acquired: false, inode: 0 };
        const tombstoneId = crypto.randomBytes(8).toString("hex");
        const tombstonePath = pathStr + ".tombstone." + tombstoneId;

        try {
          fs.renameSync(pathStr, tombstonePath);
        } catch {
          return { acquired: false, inode: 0 };
        }

        const markerPayload = JSON.stringify({
          ownerToken: "marker",
          expiresAt: Date.now() - 1000, // Expired marker to simulate crashed marker
          tombstoneId: tombstoneId,
          phase: "reclaim"
        });

        const tempMarkerPath = pathStr + ".marker.tmp." + crypto.randomBytes(8).toString("hex");
        try {
          fs.writeFileSync(tempMarkerPath, markerPayload, { mode: 0o600 });
          fs.linkSync(tempMarkerPath, pathStr);
          fs.unlinkSync(tempMarkerPath);
        } catch (err: any) {
          try { fs.unlinkSync(tempMarkerPath); } catch {}
          try { fs.unlinkSync(tombstonePath); } catch {}
          return { acquired: false, inode: 0 };
        }

        // CRASH SIMULATION: return immediately leaving marker and tombstone files on disk
        return { acquired: false, inode: 0 };
      }
    }

    const crashAdapter = new CrashAfterMarkerFsAdapter();
    const reclaimResult = crashAdapter.atomicReclaimExpiredLock(
      lockPath,
      "owner-A",
      acq.inode,
      oldExpiresAt,
      JSON.stringify({ ownerToken: "reclaimer-B", timestamp: Date.now(), expiresAt: Date.now() + 30000 })
    );

    assert.strictEqual(reclaimResult.acquired, false);

    const files = fs.readdirSync(path.join(tempDir, "v1"));
    const markerFileExists = files.some(f => f === "cache.lock");
    const tombstoneFileExists = files.some(f => f.includes("cache.lock.tombstone."));
    assert.ok(markerFileExists, "Marker file must exist on disk");
    assert.ok(tombstoneFileExists, "Tombstone file must exist on disk");

    const recovererPayload = JSON.stringify({
      ownerToken: "recoverer-C",
      timestamp: Date.now(),
      expiresAt: Date.now() + 30000
    });

    const markerStat = nodeFs.lstatSync(lockPath);
    const recoveryResult = nodeFs.atomicReclaimExpiredLock(
      lockPath,
      "marker",
      markerStat.ino,
      JSON.parse(fs.readFileSync(lockPath, "utf-8")).expiresAt,
      recovererPayload
    );

    assert.strictEqual(recoveryResult.acquired, true, "Recovery of crashed marker must succeed");

    const finalPayload = fs.readFileSync(lockPath, "utf-8");
    assert.strictEqual(JSON.parse(finalPayload).ownerToken, "recoverer-C");

    const finalFiles = fs.readdirSync(path.join(tempDir, "v1"));
    const onlyLockFileLeft = finalFiles.length === 1 && finalFiles[0] === "cache.lock";
    assert.ok(onlyLockFileLeft, "No stray tombstone or marker files must remain");

    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  // 25b. Crash Recovery Test: Release exits immediately after marker publication, followed by successful recovery
  await test("25b. Crash Recovery: Release exits immediately after marker publication, and later process recovers it", async () => {
    const tempDir2 = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_crash_release_"));
    const lockPath2 = path.join(tempDir2, "v1", "cache.lock");
    fs.mkdirSync(path.join(tempDir2, "v1"), { recursive: true });

    const nodeFs = new NodeFileSystemAdapter();

    const oldExpiresAt = Date.now() - 5000;
    const initialPayload = JSON.stringify({
      ownerToken: "owner-A",
      timestamp: Date.now() - 10000,
      expiresAt: oldExpiresAt
    });
    const acq = nodeFs.atomicAcquireLock(lockPath2, initialPayload);
    assert.ok(acq.acquired);

    class CrashReleaseAfterMarkerFsAdapter extends NodeFileSystemAdapter {
      atomicReleaseLock(pathStr: string, token: string, expectedIno: number): boolean {
        if (!fs.existsSync(pathStr)) return false;
        const tombstoneId = crypto.randomBytes(8).toString("hex");
        const tombstonePath = pathStr + ".tombstone." + tombstoneId;

        try {
          fs.renameSync(pathStr, tombstonePath);
        } catch {
          return false;
        }

        const markerPayload = JSON.stringify({
          ownerToken: "marker",
          expiresAt: Date.now() - 1000, // Expired marker
          tombstoneId: tombstoneId,
          phase: "release"
        });

        const tempMarkerPath = pathStr + ".marker.tmp." + crypto.randomBytes(8).toString("hex");
        try {
          fs.writeFileSync(tempMarkerPath, markerPayload, { mode: 0o600 });
          fs.linkSync(tempMarkerPath, pathStr);
          fs.unlinkSync(tempMarkerPath);
        } catch {
          try { fs.unlinkSync(tempMarkerPath); } catch {}
          try { fs.unlinkSync(tombstonePath); } catch {}
          return false;
        }

        // CRASH SIMULATION: exit/abort release
        return false;
      }
    }

    const crashAdapter = new CrashReleaseAfterMarkerFsAdapter();
    const releaseRes = crashAdapter.atomicReleaseLock(lockPath2, "owner-A", acq.inode);
    assert.strictEqual(releaseRes, false);

    const files = fs.readdirSync(path.join(tempDir2, "v1"));
    const markerFileExists = files.some(f => f === "cache.lock");
    const tombstoneFileExists = files.some(f => f.includes("cache.lock.tombstone."));
    assert.ok(markerFileExists);
    assert.ok(tombstoneFileExists);

    const markerStat = nodeFs.lstatSync(lockPath2);
    const recoveryReleaseRes = nodeFs.atomicReleaseLock(lockPath2, "marker", markerStat.ino);

    assert.strictEqual(recoveryReleaseRes, true, "Release recovery of crashed release marker must succeed");

    const finalFiles = fs.readdirSync(path.join(tempDir2, "v1"));
    assert.strictEqual(finalFiles.length, 0, "All lock/marker/tombstone files must be cleaned up");

    try {
      fs.rmSync(tempDir2, { recursive: true, force: true });
    } catch {}
  });

  // 26. Hostile Marker Security Validation Test
  await test("26. Hostile marker validation rejects absolute paths, traversals, wrong phases, invalid names, and symlinks", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_security_"));
    const lockPath = path.join(tempDir, "v1", "cache.lock");
    fs.mkdirSync(path.join(tempDir, "v1"), { recursive: true });

    const nodeFs = new NodeFileSystemAdapter();

    // Create an external sentinel file that must NEVER be deleted
    const sentinelPath = path.join(tempDir, "sentinel.txt");
    fs.writeFileSync(sentinelPath, "sentinel-content", "utf-8");

    // helper to setup a marker with custom payload
    const setupMarker = (payload: any) => {
      fs.writeFileSync(lockPath, JSON.stringify(payload), { mode: 0o600 });
    };

    // --- CASE A: Absolute tombstone path ---
    setupMarker({
      ownerToken: "marker",
      expiresAt: Date.now() - 1000,
      tombstoneId: sentinelPath, // Trying to point to absolute sentinel path
      phase: "reclaim"
    });
    // Attempt recovery via reclaim
    const reclaimA = nodeFs.atomicReclaimExpiredLock(
      lockPath,
      "marker",
      12345,
      Date.now() - 1000,
      JSON.stringify({ ownerToken: "new-owner", timestamp: Date.now(), expiresAt: Date.now() + 30000 })
    );
    assert.strictEqual(reclaimA.acquired, false, "Reclaim recovery must reject absolute path");
    assert.ok(fs.existsSync(sentinelPath), "Sentinel file must NOT be deleted");

    // --- CASE B: Traversal path ---
    setupMarker({
      ownerToken: "marker",
      expiresAt: Date.now() - 1000,
      tombstoneId: "../sentinel.txt", // Pointing to traversal path
      phase: "reclaim"
    });
    const reclaimB = nodeFs.atomicReclaimExpiredLock(
      lockPath,
      "marker",
      12345,
      Date.now() - 1000,
      JSON.stringify({ ownerToken: "new-owner", timestamp: Date.now(), expiresAt: Date.now() + 30000 })
    );
    assert.strictEqual(reclaimB.acquired, false, "Reclaim recovery must reject traversal");
    assert.ok(fs.existsSync(sentinelPath), "Sentinel file must NOT be deleted");

    // --- CASE C: Unexpected phase ---
    // If phase is "unknown" (not reclaim or release)
    const tId = crypto.randomBytes(8).toString("hex");
    const fakeTombstone = lockPath + ".tombstone." + tId;
    fs.writeFileSync(fakeTombstone, JSON.stringify({ ownerToken: "old-owner" }));

    setupMarker({
      ownerToken: "marker",
      expiresAt: Date.now() - 1000,
      tombstoneId: tId,
      phase: "unknown" // Unexpected phase
    });
    const reclaimC = nodeFs.atomicReclaimExpiredLock(
      lockPath,
      "marker",
      12345,
      Date.now() - 1000,
      JSON.stringify({ ownerToken: "new-owner", timestamp: Date.now(), expiresAt: Date.now() + 30000 })
    );
    assert.strictEqual(reclaimC.acquired, false, "Reclaim recovery must reject unknown phase");
    assert.ok(fs.existsSync(fakeTombstone), "Fake tombstone must not be deleted");

    // --- CASE D: Invalid tombstone name (regex failure) ---
    setupMarker({
      ownerToken: "marker",
      expiresAt: Date.now() - 1000,
      tombstoneId: "invalid-tombstone-name-123456", // Doesn't match 16-char hex regex
      phase: "reclaim"
    });
    const reclaimD = nodeFs.atomicReclaimExpiredLock(
      lockPath,
      "marker",
      12345,
      Date.now() - 1000,
      JSON.stringify({ ownerToken: "new-owner", timestamp: Date.now(), expiresAt: Date.now() + 30000 })
    );
    assert.strictEqual(reclaimD.acquired, false, "Reclaim recovery must reject invalid name format");

    // --- CASE E: Symlinked tombstone ---
    // Create a symlink at reconstructed path pointing to sentinel
    const symlinkTId = crypto.randomBytes(8).toString("hex");
    const symlinkTombstone = lockPath + ".tombstone." + symlinkTId;
    try {
      fs.symlinkSync(sentinelPath, symlinkTombstone);
    } catch {}

    setupMarker({
      ownerToken: "marker",
      expiresAt: Date.now() - 1000,
      tombstoneId: symlinkTId,
      phase: "reclaim"
    });
    const reclaimE = nodeFs.atomicReclaimExpiredLock(
      lockPath,
      "marker",
      12345,
      Date.now() - 1000,
      JSON.stringify({ ownerToken: "new-owner", timestamp: Date.now(), expiresAt: Date.now() + 30000 })
    );
    assert.strictEqual(reclaimE.acquired, false, "Reclaim recovery must reject symlinked tombstone");
    assert.ok(fs.existsSync(sentinelPath), "Sentinel file must NOT be deleted");

    // Cleanup files
    try { fs.unlinkSync(fakeTombstone); } catch {}
    try { fs.unlinkSync(symlinkTombstone); } catch {}
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  // 27. Production-Path Crash Recovery Test for both Reclaim and Release Phase Markers
  await test("27. Production-path recovery cleans up expired reclaim/release markers through getCorpusEmbedding", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "homeo_prod_crash_"));
    const lockPath = path.join(tempDir, "v1", "cache.lock");
    fs.mkdirSync(path.join(tempDir, "v1"), { recursive: true });

    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId: testEntityId,
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });
    testRegistry.registerTestEntry({
      entityId: testEntityId + "-2",
      entityType: "disease",
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });

    const mockEntity2: any = {
      id: testEntityId + "-2",
      entityType: "disease",
      publishedVersionId: "1.0.0",
      editorialStatus: "published",
      versionInfo: { version: "1.0.0" },
      title: { en: "Unit Test Article 2" },
      summary: { en: "Unit Test Summary 2" },
      content: { overview: "Unit Test Overview 2" },
      categories: ["cardiology"],
      tags: ["unit-test"]
    };
    await globalKmsRepository.saveEntity(mockEntity2, "Unit", "Administrator", "Setup second unit test entity");

    const nodeFs = new NodeFileSystemAdapter();
    const runtimeAdapter = new TestRuntimePolicyAdapter();
    runtimeAdapter.enabled = true;
    runtimeAdapter.cacheDir = tempDir;

    const service = new OllamaCorpusEmbeddingCacheService(nodeFs, runtimeAdapter, testRegistry);

    const originalGetModelDescriptor = ollamaService.getModelDescriptor;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1" as const
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.999);

    try {
      // --- PART 1: Recover expired "reclaim" phase marker ---
      const tId1 = crypto.randomBytes(8).toString("hex");
      const tombstonePath1 = lockPath + ".tombstone." + tId1;
      fs.writeFileSync(tombstonePath1, JSON.stringify({ ownerToken: "stale-owner-1", expiresAt: Date.now() - 10000 }));

      fs.writeFileSync(lockPath, JSON.stringify({
        ownerToken: "marker",
        expiresAt: Date.now() - 1000, // Expired marker
        tombstoneId: tId1,
        phase: "reclaim"
      }), { mode: 0o600 });

      // Run production path
      const res1 = await service.getCorpusEmbedding(testEntityId);
      assert.strictEqual(res1.status, "generated");

      // Verify lock is released and all lock/marker/tombstone files cleaned up
      const files1 = fs.readdirSync(path.join(tempDir, "v1"));
      assert.ok(!files1.includes("cache.lock"), "Lock file must be unlinked after release");
      assert.ok(!files1.some(f => f.includes("tombstone") || f.includes("marker")), "Stray markers or tombstones must not remain");
      assert.ok(files1.includes("manifest.snapshot.json"), "Generated manifest must exist");

      // --- PART 2: Recover expired "release" phase marker ---
      const tId2 = crypto.randomBytes(8).toString("hex");
      const tombstonePath2 = lockPath + ".tombstone." + tId2;
      fs.writeFileSync(tombstonePath2, JSON.stringify({ ownerToken: "stale-owner-2", expiresAt: Date.now() - 10000 }));

      fs.writeFileSync(lockPath, JSON.stringify({
        ownerToken: "marker",
        expiresAt: Date.now() - 1000, // Expired marker
        tombstoneId: tId2,
        phase: "release"
      }), { mode: 0o600 });

      // Run production path again with second entity
      const res2 = await service.getCorpusEmbedding(testEntityId + "-2");
      assert.strictEqual(res2.status, "generated");

      // Verify lock is released and all lock/marker/tombstone files cleaned up
      const files2 = fs.readdirSync(path.join(tempDir, "v1"));
      assert.ok(!files2.includes("cache.lock"), "Lock file must be unlinked after release");
      assert.ok(!files2.some(f => f.includes("tombstone") || f.includes("marker")), "Stray markers or tombstones must not remain");

    } finally {
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  });

  console.log(`\n🎉 Governed Ollama Embeddings Cache Unit Tests Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

runUnitTests();
