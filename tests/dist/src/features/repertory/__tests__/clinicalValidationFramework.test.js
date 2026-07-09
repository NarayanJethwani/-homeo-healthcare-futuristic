"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const clinicalValidation_1 = require("../validation/clinicalValidation");
const firstCaseResult = (0, clinicalValidation_1.runClinicalBenchmarkCase)(clinicalValidation_1.SAMPLE_CLINICAL_BENCHMARK_CASES[0], "2026-07-03T00:00:00.000Z");
assert_1.default.strictEqual(firstCaseResult.caseId, "acute-panic-fear-death");
assert_1.default.strictEqual(firstCaseResult.passed, true);
assert_1.default.strictEqual(firstCaseResult.rankings[0].remedyId, "Acon");
assert_1.default.ok(firstCaseResult.executionMs >= 0);
assert_1.default.ok(firstCaseResult.expectationResults.every((expectation) => expectation.passed));
assert_1.default.ok(firstCaseResult.explainabilityResults.every((explanation) => explanation.passed));
const firstRankingExplanation = (0, clinicalValidation_1.verifyRankingExplainability)(firstCaseResult.rankings[0]);
assert_1.default.strictEqual(firstRankingExplanation.hasWhySelected, true);
assert_1.default.strictEqual(firstRankingExplanation.hasContributingRubrics, true);
assert_1.default.strictEqual(firstRankingExplanation.hasContributingGrades, true);
assert_1.default.strictEqual(firstRankingExplanation.hasWeighting, true);
assert_1.default.strictEqual(firstRankingExplanation.hasConfidence, true);
assert_1.default.strictEqual(firstRankingExplanation.passed, true);
const baseline = (0, clinicalValidation_1.runClinicalBenchmarkSuite)(clinicalValidation_1.SAMPLE_CLINICAL_BENCHMARK_CASES, "baseline-run", "2026-07-03T00:00:00.000Z");
const repeat = (0, clinicalValidation_1.runClinicalBenchmarkSuite)(clinicalValidation_1.SAMPLE_CLINICAL_BENCHMARK_CASES, "repeat-run", "2026-07-03T00:00:00.000Z");
assert_1.default.strictEqual(baseline.passed, true);
assert_1.default.strictEqual(baseline.summary.totalCases, clinicalValidation_1.SAMPLE_CLINICAL_BENCHMARK_CASES.length);
assert_1.default.strictEqual(baseline.summary.failedCases, 0);
const regression = (0, clinicalValidation_1.compareBenchmarkRuns)(baseline, repeat);
assert_1.default.strictEqual(regression.passed, true);
assert_1.default.strictEqual(regression.differences.length, 0);
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
const changedRegression = (0, clinicalValidation_1.compareBenchmarkRuns)(baseline, altered);
assert_1.default.strictEqual(changedRegression.passed, false);
assert_1.default.ok(changedRegression.differences.length > 0);
const performance = (0, clinicalValidation_1.runValidationPerformanceBenchmark)("weighted_grades");
assert_1.default.deepStrictEqual(performance.cases.map((item) => item.rubricCount), [10, 25, 50, 100, 500, 1000]);
assert_1.default.ok(performance.cases.every((item) => item.rankingStable));
console.log("clinicalValidationFramework.test.ts passed");
