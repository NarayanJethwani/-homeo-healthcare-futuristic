"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainRemedyRanking = explainRemedyRanking;
exports.explainClinicalRepertorization = explainClinicalRepertorization;
function explainRemedyRanking(ranking) {
    const strongest = ranking.contributions[0];
    const summary = strongest
        ? `${ranking.remedyId} ranked with ${ranking.matchedRubricCount} matched rubric(s); strongest rubric was ${strongest.rubricTitle}.`
        : `${ranking.remedyId} ranked without detailed rubric contribution data.`;
    return {
        remedyId: ranking.remedyId,
        summary,
        whyRanked: ranking.whyRanked,
        contributingRubrics: ranking.contributions,
        missingRubricIds: ranking.missingRubricIds,
    };
}
function explainClinicalRepertorization(result) {
    return result.rankings.map(explainRemedyRanking);
}
