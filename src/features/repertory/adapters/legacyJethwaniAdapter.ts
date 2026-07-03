import {
  CanonicalRubric,
  CanonicalRubricCategory,
  ClinicalSystem,
  RemedyPolarity,
  normalizeRemedyGrade,
} from "../engine/canonicalTypes";
import { normalizeRemedyId } from "../engine/remedyNormalizer";

type LegacyJethwaniRubric = {
  rubricId?: unknown;
  id?: unknown;
  name?: unknown;
  title?: unknown;
  plainLanguageMeaning?: unknown;
  classicalWording?: unknown;
  section?: unknown;
  category?: unknown;
  subCategory?: unknown;
  subcategory?: unknown;
  organSystem?: unknown;
  clinicalPriority?: unknown;
  createdDate?: unknown;
  modifiedDate?: unknown;
  lastUpdated?: unknown;
  status?: unknown;
  searchWeight?: unknown;
  indexWeights?: unknown;
  keywords?: unknown;
  clinicalKeywords?: unknown;
  synonyms?: unknown;
  patientExpressions?: unknown;
  relatedSymptoms?: unknown;
  relatedDiseases?: unknown;
  clinicalConditions?: unknown;
  modalities?: unknown;
  miasms?: unknown;
  miasmaticWeight?: unknown;
  intensityScale?: unknown;
  polarity?: unknown;
  mentalEmotionalState?: unknown;
  physicalGenerals?: unknown;
  thermalState?: unknown;
  thirstPattern?: unknown;
  foodCravings?: unknown;
  aggravations?: unknown;
  ameliorations?: unknown;
  clinicalNotes?: unknown;
  confidence?: unknown;
  author?: unknown;
  reviewer?: unknown;
  remedies?: unknown;
  relatedRemedies?: unknown;
  researchCitation?: unknown;
  source?: unknown;
  description?: unknown;
  slug?: unknown;
  parentRubricId?: unknown;
};

const EXPLICIT_FIELDS = new Set([
  "rubricId",
  "id",
  "name",
  "title",
  "plainLanguageMeaning",
  "classicalWording",
  "section",
  "category",
  "subCategory",
  "subcategory",
  "organSystem",
  "clinicalPriority",
  "createdDate",
  "modifiedDate",
  "lastUpdated",
  "status",
  "searchWeight",
  "indexWeights",
  "keywords",
  "clinicalKeywords",
  "synonyms",
  "patientExpressions",
  "relatedSymptoms",
  "relatedDiseases",
  "clinicalConditions",
  "modalities",
  "miasms",
  "miasmaticWeight",
  "intensityScale",
  "polarity",
  "mentalEmotionalState",
  "physicalGenerals",
  "thermalState",
  "thirstPattern",
  "foodCravings",
  "aggravations",
  "ameliorations",
  "clinicalNotes",
  "confidence",
  "author",
  "reviewer",
  "remedies",
  "relatedRemedies",
  "researchCitation",
  "source",
  "description",
  "slug",
  "parentRubricId",
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

function mapPolarity(value: unknown): RemedyPolarity | undefined {
  if (value === "positive" || value === "negative" || value === "unknown") return value;
  return undefined;
}

function sourceGrade(value: unknown): number | undefined {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function adaptRemedyRecord(remedies: unknown) {
  if (!remedies || typeof remedies !== "object" || Array.isArray(remedies)) return [];

  return Object.entries(remedies as Record<string, unknown>).map(([remedyId, grade]) => {
    const originalGrade = sourceGrade(grade);
    return {
      remedyId: normalizeRemedyId(remedyId),
      sourceRemedyId: remedyId,
      grade: normalizeRemedyGrade(grade),
      sourceGrade: originalGrade,
      polarity: originalGrade !== undefined && originalGrade < 0 ? "negative" as const : "positive" as const,
      isEliminating: originalGrade !== undefined && originalGrade < 0,
    };
  });
}

function adaptRelatedRemedies(relatedRemedies: unknown) {
  if (!Array.isArray(relatedRemedies)) return [];

  return relatedRemedies
    .filter((remedy): remedy is Record<string, unknown> => !!remedy && typeof remedy === "object" && !Array.isArray(remedy))
    .map((remedy) => {
      const remedyId = typeof remedy.remedyId === "string" ? remedy.remedyId : String(remedy.remedyId || "");
      const originalGrade = sourceGrade(remedy.grade);
      return {
        remedyId: normalizeRemedyId(remedyId),
        sourceRemedyId: remedyId || undefined,
        remedyName: stringValue(remedy.remedyName),
        grade: normalizeRemedyGrade(remedy.grade),
        sourceGrade: originalGrade,
        polarity: originalGrade !== undefined && originalGrade < 0 ? "negative" as const : mapPolarity(remedy.polarity) || "positive" as const,
        isEliminating: originalGrade !== undefined && originalGrade < 0,
        confidence: numberValue(remedy.confidence),
        keynoteReason: stringValue(remedy.keynoteReason),
        sourceReference: stringValue(remedy.sourceReference),
        clinicalExperienceWeight: numberValue(remedy.clinicalExperienceWeight),
        contraindicationNotes: stringValue(remedy.contraindicationNotes),
        differentialNotes: stringValue(remedy.differentialNotes),
        notes: stringValue(remedy.notes),
        metadata: collectMetadata(remedy, new Set([
          "remedyId",
          "remedyName",
          "grade",
          "confidence",
          "keynoteReason",
          "sourceReference",
          "clinicalExperienceWeight",
          "contraindicationNotes",
          "differentialNotes",
          "notes",
          "polarity",
        ])),
      };
    });
}

function collectMetadata(record: Record<string, unknown>, explicitFields = EXPLICIT_FIELDS): Record<string, unknown> {
  return Object.fromEntries(Object.entries(record).filter(([field]) => !explicitFields.has(field)));
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

function mapCategory(value: unknown): CanonicalRubricCategory {
  const normalized = typeof value === "string" ? value.toLowerCase() : "";
  if (normalized.includes("section")) return "source_section";
  if (normalized.includes("mental")) return "mental_emotional";
  if (normalized.includes("miasm")) return "miasmatic_load";
  return "unknown";
}

export function adaptLegacyJethwaniRubric(record: LegacyJethwaniRubric): CanonicalRubric {
  const warnings: string[] = [];
  const id = typeof record.id === "string" && record.id.trim()
    ? record.id
    : typeof record.rubricId === "string" && record.rubricId.trim()
      ? record.rubricId
      : "unknown-jethwani-rubric";
  const title = typeof record.title === "string" && record.title.trim()
    ? record.title
    : typeof record.name === "string" && record.name.trim()
      ? record.name
      : id;

  if (id === "unknown-jethwani-rubric") warnings.push("missing_id");
  if (title === id) warnings.push("missing_title");

  const remedies = [
    ...adaptRemedyRecord(record.remedies),
    ...adaptRelatedRemedies(record.relatedRemedies),
  ];

  if (remedies.length === 0) warnings.push("missing_remedies");

  const citation = record.researchCitation && typeof record.researchCitation === "object"
    ? {
        sourceName: String((record.researchCitation as { source?: unknown }).source || "Dr. Jethwani Clinical Repertory"),
        detail: String((record.researchCitation as { detail?: unknown }).detail || ""),
      }
    : undefined;

  return {
    id,
    title,
    sourceTitle: stringValue(record.name),
    source: "jethwani",
    sourceId: id,
    rubricId: stringValue(record.rubricId),
    chapter: stringValue(record.section) || stringValue(record.category),
    section: stringValue(record.section),
    slug: stringValue(record.slug),
    parentId: stringOrNull(record.parentRubricId) ?? null,
    parentRubricId: stringOrNull(record.parentRubricId),
    description: stringValue(record.description),
    plainLanguageMeaning: stringValue(record.plainLanguageMeaning),
    classicalWording: stringValue(record.classicalWording),
    category: mapCategory(record.category || record.section),
    sourceCategory: stringValue(record.category),
    subCategory: stringValue(record.subCategory) || stringValue(record.subcategory),
    subcategory: stringValue(record.subcategory) || stringValue(record.subCategory),
    clinicalSystem: mapClinicalSystem(record.organSystem),
    organSystem: stringValue(record.organSystem),
    clinicalPriority: stringValue(record.clinicalPriority),
    createdDate: stringValue(record.createdDate),
    modifiedDate: stringValue(record.modifiedDate),
    lastUpdated: stringValue(record.lastUpdated),
    status: record.status === "active" ? "active" : record.status === "archived" ? "archived" : record.status === "custom" ? "custom" : "unknown",
    sourceStatus: stringValue(record.status),
    searchWeight: numberValue(record.searchWeight),
    indexWeights: numberRecord(record.indexWeights),
    synonyms: stringArray(record.synonyms),
    keywords: stringArray(record.keywords),
    clinicalKeywords: stringArray(record.clinicalKeywords),
    patientExpressions: stringArray(record.patientExpressions),
    relatedSymptoms: stringArray(record.relatedSymptoms),
    relatedDiseases: stringArray(record.relatedDiseases),
    clinicalConditions: stringArray(record.clinicalConditions),
    modalities: stringArray(record.modalities),
    miasms: stringArray(record.miasms),
    miasmaticWeight: numberRecord(record.miasmaticWeight),
    intensityScale: numberValue(record.intensityScale),
    polarity: mapPolarity(record.polarity),
    mentalEmotionalState: stringArray(record.mentalEmotionalState),
    physicalGenerals: stringArray(record.physicalGenerals),
    thermalState: record.thermalState === "chilly" || record.thermalState === "warm" || record.thermalState === "ambient" || record.thermalState === "variable" ? record.thermalState : undefined,
    thirstPattern: record.thirstPattern === "thirsty_large" || record.thirstPattern === "thirsty_small" || record.thirstPattern === "thirstless" || record.thirstPattern === "normal" ? record.thirstPattern : undefined,
    foodCravings: stringArray(record.foodCravings),
    aggravations: stringArray(record.aggravations),
    ameliorations: stringArray(record.ameliorations),
    clinicalNotes: stringValue(record.clinicalNotes),
    confidence: numberValue(record.confidence),
    author: stringValue(record.author),
    reviewer: stringValue(record.reviewer),
    remedies,
    citation,
    metadata: collectMetadata(record as Record<string, unknown>),
    originalRecord: record,
    warnings,
  };
}
