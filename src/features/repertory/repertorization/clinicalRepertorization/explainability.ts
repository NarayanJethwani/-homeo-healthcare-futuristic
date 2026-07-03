import { ClinicalRepertorizationResult, RemedyRanking, RubricContribution } from "./types";

export interface RemedyExplanation {
  remedyId: string;
  summary: string;
  whyRanked: string[];
  contributingRubrics: RubricContribution[];
  missingRubricIds: string[];
}

export function explainRemedyRanking(ranking: RemedyRanking): RemedyExplanation {
  const strongest = ranking.contributions[0];
  const summary = strongest
    ? `${ranking.remedyId} ranked with ${ranking.matchedRubricCount} matched rubric(s); strongest rubric was ${strongest.rubricTitle}.`
    : `${ranking.remedyId} ranked without detailed rubric contribution data.`;

  return {
    remedyId: ranking.remedyId,
    summary,
    whyRanked: ranking.whyRanked,
    contributingRubrics: ranking.contributions,
    missingRubricIds: ranking.missingRubricIds,
  };
}

export function explainClinicalRepertorization(result: ClinicalRepertorizationResult): RemedyExplanation[] {
  return result.rankings.map(explainRemedyRanking);
}
