import { RemedyRanking } from "../../repertorization/clinicalRepertorization";
import { ExplainabilityVerificationResult } from "./types";

export function verifyRankingExplainability(ranking: RemedyRanking): ExplainabilityVerificationResult {
  const hasWhySelected = ranking.whyRanked.length > 0;
  const hasContributingRubrics = ranking.contributions.length > 0;
  const hasContributingGrades = ranking.contributions.every((contribution) => contribution.grade > 0);
  const hasWeighting = ranking.contributions.every((contribution) => (
    contribution.rubricWeight >= 0 && contribution.symptomImportance >= 0
  ));
  const hasConfidence = Number.isFinite(ranking.confidenceScore);

  return {
    remedyId: ranking.remedyId,
    hasWhySelected,
    hasContributingRubrics,
    hasContributingGrades,
    hasWeighting,
    hasConfidence,
    passed: hasWhySelected && hasContributingRubrics && hasContributingGrades && hasWeighting && hasConfidence,
  };
}

export function verifyExplainabilityForRankings(rankings: RemedyRanking[]): ExplainabilityVerificationResult[] {
  return rankings.map(verifyRankingExplainability);
}
