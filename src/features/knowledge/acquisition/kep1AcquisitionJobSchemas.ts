import { z } from "zod";

const id = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(/^[A-Za-z0-9._:-]+$/);
const evidenceRef = z.string().trim().min(8).max(500);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const mediaType = z.enum([
  "text/plain",
  "application/pdf",
  "application/zip",
]);

export const proposeKEP1AcquisitionJobSchema = z
  .object({
    action: z.literal("propose-job"),
    sourceId: id,
    expectedVersion: z.number().int().positive().nullable(),
    acquisitionMethod: z.enum([
      "manual-controlled-import",
      "object-storage-transfer",
    ]),
    expectedMediaType: mediaType,
    proposalEvidenceRef: evidenceRef,
  })
  .strict();

export const decideKEP1AcquisitionJobSchema = z
  .object({
    action: z.literal("decide-job"),
    jobId: id,
    expectedVersion: z.number().int().positive(),
    decision: z.enum(["approve", "reject"]),
    programOwnerRecordId: id,
    decisionEvidenceRef: evidenceRef,
  })
  .strict();

export const recordKEP1SourceArtifactSchema = z
  .object({
    action: z.literal("record-artifact"),
    jobId: id,
    expectedVersion: z.number().int().positive(),
    sha256,
    byteLength: z.number().int().positive().max(1_073_741_824),
    mediaType,
    privateObjectRef: z.string().trim().min(8).max(500),
    custodyEvidenceRef: evidenceRef,
  })
  .strict();

export const verifyKEP1SourceArtifactSchema = z
  .object({
    action: z.literal("verify-artifact"),
    jobId: id,
    expectedVersion: z.number().int().positive(),
    artifactId: id,
    observedSha256: sha256,
    observedByteLength: z.number().int().positive().max(1_073_741_824),
    verificationEvidenceRef: evidenceRef,
  })
  .strict();

export const kep1AcquisitionJobMutationSchema = z.discriminatedUnion("action", [
  proposeKEP1AcquisitionJobSchema,
  decideKEP1AcquisitionJobSchema,
  recordKEP1SourceArtifactSchema,
  verifyKEP1SourceArtifactSchema,
]);

export type ProposeKEP1AcquisitionJobInput = z.infer<
  typeof proposeKEP1AcquisitionJobSchema
>;
export type DecideKEP1AcquisitionJobInput = z.infer<
  typeof decideKEP1AcquisitionJobSchema
>;
export type RecordKEP1SourceArtifactInput = z.infer<
  typeof recordKEP1SourceArtifactSchema
>;
export type VerifyKEP1SourceArtifactInput = z.infer<
  typeof verifyKEP1SourceArtifactSchema
>;
