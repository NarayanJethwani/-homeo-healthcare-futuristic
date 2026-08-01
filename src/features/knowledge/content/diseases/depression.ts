import { KnowledgeEntity } from "../../types";

export const DepressionDisease: KnowledgeEntity = {
  id: "D0020",
  slug: "depression",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Major Depressive Disorder (MDD)",
    hi: "अवसाद / डिप्रेशन (Depression)",
    gu: "ડીપ્રેશન / મનોઅવસાદ (Depression)",
    mr: "नैराश्य / डिप्रेशन (Depression)",
    es: "Trastorno Depresivo Mayor",
    ar: "اضطراب الاكتئاب الرئيسي",
  },
  summary: {
    en: "An authoritative clinical profile of Major Depressive Disorder covering CANMAT 2016 guidelines, monoaminergic neurobiology, active suicidal crisis emergency red flags, and antidepressant non-discontinuation safety boundaries.",
    hi: "डिप्रेशन (Major Depressive Disorder) का CANMAT 2016 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ડીપ્રેશનનું CANMAT 2016 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "डिप्रेशनचे CANMAT 2016 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Depresión Mayor según los criterios CANMAT 2016 y límites de emergencia.",
    ar: "دليل سريري موثوق لاضطراب الاكتئاب وفقًا لمعايير CANMAT 2016 وحدود السلامة.",
  },
  content: {
    overview:
      "Major Depressive Disorder (MDD) is a mood disorder characterized by persistent depressed mood, anhedonia (loss of interest/pleasure), psychomotor changes, and cognitive impairment lasting ≥2 weeks [D0020-KEYNOTES, CIT-0051]. CANMAT 2016 categorizes mild, moderate, and severe episodes.",
    definition:
      "A psychiatric mood disorder involving persistent depressed mood or loss of interest alongside neurovegetative, cognitive, and psychomotor symptoms causing marked functional impairment.",
    causes: [
      "Monoaminergic (serotonin, norepinephrine, dopamine) neurotransmitter deficits and neuroendocrine HPA-axis hyperreactivity [D0020-KEYNOTES, CIT-0051]",
      "Genetic vulnerability combined with environmental stressors, trauma, or chronic medical illness",
      "Organic neurological/endocrine conditions (hypothyroidism, B12 deficiency, stroke, Parkinson's disease)",
    ],
    riskFactors: [
      "Family history of mood disorders or completed suicide",
      "Female sex, chronic pain/medical illness, social isolation, and severe life events (bereavement, job loss)",
      "Substance use disorders or heavy alcohol abuse",
    ],
    symptoms: [
      "Persistent sad, empty, or anxious mood, and marked anhedonia in previously enjoyed activities [D0020-KEYNOTES, CIT-0051]",
      "Significant weight loss/gain, insomnia or hypersomnia, and psychomotor agitation or retardation",
      "Fatigue, feelings of worthlessness/excessive guilt, impaired concentration, and recurrent suicidal thoughts",
    ],
    diagnosis:
      "Diagnosed via DSM-5-TR or ICD-11 criteria (≥5 of 9 symptoms including depressed mood or anhedonia), PHQ-9 psychometric rating scale, and laboratory screening (TSH, B12/folate, CBC) to exclude organic etiologies [CIT-0051].",
    differentialDiagnosis:
      "Differentiate MDD from Bipolar Affective Disorder (hypomanic/manic history), Persistent Depressive Disorder (Dysthymia), Hypothyroidism, Adjustment Disorder with Depressed Mood, and Bereavement.",
    conventionalManagement:
      "Management includes evidence-based psychotherapy (CBT, Interpersonal Therapy), first-line antidepressants (SSRIs - fluoxetine, escitalopram; SNRIs; bupropion), and electroconvulsive therapy (ECT) or rTMS for severe treatment-resistant or catatonic depression [CIT-0051].",
    homeopathicApproach:
      "Homeopathic remedies (such as Aurum Metallicum, Ignatia Amara, Natrum Muriaticum, Sepia, Pulsatilla) act as supportive constitutional therapy to address emotional grieving, despondency, and lethargy alongside professional psychiatric supervision.",
    lifestyleAdvice:
      "Maintain regular sleep-wake schedules, engage in daily aerobic exercise (proven to stimulate BDNF), practice mindfulness, avoid alcohol/drugs, and stay connected with supportive family and friends.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0051"],
    faqs: [
      {
        question: "When is depression considered an urgent psychiatric emergency requiring immediate crisis intervention?",
        answer:
          "Active suicidal ideation with explicit plan or intent, self-harm acts, psychotic depression (hallucinations/delusions), severe catatonia, or refusal of food/fluids causing dehydration is a LIFE-THREATENING PSYCHIATRIC EMERGENCY [D0020-EMERGENCY-LIMITS, CIT-0051]. Call 988 Suicide & Crisis Lifeline or go to nearest ER immediately.",
      },
      {
        question: "Can homeopathic remedies replace prescribed antidepressant medications or emergency suicide prevention?",
        answer:
          "NO. Homeopathy MUST NEVER be used to replace prescribed antidepressant medications, emergency suicide prevention, or psychiatric hospital care [D0020-REGULATORY-LIMITS]. Abruptly stopping antidepressants increases suicide risk and causes severe discontinuation syndrome.",
      },
      {
        question: "How does homeopathy complement standard psychiatric treatment for depression?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard psychiatric care, psychotherapy, and PHQ-9 score monitoring [D0020-REGULATORY-LIMITS].",
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
  tags: ["Depression", "Disease", "CANMAT-2016", "Psychiatry", "MDD", "Suicide-Prevention", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/depression",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Depression profile",
    "1.1.0: Upgraded with CANMAT 2016 evidence citations (CIT-0051), passage-level claim citations (D0020-KEYNOTES, D0020-EMERGENCY-LIMITS, D0020-REGULATORY-LIMITS), suicidal crisis red flags, and antidepressant non-discontinuation safety boundaries",
  ],
};
