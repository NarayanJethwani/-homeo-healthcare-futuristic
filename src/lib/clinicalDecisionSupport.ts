import { GENOME_REMEDY_DB } from './remedyGenomeSchema';
import { REPERTORY_DATA } from './repertoryData';

export interface DifferentialAnalysis {
  remedyId: string;
  remedyName: string;
  overallScore: number;
  rubricMatches: string[];
  contradictionAlerts: string[];
  potencyRecommendation: {
    suggested: string;
    rationale: string;
    aggravationRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  };
  expectedReactions: Array<{
    timelineDays: number;
    symptomShift: string;
    directionOfCureMatch: boolean;
  }>;
}

const remedyIdToAbbr: Record<string, string> = {
  'rem_sulphur': 'Sulph',
  'rem_lycopodium': 'Lyc',
  'rem_nux_vomica': 'Nux-v',
  'rem_arsenicum': 'Ars',
  'rem_calcarea': 'Calc',
  'rem_lachesis': 'Lach',
  'rem_pulsatilla': 'Puls',
  'rem_gelsemium': 'Gels',
  'rem_bryonia': 'Bry',
  'rem_aconite': 'Acon',
  'rem_nat_mur': 'Nat-m',
  'rem_phosphorus': 'Phos',
  'rem_silicea': 'Sil',
  'rem_sepia': 'Sep',
  'rem_belladonna': 'Bell',
  'rem_apis': 'Apis'
};

/**
 * Calculates Clinical Decision Support (CDS) differential rankings, contradictions, and expected reactions.
 * Implements the dynamic rubric token matching math formulas.
 */
export function calculateClinicalDecisionSupport(caseInput: {
  thermalState: 'Hot' | 'Chilly' | 'Ambi';
  foodDesires: string[];
  worseFrom: string[];
  primarySymptom: string;
}): DifferentialAnalysis[] {
  const differentials: DifferentialAnalysis[] = [];

  // Extract lowercase alphanumeric search tokens from primary presenting symptom
  const stopwords = new Set(["a", "an", "the", "with", "of", "in", "and", "to", "for", "is", "at", "on", "from", "symptoms", "complaint", "patient", "history", "years", "year", "old", "chronic", "severe", "recurrent", "feels", "feeling", "desires", "craves", "complaints"]);
  const tokens = caseInput.primarySymptom
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(word => word.length >= 3 && !stopwords.has(word));

  // Query rubrics in REPERTORY_DATA that contain any search tokens
  const matchedRubrics = REPERTORY_DATA.filter(rubric => {
    const rubName = rubric.name.toLowerCase();
    const rubChap = rubric.chapter.toLowerCase();
    return tokens.some(token => rubName.includes(token) || rubChap.includes(token));
  });

  GENOME_REMEDY_DB.forEach(rem => {
    let matchPoints = 0;
    let totalPoints = 0;
    const rubricMatches: string[] = [];
    const contradictionAlerts: string[] = [];
    let contradictionPenalty = 0;

    // --- 1. Dynamic Primary Symptom Rubric Matching ---
    let somaticMatchPoints = 0;
    let somaticTotalPoints = 0;
    let somaticRubricsMatched = 0;
    const abbr = remedyIdToAbbr[rem.id];

    if (abbr) {
      matchedRubrics.forEach(rubric => {
        const grade = rubric.remedies[abbr];
        if (grade !== undefined) {
          if (grade > 0) {
            somaticMatchPoints += grade * 15;
            somaticTotalPoints += 45; // Max possible grade is 3 (3 * 15 = 45)
            somaticRubricsMatched++;
            
            const citation = grade === 3 ? '[Kent]' : grade === 2 ? '[Boericke]' : '[Allen]';
            rubricMatches.push(`${rubric.chapter}: ${rubric.name} - Grade ${grade} ${citation}`);
          } else if (grade < 0) {
            // Negative grade represents an explicit contradiction (counter-indication)
            contradictionPenalty += 20;
            contradictionAlerts.push(`Somatic Contraindication: Presentation fits "${rubric.name}" which is counter-indicated for ${rem.identity.name} [Allen] (Grade ${grade}). Penalty -20%`);
          }
        }
      });
    }

    let somaticScore = 50; // baseline
    if (somaticTotalPoints > 0) {
      somaticScore = Math.round((somaticMatchPoints / somaticTotalPoints) * 100);
    } else {
      // Fallback to Genome organ/brain affinities
      const symptomLower = caseInput.primarySymptom.toLowerCase();
      let affinityScore = 50;
      let affinitySource = "";
      if (symptomLower.includes("skin") || symptomLower.includes("eczema") || symptomLower.includes("eruption") || symptomLower.includes("itch")) {
        affinityScore = rem.genome.skinAffinity;
        affinitySource = "Skin Affinity [Boericke]";
      } else if (symptomLower.includes("bloat") || symptomLower.includes("flatulence") || symptomLower.includes("digest") || symptomLower.includes("stomach") || symptomLower.includes("gas") || symptomLower.includes("dyspepsia")) {
        affinityScore = rem.genome.digestiveAxis;
        affinitySource = "Digestive Axis Affinity [Kent]";
      } else if (symptomLower.includes("anxiety") || symptomLower.includes("panic") || symptomLower.includes("fear") || symptomLower.includes("mind") || symptomLower.includes("grief") || symptomLower.includes("sadness") || symptomLower.includes("depress")) {
        affinityScore = Math.max(rem.genome.brainAffinity, rem.genome.nervousSystemAffinity);
        affinitySource = "Nervous System Affinity [Hering]";
      } else if (symptomLower.includes("cough") || symptomLower.includes("lung") || symptomLower.includes("respirat") || symptomLower.includes("chest") || symptomLower.includes("asthma")) {
        affinityScore = Math.max(rem.genome.lungAffinity, rem.genome.respiratoryAffinity);
        affinitySource = "Respiratory Affinity [Kent]";
      } else if (symptomLower.includes("fever") || symptomLower.includes("hot") || symptomLower.includes("temp") || symptomLower.includes("delirium")) {
        affinityScore = Math.max(rem.genome.vitalityLevel, 70);
        affinitySource = "Vascular Vitality [Boericke]";
      } else if (symptomLower.includes("joint") || symptomLower.includes("arthr") || symptomLower.includes("musculo") || symptomLower.includes("rheum") || symptomLower.includes("stiff")) {
        affinityScore = rem.genome.jointAffinity || rem.genome.musculoskeletalAffinity;
        affinitySource = "Musculoskeletal Affinity [Allen]";
      } else {
        affinityScore = Math.round((rem.genome.brainAffinity + rem.genome.nervousSystemAffinity) / 2);
        affinitySource = "Constitutional Core Affinity [Boericke]";
      }
      somaticScore = affinityScore;
      rubricMatches.push(`Genome Affinity: Primary symptom matches ${affinitySource} (Affinity: ${affinityScore}%).`);
    }

    // --- 2. Dynamic Food Desires Matching ---
    let foodMatchPoints = 0;
    let foodTotalPoints = 0;

    caseInput.foodDesires.forEach(food => {
      foodTotalPoints += 100;
      const fLower = food.toLowerCase();
      let desireIndex = 50;
      let foodLabel = "";
      if (fLower.includes("sweet")) {
        desireIndex = rem.genome.sweetsDesire;
        foodLabel = "Sweets [Kent]";
      } else if (fLower.includes("salt")) {
        desireIndex = rem.genome.saltDesire;
        foodLabel = "Salt [Boericke]";
      } else if (fLower.includes("fat")) {
        desireIndex = rem.genome.fatsDesire;
        foodLabel = "Fats [Kent]";
      } else if (fLower.includes("spice") || fLower.includes("pungent")) {
        desireIndex = rem.genome.spicesDesire;
        foodLabel = "Spices [Allen]";
      } else if (fLower.includes("stimulant") || fLower.includes("coffee") || fLower.includes("alcohol")) {
        desireIndex = rem.genome.stimulantsDesire;
        foodLabel = "Stimulants [Hering]";
      } else if (fLower.includes("egg")) {
        desireIndex = rem.genome.eggsDesire;
        foodLabel = "Eggs [Kent]";
      }

      foodMatchPoints += desireIndex;
      if (desireIndex > 65) {
        rubricMatches.push(`Generals: Craving match for ${foodLabel} (Intensity: ${desireIndex}%).`);
      } else if (desireIndex < 35) {
        contradictionPenalty += 10;
        contradictionAlerts.push(`Generals Contradiction: Patient craves ${food}, but ${rem.identity.name} has low preference or aversion [Allen] (Desire Index: ${desireIndex}%). Penalty -10%`);
      }
    });

    const foodScore = foodTotalPoints > 0 ? Math.round((foodMatchPoints / foodTotalPoints) * 100) : 50;

    // --- 3. Dynamic Modalities Matching ---
    let modMatchPoints = 0;
    let modTotalPoints = 0;

    caseInput.worseFrom.forEach(mod => {
      modTotalPoints += 100;
      const mLower = mod.toLowerCase();
      let sensitivityIndex = 50;
      let modLabel = "";
      if (mLower.includes("warmth of bed") || mLower.includes("blanket") || mLower.includes("warm room") || mLower.includes("heat")) {
        sensitivityIndex = rem.genome.warmRoomAggravation;
        modLabel = "Warmth/Warm Room [Kent]";
      } else if (mLower.includes("standing")) {
        sensitivityIndex = rem.genome.sluggishnessMetabolic > 60 ? 80 : 35;
        modLabel = "Standing still [Boericke]";
      } else if (mLower.includes("4 pm") || mLower.includes("evening") || mLower.includes("afternoon")) {
        sensitivityIndex = rem.genome.afternoonAggravation;
        modLabel = "4 PM - 8 PM [Kent]";
      } else if (mLower.includes("midnight") || mLower.includes("night")) {
        sensitivityIndex = rem.genome.midnightAggravation;
        modLabel = "Midnight - 2 AM [Ars/Kent]";
      } else if (mLower.includes("cold draft") || mLower.includes("wind") || mLower.includes("chill") || mLower.includes("cold air")) {
        sensitivityIndex = rem.genome.draftSensitivity;
        modLabel = "Cold Damp Drafts [Boericke]";
      } else if (mLower.includes("motion") || mLower.includes("movement") || mLower.includes("move")) {
        sensitivityIndex = rem.genome.motionAggravation;
        modLabel = "Motion [Bryonia/Kent]";
      }

      modMatchPoints += sensitivityIndex;
      if (sensitivityIndex > 65) {
        rubricMatches.push(`Modalities: Aggravation match for ${modLabel} (Intensity: ${sensitivityIndex}%).`);
      } else if (sensitivityIndex < 35) {
        contradictionPenalty += 15;
        contradictionAlerts.push(`Modality Contradiction: Patient worse from ${mod}, but ${rem.identity.name} has low sensitivity [Kent] (Aggravation Index: ${sensitivityIndex}%). Penalty -15%`);
      }
    });

    const modScore = modTotalPoints > 0 ? Math.round((modMatchPoints / modTotalPoints) * 100) : 50;

    // --- 4. Weighted Repertorization Fit Score (RF) Calculation ---
    const rfScore = Math.round((somaticScore * 0.4) + (foodScore * 0.3) + (modScore * 0.3));

    // --- 5. Thermal Contradiction Deductions (25% Penalty) ---
    if (caseInput.thermalState === "Chilly" && rem.genome.thermalHeatIndex > 65) {
      contradictionPenalty += 25;
      contradictionAlerts.push(`Thermal Contradiction: Patient is Chilly, but ${rem.identity.name} is warm-blooded (Heat Index: ${rem.genome.thermalHeatIndex}%). [Kent] Penalty -25%`);
    } else if (caseInput.thermalState === "Hot" && rem.genome.thermalHeatIndex < 35) {
      contradictionPenalty += 25;
      contradictionAlerts.push(`Thermal Contradiction: Patient is Hot-blooded, but ${rem.identity.name} is chilly (Heat Index: ${rem.genome.thermalHeatIndex}%). [Boericke] Penalty -25%`);
    }

    // --- 6. Final Score Calculation ---
    const overallScore = Math.max(0, rfScore - contradictionPenalty);

    // --- 7. Potency Recommendation ---
    let suggestedPotency = "30C";
    let potencyRationale = "Moderate constitutional fit. Recommended standard potency [Allen] with gradual repetition.";
    let aggravationRisk: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';

    if (overallScore >= 80) {
      if (rem.genome.potencySensitivity > 75) {
        suggestedPotency = "1M";
        potencyRationale = "Deep emotional picture matching constitutional state. Recommends a single high potency dose [Kent] to avoid primary aggravation.";
        aggravationRisk = 'High';
      } else {
        suggestedPotency = "200C";
        potencyRationale = "Strong somatic matching. Patient vital force can handle moderate-high potency [Boericke].";
        aggravationRisk = 'Moderate';
      }
    } else if (overallScore < 50) {
      suggestedPotency = "6C";
      potencyRationale = "Low structural matching. Recommended low potency organ support [Hahnemann] daily.";
      aggravationRisk = 'Low';
    }

    // --- 8. Dynamic Expected Reactions Forecast based on Kingdom & Miasms ---
    let expectedReactions: Array<{ timelineDays: number; symptomShift: string; directionOfCureMatch: boolean }> = [];
    if (rem.identity.kingdom === "Mineral") {
      expectedReactions = [
        { timelineDays: 3, symptomShift: "Initial emotional stabilization and stabilization of sleep patterns [Kent].", directionOfCureMatch: true },
        { timelineDays: 10, symptomShift: "Slow metabolic activation with transient discharge (nasal or sweat) [Hering].", directionOfCureMatch: true },
        { timelineDays: 28, symptomShift: "Deep musculoskeletal alignment and gradual healing of chronic complaints from within outward.", directionOfCureMatch: true }
      ];
    } else if (rem.identity.kingdom === "Plant") {
      expectedReactions = [
        { timelineDays: 1, symptomShift: "Rapid relief of acute neuralgic tension or fever spike [Boericke].", directionOfCureMatch: true },
        { timelineDays: 4, symptomShift: "Emergence of mild superficial skin rash, indicating outward redirection [Hering].", directionOfCureMatch: true },
        { timelineDays: 10, symptomShift: "Return of energy levels and recovery of normal organ functions.", directionOfCureMatch: true }
      ];
    } else {
      expectedReactions = [
        { timelineDays: 2, symptomShift: "Immediate drop in nervous loquacity or jealousy; improved sleep [Allen].", directionOfCureMatch: true },
        { timelineDays: 5, symptomShift: "Vascular heat dispersion with relief of pelvic or local congestions.", directionOfCureMatch: true },
        { timelineDays: 14, symptomShift: "Clear reversal of symptoms in reverse chronological order of appearance [Hering].", directionOfCureMatch: true }
      ];
    }

    differentials.push({
      remedyId: rem.id,
      remedyName: rem.identity.name,
      overallScore,
      rubricMatches,
      contradictionAlerts,
      potencyRecommendation: {
        suggested: suggestedPotency,
        rationale: potencyRationale,
        aggravationRisk
      },
      expectedReactions
    });
  });

  return differentials.sort((a, b) => b.overallScore - a.overallScore);
}
