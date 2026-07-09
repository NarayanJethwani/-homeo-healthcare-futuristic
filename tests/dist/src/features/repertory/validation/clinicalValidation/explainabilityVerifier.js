"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRankingExplainability = verifyRankingExplainability;
exports.verifyExplainabilityForRankings = verifyExplainabilityForRankings;
function verifyRankingExplainability(ranking) {
    const hasWhySelected = ranking.whyRanked.length > 0;
    const hasContributingRubrics = ranking.contributions.length > 0;
    const hasContributingGrades = ranking.contributions.every((contribution) => contribution.grade > 0);
    const hasWeighting = ranking.contributions.every((contribution) => (contribution.rubricWeight >= 0 && contribution.symptomImportance >= 0));
    const hasConfidence = Number.isFinite(ranking.confidenceScore);
    return {
        remedyId: ranking.remedyId,
        hasWhySelected,
        hasContributingRubrics,
        hasContributingGrades,
        hasWeighting,
        hasConfidence,
        passed: hasWhySelected && hasContributingRubrics && hasContributingGrades && hasWeighting && hasConfidence,
    };
}
function verifyExplainabilityForRankings(rankings) {
    return rankings.map(verifyRankingExplainability);
}
