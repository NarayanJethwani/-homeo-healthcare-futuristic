import { KnowledgeEntity } from "../../types";

export const T4LabTest: KnowledgeEntity = {
  id: "L0011",
  slug: "t4",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Thyroxine (T4 / FT4)",
    hi: "थायरोक्सिन (T4 / FT4)",
    gu: "થાઇરોક્સિન (T4 / FT4)",
    mr: "थायरोक्सिन (T4 / FT4)",
    es: "Tiroxina (T4 Libre / Total)",
    ar: "الثيروكسين (T4)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, and thyroid status evaluation for Thyroxine (T4/FT4) under ATA 2017 standards.",
    hi: "T4 थायराइड लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "T4 ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "T4 चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y evaluación tiroidea de la tiroxina (T4).",
    ar: "التفسير السريري والنطاق المرجعي لهرمون T4."
  },
  content: {
    overview: "Thyroxine (T4): The primary prohormone synthesized and secreted by the thyroid gland follicular cells, circulating mostly bound to thyroxine-binding globulin (TBG). Free T4 (FT4) represents the metabolically active, unbound fraction (0.03%).",
    normalRange: "Free T4 (FT4): 0.8 - 1.8 ng/dL (10 - 23 pmol/L); Total T4: 4.5 - 11.2 mcg/dL (58 - 144 nmol/L).",
    highValues: [
      "Primary Hyperthyroidism (Graves' Disease, Toxic Nodular Goiter)",
      "Subacute Granulomatous (de Quervain's) Thyroiditis (Release Phase)",
      "Exogenous Levothyroxine Overdose or Pituitary TSH-Secreting Adenoma"
    ],
    lowValues: [
      "Primary Hypothyroidism (Hashimoto's Thyroiditis, Post-Ablation)",
      "Secondary / Central Hypothyroidism (Pituitary or Hypothalamic Failure)",
      "Severe Myxedema Coma (Profound Low FT4 with Hypothermia and Altered Sensorium)"
    ],
    clinicalInterpretation: "Free T4 (FT4) combined with TSH is the primary diagnostic pair for thyroid disease; low FT4 with elevated TSH confirms primary hypothyroidism, while low FT4 with low/normal TSH indicates central hypothyroidism requiring pituitary imaging.",
    references: [
      "CIT-0068",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0011-001",
        passage: "Free T4 (FT4) assay is the gold-standard measure for assessing peripheral thyroid hormone availability, avoiding TBG binding artifacts.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0011-002",
        passage: "Low FT4 combined with elevated serum TSH (>10 mIU/L) establishes primary overt hypothyroidism warranting Levothyroxine replacement.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0011-003",
        passage: "Profoundly low FT4 accompanied by hypothermia, hyponatremia, and altered mental status represents Myxedema Coma, a medical emergency requiring IV Levothyroxine and hydrocortisone.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0011-004",
        passage: "Homeopathic supportive care does not substitute for Levothyroxine hormone replacement in severe primary hypothyroidism or Myxedema Coma.",
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
  tags: ["T4", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/t4",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of T4 test guidelines"]
};
