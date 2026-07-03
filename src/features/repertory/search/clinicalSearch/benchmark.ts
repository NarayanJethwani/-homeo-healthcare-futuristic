import { CanonicalRubric } from "../../engine/canonicalTypes";
import { searchCanonicalRubrics } from "./clinicalSearchEngine";
import { buildCanonicalSearchIndex } from "./searchIndex";
import { SearchBenchmarkResult } from "./types";

function percentile(values: number[], percentileRank: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.ceil((percentileRank / 100) * sorted.length) - 1);
  return sorted[index];
}

export function benchmarkClinicalSearch(rubrics: CanonicalRubric[], queries: string[]): SearchBenchmarkResult {
  const indexStart = Date.now();
  const index = buildCanonicalSearchIndex(rubrics);
  const indexBuildMs = Date.now() - indexStart;
  const searchDurations: number[] = [];

  queries.forEach((query) => {
    const searchStart = Date.now();
    searchCanonicalRubrics(index, query, { includeHighlights: false });
    searchDurations.push(Date.now() - searchStart);
  });

  const totalSearchMs = searchDurations.reduce((sum, duration) => sum + duration, 0);
  const averageSearchMs = queries.length === 0 ? 0 : totalSearchMs / queries.length;
  const queriesPerSecond = totalSearchMs === 0 ? queries.length : (queries.length / totalSearchMs) * 1000;

  return {
    queryCount: queries.length,
    documentCount: rubrics.length,
    indexBuildMs,
    totalSearchMs,
    averageSearchMs: Math.round(averageSearchMs * 100) / 100,
    p95SearchMs: percentile(searchDurations, 95),
    queriesPerSecond: Math.round(queriesPerSecond * 100) / 100,
  };
}
