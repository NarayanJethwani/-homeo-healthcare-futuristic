process.env.NODE_ENV = "test";

import assert from "assert";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { runJob, EmbeddingJob } from "@/features/knowledge/retrieval/embeddingQueue";
import {
  CorpusEligibilityRegistry,
  TestCorpusEligibilityRegistry
} from "@/features/knowledge/retrieval/CorpusEligibilityRegistry";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { globalVectorStore } from "@/features/knowledge/retrieval/vectorStore";
import { ollamaService } from "@/lib/ollama";
import { embeddingManager } from "@/features/knowledge/retrieval/embeddingProvider";
import { buildCanonicalEmbeddingText } from "@/features/knowledge/retrieval/canonicalEmbeddingText";
import { MultiprocessTestHelper } from "./helpers/multiprocessTestHelper";

async function runIntegrationTests() {
  console.log("🚀 Starting Governed Embedding Queue & Cache Integration Test Suite...");
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

  const entityId = "DIS-QUEUE-TEST-01";
  const mockEntity: any = {
    id: entityId,
    entityType: "disease",
    publishedVersionId: "1.0.0",
    editorialStatus: "published",
    versionInfo: { version: "1.0.0" },
    title: { en: "Authoritative Disease Title" },
    summary: { en: "Authoritative Summary" },
    content: { overview: "Authoritative Overview" },
    categories: ["gastroenterology"],
    tags: ["authoritative"]
  };

  await globalKmsRepository.saveEntity(mockEntity, "System", "Administrator", "Setup integration test entity");

  // 1. Unregistered / Ineligible Entity mapped to Cancelled
  await test("1. Ineligible queue job maps to cancelled status", async () => {
    const testRegistry = new TestCorpusEligibilityRegistry();
    CorpusEligibilityRegistry.setTestRegistryOverride(testRegistry);

    const originalGetActiveProvider = embeddingManager.getActiveProvider;
    embeddingManager.getActiveProvider = async () => ({
      name: "ollama",
      getEmbeddings: async () => new Array(768).fill(0.1)
    } as any);

    try {
      const job: EmbeddingJob = {
        id: "job-1",
        articleId: entityId,
        entityType: "disease",
        title: "Forged Title",
        contentText: "Forged Content",
        status: "pending",
        attempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await runJob(job);
      assert.strictEqual(res.success, false);
      assert.strictEqual(job.status, "cancelled");
      assert.deepStrictEqual(res.warnings, ["NOT_ELIGIBLE"]);
    } finally {
      CorpusEligibilityRegistry.setTestRegistryOverride(null);
      embeddingManager.getActiveProvider = originalGetActiveProvider;
    }
  });

  // 2. Authoritative Re-resolution & Forged Content Exclusion
  await test("2. Authoritative entity re-resolution overrides caller title and content with exact SHA-256", async () => {
    const testRegistry = new TestCorpusEligibilityRegistry();
    testRegistry.registerTestEntry({
      entityId,
      publishedVersionId: "1.0.0",
      dataClassification: "non-phi",
      provenance: "KMS_REPOSITORY"
    });
    CorpusEligibilityRegistry.setTestRegistryOverride(testRegistry);

    const originalGetActiveProvider = embeddingManager.getActiveProvider;
    const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;
    const originalGetModelDescriptor = ollamaService.getModelDescriptor;

    embeddingManager.getActiveProvider = async () => ({
      name: "ollama",
      getEmbeddings: async () => new Array(768).fill(0.1)
    } as any);

    ollamaService.getModelDescriptor = async () => ({
      modelName: "nomic-embed-text",
      modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      expectedDimensions: 768,
      normalizationEnum: "L2_NORM_V1"
    });

    ollamaService.getRawCorpusEmbedding = async () => new Array(768).fill(0.3);

    try {
      const job: EmbeddingJob = {
        id: "job-2",
        articleId: entityId,
        entityType: "kms_knowledge",
        title: "Forged Title Poison",
        contentText: "Forged Content Poison Payload",
        status: "pending",
        attempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await runJob(job);
      assert.strictEqual(res.success, true);
      assert.strictEqual(job.status, "completed");

      // Verify stored vector record in Vector Store uses server-resolved authoritative title and exact SHA-256
      const storedVector = await globalVectorStore.getVector(entityId);
      assert.ok(storedVector);
      assert.strictEqual(storedVector.title, "Authoritative Disease Title");

      const canonicalText = buildCanonicalEmbeddingText(mockEntity);
      const expectedHash = crypto.createHash("sha256").update(canonicalText).digest("hex");
      assert.strictEqual(storedVector.contentHash, expectedHash);
    } finally {
      CorpusEligibilityRegistry.setTestRegistryOverride(null);
      embeddingManager.getActiveProvider = originalGetActiveProvider;
      ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
      ollamaService.getModelDescriptor = originalGetModelDescriptor;
    }
  });

  // 3. Repository Lookup Failure Fails Closed
  await test("3. Missing repository entity fails closed with REPOSITORY_RESOLUTION_FAILED", async () => {
    const originalGetActiveProvider = embeddingManager.getActiveProvider;
    embeddingManager.getActiveProvider = async () => ({
      name: "ollama",
      getEmbeddings: async () => new Array(768).fill(0.1)
    } as any);

    try {
      const job: EmbeddingJob = {
        id: "job-missing",
        articleId: "NON-EXISTENT-ENTITY-999",
        entityType: "kms_knowledge",
        title: "Some Title",
        contentText: "Some Content",
        status: "pending",
        attempts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await runJob(job);
      assert.strictEqual(res.success, false);
      assert.strictEqual(job.status, "failed");
      assert.deepStrictEqual(res.errors, ["REPOSITORY_RESOLUTION_FAILED"]);
    } finally {
      embeddingManager.getActiveProvider = originalGetActiveProvider;
    }
  });

  // 4. Multiprocess Worker Verification & Lock Contention on Shared Directory
  await test("4. Multiprocess contention on shared directory results in exactly 1 generation and 1 cache hit", async () => {
    const sharedCacheDir = path.join(os.tmpdir(), "homeo_ollama_multiprocess_test_" + Date.now());
    fs.mkdirSync(sharedCacheDir, { recursive: true });

    try {
      const results = await MultiprocessTestHelper.runConcurrentWorkers(
        "tests/helpers/multiprocessWorker.ts",
        2,
        { TEST_CACHE_DIR: sharedCacheDir }
      );

      assert.strictEqual(results.length, 2);
      for (const res of results) {
        assert.strictEqual(res.status, "success", `Worker process failed. Output: ${res.output}`);
      }

      const logFile = path.join(sharedCacheDir, "worker_results.log");
      assert.ok(fs.existsSync(logFile), "Worker log file must exist");

      const logLines = fs.readFileSync(logFile, "utf-8").trim().split("\n");
      assert.strictEqual(logLines.length, 2);

      const statuses = logLines.map((line) => line.split(":")[1]);
      assert.ok(statuses.includes("generated"), "Exactly one worker must perform generation");
      assert.ok(statuses.includes("hit"), "Remaining worker must hit cache");

      // Verify manifest and entry count on shared filesystem
      const manifestPath = path.join(sharedCacheDir, "v1", "manifest.snapshot.json");
      assert.ok(fs.existsSync(manifestPath), "Shared manifest snapshot must exist");

      const manifestData = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      assert.strictEqual(Object.keys(manifestData.entries).length, 1);
    } finally {
      try {
        fs.rmSync(sharedCacheDir, { recursive: true, force: true });
      } catch {}
    }
  });

  console.log(`\n🎉 Governed Embedding Queue Integration Tests Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

runIntegrationTests();
