export type CanonicalRubricSource = "jethwani" | "kent" | "boericke" | "firestore" | "unknown";

export type CanonicalRubricStatus = "draft" | "reviewed" | "active" | "deprecated" | "unknown";

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
  remedyName?: string;
  grade: RemedyGrade;
  sourceGrade?: number;
  confidence?: number;
  notes?: string;
}

export interface CanonicalRubric {
  id: string;
  title: string;
  source: CanonicalRubricSource;
  sourceId?: string;
  chapter?: string;
  parentId?: string | null;
  category: CanonicalRubricCategory;
  clinicalSystem: ClinicalSystem;
  status: CanonicalRubricStatus;
  synonyms: string[];
  keywords: string[];
  modalities: string[];
  miasms: string[];
  remedies: CanonicalRubricRemedy[];
  citation?: CanonicalCitation;
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

