import { 
  ConsultationId, EncounterId, PatientId, OrganizationId, ClinicId, EpisodeId, 
  SymptomId 
} from "../../../shared/domain/identifiers";
import { Provenance } from "../../../shared/domain/entities";

export interface SymptomRecord {
  id: SymptomId;
  conceptId?: string;
  patientWording: string;
  normalizedName: string;

  location?: string;
  radiation?: string;
  sensation?: string;

  onsetDate?: string;
  duration?: string;
  frequency?: string;
  progression?: "improving" | "stable" | "worsening" | "fluctuating" | "unknown";
  intensity?: "mild" | "moderate" | "severe" | "extreme";

  aggravations: string[];
  ameliorations: string[];
  concomitants: string[];
  causation: string[];

  isCharacteristic: boolean;
  clinicianNotes?: string;
}

export interface MentalGenerals {
  fears: string[];
  anxiety?: string;
  anger?: string;
  grief?: string;
  irritability?: string;
  memory?: string;
  concentration?: string;
  consolationResponse?: string;
  companyPreference?: string;
  sensitivity?: string;
  emotionalCausation: string[];
  dreams?: string;
  clinicianNotes?: string;
}

export interface PhysicalGenerals {
  thermalPreference?: string;
  appetite?: string;
  thirst?: string;
  cravings: string[];
  aversions: string[];
  perspiration?: string;
  sleep?: string;
  sleepPosition?: string;
  energy?: string;
  bowelHabits?: string;
  urination?: string;
  menstrualHistory?: string;
  weatherSensitivity?: string;
  clinicianNotes?: string;
}

export interface GeneralModalities {
  aggravatingFactors: string[];
  amelioratingFactors: string[];
}

export interface IllnessTimelineEvent {
  id: string;
  occurredOn?: string;
  approximatePeriod?: string;
  eventType:
    | "symptom_onset"
    | "worsening"
    | "improvement"
    | "treatment"
    | "investigation"
    | "hospitalization"
    | "stress_event"
    | "other";
  description: string;
  source: "patient" | "caregiver" | "clinician" | "document";
}

export interface FollowUpSymptomUpdate {
  symptomId: SymptomId;
  patientWording: string;
  normalizedName: string;
  changeStatus: "better" | "no_change" | "worse" | "resolved" | "new_pattern";
  details?: string;
}

export interface FollowUpClinicalIntake {
  previousEncounterId?: EncounterId;
  responseSincePreviousTreatment: string;
  symptomUpdates: FollowUpSymptomUpdate[];
  newSymptoms: SymptomRecord[];
  currentAssessment: string;
  updatedPlanNotes?: string;
}

export type ConsultationLifecycleStatus =
  | "scheduled"
  | "waiting"
  | "active"
  | "paused"
  | "completed"
  | "cancelled"
  | "archived";

export const ALLOWED_CONSULTATION_TRANSITIONS: Record<ConsultationLifecycleStatus, readonly ConsultationLifecycleStatus[]> = {
  scheduled: ["waiting", "cancelled"],
  waiting: ["active", "cancelled"],
  active: ["paused", "completed", "cancelled"],
  paused: ["active", "completed", "cancelled"],
  completed: ["archived"],
  cancelled: ["archived"],
  archived: [],
} as const;

export type ConsultationOutcome =
  | "prescription_issued"
  | "no_prescription"
  | "follow_up_required"
  | "referred";

export interface ConsultationAssignment {
  assignedClinicianId: string;
  claimedAt?: string;
  lastActivityAt?: string;
  claimExpiresAt?: string;
}

export interface ConsultationRevision {
  version: number;
  updatedAt: string;
  updatedBy: string;
}

export interface ConsultationAuditEvent {
  id: string;
  consultationId: string;
  patientId: string;
  actorId: string;
  actorRole: string;
  eventType:
    | "consultation_created"
    | "consultation_started"
    | "consultation_resumed"
    | "consultation_paused"
    | "consultation_cancelled"
    | "consultation_completed"
    | "draft_saved"
    | "draft_conflict_detected"
    | "rubric_added"
    | "rubric_removed"
    | "remedy_selected"
    | "transcript_excerpt_accepted"
    | "prescription_finalized"
    | "prescription_document_generated"
    | "prescription_dispatch_requested"
    | "prescription_dispatch_succeeded"
    | "prescription_dispatch_failed";
  occurredAt: string;
  metadata?: Record<string, unknown>;
}

export interface CompletionReadiness {
  ready: boolean;
  outcomeSelected: boolean;
  clinicalValidationErrors: string[];
  prescriptionValidationErrors: string[];
  staleRevision: boolean;
  saveInProgress: boolean;
  completionInProgress: boolean;
}

export interface ClinicalIntake {
  id: ConsultationId;
  encounterId: EncounterId;
  patientId: PatientId;
  organizationId: OrganizationId;
  clinicId?: ClinicId;
  treatmentEpisodeId?: EpisodeId;

  lifecycleStatus?: ConsultationLifecycleStatus;
  outcome?: ConsultationOutcome;
  assignment?: ConsultationAssignment;
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  accumulatedActiveSeconds?: number;
  revision?: ConsultationRevision;

  chiefComplaints: SymptomRecord[];
  historyPresentIllness?: string;
  pastMedicalHistory?: string;
  familyHistory?: string;

  mentalGenerals: MentalGenerals;
  physicalGenerals: PhysicalGenerals;

  characteristicSymptoms: SymptomRecord[];
  generalModalities: GeneralModalities;
  causation: string[];
  illnessTimeline: IllnessTimelineEvent[];

  followUpDetails?: FollowUpClinicalIntake;

  clinicianNotes?: string;

  schemaVersion: number;
  recordVersion: number;
  provenance: Provenance;
}

export function isValidLifecycleTransition(
  current: ConsultationLifecycleStatus,
  next: ConsultationLifecycleStatus
): boolean {
  const allowed = ALLOWED_CONSULTATION_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

export function hasMeaningfulMentalGenerals(input: MentalGenerals): boolean {
  if (input.fears && input.fears.length > 0) return true;
  if (input.emotionalCausation && input.emotionalCausation.length > 0) return true;
  
  const textFields: (keyof Omit<MentalGenerals, "fears" | "emotionalCausation">)[] = [
    "anxiety", "anger", "grief", "irritability", "memory", "concentration",
    "consolationResponse", "companyPreference", "sensitivity", "dreams", "clinicianNotes"
  ];
  
  return textFields.some(field => input[field] && input[field]!.trim().length > 0);
}

export function hasMeaningfulPhysicalGenerals(input: PhysicalGenerals): boolean {
  if (input.cravings && input.cravings.length > 0) return true;
  if (input.aversions && input.aversions.length > 0) return true;
  
  const textFields: (keyof Omit<PhysicalGenerals, "cravings" | "aversions">)[] = [
    "thermalPreference", "appetite", "thirst", "perspiration", "sleep", "sleepPosition",
    "energy", "bowelHabits", "urination", "menstrualHistory", "weatherSensitivity", "clinicianNotes"
  ];
  
  return textFields.some(field => input[field] && input[field]!.trim().length > 0);
}

