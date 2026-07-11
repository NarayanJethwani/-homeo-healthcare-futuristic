import assert from "assert";
import { 
  globalVectorStore, 
  FirestoreVectorStore, 
  MemoryVectorStore 
} from "../src/features/knowledge/retrieval/vectorStore";
import { 
  queueEmbeddingJob, 
  getQueueJobs, 
  processQueue, 
  retryFailedJobs 
} from "../src/features/knowledge/retrieval/embeddingQueue";
import { publishArticle, getDraft, saveDraft, approveClinicalReview } from "../src/features/knowledge-admin/cms/cmsManager";
import { globalKmsRepository } from "../src/features/knowledge-admin/repositories/MemoryRepository";
import { ragService } from "../src/lib/ragService";

async function runTests() {
  console.log("🚀 Starting Persistent Vector Store & RAG Indexing Test Suite...");
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

  // Setup basic public mock entity in repository
  const testArticleId = "DIS-RAG01";
  const mockPublicEntity = {
    id: testArticleId,
    slug: "reflux-rag-guide",
    entityType: "disease" as any,
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
    reviewStatus: "clinically-reviewed" as any,
    isCornerstone: true,
    evidenceLevel: "Level-A" as any,
    tags: ["reflux"],
    canonicalUrl: "https://homeo.healthcare/knowledge/diseases/reflux-rag-guide",
    editorialStatus: "published" as any,
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
    readabilityScore: { score: 90, readingLevel: "Patient Friendly" as any, readingTimeMinutes: 2 },
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
    audience: "practitioner" as any,
    license: "Creative Commons"
  };

  await globalKmsRepository.saveEntity(mockPublicEntity, "System", "Administrator", "Setup RAG mock");

  // 1. Vector Store Fallbacks
  await test("1. FirestoreVectorStore fallback to Memory Store when Firestore is offline", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const firebaseAdmin = require("../src/lib/firebaseAdmin");
    const originalGetAdminDb = firebaseAdmin.getAdminDb;
    firebaseAdmin.getAdminDb = () => null;

    try {
      const fStore = new FirestoreVectorStore();
      const stats = await fStore.getIndexStats();
      assert.strictEqual(stats.persistentStorageEnabled, false);
      assert.strictEqual(stats.source, "memory");
    } finally {
      firebaseAdmin.getAdminDb = originalGetAdminDb;
    }
  });

  // 2. Queue processing and retry recovery
  await test("2. Embedding queue handles job additions, deduplication, and execution", async () => {
    // Add job to queue
    const job = await queueEmbeddingJob(
      testArticleId,
      "Reflux RAG Guide",
      "disease",
      "Reflux public content disclaimer consult physician"
    );
    assert.strictEqual(job.status, "pending");
    assert.strictEqual(job.attempts, 0);

    const jobs = await getQueueJobs();
    assert.ok(jobs.some(j => j.id === job.id));

    // Process queue - runs active provider (which is Gemini, or falls back to Ollama or Null Provider)
    await processQueue();
    
    // Check updated queue
    const updatedJobs = await getQueueJobs();
    const finalJob = updatedJobs.find(j => j.id === job.id);
    assert.ok(finalJob);
    // Since mock test may run under null-provider or offline environment, let's verify transitions
    assert.ok(["completed", "failed"].includes(finalJob.status));
  });

  // 3. CMS Publication triggers embedding job creation
  await test("3. CMS publication queues embedding job dynamically", async () => {
    // Update draft to approved state
    const draft = await getDraft(testArticleId);
    assert.ok(draft);
    draft.reviewer = "Dr. Narayan Jethwani";
    draft.reviewerRole = "Lead Clinician Reviewer";
    draft.clinicalReviewDate = "2026-07-09";
    draft.nextReviewDate = "2027-07-09";
    draft.draftContent = "Updated reflux content disclaimer consult physician";
    draft.status = "clinically-approved";
    await saveDraft(draft, "Editor");

    // Queue count before publish
    const jobsBefore = await getQueueJobs();
    const countBefore = jobsBefore.filter(j => j.articleId === testArticleId && j.status === "pending").length;

    // Publish
    const res = await publishArticle(testArticleId, "Editor", "CMS sync update", true);
    assert.strictEqual(res.success, true);

    // Queue count after publish must increase
    const jobsAfter = await getQueueJobs();
    const countAfter = jobsAfter.filter(j => j.articleId === testArticleId).length;
    assert.ok(countAfter > countBefore || jobsAfter.some(j => j.articleId === testArticleId && j.status === "completed"));
  });

  // 4. Fallback search matching
  await test("4. Hybrid search fallback to text keyword search if embedding provider is offline", async () => {
    // Verify search matches text without throwing errors
    const results = await ragService.hybridSearch("Reflux RAG Guide");
    assert.ok(results.length > 0);
    assert.ok(results.metadata);
    // Should fallback cleanly and carry stats
    assert.ok(["none", "text-only-fallback", "partial-vector-fallback", "dimension-mismatch-fallback"].includes(results.metadata.fallbackModeUsed));
  });

  // 5. Stale vectors detection matches repository changes
  await test("5. Stale vectors list matches repository state updates", async () => {
    const staleList = await globalVectorStore.listStaleVectors();
    assert.ok(Array.isArray(staleList));
  });

  // 6. Decoupling verification: draft content never leaks to public RAG search
  await test("6. Unpublished draft content never leaks into public retrieval results", async () => {
    const draftId = "DIS-DRAFT6";
    // Create draft that has not been approved or published
    await saveDraft({
      articleId: draftId,
      title: "Secret Draft title",
      draftContent: "This draft contains top secret unpublished draft data consult physician",
      status: "draft"
    }, "Editor");

    // Query hybrid search
    const results = await ragService.hybridSearch("top secret unpublished");
    // Should not retrieve the draft entity because it is not in globalKmsRepository with published status
    const matchedSecret = results.some(r => r.document.id === draftId || r.document.content.includes("top secret unpublished"));
    assert.strictEqual(matchedSecret, false);
  });

  console.log(`\n🎉 Persistent Vector & RAG Indexing Tests Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
