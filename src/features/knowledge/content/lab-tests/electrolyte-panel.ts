import { KnowledgeEntity } from "../../types";

export const ElectrolytePanelLabTest: KnowledgeEntity = {
  id: "L0021",
  slug: "electrolyte-panel",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Electrolyte Panel (Serum Electrolytes)",
    hi: "इलेक्ट्रोलाइट पैनल (Electrolyte Panel)",
    gu: "ઇલેક્ટ્રોલાઇટ પેનલ (Electrolyte Panel)",
    mr: "इलेक्ट्रोलाईट पॅनेल (Electrolyte Panel)",
    es: "Panel de Electrolitos Séricos (Electrolyte Panel)",
    ar: "فحص الأملاح في الدم (Electrolyte Panel)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, and anion gap calculation for Electrolyte Panel under KDIGO 2024 standards.",
    hi: "इलेक्ट्रोलाइट पैनल लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "ઇલેક્ટ્રોલાઇટ પેનલ ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "इलेक्ट्रोलाईट पॅनेल चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y cálculo de brecha aniónica según KDIGO 2024.",
    ar: "التفسير السريري والنطاق المرجعي للأملاح."
  },
  content: {
    overview: "Electrolyte Panel: A critical biochemical serum panel measuring Sodium (Na+), Potassium (K+), Chloride (Cl-), and Bicarbonate/CO2 (HCO3-) to evaluate fluid osmolality, neuromuscular excitability, acid-base homeostasis, and renal tubular transport.",
    normalRange: "Sodium: 135 - 145 mEq/L; Potassium: 3.5 - 5.0 mEq/L; Chloride: 96 - 106 mEq/L; Bicarbonate (CO2): 22 - 29 mEq/L; Serum Anion Gap: 8 - 12 mEq/L.",
    highValues: [
      "Hyperkalemia (K+ >5.5 mEq/L): Cardiac dysrhythmia risk (Peaked T waves)",
      "Hypernatremia (Na+ >145 mEq/L): Dehydration, Diabetes Insipidus, Osmotic Diuresis",
      "High Anion Gap Metabolic Acidosis (DKA, Lactic Acidosis, Uremia, Toxic Ingestions)"
    ],
    lowValues: [
      "Severe Hyponatremia (Na+ <120 mEq/L): Cerebral edema, seizures, lethargy",
      "Hypokalemia (K+ <3.0 mEq/L): Muscle paralysis, ileus, cardiac ventricular arrhythmias",
      "Metabolic Alkalosis (Low Chloride / High Bicarbonate from Severe Vomiting)"
    ],
    clinicalInterpretation: "Electrolyte disruptions require immediate risk stratification; severe hyperkalemia (>6.5 mEq/L) demands urgent ECG, IV calcium gluconate, and insulin-glucose administration to prevent lethal cardiac arrest.",
    references: [
      "CIT-0069",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0021-001",
        passage: "Serum Potassium exceeding 6.5 mEq/L represents a hyperkalemic medical emergency requiring IV Calcium Gluconate for cardiac membrane stabilization.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0021-002",
        passage: "Severe hyponatremia with serum sodium below 120 mEq/L requires cautious hypertonic saline infusion to prevent central pontine myelinolysis.",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0021-003",
        passage: "Serum Anion Gap calculation [Na+ - (Cl- + HCO3-)] >12 mEq/L identifies high anion gap metabolic acidosis (MUDPILES).",
        citationIds: ["CIT-0069"]
      },
      {
        claimId: "CLM-L0021-004",
        passage: "Homeopathic supportive care does not replace emergency intravenous electrolyte correction or ECG telemetry monitoring in severe dyskalemia.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What is a constitutional remedy in homeopathy?",
      "answer": "A constitutional remedy is a deep-acting medicine selected to match a patient's overall physical, mental, and emotional makeup, rather than just treating a single local symptom."
    },
    {
      "question": "Why does the homeopath ask so many detailed questions?",
      "answer": "To find the individualized remedy, the homeopath must understand all unique characteristics—such as sleep patterns, thermal sensitivities, food cravings, and emotional triggers."
    },
    {
      "question": "How should homeopathic remedies be stored?",
      "answer": "Remedies should be stored in a cool, dry place, away from direct sunlight, strong odors (like camphor, perfumes), and electronic devices to maintain their potency."
    }
  ]
},
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Pathology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Electrolyte Panel", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/electrolyte-panel",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Electrolyte Panel test guidelines"]
};
