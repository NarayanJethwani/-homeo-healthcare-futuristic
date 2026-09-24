import { KnowledgeEntity } from "../../types";

export const WeightLossSymptom: KnowledgeEntity = {
  id: "S0019",
  slug: "weight-loss",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Weight Loss",
    hi: "Weight Loss",
    gu: "Weight Loss",
    mr: "Weight Loss",
    es: "Weight Loss",
    ar: "Weight Loss"
  },
  summary: {
    en: "Weight loss without trying is worth discussing with a clinician, especially when it continues or comes with other symptoms.",
    hi: "Weight Loss के लक्षण की नैदानिक समझ.",
    gu: "Weight Loss ના લક્ષણ ની સમજણ.",
    mr: "Weight Loss चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Weight Loss.",
    ar: "التعريف السريري والأهمية لـ Weight Loss."
  },
  content: {
  "definition": "Unintentional weight loss is losing weight without changing your eating, activity, or treatment plan. It is different from planned, gradual weight loss.",
  "clinicalMeaning": "Stress, a change in appetite, medicines, digestive problems, hormone conditions, and many other causes can contribute. Persistent unexplained weight loss needs a clinical review rather than self-treatment.",
  "commonCauses": [
    "Stress, grief, anxiety, depression, or an eating disorder",
    "Reduced appetite, poor nutrition, medicine side effects, or problems with teeth or swallowing",
    "Digestive conditions such as coeliac disease or inflammatory bowel disease",
    "An overactive thyroid, diabetes, heart disease, infection, or other medical conditions"
  ],
  "differentialDiagnosis": "A clinician will consider how quickly the change occurred and ask about appetite, bowel habits, mood, pain, fever, night sweats, medicines, and other symptoms. This guide cannot identify the cause on its own.",
  "redFlags": [
    "Arrange a GP appointment for ongoing or unexplained weight loss, even if you feel otherwise well",
    "Seek prompt medical advice for weight loss with persistent pain, bleeding, fever, drenching night sweats, trouble swallowing, or ongoing vomiting or diarrhoea",
    "Get urgent help if you cannot keep fluids down, are faint or confused, have chest pain or severe breathlessness, or feel at risk of harming yourself"
  ],
  "lifestyleAdvice": "Do not try to compensate with supplements or restrictive diets before the cause is clear. Record your weight at the same time each week, along with appetite and symptoms. While arranging care, aim for regular meals and drinks; a clinician or dietitian can tailor nutrition advice if needed.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "How much unplanned weight loss is concerning?",
      "answer": "Any ongoing unintentional weight loss is worth discussing with a GP. A faster change or weight loss alongside other symptoms should be assessed sooner."
    },
    {
      "question": "Can stress cause weight loss?",
      "answer": "Yes. Stress, grief, anxiety, and depression can affect appetite and eating. They should still be discussed with a clinician, particularly if the weight loss continues."
    },
    {
      "question": "Should I stop a medicine if I think it is affecting my weight?",
      "answer": "Do not stop prescribed medicines without advice. A pharmacist or prescriber can review possible side effects and safer options."
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
  tags: ["Weight Loss", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/weight-loss",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Weight Loss symptom profile"]
};
