import { z } from "zod";

export const PatientSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  clinicId: z.string().optional(),
  schemaVersion: z.number().int().positive(),
  recordVersion: z.number().int().nonnegative(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string(),
  uhid: z.string().regex(/^P-\d{6}$/, "UHID must match pattern P-XXXXXX"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must match YYYY-MM-DD"),
  gender: z.enum(["male", "female", "other", "unknown"]),
  bloodGroup: z.string().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email format"),
  address: z.string(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  lifestyleDetails: z.object({
    dietType: z.string().optional(),
    exerciseHabits: z.string().optional(),
    sleepDurationHrs: z.number().optional(),
    substanceUse: z.array(z.string()).optional()
  }).optional(),
  insuranceDetails: z.object({
    providerName: z.string().optional(),
    policyNumber: z.string().optional(),
    expiryDate: z.string().optional()
  }).optional(),
  referringDoctor: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(2, "Emergency contact name required"),
    phone: z.string().min(10, "Emergency contact phone required"),
    relationship: z.string()
  }),
  isActive: z.boolean()
});
