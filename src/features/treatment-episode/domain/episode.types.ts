import { OrganizationScopedEntity } from "../../../shared/domain/entities";

export type EpisodeStatus = "active" | "resolved" | "inactive" | "cancelled";

export interface TreatmentEpisode extends OrganizationScopedEntity {
  patientId: string;
  title: string;
  conditionConceptIds: string[]; // Reference global clinicalConcepts IDs
  startedAt: string;
  closedAt?: string;
  status: EpisodeStatus;
  primaryPractitionerId: string;
  resolutionSummary?: string;
}
