"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCanonicalSearchIndex = buildCanonicalSearchIndex;
const tokenizer_1 = require("./tokenizer");
const FIELD_WEIGHTS = {
    title: 8,
    classicalWording: 7,
    plainLanguageMeaning: 6,
    description: 4,
    keywords: 7,
    clinicalKeywords: 7,
    synonyms: 5,
    patientExpressions: 5,
    modalities: 4,
    aggravations: 4,
    ameliorations: 4,
    clinicalConditions: 5,
    organSystem: 3,
    category: 3,
    remedies: 2,
};
function joinValues(values) {
    return values
        .flatMap((value) => Array.isArray(value) ? value : value ? [value] : [])
        .filter(Boolean)
        .join(" ");
}
function remedyText(rubric) {
    return rubric.remedies
        .flatMap((remedy) => [remedy.remedyId, remedy.sourceRemedyId, remedy.remedyName])
        .filter((value) => typeof value === "string" && value.length > 0)
        .join(" ");
}
function buildField(field, text) {
    const tokens = (0, tokenizer_1.tokenize)(text).tokens;
    if (tokens.length === 0)
        return null;
    return {
        field,
        text,
        tokens,
        weight: FIELD_WEIGHTS[field],
    };
}
function clinicalPriorityWeight(priority) {
    if (priority === "high")
        return 1.3;
    if (priority === "medium")
        return 1.1;
    if (priority === "low")
        return 0.95;
    return 1;
}
function buildDocument(rubric) {
    const fieldCandidates = [
        ["title", rubric.title],
        ["classicalWording", rubric.classicalWording || ""],
        ["plainLanguageMeaning", rubric.plainLanguageMeaning || ""],
        ["description", rubric.description || ""],
        ["keywords", joinValues([rubric.keywords])],
        ["clinicalKeywords", joinValues([rubric.clinicalKeywords])],
        ["synonyms", joinValues([rubric.synonyms])],
        ["patientExpressions", joinValues([rubric.patientExpressions])],
        ["modalities", joinValues([rubric.modalities])],
        ["aggravations", joinValues([rubric.aggravations])],
        ["ameliorations", joinValues([rubric.ameliorations])],
        ["clinicalConditions", joinValues([rubric.clinicalConditions])],
        ["organSystem", rubric.organSystem || rubric.clinicalSystem],
        ["category", joinValues([rubric.sourceCategory, rubric.category, rubric.subCategory, rubric.subcategory])],
        ["remedies", remedyText(rubric)],
    ];
    const fields = fieldCandidates
        .map(([field, text]) => buildField(field, text))
        .filter((field) => field !== null);
    const tokenFrequency = new Map();
    fields.forEach((field) => {
        field.tokens.forEach((token) => {
            tokenFrequency.set(token, (tokenFrequency.get(token) || 0) + 1);
        });
    });
    const relevanceWeight = (rubric.searchWeight || 1) * clinicalPriorityWeight(rubric.clinicalPriority);
    return {
        rubric,
        fields,
        tokenFrequency,
        allTokens: new Set(tokenFrequency.keys()),
        relevanceWeight,
    };
}
function buildCanonicalSearchIndex(rubrics, builtAt = new Date().toISOString()) {
    const documents = rubrics.map(buildDocument);
    const tokenToRubricIds = new Map();
    documents.forEach((document) => {
        document.allTokens.forEach((token) => {
            if (!tokenToRubricIds.has(token))
                tokenToRubricIds.set(token, new Set());
            tokenToRubricIds.get(token)?.add(document.rubric.id);
        });
    });
    return {
        documents,
        tokenToRubricIds,
        builtAt,
    };
}
