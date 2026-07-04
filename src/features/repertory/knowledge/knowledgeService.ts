import { RemedyKnowledgeRecord, EvidenceItem } from './knowledgeModel';
import { JETHWANI_EVIDENCE_REGISTRY } from './evidenceRegistry';
import { RepertoryGraph } from '../graph/repertoryGraph';

export class KnowledgeService {
  private static cache = new Map<string, RemedyKnowledgeRecord>();
  private static isGraphInitialized = false;

  /**
   * Initializes the knowledge relations inside the Clinical Knowledge Graph.
   */
  public static async initializeKnowledgeGraph(): Promise<void> {
    if (this.isGraphInitialized) return;

    for (const record of Object.values(JETHWANI_EVIDENCE_REGISTRY)) {
      const remedyId = record.remedyId;

      // Register pathology relations
      for (const pathology of record.pathologyRelations) {
        await RepertoryGraph.registerRelationship(remedyId, 'treatsPathology', pathology, 0.8);
      }

      // Register remedy relationships (complementary, inimical, antidotes)
      for (const rel of record.remedyRelations) {
        if (rel.toLowerCase().includes('complementary')) {
          const targetRemId = rel.split(' ')[0];
          await RepertoryGraph.registerRelationship(remedyId, 'isComplementaryTo', targetRemId, 0.9);
        } else if (rel.toLowerCase().includes('antidote')) {
          const targetRemId = rel.split(' ')[0];
          await RepertoryGraph.registerRelationship(remedyId, 'antidotesRemedy', targetRemId, 0.85);
        } else if (rel.toLowerCase().includes('inimical')) {
          const targetRemId = rel.split(' ')[0];
          await RepertoryGraph.registerRelationship(remedyId, 'isInimicalTo', targetRemId, 0.95);
        }
      }
    }

    this.isGraphInitialized = true;
  }

  /**
   * Retrieves structured knowledge for a remedy, using a memoization cache to keep lookups sub-millisecond.
   */
  public static async getRemedyKnowledge(remedyId: string): Promise<RemedyKnowledgeRecord | null> {
    await this.initializeKnowledgeGraph();

    if (this.cache.has(remedyId)) {
      return this.cache.get(remedyId)!;
    }

    const record = JETHWANI_EVIDENCE_REGISTRY[remedyId];
    if (record) {
      this.cache.set(remedyId, record);
      return record;
    }

    return null;
  }

  /**
   * Queries specific evidence items matching a search tag or pathology concept.
   */
  public static async queryEvidenceByConcept(concept: string): Promise<EvidenceItem[]> {
    await this.initializeKnowledgeGraph();
    
    const results: EvidenceItem[] = [];
    const normalizedConcept = concept.toLowerCase();

    for (const record of Object.values(JETHWANI_EVIDENCE_REGISTRY)) {
      // Direct matches in pathology relations
      const matchesPathology = record.pathologyRelations.some(p => p.toLowerCase().includes(normalizedConcept));
      
      if (matchesPathology) {
        results.push(...record.evidenceItems);
      } else {
        // Fallback to searching evidence content text
        const matchesContent = record.evidenceItems.filter(item => 
          item.title.toLowerCase().includes(normalizedConcept) || 
          item.summary.toLowerCase().includes(normalizedConcept)
        );
        results.push(...matchesContent);
      }
    }

    return results;
  }
}
