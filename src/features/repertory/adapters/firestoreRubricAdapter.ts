import {
  CanonicalRubric,
  CanonicalRubricCategory,
  ClinicalSystem,
  normalizeRemedyGrade,
} from "../engine/canonicalTypes";
import { normalizeRemedyId } from "../engine/remedyNormalizer";

type FirestoreRubricRecord = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  category?: unknown;
  subcategory?: unknown;
  organSystem?: unknown;
  status?: unknown;
  keywords?: unknown;
  synonyms?: unknown;
  modalities?: unknown;
  miasms?: unknown;
  remedies?: unknown;
  researchCitation?: unknown;
};

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
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
        grade: normalizeRemedyGrade(grade),
        sourceGrade: typeof grade === "number" ? grade : Number(grade),
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
    source: "firestore",
    sourceId: id,
    chapter: typeof record.category === "string" ? record.category : undefined,
    parentId: null,
    category: mapCategory(record.category),
    clinicalSystem: mapClinicalSystem(record.organSystem),
    status: record.status === "active" ? "active" : "unknown",
    synonyms: stringArray(record.synonyms),
    keywords: stringArray(record.keywords),
    modalities: stringArray(record.modalities),
    miasms: stringArray(record.miasms),
    remedies,
    citation,
    originalRecord: record,
    warnings,
  };
}

