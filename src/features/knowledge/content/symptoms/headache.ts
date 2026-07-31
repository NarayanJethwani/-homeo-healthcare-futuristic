import { KnowledgeEntity } from "../../types";

export const HeadacheSymptom: KnowledgeEntity = {
  id: "S0003",
  slug: "headache",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Headache (Cephalgia)",
    hi: "सिरदर्द (सेफैल्जिया)",
    gu: "માથાનો દુખાવો (Headache)",
    mr: "डोकेदुखी (Headache)",
    es: "Dolor de Cabeza (Cefalea)",
    ar: "الصداع (Headache)"
  },
  summary: {
    en: "Clinical triage, neuroimaging criteria, and supportive management of Headache under AAN 2021 standards.",
    hi: "सिरदर्द की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "માથાના દુખાવાની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "डोकेदुखीचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y neuroimagen en cefaleas según las guías AAN 2021.",
    ar: "التفرقة السريرية والعلامات التحذيرية للصداع."
  },
  content: {
    definition: "Headache (Cephalgia): Pain perceived in the head or upper neck arising from pain-sensitive cranial structures (dura mater, venous sinuses, meningeal arteries, trigeminal and cervical nerve fibers).",
    clinicalMeaning: "Reflects benign primary headache disorders (migraine, tension-type, cluster) or serious secondary etiologies (subarachnoid hemorrhage, meningitis, intracranial mass, temporal arteritis).",
    commonCauses: [
      "Tension-Type Headache or Migraine with/without Aura",
      "Cluster Headache or Sinus/Cervicogenic Headache",
      "Subarachnoid Hemorrhage (Thunderclap Headache)",
      "Bacterial/Viral Meningitis or Giant Cell (Temporal) Arteritis"
    ],
    differentialDiagnosis: "Differentiate primary migraine and tension-type headache from secondary life-threatening thunderclap headache, intracranial tumor, and meningitis.",
    redFlags: [
      "Sudden explosive 'thunderclap' onset reaching peak intensity within seconds (Subarachnoid Hemorrhage)",
      "Headache with fever, stiff neck, photophobia, and altered consciousness (Meningitis)",
      "New onset temporal headache in patients >50 years with jaw claudication or visual loss (Temporal Arteritis)"
    ],
    lifestyleAdvice: "Maintain regular sleep hygiene, hydration, and stress reduction; seek immediate emergency CT head / LP for sudden thunderclap headache or fever with neck stiffness.",
    references: [
      "CIT-0066",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0003-001",
        passage: "Sudden explosive headache reaching peak intensity in less than one minute (thunderclap headache) demands immediate non-contrast CT brain scan and lumbar puncture for subarachnoid hemorrhage.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0003-002",
        passage: "Headache accompanied by fever, nuchal rigidity, and clouding of sensorium requires urgent cerebrospinal fluid analysis for meningitis.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0003-003",
        passage: "New-onset headache in an individual older than 50 accompanied by scalp tenderness and jaw claudication requires ESR testing and temporal artery biopsy.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0003-004",
        passage: "Homeopathic supportive care does not replace urgent neuroimaging, lumbar puncture, or emergency vascular evaluation in secondary severe headache.",
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
    specialty: "Neurology & Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["Headache", "Cephalgia", "Head Pain", "Symptom", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/headache",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of Headache symptom profile"]
};
