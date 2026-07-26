import assert from "assert";
import { 
  getDraft, 
  saveDraft, 
  getVersions, 
  rollbackToVersion, 
  approveClinicalReview, 
  publishArticle,
  transitionLifecycleState,
  getPublicationEvents,
  clearCmsMemoryStore,
  memoryReviewRecords,
  memoryAuditEvents
} from "../src/features/knowledge-admin/cms/cmsManager";
import { hasPermission } from "../src/lib/security/rbac";
import { isEntityEligibleForRetrieval } from "../src/features/knowledge/retrieval/eligibilityService";
import { runLegacyMigration } from "../src/features/knowledge/versioning/migration";
import { globalKmsRepository } from "../src/features/knowledge-admin/repositories/MemoryRepository";
import { featureFlags } from "../src/features/dashboard/constants/featureFlags";
import { evaluatePublicationEligibility } from "../src/features/knowledge/governance/publicationGuard";

async function runTests() {
  console.log("🚀 Starting V2.14.0-A Editorial Governance Foundation Test Suite...");
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  // Setup mock entity for testing
  const testId = "DIS-GOV-TEST01";
  const mockEntity = {
    id: testId,
    slug: "gerd-governed-guide",
    entityType: "disease" as any,
    title: { en: "GERD Governed Guidelines", hi: "", gu: "", mr: "", es: "", ar: "" },
    summary: { en: "GERD governed summary", hi: "", gu: "", mr: "", es: "", ar: "" },
    relatedEntities: [],
    lastReviewed: "2026-01-01T00:00:00.000Z",
    lastUpdated: "2026-01-01T00:00:00.000Z",
    author: { name: "System Admin" },
    reviewer: { name: "Dr. Amit Patel", credentials: "MD(Hom)", specialty: "Pediatrics" },
    reviewerRole: "Pediatric Clinician",
    lastClinicalReview: "2026-01-01T00:00:00.000Z",
    nextClinicalReview: "2027-01-01T00:00:00.000Z",
    referencesUpdated: "2026-01-01T00:00:00.000Z",
    reviewStatus: "clinically-reviewed" as any,
    isCornerstone: false,
    evidenceLevel: "level-1" as any,
    tags: ["gerd", "governance"],
    canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gerd-governed-guide",
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
      overview: "Public content body containing standard disclaimers consult with physician",
      references: ["CIT-001"]
    },
    readabilityScore: { score: 90, readingLevel: "Patient Friendly" as any, readingTimeMinutes: 2 },
    seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 },
    aiKnowledge: {
      patientSummary: "GERD governed summary",
      practitionerSummary: "Practitioner summary of GERD",
      educationalSummary: "Disclaimer: For educational only.",
      retrievalSummary: "GERD governed summary",
      differentialSummary: "",
      graphContext: "",
      embeddingText: ""
    },
    readingTimeMinutes: 2,
    audience: "practitioner" as any,
    license: "Creative Commons"
  };

  await globalKmsRepository.saveEntity(mockEntity, "System", "Administrator", "Setup governance mock");

  // Enable feature flag for testing
  featureFlags.knowledgeEditorialWorkflowEnabled = true;

  // 1. Workflow: Complete forward lifecycle
  await test("1. Complete forward lifecycle (draft -> medical-review -> editorial-review -> approved -> published)", async () => {
    clearCmsMemoryStore();
    const draft = await getDraft(testId);
    assert.ok(draft);
    assert.strictEqual(draft.status, "published"); // Seeded from published public entity

    // Reset status to draft for workflow test
    draft.status = "draft";
    draft.revision = 1;
    await saveDraft(draft, "System");

    // draft -> medical-review
    const step1 = await transitionLifecycleState(testId, "medical-review", "Editor User", "editor", "editor@homeo.healthcare");
    assert.strictEqual(step1.status, "medical-review");

    // medical-review -> editorial-review
    const step2 = await transitionLifecycleState(testId, "editorial-review", "Clinical Reviewer User", "clinical-reviewer", "reviewer@homeo.healthcare", {
      reviewer: "Dr. Narayan Jethwani",
      reviewerRole: "Lead reviewer",
      reviewDate: "2026-07-10",
      nextReviewDate: "2027-07-10"
    });
    assert.strictEqual(step2.status, "editorial-review");

    // editorial-review -> approved
    const step3 = await transitionLifecycleState(testId, "approved", "Clinical Reviewer User", "clinical-reviewer", "reviewer@homeo.healthcare");
    assert.strictEqual(step3.status, "approved");

    // approved -> published
    const step4 = await transitionLifecycleState(testId, "published", "Super Admin User", "super-admin", "admin@homeo.healthcare", {
      changeSummary: "Final production publication."
    });
    assert.strictEqual(step4.status, "published");
  });

  // 2. Workflow: Backward transitions require a reason
  await test("2. Backward transitions require a non-empty reason", async () => {
    const draft = await getDraft(testId);
    assert.ok(draft);
    draft.status = "medical-review";
    await saveDraft(draft, "Editor");

    try {
      await transitionLifecycleState(testId, "draft", "Editor User", "editor", "editor@homeo.healthcare", {
        comments: "" // empty reason
      });
      assert.fail("Should throw on empty comments for backward transition.");
    } catch (err: any) {
      assert.ok(err.message.includes("reason"));
    }

    // Success with comment
    const reverted = await transitionLifecycleState(testId, "draft", "Editor User", "editor", "editor@homeo.healthcare", {
      comments: "Returning to author for revisions."
    });
    assert.strictEqual(reverted.status, "draft");
  });

  // 3. Workflow: Invalid skipped stages must fail
  await test("3. Invalid skipped stages must fail", async () => {
    const draft = await getDraft(testId);
    assert.ok(draft);
    draft.status = "draft";
    await saveDraft(draft, "Editor");

    try {
      // Trying to skip medical review and go straight to approved
      await transitionLifecycleState(testId, "approved", "Clinical Reviewer User", "clinical-reviewer", "reviewer@homeo.healthcare");
      assert.fail("Should reject skipped stages.");
    } catch (err: any) {
      assert.ok(err.message.includes("not permitted") || err.message.includes("Insufficient permissions"));
    }
  });

  // 4. Permissions: Role capabilities checks
  await test("4. Editor role cannot perform clinical approval or publish action", async () => {
    const draft = await getDraft(testId);
    assert.ok(draft);
    draft.status = "editorial-review";
    await saveDraft(draft, "Editor");

    // Editor trying to approve clinical review
    try {
      await transitionLifecycleState(testId, "approved", "Editor User", "editor", "editor@homeo.healthcare");
      assert.fail("Editor cannot approve clinical review.");
    } catch (err: any) {
      assert.ok(err.message.includes("permissions") || err.message.includes("lacks capability"));
    }

    // Editor trying to publish
    const freshDraft = await getDraft(testId);
    assert.ok(freshDraft);
    freshDraft.status = "approved";
    await saveDraft(freshDraft, "Clinical Reviewer");

    try {
      await transitionLifecycleState(testId, "published", "Editor User", "editor", "editor@homeo.healthcare");
      assert.fail("Editor cannot publish.");
    } catch (err: any) {
      assert.ok(err.message.includes("permissions") || err.message.includes("lacks capability"));
    }
  });

  // 5. Versions: Pointers and snapshots are stable and independent
  await test("5. Version pointers are set correctly and independent", async () => {
    let draft = await getDraft(testId);
    assert.ok(draft);
    draft.status = "draft";
    draft = await saveDraft(draft, "Editor");

    // Verify currentDraftVersionId is populated
    assert.ok(draft.currentDraftVersionId);

    // approvedVersionId and publishedVersionId should be independent
    const firstDraftId = draft.currentDraftVersionId;

    draft.status = "medical-review";
    await saveDraft(draft, "Editor");
    
    const draftAfter = await getDraft(testId);
    assert.notStrictEqual(draftAfter?.currentDraftVersionId, firstDraftId);
  });

  // 6. Concurrency: Stale revisions are rejected
  await test("6. Optimistic concurrency control rejects stale revision writes", async () => {
    const draft = await getDraft(testId);
    assert.ok(draft);
    draft.status = "draft";
    draft.revision = 5;
    await saveDraft(draft, "Editor");

    try {
      // Trying to transition with stale expectedRevision = 4
      await transitionLifecycleState(testId, "medical-review", "Editor User", "editor", "editor@homeo.healthcare", {
        expectedRevision: 4
      });
      assert.fail("Should reject stale expected revision.");
    } catch (err: any) {
      assert.ok(err.message.includes("Stale") || err.message.includes("conflict"));
    }
  });

  // 7. Retrieval: Exclude draft, review, and unverified content from search
  await test("7. Retrieval eligibility filters out draft, review, and legacy-unverified content", async () => {
    const entity: any = {
      ...mockEntity,
      editorialStatus: "draft",
      publishedVersionId: undefined
    };
    assert.strictEqual(isEntityEligibleForRetrieval(entity), false);

    entity.editorialStatus = "medical-review";
    assert.strictEqual(isEntityEligibleForRetrieval(entity), false);

    entity.editorialStatus = "published";
    entity.publishedVersionId = "ver-123";
    entity.legacyVerificationStatus = "legacy-published-unverified";
    // Unverified legacy content excluded from retrieval under default policy
    assert.strictEqual(isEntityEligibleForRetrieval(entity), false);

    entity.id = "D0001";
    entity.editorialStatus = "published";
    entity.publishedVersionId = "ver-123";
    entity.author = { name: "System Admin" };
    entity.reviewer = { name: "Dr. Amit Patel" };
    entity.references = [{ citation: "Clinical Source 2026", url: "https://doi.org/10.1000/1" }];
    entity.legacyVerificationStatus = "verified-published";
    const evalRes = evaluatePublicationEligibility(entity);
    console.log("REASON LIST:", evalRes.reasons, "INDEXING:", evalRes.eligibleForIndexing);
    assert.strictEqual(evalRes.eligibleForPublicDisplay, true);
  });

  // 8. Migration: Dry run does not write, idempotent repeated execution
  await test("8. Legacy migration dry-run performs no writes, run mode is idempotent", async () => {
    const resDry = await runLegacyMigration(true);
    assert.strictEqual(resDry.dryRun, true);
    assert.ok(resDry.successCount > 0);

    // Verify no actual writes occurred by checking a known entity does not have legacy status
    const entBefore = await globalKmsRepository.getEntity(testId);
    assert.strictEqual(entBefore?.legacyVerificationStatus, undefined);

    // Run active migration
    const resMig = await runLegacyMigration(false);
    assert.strictEqual(resMig.dryRun, false);
    
    const entAfter = await globalKmsRepository.getEntity(testId);
    assert.ok(entAfter?.legacyVerificationStatus);

    // Repeated execution should be idempotent
    const resRepeat = await runLegacyMigration(false);
    assert.strictEqual(resRepeat.successCount, resMig.successCount);
  });

  console.log(`\n==============================================`);
  console.log(`V2.14.0-A Editorial Governance Tests run: ${passedCount + failedCount} | Passed: ${passedCount} | Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
