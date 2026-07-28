import { z } from "zod";

const id = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(/^[A-Za-z0-9._:-]+$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const opaqueRef = z
  .string()
  .trim()
  .min(8)
  .max(256)
  .regex(/^[A-Za-z0-9_./:@-]+$/);

const checklist = z
  .object({
    acceptanceGatesReviewed: z.boolean(),
    clinicalAndEvidenceReviewsConfirmed: z.boolean(),
    offlineEvaluationReviewed: z.boolean(),
    withdrawnExclusionsConfirmed: z.boolean(),
    zeroProductionRagConfirmed: z.boolean(),
    residualRisksReviewed: z.boolean(),
    containmentAndRollbackReviewed: z.boolean(),
    authorityBoundaryAccepted: z.boolean(),
  })
  .strict();

export const recordKEP1GoNoGoDecisionSchema = z
  .object({
    action: z.literal("record-go-no-go"),
    decision: z.enum(["go", "no-go"]),
    evaluationId: id,
    expectedCorpusManifestSha256: sha256,
    expectedQuerySetSha256: sha256,
    programOwnerRecordId: id,
    checklist,
    blockers: z.array(z.string().trim().min(5).max(1_000)).max(30),
    residualRisks: z.array(z.string().trim().min(5).max(1_000)).max(30),
    rationale: z.string().trim().min(20).max(8_000),
    decisionEvidenceRef: opaqueRef,
    meetingMinutesRef: opaqueRef,
    confirmationPhrase: z.string().trim().min(10).max(100),
  })
  .strict();

export type RecordKEP1GoNoGoDecisionInput = z.infer<
  typeof recordKEP1GoNoGoDecisionSchema
>;
