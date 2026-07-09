"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareRubricSnapshots = compareRubricSnapshots;
exports.compareRemedyScores = compareRemedyScores;
function rankMap(ids) {
    return new Map(ids.map((id, index) => [id, index + 1]));
}
function compareRubricSnapshots(v1Rubrics, v2Rubrics) {
    const v1Ids = v1Rubrics.map((rubric) => rubric.id);
    const v2Ids = v2Rubrics.map((rubric) => rubric.id);
    const v1Set = new Set(v1Ids);
    const v2Set = new Set(v2Ids);
    const v1Ranks = rankMap(v1Ids);
    const v2Ranks = rankMap(v2Ids);
    const byId = new Map([...v1Rubrics, ...v2Rubrics].map((rubric) => [rubric.id, rubric]));
    const allIds = Array.from(new Set([...v1Ids, ...v2Ids]));
    return {
        commonRubrics: v1Rubrics.filter((rubric) => v2Set.has(rubric.id)),
        v1OnlyRubrics: v1Rubrics.filter((rubric) => !v2Set.has(rubric.id)),
        v2OnlyRubrics: v2Rubrics.filter((rubric) => !v1Set.has(rubric.id)),
        rankingDifferences: allIds.map((rubricId) => {
            const v1Rank = v1Ranks.get(rubricId) || null;
            const v2Rank = v2Ranks.get(rubricId) || null;
            return {
                rubricId,
                title: byId.get(rubricId)?.title,
                v1Rank,
                v2Rank,
                rankDelta: v1Rank !== null && v2Rank !== null ? v2Rank - v1Rank : null,
            };
        }),
    };
}
function compareRemedyScores(v1Rankings, v2Rankings) {
    const v1Scores = new Map(v1Rankings.map((ranking) => [ranking.remedyId, ranking.totalScore]));
    const v2Scores = new Map(v2Rankings.map((ranking) => [ranking.remedyId, ranking.totalScore]));
    return Array.from(new Set([...v1Scores.keys(), ...v2Scores.keys()])).map((remedyId) => {
        const v1Score = v1Scores.get(remedyId);
        const v2Score = v2Scores.get(remedyId);
        return {
            remedyId,
            v1Score,
            v2Score,
            delta: v1Score !== undefined && v2Score !== undefined ? Math.round((v2Score - v1Score) * 100) / 100 : undefined,
        };
    });
}
