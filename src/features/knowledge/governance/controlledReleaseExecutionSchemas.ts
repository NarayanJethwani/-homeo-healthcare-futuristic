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
  expectedReleaseId: id,
  expectedPreviousExecutionId: id.nullable(),
  rationale: z.string().trim().min(30).max(4_000),
};

export const controlledReleaseExecutionActionSchema =
  z.discriminatedUnion("action", [
    z
      .object({
        action: z.literal("execute-publication-canary"),
        ...common,
        channels: z
          .object({
            publication: z.literal(true),
            rag: z.literal(false),
          })
          .strict(),
      })
      .strict(),
    z
      .object({
        action: z.literal("rollback-publication-canary"),
        ...common,
      })
      .strict(),
  ]);

export type ControlledReleaseExecutionActionInput = z.infer<
  typeof controlledReleaseExecutionActionSchema
>;
