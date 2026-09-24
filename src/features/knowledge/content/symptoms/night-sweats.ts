import { KnowledgeEntity } from "../../types";

export const NightSweatsSymptom: KnowledgeEntity = {
  id: "S0050",
  slug: "night-sweats",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Night Sweats",
    hi: "Night Sweats",
    gu: "Night Sweats",
    mr: "Night Sweats",
    es: "Night Sweats",
    ar: "Night Sweats"
  },
  summary: {
    en: "Night sweats are episodes that soak nightclothes or bedding despite a cool room. Frequent episodes or sweats with other symptoms should be checked.",
    hi: "Night Sweats के लक्षण की नैदानिक समझ.",
    gu: "Night Sweats ના લક્ષણ ની સમજણ.",
    mr: "Night Sweats चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Night Sweats.",
    ar: "التعريف السريري والأهمية لـ Night Sweats."
  },
  content: {
  "definition": "Night sweats are sweating episodes that make nightclothes or bedding soaking wet even though the room and bedding are not overly warm. They are different from simply feeling warm in bed.",
  "clinicalMeaning": "They can have a simple explanation, but regular or drenching episodes deserve a review—especially alongside fever, cough, diarrhoea, weight loss, or a new medicine.",
  "commonCauses": [
    "Menopausal symptoms or hot flushes",
    "Anxiety, alcohol or recreational drug use, and some medicines",
    "Low blood sugar, especially in people using glucose-lowering medicines",
    "Infection or another health condition that needs clinical assessment"
  ],
  "differentialDiagnosis": "A clinician will ask how often this happens, whether the room is cool, and about fever, weight change, cough, bowel symptoms, menopause, medicines, alcohol, glucose medicines, and other health changes.",
  "redFlags": [
    "Arrange prompt medical advice for regular night sweats, unexplained weight loss, fever or chills, persistent cough, diarrhoea, a new lump, or persistent fatigue.",
    "Seek urgent help for chest pain, severe breathlessness, fainting, confusion, or signs of severe dehydration.",
    "If you use insulin or another glucose-lowering medicine and suspect low blood sugar, follow your agreed hypo plan and seek advice about recurrent episodes."
  ],
  "lifestyleAdvice": "Keep the room cool, use light breathable bedding, reduce alcohol close to bedtime, and note the timing, severity, temperature, medicines, periods or menopause symptoms, and associated symptoms. Do not stop prescribed medicine without speaking to the prescriber.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Are night sweats the same as feeling hot in bed?",
      "answer": "No. Night sweats are enough sweating to soak nightclothes or bedding despite a cool sleeping environment."
    },
    {
      "question": "What information is useful to track?",
      "answer": "Record when episodes happen, room temperature, how much bedding is damp, fever or cough, weight change, medicines, alcohol, menstrual or menopause symptoms, and any low-blood-sugar symptoms."
    },
    {
      "question": "When should I see a clinician?",
      "answer": "Seek advice if night sweats are regular, wake you, worry you, or occur with fever, cough, diarrhoea, fatigue, or unexplained weight loss."
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
  tags: ["Night Sweats", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/night-sweats",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Night Sweats symptom profile"]
};
