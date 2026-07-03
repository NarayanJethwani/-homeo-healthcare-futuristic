import { CanonicalRubric } from "../../engine/canonicalTypes";
import { repertorizeClinicalSession } from "./rankingEngine";
import { createClinicalRepertorizationSession } from "./session";
import { ClinicalScoringStrategyId, RepertorizationBenchmarkResult } from "./types";

const BENCHMARK_REMEDIES = ["Acon", "Ars", "Nux-v", "Lyc", "Sulph", "Calc", "Puls", "Nat-m", "Phos", "Sep"];

function memoryUsageBytes(): number {
  const maybeProcess = globalThis as typeof globalThis & { process?: { memoryUsage?: () => { heapUsed: number } } };
  return maybeProcess.process?.memoryUsage?.().heapUsed || 0;
}

function syntheticRubric(index: number): CanonicalRubric {
  const remedies = BENCHMARK_REMEDIES.slice(0, 5 + (index % 5)).map((remedyId, remedyIndex) => ({
    remedyId,
    sourceRemedyId: remedyId,
    grade: ((remedyIndex + index) % 4 + 1) as 1 | 2 | 3 | 4,
  }));

  return {
    id: `benchmark-rubric-${index}`,
    title: `Benchmark rubric ${index}`,
    source: "jethwani",
    category: "unknown",
    clinicalSystem: "unknown",
    status: "active",
    searchWeight: 1 + (index % 3) * 0.25,
    synonyms: [],
    keywords: [`benchmark-${index}`],
    modalities: [],
    miasms: [],
    remedies,
    originalRecord: { benchmark: true, index },
    warnings: [],
  };
}

function isRankingStable(firstTopRemedyId: string | undefined, secondTopRemedyId: string | undefined): boolean {
  return firstTopRemedyId === secondTopRemedyId;
}

export function benchmarkClinicalRepertorization(
  strategyId: ClinicalScoringStrategyId = "weighted_grades",
  rubricCounts = [10, 50, 100, 500, 1000],
): RepertorizationBenchmarkResult {
  const cases = rubricCounts.map((rubricCount) => {
    const rubrics = Array.from({ length: rubricCount }, (_, index) => syntheticRubric(index));
    const session = createClinicalRepertorizationSession({
      id: `benchmark-session-${rubricCount}`,
      rubrics,
      strategyId,
    });
    const memoryBefore = memoryUsageBytes();
    const startedAt = Date.now();
    const first = repertorizeClinicalSession(session);
    const executionMs = Date.now() - startedAt;
    const memoryAfter = memoryUsageBytes();
    const second = repertorizeClinicalSession(session);
    const topRemedyId = first.rankings[0]?.remedyId;

    return {
      rubricCount,
      executionMs,
      memoryDeltaBytes: memoryAfter && memoryBefore ? memoryAfter - memoryBefore : 0,
      rankingStable: isRankingStable(topRemedyId, second.rankings[0]?.remedyId),
      topRemedyId,
    };
  });

  return {
    strategyId,
    cases,
    generatedAt: new Date().toISOString(),
  };
}
