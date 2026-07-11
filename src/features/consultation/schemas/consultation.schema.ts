import { z } from "zod";

export const SymptomRecordSchema = z.object({
  id: z.string(),
  conceptId: z.string().optional(),
  patientWording: z.string().min(1, "Patient wording is required"),
  normalizedName: z.string().min(2, "Normalized description is required"),
  location: z.string().optional(),
  radiation: z.string().optional(),
  sensation: z.string().optional(),
  onsetDate: z.string().optional(),
  duration: z.string().optional(),
  frequency: z.string().optional(),
  progression: z.enum(["improving", "stable", "worsening", "fluctuating", "unknown"]).optional(),
  intensity: z.enum(["mild", "moderate", "severe", "extreme"]).optional(),
  aggravations: z.array(z.string()).default([]),
  ameliorations: z.array(z.string()).default([]),
  concomitants: z.array(z.string()).default([]),
  causation: z.array(z.string()).default([]),
  isCharacteristic: z.boolean().default(false),
  clinicianNotes: z.string().optional()
});

export const MentalGeneralsSchema = z.object({
  fears: z.array(z.string()).default([]),
  anxiety: z.string().optional(),
  anger: z.string().optional(),
  grief: z.string().optional(),
  irritability: z.string().optional(),
  memory: z.string().optional(),
  concentration: z.string().optional(),
  consolationResponse: z.string().optional(),
  companyPreference: z.string().optional(),
  sensitivity: z.string().optional(),
  emotionalCausation: z.array(z.string()).default([]),
  dreams: z.string().optional(),
  clinicianNotes: z.string().optional()
});

export const PhysicalGeneralsSchema = z.object({
  thermalPreference: z.string().optional(),
  appetite: z.string().optional(),
  thirst: z.string().optional(),
  cravings: z.array(z.string()).default([]),
  aversions: z.array(z.string()).default([]),
  perspiration: z.string().optional(),
  sleep: z.string().optional(),
  sleepPosition: z.string().optional(),
  energy: z.string().optional(),
  bowelHabits: z.string().optional(),
  urination: z.string().optional(),
  menstrualHistory: z.string().optional(),
  weatherSensitivity: z.string().optional(),
  clinicianNotes: z.string().optional()
});

export const GeneralModalitiesSchema = z.object({
  aggravatingFactors: z.array(z.string()).default([]),
  amelioratingFactors: z.array(z.string()).default([])
});

export const IllnessTimelineEventSchema = z.object({
  id: z.string(),
  occurredOn: z.string().optional(),
  approximatePeriod: z.string().optional(),
  eventType: z.enum([
    "symptom_onset",
    "worsening",
    "improvement",
    "treatment",
    "investigation",
    "hospitalization",
    "stress_event",
    "other"
  ]),
  description: z.string().min(2, "Event description is required"),
  source: z.enum(["patient", "caregiver", "clinician", "document"])
});

export const FollowUpSymptomUpdateSchema = z.object({
  symptomId: z.string(),
  patientWording: z.string().min(1),
  normalizedName: z.string().min(2),
  changeStatus: z.enum(["better", "no_change", "worse", "resolved", "new_pattern"]),
  details: z.string().optional()
});

export const FollowUpClinicalIntakeSchema = z.object({
  previousEncounterId: z.string().optional(),
  responseSincePreviousTreatment: z.string().min(3, "Response summary is required for follow-up review"),
  symptomUpdates: z.array(FollowUpSymptomUpdateSchema).default([]),
  newSymptoms: z.array(SymptomRecordSchema).default([]),
  currentAssessment: z.string().min(3, "Assessment is required for follow-up review"),
  updatedPlanNotes: z.string().optional()
});

export const ClinicalIntakeSchema = z.object({
  id: z.string(),
  encounterId: z.string(),
  patientId: z.string(),
  organizationId: z.string(),
  clinicId: z.string().optional(),
  treatmentEpisodeId: z.string().optional(),

  chiefComplaints: z.array(SymptomRecordSchema).default([]),
  historyPresentIllness: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),

  mentalGenerals: MentalGeneralsSchema,
  physicalGenerals: PhysicalGeneralsSchema,

  characteristicSymptoms: z.array(SymptomRecordSchema).default([]),
  generalModalities: GeneralModalitiesSchema,
  causation: z.array(z.string()).default([]),
  illnessTimeline: z.array(IllnessTimelineEventSchema).default([]),

  followUpDetails: FollowUpClinicalIntakeSchema.optional(),

  clinicianNotes: z.string().optional(),

  schemaVersion: z.number().int().positive(),
  recordVersion: z.number().int().nonnegative(),
  provenance: z.object({
    createdAt: z.string().datetime(),
    createdBy: z.string(),
    updatedAt: z.string().datetime(),
    updatedBy: z.string()
  })
});
