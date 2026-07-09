"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptFirestoreRubric = adaptFirestoreRubric;
const canonicalTypes_1 = require("../engine/canonicalTypes");
const remedyNormalizer_1 = require("../engine/remedyNormalizer");
const EXPLICIT_FIELDS = new Set([
    "id",
    "name",
    "slug",
    "parentRubricId",
    "description",
    "category",
    "subcategory",
    "organSystem",
    "clinicalPriority",
    "createdDate",
    "modifiedDate",
    "status",
    "searchWeight",
    "indexWeights",
    "keywords",
    "synonyms",
    "clinicalConditions",
    "modalities",
    "miasms",
    "remedies",
    "researchCitation",
]);
function stringArray(value) {
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function stringValue(value) {
    return typeof value === "string" ? value : undefined;
}
function numberValue(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function stringOrNull(value) {
    if (value === null)
        return null;
    return stringValue(value);
}
function numberRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value))
        return undefined;
    const entries = Object.entries(value).filter((entry) => (typeof entry[1] === "number" && Number.isFinite(entry[1])));
    return entries.length ? Object.fromEntries(entries) : undefined;
}
function sourceGrade(value) {
    const numeric = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
}
function mapRemedyPolarity(value) {
    const grade = sourceGrade(value);
    return grade !== undefined && grade < 0 ? "negative" : "positive";
}
function collectMetadata(record) {
    return Object.fromEntries(Object.entries(record).filter(([field]) => !EXPLICIT_FIELDS.has(field)));
}
function mapCategory(value) {
    const normalized = typeof value === "string" ? value.toLowerCase() : "";
    if (normalized.includes("section"))
        return "source_section";
    if (normalized.includes("mental"))
        return "mental_emotional";
    if (normalized.includes("miasm"))
        return "miasmatic_load";
    if (normalized.includes("digestive") || normalized.includes("gi"))
        return "digestive";
    if (normalized.includes("skin"))
        return "skin";
    return "unknown";
}
function mapClinicalSystem(value) {
    const normalized = typeof value === "string" ? value.toLowerCase() : "";
    if (normalized.includes("psych"))
        return "psychology_psychiatry";
    if (normalized.includes("gastro"))
        return "gastrointestinal";
    if (normalized.includes("resp"))
        return "respiratory";
    if (normalized.includes("skin") || normalized.includes("integumentary"))
        return "skin_integumentary";
    if (normalized.includes("endo"))
        return "endocrine";
    if (normalized.includes("musculo"))
        return "musculoskeletal";
    if (normalized.includes("cardio"))
        return "cardiovascular";
    if (normalized.includes("general"))
        return "generalities";
    return "unknown";
}
function adaptFirestoreRubric(record) {
    const warnings = [];
    const id = typeof record.id === "string" && record.id.trim() ? record.id : "unknown-firestore-rubric";
    const title = typeof record.name === "string" && record.name.trim() ? record.name : id;
    if (id === "unknown-firestore-rubric")
        warnings.push("missing_id");
    if (title === id)
        warnings.push("missing_title");
    const remedies = record.remedies && typeof record.remedies === "object" && !Array.isArray(record.remedies)
        ? Object.entries(record.remedies).map(([remedyId, grade]) => ({
            remedyId: (0, remedyNormalizer_1.normalizeRemedyId)(remedyId),
            sourceRemedyId: remedyId,
            grade: (0, canonicalTypes_1.normalizeRemedyGrade)(grade),
            sourceGrade: sourceGrade(grade),
            polarity: mapRemedyPolarity(grade),
            isEliminating: sourceGrade(grade) !== undefined && sourceGrade(grade) < 0,
        }))
        : [];
    if (remedies.length === 0)
        warnings.push("missing_remedies");
    const citation = record.researchCitation && typeof record.researchCitation === "object"
        ? {
            sourceName: String(record.researchCitation.source || "Firestore rubric"),
            detail: String(record.researchCitation.detail || ""),
        }
        : undefined;
    return {
        id,
        title,
        sourceTitle: stringValue(record.name),
        source: "firestore",
        sourceId: id,
        chapter: stringValue(record.category),
        slug: stringValue(record.slug),
        parentId: stringOrNull(record.parentRubricId) ?? null,
        parentRubricId: stringOrNull(record.parentRubricId),
        description: stringValue(record.description),
        category: mapCategory(record.category),
        sourceCategory: stringValue(record.category),
        subCategory: stringValue(record.subcategory),
        subcategory: stringValue(record.subcategory),
        clinicalSystem: mapClinicalSystem(record.organSystem),
        organSystem: stringValue(record.organSystem),
        clinicalPriority: stringValue(record.clinicalPriority),
        createdDate: stringValue(record.createdDate),
        modifiedDate: stringValue(record.modifiedDate),
        status: record.status === "active" ? "active" : record.status === "archived" ? "archived" : record.status === "custom" ? "custom" : "unknown",
        sourceStatus: stringValue(record.status),
        searchWeight: numberValue(record.searchWeight),
        indexWeights: numberRecord(record.indexWeights),
        synonyms: stringArray(record.synonyms),
        keywords: stringArray(record.keywords),
        clinicalConditions: stringArray(record.clinicalConditions),
        modalities: stringArray(record.modalities),
        miasms: stringArray(record.miasms),
        remedies,
        citation,
        metadata: collectMetadata(record),
        originalRecord: record,
        warnings,
    };
}
