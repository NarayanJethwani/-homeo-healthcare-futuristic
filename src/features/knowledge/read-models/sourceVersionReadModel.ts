export type KnowledgeSourceVersionInput = {
  sourceVersionId: string;
  rightsApproved: boolean;
  editorialApproved: boolean;
  reviewExpiresAt?: string;
  withdrawnAt?: string;
  citationComplete: boolean;
  graphValidationPassed: boolean;
};

export type KnowledgeSourceVersionReadModel = KnowledgeSourceVersionInput & {
  reviewCurrent: boolean;
  searchEligible: boolean;
  graphEligible: boolean;
  exclusionReasons: string[];
};

export function buildKnowledgeSourceVersionReadModel(
  input: KnowledgeSourceVersionInput,
  now = new Date(),
): KnowledgeSourceVersionReadModel {
  const reviewCurrent = !input.reviewExpiresAt || new Date(input.reviewExpiresAt).getTime() > now.getTime();
  const reasons: string[] = [];
  if (!input.rightsApproved) reasons.push("rights-unapproved");
  if (!input.editorialApproved) reasons.push("editorial-unapproved");
  if (!reviewCurrent) reasons.push("review-expired");
  if (input.withdrawnAt) reasons.push("withdrawn");
  if (!input.citationComplete) reasons.push("citation-incomplete");
  const searchEligible = reasons.length === 0;
  const graphEligible = searchEligible && input.graphValidationPassed;
  if (searchEligible && !input.graphValidationPassed) reasons.push("graph-validation-failed");
  return { ...input, reviewCurrent, searchEligible, graphEligible, exclusionReasons: reasons };
}

