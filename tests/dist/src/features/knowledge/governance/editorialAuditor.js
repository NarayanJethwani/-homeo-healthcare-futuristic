"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runEditorialAudit = runEditorialAudit;
const index_1 = require("../index");
const citations_1 = require("../content/citations");
const entityRelationships_1 = require("../graph/entityRelationships");
function runEditorialAudit() {
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const allIds = new Set(entities.map(e => e.id));
    const citationIds = new Set(citations_1.CITATIONS.map(c => c.id));
    const issues = [];
    const brokenRelationships = [];
    const missingCitations = [];
    let healthyCount = 0;
    // Track relationship counts per entity
    const outboundLinkCountMap = new Map();
    const inboundLinkCountMap = new Map();
    // Initialize maps
    entities.forEach(e => {
        outboundLinkCountMap.set(e.id, 0);
        inboundLinkCountMap.set(e.id, 0);
    });
    // Check graph triples
    entityRelationships_1.KNOWLEDGE_RELATIONSHIPS.forEach(rel => {
        const sourceExists = allIds.has(rel.source);
        const targetExists = allIds.has(rel.target);
        if (!sourceExists || !targetExists) {
            brokenRelationships.push({
                sourceId: rel.source,
                targetId: rel.target,
                type: rel.relation
            });
        }
        if (sourceExists) {
            outboundLinkCountMap.set(rel.source, (outboundLinkCountMap.get(rel.source) || 0) + 1);
        }
        if (targetExists) {
            inboundLinkCountMap.set(rel.target, (inboundLinkCountMap.get(rel.target) || 0) + 1);
        }
    });
    // Audit each entity
    entities.forEach(e => {
        const entityIssues = [];
        const titleStr = typeof e.title === "string" ? e.title : e.title.en;
        // 1. Content Checks
        const content = e.content || {};
        // Overview check
        const overviewText = content.overview || content.description || content.definition || "";
        if (!overviewText) {
            entityIssues.push({
                entityId: e.id,
                title: titleStr,
                type: "error",
                category: "content",
                message: "Missing clinical overview, description, or definition block."
            });
        }
        // Placeholder text checks
        const stringified = JSON.stringify(e).toLowerCase();
        const placeholders = ["lorem ipsum", "placeholder", "tbd", "todo", "untitled-slug", "untitled slug"];
        placeholders.forEach(ph => {
            if (stringified.includes(ph)) {
                entityIssues.push({
                    entityId: e.id,
                    title: titleStr,
                    type: "error",
                    category: "content",
                    message: `Contains placeholder text: "${ph}"`
                });
            }
        });
        // 2. Citation Checks
        const refs = content.references || [];
        if (refs.length === 0) {
            entityIssues.push({
                entityId: e.id,
                title: titleStr,
                type: "warning",
                category: "citation",
                message: "No references or clinical citations linked."
            });
        }
        else {
            refs.forEach((refId) => {
                if (!citationIds.has(refId)) {
                    missingCitations.push({ entityId: e.id, citationId: refId });
                    entityIssues.push({
                        entityId: e.id,
                        title: titleStr,
                        type: "error",
                        category: "citation",
                        message: `References missing citation ID: "${refId}" in database.`
                    });
                }
            });
        }
        // 3. Interconnection Checks (Must link to at least 5 relevant pages)
        const outboundCount = outboundLinkCountMap.get(e.id) || 0;
        const inboundCount = inboundLinkCountMap.get(e.id) || 0;
        const totalLinks = outboundCount + inboundCount;
        if (totalLinks < 5) {
            entityIssues.push({
                entityId: e.id,
                title: titleStr,
                type: "warning",
                category: "relationship",
                message: `Low connectivity: Page has only ${totalLinks} connections (minimum recommended is 5).`
            });
        }
        // 4. Trust Details Checks
        if (!e.reviewer || !e.reviewer.name) {
            entityIssues.push({
                entityId: e.id,
                title: titleStr,
                type: "error",
                category: "content",
                message: "Missing reviewer information."
            });
        }
        if (!e.reviewer?.credentials) {
            entityIssues.push({
                entityId: e.id,
                title: titleStr,
                type: "warning",
                category: "content",
                message: "Reviewer credentials not specified."
            });
        }
        if (entityIssues.length === 0) {
            healthyCount++;
        }
        else {
            issues.push(...entityIssues);
        }
    });
    return {
        totalEntities: entities.length,
        healthyCount,
        totalIssuesCount: issues.length,
        issues,
        brokenRelationships,
        missingCitations
    };
}
// Runnable console execution script
if (require.main === module) {
    const summary = runEditorialAudit();
    console.log("=== CLINICAL EDITORIAL QUALITY AUDIT SUMMARY ===");
    console.log(`Total Entities Audited: ${summary.totalEntities}`);
    console.log(`Healthy Pages: ${summary.healthyCount} / ${summary.totalEntities} (${Math.round((summary.healthyCount / summary.totalEntities) * 100)}%)`);
    console.log(`Total Quality Issues Found: ${summary.totalIssuesCount}`);
    console.log(`Broken Graph Links: ${summary.brokenRelationships.length}`);
    console.log(`Missing Citations: ${summary.missingCitations.length}`);
    if (summary.issues.length > 0) {
        console.log("\n--- Top Quality Issues Found ---");
        summary.issues.slice(0, 15).forEach(iss => {
            console.log(`[${iss.type.toUpperCase()}] ${iss.entityId} (${iss.title}) - [${iss.category}]: ${iss.message}`);
        });
    }
}
