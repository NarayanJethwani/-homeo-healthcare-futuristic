export interface AttributionRecord {
  sourceId: string;
  author: string;
  originalText: string;
  grade: number;
  confidenceContribution: number;
}

export interface ReconciledSymptomLink {
  symptomKey: string;
  reconciledGrade: 1 | 2 | 3;
  confidenceLevel: number;
  attributions: AttributionRecord[];
  conflicts: string[];
}

export const AUTHOR_WEIGHTS: Record<string, number> = {
  "Kent": 1.0,
  "Hering": 1.0,
  "Boericke": 0.9,
  "Allen": 0.9,
  "Clarke": 0.8,
  "Lippe": 0.8,
  "Boger": 0.7,
  "Nash": 0.7,
  "Phatak": 0.7,
  "Farrington": 0.6
};

/**
 * Normalizes symptom grades into numerical scores.
 * Grade 3 (Bold Italic keynote) = 1.0
 * Grade 2 (Italic symptom) = 0.6
 * Grade 1 (Plain text symptom) = 0.2
 */
export function getGradeWeight(grade: 1 | 2 | 3): number {
  switch (grade) {
    case 3: return 1.0;
    case 2: return 0.6;
    case 1:
    default:
      return 0.2;
  }
}

/**
 * Reconciles multiple historical references for a single symptom-remedy link.
 * Implements the Phase 9 confidence mathematical model.
 */
export function reconcileSymptom(
  remedyId: string,
  symptomKey: string,
  sources: Array<{ author: string; originalText: string; grade: 1 | 2 | 3 }>
): ReconciledSymptomLink {
  if (sources.length === 0) {
    return {
      symptomKey,
      reconciledGrade: 1,
      confidenceLevel: 0,
      attributions: [],
      conflicts: ["No source references provided."]
    };
  }

  let totalWeightedGrade = 0;
  let sumWeights = 0;
  const attributions: AttributionRecord[] = [];
  const conflicts: string[] = [];

  // Track values to detect contradictions
  let thermalIsHotCount = 0;
  let thermalIsChillyCount = 0;
  const gradesCollected: number[] = [];

  sources.forEach(src => {
    const sWeight = AUTHOR_WEIGHTS[src.author] || 0.5;
    const gWeight = getGradeWeight(src.grade);

    totalWeightedGrade += sWeight * gWeight;
    sumWeights += sWeight;
    gradesCollected.push(src.grade);

    // Attribute calculation
    attributions.push({
      sourceId: `src_${src.author.toLowerCase()}`,
      author: src.author,
      originalText: src.originalText,
      grade: src.grade,
      confidenceContribution: Math.round((sWeight * gWeight) * 100)
    });

    // Simple keyword conflict check (e.g. chilly vs hot thermal conflict)
    const textLower = src.originalText.toLowerCase();
    if (textLower.includes("chilly") || textLower.includes("worse cold") || textLower.includes("sensitive to cold")) {
      thermalIsChillyCount++;
    }
    if (textLower.includes("hot-blooded") || textLower.includes("worse warmth") || textLower.includes("sensitive to heat")) {
      thermalIsHotCount++;
    }
  });

  // Calculate final confidence level: (weighted sum of grade / sum of weights) * 100
  const averageGradeMultiplier = sumWeights > 0 ? (totalWeightedGrade / sumWeights) : 0.2;
  const confidenceLevel = Math.min(100, Math.max(10, Math.round(averageGradeMultiplier * 100)));

  // Calculate reconciled grade (1, 2, or 3)
  let reconciledGrade: 1 | 2 | 3 = 1;
  if (confidenceLevel >= 70) {
    reconciledGrade = 3;
  } else if (confidenceLevel >= 40) {
    reconciledGrade = 2;
  }

  // Conflict Detection: Opposite somatic statements
  if (thermalIsChillyCount > 0 && thermalIsHotCount > 0) {
    conflicts.push(`Thermal Conflict: ${thermalIsChillyCount} sources report chilliness; ${thermalIsHotCount} sources report heat-aggravation.`);
  }

  // Conflict Detection: High grade variance (e.g., one author lists as Keynote, another as raw unproven symptom)
  const maxGrade = Math.max(...gradesCollected);
  const minGrade = Math.min(...gradesCollected);
  if (maxGrade - minGrade >= 2) {
    conflicts.push(`Grade Discrepancy: High variance between authors (Keynote vs. Plain text).`);
  }

  return {
    symptomKey,
    reconciledGrade,
    confidenceLevel,
    attributions,
    conflicts
  };
}

export interface UnifiedRemedyProfile {
  remedyId: string;
  reconciledSymptoms: ReconciledSymptomLink[];
  aggregateConfidence: number;
}

/**
 * Aggregates a mock raw source stream and resolves them into a unified profile.
 */
export function generateUnifiedRemedyProfile(remedyId: string): UnifiedRemedyProfile {
  // Mock data representing a raw text ingestion stream for Sulphur
  const sulphurRawSymptoms: Record<string, Array<{ author: string; originalText: string; grade: 1 | 2 | 3 }>> = {
    "burning_soles": [
      { author: "Kent", originalText: "Intolerable burning in the soles of feet at night in bed, must stick them out.", grade: 3 },
      { author: "Boericke", originalText: "Burning in soles and palms at night, throws off covers.", grade: 3 },
      { author: "Hering", originalText: "Burning of the soles of feet, seeks cold spots.", grade: 2 },
      { author: "Phatak", originalText: "Soles burn, uncovers them.", grade: 2 }
    ],
    "thermal_profile": [
      { author: "Kent", originalText: "Highly hot-blooded patient, aggravated by warmth of room or bed.", grade: 3 },
      { author: "Boericke", originalText: "Hot-blooded constitution, dislikes warmth.", grade: 2 },
      { author: "Lippe", originalText: "Chilly in chronic states but sweats from heat.", grade: 1 } // Triggers a minor thermal conflict
    ],
    "sweets_desire": [
      { author: "Boericke", originalText: "Great craving for sweets, sugars, and candies.", grade: 3 },
      { author: "Nash", originalText: "Strong desire for sweets and spicy foods.", grade: 2 }
    ]
  };

  const lycopodiumRawSymptoms: Record<string, Array<{ author: string; originalText: string; grade: 1 | 2 | 3 }>> = {
    "anticipatory_stage_fright": [
      { author: "Kent", originalText: "Anticipatory dread before public appearance, yet performs with confidence once begun.", grade: 3 },
      { author: "Nash", originalText: "Dread of undertaking new tasks, stage fright.", grade: 3 },
      { author: "Boger", originalText: "Anxiety before public events.", grade: 2 }
    ],
    "flatulence_bloating": [
      { author: "Boericke", originalText: "Abdomen bloated immediately after eating a small amount of food.", grade: 3 },
      { author: "Phatak", originalText: "Flatulence, stomach full after a few mouthfuls.", grade: 2 },
      { author: "Farrington", originalText: "Gastrointestinal dyspepsia with gas accumulation.", grade: 1 }
    ]
  };

  const rawData = remedyId === "rem_sulphur" ? sulphurRawSymptoms : lycopodiumRawSymptoms;
  const reconciledSymptoms: ReconciledSymptomLink[] = [];
  let sumConfidence = 0;

  Object.keys(rawData).forEach(symptomKey => {
    const link = reconcileSymptom(remedyId, symptomKey, rawData[symptomKey]);
    reconciledSymptoms.push(link);
    sumConfidence += link.confidenceLevel;
  });

  const aggregateConfidence = reconciledSymptoms.length > 0 
    ? Math.round(sumConfidence / reconciledSymptoms.length) 
    : 70;

  return {
    remedyId,
    reconciledSymptoms,
    aggregateConfidence
  };
}
