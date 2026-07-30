import { KnowledgeEntity } from "../../types";

const HEARTBURN_CITATIONS = ["CIT-0017", "CIT-0023", "CIT-0025", "CIT-0036"];

export const HeartburnSymptom: KnowledgeEntity = {
  id: "S0001",
  slug: "heartburn",
  entityType: "symptom",
  editorialStatus: "medical-review",
  legacyVerificationStatus: "review-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z",
  },
  title: {
    en: "Heartburn / Acid Regurgitation",
    hi: "छाती में जलन / खट्टा पानी आना",
    gu: "છાતીમાં બળતરા / એસિડિટી",
    mr: "छातीत जळजळ / आम्लपित्त",
    es: "Acidez / Regurgitación Ácida",
    ar: "حرقة المعدة / الارتجاع الحمضي",
  },
  summary: {
    en: "Heartburn is a burning feeling behind the breastbone, often rising toward the throat. It is commonly caused by reflux but chest pain must not automatically be assumed to be digestive.",
    hi: "हार्टबर्न छाती की हड्डी के पीछे जलन है जो गले की ओर बढ़ सकती है। यह अक्सर रिफ्लक्स से होती है, लेकिन सीने के दर्द को अपने-आप पाचन संबंधी नहीं मानना चाहिए।",
    gu: "હાર્ટબર્ન છાતીના હાડકાં પાછળની બળતરા છે જે ગળા તરફ જઈ શકે છે. તે ઘણીવાર રિફ્લક્સથી થાય છે, પરંતુ છાતીના દુખાવાને આપમેળે પાચન તકલીફ ન માનવી.",
    mr: "हार्टबर्न म्हणजे छातीच्या हाडामागील जळजळ जी घशाकडे जाऊ शकते. ती अनेकदा रिफ्लक्समुळे होते, पण छातीचे दुखणे आपोआप पचनाशी संबंधित मानू नये.",
    es: "La acidez es una sensación de ardor detrás del esternón que puede subir hacia la garganta; el dolor torácico no debe atribuirse automáticamente al reflujo.",
    ar: "حرقة المعدة إحساس حارق خلف عظم الصدر قد يصعد نحو الحلق، ولا ينبغي افتراض أن ألم الصدر سببه الارتجاع تلقائيًا.",
  },
  content: {
    definition:
      "Heartburn is a burning sensation behind the breastbone that may rise toward the throat. Regurgitation is the return of sour or bitter stomach contents into the throat or mouth. They are related but distinct symptoms.",
    clinicalMeaning:
      "Occasional heartburn may occur with gastroesophageal reflux. Frequent, troublesome, persistent, or complicated symptoms may indicate GERD or another disorder and should be assessed in clinical context.",
    commonCauses: [
      "Gastroesophageal reflux, including GERD",
      "Pregnancy or increased abdominal pressure",
      "Meals, posture, smoking, or individual food and drink triggers that worsen reflux",
      "Functional heartburn or another esophageal disorder when objective reflux does not explain symptoms",
    ],
    differentialDiagnosis:
      "Potential alternatives include cardiac ischemia, eosinophilic esophagitis, esophageal motility disorders, medication-related esophageal injury, peptic ulcer disease, and functional heartburn. New, severe, or unexplained chest pain requires priority assessment for cardiac and other urgent causes.",
    redFlags: [
      "Chest pressure or pain with shortness of breath, sweating, faintness, or radiation to the arm, jaw, back, or shoulder: seek emergency assessment",
      "Progressive difficulty swallowing, painful swallowing, or food impaction",
      "Vomiting blood, black stools, or evidence of gastrointestinal bleeding or anemia",
      "Persistent vomiting or unexplained weight loss",
    ],
    lifestyleAdvice:
      "Avoid lying down for about 2–3 hours after eating, stop smoking, and identify personal triggers rather than applying a universal food-ban list. If overweight or obese, weight reduction can improve reflux symptoms. Persistent or recurrent symptoms should be reviewed by a clinician.",
    references: HEARTBURN_CITATIONS,
    claimCitations: [
      {
        claimId: "S0001-DEFINITION",
        passage: "definition",
        citationIds: ["CIT-0025", "CIT-0036"],
      },
      {
        claimId: "S0001-CLINICAL-MEANING",
        passage: "clinicalMeaning; commonCauses",
        citationIds: ["CIT-0017", "CIT-0025", "CIT-0036"],
      },
      {
        claimId: "S0001-DIFFERENTIAL",
        passage: "differentialDiagnosis",
        citationIds: ["CIT-0017", "CIT-0036"],
      },
      {
        claimId: "S0001-EMERGENCY-BOUNDARY",
        passage: "redFlags",
        citationIds: ["CIT-0017", "CIT-0036"],
      },
      {
        claimId: "S0001-LIFESTYLE",
        passage: "lifestyleAdvice",
        citationIds: ["CIT-0025", "CIT-0036"],
      },
      {
        claimId: "S0001-HOMEOPATHY-BOUNDARY",
        passage: "FAQ: complementary-care boundary",
        citationIds: ["CIT-0023"],
      },
    ],
    faqs: [
      {
        question: "Does heartburn always mean GERD?",
        answer:
          "No. Heartburn is a symptom. GERD is considered when reflux symptoms are recurrent or troublesome, or when reflux causes injury or complications.",
      },
      {
        question: "Can I assume burning chest pain is acidity?",
        answer:
          "No. New, severe, or unexplained chest pain—especially with breathlessness, sweating, faintness, or pain spreading to the arm, jaw, back, or shoulder—needs emergency assessment.",
      },
      {
        question: "Can homeopathy replace evaluation or treatment?",
        answer:
          "No. Evidence has not established homeopathy as a replacement for diagnosis, proven reflux treatment, or emergency care. Discuss complementary products with your clinician.",
      },
    ],
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewerRole: "Program-owner final authorization",
  lastClinicalReview: "2026-06-30",
  referencesUpdated: "2026-07-30",
  clinicalChangesSinceLastRevision:
    "Removed generic digestive-template material, mismatched citations, and unsupported efficacy wording; added symptom-specific differential, alarm features, and claim-level provenance.",
  reviewStatus: "owner-final-authorization-pending",
  citationHealth: "complete",
  contentCompleteness: 100,
  graphCompleteness: 100,
  evidenceLevel: "Consensus-Guidance",
  evidenceProfile: {
    evidenceStrength: "high",
    sourceQuality: "authoritative",
    classicalSource: false,
    modernSource: true,
    clinicalConfidence: 0.93,
    editorialConfidence: 0.96,
    citationCompleteness: 1,
    reviewIntervalDays: 365,
    reviewExpiryPolicy: "flag-only",
    rationale:
      "Definition, differential, emergency boundary, and self-care passages are mapped to clinical guidelines and official NIH information.",
    methodologyVersion: "knowledge-authority-led-v1",
  },
  tags: ["Heartburn", "Acid Reflux", "Regurgitation", "Chest Burning", "GERD"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/heartburn",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Heartburn symptom profile",
    "1.1.0: Source-bound rewrite with emergency boundary and claim-level citations",
  ],
  clinicalPearl:
    "Heartburn is a symptom, not a diagnosis; new or concerning chest pain must be assessed before it is attributed to reflux.",
  quickFacts: {
    "Symptom Type": "Retrosternal burning",
    "Common Association": "Gastroesophageal reflux",
    "Urgency Level": "Context dependent; emergency if concerning chest-pain features are present",
    "Evidence Basis": "Current clinical guidelines and official NIH information",
  },
  aiReadiness: {
    retrievalSummary:
      "Heartburn is burning retrosternal discomfort that may rise toward the throat and is commonly associated with reflux.",
    clinicalSummary:
      "Do not equate all burning chest discomfort with GERD; assess alarm features and prioritize urgent cardiac evaluation for concerning chest pain.",
    patientSummary:
      "Heartburn is burning behind the breastbone, often caused by reflux, but some chest pain needs urgent assessment.",
    studentSummary:
      "Heartburn and regurgitation are typical reflux symptoms; persistent symptoms, alarm features, or uncertain diagnosis require targeted evaluation.",
    keywords: ["heartburn", "acid reflux", "regurgitation", "chest burning"],
    semanticKeywords: ["retrosternal burning", "pyrosis", "reflux symptom"],
    bodySystem: "Gastrointestinal",
    urgency: "monitor",
  },
  qualityScore: {
    editorialQuality: 96,
    clinicalDepth: 92,
    graphConnectivity: 90,
    citationQuality: 100,
    educationalValue: 94,
    aiReadiness: 96,
    seoReadiness: 94,
  },
};
