import { ConstitutionalProfile } from "./types";

export const CONSTITUTIONAL_QUESTIONS = [
  {
    id: "thermal",
    label: "Thermal Reaction Pattern",
    options: [
      "Highly Chilly (Sensitive to cold drafts, dampness, and cold weather)",
      "Warm-Blooded (Worse in stuffy rooms, suffocated easily, prefers cold/fresh air)",
      "Neutral (Adapts easily, moderate sensitivity to weather changes)"
    ]
  },
  {
    id: "appetite",
    label: "Appetite & Food Cravings",
    options: [
      "Craving for sweets, warm drinks, and starchy foods (easily bloated)",
      "Craving for cold drinks, ice cream, sour foods, and salads (aversion to fats)",
      "Craving for salts, spices, fats, and pickles",
      "Irregular appetite, easily full, gets irritable if food is delayed"
    ]
  },
  {
    id: "sleep",
    label: "Sleep Quality & Rhythms",
    options: [
      "Restless sleep, waking at 3:00 AM, cannot fall back due to racing mind",
      "Groggy morning waking, energy peaks very late at night (wide awake 11 PM)",
      "Deep, heavy, sluggish sleep; wakes up feeling heavy and bloated",
      "Restless sleep with highly emotional or exhausting dreams; weepiness"
    ]
  },
  {
    id: "emotions",
    label: "Emotional Baseline & Response style",
    options: [
      "Highly conscientious, anxious, restless, likes neatness/order",
      "Irritable, easily angered by contradiction, impatient, highly focused",
      "Mild temperament, emotional, weeps easily, relieved by consolidation/empathy",
      "Reserved, independent, dislikes sympathy or consolation when upset"
    ]
  },
  {
    id: "modalities",
    label: "Primary Modalities (Worsening Factors)",
    options: [
      "Worse in late afternoon (4:00 PM - 8:00 PM), worse after eating fat",
      "Worse in warm stuffy rooms, worse lying down, better cool open air",
      "Worse from cold damp weather, worse during teething/milestones",
      "Worse from mental exertion, better from physical rest or massage"
    ]
  }
];

export function analyzeConstitution(answers: Record<string, string>): ConstitutionalProfile {
  const thermal = answers.thermal || "";
  const appetite = answers.appetite || "";
  const sleep = answers.sleep || "";
  const emotions = answers.emotions || "";
  const modalities = answers.modalities || "";

  let remedyMatch = "Nux Vomica";
  let systemDominance = "Gastro-Intestinal Axis";
  let adaptivePattern = "Metabolically Reactant, Sensitive to Stimulants";

  // Decision logic for constitutional typing
  if (thermal.includes("Chilly") && appetite.includes("sweets") && modalities.includes("4:00 PM - 8:00 PM")) {
    remedyMatch = "Lycopodium Clavatum";
    systemDominance = "Hepato-Digestive Axis";
    adaptivePattern = "Fluctuating Hepatic Function, Late Afternoon Worsening";
  } else if (thermal.includes("Warm-Blooded") && emotions.includes("weeps") && modalities.includes("warm stuffy rooms")) {
    remedyMatch = "Pulsatilla Nigricans";
    systemDominance = "Endocrine-Venous Axis";
    adaptivePattern = "Hormonally Fluctuating, Open Air Relief Pattern";
  } else if (thermal.includes("Chilly") && appetite.includes("cold drinks") && sleep.includes("3:00 AM")) {
    remedyMatch = "Arsenicum Album";
    systemDominance = "Vaso-Respiratory Axis";
    adaptivePattern = "Hyper-vigilant Nervous System, Midnight Chills";
  } else if (thermal.includes("Chilly") && sleep.includes("sluggish") && appetite.includes("salts")) {
    remedyMatch = "Calcarea Carbonica";
    systemDominance = "Lymphatic-Endocrine Axis";
    adaptivePattern = "Sluggish Metabolism, Calcifying Tissue Tendencies";
  } else if (emotions.includes("Reserved") && modalities.includes("warm stuffy rooms")) {
    remedyMatch = "Sepia Officinalis";
    systemDominance = "Utero-Portal Circulatory Axis";
    adaptivePattern = "Portal Venous Stagnation, Relieved by Hard Exercise";
  } else if (emotions.includes("Irritable") && appetite.includes("irregular")) {
    remedyMatch = "Nux Vomica";
    systemDominance = "Nervous-Digestive Axis";
    adaptivePattern = "Autonomic Irritability, Worse from Sedentary Lifestyle";
  } else if (modalities.includes("cold damp weather") && thermal.includes("Chilly")) {
    remedyMatch = "Rhus Toxicodendron";
    systemDominance = "Musculoskeletal Fibrous Axis";
    adaptivePattern = "Joint Stiffness worse on rest, better continuous motion";
  } else if (thermal.includes("Warm-Blooded") && appetite.includes("sweets")) {
    remedyMatch = "Sulphur";
    systemDominance = "Dermo-Eliminative Axis";
    adaptivePattern = "Eruptive Venous Congestion, Aggravated by Bed Warmth";
  }

  return {
    thermal: thermal.split(" (")[0] || "Neutral",
    appetite: appetite.split(" (")[0] || "Balanced",
    sleep: sleep.split(", ")[0] || "Normal Sleep",
    temperament: emotions.split(", ")[0] || "Balanced Temperament",
    modality: modalities.split(" (")[0] || "Weather Sensitive",
    remedyMatch,
    systemDominance,
    adaptivePattern
  };
}
