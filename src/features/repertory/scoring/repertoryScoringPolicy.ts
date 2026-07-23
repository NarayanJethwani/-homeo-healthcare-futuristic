import type { Rubric } from "../../../lib/repertoryData";

export function isRubricScoringEnabled(rubric: Rubric): boolean {
  if (rubric.source === "clarke") {
    return rubric.scoringMode === "occurrence"
      && rubric.occurrenceScoringEnabled === true
      && Object.keys(rubric.remedies).length > 0;
  }
  return rubric.scoringEnabled !== false;
}
