import { RepertoryRubric, MiasmType } from '../types';

export interface MiasmaticProfile {
  primaryMiasm: MiasmType;
  secondaryMiasm: MiasmType | null;
  mixedPresentation: boolean;
  confidence: number;
  reasoning: string;
  remedyMiasmaticFit: Record<string, number>; // remedyId -> fit score (0-100)
}

export class MiasmaticEngine {
  /**
   * Evaluates active symptoms and rubric weights to determine the dominant miasmatic currents.
   */
  public static analyzeMiasms(
    rubrics: RepertoryRubric[],
    symptoms: Array<{ rubricId: string; severity: number }>
  ): MiasmaticProfile {
    const miasmaticTotals: Record<MiasmType, number> = {
      Psora: 0,
      Sycosis: 0,
      Syphilis: 0,
      Tubercular: 0,
      Cancerinic: 0
    };

    let totalPoints = 0;

    for (const rub of rubrics) {
      if (rub.miasmaticWeight) {
        const severity = symptoms.find(s => s.rubricId === rub.rubricId)?.severity || 1.0;
        Object.entries(rub.miasmaticWeight).forEach(([miasm, weight]) => {
          const scoreContribution = weight * severity;
          miasmaticTotals[miasm as MiasmType] += scoreContribution;
          totalPoints += scoreContribution;
        });
      }
    }

    // Rank miasms
    const rankedMiasms = Object.entries(miasmaticTotals)
      .map(([name, weight]) => ({ name: name as MiasmType, weight }))
      .sort((a, b) => b.weight - a.weight);

    const primaryMiasm = rankedMiasms[0]?.weight > 0 ? rankedMiasms[0].name : 'Psora';
    const secondaryMiasm = rankedMiasms[1]?.weight > 0 ? rankedMiasms[1].name : null;
    const mixedPresentation = secondaryMiasm !== null && (rankedMiasms[0].weight - rankedMiasms[1].weight) < 15;

    const confidence = totalPoints > 0 
      ? Math.round((rankedMiasms[0].weight / totalPoints) * 100) 
      : 50;

    const reasoning = `Case exhibits a primary ${primaryMiasm} load (${Math.round(rankedMiasms[0].weight)} points)${
      secondaryMiasm ? ` with secondary ${secondaryMiasm} tendencies (${Math.round(rankedMiasms[1].weight)} points)` : ''
    }.`;

    // Map miasm fit per remedy (Ars = Syphilitic, Nux = Psoric/Sycotic, Lyc = Sycotic, Sulph = Psoric, Puls = Sycotic)
    const remedyMiasmaticFit: Record<string, number> = {
      'Ars': primaryMiasm === 'Syphilis' ? 95 : primaryMiasm === 'Psora' ? 70 : 60,
      'Nux-v': primaryMiasm === 'Psora' ? 90 : primaryMiasm === 'Sycosis' ? 80 : 50,
      'Lyc': primaryMiasm === 'Sycosis' ? 95 : primaryMiasm === 'Psora' ? 80 : 60,
      'Sulph': primaryMiasm === 'Psora' ? 98 : primaryMiasm === 'Sycosis' ? 70 : 50,
      'Puls': primaryMiasm === 'Sycosis' ? 95 : primaryMiasm === 'Psora' ? 75 : 55
    };

    return {
      primaryMiasm,
      secondaryMiasm,
      mixedPresentation,
      confidence,
      reasoning,
      remedyMiasmaticFit
    };
  }
}
