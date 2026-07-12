import { KnowledgeEditorialStatus, KnowledgeEvidenceProfile, EvidenceStrength, SourceQuality } from "../types";

export type ClinicalGraphNodeType =
  | "knowledge-entity"
  | "remedy"
  | "rubric"
  | "symptom"
  | "condition"
  | "clinical-concept"
  | "modality"
  | "constitution"
  | "miasmatic-concept"
  | "organ-system"
  | "pathology"
  | "materia-medica-entry"
  | "repertory-entry"
  | "clinical-protocol"
  | "research-source"
  | "publication"
  | "author"
  | "specialty"
  | "terminology-code";

export type ClinicalGraphRelationshipType =
  | "associated-with"
  | "contains"
  | "part-of"
  | "describes"
  | "references"
  | "supported-by"
  | "contradicted-by"
  | "related-to"
  | "has-symptom"
  | "has-modality"
  | "mapped-to-rubric"
  | "rubric-includes-remedy"
  | "remedy-covers-symptom"
  | "condition-associated-with-symptom"
  | "concept-broader-than"
  | "concept-narrower-than"
  | "concept-equivalent-to"
  | "classified-under"
  | "applies-to-specialty"
  | "mapped-to-terminology";

export type ClinicalGraphEdgeStatus =
  | "draft"
  | "medical-review"
  | "editorial-review"
  | "approved"
  | "published"
  | "rejected"
  | "disputed"
  | "archived";

export interface ExternalOntologyReference {
  ontology: "SNOMED-CT" | "ICD-11" | "MeSH" | "RxNorm" | "LOINC" | "UMLS";
  code: string;
  display: string;
  version: string;
}

export interface ClinicalGraphNode {
  id: string; // unique, immutable graphNodeId (e.g. "gn_0001")
  nodeType: ClinicalGraphNodeType;

  canonicalEntityId: string; // Resolves to the CMS article or repertory ID
  canonicalEntityVersion?: string; // Published snapshot version ID

  label: string;
  normalizedLabel: string;
  aliases?: string[];
  description?: string;

  editorialStatus: KnowledgeEditorialStatus;
  legacyVerificationStatus?: string;

  sourceEntityType: string;
  sourceCollection?: string;

  externalOntology?: ExternalOntologyReference;

  evidenceProfile?: KnowledgeEvidenceProfile;
  retrievalEligible: boolean;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  schemaVersion: string;
}

export type GraphProvenanceType =
  | "published-knowledge-version"
  | "materia-medica-source"
  | "repertory-source"
  | "research-source"
  | "editorial-assessment"
  | "terminology-mapping"
  | "migration"
  | "system-derived";

export interface GraphEdgeProvenance {
  provenanceType: GraphProvenanceType;
  sourceEntityId?: string;
  sourceVersionId?: string;
  sourceReferenceId?: string; // CIT-xxx
  sourceTitle?: string;
  locator?: {
    page?: string;
    chapter?: string;
    section?: string;
    rubricPath?: string;
    paragraph?: string;
  };
  extractedBy: "human" | "deterministic-parser" | "migration";
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface ClinicalGraphEdge {
  id: string; // Unique, deterministic edge fingerprint key

  sourceNodeId: string; // graphNodeId
  targetNodeId: string; // graphNodeId

  relationshipType: ClinicalGraphRelationshipType;
  direction: "directed" | "undirected";

  status: ClinicalGraphEdgeStatus;

  sourceEntityId?: string;
  sourceVersionId?: string;
  targetEntityId?: string;
  targetVersionId?: string;

  provenance: GraphEdgeProvenance[];

  confidence: number; // 0.0 to 1.0
  evidenceStrength: "high" | "moderate" | "low" | "expert-opinion" | "unknown";
  sourceQuality: "unverified" | "secondary" | "primary" | "peer-reviewed" | "authoritative";

  clinicalReviewRequired: boolean;

  rationale?: string;
  limitations?: string[];

  // Temporal validity & historical lineage
  validFrom?: string;
  validUntil?: string;
  supersededByEdge?: string;
  previousVersionEdge?: string;

  revision: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  schemaVersion: string;

  // AI-assisted reasoning placeholders
  aiMetadata?: {
    retrievalWeight?: number;
    confidence?: number;
    evidenceStrength?: "high" | "moderate" | "low" | "expert-opinion" | "unknown";
    explanation?: string;
    reasoningTags?: string[];
  };
}
