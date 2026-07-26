import type { Rubric } from "../../../lib/repertoryData";
import { isRubricScoringEnabled } from "./repertoryScoringPolicy";

export type SelectedWorkbenchRubric = {
  rubric: Rubric;
  grade: number;
  weightMultiplier?: number;
};

export type WorkbenchRemedyRanking = {
  remedy: string;
  coverage: number;
  score: number;
};

export function calculateWorkbenchRemedyRankings(
  selectedRubrics: SelectedWorkbenchRubric[],
): WorkbenchRemedyRanking[] {
  const remedyTotals = new Map<string, { coverage: number; score: number }>();

  for (const { rubric, grade: userWeight, weightMultiplier } of selectedRubrics) {
    if (!isRubricScoringEnabled(rubric)) continue;

    const occurrenceOnly = rubric.scoringMode === "occurrence";
    const effectiveUserWeight = occurrenceOnly ? 1 : userWeight;
    const multiplier = occurrenceOnly ? 1 : (weightMultiplier || 1);

    for (const [remedy, remedyGrade] of Object.entries(rubric.remedies)) {
      if (remedyGrade < 0) continue;
      const current = remedyTotals.get(remedy) || { coverage: 0, score: 0 };
      current.coverage += 1;
      current.score += remedyGrade * effectiveUserWeight * multiplier;
      remedyTotals.set(remedy, current);
    }
  }

  return [...remedyTotals.entries()]
    .map(([remedy, totals]) => ({ remedy, ...totals }))
    .sort((left, right) =>
      right.score - left.score
      || right.coverage - left.coverage
      || left.remedy.localeCompare(right.remedy)
    );
}

export function getTopWorkbenchRemedyColumns(
  selectedRubrics: SelectedWorkbenchRubric[],
  limit = 10,
): string[] {
  return calculateWorkbenchRemedyRankings(selectedRubrics)
    .slice(0, limit)
    .map(({ remedy }) => remedy);
}

export function projectWorkbenchScores(
  selectedRubrics: SelectedWorkbenchRubric[],
  remedyColumns: string[],
): Array<{ remedy: string; coverage: string; score: number }> {
  const scoringRubricCount = selectedRubrics.filter(({ rubric }) => isRubricScoringEnabled(rubric)).length;
  const rankingByRemedy = new Map(
    calculateWorkbenchRemedyRankings(selectedRubrics).map((ranking) => [ranking.remedy, ranking]),
  );

  return remedyColumns.map((remedy) => {
    const ranking = rankingByRemedy.get(remedy);
    return {
      remedy,
      coverage: `${ranking?.coverage || 0}/${scoringRubricCount}`,
      score: ranking?.score || 0,
    };
  });
}
