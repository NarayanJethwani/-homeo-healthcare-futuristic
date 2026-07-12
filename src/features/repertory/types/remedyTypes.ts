import {
  Brand,
  RepertorySourceId,
  RepertoryEditionId,
  RubricRecordId,
  RubricConceptId
} from "./repertoryTypes";

export type RemedyConceptId = Brand<string, "RemedyConceptId">;
export type RemedyRecordId = Brand<string, "RemedyRecordId">;
export type RubricRemedyGradeId = Brand<string, "RubricRemedyGradeId">;

export type GradeRecordState =
  | "active"
  | "duplicate_exact"
  | "conflicted"
  | "disputed"
  | "superseded"
  | "excluded";

export type EditorialStatus =
  | "verified"
  | "clinically_reviewed"
  | "editorially_reviewed"
  | "imported"
  | "needs_review"
  | "conflicted"
  | "deprecated";

export type EditionPresenceState =
  | "recorded"
  | "not_recorded_in_verified_corpus"
  | "corpus_incomplete"
  | "unresolved"
  | "unavailable";

export interface RemedyAliasRecord {
  id: string;
  remedyConceptId: RemedyConceptId;
  sourceId?: RepertorySourceId;
  editionId?: RepertoryEditionId;
  value: string;
  aliasType:
    | "source_abbreviation"
    | "historical_abbreviation"
    | "legacy_abbreviation"
    | "synonym"
    | "common_name"
    | "deprecated_abbreviation";
  status: "verified" | "provisional" | "deprecated";
  provenance?: RemedyMappingProvenance;
}

export interface RemedyTaxonomyAssertion {
  rank: "kingdom" | "family" | "genus" | "species" | "other";
  value: string;
  source?: string;
  status: "verified" | "provisional";
}

export interface RemedyConcept {
  id: RemedyConceptId;
  canonicalName: string;
  latinName: string;
  family: string;
  kingdom: string;
  scientificName: string;
  canonicalDisplayName: string;
  aliases: RemedyAliasRecord[];
  historicalAbbreviations: string[];
  taxonomy: RemedyTaxonomyAssertion[];
  registryStatus: "verified" | "provisional" | "unresolved" | "deprecated";
}

export interface GradeSourceProvenance {
  sourceId: RepertorySourceId;
  editionId: RepertoryEditionId;
  corpusVersion: string;
  printing?: string;
  publicationYear?: number;
  page?: string;
  column?: string;
  paragraph?: string;
  sourceLocation?: string;
}

export interface GradeExtractionProvenance {
  extractionMethod:
    | "manual"
    | "verified_import"
    | "ocr_reviewed"
    | "licensed_feed";
  extractionVersion: string;
  extractedAt?: string;
  extractedBy?: string;
  ocrEngineVersion?: string;
}

export interface RemedyMappingProvenance {
  mappingMethod:
    | "editorial_exact"
    | "edition_registry"
    | "manual_review"
    | "provisional_normalization";
  mappingRuleVersion: string;
  mappedBy?: string;
  mappedAt?: string;
  mappingNotes?: string;
}

export interface RepertoryRemedyRecord {
  id: RemedyRecordId;
  conceptId: RemedyConceptId;
  editionId?: RepertoryEditionId;
  sourceAbbreviation: string;
  sourceDisplayName?: string;
  mappingStatus: "verified" | "provisional" | "unresolved" | "conflicted";
  mappingConfidence: "verified" | "reviewed" | "probable" | "manual" | "unknown";
  provenance?: RemedyMappingProvenance;
}

export interface RubricRemedyGrade {
  id: RubricRemedyGradeId;
  rubricRecordId: RubricRecordId;
  rubricConceptId: RubricConceptId;
  remedyRecordId: RemedyRecordId;
  remedyConceptId: RemedyConceptId;
  originalGrade: string;
  /** @deprecated Use originalGrade instead. */
  sourceGrade?: string | number;
  normalizedGrade?: number;
  gradingSystemId: string;
  gradingSystemVersion: string;
  gradeState: GradeRecordState;
  editorialStatuses: EditorialStatus[];
  sourceProvenance: GradeSourceProvenance;
  extractionProvenance: GradeExtractionProvenance;
  mappingProvenance: RemedyMappingProvenance;
}

export interface RubricRemedyGradeView {
  grade: RubricRemedyGrade;
  remedyRecord: RepertoryRemedyRecord;
  remedyConcept?: RemedyConcept;
  hasConflict: boolean;
  conflictDetails?: string;
  presenceState?: EditionPresenceState;
  crossEditionObservations?: string[];
}
