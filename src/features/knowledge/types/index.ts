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

export interface KnowledgeEntity {
  id: string; // prefix-slug e.g. "DIS-gerd", "REM-sulphur"
  slug: string; // lowercase URL slug e.g. "gerd", "sulphur"
  entityType: EntityType;
  editorialStatus: EditorialStatus;
  versionInfo: ContentVersion;
  title: LocalizedString;
  summary: LocalizedString;
  content: {
    // Entity-specific key-value pairs
    mainContent?: LocalizedString;
    whatItMeans?: LocalizedString;
    commonSymptoms?: LocalizedString[];
    whenToConsultDoctor?: LocalizedString;
    conventionalPerspective?: LocalizedString;
    homeopathicPerspective?: LocalizedString;
    remedyConsiderations?: LocalizedString;
    lifestyleDietGuidance?: LocalizedString;
    references?: string[];
    [key: string]: any;
  };
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
  | "hasDietAdvice";

export interface KnowledgeRelationship {
  source: string; // Source ID e.g., "DIS-gerd"
  relation: RelationshipType;
  target: string; // Target ID e.g., "SYM-heartburn"
}
