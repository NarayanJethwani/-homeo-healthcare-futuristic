import { KnowledgeEntity } from "../../types";

export const VomitingSymptom: KnowledgeEntity = {
  id: "S0023",
  slug: "vomiting",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Vomiting (Emesis)",
    hi: "उल्टी (Vomiting)",
    gu: "ઉલટી (Vomiting)",
    mr: "उलट्या (Vomiting)",
    es: "Vómitos (Emesis)",
    ar: "القيء (Vomiting)"
  },
  summary: {
    en: "Clinical triage, fluid-electrolyte management, and supportive care for Vomiting under IDSA 2021 guidelines.",
    hi: "उल्टी के लक्षण की नैदानिक समझ और आपातकालीन रेड फ्लैग्स.",
    gu: "ઉલટીના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "उलट्यांचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y manejo de vómitos según las guías IDSA 2021.",
    ar: "التفرقة السريرية والعلامات التحذيرية للقيء."
  },
  content: {
    definition: "Vomiting (Emesis): The forceful oral expulsion of gastric contents driven by retrograde gastrointestinal peristalsis and coordinated contraction of abdominal and diaphragmatic musculature controlled by the medullary vomiting center.",
    clinicalMeaning: "Reflects acute gastroenteritis, bowel obstruction, intracranial hypertension, metabolic ketoacidosis, or toxic ingestion requiring fluid status monitoring.",
    commonCauses: [
      "Acute Viral/Bacterial Gastroenteritis or Food Poisoning",
      "Small Bowel Obstruction or Acute Appendicitis/Cholecystitis",
      "Increased Intracranial Pressure (Brain Tumor, Subdural Hematoma)",
      "Diabetic Ketoacidosis, Uremia, or Pregnancy (Morning Sickness)"
    ],
    differentialDiagnosis: "Differentiate acute gastroenteritis from mechanical intestinal obstruction, acute pancreatitis, intracranial lesions, and drug-induced emesis.",
    redFlags: [
      "Hematemesis (coffee-ground or bright red emesis) indicating upper GI bleeding",
      "Feculent vomitus or severe abdominal distension with obstipation (Bowel Obstruction)",
      "Projectile vomiting without nausea accompanied by severe morning headache (Increased ICP)"
    ],
    lifestyleAdvice: "Administer oral rehydration solution (ORS) in small frequent sips; seek immediate emergency care for hematemesis, severe dehydration, or projectile vomitus with confusion.",
    references: [
      "CIT-0065",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0023-001",
        passage: "Hematemesis or coffee-ground vomitus requires urgent upper gastrointestinal endoscopy for acute ulcer or variceal bleeding.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0023-002",
        passage: "Feculent vomitus combined with severe colicky abdominal pain indicates mechanical bowel obstruction requiring emergency surgical evaluation.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0023-003",
        passage: "Projectile morning vomiting without preceding nausea accompanied by papilledema suggests elevated intracranial pressure.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0023-004",
        passage: "Homeopathic supportive remedies do not replace intravenous fluid resuscitation, electrolyte correction, or surgical decompression in acute mechanical vomiting.",
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
  tags: ["Vomiting", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/vomiting",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Vomiting symptom profile"]
};
