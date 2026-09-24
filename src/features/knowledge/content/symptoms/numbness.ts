import { KnowledgeEntity } from "../../types";

export const NumbnessSymptom: KnowledgeEntity = {
  id: "S0031",
  slug: "numbness",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Numbness",
    hi: "Numbness",
    gu: "Numbness",
    mr: "Numbness",
    es: "Numbness",
    ar: "Numbness"
  },
  summary: {
    en: "Numbness is reduced or altered feeling in part of the body. Sudden one-sided numbness with facial or speech changes is a stroke emergency.",
    hi: "Numbness के लक्षण की नैदानिक समझ.",
    gu: "Numbness ના લક્ષણ ની સમજણ.",
    mr: "Numbness चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Numbness.",
    ar: "التعريف السريري والأهمية لـ Numbness."
  },
  content: {
  "definition": "Numbness is reduced sensation or a feeling that part of the body is asleep. It may be temporary after pressure on a nerve or persistent because of a nerve, circulation, spine, or health condition.",
  "clinicalMeaning": "The location, suddenness, weakness, pain, colour change, and related symptoms help identify whether it is likely to be temporary or needs urgent assessment.",
  "commonCauses": [
    "Temporary pressure on a nerve or a repetitive-position problem",
    "Nerve compression such as carpal tunnel syndrome or sciatica",
    "Diabetes, vitamin deficiency, medicines, or peripheral neuropathy",
    "Less commonly, a circulation or brain/spinal cord condition"
  ],
  "differentialDiagnosis": "A clinician may assess the pattern, strength, reflexes, circulation, neck or back symptoms, diabetes risk, medicines, and possible vitamin deficiency.",
  "redFlags": [
    "Call emergency services for sudden numbness or weakness on one side, facial droop, speech difficulty, severe headache, sudden vision change, confusion, or loss of balance—even if it stops.",
    "Seek urgent help for numbness with a cold, pale, painful limb; sudden severe pain after injury; or new bladder or bowel control problems.",
    "Arrange a review for persistent, worsening, or recurrent numbness, especially with weakness or difficulty walking."
  ],
  "lifestyleAdvice": "Avoid prolonged pressure on the affected area, vary repetitive tasks, and use a neutral posture. Do not self-treat new weakness or persistent numbness as a simple trapped nerve without an assessment.",
  "references": [
    "CIT-0011",
    "CIT-0022"
  ],
  "faqs": [
    {
      "question": "When is numbness a stroke warning sign?",
      "answer": "Sudden one-sided numbness or weakness, facial droop, speech difficulty, confusion, vision change, or severe headache is an emergency. Call emergency services immediately."
    },
    {
      "question": "Can a trapped nerve cause numbness?",
      "answer": "Yes. Pressure on a nerve in the wrist, neck, back, or elsewhere can cause numbness or tingling. Persistent symptoms need clinical assessment."
    },
    {
      "question": "When should I see a clinician?",
      "answer": "Seek advice for numbness that persists, keeps returning, is worsening, affects balance or strength, or follows an injury."
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
  tags: ["Numbness", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/numbness",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Numbness symptom profile"]
};
