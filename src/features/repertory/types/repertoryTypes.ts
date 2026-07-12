export type Brand<K, T> = K & { readonly __brand: T };

export type RepertorySourceId = Brand<string, "RepertorySourceId">;
export type RepertoryEditionId = Brand<string, "RepertoryEditionId">;
export type RepertoryChapterId = Brand<string, "RepertoryChapterId">;
export type RubricConceptId = Brand<string, "RubricConceptId">;
export type RubricRecordId = Brand<string, "RubricRecordId">;

export interface RepertorySource {
  id: RepertorySourceId;
  displayName: string;
  shortName: string;
  author: string;
  originalLanguage: string;
  sourceType: "classical" | "modern" | "clinical_experience";
}

export interface RepertoryEdition {
  id: RepertoryEditionId;
  sourceId: RepertorySourceId;
  editionName: string;
  publicationYear: number;
  originalPublicationYear?: number;
  language: string;
  rightsStatus: "public_domain" | "licensed" | "internal" | "experimental" | "restricted" | "disabled";
  publicationStatus: "not_published" | "staged" | "active" | "superseded" | "blocked";
  citationFormat: string;
  corpusVersion: string;
  rightsReviewNotes?: string;
}

export interface RepertoryChapter {
  id: RepertoryChapterId;
  sourceId: RepertorySourceId;
  editionId: RepertoryEditionId;
  stableChapterKey?: string;
  displayTitle: string;
  parentChapterId?: RepertoryChapterId;
  hierarchyLevel: number;
  ordering: number;
  rubricCount?: number;
  corpusVersion: string;
}

export interface RepertoryRubricRecord {
  id: RubricRecordId;
  conceptId: RubricConceptId;
  sourceId: RepertorySourceId;
  editionId: RepertoryEditionId;
  chapterId: RepertoryChapterId;
  hierarchyPath: string[];
  displayText: string;
  classicalWording?: string;
  plainLanguageMeaning?: string;
  parentRecordId?: RubricRecordId;
  depth: number;
  hasChildren: boolean;
  sourceVersion: string;
}

export interface RepertoryEntitlement {
  editionId: RepertoryEditionId;
  organizationId: string;
  entitlementType: "licensed" | "internal" | "experimental";
  validFrom?: string;
  validUntil?: string;
  status: "active" | "expired" | "revoked";
}

export interface RepertoryAccessContext {
  userId: string;
  organizationId?: string;
  userRole: string;
  organizationEntitlements: RepertoryEntitlement[];
  activeFeatureFlags: string[];
}

export interface AccessDecision {
  allowed: boolean;
  reason?:
    | "not_authenticated"
    | "not_entitled"
    | "restricted"
    | "disabled"
    | "feature_disabled"
    | "internal_only"
    | "edition_inactive";
}
