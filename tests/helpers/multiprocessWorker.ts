process.env.NODE_ENV = "test";

import fs from "fs";
import path from "path";
import assert from "assert";
import { NodeFileSystemAdapter } from "@/features/knowledge/retrieval/adapters/FileSystemAdapter";
import { TestRuntimePolicyAdapter } from "@/features/knowledge/retrieval/adapters/RuntimePolicyAdapter";
import { TestCorpusEligibilityRegistry, CorpusEligibilityRegistry } from "@/features/knowledge/retrieval/CorpusEligibilityRegistry";
import { OllamaCorpusEmbeddingCacheService } from "@/features/knowledge/retrieval/ollamaCorpusEmbeddingCacheService";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { ollamaService } from "@/lib/ollama";

async function runWorker() {
  const workerId = process.env.WORKER_ID || "0";
  const sharedCacheDir = process.env.TEST_CACHE_DIR;
  assert.ok(sharedCacheDir, "TEST_CACHE_DIR environment variable must be set");

  const testEntityId = "DIS-WORKER-TEST-01";
  const mockEntity: any = {
    id: testEntityId,
    entityType: "disease",
    publishedVersionId: "1.0.0",
    editorialStatus: "published",
    versionInfo: { version: "1.0.0" },
    title: { en: "Worker Test Title" },
    summary: { en: "Worker Test Summary" },
    content: { overview: "Worker Test Overview" },
    categories: ["pediatrics"],
    tags: ["worker"]
  };

  await globalKmsRepository.saveEntity(mockEntity, "Worker", "Administrator", "Setup worker entity");

  const testRegistry = new TestCorpusEligibilityRegistry();
  testRegistry.registerTestEntry({
    entityId: testEntityId,
    entityType: "disease",
    publishedVersionId: "1.0.0",
    dataClassification: "non-phi",
    provenance: "KMS_REPOSITORY"
  });
  CorpusEligibilityRegistry.setTestRegistryOverride(testRegistry);

  const fsAdapter = new NodeFileSystemAdapter();
  const runtimeAdapter = new TestRuntimePolicyAdapter();
  runtimeAdapter.enabled = true;
  runtimeAdapter.cacheDir = sharedCacheDir;

  const service = new OllamaCorpusEmbeddingCacheService(fsAdapter, runtimeAdapter, testRegistry);

  const originalGetModelDescriptor = ollamaService.getModelDescriptor;
  const originalGetRawCorpusEmbedding = ollamaService.getRawCorpusEmbedding;

  ollamaService.getModelDescriptor = async () => ({
    modelName: "nomic-embed-text",
    modelDigest: "sha256:e1b5f6a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    expectedDimensions: 768,
    normalizationEnum: "L2_NORM_V1"
  });

  // Simulate non-trivial generation delay to force lock contention
  ollamaService.getRawCorpusEmbedding = async () => {
    await new Promise((r) => setTimeout(r, 400));
    return new Array(768).fill(0.5);
  };

  try {
    const res = await service.getCorpusEmbedding(testEntityId);
    if (res.status === "bypass") {
      console.error(`Worker ${workerId} bypassed with reason: ${(res as any).reasonCode}`);
    }
    assert.ok(res.status === "generated" || res.status === "hit", `Unexpected result status: ${res.status}`);

    // Append output to shared log file
    const logFile = path.join(sharedCacheDir, "worker_results.log");
    fs.appendFileSync(logFile, `${workerId}:${res.status}\n`, "utf-8");
  } finally {
    ollamaService.getModelDescriptor = originalGetModelDescriptor;
    ollamaService.getRawCorpusEmbedding = originalGetRawCorpusEmbedding;
  }
}

runWorker().catch((err) => {
  console.error("Worker failed:", err);
  process.exit(1);
});
