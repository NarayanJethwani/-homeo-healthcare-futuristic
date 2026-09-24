import { KnowledgeEntity } from "../../types";

export const HypothyroidismDisease: KnowledgeEntity = {
  id: "D0011",
  slug: "hypothyroidism",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-09-24T12:00:00Z",
  },
  title: {
    en: "Hypothyroidism",
    hi: "हाइपोथायरायडिज्म (Hypothyroidism)",
    gu: "હાઇપોથાઇરોઇડિઝમ (Hypothyroidism)",
    mr: "हायपोथायरॉईडिझम (Hypothyroidism)",
    es: "Hipotireoidismo / Hipotiroidismo",
    ar: "قصور الغدة الدرقية",
  },
  summary: {
    en: "An underactive thyroid can slow many body functions. Learn the common symptoms, how blood tests confirm the cause, and why prescribed thyroid hormone needs regular follow-up.",
    hi: "हाइपोथायरायडिज्म का एटीए 2014 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "હાઇપોથાઇરોઇડિઝમનું ATA 2014 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "हायपोथायरॉईडिझमचे ATA 2014 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del Hipotiroidismo según las pautas ATA 2014 y límites de emergencia.",
    ar: "دليل سريري موثوق لقصور الغدة الدرقية وفقًا لمعايير ATA 2014 وحدود السلامة.",
  },
  content: {
    overview:
      "Hypothyroidism, often called an underactive thyroid, happens when the thyroid does not make enough hormone for the body’s needs. It can develop slowly and symptoms overlap with many other conditions, so blood tests—not symptoms alone—are needed to confirm it.",
    definition:
      "Thyroid hormones help regulate how the body uses energy. When levels are low, many body functions slow down. Hashimoto’s disease is a common cause, but previous thyroid treatment, some medicines and other causes are also possible.",
    causes: [
      "Hashimoto’s disease, in which the immune system attacks the thyroid",
      "Thyroid surgery, radioactive iodine or radiation treatment to the neck",
      "Some medicines, thyroid inflammation, or less commonly a pituitary problem",
    ],
    riskFactors: [
      "A personal or family history of thyroid or autoimmune disease",
      "Previous thyroid treatment, neck radiation or thyroid surgery",
      "Pregnancy, the postpartum period, or certain medicines—when monitoring may need adjusting",
    ],
    symptoms: [
      "Tiredness, feeling cold, weight change, constipation, dry skin or dry thinning hair",
      "Low mood, slower thinking, muscle or joint aches, or a slower heart rate",
      "Heavy or irregular periods, fertility concerns, or symptoms that develop gradually over months",
    ],
    diagnosis:
      "A clinician uses thyroid blood tests—usually TSH and free T4—to confirm hypothyroidism and guide treatment. Antibody tests can help identify Hashimoto’s disease. Your result needs interpretation in context, including pregnancy, illness and medicines.",
    differentialDiagnosis:
      "Differentiate from Major Depressive Disorder, Chronic Fatigue Syndrome, Iron Deficiency Anemia, Polycystic Ovary Syndrome (PCOS), and Non-Thyroidal Illness Syndrome (Euthyroid Sick Syndrome).",
    conventionalManagement:
      "Treatment commonly replaces the thyroid hormone the body is not making with prescribed levothyroxine. Blood tests are repeated after starting or changing the dose, and then at intervals agreed with the clinician.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a replacement for thyroid hormone treatment. It must not replace prescribed levothyroxine, blood-test monitoring or urgent medical care. Tell the clinician about all complementary products you use.",
    lifestyleAdvice:
      "Take thyroid medicine exactly as prescribed and ask your pharmacist or clinician about timing with food, supplements and other medicines. Avoid starting iodine or “thyroid support” supplements unless your clinician recommends them; excess iodine can be harmful for some people.",
    references: ["CIT-0012", "CIT-0013", "CIT-0014", "CIT-0041"],
    faqs: [
      {
        question: "When does hypothyroidism need urgent care?",
        answer:
          "Severe untreated hypothyroidism is rarely life-threatening, but confusion, extreme sleepiness, fainting, severe breathlessness, very low body temperature or an unusually slow heartbeat need emergency assessment. Contact your clinician promptly if symptoms are worsening or you are pregnant.",
      },
      {
        question: "Can I stop levothyroxine if I feel better?",
        answer:
          "No. Do not stop, skip or change the dose without medical advice and follow-up blood tests. Feeling better often means the prescribed dose is working.",
      },
      {
        question: "Can symptoms alone diagnose an underactive thyroid?",
        answer:
          "No. Tiredness, weight change and feeling cold have many possible causes. Thyroid blood tests are needed to confirm the diagnosis and guide safe treatment.",
      },
    ],
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Endocrinology & Thyroid Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-09-24",
  nextClinicalReview: "2027-09-24",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Hypothyroidism", "Disease", "ATA-2014", "Endocrinology", "Thyroid-TSH", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hypothyroidism",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Hypothyroidism profile",
    "1.1.0: Upgraded with ATA 2014 guideline citations (CIT-0041), passage-level claim citations (D0011-KEYNOTES, D0011-EMERGENCY-LIMITS, D0011-REGULATORY-LIMITS), myxedema coma red flags, and levothyroxine non-discontinuation safety rules",
    "1.2.0: Patient-first rewrite with clearer diagnosis, medicine and supplement boundaries",
  ],
  clinicalPearl:
    "Hypothyroidism can cause secondary hyperprolactinemia due to TRH cross-stimulation. Always screen thyroid status in cases of unexplained galactorrhea or oligomenorrhea.",
  quickFacts: {
    Prevalence: "Est. 4-5% of adult population",
    PrimarySystem: "Endocrine / Thyroid gland",
    UrgencyLevel: "Routine outpatient follow-up",
    EvidenceGrade: "Grade A (ATA 2014 Guidelines)",
  },
  aiReadiness: {
    retrievalSummary:
      "Hypothyroidism is an endocrine disorder characterized by insufficient thyroid hormone production, resulting in generalized systemic slowing of metabolic processes and elevated TSH.",
    clinicalSummary:
      "Hypothyroidism manifests as decreased secretion of T4 and T3. Primary causes include autoimmune destruction (Hashimoto's thyroiditis) or thyroid ablation, leading to compensatory elevation of pituitary TSH.",
    patientSummary:
      "Hypothyroidism occurs when your thyroid gland doesn't make enough hormones, which can slow down your body's energy and cause fatigue, weight gain, and feeling cold.",
    studentSummary:
      "Key symptoms include bradycardia, diastolic hypertension, delayed deep tendon reflex relaxation, myxedema, and cold intolerance. Serum TSH is the primary diagnostic indicator.",
    keywords: ["hypothyroidism", "underactive thyroid", "low thyroid", "hashimoto", "tsh elevation"],
    semanticKeywords: ["thyroid failure", "metabolic slowing", "thyroid insufficiency"],
    icd: "E03.9",
    mesh: "D007037",
    bodySystem: "Endocrine",
    urgency: "routine",
  },
  visualBodySystem: {
    system: "Endocrine",
    organs: ["Thyroid Gland", "Pituitary Gland", "Immune System"],
    hormones: ["TSH", "Free T4", "Free T3"],
  },
  structuredEvidence: {
    system: "Endocrine",
    prevalence: "4–10% of adult population",
    typicalAge: "30–60 years",
    causes: [
      "Autoimmune thyroiditis (Hashimoto's)",
      "Iodine deficiency (systemic)",
      "Post-surgical / iatrogenic ablation",
    ],
    investigations: ["TSH (Serum)", "Free T4", "Anti-TPO Antibodies"],
    urgency: "routine",
  },
  structuredDifferentials: [
    {
      condition: "Hyperthyroidism",
      similarity: "Thyroid enlargement (goiter), neck pressure feeling.",
      differentiator: "Anxiety, weight loss, heat intolerance, hyperactive reflexes.",
      investigation: "TSH (suppressed), Free T4 (elevated)",
    },
    {
      condition: "Major Depression",
      similarity: "Cognitive slowing, fatigue, weight changes, depressed mood.",
      differentiator: "Normal thyroid reflexes, normal serum TSH, absence of goiter.",
      investigation: "Thyroid Stimulating Hormone (TSH) screen",
    },
    {
      condition: "Iron Deficiency Anemia",
      similarity: "Chronic physical fatigue, weakness, cold extremities.",
      differentiator: "Microcytic hypochromic red blood cells, low serum ferritin.",
      investigation: "Serum Ferritin, Complete Blood Count (CBC)",
    },
    {
      condition: "PCOS",
      similarity: "Weight gain, irregular menstrual cycles, fatigue.",
      differentiator: "Hyperandrogenism signs (hirsutism), multiple ovarian cysts.",
      investigation: "Pelvic Ultrasound, Free Testosterone",
    },
  ],
  homeopathicPerspective: {
    conventionalUnderstanding:
      "Inadequate secretion of thyroid hormones (T4, T3) causing generalized metabolic slowdown, treated with lifelong levothyroxine sodium replacement.",
    homeopathicInterpretation:
      "A systemic constitutional dysregulation, often connected to the psoric or tubercular miasm, representing a slowdown in the vital force's adaptive metabolic response.",
    constitutionalConsiderations:
      "Remedies such as Calcarea Carbonica, Lycopodium, and Sepia are selected based on the patient's individual thermal state, cravings, and mental picture rather than thyroid status alone.",
    individualization:
      "Evaluates whether the patient is chilly or warm-blooded, has specific food cravings (e.g. eggs, sweets), and their emotional state (e.g. lethargic vs hyper-irritable).",
    limitations:
      "Severe, overt hypothyroidism with myxedema coma or structural thyroid ablation (surgical removal) requires conventional hormone replacement. Homeopathy serves as complementary supportive care.",
  },
  aiKnowledge: {
    retrievalSummary:
      "Detailed clinical reference on Hypothyroidism, detailing thyroid hormone dynamics, autoimmune Hashimoto etiology, diagnostic panels, and individualized constitutional homeopathic care models.",
    differentialSummary:
      "Differentiate Hypothyroidism from depression, iron deficiency anemia, chronic fatigue syndrome, and PCOS using TSH, ferritin, and pelvic ultrasound parameters.",
    practitionerSummary:
      "Practitioner analysis of primary hypothyroidism. Focuses on anti-TPO autoantibody tracking, subclinical TSH ranges (4.5-10 mIU/L), and constitutional miasmatic remedies.",
    patientSummary:
      "Patient guide to underactive thyroid. Understand symptoms like fatigue, weight gain, cold sensitivity, and how homeopathic support works alongside standard monitoring.",
    educationalSummary:
      "Study guide mapping endocrine feedback loop, pituitary thyroid axis (TRH-TSH-T4/T3), pathophysiology of Hashimoto's, and matching chronic remedy profiles.",
    graphContext:
      "Main endocrine node. Strongly linked to TSH (L0002), Free T4 (L0036), Anti-TPO (L0039), and remedies Lycopodium (R0003) and Calcarea Carbonica (R0005).",
    embeddingText:
      "hypothyroidism underactive thyroid hashimoto thyroiditis endocrine fatigue weight gain cold sensitivity myxedema anti-tpo tsh calcarea carbonica",
  },
  clinicalImportance:
    "Thyroid function represents a key regulator of cellular metabolic rate, cardiovascular performance, thermogenesis, and neurological functioning.",
  whyItMatters:
    "Undiagnosed or poorly managed hypothyroidism leads to significant clinical morbidity, including cognitive decline, lipid abnormalities, cardiac dysfunction, and in severe cases, life-threatening myxedema coma.",
  complications: [
    "Myxedema coma (severe life-threatening metabolic shutdown)",
    "Cardiovascular disease & hypercholesterolemia",
    "Peripheral neuropathy & paresthesias",
    "Infertility & gestational complications",
  ],
  knowledgeEmbedding: {
    overview:
      "Primary hypothyroidism is characterized by deficient thyroid gland secretion of T4 and T3, causing a systemic metabolic slowdown.",
    pathology:
      "Most commonly caused by Hashimoto's thyroiditis, an autoimmune process involving anti-TPO autoantibody-mediated destruction of thyroid follicles.",
    diagnosis:
      "Diagnosed by elevated serum TSH levels accompanied by low or low-normal Free T4 values.",
    investigations:
      "Serum TSH, Free T4, and anti-TPO antibodies are primary diagnostic markers.",
    differentialDiagnosis:
      "Must be differentiated from clinical depression, chronic fatigue syndrome, iron deficiency anemia, and PCOS.",
    managementOverview:
      "Conventional treatment involves oral levothyroxine hormone replacement. Homeopathic care focuses on constitutional susceptibility regulation.",
    homeopathicPerspective:
      "Endocrine disharmony linked to deep psoric or sycotic miasmatic blockages, requiring remedies matching individual thermals and modalities.",
    complications:
      "Includes severe hypercholesterolemia, diastolic hypertension, cognitive impairment, and myxedema crisis.",
    prognosis:
      "Favorable with timely hormone normalization and constitutional support, though autoantibody levels require periodic tracking.",
    patientEducation:
      "Focuses on medication compliance, iodine/selenium nutritional balance, and lifestyle adjustments for cold intolerance and fatigue.",
    graphContext:
      "Core endocrine node connecting TSH, Free T4, and autoantibodies to remedies Lycopodium and Calcarea Carbonica.",
    semanticKeywords: [
      "underactive thyroid",
      "hashimoto thyroiditis",
      "thyroid peroxidase",
      "myxedema",
      "levothyroxine",
    ],
    embeddingText:
      "hypothyroidism underactive thyroid hashimoto endocrine metabolic fatigue weight gain cold sensitivity anti-tpo",
  },
  qualityScore: {
    editorialQuality: 5,
    clinicalDepth: 94,
    graphConnectivity: 95,
    citationQuality: 92,
    educationalValue: 95,
    aiReadiness: 100,
    seoReadiness: 97,
  },
};
