"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runV2ClinicalLiveEngine = runV2ClinicalLiveEngine;
const firestoreRubricAdapter_1 = require("../adapters/firestoreRubricAdapter");
const searchIndex_1 = require("../search/clinicalSearch/searchIndex");
const clinicalSearchEngine_1 = require("../search/clinicalSearch/clinicalSearchEngine");
const clinicalRubricIntelligence_1 = require("../intelligence/clinicalRubricIntelligence");
const clinicalRepertorization_1 = require("../repertorization/clinicalRepertorization");
const types_1 = require("./types");
function keepByFilters(record, filters) {
    if (!record || typeof record !== "object")
        return false;
    const rubric = record;
    if (filters.category && filters.category !== "All" && rubric.category !== filters.category)
        return false;
    if (filters.organSystem && filters.organSystem !== "All" && rubric.organSystem !== filters.organSystem)
        return false;
    if (filters.miasm && filters.miasm !== "All" && (!Array.isArray(rubric.miasms) || !rubric.miasms.includes(filters.miasm)))
        return false;
    if (filters.remedy && filters.remedy !== "All") {
        const remedies = rubric.remedies;
        if (!remedies || typeof remedies !== "object" || Array.isArray(remedies))
            return false;
        if (remedies[filters.remedy] === undefined)
            return false;
    }
    return true;
}
function snapshotRubric(rubric, extra = {}) {
    return {
        id: rubric.id,
        title: rubric.title,
        source: rubric.source,
        category: rubric.sourceCategory || rubric.category,
        organSystem: rubric.organSystem || rubric.clinicalSystem,
        breadcrumb: extra.breadcrumb,
        score: extra.score,
        matchedFields: extra.matchedFields,
        synonymMatchCount: extra.synonymMatchCount,
        hierarchyMatchCount: extra.hierarchyMatchCount,
    };
}
function snapshotRanking(ranking, index) {
    return {
        ...ranking,
        rank: index + 1,
    };
}
function rankingSnapshotFromResult(result) {
    return result.rankings.slice(0, 10).map((ranking, index) => snapshotRanking({
        remedyId: ranking.remedyId,
        remedyName: ranking.remedyName,
        rank: index + 1,
        totalScore: ranking.totalScore,
        weightedScore: ranking.weightedScore,
        normalizedScore: ranking.normalizedScore,
        confidenceScore: ranking.confidenceScore,
        matchedRubricCount: ranking.matchedRubricCount,
        missingRubricIds: ranking.missingRubricIds,
        whyRanked: ranking.whyRanked,
        contributions: ranking.contributions.slice(0, 10).map((contribution) => ({
            rubricId: contribution.rubricId,
            rubricTitle: contribution.rubricTitle,
            grade: contribution.grade,
            rubricWeight: contribution.rubricWeight,
            symptomImportance: contribution.symptomImportance,
            strategyContribution: contribution.strategyContribution,
            percentageContribution: contribution.percentageContribution,
        })),
    }, index));
}
function runV2ClinicalLiveEngine(input) {
    const filters = input.filters || {};
    const filteredCandidates = input.candidateRubrics.filter((rubric) => keepByFilters(rubric, filters));
    const canonicalRubrics = filteredCandidates.map((record) => (0, firestoreRubricAdapter_1.adaptFirestoreRubric)(record));
    const searchStarted = Date.now();
    const index = (0, searchIndex_1.buildCanonicalSearchIndex)(canonicalRubrics);
    const hierarchyIndex = (0, clinicalRubricIntelligence_1.buildRubricHierarchyIndex)(canonicalRubrics);
    const searchResults = input.query
        ? (0, clinicalSearchEngine_1.searchCanonicalRubrics)(index, input.query, { includeHighlights: false, limit: input.limit || 50 })
        : canonicalRubrics.slice(0, input.limit || 50).map((rubric) => ({
            rubric,
            score: 0,
            matches: [],
            matchedFields: [],
            highlights: [],
        }));
    const searchLatencyMs = Date.now() - searchStarted;
    const topRubrics = searchResults.slice(0, 10).map((result) => {
        const breadcrumb = (0, clinicalRubricIntelligence_1.getBreadcrumb)(hierarchyIndex, result.rubric.id);
        return snapshotRubric(result.rubric, {
            score: result.score,
            matchedFields: result.matchedFields,
            synonymMatchCount: result.matches.filter((match) => match.type === "synonym").length,
            hierarchyMatchCount: breadcrumb ? breadcrumb.segments.length : 0,
            breadcrumb: breadcrumb?.displayPath,
        });
    });
    const selectedIds = new Set(input.selectedRubricIds || []);
    const selectedRubrics = input.selectedRubricIds?.length
        ? canonicalRubrics.filter((rubric) => selectedIds.has(rubric.id))
        : searchResults.slice(0, 10).map((result) => result.rubric);
    const repertoryStarted = Date.now();
    const session = (0, clinicalRepertorization_1.createClinicalRepertorizationSession)({
        id: `v2-live-${Date.now()}`,
        rubrics: selectedRubrics,
        strategyId: "weighted_grades",
        metadata: {
            query: input.query,
            filters,
            source: "v2-live-mode",
        },
    });
    const repertorizationResult = (0, clinicalRepertorization_1.repertorizeClinicalSession)(session);
    const repertoryLatencyMs = Date.now() - repertoryStarted;
    const rankings = rankingSnapshotFromResult(repertorizationResult);
    const warnings = selectedRubrics.length === 0
        ? ["No V2 rubrics selected or found for repertorization."]
        : rankings.length === 0
            ? ["No V2 remedy ranking could be produced from the selected rubrics."]
            : [];
    return {
        success: true,
        mode: "v2-live",
        query: input.query,
        filters,
        safetyNotice: types_1.CLINICAL_REVIEW_REQUIRED_NOTICE,
        search: {
            count: searchResults.length,
            latencyMs: searchLatencyMs,
            topRubrics,
            synonymMatches: topRubrics
                .filter((rubric) => (rubric.synonymMatchCount || 0) > 0)
                .map((rubric) => ({ rubricId: rubric.id, matchCount: rubric.synonymMatchCount || 0 })),
        },
        repertorization: {
            latencyMs: repertoryLatencyMs,
            selectedRubricCount: selectedRubrics.length,
            rankings,
            warnings,
            result: repertorizationResult,
        },
        clinicalExplanation: [
            "V2 Clinical mode uses the isolated canonical search, rubric hierarchy, and repertorization engine.",
            "Scores are transparent and require clinician verification.",
            warnings.length > 0 ? warnings.join(" ") : "No V2 engine warnings were generated.",
        ],
    };
}
