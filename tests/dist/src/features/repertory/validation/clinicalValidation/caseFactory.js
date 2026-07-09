"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.benchmarkCaseToSession = benchmarkCaseToSession;
const clinicalRepertorization_1 = require("../../repertorization/clinicalRepertorization");
function toCanonicalRubric(caseRubric) {
    return {
        id: caseRubric.id,
        title: caseRubric.title,
        source: "jethwani",
        category: "unknown",
        clinicalSystem: "unknown",
        status: "active",
        searchWeight: caseRubric.rubricWeight,
        synonyms: [],
        keywords: [],
        modalities: [],
        miasms: [],
        remedies: caseRubric.remedies.map((remedy) => ({
            remedyId: remedy.remedyId,
            remedyName: remedy.remedyName,
            sourceRemedyId: remedy.remedyId,
            grade: remedy.grade,
            sourceGrade: remedy.sourceGrade,
            isEliminating: remedy.isEliminating,
        })),
        metadata: caseRubric.metadata,
        originalRecord: caseRubric,
        warnings: [],
    };
}
function benchmarkCaseToSession(benchmarkCase, createdAt = new Date().toISOString()) {
    const rubrics = benchmarkCase.selectedRubrics.map(toCanonicalRubric);
    const symptomImportance = Object.fromEntries(benchmarkCase.selectedRubrics.map((rubric) => [rubric.id, rubric.symptomImportance || 1]));
    return (0, clinicalRepertorization_1.createClinicalRepertorizationSession)({
        id: benchmarkCase.id,
        rubrics,
        strategyId: benchmarkCase.strategyId || "weighted_grades",
        rubricWeights: benchmarkCase.rubricWeights,
        symptomImportance,
        exclusions: benchmarkCase.exclusions,
        metadata: {
            caseName: benchmarkCase.caseName,
            clinicalNotes: benchmarkCase.clinicalNotes,
            references: benchmarkCase.references,
            ...(benchmarkCase.metadata || {}),
        },
        createdAt,
    });
}
