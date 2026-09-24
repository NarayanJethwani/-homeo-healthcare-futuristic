import { KnowledgeEntity } from "../../types";

export const EaracheSymptom: KnowledgeEntity = {
  id: "S0040",
  slug: "earache",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Earache",
    hi: "Earache",
    gu: "Earache",
    mr: "Earache",
    es: "Earache",
    ar: "Earache"
  },
  summary: {
    en: "Earache is common and often settles in a few days, but leaking fluid, hearing change, or swelling around the ear need advice sooner.",
    hi: "Earache के लक्षण की नैदानिक समझ.",
    gu: "Earache ના લક્ષણ ની સમજણ.",
    mr: "Earache चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Earache.",
    ar: "التعريف السريري والأهمية لـ Earache."
  },
  content: {
  "definition": "Earache is pain felt in or around one or both ears. It can be sharp, dull, throbbing, or a feeling of pressure.",
  "clinicalMeaning": "Ear pain is often linked to an ear infection, a cold, earwax, a throat problem, or a dental problem. The cause is not always inside the ear, so accompanying symptoms and duration matter.",
  "commonCauses": [
    "Middle or outer ear infection, especially after a cold",
    "Earwax build-up, water irritation, or an object in the ear",
    "Sore throat, tonsillitis, jaw problems, teething, or a dental abscess",
    "A change in air pressure, injury, or a perforated eardrum"
  ],
  "differentialDiagnosis": "A clinician may check the ear canal and eardrum, and ask about fever, discharge, hearing, dizziness, recent cold symptoms, swallowing pain, dental pain, swimming, or trauma. Do not put objects into the ear to investigate or remove wax.",
  "redFlags": [
    "Get urgent advice if pain lasts more than 2 to 3 days, you feel very unwell, have a high fever, or there is fluid coming from the ear",
    "Seek prompt assessment for swelling around the ear, a new hearing change, severe dizziness, vomiting, or something stuck in the ear",
    "Seek advice early for a young child, recurrent earache, or ear symptoms if you have diabetes, a weakened immune system, or a significant long-term condition"
  ],
  "lifestyleAdvice": "Rest, drink fluids, and use a warm flannel on the outer ear. Paracetamol or ibuprofen may help if they are safe for you; ask a pharmacist if unsure. Do not insert cotton buds, attempt to remove wax, or let water enter a painful ear.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Should I use cotton buds to clear ear pain?",
      "answer": "No. Cotton buds can push wax deeper and damage the ear canal or eardrum. Ask a pharmacist or clinician for safe advice instead."
    },
    {
      "question": "Can a sore throat or tooth cause earache?",
      "answer": "Yes. Ear pain can be referred from the throat, teeth, or jaw. Pain when swallowing or toothache are useful clues to mention at an assessment."
    },
    {
      "question": "When should a child with earache be checked?",
      "answer": "Get advice sooner if a child is very unwell, has a high temperature, fluid from the ear, hearing or balance changes, or if pain is not improving after a few days."
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
  tags: ["Earache", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/earache",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Earache symptom profile"]
};
