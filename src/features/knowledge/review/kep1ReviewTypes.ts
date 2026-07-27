export type KEP1ReviewKind = "clinical" | "evidence";
export type KEP1ReviewDecision =
  | "approved"
  | "changes-requested"
  | "rejected";

export interface KEP1ClinicalReviewChecklist {
  claimLanguageChecked: boolean;
  traditionalUseBoundaryChecked: boolean;
  emergencyEscalationChecked: boolean;
  contraindicationChecked: boolean;
  graphSafetyChecked: boolean;
}

export interface KEP1EvidenceReviewChecklist {
  citationTraceabilityChecked: boolean;
  evidenceStatusChecked: boolean;
  limitationsChecked: boolean;
  conflictingEvidenceChecked: boolean;
  conventionalCareBoundaryChecked: boolean;
}

export interface KEP1IndependentReviewRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  reviewId: string;
  reviewKind: KEP1ReviewKind;
  entityId: string;
  draftId: string;
  revisionId: string;
  reviewedContentSha256: string;
  decision: KEP1ReviewDecision;
  reviewerAssignmentId: string;
  reviewerAssignmentVersion: number;
  reviewerContributorId: string;
  authorContributorId: string;
  declarationOfIndependence: true;
  conflictsDeclared: string[];
  reviewedClaimIds: string[];
  reviewedGraphProposalIds: string[];
  clinicalChecklist: KEP1ClinicalReviewChecklist | null;
  evidenceChecklist: KEP1EvidenceReviewChecklist | null;
  notes: string;
  reviewedByActorId: string;
  reviewedAt: string;
}

export interface KEP1ReviewAuditEvent {
  eventId: string;
  programId: "KEP-1";
  entityId: string;
  revisionId: string;
  reviewId: string;
  reviewKind: KEP1ReviewKind;
  decision: KEP1ReviewDecision;
  actorId: string;
  occurredAt: string;
  reviewedContentSha256: string;
}

export interface KEP1ReviewRepository {
  getReview(reviewId: string): Promise<KEP1IndependentReviewRecord | null>;
  listReviews(): Promise<KEP1IndependentReviewRecord[]>;
  createReview(
    review: KEP1IndependentReviewRecord,
    event: KEP1ReviewAuditEvent
  ): Promise<void>;
}
