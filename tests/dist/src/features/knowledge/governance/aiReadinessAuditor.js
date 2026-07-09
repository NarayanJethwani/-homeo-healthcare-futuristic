"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAIReadinessAudit = runAIReadinessAudit;
const index_1 = require("../index");
const entityRelationships_1 = require("../graph/entityRelationships");
function runAIReadinessAudit() {
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const issues = [];
    const entityIds = new Set();
    const entitySlugs = new Set();
    // 1. Audit entities format, duplicates, metadata completeness
    entities.forEach(e => {
        // Check ID duplicates
        if (entityIds.has(e.id)) {
            issues.push({
                severity: "critical",
                category: "duplicate_id",
                description: `Duplicate entity ID detected: ${e.id}`,
                entityId: e.id
            });
        }
        entityIds.add(e.id);
        // Check slug duplicates (qualified by entity type)
        const qualifiedSlug = `${e.entityType}/${e.slug}`;
        if (entitySlugs.has(qualifiedSlug)) {
            issues.push({
                severity: "critical",
                category: "duplicate_id",
                description: `Duplicate slug path detected: /knowledge/${e.entityType}/${e.slug}`,
                entityId: e.id
            });
        }
        entitySlugs.add(qualifiedSlug);
        // Check ID Format compliance
        const idRegex = /^[RDSL]\d{4}$/;
        if (["disease", "remedy", "symptom", "lab-test"].includes(e.entityType) && !idRegex.test(e.id)) {
            issues.push({
                severity: "warning",
                category: "id_format",
                description: `Non-standard Entity ID format: '${e.id}' (Expected format: e.g. R0001, D0001, S0001, L0001)`,
                entityId: e.id
            });
        }
        // Check metadata fields
        if (!e.title.en) {
            issues.push({
                severity: "critical",
                category: "empty_metadata",
                description: "Missing English title definition.",
                entityId: e.id
            });
        }
        if (!e.summary.en) {
            issues.push({
                severity: "warning",
                category: "empty_metadata",
                description: "Missing summary description.",
                entityId: e.id
            });
        }
    });
    // 2. Audit Relationships graph integrity
    entityRelationships_1.KNOWLEDGE_RELATIONSHIPS.forEach(rel => {
        // Check source exists
        if (!entityIds.has(rel.source)) {
            issues.push({
                severity: "critical",
                category: "broken_relationship",
                description: `Broken link: source entity ID '${rel.source}' does not exist in registry database.`,
                entityId: rel.source
            });
        }
        // Check target exists
        if (!entityIds.has(rel.target)) {
            issues.push({
                severity: "critical",
                category: "broken_relationship",
                description: `Broken link: target entity ID '${rel.target}' does not exist in registry database.`,
                entityId: rel.target
            });
        }
    });
    // 3. Compute readiness index
    const criticalCount = issues.filter(i => i.severity === "critical").length;
    const warningCount = issues.filter(i => i.severity === "warning").length;
    const score = Math.max(0, 100 - (criticalCount * 15) - (warningCount * 3));
    const passed = criticalCount === 0;
    return {
        timestamp: new Date().toISOString(),
        passed,
        score,
        totalEntitiesCount: entities.length,
        totalRelationshipsCount: entityRelationships_1.KNOWLEDGE_RELATIONSHIPS.length,
        issues
    };
}
