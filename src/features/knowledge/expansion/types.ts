import type { EntityType } from "../types";

export type ExpansionRiskTier = "critical" | "high" | "medium" | "low";

export type ExpansionRecommendation =
  | "withdrawn-safety-remediation"
  | "flagship-pilot"
  | "topic-specific-rewrite"
  | "independent-review-and-enrichment";

export type ClaimCitationAssessment =
  | "not-modeled"
  | "incomplete"
  | "complete";

export interface KnowledgeExpansionInventoryRecord {
  entityId: string;
  slug: string;
  entityType: EntityType;
  title: string;
  audience: string;
  editorialStatus: string;
  evidenceLevel: string;
  safety: {
    withdrawn: boolean;
    riskTier: ExpansionRiskTier;
  };
  content: {
    overviewPresent: boolean;
    structuredSectionCompleteness: number;
    legacyBulkGenerationCohort: boolean;
    genericTemplateDetected: boolean;
    genericTemplateSignals: string[];
  };
  evidence: {
    referenceCount: number;
    allReferencesResolvable: boolean;
    governedEvidenceProfilePresent: boolean;
    claimLevelCitationAssessment: ClaimCitationAssessment;
  };
  review: {
    reviewerRecorded: boolean;
    immutableReviewerIdPresent: boolean;
    authorReviewerNameConflict: boolean;
    independentReviewProven: boolean;
  };
  graph: {
    uniqueConnectionCount: number;
    duplicateRelationshipRows: number;
    brokenRelationshipRows: number;
    isolated: boolean;
  };
  eligibility: {
    publicIndexAllowlisted: boolean;
    eligibleForIndexing: boolean;
    ragAllowlisted: boolean;
    eligibleForRag: boolean;
  };
  prioritisation: {
    priorityScore: number;
    recommendation: ExpansionRecommendation;
    reasons: string[];
  };
}

export interface KnowledgeExpansionInventory {
  schemaVersion: "1.0.0";
  asOfDate: string;
  policy: {
    publicationFreezeRequired: true;
    automaticApprovalPermitted: false;
    productionRagActivationPermitted: false;
  };
  summary: {
    totalEntities: number;
    byEntityType: Record<string, number>;
    withdrawnEntities: number;
    flagshipEntities: number;
    legacyBulkGeneratedEntities: number;
    genericSignalEntities: number;
    independentlyReviewedEntities: number;
    governedEvidenceProfiles: number;
    claimCitationCompleteEntities: number;
    isolatedEntities: number;
    duplicateRelationshipRows: number;
    activeRagEntities: number;
  };
  records: KnowledgeExpansionInventoryRecord[];
}

export interface FlagshipPilotEntity {
  entityId: string;
  title: string;
  entityType: EntityType;
  workPackage: {
    topicSpecificRewrite: boolean;
    redFlagsOrSafetyBoundary: boolean;
    conventionalCareContext: boolean;
    draftEvidenceProfile: boolean;
    claimLevelCitations: boolean;
    independentReview: boolean;
    governedGraphRelationshipsTarget: number;
    offlineEvaluationQuestionsTarget: number;
  };
  stateBoundaries: {
    publicIndexState: "preserve-existing-exception";
    evidenceApprovalState: "draft-only";
    clinicalApprovalState: "unchanged";
    ragState: "inactive";
  };
}

export interface FlagshipPilotManifest {
  schemaVersion: "1.0.0";
  pilotId: "KEP-1";
  asOfDate: string;
  status: "planned";
  entities: FlagshipPilotEntity[];
  targets: {
    entityCount: 8;
    minimumGovernedRelationships: 40;
    maximumGovernedRelationships: 80;
    minimumOfflineEvaluationQuestions: 160;
  };
  invariants: {
    publicationFreezeRemainsActive: true;
    automaticPublicationForbidden: true;
    automaticClinicalApprovalForbidden: true;
    automaticEvidenceApprovalForbidden: true;
    automaticGraphAcceptanceForbidden: true;
    productionRagEntities: 0;
    withdrawnEntitiesRemainExcluded: true;
  };
}

export type RetrievalEvaluationCategory =
  | "definition"
  | "differential-diagnosis"
  | "red-flag-escalation"
  | "laboratory-interpretation"
  | "traditional-use-boundary"
  | "citation-retrieval"
  | "adversarial-medical-claim"
  | "withdrawn-content-leakage"
  | "stale-revision";

export type RetrievalExpectedBehavior =
  | "answer-with-citations"
  | "abstain"
  | "escalate"
  | "refuse-withdrawn-content";

export interface OfflineRetrievalEvaluationCase {
  id: string;
  entityIds: string[];
  category: RetrievalEvaluationCategory;
  question: string;
  expectedBehavior: RetrievalExpectedBehavior;
  expectedCitationIds: string[];
  prohibitedClaims: string[];
  expectedRevisionIds: string[];
  reviewerStatus: "draft" | "review-required" | "approved";
}

export interface RegisteredKnowledgeSource {
  id: string;
  title: string;
  sourceType:
    | "clinical-guideline"
    | "systematic-review"
    | "primary-research"
    | "reference-standard"
    | "classical-homeopathic-literature"
    | "repertory";
  publisherOrCustodian: string;
  canonicalUrl?: string;
  editionOrVersion?: string;
  accessedAt?: string;
  licence: {
    status: "verified" | "pending" | "restricted" | "public-domain";
    identifier?: string;
    evidenceLocation?: string;
    permitsExtraction: boolean;
    permitsDerivedData: boolean;
    permitsPublicDisplay: boolean;
  };
  ingestionStatus:
    | "registered"
    | "licence-verified"
    | "extracted"
    | "normalised"
    | "claims-identified"
    | "review-pending";
}
