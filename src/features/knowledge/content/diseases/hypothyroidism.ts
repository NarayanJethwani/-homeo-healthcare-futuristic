import { KnowledgeEntity } from "../../types";

export const HypothyroidismDisease: KnowledgeEntity = {
  id: "D0011",
  slug: "hypothyroidism",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Hypothyroidism",
    hi: "Hypothyroidism",
    gu: "Hypothyroidism",
    mr: "Hypothyroidism",
    es: "Hypothyroidism",
    ar: "Hypothyroidism"
  },
  summary: {
    en: "A comprehensive clinical overview of Hypothyroidism, covering causes, clinical symptoms, and homeopathic management principles.",
    hi: "Hypothyroidism का नैदानिक विवरण.",
    gu: "Hypothyroidism નો તબીબી પરિચય.",
    mr: "Hypothyroidism चे आजार आणि माहिती.",
    es: "Un resumen clínico completo de Hypothyroidism.",
    ar: "نظرة عامة سريرية شاملة لـ Hypothyroidism."
  },
  content: {
  "overview": "Hypothyroidism: Thyroid function and autoimmune thyroiditis represent a primary class of endocrine disorders affecting systemic metabolic rate, energy production, and temperature regulation. Evaluation relies on serum hormone measurements and antibody detection.",
  "definition": "A physiological state or pathology characterized by autoantibody-mediated destruction of thyroid follicles (Hashimoto's) or over-activation of TSH receptors (Graves'), leading to hypo- or hyper-thyroidism.",
  "causes": [
    "Autoimmune systemic dysregulation and lymphocytic infiltration",
    "Genetic susceptibility linked to HLA-DR antigens",
    "Environmental triggers such as chronic stress and excessive iodine intake"
  ],
  "riskFactors": [
    "Family history of autoimmune thyroid disease",
    "Female gender (significantly higher prevalence)",
    "Co-existing autoimmune conditions like type 1 diabetes or celiac disease"
  ],
  "symptoms": [
    "Persistent physical fatigue and cognitive brain fog",
    "Unexplained weight changes and altered appetite",
    "Dryness of skin, brittle hair, and temperature intolerance",
    "Altered heart rate and muscle weakness"
  ],
  "diagnosis": "Diagnosed by measuring serum Thyroid Stimulating Hormone (TSH), Free T3, Free T4, and testing for thyroid autoantibodies (Anti-TPO, Anti-Tg).",
  "differentialDiagnosis": "Must be differentiated from non-thyroidal illness syndrome, primary pituitary dysfunction, and generalized chronic fatigue syndrome.",
  "conventionalManagement": "Standard therapy involves hormone replacement (levothyroxine) for hypothyroidism, or anti-thyroid medications (methimazole), radioactive iodine, or thyroidectomy for hyperthyroidism.",
  "homeopathicApproach": "Constitutional homeopathic support focuses on reducing individual susceptibility, balancing autonomic reactivity, and stabilizing vital endocrine pathways.",
  "lifestyleAdvice": "Ensure adequate dietary selenium and zinc, avoid raw goitrogenic foods in large quantities, manage stress levels, and maintain consistent sleep hygiene.",
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
    specialty: "Clinical Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Hypothyroidism", "Disease", "Clinical-Overview"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hypothyroidism",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Hypothyroidism profile"],
  clinicalPearl: "Hypothyroidism can cause secondary hyperprolactinemia due to TRH cross-stimulation. Always screen thyroid status in cases of unexplained galactorrhea or oligomenorrhea.",
  quickFacts: {
    "Prevalence": "Est. 4-5% of adult population",
    "Primary System": "Endocrine / Thyroid gland",
    "Urgency Level": "Routine outpatient follow-up",
    "Evidence Grade": "Grade B (Traditional and Epidemiological logs)"
  },
  aiReadiness: {
    retrievalSummary: "Hypothyroidism is an endocrine disorder characterized by insufficient thyroid hormone production, resulting in generalized systemic slowing of metabolic processes and elevated TSH.",
    clinicalSummary: "Hypothyroidism manifests as decreased secretion of T4 and T3. Primary causes include autoimmune destruction (Hashimoto's thyroiditis) or thyroid ablation, leading to compensatory elevation of pituitary TSH.",
    patientSummary: "Hypothyroidism occurs when your thyroid gland doesn't make enough hormones, which can slow down your body's energy and cause fatigue, weight gain, and feeling cold.",
    studentSummary: "Key symptoms include bradycardia, diastolic hypertension, delayed deep tendon reflex relaxation, myxedema, and cold intolerance. Serum TSH is the primary diagnostic indicator.",
    keywords: ["hypothyroidism", "underactive thyroid", "low thyroid", "hashimoto", "tsh elevation"],
    semanticKeywords: ["thyroid failure", "metabolic slowing", "thyroid insufficiency"],
    icd: "E03.9",
    mesh: "D007037",
    bodySystem: "Endocrine",
    urgency: "routine"
  },
  visualBodySystem: {
    system: "Endocrine",
    organs: ["Thyroid Gland", "Pituitary Gland", "Immune System"],
    hormones: ["TSH", "Free T4", "Free T3"]
  },
  structuredEvidence: {
    system: "Endocrine",
    prevalence: "4–10% of adult population",
    typicalAge: "30–60 years",
    causes: [
      "Autoimmune thyroiditis (Hashimoto's)",
      "Iodine deficiency (systemic)",
      "Post-surgical / iatrogenic ablation"
    ],
    investigations: ["TSH (Serum)", "Free T4", "Anti-TPO Antibodies"],
    urgency: "routine"
  },
  structuredDifferentials: [
    {
      condition: "Hyperthyroidism",
      similarity: "Thyroid enlargement (goiter), neck pressure feeling.",
      differentiator: "Anxiety, weight loss, heat intolerance, hyperactive reflexes.",
      investigation: "TSH (suppressed), Free T4 (elevated)"
    },
    {
      condition: "Major Depression",
      similarity: "Cognitive slowing, fatigue, weight changes, depressed mood.",
      differentiator: "Normal thyroid reflexes, normal serum TSH, absence of goiter.",
      investigation: "Thyroid Stimulating Hormone (TSH) screen"
    },
    {
      condition: "Iron Deficiency Anemia",
      similarity: "Chronic physical fatigue, weakness, cold extremities.",
      differentiator: "Microcytic hypochromic red blood cells, low serum ferritin.",
      investigation: "Serum Ferritin, Complete Blood Count (CBC)"
    },
    {
      condition: "PCOS",
      similarity: "Weight gain, irregular menstrual cycles, fatigue.",
      differentiator: "Hyperandrogenism signs (hirsutism), multiple ovarian cysts.",
      investigation: "Pelvic Ultrasound, Free Testosterone"
    }
  ],
  homeopathicPerspective: {
    conventionalUnderstanding: "Inadequate secretion of thyroid hormones (T4, T3) causing generalized metabolic slowdown, treated with lifelong levothyroxine sodium replacement.",
    homeopathicInterpretation: "A systemic constitutional dysregulation, often connected to the psoric or tubercular miasm, representing a slowdown in the vital force's adaptive metabolic response.",
    constitutionalConsiderations: "Remedies such as Calcarea Carbonica, Lycopodium, and Sepia are selected based on the patient's individual thermal state, cravings, and mental picture rather than thyroid status alone.",
    individualization: "Evaluates whether the patient is chilly or warm-blooded, has specific food cravings (e.g. eggs, sweets), and their emotional state (e.g. lethargic vs hyper-irritable).",
    limitations: "Severe, overt hypothyroidism with myxedema coma or structural thyroid ablation (surgical removal) requires conventional hormone replacement. Homeopathy serves as complementary supportive care."
  },
  aiKnowledge: {
    retrievalSummary: "Detailed clinical reference on Hypothyroidism, detailing thyroid hormone dynamics, autoimmune Hashimoto etiology, diagnostic panels, and individualized constitutional homeopathic care models.",
    differentialSummary: "Differentiate Hypothyroidism from depression, iron deficiency anemia, chronic fatigue syndrome, and PCOS using TSH, ferritin, and pelvic ultrasound parameters.",
    practitionerSummary: "Practitioner analysis of primary hypothyroidism. Focuses on anti-TPO autoantibody tracking, subclinical TSH ranges (4.5-10 mIU/L), and constitutional miasmatic remedies.",
    patientSummary: "Patient guide to underactive thyroid. Understand symptoms like fatigue, weight gain, cold sensitivity, and how homeopathic support works alongside standard monitoring.",
    educationalSummary: "Study guide mapping endocrine feedback loop, pituitary thyroid axis (TRH-TSH-T4/T3), pathophysiology of Hashimoto's, and matching chronic remedy profiles.",
    graphContext: "Main endocrine node. Strongly linked to TSH (L0002), Free T4 (L0036), Anti-TPO (L0039), and remedies Lycopodium (R0003) and Calcarea Carbonica (R0005).",
    embeddingText: "hypothyroidism underactive thyroid hashimoto thyroiditis endocrine fatigue weight gain cold sensitivity myxedema anti-tpo tsh calcarea carbonica"
  },
  clinicalImportance: "Thyroid function represents a key regulator of cellular metabolic rate, cardiovascular performance, thermogenesis, and neurological functioning.",
  whyItMatters: "Undiagnosed or poorly managed hypothyroidism leads to significant clinical morbidity, including cognitive decline, lipid abnormalities, cardiac dysfunction, and in severe cases, life-threatening myxedema coma.",
  complications: [
    "Myxedema coma (severe life-threatening metabolic shutdown)",
    "Cardiovascular disease & hypercholesterolemia",
    "Peripheral neuropathy & paresthesias",
    "Infertility & gestational complications"
  ],
  knowledgeEmbedding: {
    overview: "Primary hypothyroidism is characterized by deficient thyroid gland secretion of T4 and T3, causing a systemic metabolic slowdown.",
    pathology: "Most commonly caused by Hashimoto's thyroiditis, an autoimmune process involving anti-TPO autoantibody-mediated destruction of thyroid follicles.",
    diagnosis: "Diagnosed by elevated serum TSH levels accompanied by low or low-normal Free T4 values.",
    investigations: "Serum TSH, Free T4, and anti-TPO antibodies are primary diagnostic markers.",
    differentialDiagnosis: "Must be differentiated from clinical depression, chronic fatigue syndrome, iron deficiency anemia, and PCOS.",
    managementOverview: "Conventional treatment involves oral levothyroxine hormone replacement. Homeopathic care focuses on constitutional susceptibility regulation.",
    homeopathicPerspective: "Endocrine disharmony linked to deep psoric or sycotic miasmatic blockages, requiring remedies matching individual thermals and modalities.",
    complications: "Includes severe hypercholesterolemia, diastolic hypertension, cognitive impairment, and myxedema crisis.",
    prognosis: "Favorable with timely hormone normalization and constitutional support, though autoantibody levels require periodic tracking.",
    patientEducation: "Focuses on medication compliance, iodine/selenium nutritional balance, and lifestyle adjustments for cold intolerance and fatigue.",
    graphContext: "Core endocrine node connecting TSH, Free T4, and autoantibodies to remedies Lycopodium and Calcarea Carbonica.",
    semanticKeywords: ["underactive thyroid", "hashimoto thyroiditis", "thyroid peroxidase", "myxedema", "levothyroxine"],
    embeddingText: "hypothyroidism underactive thyroid hashimoto endocrine metabolic fatigue weight gain cold sensitivity anti-tpo"
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

