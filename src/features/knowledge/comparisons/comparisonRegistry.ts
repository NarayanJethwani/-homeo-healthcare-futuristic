import { getAllKnowledgeEntities } from "../index";
import { KnowledgeEntity } from "../types";

export interface ComparisonData {
  title: string;
  slug: string;
  entity1Id: string;
  entity2Id: string;
  differences: { parameter: string; val1: string; val2: string }[];
  entity1Name?: string;
  entity2Name?: string;
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
  },
  {
    title: "TSH vs Anti-TPO Antibodies",
    slug: "tsh-vs-anti-tpo-antibodies",
    entity1Id: "L0002",
    entity2Id: "L0039",
    differences: [
      { parameter: "Marker Focus", val1: "Pituitary messenger hormone stimulating thyroid gland", val2: "Autoimmune antibody targeting thyroid peroxidase enzyme" },
      { parameter: "Clinical Value", val1: "Screens for overall functional thyroid activity", val2: "Identifies autoimmune etiology (Hashimoto/Graves)" },
      { parameter: "Diagnostic Utility", val1: "Confirms hyperthyroidism or hypothyroidism presence", val2: "Predicts progression risk in subclinical disease states" }
    ]
  },
  {
    title: "Hypothyroidism vs Hyperthyroidism",
    slug: "hypothyroidism-vs-hyperthyroidism",
    entity1Id: "D0011",
    entity2Id: "D0012",
    differences: [
      { parameter: "Pathophysiology", val1: "Underactive thyroid gland (inadequate hormone secretion)", val2: "Overactive thyroid gland (excessive hormone secretion)" },
      { parameter: "Key Symptoms", val1: "Weight gain, cold intolerance, fatigue, bradycardia", val2: "Weight loss, heat intolerance, anxiety, tachycardia" },
      { parameter: "TSH Levels", val1: "Elevated (compensatory response)", val2: "Suppressed (feedback inhibition)" }
    ]
  },
  {
    title: "TSH vs Free T4",
    slug: "tsh-vs-free-t4",
    entity1Id: "L0002",
    entity2Id: "L0036",
    differences: [
      { parameter: "Origin & Role", val1: "Pituitary hormone regulating thyroid function", val2: "Unbound, active hormone secreted by thyroid gland" },
      { parameter: "Clinical Relationship", val1: "Sensitive indicator of early thyroid stress (inverse)", val2: "Direct measure of actual circulating hormone supply" },
      { parameter: "Monitoring Use", val1: "Primary screen and medication dosing marker", val2: "Secondary check for acute status and central disorders" }
    ]
  },
  {
    title: "Hashimoto Thyroiditis vs Graves Disease",
    slug: "hashimoto-thyroiditis-vs-graves-disease",
    entity1Id: "D0011",
    entity2Id: "D0012",
    differences: [
      { parameter: "Pathology Focus", val1: "Chronic autoimmune hypothyroidism (destruction of thyroid cells)", val2: "Autoimmune hyperthyroidism (stimulation of TSH receptors)" },
      { parameter: "Primary Antibody", val1: "Anti-TPO (Thyroid Peroxidase) and Anti-Tg antibodies", val2: "TRAb (TSH Receptor Antibodies / TSI)" },
      { parameter: "Clinical Course", val1: "Gradual thyroid failure; gland may shrink or form goiter", val2: "Thyroid hyperactivity; causes goiter, exophthalmos, tremors" }
    ]
  },
  {
    title: "IBS vs IBD",
    slug: "ibs-vs-ibd",
    entity1Id: "D0004",
    entity2Id: "D_IBD",
    entity2Name: "Inflammatory Bowel Disease (IBD)",
    differences: [
      { parameter: "Nature of Condition", val1: "Functional GI disorder (no visible mucosal pathology)", val2: "Organic inflammatory disease (mucosal ulceration, structural damage)" },
      { parameter: "Pathological Markers", val1: "Normal inflammatory markers (fecal calprotectin is normal)", val2: "Elevated fecal calprotectin, ESR, and C-reactive protein" },
      { parameter: "Clinical Symptoms", val1: "Abdominal cramping relieved by stool, bloating, alternating habits", val2: "Chronic diarrhea with blood, persistent fever, weight loss, extra-intestinal signs" },
      { parameter: "Primary Diagnostics", val1: "Rome IV clinical criteria, negative exclusion screens", val2: "Upper/lower endoscopy with mucosal biopsies, CT enterography" }
    ]
  },
  {
    title: "Psoriasis vs Eczema",
    slug: "psoriasis-vs-eczema",
    entity1Id: "D0015",
    entity2Id: "D0002",
    differences: [
      { parameter: "Plaque Appearance", val1: "Well-demarcated silvery-scaled plaques on extensor surfaces", val2: "Ill-defined erythematous itchy vesicles on flexor creases" },
      { parameter: "Pruritus (Itching) Intensity", val1: "Mild to moderate itching; often described as burning or stinging", val2: "Intense, relentless itching (the 'itch that rashes'), worse at night" },
      { parameter: "Typical Locations", val1: "Elbows, knees, scalp, lumbosacral region, nails", val2: "Antecubital/popliteal creases, face, neck, wrists" },
      { parameter: "Underlying Pathology", val1: "Autoimmune-mediated hyperproliferation of keratinocytes", val2: "Atopic epidermal barrier dysfunction and IgE-mediated reactivity" }
    ]
  },
  {
    title: "Iron Deficiency vs Vitamin B12 Deficiency",
    slug: "iron-deficiency-vs-b12-deficiency",
    entity1Id: "D0051",
    entity2Id: "D0053",
    entity1Name: "Iron Deficiency Anemia",
    entity2Name: "Vitamin B12 Deficiency",
    differences: [
      { parameter: "RBC Indices (CBC)", val1: "Microcytic (low MCV), hypochromic (low MCH)", val2: "Macrocytic (high MCV), megaloblastic" },
      { parameter: "Primary Biomarkers", val1: "Low serum ferritin, elevated TIBC, low serum iron", val2: "Low serum vitamin B12, elevated methylmalonic acid (MMA)" },
      { parameter: "Neurological Symptoms", val1: "Absent; typical signs are fatigue, cold sensitivity, pica", val2: "Present (numbness, paresthesias, balance loss, cognitive fog)" },
      { parameter: "Etiological Triggers", val1: "Chronic blood loss (menses, GI), inadequate dietary iron", val2: "Pernicious anemia, strict vegan diet, malabsorption (atrophic gastritis)" }
    ]
  },
  {
    title: "Viral vs Allergic Rhinitis",
    slug: "viral-vs-allergic-rhinitis",
    entity1Id: "D0055",
    entity2Id: "D0005",
    entity1Name: "Viral Rhinitis (Common Cold)",
    entity2Name: "Allergic Rhinitis",
    differences: [
      { parameter: "Symptom Onset", val1: "Gradual progression over 1-2 days, resolving in 7-10 days", val2: "Immediate onset upon allergen exposure, persistent while exposed" },
      { parameter: "Nasal Secretions", val1: "Clear initially, becoming thick, discolored (yellow/green)", val2: "Consistently thin, watery, and clear" },
      { parameter: "Pruritus & Sneezing", val1: "Mild sneezing, throat irritation; minimal itching", val2: "Severe paroxysmal sneezing; intense itching of nose, eyes, palate" },
      { parameter: "Systemic Manifestations", val1: "Fever (mild), generalized myalgia, sore throat", val2: "Absence of fever/myalgias; presence of allergic shiners, conjunctivitis" }
    ]
  }
];

export function getComparisonBySlug(slug: string): ComparisonData | undefined {
  return COMPARISONS.find(c => c.slug === slug);
}
