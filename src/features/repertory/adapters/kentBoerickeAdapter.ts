import { CanonicalRubric, normalizeRemedyGrade } from "../engine/canonicalTypes";
import { normalizeRemedyId } from "../engine/remedyNormalizer";

type ClassicRepertoryRecord = {
  id?: unknown;
  chapter?: unknown;
  name?: unknown;
  remedies?: unknown;
  source?: unknown;
};

const EXPLICIT_FIELDS = new Set(["id", "chapter", "name", "remedies", "source"]);

function sourceGrade(value: unknown): number | undefined {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function collectMetadata(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(record).filter(([field]) => !EXPLICIT_FIELDS.has(field)));
}

export function adaptKentBoerickeRubric(record: ClassicRepertoryRecord): CanonicalRubric {
  const warnings: string[] = [];
  const source = record.source === "boericke" ? "boericke" : record.source === "kent" ? "kent" : "unknown";
  const id = typeof record.id === "string" && record.id.trim() ? record.id : `unknown-${source}-rubric`;
  const title = typeof record.name === "string" && record.name.trim() ? record.name : id;
  const chapter = typeof record.chapter === "string" ? record.chapter : undefined;

  if (id.startsWith("unknown-")) warnings.push("missing_id");
  if (title === id) warnings.push("missing_title");
  if (!chapter) warnings.push("missing_chapter");

  const remedies = record.remedies && typeof record.remedies === "object" && !Array.isArray(record.remedies)
    ? Object.entries(record.remedies as Record<string, unknown>).map(([remedyId, grade]) => ({
        remedyId: normalizeRemedyId(remedyId),
        sourceRemedyId: remedyId,
        grade: normalizeRemedyGrade(grade),
        sourceGrade: sourceGrade(grade),
        polarity: sourceGrade(grade) !== undefined && sourceGrade(grade)! < 0 ? "negative" as const : "positive" as const,
        isEliminating: sourceGrade(grade) !== undefined && sourceGrade(grade)! < 0,
      }))
    : [];

  if (remedies.length === 0) warnings.push("missing_remedies");

  return {
    id,
    title,
    source,
    sourceId: id,
    sourceTitle: typeof record.name === "string" ? record.name : undefined,
    chapter,
    parentId: null,
    category: "unknown",
    clinicalSystem: chapter?.toLowerCase().includes("mind") ? "psychology_psychiatry" : "unknown",
    status: "active",
    synonyms: [],
    keywords: title.toLowerCase().split(/\s+/).filter(Boolean),
    modalities: [],
    miasms: [],
    remedies,
    citation: source !== "unknown" ? { sourceName: source === "kent" ? "Kent Repertory" : "Boericke Repertory" } : undefined,
    metadata: collectMetadata(record as Record<string, unknown>),
    originalRecord: record,
    warnings,
  };
}
