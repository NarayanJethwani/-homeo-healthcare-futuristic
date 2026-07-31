import { KnowledgeEntity } from "../../types";

export const T3LabTest: KnowledgeEntity = {
  id: "L0010",
  slug: "t3",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Triiodothyronine (T3 / FT3)",
    hi: "ट्राइआयडोथायरोनिन (T3 / FT3)",
    gu: "ટ્રાયઆયોડોથાયરોનાઇન (T3 / FT3)",
    mr: "ट्रायआयडोथायरोनिन (T3 / FT3)",
    es: "Triyodotironina (T3 Libre / Total)",
    ar: "ثلاثي يود الثيرونين (T3)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, and thyroid status evaluation for Triiodothyronine (T3/FT3) under ATA 2017 standards.",
    hi: "T3 थायराइड लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "T3 ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "T3 चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y evaluación tiroidea de la triyodotironina (T3).",
    ar: "التفسير السريري والنطاق المرجعي لهرمون T3."
  },
  content: {
    overview: "Triiodothyronine (T3): The active metabolic thyroid hormone produced predominantly via 5'-deiodination of Thyroxine (T4) in peripheral tissues (80%) and direct thyroid follicular secretion (20%). Free T3 (FT3) measures the metabolically active unbound fraction.",
    normalRange: "Free T3 (FT3): 2.0 - 4.4 pg/mL (3.1 - 6.8 pmol/L); Total T3: 80 - 200 ng/dL (1.2 - 3.1 nmol/L).",
    highValues: [
      "Hyperthyroidism (Graves' Disease, Toxic Multinodular Goiter)",
      "T3 Toxicosis (Elevated T3 with Suppressed TSH and Normal T4)",
      "Thyroid Hormone Resistance or Exogenous Liothyronine Administration"
    ],
    lowValues: [
      "Euthyroid Sick Syndrome (Non-Thyroidal Illness Syndrome / Low T3 Syndrome)",
      "Hypothyroidism (Primary or Secondary)",
      "Severe Malnutrition, Starvation, or Systemic Catabolic State"
    ],
    clinicalInterpretation: "Elevated FT3 with suppressed TSH indicates hyperthyroidism or T3 toxicosis; in severe systemic non-thyroidal illness, low FT3 reflects impaired peripheral T4-to-T3 5'-deiodination (Euthyroid Sick Syndrome) rather than primary thyroid failure.",
    references: [
      "CIT-0068",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0010-001",
        passage: "Elevated serum Free T3 accompanied by suppressed TSH (<0.01 mIU/L) confirms thyrotoxicosis or autonomous T3 toxicosis.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0010-002",
        passage: "In critical illness or intensive care admission, isolated low T3 with normal T4 and normal/low TSH represents non-thyroidal illness syndrome.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0010-003",
        passage: "Free T3 measurement is superior to Total T3 because it is unaffected by thyroid-binding globulin (TBG) variations.",
        citationIds: ["CIT-0068"]
      },
      {
        claimId: "CLM-L0010-004",
        passage: "Homeopathic constitutional care does not replace antithyroid drug therapy, beta-blockers, or endocrinology care in thyrotoxic crisis.",
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
  tags: ["T3", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/t3",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of T3 test guidelines"]
};
