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
  | "medical-review"
  | "legal-review"
  | "published"
  | "archived";

export type EvidenceLevel =
  | "Level-A" // RCTs / Systematic Reviews
  | "Level-B" // Cohort / Case-Control
  | "Level-C" // Observational / Case Series
  | "Expert-Opinion"
  | "Traditional-Literature"
  | "Clinical-Experience";

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

export interface CitationRecord {
  id: string; // e.g. "CIT-0001"
  title: string;
  authors: string[];
  journal: string;
  doi?: string;
  pubmedId?: string;
  year: number;
  citationStyle: string; // e.g. "AMA"
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
  versionInfo: ContentVersion;
  title: LocalizedString;
  summary: LocalizedString;
  featured?: boolean;
  categories?: string[];
  content: RemedyContent | DiseaseContent | SymptomContent | LabTestContent | any;
  author: Author;
  reviewer: Reviewer;
  evidenceLevel: EvidenceLevel;
  tags: string[];
  canonicalUrl: string;
  readingTimeMinutes: number;
  audience: "patient" | "student" | "practitioner";
  license: string;
  changeLog?: string[];
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

