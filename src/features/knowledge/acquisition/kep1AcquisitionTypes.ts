import type { KEP1EditorialRole } from "../expansion/types";

export type KEP1AssignmentDecisionStatus =
  | "proposed"
  | "approved"
  | "rejected";

export interface KEP1AssignmentDecisionRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  assignmentId: string;
  entityId: string;
  role: KEP1EditorialRole;
  contributorId: string;
  status: KEP1AssignmentDecisionStatus;
  proposedByActorId: string;
  proposedAt: string;
  decidedByActorId: string | null;
  decidedAt: string | null;
  programOwnerRecordId: string | null;
  decisionEvidenceRef: string | null;
  version: number;
}

export type KEP1SourceRightsDecision =
  | "citation-only-confirmed"
  | "controlled-extraction-approved"
  | "blocked";

export interface KEP1SourceAcquisitionRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  sourceId: string;
  decision: KEP1SourceRightsDecision;
  rightsReviewerContributorId: string;
  rightsEvidenceRef: string;
  decidedByActorId: string;
  decidedAt: string;
  version: number;
}

export interface KEP1AcquisitionAuditEvent {
  eventId: string;
  programId: "KEP-1";
  entityType: "assignment" | "source";
  entityId: string;
  action:
    | "ASSIGNMENT_PROPOSED"
    | "ASSIGNMENT_APPROVED"
    | "ASSIGNMENT_REJECTED"
    | "SOURCE_RIGHTS_RECORDED";
  actorId: string;
  occurredAt: string;
  version: number;
}

export interface KEP1AcquisitionRepository {
  getAssignment(
    assignmentId: string
  ): Promise<KEP1AssignmentDecisionRecord | null>;
  listAssignments(): Promise<KEP1AssignmentDecisionRecord[]>;
  saveAssignment(
    record: KEP1AssignmentDecisionRecord,
    expectedVersion: number | null,
    event: KEP1AcquisitionAuditEvent
  ): Promise<void>;
  getSource(sourceId: string): Promise<KEP1SourceAcquisitionRecord | null>;
  listSources(): Promise<KEP1SourceAcquisitionRecord[]>;
  saveSource(
    record: KEP1SourceAcquisitionRecord,
    expectedVersion: number | null,
    event: KEP1AcquisitionAuditEvent
  ): Promise<void>;
}
