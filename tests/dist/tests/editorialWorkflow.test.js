"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const workflowManager_1 = require("../src/features/knowledge-admin/workflow/workflowManager");
const taskGenerator_1 = require("../src/features/knowledge-admin/workflow/taskGenerator");
const clinicalOsKnowledgeUsage_1 = require("../src/features/knowledge/analytics/clinicalOsKnowledgeUsage");
async function runTests() {
    console.log("🚀 Starting Editorial Workflow Automation Test Suite...");
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
    // 1. Task Creation & Duplicate check
    await test("Task Creation - creates unique task and prevents duplicates", async () => {
        (0, workflowManager_1.clearWorkflowMemoryStore)();
        const task1 = await (0, workflowManager_1.createEditorialTask)({
            articleId: "D0001",
            articleTitle: "GERD Sheet",
            entityType: "disease",
            taskType: "clinical-review",
            status: "backlog",
            priority: "high",
            source: "manual",
            reasons: ["Initial review set"]
        }, "Dr. Narayan");
        assert_1.default.ok(task1.id);
        assert_1.default.strictEqual(task1.status, "backlog");
        // Creating duplicate active task should return existing task1
        const task2 = await (0, workflowManager_1.createEditorialTask)({
            articleId: "D0001",
            articleTitle: "GERD Sheet",
            entityType: "disease",
            taskType: "clinical-review",
            status: "backlog",
            priority: "high",
            source: "manual",
            reasons: ["Duplicate attempt"]
        }, "Dr. Narayan");
        assert_1.default.strictEqual(task1.id, task2.id);
        const list = await (0, workflowManager_1.getEditorialTasks)();
        assert_1.default.strictEqual(list.length, 1);
    });
    // 2. Task Assignment
    await test("Task Assignment - assigns clinician and records audit log event", async () => {
        (0, workflowManager_1.clearWorkflowMemoryStore)();
        const task = await (0, workflowManager_1.createEditorialTask)({
            articleId: "R0001",
            articleTitle: "Sulphur",
            entityType: "remedy",
            taskType: "clinical-review",
            status: "backlog",
            priority: "critical",
            source: "manual",
            reasons: ["Critical audit check"]
        }, "System");
        const assignOk = await (0, workflowManager_1.assignEditorialTask)(task.id, "Dr. Narayan Jethwani", "Lead Clinician Reviewer", "System Admin");
        assert_1.default.strictEqual(assignOk, true);
        const tasks = await (0, workflowManager_1.getEditorialTasks)();
        assert_1.default.strictEqual(tasks[0].assignedTo, "Dr. Narayan Jethwani");
        assert_1.default.strictEqual(tasks[0].status, "assigned");
        const logs = await (0, workflowManager_1.getWorkflowEvents)(task.articleId);
        const assignLog = logs.find(l => l.eventType === "task-assigned");
        assert_1.default.ok(assignLog);
        assert_1.default.strictEqual(assignLog.actor, "System Admin");
        assert_1.default.strictEqual(assignLog.after.assignedTo, "Dr. Narayan Jethwani");
    });
    // 3. Status Transitions
    await test("Status Transitions - transitions status and saves notes & logs audit", async () => {
        (0, workflowManager_1.clearWorkflowMemoryStore)();
        const task = await (0, workflowManager_1.createEditorialTask)({
            articleId: "D0002",
            articleTitle: "Asthma",
            entityType: "disease",
            taskType: "reference-update",
            status: "backlog",
            priority: "high",
            source: "manual",
            reasons: ["Missing PubMed references"]
        }, "System");
        const transitionOk = await (0, workflowManager_1.transitionTaskStatus)(task.id, "completed", "Dr. Narayan Jethwani", "Citations updated successfully.");
        assert_1.default.strictEqual(transitionOk, true);
        const tasks = await (0, workflowManager_1.getEditorialTasks)();
        assert_1.default.strictEqual(tasks[0].status, "completed");
        assert_1.default.ok(tasks[0].completedAt);
        assert_1.default.strictEqual(tasks[0].notes, "Citations updated successfully.");
        const logs = await (0, workflowManager_1.getWorkflowEvents)(task.articleId);
        const statusLog = logs.find(l => l.eventType === "task-status-changed");
        assert_1.default.ok(statusLog);
        assert_1.default.strictEqual(statusLog.after.status, "completed");
    });
    // 4. Persistence Mode Check
    await test("Persistence Mode - checks firestore status cleanly", async () => {
        const isFirestore = await (0, workflowManager_1.isFirestoreWorkflowActive)();
        assert_1.default.strictEqual(typeof isFirestore, "boolean");
    });
    // 5. Automatic Task Generator & Cadence Rules
    await test("Automatic Task Generator - generates tasks based on 6-month and 12-month cadences", async () => {
        (0, workflowManager_1.clearWorkflowMemoryStore)();
        (0, clinicalOsKnowledgeUsage_1.clearClinicalOsUsageCache)();
        // 1. Simulate high usage for Sulphur remedy by logging views
        for (let i = 0; i < 6; i++) {
            (0, clinicalOsKnowledgeUsage_1.trackClinicalOsKnowledgeUsage)({ entityId: "sulphur", entityType: "remedy", action: "click" });
        }
        const staledDate185DaysAgo = new Date(Date.now() - 185 * 24 * 3600 * 1000).toISOString();
        const staledDate370DaysAgo = new Date(Date.now() - 370 * 24 * 3600 * 1000).toISOString();
        const mockEntities = [
            {
                id: "D9001",
                slug: "cornerstone-gerd",
                entityType: "disease",
                title: { en: "GERD flagship sheet", hi: "", gu: "", mr: "", es: "", ar: "" },
                summary: { en: "", hi: "", gu: "", mr: "", es: "", ar: "" },
                relatedEntities: [],
                lastReviewed: staledDate185DaysAgo, // 185 days ago > 6-month limit
                lastUpdated: "2026-01-01T00:00:00.000Z",
                author: { name: "System" },
                isCornerstone: true,
                citationHealth: "needs-attention",
                seoStatus: "needs-attention",
                editorialStatus: "published",
                evidenceLevel: "Level-B",
                tags: [],
                canonicalUrl: "",
                editorialNotes: "",
                nextReviewDate: "",
                versionInfo: { version: "1.0", created: "2026-01-01", updated: "2026-01-01", reviewed: "2026-01-01", changelog: [] },
                readabilityScore: { score: 90, readingLevel: "Patient Friendly", readingTimeMinutes: 2 },
                seoGeoScores: { seoScore: 50, geoScore: 80, aiReadinessScore: 60 }
            },
            {
                id: "sulphur",
                slug: "sulphur",
                entityType: "remedy",
                title: { en: "Sulphur", hi: "", gu: "", mr: "", es: "", ar: "" },
                summary: { en: "Sulphur description", hi: "", gu: "", mr: "", es: "", ar: "" },
                relatedEntities: [],
                lastReviewed: staledDate185DaysAgo, // High usage (6 views) + 185 days ago > 6-month limit
                lastUpdated: "2026-01-01T00:00:00.000Z",
                author: { name: "System" },
                isCornerstone: false,
                citationHealth: "excellent",
                seoStatus: "excellent",
                editorialStatus: "published",
                evidenceLevel: "Level-A",
                tags: [],
                canonicalUrl: "",
                editorialNotes: "",
                nextReviewDate: "",
                versionInfo: { version: "1.0", created: "2026-01-01", updated: "2026-01-01", reviewed: "2026-01-01", changelog: [] },
                readabilityScore: { score: 90, readingLevel: "Patient Friendly", readingTimeMinutes: 2 },
                seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 }
            },
            {
                id: "calc-carb",
                slug: "calc-carb",
                entityType: "remedy",
                title: { en: "Calc Carb", hi: "", gu: "", mr: "", es: "", ar: "" },
                summary: { en: "Calc Carb description", hi: "", gu: "", mr: "", es: "", ar: "" },
                relatedEntities: [],
                lastReviewed: staledDate370DaysAgo, // Standard article stale for 370 days (> 12-month limit)
                lastUpdated: "2026-01-01T00:00:00.000Z",
                author: { name: "System" },
                isCornerstone: false,
                citationHealth: "critical", // Critical citation health
                seoStatus: "excellent",
                editorialStatus: "published",
                evidenceLevel: "Level-A",
                tags: [],
                canonicalUrl: "",
                editorialNotes: "",
                nextReviewDate: "",
                versionInfo: { version: "1.0", created: "2026-01-01", updated: "2026-01-01", reviewed: "2026-01-01", changelog: [] },
                readabilityScore: { score: 90, readingLevel: "Patient Friendly", readingTimeMinutes: 2 },
                seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 }
            }
        ];
        const tasksGenerated = await (0, taskGenerator_1.generateAutomaticCurationTasks)(mockEntities, "Test Generator Runner");
        // Cornerstone (GERD): 4 tasks (clinical-review, reference-update, seo-improvement, ai-readiness)
        // High usage (Sulphur): 1 task (clinical-review due to 6-month stale reviewed)
        // Standard staled + critical health (Calc Carb): 2 tasks (clinical-review, reference-update)
        assert_1.default.ok(tasksGenerated.length >= 6);
        const reviewGERD = tasksGenerated.find(t => t.articleId === "D9001" && t.taskType === "clinical-review");
        assert_1.default.strictEqual(reviewGERD.priority, "critical"); // Cornerstone review is critical priority
        const reviewSulphur = tasksGenerated.find(t => t.articleId === "sulphur" && t.taskType === "clinical-review");
        assert_1.default.strictEqual(reviewSulphur.priority, "high"); // High usage review is high priority
        const reviewCalcCarb = tasksGenerated.find(t => t.articleId === "calc-carb" && t.taskType === "clinical-review");
        assert_1.default.strictEqual(reviewCalcCarb.priority, "medium"); // Standard article review is medium priority
        const refCalcCarb = tasksGenerated.find(t => t.articleId === "calc-carb" && t.taskType === "reference-update");
        assert_1.default.strictEqual(refCalcCarb.priority, "critical"); // Critical citation health creates critical priority task
    });
    console.log(`\n🎉 Editorial Workflow Tests Completed. Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) {
        process.exit(1);
    }
}
runTests();
