"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repertorizeClinicalSession = repertorizeClinicalSession;
const canonicalTypes_1 = require("../../engine/canonicalTypes");
const scoringStrategies_1 = require("./scoringStrategies");
function isExcluded(session, rubricId, remedyId) {
    return session.exclusions.rubricIds.includes(rubricId) || session.exclusions.remedyIds.includes(remedyId);
}
function remedyFrequency(session) {
    const frequency = new Map();
    session.selectedRubrics.forEach((selectedRubric) => {
        selectedRubric.rubric.remedies.forEach((rubricRemedy) => {
            if (rubricRemedy.isEliminating || isExcluded(session, selectedRubric.rubric.id, rubricRemedy.remedyId))
                return;
            frequency.set(rubricRemedy.remedyId, (frequency.get(rubricRemedy.remedyId) || 0) + 1);
        });
    });
    return frequency;
}
function maxPossibleWeightedScore(session) {
    return session.selectedRubrics.reduce((sum, selectedRubric) => (sum + (4 * selectedRubric.rubricWeight * selectedRubric.symptomImportance)), 0);
}
function contributionPercentage(contribution, total) {
    if (total <= 0)
        return 0;
    return Math.round((contribution.strategyContribution / total) * 10000) / 100;
}
function whyRanked(ranking) {
    const strongest = [...ranking.contributions].sort((left, right) => right.strategyContribution - left.strategyContribution)[0];
    const reasons = [
        `Matched ${ranking.matchedRubricCount} rubric(s).`,
        `Total score ${ranking.totalScore}.`,
        `Confidence score ${ranking.confidenceScore}.`,
    ];
    if (strongest) {
        reasons.push(`Strongest contribution: ${strongest.rubricTitle} grade ${strongest.grade}.`);
    }
    if (ranking.missingRubricIds.length > 0) {
        reasons.push(`Missing ${ranking.missingRubricIds.length} selected rubric(s).`);
    }
    return reasons;
}
function buildContext(session) {
    return {
        session,
        remedyFrequencyById: remedyFrequency(session),
        maxPossibleGrade: 4,
    };
}
function buildContribution(selectedRubric, remedyId, strategyContribution) {
    const rubricRemedy = selectedRubric.rubric.remedies.find((remedy) => remedy.remedyId === remedyId);
    if (!rubricRemedy)
        return null;
    const gradeContribution = (0, canonicalTypes_1.getRemedyGradeWeight)(rubricRemedy.grade);
    const weightContribution = selectedRubric.rubricWeight * selectedRubric.symptomImportance;
    return {
        rubricId: selectedRubric.rubric.id,
        rubricTitle: selectedRubric.rubric.title,
        remedyId,
        remedyName: rubricRemedy.remedyName,
        grade: rubricRemedy.grade,
        sourceGrade: rubricRemedy.sourceGrade,
        rubricWeight: selectedRubric.rubricWeight,
        symptomImportance: selectedRubric.symptomImportance,
        gradeContribution,
        weightContribution,
        strategyContribution,
        percentageContribution: 0,
    };
}
function repertorizeClinicalSession(session, customStrategies = [], generatedAt = new Date().toISOString()) {
    const strategy = (0, scoringStrategies_1.getScoringStrategy)(session.strategyId, customStrategies);
    const context = buildContext(session);
    const contributionMap = new Map();
    session.selectedRubrics.forEach((selectedRubric) => {
        selectedRubric.rubric.remedies.forEach((rubricRemedy) => {
            if (rubricRemedy.isEliminating || isExcluded(session, selectedRubric.rubric.id, rubricRemedy.remedyId))
                return;
            const strategyContribution = strategy.score({ selectedRubric, rubricRemedy, context });
            const contribution = buildContribution(selectedRubric, rubricRemedy.remedyId, strategyContribution);
            if (!contribution)
                return;
            if (!contributionMap.has(rubricRemedy.remedyId))
                contributionMap.set(rubricRemedy.remedyId, []);
            contributionMap.get(rubricRemedy.remedyId)?.push(contribution);
        });
    });
    const maxPossible = maxPossibleWeightedScore(session);
    const selectedRubricIds = session.selectedRubrics.map((selectedRubric) => selectedRubric.rubric.id);
    const rankings = Array.from(contributionMap.entries()).map(([remedyId, contributions]) => {
        const totalScore = contributions.reduce((sum, contribution) => sum + contribution.strategyContribution, 0);
        const weightedScore = contributions.reduce((sum, contribution) => (sum + (contribution.gradeContribution * contribution.weightContribution)), 0);
        const matchedRubricIds = contributions.map((contribution) => contribution.rubricId);
        const missingRubricIds = selectedRubricIds.filter((rubricId) => !matchedRubricIds.includes(rubricId));
        const normalizedScore = maxPossible <= 0 ? 0 : Math.round((weightedScore / maxPossible) * 10000) / 100;
        const coverage = selectedRubricIds.length === 0 ? 0 : matchedRubricIds.length / selectedRubricIds.length;
        const confidenceScore = Math.round(((coverage * 0.6) + ((normalizedScore / 100) * 0.4)) * 10000) / 100;
        const contributionsWithPercentages = contributions.map((contribution) => ({
            ...contribution,
            percentageContribution: contributionPercentage(contribution, totalScore),
        }));
        const partialRanking = {
            remedyId,
            remedyName: contributions.find((contribution) => contribution.remedyName)?.remedyName,
            totalScore: Math.round(totalScore * 100) / 100,
            weightedScore: Math.round(weightedScore * 100) / 100,
            normalizedScore,
            confidenceScore,
            matchedRubricCount: matchedRubricIds.length,
            missingRubricIds,
            contributions: contributionsWithPercentages.sort((left, right) => right.strategyContribution - left.strategyContribution),
        };
        return {
            ...partialRanking,
            whyRanked: whyRanked(partialRanking),
        };
    });
    return {
        sessionId: session.id,
        strategyId: strategy.id,
        generatedAt,
        rankings: rankings.sort((left, right) => right.totalScore - left.totalScore || left.remedyId.localeCompare(right.remedyId)),
        selectedRubricCount: session.selectedRubrics.length,
        excludedRemedyIds: session.exclusions.remedyIds,
        excludedRubricIds: session.exclusions.rubricIds,
        metadata: {
            strategyLabel: strategy.label,
            strategyDescription: strategy.description,
        },
    };
}
