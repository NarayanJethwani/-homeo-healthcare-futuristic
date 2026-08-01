import { KnowledgeEntity } from "../../types";

export const MuscleWeaknessSymptom: KnowledgeEntity = {
  id: "S0044",
  slug: "muscle-weakness",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Muscle Weakness (Paresis)",
    hi: "मांसपेशियों की कमजोरी (Muscle Weakness)",
    gu: "સ્નાયુઓની નબળાઈ (Muscle Weakness)",
    mr: "स्नायूंची दुर्बलता (Muscle Weakness)",
    es: "Debilidad Muscular (Paresia)",
    ar: "ضعف العضلات (Muscle Weakness)"
  },
  summary: {
    en: "Clinical triage, neurological localization, and emergency management of Muscle Weakness under AAN 2021 standards.",
    hi: "मांसपेशियों की कमजोरी की नैदानिक समझ और आपातकालीन रेड फ्लैग्स.",
    gu: "સ્નાયુઓની નબળાઈના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "स्नायूंच्या दुर्बलतेचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y evaluación neurológica de la debilidad muscular.",
    ar: "التفرقة السريرية والعلامات التحذيرية لضعف العضلات."
  },
  content: {
    definition: "Muscle Weakness (Paresis): Reduction in maximum voluntary motor force exerted by one or more skeletal muscle groups, localizing to upper motor neuron (brain/spinal cord), lower motor neuron (anterior horn cell/root/nerve), neuromuscular junction, or primary muscle tissue.",
    clinicalMeaning: "Reflects acute ischemic stroke, spinal cord compression, Guillain-Barré syndrome, myasthenia gravis crisis, or severe electrolyte imbalance (hypokalemia) requiring immediate neurological localization.",
    commonCauses: [
      "Stroke or Transient Ischemic Attack (TIA)",
      "Spinal Cord Compression or Acute Radiculopathy",
      "Guillain-Barré Syndrome or Myasthenia Gravis",
      "Severe Hypokalemia, Hypomagnesemia, or Polymyositis"
    ],
    differentialDiagnosis: "Differentiate upper motor neuron weakness (hyperreflexia, spasticity) from lower motor neuron weakness (flaccidity, atrophy), myasthenia (fatigability), and myopathy.",
    redFlags: [
      "Sudden focal weakness of face, arm, or leg (Stroke / TIA - FAST alert)",
      "Rapidly ascending paraparesis or quadriparesis with loss of deep tendon reflexes (Guillain-Barré Syndrome)",
      "Weakness accompanied by dyspnea or dysphagia (Impending Neuromuscular Respiratory Crisis)"
    ],
    lifestyleAdvice: "Immediate 911 emergency activation for acute unilateral motor weakness or dyspnea; prioritize urgent neurological imaging and electromyography.",
    references: [
      "CIT-0066",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0044-001",
        passage: "Sudden onset of hemiparesis or facial droop demands hyperacute stroke protocol activation for thrombolysis or mechanical thrombectomy.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0044-002",
        passage: "Rapidly progressive ascending flaccid weakness following viral infection suggests Guillain-Barré syndrome requiring urgent IVIG or plasma exchange.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0044-003",
        passage: "Fluctuating muscle weakness involving ocular and bulbar muscles that worsens with exertion suggests myasthenia gravis.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0044-004",
        passage: "Homeopathic supportive care does not replace urgent neuroimaging, nerve conduction studies, or emergency airway stabilization in acute paralysis.",
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
  tags: ["Muscle Weakness", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/muscle-weakness",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Muscle Weakness symptom profile"]
};
