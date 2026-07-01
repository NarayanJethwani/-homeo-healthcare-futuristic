import { JETHWANI_REMEDY_CONFIRMATIONS } from '../../../lib/repertoryData';
import { repertoryRepository } from '../database/repertoryDb';
import { DifferentialComparisonResult, RepertoryRubric } from '../types';

export class DifferentialEngine {
  /**
   * Compares two remedies against the active case symptoms.
   */
  static async compareRemedies(
    remedyA: string,
    remedyB: string,
    symptoms: Array<{ rubricId: string }>,
    confidenceA: number,
    confidenceB: number
  ): Promise<DifferentialComparisonResult> {
    const rubrics: RepertoryRubric[] = [];
    for (const s of symptoms) {
      const rub = await repertoryRepository.getRubricById(s.rubricId);
      if (rub) rubrics.push(rub);
    }

    const sharedRubrics: string[] = [];
    const uniqueToA: string[] = [];
    const uniqueToB: string[] = [];

    rubrics.forEach(rub => {
      const hasA = rub.relatedRemedies.some(r => r.remedyId === remedyA);
      const hasB = rub.relatedRemedies.some(r => r.remedyId === remedyB);

      if (hasA && hasB) {
        sharedRubrics.push(rub.title);
      } else if (hasA) {
        uniqueToA.push(rub.title);
      } else if (hasB) {
        uniqueToB.push(rub.title);
      }
    });

    const confA = JETHWANI_REMEDY_CONFIRMATIONS[remedyA]?.confirmatory || [];
    const confB = JETHWANI_REMEDY_CONFIRMATIONS[remedyB]?.confirmatory || [];

    const getMissingConfirmations = (remedyId: string, confirmations: string[]) => {
      return confirmations.filter(c => 
        !rubrics.some(rub => 
          rub.relatedRemedies.some(r => r.remedyId === remedyId) &&
          (rub.title.toLowerCase().includes(c.toLowerCase()) || 
           rub.plainLanguageMeaning.toLowerCase().includes(c.toLowerCase()))
        )
      );
    };

    const missingConfirmationA = getMissingConfirmations(remedyA, confA);
    const missingConfirmationB = getMissingConfirmations(remedyB, confB);

    const differentiatingQuestions: string[] = [];

    const isChillyA = confA.some(c => c.toLowerCase().includes('chilly'));
    const isWarmA = confA.some(c => c.toLowerCase().includes('warm') || c.toLowerCase().includes('hot'));
    const isChillyB = confB.some(c => c.toLowerCase().includes('chilly'));
    const isWarmB = confB.some(c => c.toLowerCase().includes('warm') || c.toLowerCase().includes('hot'));

    if ((isChillyA && isWarmB) || (isWarmA && isChillyB)) {
      differentiatingQuestions.push(
        `Thermal check: Is the patient chilly (favors ${remedyA}) or warm-blooded (favors ${remedyB})?`
      );
    }

    const thirstlessA = confA.some(c => c.toLowerCase().includes('thirstless'));
    const thirstyA = confA.some(c => c.toLowerCase().includes('thirst ') || c.toLowerCase().includes('thirsty'));
    const thirstlessB = confB.some(c => c.toLowerCase().includes('thirstless'));
    const thirstyB = confB.some(c => c.toLowerCase().includes('thirst ') || c.toLowerCase().includes('thirsty'));

    if ((thirstlessA && thirstyB) || (thirstyA && thirstlessB)) {
      const favorsA = thirstlessA ? remedyA : remedyB;
      const favorsB = thirstyA ? remedyA : remedyB;
      differentiatingQuestions.push(
        `Thirst check: Is the patient thirstless (favors ${favorsA}) or thirsty (favors ${favorsB})?`
      );
    }

    const motionAmelA = confA.some(c => c.toLowerCase().includes('motion'));
    const motionAmelB = confB.some(c => c.toLowerCase().includes('motion'));
    if (motionAmelA !== motionAmelB) {
      differentiatingQuestions.push(
        `Motion check: Are physical symptoms ameliorated by motion (favors ${motionAmelA ? remedyA : remedyB})?`
      );
    }

    if (differentiatingQuestions.length === 0) {
      differentiatingQuestions.push(
        `Differential consideration: Assess the patient's reaction to cold drinks and open air.`
      );
    }

    return {
      remedyA,
      remedyB,
      sharedRubrics,
      uniqueToA,
      uniqueToB,
      missingConfirmationA,
      missingConfirmationB,
      differentiatingQuestions,
      confidenceGap: Math.abs(confidenceA - confidenceB)
    };
  }
}
