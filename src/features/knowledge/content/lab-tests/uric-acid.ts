import { KnowledgeEntity } from "../../types";

export const UricAcidLabTest: KnowledgeEntity = {
  id: "L0019",
  slug: "uric-acid",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Serum Uric Acid",
    hi: "सीरम यूरिक एसिड (Serum Uric Acid)",
    gu: "સીરમ યુરિક એસિડ (Serum Uric Acid)",
    mr: "सिरम युरिक ऍसिड (Serum Uric Acid)",
    es: "Ácido Úrico Sérico (Serum Uric Acid)",
    ar: "حمض اليوريك في الدم (Serum Uric Acid)"
  },
  summary: {
    en: "Clinical interpretation, reference ranges, gout management targets, and tumor lysis risk evaluation for Serum Uric Acid under ACR 2020 standards.",
    hi: "सीरम यूरिक एसिड लैब टेस्ट की नैदानिक समझ और संदर्भ सीमाएँ.",
    gu: "સીરમ યુરિક એસિડ ટેસ્ટની સમજણ અને રેફરન્સ રેન્જ.",
    mr: "सिरम युरिक ऍसिड चाचणीची माहिती आणि संदर्भ मर्यादा.",
    es: "Interpretación clínica y metas de uricemia según ACR 2020.",
    ar: "التفسير السريري والنطاق المرجعي لحمض اليوريك."
  },
  content: {
    overview: "Serum Uric Acid: The heterocyclic end-product of purine nucleoside catabolism in humans, formed via xanthine oxidase activity and excreted primarily by the kidneys (70%) and intestinal tract (30%).",
    normalRange: "Adult Males: 3.5 - 7.2 mg/dL (208 - 428 umol/L); Adult Females: 2.6 - 6.0 mg/dL (155 - 357 umol/L); Target for Gout Management: <6.0 mg/dL (<360 umol/L).",
    highValues: [
      "Hyperuricemia: Acute Gouty Arthritis or Tophaceous Gout",
      "Renal Urate Calculi (Nephrolithiasis) or Urate Nephropathy",
      "Tumor Lysis Syndrome (Massive purine breakdown post-chemotherapy)",
      "Metabolic Syndrome, Chronic Kidney Disease, or Diuretic Use (Thiazides)"
    ],
    lowValues: [
      "Fanconi Syndrome or Renal Tubular Urate Wasting",
      "Xanthine Oxidase Inhibitor Therapy (Allopurinol / Febuxostat Overdose)",
      "Severe Liver Disease or Hereditary Xanthinuria"
    ],
    clinicalInterpretation: "Hyperuricemia (>6.8 mg/dL exceeds physiological monosodium urate solubility limit), predisposing to articular urate crystal deposition; in patients with gout, ACR 2020 guidelines mandate treat-to-target urate lowering to <6.0 mg/dL.",
    references: [
      "CIT-0071",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-L0019-001",
        passage: "Serum Uric Acid concentrations above 6.8 mg/dL exceed monosodium urate saturation, promoting intra-articular and tissue crystal deposition.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0019-002",
        passage: "ACR 2020 guidelines recommend treat-to-target urate-lowering therapy aiming for Serum Uric Acid below 6.0 mg/dL for all gout patients.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0019-003",
        passage: "Massive hyperuricemia (>10 mg/dL) following chemotherapy indicates Acute Tumor Lysis Syndrome demanding emergency Rasburicase or IV hydration.",
        citationIds: ["CIT-0071"]
      },
      {
        claimId: "CLM-L0019-004",
        passage: "Homeopathic dietary advice does not replace xanthine oxidase inhibitor therapy or emergency Rasburicase in severe hyperuricemic tumor lysis.",
        citationIds: ["CIT-0023"]
      }
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
