import { z } from "zod";
import { KEP3_PLANNING_ROLES } from "./kep3CohortPlanningTypes";

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
const factor = z.number().int().min(0).max(5);

const selection = z
  .object({
    entityId: id,
    factors: z
      .object({
        clinicalImportance: factor,
        safetySensitivity: factor,
        searchDemand: factor,
        sourceAvailability: factor,
        graphValue: factor,
      })
      .strict(),
    rationale: z.string().trim().min(20).max(2_000),
    evidenceRefs: z.array(opaqueRef).min(1).max(10),
  })
  .strict();

const roleCapacity = z
  .object({
    role: z.enum(KEP3_PLANNING_ROLES),
    availableEntityCapacity: z.number().int().min(1).max(100),
    evidenceRef: opaqueRef,
  })
  .strict();

export const recordKEP3CohortProposalSchema = z
  .object({
    action: z.literal("record-cohort-proposal"),
    cohortLabel: z.string().trim().min(5).max(120),
    expectedKep1DecisionId: id,
    expectedInventorySha256: sha256,
    selections: z.array(selection).min(1).max(25),
    roleCapacity: z.array(roleCapacity).length(4),
    selectionMethodology: z.string().trim().min(50).max(8_000),
    residualRisks: z.array(z.string().trim().min(5).max(1_000)).min(1).max(30),
    planningEvidenceRef: opaqueRef,
    riskRegisterRef: opaqueRef,
    confirmationPhrase: z.string().trim().min(10).max(120),
  })
  .strict();

export type RecordKEP3CohortProposalInput = z.infer<
  typeof recordKEP3CohortProposalSchema
>;
