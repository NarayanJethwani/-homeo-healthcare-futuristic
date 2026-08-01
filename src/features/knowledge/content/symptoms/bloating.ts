import { KnowledgeEntity } from "../../types";

export const BloatingSymptom: KnowledgeEntity = {
  id: "S0006",
  slug: "bloating",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Abdominal Bloating",
    hi: "पेट फूलना / अफारा (Abdominal Bloating)",
    gu: "પેટ ફૂલવું (Abdominal Bloating)",
    mr: "पोट फुगणे / वात (Abdominal Bloating)",
    es: "Distensión Abdominal (Abdominal Bloating)",
    ar: "انتفاخ البطن (Abdominal Bloating)"
  },
  summary: {
    en: "Clinical evaluation, differential diagnosis, malignancy red flags, and supportive management for Abdominal Bloating under ACG 2022 and Rome IV guidelines.",
    hi: "पेट फूलने के लक्षण की नैदानिक समझ और चेतावनी लक्षण.",
    gu: "પેટ ફૂલવાના લક્ષણની તબીબી સમજણ અને ચેતવણી લક્ષણો.",
    mr: "पोट फुगण्याच्या लक्षणांची वैद्यकीय माहिती आणि इशारे.",
    es: "Evaluación clínica, diagnóstico diferencial y señales de alarma para la distensión abdominal según ACG 2022.",
    ar: "التقييم السريري وعلامات الخطر لانتفاخ البطن."
  },
  content: {
    definition: "Abdominal Bloating: Subjective sensation of trapped intestinal gas, fullness, or objective abdominal distension resulting from intestinal gas dynamics, visceral hypersensitivity, or gut dysbiosis.",
    clinicalMeaning: "Reflects altered gastrointestinal motility, Small Intestinal Bacterial Overgrowth (SIBO), carbohydrate malabsorption, or organic intra-abdominal pathology.",
    commonCauses: [
      "Irritable Bowel Syndrome (IBS-C or IBS-M), Functional Bloating",
      "Small Intestinal Bacterial Overgrowth (SIBO), Lactose/Fructose Intolerance",
      "Gastroparesis, Chronic Constipation, Celiac Disease",
      "Gynecologic Etiologies (Endometriosis, Ovarian Cysts)"
    ],
    differentialDiagnosis: "Differentiate functional bloating from ascites (hepatic cirrhosis / heart failure), mechanical bowel obstruction, Inflammatory Bowel Disease (IBD), and pelvic/ovarian malignancy.",
    redFlags: [
      "New-onset persistent abdominal distension in women >50 years (rule out Ovarian Cancer)",
      "Unintentional rapid weight loss, chronic nocturnal diarrhea, or GI bleeding (melena)",
      "Progressive severe abdominal pain with persistent vomiting and obstipation (bowel obstruction)",
      "New ascites, fluid wave, or peripheral edema"
    ],
    lifestyleAdvice: "Adopt a low-FODMAP dietary trial, eat smaller frequent meals, limit carbonated drinks and artificial sweeteners, engage in light post-meal walks, and manage constipation.",
    references: [
      "CIT-0073",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0006-001",
        passage: "New-onset unremitting abdominal bloating or distension in postmenopausal women demands pelvic ultrasound and CA-125 measurement to exclude ovarian malignancy.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0006-002",
        passage: "Bloating accompanied by unintentional weight loss, anemia, or blood in stool warrants diagnostic colonoscopy for IBD or colorectal carcinoma.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0006-003",
        passage: "SIBO breath testing (hydrogen/methane) is indicated in refractory bloating unresponsive to standard dietary and motility modifications.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0006-004",
        passage: "Homeopathic supportive remedies (e.g., Lycopodium, Carbo Veg) do not replace diagnostic imaging or oncologic evaluation in persistent distension.",
        citationIds: ["CIT-0023"]
      }
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
  tags: ["Bloating", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/bloating",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Bloating symptom profile"]
};
