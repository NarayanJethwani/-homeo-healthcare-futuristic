import type { StructuredClinicalNotes } from "../types/clinical-notes.types";
import type { PrescriptionDraft } from "../types/prescription.types";
import type { SelectedRubric } from "../types/repertory-intelligence.types";
import type { TranscriptionConsent } from "../types/telemedicine.types";
import type {
  ConsultationLifecycleStatus,
  ConsultationOutcome,
} from "../domain/consultation.types";

export const CONSULTATION_WORKSPACE_SCHEMA_VERSION = 1 as const;

export interface ConsultationRemedySelection {
  remedyId: string;
  remedyName: string;
  analysisSnapshotHash: string;
  selectedAt: string;
}

/**
 * Application-layer read model for the consultation workspace.
 * This intentionally extends the frozen Consultation domain without changing it.
 */
export interface ConsultationWorkspaceRecord {
  id: string;
  schemaVersion: typeof CONSULTATION_WORKSPACE_SCHEMA_VERSION;
  patientId: string;
  lifecycleStatus: ConsultationLifecycleStatus;
  outcome: ConsultationOutcome | "";
  notes: StructuredClinicalNotes;
  selectedRubrics: SelectedRubric[];
  selectedRemedy: ConsultationRemedySelection | null;
  prescriptionDraft: Partial<PrescriptionDraft>;
  consent: TranscriptionConsent;
  accumulatedActiveSeconds: number;
  recordVersion: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  completedAt?: string;
}

export type ConsultationWorkspaceDraftInput = Pick<
  ConsultationWorkspaceRecord,
  | "id"
  | "patientId"
  | "lifecycleStatus"
  | "outcome"
  | "notes"
  | "selectedRubrics"
  | "selectedRemedy"
  | "prescriptionDraft"
  | "accumulatedActiveSeconds"
>;
