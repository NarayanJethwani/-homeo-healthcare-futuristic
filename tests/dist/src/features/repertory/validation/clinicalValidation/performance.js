"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_PERFORMANCE_RUBRIC_COUNTS = void 0;
exports.runValidationPerformanceBenchmark = runValidationPerformanceBenchmark;
const clinicalRepertorization_1 = require("../../repertorization/clinicalRepertorization");
exports.VALIDATION_PERFORMANCE_RUBRIC_COUNTS = [10, 25, 50, 100, 500, 1000];
function runValidationPerformanceBenchmark(strategyId = "weighted_grades") {
    const benchmark = (0, clinicalRepertorization_1.benchmarkClinicalRepertorization)(strategyId, exports.VALIDATION_PERFORMANCE_RUBRIC_COUNTS);
    return {
        generatedAt: benchmark.generatedAt,
        strategyId: benchmark.strategyId,
        cases: benchmark.cases,
    };
}
