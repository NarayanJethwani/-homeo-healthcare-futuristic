import { KnowledgeEntity } from "../../types";

export const VertigoSymptom: KnowledgeEntity = {
  id: "S0005",
  slug: "vertigo",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Vertigo",
    hi: "Vertigo",
    gu: "Vertigo",
    mr: "Vertigo",
    es: "Vertigo",
    ar: "Vertigo"
  },
  summary: {
    en: "Vertigo is a false sensation of spinning or movement. It is different from feeling generally light-headed and needs urgent care when neurological warning signs are present.",
    hi: "Vertigo के लक्षण की नैदानिक समझ.",
    gu: "Vertigo ના લક્ષણ ની સમજણ.",
    mr: "Vertigo चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Vertigo.",
    ar: "التعريف السريري والأهمية لـ Vertigo."
  },
  content: {
  "definition": "Vertigo is the feeling that you, or the space around you, is moving or spinning when it is not. It may happen in short attacks or last longer, and can cause nausea or loss of balance.",
  "clinicalMeaning": "Inner-ear problems are common causes, but vertigo is a symptom rather than a diagnosis. The pattern, triggers, hearing symptoms, and neurological symptoms help determine what care is needed.",
  "commonCauses": [
    "A brief inner-ear positional problem, often triggered by turning in bed or looking up",
    "An inner-ear infection or inflammation",
    "Migraine-associated vertigo",
    "Less commonly, a condition affecting the brain or circulation"
  ],
  "differentialDiagnosis": "Vertigo should be distinguished from faintness, medication effects, low blood pressure, and anxiety-related dizziness. A clinician may assess balance, eye movements, ears, hearing, and neurological signs.",
  "redFlags": [
    "Call emergency services for vertigo with weakness or numbness of the face, arm, or leg, speech difficulty, new confusion, double vision, or sudden severe headache.",
    "Seek urgent assessment for sudden hearing loss, inability to walk safely, persistent vomiting, chest pain, or vertigo after a head injury.",
    "Arrange a clinical review if attacks keep returning, change pattern, or are affecting work, driving, or daily activities."
  ],
  "lifestyleAdvice": "Sit or lie down as soon as spinning starts and get up slowly. Avoid driving, heights, swimming alone, or machinery while balance is affected. Keep hydrated if you can, and ask for an assessment rather than trying balance manoeuvres that have not been recommended for you.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Is vertigo the same as dizziness?",
      "answer": "Not exactly. Vertigo is a clear sense of spinning or movement. ‘Dizziness’ can also mean feeling faint, unsteady, or light-headed."
    },
    {
      "question": "What should I do during a vertigo attack?",
      "answer": "Sit or lie down somewhere safe, move your head slowly, and avoid driving or climbing. Get urgent help if neurological warning signs occur."
    },
    {
      "question": "When should vertigo be checked?",
      "answer": "New, recurrent, or disruptive vertigo should be discussed with a clinician. Sudden hearing loss or stroke-like symptoms require urgent care."
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
  tags: ["Vertigo", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/vertigo",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Vertigo symptom profile"]
};
