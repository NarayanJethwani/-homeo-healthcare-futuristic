import { Encounter, EncounterType } from "../domain/encounter.types";
import { 
  EncounterId, PatientId, OrganizationId, ClinicId, PractitionerId, 
  ConsultationId, EpisodeId 
} from "../../../shared/domain/identifiers";
import { Provenance, RepositoryUpdateResult } from "../../../shared/domain/entities";

export interface CreateEncounterInput {
  patientId: PatientId;
  organizationId: OrganizationId;
  clinicId?: ClinicId;
  practitionerId: PractitionerId;
  encounterType: EncounterType;
  encounterDate: string;
  primaryEpisodeId?: EpisodeId;
  relatedEpisodeIds?: EpisodeId[];
  provenance: Provenance;
}

export interface UpdateEncounterDraftInput {
  clinicalIntakeId?: ConsultationId;
  primaryEpisodeId?: EpisodeId;
  relatedEpisodeIds?: EpisodeId[];
  encounterDate?: string;
  provenance: Provenance;
}

export interface EncounterRepository {
  create(input: CreateEncounterInput): Promise<Encounter>;
  findById(id: EncounterId): Promise<Encounter | null>;
  findByPatientId(patientId: PatientId): Promise<Encounter[]>;
  findByEpisodeId(episodeId: EpisodeId): Promise<Encounter[]>;
  updateDraft(
    id: EncounterId,
    input: UpdateEncounterDraftInput,
    expectedVersion: number
  ): Promise<RepositoryUpdateResult<Encounter>>;
  save(encounter: Encounter): Promise<Encounter>;
}

/**
 * DEVELOPMENT ONLY - Synthetic In-Memory Encounter Repository
 */
export class MockEncounterRepository implements EncounterRepository {
  private store = new Map<string, Encounter>();

  async create(input: CreateEncounterInput): Promise<Encounter> {
    const id = `enc_${Math.random().toString(36).substring(2, 11)}` as EncounterId;
    const encounter: Encounter = {
      id,
      patientId: input.patientId,
      organizationId: input.organizationId,
      clinicId: input.clinicId,
      practitionerId: input.practitionerId,
      encounterType: input.encounterType,
      status: "draft",
      encounterDate: input.encounterDate,
      primaryEpisodeId: input.primaryEpisodeId,
      relatedEpisodeIds: input.relatedEpisodeIds || [],
      schemaVersion: 1,
      recordVersion: 0,
      provenance: input.provenance
    };
    this.store.set(id, encounter);
    return encounter;
  }

  async findById(id: EncounterId): Promise<Encounter | null> {
    return this.store.get(id) || null;
  }

  async findByPatientId(patientId: PatientId): Promise<Encounter[]> {
    return Array.from(this.store.values()).filter(e => e.patientId === patientId);
  }

  async findByEpisodeId(episodeId: EpisodeId): Promise<Encounter[]> {
    return Array.from(this.store.values()).filter(
      e => e.primaryEpisodeId === episodeId || e.relatedEpisodeIds.includes(episodeId)
    );
  }

  async updateDraft(
    id: EncounterId,
    input: UpdateEncounterDraftInput,
    expectedVersion: number
  ): Promise<RepositoryUpdateResult<Encounter>> {
    const stored = this.store.get(id);
    if (!stored) {
      return { status: "not_found" };
    }

    if (stored.recordVersion !== expectedVersion) {
      return { status: "version_conflict", currentEntity: stored };
    }

    const updated: Encounter = {
      ...stored,
      clinicalIntakeId: input.clinicalIntakeId !== undefined ? input.clinicalIntakeId : stored.clinicalIntakeId,
      primaryEpisodeId: input.primaryEpisodeId !== undefined ? input.primaryEpisodeId : stored.primaryEpisodeId,
      relatedEpisodeIds: input.relatedEpisodeIds !== undefined ? input.relatedEpisodeIds : stored.relatedEpisodeIds,
      encounterDate: input.encounterDate !== undefined ? input.encounterDate : stored.encounterDate,
      recordVersion: stored.recordVersion + 1,
      provenance: input.provenance
    };

    this.store.set(id, updated);
    return { status: "updated", entity: updated };
  }

  // Helper method for state transition services bypassing generic draft edits
  async updateStatusDirect(id: EncounterId, status: "ready_for_review", provenance: Provenance): Promise<Encounter> {
    const stored = this.store.get(id);
    if (!stored) {
      throw new Error(`Encounter with ID ${id} not found`);
    }
    const updated: Encounter = {
      ...stored,
      status,
      recordVersion: stored.recordVersion + 1,
      provenance
    };
    this.store.set(id, updated);
    return updated;
  }

  async save(encounter: Encounter): Promise<Encounter> {
    this.store.set(encounter.id, encounter);
    return encounter;
  }
}
