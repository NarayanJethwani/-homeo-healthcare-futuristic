import { z } from "zod";

export const EncounterTypeSchema = z.enum([
  "initial_consultation",
  "follow_up",
  "teleconsultation",
  "urgent",
  "administrative"
]);

export const EncounterStatusSchema = z.enum([
  "draft",
  "ready_for_review"
]);

export const EncounterSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  organizationId: z.string(),
  clinicId: z.string().optional(),
  practitionerId: z.string(),
  encounterType: EncounterTypeSchema,
  status: EncounterStatusSchema,
  encounterDate: z.string().datetime(),
  clinicalIntakeId: z.string().optional(),
  primaryEpisodeId: z.string().optional(),
  relatedEpisodeIds: z.array(z.string()).default([]),
  schemaVersion: z.number().int().positive(),
  recordVersion: z.number().int().nonnegative(),
  provenance: z.object({
    createdAt: z.string().datetime(),
    createdBy: z.string(),
    updatedAt: z.string().datetime(),
    updatedBy: z.string()
  })
});
