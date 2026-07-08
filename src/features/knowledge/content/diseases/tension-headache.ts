import { KnowledgeEntity } from "../../types";

export const TensionHeadacheDisease: KnowledgeEntity = {
  id: "D0063",
  slug: "tension-headache",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Tension Headache",
    hi: "Tension Headache",
    gu: "Tension Headache",
    mr: "Tension Headache",
    es: "Tension Headache",
    ar: "Tension Headache"
  },
  summary: {
    en: "A comprehensive clinical overview of Tension Headache, covering causes, clinical symptoms, and homeopathic management principles.",
    hi: "Tension Headache का नैदानिक विवरण.",
    gu: "Tension Headache નો તબીબી પરિચય.",
    mr: "Tension Headache चे आजार आणि माहिती.",
    es: "Un resumen clínico completo de Tension Headache.",
    ar: "نظرة عامة سريرية شاملة لـ Tension Headache."
  },
  content: {
  "overview": "Tension headache: Neurological and musculoskeletal conditions affect physical mobility, postural alignment, and sensory nerve conductivity. Management focuses on biomechanical alignment, reducing localized neurogenic inflammation, and pain pathway modulation.",
  "definition": "Chronic or acute inflammatory and degenerative disorders of the musculoskeletal system or peripheral nerves, resulting in localized pain, restricted movement, or parasthesia.",
  "causes": [
    "Repetitive strain, mechanical overload, or micro-trauma to ligaments/tendons",
    "Neurogenic inflammation and peripheral nerve impingement (e.g., neuropathy)",
    "Systemic metabolic alterations affecting nerve myelin sheath and joint cartilages"
  ],
  "riskFactors": [
    "Poor ergonomics and sedentary lifestyle",
    "Intense physical stress or history of mechanical trauma",
    "Advanced age and metabolic conditions like diabetes"
  ],
  "symptoms": [
    "Aching, throbbing, or shooting pain along nerve/muscle pathways",
    "Morning stiffness, joint crepitus, and restricted range of motion",
    "Paresthesia, numbness, or burning sensations in the extremities",
    "Aggravation of discomfort by cold, damp weather or excessive physical exertion"
  ],
  "diagnosis": "Confirmed through physical orthopedic examination, radiographic imaging (X-ray, MRI), and nerve conduction velocity (NCV) testing.",
  "differentialDiagnosis": "Must differentiate mechanical strain from inflammatory arthritis (Rheumatoid/Ankylosing) and true peripheral neuropathy from radiculopathy.",
  "conventionalManagement": "Involves non-steroidal anti-inflammatory drugs (NSAIDs), physical therapy, muscle relaxants, nerve blocks, or orthopedic supports.",
  "homeopathicApproach": "Focuses on soft tissue healing, managing localized neural congestion, and reducing musculoskeletal hyper-reactivity using constitutional remedies.",
  "lifestyleAdvice": "Maintain ergonomic working postures, perform low-impact stretching and strengthening exercises, apply moist heat or cold packs, and optimize physical rest.",
  "references": [
    "CIT-0011",
    "CIT-0022"
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
    specialty: "Clinical Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Tension Headache", "Disease", "Clinical-Overview"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/tension-headache",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Tension Headache profile"]
};
