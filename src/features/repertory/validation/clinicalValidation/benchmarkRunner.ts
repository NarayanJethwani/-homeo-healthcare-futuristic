import { repertorizeClinicalSession } from "../../repertorization/clinicalRepertorization";
import { benchmarkCaseToSession } from "./caseFactory";
import { verifyExplainabilityForRankings } from "./explainabilityVerifier";
import {
  BenchmarkExpectationResult,
  ClinicalBenchmarkCase,
  ClinicalBenchmarkCaseResult,
  ClinicalBenchmarkRunResult,
} from "./types";

function rankOf(rankings: ClinicalBenchmarkCaseResult["rankings"], remedyId: string): number | null {
  const index = rankings.findIndex((ranking) => ranking.remedyId === remedyId);
  return index >= 0 ? index + 1 : null;
}

function evaluateExpectations(
  benchmarkCase: ClinicalBenchmarkCase,
  rankings: ClinicalBenchmarkCaseResult["rankings"],
): BenchmarkExpectationResult[] {
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

export function runClinicalBenchmarkCase(
  benchmarkCase: ClinicalBenchmarkCase,
  generatedAt = new Date().toISOString(),
): ClinicalBenchmarkCaseResult {
  const session = benchmarkCaseToSession(benchmarkCase, generatedAt);
  const startedAt = Date.now();
  const result = repertorizeClinicalSession(session, [], generatedAt);
  const executionMs = Date.now() - startedAt;
  const expectationResults = evaluateExpectations(benchmarkCase, result.rankings);
  const explainabilityResults = verifyExplainabilityForRankings(result.rankings);
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

export function runClinicalBenchmarkSuite(
  cases: ClinicalBenchmarkCase[],
  runId = `clinical-validation-${Date.now()}`,
  generatedAt = new Date().toISOString(),
): ClinicalBenchmarkRunResult {
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
