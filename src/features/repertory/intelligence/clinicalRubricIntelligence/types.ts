import { CanonicalRubric } from "../../engine/canonicalTypes";

export type RubricNodeKind = "root" | "parent" | "child" | "sibling" | "leaf";

export type RubricRelationshipType =
  | "parent"
  | "child"
  | "sibling"
  | "same_path"
  | "shared_category"
  | "shared_clinical_system"
  | "shared_modality"
  | "shared_miasm"
  | "shared_condition"
  | "cross_reference"
  | "synonym";

export interface RubricPathSegment {
  label: string;
  normalizedLabel: string;
  depth: number;
}

export interface RubricBreadcrumb {
  rubricId: string;
  segments: RubricPathSegment[];
  displayPath: string;
}

export interface RubricHierarchyNode {
  rubric: CanonicalRubric;
  id: string;
  parentId: string | null;
  childIds: string[];
  siblingIds: string[];
  depth: number;
  kind: RubricNodeKind;
  path: RubricPathSegment[];
  breadcrumb: RubricBreadcrumb;
  crossReferenceIds: string[];
}

export interface RubricHierarchyIndex {
  nodesById: Map<string, RubricHierarchyNode>;
  rootIds: string[];
  childIdsByParentId: Map<string, Set<string>>;
  idsByNormalizedPath: Map<string, string>;
  idsByPathToken: Map<string, Set<string>>;
  idsByCategory: Map<string, Set<string>>;
  idsByClinicalSystem: Map<string, Set<string>>;
  idsByCrossReference: Map<string, Set<string>>;
  builtAt: string;
}

export interface RelatedRubricReason {
  type: RubricRelationshipType;
  detail: string;
  weight: number;
}

export interface RelatedRubricResult {
  rubric: CanonicalRubric;
  score: number;
  reasons: RelatedRubricReason[];
  breadcrumb: RubricBreadcrumb;
}

export interface NearbyRubricSuggestion {
  rubric: CanonicalRubric;
  relationship: "parent" | "child" | "sibling" | "nearby";
  breadcrumb: RubricBreadcrumb;
  reason: string;
}

export interface ClinicalNavigationNode {
  rubricId: string;
  title: string;
  kind: RubricNodeKind;
  depth: number;
  breadcrumb: RubricBreadcrumb;
  childCount: number;
}
