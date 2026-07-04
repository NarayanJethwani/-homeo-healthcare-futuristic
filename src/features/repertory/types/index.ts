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
  grade: 1 | 2 | 3 | 4;             // 1=Low, 2=Moderate, 3=Strong, 4=Keynote
  confidence: number;               // 0.0 - 1.0
  keynoteReason: string;            // Text explanation
  sourceReference: string;          // Materia Medica citation
  clinicalExperienceWeight: number; // Dr. Jethwani's customized practice weighting (0.0 - 1.0)
  contraindicationNotes?: string;   // When NOT to prescribe
  differentialNotes?: string;       // Key differentiation flags vs. related remedies
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
    rubricContributions?: Array<{ rubricId: string; rubricTitle: string; contribution: number; grade: number }>;
    contradictoryEvidence?: string[];
  }>;
  matchedRubrics: string[]; // Rubric IDs covered
  differentiatingRubrics: string[]; // Rubric IDs that distinguish the top remedies
  confidenceScore: number;
  missingDataNeeded: string[]; // General modalities not yet selected
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

