import { RepertoryRepository } from './RepertoryRepository';
import { RepertoryRubric, GraphTriple } from '../types';

export class FirestoreRepertoryRepository implements RepertoryRepository {
  async getRubrics(filters?: {
    category?: string;
    organSystem?: string;
    miasm?: string;
    remedy?: string;
  }): Promise<RepertoryRubric[]> {
    console.warn("FirestoreRepertoryRepository.getRubrics: stub only, not connected in Phase 1.");
    return [];
  }

  async getRubricById(id: string): Promise<RepertoryRubric | null> {
    console.warn("FirestoreRepertoryRepository.getRubricById: stub only, not connected in Phase 1.");
    return null;
  }

  async saveRubric(rubric: RepertoryRubric): Promise<RepertoryRubric> {
    console.warn("FirestoreRepertoryRepository.saveRubric: stub only, not connected in Phase 1.");
    return rubric;
  }

  async deleteRubric(id: string): Promise<boolean> {
    console.warn("FirestoreRepertoryRepository.deleteRubric: stub only, not connected in Phase 1.");
    return false;
  }

  async getTriples(): Promise<GraphTriple[]> {
    console.warn("FirestoreRepertoryRepository.getTriples: stub only, not connected in Phase 1.");
    return [];
  }

  async saveTriple(triple: GraphTriple): Promise<void> {
    console.warn("FirestoreRepertoryRepository.saveTriple: stub only, not connected in Phase 1.");
  }

  async deleteTriple(subjectId: string, predicate: string, objectId: string): Promise<boolean> {
    console.warn("FirestoreRepertoryRepository.deleteTriple: stub only, not connected in Phase 1.");
    return false;
  }
}
