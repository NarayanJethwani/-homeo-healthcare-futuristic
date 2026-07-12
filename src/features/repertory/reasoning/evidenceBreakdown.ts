import { JETHWANI_REMEDY_CONFIRMATIONS } from '../../../lib/repertoryData';
import { repertoryRepository } from '../database/repertoryDb';
import { EvidenceBreakdown, MiasmType } from '../types';

export class EvidenceBreakdownEngine {
  /**
   * Generates a deterministic score breakdown per category for all scored remedies.
   */
  static async getEvidenceBreakdown(
    symptoms: Array<{
      rubricId: string;
      severity: number;
      frequency: 'constant' | 'frequent' | 'occasional';
      impact: 'severe' | 'moderate' | 'mild';
    }>
  ): Promise<EvidenceBreakdown> {
    const breakdown: EvidenceBreakdown = { remedyScores: {} };
    if (symptoms.length === 0) return breakdown;

    // Calculate dominant miasm
    const activeSymptomWeights: Record<string, number> = {};
    const miasmaticTotals: Record<MiasmType, number> = { Psora: 0, Sycosis: 0, Syphilis: 0, Tubercular: 0, Cancerinic: 0 };

    for (const sym of symptoms) {
      const rub = await repertoryRepository.getRubricById(sym.rubricId);
      if (!rub) continue;
      const freqMult = sym.frequency === 'constant' ? 1.2 : sym.frequency === 'frequent' ? 1.0 : 0.8;
      const impMult = sym.impact === 'severe' ? 1.2 : sym.impact === 'moderate' ? 1.0 : 0.8;
      const symptomWeight = sym.severity * freqMult * impMult;
      activeSymptomWeights[sym.rubricId] = symptomWeight;

      if (rub.miasmaticWeight) {
        Object.entries(rub.miasmaticWeight).forEach(([miasm, weight]) => {
          miasmaticTotals[miasm as MiasmType] += weight * symptomWeight;
        });
      }
    }

    let dominantMiasm: MiasmType = 'Psora';
    let maxMiasmWeight = 0;
    Object.entries(miasmaticTotals).forEach(([miasm, weight]) => {
      if (weight > maxMiasmWeight) {
        maxMiasmWeight = weight;
        dominantMiasm = miasm as MiasmType;
      }
    });

    // Compute scores per remedy
    for (const sym of symptoms) {
      const rub = await repertoryRepository.getRubricById(sym.rubricId);
      if (!rub) continue;

      const symptomWeight = activeSymptomWeights[sym.rubricId];
      let categoryMultiplier = 1.0;
      switch (rub.category) {
        case 'Etiology / Causation':
          categoryMultiplier = 2.0;
          break;
        case 'Mental & Emotional':
        case 'Constitutional Generals':
        case 'Thermal State':
        case 'Food & Cravings':
          categoryMultiplier = 1.5;
          break;
        case 'Modalities':
        case 'Sleep':
          categoryMultiplier = 1.2;
          break;
        case 'Modern Clinical Conditions':
          categoryMultiplier = 0.8;
          break;
        default:
          categoryMultiplier = 1.0;
      }

      for (const rem of rub.relatedRemedies) {
        if (!breakdown.remedyScores[rem.remedyId]) {
          breakdown.remedyScores[rem.remedyId] = {
            mental: 0,
            physical: 0,
            modalities: 0,
            thermals: 0,
            miasm: 0,
            clinicalWeight: 0,
            total: 0
          };
        }

        const rScore = breakdown.remedyScores[rem.remedyId];

        // Core base contribution
        const baseScore = (rem.grade ?? 0) * symptomWeight * rub.confidence * categoryMultiplier;
        
        // Scaled by clinical weight
        const clinicalWeightPart = baseScore * rem.clinicalExperienceWeight;
        
        let finalCont = clinicalWeightPart;

        // Miasm bonus
        let miasmBonus = 0;
        const remedyConfirm = JETHWANI_REMEDY_CONFIRMATIONS[rem.remedyId];
        const hasMiasmMatch = remedyConfirm?.confirmatory.some(c => c.toLowerCase().includes(dominantMiasm.toLowerCase())) || false;
        if (hasMiasmMatch) {
          miasmBonus = finalCont * 0.15;
          finalCont += miasmBonus;
        }

        // Thermal bonus
        let thermalBonus = 0;
        if (rub.category === 'Thermal State') {
          const thermalMatch = (rub.subCategory === 'Chilly' && rem.contraindicationNotes?.toLowerCase().includes('warm')) ||
                               (rub.subCategory === 'Warm' && rem.contraindicationNotes?.toLowerCase().includes('chilly'));
          if (!thermalMatch) {
            thermalBonus = finalCont * 0.20;
            finalCont += thermalBonus;
          }
        }

        // Distribute points into categories
        if (rub.category === 'Mental & Emotional') {
          rScore.mental += baseScore;
        } else if (rub.category === 'Modalities') {
          rScore.modalities += baseScore;
        } else if (rub.category === 'Thermal State') {
          rScore.thermals += baseScore + thermalBonus;
        } else {
          rScore.physical += baseScore;
        }

        rScore.miasm += miasmBonus;
        rScore.clinicalWeight += baseScore - clinicalWeightPart;
        rScore.total += finalCont;
      }
    }

    // Round everything to 1 decimal place
    Object.keys(breakdown.remedyScores).forEach(id => {
      const r = breakdown.remedyScores[id];
      r.mental = Math.round(r.mental * 10) / 10;
      r.physical = Math.round(r.physical * 10) / 10;
      r.modalities = Math.round(r.modalities * 10) / 10;
      r.thermals = Math.round(r.thermals * 10) / 10;
      r.miasm = Math.round(r.miasm * 10) / 10;
      r.clinicalWeight = Math.round(r.clinicalWeight * 10) / 10;
      r.total = Math.round(r.total * 10) / 10;
    });

    return breakdown;
  }
}
