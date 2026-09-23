import { KnowledgeEntity } from "../../types";

export const VomitingSymptom: KnowledgeEntity = {
  id: "S0023",
  slug: "vomiting",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-23T19:30:00Z",
    reviewed: "2026-09-23T19:30:00Z"
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
    en: "Vomiting can pass quickly, but keeping fluids down and understanding the cause are important. Learn what may help, what to notice, and when to get medical care.",
    hi: "उल्टी के लक्षण की नैदानिक समझ और आपातकालीन रेड फ्लैग्स.",
    gu: "ઉલટીના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "उलट्यांचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Los vómitos pueden pasar rápido, pero es importante retener líquidos y entender la causa.",
    ar: "التفرقة السريرية والعلامات التحذيرية للقيء."
  },
  content: {
    definition: "Vomiting means bringing stomach contents up through the mouth. It often comes with nausea, but it can also happen suddenly. A short-lived episode is common; repeated vomiting can cause dehydration and deserves closer attention.",
    clinicalMeaning: "The important questions are how often it is happening, whether you can keep fluids down, what else you feel, and whether there may be a cause such as an infection, pregnancy, motion sickness, migraine, a medicine, alcohol or another health condition.",
    commonCauses: [
      "A stomach or intestinal infection, food poisoning, or another short-term digestive illness",
      "Pregnancy, motion sickness, migraine, anxiety or strong smells",
      "A new medicine, alcohol, cannabis, or a treatment side effect",
      "Reflux, an ulcer, gallbladder or pancreatic conditions, or a blockage—less common causes that may need assessment"
    ],
    differentialDiagnosis: "Vomiting is a symptom rather than a diagnosis. A clinician may ask about meals, travel, sick contacts, pregnancy possibility, medicines, pain, headache, bowel changes and urine output. Testing is guided by the pattern and any warning signs.",
    redFlags: [
      "Get emergency help now for blood or coffee-ground-like material in vomit; severe or sudden abdominal pain; chest pain; a severe headache with a stiff neck; confusion, fainting, trouble breathing, or a serious injury.",
      "Seek urgent medical advice if you cannot keep fluids down, have very little or no urine, dark urine, marked dizziness, or ongoing vomiting that is not settling.",
      "Get prompt advice for vomiting in pregnancy, a child, an older or frail adult, or someone with diabetes, kidney disease, cancer treatment, or a weakened immune system."
    ],
    lifestyleAdvice: "Start with small, frequent sips of water or an oral rehydration drink rather than a large drink at once. When fluids stay down, try a small amount of plain food if you feel ready. Rest, avoid alcohol and strong smells, and ask a pharmacist or clinician before using medicines—especially in pregnancy or for a child. Do not delay urgent care for the warning signs above.",
    references: [
      "CIT-0131",
      "CIT-0132"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0023-001",
        passage: "Blood or coffee-ground-like vomit, severe pain, confusion, fainting, a severe headache with a stiff neck, or trouble breathing needs emergency assessment.",
        citationIds: ["CIT-0131"]
      },
      {
        claimId: "CLM-S0023-002",
        passage: "Not being able to keep fluids down, very little urine, dark urine or marked dizziness can signal dehydration and needs prompt advice.",
        citationIds: ["CIT-0131", "CIT-0132"]
      },
      {
        claimId: "CLM-S0023-003",
        passage: "Vomiting can have many causes, including infection, pregnancy, motion sickness, migraine, food poisoning, medicines and digestive conditions; the wider pattern helps determine next steps.",
        citationIds: ["CIT-0131"]
      },
      {
        claimId: "CLM-S0023-004",
        passage: "A supportive or homeopathic consultation should not delay urgent medical care, fluid replacement or treatment of a serious underlying cause.",
        citationIds: ["CIT-0131"]
      }
    ],
    faqs: [
      {
        question: "What is the difference between nausea and vomiting?",
        answer: "Nausea is the unpleasant feeling that you may vomit. Vomiting is bringing stomach contents up through the mouth. You can have one without the other."
      },
      {
        question: "What should I drink after vomiting?",
        answer: "Try small, frequent sips of water or an oral rehydration drink. Large drinks can make nausea worse. If you cannot keep even small sips down, get medical advice."
      },
      {
        question: "When should I get urgent help?",
        answer: "Get emergency help for blood or coffee-ground-like vomit, severe pain, chest pain, severe headache with a stiff neck, confusion, fainting or breathing difficulty. Seek prompt advice if you cannot keep fluids down or notice dehydration."
      },
      {
        question: "Could pregnancy or a medicine be involved?",
        answer: "Yes. Pregnancy and many medicines can cause nausea or vomiting. A clinician or pharmacist can help review timing, other symptoms and medicines safely."
      },
      {
        question: "Can homeopathy treat vomiting?",
        answer: "A clinician may discuss individual supportive options, but it must not delay hydration, medical assessment or urgent treatment when warning signs are present."
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
  evidenceLevel: "Consensus-Guidance",
  tags: ["Vomiting", "Nausea", "Hydration", "Digestive Health", "Symptom"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/vomiting",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Vomiting symptom profile", "1.2.0: Rewritten as a patient-first guide with hydration advice, clear warning signs and visual learning support."]
};
