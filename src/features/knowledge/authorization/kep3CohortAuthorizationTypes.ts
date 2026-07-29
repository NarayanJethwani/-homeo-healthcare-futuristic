export type KEP3CohortAuthorizationDecision = "approved" | "rejected";

export interface KEP3CohortAuthorizationChecklist {
  selectionEvidenceReviewed: boolean;
  capacityEvidenceReviewed: boolean;
  riskRegisterReviewed: boolean;
  withdrawnAndFlagshipExclusionsConfirmed: boolean;
  zeroProductionRagConfirmed: boolean;
  noAutomaticAssignmentsConfirmed: boolean;
  authorityBoundaryAccepted: boolean;
}

export interface KEP3CohortAuthorizationRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-3";
  authorizationId: string;
  decision: KEP3CohortAuthorizationDecision;
  proposalId: string;
  proposalSha256: string;
  kep1DecisionId: string;
  inventorySha256: string;
  selectedEntityIds: string[];
  programOwnerRecordId: string;
  programOwnerRecordVersion: number;
  checklist: KEP3CohortAuthorizationChecklist;
  blockers: string[];
  residualRisks: string[];
  rationale: string;
  authorizationEvidenceRef: string;
  meetingMinutesRef: string;
  confirmationPhrase: string;
  authorizedByActorId: string;
  authorizedAt: string;
  authority: {
    cohortPreparationGranted: boolean;
    assignmentAuthorityGranted: false;
    editorialApprovalGranted: false;
    publicationAuthorityGranted: false;
    publicIndexAuthorityGranted: false;
    embeddingAuthorityGranted: false;
    productionRagAuthorityGranted: false;
    productionMigrationAuthorityGranted: false;
  };
}

export interface KEP3CohortAuthorizationAuditEvent {
  eventId: string;
  programId: "KEP-3";
  authorizationId: string;
  decision: KEP3CohortAuthorizationDecision;
  proposalId: string;
  proposalSha256: string;
  kep1DecisionId: string;
  inventorySha256: string;
  programOwnerRecordId: string;
  actorId: string;
  occurredAt: string;
}

export interface KEP3CohortAuthorizationRepository {
  getAuthorization(
    authorizationId: string
  ): Promise<KEP3CohortAuthorizationRecord | null>;
  listAuthorizations(): Promise<KEP3CohortAuthorizationRecord[]>;
  createAuthorization(
    authorization: KEP3CohortAuthorizationRecord,
    event: KEP3CohortAuthorizationAuditEvent
  ): Promise<void>;
}
