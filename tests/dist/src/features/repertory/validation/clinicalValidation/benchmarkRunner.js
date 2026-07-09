"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runClinicalBenchmarkCase = runClinicalBenchmarkCase;
exports.runClinicalBenchmarkSuite = runClinicalBenchmarkSuite;
const clinicalRepertorization_1 = require("../../repertorization/clinicalRepertorization");
const caseFactory_1 = require("./caseFactory");
const explainabilityVerifier_1 = require("./explainabilityVerifier");
function rankOf(rankings, remedyId) {
    const index = rankings.findIndex((ranking) => ranking.remedyId === remedyId);
    return index >= 0 ? index + 1 : null;
}
function evaluateExpectations(benchmarkCase, rankings) {
    return benchmarkCase.expectedTopRemedies.map((expected) => {
        const actualRank = rankOf(rankings, expected.remedyId);
        const ranking = rankings.find((item) => item.remedyId === expected.remedyId);
        const minRank = expected.minRank || 1;
        const maxRank = expected.maxRank + benchmarkCase.expectedRankingTolerance;
        const rankPassed = actualRank !== null && actualRank >= minRank && actualRank <= maxRank;
        const scorePassed = expected.minimumScore === undefined || ((ranking?.totalScore || 0) >= expected.minimumScore);
        return {
            remedyId: expected.remedyId,
            expectedRange: [minRank, maxRank],
            actualRank,
            passed: rankPassed && scorePassed,
            score: ranking?.totalScore,
        };
    });
}
function runClinicalBenchmarkCase(benchmarkCase, generatedAt = new Date().toISOString()) {
    const session = (0, caseFactory_1.benchmarkCaseToSession)(benchmarkCase, generatedAt);
    const startedAt = Date.now();
    const result = (0, clinicalRepertorization_1.repertorizeClinicalSession)(session, [], generatedAt);
    const executionMs = Date.now() - startedAt;
    const expectationResults = evaluateExpectations(benchmarkCase, result.rankings);
    const explainabilityResults = (0, explainabilityVerifier_1.verifyExplainabilityForRankings)(result.rankings);
    const passed = expectationResults.every((expectation) => expectation.passed)
        && explainabilityResults.every((explanation) => explanation.passed);
    return {
        caseId: benchmarkCase.id,
        caseName: benchmarkCase.caseName,
        strategyId: result.strategyId,
        passed,
        executionMs,
        rankings: result.rankings,
        expectationResults,
        explainabilityResults,
        result,
    };
}
function runClinicalBenchmarkSuite(cases, runId = `clinical-validation-${Date.now()}`, generatedAt = new Date().toISOString()) {
    const caseResults = cases.map((benchmarkCase) => runClinicalBenchmarkCase(benchmarkCase, generatedAt));
    const passedCases = caseResults.filter((result) => result.passed).length;
    const totalExecutionMs = caseResults.reduce((sum, result) => sum + result.executionMs, 0);
    return {
        runId,
        generatedAt,
        caseResults,
        passed: passedCases === caseResults.length,
        summary: {
            totalCases: caseResults.length,
            passedCases,
            failedCases: caseResults.length - passedCases,
            averageExecutionMs: caseResults.length === 0 ? 0 : Math.round((totalExecutionMs / caseResults.length) * 100) / 100,
        },
    };
}
