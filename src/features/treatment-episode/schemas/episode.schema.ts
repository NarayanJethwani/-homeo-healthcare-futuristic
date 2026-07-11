import { z } from "zod";

export const TreatmentEpisodeSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  schemaVersion: z.number().int().positive(),
  recordVersion: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string(),
  patientId: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  conditionConceptIds: z.array(z.string()),
  startedAt: z.string().datetime(),
  closedAt: z.string().datetime().optional(),
  status: z.enum(["active", "resolved", "inactive", "cancelled"]),
  primaryPractitionerId: z.string(),
  resolutionSummary: z.string().optional()
});
