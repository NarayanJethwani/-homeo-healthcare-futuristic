export type CanonicalRubricSource = "jethwani" | "kent" | "boericke" | "firestore" | "unknown";

export type CanonicalRubricStatus = "draft" | "reviewed" | "active" | "archived" | "custom" | "deprecated" | "unknown";

export type CanonicalRubricCategory =
  | "mental_emotional"
  | "constitutional_generals"
  | "etiology"
  | "physical_generals"
  | "thermal_state"
  | "food_cravings"
  | "sleep"
  | "female_menses"
  | "digestive"
  | "respiratory"
  | "skin"
  | "pain"
  | "modalities"
  | "miasmatic_load"
  | "followup_response"
  | "modern_clinical_condition"
  | "source_section"
  | "unknown";

export type ClinicalSystem =
  | "psychology_psychiatry"
  | "generalities"
  | "gastrointestinal"
  | "respiratory"
  | "skin_integumentary"
  | "endocrine"
  | "musculoskeletal"
  | "cardiovascular"
  | "genitourinary"
  | "female_reproductive"
  | "unknown";

export type RemedyGrade = 0 | 1 | 2 | 3 | 4;

export type RemedyPolarity = "positive" | "negative" | "unknown";

export type MiasmType = "Psora" | "Sycosis" | "Syphilis" | "Tubercular" | "Cancerinic";

export type ClinicalIndexKey =
  | "stress_load"
  | "anxiety_severity"
  | "sleep_quality"
  | "digestive_function"
  | "hormonal_balance"
  | "immune_reactivity"
  | "vital_force"
  | "chronic_disease"
  | "constitutional_stability";

export type ClinicalIndexWeights = Partial<Record<ClinicalIndexKey | string, number>>;

export type ClinicalPriority = "low" | "medium" | "high" | string;

export type ThermalState = "chilly" | "warm" | "ambient" | "variable";

export type ThirstPattern = "thirsty_large" | "thirsty_small" | "thirstless" | "normal";

export interface CanonicalCitation {
  sourceName: string;
  detail?: string;
  author?: string;
  edition?: string;
  page?: string;
  url?: string;
}

export interface CanonicalRemedy {
  id: string;
  abbreviation: string;
  name: string;
  aliases: string[];
}

export interface CanonicalRubricRemedy {
  remedyId: string;
  sourceRemedyId?: string;
  remedyName?: string;
  grade: RemedyGrade;
  sourceGrade?: number;
  polarity?: RemedyPolarity;
  isEliminating?: boolean;
  confidence?: number;
  keynoteReason?: string;
  sourceReference?: string;
  clinicalExperienceWeight?: number;
  contraindicationNotes?: string;
  differentialNotes?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface CanonicalRubric {
  id: string;
  title: string;
  sourceTitle?: string;
  source: CanonicalRubricSource;
  sourceId?: string;
  rubricId?: string;
  chapter?: string;
  section?: string;
  slug?: string;
  parentId?: string | null;
  parentRubricId?: string | null;
  description?: string;
  plainLanguageMeaning?: string;
  classicalWording?: string;
  category: CanonicalRubricCategory;
  sourceCategory?: string;
  subCategory?: string;
  subcategory?: string;
  clinicalSystem: ClinicalSystem;
  organSystem?: string;
  clinicalPriority?: ClinicalPriority;
  createdDate?: string;
  modifiedDate?: string;
  lastUpdated?: string;
  status: CanonicalRubricStatus;
  sourceStatus?: string;
  searchWeight?: number;
  indexWeights?: ClinicalIndexWeights;
  synonyms: string[];
  keywords: string[];
  clinicalKeywords?: string[];
  patientExpressions?: string[];
  relatedSymptoms?: string[];
  relatedDiseases?: string[];
  clinicalConditions?: string[];
  modalities: string[];
  miasms: string[];
  miasmaticWeight?: Partial<Record<MiasmType | string, number>>;
  intensityScale?: number;
  polarity?: RemedyPolarity;
  mentalEmotionalState?: string[];
  physicalGenerals?: string[];
  thermalState?: ThermalState;
  thirstPattern?: ThirstPattern;
  foodCravings?: string[];
  aggravations?: string[];
  ameliorations?: string[];
  clinicalNotes?: string;
  confidence?: number;
  author?: string;
  reviewer?: string;
  remedies: CanonicalRubricRemedy[];
  citation?: CanonicalCitation;
  metadata?: Record<string, unknown>;
  originalRecord: unknown;
  warnings: string[];
}

export interface RepertorySearchResult {
  rubric: CanonicalRubric;
  score: number;
  matchedFields: string[];
}

export interface RepertorySessionRubric {
  rubricId: string;
  severity: number;
  frequency: "constant" | "frequent" | "occasional";
  impact: "severe" | "moderate" | "mild";
  source: "clinician_selected" | "ai_suggested" | "imported";
}

export interface RepertorySession {
  id: string;
  patientId?: string;
  clinicianId?: string;
  rubrics: RepertorySessionRubric[];
  createdAt: string;
  updatedAt?: string;
}

export interface ScoreContribution {
  rubricId: string;
  remedyId: string;
  grade: RemedyGrade;
  rubricWeight: number;
  contribution: number;
}

export const REMEDY_GRADE_WEIGHTS: Record<RemedyGrade, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
};

export function normalizeRemedyGrade(input: unknown): RemedyGrade {
  const numeric = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(numeric)) return 0;
  if (numeric <= 0) return 0;
  if (numeric >= 4) return 4;
  return Math.round(numeric) as RemedyGrade;
}

export function getRemedyGradeWeight(grade: RemedyGrade): number {
  return REMEDY_GRADE_WEIGHTS[grade] ?? 0;
}
