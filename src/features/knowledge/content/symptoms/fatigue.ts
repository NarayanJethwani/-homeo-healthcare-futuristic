import { KnowledgeEntity } from "../../types";

export const FatigueSymptom: KnowledgeEntity = {
  id: "S0013",
  slug: "fatigue",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Chronic Fatigue and Weakness",
    hi: "थकान और कमजोरी (Chronic Fatigue)",
    gu: "થાક અને બળહીનતા (Chronic Fatigue)",
    mr: "थकवा आणि अशक्तपणा (Chronic Fatigue)",
    es: "Fatiga Crónica (Chronic Fatigue)",
    ar: "الإجهاد والتعب المزمن (Chronic Fatigue)"
  },
  summary: {
    en: "Clinical evaluation, differential diagnosis, systemic red flag screening, and supportive management for Fatigue under AACN 2021 guidelines.",
    hi: "थकान के लक्षण की नैदानिक समझ और प्रणालीगत चेतावनी लक्षण.",
    gu: "થાકના લક્ષણની તબીબી સમજણ અને ઈમરજન્સી ચેતવણી લક્ષણો.",
    mr: "थकव्याच्या लक्षणांची वैद्यकीय माहिती आणि इशारे.",
    es: "Evaluación clínica, diagnóstico diferencial y señales de alarma de la fatiga según AACN 2021.",
    ar: "التقييم السريري وعلامات الخطر للإجهاد."
  },
  content: {
    definition: "Fatigue: Subjective perception of persistent, overwhelming exhaustion, lack of energy, or physical/mental tiredness not relieved by sleep or rest.",
    clinicalMeaning: "Reflects systemic metabolic impairment, chronic anemia, occult malignancy, endocrine failure (hypothyroidism/adrenal insufficiency), or myalgic encephalomyelitis / chronic fatigue syndrome (ME/CFS).",
    commonCauses: [
      "Iron Deficiency Anemia, Vitamin B12 / Folate / Vitamin D Deficiency",
      "Hypothyroidism, Diabetes Mellitus, Adrenal Insufficiency",
      "Sleep Apnea (OSA), Chronic Insomnia, Post-Viral Fatigue (Long COVID)",
      "Depression, Anxiety Disorder, Fibromyalgia, Myalgic Encephalomyelitis (ME/CFS)"
    ],
    differentialDiagnosis: "Differentiate functional fatigue from occult systemic malignancy (lymphoma, leukemia, solid tumors), congestive heart failure, chronic kidney disease (uremic fatigue), and autoimmune Connective Tissue Diseases.",
    redFlags: [
      "Unexplained significant weight loss (>5% body weight), drenching night sweats, or painless lymphadenopathy",
      "Severe dyspnea on exertion, orthopnea, or lower extremity peripheral edema (Heart Failure)",
      "Severe postural dizziness, hyperpigmentation, hypotension, or hyponatremia (Addisonian Crisis)",
      "New focal neurological motor deficits, severe cognitive decline, or persistent fever"
    ],
    lifestyleAdvice: "Maintain regular sleep hygiene, practice gentle graded aerobic exercise, optimize balanced nutrition, stay hydrated, and manage chronic psychological stress.",
    references: [
      "CIT-0078",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0013-001",
        passage: "Unexplained persistent fatigue lasting >4 weeks requires initial laboratory evaluation including CBC, TSH, Ferritin, Metabolic Panel, and Inflammatory Markers.",
        citationIds: ["CIT-0078"]
      },
      {
        claimId: "CLM-S0013-002",
        passage: "Fatigue accompanied by lymphadenopathy, fever, and drenching night sweats mandates prompt evaluation for occult hematologic or solid organ malignancy.",
        citationIds: ["CIT-0078"]
      },
      {
        claimId: "CLM-S0013-003",
        passage: "Severe orthostatic intolerance and post-exertional malaise (PEM) lasting >6 months define diagnostic criteria for Myalgic Encephalomyelitis / Chronic Fatigue Syndrome.",
        citationIds: ["CIT-0078"]
      },
      {
        claimId: "CLM-S0013-004",
        passage: "Homeopathic constitutional remedies (e.g., Arsenicum Album, Kali Phos, Gelsemium) do not substitute for oncologic screening or endocrine hormone replacement in severe fatigue.",
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
  tags: ["Fatigue", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/fatigue",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Fatigue symptom profile"]
};
