"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptLegacyJethwaniRubric = adaptLegacyJethwaniRubric;
const canonicalTypes_1 = require("../engine/canonicalTypes");
const remedyNormalizer_1 = require("../engine/remedyNormalizer");
const EXPLICIT_FIELDS = new Set([
    "rubricId",
    "id",
    "name",
    "title",
    "plainLanguageMeaning",
    "classicalWording",
    "section",
    "category",
    "subCategory",
    "subcategory",
    "organSystem",
    "clinicalPriority",
    "createdDate",
    "modifiedDate",
    "lastUpdated",
    "status",
    "searchWeight",
    "indexWeights",
    "keywords",
    "clinicalKeywords",
    "synonyms",
    "patientExpressions",
    "relatedSymptoms",
    "relatedDiseases",
    "clinicalConditions",
    "modalities",
    "miasms",
    "miasmaticWeight",
    "intensityScale",
    "polarity",
    "mentalEmotionalState",
    "physicalGenerals",
    "thermalState",
    "thirstPattern",
    "foodCravings",
    "aggravations",
    "ameliorations",
    "clinicalNotes",
    "confidence",
    "author",
    "reviewer",
    "remedies",
    "relatedRemedies",
    "researchCitation",
    "source",
    "description",
    "slug",
    "parentRubricId",
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
function mapPolarity(value) {
    if (value === "positive" || value === "negative" || value === "unknown")
        return value;
    return undefined;
}
function sourceGrade(value) {
    const numeric = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
}
function adaptRemedyRecord(remedies) {
    if (!remedies || typeof remedies !== "object" || Array.isArray(remedies))
        return [];
    return Object.entries(remedies).map(([remedyId, grade]) => {
        const originalGrade = sourceGrade(grade);
        return {
            remedyId: (0, remedyNormalizer_1.normalizeRemedyId)(remedyId),
            sourceRemedyId: remedyId,
            grade: (0, canonicalTypes_1.normalizeRemedyGrade)(grade),
            sourceGrade: originalGrade,
            polarity: originalGrade !== undefined && originalGrade < 0 ? "negative" : "positive",
            isEliminating: originalGrade !== undefined && originalGrade < 0,
        };
    });
}
function adaptRelatedRemedies(relatedRemedies) {
    if (!Array.isArray(relatedRemedies))
        return [];
    return relatedRemedies
        .filter((remedy) => !!remedy && typeof remedy === "object" && !Array.isArray(remedy))
        .map((remedy) => {
        const remedyId = typeof remedy.remedyId === "string" ? remedy.remedyId : String(remedy.remedyId || "");
        const originalGrade = sourceGrade(remedy.grade);
        return {
            remedyId: (0, remedyNormalizer_1.normalizeRemedyId)(remedyId),
            sourceRemedyId: remedyId || undefined,
            remedyName: stringValue(remedy.remedyName),
            grade: (0, canonicalTypes_1.normalizeRemedyGrade)(remedy.grade),
            sourceGrade: originalGrade,
            polarity: originalGrade !== undefined && originalGrade < 0 ? "negative" : mapPolarity(remedy.polarity) || "positive",
            isEliminating: originalGrade !== undefined && originalGrade < 0,
            confidence: numberValue(remedy.confidence),
            keynoteReason: stringValue(remedy.keynoteReason),
            sourceReference: stringValue(remedy.sourceReference),
            clinicalExperienceWeight: numberValue(remedy.clinicalExperienceWeight),
            contraindicationNotes: stringValue(remedy.contraindicationNotes),
            differentialNotes: stringValue(remedy.differentialNotes),
            notes: stringValue(remedy.notes),
            metadata: collectMetadata(remedy, new Set([
                "remedyId",
                "remedyName",
                "grade",
                "confidence",
                "keynoteReason",
                "sourceReference",
                "clinicalExperienceWeight",
                "contraindicationNotes",
                "differentialNotes",
                "notes",
                "polarity",
            ])),
        };
    });
}
function collectMetadata(record, explicitFields = EXPLICIT_FIELDS) {
    return Object.fromEntries(Object.entries(record).filter(([field]) => !explicitFields.has(field)));
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
function mapCategory(value) {
    const normalized = typeof value === "string" ? value.toLowerCase() : "";
    if (normalized.includes("section"))
        return "source_section";
    if (normalized.includes("mental"))
        return "mental_emotional";
    if (normalized.includes("miasm"))
        return "miasmatic_load";
    return "unknown";
}
function adaptLegacyJethwaniRubric(record) {
    const warnings = [];
    const id = typeof record.id === "string" && record.id.trim()
        ? record.id
        : typeof record.rubricId === "string" && record.rubricId.trim()
            ? record.rubricId
            : "unknown-jethwani-rubric";
    const title = typeof record.title === "string" && record.title.trim()
        ? record.title
        : typeof record.name === "string" && record.name.trim()
            ? record.name
            : id;
    if (id === "unknown-jethwani-rubric")
        warnings.push("missing_id");
    if (title === id)
        warnings.push("missing_title");
    const remedies = [
        ...adaptRemedyRecord(record.remedies),
        ...adaptRelatedRemedies(record.relatedRemedies),
    ];
    if (remedies.length === 0)
        warnings.push("missing_remedies");
    const citation = record.researchCitation && typeof record.researchCitation === "object"
        ? {
            sourceName: String(record.researchCitation.source || "Dr. Jethwani Clinical Repertory"),
            detail: String(record.researchCitation.detail || ""),
        }
        : undefined;
    return {
        id,
        title,
        sourceTitle: stringValue(record.name),
        source: "jethwani",
        sourceId: id,
        rubricId: stringValue(record.rubricId),
        chapter: stringValue(record.section) || stringValue(record.category),
        section: stringValue(record.section),
        slug: stringValue(record.slug),
        parentId: stringOrNull(record.parentRubricId) ?? null,
        parentRubricId: stringOrNull(record.parentRubricId),
        description: stringValue(record.description),
        plainLanguageMeaning: stringValue(record.plainLanguageMeaning),
        classicalWording: stringValue(record.classicalWording),
        category: mapCategory(record.category || record.section),
        sourceCategory: stringValue(record.category),
        subCategory: stringValue(record.subCategory) || stringValue(record.subcategory),
        subcategory: stringValue(record.subcategory) || stringValue(record.subCategory),
        clinicalSystem: mapClinicalSystem(record.organSystem),
        organSystem: stringValue(record.organSystem),
        clinicalPriority: stringValue(record.clinicalPriority),
        createdDate: stringValue(record.createdDate),
        modifiedDate: stringValue(record.modifiedDate),
        lastUpdated: stringValue(record.lastUpdated),
        status: record.status === "active" ? "active" : record.status === "archived" ? "archived" : record.status === "custom" ? "custom" : "unknown",
        sourceStatus: stringValue(record.status),
        searchWeight: numberValue(record.searchWeight),
        indexWeights: numberRecord(record.indexWeights),
        synonyms: stringArray(record.synonyms),
        keywords: stringArray(record.keywords),
        clinicalKeywords: stringArray(record.clinicalKeywords),
        patientExpressions: stringArray(record.patientExpressions),
        relatedSymptoms: stringArray(record.relatedSymptoms),
        relatedDiseases: stringArray(record.relatedDiseases),
        clinicalConditions: stringArray(record.clinicalConditions),
        modalities: stringArray(record.modalities),
        miasms: stringArray(record.miasms),
        miasmaticWeight: numberRecord(record.miasmaticWeight),
        intensityScale: numberValue(record.intensityScale),
        polarity: mapPolarity(record.polarity),
        mentalEmotionalState: stringArray(record.mentalEmotionalState),
        physicalGenerals: stringArray(record.physicalGenerals),
        thermalState: record.thermalState === "chilly" || record.thermalState === "warm" || record.thermalState === "ambient" || record.thermalState === "variable" ? record.thermalState : undefined,
        thirstPattern: record.thirstPattern === "thirsty_large" || record.thirstPattern === "thirsty_small" || record.thirstPattern === "thirstless" || record.thirstPattern === "normal" ? record.thirstPattern : undefined,
        foodCravings: stringArray(record.foodCravings),
        aggravations: stringArray(record.aggravations),
        ameliorations: stringArray(record.ameliorations),
        clinicalNotes: stringValue(record.clinicalNotes),
        confidence: numberValue(record.confidence),
        author: stringValue(record.author),
        reviewer: stringValue(record.reviewer),
        remedies,
        citation,
        metadata: collectMetadata(record),
        originalRecord: record,
        warnings,
    };
}
