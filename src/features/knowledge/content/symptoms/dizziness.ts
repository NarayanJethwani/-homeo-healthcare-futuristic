import { KnowledgeEntity } from "../../types";

export const DizzinessSymptom: KnowledgeEntity = {
  id: "S0029",
  slug: "dizziness",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Dizziness and Vertigo",
    hi: "चक्कर आना (Dizziness and Vertigo)",
    gu: "ચક્કર આવવા (Dizziness and Vertigo)",
    mr: "चक्कर येणे (Dizziness and Vertigo)",
    es: "Mareo y Vértigo (Dizziness and Vertigo)",
    ar: "الدوخة والدوار (Dizziness and Vertigo)"
  },
  summary: {
    en: "Clinical evaluation, differential diagnosis, central stroke red flags (HINTS examination), and supportive management for Dizziness under AAN 2020 guidelines.",
    hi: "चक्कर आने के लक्षण की नैदानिक समझ और स्ट्रोक चेतावनी लक्षण.",
    gu: "ચક્કર આવવાના લક્ષણની તબીબી સમજણ અને ઈમરજન્સી ચેતવણી લક્ષણો.",
    mr: "चक्कर येण्याच्या लक्षणांची वैद्यकीय माहिती आणि आपत्कालीन इशारे.",
    es: "Evaluación clínica, examen HINTS y señales de alarma de ictus según AAN 2020.",
    ar: "التقييم السريري وعلامات الخطر للدوخة."
  },
  content: {
    definition: "Dizziness: A broad clinical term encompassing rotational spinning sensation (Vertigo), lightheadedness/presyncope, disequilibrium, or non-specific spatial disorientation.",
    clinicalMeaning: "Reflects vestibular nerve or inner ear pathology (BPPV, vestibular neuritis), central brainstem/cerebellar stroke, cardiac dysrhythmia, or orthostatic hypotension.",
    commonCauses: [
      "Benign Paroxysmal Positional Vertigo (BPPV), Vestibular Neuritis / Labyrinthitis",
      "Meniere's Disease, Vestibular Migraine",
      "Orthostatic Hypotension, Medication Side Effects (Antihypertensives, Sedatives)",
      "Anemia, Hypoglycemia, Dehydration, Anxiety / Hyperventilation"
    ],
    differentialDiagnosis: "Differentiate peripheral vestibular dizziness (BPPV, neuritis) from central neurological stroke (posterior circulation / cerebellar ischemia), cardiac arrhythmias (AV block, VT), and presyncope.",
    redFlags: [
      "Sudden onset continuous vertigo with focal neurological deficits (dysarthria, diplopia, ataxia, facial weakness)",
      "Abnormal HINTS exam (normal head impulse, direction-changing nystagmus, vertical skew deviation - suggestive of central stroke)",
      "Dizziness accompanied by chest pain, palpitations, presyncope, or loss of consciousness",
      "Sudden severe unilateral hearing loss or inability to stand/walk unassisted"
    ],
    lifestyleAdvice: "Perform Epley maneuver for positional vertigo under guidance, change positions slowly, maintain adequate hydration, avoid sudden neck movements, and reduce salt intake if Meniere's disease is suspected.",
    references: [
      "CIT-0077",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0012-001",
        passage: "Acute continuous vertigo with ataxia, dysarthria, or abnormal HINTS examination requires immediate brain MRI to rule out posterior circulation cerebellar stroke.",
        citationIds: ["CIT-0077"]
      },
      {
        claimId: "CLM-S0012-002",
        passage: "Benign Paroxysmal Positional Vertigo (BPPV) is characterized by brief (<1 minute) episodes of spinning vertigo triggered by head position changes, effectively treated with canalith repositioning procedures.",
        citationIds: ["CIT-0077"]
      },
      {
        claimId: "CLM-S0012-003",
        passage: "Lightheadedness accompanied by palpitations or syncope mandates ECG and Holter monitoring for cardiac dysrhythmias.",
        citationIds: ["CIT-0077"]
      },
      {
        claimId: "CLM-S0012-004",
        passage: "Homeopathic supportive remedies (e.g., Conium, Bryonia, Cocculus) do not substitute for emergency stroke neuroimaging or cardiac telemetry in acute central vertigo.",
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
  tags: ["Dizziness", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/dizziness",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Dizziness symptom profile"]
};
