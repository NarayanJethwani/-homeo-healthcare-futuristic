import { KnowledgeEntity } from "../../types";

export const AntiTPOAntibodiesLabTest: KnowledgeEntity = {
  id: "L0039",
  slug: "anti-tpo-antibodies",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Anti-TPO Antibodies",
    hi: "Anti-TPO Antibodies",
    gu: "Anti-TPO Antibodies",
    mr: "Anti-TPO Antibodies",
    es: "Anti-TPO Antibodies",
    ar: "Anti-TPO Antibodies"
  },
  summary: {
    en: "Clinical purpose, normal range, and interpretation of Anti-TPO Antibodies lab results.",
    hi: "Anti-TPO Antibodies प्रयोगशाला परीक्षण विवरण.",
    gu: "Anti-TPO Antibodies લેબોરેટરી ટેસ્ટ પરિચય.",
    mr: "Anti-TPO Antibodies लॅब टेस्ट माहिती.",
    es: "Propósito e interpretación de la prueba de laboratorio Anti-TPO Antibodies.",
    ar: "الغرض السريري وتفسير نتائج اختبار Anti-TPO Antibodies."
  },
  content: {
  "overview": "ANTI TPO ANTIBODIES: A specialized laboratory marker or endocrine hormone measurement used to evaluate thyroid gland function, metabolic control, and autoimmune thyroid activity.",
  "normalRange": "Varies by laboratory. Typically defined within reference intervals.",
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
  "clinicalInterpretation": "ANTI TPO ANTIBODIES evaluation: Elevated TSH with low Free T4 indicates primary hypothyroidism. Conversely, low TSH with high Free T4/T3 confirms hyperthyroidism. Elevated Anti-TPO indicates autoimmune thyroid disease.",
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
  tags: ["Anti-TPO Antibodies", "Lab-Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/anti-tpo-antibodies",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Anti-TPO Antibodies test guidelines"],
  clinicalPearl: "Positive Anti-TPO with normal TSH may precede clinical thyroid dysfunction by years. Close observation is highly indicated.",
  quickFacts: {
    "Specimen Type": "Venous Blood (Serum)",
    "Preparation": "Fasting optional; no special diet required",
    "Turnaround Time": "24–48 Hours",
    "Clinical Category": "Thyroid Autoimmunity"
  },
  aiReadiness: {
    retrievalSummary: "Anti-Thyroid Peroxidase (Anti-TPO) antibodies are immunoglobulins targeting the thyroid peroxidase enzyme, serving as the primary diagnostic hallmark for autoimmune thyroiditis (Hashimoto's disease and Graves' disease).",
    clinicalSummary: "Anti-TPO autoantibodies bind to and inhibit thyroid peroxidase, disrupting iodination of tyrosine residues on thyroglobulin. Titers correlate with lymphocytic infiltration of the thyroid gland.",
    patientSummary: "This test measures antibodies that mistakenly target your thyroid gland, helping identify if thyroid issues are caused by an autoimmune condition.",
    studentSummary: "Clinical significance lies in diagnosing Hashimoto's thyroiditis (detected in >90% of cases) and Graves' disease (detected in 60-80% of cases). High titers predict progression from subclinical to overt hypothyroidism.",
    keywords: ["anti-tpo", "thyroid peroxidase antibodies", "hashimoto", "graves disease", "autoimmune thyroiditis"],
    semanticKeywords: ["thyroid autoantibodies", "anti-microsomal antibodies", "thyroid immune attack"],
    icd: "E06.3",
    mesh: "D013938",
    bodySystem: "Endocrine",
    urgency: "routine"
  },
  visualBodySystem: {
    system: "Endocrine",
    organs: ["Thyroid Gland", "Immune System"],
    hormones: ["TSH", "Free T4"],
    parameters: ["Anti-TPO"]
  },
  structuredEvidence: {
    system: "Endocrine",
    prevalence: "10–12% of healthy adults",
    typicalAge: "20–60 years",
    causes: [
      "Autoimmune thyroiditis (Hashimoto's)",
      "Graves' disease",
      "Other systemic autoimmune disorders"
    ],
    investigations: ["TSH", "Free T4", "Thyroglobulin Antibodies"],
    urgency: "routine"
  },
  interpretationAlgorithm: {
    title: "Anti-TPO Clinical Evaluation Flowchart",
    steps: [
      {
        label: "Measure serum Anti-TPO antibody titers",
        type: "action"
      },
      {
        label: "Are Anti-TPO titers elevated (> 9.0 IU/mL)?",
        type: "question",
        options: [
          { value: "Yes", nextStepLabel: "Autoimmune Etiology Confirmed" },
          { value: "No", nextStepLabel: "Evaluate for Non-Autoimmune Causes" }
        ]
      },
      {
        label: "Evaluate TSH and Free T4 levels to determine thyroid functional status",
        type: "action"
      },
      {
        label: "Is TSH elevated with normal or low Free T4?",
        type: "question",
        options: [
          { value: "Yes", nextStepLabel: "Hashimoto's Thyroiditis / Thyroid Failure" },
          { value: "No", nextStepLabel: "Check for Graves' (if low TSH)" }
        ]
      },
      {
        label: "Plan periodic monitoring (e.g. 6-12 months TSH check) if subclinical",
        type: "consideration"
      }
    ]
  },
  aiKnowledge: {
    retrievalSummary: "Clinical review of Anti-Thyroid Peroxidase (Anti-TPO) antibodies, autoimmune thyroiditis diagnostic utilities, TSH-FT4 cross-evaluation pathways.",
    differentialSummary: "Differentiate autoimmune thyroiditis (elevated Anti-TPO) from non-autoimmune subclinical hypothyroidism and secondary pituitary thyroid failures.",
    practitionerSummary: "Practitioner analysis of Anti-TPO antibody dynamics. Details active lymphocytic infiltration correlation, risk of subclinical-to-overt conversion (5% per year), and constitutional remedy support protocols.",
    patientSummary: "Patient guide to Anti-TPO tests. A high result means your immune system is targeting your thyroid gland, which is common in autoimmune thyroiditis.",
    educationalSummary: "Study guide detailing thyroid peroxidase function in iodination, HLA-DR associations, and clinical diagnostic titers for Hashimoto's.",
    graphContext: "Laboratory antibody node. Connects to Hypothyroidism (D0011), TSH (L0002), and remedies Sepia (R0024) and Calcarea Carbonica (R0005).",
    embeddingText: "anti-tpo thyroid peroxidase antibodies autoantibody hashimoto graves autoimmune thyroiditis hypothyroid endocrine"
  },
  knowledgeEmbedding: {
    overview: "Anti-Thyroid Peroxidase (Anti-TPO) antibodies are autoantibodies directed against the thyroid peroxidase enzyme, serving as a primary marker for autoimmune thyroid disease.",
    pathology: "TPO is responsible for iodinating tyrosine residues on thyroglobulin. Autoantibodies lead to complement-mediated follicular cell destruction.",
    diagnosis: "Crucial for diagnosing Hashimoto's thyroiditis and Graves' disease, and predicting progression from subclinical to overt hypothyroidism.",
    investigations: "Antibody titers are ordered alongside TSH and Free T4 to differentiate autoimmune from non-autoimmune thyroid states.",
    differentialDiagnosis: "Helps differentiate Hashimoto's thyroiditis from de Quervain's thyroiditis, drug-induced thyroiditis, or non-toxic goiters.",
    managementOverview: "Titers indicate autoimmune activity; standard medical monitoring checks thyroid function periodically rather than treating antibodies directly.",
    homeopathicPerspective: "Reflects chronic immunological dysregulation linked to the sycotic miasm, indicating need for deep anti-sycotic constitutional remedies.",
    complications: "High titers represent increased risk of permanent hypothyroidism, goiter formation, and obstetric/pregnancy complications.",
    prognosis: "Indicates persistent autoimmune risk; while antibody levels rarely normalize completely, reduction corresponds with stabilized cellular immunity.",
    patientEducation: "Reassures patients that high titers indicate susceptibility and emphasizes lifestyle optimization over panic.",
    graphContext: "Autoimmune antibody marker. Deeply connected to Hashimoto's disease and endocrine system remedies.",
    semanticKeywords: ["anti-tpo", "thyroid peroxidase autoantibodies", "hashimoto autoimmune", "thyroiditis"],
    embeddingText: "anti-tpo thyroid peroxidase autoantibodies antibody titers hashimoto autoimmune thyroiditis hypothyroid"
  },
  qualityScore: {
    editorialQuality: 5,
    clinicalDepth: 94,
    graphConnectivity: 95,
    citationQuality: 92,
    educationalValue: 95,
    aiReadiness: 100,
    seoReadiness: 97
  }
};

