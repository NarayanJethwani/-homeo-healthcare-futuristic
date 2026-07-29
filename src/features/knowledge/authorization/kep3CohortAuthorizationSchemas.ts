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
    selectionEvidenceReviewed: z.boolean(),
    capacityEvidenceReviewed: z.boolean(),
    riskRegisterReviewed: z.boolean(),
    withdrawnAndFlagshipExclusionsConfirmed: z.boolean(),
    zeroProductionRagConfirmed: z.boolean(),
    noAutomaticAssignmentsConfirmed: z.boolean(),
    authorityBoundaryAccepted: z.boolean(),
  })
  .strict();

export const recordKEP3CohortAuthorizationSchema = z
  .object({
    action: z.literal("record-cohort-authorization"),
    decision: z.enum(["approved", "rejected"]),
    proposalId: id,
    expectedProposalSha256: sha256,
    programOwnerRecordId: id,
    checklist,
    blockers: z.array(z.string().trim().min(5).max(1_000)).max(30),
    residualRisks: z.array(z.string().trim().min(5).max(1_000)).max(30),
    rationale: z.string().trim().min(20).max(8_000),
    authorizationEvidenceRef: opaqueRef,
    meetingMinutesRef: opaqueRef,
    confirmationPhrase: z.string().trim().min(10).max(120),
  })
  .strict();

export type RecordKEP3CohortAuthorizationInput = z.infer<
  typeof recordKEP3CohortAuthorizationSchema
>;
