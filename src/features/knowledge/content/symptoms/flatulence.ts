import { KnowledgeEntity } from "../../types";

export const FlatulenceSymptom: KnowledgeEntity = {
  id: "S0024",
  slug: "flatulence",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Gas and Flatulence",
    hi: "Flatulence",
    gu: "Flatulence",
    mr: "Flatulence",
    es: "Flatulence",
    ar: "Flatulence"
  },
  summary: {
    en: "Gas and flatulence are normal, but excess wind can be uncomfortable or embarrassing. Learn common food and digestion-related causes, ways to reduce trapped wind, and when ongoing symptoms need medical advice.",
    hi: "Flatulence के लक्षण की नैदानिक समझ.",
    gu: "Flatulence ના લક્ષણ ની સમજણ.",
    mr: "Flatulence चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Flatulence.",
    ar: "التعريف السريري والأهمية لـ Flatulence."
  },
  content: {
  "definition": "Flatulence is passing gas from the digestive system through the anus. It is normal, but may feel troublesome when it is frequent, smelly, or accompanied by bloating or pain.",
  "clinicalMeaning": "Gas can build up when air is swallowed or when foods are broken down in the gut. Constipation, food intolerance, and conditions such as IBS can also contribute.",
  "commonCauses": [
    "Swallowing air when eating or drinking quickly, chewing gum, or drinking fizzy drinks",
    "Foods that are harder for some people to digest, such as beans, onions, or certain sweeteners",
    "Constipation, food intolerance, coeliac disease, or irritable bowel syndrome (IBS)",
    "Some medicines, including certain laxatives or anti-inflammatory medicines"
  ],
  "differentialDiagnosis": "A clinician may consider constipation, IBS, food intolerance, coeliac disease, or other causes when gas is persistent or comes with other digestive symptoms.",
  "redFlags": [
    "Blood in the stool, unexplained weight loss, or symptoms that persist or keep returning",
    "Severe or sudden abdominal pain, repeated vomiting, or a swollen abdomen",
    "Being unable to pass stool or gas, especially with abdominal pain or vomiting"
  ],
  "lifestyleAdvice": "Eat and drink slowly with your mouth closed, reduce fizzy drinks, keep active, and notice whether particular foods trigger symptoms. If constipation is contributing, fluids and soluble fibre may help.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "What can reduce trapped wind?",
      "answer": "Eating more slowly, avoiding fizzy drinks, regular activity, and smaller meals may help. A pharmacist can advise whether a medicine such as simeticone is suitable; its benefit can vary."
    },
    {
      "question": "Do certain foods cause gas?",
      "answer": "They can. Common examples include beans, lentils, onions, some vegetables, fizzy drinks, and foods containing certain sweeteners. Triggers differ from person to person."
    },
    {
      "question": "When should I see a clinician?",
      "answer": "Arrange medical advice if gas affects daily life despite self-care, comes with persistent bloating, pain, constipation or diarrhoea, blood in stools, or unexplained weight loss."
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
  tags: ["Flatulence", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/flatulence",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Flatulence symptom profile"]
};
