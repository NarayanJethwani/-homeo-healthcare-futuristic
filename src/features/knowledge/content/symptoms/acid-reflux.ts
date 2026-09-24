import { KnowledgeEntity } from "../../types";

export const AcidRefluxSymptom: KnowledgeEntity = {
  id: "S0045",
  slug: "acid-reflux",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Acid Reflux (Heartburn)",
    hi: "एसिड रिफ्लक्स / खट्टी डकार (Acid Reflux)",
    gu: "એસિડ રિફ્લક્સ / એસિડિટી (Acid Reflux)",
    mr: "ॲसिड रिफ्लक्स / पित्त (Acid Reflux)",
    es: "Reflujo Ácido (Acid Reflux)",
    ar: "ارتجاع الحمض (Acid Reflux)"
  },
  summary: {
    en: "Acid reflux is stomach acid travelling toward the throat, often causing heartburn or a sour taste. Recurrent reflux and swallowing problems should be assessed.",
    hi: "एसिड रिफ्लक्स लक्षण की नैदानिक समझ और चेतावनी लक्षण.",
    gu: "એસિડ રિફ્લક્સ લક્ષણની તબીબી સમજણ અને ચેતવણી લક્ષણો.",
    mr: "ॲसिड रिफ्लक्स लक्षणांची वैद्यकीय माहिती आणि इशारे.",
    es: "Evaluación clínica, síntomas de alarma y manejo del reflujo ácido según ACG 2022.",
    ar: "التقييم السريري وعلامات الخطر لارتجاع الحمض."
  },
  content: {
    definition: "Acid reflux happens when stomach acid travels up into the food pipe, causing heartburn, a sour taste, or food and fluid coming back up. Repeated troublesome reflux may be called GORD or GERD.",
    clinicalMeaning: "Symptoms often worsen after eating, when bending, or lying down. Persistent symptoms need review because other conditions can look similar and treatment may be needed.",
    commonCauses: [
      "Reflux or a hiatus hernia",
      "Pregnancy, increased abdominal pressure, or being overweight",
      "Personal food and drink triggers, smoking, or alcohol",
      "Some medicines or a delayed stomach emptying pattern"
    ],
    differentialDiagnosis: "Chest pain must not be assumed to be reflux. A clinician may consider heart conditions, swallowing disorders, ulcers, medication effects, and other digestive causes.",
    redFlags: [
      "Call emergency services for new or severe chest pressure or pain with breathlessness, sweating, faintness, or pain spreading to the arm, jaw, shoulder, or back.",
      "Arrange prompt advice for food sticking, painful swallowing, frequent vomiting, vomiting blood, black stools, or unexplained weight loss.",
      "Book a review if heartburn happens most days or pharmacy treatment and lifestyle changes are not helping."
    ],
    lifestyleAdvice: "Avoid lying down for two to three hours after eating, identify personal triggers rather than using a universal ban list, stop smoking, and consider weight support if relevant. A pharmacist can advise on antacids or alginates; do not use them regularly for long periods without advice.",
    references: [
      "CIT-0073",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0002-001",
        passage: "Alarm features such as dysphagia, odynophagia, GI bleeding, or weight loss in acid reflux mandate prompt upper gastrointestinal endoscopy.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0002-002",
        passage: "Retrosternal burning pain must be clinically differentiated from acute coronary syndrome prior to diagnosing uncomplicated GERD.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0002-003",
        passage: "Chronic acid reflux persisting over 5 years in patients over 50 requires screening for Barrett's Esophagus and esophageal adenocarcinoma.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0002-004",
        passage: "Homeopathic supportive care (e.g., Nux Vomica, Robinia) does not replace diagnostic endoscopy in patients with GERD alarm symptoms.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What is the difference between reflux and heartburn?",
      "answer": "Reflux is stomach acid travelling upward. Heartburn is the burning chest sensation it commonly causes."
    },
    {
      "question": "Can I use antacids?",
      "answer": "A pharmacist can help you choose a suitable antacid or alginate and explain how to use it. Persistent or daily symptoms should be reviewed."
    },
    {
      "question": "When is reflux urgent?",
      "answer": "Emergency chest pain symptoms, food sticking, painful swallowing, vomiting blood, black stools, frequent vomiting, or unexplained weight loss need prompt medical assessment."
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
  tags: ["Acid Reflux", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/acid-reflux",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Acid Reflux symptom profile"]
};
