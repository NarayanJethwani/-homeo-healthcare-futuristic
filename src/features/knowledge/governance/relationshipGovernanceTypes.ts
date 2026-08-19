import type { EntityType } from "../types";

/**
 * Governed relationship lifecycle stages:
 * - draft: initial proposal, non-binding
 * - under_review: currently undergoing clinical review
 * - approved: clinical adjudication decision accepted by reviewer
 * - rejected: clinical adjudication rejected with logged rationale
 * - governed: approved edge has completed governance recording/lineage requirements and is immutable & auditable
 * - withdrawn: previously governed edge formally withdrawn due to safety/evidence invalidation
 * - superseded: replaced by a newer versioned relationship
 */
export type RelationshipLifecycleStatus =
  | "draft"
  | "under_review"
  | "approved"
  | "rejected"
  | "governed"
  | "withdrawn"
  | "superseded";

export type GovernedRelationshipType =
  | "traditional_profile_association"
  | "clinical_indication"
  | "symptom_rubric_affinity"
  | "differential_comparison"
  | "investigative_correlation"
  | "contraindication"
  | "complementary_pairing";

export type EvidenceScope =
  | "traditional-literature-only"
  | "clinical-evidence"
  | "observational-study"
  | "expert-consensus";

export interface RelationshipAdjudicationRecord {
  adjudicatedBy: {
    reviewerId: string;
    name: string;
    credentials: string;
    specialty: string;
    institution: string;
  };
  adjudicatedAt: string; // ISO 8601 string
  decision: "approved" | "rejected" | "requires_revision" | "insufficient_evidence";
  clinicalRationale: string;
  safetyChecksPassed: boolean;
  conventionalBoundaryPreserved: boolean;
  evidenceConfidenceScore: number; // 0.0 to 1.0
  notes?: string;
}

export interface RelationshipProposalInput {
  proposalId: string;
  sourceEntityId: string;
  sourceRevisionId?: string;
  targetEntityId: string;
  targetRevisionId?: string;
  relationshipType: GovernedRelationshipType;
  claimDescription: string;
  evidenceCitationIds: string[];
  evidenceScope: EvidenceScope;
  proposedBy: string;
  version: string;
}

export interface GovernedRelationshipRecord {
  relationshipId: string;
  fingerprintSha256: string;
  sourceEntityId: string;
  sourceEntityType?: EntityType;
  sourceRevisionId: string;
  targetEntityId: string;
  targetEntityType?: EntityType | "concept";
  targetRevisionId: string;
  relationshipType: GovernedRelationshipType;
  claimDescription: string;
  evidenceCitationIds: string[];
  evidenceScope: EvidenceScope;
  status: RelationshipLifecycleStatus;
  adjudication: RelationshipAdjudicationRecord;
  governedAt?: string;
  governanceCommitSha?: string;
  isWithdrawn: boolean;
  withdrawnReason?: string;
  withdrawnAt?: string;
  supersededBy?: string | null;
  supersededAt?: string;
  schemaVersion: "1.0.0";
}

export interface RelationshipEligibilityEvaluation {
  relationshipId: string;
  isGoverned: boolean;
  isPublicationEligible: boolean;
  isRagEligible: boolean;
  isBlockedByFreeze: boolean;
  isBlockedByWithdrawal: boolean;
  isBlockedBySupersession: boolean;
  isBlockedBySafetyGate: boolean;
  isBlockedByUnverifiedCitation: boolean;
  reasons: string[];
  evaluatedAt: string;
}

export interface GraphIntegrityStatistics {
  totalRelationships: number;
  byStatus: Record<RelationshipLifecycleStatus, number>;
  byRelationshipType: Record<string, number>;
  bySourceEntityType: Record<string, number>;
  byTargetEntityType: Record<string, number>;
  totalUniqueSourceEntities: number;
  totalUniqueTargetEntities: number;
  connectedEntitiesCount: number;
  isolatedEntitiesCount: number;
  publicationEligibleCount: number;
  ragEligibleCount: number;
  validationErrorsCount: number;
  validationWarningsCount: number;
}
