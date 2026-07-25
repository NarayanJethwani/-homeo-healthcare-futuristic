/**
 * Phase 2.2B — Authoritative Governance Repository Contract & State Models
 */

import {
  Contributor,
  ContributorId,
  AuthorshipRecord,
  ContentRevision,
  ClinicalReviewRecord,
  EvidenceProfile,
  ClinicalClaim,
  AiIngestionApproval,
  GovernanceAuditEvent,
  WorkflowTransition,
  EditorialWorkflowState,
} from "../types/governanceTypes";

export interface ReviewerQualificationDecision {
  id: string;
  contributorId: ContributorId;
  scope: "clinical" | "evidence" | "safety" | "editorial";
  status: "qualified" | "suspended" | "revoked";
  qualificationBody?: string;
  qualifiedAt: string;
  expiresAt?: string;
  notes?: string;
}

export interface EntityGovernanceState {
  entityId: string;
  currentRevisionId?: string;
  workflowState: EditorialWorkflowState;
  authorIds: ContributorId[];
  validClinicalReviewIds: string[];
  evidenceProfileId?: string;
  aiIngestionApprovalId?: string;
  withdrawn: boolean;
  updatedAt: string;
}

export interface GovernanceTransaction {
  createContributor(record: Contributor): Promise<void>;
  createQualificationDecision(decision: ReviewerQualificationDecision): Promise<void>;
  createAuthorshipRecord(record: AuthorshipRecord & { entityId: string }): Promise<void>;
  createContentRevision(record: ContentRevision): Promise<void>;
  createClinicalReview(record: ClinicalReviewRecord & { entityId: string }): Promise<void>;
  createEvidenceProfile(profile: EvidenceProfile): Promise<void>;
  createClinicalClaim(claim: ClinicalClaim): Promise<void>;
  createAiIngestionApproval(approval: AiIngestionApproval): Promise<void>;
  appendAuditEvent(event: GovernanceAuditEvent): Promise<void>;
  updateEntityGovernanceState(state: EntityGovernanceState): Promise<void>;

  getContributor(id: ContributorId): Promise<Contributor | null>;
  getEntityGovernanceState(entityId: string): Promise<EntityGovernanceState | null>;
  getContentRevision(revisionId: string): Promise<ContentRevision | null>;
  getCurrentRevision(entityId: string): Promise<ContentRevision | null>;
  listQualificationDecisions(contributorId: ContributorId): Promise<ReviewerQualificationDecision[]>;
  listAuthorshipRecords(entityId: string): Promise<AuthorshipRecord[]>;
  listClinicalReviews(entityId: string, revisionId?: string): Promise<ClinicalReviewRecord[]>;
}

export interface GovernanceRepository {
  createContributor(record: Contributor): Promise<void>;
  getContributor(id: ContributorId): Promise<Contributor | null>;

  createQualificationDecision(decision: ReviewerQualificationDecision): Promise<void>;
  getActiveQualificationDecisions(contributorId: ContributorId): Promise<ReviewerQualificationDecision[]>;

  createAuthorshipRecord(record: AuthorshipRecord & { entityId: string }): Promise<void>;
  listAuthorshipRecords(entityId: string): Promise<AuthorshipRecord[]>;

  createContentRevision(record: ContentRevision): Promise<void>;
  getContentRevision(revisionId: string): Promise<ContentRevision | null>;
  getCurrentRevision(entityId: string): Promise<ContentRevision | null>;

  createClinicalReview(record: ClinicalReviewRecord & { entityId: string }): Promise<void>;
  listClinicalReviews(entityId: string, revisionId?: string): Promise<ClinicalReviewRecord[]>;

  createEvidenceProfile(profile: EvidenceProfile): Promise<void>;
  getEvidenceProfile(entityId: string, revisionId: string): Promise<EvidenceProfile | null>;

  createClinicalClaim(claim: ClinicalClaim): Promise<void>;
  listClinicalClaims(entityId: string, revisionId: string): Promise<ClinicalClaim[]>;

  createAiIngestionApproval(approval: AiIngestionApproval): Promise<void>;
  getAiIngestionApproval(entityId: string, revisionId: string): Promise<AiIngestionApproval | null>;

  appendAuditEvent(event: GovernanceAuditEvent): Promise<void>;
  listAuditEvents(entityId: string): Promise<GovernanceAuditEvent[]>;

  getEntityGovernanceState(entityId: string): Promise<EntityGovernanceState | null>;
  updateEntityGovernanceState(state: EntityGovernanceState): Promise<void>;

  runInTransaction<T>(operation: (tx: GovernanceTransaction) => Promise<T>): Promise<T>;
}
