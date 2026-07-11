import { z } from "zod";

export const PatientConsentSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  schemaVersion: z.number().int().positive(),
  recordVersion: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string(),
  patientId: z.string(),
  consentType: z.enum(["privacy", "telemedicine", "ai_processing", "research", "communication"]),
  granted: z.boolean(),
  policyVersion: z.string(),
  language: z.string().min(2),
  capturedBy: z.string(),
  captureMethod: z.enum(["digital_signature", "verbal_witnessed", "paper_scanned"]),
  documentReferenceUrl: z.string().optional(),
  effectiveDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  withdrawnAt: z.string().datetime().optional(),
  withdrawalReason: z.string().optional(),
  auditMetadata: z.object({
    ipAddress: z.string().optional(),
    userAgent: z.string().optional()
  }),
  notes: z.string().optional()
});
