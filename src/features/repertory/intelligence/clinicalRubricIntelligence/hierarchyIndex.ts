import { CanonicalRubric } from "../../engine/canonicalTypes";
import { normalizeSearchText, tokenize } from "../../search/clinicalSearch/tokenizer";
import { buildRubricBreadcrumb, parentPathKey, pathKey } from "./pathParser";
import { RubricHierarchyIndex, RubricHierarchyNode, RubricNodeKind } from "./types";

function addToSetMap(map: Map<string, Set<string>>, key: string | undefined, value: string): void {
  if (!key) return;
  if (!map.has(key)) map.set(key, new Set());
  map.get(key)?.add(value);
}

function crossReferenceIds(rubric: CanonicalRubric): string[] {
  const metadataRefs = rubric.metadata?.crossReferenceIds;
  const metadataRelated = rubric.metadata?.relatedRubricIds;
  const refs = [
    ...(Array.isArray(metadataRefs) ? metadataRefs : []),
    ...(Array.isArray(metadataRelated) ? metadataRelated : []),
    ...(rubric.relatedSymptoms || []),
  ];

  return Array.from(new Set(refs.filter((value): value is string => typeof value === "string" && value.length > 0)));
}

function inferParentId(rubric: CanonicalRubric, idByPath: Map<string, string>, breadcrumbKey: string): string | null {
  if (rubric.parentRubricId) return rubric.parentRubricId;
  if (rubric.parentId) return rubric.parentId;

  const parentKey = parentPathKey(breadcrumbKey.split("/").map((normalizedLabel, index) => ({
    label: normalizedLabel,
    normalizedLabel,
    depth: index,
  })));

  return parentKey ? idByPath.get(parentKey) || null : null;
}

function nodeKind(depth: number, parentId: string | null, childCount: number, siblingCount: number): RubricNodeKind {
  if (!parentId && depth === 0) return childCount > 0 ? "root" : "leaf";
  if (childCount > 0) return "parent";
  if (siblingCount > 0) return "sibling";
  return "leaf";
}

export function buildRubricHierarchyIndex(rubrics: CanonicalRubric[], builtAt = new Date().toISOString()): RubricHierarchyIndex {
  const idsByNormalizedPath = new Map<string, string>();
  const provisional = rubrics.map((rubric) => {
    const breadcrumb = buildRubricBreadcrumb(rubric);
    const normalizedPath = pathKey(breadcrumb.segments);
    idsByNormalizedPath.set(normalizedPath, rubric.id);
    return { rubric, breadcrumb, normalizedPath };
  });

  const childIdsByParentId = new Map<string, Set<string>>();
  const idsByPathToken = new Map<string, Set<string>>();
  const idsByCategory = new Map<string, Set<string>>();
  const idsByClinicalSystem = new Map<string, Set<string>>();
  const idsByCrossReference = new Map<string, Set<string>>();
  const parentById = new Map<string, string | null>();

  provisional.forEach(({ rubric, breadcrumb, normalizedPath }) => {
    const parentId = inferParentId(rubric, idsByNormalizedPath, normalizedPath);
    parentById.set(rubric.id, parentId);
    if (parentId) addToSetMap(childIdsByParentId, parentId, rubric.id);

    breadcrumb.segments.forEach((segment) => {
      tokenize(segment.label).tokens.forEach((token) => addToSetMap(idsByPathToken, token, rubric.id));
    });

    addToSetMap(idsByCategory, normalizeSearchText(rubric.sourceCategory || rubric.category), rubric.id);
    addToSetMap(idsByClinicalSystem, normalizeSearchText(rubric.organSystem || rubric.clinicalSystem), rubric.id);
    crossReferenceIds(rubric).forEach((refId) => addToSetMap(idsByCrossReference, refId, rubric.id));
  });

  const nodesById = new Map<string, RubricHierarchyNode>();

  provisional.forEach(({ rubric, breadcrumb }) => {
    const parentId = parentById.get(rubric.id) || null;
    const childIds = Array.from(childIdsByParentId.get(rubric.id) || []);
    const siblingIds = parentId
      ? Array.from(childIdsByParentId.get(parentId) || []).filter((id) => id !== rubric.id)
      : [];
    const depth = Math.max(0, breadcrumb.segments.length - 1);

    nodesById.set(rubric.id, {
      rubric,
      id: rubric.id,
      parentId,
      childIds,
      siblingIds,
      depth,
      kind: nodeKind(depth, parentId, childIds.length, siblingIds.length),
      path: breadcrumb.segments,
      breadcrumb,
      crossReferenceIds: crossReferenceIds(rubric),
    });
  });

  const rootIds = Array.from(nodesById.values())
    .filter((node) => !node.parentId)
    .map((node) => node.id);

  return {
    nodesById,
    rootIds,
    childIdsByParentId,
    idsByNormalizedPath,
    idsByPathToken,
    idsByCategory,
    idsByClinicalSystem,
    idsByCrossReference,
    builtAt,
  };
}

export function getHierarchyNode(index: RubricHierarchyIndex, rubricId: string): RubricHierarchyNode | null {
  return index.nodesById.get(rubricId) || null;
}
