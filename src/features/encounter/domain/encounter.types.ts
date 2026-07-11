import { 
  EncounterId, PatientId, OrganizationId, ClinicId, PractitionerId, 
  ConsultationId, EpisodeId 
} from "../../../shared/domain/identifiers";
import { Provenance } from "../../../shared/domain/entities";

export type EncounterType =
  | "initial_consultation"
  | "follow_up"
  | "teleconsultation"
  | "urgent"
  | "administrative";

export type EncounterStatus =
  | "draft"
  | "ready_for_review";

export interface Encounter {
  id: EncounterId;
  patientId: PatientId;
  organizationId: OrganizationId;
  clinicId?: ClinicId;
  practitionerId: PractitionerId;

  encounterType: EncounterType;
  status: EncounterStatus;
  encounterDate: string;

  clinicalIntakeId?: ConsultationId;
  primaryEpisodeId?: EpisodeId;
  relatedEpisodeIds: EpisodeId[];

  schemaVersion: number;
  recordVersion: number;
  provenance: Provenance;
}
