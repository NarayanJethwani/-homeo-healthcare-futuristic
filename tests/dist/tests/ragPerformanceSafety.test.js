"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const ragService_1 = require("../src/lib/ragService");
const ollama_1 = require("../src/lib/ollama");
const vectorStore_1 = require("../src/features/knowledge/retrieval/vectorStore");
const embeddingProvider_1 = require("../src/features/knowledge/retrieval/embeddingProvider");
async function runPerformanceSafetyTests() {
    console.log("🚀 Starting V2.2.1 AI Knowledge Layer Performance & Safety Regression Tests...");
    let passed = 0;
    let failed = 0;
    async function test(name, fn) {
        try {
            await fn();
            console.log(`✅ TEST PASSED: ${name}`);
            passed++;
        }
        catch (err) {
            console.error(`❌ TEST FAILED: ${name}`);
            console.error(err.stack || err);
            failed++;
        }
    }
    // 1. Most important regression test: hybridSearch should not call ollamaService.getEmbeddings once per document
    await test("RAG Performance - hybridSearch should NOT generate document embeddings dynamically inside loop", async () => {
        // Force loaded seed vectors
        await vectorStore_1.globalVectorStore.loadSeedVectors();
        let embeddingsCallCount = 0;
        // Stub getEmbeddings on ollamaService
        const originalGetEmbeddings = ollama_1.ollamaService.getEmbeddings;
        ollama_1.ollamaService.getEmbeddings = async (text) => {
            embeddingsCallCount++;
            return new Array(768).fill(0.01);
        };
        // Stub checkHealth to ensure Ollama is treated as online
        const originalCheckHealth = ollama_1.ollamaService.checkHealth;
        ollama_1.ollamaService.checkHealth = async () => true;
        try {
            const results = await ragService_1.ragService.hybridSearch("test query");
            // Ensure search worked
            assert_1.default.ok(results.length > 0);
            // We expect EXACTLY 1 call to getEmbeddings (the query embedding), NOT 1 + N documents!
            assert_1.default.strictEqual(embeddingsCallCount, 1, `Expected exactly 1 embedding call (for query), but got ${embeddingsCallCount} calls.`);
        }
        finally {
            // Restore stubs
            ollama_1.ollamaService.getEmbeddings = originalGetEmbeddings;
            ollama_1.ollamaService.checkHealth = originalCheckHealth;
        }
    });
    // 2. Missing document vectors fall back to text scoring
    await test("RAG Safety - missing document vectors fall back to text scoring", async () => {
        // Retrieve stats
        const statsBefore = await vectorStore_1.globalVectorStore.getStats();
        // Query a search that hits documents
        const results = await ragService_1.ragService.hybridSearch("Law of Similars");
        assert_1.default.ok(results.length > 0);
        // Check that we returned metadata
        const metadata = results.metadata;
        assert_1.default.ok(metadata, "Search results should carry metadata");
        assert_1.default.strictEqual(typeof metadata.numMissingVectors, "number");
        assert_1.default.strictEqual(typeof metadata.vectorCoveragePercent, "number");
    });
    // 3. Dimension mismatch does not trigger regeneration inside search
    await test("RAG Safety - dimension mismatch skips semantic score and does not trigger live generation", async () => {
        let embeddingsCallCount = 0;
        const originalGetEmbeddings = ollama_1.ollamaService.getEmbeddings;
        // Setup a mismatched vector in store (e.g. 10 dimensions)
        await vectorStore_1.globalVectorStore.upsertVector({
            id: "kb_brand_philosophy",
            entityType: "Philosophy",
            title: "Philosophy",
            vector: [0.1, 0.2, 0.3], // 3 dimensions
            model: "test-model",
            dimensions: 3
        });
        ollama_1.ollamaService.getEmbeddings = async (text) => {
            embeddingsCallCount++;
            return new Array(768).fill(0.01); // query is 768 dimensions
        };
        try {
            const results = await ragService_1.ragService.hybridSearch("treatment philosophy");
            // We should only have 1 call (the query vector)
            assert_1.default.strictEqual(embeddingsCallCount, 1, "Should not call getEmbeddings for the mismatched document");
            const metadata = results.metadata;
            assert_1.default.ok(metadata.numDimensionMismatches >= 1, "Should report at least 1 dimension mismatch");
        }
        finally {
            ollama_1.ollamaService.getEmbeddings = originalGetEmbeddings;
        }
    });
    // 4. Query embedding unavailable still returns text-only results
    await test("RAG Safety - query embedding unavailable returns text-only results safely", async () => {
        // Stub active provider to be null-provider
        const originalGetActiveProvider = embeddingProvider_1.embeddingManager.getActiveProvider;
        embeddingProvider_1.embeddingManager.getActiveProvider = async () => {
            const { NullEmbeddingProvider } = require("../src/features/knowledge/retrieval/embeddingProvider");
            return new NullEmbeddingProvider();
        };
        try {
            const results = await ragService_1.ragService.hybridSearch("like cures like");
            assert_1.default.ok(results.length > 0);
            const metadata = results.metadata;
            assert_1.default.strictEqual(metadata.fallbackModeUsed, "text-only-fallback");
            assert_1.default.strictEqual(metadata.embeddingProviderUsed, "null-provider");
        }
        finally {
            embeddingProvider_1.embeddingManager.getActiveProvider = originalGetActiveProvider;
        }
    });
    // 5. Empty vectors.json does not crash
    await test("VectorStore - empty seed handling is safe", async () => {
        const { MemoryVectorStore } = require("../src/features/knowledge/retrieval/vectorStore");
        const store = new MemoryVectorStore();
        // Override filePath to invalid file path to simulate empty/missing seed
        store.staticFilePath = "./nonexistent-vectors-seed.json";
        const records = await store.loadSeedVectors();
        assert_1.default.strictEqual(records.length, 0, "Should load empty list for missing file");
        const stats = await store.getStats();
        assert_1.default.strictEqual(stats.totalVectors, 0);
    });
    console.log(`\n🎉 V2.2.1 Tests Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
        process.exit(1);
    }
}
runPerformanceSafetyTests().catch(e => {
    console.error("Fatal test runner error:", e);
    process.exit(1);
});
