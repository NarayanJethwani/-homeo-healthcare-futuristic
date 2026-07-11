import { z } from "zod";

export const BaseAiRequestSchema = z.object({
  taskType: z.enum(["completeness", "missing_questions", "summary"]),
  schemaVersion: z.number().int().positive(),
  organizationId: z.string(),
  patientId: z.string(),
  encounterId: z.string(),
  consentVerificationStatus: z.boolean(),
  requestedOutputSchemaVersion: z.number().int().positive()
});

export const CompletenessTaskRequestSchema = BaseAiRequestSchema.extend({
  taskType: z.literal("completeness"),
  clinicalDataSnapshot: z.object({
    chiefComplaintPresent: z.boolean(),
    vitalsCount: z.number().int().nonnegative(),
    notesLength: z.number().int().nonnegative()
  })
});

export const MissingQuestionsTaskRequestSchema = BaseAiRequestSchema.extend({
  taskType: z.literal("missing_questions"),
  clinicalDataSnapshot: z.object({
    historyText: z.string(),
    generalsLogged: z.array(z.string())
  })
});

export const CaseSummaryTaskRequestSchema = BaseAiRequestSchema.extend({
  taskType: z.literal("summary"),
  clinicalDataSnapshot: z.object({
    complaintsList: z.array(z.string()),
    vitalsList: z.array(z.object({ parameter: z.string(), value: z.union([z.string(), z.number()]) })),
    historyTimeline: z.array(z.string())
  })
});

export const AiTaskRequestSchema = z.discriminatedUnion("taskType", [
  CompletenessTaskRequestSchema,
  MissingQuestionsTaskRequestSchema,
  CaseSummaryTaskRequestSchema
]);
