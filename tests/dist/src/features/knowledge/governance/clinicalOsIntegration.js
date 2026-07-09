"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKnowledgeLinkForDisease = getKnowledgeLinkForDisease;
exports.getKnowledgeLinkForRemedy = getKnowledgeLinkForRemedy;
exports.getKnowledgeLinkForLabTest = getKnowledgeLinkForLabTest;
exports.getKnowledgeLinkForSymptom = getKnowledgeLinkForSymptom;
exports.getKnowledgeLinkForComparison = getKnowledgeLinkForComparison;
exports.getKnowledgeContextForDisease = getKnowledgeContextForDisease;
exports.getKnowledgeContextForRemedy = getKnowledgeContextForRemedy;
exports.getKnowledgeContextForLabTest = getKnowledgeContextForLabTest;
exports.getKnowledgeContextForSymptom = getKnowledgeContextForSymptom;
exports.getKnowledgeContextForComparison = getKnowledgeContextForComparison;
exports.getClinicalOsKnowledgeBundle = getClinicalOsKnowledgeBundle;
const index_1 = require("../index");
const CLINICAL_DISCLAIMER = "Clinical Education Reference: This content is compiled for educational purposes and practitioner reference. It represents verified Materia Medica and homeopathic literature, but clinical decisions must be customized to the individual patient presentation.";
/**
 * Helper to look up an entity and resolve its URL path.
 * NOTE: The Knowledge Platform remains the single source of truth for all clinical and therapeutic metadata.
 */
function resolveLink(id, expectedType) {
    if (!id) {
        return {
            url: "",
            title: "Knowledge article pending",
            found: false
        };
    }
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const entity = entities.find(e => e.id === id || e.slug === id || e.slug.toLowerCase() === id.toLowerCase());
    if (!entity || entity.entityType !== expectedType) {
        return {
            url: "",
            title: "Knowledge article pending",
            found: false
        };
    }
    // Resolve matching category URLs
    let categoryPath = "hubs";
    if (entity.entityType === "disease")
        categoryPath = "diseases";
    else if (entity.entityType === "symptom")
        categoryPath = "symptoms";
    else if (entity.entityType === "remedy")
        categoryPath = "remedies";
    else if (entity.entityType === "lab-test")
        categoryPath = "lab-tests";
    const titleStr = entity.title ? (typeof entity.title === "string" ? entity.title : (entity.title.en || "Homeopathic Knowledge Base")) : "Homeopathic Knowledge Base";
    return {
        url: `/knowledge/${categoryPath}/${entity.slug || ""}`,
        title: titleStr,
        found: true
    };
}
/**
 * Disease page link for patient timelines and clinical history charts.
 */
function getKnowledgeLinkForDisease(diseaseId) {
    return resolveLink(diseaseId, "disease");
}
/**
 * Remedy overview link for treatment planners, repertory charts, and prescriptions.
 */
function getKnowledgeLinkForRemedy(remedyId) {
    return resolveLink(remedyId, "remedy");
}
/**
 * Lab interpretation link for diagnostic investigations panels.
 */
function getKnowledgeLinkForLabTest(labTestId) {
    return resolveLink(labTestId, "lab-test");
}
/**
 * Symptom overview link for high-density symptom matrix panels and case audits.
 */
function getKnowledgeLinkForSymptom(symptomId) {
    return resolveLink(symptomId, "symptom");
}
/**
 * Comparison link for differential analysis and remedy selection grids.
 */
function getKnowledgeLinkForComparison(comparisonId) {
    if (!comparisonId) {
        return {
            url: "",
            title: "Knowledge article pending",
            found: false
        };
    }
    // Comparisons do not have standalone IDs in the base KnowledgeEntity, but are referenced by slug
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const comparison = entities.find(e => e.entityType === "case-study" && (e.id === comparisonId || e.slug === comparisonId || e.slug.toLowerCase() === comparisonId.toLowerCase()));
    if (!comparison) {
        return {
            url: "",
            title: "Knowledge article pending",
            found: false
        };
    }
    const titleStr = comparison.title ? (typeof comparison.title === "string" ? comparison.title : (comparison.title.en || `Comparison: ${comparisonId}`)) : `Comparison: ${comparisonId}`;
    return {
        url: `/knowledge/case-studies/${comparison.slug || ""}`,
        title: titleStr,
        found: true
    };
}
/**
 * Helper to build a safe fallback/not-found context bundle.
 */
function buildFallbackContext(id, entityType) {
    return {
        id,
        slug: id,
        title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)}: ${id}`,
        entityType,
        url: "",
        found: false,
        editorialStatus: "needs-review",
        citationHealth: "Pending Review",
        isCornerstone: false,
        tags: [],
        disclaimer: CLINICAL_DISCLAIMER
    };
}
/**
 * Helper to transform a KnowledgeEntity into a KnowledgeContextBundle.
 */
function transformToBundle(entity) {
    const titleStr = entity.title ? (typeof entity.title === "string" ? entity.title : (entity.title.en || "Untitled")) : "Untitled";
    return {
        id: entity.id,
        slug: entity.slug,
        title: titleStr,
        entityType: entity.entityType,
        url: (0, index_1.getEntityUrl)(entity.entityType, entity.slug),
        found: true,
        editorialStatus: entity.editorialStatus,
        citationHealth: entity.citationHealth || "Pending Review",
        isCornerstone: !!entity.isCornerstone,
        icdCode: entity.aiReadiness?.icd,
        snomedCode: entity.aiReadiness?.snomed,
        clinicalSummary: entity.aiReadiness?.clinicalSummary || entity.summary?.en,
        patientSummary: entity.aiReadiness?.patientSummary,
        studentSummary: entity.aiReadiness?.studentSummary,
        tags: entity.tags || [],
        disclaimer: CLINICAL_DISCLAIMER
    };
}
/**
 * Context bundle for active diseases.
 */
function getKnowledgeContextForDisease(diseaseId) {
    if (!diseaseId)
        return buildFallbackContext("unknown", "disease");
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const entity = entities.find(e => e.entityType === "disease" && (e.id === diseaseId || e.slug === diseaseId || e.slug.toLowerCase() === diseaseId.toLowerCase()));
    return entity ? transformToBundle(entity) : buildFallbackContext(diseaseId, "disease");
}
/**
 * Context bundle for active remedies.
 */
function getKnowledgeContextForRemedy(remedyId) {
    if (!remedyId)
        return buildFallbackContext("unknown", "remedy");
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const entity = entities.find(e => e.entityType === "remedy" && (e.id === remedyId || e.slug === remedyId || e.slug.toLowerCase() === remedyId.toLowerCase()));
    return entity ? transformToBundle(entity) : buildFallbackContext(remedyId, "remedy");
}
/**
 * Context bundle for laboratory investigations.
 */
function getKnowledgeContextForLabTest(labTestId) {
    if (!labTestId)
        return buildFallbackContext("unknown", "lab-test");
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const entity = entities.find(e => e.entityType === "lab-test" && (e.id === labTestId || e.slug === labTestId || e.slug.toLowerCase() === labTestId.toLowerCase()));
    return entity ? transformToBundle(entity) : buildFallbackContext(labTestId, "lab-test");
}
/**
 * Context bundle for symptom entities.
 */
function getKnowledgeContextForSymptom(symptomId) {
    if (!symptomId)
        return buildFallbackContext("unknown", "symptom");
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const entity = entities.find(e => e.entityType === "symptom" && (e.id === symptomId || e.slug === symptomId || e.slug.toLowerCase() === symptomId.toLowerCase()));
    return entity ? transformToBundle(entity) : buildFallbackContext(symptomId, "symptom");
}
/**
 * Context bundle for case studies / differential comparisons.
 */
function getKnowledgeContextForComparison(comparisonId) {
    if (!comparisonId)
        return buildFallbackContext("unknown", "case-study");
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const entity = entities.find(e => e.entityType === "case-study" && (e.id === comparisonId || e.slug === comparisonId || e.slug.toLowerCase() === comparisonId.toLowerCase()));
    return entity ? transformToBundle(entity) : buildFallbackContext(comparisonId, "case-study");
}
/**
 * Consolidates lookups into a unified clinical context bundle package.
 */
function getClinicalOsKnowledgeBundle(input) {
    const result = {
        diseases: {},
        remedies: {},
        symptoms: {},
        labTests: {},
        comparisons: {}
    };
    if (input.diseases) {
        input.diseases.forEach(id => {
            result.diseases[id] = getKnowledgeContextForDisease(id);
        });
    }
    if (input.remedies) {
        input.remedies.forEach(id => {
            result.remedies[id] = getKnowledgeContextForRemedy(id);
        });
    }
    if (input.symptoms) {
        input.symptoms.forEach(id => {
            result.symptoms[id] = getKnowledgeContextForSymptom(id);
        });
    }
    if (input.labTests) {
        input.labTests.forEach(id => {
            result.labTests[id] = getKnowledgeContextForLabTest(id);
        });
    }
    if (input.comparisons) {
        input.comparisons.forEach(id => {
            result.comparisons[id] = getKnowledgeContextForComparison(id);
        });
    }
    return result;
}
