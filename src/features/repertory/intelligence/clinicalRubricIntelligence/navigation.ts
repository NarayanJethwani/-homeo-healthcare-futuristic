import {
  ClinicalNavigationNode,
  NearbyRubricSuggestion,
  RubricHierarchyIndex,
  RubricHierarchyNode,
} from "./types";

function toNavigationNode(node: RubricHierarchyNode): ClinicalNavigationNode {
  return {
    rubricId: node.id,
    title: node.rubric.title,
    kind: node.kind,
    depth: node.depth,
    breadcrumb: node.breadcrumb,
    childCount: node.childIds.length,
  };
}

export function getBreadcrumb(index: RubricHierarchyIndex, rubricId: string) {
  return index.nodesById.get(rubricId)?.breadcrumb || null;
}

export function getParentNode(index: RubricHierarchyIndex, rubricId: string): ClinicalNavigationNode | null {
  const node = index.nodesById.get(rubricId);
  if (!node?.parentId) return null;
  const parent = index.nodesById.get(node.parentId);
  return parent ? toNavigationNode(parent) : null;
}

export function getChildNodes(index: RubricHierarchyIndex, rubricId: string): ClinicalNavigationNode[] {
  const node = index.nodesById.get(rubricId);
  if (!node) return [];

  return node.childIds
    .map((childId) => index.nodesById.get(childId))
    .filter((child): child is RubricHierarchyNode => !!child)
    .map(toNavigationNode);
}

export function getSiblingNodes(index: RubricHierarchyIndex, rubricId: string): ClinicalNavigationNode[] {
  const node = index.nodesById.get(rubricId);
  if (!node) return [];

  return node.siblingIds
    .map((siblingId) => index.nodesById.get(siblingId))
    .filter((sibling): sibling is RubricHierarchyNode => !!sibling)
    .map(toNavigationNode);
}

export function getRootNodes(index: RubricHierarchyIndex): ClinicalNavigationNode[] {
  return index.rootIds
    .map((rootId) => index.nodesById.get(rootId))
    .filter((root): root is RubricHierarchyNode => !!root)
    .map(toNavigationNode);
}

export function suggestNearbyRubrics(index: RubricHierarchyIndex, rubricId: string, limit = 12): NearbyRubricSuggestion[] {
  const node = index.nodesById.get(rubricId);
  if (!node) return [];

  const suggestions: NearbyRubricSuggestion[] = [];
  const addSuggestion = (
    candidateId: string | null | undefined,
    relationship: NearbyRubricSuggestion["relationship"],
    reason: string,
  ) => {
    if (!candidateId || candidateId === rubricId || suggestions.some((item) => item.rubric.id === candidateId)) return;
    const candidate = index.nodesById.get(candidateId);
    if (!candidate) return;
    suggestions.push({
      rubric: candidate.rubric,
      relationship,
      breadcrumb: candidate.breadcrumb,
      reason,
    });
  };

  // Explicit source-authored links take precedence over inferred hierarchy links.
  // This also preserves their explanation when a referenced rubric is a sibling.
  node.crossReferenceIds.forEach((crossReferenceId) => addSuggestion(crossReferenceId, "nearby", "Explicit cross-reference"));
  addSuggestion(node.parentId, "parent", "Move one level up");
  node.childIds.forEach((childId) => addSuggestion(childId, "child", "Move one level deeper"));
  node.siblingIds.forEach((siblingId) => addSuggestion(siblingId, "sibling", "Same parent rubric"));

  return suggestions.slice(0, limit);
}

export function findByPath(index: RubricHierarchyIndex, normalizedPath: string): ClinicalNavigationNode | null {
  const rubricId = index.idsByNormalizedPath.get(normalizedPath);
  if (!rubricId) return null;
  const node = index.nodesById.get(rubricId);
  return node ? toNavigationNode(node) : null;
}
