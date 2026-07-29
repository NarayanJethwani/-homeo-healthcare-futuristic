import { z } from "zod";

const id = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(/^[A-Za-z0-9._:-]+$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);

export const recordFastTrackDecisionSchema = z
  .object({
    action: z.literal("record-decision"),
    requestId: z.string().uuid(),
    entityId: id,
    expectedRevisionSha256: sha256,
    expectedPreviousDecisionId: id.nullable(),
    outcome: z.enum([
      "approved-reviewed",
      "correction-requested",
      "safety-block-maintained",
      "safety-resolution-recorded",
    ]),
    reviewedFlagCodes: z.array(id).max(20),
    citationIds: z.array(id).max(50),
    rationale: z.string().trim().min(20).max(4_000),
    attestations: z
      .object({
        citationsChecked: z.literal(true),
        clinicalAccuracyChecked: z.literal(true),
        conventionalCareBoundaryChecked: z.literal(true),
        conflictOfInterestDeclared: z.literal(true),
        safetyCauseResolved: z.boolean(),
      })
      .strict(),
    safetyConfirmation: z.string().trim().max(120).optional(),
  })
  .strict();

export type RecordFastTrackDecisionInput = z.infer<
  typeof recordFastTrackDecisionSchema
>;
