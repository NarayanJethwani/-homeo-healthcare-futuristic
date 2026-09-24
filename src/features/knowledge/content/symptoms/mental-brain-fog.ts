import { KnowledgeEntity } from "../../types";

export const MentalBrainFogSymptom: KnowledgeEntity = {
  id: "S0061",
  slug: "mental-brain-fog",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Brain Fog",
    hi: "Mental Brain Fog",
    gu: "Mental Brain Fog",
    mr: "Mental Brain Fog",
    es: "Mental Brain Fog",
    ar: "Mental Brain Fog"
  },
  summary: {
    en: "Brain fog is a non-medical term for difficulty concentrating, remembering, finding words, or thinking clearly. New or sudden confusion needs urgent assessment.",
    hi: "Mental Brain Fog के लक्षण की नैदानिक समझ.",
    gu: "Mental Brain Fog ના લક્ષણ ની સમજણ.",
    mr: "Mental Brain Fog चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Mental Brain Fog.",
    ar: "التعريف السريري والأهمية لـ Mental Brain Fog."
  },
  content: {
  "definition": "Brain fog describes cognitive symptoms such as slowed thinking, poor attention, forgetfulness, difficulty finding words, or feeling mentally overloaded. It is a symptom, not a diagnosis.",
  "clinicalMeaning": "It can occur with poor sleep, fatigue, stress, pain, medicines, mood problems, infection recovery, or other health conditions. The timing, severity, and effect on daily life help guide assessment.",
  "commonCauses": [
    "Poor or disrupted sleep, fatigue, pain, stress, anxiety, or low mood",
    "Recovery from an illness, including a post-viral illness",
    "Medicines, alcohol or other substances, dehydration, or low food intake",
    "Conditions such as anaemia, thyroid disease, diabetes, or vitamin deficiency that need proper assessment"
  ],
  "differentialDiagnosis": "A clinician may review sleep, mood, stress, illness, medicines, nutrition, and associated symptoms. New confusion, delirium, or sudden neurological symptoms are different from gradual brain fog and need urgent care.",
  "redFlags": [
    "Seek emergency care for sudden confusion, trouble speaking or understanding, facial droop, new weakness or numbness, a seizure, or a sudden severe headache.",
    "Seek urgent help for brain fog with chest pain, severe breathlessness, fainting, or a high fever with marked drowsiness or confusion.",
    "Arrange a clinical review if it is persistent, worsening, new after a medicine change, or affecting work, study, driving, or safety."
  ],
  "lifestyleAdvice": "Reduce mental overload where possible: use short lists, single-task, take regular breaks, rest after demanding activity, and keep a consistent sleep and meal routine. Note patterns with symptoms, sleep, medicines, and activity to make an assessment more useful.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Is brain fog the same as dementia?",
      "answer": "No. Brain fog is a broad term for temporary or fluctuating concentration and memory difficulties. Persistent or progressive memory changes should still be discussed with a clinician."
    },
    {
      "question": "What should I record before an appointment?",
      "answer": "Note when symptoms started, what makes them better or worse, sleep, recent illness, medicines or supplements, mood, diet, and any associated symptoms such as fatigue, dizziness, palpitations, or headache."
    },
    {
      "question": "When is brain fog urgent?",
      "answer": "Sudden confusion or cognitive change with speech difficulty, weakness, facial droop, seizure, severe headache, chest pain, or severe breathlessness is an emergency."
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
  tags: ["Mental Brain Fog", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/mental-brain-fog",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Mental Brain Fog symptom profile"]
};
