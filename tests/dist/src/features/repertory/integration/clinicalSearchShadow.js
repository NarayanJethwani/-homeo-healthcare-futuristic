"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runClinicalSearchShadowComparison = runClinicalSearchShadowComparison;
const firestoreRubricAdapter_1 = require("../adapters/firestoreRubricAdapter");
const searchIndex_1 = require("../search/clinicalSearch/searchIndex");
const clinicalSearchEngine_1 = require("../search/clinicalSearch/clinicalSearchEngine");
function rubricId(record) {
    if (!record || typeof record !== "object")
        return null;
    const value = record.id || record.rubricId;
    return typeof value === "string" && value.trim() ? value : null;
}
function rubricTitle(record) {
    if (!record || typeof record !== "object")
        return undefined;
    const value = record.name || record.title;
    return typeof value === "string" ? value : undefined;
}
function rankMap(ids) {
    return new Map(ids.map((id, index) => [id, index + 1]));
}
function shouldKeepByFilters(record, filters) {
    if (!record || typeof record !== "object")
        return false;
    const rubric = record;
    if (filters.category !== "All" && rubric.category !== filters.category)
        return false;
    if (filters.organSystem !== "All" && rubric.organSystem !== filters.organSystem)
        return false;
    if (filters.miasm !== "All" && (!Array.isArray(rubric.miasms) || !rubric.miasms.includes(filters.miasm)))
        return false;
    if (filters.remedy !== "All") {
        const remedies = rubric.remedies;
        if (!remedies || typeof remedies !== "object" || Array.isArray(remedies))
            return false;
        if (remedies[filters.remedy] === undefined)
            return false;
    }
    return true;
}
function rankingDifferences(v1Ids, v2Ids) {
    const v1Ranks = rankMap(v1Ids);
    const v2Ranks = rankMap(v2Ids);
    const allIds = Array.from(new Set([...v1Ids, ...v2Ids]));
    return allIds.slice(0, 50).map((id) => {
        const v1Rank = v1Ranks.get(id) || null;
        const v2Rank = v2Ranks.get(id) || null;
        return {
            rubricId: id,
            v1Rank,
            v2Rank,
            rankDelta: v1Rank !== null && v2Rank !== null ? v2Rank - v1Rank : null,
        };
    });
}
function snapshotV1(records) {
    return records.slice(0, 10).map((record) => ({
        id: rubricId(record) || "unknown",
        title: rubricTitle(record),
    }));
}
function logMetrics(metrics) {
    console.info("[repertory-v2-search-shadow]", JSON.stringify(metrics));
}
function runClinicalSearchShadowComparison(input) {
    const v2Start = Date.now();
    try {
        const filteredCandidates = input.candidateRubrics.filter((rubric) => shouldKeepByFilters(rubric, input.filters));
        const canonicalRubrics = filteredCandidates.map((record) => (0, firestoreRubricAdapter_1.adaptFirestoreRubric)(record));
        const adapterWarningCount = canonicalRubrics.reduce((sum, rubric) => sum + rubric.warnings.length, 0);
        const index = (0, searchIndex_1.buildCanonicalSearchIndex)(canonicalRubrics);
        const v2Results = input.query
            ? (0, clinicalSearchEngine_1.searchCanonicalRubrics)(index, input.query, { includeHighlights: false, limit: 100 })
            : canonicalRubrics.slice(0, 100).map((rubric) => ({
                rubric,
                score: 0,
                matches: [],
                matchedFields: [],
                highlights: [],
            }));
        const v1Ids = input.v1Results.map(rubricId).filter((id) => id !== null);
        const v2Ids = v2Results.map((result) => result.rubric.id);
        const v1Set = new Set(v1Ids);
        const v2Set = new Set(v2Ids);
        const matchedRubricIds = v1Ids.filter((id) => v2Set.has(id));
        const missingRubricIds = v1Ids.filter((id) => !v2Set.has(id));
        const additionalRubricIds = v2Ids.filter((id) => !v1Set.has(id));
        const synonymMatches = v2Results
            .map((result) => ({
            rubricId: result.rubric.id,
            matchCount: result.matches.filter((match) => match.type === "synonym").length,
        }))
            .filter((item) => item.matchCount > 0);
        logMetrics({
            query: input.query,
            filters: input.filters,
            v1ExecutionMs: v2Start - input.startedAt,
            v2ExecutionMs: Date.now() - v2Start,
            v1Count: v1Ids.length,
            v2Count: v2Ids.length,
            matchedRubricIds: matchedRubricIds.slice(0, 50),
            missingRubricIds: missingRubricIds.slice(0, 50),
            additionalRubricIds: additionalRubricIds.slice(0, 50),
            rankingDifferences: rankingDifferences(v1Ids, v2Ids),
            synonymMatches: synonymMatches.slice(0, 50),
            searchScoreDifferences: v2Results.slice(0, 50).map((result) => ({
                rubricId: result.rubric.id,
                v2Score: result.score,
            })),
            topV1: snapshotV1(input.v1Results),
            topV2: v2Results.slice(0, 10).map((result) => ({
                id: result.rubric.id,
                title: result.rubric.title,
                score: result.score,
                synonymMatchCount: result.matches.filter((match) => match.type === "synonym").length,
            })),
            adapterWarningCount,
        });
    }
    catch (error) {
        logMetrics({
            query: input.query,
            filters: input.filters,
            v1ExecutionMs: v2Start - input.startedAt,
            v2ExecutionMs: Date.now() - v2Start,
            v1Count: input.v1Results.length,
            v2Count: 0,
            matchedRubricIds: [],
            missingRubricIds: [],
            additionalRubricIds: [],
            rankingDifferences: [],
            synonymMatches: [],
            searchScoreDifferences: [],
            topV1: snapshotV1(input.v1Results),
            topV2: [],
            adapterWarningCount: 0,
            error: error instanceof Error ? error.message : String(error),
        });
    }
}
