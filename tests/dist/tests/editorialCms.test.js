"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const cmsManager_1 = require("../src/features/knowledge-admin/cms/cmsManager");
const MemoryRepository_1 = require("../src/features/knowledge-admin/repositories/MemoryRepository");
const workflowManager_1 = require("../src/features/knowledge-admin/workflow/workflowManager");
async function runTests() {
    console.log("🚀 Starting Editorial CMS & Publishing Safety Test Suite...");
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
    // Seeding baseline public entity to MemoryRepository for testing
    const testArticleId = "DIS-TEST01";
    const mockPublicEntity = {
        id: testArticleId,
        slug: "gerd-clinical-guide",
        entityType: "disease",
        title: { en: "GERD Guidelines", hi: "", gu: "", mr: "", es: "", ar: "" },
        summary: { en: "GERD public summary", hi: "", gu: "", mr: "", es: "", ar: "" },
        relatedEntities: [],
        lastReviewed: "2026-01-01T00:00:00.000Z",
        lastUpdated: "2026-01-01T00:00:00.000Z",
        author: { name: "Medical Editor" },
        reviewer: { name: "Dr. Amit Patel", credentials: "MD(Hom)", specialty: "Pediatrics" },
        reviewerRole: "Pediatric Clinician",
        lastClinicalReview: "2026-01-01T00:00:00.000Z",
        nextClinicalReview: "2027-01-01T00:00:00.000Z",
        referencesUpdated: "2026-01-01T00:00:00.000Z",
        reviewStatus: "clinically-reviewed",
        isCornerstone: true,
        evidenceLevel: "Level-A",
        tags: ["gerd", "gastro"],
        canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gerd-clinical-guide",
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
            overview: "Public content body containing safety warnings disclaimer",
            references: ["CIT-001"]
        },
        readabilityScore: { score: 90, readingLevel: "Patient Friendly", readingTimeMinutes: 2 },
        seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 },
        aiKnowledge: {
            patientSummary: "GERD public summary",
            practitionerSummary: "Practitioner summary of gastrointestinal reflux disease",
            educationalSummary: "Disclaimer: For educational only.",
            retrievalSummary: "GERD public summary",
            differentialSummary: "",
            graphContext: "",
            embeddingText: ""
        },
        readingTimeMinutes: 2,
        audience: "practitioner",
        license: "Creative Commons"
    };
    await MemoryRepository_1.globalKmsRepository.saveEntity(mockPublicEntity, "System", "Administrator", "Setup testing mock");
    // 1. draft update does not alter public article
    await test("1. draft update does not alter public article", async () => {
        (0, cmsManager_1.clearCmsMemoryStore)();
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        await (0, cmsManager_1.saveDraft)({
            articleId: testArticleId,
            title: "ModifiedGERD title draft state only"
        }, "Dr. Narayan Jethwani");
        // Public entity remains unchanged
        const pub = await MemoryRepository_1.globalKmsRepository.getEntity(testArticleId);
        assert_1.default.ok(pub);
        assert_1.default.strictEqual(pub.title.en, "GERD Guidelines");
    });
    // 2. clinical approval does not publish draft
    await test("2. clinical approval does not publish draft", async () => {
        await (0, cmsManager_1.approveClinicalReview)(testArticleId, "Dr. Narayan Jethwani", "Lead Clinician Reviewer", "2026-07-09", "2027-07-09", "Approved clinical review", "Dr. Narayan Jethwani");
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.strictEqual(draft?.status, "clinically-approved");
        const pub = await MemoryRepository_1.globalKmsRepository.getEntity(testArticleId);
        assert_1.default.strictEqual(pub?.title.en, "GERD Guidelines"); // still baseline GERD Guidelines
    });
    // 3. publish requires explicit confirmPublish: true
    await test("3. publish requires explicit confirmPublish: true", async () => {
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "Summary", false);
        assert_1.default.strictEqual(res.success, false);
        assert_1.default.ok(res.errors.some(e => e.includes("confirmation")));
    });
    // 4. publish requires active reviewer
    await test("4. publish requires active reviewer", async () => {
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.reviewer = "Dr. Unregistered Reviewer";
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "Summary", true);
        assert_1.default.strictEqual(res.success, false);
        assert_1.default.ok(res.errors.some(e => e.includes("clinical directory")));
    });
    // 5. publish requires clinical review date
    await test("5. publish requires clinical review date", async () => {
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.reviewer = "Dr. Narayan Jethwani";
        draft.clinicalReviewDate = "";
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "Summary", true);
        assert_1.default.strictEqual(res.success, false);
        assert_1.default.ok(res.errors.some(e => e.includes("review date")));
    });
    // 6. publish requires next review date
    await test("6. publish requires next review date", async () => {
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.clinicalReviewDate = "2026-07-09";
        draft.nextReviewDate = "";
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "Summary", true);
        assert_1.default.strictEqual(res.success, false);
        assert_1.default.ok(res.errors.some(e => e.includes("Next clinical review date")));
    });
    // 7. cornerstone publish blocked without references
    await test("7. cornerstone publish blocked without references", async () => {
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.nextReviewDate = "2027-07-09";
        draft.references = []; // Less than 3 references for cornerstone
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "Summary", true);
        if (res.success || !res.errors.some(e => e.includes("reference"))) {
            console.log("DEBUG Test 7 Result:", res);
        }
        assert_1.default.strictEqual(res.success, false);
        assert_1.default.ok(res.errors.some(e => e.includes("reference")));
    });
    // 8. publish blocked if PHI detected
    await test("8. publish blocked if PHI detected", async () => {
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.references = ["CIT-001", "CIT-002", "CIT-003"];
        draft.draftContent = "GERD guide warning disclaimer consult with physician. Patient email is patient.test@gmail.com";
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "Summary", true);
        if (res.success || !res.errors.some(e => e.includes("PHI/PII"))) {
            console.log("DEBUG Test 8 Result:", res);
        }
        assert_1.default.strictEqual(res.success, false);
        assert_1.default.ok(res.errors.some(e => e.includes("PHI/PII")));
    });
    // 9. publish blocked if prohibited claim detected
    await test("9. publish blocked if prohibited claim detected", async () => {
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.draftContent = "Guaranteed cure for acid reflux consult physician."; // prohibited term
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "Summary", true);
        assert_1.default.strictEqual(res.success, false);
        assert_1.default.ok(res.errors.some(e => e.includes("prohibited")));
    });
    // 10. publish creates version snapshot & 11. publish creates publication event & 12. structured result
    await test("10, 11, 12. publish creates snapshot, logs audit event, and returns CmsPublishResult", async () => {
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.draftContent = "Standard GERD guidelines. consult with physician warnings.";
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const res = await (0, cmsManager_1.publishArticle)(testArticleId, "Editor", "Final publish summary", true);
        if (!res.success) {
            console.log("DEBUG Test 10 Result:", res);
        }
        assert_1.default.strictEqual(res.success, true);
        assert_1.default.strictEqual(res.publicWriteBack, "completed");
        assert_1.default.strictEqual(res.indexUpdate, "completed");
        assert_1.default.strictEqual(res.publicationEventCreated, true);
        // Verify snapshot was saved
        const versions = await (0, cmsManager_1.getVersions)(testArticleId);
        assert_1.default.ok(versions.length > 0);
        // Verify pub event was logged
        const events = await (0, cmsManager_1.getPublicationEvents)(testArticleId);
        assert_1.default.strictEqual(events.length, 1);
        assert_1.default.strictEqual(events[0].publishedBy, "Editor");
        assert_1.default.strictEqual(events[0].changeSummary, "Final publish summary");
    });
    // 14. rollback creates new version snapshot
    await test("14. rollback creates new version snapshot", async () => {
        const versions = await (0, cmsManager_1.getVersions)(testArticleId);
        const targetVer = versions[versions.length - 1]; // First draft version
        const restored = await (0, cmsManager_1.rollbackToVersion)(targetVer.id, "Dr. Narayan Jethwani", true);
        assert_1.default.ok(restored);
        const newVersions = await (0, cmsManager_1.getVersions)(testArticleId);
        // Rollback creates a new version log
        assert_1.default.strictEqual(newVersions[0].changeType, "rollback");
    });
    // 15. rollback requires explicit confirmRollback: true
    await test("15. rollback requires explicit confirmRollback: true", async () => {
        const versions = await (0, cmsManager_1.getVersions)(testArticleId);
        try {
            await (0, cmsManager_1.rollbackToVersion)(versions[0].id, "Editor", false);
            assert_1.default.fail("Should have thrown error.");
        }
        catch (err) {
            assert_1.default.ok(err.message.includes("confirmation"));
        }
    });
    // 16. slug collision blocks publish
    await test("16. slug collision blocks publish", async () => {
        // Seed another public entity
        const collisionEntity = {
            ...mockPublicEntity,
            id: "DIS-COLL02",
            slug: "gerd-clinical-guide", // Same slug as testArticleId
            isCornerstone: false
        };
        await MemoryRepository_1.globalKmsRepository.saveEntity(collisionEntity, "System", "Administrator", "Collision test baseline");
        const draft = await (0, cmsManager_1.getDraft)("DIS-COLL02");
        assert_1.default.ok(draft);
        draft.reviewer = "Dr. Narayan Jethwani";
        draft.reviewerRole = "Lead reviewer";
        draft.clinicalReviewDate = "2026-07-09";
        draft.nextReviewDate = "2027-07-09";
        draft.draftContent = "GERD second guide content with disclaimer and physician warnings.";
        draft.references = ["CIT-001"];
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const res = await (0, cmsManager_1.publishArticle)("DIS-COLL02", "Editor", "Publish collision", true);
        assert_1.default.strictEqual(res.success, false);
        assert_1.default.ok(res.errors.some(e => e.includes("slug collision")));
    });
    // 17. AI-generated draft summary is not public until manually approved/published
    await test("17. AI-generated draft summary is not public until manually approved/published", async () => {
        const draft = await (0, cmsManager_1.getDraft)(testArticleId);
        assert_1.default.ok(draft);
        draft.patientSummary = "New AI Patient Summary Draft Suggestions";
        await (0, cmsManager_1.saveDraft)(draft, "Editor");
        const pub = await MemoryRepository_1.globalKmsRepository.getEntity(testArticleId);
        // Public entity retains the previous summary, not the draft suggestion
        assert_1.default.notStrictEqual(pub?.summary.en, "New AI Patient Summary Draft Suggestions");
    });
    // 18. workflow task completion does not approve or publish draft
    await test("18. workflow task completion does not approve or publish draft", async () => {
        const testArticleId18 = "DIS-TEST18";
        // Seed clean mock public entity for DIS-TEST18
        const mockPublic18 = {
            ...mockPublicEntity,
            id: testArticleId18,
            slug: "gerd-test18-guide",
            title: { en: "GERD Guidelines 18", hi: "", gu: "", mr: "", es: "", ar: "" }
        };
        await MemoryRepository_1.globalKmsRepository.saveEntity(mockPublic18, "System", "Administrator", "Setup 18 mock");
        const task = await (0, workflowManager_1.createEditorialTask)({
            articleId: testArticleId18,
            articleTitle: "GERD Guidelines 18",
            entityType: "disease",
            taskType: "clinical-review",
            status: "assigned",
            priority: "high",
            dueDate: "2026-08-01",
            assignedTo: "Dr. Narayan Jethwani",
            source: "manual",
            reasons: ["Initial review set"]
        }, "System Admin");
        // Save a draft in pending/needs-review state
        await (0, cmsManager_1.saveDraft)({
            articleId: testArticleId18,
            status: "draft",
            title: "ModifiedGERD title draft state only"
        }, "Editor");
        // Complete the workflow task
        await (0, workflowManager_1.transitionTaskStatus)(task.id, "completed", "Completed checklist scan", "Dr. Narayan Jethwani");
        // Draft remains in draft status, not automatically clinically-approved or published
        const draft = await (0, cmsManager_1.getDraft)(testArticleId18);
        assert_1.default.strictEqual(draft?.status, "draft");
        const pub = await MemoryRepository_1.globalKmsRepository.getEntity(testArticleId18);
        assert_1.default.strictEqual(pub?.title.en, "GERD Guidelines 18");
    });
    console.log(`\n🎉 Editorial CMS Tests Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
        process.exit(1);
    }
}
runTests();
