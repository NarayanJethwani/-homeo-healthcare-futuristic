"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRelatedRubrics = findRelatedRubrics;
exports.expandRubricSynonymsUsingHierarchy = expandRubricSynonymsUsingHierarchy;
exports.searchRelatedByHierarchyTokens = searchRelatedByHierarchyTokens;
const searchIndex_1 = require("../../search/clinicalSearch/searchIndex");
const synonyms_1 = require("../../search/clinicalSearch/synonyms");
const tokenizer_1 = require("../../search/clinicalSearch/tokenizer");
function addReason(reasons, type, detail, weight) {
    reasons.push({ type, detail, weight });
}
function intersect(left, right) {
    const rightSet = new Set(right || []);
    return (left || []).filter((item) => rightSet.has(item));
}
function textTokens(rubric) {
    return (0, tokenizer_1.tokenize)([
        rubric.title,
        rubric.classicalWording,
        rubric.plainLanguageMeaning,
        rubric.description,
        ...(rubric.keywords || []),
        ...(rubric.clinicalKeywords || []),
        ...(rubric.synonyms || []),
        ...(rubric.patientExpressions || []),
        ...(rubric.modalities || []),
    ].filter(Boolean).join(" ")).tokens;
}
function sharedTokenCount(source, candidate) {
    const sourceTokens = new Set(textTokens(source));
    return Array.from(new Set(textTokens(candidate))).filter((token) => sourceTokens.has(token)).length;
}
function findRelatedRubrics(index, rubricId, limit = 10) {
    const sourceNode = index.nodesById.get(rubricId);
    if (!sourceNode)
        return [];
    const sourceRubric = sourceNode.rubric;
    const results = [];
    index.nodesById.forEach((candidateNode, candidateId) => {
        if (candidateId === rubricId)
            return;
        const reasons = [];
        if (sourceNode.parentId && candidateId === sourceNode.parentId)
            addReason(reasons, "parent", "Parent rubric", 100);
        if (sourceNode.childIds.includes(candidateId))
            addReason(reasons, "child", "Child rubric", 95);
        if (sourceNode.siblingIds.includes(candidateId))
            addReason(reasons, "sibling", "Sibling rubric", 75);
        if (sourceNode.crossReferenceIds.includes(candidateId) || candidateNode.crossReferenceIds.includes(rubricId)) {
            addReason(reasons, "cross_reference", "Explicit cross-reference", 90);
        }
        if (sourceRubric.category === candidateNode.rubric.category)
            addReason(reasons, "shared_category", "Shared category", 20);
        if (sourceRubric.clinicalSystem === candidateNode.rubric.clinicalSystem) {
            addReason(reasons, "shared_clinical_system", "Shared clinical system", 18);
        }
        intersect(sourceRubric.modalities, candidateNode.rubric.modalities).forEach((modality) => {
            addReason(reasons, "shared_modality", `Shared modality: ${modality}`, 24);
        });
        intersect(sourceRubric.miasms, candidateNode.rubric.miasms).forEach((miasm) => {
            addReason(reasons, "shared_miasm", `Shared miasm: ${miasm}`, 16);
        });
        intersect(sourceRubric.clinicalConditions, candidateNode.rubric.clinicalConditions).forEach((condition) => {
            addReason(reasons, "shared_condition", `Shared condition: ${condition}`, 28);
        });
        const tokenOverlap = sharedTokenCount(sourceRubric, candidateNode.rubric);
        if (tokenOverlap > 0)
            addReason(reasons, "same_path", `${tokenOverlap} shared clinical text token(s)`, Math.min(tokenOverlap * 4, 24));
        if (reasons.length === 0)
            return;
        const score = Math.round(reasons.reduce((sum, reason) => sum + reason.weight, 0) * 100) / 100;
        results.push({
            rubric: candidateNode.rubric,
            score,
            reasons,
            breadcrumb: candidateNode.breadcrumb,
        });
    });
    return results
        .sort((left, right) => right.score - left.score || left.rubric.title.localeCompare(right.rubric.title))
        .slice(0, limit);
}
function expandRubricSynonymsUsingHierarchy(index, rubricId) {
    const node = index.nodesById.get(rubricId);
    if (!node)
        return [];
    const hierarchyTerms = [
        ...node.path.map((segment) => segment.label),
        ...node.siblingIds.flatMap((id) => {
            const siblingPath = index.nodesById.get(id)?.path || [];
            const lastSegment = siblingPath[siblingPath.length - 1];
            return lastSegment ? [lastSegment.label] : [];
        }),
    ];
    const tokens = (0, tokenizer_1.tokenize)(hierarchyTerms.join(" ")).tokens;
    const expansions = (0, synonyms_1.expandTokensWithSynonyms)(tokens, (0, synonyms_1.buildSynonymMap)());
    return Array.from(new Set([
        ...tokens,
        ...Array.from(expansions.values()).flatMap((set) => Array.from(set)),
    ])).sort();
}
function searchRelatedByHierarchyTokens(index, rubrics, query) {
    const searchIndex = (0, searchIndex_1.buildCanonicalSearchIndex)(rubrics);
    const queryTokens = (0, tokenizer_1.tokenize)(query).tokens;
    const directIds = new Set();
    queryTokens.forEach((token) => {
        index.idsByPathToken.get(token)?.forEach((id) => directIds.add(id));
    });
    searchIndex.documents.forEach((document) => {
        queryTokens.forEach((token) => {
            if (document.allTokens.has(token))
                directIds.add(document.rubric.id);
        });
    });
    return Array.from(directIds);
}
