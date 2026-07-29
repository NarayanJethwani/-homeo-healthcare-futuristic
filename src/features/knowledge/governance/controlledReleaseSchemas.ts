import { z } from "zod";

const id = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(/^[A-Za-z0-9._:-]+$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const common = {
  requestId: z.string().uuid(),
  entityId: id,
  expectedRevisionSha256: sha256,
  expectedSafetyDecisionId: id,
  expectedPreviousReleaseId: id.nullable(),
  rationale: z.string().trim().min(30).max(4_000),
  attestations: z
    .object({
      revisionRechecked: z.literal(true),
      citationsRechecked: z.literal(true),
      safetyBoundariesRechecked: z.literal(true),
      rollbackReady: z.literal(true),
    })
    .strict(),
};

export const authorizeControlledReleaseSchema = z
  .object({
    action: z.literal("authorize-release"),
    ...common,
    phase: z.enum(["canary", "general"]),
    channels: z
      .object({
        publication: z.boolean(),
        rag: z.boolean(),
      })
      .strict(),
  })
  .strict();

export const recordCanaryObservationSchema = z
  .object({
    action: z.literal("record-canary-observation"),
    ...common,
    phase: z.literal("canary"),
    observation: z
      .object({
        observationMinutes: z.number().int().min(1_440).max(43_200),
        safetyIncidentCount: z.literal(0),
        prohibitedClaimDetectionCount: z.literal(0),
        retrievalLeakageCount: z.literal(0),
      })
      .strict(),
  })
  .strict();

export const rollbackControlledReleaseSchema = z
  .object({
    action: z.literal("rollback-release"),
    ...common,
  })
  .strict();

export const controlledReleaseActionSchema = z.discriminatedUnion("action", [
  authorizeControlledReleaseSchema,
  recordCanaryObservationSchema,
  rollbackControlledReleaseSchema,
]);

export type ControlledReleaseActionInput = z.infer<
  typeof controlledReleaseActionSchema
>;
