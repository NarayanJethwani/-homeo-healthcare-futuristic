import { RepertorySourceId, RepertoryEditionId } from "../types/repertoryTypes";

export type GradeNormalizationResult =
  | {
      status: "normalized";
      normalizedGrade: number;
      ruleId: string;
      ruleVersion: string;
    }
  | {
      status: "unsupported";
      reason: string;
    }
  | {
      status: "invalid";
      reason: string;
    };

export interface RepertoryGradingSystem {
  id: string;
  version: string;
  sourceId: RepertorySourceId;
  editionId?: RepertoryEditionId;
  displayName: string;
  allowedOriginalGrades: string[];
  normalize(originalGrade: string): GradeNormalizationResult;
  explanation: string;
}

export const KENT_GRADING_SYSTEM: RepertoryGradingSystem = {
  id: "kent_3_grade",
  version: "1.0.0",
  sourceId: "kent" as RepertorySourceId,
  displayName: "Kent's 3-Grade Scale",
  allowedOriginalGrades: ["1", "2", "3"],
  normalize(originalGrade: string): GradeNormalizationResult {
    const clean = originalGrade.trim();
    if (clean === "1") {
      return { status: "normalized", normalizedGrade: 1, ruleId: "kent_plain", ruleVersion: "1.0.0" };
    }
    if (clean === "2") {
      return { status: "normalized", normalizedGrade: 2, ruleId: "kent_italics", ruleVersion: "1.0.0" };
    }
    if (clean === "3") {
      return { status: "normalized", normalizedGrade: 3, ruleId: "kent_bold", ruleVersion: "1.0.0" };
    }
    if (["I", "II", "III"].includes(clean)) {
      // Allow Roman fallback if found
      const map: Record<string, number> = { "I": 1, "II": 2, "III": 3 };
      return { status: "normalized", normalizedGrade: map[clean], ruleId: "kent_roman", ruleVersion: "1.0.0" };
    }
    return { status: "invalid", reason: `Grade '${originalGrade}' is outside allowed scale (1, 2, 3)` };
  },
  explanation: "Kent (1908): Grade 1 (Plain text / Slight), Grade 2 (Italics / Moderate), Grade 3 (Bold / Strong)."
};

export const BOERICKE_GRADING_SYSTEM: RepertoryGradingSystem = {
  id: "boericke_3_grade",
  version: "1.0.0",
  sourceId: "boericke" as RepertorySourceId,
  displayName: "Boericke's 3-Grade Scale",
  allowedOriginalGrades: ["1", "2", "3", "*", "**"],
  normalize(originalGrade: string): GradeNormalizationResult {
    const clean = originalGrade.trim();
    if (clean === "1") {
      return { status: "normalized", normalizedGrade: 1, ruleId: "boer_plain", ruleVersion: "1.0.0" };
    }
    if (clean === "2" || clean === "*") {
      return { status: "normalized", normalizedGrade: 2, ruleId: "boer_starred_or_italics", ruleVersion: "1.0.0" };
    }
    if (clean === "3" || clean === "**") {
      return { status: "normalized", normalizedGrade: 3, ruleId: "boer_double_starred_or_bold", ruleVersion: "1.0.0" };
    }
    return { status: "invalid", reason: `Grade '${originalGrade}' is outside allowed scale (1, 2, 3, *, **)` };
  },
  explanation: "Boericke (1927): Grade 1 (Plain / Slight), Grade 2 (Italics or * / Moderate), Grade 3 (Bold or ** / Strong)."
};

const GRADING_SYSTEM_REGISTRY: Record<string, RepertoryGradingSystem> = {
  kent_3_grade: KENT_GRADING_SYSTEM,
  boericke_3_grade: BOERICKE_GRADING_SYSTEM
};

export function getGradingSystem(id: string): RepertoryGradingSystem | null {
  return GRADING_SYSTEM_REGISTRY[id] || null;
}
