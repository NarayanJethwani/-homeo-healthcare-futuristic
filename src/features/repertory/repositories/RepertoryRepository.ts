import { RepertoryRubric, GraphTriple } from '../types';

export interface RepertoryRepository {
  getRubrics(filters?: {
    category?: string;
    organSystem?: string;
    miasm?: string;
    remedy?: string;
  }): Promise<RepertoryRubric[]>;
  
  getRubricById(id: string): Promise<RepertoryRubric | null>;
  
  saveRubric(rubric: RepertoryRubric): Promise<RepertoryRubric>;
  
  deleteRubric(id: string): Promise<boolean>;
  
  getTriples(): Promise<GraphTriple[]>;
  
  saveTriple(triple: GraphTriple): Promise<void>;
  
  deleteTriple(subjectId: string, predicate: string, objectId: string): Promise<boolean>;
}
