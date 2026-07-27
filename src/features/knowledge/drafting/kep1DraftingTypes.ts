export type KEP1DraftEntityType =
  | "disease"
  | "symptom"
  | "remedy"
  | "lab-test"
  | "faq"
  | "research"
  | "case-study";

export type KEP1DraftClaimType =
  | "definition"
  | "diagnosis"
  | "risk"
  | "treatment"
  | "prognosis"
  | "safety"
  | "emergency"
  | "laboratory-interpretation"
  | "traditional-use";

export type KEP1DraftEvidenceStatus =
  | "supported"
  | "partially-supported"
  | "traditional-description"
  | "insufficient-evidence"
  | "unsupported";

export interface KEP1DraftPassage {
  passageId: string;
  locator: string;
  text: string;
  contentSha256: string;
}

export interface KEP1DraftClaim {
  claimId: string;
  text: string;
  claimType: KEP1DraftClaimType;
  evidenceStatus: KEP1DraftEvidenceStatus;
  sourcePassageIds: string[];
  requiresClinicalReview: true;
}

export interface KEP1DraftEvidenceProfile {
  evidenceLevel:
    | "Level-A"
    | "Level-B"
    | "Level-C"
    | "Traditional-Literature";
  evidenceSummary: string;
  limitations: string[];
  sourcePassageIds: string[];
  status: "draft";
  reviewedBy: [];
}

export interface KEP1DraftGraphProposal {
  proposalId: string;
  relationshipType: string;
  targetEntityId: string;
  rationale: string;
  sourcePassageIds: string[];
  status: "proposed";
  requiresClinicalReview: true;
}

export interface KEP1DraftBundleRevision {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  draftId: string;
  revisionId: string;
  revisionNumber: number;
  entityId: string;
  entityType: KEP1DraftEntityType;
  title: string;
  summary: string;
  status: "draft";
  jobId: string;
  artifactId: string;
  artifactSha256: string;
  artifactByteLength: number;
  verificationId: string;
  sourceId: string;
  sourceVersion: string;
  rightsDecisionVersion: number;
  authorAssignmentId: string;
  authorAssignmentVersion: number;
  authorContributorId: string;
  passages: KEP1DraftPassage[];
  claims: KEP1DraftClaim[];
  evidenceProfile: KEP1DraftEvidenceProfile;
  graphProposals: KEP1DraftGraphProposal[];
  contentSha256: string;
  changeSummary: string;
  createdByActorId: string;
  createdAt: string;
}

export interface KEP1DraftHead {
  draftId: string;
  entityId: string;
  currentRevisionId: string;
  currentRevisionNumber: number;
  updatedAt: string;
}

export interface KEP1DraftAuditEvent {
  eventId: string;
  programId: "KEP-1";
  entityId: string;
  draftId: string;
  revisionId: string;
  action: "DRAFT_REVISION_CREATED";
  actorId: string;
  occurredAt: string;
  revisionNumber: number;
  contentSha256: string;
}

export interface KEP1DraftingRepository {
  getHead(draftId: string): Promise<KEP1DraftHead | null>;
  listHeads(): Promise<KEP1DraftHead[]>;
  getRevision(revisionId: string): Promise<KEP1DraftBundleRevision | null>;
  listRevisions(): Promise<KEP1DraftBundleRevision[]>;
  createRevision(
    head: KEP1DraftHead,
    expectedRevisionNumber: number | null,
    revision: KEP1DraftBundleRevision,
    event: KEP1DraftAuditEvent
  ): Promise<void>;
}
