import { z } from "zod";

// Zod validation schemas for Homeopathic Assessment domain models

export const ReasoningEntrySchema = z.object({
  authorId: z.string(),
  timestamp: z.string(),
  rationale: z.string(),
  previousVersion: z.string().optional()
});

export const RubricGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  displayOrder: z.number(),
  notes: z.string().optional()
});

export const TotalitySymptomSchema = z.object({
  id: z.string(),
  sourceSymptomId: z.string(),
  sourceSnapshot: z.object({
    patientWording: z.string(),
    normalizedName: z.string(),
    location: z.string().optional(),
    sensation: z.string().optional(),
    aggravations: z.array(z.string()),
    ameliorations: z.array(z.string()),
    concomitants: z.array(z.string()),
    causation: z.array(z.string())
  }),
  primaryClassification: z.enum([
    "common",
    "characteristic",
    "peculiar",
    "strange_rare_peculiar",
    "keynote"
  ]),
  secondaryTags: z.array(z.string()),
  clinicalImportance: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  reasoningHistory: z.array(ReasoningEntrySchema),
  selectedBy: z.string(),
  selectedAt: z.string()
});

export const SelectedRubricSchema = z.object({
  id: z.string(),
  rubricId: z.string(),
  sourceId: z.string(),
  sourceName: z.string(),
  sourceEdition: z.string().optional(),
  sourceVersion: z.string().optional(),
  chapter: z.string(),
  rubricPath: z.array(z.string()),
  displayText: z.string(),
  linkedTotalitySymptomIds: z.array(z.string()),
  groupId: z.string().optional(),
  clinicianNotes: z.string().optional(),
  status: z.enum(["selected", "excluded", "alternative"]),
  selectionRationale: z.string().optional(),
  selectedBy: z.string(),
  selectedAt: z.string(),
  searchTraceability: z.object({
    query: z.string(),
    timestamp: z.string(),
    filters: z.record(z.string(), z.unknown()).optional()
  })
});

export const DifferentialRubricReasoningSchema = z.object({
  id: z.string(),
  sourceSymptomId: z.string(),
  interpretation: z.string(),
  candidateRubricIds: z.array(z.string()),
  selectedRubricId: z.string().optional(),
  rejectedRubricIds: z.array(z.string()),
  selectionRationale: z.string().optional(),
  rejectionRationales: z.record(z.string(), z.string()),
  clinicianNotes: z.string().optional()
});

export const MiasmaticAssessmentItemSchema = z.object({
  miasm: z.enum(["psora", "sycosis", "syphilis", "tubercular", "cancerinic"]),
  strength: z.enum(["not_assessed", "low", "moderate", "high", "predominant"]),
  supportingSymptomIds: z.array(z.string()),
  rationale: z.string().optional()
});

export const SusceptibilityAssessmentSchema = z.object({
  level: z.enum(["not_assessed", "low", "moderate", "high"]),
  rationale: z.string().optional(),
  supportingObservationIds: z.array(z.string()),
  assessedBy: z.string(),
  assessedAt: z.string()
});

export const ConstitutionalAssessmentSchema = z.object({
  impressions: z.array(z.string()),
  confidence: z.enum(["not_assessed", "low", "moderate", "high"]),
  supportingObservationIds: z.array(z.string()),
  rationale: z.string().optional()
});

export const ObstacleToCureSchema = z.object({
  id: z.string(),
  category: z.enum([
    "lifestyle",
    "environmental",
    "emotional",
    "drug_related",
    "occupational",
    "dietary",
    "social",
    "other"
  ]),
  description: z.string(),
  status: z.enum(["active", "resolved", "uncertain"]),
  identifiedOn: z.string().optional(),
  supportingNotes: z.string().optional()
});

export const HomeopathicTimelineEventSchema = z.object({
  id: z.string(),
  eventType: z.enum(["characteristic_symptom", "general", "etiology"]),
  milestoneTitle: z.string(),
  description: z.string(),
  dateOrAge: z.string()
});

export const ProvenanceSchema = z.object({
  createdBy: z.string(),
  createdAt: z.string(),
  updatedBy: z.string(),
  updatedAt: z.string(),
  sourceType: z.enum([
    "clinician",
    "patient",
    "caregiver",
    "lab_integration",
    "ai_suggestion",
    "external_emr"
  ]),
  sourceId: z.string().optional(),
  enteredByRole: z.string(),
  deviceId: z.string().optional()
});

export const HomeopathicAssessmentSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  clinicId: z.string().optional(),
  patientId: z.string(),
  encounterId: z.string(),
  practitionerId: z.string(),
  consultationId: z.string().optional(),
  treatmentEpisodeId: z.string().optional(),

  totalitySymptoms: z.array(TotalitySymptomSchema),
  selectedRubrics: z.array(SelectedRubricSchema),
  differentialReasoning: z.array(DifferentialRubricReasoningSchema),
  miasmaticProfile: z.array(MiasmaticAssessmentItemSchema),
  susceptibility: SusceptibilityAssessmentSchema,
  constitutional: ConstitutionalAssessmentSchema,
  obstaclesToCure: z.array(ObstacleToCureSchema),
  rubricGroups: z.array(RubricGroupSchema),

  etiologicalFactors: z.array(z.string()),
  maintainingCauses: z.array(z.string()),
  timelineEvents: z.array(HomeopathicTimelineEventSchema),

  status: z.enum(["draft", "ready_for_review"]),
  assessmentMethodology: z.object({
    id: z.string(),
    version: z.string()
  }),
  weightingMethodVersion: z.string(),
  provenance: ProvenanceSchema,
  recordVersion: z.number().int().nonnegative(),
  schemaVersion: z.number().int().positive()
});
