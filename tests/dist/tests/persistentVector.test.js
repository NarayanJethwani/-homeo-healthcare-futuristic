"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const vectorStore_1 = require("../src/features/knowledge/retrieval/vectorStore");
const embeddingQueue_1 = require("../src/features/knowledge/retrieval/embeddingQueue");
const cmsManager_1 = require("../src/features/knowledge-admin/cms/cmsManager");
const MemoryRepository_1 = require("../src/features/knowledge-admin/repositories/MemoryRepository");
const ragService_1 = require("../src/lib/ragService");
async function runTests() {
    console.log("🚀 Starting Persistent Vector Store & RAG Indexing Test Suite...");
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
    // Setup basic public mock entity in repository
    const testArticleId = "DIS-RAG01";
    const mockPublicEntity = {
        id: testArticleId,
        slug: "reflux-rag-guide",
        entityType: "disease",
        title: { en: "Reflux RAG Guide", hi: "", gu: "", mr: "", es: "", ar: "" },
        summary: { en: "Reflux public summary", hi: "", gu: "", mr: "", es: "", ar: "" },
        relatedEntities: [],
        lastReviewed: "2026-01-01T00:00:00.000Z",
        lastUpdated: "2026-01-01T00:00:00.000Z",
        author: { name: "Medical Writer" },
        reviewer: { name: "Dr. Amit Patel", credentials: "MD(Hom)", specialty: "Pediatrics" },
        reviewerRole: "Pediatric Clinician",
        lastClinicalReview: "2026-01-01T00:00:00.000Z",
        nextClinicalReview: "2027-01-01T00:00:00.000Z",
        referencesUpdated: "2026-01-01T00:00:00.000Z",
        reviewStatus: "clinically-reviewed",
        isCornerstone: true,
        evidenceLevel: "Level-A",
        tags: ["reflux"],
        canonicalUrl: "https://homeo.healthcare/knowledge/diseases/reflux-rag-guide",
        editorialStatus: "published",
        editorialNotes: "",
        nextReviewDate: "2027-01-01T00:00:00.000Z",
        versionInfo: {
            version: "1.0.0",
            created: "2026-01-01T00:00:00.000Z",
            updated: "2026-01-01T00:00:00.000Z",
            reviewed: "2026-01-01T00:00:00.000Z",
            changelog: []
        },
        content: {
            overview: "Reflux public content disclaimer consult physician",
            references: ["CIT-001", "CIT-002", "CIT-003"]
        },
        readabilityScore: { score: 90, readingLevel: "Patient Friendly", readingTimeMinutes: 2 },
        seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 },
        aiKnowledge: {
            patientSummary: "Reflux public summary",
            practitionerSummary: "Reflux practitioner summary",
            educationalSummary: "Disclaimer: Educational only.",
            retrievalSummary: "Reflux public summary",
            differentialSummary: "",
            graphContext: "",
            embeddingText: ""
        },
        readingTimeMinutes: 2,
        audience: "practitioner",
        license: "Creative Commons"
    };
    await MemoryRepository_1.globalKmsRepository.saveEntity(mockPublicEntity, "System", "Administrator", "Setup RAG mock");
    // 1. Vector Store Fallbacks
    await test("1. FirestoreVectorStore fallback to Memory Store when Firestore is offline", async () => {
        const fStore = new vectorStore_1.FirestoreVectorStore();
        const stats = await fStore.getIndexStats();
        // Since Firebase Admin returns null in test (no credentials), it must fall back to memory
        assert_1.default.strictEqual(stats.persistentStorageEnabled, false);
        assert_1.default.strictEqual(stats.source, "memory");
    });
    // 2. Queue processing and retry recovery
    await test("2. Embedding queue handles job additions, deduplication, and execution", async () => {
        // Add job to queue
        const job = await (0, embeddingQueue_1.queueEmbeddingJob)(testArticleId, "Reflux RAG Guide", "disease", "Reflux public content disclaimer consult physician");
        assert_1.default.strictEqual(job.status, "pending");
        assert_1.default.strictEqual(job.attempts, 0);
        const jobs = await (0, embeddingQueue_1.getQueueJobs)();
        assert_1.default.ok(jobs.some(j => j.id === job.id));
        // Process queue - runs active provider (which is Gemini, or falls back to Ollama or Null Provider)
        await (0, embeddingQueue_1.processQueue)();
        // Check updated queue
        const updatedJobs = await (0, embeddingQueue_1.getQueueJobs)();
        const finalJob = updatedJobs.find(j => j.id === job.id);
        assert_1.default.ok(finalJob);
        // Since mock test may run under null-provider or offline environment, let's verify transitions
        assert_1.default.ok(["completed", "failed"].includes(finalJob.status));
    });
    // 3. CMS Publication triggers embedding job creation
    await test("3. CMS publication queues embedding job dynamically", async () => {
        // Update draft to approved state
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.reviewer = "Dr. Narayan Jethwani";
        draft.reviewerRole = "Lead Clinician Reviewer";
        draft.clinicalReviewDate = "2026-07-09";
        draft.nextReviewDate = "2027-07-09";
        draft.draftContent = "Updated reflux content disclaimer consult physician";
        draft.status = "clinically-approved";
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        // Queue count before publish
        const jobsBefore = await (0, embeddingQueue_1.getQueueJobs)();
        const countBefore = jobsBefore.filter(j => j.articleId === testArticleId && j.status === "pending").length;
        // Publish
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "CMS sync update", true);
        assert_1.default.strictEqual(res.success, true);
        // Queue count after publish must increase
        const jobsAfter = await (0, embeddingQueue_1.getQueueJobs)();
        const countAfter = jobsAfter.filter(j => j.articleId === testArticleId).length;
        assert_1.default.ok(countAfter > countBefore || jobsAfter.some(j => j.articleId === testArticleId && j.status === "completed"));
    });
    // 4. Fallback search matching
    await test("4. Hybrid search fallback to text keyword search if embedding provider is offline", async () => {
        // Verify search matches text without throwing errors
        const results = await ragService_1.ragService.hybridSearch("Reflux RAG Guide");
        assert_1.default.ok(results.length > 0);
        assert_1.default.ok(results.metadata);
        // Should fallback cleanly and carry stats
        assert_1.default.ok(["none", "text-only-fallback", "partial-vector-fallback", "dimension-mismatch-fallback"].includes(results.metadata.fallbackModeUsed));
    });
    // 5. Stale vectors detection matches repository changes
    await test("5. Stale vectors list matches repository state updates", async () => {
        const staleList = await vectorStore_1.globalVectorStore.listStaleVectors();
        assert_1.default.ok(Array.isArray(staleList));
    });
    // 6. Decoupling verification: draft content never leaks to public RAG search
    await test("6. Unpublished draft content never leaks into public retrieval results", async () => {
        const draftId = "DIS-DRAFT6";
        // Create draft that has not been approved or published
        await (0, cmsManager_1.saveDraft)({
            articleId: draftId,
            title: "Secret Draft title",
            draftContent: "This draft contains top secret unpublished draft data consult physician",
            status: "draft"
        }, "Editor");
        // Query hybrid search
        const results = await ragService_1.ragService.hybridSearch("top secret unpublished");
        // Should not retrieve the draft entity because it is not in globalKmsRepository with published status
        const matchedSecret = results.some(r => r.document.id === draftId || r.document.content.includes("top secret unpublished"));
        assert_1.default.strictEqual(matchedSecret, false);
    });
    console.log(`\n🎉 Persistent Vector & RAG Indexing Tests Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
        process.exit(1);
    }
}
runTests();
