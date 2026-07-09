"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.benchmarkClinicalSearch = benchmarkClinicalSearch;
const clinicalSearchEngine_1 = require("./clinicalSearchEngine");
const searchIndex_1 = require("./searchIndex");
function percentile(values, percentileRank) {
    if (values.length === 0)
        return 0;
    const sorted = [...values].sort((left, right) => left - right);
    const index = Math.min(sorted.length - 1, Math.ceil((percentileRank / 100) * sorted.length) - 1);
    return sorted[index];
}
function benchmarkClinicalSearch(rubrics, queries) {
    const indexStart = Date.now();
    const index = (0, searchIndex_1.buildCanonicalSearchIndex)(rubrics);
    const indexBuildMs = Date.now() - indexStart;
    const searchDurations = [];
    queries.forEach((query) => {
        const searchStart = Date.now();
        (0, clinicalSearchEngine_1.searchCanonicalRubrics)(index, query, { includeHighlights: false });
        searchDurations.push(Date.now() - searchStart);
    });
    const totalSearchMs = searchDurations.reduce((sum, duration) => sum + duration, 0);
    const averageSearchMs = queries.length === 0 ? 0 : totalSearchMs / queries.length;
    const queriesPerSecond = totalSearchMs === 0 ? queries.length : (queries.length / totalSearchMs) * 1000;
    return {
        queryCount: queries.length,
        documentCount: rubrics.length,
        indexBuildMs,
        totalSearchMs,
        averageSearchMs: Math.round(averageSearchMs * 100) / 100,
        p95SearchMs: percentile(searchDurations, 95),
        queriesPerSecond: Math.round(queriesPerSecond * 100) / 100,
    };
}
