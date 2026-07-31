import { KnowledgeEntity } from "../../types";

export const MenopauseDisease: KnowledgeEntity = {
  id: "D0034",
  slug: "menopause",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Menopause & Perimenopausal Transition",
    hi: "रजोनिवृत्ति / मेनोपॉज (Menopause)",
    gu: "રજોનિવૃત્તિ / મેનોપોઝ (Menopause)",
    mr: "रजोनिवृत्ती / मेनोपॉज (Menopause)",
    es: "Menopausia y Transición Perimenopáusica",
    ar: "سن اليأس / انقطاع الطمث",
  },
  summary: {
    en: "An authoritative clinical profile of Menopause covering NAMS 2022 guidelines, ovarian follicular depletion neuro-endocrine mechanics, postmenopausal bleeding emergency red flags, and endometrial carcinoma safety boundaries.",
    hi: "मेनोपॉज (Menopause) का NAMS 2022 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "મેનોપોઝનું NAMS 2022 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "मेनोपॉजचे NAMS 2022 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Menopausia según los criterios NAMS 2022 y límites de emergencia.",
    ar: "دليل سريري موثوق لانقطاع الطمث وفقًا لمعايير NAMS 2022 وحدود السلامة.",
  },
  content: {
    overview:
      "Menopause is defined clinically as the permanent cessation of menses following 12 consecutive months of amenorrhea due to loss of ovarian follicular activity [D0034-KEYNOTES, CIT-0058]. NAMS 2022 guidelines outline evidence-based non-hormonal and hormonal management.",
    definition:
      "A natural physiological milestone occurring at a median age of 51 years, marked by depletion of ovarian oocytes, cessation of progesterone production, and hypoestrogenism resulting in vasomotor, genitourinary, and metabolic alterations.",
    causes: [
      "Age-related exhaustion of ovarian follicular reserve leading to fall in serum estradiol and compensatory rise in FSH/LH [D0034-KEYNOTES, CIT-0058]",
      "Surgical menopause (bilateral oophorectomy) or iatrogenic gonadotoxicity (chemotherapy, pelvic radiation)",
      "Primary Ovarian Insufficiency (POI) occurring prior to age 40 due to autoimmune or genetic factors",
    ],
    riskFactors: [
      "Natural aging (median onset 45-55 years)",
      "Cigarette smoking (accelerates ovarian senescence by 1-2 years)",
      "Bilateral oophorectomy, hysterectomy, or pelvic oncological therapies",
    ],
    symptoms: [
      "Vasomotor instability: Sudden hot flashes, night sweats, episodic diaphoresis, and facial flushing [D0034-KEYNOTES, CIT-0058]",
      "Genitourinary Syndrome of Menopause (GSM): Vaginal dryness, dyspareunia, vulvovaginal atrophy, dysuria, and recurrent UTIs",
      "Neuropsychiatric & somatic signs: Sleep disruption, mood lability, memory fog, joint arthralgias, and accelerated bone density loss",
    ],
    diagnosis:
      "Diagnosed clinically in women >45 years with 12 months of amenorrhea. Serum FSH (>30 IU/L) and low estradiol are checked in atypical cases, early menopause (<40 years), or post-hysterectomy patients [CIT-0058].",
    differentialDiagnosis:
      "Differentiate Menopause from Thyroid Disorders (hyperthyroidism causing hot flashes/palpitations), Pregnancy (in perimenopause), Hyperprolactinemia, Carcinoid Syndrome, and Endometrial Hyperplasia/Carcinoma (in bleeding cases).",
    conventionalManagement:
      "Management includes Menopausal Hormone Therapy (MHT - estrogen with progestogen in women with an intact uterus), non-hormonal pharmacotherapy (paroxetine, gabapentin, fezolinetant), topical vaginal estrogens for GSM, and bisphosphonates/denosumab for osteoporosis prevention [CIT-0058].",
    homeopathicApproach:
      "Homeopathic remedies (such as Lachesis Mutus, Sepia, Sepia Officinalis, Pulsatilla, Calcarea Carbonica, Ambra Grisea) serve as supportive constitutional care to ease hot flashes, stabilize mood fluctuations, and manage sleep disruption alongside lifestyle modifications.",
    lifestyleAdvice:
      "Dress in layers to manage hot flashes, maintain cool ambient sleeping temperatures, perform weight-bearing exercise for bone health, limit caffeine/alcohol/spicy foods, and ensure adequate calcium (1200 mg/day) and Vitamin D (800-1000 IU/day) intake.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0058"],
    faqs: [
      {
        question: "When does vaginal bleeding after menopause require urgent diagnostic evaluation for cancer?",
        answer:
          "ANY vaginal bleeding, spotting, or pink/brown discharge occurring after 12 months of amenorrhea (POSTMENOPAUSAL BLEEDING) is an ALARM SIGNAL [D0034-EMERGENCY-LIMITS, CIT-0058]. It requires PROMPT ENDOMETRIAL BIOPSY / PELVIC ULTRASOUND to exclude ENDOMETRIAL CARCINOMA (present in ~10% of cases).",
      },
      {
        question: "Can homeopathic remedies replace diagnostic endometrial biopsy or bone density (DEXA) screening?",
        answer:
          "NO. Homeopathy MUST NOT replace diagnostic endometrial evaluation for postmenopausal bleeding or DEXA screening for osteoporosis [D0034-REGULATORY-LIMITS]. Delaying biopsy in postmenopausal bleeding carries severe risks.",
      },
      {
        question: "How does homeopathy integrate with standard menopausal health care?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard gynecological care, mammography screening, and bone density surveillance [D0034-REGULATORY-LIMITS].",
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
    specialty: "Gynecology & Menopause Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Menopause", "Disease", "NAMS-2022", "Gynecology", "Postmenopausal-Bleeding", "Endometrial-Cancer", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/menopause",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Menopause profile",
    "1.1.0: Upgraded with NAMS 2022 evidence citations (CIT-0058), passage-level claim citations (D0034-KEYNOTES, D0034-EMERGENCY-LIMITS, D0034-REGULATORY-LIMITS), postmenopausal bleeding red flags, and endometrial carcinoma safety boundaries",
  ],
};
