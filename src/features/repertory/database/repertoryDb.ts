import { RepertoryRepository } from '../repositories/RepertoryRepository';
import { MemoryRepertoryRepository } from '../repositories/MemoryRepertoryRepository';
import { PublishedCorpusRepository } from '../repositories/PublishedCorpusRepository';
import { RepertoryRubric, GraphTriple } from '../types';

class ProductionRepertoryRepository implements RepertoryRepository {
  async getRubrics(filters?: any): Promise<RepertoryRubric[]> {
    return await PublishedCorpusRepository.getRubrics(filters);
  }
  
  async getRubricById(id: string): Promise<RepertoryRubric | null> {
    return await PublishedCorpusRepository.getRubricById(id);
  }
  
  async saveRubric(rubric: RepertoryRubric): Promise<RepertoryRubric> {
    throw new Error("Mutation not supported directly on ProductionRepertoryRepository. Use Ingestion or Editorial workspace.");
  }
  
  async deleteRubric(id: string): Promise<boolean> {
    throw new Error("Mutation not supported directly on ProductionRepertoryRepository. Use Ingestion or Editorial workspace.");
  }
  
  async getTriples(): Promise<GraphTriple[]> {
    const rubrics = await PublishedCorpusRepository.getRubrics();
    const triples: GraphTriple[] = [];
    rubrics.forEach(r => {
      if (r.relatedRemedies) {
        r.relatedRemedies.forEach(rem => {
          triples.push({
            subjectId: r.rubricId,
            predicate: `hasRemedyGrade${rem.grade}` as any,
            objectId: rem.remedyId
          });
        });
      }
    });
    return triples;
  }
  
  async saveTriple(triple: GraphTriple): Promise<void> {
    throw new Error("Mutation not supported directly on ProductionRepertoryRepository. Use Ingestion or Editorial workspace.");
  }
  
  async deleteTriple(subjectId: string, predicate: string, objectId: string): Promise<boolean> {
    throw new Error("Mutation not supported directly on ProductionRepertoryRepository. Use Ingestion or Editorial workspace.");
  }
}

export const repertoryRepository: RepertoryRepository = 
  (process.env.NODE_ENV === 'test' || process.env.REPERTORY_WORKSPACE === 'ingestion')
    ? new MemoryRepertoryRepository() 
    : new ProductionRepertoryRepository();

export default repertoryRepository;
