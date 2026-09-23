import { KnowledgeEntity } from "../../types";

export const FeverSymptom: KnowledgeEntity = {
  id: "S0004",
  slug: "fever",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-23T19:50:00Z",
    reviewed: "2026-09-23T19:50:00Z"
  },
  title: {
    en: "Fever (Pyrexia)",
    hi: "बुखार (Fever)",
    gu: "તાાવ (Fever)",
    mr: "ताप (Fever)",
    es: "Fiebre (Pirexia)",
    ar: "الحمى (Fever)"
  },
  summary: {
    en: "Fever is usually the body's response to an illness or infection. The temperature matters, but age, how unwell someone looks, other symptoms, and how the illness is changing matter even more.",
    hi: "बुखार के लक्षण की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "તાાવના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "तापाचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y manejo de la fiebre según las guías IDSA.",
    ar: "التفرقة Сريرية والعلامات التحذيرية للحمى."
  },
  content: {
    definition: "A fever is a temporary rise in body temperature, usually 38°C (100.4°F) or higher when measured with a thermometer. It is a symptom, not a diagnosis.",
    clinicalMeaning: "Many fevers are linked with common viral illnesses, but the right next step depends on age, symptoms, health conditions, travel, medicines, and whether the person is improving or worsening.",
    commonCauses: [
      "A respiratory illness such as a cold, flu, sore throat, or chest infection",
      "An infection affecting the stomach, urine, ear, skin, or another part of the body",
      "A reaction to a vaccine or, less commonly, a medicine or inflammatory condition",
      "Heat illness or another cause that needs a clinician to interpret in context"
    ],
    differentialDiagnosis: "A thermometer cannot identify the cause of a fever by itself. A clinician may consider the pattern, examination, travel or exposure history, medicines, and tests when symptoms are severe, prolonged, recurrent, or unclear.",
    redFlags: [
      "Seek emergency care now for difficulty breathing, blue lips or face, new confusion, inability to wake, a seizure, a severe headache with stiff neck, or a rapidly worsening illness.",
      "A fever with a new purple or bruise-like rash, severe dehydration, persistent vomiting, or severe pain needs urgent medical assessment.",
      "A baby under 3 months with a temperature of 38°C (100.4°F) or higher needs prompt medical assessment. People who are pregnant, immunocompromised, receiving cancer treatment, or seriously unwell should seek advice early."
    ],
    lifestyleAdvice: "For a familiar mild fever in an otherwise well adult or older child, rest, fluids, light clothing, and monitoring how the person feels can help. Follow the label or a clinician's advice for medicines; do not give aspirin to children or teenagers with a fever. Seek care if symptoms are not improving, are worsening, or any red flag appears.",
    references: [
      "CIT-0127",
      "CIT-0128"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0004-001",
        passage: "Fever with breathing difficulty, confusion, inability to wake, seizure, blue lips, or a severe headache with stiff neck needs emergency assessment.",
        citationIds: ["CIT-0127", "CIT-0128"]
      },
      {
        claimId: "CLM-S0004-002",
        passage: "Fever needs earlier clinical advice when someone is very young, immunocompromised, pregnant, seriously unwell, or has symptoms that are worsening or not improving.",
        citationIds: ["CIT-0127", "CIT-0128"]
      },
      {
        claimId: "CLM-S0004-003",
        passage: "For a familiar mild fever, rest, fluids, and monitoring symptoms are supportive measures; the cause and the person’s overall condition determine whether medical assessment is needed.",
        citationIds: ["CIT-0127", "CIT-0128"]
      },
      {
        claimId: "CLM-S0004-004",
        passage: "Homeopathy should not delay emergency care, diagnostic assessment, or evidence-based treatment for a concerning fever.",
        citationIds: ["CIT-0127", "CIT-0128"]
      }
    ],
  "faqs": [
    {
      "question": "Is 38°C always a fever?",
      "answer": "A temperature of 38°C (100.4°F) or higher is commonly treated as a fever, but body temperature changes through the day and the method of measurement matters. How the person looks and feels, their age, and other symptoms are important too."
    },
    {
      "question": "What can help with a familiar mild fever?",
      "answer": "Rest, fluids, light clothing, and keeping an eye on the overall pattern are sensible first steps. Use fever medicines only as directed on the label or by a clinician, and do not give aspirin to children or teenagers with a fever."
    },
    {
      "question": "Does a fever mean antibiotics are needed?",
      "answer": "No. Many fevers are caused by viral illnesses, and antibiotics do not treat viruses. A clinician can decide whether testing or a particular treatment is needed from the symptoms, examination, and illness pattern."
    },
    {
      "question": "When does a child with fever need urgent care?",
      "answer": "A baby under 3 months with a temperature of 38°C (100.4°F) or higher needs prompt assessment. Get emergency help for breathing difficulty, blue lips or face, a seizure, confusion, inability to wake, a stiff neck with severe headache, or if you think something is seriously wrong."
    },
    {
      "question": "Can homeopathy treat fever?",
      "answer": "Homeopathy should not replace assessment or evidence-based treatment for a concerning fever. In particular, it must never delay emergency help for warning signs or medical advice for infants, people who are immunocompromised, or anyone becoming more unwell."
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
  tags: ["Fever", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/fever",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Fever symptom profile"]
};
