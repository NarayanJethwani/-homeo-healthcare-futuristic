/**
 * Phase 2 — Durable Clinical Governance Data Models & Interfaces
 */

export type ContributorId = string;

export type ContributionRole =
  | 'author'
  | 'editor'
  | 'clinical-reviewer'
  | 'evidence-reviewer'
  | 'translation-reviewer';

export interface Contributor {
  id: ContributorId;
  displayName: string;
  professionalRole?: string;
  qualifications?: string[];
  registrationAuthority?: string;
  registrationNumberHash?: string; // Private registration details stored as immutable verification hash
  organisation?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorshipRecord {
  contributorId: ContributorId;
  role: 'author' | 'editor';
  contributionStatement?: string;
  recordedAt: string;
}

export interface ClinicalReviewRecord {
  id?: string;
  reviewerId: ContributorId;
  reviewType: 'clinical' | 'evidence' | 'safety';
  decision: 'approved' | 'changes-requested' | 'rejected';
  reviewedVersion: string; // Revision content hash or version ID
  reviewedAt: string;
  declarationOfIndependence: boolean;
  conflictsDeclared?: string[];
  notes?: string;
}

export interface ContentRevision {
  revisionId: string;
  entityId: string;
  contentHash: string;
  createdAt: string;
  createdBy: ContributorId;
  changeSummary: string;
  isMaterialChange: boolean;
}

export type EvidenceLevel =
  | 'Level-A' // Meta-analyses / Systematic Reviews
  | 'Level-B' // Randomized Controlled Trials / Well-designed Clinical Studies
  | 'Level-C' // Observational Studies / Expert Consensus Guidelines
  | 'Traditional-Literature'; // Classical Materia Medica / Repertory Reference

export interface EvidenceProfile {
  id: string;
  entityId: string;
  revisionId: string;
  evidenceQuestion?: string;
  evidenceLevel: EvidenceLevel;
  sourceIds: string[];
  guidelineSources?: {
    citationId: string;
    guidelineVersion?: string;
    accessedAt?: string;
  }[];
  evidenceSummary: string;
  limitations: string[];
  conflictingEvidence?: string[];
  conventionalCareContext?: string;
  complementaryCareBoundary?: string;
  reviewedBy: ContributorId[];
  reviewedAt?: string;
  status: 'draft' | 'review-required' | 'approved' | 'rejected';
}

export type ClaimType =
  | 'definition'
  | 'diagnosis'
  | 'risk'
  | 'treatment'
  | 'prognosis'
  | 'safety'
  | 'emergency'
  | 'laboratory-interpretation'
  | 'traditional-use';

export type EvidenceStatus =
  | 'supported'
  | 'partially-supported'
  | 'traditional-description'
  | 'insufficient-evidence'
  | 'unsupported';

export interface ClinicalClaim {
  id: string;
  entityId: string;
  revisionId: string;
  text: string;
  claimType: ClaimType;
  citationIds: string[];
  evidenceStatus: EvidenceStatus;
  requiresClinicalReview: boolean;
}

export type EditorialWorkflowState =
  | 'draft'
  | 'editorial-review'
  | 'clinical-review'
  | 'changes-requested'
  | 'evidence-review'
  | 'approved'
  | 'published'
  | 'withdrawn'
  | 'archived';

export interface WorkflowTransition {
  from: EditorialWorkflowState;
  to: EditorialWorkflowState;
  actorId: ContributorId;
  timestamp: string;
  reason?: string;
  isEmergencyOverride?: boolean;
  emergencyReason?: string;
  emergencyExpiry?: string;
}

export interface AiIngestionApproval {
  entityId: string;
  revisionId: string;
  approvedBy: ContributorId;
  approvedAt: string;
  evidenceProfileId: string;
  policyCheckVersion: string;
  citationCheckPassed: boolean;
  prohibitedClaimCheckPassed: boolean;
  expiresAt?: string;
}

export interface GovernanceAuditEvent {
  id: string;
  entityId: string;
  revisionId?: string;
  actorId: ContributorId;
  role?: string;
  action: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  createdAt: string;
  sequenceNumber?: number;
  previousEventHash?: string;
  eventHash?: string;
  metadata?: Record<string, any>;
}

export interface ReviewerQualificationDecision {
  id: string;
  contributorId: ContributorId;
  scope?: string;
  reviewScopes?: string[];
  qualificationType?: string;
  status: "qualified" | "verified" | "pending" | "rejected" | "suspended" | "revoked" | "expired";
  verifiedBy?: ContributorId;
  verifiedAt?: string;
  qualifiedAt?: string;
  expiresAt?: string;
  verificationNotes?: string;
}

export interface ExtendedPublicationEvaluation {
  eligibleByClinicalGovernance: boolean;
  eligibleByTemporaryPublicIndexException: boolean;
  eligibleForPublicDisplay: boolean;
  eligibleForIndexing: boolean;
  eligibleForSitemap: boolean;
  eligibleForAiIngestion: boolean;
  workflowState: EditorialWorkflowState;
  reviewLabel: string;
  failures: string[];
  warnings: string[];
}
