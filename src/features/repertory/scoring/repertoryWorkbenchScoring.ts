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

export type WorkbenchSensitivityMode = "current" | "equal-case-importance" | "without-multipliers";

export type WorkbenchRemedyContribution = {
  rubricId: string;
  rubricName: string;
  chapter: string;
  source?: Rubric["source"];
  sourceGrade: number;
  caseImportance: number;
  multiplier: number;
  contribution: number;
  covered: boolean;
  scoringEnabled: boolean;
  occurrenceOnly: boolean;
  citation?: string;
};

function resolveWeights(
  selected: SelectedWorkbenchRubric,
  sensitivityMode: WorkbenchSensitivityMode,
): { caseImportance: number; multiplier: number } {
  if (selected.rubric.scoringMode === "occurrence") {
    return { caseImportance: 1, multiplier: 1 };
  }
  return {
    caseImportance: sensitivityMode === "equal-case-importance" ? 1 : selected.grade,
    multiplier: sensitivityMode === "without-multipliers" ? 1 : (selected.weightMultiplier || 1),
  };
}

export function calculateWorkbenchRemedyRankings(
  selectedRubrics: SelectedWorkbenchRubric[],
  sensitivityMode: WorkbenchSensitivityMode = "current",
): WorkbenchRemedyRanking[] {
  const remedyTotals = new Map<string, { coverage: number; score: number }>();

  for (const selected of selectedRubrics) {
    const { rubric } = selected;
    if (!isRubricScoringEnabled(rubric)) continue;

    const { caseImportance, multiplier } = resolveWeights(selected, sensitivityMode);

    for (const [remedy, remedyGrade] of Object.entries(rubric.remedies)) {
      if (remedyGrade < 0) continue;
      const current = remedyTotals.get(remedy) || { coverage: 0, score: 0 };
      current.coverage += 1;
      current.score += remedyGrade * caseImportance * multiplier;
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

export function calculateWorkbenchRemedyContributions(
  selectedRubrics: SelectedWorkbenchRubric[],
  remedy: string,
  sensitivityMode: WorkbenchSensitivityMode = "current",
): WorkbenchRemedyContribution[] {
  return selectedRubrics.map((selected) => {
    const { rubric } = selected;
    const scoringEnabled = isRubricScoringEnabled(rubric);
    const occurrenceOnly = rubric.scoringMode === "occurrence";
    const sourceGrade = rubric.remedies[remedy] || 0;
    const { caseImportance, multiplier } = resolveWeights(selected, sensitivityMode);
    return {
      rubricId: rubric.id,
      rubricName: rubric.name,
      chapter: rubric.chapter,
      source: rubric.source,
      sourceGrade,
      caseImportance,
      multiplier,
      contribution: scoringEnabled ? sourceGrade * caseImportance * multiplier : 0,
      covered: sourceGrade > 0,
      scoringEnabled,
      occurrenceOnly,
      citation: rubric.citation,
    };
  });
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
