export type ClinicalKnowledgeReference = {
  referenceId: string;
  sourceVersionId: string;
  title: string;
  citation: string;
  route: string;
  editorialApproved: boolean;
  reviewExpiresAt?: string;
  withdrawnAt?: string;
};

export type ClinicalWorkspaceReferenceView = {
  referenceId: string;
  title: string;
  citation: string;
  route: string;
  readOnly: true;
};

export function buildClinicalWorkspaceReference(
  reference: ClinicalKnowledgeReference,
  now = new Date(),
): ClinicalWorkspaceReferenceView | null {
  const current = !reference.reviewExpiresAt
    || new Date(reference.reviewExpiresAt).getTime() > now.getTime();
  const safeRoute = /^\/admin\/knowledge(?:\/|$)/.test(reference.route);
  if (!reference.editorialApproved || !current || reference.withdrawnAt || !safeRoute) return null;
  return {
    referenceId: reference.referenceId,
    title: reference.title,
    citation: reference.citation,
    route: reference.route,
    readOnly: true,
  };
}

