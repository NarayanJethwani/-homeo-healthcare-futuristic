import { KnowledgeEntity } from "../../types";

export const FT3LabTest: KnowledgeEntity = {
  id: "L0035",
  slug: "ft3",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Free Triiodothyronine (Free T3 / FT3)",
    hi: "फ्री ट्राइआयोडोथायरोनिन (Free T3 / FT3)",
    gu: "ફ્રી ટ્રાયઆયોડોથાયરોનિન (Free T3 / FT3)",
    mr: "फ्री ट्रायआयोडोथायरॉइन (Free T3 / FT3)",
    es: "Triyodotironina Libre (T3 Libre / FT3)",
    ar: "ثلاثي يود الثيرونين الحر (Free T3)"
  },
  summary: {
    en: "Clinical interpretation, ATA 2026 guidelines, T3 thyrotoxicosis, euthyroid sick syndrome, and metabolic rate assessment for Free T3 (FT3).",
    hi: "फ्री T3 (FT3) प्रयोगशाला परीक्षण की नैदानिक समझ और थायराइड कार्य मूल्यांकन.",
    gu: "ફ્રી T3 લેબોરેટરી ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "Free T3 लॅब टेस्टची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y evaluación de tirotoxicosis T3 según las guías ATA 2026.",
    ar: "التفسير السريري والنطاق المرجعي للثلاثي يود الثيرونين الحر."
  },
  content: {
    overview: "Free Triiodothyronine (Free T3 / FT3): Unbound, biologically active fraction of the metabolically potent thyroid hormone T3, representing ~0.3% of total circulating T3 generated primarily by peripheral 5'-deiodination of T4 in liver, kidney, and muscle tissues.",
    normalRange: "Adult Reference Interval: 2.3–4.2 pg/mL (3.5–6.5 pmol/L).",
    highValues: [
      "T3 Thyrotoxicosis (Suppressed TSH with elevated FT3 but normal FT4)",
      "Graves' Disease, Toxic Multinodular Goiter, Toxic Adenoma",
      "Exogenous T3 Therapy (Liothyronine), Peripheral Thyroid Hormone Resistance"
    ],
    lowValues: [
      "Euthyroid Sick Syndrome (Non-Thyroidal Illness Syndrome during severe systemic infection, trauma, or starvation)",
      "Primary or Secondary Hypothyroidism (though FT3 drops later than FT4)",
      "Severe Malnutrition, Fasting, Glucocorticoid or High-Dose Propranolol Administration"
    ],
    clinicalInterpretation: "Elevated FT3 with suppressed TSH (<0.01 mIU/L) confirms active hyperthyroidism/T3 toxicosis; low FT3 in critically ill ICU patients typically reflects non-thyroidal illness syndrome (euthyroid sick syndrome) rather than primary hypothyroidism.",
    references: [
      "CIT-0068",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0009-001",
        passage: "ATA 2026 guidelines recommend FT3 testing specifically when TSH is suppressed but FT4 is normal, to diagnose isolated T3 thyrotoxicosis.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0009-002",
        passage: "Low FT3 in acute severe systemic illness represents an adaptive downregulation of metabolic rate (Euthyroid Sick Syndrome) and does not require routine levothyroxine or T3 replacement.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0009-003",
        passage: "Free T3 measurement avoids protein-binding interference caused by thyroid-binding globulin (TBG) variations in pregnancy or estrogen therapy.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0009-004",
        passage: "Homeopathic supportive remedies (e.g., Iodum, Thyroidinum) do not replace antithyroid medications (Methimazole) in overt T3 thyrotoxicosis with tachyarrhythmias.",
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
  tags: ["FT3", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/ft3",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of FT3 test guidelines"]
};
