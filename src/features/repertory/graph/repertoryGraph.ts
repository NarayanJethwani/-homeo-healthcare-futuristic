import { repertoryRepository } from '../database/repertoryDb';
import { RepertoryRubric, GraphTriple } from '../types';

export class RepertoryGraph {
  
  /**
   * Retrieves all related rubrics (complementary relationships) for a given rubric.
   */
  static async getRelatedRubrics(rubricId: string): Promise<Array<{ rubricId: string; weight: number }>> {
    const triples = await repertoryRepository.getTriples();
    
    // Find relationships in both directions (undirected complementary link)
    const related = triples
      .filter(t => t.predicate === 'relatesTo' && (t.subjectId === rubricId || t.objectId === rubricId))
      .map(t => {
        const otherId = t.subjectId === rubricId ? t.objectId : t.subjectId;
        return {
          rubricId: otherId,
          weight: t.weight || 1.0
        };
      });

    return related;
  }

  /**
   * Retrieves miasms suggested by a rubric.
   */
  static async getSuggestedMiasms(rubricId: string): Promise<Array<{ miasm: string; weight: number }>> {
    const triples = await repertoryRepository.getTriples();
    return triples
      .filter(t => t.subjectId === rubricId && t.predicate === 'suggestsMiasm')
      .map(t => ({
        miasm: t.objectId,
        weight: t.weight || 1.0
      }));
  }

  /**
   * Retrieves modern diseases mapped to a rubric.
   */
  static async getDiseasesMapped(rubricId: string): Promise<Array<{ disease: string; weight: number }>> {
    const triples = await repertoryRepository.getTriples();
    return triples
      .filter(t => t.subjectId === rubricId && t.predicate === 'mapsToDisease')
      .map(t => ({
        disease: t.objectId,
        weight: t.weight || 1.0
      }));
  }

  /**
   * Finds rubrics where remedyA and remedyB have different coverage or grades.
   * Useful for differential analysis.
   */
  static async getDifferentiatingRubrics(remedyA: string, remedyB: string): Promise<Array<{ rubric: RepertoryRubric; gradeA: number; gradeB: number; weight: number }>> {
    const allRubrics = await repertoryRepository.getRubrics();
    const diffs: Array<{ rubric: RepertoryRubric; gradeA: number; gradeB: number; weight: number }> = [];

    for (const rub of allRubrics) {
      const covA = rub.relatedRemedies.find(r => r.remedyId.toLowerCase() === remedyA.toLowerCase());
      const covB = rub.relatedRemedies.find(r => r.remedyId.toLowerCase() === remedyB.toLowerCase());

      const gradeA = covA ? covA.grade : 0;
      const gradeB = covB ? covB.grade : 0;

      // Differentiating factor exists if one has a high grade (>=3) and the other is 0 or 1,
      // or if their grade difference is >= 2.
      if (Math.abs(gradeA - gradeB) >= 2 || (gradeA >= 3 && gradeB === 0) || (gradeB >= 3 && gradeA === 0)) {
        const diffWeight = Math.max(
          covA?.clinicalExperienceWeight || 0.5,
          covB?.clinicalExperienceWeight || 0.5
        ) * Math.abs(gradeA - gradeB);

        diffs.push({
          rubric: rub,
          gradeA,
          gradeB,
          weight: diffWeight
        });
      }
    }

    // Sort by differentiation weight descending
    return diffs.sort((a, b) => b.weight - a.weight);
  }
}
