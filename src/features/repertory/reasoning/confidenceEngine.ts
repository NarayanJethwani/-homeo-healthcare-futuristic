import { repertoryRepository } from '../database/repertoryDb';
import { ConfidenceBreakdown, RepertoryRubric } from '../types';

export class ConfidenceEngine {
  /**
   * Calculates category-specific confidence coverage percentages for a given remedy.
   */
  static async getConfidenceBreakdown(
    remedyId: string,
    symptoms: Array<{ rubricId: string }>
  ): Promise<ConfidenceBreakdown> {
    const rubrics: RepertoryRubric[] = [];
    for (const s of symptoms) {
      const rub = await repertoryRepository.getRubricById(s.rubricId);
      if (rub) rubrics.push(rub);
    }

    if (rubrics.length === 0) {
      return { mental: 0, physical: 0, modalities: 0, etiology: 0, thermals: 0, overall: 0 };
    }

    const groups = {
      mental: [] as RepertoryRubric[],
      physical: [] as RepertoryRubric[],
      modalities: [] as RepertoryRubric[],
      etiology: [] as RepertoryRubric[],
      thermals: [] as RepertoryRubric[]
    };

    rubrics.forEach(rub => {
      if (rub.category === 'Mental & Emotional') {
        groups.mental.push(rub);
      } else if (rub.category === 'Etiology / Causation') {
        groups.etiology.push(rub);
      } else if (rub.category === 'Modalities') {
        groups.modalities.push(rub);
      } else if (rub.category === 'Thermal State') {
        groups.thermals.push(rub);
      } else {
        groups.physical.push(rub);
      }
    });

    const calcCoverage = (groupRubrics: RepertoryRubric[]) => {
      if (groupRubrics.length === 0) return 0;
      const matched = groupRubrics.filter(r => 
        r.relatedRemedies.some(rem => rem.remedyId === remedyId)
      );
      return Math.round((matched.length / groupRubrics.length) * 100);
    };

    const mental = calcCoverage(groups.mental);
    const physical = calcCoverage(groups.physical);
    const modalities = calcCoverage(groups.modalities);
    const etiology = calcCoverage(groups.etiology);
    const thermals = calcCoverage(groups.thermals);

    const totalMatched = rubrics.filter(r => 
      r.relatedRemedies.some(rem => rem.remedyId === remedyId)
    ).length;
    const overall = Math.round((totalMatched / rubrics.length) * 100);

    return { mental, physical, modalities, etiology, thermals, overall };
  }
}
