import { KnowledgeEntity } from "../../types";

export const AbdominalPainSymptom: KnowledgeEntity = {
  id: "S0012",
  slug: "abdominal-pain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Abdominal Pain",
    hi: "पेट दर्द (Abdominal Pain)",
    gu: "પેટમાં દુખાવો (Abdominal Pain)",
    mr: "पोटदुखी (Abdominal Pain)",
    es: "Dolor Abdominal (Abdominal Pain)",
    ar: "ألم البطن (Abdominal Pain)"
  },
  summary: {
    en: "Clinical evaluation, differential diagnosis, emergency red flags, and supportive management for Abdominal Pain under ACG 2021 guidelines.",
    hi: "पेट दर्द लक्षण की नैदानिक समझ और आपातकालीन चेतावनी लक्षण.",
    gu: "પેટમાં દુખાવાની તબીબી સમજણ અને ઈમરજન્સી રેડ ફ્લેગ્સ.",
    mr: "पोटदुखीच्या लक्षणांची वैद्यकीय माहिती आणि आपत्कालीन इशारे.",
    es: "Evaluación clínica, diagnóstico diferencial y señales de alarma para el dolor abdominal según ACG 2021.",
    ar: "التقييم السريري والتشخيص التفريقي وعلامات الخطر لألم البطن."
  },
  content: {
    definition: "Abdominal Pain: Sensation of discomfort or acute pain arising from visceral organs, parietal peritoneum, or abdominal wall nerve roots within the gastrointestinal, genitourinary, or vascular systems.",
    clinicalMeaning: "Reflects visceral distension, mucosal inflammation, ischemia, or peritoneal irritation demanding rapid triage between self-limiting functional pain and life-threatening surgical acute abdomen.",
    commonCauses: [
      "Gastroenteritis, Irritable Bowel Syndrome (IBS), Dyspepsia",
      "Acute Appendicitis, Cholecystitis, Diverticulitis, Pancreatitis",
      "Peptic Ulcer Disease, GERD, Inflammatory Bowel Disease (IBD)",
      "Urolithiasis, Urinary Tract Infection, Gynecologic Etiologies"
    ],
    differentialDiagnosis: "Differentiate acute surgical abdomen (peritonitis, perforation, mesenteric ischemia, ruptured AAA) from functional GI disorders, renal colic, and referred extra-abdominal pain (inferior wall MI, basal pneumonia).",
    redFlags: [
      "Board-like abdominal rigidity, severe rebound tenderness, or localized peritonitis",
      "High fever with chills, hypotension, tachycardic shock, or altered sensorium",
      "Inconsolable pain disproportionate to examination (mesenteric ischemia)",
      "Hematemesis, melena, hematochezia, or syncope (Ruptured AAA / Ectopic Pregnancy)"
    ],
    lifestyleAdvice: "Maintain hydration with oral fluids, consume light easily digestible meals, avoid NSAIDs in acute unexplained pain, and seek immediate emergency evaluation if pain worsens rapidly or is accompanied by fever or vomiting.",
    references: [
      "CIT-0072",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0001-001",
        passage: "Abdominal pain with involuntary guarding and rebound tenderness indicates parietal peritoneal irritation requiring immediate surgical consultation.",
        citationIds: ["CIT-0072"]
      },
      {
        claimId: "CLM-S0001-002",
        passage: "Severe acute abdominal pain associated with hemodynamic instability or gastrointestinal hemorrhage requires emergency IV resuscitation and urgent imaging.",
        citationIds: ["CIT-0072"]
      },
      {
        claimId: "CLM-S0001-003",
        passage: "Pain localized to the Right Lower Quadrant (McBurney's point) with fever and anorexia strongly points to Acute Appendicitis.",
        citationIds: ["CIT-0072"]
      },
      {
        claimId: "CLM-S0001-004",
        passage: "Homeopathic supportive remedies (e.g., Colocynthis, Nux Vomica) do not replace surgical intervention or emergency hospitalization in peritonitis.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What causes muscle stiffness in the morning?",
      "answer": "Morning stiffness is often caused by localized inflammation, muscle inactivity during sleep, or structural degenerative joint changes that temporarily reduce synovial fluid circulation."
    },
    {
      "question": "How does stress affect nerve and muscle pain?",
      "answer": "Stress increases muscle tension and heightens pain sensitivity (central sensitization) by releasing stress hormones that lower the pain threshold."
    },
    {
      "question": "What is the homeopathic approach to physical injury?",
      "answer": "Homeopathy uses remedies like Arnica Montana to manage acute swelling and bruising, and Rhus Tox or Bryonia for joint stiffness and pain, tailored to whether movement improves or worsens the symptoms."
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
  tags: ["Abdominal Pain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/abdominal-pain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Abdominal Pain symptom profile"]
};
