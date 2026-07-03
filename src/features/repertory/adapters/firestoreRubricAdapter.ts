import {
  CanonicalRubric,
  CanonicalRubricCategory,
  ClinicalSystem,
  RemedyPolarity,
  normalizeRemedyGrade,
} from "../engine/canonicalTypes";
import { normalizeRemedyId } from "../engine/remedyNormalizer";

type FirestoreRubricRecord = {
  id?: unknown;
  name?: unknown;
  slug?: unknown;
  parentRubricId?: unknown;
  description?: unknown;
  category?: unknown;
  subcategory?: unknown;
  organSystem?: unknown;
  clinicalPriority?: unknown;
  createdDate?: unknown;
  modifiedDate?: unknown;
  status?: unknown;
  searchWeight?: unknown;
  indexWeights?: unknown;
  keywords?: unknown;
  synonyms?: unknown;
  clinicalConditions?: unknown;
  modalities?: unknown;
  miasms?: unknown;
  remedies?: unknown;
  researchCitation?: unknown;
};

const EXPLICIT_FIELDS = new Set([
  "id",
  "name",
  "slug",
  "parentRubricId",
  "description",
  "category",
  "subcategory",
  "organSystem",
  "clinicalPriority",
  "createdDate",
  "modifiedDate",
  "status",
  "searchWeight",
  "indexWeights",
  "keywords",
  "synonyms",
  "clinicalConditions",
  "modalities",
  "miasms",
  "remedies",
  "researchCitation",
]);

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function stringOrNull(value: unknown): string | null | undefined {
  if (value === null) return null;
  return stringValue(value);
}

function numberRecord(value: unknown): Record<string, number> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const entries = Object.entries(value as Record<string, unknown>).filter((entry): entry is [string, number] => (
    typeof entry[1] === "number" && Number.isFinite(entry[1])
  ));
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function sourceGrade(value: unknown): number | undefined {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function mapRemedyPolarity(value: unknown): RemedyPolarity {
  const grade = sourceGrade(value);
  return grade !== undefined && grade < 0 ? "negative" : "positive";
}

function collectMetadata(record: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(record).filter(([field]) => !EXPLICIT_FIELDS.has(field)));
}

function mapCategory(value: unknown): CanonicalRubricCategory {
  const normalized = typeof value === "string" ? value.toLowerCase() : "";
  if (normalized.includes("section")) return "source_section";
  if (normalized.includes("mental")) return "mental_emotional";
  if (normalized.includes("miasm")) return "miasmatic_load";
  if (normalized.includes("digestive") || normalized.includes("gi")) return "digestive";
  if (normalized.includes("skin")) return "skin";
  return "unknown";
}

function mapClinicalSystem(value: unknown): ClinicalSystem {
  const normalized = typeof value === "string" ? value.toLowerCase() : "";
  if (normalized.includes("psych")) return "psychology_psychiatry";
  if (normalized.includes("gastro")) return "gastrointestinal";
  if (normalized.includes("resp")) return "respiratory";
  if (normalized.includes("skin") || normalized.includes("integumentary")) return "skin_integumentary";
  if (normalized.includes("endo")) return "endocrine";
  if (normalized.includes("musculo")) return "musculoskeletal";
  if (normalized.includes("cardio")) return "cardiovascular";
  if (normalized.includes("general")) return "generalities";
  return "unknown";
}

export function adaptFirestoreRubric(record: FirestoreRubricRecord): CanonicalRubric {
  const warnings: string[] = [];
  const id = typeof record.id === "string" && record.id.trim() ? record.id : "unknown-firestore-rubric";
  const title = typeof record.name === "string" && record.name.trim() ? record.name : id;

  if (id === "unknown-firestore-rubric") warnings.push("missing_id");
  if (title === id) warnings.push("missing_title");

  const remedies = record.remedies && typeof record.remedies === "object" && !Array.isArray(record.remedies)
    ? Object.entries(record.remedies as Record<string, unknown>).map(([remedyId, grade]) => ({
        remedyId: normalizeRemedyId(remedyId),
        sourceRemedyId: remedyId,
        grade: normalizeRemedyGrade(grade),
        sourceGrade: sourceGrade(grade),
        polarity: mapRemedyPolarity(grade),
        isEliminating: sourceGrade(grade) !== undefined && sourceGrade(grade)! < 0,
      }))
    : [];

  if (remedies.length === 0) warnings.push("missing_remedies");

  const citation = record.researchCitation && typeof record.researchCitation === "object"
    ? {
        sourceName: String((record.researchCitation as { source?: unknown }).source || "Firestore rubric"),
        detail: String((record.researchCitation as { detail?: unknown }).detail || ""),
      }
    : undefined;

  return {
    id,
    title,
    sourceTitle: stringValue(record.name),
    source: "firestore",
    sourceId: id,
    chapter: stringValue(record.category),
    slug: stringValue(record.slug),
    parentId: stringOrNull(record.parentRubricId) ?? null,
    parentRubricId: stringOrNull(record.parentRubricId),
    description: stringValue(record.description),
    category: mapCategory(record.category),
    sourceCategory: stringValue(record.category),
    subCategory: stringValue(record.subcategory),
    subcategory: stringValue(record.subcategory),
    clinicalSystem: mapClinicalSystem(record.organSystem),
    organSystem: stringValue(record.organSystem),
    clinicalPriority: stringValue(record.clinicalPriority),
    createdDate: stringValue(record.createdDate),
    modifiedDate: stringValue(record.modifiedDate),
    status: record.status === "active" ? "active" : record.status === "archived" ? "archived" : record.status === "custom" ? "custom" : "unknown",
    sourceStatus: stringValue(record.status),
    searchWeight: numberValue(record.searchWeight),
    indexWeights: numberRecord(record.indexWeights),
    synonyms: stringArray(record.synonyms),
    keywords: stringArray(record.keywords),
    clinicalConditions: stringArray(record.clinicalConditions),
    modalities: stringArray(record.modalities),
    miasms: stringArray(record.miasms),
    remedies,
    citation,
    metadata: collectMetadata(record as Record<string, unknown>),
    originalRecord: record,
    warnings,
  };
}
