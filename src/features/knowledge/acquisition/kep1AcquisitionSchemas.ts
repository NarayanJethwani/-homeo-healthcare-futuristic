import { z } from "zod";

const id = z
  .string()
  .trim()
  .min(3)
  .max(120)
  .regex(/^[A-Za-z0-9._:-]+$/);
const evidenceRef = z.string().trim().min(8).max(500);
const role = z.enum([
  "clinical-author",
  "independent-clinical-reviewer",
  "evidence-reviewer",
  "rights-reviewer",
]);

export const proposeKEP1AssignmentSchema = z
  .object({
    action: z.literal("propose-assignment"),
    entityId: id,
    role,
    contributorId: id,
    expectedVersion: z.number().int().positive().nullable(),
  })
  .strict();

export const decideKEP1AssignmentSchema = z
  .object({
    action: z.literal("decide-assignment"),
    assignmentId: id,
    expectedVersion: z.number().int().positive(),
    decision: z.enum(["approve", "reject"]),
    programOwnerRecordId: id,
    decisionEvidenceRef: evidenceRef,
  })
  .strict();

export const decideKEP1SourceSchema = z
  .object({
    action: z.literal("decide-source"),
    sourceId: id,
    expectedVersion: z.number().int().positive().nullable(),
    decision: z.enum([
      "citation-only-confirmed",
      "controlled-extraction-approved",
      "blocked",
    ]),
    rightsReviewerContributorId: id,
    rightsEvidenceRef: evidenceRef,
  })
  .strict();

export const kep1AcquisitionMutationSchema = z.discriminatedUnion("action", [
  proposeKEP1AssignmentSchema,
  decideKEP1AssignmentSchema,
  decideKEP1SourceSchema,
]);

export type ProposeKEP1AssignmentInput = z.infer<
  typeof proposeKEP1AssignmentSchema
>;
export type DecideKEP1AssignmentInput = z.infer<
  typeof decideKEP1AssignmentSchema
>;
export type DecideKEP1SourceInput = z.infer<typeof decideKEP1SourceSchema>;
