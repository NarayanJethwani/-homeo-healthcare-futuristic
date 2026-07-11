import { validatePayload } from "../../../shared/validation/helpers";
import { TreatmentEpisodeSchema } from "../schemas/episode.schema";
import { TreatmentEpisode, EpisodeStatus } from "../domain/episode.types";
import { EpisodeRepository } from "../repositories/episodeRepository";
import { DomainEventDispatcher } from "../../../shared/events/eventDispatcher";

export class EpisodeService {
  constructor(private readonly episodeRepo: EpisodeRepository) {}

  async startEpisode(params: {
    organizationId: string;
    patientId: string;
    title: string;
    conditionConceptIds: string[];
    primaryPractitionerId: string;
    createdBy: string;
  }): Promise<TreatmentEpisode> {
    const id = `epi_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();

    const rawEpisode: TreatmentEpisode = {
      id,
      organizationId: params.organizationId,
      schemaVersion: 1,
      recordVersion: 0,
      createdAt: now,
      createdBy: params.createdBy,
      updatedAt: now,
      updatedBy: params.createdBy,
      patientId: params.patientId,
      title: params.title,
      conditionConceptIds: params.conditionConceptIds,
      startedAt: now,
      status: "active",
      primaryPractitionerId: params.primaryPractitionerId
    };

    const validated = validatePayload(TreatmentEpisodeSchema, rawEpisode);
    const saved = await this.episodeRepo.create(validated as TreatmentEpisode);

    await DomainEventDispatcher.dispatch({
      eventType: "episode.created",
      timestamp: now,
      payload: { episodeId: saved.id, patientId: saved.patientId, status: saved.status }
    });

    return saved;
  }

  async closeEpisode(id: string, closer: string, resolutionSummary?: string): Promise<TreatmentEpisode> {
    const episode = await this.episodeRepo.findById(id);
    if (!episode) {
      throw new Error(`Episode with ID ${id} not found`);
    }

    const now = new Date().toISOString();
    const updated: TreatmentEpisode = {
      ...episode,
      status: "resolved",
      closedAt: now,
      resolutionSummary,
      updatedAt: now,
      updatedBy: closer,
      recordVersion: episode.recordVersion + 1
    };

    const validated = validatePayload(TreatmentEpisodeSchema, updated);
    const saved = await this.episodeRepo.update(validated as TreatmentEpisode);

    await DomainEventDispatcher.dispatch({
      eventType: "episode.closed",
      timestamp: now,
      payload: { episodeId: saved.id, patientId: saved.patientId, status: saved.status }
    });

    return saved;
  }

  async getPatientEpisodes(patientId: string): Promise<TreatmentEpisode[]> {
    return this.episodeRepo.findByPatientId(patientId);
  }
}
