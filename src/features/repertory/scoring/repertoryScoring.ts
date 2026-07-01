import { JETHWANI_REMEDY_CONFIRMATIONS, REMEDIES_METADATA } from '../../../lib/repertoryData';
import { repertoryRepository } from '../database/repertoryDb';
import { RepertoryGraph } from '../graph/repertoryGraph';
import { ScoringResult, RemedyDifferentiation, RepertoryRubric, MiasmType } from '../types';

export class RepertoryScoring {
  
  /**
   * Performs multi-factorial weighted repertorization scoring on selected symptoms.
   */
  static async calculateRepertorization(
    symptoms: Array<{
      rubricId: string;
      severity: number; // 1-10
      frequency: 'constant' | 'frequent' | 'occasional';
      impact: 'severe' | 'moderate' | 'mild';
    }>
  ): Promise<ScoringResult> {
    const result: ScoringResult = {
      topRemedies: [],
      matchedRubrics: symptoms.map(s => s.rubricId),
      differentiatingRubrics: [],
      confidenceScore: 0,
      missingDataNeeded: []
    };

    if (symptoms.length === 0) return result;

    // 1. Calculate symptom weights and active miasmatic load
    const activeSymptomWeights: Record<string, number> = {};
    const miasmaticTotals: Record<MiasmType, number> = { Psora: 0, Sycosis: 0, Syphilis: 0, Tubercular: 0, Cancerinic: 0 };
    let totalMiasmPoints = 0;

    // Determine if we have various general parameters selected
    let hasThermalSelected = false;
    let hasThirstSelected = false;
    let hasModalitiesSelected = false;
    let hasMensesSelected = false;
    let hasSleepSelected = false;
    let hasEtiologySelected = false;

    for (const sym of symptoms) {
      const rub = await repertoryRepository.getRubricById(sym.rubricId);
      if (!rub) continue;

      if (rub.category === 'Thermal State' || rub.thermalState) hasThermalSelected = true;
      if (rub.thirstPattern && rub.thirstPattern !== 'normal') hasThirstSelected = true;
      if (rub.category === 'Modalities' || (rub.modalities && rub.modalities.length > 0) || (rub.aggravations && rub.aggravations.length > 0) || (rub.ameliorations && rub.ameliorations.length > 0)) hasModalitiesSelected = true;
      if (rub.category === 'Female / Menses' || (rub.organSystem && (rub.organSystem.toLowerCase().includes('menses') || rub.organSystem.toLowerCase().includes('female')))) hasMensesSelected = true;
      if (rub.category === 'Sleep') hasSleepSelected = true;
      if (rub.category === 'Etiology / Causation') hasEtiologySelected = true;

      // Weight calculation
      const freqMult = sym.frequency === 'constant' ? 1.2 : sym.frequency === 'frequent' ? 1.0 : 0.8;
      const impMult = sym.impact === 'severe' ? 1.2 : sym.impact === 'moderate' ? 1.0 : 0.8;
      const symptomWeight = sym.severity * freqMult * impMult;
      activeSymptomWeights[sym.rubricId] = symptomWeight;

      // Accumulate miasmatic load
      if (rub.miasmaticWeight) {
        Object.entries(rub.miasmaticWeight).forEach(([miasm, weight]) => {
          miasmaticTotals[miasm as MiasmType] += weight * symptomWeight;
          totalMiasmPoints += weight * symptomWeight;
        });
      }
    }

    // Determine dominant miasm
    let dominantMiasm: MiasmType = 'Psora';
    let maxMiasmWeight = 0;
    Object.entries(miasmaticTotals).forEach(([miasm, weight]) => {
      if (weight > maxMiasmWeight) {
        maxMiasmWeight = weight;
        dominantMiasm = miasm as MiasmType;
      }
    });

    // 2. Compute remedy scores
    const scores: Record<string, { remedyId: string; remedyName: string; score: number; matches: number }> = {};

    for (const sym of symptoms) {
      const rub = await repertoryRepository.getRubricById(sym.rubricId);
      if (!rub) continue;

      const symptomWeight = activeSymptomWeights[sym.rubricId];

      // Category multipliers
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

      // Add scores to each mapped remedy
      for (const rem of rub.relatedRemedies) {
        if (!scores[rem.remedyId]) {
          scores[rem.remedyId] = {
            remedyId: rem.remedyId,
            remedyName: rem.remedyName,
            score: 0,
            matches: 0
          };
        }

        const scoreObj = scores[rem.remedyId];
        scoreObj.matches += 1;

        // Base formula: Grade * weight * confidence * experienceWeight * categoryMultiplier
        let contribution = rem.grade * symptomWeight * rub.confidence * rem.clinicalExperienceWeight * categoryMultiplier;

        // Apply miasmatic alignment bonus (+15% if remedy matches dominant miasm)
        const remedyConfirm = JETHWANI_REMEDY_CONFIRMATIONS[rem.remedyId];
        const localMiasm = remedyConfirm?.confirmatory.some(c => c.toLowerCase().includes(dominantMiasm.toLowerCase())) || false;
        if (localMiasm) {
          contribution *= 1.15;
        }

        // Apply thermal alignment bonus (+20% if patient thermal matches remedy tendency)
        if (rub.category === 'Thermal State') {
          const thermalMatch = (rub.subCategory === 'Chilly' && rem.contraindicationNotes?.toLowerCase().includes('warm')) ||
                               (rub.subCategory === 'Warm' && rem.contraindicationNotes?.toLowerCase().includes('chilly'));
          // If the patient matches remedy thermal requirements, give bonus
          if (!thermalMatch) {
            contribution *= 1.20;
          }
        }

        scoreObj.score += contribution;
      }
    }

    // 3. Format and rank top remedies
    const rankedRemedies = Object.values(scores)
      .map(r => {
        // Fetch metadata for remedy
        const meta = REMEDIES_METADATA[r.remedyId] || { fullName: r.remedyName, source: 'Plant' };
        const confirmations = JETHWANI_REMEDY_CONFIRMATIONS[r.remedyId];
        
        let miasm = 'Psora';
        if (confirmations?.confirmatory.some(c => c.toLowerCase().includes('sycotic'))) miasm = 'Sycosis';
        else if (confirmations?.confirmatory.some(c => c.toLowerCase().includes('syphilitic'))) miasm = 'Syphilis';

        let thermal = 'Ambient';
        if (confirmations?.confirmatory.some(c => c.toLowerCase().includes('chilly') || c.toLowerCase().includes('cold'))) thermal = 'Chilly';
        else if (confirmations?.confirmatory.some(c => c.toLowerCase().includes('warm') || c.toLowerCase().includes('hot'))) thermal = 'Warm';

        // Calculate a normalization value for confidence (relative score based on maximum possible coverage)
        const matchRatio = r.matches / symptoms.length;
        const confidence = Math.round(matchRatio * 100);

        return {
          remedyId: r.remedyId,
          remedyName: r.remedyName,
          score: Math.round(r.score * 10) / 10,
          matches: r.matches,
          confidence,
          kingdom: meta.source,
          miasm,
          thermal
        };
      })
      .sort((a, b) => b.score - a.score);

    result.topRemedies = rankedRemedies;

    // 4. Calculate margin confidence score
    if (rankedRemedies.length >= 2) {
      const topScore = rankedRemedies[0].score;
      const secondScore = rankedRemedies[1].score;
      if (topScore > 0) {
        result.confidenceScore = Math.round(((topScore - secondScore) / topScore) * 100);
      }
    } else if (rankedRemedies.length === 1) {
      result.confidenceScore = 100;
    }

    // 5. Get differentiating rubrics for the top 2 remedies
    if (rankedRemedies.length >= 2) {
      const diffs = await RepertoryGraph.getDifferentiatingRubrics(
        rankedRemedies[0].remedyId,
        rankedRemedies[1].remedyId
      );
      result.differentiatingRubrics = diffs.slice(0, 3).map(d => d.rubric.rubricId);
    }

    // 6. Gather missing parameters
    if (!hasThermalSelected) result.missingDataNeeded.push("Thermal State (Chilly / Warm / Ambient)");
    if (!hasThirstSelected) result.missingDataNeeded.push("Thirst Pattern (Thirsty large / Thirstless)");
    if (!hasModalitiesSelected) result.missingDataNeeded.push("Symptom Modalities (Aggravations / Ameliorations)");
    if (!hasMensesSelected) result.missingDataNeeded.push("Menses details (for female cases)");
    if (!hasSleepSelected) result.missingDataNeeded.push("Sleep / Dreams details");
    if (!hasEtiologySelected) result.missingDataNeeded.push("Etiology / Causation (Onset triggers)");

    return result;
  }

  /**
   * Performs deep differentiation analysis for top remedy candidates.
   */
  static async differentiateRemedies(
    topRemedyIds: string[],
    selectedRubricIds: string[]
  ): Promise<RemedyDifferentiation[]> {
    const differentiations: RemedyDifferentiation[] = [];
    const activeRubrics: RepertoryRubric[] = [];

    for (const rid of selectedRubricIds) {
      const rub = await repertoryRepository.getRubricById(rid);
      if (rub) activeRubrics.push(rub);
    }

    for (const remedyId of topRemedyIds) {
      const meta = REMEDIES_METADATA[remedyId];
      if (!meta) continue;

      const confirmations = JETHWANI_REMEDY_CONFIRMATIONS[remedyId] || { confirmatory: [], eliminating: [], differentiating: [] };

      // Rubrics matching this remedy
      const matchingRubricTitles = activeRubrics
        .filter(r => r.relatedRemedies.some(rem => rem.remedyId.toLowerCase() === remedyId.toLowerCase()))
        .map(r => r.title);

      // Check which confirming symptoms are missing
      const missingConfirming: string[] = [];
      confirmations.confirmatory.forEach(conf => {
        const isMatched = activeRubrics.some(r => 
          r.title.toLowerCase().includes(conf.toLowerCase()) || 
          r.classicalWording.toLowerCase().includes(conf.toLowerCase())
        );
        if (!isMatched) {
          missingConfirming.push(conf);
        }
      });

      // Construct differentiation reason
      const strongestMatch = activeRubrics.find(r => 
        r.relatedRemedies.some(rem => rem.remedyId.toLowerCase() === remedyId.toLowerCase() && rem.grade >= 3)
      );
      const reason = strongestMatch 
        ? `Appears due to strong coverage on: "${strongestMatch.title}".` 
        : `Appears due to general coverage of active symptoms.`;

      differentiations.push({
        remedyId,
        remedyName: meta.fullName,
        reason,
        strongestMatchingRubrics: matchingRubricTitles.slice(0, 3),
        missingConfirmingRubrics: missingConfirming.slice(0, 3),
        differentiatingSymptoms: confirmations.differentiating.slice(0, 3),
        cautionNotes: confirmations.eliminating.length > 0 ? `Eliminating factor: ${confirmations.eliminating[0]}` : undefined,
        materiaMedicaRef: `Materia Medica reference: ${meta.fullName}`
      });
    }

    return differentiations;
  }
}
