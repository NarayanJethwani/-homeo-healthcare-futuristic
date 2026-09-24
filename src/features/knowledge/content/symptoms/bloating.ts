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
    en: "Bloating is a feeling of fullness, tightness, or a visibly swollen tummy. It is common, but regular or painful bloating needs assessment.",
    hi: "पेट फूलने के लक्षण की नैदानिक समझ और चेतावनी लक्षण.",
    gu: "પેટ ફૂલવાના લક્ષણની તબીબી સમજણ અને ચેતવણી લક્ષણો.",
    mr: "पोट फुगण्याच्या लक्षणांची वैद्यकीय माहिती आणि इशारे.",
    es: "Evaluación clínica, diagnóstico diferencial y señales de alarma para la distensión abdominal según ACG 2022.",
    ar: "التقييم السريري وعلامات الخطر لانتفاخ البطن."
  },
  content: {
    definition: "Bloating is a feeling that the tummy is full, tight, or swollen. It may occur with extra gas, constipation, eating patterns, food intolerance, or an underlying digestive condition.",
    clinicalMeaning: "Occasional bloating is common. The timing, bowel pattern, diet, pain, and whether the tummy is visibly enlarging help determine whether self-care or medical assessment is appropriate.",
    commonCauses: [
      "Gas from food and drinks, fizzy drinks, or swallowing air while eating",
      "Constipation, IBS, coeliac disease, or food intolerance",
      "Menstrual or gynaecological causes where relevant",
      "A medicine effect or another digestive condition needing assessment"
    ],
    differentialDiagnosis: "A clinician may review diet, bowel habits, medicines, periods or pelvic symptoms, weight, and examine the abdomen. Persistent symptoms may need testing based on the wider picture.",
    redFlags: [
      "Get urgent advice for bloating with vomiting, diarrhoea or constipation, tummy pain, fever, a new lump, or being unable to pee, poo, or pass wind.",
      "Seek emergency help for sudden severe abdominal pain, vomiting blood or coffee-ground material, or severe breathing difficulty.",
      "Arrange a review for regular bloating, unintentional weight loss, blood in stool, or symptoms that do not improve after simple changes."
    ],
    lifestyleAdvice: "Eat slowly, avoid large late meals and fizzy drinks if they trigger symptoms, move gently after meals, and address constipation. Keep a simple food-and-symptom record. Do not make broad restrictive diet changes without professional advice, particularly if weight is falling.",
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
      "question": "What commonly causes bloating?",
      "answer": "Gas, constipation, certain foods or drinks, IBS, and food intolerance are common contributors. The pattern matters more than a single food list."
    },
    {
      "question": "Should I stop eating many foods?",
      "answer": "Avoiding a personal trigger can help, but do not make extensive restrictions without a clinician or dietitian, especially if you are losing weight or have persistent symptoms."
    },
    {
      "question": "When is bloating urgent?",
      "answer": "Sudden severe tummy pain, vomiting blood, or inability to pass urine, stool, or wind needs urgent help."
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
