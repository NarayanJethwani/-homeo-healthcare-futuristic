import { getAllKnowledgeEntities } from "../index";
import { KnowledgeEntity } from "../types";

export interface ComparisonData {
  title: string;
  slug: string;
  entity1Id: string;
  entity2Id: string;
  differences: { parameter: string; val1: string; val2: string }[];
}

export const COMPARISONS: ComparisonData[] = [
  {
    title: "Nux Vomica vs Lycopodium Clavatum",
    slug: "nux-vomica-vs-lycopodium",
    entity1Id: "R0002",
    entity2Id: "R0003",
    differences: [
      { parameter: "Common Name", val1: "Poison Nut", val2: "Club Moss" },
      { parameter: "Thermal State", val1: "Chilly (Extremely sensitive to cold)", val2: "Warm-blooded (Desires cool air)" },
      { parameter: "Organ Affinity", val1: "Liver, Stomach, Nervous System", val2: "Liver, Gastrointestinal tract, Kidneys" },
      { parameter: "Mental Picture", val1: "Irritable, ambitious, impatient workaholic", val2: "Lack of self-confidence, apprehensive, desires company" },
      { parameter: "Key Modalities", val1: "Worse: Morning, mental exertion, stimulants. Better: Warmth, rest.", val2: "Worse: 4 PM to 8 PM, warm rooms. Better: Warm drinks, uncovering." }
    ]
  },
  {
    title: "Atropa Belladonna vs Aconitum Napellus",
    slug: "belladonna-vs-aconite",
    entity1Id: "R0009",
    entity2Id: "R0020",
    differences: [
      { parameter: "Common Name", val1: "Deadly Nightshade", val2: "Monkshood" },
      { parameter: "Thermal State", val1: "Hot, burning skin surfaces", val2: "Chilly, sensitive to dry cold winds" },
      { parameter: "Acuity & Onset", val1: "Sudden, violent, localized congestion", val2: "Sudden, storm-like, with extreme anxiety/panic" },
      { parameter: "Key Modalities", val1: "Worse: Touch, motion, light. Better: Semi-erect posture, warmth.", val2: "Worse: Cold dry winds, evening. Better: Open air, perspiration." }
    ]
  },
  {
    title: "GERD vs Chronic Gastritis",
    slug: "gerd-vs-gastritis",
    entity1Id: "D0001",
    entity2Id: "D0008",
    differences: [
      { parameter: "Anatomical Site", val1: "Lower Esophageal Sphincter (LES) and Esophagus", val2: "Stomach Mucosal Lining" },
      { parameter: "Primary Symptom", val1: "Substernal heartburn, acid regurgitation", val2: "Epigastric burning pain, postprandial fullness" },
      { parameter: "Diagnostic Gold Standard", val1: "24-hr pH Impedance monitoring, Endoscopy", val2: "Gastric Endoscopy with biopsy (H. pylori check)" },
      { parameter: "Key Risk Factor", val1: "Obesity, hiatal hernia, caffeine, smoking", val2: "H. pylori infection, chronic NSAID usage, alcohol" }
    ]
  },
  {
    title: "Migraine vs Sinus Headache",
    slug: "migraine-vs-sinus-headache",
    entity1Id: "D0003",
    entity2Id: "D0006",
    differences: [
      { parameter: "Pain Quality", val1: "Throbbing, unilateral (one-sided) intensity", val2: "Dull pressure, bilateral, frontal/maxillary region" },
      { parameter: "Associated Symptoms", val1: "Nausea, photophobia (light sensitivity), aura", val2: "Nasal congestion, facial tenderness, postnasal drip" },
      { parameter: "Triggers", val1: "Stress, hormonal shifts, sleep lack, aged cheese", val2: "Allergen exposure, barometric shifts, viral colds" },
      { parameter: "Key Modalities", val1: "Worse: Movement, noise, light. Better: Dark quiet room.", val2: "Worse: Bending forward, damp weather. Better: Steam inhalation." }
    ]
  },
  {
    title: "CBC vs ESR (Blood Markers)",
    slug: "cbc-vs-esr",
    entity1Id: "L0001",
    entity2Id: "L0003",
    differences: [
      { parameter: "Marker Focus", val1: "Hematological profile (Red/White blood cells, Platelets)", val2: "General systemic inflammation rate indicator" },
      { parameter: "Testing Mechanism", val1: "Automated cytometric cell count sorting", val2: "Westergren tube sedimentation velocity check" },
      { parameter: "Clinical Value", val1: "Diagnoses anemia, leukocytosis, thrombocytopenia", val2: "Monitors chronic rheumatoid and autoimmune acuity" },
      { parameter: "Turnaround Time", val1: "Rapid (few minutes to 1 hour)", val2: "Requires 1 hour settling time" }
    ]
  }
];

export function getComparisonBySlug(slug: string): ComparisonData | undefined {
  return COMPARISONS.find(c => c.slug === slug);
}
