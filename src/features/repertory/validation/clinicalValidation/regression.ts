import {
  ClinicalBenchmarkRunResult,
  RegressionComparisonResult,
  RegressionDifference,
} from "./types";

function rankAndScore(run: ClinicalBenchmarkRunResult, caseId: string, remedyId: string): { rank: number | null; score?: number } {
  const caseResult = run.caseResults.find((result) => result.caseId === caseId);
  if (!caseResult) return { rank: null };
  const rankingIndex = caseResult.rankings.findIndex((ranking) => ranking.remedyId === remedyId);
  if (rankingIndex < 0) return { rank: null };
  return {
    rank: rankingIndex + 1,
    score: caseResult.rankings[rankingIndex].totalScore,
  };
}

export function compareBenchmarkRuns(
  previous: ClinicalBenchmarkRunResult,
  current: ClinicalBenchmarkRunResult,
  allowedScoreDelta = 0.01,
): RegressionComparisonResult {
  const differences: RegressionDifference[] = [];

  current.caseResults.forEach((currentCase) => {
    const remedyIds = new Set([
      ...currentCase.rankings.map((ranking) => ranking.remedyId),
      ...(previous.caseResults.find((item) => item.caseId === currentCase.caseId)?.rankings || []).map((ranking) => ranking.remedyId),
    ]);

    remedyIds.forEach((remedyId) => {
      const previousValue = rankAndScore(previous, currentCase.caseId, remedyId);
      const currentValue = rankAndScore(current, currentCase.caseId, remedyId);
      const scoreDelta = Math.round(((currentValue.score || 0) - (previousValue.score || 0)) * 100) / 100;
      const rankChanged = previousValue.rank !== currentValue.rank;

      if (rankChanged || Math.abs(scoreDelta) > allowedScoreDelta) {
        differences.push({
          caseId: currentCase.caseId,
          remedyId,
          previousRank: previousValue.rank,
          currentRank: currentValue.rank,
          previousScore: previousValue.score,
          currentScore: currentValue.score,
          rankChanged,
          scoreDelta,
        });
      }
    });
  });

  return {
    previousRunId: previous.runId,
    currentRunId: current.runId,
    passed: differences.length === 0,
    differences,
  };
}
