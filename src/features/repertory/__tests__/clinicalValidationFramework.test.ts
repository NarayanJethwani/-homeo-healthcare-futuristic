import assert from "assert";
import {
  compareBenchmarkRuns,
  runClinicalBenchmarkCase,
  runClinicalBenchmarkSuite,
  runValidationPerformanceBenchmark,
  SAMPLE_CLINICAL_BENCHMARK_CASES,
  verifyRankingExplainability,
} from "../validation/clinicalValidation";

const firstCaseResult = runClinicalBenchmarkCase(
  SAMPLE_CLINICAL_BENCHMARK_CASES[0],
  "2026-07-03T00:00:00.000Z",
);

assert.strictEqual(firstCaseResult.caseId, "acute-panic-fear-death");
assert.strictEqual(firstCaseResult.passed, true);
assert.strictEqual(firstCaseResult.rankings[0].remedyId, "Acon");
assert.ok(firstCaseResult.executionMs >= 0);
assert.ok(firstCaseResult.expectationResults.every((expectation) => expectation.passed));
assert.ok(firstCaseResult.explainabilityResults.every((explanation) => explanation.passed));

const firstRankingExplanation = verifyRankingExplainability(firstCaseResult.rankings[0]);
assert.strictEqual(firstRankingExplanation.hasWhySelected, true);
assert.strictEqual(firstRankingExplanation.hasContributingRubrics, true);
assert.strictEqual(firstRankingExplanation.hasContributingGrades, true);
assert.strictEqual(firstRankingExplanation.hasWeighting, true);
assert.strictEqual(firstRankingExplanation.hasConfidence, true);
assert.strictEqual(firstRankingExplanation.passed, true);

const baseline = runClinicalBenchmarkSuite(
  SAMPLE_CLINICAL_BENCHMARK_CASES,
  "baseline-run",
  "2026-07-03T00:00:00.000Z",
);
const repeat = runClinicalBenchmarkSuite(
  SAMPLE_CLINICAL_BENCHMARK_CASES,
  "repeat-run",
  "2026-07-03T00:00:00.000Z",
);

assert.strictEqual(baseline.passed, true);
assert.strictEqual(baseline.summary.totalCases, SAMPLE_CLINICAL_BENCHMARK_CASES.length);
assert.strictEqual(baseline.summary.failedCases, 0);

const regression = compareBenchmarkRuns(baseline, repeat);
assert.strictEqual(regression.passed, true);
assert.strictEqual(regression.differences.length, 0);

const altered = {
  ...repeat,
  runId: "altered-run",
  caseResults: repeat.caseResults.map((caseResult, index) => index === 0
    ? {
        ...caseResult,
        rankings: [...caseResult.rankings].reverse(),
      }
    : caseResult),
};
const changedRegression = compareBenchmarkRuns(baseline, altered);
assert.strictEqual(changedRegression.passed, false);
assert.ok(changedRegression.differences.length > 0);

const performance = runValidationPerformanceBenchmark("weighted_grades");
assert.deepStrictEqual(performance.cases.map((item) => item.rubricCount), [10, 25, 50, 100, 500, 1000]);
assert.ok(performance.cases.every((item) => item.rankingStable));

console.log("clinicalValidationFramework.test.ts passed");
