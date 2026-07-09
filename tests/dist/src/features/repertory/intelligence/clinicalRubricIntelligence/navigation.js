"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBreadcrumb = getBreadcrumb;
exports.getParentNode = getParentNode;
exports.getChildNodes = getChildNodes;
exports.getSiblingNodes = getSiblingNodes;
exports.getRootNodes = getRootNodes;
exports.suggestNearbyRubrics = suggestNearbyRubrics;
exports.findByPath = findByPath;
function toNavigationNode(node) {
    return {
        rubricId: node.id,
        title: node.rubric.title,
        kind: node.kind,
        depth: node.depth,
        breadcrumb: node.breadcrumb,
        childCount: node.childIds.length,
    };
}
function getBreadcrumb(index, rubricId) {
    return index.nodesById.get(rubricId)?.breadcrumb || null;
}
function getParentNode(index, rubricId) {
    const node = index.nodesById.get(rubricId);
    if (!node?.parentId)
        return null;
    const parent = index.nodesById.get(node.parentId);
    return parent ? toNavigationNode(parent) : null;
}
function getChildNodes(index, rubricId) {
    const node = index.nodesById.get(rubricId);
    if (!node)
        return [];
    return node.childIds
        .map((childId) => index.nodesById.get(childId))
        .filter((child) => !!child)
        .map(toNavigationNode);
}
function getSiblingNodes(index, rubricId) {
    const node = index.nodesById.get(rubricId);
    if (!node)
        return [];
    return node.siblingIds
        .map((siblingId) => index.nodesById.get(siblingId))
        .filter((sibling) => !!sibling)
        .map(toNavigationNode);
}
function getRootNodes(index) {
    return index.rootIds
        .map((rootId) => index.nodesById.get(rootId))
        .filter((root) => !!root)
        .map(toNavigationNode);
}
function suggestNearbyRubrics(index, rubricId, limit = 12) {
    const node = index.nodesById.get(rubricId);
    if (!node)
        return [];
    const suggestions = [];
    const addSuggestion = (candidateId, relationship, reason) => {
        if (!candidateId || candidateId === rubricId || suggestions.some((item) => item.rubric.id === candidateId))
            return;
        const candidate = index.nodesById.get(candidateId);
        if (!candidate)
            return;
        suggestions.push({
            rubric: candidate.rubric,
            relationship,
            breadcrumb: candidate.breadcrumb,
            reason,
        });
    };
    addSuggestion(node.parentId, "parent", "Move one level up");
    node.childIds.forEach((childId) => addSuggestion(childId, "child", "Move one level deeper"));
    node.siblingIds.forEach((siblingId) => addSuggestion(siblingId, "sibling", "Same parent rubric"));
    node.crossReferenceIds.forEach((crossReferenceId) => addSuggestion(crossReferenceId, "nearby", "Explicit cross-reference"));
    return suggestions.slice(0, limit);
}
function findByPath(index, normalizedPath) {
    const rubricId = index.idsByNormalizedPath.get(normalizedPath);
    if (!rubricId)
        return null;
    const node = index.nodesById.get(rubricId);
    return node ? toNavigationNode(node) : null;
}
