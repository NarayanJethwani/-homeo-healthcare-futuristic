import { KnowledgeEntity } from "../../types";

export const NauseaSymptom: KnowledgeEntity = {
  id: "S0022",
  slug: "nausea",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-23T20:10:00Z",
    reviewed: "2026-09-23T20:10:00Z"
  },
  title: {
    en: "Nausea",
    hi: "Nausea",
    gu: "Nausea",
    mr: "Nausea",
    es: "Nausea",
    ar: "Nausea"
  },
  summary: {
    en: "Nausea is the unpleasant feeling that you might vomit. It is common and often short-lived, but the pattern, accompanying symptoms, and ability to keep fluids down help determine the right next step.",
    hi: "Nausea के लक्षण की नैदानिक समझ.",
    gu: "Nausea ના લક્ષણ ની સમજણ.",
    mr: "Nausea चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Nausea.",
    ar: "التعريف السريري والأهمية لـ Nausea."
  },
  content: {
  "definition": "Nausea is the sensation of feeling sick to your stomach or as though you may vomit. You can have nausea without vomiting.",
  "clinicalMeaning": "Nausea is a symptom rather than one diagnosis. A brief, familiar episode may settle, while severe, repeated, unexplained, or worsening nausea can need assessment for its cause and for dehydration.",
  "commonCauses": [
    "A stomach or intestinal infection, food poisoning, reflux, indigestion, or another digestive condition",
    "Motion sickness, migraine, pain, anxiety, or changes in the inner-ear balance system",
    "Pregnancy, a medicine or treatment, alcohol, cannabis, or another substance",
    "A health condition that needs assessment, such as a blockage or an abdominal, metabolic, or neurological problem"
  ],
  "differentialDiagnosis": "The timing matters: nausea after a meal, with diarrhoea, with headache or vertigo, during travel, after a medicine change, or in pregnancy suggests different possibilities. A clinician may ask about pain, vomiting, fever, bowel or urine changes, pregnancy, medicines, travel, and exposures.",
  "redFlags": [
    "Seek emergency care now for blood or coffee-ground material in vomit, severe or sudden abdominal pain, severe headache with a stiff neck, chest pain, confusion, fainting, or difficulty breathing.",
    "Seek urgent medical advice if you cannot keep fluids down, have signs of dehydration such as very little or dark urine, are vomiting repeatedly, or symptoms are worsening.",
    "Get prompt medical advice for nausea in pregnancy, in young children or frail older adults, after a head injury, or alongside diabetes, kidney disease, cancer treatment, or immune suppression."
  ],
  "lifestyleAdvice": "For a familiar mild episode, take small frequent sips of fluid, rest, and choose bland food only when you feel able. Avoid forcing large meals, alcohol, and strong smells if they worsen symptoms. A short diary can note meals, travel, medicines, headache, bowel changes, and what helped. Ask a pharmacist or clinician before using medicines, especially during pregnancy or for a child.",
  "references": [
    "CIT-0129",
    "CIT-0130"
  ],
  "faqs": [
    {
      "question": "What can cause nausea?",
      "answer": "Common causes include a stomach or intestinal illness, motion sickness, migraine, pregnancy, reflux or indigestion, food poisoning, medicines, and anxiety. The pattern and any other symptoms help identify what to do next."
    },
    {
      "question": "What can I do for familiar mild nausea?",
      "answer": "Small frequent sips of fluid, rest, and a pause from strong smells or rich food can help. Do not force large drinks or meals. If you cannot keep fluids down, are getting dehydrated, or feel more unwell, seek medical advice."
    },
    {
      "question": "When is nausea an emergency?",
      "answer": "Get emergency help for blood in vomit, severe or sudden abdominal pain, chest pain, severe headache with a stiff neck, confusion, fainting, or difficulty breathing. Seek urgent advice if you cannot keep fluids down or have signs of dehydration."
    },
    {
      "question": "Can nausea be related to a medicine or pregnancy?",
      "answer": "Yes. A new medicine, a dose change, or pregnancy can contribute to nausea. Do not stop prescribed treatment on your own; speak with the prescriber, pharmacist, or maternity team for advice that fits your situation."
    },
    {
      "question": "Can homeopathy treat nausea?",
      "answer": "Homeopathy should not delay assessment or evidence-based treatment when nausea is severe, persistent, unexplained, associated with red flags, or causing dehydration."
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
  tags: ["Nausea", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/nausea",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Nausea symptom profile"]
};
