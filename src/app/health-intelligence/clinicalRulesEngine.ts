import { HealthDigitalTwin, SystemScores, MiasmaticProfile } from "./types";

export function analyzeDigitalTwin(twin: HealthDigitalTwin): {
  activeFlags: string[];
  systemScores: SystemScores;
  organLoad: Record<string, number>;
  riskLevel: Record<string, { level: "Low" | "Moderate" | "High"; pct: number }>;
  priorityGoals: string[];
  miasmaticProfile: MiasmaticProfile;
} {
  const activeFlags: string[] = [];
  const priorityGoals: string[] = [];
  
  // Baselines
  const systemScores: SystemScores = {
    endocrine: 95,
    cardiovascular: 95,
    digestive: 95,
    respiratory: 95,
    skin: 95,
    neurological: 95,
    immune: 95,
    mentalHealth: 95
  };

  const organLoad: Record<string, number> = {
    pancreas: 10,
    thyroid: 10,
    heart: 10,
    arteries: 10,
    gut: 10,
    liver: 10,
    lungs: 10,
    dermis: 10,
    adrenals: 10,
    brain: 10
  };

  const riskLevel: Record<string, { level: "Low" | "Moderate" | "High"; pct: number }> = {
    metabolic: { level: "Low", pct: 15 },
    cardio: { level: "Low", pct: 12 },
    endocrine: { level: "Low", pct: 10 },
    digestive: { level: "Low", pct: 15 },
    respiratory: { level: "Low", pct: 8 }
  };

  // Miasmatic base accumulations
  let psoraSum = 30;
  let sycosisSum = 20;
  let syphilisSum = 10;

  const completed = twin.completedAssessments || {};
  const completedKeys = Object.keys(completed);

  // 1. Map individual completed assessments to system scores and organ loads
  completedKeys.forEach(key => {
    const item = completed[key];
    const score = item.score; // 0 to 100, where lower is worse (higher burden)
    const burden = 100 - score;

    // Aggregate symptoms to miasmatic calculations
    item.symptoms.forEach(sym => {
      const sLower = sym.toLowerCase();
      if (sLower.includes("dry") || sLower.includes("cough") || sLower.includes("itch") || sLower.includes("grief") || sLower.includes("dread") || sLower.includes("fatigue") || sLower.includes("chilly") || sLower.includes("sweet")) {
        psoraSum += 12;
      }
      if (sLower.includes("bloat") || sLower.includes("weight") || sLower.includes("swelling") || sLower.includes("excess") || sLower.includes("nodule") || sLower.includes("cyst") || sLower.includes("greasy") || sLower.includes("tag")) {
        sycosisSum += 14;
      }
      if (sLower.includes("crack") || sLower.includes("wound") || sLower.includes("panic") || sLower.includes("waking up") || sLower.includes("tingling") || sLower.includes("clumsiness") || sLower.includes("scar")) {
        syphilisSum += 12;
      }
    });

    // Endocrine Profile Maps
    if (["diabetes_risk", "thyroid_assessment", "pcos_assessment", "adrenal_fatigue", "hormonal_balance", "womens_pcos"].includes(key)) {
      systemScores.endocrine = Math.min(systemScores.endocrine, score);
      if (key === "diabetes_risk") {
        organLoad.pancreas = Math.max(organLoad.pancreas, burden);
        riskLevel.endocrine.pct = Math.max(riskLevel.endocrine.pct, burden);
      }
      if (key === "thyroid_assessment") {
        organLoad.thyroid = Math.max(organLoad.thyroid, burden);
        riskLevel.endocrine.pct = Math.max(riskLevel.endocrine.pct, burden);
      }
      if (key === "adrenal_fatigue") {
        organLoad.adrenals = Math.max(organLoad.adrenals, burden);
      }
    }

    // Cardiovascular Profile Maps
    if (["hypertension", "heart_disease", "stroke_risk", "lipid_health", "cardio_age"].includes(key)) {
      systemScores.cardiovascular = Math.min(systemScores.cardiovascular, score);
      if (key === "hypertension") organLoad.arteries = Math.max(organLoad.arteries, burden);
      if (key === "heart_disease") organLoad.heart = Math.max(organLoad.heart, burden);
      riskLevel.cardio.pct = Math.max(riskLevel.cardio.pct, burden);
    }

    // Digestive Profile Maps
    if (["ibs_assessment", "gut_health", "gerd_evaluation", "liver_health", "fatty_liver_risk"].includes(key)) {
      systemScores.digestive = Math.min(systemScores.digestive, score);
      if (key === "ibs_assessment" || key === "gut_health") organLoad.gut = Math.max(organLoad.gut, burden);
      if (key === "liver_health" || key === "fatty_liver_risk") organLoad.liver = Math.max(organLoad.liver, burden);
      riskLevel.digestive.pct = Math.max(riskLevel.digestive.pct, burden);
    }

    // Respiratory Profile Maps
    if (["asthma_control", "allergy_profile", "sinus_health", "copd_risk", "sleep_apnea"].includes(key)) {
      systemScores.respiratory = Math.min(systemScores.respiratory, score);
      organLoad.lungs = Math.max(organLoad.lungs, burden);
      riskLevel.respiratory.pct = Math.max(riskLevel.respiratory.pct, burden);
    }

    // Skin Profile Maps
    if (["psoriasis_severity", "eczema_assessment", "acne_evaluation", "skin_barrier"].includes(key)) {
      systemScores.skin = Math.min(systemScores.skin, score);
      organLoad.dermis = Math.max(organLoad.dermis, burden);
    }

    // Mental Health Profile Maps
    if (["anxiety_assessment", "depression_screening", "burnout_assessment", "resilience_score", "cognitive_perf"].includes(key)) {
      systemScores.mentalHealth = Math.min(systemScores.mentalHealth, score);
      organLoad.brain = Math.max(organLoad.brain, burden);
    }

    // Neurological Profile Maps (shared with stress/cognitive)
    if (["cognitive_perf", "stroke_risk", "anxiety_assessment", "burnout_assessment"].includes(key)) {
      systemScores.neurological = Math.min(systemScores.neurological, score);
    }

    // Immune Profile Maps (shared with gut/child/allergy)
    if (["gut_health", "allergy_profile", "immunity_assessment"].includes(key)) {
      systemScores.immune = Math.min(systemScores.immune, score);
    }
  });

  // 2. Cross-Assessment Clinical Reasoning Rules (Phase 5)
  
  // Rule A: Endocrine-Stress Interaction (High Stress + Poor Sleep + Thyroid Symptoms)
  const hasStress = completed["adrenal_fatigue"] || completed["anxiety_assessment"] || completed["burnout_assessment"];
  const hasSleep = completed["sleep"];
  const hasThyroid = completed["thyroid_assessment"];

  if (hasStress && hasSleep && hasThyroid) {
    const stressBurden = 100 - (completed["adrenal_fatigue"]?.score || completed["anxiety_assessment"]?.score || 80);
    const sleepBurden = 100 - (completed["sleep"]?.score || 80);
    const thyroidBurden = 100 - (completed["thyroid_assessment"]?.score || 80);

    if (stressBurden > 40 && sleepBurden > 40 && thyroidBurden > 30) {
      activeFlags.push("Endocrine-Stress Axis Strain");
      priorityGoals.push("Decompress HPA axis to stabilize thyroid conversion");
    }
  }

  // Rule B: Metabolic Syndrome Clustering (Insulin Resistance + Obesity + PCOS)
  const hasInsulin = completed["insulin_resistance"];
  const hasObesity = completed["obesity_risk"];
  const hasPcos = completed["pcos_assessment"] || completed["womens_pcos"];

  if (hasInsulin && (hasObesity || hasPcos)) {
    const insulinBurden = 100 - hasInsulin.score;
    const obesityBurden = 100 - (hasObesity?.score || 50);
    const pcosBurden = 100 - (hasPcos?.score || 50);

    if (insulinBurden > 40 && (obesityBurden > 45 || pcosBurden > 40)) {
      activeFlags.push("Visceral-Glycemic Syndrome Profile");
      priorityGoals.push("Optimize cellular insulin sensitivity to balance androgen load");
      riskLevel.metabolic.level = "High";
      riskLevel.metabolic.pct = Math.max(riskLevel.metabolic.pct, 78);
    }
  }

  // Rule C: Brain-Gut Axis Tension (Anxiety/Depression + Gut/IBS issues)
  const hasAnxiety = completed["anxiety_assessment"] || completed["burnout_assessment"];
  const hasGut = completed["ibs_assessment"] || completed["gut_health"];

  if (hasAnxiety && hasGut) {
    const anxietyBurden = 100 - (completed["anxiety_assessment"]?.score || completed["burnout_assessment"]?.score || 80);
    const gutBurden = 100 - (completed["ibs_assessment"]?.score || completed["gut_health"]?.score || 80);

    if (anxietyBurden > 45 && gutBurden > 40) {
      activeFlags.push("Autonomic Brain-Gut Dysregulation");
      priorityGoals.push("Tone vagal pathway to restore peristaltic rhythm");
    }
  }

  // Rule D: Immune-Dermal Breakdown (Skin barrier + Allergies + Stress)
  const hasSkin = completed["skin_barrier"] || completed["eczema_assessment"];
  const hasAllergy = completed["allergy_profile"];

  if (hasSkin && hasAllergy) {
    const skinBurden = 100 - (completed["skin_barrier"]?.score || completed["eczema_assessment"]?.score || 80);
    const allergyBurden = 100 - completed["allergy_profile"].score;

    if (skinBurden > 40 && allergyBurden > 40) {
      activeFlags.push("Atopic Dermal-Respiratory Axis");
      priorityGoals.push("Seal epidermal lipid barrier and downregulate IgE reactivity");
    }
  }

  // Set general priority goals if none exist
  if (priorityGoals.length === 0) {
    priorityGoals.push("Complete baseline metabolic and sleep assessments");
    priorityGoals.push("Establish regular digestive transit rhythm");
  }

  // Adjust risk levels
  Object.keys(riskLevel).forEach(riskKey => {
    const r = riskLevel[riskKey];
    if (r.pct > 70) r.level = "High";
    else if (r.pct > 40) r.level = "Moderate";
    else r.level = "Low";
  });

  // Calculate miasmatic profile percentages
  const totalMiasm = psoraSum + sycosisSum + syphilisSum;
  const psora = Math.round((psoraSum / totalMiasm) * 100);
  const sycosis = Math.round((sycosisSum / totalMiasm) * 100);
  const syphilis = 100 - psora - sycosis;

  return {
    activeFlags,
    systemScores,
    organLoad,
    riskLevel,
    priorityGoals,
    miasmaticProfile: { psora, sycosis, syphilis }
  };
}
