export type KEP1GoNoGoDecision = "go" | "no-go";

export interface KEP1DecisionChecklist {
  acceptanceGatesReviewed: boolean;
  clinicalAndEvidenceReviewsConfirmed: boolean;
  offlineEvaluationReviewed: boolean;
  withdrawnExclusionsConfirmed: boolean;
  zeroProductionRagConfirmed: boolean;
  residualRisksReviewed: boolean;
  containmentAndRollbackReviewed: boolean;
  authorityBoundaryAccepted: boolean;
}

export interface KEP1GoNoGoDecisionRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  decisionId: string;
  decision: KEP1GoNoGoDecision;
  evaluationId: string;
  corpusManifestSha256: string;
  querySetSha256: string;
  programOwnerRecordId: string;
  programOwnerRecordVersion: number;
  checklist: KEP1DecisionChecklist;
  blockers: string[];
  residualRisks: string[];
  rationale: string;
  decisionEvidenceRef: string;
  meetingMinutesRef: string;
  confirmationPhrase: string;
  decidedByActorId: string;
  decidedAt: string;
}

export interface KEP1DecisionAuditEvent {
  eventId: string;
  programId: "KEP-1";
  decisionId: string;
  decision: KEP1GoNoGoDecision;
  evaluationId: string;
  corpusManifestSha256: string;
  querySetSha256: string;
  programOwnerRecordId: string;
  actorId: string;
  occurredAt: string;
}

export interface KEP1DecisionRepository {
  getDecision(decisionId: string): Promise<KEP1GoNoGoDecisionRecord | null>;
  listDecisions(): Promise<KEP1GoNoGoDecisionRecord[]>;
  createDecision(
    decision: KEP1GoNoGoDecisionRecord,
    event: KEP1DecisionAuditEvent
  ): Promise<void>;
}
