import { CanonicalRubric } from "../../engine/canonicalTypes";
import { normalizeSearchText } from "../../search/clinicalSearch/tokenizer";
import { RubricBreadcrumb, RubricPathSegment } from "./types";

const PATH_SEPARATOR_REGEX = /\s*(?:>|→|\/|::|\|)\s*/u;

function cleanSegment(segment: string): string {
  return segment.replace(/\s+/g, " ").trim();
}

function sourcePathText(rubric: CanonicalRubric): string {
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

export function parseRubricPath(pathText: string): RubricPathSegment[] {
  return pathText
    .split(PATH_SEPARATOR_REGEX)
    .map(cleanSegment)
    .filter(Boolean)
    .map((label, index) => ({
      label,
      normalizedLabel: normalizeSearchText(label),
      depth: index,
    }));
}

export function pathKey(segments: RubricPathSegment[]): string {
  return segments.map((segment) => segment.normalizedLabel).filter(Boolean).join("/");
}

export function buildRubricBreadcrumb(rubric: CanonicalRubric): RubricBreadcrumb {
  const parsed = parseRubricPath(sourcePathText(rubric));
  const segments = parsed.length > 0 ? parsed : parseRubricPath(rubric.title);

  return {
    rubricId: rubric.id,
    segments,
    displayPath: segments.map((segment) => segment.label).join(" → "),
  };
}

export function parentPathKey(segments: RubricPathSegment[]): string | null {
  if (segments.length <= 1) return null;
  return pathKey(segments.slice(0, -1));
}

export function leafLabel(segments: RubricPathSegment[]): string {
  return segments[segments.length - 1]?.label || "";
}
