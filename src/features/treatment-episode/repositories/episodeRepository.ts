import { TreatmentEpisode } from "../domain/episode.types";

export interface EpisodeRepository {
  create(episode: TreatmentEpisode): Promise<TreatmentEpisode>;
  update(episode: TreatmentEpisode): Promise<TreatmentEpisode>;
  findById(id: string): Promise<TreatmentEpisode | null>;
  findByPatientId(patientId: string): Promise<TreatmentEpisode[]>;
}

/**
 * DEVELOPMENT ONLY - Synthetic In-Memory Episode Repository
 */
export class MockEpisodeRepository implements EpisodeRepository {
  private store = new Map<string, TreatmentEpisode>();

  async create(episode: TreatmentEpisode): Promise<TreatmentEpisode> {
    if (this.store.has(episode.id)) {
      throw new Error(`Treatment Episode with ID ${episode.id} already exists`);
    }
    this.store.set(episode.id, episode);
    return episode;
  }

  async update(episode: TreatmentEpisode): Promise<TreatmentEpisode> {
    if (!this.store.has(episode.id)) {
      throw new Error(`Treatment Episode with ID ${episode.id} does not exist`);
    }
    this.store.set(episode.id, episode);
    return episode;
  }

  async findById(id: string): Promise<TreatmentEpisode | null> {
    return this.store.get(id) || null;
  }

  async findByPatientId(patientId: string): Promise<TreatmentEpisode[]> {
    return Array.from(this.store.values()).filter(e => e.patientId === patientId);
  }
}
