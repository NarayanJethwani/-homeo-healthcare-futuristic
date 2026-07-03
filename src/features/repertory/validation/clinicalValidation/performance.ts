import { benchmarkClinicalRepertorization } from "../../repertorization/clinicalRepertorization";
import { ClinicalScoringStrategyId } from "../../repertorization/clinicalRepertorization/types";
import { ValidationPerformanceReport } from "./types";

export const VALIDATION_PERFORMANCE_RUBRIC_COUNTS = [10, 25, 50, 100, 500, 1000];

export function runValidationPerformanceBenchmark(
  strategyId: ClinicalScoringStrategyId = "weighted_grades",
): ValidationPerformanceReport {
  const benchmark = benchmarkClinicalRepertorization(strategyId, VALIDATION_PERFORMANCE_RUBRIC_COUNTS);

  return {
    generatedAt: benchmark.generatedAt,
    strategyId: benchmark.strategyId,
    cases: benchmark.cases,
  };
}
