import { KnowledgeEntity } from "../../types";

export const UricAcidLabTest: KnowledgeEntity = {
  id: "L0019",
  slug: "uric-acid",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Uric Acid",
    hi: "Uric Acid",
    gu: "Uric Acid",
    mr: "Uric Acid",
    es: "Uric Acid",
    ar: "Uric Acid"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Uric Acid lab results.",
    hi: "Uric Acid प्रयोगशाला परीक्षण विवरण.",
    gu: "Uric Acid લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Uric Acid लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Uric Acid.",
    ar: "الغرض السريري وتفسير نتائج اختبار Uric Acid."
  },
  content: {
  "overview": "URIC ACID: A diagnostic test, stool marker, or breath analysis designed to evaluate gastrointestinal inflammation, digestive enzyme activity, or bacterial colonization.",
  "normalRange": "H. pylori: Negative; Stool Occult Blood: Negative; Calprotectin: < 50 ug/g.",
  "highValues": [
    "Active H. pylori infection",
    "Intestinal inflammation indicating IBD (high calprotectin)",
    "Gastrointestinal bleeding (positive occult blood)"
  ],
  "lowValues": [
    "Decreased pancreatic enzyme output",
    "Hypochlorhydria (low gastric acid output)"
  ],
  "clinicalInterpretation": "URIC ACID evaluation: Positive H. pylori requires eradication considerations. High calprotectin indicates active bowel inflammation needing endoscopy, while occult blood requires investigation to locate bleeding sources.",
  "references": [
    "CIT-0017",
    "CIT-0018",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "What are the common triggers for digestive flares?",
      "answer": "Common triggers include dietary irritants (caffeine, alcohol, fatty foods), chronic emotional stress, irregular eating habits, and dysbiosis."
    },
    {
      "question": "How does the gut-brain axis affect digestive health?",
      "answer": "The gut and brain are in constant communication via the vagus nerve. Emotional stress can alter gut motility, increase visceral sensitivity, and worsen symptoms of GERD, gastritis, or IBS."
    },
    {
      "question": "Can homeopathy manage chronic acid reflux (GERD)?",
      "answer": "Yes, individualized homeopathy can help manage symptoms of chronic acid reflux by addressing digestive motility and hyperacidity alongside lifestyle modifications."
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
  tags: ["Uric Acid", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/uric-acid",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Uric Acid test guidelines"]
};
