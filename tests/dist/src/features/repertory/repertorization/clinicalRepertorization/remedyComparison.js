"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareRemedies = compareRemedies;
function rankingById(result, remedyId) {
    return result.rankings.find((ranking) => ranking.remedyId === remedyId) || null;
}
function rubricIds(ranking) {
    return Array.from(new Set(ranking.contributions.map((contribution) => contribution.rubricId)));
}
function strongest(contributions, limit) {
    return [...contributions].sort((left, right) => right.strategyContribution - left.strategyContribution).slice(0, limit);
}
function weakest(contributions, limit) {
    return [...contributions].sort((left, right) => left.strategyContribution - right.strategyContribution).slice(0, limit);
}
function compareRemedies(result, remedyIds, limit = 3) {
    const rankings = remedyIds
        .map((remedyId) => rankingById(result, remedyId))
        .filter((ranking) => ranking !== null);
    const rubricIdSets = rankings.map((ranking) => new Set(rubricIds(ranking)));
    const sharedRubricIds = rubricIdSets.length === 0
        ? []
        : Array.from(rubricIdSets[0]).filter((rubricId) => rubricIdSets.every((set) => set.has(rubricId)));
    const uniqueRubricIdsByRemedy = {};
    const strongestRubricsByRemedy = {};
    const weakestRubricsByRemedy = {};
    const clinicalDifferences = [];
    rankings.forEach((ranking) => {
        const ownRubricIds = rubricIds(ranking);
        const otherRubricIds = new Set(rankings
            .filter((other) => other.remedyId !== ranking.remedyId)
            .flatMap((other) => rubricIds(other)));
        uniqueRubricIdsByRemedy[ranking.remedyId] = ownRubricIds.filter((rubricId) => !otherRubricIds.has(rubricId));
        strongestRubricsByRemedy[ranking.remedyId] = strongest(ranking.contributions, limit);
        weakestRubricsByRemedy[ranking.remedyId] = weakest(ranking.contributions, limit);
        clinicalDifferences.push(`${ranking.remedyId}: ${ranking.matchedRubricCount} matched, ${ranking.missingRubricIds.length} missing, score ${ranking.totalScore}.`);
    });
    return {
        remedyIds: rankings.map((ranking) => ranking.remedyId),
        sharedRubricIds,
        uniqueRubricIdsByRemedy,
        strongestRubricsByRemedy,
        weakestRubricsByRemedy,
        clinicalDifferences,
    };
}
