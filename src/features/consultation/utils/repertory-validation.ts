import { z } from "zod";

export const RepertoryScoringConfigurationSchema = z.object({
  algorithmVersion: z.string(),
  scoringConfigurationVersion: z.string(),
  gradeWeights: z.record(z.coerce.number(), z.number()),
  characteristicMultiplier: z.number().positive(),
  thermalAlignmentWeight: z.number().min(0).max(1),
  miasmaticAlignmentWeight: z.number().min(0).max(1),
  tieBreakStrategy: z.enum(["symptom_coverage", "grade_sum", "alphabetical"]),
});

export const SelectedRubricSchema = z.object({
  rubricId: z.string().min(1),
  sourceId: z.string().min(1),
  rubricPath: z.array(z.string()),
  weight: z.number().default(1.0),
  characteristic: z.boolean().default(false),
  excluded: z.boolean().default(false),
  pinned: z.boolean().default(false),
  addedAt: z.string(),
  addedBy: z.string(),
});

export const RepertoryProvenanceSchema = z.object({
  sourceId: z.string(),
  sourceTitle: z.string(),
  editionId: z.string().optional(),
  editionLabel: z.string().optional(),
  author: z.string().optional(),
  chapterId: z.string().optional(),
  rubricId: z.string(),
  rubricPath: z.array(z.string()),
  remedyGrade: z.number().min(1).max(4),
  repertoryVersion: z.string(),
  retrievedAt: z.string(),
});

export const RemedyScoreBreakdownSchema = z.object({
  rubricScore: z.number(),
  characteristicAdjustment: z.number(),
  thermalAdjustment: z.number(),
  miasmaticAdjustment: z.number(),
  matchedRubricCount: z.number(),
  totalSelectedRubrics: z.number(),
  finalScore: z.number(),
});

export const RemedyAnalysisMetadataSchema = z.object({
  algorithmVersion: z.string(),
  scoringConfigurationVersion: z.string(),
  repertoryVersion: z.string(),
  inputSnapshotHash: z.string(),
  generatedAt: z.string(),
  requestSequence: z.number(),
  isStale: z.boolean(),
});

export const RankedRemedyResultSchema = z.object({
  remedyId: z.string(),
  remedyName: z.string(),
  scoreBreakdown: RemedyScoreBreakdownSchema,
  provenanceList: z.array(RepertoryProvenanceSchema),
  keynoteExcerpt: z.string().optional(),
  metadata: RemedyAnalysisMetadataSchema,
});

export const SafetyTriggerSchema = z.object({
  ruleId: z.string(),
  category: z.enum(["cardiovascular", "respiratory", "neurological", "anaphylactic", "psychiatric_crisis"]),
  severity: z.enum(["urgent", "emergency"]),
  triggerKeyword: z.string(),
  description: z.string(),
  recommendedAction: z.string(),
});

export const SafetyAssessmentSchema = z.object({
  status: z.enum(["clear", "warning", "urgent", "emergency", "unavailable"]),
  ruleVersion: z.string(),
  triggeredRules: z.array(SafetyTriggerSchema),
  acknowledgedAt: z.string().optional(),
  acknowledgedBy: z.string().optional(),
  clinicianDisposition: z.enum(["emergency_transfer", "urgent_referral", "monitored_clinic_care"]).optional(),
});
