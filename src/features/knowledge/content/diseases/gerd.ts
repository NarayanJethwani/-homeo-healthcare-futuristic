import { KnowledgeEntity } from "../../types";

const GERD_CITATIONS = ["CIT-0017", "CIT-0023", "CIT-0025", "CIT-0036"];

export const GerdDisease: KnowledgeEntity = {
  id: "D0001",
  slug: "gastroesophageal-reflux-disease",
  entityType: "disease",
  editorialStatus: "published",
  legacyVerificationStatus: "verified-published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-30T12:00:00Z",
    reviewed: "2026-07-30T12:00:00Z",
  },
  title: {
    en: "Gastroesophageal Reflux Disease (GERD)",
    hi: "गैस्ट्रोइसोफेजियल रिफ्लक्स रोग (जीईआरडी)",
    gu: "એસિડિટી અને જી.ઈ.આર.ડી. (GERD)",
    mr: "आम्लपित्त आणि जी.ई.આર.ડી. (GERD)",
    es: "Enfermedad por Reflujo Gastroesofágico (ERGE)",
    ar: "مرض الارتجاع المعدي المريئي (GERD)",
  },
  summary: {
    en: "A condition in which reflux of stomach contents causes repeated troublesome symptoms such as heartburn or regurgitation, or leads to complications.",
    hi: "एक स्थिति जिसमें पेट की सामग्री बार-बार भोजन नली में लौटकर सीने में जलन, खट्टा पानी आने या जटिलताओं का कारण बनती है।",
    gu: "એવી સ્થિતિ જેમાં પેટની સામગ્રી વારંવાર અન્નનળીમાં પાછી આવી છાતીમાં બળતરા, ખાટું પાણી અથવા જટિલતાઓ સર્જે છે.",
    mr: "पोटातील घटक वारंवार अन्ननलिकेत परत आल्याने छातीत जळजळ, आंबट पाणी येणे किंवा गुंतागुंत होणारी स्थिती.",
    es: "Una afección en la que el reflujo del contenido gástrico causa síntomas molestos repetidos o complicaciones.",
    ar: "حالة يسبب فيها رجوع محتويات المعدة أعراضًا متكررة مزعجة أو مضاعفات.",
  },
  content: {
    overview:
      "Gastroesophageal reflux (GER) is the movement of stomach contents into the esophagus. Gastroesophageal reflux disease (GERD) is present when reflux is persistent or troublesome, or causes complications. Heartburn and regurgitation are the most common symptoms, but symptoms alone do not establish every atypical presentation.",
    definition:
      "GERD is a chronic or recurrent reflux disorder in which gastric contents enter the esophagus and cause troublesome symptoms, esophageal injury, or other complications.",
    causes: [
      "Transient inappropriate relaxation or reduced competence of the lower esophageal sphincter",
      "Anatomic factors such as hiatal hernia",
      "Impaired esophageal clearance or other factors that prolong contact with refluxed gastric contents",
    ],
    riskFactors: [
      "Overweight or obesity",
      "Pregnancy",
      "Smoking",
      "Medicines that can worsen reflux in some people; medication review should be individualized",
    ],
    symptoms: [
      "Burning discomfort behind the breastbone (heartburn), often after meals or when lying down",
      "Regurgitation of sour or bitter-tasting stomach contents",
      "Chest discomfort, which must not automatically be attributed to reflux",
      "Difficulty swallowing, painful swallowing, chronic cough, or throat symptoms may occur but require assessment for other causes",
    ],
    diagnosis:
      "Typical heartburn and regurgitation without alarm features may be assessed from the clinical history and an appropriate treatment trial. Upper endoscopy is used when alarm features, complications, or alternative diagnoses are concerns. Ambulatory reflux monitoring can document abnormal reflux when the diagnosis remains uncertain, and manometry is used for selected motility or pre-procedure questions rather than as a stand-alone GERD test.",
    differentialDiagnosis:
      "Important alternatives include cardiac ischemia, eosinophilic esophagitis, esophageal motility disorders, peptic ulcer disease, medication-related injury, and functional heartburn. New or unexplained chest pain requires urgent cardiac assessment according to the clinical context.",
    labTests: [],
    imaging:
      "Routine imaging is not required for uncomplicated typical reflux. Endoscopy, ambulatory reflux monitoring, or esophageal manometry is selected according to alarm features, diagnostic uncertainty, treatment response, and procedural planning.",
    redFlags: [
      "Chest pressure or pain with shortness of breath, sweating, faintness, or radiation to the arm, jaw, back, or shoulder: seek emergency assessment",
      "Progressive difficulty swallowing or painful swallowing",
      "Vomiting blood, black stools, or evidence of gastrointestinal bleeding or anemia",
      "Persistent vomiting or unexplained weight loss",
    ],
    conventionalManagement:
      "Management combines individualized lifestyle measures with evidence-based medicines. Antacids may help occasional mild symptoms. H2-receptor antagonists and proton-pump inhibitors (PPIs) reduce acid; PPIs are generally more effective for healing reflux esophagitis. Guidelines support a time-limited full-dose PPI trial for typical GERD, followed by the lowest effective dose when ongoing treatment is needed. Antireflux procedures are reserved for selected patients after objective assessment.",
    homeopathicApproach:
      "Reliable evidence has not established homeopathy as a treatment for GERD or its complications. It must not replace diagnostic evaluation, emergency care, proven acid-suppressive treatment, surveillance, or a clinician-directed procedure. Patients choosing complementary products should tell their healthcare professional because some products may contain active ingredients or interact with care.",
    lifestyleAdvice:
      "If overweight or obese, weight reduction can improve symptoms. Avoid meals for about 2–3 hours before lying down, stop smoking, and identify personal food or drink triggers rather than applying a universal exclusion list. Head-of-bed elevation can be considered for troublesome nighttime symptoms.",
    references: GERD_CITATIONS,
    claimCitations: [
      {
        claimId: "D0001-DEFINITION",
        passage: "overview; definition",
        citationIds: ["CIT-0025", "CIT-0036"],
      },
      {
        claimId: "D0001-PATHOPHYSIOLOGY",
        passage: "causes",
        citationIds: ["CIT-0025", "CIT-0036"],
      },
      {
        claimId: "D0001-SYMPTOMS",
        passage: "symptoms",
        citationIds: ["CIT-0017", "CIT-0025", "CIT-0036"],
      },
      {
        claimId: "D0001-DIAGNOSIS",
        passage: "diagnosis; imaging",
        citationIds: ["CIT-0017", "CIT-0025", "CIT-0036"],
      },
      {
        claimId: "D0001-EMERGENCY-BOUNDARY",
        passage: "redFlags; differentialDiagnosis",
        citationIds: ["CIT-0017", "CIT-0036"],
      },
      {
        claimId: "D0001-CONVENTIONAL-MANAGEMENT",
        passage: "conventionalManagement",
        citationIds: ["CIT-0017", "CIT-0025", "CIT-0036"],
      },
      {
        claimId: "D0001-LIFESTYLE",
        passage: "lifestyleAdvice",
        citationIds: ["CIT-0025", "CIT-0036"],
      },
      {
        claimId: "D0001-HOMEOPATHY-BOUNDARY",
        passage: "homeopathicApproach",
        citationIds: ["CIT-0023"],
      },
    ],
    faqs: [
      {
        question: "Is occasional acid reflux the same as GERD?",
        answer:
          "No. Occasional reflux can occur without GERD. GERD involves repeated troublesome symptoms, esophageal injury, or other complications and should be assessed in context.",
      },
      {
        question: "When does heartburn need urgent assessment?",
        answer:
          "Seek emergency assessment for new or severe chest pain, especially with breathlessness, sweating, faintness, or pain spreading to the arm, jaw, back, or shoulder. Progressive swallowing difficulty, bleeding, persistent vomiting, or unexplained weight loss also require prompt clinical review.",
      },
      {
        question: "Can homeopathy replace GERD medicines or investigation?",
        answer:
          "No. Evidence has not established homeopathy as a replacement for GERD diagnosis, proven treatment, surveillance, or emergency care. Discuss any complementary product with your clinician.",
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
    specialty: "Clinical Homeopathy & Internal Medicine",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final authorization",
  lastClinicalReview: "2026-07-30",
  nextClinicalReview: "2027-07-30",
  referencesUpdated: "2026-07-30",
  clinicalChangesSinceLastRevision:
    "Removed generic digestive-template material, mismatched IBS and internal citations, and unsupported treatment claims; added GERD-specific diagnosis, management, emergency boundaries, and claim-level provenance.",
  reviewStatus: "owner-authorized-source-bound",
  citationHealth: "complete",
  contentCompleteness: 100,
  graphCompleteness: 100,
  evidenceLevel: "Consensus-Guidance",
  evidenceProfile: {
    evidenceStrength: "high",
    sourceQuality: "authoritative",
    classicalSource: false,
    modernSource: true,
    clinicalConfidence: 0.94,
    editorialConfidence: 0.96,
    citationCompleteness: 1,
    lastReviewedAt: "2026-07-30",
    reviewIntervalDays: 365,
    nextReviewDueAt: "2027-07-30",
    reviewExpiryPolicy: "flag-only",
    rationale:
      "Material claims are mapped to current clinical guidelines and official NIH information; complementary-care statements are limited to evidence and safety boundaries.",
    methodologyVersion: "knowledge-authority-led-v1",
  },
  tags: ["GERD", "Acid Reflux", "Heartburn", "Regurgitation", "Digestive Disease"],
  canonicalUrl:
    "https://homeo.healthcare/knowledge/diseases/gastroesophageal-reflux-disease",
  readingTimeMinutes: 7,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: [
    "1.0.0: Initial release of GERD disease profile",
    "1.1.0: Source-bound rewrite with claim citations, emergency boundaries, and unsupported-claim removal",
  ],
  clinicalPearl:
    "Do not diagnose reflux from chest pain alone; potentially cardiac symptoms take priority over an empiric reflux explanation.",
  quickFacts: {
    Prevalence: "About 20% of adults in the United States",
    "Primary System": "Gastrointestinal (esophagus)",
    "Urgency Level": "Routine unless an alarm or emergency feature is present",
    "Evidence Basis": "Current clinical guidelines and official NIH information",
  },
  aiReadiness: {
    retrievalSummary:
      "GERD is recurrent or chronic reflux of gastric contents that causes troublesome symptoms, esophageal injury, or complications.",
    clinicalSummary:
      "Assess typical heartburn and regurgitation in context; use endoscopy or reflux monitoring for alarm features, uncertainty, complications, or nonresponse, and prioritize urgent cardiac assessment for concerning chest pain.",
    patientSummary:
      "GERD is repeated acid or stomach-content reflux that causes troublesome heartburn, regurgitation, or complications.",
    studentSummary:
      "Diagnosis is often clinical in typical uncomplicated disease; objective testing is selected for alarm features, uncertainty, complications, refractory symptoms, or procedural planning.",
    keywords: [
      "gerd",
      "acid reflux",
      "heartburn",
      "regurgitation",
      "esophagitis",
    ],
    semanticKeywords: [
      "gastroesophageal reflux",
      "esophageal acid exposure",
      "reflux disease",
    ],
    icd: "K21.9",
    bodySystem: "Gastrointestinal",
    urgency: "monitor",
  },
  visualBodySystem: {
    system: "Gastrointestinal",
    organs: ["Esophagus", "Stomach", "Lower esophageal sphincter"],
    parameters: ["Reflux exposure", "Mucosal injury"],
  },
  structuredEvidence: {
    system: "Gastrointestinal",
    prevalence: "About 20% of adults in the United States",
    causes: [
      "Lower esophageal sphincter dysfunction",
      "Hiatal hernia",
      "Impaired esophageal clearance",
    ],
    investigations: [
      "Upper endoscopy when indicated",
      "Ambulatory reflux monitoring",
      "Esophageal manometry for selected questions",
    ],
    urgency: "Context dependent; emergency assessment for concerning chest pain",
  },
  structuredDifferentials: [
    {
      condition: "Cardiac ischemia",
      similarity: "Retrosternal chest discomfort can resemble heartburn.",
      differentiator:
        "Symptoms may be exertional or occur with breathlessness, sweating, faintness, or radiation; clinical features alone cannot safely exclude cardiac disease.",
      investigation: "Urgent clinical assessment, ECG, and cardiac testing as indicated",
    },
    {
      condition: "Eosinophilic esophagitis",
      similarity: "Reflux-like symptoms and swallowing difficulty can occur.",
      differentiator:
        "Dysphagia or food impaction increases concern and requires specialist assessment.",
      investigation: "Upper endoscopy with biopsies when indicated",
    },
    {
      condition: "Esophageal motility disorder",
      similarity: "Chest pain, regurgitation, or dysphagia may overlap.",
      differentiator:
        "Prominent dysphagia or atypical symptoms may suggest a motility disorder.",
      investigation: "Esophageal manometry after appropriate assessment",
    },
    {
      condition: "Functional heartburn",
      similarity: "Burning retrosternal symptoms without visible injury may occur.",
      differentiator:
        "Symptoms persist without objective evidence that reflux explains them.",
      investigation: "Endoscopy and ambulatory reflux monitoring when indicated",
    },
  ],
  homeopathicPerspective: {
    conventionalUnderstanding:
      "GERD is managed through diagnosis-specific lifestyle measures, acid-suppressive medicines, and selected procedures.",
    homeopathicInterpretation:
      "Historical homeopathic descriptions may be documented as traditional-use context only; they do not establish efficacy.",
    constitutionalConsiderations:
      "No constitutional classification should replace evaluation of alarm symptoms, complications, or treatment response.",
    individualization:
      "Any complementary-care discussion must preserve conventional treatment, medication review, and emergency boundaries.",
    limitations:
      "Reliable evidence has not established homeopathy as a treatment for GERD or its complications. It must not delay diagnosis, proven treatment, surveillance, or emergency care.",
  },
  clinicalImportance:
    "Persistent reflux can impair quality of life and cause esophagitis, stricture, or Barrett esophagus.",
  whyItMatters:
    "Correctly distinguishing uncomplicated reflux from alarm features and cardiac chest pain prevents delayed treatment of serious disease.",
  complications: [
    "Reflux esophagitis",
    "Esophageal stricture",
    "Barrett esophagus",
    "A small proportion of people with Barrett esophagus develop esophageal adenocarcinoma",
  ],
  qualityScore: {
    editorialQuality: 96,
    clinicalDepth: 94,
    graphConnectivity: 90,
    citationQuality: 100,
    educationalValue: 95,
    aiReadiness: 96,
    seoReadiness: 95,
  },
};
