"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRubricPath = parseRubricPath;
exports.pathKey = pathKey;
exports.buildRubricBreadcrumb = buildRubricBreadcrumb;
exports.parentPathKey = parentPathKey;
exports.leafLabel = leafLabel;
const tokenizer_1 = require("../../search/clinicalSearch/tokenizer");
const PATH_SEPARATOR_REGEX = /\s*(?:>|→|\/|::|\|)\s*/u;
function cleanSegment(segment) {
    return segment.replace(/\s+/g, " ").trim();
}
function sourcePathText(rubric) {
    const explicitPath = typeof rubric.metadata?.path === "string" ? rubric.metadata.path : undefined;
    const sourcePath = typeof rubric.metadata?.sourcePath === "string" ? rubric.metadata.sourcePath : undefined;
    return explicitPath || sourcePath || [
        rubric.chapter,
        rubric.section,
        rubric.sourceCategory,
        rubric.subCategory || rubric.subcategory,
        rubric.title,
    ].filter(Boolean).join(" > ");
}
function parseRubricPath(pathText) {
    return pathText
        .split(PATH_SEPARATOR_REGEX)
        .map(cleanSegment)
        .filter(Boolean)
        .map((label, index) => ({
        label,
        normalizedLabel: (0, tokenizer_1.normalizeSearchText)(label),
        depth: index,
    }));
}
function pathKey(segments) {
    return segments.map((segment) => segment.normalizedLabel).filter(Boolean).join("/");
}
function buildRubricBreadcrumb(rubric) {
    const parsed = parseRubricPath(sourcePathText(rubric));
    const segments = parsed.length > 0 ? parsed : parseRubricPath(rubric.title);
    return {
        rubricId: rubric.id,
        segments,
        displayPath: segments.map((segment) => segment.label).join(" → "),
    };
}
function parentPathKey(segments) {
    if (segments.length <= 1)
        return null;
    return pathKey(segments.slice(0, -1));
}
function leafLabel(segments) {
    return segments[segments.length - 1]?.label || "";
}
