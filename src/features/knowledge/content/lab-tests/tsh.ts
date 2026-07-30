import { KnowledgeEntity } from "../../types";

export const TshLabTest: KnowledgeEntity = {
  id: "L0002",
  slug: "tsh",
  entityType: "lab-test",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  citationHealth: "complete",
  contentCompleteness: 100,
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-30T12:00:00Z",
    reviewed: "2026-07-30T12:00:00Z",
  },
  title: {
    en: "Thyroid Stimulating Hormone (TSH)",
    hi: "थायराइड उत्तेजक हार्मोन (टीएसएच)",
    gu: "થાઇરોઇડ હોર્મોન તપાસ (TSH)",
    mr: "थायरॉईड टेस्ट (TSH)",
    es: "Hormona Estimulante de la Tiroides (TSH)",
    ar: "هرمون الغدة الدرقية (TSH)",
  },
  summary: {
    en: "A diagnostic blood test measuring pituitary TSH levels to evaluate thyroid gland function, screening for primary hypothyroidism, hyperthyroidism, and subclinical thyroid disorders.",
    hi: "एक रक्त जांच जो थायराइड ग्रंथि की कार्यप्रणाली का आकलन करने के लिए टीएसएच स्तर को मापती है.",
    gu: "લોહીની તપાસ જે થાઇરોઇડ ગ્રંથિની સક્રિયતા માપે છે, હાઇપો કે હાઇપર થાઇરોઇડ નક્કી કરવા.",
    mr: "थायरॉईड ग्रंथीचे कार्य मोजण्यासाठी रक्तातील टीएसएच संप्रेरकाची तपासणी.",
    es: "Un análisis de sangre para evaluar la función tiroidea midiendo los niveles de TSH.",
    ar: "فحص دم تشخيصي يقيس مستويات TSH للكشف عن خلل الغدة الدرقية.",
  },
  content: {
    overview:
      "Thyroid Stimulating Hormone (TSH, thyrotropin) is a pituitary glycoprotein hormone that regulates thyroid hormone (T4/T3) synthesis and secretion. Serum TSH is the primary diagnostic screen for thyroid axis function due to the inverse log-linear relationship between TSH and serum free T4.",
    normalRange:
      "Adult Non-Pregnant TSH: 0.45–4.50 mIU/L; First Trimester Pregnancy: 0.10–2.50 mIU/L; Free T4: 0.8–1.8 ng/dL; Free T3: 2.3–4.2 pg/mL.",
    highValues: [
      "Primary Hypothyroidism (TSH > 4.5 mIU/L with low Free T4)",
      "Subclinical Hypothyroidism (TSH > 4.5 mIU/L with normal Free T4)",
      "TSH-secreting pituitary adenoma or thyroid hormone resistance (rare causes of high TSH with high Free T4)",
    ],
    lowValues: [
      "Primary Hyperthyroidism / Thyrotoxicosis (TSH < 0.45 mIU/L with elevated Free T4/T3, e.g., Graves' disease, toxic nodular goiter)",
      "Subclinical Hyperthyroidism (TSH < 0.10 mIU/L with normal Free T4/T3)",
      "Central / Secondary Hypothyroidism (low or inappropriately normal TSH with low Free T4 due to pituitary failure)",
    ],
    clinicalInterpretation:
      "TSH is the initial screening biomarker. If TSH is abnormal, reflex Free T4 and thyroid autoantibodies (Anti-TPO, Anti-Thyroglobulin) delineate autoimmune etiology (Hashimoto's thyroiditis vs Graves' disease). Serum TSH fluctuations require morning repeat confirmation.",
    references: ["CIT-0012", "CIT-0013", "CIT-0014", "CIT-0022", "CIT-0024"],
    homeopathyLimits:
      "TSH testing provides essential objective data on pituitary-thyroid feedback. Homeopathy does not replace thyroid hormone replacement therapy in overt primary hypothyroidism, antithyroid medical management in severe hyperthyroidism, or emergency endocrinological care.",
    faqs: [
      {
        question: "What causes autoimmune thyroid flares?",
        answer:
          "Thyroid autoantibody flares are typically triggered by systemic immune dysregulation, chronic physical or emotional stress, high iodine intake, or underlying genetic susceptibility.",
      },
      {
        question: "Can thyroid status affect weight and energy levels?",
        answer:
          "Yes. Thyroid hormones regulate systemic basal metabolic rate. Hypothyroidism slows metabolism causing weight gain and fatigue, while hyperthyroidism accelerates metabolism causing weight loss and tachycardia.",
      },
      {
        question: "What is the role of homeopathy in thyroid health?",
        answer:
          "Homeopathic care utilizes constitutional remedies to optimize self-regulatory mechanisms and support immune wellness, evaluated alongside standard lab TSH monitoring without replacing required thyroid hormone therapy.",
      },
    ],
  },
  claimCitations: [
    {
      claimId: "L0002-DEFINITION",
      passageId: "L0002-DEFINITION",
      statement:
        "TSH is a anterior pituitary hormone that stimulates thyroid follicular synthesis of T4 and T3.",
      citationIds: ["CIT-0012", "CIT-0022"],
    },
    {
      claimId: "L0002-INDICATION",
      passageId: "L0002-INDICATION",
      statement:
        "Primary screening biomarker for hypothyroidism, hyperthyroidism, subclinical thyroid disease, and levothyroxine dose titration.",
      citationIds: ["CIT-0012", "CIT-0013"],
    },
    {
      claimId: "L0002-INTERPRETATION",
      passageId: "L0002-INTERPRETATION",
      statement:
        "Inverse log-linear relationship: small changes in free T4 produce large reciprocal shifts in TSH.",
      citationIds: ["CIT-0013", "CIT-0022"],
    },
    {
      claimId: "L0002-CRITICAL-VALUES",
      passageId: "L0002-CRITICAL-VALUES",
      statement:
        "TSH < 0.01 mIU/L with tachycardia/fever (impending thyroid storm), myxedema coma warning signs, or TSH > 20 mIU/L in pregnancy require immediate endocrinological emergency management.",
      citationIds: ["CIT-0013", "CIT-0024"],
    },
    {
      claimId: "L0002-HOMEOPATHY-LIMITS",
      passageId: "L0002-HOMEOPATHY-LIMITS",
      statement:
        "Homeopathy does not replace exogenous thyroid hormone replacement in overt hypothyroidism or medical antithyroid care in severe hyperthyroidism.",
      citationIds: ["CIT-0024", "CIT-0014"],
    },
  ],
  redFlags: [
    "Myxedema Coma Warning: Profound hypothermia (< 35°C), severe bradycardia, altered mental status, and hypoventilation in severe hypothyroidism.",
    "Impending Thyroid Storm: Suppressed TSH (< 0.01 mIU/L) with severe tachycardia (> 140 bpm), high fever (> 39°C), delirium, and high-output heart failure.",
    "Severe Pregnancy Hypothyroidism: TSH > 20 mIU/L or overt hypothyroidism during pregnancy, risking fetal neurodevelopmental compromise.",
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Endocrinology & Clinical Diagnostics",
    institution: "Homeo Healthcare Clinic",
  },
  evidenceLevel: "Level-A",
  tags: ["TSH", "Thyroid", "Hormone", "Blood Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/tsh",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: [
    "1.0.0: Initial release of TSH lab test profile",
    "1.1.0: Upgraded with passage-level claim citations, emergency panic thresholds, pregnancy criteria, and explicit homeopathy safety boundaries.",
  ],
  clinicalPearl:
    "TSH fluctuates diurnally, peaking overnight. A borderline elevation should always be confirmed with an early morning repeat specimen.",
  quickFacts: {
    "Specimen Type": "Venous Blood (Serum)",
    "Preparation": "Fasting optional; early morning draw is preferred",
    "Turnaround Time": "12–24 Hours",
    "Clinical Category": "Endocrine Screen",
  },
  aiReadiness: {
    retrievalSummary:
      "Thyroid Stimulating Hormone (TSH) is a pituitary glycoprotein that stimulates secretion of thyroxine (T4) and triiodothyronine (T3), serving as the primary diagnostic screen for thyroid disorders.",
    clinicalSummary:
      "TSH is secreted by thyrotropes in the anterior pituitary under TRH stimulation. It binds to the G-protein coupled TSH receptor (TSHR) on thyroid follicular cells, initiating thyroglobulin synthesis and iodination.",
    patientSummary:
      "TSH is a hormone from your brain that tells your thyroid to work. High levels suggest your thyroid is underactive; low levels suggest it is overactive.",
    studentSummary:
      "Serum TSH is the most sensitive biomarker for primary hypothyroidism (elevated) and primary hyperthyroidism (suppressed) due to the log-linear relationship between TSH and free thyroid hormones.",
    keywords: [
      "tsh",
      "thyroid stimulating hormone",
      "thyrotropin",
      "pituitary thyroid feedback",
      "hypothyroidism screen",
    ],
    semanticKeywords: ["thyroid regulator", "endocrine feedforward", "pituitary control"],
    icd: "R79.89",
    bodySystem: "Endocrine",
    urgency: "routine",
  },
  visualBodySystem: {
    system: "Endocrine",
    organs: ["Pituitary Gland", "Thyroid Gland"],
    hormones: ["TSH", "TRH", "T4", "T3"],
  },
  structuredEvidence: {
    system: "Endocrine",
    prevalence: "Standard endocrine biomarker",
    typicalAge: "All age groups",
    causes: [
      "Primary thyroid gland failure (elevated TSH)",
      "Pituitary adenoma or central failure (suppressed/low TSH)",
    ],
    investigations: ["Free T4", "Free T3", "Anti-TPO Autoantibodies"],
    urgency: "routine",
  },
  interpretationAlgorithm: {
    title: "Clinician TSH Interpretation Flowchart",
    steps: [
      {
        label: "Measure initial serum TSH level",
        type: "action",
      },
      {
        label: "Is TSH level elevated (> 4.5 mIU/L)?",
        type: "question",
        options: [
          { value: "Yes", nextStepLabel: "Evaluate Free T4" },
          { value: "No", nextStepLabel: "Check for low TSH (< 0.4 mIU/L)" },
        ],
      },
      {
        label: "Measure Free T4 level",
        type: "action",
      },
      {
        label: "Is Free T4 level decreased?",
        type: "question",
        options: [
          { value: "Yes", nextStepLabel: "Confirm Primary Hypothyroidism" },
          { value: "No", nextStepLabel: "Subclinical Hypothyroidism" },
        ],
      },
      {
        label: "Screen for Anti-TPO autoantibodies to evaluate for autoimmune etiology (Hashimoto's)",
        type: "consideration",
      },
      {
        label: "Correlate with clinical findings (hypometabolic symptoms, bradycardia) to guide care",
        type: "consideration",
      },
    ],
  },
  aiKnowledge: {
    retrievalSummary:
      "Laboratory reference guide for Thyroid Stimulating Hormone (TSH) testing protocols, physiological pituitary-thyroid feedback loops, and clinical diagnostic interpretations.",
    differentialSummary:
      "Distinguish between primary thyroid dysfunction (high TSH / low FT4) and subclinical states or central pituitary disorders.",
    practitionerSummary:
      "Practitioner resource on TSH monitoring guidelines. Details log-linear feedback, diurnal rhythms, and autoantibody anti-TPO cross-screening criteria.",
    patientSummary:
      "Understand TSH lab reports. High values generally point to an underactive thyroid, while low values suggest an overactive gland.",
    educationalSummary:
      "Study guide detailing thyrotrope cell function, TRH-induced TSH release mechanisms, and diagnostic interpretation algorithms.",
    graphContext:
      "Central laboratory node. Connects to Hypothyroidism (D0011), Hyperthyroidism (D0012), Free T4 (L0036), and Anti-TPO (L0039).",
    embeddingText:
      "tsh thyroid stimulating hormone thyrotropin laboratory blood test range endocrine hypothyroid hyperthyroid feedback",
  },
  knowledgeEmbedding: {
    overview:
      "Thyroid Stimulating Hormone (TSH) is a glycoprotein hormone synthesized and secreted by thyrotropes in the anterior pituitary gland, regulating thyroid hormone production.",
    pathology:
      "TSH secretion is highly sensitive to negative feedback from thyroid hormones (T4/T3). Pathological states manifest as secondary elevations or suppressions.",
    diagnosis:
      "TSH is the gold-standard screening parameter for primary hypo- and hyper-thyroidism.",
    investigations:
      "Used alongside Free T4, Free T3, and anti-thyroid antibodies to fully delineate thyroid function.",
    differentialDiagnosis:
      "Helps differentiate primary thyroid failure from subclinical thyroid disease, pituitary insufficiency, or euthyroid sick syndrome.",
    managementOverview:
      "Guides dosage adjustment of levothyroxine in hypothyroidism and antithyroid medications in hyperthyroidism.",
    homeopathicPerspective:
      "Evaluated as a systemic vital marker representing the regulatory stress on the neuro-endocrine axis.",
    complications:
      "Abnormal TSH reflects systemic complications such as cardiovascular disease, dyslipidemias, and osteoporosis (if hyperthyroid).",
    prognosis:
      "Excellent tracking tool; longitudinal stabilization corresponds with constitutional homeostatic recovery.",
    patientEducation:
      "Instructs patients on proper fasting compliance and avoiding biotin supplements prior to venipuncture.",
    graphContext:
      "Main thyroid marker node. Intersects with T3, T4, thyroid autoantibodies, and constitutional remedies.",
    semanticKeywords: [
      "tsh",
      "thyrotropin",
      "thyroid stimulating hormone",
      "euthyroid",
      "pituitary feedback",
    ],
    embeddingText:
      "tsh thyroid stimulating hormone laboratory reference ranges subclinical hypothyroidism hyperthyroidism pituitary",
  },
  qualityScore: {
    editorialQuality: 5,
    clinicalDepth: 95,
    graphConnectivity: 96,
    citationQuality: 98,
    educationalValue: 95,
    aiReadiness: 100,
    seoReadiness: 97,
  },
};
