import { KnowledgeEntity } from "../../types";

export const WeightGainSymptom: KnowledgeEntity = {
  id: "S0020",
  slug: "weight-gain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Weight Gain",
    hi: "Weight Gain",
    gu: "Weight Gain",
    mr: "Weight Gain",
    es: "Weight Gain",
    ar: "Weight Gain"
  },
  summary: {
    en: "Clinical definition, significance, causes, and supportive management of Weight Gain.",
    hi: "Weight Gain के लक्षण की नैदानिक समझ.",
    gu: "Weight Gain ના લક્ષણ ની સમજણ.",
    mr: "Weight Gain चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Weight Gain.",
    ar: "التعريف السريري والأهمية لـ Weight Gain."
  },
  content: {
  "definition": "Weight gain: A general physical symptom reflecting altered systemic vitality, sleep disruption, or thermal deregulation.",
  "clinicalMeaning": "Represents a functional warning sign indicating that systemic auto-regulation is strained or compromised.",
  "commonCauses": [
    "Post-viral fatigue states",
    "Chronic physical or psychological stress",
    "Sleep deprivation or metabolic imbalances",
    "Subclinical systemic congestion"
  ],
  "differentialDiagnosis": "Must be differentiated from primary thyroid disease, severe anemia, fibromyalgia, and major depressive disorder.",
  "redFlags": [
    "Sudden profound unexplained weight loss",
    "Unremitting high fever unresponsive to standard care",
    "Sudden localized numbness or severe weakness"
  ],
  "lifestyleAdvice": "Prioritize consistent sleep timing, consume a balanced whole-foods diet, practice mild relaxation exercises, and stay hydrated.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
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
    specialty: "Internal Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Weight Gain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/weight-gain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Weight Gain symptom profile"],
  clinicalPearl: "Sudden weight gain accompanied by cold intolerance, fatigue, and dry skin is a classic clinical triad indicating hypothyroidism, requiring prompt serum TSH screening.",
  quickFacts: {
    "Prevalence": "Extremely common clinical presentation",
    "Body System": "Endocrine & Metabolic",
    "Primary Screen": "Thyroid Stimulating Hormone (TSH)",
    "Clinical Nature": "Subjective & Objective presentation"
  },
  aiReadiness: {
    retrievalSummary: "Weight Gain is a systemic metabolic manifestation characterized by an increase in body mass index, frequently serving as an early indicator of endocrine pathology.",
    clinicalSummary: "Pathophysiological mechanisms include reduced basal metabolic rate (BMR), fluid retention (myxedema), cortisol excess, or hypothalamic-pituitary dysregulation.",
    patientSummary: "Weight gain is an increase in body weight that can happen due to fluid retention, slowed metabolism, or hormone changes.",
    studentSummary: "Clinical differential includes primary hypothyroidism, Cushing's syndrome, polycystic ovary syndrome (PCOS), and drug-induced fluid retention.",
    keywords: ["weight gain", "unexplained weight gain", "metabolic slowing", "fluid retention", "myxedema"],
    semanticKeywords: ["increased body mass", "adiposity increase", "sluggish metabolism"],
    icd: "R63.5",
    bodySystem: "Metabolic",
    urgency: "routine"
  },
  visualBodySystem: {
    system: "Metabolic / Endocrine",
    organs: ["Adipose Tissue", "Thyroid Gland", "Adrenal Glands", "Hypothalamus"],
    hormones: ["Thyroid Hormones", "Cortisol", "Insulin", "Leptin"]
  },
  structuredEvidence: {
    system: "Metabolic",
    prevalence: "Common clinical sign",
    typicalAge: "All age groups",
    causes: [
      "Endocrine disorders (Hypothyroidism, Cushing's)",
      "Metabolic syndrome and insulin resistance",
      "Medication side-effects (corticosteroids, atypical antipsychotics)"
    ],
    investigations: ["TSH (Serum)", "HbA1c / Fasting Insulin", "Lipid Profile"],
    urgency: "routine"
  },
  structuredDifferentials: [
    {
      condition: "Hypothyroidism",
      similarity: "Generalized gradual weight gain, fatigue, sluggishness.",
      differentiator: "Cold intolerance, dry skin, bradycardia, delayed reflexes.",
      investigation: "TSH (elevated), Free T4 (low)"
    },
    {
      condition: "Cushing's Syndrome",
      similarity: "Rapid weight gain, abdominal adiposity.",
      differentiator: "Moon face, buffalo hump, purple striae, muscle wasting.",
      investigation: "24-Hour Urinary Free Cortisol, Late-night salivary cortisol"
    },
    {
      condition: "Polycystic Ovary Syndrome (PCOS)",
      similarity: "Weight gain, difficulty losing weight.",
      differentiator: "Hirsutism, acne, irregular menses, polycystic ovaries on ultrasound.",
      investigation: "Pelvic USG, Free & Total Testosterone"
    },
    {
      condition: "Metabolic Syndrome",
      similarity: "Central obesity, fatigue.",
      differentiator: "Elevated blood pressure, high fasting glucose, dyslipidemia.",
      investigation: "Lipid Profile, HbA1c, Blood Pressure monitoring"
    }
  ],
  homeopathicPerspective: {
    conventionalUnderstanding: "Accumulation of excess adipose tissue due to energy imbalance, fluid retention, or endocrine dysfunction, treated through diet, exercise, and addressing hormonal causes.",
    homeopathicInterpretation: "A physical manifestation of a sluggish vital force, metabolic imbalance, or psoric/sycotic miasmatic susceptibility, leading to improper assimilation and distribution of nutrients.",
    constitutionalConsiderations: "Remedies like Calcarea Carbonica, Graphites, and Thyroidinum are selected based on constitutional features (chilliness, sweat patterns, digestive functions) rather than weight status alone.",
    individualization: "Evaluates the patient's thermal preferences, perspiration tendencies (especially around the head), cravings (sweets, boiled eggs), and mental state (lethargic, anxious, fastidious).",
    limitations: "Weight gain secondary to irreversible structural or genetic endocrine dysfunction requires conventional therapy. Homeopathic care is a supportive, holistic metabolic aid."
  },
  aiKnowledge: {
    retrievalSummary: "Clinical reference on unexplained Weight Gain, detailing endocrine etiologies (thyroid, cortisol), diagnostic screening markers, and constitutional homeopathic remedies.",
    differentialSummary: "Differentiate weight gain from endocrine failure (hypothyroidism), hypercortisolism (Cushing's), insulin resistance, and fluid retention.",
    practitionerSummary: "Practitioner guide to evaluating metabolic weight gain. Focuses on BMR dynamics, hormonal profiles, and matching sycotic constitutional remedy profiles.",
    patientSummary: "Patient guide to unexplained weight gain. Learn how metabolic slowing can cause weight changes and the role of homeopathic support alongside diet and clinical checks.",
    educationalSummary: "Study guide detailing metabolic syndrome criteria, Cushing's pathology, thyroid hormone feedback loops, and chronic constitutional remedy indications.",
    graphContext: "Symptom node. Connects to Hypothyroidism (D0011), PCOS (D0013), and remedies Calcarea Carbonica (R0005) and Graphites (R0054).",
    embeddingText: "weight gain unexplained weight increase metabolic slowing fluid retention obesity thyroid cortisol calcarea carbonica graphites"
  }
};

