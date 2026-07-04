import { RepertoryRubric } from '../types';

export interface ConstitutionalProfile {
  dominantType: string;
  confidence: number;
  conflicts: string[];
  remedyConstitutionalFit: Record<string, number>; // remedyId -> fit score (0-100)
}

export class ConstitutionalEngine {
  /**
   * Generates a detailed constitutional profile based on active case rubrics.
   */
  public static analyzeConstitution(
    rubrics: RepertoryRubric[],
    _symptoms: Array<{ rubricId: string; severity: number }>
  ): ConstitutionalProfile {
    const remedyScores: Record<string, { matches: number; total: number }> = {
      'Ars': { matches: 0, total: 0 },
      'Nux-v': { matches: 0, total: 0 },
      'Lyc': { matches: 0, total: 0 },
      'Sulph': { matches: 0, total: 0 },
      'Puls': { matches: 0, total: 0 }
    };

    const conflicts: string[] = [];
    let chillyRubricsCount = 0;
    let warmRubricsCount = 0;
    let sweetsCravingCount = 0;
    let fatAversionCount = 0;

    for (const rub of rubrics) {
      const title = rub.title.toLowerCase();
      const cat = rub.category;

      // 1. Thermal State Checks
      if (cat === 'Thermal State' || title.includes('chilly') || title.includes('cold')) {
        if (rub.subCategory === 'Chilly' || title.includes('chilly') || title.includes('worse from cold')) {
          chillyRubricsCount++;
          remedyScores['Ars'].matches += 2;
          remedyScores['Nux-v'].matches += 2;
          remedyScores['Ars'].total += 2;
          remedyScores['Nux-v'].total += 2;
        } else if (rub.subCategory === 'Warm' || title.includes('warm') || title.includes('better in open air')) {
          warmRubricsCount++;
          remedyScores['Sulph'].matches += 2;
          remedyScores['Puls'].matches += 2;
          remedyScores['Sulph'].total += 2;
          remedyScores['Puls'].total += 2;
        }
      }

      // 2. Temperament/Mentals Checks
      if (cat === 'Mental & Emotional') {
        if (title.includes('anxiety') || title.includes('restless') || title.includes('fear')) {
          remedyScores['Ars'].matches += 1.5;
          remedyScores['Ars'].total += 1.5;
        }
        if (title.includes('irritable') || title.includes('anger') || title.includes('business')) {
          remedyScores['Nux-v'].matches += 1.5;
          remedyScores['Nux-v'].total += 1.5;
        }
        if (title.includes('yielding') || title.includes('weepy') || title.includes('sympathy')) {
          remedyScores['Puls'].matches += 1.5;
          remedyScores['Puls'].total += 1.5;
        }
        if (title.includes('bloating') || title.includes('anticipatory') || title.includes('performance')) {
          remedyScores['Lyc'].matches += 1.5;
          remedyScores['Lyc'].total += 1.5;
        }
      }

      // 3. Food Cravings & Aversions Checks
      if (cat === 'Food & Cravings' || title.includes('craving') || title.includes('aversion')) {
        if (title.includes('sweets') || title.includes('sugar')) {
          sweetsCravingCount++;
          remedyScores['Lyc'].matches += 2;
          remedyScores['Sulph'].matches += 2;
          remedyScores['Lyc'].total += 2;
          remedyScores['Sulph'].total += 2;
        }
        if (title.includes('fat') && title.includes('aversion')) {
          fatAversionCount++;
          remedyScores['Puls'].matches += 2;
          remedyScores['Puls'].total += 2;
        }
      }
    }

    // Identify constitutional contradictions
    if (chillyRubricsCount > 0 && warmRubricsCount > 0) {
      conflicts.push(`Thermal contradiction: Patient exhibits both chilly and warm-blooded indicators simultaneously.`);
    }
    if (sweetsCravingCount > 0 && fatAversionCount > 0 && warmRubricsCount > 0) {
      // Classic Pulsatilla (warm, fat aversion) vs Lycopodium (warm, sweet cravings) - check conflicts
    }

    // Compute fit scores
    const remedyConstitutionalFit: Record<string, number> = {};
    let dominantType = 'Balanced';
    let maxFit = 0;

    Object.entries(remedyScores).forEach(([remId, score]) => {
      const fit = score.total > 0 ? Math.round((score.matches / score.total) * 100) : 50;
      remedyConstitutionalFit[remId] = fit;
      if (fit > maxFit) {
        maxFit = fit;
        dominantType = remId;
      }
    });

    const confidence = maxFit > 50 ? Math.round((maxFit - 50) * 2) : 50;

    return {
      dominantType,
      confidence,
      conflicts,
      remedyConstitutionalFit
    };
  }
}
