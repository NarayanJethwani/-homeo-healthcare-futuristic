import { KnowledgeEntity } from "../../types";

export const ThyroidProfileLabTest: KnowledgeEntity = {
  id: "L0022",
  slug: "thyroid-profile",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Thyroid Profile",
    hi: "Thyroid Profile",
    gu: "Thyroid Profile",
    mr: "Thyroid Profile",
    es: "Thyroid Profile",
    ar: "Thyroid Profile"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Thyroid Profile lab results.",
    hi: "Thyroid Profile प्रयोगशाला परीक्षण विवरण.",
    gu: "Thyroid Profile લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Thyroid Profile लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Thyroid Profile.",
    ar: "الغرض السريري وتفسير نتائج اختبار Thyroid Profile."
  },
  content: {
  "overview": "THYROID PROFILE: A specialized laboratory marker or endocrine hormone measurement used to evaluate thyroid gland function, metabolic control, and autoimmune thyroid activity.",
  "normalRange": "TSH: 0.45 - 4.5 uIU/mL; Free T4: 0.8 - 1.8 ng/dL; Free T3: 2.3 - 4.2 pg/mL; Anti-TPO: < 9.0 IU/mL.",
  "highValues": [
    "Primary hypothyroidism (elevated TSH)",
    "Thyrotoxicosis or Graves' disease (elevated Free T4/T3)",
    "Active autoimmune thyroiditis (elevated Anti-TPO / Anti-Tg)"
  ],
  "lowValues": [
    "Hyperthyroidism or secondary hypothyroidism (low TSH)",
    "Overt hypothyroidism (low Free T4/T3)",
    "Non-thyroidal illness syndrome"
  ],
  "clinicalInterpretation": "THYROID PROFILE evaluation: Elevated TSH with low Free T4 indicates primary hypothyroidism. Conversely, low TSH with high Free T4/T3 confirms hyperthyroidism. Elevated Anti-TPO indicates autoimmune thyroid disease.",
  "references": [
    "CIT-0012",
    "CIT-0013",
    "CIT-0014"
  ],
  "faqs": [
    {
      "question": "What causes autoimmune thyroid flares?",
      "answer": "Thyroid autoantibody flares are typically triggered by systemic immune dysregulation, chronic physical or emotional stress, high iodine intake, or underlying genetic susceptibility."
    },
    {
      "question": "Can thyroid status affect weight and energy levels?",
      "answer": "Yes. Thyroid hormones regulate the body's metabolic rate. Hypothyroidism slows metabolism leading to weight gain and fatigue, while hyperthyroidism accelerates it."
    },
    {
      "question": "What is the role of homeopathy in thyroid health?",
      "answer": "Homeopathic care utilizes constitutional remedies to optimize the body's self-regulatory mechanisms and support endocrine balance, always evaluated in conjunction with standard lab monitoring."
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
  tags: ["Thyroid Profile", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/thyroid-profile",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Thyroid Profile test guidelines"]
};
