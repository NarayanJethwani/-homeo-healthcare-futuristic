"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKnowledgeArticleForAI = getKnowledgeArticleForAI;
exports.getRelatedKnowledgeNodes = getRelatedKnowledgeNodes;
exports.getArticlesDueForReview = getArticlesDueForReview;
exports.getCitationHealthSummary = getCitationHealthSummary;
exports.getEditorialStatusSummary = getEditorialStatusSummary;
const index_1 = require("../index");
const entityRelationships_1 = require("../graph/entityRelationships");
/**
 * AI Knowledge Layer retrieval and governance service.
 * Prepares knowledge node metadata for model-readiness, semantic search, and RAG ingestion.
 */
/**
 * Resolves a fully populated, AI-ready payload for an article.
 */
function getKnowledgeArticleForAI(id) {
    if (!id)
        return null;
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const entity = entities.find(e => e.id === id || e.slug === id);
    if (!entity)
        return null;
    const content = entity.content || {};
    const references = content.references || [];
    // Extract related nodes grouped by type
    const relatedRemedies = [];
    const relatedSymptoms = [];
    const relatedDiseases = [];
    const relationships = entityRelationships_1.KNOWLEDGE_RELATIONSHIPS.filter(r => r && r.source === entity.id);
    relationships.forEach(r => {
        if (!r.target)
            return;
        const target = entities.find(e => e.id === r.target);
        if (target) {
            if (target.entityType === "remedy")
                relatedRemedies.push(target.slug || "");
            else if (target.entityType === "symptom")
                relatedSymptoms.push(target.slug || "");
            else if (target.entityType === "disease")
                relatedDiseases.push(target.slug || "");
        }
    });
    // Prepare a dense text chunk suitable for vector embedding models
    const bodyText = typeof content.overview === "string"
        ? content.overview
        : typeof content.description === "string"
            ? content.description
            : "";
    const entityTitleStr = entity.title ? (typeof entity.title === "string" ? entity.title : (entity.title.en || "")) : "";
    const entitySummaryStr = entity.summary ? (typeof entity.summary === "string" ? entity.summary : (entity.summary.en || "")) : "";
    const keywordsList = entity.tags || [];
    const embeddingText = `
Entity: ${entityTitleStr} (${entity.entityType || "unknown"})
Summary: ${entitySummaryStr}
Clinical Details: ${bodyText}
Clinical Pearl: ${entity.clinicalPearl || ""}
Keywords: ${keywordsList.join(", ")}
  `.trim();
    return {
        id: entity.id,
        slug: entity.slug || "",
        entityType: entity.entityType || "unknown",
        title: entityTitleStr,
        audience: entity.audience || "patient",
        patientSummary: entity.aiKnowledge?.patientSummary || entitySummaryStr,
        practitionerSummary: entity.aiKnowledge?.practitionerSummary || entity.aiReadiness?.clinicalSummary || entitySummaryStr,
        educationalSummary: entity.aiKnowledge?.educationalSummary || entitySummaryStr,
        clinicalImportance: entity.clinicalImportance || entity.clinicalPearl || "",
        remediesRelated: relatedRemedies,
        symptomsRelated: relatedSymptoms,
        diseasesRelated: relatedDiseases,
        embeddingText,
        keywords: keywordsList,
        citationIds: references,
        lastClinicalReview: entity.lastClinicalReview || entity.versionInfo?.reviewed || entity.versionInfo?.created || "",
        reviewStatus: entity.reviewStatus || "needs-review",
        isCornerstone: !!entity.isCornerstone
    };
}
/**
 * Performs a graph traversal to find directly related entities.
 */
function getRelatedKnowledgeNodes(id) {
    if (!id)
        return [];
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const entity = entities.find(e => e.id === id || e.slug === id);
    if (!entity)
        return [];
    const relationships = entityRelationships_1.KNOWLEDGE_RELATIONSHIPS.filter(r => r && (r.source === entity.id || r.target === entity.id));
    return relationships.map(rel => {
        const isSource = rel.source === entity.id;
        const neighborId = isSource ? rel.target : rel.source;
        const neighbor = entities.find(e => e.id === neighborId);
        return {
            targetId: neighborId || "",
            targetTitle: neighbor ? (typeof neighbor.title === "string" ? neighbor.title : (neighbor.title.en || "")) : (neighborId || ""),
            relationType: rel.relation || "related"
        };
    });
}
/**
 * Returns articles that are past their review deadlines or flagged for update.
 */
function getArticlesDueForReview() {
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const now = new Date();
    return entities.filter(e => {
        if (e.reviewStatus === "update-required" || e.reviewStatus === "needs-review") {
            return true;
        }
        if (e.nextClinicalReview) {
            return new Date(e.nextClinicalReview) <= now;
        }
        return false;
    });
}
/**
 * Calculates a summary of citation health metrics across the corpus.
 */
function getCitationHealthSummary() {
    const entities = (0, index_1.getAllKnowledgeEntities)();
    let excellent = 0;
    let good = 0;
    let needsAttention = 0;
    let critical = 0;
    entities.forEach(e => {
        const refs = e.content?.references || [];
        if (refs.length >= 3)
            excellent++;
        else if (refs.length >= 1)
            good++;
        else {
            if (e.isCornerstone) {
                critical++;
            }
            else {
                needsAttention++;
            }
        }
    });
    return { excellent, good, needsAttention, critical };
}
/**
 * Counts entities by their review and governance statuses.
 */
function getEditorialStatusSummary() {
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const summary = {
        draft: 0,
        "needs-review": 0,
        "clinically-reviewed": 0,
        "references-needed": 0,
        "update-required": 0,
        archived: 0
    };
    entities.forEach(e => {
        // Default fallback
        const status = e.reviewStatus || "needs-review";
        if (status in summary) {
            summary[status]++;
        }
        else {
            summary[status] = (summary[status] || 0) + 1;
        }
    });
    return summary;
}
