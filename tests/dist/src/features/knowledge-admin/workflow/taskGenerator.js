"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAutomaticCurationTasks = generateAutomaticCurationTasks;
const workflowManager_1 = require("./workflowManager");
const clinicalOsKnowledgeUsage_1 = require("../../knowledge/analytics/clinicalOsKnowledgeUsage");
/**
 * Iterates through all KMS knowledge entities and automatically generates
 * necessary editorial tasks if any checklist criteria are unmet.
 * Prevents duplicating tasks if an active task of the same type already exists.
 * Suggested tasks do not approve content or automatically modify published statuses.
 */
async function generateAutomaticCurationTasks(entities, actor = "System Task Generator") {
    const generated = [];
    const now = new Date();
    for (const entity of entities) {
        const title = entity.title?.en || entity.slug;
        const isCornerstone = !!entity.isCornerstone;
        // --- 1. Clinical Review Task Trigger ---
        let needsClinicalReview = false;
        const clinicalReasons = [];
        // Check usage telemetry to identify high Clinical OS usage articles
        const osUsage = (0, clinicalOsKnowledgeUsage_1.getEntityOsUsageCounts)(entity.id);
        const isHighUsage = osUsage.views > 5;
        if (entity.reviewStatus === "needs-review" || entity.reviewStatus === "update-required") {
            needsClinicalReview = true;
            clinicalReasons.push(`Review status is explicitly '${entity.reviewStatus}'.`);
        }
        if (entity.nextReviewDate) {
            const nextDate = new Date(entity.nextReviewDate);
            if (nextDate < now) {
                needsClinicalReview = true;
                clinicalReasons.push(`Review deadline of ${entity.nextReviewDate} has passed.`);
            }
        }
        if (entity.lastReviewed) {
            const lastDate = new Date(entity.lastReviewed);
            const diffDays = Math.ceil((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
            if (isCornerstone && diffDays > 180) {
                needsClinicalReview = true;
                clinicalReasons.push(`Cornerstone article last reviewed ${diffDays} days ago (exceeds 180-day/6-month limit).`);
            }
            else if (isHighUsage && diffDays > 180) {
                needsClinicalReview = true;
                clinicalReasons.push(`High Clinical OS usage article (${osUsage.views} views) last reviewed ${diffDays} days ago (exceeds 180-day/6-month limit).`);
            }
            else if (!isCornerstone && !isHighUsage && diffDays > 365) {
                needsClinicalReview = true;
                clinicalReasons.push(`General article last reviewed ${diffDays} days ago (exceeds 365-day/12-month limit).`);
            }
        }
        else {
            needsClinicalReview = true;
            clinicalReasons.push("No recorded review history exists.");
        }
        if (needsClinicalReview) {
            // Cornerstone -> critical, High usage -> high, Standard -> medium
            const tPriority = isCornerstone ? "critical" : (isHighUsage ? "high" : "medium");
            const task = await (0, workflowManager_1.createEditorialTask)({
                articleId: entity.id,
                articleTitle: title,
                entityType: entity.entityType,
                taskType: "clinical-review",
                status: "backlog",
                priority: tPriority,
                source: "review-schedule",
                reasons: clinicalReasons,
                notes: `Automatically generated due to staleness or pending status.`
            }, actor);
            generated.push(task);
        }
        // --- 2. Reference / Citation Task Trigger ---
        let needsReferenceUpdate = false;
        const refReasons = [];
        const refs = entity.content?.references || [];
        if (entity.citationHealth === "critical" || entity.citationHealth === "needs-attention") {
            needsReferenceUpdate = true;
            refReasons.push(`Citation health index is marked '${entity.citationHealth}'.`);
        }
        if (refs.length === 0) {
            needsReferenceUpdate = true;
            refReasons.push("Contains zero clinical citations or material medica references.");
        }
        if (needsReferenceUpdate) {
            const isCriticalHealth = entity.citationHealth === "critical";
            const tPriority = (isCornerstone || isCriticalHealth) ? "critical" : "medium";
            const task = await (0, workflowManager_1.createEditorialTask)({
                articleId: entity.id,
                articleTitle: title,
                entityType: entity.entityType,
                taskType: "reference-update",
                status: "backlog",
                priority: tPriority,
                source: "citation-health",
                reasons: refReasons,
                notes: `Verify relevant clinical research studies or material medica citations.`
            }, actor);
            generated.push(task);
        }
        // --- 3. SEO Optimization Task Trigger ---
        let needsSeoTask = false;
        const seoReasons = [];
        if (entity.seoStatus === "needs-attention" || entity.seoStatus === "critical") {
            needsSeoTask = true;
            seoReasons.push(`SEO health index is marked '${entity.seoStatus}'.`);
        }
        if (entity.seoGeoScores?.seoScore && entity.seoGeoScores.seoScore < 70) {
            needsSeoTask = true;
            seoReasons.push(`SEO score of ${entity.seoGeoScores.seoScore}% is below standard threshold (70%).`);
        }
        if (needsSeoTask) {
            const task = await (0, workflowManager_1.createEditorialTask)({
                articleId: entity.id,
                articleTitle: title,
                entityType: entity.entityType,
                taskType: "seo-improvement",
                status: "backlog",
                priority: "medium",
                source: "search-console",
                reasons: seoReasons,
                notes: `Review Meta keywords, description fields, and organic query alignment.`
            }, actor);
            generated.push(task);
        }
        // --- 4. AI Readiness Curation Trigger ---
        let needsAiReadyTask = false;
        const aiReasons = [];
        if (entity.seoGeoScores?.aiReadinessScore && entity.seoGeoScores.aiReadinessScore < 75) {
            needsAiReadyTask = true;
            aiReasons.push(`AI readiness rating is ${entity.seoGeoScores.aiReadinessScore}% (fails target 75% threshold).`);
        }
        if (!entity.summary?.en || entity.summary.en.trim().length < 10) {
            needsAiReadyTask = true;
            aiReasons.push("Missing a valid English short summarization layer.");
        }
        if (needsAiReadyTask) {
            const task = await (0, workflowManager_1.createEditorialTask)({
                articleId: entity.id,
                articleTitle: title,
                entityType: entity.entityType,
                taskType: "ai-readiness",
                status: "backlog",
                priority: "low",
                source: "ai-readiness",
                reasons: aiReasons,
                notes: `Ensure structured vector cache sync is updated and summaries are fully drafted.`
            }, actor);
            generated.push(task);
        }
    }
    return generated;
}
