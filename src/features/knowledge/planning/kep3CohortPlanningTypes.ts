import type { EntityType } from "../types";

export const KEP3_PLANNING_ROLES = [
  "clinical-author",
  "independent-clinical-reviewer",
  "evidence-reviewer",
  "rights-reviewer",
] as const;

export type KEP3PlanningRole = (typeof KEP3_PLANNING_ROLES)[number];

export interface KEP3SelectionFactors {
  clinicalImportance: number;
  safetySensitivity: number;
  searchDemand: number;
  sourceAvailability: number;
  graphValue: number;
}

export interface KEP3CohortSelection {
  entityId: string;
  entityType: EntityType;
  title: string;
  inventoryPriorityScore: number;
  factors: KEP3SelectionFactors;
  weightedScore: number;
  rationale: string;
  evidenceRefs: string[];
}

export interface KEP3RoleCapacity {
  role: KEP3PlanningRole;
  availableEntityCapacity: number;
  evidenceRef: string;
}

export interface KEP3CohortProposalRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-3";
  proposalId: string;
  status: "planning-proposal-only";
  cohortLabel: string;
  kep1DecisionId: string;
  kep1EvaluationId: string;
  kep1CorpusManifestSha256: string;
  kep1QuerySetSha256: string;
  inventorySha256: string;
  inventoryEntityCount: number;
  selections: KEP3CohortSelection[];
  roleCapacity: KEP3RoleCapacity[];
  selectionMethodology: string;
  residualRisks: string[];
  planningEvidenceRef: string;
  riskRegisterRef: string;
  confirmationPhrase: string;
  proposedByActorId: string;
  proposedAt: string;
  authority: {
    planningRecorded: true;
    assignmentAuthorityGranted: false;
    editorialApprovalGranted: false;
    publicationAuthorityGranted: false;
    publicIndexAuthorityGranted: false;
    embeddingAuthorityGranted: false;
    productionRagAuthorityGranted: false;
    productionMigrationAuthorityGranted: false;
  };
}

export interface KEP3CohortPlanningAuditEvent {
  eventId: string;
  programId: "KEP-3";
  proposalId: string;
  kep1DecisionId: string;
  inventorySha256: string;
  selectedEntityIds: string[];
  actorId: string;
  occurredAt: string;
}

export interface KEP3CohortPlanningRepository {
  getProposal(
    proposalId: string
  ): Promise<KEP3CohortProposalRecord | null>;
  listProposals(): Promise<KEP3CohortProposalRecord[]>;
  createProposal(
    proposal: KEP3CohortProposalRecord,
    event: KEP3CohortPlanningAuditEvent
  ): Promise<void>;
}
