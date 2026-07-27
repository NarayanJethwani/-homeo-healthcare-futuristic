import { z } from "zod";

const recordId = z
  .string()
  .trim()
  .regex(/^[A-Z0-9][A-Z0-9-]{5,63}$/);
const opaqueRef = z.string().trim().min(8).max(256).regex(/^[A-Za-z0-9_./:@-]+$/);
const governedDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .nullable();

const editorialRole = z.enum([
  "clinical-author",
  "independent-clinical-reviewer",
  "evidence-reviewer",
  "rights-reviewer",
]);
const expertiseDomain = z.enum([
  "gastroenterology",
  "dermatology",
  "laboratory-medicine",
  "homeopathy-subject-matter",
  "evidence-methodology",
  "source-rights",
]);

export const createPrivateOnboardingRecordSchema = z
  .object({
    action: z.literal("create"),
    recordId,
    kind: z.enum(["contributor", "program-owner"]),
    fullName: z.string().trim().min(2).max(120),
    identityScheme: z.enum(["staff-id", "orcid", "github"]),
    identityValue: z.string().trim().min(3).max(160),
    eligibleRoles: z.array(editorialRole).max(4),
    expertiseDomains: z.array(expertiseDomain).max(6),
    credentials: z
      .array(
        z
          .object({
            credentialId: recordId,
            title: z.string().trim().min(2).max(120),
            issuer: z.string().trim().min(2).max(120),
            evidenceRef: opaqueRef,
            expiresAt: governedDate,
          })
          .strict()
      )
      .max(8),
    attestations: z
      .object({
        conflictOfInterestDeclared: z.literal(true),
        editorialIndependenceAccepted: z.literal(true),
        aiAssistanceDisclosureAccepted: z.literal(true),
        sourceUsePolicyAccepted: z.literal(true),
        acceptanceEvidenceRef: opaqueRef,
      })
      .strict(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.kind === "contributor" && value.credentials.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["credentials"],
        message: "Contributor credential evidence is required.",
      });
    }
    if (
      value.kind === "contributor" &&
      (value.eligibleRoles.length === 0 || value.expertiseDomains.length === 0)
    ) {
      context.addIssue({
        code: "custom",
        path: ["eligibleRoles"],
        message: "Contributor role and expertise eligibility are required.",
      });
    }
    if (
      value.kind === "program-owner" &&
      (value.eligibleRoles.length > 0 ||
        value.expertiseDomains.length > 0 ||
        value.credentials.length > 0)
    ) {
      context.addIssue({
        code: "custom",
        path: ["kind"],
        message: "Program owner records cannot claim editorial eligibility.",
      });
    }
  });

export const verifyPrivateOnboardingRecordSchema = z
  .object({
    action: z.literal("verify"),
    recordId,
    expectedVersion: z.number().int().positive(),
    identityEvidenceRef: opaqueRef,
    verifiedCredentialIds: z.array(recordId).max(8),
  })
  .strict();

export type CreatePrivateOnboardingRecordInput = z.infer<
  typeof createPrivateOnboardingRecordSchema
>;
export type VerifyPrivateOnboardingRecordInput = z.infer<
  typeof verifyPrivateOnboardingRecordSchema
>;
