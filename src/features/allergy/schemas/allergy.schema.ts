import { z } from "zod";

export const AllergyIntoleranceSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  schemaVersion: z.number().int().positive(),
  recordVersion: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string(),
  patientId: z.string(),
  substanceConceptId: z.string().optional(),
  substanceText: z.string().min(1, "Substance text description is required"),
  category: z.enum(["medication", "food", "environment", "biologic", "other"]),
  criticality: z.enum(["low", "high", "unknown"]).optional(),
  verificationStatus: z.enum(["confirmed", "unconfirmed", "refuted", "entered_in_error"]),
  reactionDescriptions: z.array(z.string()),
  onsetDate: z.string().optional(),
  notes: z.string().optional(),
  provenance: z.object({
    createdBy: z.string(),
    createdAt: z.string().datetime(),
    sourceType: z.enum(["clinician", "patient", "caregiver"])
  })
});
