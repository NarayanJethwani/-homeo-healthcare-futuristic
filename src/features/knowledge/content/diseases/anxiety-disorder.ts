import { KnowledgeEntity } from "../../types";

export const AnxietyDisorderDisease: KnowledgeEntity = {
  id: "D0019",
  slug: "anxiety-disorder",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Generalized Anxiety Disorder (GAD) & Panic Disorder",
    hi: "चिंता विकार / एंग्जायटी डिसऑर्डर (Anxiety Disorder)",
    gu: "ચિંતા વિકાર (Anxiety Disorder)",
    mr: "चिंता विकार (Anxiety Disorder)",
    es: "Trastorno de Ansiedad Generalizada",
    ar: "اضطراب القلق العام",
  },
  summary: {
    en: "An authoritative clinical profile of Generalized Anxiety Disorder covering APA 2020 guidelines, autonomic GABA/serotonergic neuro-pathways, psychiatric crisis emergency red flags, and psychotropic non-discontinuation boundaries.",
    hi: "चिंता विकार (Anxiety Disorder) का APA 2020 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ચિંતા વિકારનું APA 2020 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "चिंता विकाराचे APA 2020 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del Trastorno de Ansiedad según los criterios APA 2020 y límites de emergencia.",
    ar: "دليل سريري موثوق لاضطراب القلق العام وفقًا لمعايير APA 2020 وحدود السلامة.",
  },
  content: {
    overview:
      "Generalized Anxiety Disorder (GAD) is characterized by excessive, uncontrollable worry and anxiety about everyday events lasting ≥6 months, accompanied by somatic autonomic symptoms [D0019-KEYNOTES, CIT-0050]. APA 2020 recommends integrated psychological and pharmacological care.",
    definition:
      "A psychiatric disorder characterized by pervasive, persistent, and unprovoked worry, motor tension, autonomic hyperactivity, and cognitive hypervigilance.",
    causes: [
      "Dysregulated amygdala-prefrontal neural circuitry and altered GABAergic, serotonergic, and noradrenergic neurotransmission [D0019-KEYNOTES, CIT-0050]",
      "Genetic heritability interacting with adverse childhood experiences, chronic psychogenic stress, or trauma",
      "Somatic medical conditions (hyperthyroidism, pheochromocytoma, cardiac dysrhythmias) or caffeine/stimulant overuse",
    ],
    riskFactors: [
      "Family history of anxiety, depression, or neuroatopic diathesis",
      "Female sex, chronic physical illness, low social support, and personality traits (neuroticism)",
      "Abrupt withdrawal from benzodiazepines, alcohol, or sedatives",
    ],
    symptoms: [
      "Restlessness, feeling keyed up or on edge, muscle tension, and easy fatigability [D0019-KEYNOTES, CIT-0050]",
      "Difficulty concentrating, irritability, sleep-onset insomnia, and unrefreshing sleep",
      "Autonomic hyperactivity: Palpitations, diaphoresis, tremors, shortness of breath, epigastric distress, and dizziness",
    ],
    diagnosis:
      "Diagnosed via DSM-5-TR or ICD-11 clinical criteria, GAD-7 psychometric rating scale, and laboratory screening (TSH, CBC, serum electrolytes, ECG) to exclude organic endocrine/cardiac causes [CIT-0050].",
    differentialDiagnosis:
      "Differentiate GAD from Panic Disorder, Major Depressive Disorder, Hyperthyroidism, Hypoglycemia, Pheochromocytoma, and Acute Coronary Syndrome (ACS during panic attack).",
    conventionalManagement:
      "Management includes Cognitive Behavioral Therapy (CBT), selective serotonin reuptake inhibitors (SSRIs - escitalopram, sertraline), serotonin-norepinephrine reuptake inhibitors (SNRIs - duloxetine, venlafaxine), or short-term buspirone/pregabalin [CIT-0050].",
    homeopathicApproach:
      "Homeopathic remedies (such as Aconitum Napellus, Argentum Nitricum, Arsenicum Album, Gelsemium, Ignatia) serve as supportive constitutional care to calm autonomic over-arousal, ease anticipatory dread, and improve sleep latency alongside professional psychiatric evaluation.",
    lifestyleAdvice:
      "Engage in daily diaphragmatic breathing and mindfulness meditation, reduce caffeine and alcohol intake, maintain regular sleep hygiene, and perform moderate aerobic exercise.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0050"],
    faqs: [
      {
        question: "When is anxiety or panic considered a psychiatric emergency requiring immediate crisis evaluation?",
        answer:
          "Active suicidal intent or self-harm plans, acute severe chest pain with dyspnea (requiring ruling out acute myocardial infarction), or severe dissociative psychosis is a PSYCHIATRIC AND MEDICAL EMERGENCY [D0019-EMERGENCY-LIMITS, CIT-0050]. Contact 988 Crisis Lifeline or go to nearest Emergency Room immediately.",
      },
      {
        question: "Can homeopathic remedies replace prescribed psychiatric medications (SSRIs/SNRIs) or crisis care?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace prescribed SSRIs, SNRIs, or acute psychiatric crisis intervention [D0019-REGULATORY-LIMITS]. Abrupt discontinuation of prescribed psychiatric medication can trigger severe rebound anxiety and withdrawal syndrome.",
      },
      {
        question: "How does homeopathy integrate with standard psychiatric and psychological therapy?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard psychiatric care, CBT, and psychometric monitoring (GAD-7) [D0019-REGULATORY-LIMITS].",
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
    specialty: "Psychiatry & Behavioral Health Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Anxiety-Disorder", "Disease", "APA-2020", "Psychiatry", "GAD", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/anxiety-disorder",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Anxiety Disorder profile",
    "1.1.0: Upgraded with APA 2020 evidence citations (CIT-0050), passage-level claim citations (D0019-KEYNOTES, D0019-EMERGENCY-LIMITS, D0019-REGULATORY-LIMITS), suicidal crisis red flags, and psychotropic non-discontinuation boundaries",
  ],
};
