import { KnowledgeEntity } from "../../types";

export const ChronicFatigueSyndromeDisease: KnowledgeEntity = {
  id: "D0025",
  slug: "chronic-fatigue-syndrome",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Myalgic Encephalomyelitis / Chronic Fatigue Syndrome (ME/CFS)",
    hi: "क्रॉनिक फटीग सिंड्रोम / मायलगिक एन्सेफेलोमायलिटिस (ME/CFS)",
    gu: "ક્રોનિક ફેટીગ સિન્ડ્રોમ / ક્રોનિક થાકની સમસ્યા (ME/CFS)",
    mr: "क्रॉनिक फटीग सिंड्रोम / सतत जाणवणारा तीव्र थकवा (ME/CFS)",
    es: "Encefalomielitis Miálgica / Síndrome de Fatiga Crónica (EM/SFC)",
    ar: "التهاب الدماغ والنخاع المؤلم للعضلات / متلازمة التعب المزمن (ME/CFS)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Myalgic Encephalomyelitis / Chronic Fatigue Syndrome (ME/CFS), covering post-exertional malaise (PEM), cellular bioenergetic impairment, orthostatic intolerance, constitutional homeopathic supportive management, and emergency red flags for acute adrenal crisis, occult malignancy, and severe cardiac failure.",
    hi: "क्रॉनिक फटीग सिंड्रोम (ME/CFS) का पोस्ट-एक्जर्शनल मैलेज (PEM/हल्की मेहनत के बाद भारी थकान), सेलुलर बायो-एनर्जेटिक विकार, ऑर्थोस्टैटिक इनटॉलरेंस, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और एडिसोनियन संकट व मैलिग्नेंसी की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ક્રોનિક ફેટીગ સિન્ડ્રોમ (ME/CFS) ની સેલ્યુલર ઉર્જા ખામી પેથોલોજી, સહેજ શ્રમ પછી થતો અસહ્ય થાક (PEM), પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને એડ્રિનલ કટોકટી તથા કેન્સરની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "क्रॉनिक फटीग सिंड्रोम (ME/CFS), किंचित श्रमाने येणारा प्रचंड थकवा (Post-Exertional Malaise), मेंदूतील ग्लानी, पारंपरिक होमिओपॅथिक पद्धत आणि अ‍ॅडिसन क्रायसिसच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del síndrome de fatiga crónica (EM/SFC) que cubre el malestar postesfuerzo (MPE), intolerancia ortostática, manejo homeopático complementario y banderas rojas de crisis suprarrenal y neoplasias.",
    ar: "دليل سريري وتعليمي موثوق لمتلازمة التعب المزمن يغطي التوعك التالي للجهد وضعف الطاقة الخلوية وعدم التحمل الانتصابي والرعاية التكميلية وعلامات الخطر للأزمة الكظرية والأورام الخبيثة."
  },
  content: {
    overview:
      "Myalgic Encephalomyelitis / Chronic Fatigue Syndrome (ME/CFS) is a severe, complex, multisystem neuroimmune disorder characterized by profound, debilitating physical and mental fatigue persisting for \u22656 months that is not the result of ongoing excessive exertion and is not substantially alleviated by rest. The hallmark pathognomonic feature is Post-Exertional Malaise (PEM)—a dramatic, prolonged exacerbation of symptoms and collapse following even minor physical, cognitive, sensory, or emotional exertion, typically delayed by 12 to 48 hours and persisting for days, weeks, or months.",
    definition:
      "A chronic, multisystem biological illness characterized by profound functional impairment, pathognomonic post-exertional malaise (PEM), unrefreshing sleep, cognitive dysfunction ('brain fog'), and orthostatic intolerance or autonomic dysfunction.",
    causes: [
      "Infectious and post-viral onset (most commonly following acute Epstein-Barr virus [infectious mononucleosis], human herpesvirus 6 [HHV-6], cytomegalovirus, enteroviruses, Ross River virus, or SARS-CoV-2 / Long COVID)",
      "Mitochondrial and cellular bioenergetic dysfunction: impaired oxidative phosphorylation, elevated intracellular oxidative stress, and early shift to anaerobic glycolysis during exertion",
      "Neuroimmune and neuroinflammatory dysregulation: microglial activation in the brainstem and basal ganglia, altered cytokine profiles, and chronic low-grade neuroinflammation",
      "Autonomic nervous system dysfunction: impaired cerebral autoregulation, reduced cardiac output on standing, and postural orthostatic tachycardia syndrome (POTS)"
    ],
    riskFactors: [
      "Female gender (diagnosed 3 to 4 times more frequently in women, with peak onset between 20–45 years of age)",
      "Severe acute viral or bacterial infection without adequate initial convalescence and rest",
      "Genetic vulnerability involving immune regulatory and mitochondrial gene variants",
      "Prior chronic physical or emotional allostatic stress loading",
      "Comorbid immune-mediated conditions (Hashimoto's thyroiditis, hypermobility spectrum disorders, mast cell activation syndrome [MCAS])"
    ],
    symptoms: [
      "Pathognomonic Post-Exertional Malaise (PEM): severe neuro-immune-metabolic 'crash' with profound exhaustion, flu-like aches, and weakness following minor activity",
      "Unrefreshing sleep: waking every morning feeling utterly un-rested and physically drained regardless of hours spent in bed",
      "Cognitive dysfunction ('brain fog'): marked impairment in working memory, information processing speed, word recall, and executive focus",
      "Orthostatic intolerance: lightheadedness, dizziness, presyncope, palpitations, or nausea when standing upright, relieved by lying flat",
      "Flu-like constitutional symptoms: chronic or recurrent sore throat, tender cervical/axillary lymph nodes, low-grade fevers, and migratory arthralgias/myalgias without joint swelling"
    ],
    diagnosis:
      "Diagnosed using the Institute of Medicine (NAM/IOM) 2015 diagnostic criteria: requiring the core triad of (1) profound fatigue with substantial reduction in activity, (2) post-exertional malaise (PEM), and (3) unrefreshing sleep, PLUS at least one of (a) cognitive impairment or (b) orthostatic intolerance, lasting \u22656 months. Laboratory workups (CBC, ESR, CRP, Comprehensive Metabolic Panel, TSH, Free T4, Morning Cortisol, Ferritin, Vitamin B12, Celiac serology) are mandatory to exclude secondary fatiguing medical conditions.",
    differentialDiagnosis:
      "Differentiate ME/CFS from Primary Adrenal Insufficiency (Addison's disease; hyperpigmentation, severe hyponatremia, low morning cortisol), Hypothyroidism, Severe Sleep Apnea, Multiple Sclerosis, Occult Malignancy, Major Depressive Disorder (fatigue accompanied by core anhedonia and lack of motivation, whereas ME/CFS patients maintain high motivation but are physically limited by PEM), Systemic Lupus Erythematosus, and Chronic Hepatitis B/C.",
    conventionalManagement:
      "There are currently no curative pharmacological treatments for ME/CFS; management focuses on supportive symptomatic care, pacing, and autonomic stabilization. Activity Pacing (energy envelope management / heart rate monitoring to avoid triggering PEM) is the foundational evidence-based lifestyle strategy. Graded Exercise Therapy (GET) is strictly contraindicated and eliminated from major international guidelines (NICE 2021, CDC). Symptomatic therapies include fludrocortisone, midodrine, or beta-blockers for POTS/orthostatic intolerance, and low-dose naltrexone (LDN) for neuroinflammation.",
    homeopathicApproach:
      "Homeopathic constitutional and deep vital-drainage remedies (such as Gelsemium Sempervirens, Kali Phosphoricum, Phosphoricum Acidum, Picricum Acidum, Arsenicum Album, Silicea, China Officinalis, Carbo Vegetabilis) serve as supportive care to assist nervous tone, soothe post-viral exhaustion, and support vitality alongside strict energy pacing and multidisciplinary care.",
    lifestyleAdvice:
      "Practice meticulous energy envelope pacing ('stop before you drop' to prevent triggering PEM), wear a heart rate monitor to stay below the anaerobic threshold, break daily activities into brief resting segments, stay well-hydrated with electrolyte solutions for orthostatic intolerance, wear graduated compression stockings if POTS is present, and prioritize radical rest during post-viral recovery.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007",
      "CIT-0023",
      "CIT-0024"
    ],
    faqs: [
      {
        question: "What is Post-Exertional Malaise (PEM) and why is it so important?",
        answer: "Post-Exertional Malaise (PEM) is the hallmark symptom of ME/CFS. It is a severe physiological relapse involving overwhelming exhaustion, flu-like pain, and brain fog that occurs after minor physical or mental effort, often delayed by 24 hours and lasting for days."
      },
      {
        question: "Why should patients with ME/CFS avoid aggressive exercise programs?",
        answer: "Aggressive or forced exercise (such as Graded Exercise Therapy) damages impaired cellular mitochondria in ME/CFS, causing severe lactic acidosis and prolonged debilitating crashes (PEM). Pacing within your energy envelope is the safe standard of care."
      }
    ],
    redFlags: [
      "Primary Adrenal Crisis (Addisonian crisis): severe hypotension, profound prostration, intractable vomiting, hyperpigmentation, and severe electrolyte abnormalities (hyponatremia, hyperkalemia; medical emergency requiring immediate IV hydrocortisone and saline)",
      "Rapid unintentional weight loss, night sweats, localized lymphadenopathy, or hematochezia (suspected occult malignancy)",
      "Severe progressive dyspnea on exertion, orthopnea, or bilateral peripheral edema (suspected congestive heart failure or cardiomyopathy)",
      "New focal neurological deficits: hemiparesis, visual field loss, or ataxia (suspected Multiple Sclerosis or CNS structural lesion)"
    ]
  },
  claimCitations: [
    { claimId: "D0025-TRADITIONAL-PROFILE", statement: "Homeopathic ME/CFS profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0025-TRADITIONAL-PROFILE" },
    { claimId: "D0025-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for mitochondrial bioenergetic failure, adrenal crisis, or occult malignancy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0025-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0025-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for Addisonian adrenal crisis, occult malignancy, or severe cardiomyopathy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Severe hypotension, vomiting, and hyponatremia indicating acute Addisonian adrenal crisis requiring emergency IV hydrocortisone",
    "Unintentional rapid weight loss and persistent fevers indicating occult malignancy requiring comprehensive oncologic workup",
    "Progressive shortness of breath, orthopnea, and lower limb edema indicating cardiac failure"
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Governance & Materia Medica",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Chronic Fatigue Syndrome", "ME/CFS", "Myalgic Encephalomyelitis", "Disease", "Post-Exertional Malaise", "Brain Fog", "Pacing", "Neuroimmunology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/chronic-fatigue-syndrome",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive IOM 2015 diagnostic criteria, PEM pacing boundaries, and verified citations"],
  clinicalPearl: "The presence of Post-Exertional Malaise (PEM) definitively differentiates ME/CFS from major depression, fibromyalgia, and non-specific post-viral debility.",
  quickFacts: {
    "Prevalence": "Estimated 0.4% to 1% of the global population (millions affected worldwide)",
    "Primary System": "Neuroimmune & Autonomic Nervous System (Mitochondrial Bioenergetics)",
    "Diagnostic Standard": "IOM / NAM 2015 Diagnostic Criteria (Core Triad + Cognitive or Orthostatic Impairment)",
    "Clinical Character": "Multisystem neuroimmune disorder marked by post-exertional malaise, unrefreshing sleep, and autonomic dysfunction"
  },
  aiReadiness: {
    retrievalSummary: "ME/CFS is a complex multisystem neuroimmune disorder defined by post-exertional malaise (PEM), unrefreshing sleep, and brain fog, managed with supportive care, strict energy pacing, and conventional medical guidance.",
    clinicalSummary: "ME/CFS pathophysiology involves cellular bioenergetic dysfunction, neuroinflammation, and autonomic dysregulation. Homeopathic remedies serve as supportive vital care and do not replace energy pacing, medical evaluation for endocrine/autoimmune diseases, or emergency care for acute adrenal crisis.",
    patientSummary: "ME/CFS is a long-term illness causing severe exhaustion that gets much worse after even minor physical or mental effort (crashes called PEM), managed by pacing your energy and avoiding overexertion.",
    studentSummary: "Diagnosed using IOM 2015 criteria. Hallmark is Post-Exertional Malaise (PEM). Graded Exercise Therapy (GET) is contraindicated; energy envelope pacing is the standard of care. Rule out Addison's disease and hypothyroidism.",
    keywords: ["chronic fatigue syndrome", "me/cfs", "myalgic encephalomyelitis", "post-exertional malaise", "pem", "chronic exhaustion", "brain fog"],
    semanticKeywords: ["post-viral fatigue syndrome", "cellular bioenergetic impairment", "neuroimmune exhaustion"],
    icd: "G93.32",
    mesh: "D015673",
    bodySystem: "Neuroimmunology & Autonomic Medicine",
    urgency: "routine"
  }
};
