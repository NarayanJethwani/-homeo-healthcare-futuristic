import { 
  AssessmentId, TotalitySymptomId, SelectedRubricId, DifferentialReasoningId, ObstacleId,
  PatientId, EncounterId, OrganizationId, ClinicId, PractitionerId, ConsultationId, EpisodeId, SymptomId, RubricId
} from "../../../shared/domain/identifiers";
import { Provenance } from "../../../shared/domain/entities";

export type HomeopathicAssessmentStatus =
  | "draft"
  | "ready_for_review";

export type MiasmaticStrength =
  | "not_assessed"
  | "low"
  | "moderate"
  | "high"
  | "predominant";

export type AssessmentConfidence =
  | "not_assessed"
  | "low"
  | "moderate"
  | "high";

export type SusceptibilityLevel =
  | "not_assessed"
  | "low"
  | "moderate"
  | "high";

export type ObstacleCategory =
  | "lifestyle"
  | "environmental"
  | "emotional"
  | "drug_related"
  | "occupational"
  | "dietary"
  | "social"
  | "other";

export interface ReasoningEntry {
  authorId: PractitionerId;
  timestamp: string;
  rationale: string;
  previousVersion?: string;
}

export interface RubricGroup {
  id: string;
  title: string;
  displayOrder: number;
  notes?: string;
}

export interface TotalitySymptom {
  id: TotalitySymptomId;
  sourceSymptomId: SymptomId;
  sourceSnapshot: {
    patientWording: string;
    normalizedName: string;
    location?: string;
    sensation?: string;
    aggravations: string[];
    ameliorations: string[];
    concomitants: string[];
    causation: string[];
  };
  primaryClassification: "common" | "characteristic" | "peculiar" | "strange_rare_peculiar" | "keynote";
  secondaryTags: string[];
  clinicalImportance: 1 | 2 | 3; // 1 = supporting, 2 = important, 3 = decisive
  reasoningHistory: ReasoningEntry[];
  selectedBy: PractitionerId;
  selectedAt: string;
}

export interface SelectedRubric {
  id: SelectedRubricId;
  rubricId: RubricId;
  sourceId: string;
  sourceName: string;
  sourceEdition?: string;
  sourceVersion?: string;
  chapter: string;
  rubricPath: string[];
  displayText: string;
  linkedTotalitySymptomIds: TotalitySymptomId[];
  groupId?: string;
  clinicianNotes?: string;
  status: "selected" | "excluded" | "alternative";
  selectionRationale?: string;
  selectedBy: PractitionerId;
  selectedAt: string;
  searchTraceability: {
    query: string;
    timestamp: string;
    filters?: Record<string, unknown>;
  };
}

export interface DifferentialRubricReasoning {
  id: DifferentialReasoningId;
  sourceSymptomId: SymptomId;
  interpretation: string;
  candidateRubricIds: RubricId[];
  selectedRubricId?: RubricId;
  rejectedRubricIds: RubricId[];
  selectionRationale?: string;
  rejectionRationales: Record<string, string>;
  clinicianNotes?: string;
}

export interface MiasmaticAssessmentItem {
  miasm: "psora" | "sycosis" | "syphilis" | "tubercular" | "cancerinic";
  strength: MiasmaticStrength;
  supportingSymptomIds: SymptomId[];
  rationale?: string;
}

export interface SusceptibilityAssessment {
  level: SusceptibilityLevel;
  rationale?: string;
  supportingObservationIds: string[];
  assessedBy: PractitionerId;
  assessedAt: string;
}

export interface ConstitutionalAssessment {
  impressions: string[];
  confidence: AssessmentConfidence;
  supportingObservationIds: string[];
  rationale?: string;
}

export interface ObstacleToCure {
  id: ObstacleId;
  category: ObstacleCategory;
  description: string;
  status: "active" | "resolved" | "uncertain";
  identifiedOn?: string;
  supportingNotes?: string;
}

export interface HomeopathicTimelineEvent {
  id: string;
  eventType: "characteristic_symptom" | "general" | "etiology";
  milestoneTitle: string;
  description: string;
  dateOrAge: string;
}

export interface HomeopathicAssessment {
  id: AssessmentId;
  organizationId: OrganizationId;
  clinicId?: ClinicId;
  patientId: PatientId;
  encounterId: EncounterId;
  practitionerId: PractitionerId;
  consultationId?: ConsultationId;
  treatmentEpisodeId?: EpisodeId;

  totalitySymptoms: TotalitySymptom[];
  selectedRubrics: SelectedRubric[];
  differentialReasoning: DifferentialRubricReasoning[];
  miasmaticProfile: MiasmaticAssessmentItem[];
  susceptibility: SusceptibilityAssessment;
  constitutional: ConstitutionalAssessment;
  obstaclesToCure: ObstacleToCure[];
  rubricGroups: RubricGroup[];

  etiologicalFactors: string[];
  maintainingCauses: string[];
  timelineEvents: HomeopathicTimelineEvent[];

  status: HomeopathicAssessmentStatus;
  assessmentMethodology: {
    id: string;
    version: string;
  };
  weightingMethodVersion: string;
  provenance: Provenance;
  recordVersion: number;
  schemaVersion: number;
}
