import { KnowledgeEntity } from "../../types";

export const FT4LabTest: KnowledgeEntity = {
  id: "L0036",
  slug: "ft4",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Free Thyroxine (Free T4 / FT4)",
    hi: "फ्री थायरोक्सिन (Free T4 / FT4)",
    gu: "ફ્રી થાઇરોક્સિન (Free T4 / FT4)",
    mr: "फ्री थायरॉक्सिन (Free T4 / FT4)",
    es: "Tiroxina Libre (T4 Libre / FT4)",
    ar: "الثيروكسين الحر (Free T4)"
  },
  summary: {
    en: "Clinical interpretation, ATA 2026 guidelines, thyroid axis function, primary hypothyroidism/hyperthyroidism, and levothyroxine monitoring for Free T4 (FT4).",
    hi: "फ्री T4 (FT4) प्रयोगशाला परीक्षण की नैदानिक समझ और थायराइड कार्य मूल्यांकन.",
    gu: "ફ્રી T4 લેબોરેટરી ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "Free T4 लॅબ टेस्टची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y evaluación del eje tiroideo según las guías ATA 2026.",
    ar: "التفسير السريري والنطاق المرجعي للثيروكسين الحر."
  },
  content: {
    overview: "Free Thyroxine (Free T4 / FT4): Unbound, non-protein-attached fraction of thyroxine circulating in blood (~0.03% of total T4), representing the primary secretory product of the thyroid gland available for cellular uptake and conversion to active T3.",
    normalRange: "Adult Reference Interval: 0.8–1.8 ng/dL (10.3–23.2 pmol/L); First Trimester Pregnancy: 0.9–1.5 ng/dL.",
    highValues: [
      "Overt Primary Hyperthyroidism (Graves' Disease, Toxic Nodular Goiter, Subacute Thyroiditis)",
      "Exogenous Levothyroxine Overreplacement (Thyrotoxicosis Factitia)",
      "Central Hyperthyroidism (TSH-secreting pituitary adenoma), Resistance to Thyroid Hormone (RTH)"
    ],
    lowValues: [
      "Overt Primary Hypothyroidism (Hashimoto's Thyroiditis, Post-Surgical / Post-Iodine-131 Ablation)",
      "Secondary / Central Hypothyroidism (Pituitary or Hypothalamic Failure with low or inappropriately normal TSH)",
      "Inadequate Levothyroxine Replacement Therapy"
    ],
    clinicalInterpretation: "Elevated FT4 with suppressed TSH (<0.1 mIU/L) confirms overt hyperthyroidism; low FT4 with elevated TSH (>10 mIU/L) confirms overt primary hypothyroidism requiring levothyroxine replacement.",
    references: [
      "CIT-0068",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0009-005",
        passage: "ATA 2026 guidelines recommend reflex FT4 measurement following an abnormal serum TSH screen to distinguish overt from subclinical thyroid disease.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0009-006",
        passage: "Low FT4 combined with low or inappropriately normal TSH indicates central (secondary/tertiary) hypothyroidism due to pituitary or hypothalamic disease.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0009-007",
        passage: "Free T4 measurements provide accurate thyroid hormone status independent of altered thyroxine-binding globulin (TBG) concentrations in pregnancy, estrogen therapy, or hepatic disease.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0009-008",
        passage: "Homeopathic supportive care (e.g., Calcarea Carb, Thyroidinum) does not replace levothyroxine replacement in overt primary hypothyroidism with subnormal FT4.",
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
  tags: ["FT4", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/ft4",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of FT4 test guidelines"]
};
