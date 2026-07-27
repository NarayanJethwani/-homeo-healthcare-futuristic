import { z } from "zod";

const id = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(/^[A-Za-z0-9._:-]+$/);

const passage = z
  .object({
    passageId: id,
    locator: z.string().trim().min(1).max(240),
    text: z.string().trim().min(10).max(12_000),
  })
  .strict();

const claim = z
  .object({
    claimId: id,
    text: z.string().trim().min(10).max(2_000),
    claimType: z.enum([
      "definition",
      "diagnosis",
      "risk",
      "treatment",
      "prognosis",
      "safety",
      "emergency",
      "laboratory-interpretation",
      "traditional-use",
    ]),
    evidenceStatus: z.enum([
      "supported",
      "partially-supported",
      "traditional-description",
      "insufficient-evidence",
      "unsupported",
    ]),
    sourcePassageIds: z.array(id).min(1).max(20),
  })
  .strict();

const evidenceProfile = z
  .object({
    evidenceLevel: z.enum([
      "Level-A",
      "Level-B",
      "Level-C",
      "Traditional-Literature",
    ]),
    evidenceSummary: z.string().trim().min(20).max(4_000),
    limitations: z.array(z.string().trim().min(3).max(500)).min(1).max(20),
    sourcePassageIds: z.array(id).min(1).max(100),
  })
  .strict();

const graphProposal = z
  .object({
    proposalId: id,
    relationshipType: z
      .string()
      .trim()
      .min(3)
      .max(80)
      .regex(/^[a-z][a-z-]+$/),
    targetEntityId: id,
    rationale: z.string().trim().min(10).max(1_000),
    sourcePassageIds: z.array(id).min(1).max(20),
  })
  .strict();

export const createKEP1DraftRevisionSchema = z
  .object({
    action: z.literal("create-revision"),
    entityId: id,
    artifactId: id,
    authorContributorId: id,
    expectedRevisionNumber: z.number().int().positive().nullable(),
    entityType: z.enum([
      "disease",
      "symptom",
      "remedy",
      "lab-test",
      "faq",
      "research",
      "case-study",
    ]),
    title: z.string().trim().min(3).max(240),
    summary: z.string().trim().min(20).max(4_000),
    passages: z.array(passage).min(1).max(100),
    claims: z.array(claim).min(1).max(200),
    evidenceProfile,
    graphProposals: z.array(graphProposal).max(30),
    changeSummary: z.string().trim().min(10).max(1_000),
  })
  .strict();

export type CreateKEP1DraftRevisionInput = z.infer<
  typeof createKEP1DraftRevisionSchema
>;
