import { 
  Locale, 
  EvidenceLevel, 
  Author, 
  Reviewer, 
  ContentVersion, 
  EntityType,
  RemedyContent,
  DiseaseContent,
  SymptomContent,
  LabTestContent
} from "../../knowledge/types";

export type EditorialRole = 
  | "Administrator" 
  | "MedicalEditor" 
  | "Reviewer" 
  | "Contributor" 
  | "Viewer";

export type EditorialStatus = 
  | "draft" 
  | "medical-review" 
  | "legal-review" 
  | "published" 
  | "archived";

export interface VersionChangeLog {
  version: string;
  updatedAt: string;
  author: string;
  fieldsChanged: string[];
  reason: string;
  snapshot: string; // JSON string snapshot of full entity for rollbacks
}

export interface KmsKnowledgeEntity {
  id: string;
  slug: string;
  entityType: EntityType;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  relatedEntities: string[];
  lastReviewed: string; // ISO String
  lastUpdated: string; // ISO String
  author: Author;
  reviewer: Reviewer;
  evidenceLevel: EvidenceLevel;
  tags: string[];
  canonicalUrl: string;
  editorialStatus: EditorialStatus;
  
  // Extended Editorial Governance fields
  editorialNotes: string; // Internal-only, never published
  nextReviewDate: string; // ISO String for scheduled reviews
  versionInfo: ContentVersion & {
    changelog: VersionChangeLog[];
  };
  
  // Content details matching each specific subclass
  content?: RemedyContent | DiseaseContent | SymptomContent | LabTestContent | any;
  
  // Score metrics
  readabilityScore: {
    score: number; // 0-100 Flesch-like
    readingLevel: "Patient Friendly" | "Medical Professional" | "Mixed";
    readingTimeMinutes: number;
  };
  seoGeoScores: {
    seoScore: number; // 0-100
    geoScore: number; // 0-100
    aiReadinessScore: number; // 0-100
  };
}

export interface CitationRecord {
  id: string; // Central unique Citation ID (e.g. CIT-001)
  title: string;
  authors: string[];
  journal: string;
  doi?: string;
  pubmedId?: string;
  year: number;
  citationStyle: string; // e.g. AMA, APA
  usageCount: number;
  linkedEntities: string[]; // Entity IDs referencing this citation
}

export interface AuditLogEntry {
  id: string;
  entityId: string;
  entityTitle: string;
  action: "create" | "update" | "workflow_change" | "rollback" | "delete";
  performedBy: string;
  performedAt: string; // ISO String
  role: EditorialRole;
  fieldsChanged?: string[];
  oldValue?: string;
  newValue?: string;
  reason?: string;
}

export interface QualityCheckIssue {
  rule: string;
  severity: "error" | "warning";
  message: string;
}

export interface QualityGateResult {
  passed: boolean;
  score: number; // 0-100 percentage
  issues: QualityCheckIssue[];
  prohibitedClaimsFound: string[];
}
