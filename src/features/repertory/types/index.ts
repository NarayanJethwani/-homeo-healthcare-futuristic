export type MiasmType = 'Psora' | 'Sycosis' | 'Syphilis' | 'Tubercular' | 'Cancerinic';

export type RubricCategory =
  | 'Mental & Emotional'
  | 'Constitutional Generals'
  | 'Etiology / Causation'
  | 'Physical Generals'
  | 'Thermal State'
  | 'Food & Cravings'
  | 'Sleep'
  | 'Female / Menses'
  | 'GI / Digestive'
  | 'Respiratory'
  | 'Skin'
  | 'Pain'
  | 'Modalities'
  | 'Miasmatic Load'
  | 'Follow-up & Response Indicators'
  | 'Modern Clinical Conditions';

export interface GradedRemedy {
  remedyId: string;                 // e.g. "Nux-v"
  remedyName: string;               // e.g. "Nux Vomica"
  grade?: 1 | 2 | 3 | 4;             // 1=Low, 2=Moderate, 3=Strong, 4=Keynote
  confidence: number;               // 0.0 - 1.0
  keynoteReason: string;            // Text explanation
  sourceReference: string;          // Materia Medica citation
  clinicalExperienceWeight: number; // Dr. Jethwani's customized practice weighting (0.0 - 1.0)
  contraindicationNotes?: string;   // When NOT to prescribe
  differentialNotes?: string;       // Key differentiation flags vs. related remedies
}

export interface RepertoryCrossReference {
  rubricId: string;
  relationshipType: "exact-equivalent" | "close-equivalent" | "broader-than" | "narrower-than" | "related-to" | "historical-variant" | "possible-match" | "not-equivalent";
  notes?: string;
}

export type SourceRemedyGrade = {
  originalRepresentation?: string;
  normalizedGrade?: number;
  status:
    | "verified"
    | "unresolved"
    | "not-recoverable"
    | "not-applicable";
  confidence?: number;
};

export interface RepertoryRemedyEntry {
  remedyId: string;
  sourceAbbreviation: string;
  canonicalAbbreviation: string;
  sourceGrade: string | number;
  normalizedGrade?: number;
  gradeSystemId: string;
  sourceId: string;
  sourcePage?: number;
  gradeInfo?: SourceRemedyGrade;
}

export interface RepertoryGradeSystem {
  id: string;
  sourceId: string;
  originalScale: string[];
  normalizedScale?: number[];
  normalizationMethod?: string;
  normalizationConfidence: "exact" | "mapped" | "approximate" | "unmapped";
}

export interface RepertoryRubric {
  rubricId: string;                 // Unique identifier
  title: string;                    // Clinical title
  plainLanguageMeaning: string;     // Translation for patients
  classicalWording: string;         // Standard repertorial text
  category: RubricCategory;         // Enforced category
  organSystem: string;              // Target system (e.g., "Psychology", "Cardiovascular")
  subCategory?: string;             // Detailed hierarchy label
  synonyms: string[];               // Semantic synonyms
  patientExpressions: string[];     // Direct colloquial quotes/phrases from patients
  clinicalKeywords: string[];       // Professional medical/clinical search terms
  relatedSymptoms: string[];        // IDs of other rubrics representing related symptoms
  relatedDiseases: string[];        // Modern condition names/ICD-10
  miasmaticWeight: Record<MiasmType, number>; // Weights from 0.0 to 1.0
  intensityScale: number;           // Default clinical impact (1-10)
  polarity: 'positive' | 'negative'; // Positive triggers, negative represents counter-indications
  modalities: string[];             // Aggravations/ameliorations specific to this rubric
  mentalEmotionalState?: string[];  // Mental connotations
  physicalGenerals?: string[];      // Physical generals
  thermalState?: 'chilly' | 'warm' | 'ambient' | 'variable';
  thirstPattern?: 'thirsty_large' | 'thirsty_small' | 'thirstless' | 'normal';
  foodCravings?: string[];          // Desired foods
  aggravations: string[];           // What worsens this rubric
  ameliorations: string[];          // What improves this rubric
  clinicalNotes?: string;           // Insights from Dr. Jethwani's practice
  source: string;                   // Reference book or clinical study
  confidence: number;               // Reliability index (0.0 to 1.0)
  author: string;                   // Architect who defined the rubric
  reviewer: string;                 // Reviewing clinical authority
  lastUpdated: string;              // ISO timestamp
  relatedRemedies: GradedRemedy[];  // Upgraded structured remedies list

  // Phase 4 - Canonical Data Architecture Additions
  id?: string;                      // Compatibility alias for rubricId
  sourceId?: string;                 // References RepertorySourceRecord.id
  sourceRubricId?: string;           // Original ID in the source dataset
  canonicalConceptId?: string;       // References canonical concept layer
  chapterId?: string;                // References chapter ID
  parentId?: string;                 // References parent rubric ID
  hierarchyPath?: string[];          // List of parent/ancestor names or IDs
  originalText?: string;             // Immutable original source text
  normalizedText?: string;           // Standardized clinical representation
  displayText?: string;              // Clean UI display text (maps to title)
  language?: string;                 // Language code (e.g., 'en')
  rubricType?:
    | "symptom"
    | "modality"
    | "causation"
    | "clinical"
    | "pathological-general"
    | "relationship"
    | "concomitant"
    | "location"
    | "sensation"
    | "other";
  remedyEntries?: RepertoryRemedyEntry[];
  crossReferences?: RepertoryCrossReference[];
  pageStart?: number;
  pageEnd?: number;
  sourceCitation?: string;
  evidenceStatus?: "source-verified" | "editorially-verified";
  editorialStatus?:
    | "draft"
    | "medical-review"
    | "editorial-review"
    | "approved"
    | "published"
    | "archived";
  createdAt?: string;
  updatedAt?: string;
}


export type GraphPredicate =
  | 'relatesTo'          // Rubric -> Rubric (Complementary relationship)
  | 'indicatesRemedy'    // Rubric -> Remedy (Symptom coverage)
  | 'mapsToDisease'      // Rubric -> Modern pathology
  | 'mapsToSymptom'      // Rubric -> Modern symptom
  | 'belongsToOrgan'     // Rubric -> Organ system
  | 'suggestsMiasm'      // Rubric -> Diathesis load
  | 'differentiates';    // Rubric -> Remedy (Differentiating rubric)

export interface GraphTriple {
  subjectId: string;    // Subject ID (Rubric ID, Remedy ID, Disease name)
  predicate: GraphPredicate;
  objectId: string;     // Object ID (Rubric ID, Remedy ID, Miasm, Organ)
  weight?: number;      // Influence strength (0.0 to 1.0)
}

export interface AIIntakeMatch {
  rubricId: string;
  confidence: number; // Match strength (0.0 - 1.0)
  matchedOnField: 'title' | 'classicalWording' | 'patientExpressions' | 'synonyms';
  suggestedSeverity: number; // Inferred from intake adjectives (e.g. "extreme pain" -> 9)
  classification?: 'Mental General' | 'Physical General' | 'Particular' | 'Modality' | 'Etiology' | 'Sensation' | 'Concomitant' | 'Pathology' | 'Miasmatic clue';
}

export interface AIIntakeMappingResult {
  nlpPhrase: string;
  matchedRubrics: AIIntakeMatch[];
  suggestedRemedies: Array<{
    remedyId: string;
    remedyName: string;
    confidence: number;
  }>;
  missingClarificationQuestions: string[];
  repertoryScore: number;
  rubrics?: RepertoryRubric[];
}

export interface ScoringResult {
  topRemedies: Array<{
    remedyId: string;
    remedyName: string;
    score: number;
    matches: number;
    confidence: number;
    kingdom: string;
    miasm: string;
    thermal: string;
    coverageRatio?: string;
    rawScore?: number;
    balancedScore?: number;
    sourceContributions?: Record<string, number>;
    normalizationMethod?: string;
    rubricContributions?: Array<{ rubricId: string; rubricTitle: string; contribution: number; grade: number; sourceId?: string }>;
    contradictoryEvidence?: string[];
    constitutionalFit?: number;
    miasmaticFit?: number;
    modalityFit?: number;
    etiologyFit?: number;
    clinicalConfidence?: number;
    editorialConfidence?: number;
    graphConfidence?: number;
  }>;
  matchedRubrics: string[]; // Rubric IDs covered
  differentiatingRubrics: string[]; // Rubric IDs that distinguish the top remedies
  confidenceScore: number;
  missingDataNeeded: string[]; // General modalities not yet selected
  nonScoringRubrics?: Array<{
    rubricId: string;
    sourceId: string;
    reason:
      | "source-search-only"
      | "unverified-grade-system"
      | "unresolved-remedy-mapping";
  }>;
  warnings?: Array<{
    code: string;
    message: string;
  }>;
}

export interface RemedyDifferentiation {
  remedyId: string;
  remedyName: string;
  reason: string;
  strongestMatchingRubrics: string[];
  missingConfirmingRubrics: string[];
  differentiatingSymptoms: string[];
  cautionNotes?: string;
  materiaMedicaRef?: string;
}

export interface DuplicateMatch {
  rubricId1: string;
  rubricId2: string;
  title1: string;
  title2: string;
  distance: number; // Levenshtein distance percentage (0.0 to 1.0)
}

export interface ProhibitedClaimMatch {
  rubricId: string;
  field: string;
  text: string;
  term: string;
}

export interface ValidationReport {
  isValid: boolean;
  duplicates: DuplicateMatch[];
  missingSynonyms: string[]; // Rubric IDs
  missingRemedyGrades: Array<{ rubricId: string; remedyId: string }>;
  orphanRubrics: string[]; // Rubric IDs
  invalidRemedyIds: Array<{ rubricId: string; remedyId: string }>;
  missingSourceOrReviewer: string[]; // Rubric IDs
  weakClinicalWording: string[]; // Rubric IDs
  prohibitedClaims: ProhibitedClaimMatch[];
  weakDifferentialNotes: Array<{ rubricId: string; remedyId: string; notes?: string }>;
  caseValidationSummary?: {
    totalCases: number;
    passedCases: number;
    failedCases: number;
    expectedRubricsMissed: Array<{ caseId: string; rubricId: string }>;
    expectedRemediesNotInTop3: Array<{ caseId: string; expectedRemedyId: string; actualTopRemedies: string[] }>;
  };
}

export interface CaseScenario {
  caseId: string;
  title: string;
  difficulty: 'easy' | 'moderate' | 'complex';
  intakeText: string;
  expectedRemedyId: string;
  expectedRubrics: string[]; // List of expected matched rubricIds
  rationale: string;         // Must contain "For clinician review."
}

export interface RemedyReasoning {
  remedyId: string;
  remedyName: string;
  confidence: number; // 0 - 100
  matchedRubrics: string[];
  strongestRubrics: string[];
  weakestRubrics: string[];
  supportingEvidence: Record<string, number>; // rubricId -> score contribution
  missingInformation: string[]; // confirmations missing
  differentialRemedies: string[];
  explanation: string;
  materiaMedicaSummary?: string;
  keynotes?: string[];
  modalities?: string[];
  mentals?: string[];
  physicalGenerals?: string[];
  relationships?: {
    complementary?: string[];
    followsWell?: string[];
    inimical?: string[];
    antidotes?: string[];
    acuteChronic?: string;
    family?: string;
  };
  clinicalConfirmations?: string[];
  coverageRatio?: string;
  rubricContributions?: Array<{ rubricId: string; rubricTitle: string; contribution: number; grade: number }>;
  contradictoryEvidence?: string[];
  provenance?: RemedyProvenance;
  clinicalPearls?: any[];
  evidenceItems?: any[];
  editorialRecords?: any[];
  sourcesRegistry?: any;
  constitutionalFit?: number;
  miasmaticFit?: number;
  modalityFit?: number;
  etiologyFit?: number;
  clinicalConfidence?: number;
  editorialConfidence?: number;
  graphConfidence?: number;
}

export interface MissingInformationItem {
  category: string;
  displayName: string;
  key: 'thermal' | 'thirst' | 'modalities' | 'cravings' | 'menses' | 'sleep' | 'etiology' | 'mental';
  clinicianPrompt: string;
}

export interface SuggestedQuestion {
  key: string;
  questionText: string;
  options: string[];
  priority: number; // 1 = High, 2 = Medium, 3 = Low
}

export interface DifferentialComparisonResult {
  remedyA: string;
  remedyB: string;
  sharedRubrics: string[];
  uniqueToA: string[];
  uniqueToB: string[];
  missingConfirmationA: string[];
  missingConfirmationB: string[];
  differentiatingQuestions: string[];
  confidenceGap: number;
  whyAInsteadOfB?: string;
  whyBInsteadOfA?: string;
  strongDifferentiators?: string[];
}

export interface ConfidenceBreakdown {
  mental: number; // 0 - 100
  physical: number;
  modalities: number;
  etiology: number;
  thermals: number;
  overall: number;
}

export interface EvidenceBreakdown {
  remedyScores: Record<string, {
    mental: number;
    physical: number;
    modalities: number;
    thermals: number;
    miasm: number;
    clinicalWeight: number;
    total: number;
  }>;
}

export interface ClinicalReasoningSummary {
  selectedRubrics: string[];
  topRemedies: RemedyReasoning[];
  missingInformation: MissingInformationItem[];
  suggestedQuestions: SuggestedQuestion[];
  differentialComparisons: DifferentialComparisonResult[];
  confidenceBreakdown: Record<string, ConfidenceBreakdown>;
  evidenceBreakdown: EvidenceBreakdown;
  safetyLabel: "Clinical reasoning support for clinician review only.";
  matchedPatterns?: Array<{
    patternName: string;
    matchPercentage: number;
    remedyId: string;
    missingIndicators: Array<{ rubricId: string; title: string }>;
  }>;
}

export interface RemedyProvenance {
  repertorySources: string[];
  materiaMedicaSources: string[];
  graphRelationships: string[];
  confidence: number;
  editorialVerification: string;
}

export type RepertoryRubricVersion = {
  id: string;
  rubricId: string;
  sourceId: string;

  baseSourceVersion: string;
  versionNumber: number;

  originalExtractedText: string;
  correctedDisplayText?: string;
  normalizedText?: string;

  originalRemedyEntries: RepertoryRemedyEntry[];
  correctedRemedyEntries?: RepertoryRemedyEntry[];

  correctionReason: string;

  editorialStatus:
    | "draft"
    | "clinical-review"
    | "editorial-review"
    | "approved"
    | "published"
    | "rejected"
    | "archived";

  createdByUid: string;
  createdByRole: string;
  createdAt: string;

  reviewedByUid?: string;
  reviewedAt?: string;

  supersedesVersionId?: string;
  isCurrentApprovedVersion: boolean;
};

export type RepertoryEditorialAuditLog = {
  id: string;

  entityType:
    | "source"
    | "chapter"
    | "rubric"
    | "rubric-version"
    | "remedy-mapping"
    | "concept-mapping"
    | "publication"
    | "corpus-snapshot";

  entityId: string;
  sourceId?: string;

  action:
    | "created"
    | "corrected"
    | "submitted"
    | "approved"
    | "rejected"
    | "published"
    | "archived"
    | "remedy-resolved"
    | "concept-mapped"
    | "snapshot-built"
    | "snapshot-activated"
    | "snapshot-failed"
    | "snapshot-rolled-back";

  previousValue?: unknown;
  nextValue?: unknown;
  reason: string;

  actorUid: string;
  actorRole: string;

  requestId?: string;
  versionId?: string;
  corpusVersion?: string;
  importManifestId?: string;

  createdAt: string;
};

export type RepertorySourceCapabilities = {
  searchable: boolean;
  citationEnabled: boolean;
  ragEnabled: boolean;
  scoringEnabled: boolean;
  normalizedScoringEnabled: boolean;
  canonicalRemedyClaimsEnabled: boolean;
  unresolvedRemedyDisclosureRequired: boolean;
  gradeStatus: "verified" | "partially-verified" | "unreliable" | "not-present";
};

export type RepertoryPublishedCorpusManifest = {
  corpusVersion: string;
  generatedAt: string;
  generatedBy: string;

  sourceIds: string[];
  sourceVersions: Record<string, string>;

  totalSources: number;
  totalChapters: number;
  totalRubrics: number;
  totalRemedyEntries: number;
  totalCanonicalConcepts: number;

  unresolvedRemedyCount: number;
  excludedRecordCount: number;

  sourceChecksums: Record<string, string>;
  artifactChecksums: Record<string, string>;

  previousCorpusVersion?: string;

  validationStatus: "passed" | "failed";
  validationErrors: string[];

  publicationStatus: "staged" | "active" | "superseded" | "rolled-back";
  sourceCapabilities?: Record<string, RepertorySourceCapabilities>;
};

export interface AuditActor {
  uid: string;
  role: string;
}

export interface RepertoryAcquisitionRecord {
  id: string;
  sourceId: string;
  volumeId?: string;
  candidateSourceUrl?: string;
  sourceProvider?: string;
  archiveIdentifier?: string;
  expectedPhysicalPageCount?: number;
  expectedPrintedPageStart?: string;
  expectedPrintedPageEnd?: string;
  
  acquisitionStatus: "candidate-found" | "rights-review" | "approved-for-acquisition" | "acquired" | "checksum-verified" | "error";
  statusReason?: string;
  
  originalFileName?: string;
  fileSizeBytes?: number;
  sourceChecksum?: string;
  artifactStoragePath?: string;
  
  extractionStatus?: "not-started" | "in-progress" | "complete" | "validation-failed" | "validated";
  parserVersion?: string;
  
  editorialStatus?: "not-submitted" | "clinical-review" | "editorial-review" | "approved" | "rejected";
  publicationStatus?: "not-published" | "staged" | "active" | "superseded" | "blocked";

  createdAt: string;
  updatedAt: string;
}

export interface CreateRepertoryAcquisitionRecordInput {
  sourceId: string;
  volumeId?: string;
  candidateSourceUrl?: string;
  sourceProvider?: string;
  archiveIdentifier?: string;
  expectedPhysicalPageCount?: number;
  expectedPrintedPageStart?: string;
  expectedPrintedPageEnd?: string;
}

export interface AcquisitionTransition {
  status: RepertoryAcquisitionRecord["acquisitionStatus"];
  reason?: string;
}

export interface AcquiredSourceArtifact {
  originalFileName: string;
  fileSizeBytes: number;
  sourceChecksum: string;
  artifactStoragePath: string;
}

export interface RepertoryExtractionStatus {
  extractionStatus: RepertoryAcquisitionRecord["extractionStatus"];
  parserVersion: string;
}

export interface RepertoryAcquisitionRegisterExport {
  generatedAt: string;
  records: RepertoryAcquisitionRecord[];
}

export interface RepertoryExtractionRecord {
  id: string;
  sourceId: string;
  acquisitionRecordId: string;
  sourceLineNumber: number;
  physicalPageIndex: number;
  printedPageNumber: string;
  parserState: "front-matter" | "clinical" | "causation" | "temperaments" | "clinical-relationships" | "natural-relationships" | "index";
  originalText: string;
  normalizedText: string;
  detectedType: "ignored" | "page-anchor" | "section" | "rubric" | "subrubric" | "remedy-continuation" | "unresolved";
  parserRuleId?: string;
  parserConfidence: number;
  parserVersion: string;
  linkedRubricId?: string;
  reviewStatus: "unreviewed" | "reviewed" | "flagged";
}

export type RepertoryParserState = RepertoryExtractionRecord["parserState"];

export interface StateTransition {
  fromState: string;
  toState: string;
  triggerRuleId: string;
}

export interface ParserRule {
  id: string;
  pattern: string;
  description?: string;
}

export interface GradeRule {
  sourceRepresentation: string;
  normalizedGrade: number;
  detectionRule: ParserRule;
}

export interface RepertoryParserProfile {
  sourceId: string;
  parserVersion: string;
  initialState: string;
  stateTransitions: StateTransition[];
  pageAnchorRules: ParserRule[];
  sectionRules: ParserRule[];
  rubricRules: ParserRule[];
  subRubricRules: ParserRule[];
  remedyContinuationRules: ParserRule[];
  crossReferenceRules: ParserRule[];
  pageHeaderRules: ParserRule[];
  pageFooterRules: ParserRule[];
  ignoredLineRules: ParserRule[];
  gradeRules: GradeRule[];
  lineContinuationRules: ParserRule[];
  hyphenationRules: ParserRule[];
  requiredSections: string[];
}

export type RepertoryReleaseState =
  | "engineering-complete"
  | "emulator-verified"
  | "production-deployment-ready"
  | "production-staged"
  | "production-active"
  | "production-rolled-back"
  | "blocked";

export type DurableRepertoryAcquisitionRecord = RepertoryAcquisitionRecord & {
  migratedFromRecordId?: string;
  migrationVersion?: string;
  migrationEnvironment?: "emulator" | "staging" | "production";
};

export type RepertorySourceReviewRecord = {
  id: string;
  sourceId: string;
  acquisitionRecordId: string;
  sourceChecksum: string;
  validationReportId: string;

  reviewType:
    | "clinical"
    | "editorial"
    | "publication";

  decision:
    | "approved"
    | "approved-with-restrictions"
    | "rejected"
    | "changes-requested";

  restrictions: string[];
  findings: string[];
  reason: string;

  actorUid: string;
  actorRole: string;
  capability: string;

  environment:
    | "emulator"
    | "staging"
    | "production";

  createdAt: string;
};

export * from './repertoryTypes';
export * from './remedyTypes';





