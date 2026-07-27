import { z } from "zod";

const id = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(/^[A-Za-z0-9._:-]+$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);

const clinicalChecklist = z
  .object({
    claimLanguageChecked: z.boolean(),
    traditionalUseBoundaryChecked: z.boolean(),
    emergencyEscalationChecked: z.boolean(),
    contraindicationChecked: z.boolean(),
    graphSafetyChecked: z.boolean(),
  })
  .strict();

const evidenceChecklist = z
  .object({
    citationTraceabilityChecked: z.boolean(),
    evidenceStatusChecked: z.boolean(),
    limitationsChecked: z.boolean(),
    conflictingEvidenceChecked: z.boolean(),
    conventionalCareBoundaryChecked: z.boolean(),
  })
  .strict();

export const submitKEP1IndependentReviewSchema = z
  .object({
    action: z.literal("submit-review"),
    reviewKind: z.enum(["clinical", "evidence"]),
    entityId: id,
    revisionId: id,
    expectedContentSha256: sha256,
    reviewerContributorId: id,
    decision: z.enum(["approved", "changes-requested", "rejected"]),
    declarationOfIndependence: z.literal(true),
    conflictsDeclared: z.array(z.string().trim().min(3).max(500)).max(20),
    reviewedClaimIds: z.array(id).max(300),
    reviewedGraphProposalIds: z.array(id).max(100),
    clinicalChecklist: clinicalChecklist.nullable(),
    evidenceChecklist: evidenceChecklist.nullable(),
    notes: z.string().trim().min(10).max(4_000),
  })
  .strict();

export type SubmitKEP1IndependentReviewInput = z.infer<
  typeof submitKEP1IndependentReviewSchema
>;
