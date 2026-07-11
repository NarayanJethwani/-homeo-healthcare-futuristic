export type Locale = "en" | "hi" | "gu" | "mr" | "es" | "ar";

export type LocalizedString = Record<Locale, string>;

export type EntityType =
  | "disease"
  | "symptom"
  | "remedy"
  | "lab-test"
  | "faq"
  | "research"
  | "case-study";

export type EditorialStatus =
  | "draft"
  | "ai-assisted"
  | "medical-review"
  | "clinical-validation"
  | "published"
  | "scheduled-review"
  | "archived";

export type KnowledgeEditorialStatus =
  | "draft"
  | "medical-review"
  | "editorial-review"
  | "approved"
  | "published"
  | "archived";

export type LegacyKnowledgeVerificationStatus =
  | "verified-published"
  | "legacy-published-unverified"
  | "review-required"
  | "archived"
  | "excluded";

export type EvidenceStrength =
  | "very-low"
  | "low"
  | "moderate"
  | "high"
  | "very-high";

export type SourceQuality =
  | "unverified"
  | "secondary"
  | "primary"
  | "peer-reviewed"
  | "authoritative";

export type ReviewExpiryPolicy =
  | "flag-only"
  | "ranking-penalty"
  | "exclude-from-ai"
  | "exclude-from-all-search";

export type EvidenceReviewState =
  | "not-configured"
  | "current"
  | "due-soon"
  | "overdue"
  | "expired";

export interface KnowledgeEvidenceProfile {
  evidenceStrength: EvidenceStrength;
  sourceQuality: SourceQuality;

  classicalSource: boolean;
  modernSource: boolean;

  clinicalConfidence: number;
  editorialConfidence: number;

  citationCompleteness?: number;

  lastReviewedAt?: string;
  reviewIntervalDays?: number;
  nextReviewDueAt?: string;

  reviewExpiryPolicy?: ReviewExpiryPolicy;
  reviewGracePeriodDays?: number;

  rationale?: string;

  assessedBy?: string;
  assessedByNameSnapshot?: string;
  assessedByRoleSnapshot?: string;
  assessedAt?: string;

  methodologyVersion?: string;
}


export type EvidenceLevel =
  | "Clinical-Evidence"
  | "Classical-Homeopathic-Literature"
  | "Clinical-Experience"
  | "Emerging-Research"
  | "Consensus-Guidance"
  | "Level-A"
  | "Level-B"
  | "Level-C"
  | "Expert-Opinion"
  | "Traditional-Literature";

export interface Author {
  name: string;
  credentials?: string;
  institution?: string;
}

export interface Reviewer {
  name: string;
  credentials: string;
  specialty: string;
  institution?: string;
}

export interface ContentVersion {
  version: string;
  created: string; // ISO Date String
  updated: string; // ISO Date String
  reviewed: string; // ISO Date String
  deprecated?: boolean;
  replacementEntityId?: string;
}

export type CitationCategory =
  | "Clinical-Guidelines"
  | "Primary-Research"
  | "Systematic-Reviews"
  | "Classical-Homeopathic-Literature"
  | "Materia-Medica"
  | "Organon"
  | "Historical-References"
  | "Clinical-Review"
  | "Guidelines";

export interface CitationRecord {
  id: string; // e.g. "CIT-0001"
  title: string;
  authors: string[];
  journal: string;
  doi?: string;
  pubmedId?: string;
  year: number;
  citationStyle: string; // e.g. "AMA"
  category?: CitationCategory;
}

// Remedy content type with all requested clinical fields
export interface RemedyContent {
  latinName: string;
  commonName: string;
  source: string;
  kingdom: string;
  remedyType: string;
  description: string;
  keynotes: string[];
  mentalSymptoms: string[];
  physicalSymptoms: string[];
  generalities: string;
  modalitiesBetter: string[];
  modalitiesWorse: string[];
  clinicalUses: string[];
  organAffinity: string[];
  miasmaticAffinity: string[];
  constitution: string;
  potencies: string[];
  safetyNotes: string;
  references: string[]; // Reference Citation IDs
}

// Disease content type with all requested clinical fields
export interface DiseaseContent {
  overview: string;
  definition: string;
  causes: string[];
  riskFactors: string[];
  symptoms: string[]; // clinical descriptions
  diagnosis: string;
  differentialDiagnosis: string;
  labTests: string[];
  imaging: string;
  redFlags: string[];
  conventionalManagement: string;
  homeopathicApproach: string;
  lifestyleAdvice: string;
  references: string[]; // Reference Citation IDs
  clinicalImportance?: string;
  whyItMatters?: string;
  complications?: string[];
}

// Symptom content type with all requested clinical fields
export interface SymptomContent {
  definition: string;
  clinicalMeaning: string;
  commonCauses: string[];
  differentialDiagnosis: string;
  redFlags: string[];
  lifestyleAdvice: string;
  references: string[]; // Reference Citation IDs
  clinicalImportance?: string;
  whyItMatters?: string;
  complications?: string[];
}

// Lab Test content type with all requested clinical fields
export interface LabTestContent {
  overview: string;
  normalRange: string;
  highValues: string[];
  lowValues: string[];
  clinicalInterpretation: string;
  references: string[]; // Reference Citation IDs
}

export interface KnowledgeEntity {
  id: string; // permanent ID: e.g. "R0001", "D0001", "S0001", "L0001"
  slug: string; // lowercase URL slug e.g. "gerd", "sulphur"
  entityType: EntityType;
  editorialStatus: EditorialStatus;
  currentDraftVersionId?: string;
  approvedVersionId?: string;
  publishedVersionId?: string;
  legacyVerificationStatus?: LegacyKnowledgeVerificationStatus;
  versionInfo: ContentVersion;
  title: LocalizedString;
  summary: LocalizedString;
  featured?: boolean;
  categories?: string[];
  content: RemedyContent | DiseaseContent | SymptomContent | LabTestContent | any;
  author: Author;
  reviewer?: any; // To allow string, Reviewer or undefined
  reviewerRole?: string;
  lastClinicalReview?: string;
  nextClinicalReview?: string;
  referencesUpdated?: string;
  clinicalChangesSinceLastRevision?: string;
  editorialNotes?: string;
  reviewStatus?: string;
  citationHealth?: string;
  contentCompleteness?: number;
  graphCompleteness?: number;
  seoStatus?: string;
  structuredDataStatus?: string;
  isCornerstone?: boolean;
  version?: string;
  evidenceLevel: EvidenceLevel;
  tags: string[];
  canonicalUrl: string;
  readingTimeMinutes: number;
  audience: "patient" | "student" | "practitioner";
  license: string;
  changeLog?: string[];
  clinicalPearl?: string;
  quickFacts?: Record<string, string>;
  aiReadiness?: {
    retrievalSummary: string;
    clinicalSummary: string;
    patientSummary: string;
    studentSummary: string;
    keywords: string[];
    semanticKeywords: string[];
    icd?: string;
    snomed?: string;
    mesh?: string;
    bodySystem: string;
    urgency: "routine" | "monitor" | "urgent" | "emergency";
  };
  visualBodySystem?: VisualBodySystem;
  structuredEvidence?: StructuredEvidence;
  evidenceProfile?: KnowledgeEvidenceProfile;
  structuredDifferentials?: StructuredDifferential[];
  homeopathicPerspective?: HomeopathicPerspectiveData;
  interpretationAlgorithm?: LabInterpretationAlgorithm;
  aiKnowledge?: {
    retrievalSummary: string;
    differentialSummary: string;
    practitionerSummary: string;
    patientSummary: string;
    educationalSummary: string;
    graphContext: string;
    embeddingText: string;
  };
  knowledgeEmbedding?: KnowledgeEmbedding;
  qualityScore?: QualityScore;
  clinicalTimeline?: TimelineStage[];
  clinicalImages?: ClinicalImages;
  clinicalImportance?: string;
  whyItMatters?: string;
  complications?: string[];
}

export interface VisualBodySystem {
  system: string;
  organs?: string[];
  hormones?: string[];
  remedies?: string[];
  parameters?: string[];
}

export interface StructuredDifferential {
  condition: string;
  similarity: string;
  differentiator: string;
  investigation: string;
}

export interface StructuredEvidence {
  system: string;
  prevalence?: string;
  typicalAge?: string;
  causes?: string[];
  investigations?: string[];
  urgency?: string;
}

export interface HomeopathicPerspectiveData {
  conventionalUnderstanding: string;
  homeopathicInterpretation: string;
  constitutionalConsiderations: string;
  individualization: string;
  limitations: string;
}

export interface InterpretationFlowStep {
  label: string;
  type: "question" | "action" | "consideration";
  options?: { nextStepLabel: string; value: string }[];
}

export interface LabInterpretationAlgorithm {
  title: string;
  steps: InterpretationFlowStep[];
}

export type RelationshipType =
  | "hasSymptom"
  | "treatedWith"
  | "investigatedBy"
  | "relatedTo"
  | "riskFactorFor"
  | "contraindicatedWith"
  | "supportedBy"
  | "hasDietAdvice"
  | "complementaryTo"
  | "compareWith";

export interface KnowledgeRelationship {
  source: string; // Source ID e.g., "D0001"
  relation: RelationshipType;
  target: string; // Target ID e.g., "S0001"
}

export interface KnowledgeEmbedding {
  overview: string;
  pathology: string;
  diagnosis: string;
  investigations: string;
  differentialDiagnosis: string;
  managementOverview: string;
  homeopathicPerspective: string;
  complications: string;
  prognosis: string;
  patientEducation: string;
  graphContext: string;
  semanticKeywords: string[];
  embeddingText: string;
}

export interface QualityScore {
  editorialQuality: number;
  clinicalDepth: number;
  graphConnectivity: number;
  citationQuality: number;
  educationalValue: number;
  aiReadiness: number;
  seoReadiness: number;
}

export interface TimelineStage {
  stage: "risk-factors" | "early-symptoms" | "progression" | "complications" | "recovery" | "monitoring" | "clinical-workflow" | "patient-preparation" | "sample-collection" | "interpretation" | "follow-up-investigation";
  title: string;
  description: string;
  pearl?: string;
}

export interface ClinicalImages {
  normalVsAbnormalUrl?: string;
  anatomyUrl?: string;
  pathologyUrl?: string;
  interpretationChartUrl?: string;
  normalRangeChartUrl?: string;
  decisionPathwayUrl?: string;
  botanicalSourceUrl?: string;
  naturalSourceUrl?: string;
  historicalOriginUrl?: string;
  bodyLocationUrl?: string;
  severityScaleUrl?: string;
}
