import { z } from "zod";

const IdPattern = /^[A-Za-z0-9_-]+$/;
export const AI_ID_VALIDATOR = z.string().min(1).max(128).regex(IdPattern);

export const PublicRequestSchema = z
  .object({
    mode: z.enum(["public", "patient"]), // Map "patient" to public via compatibility migration path
    query: z.string().min(1).max(2000),
    lang: z.string().min(2).max(10).default("en")
  })
  .strict();

export const PatientRequestSchema = z
  .object({
    mode: z.literal("patient"),
    query: z.string().min(1).max(2000),
    lang: z.string().min(2).max(10).default("en")
  })
  .strict();

export const DoctorRequestSchema = z
  .object({
    mode: z.literal("doctor"),
    query: z.string().min(1).max(4000),
    lang: z.string().min(2).max(10).default("en"),
    patientContextId: AI_ID_VALIDATOR.optional(),
    encounterId: AI_ID_VALIDATOR.optional()
  })
  .strict();
