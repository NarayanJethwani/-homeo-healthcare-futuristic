"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRubricHierarchyIndex = buildRubricHierarchyIndex;
exports.getHierarchyNode = getHierarchyNode;
const tokenizer_1 = require("../../search/clinicalSearch/tokenizer");
const pathParser_1 = require("./pathParser");
function addToSetMap(map, key, value) {
    if (!key)
        return;
    if (!map.has(key))
        map.set(key, new Set());
    map.get(key)?.add(value);
}
function crossReferenceIds(rubric) {
    const metadataRefs = rubric.metadata?.crossReferenceIds;
    const metadataRelated = rubric.metadata?.relatedRubricIds;
    const refs = [
        ...(Array.isArray(metadataRefs) ? metadataRefs : []),
        ...(Array.isArray(metadataRelated) ? metadataRelated : []),
        ...(rubric.relatedSymptoms || []),
    ];
    return Array.from(new Set(refs.filter((value) => typeof value === "string" && value.length > 0)));
}
function inferParentId(rubric, idByPath, breadcrumbKey) {
    if (rubric.parentRubricId)
        return rubric.parentRubricId;
    if (rubric.parentId)
        return rubric.parentId;
    const parentKey = (0, pathParser_1.parentPathKey)(breadcrumbKey.split("/").map((normalizedLabel, index) => ({
        label: normalizedLabel,
        normalizedLabel,
        depth: index,
    })));
    return parentKey ? idByPath.get(parentKey) || null : null;
}
function nodeKind(depth, parentId, childCount, siblingCount) {
    if (!parentId && depth === 0)
        return childCount > 0 ? "root" : "leaf";
    if (childCount > 0)
        return "parent";
    if (siblingCount > 0)
        return "sibling";
    return "leaf";
}
function buildRubricHierarchyIndex(rubrics, builtAt = new Date().toISOString()) {
    const idsByNormalizedPath = new Map();
    const provisional = rubrics.map((rubric) => {
        const breadcrumb = (0, pathParser_1.buildRubricBreadcrumb)(rubric);
        const normalizedPath = (0, pathParser_1.pathKey)(breadcrumb.segments);
        idsByNormalizedPath.set(normalizedPath, rubric.id);
        return { rubric, breadcrumb, normalizedPath };
    });
    const childIdsByParentId = new Map();
    const idsByPathToken = new Map();
    const idsByCategory = new Map();
    const idsByClinicalSystem = new Map();
    const idsByCrossReference = new Map();
    const parentById = new Map();
    provisional.forEach(({ rubric, breadcrumb, normalizedPath }) => {
        const parentId = inferParentId(rubric, idsByNormalizedPath, normalizedPath);
        parentById.set(rubric.id, parentId);
        if (parentId)
            addToSetMap(childIdsByParentId, parentId, rubric.id);
        breadcrumb.segments.forEach((segment) => {
            (0, tokenizer_1.tokenize)(segment.label).tokens.forEach((token) => addToSetMap(idsByPathToken, token, rubric.id));
        });
        addToSetMap(idsByCategory, (0, tokenizer_1.normalizeSearchText)(rubric.sourceCategory || rubric.category), rubric.id);
        addToSetMap(idsByClinicalSystem, (0, tokenizer_1.normalizeSearchText)(rubric.organSystem || rubric.clinicalSystem), rubric.id);
        crossReferenceIds(rubric).forEach((refId) => addToSetMap(idsByCrossReference, refId, rubric.id));
    });
    const nodesById = new Map();
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
function getHierarchyNode(index, rubricId) {
    return index.nodesById.get(rubricId) || null;
}
