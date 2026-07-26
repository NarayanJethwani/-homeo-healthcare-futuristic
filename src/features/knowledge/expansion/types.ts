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

export type KEP1CoverageDomain =
  | "definition-and-scope"
  | "symptoms-and-differential"
  | "red-flags-and-escalation"
  | "diagnostic-interpretation"
  | "conventional-care"
  | "traditional-source-description"
  | "regulatory-and-product-safety"
  | "evidence-limitations";

export interface KEP1SourceRecord extends RegisteredKnowledgeSource {
  sourceVersion: string;
  verifiedAt: string;
  usePolicy: "citation-only" | "governed-extraction";
  coverageDomains: KEP1CoverageDomain[];
}

export type KEP1EditorialRole =
  | "clinical-author"
  | "independent-clinical-reviewer"
  | "evidence-reviewer"
  | "rights-reviewer";

export interface KEP1EditorialAssignment {
  role: KEP1EditorialRole;
  contributorId: string | null;
  status: "unassigned" | "assigned";
}

export interface KEP1FlagshipSourceDossier {
  schemaVersion: "1.0.0";
  dossierId: string;
  entityId: string;
  entityType: EntityType;
  title: string;
  asOfDate: string;
  status: "sources-registered-review-blocked";
  sourceIds: string[];
  requiredCoverageDomains: KEP1CoverageDomain[];
  prohibitedClaimPatterns: string[];
  assignments: KEP1EditorialAssignment[];
  evaluationQuestionTarget: 20;
  governedRelationshipTarget: {
    minimum: 5;
    maximum: 10;
  };
  stateBoundaries: {
    contentState: "planning-only";
    evidenceState: "unapproved";
    clinicalReviewState: "unassigned";
    publicationState: "unchanged";
    ragState: "inactive";
  };
}

export interface KEP1SourceDossierManifest {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  asOfDate: string;
  status: "planning-review-required";
  sources: KEP1SourceRecord[];
  dossiers: KEP1FlagshipSourceDossier[];
  summary: {
    sourceCount: number;
    dossierCount: 8;
    assignedRoles: number;
    unassignedRoles: number;
    productionRagEntities: 0;
    approvedEvidenceProfiles: 0;
    approvedClinicalReviews: 0;
  };
  invariants: {
    automaticAssignmentForbidden: true;
    automaticApprovalForbidden: true;
    citationOnlySourcesCannotBeExtracted: true;
    authorReviewerIdentitySeparationRequired: true;
    publicationFreezeRemainsActive: true;
  };
}

export type KEP1ExpertiseDomain =
  | "gastroenterology"
  | "dermatology"
  | "laboratory-medicine"
  | "homeopathy-subject-matter"
  | "evidence-methodology"
  | "source-rights";

export type KEP1IdentityScheme = "staff-id" | "orcid" | "github";

export interface KEP1ContributorCredential {
  credentialId: string;
  title: string;
  issuer: string;
  verificationStatus: "pending" | "verified" | "rejected" | "expired";
  evidenceLocation: string | null;
  verifiedAt: string | null;
  expiresAt: string | null;
}

export interface KEP1ContributorRecord {
  contributorId: string;
  fullName: string;
  status: "invited" | "verification-pending" | "eligible" | "suspended";
  identity: {
    scheme: KEP1IdentityScheme;
    value: string;
    verificationStatus: "pending" | "verified" | "rejected";
    verifiedAt: string | null;
    verifiedBy: string | null;
  };
  eligibleRoles: KEP1EditorialRole[];
  expertiseDomains: KEP1ExpertiseDomain[];
  credentials: KEP1ContributorCredential[];
  attestations: {
    conflictOfInterestDeclared: boolean;
    editorialIndependenceAccepted: boolean;
    aiAssistanceDisclosureAccepted: boolean;
    sourceUsePolicyAccepted: boolean;
  };
}

export interface KEP1ProgramOwnerRecord {
  approverId: string;
  fullName: string;
  status: "active" | "suspended";
  identity: {
    scheme: KEP1IdentityScheme;
    value: string;
    verificationStatus: "pending" | "verified" | "rejected";
    verifiedAt: string | null;
    verifiedBy: string | null;
  };
}

export interface KEP1ContributorAssignmentDecision {
  entityId: string;
  role: KEP1EditorialRole;
  contributorId: string | null;
  status: "unassigned" | "proposed" | "approved" | "rejected";
  proposedBy: string | null;
  proposedAt: string | null;
  ownerApproval: {
    status: "pending" | "approved" | "rejected";
    approverId: string | null;
    decidedAt: string | null;
  };
}

export interface KEP1ContributorIntakeManifest {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  asOfDate: string;
  status: "contributor-intake-required" | "assignments-approved";
  contributors: KEP1ContributorRecord[];
  programOwners: KEP1ProgramOwnerRecord[];
  assignments: KEP1ContributorAssignmentDecision[];
  summary: {
    contributorCount: number;
    eligibleContributorCount: number;
    activeProgramOwnerCount: number;
    assignmentCount: 32;
    approvedAssignmentCount: number;
    pendingAssignmentCount: number;
  };
  invariants: {
    automaticIdentityVerificationForbidden: true;
    automaticCredentialApprovalForbidden: true;
    automaticAssignmentApprovalForbidden: true;
    immutableContributorIdentityRequired: true;
    authorReviewerIdentitySeparationRequired: true;
    conflictDeclarationRequired: true;
    programOwnerApprovalRequired: true;
    publicationAndRagAuthorizationGranted: false;
  };
}
