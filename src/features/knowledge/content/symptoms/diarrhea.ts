import { KnowledgeEntity } from "../../types";

export const DiarrheaSymptom: KnowledgeEntity = {
  id: "S0011",
  slug: "diarrhea",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-23T20:30:00Z",
    reviewed: "2026-09-23T20:30:00Z"
  },
  title: {
    en: "Diarrhea",
    hi: "दस्त (Diarrhea)",
    gu: "ઝાડા (Diarrhea)",
    mr: "अतिसार (Diarrhea)",
    es: "Diarrea (Diarrhea)",
    ar: "الإسهال (Diarrhea)"
  },
  summary: {
    en: "Loose, watery stools often settle in a few days. The priority is replacing fluids, noticing warning signs, and knowing when the pattern needs medical advice.",
    hi: "दस्त के लक्षण की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "ઝાડાના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "अतिसाराचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Las heces blandas o acuosas suelen mejorar en pocos días. Lo importante es reponer líquidos y detectar señales de alarma.",
    ar: "التفرقة السريرية والعلامات التحذيرية للإسهال."
  },
  content: {
    definition: "Diarrhoea means loose or watery stools more often than is normal for you. A short episode is common and often improves on its own, but it can lead to dehydration—especially in children, older adults and people with other health conditions.",
    clinicalMeaning: "What matters most is how long it has lasted, whether fluids are staying down, and whether there are warning signs such as blood, fever, severe pain, dehydration or a recent medicine change. Most cases do not need tests, but a clinician may investigate a persistent, severe or unusual pattern.",
    commonCauses: [
      "A stomach bug, food poisoning, or contaminated food or water",
      "A medicine side effect, including antibiotics, or a food intolerance",
      "Irritable bowel syndrome or anxiety-related bowel changes",
      "Inflammatory bowel disease, coeliac disease or another long-term digestive condition when symptoms keep returning"
    ],
    differentialDiagnosis: "A clinician may ask about recent travel, food, sick contacts, antibiotics or other medicines, and whether there is fever, blood, pain or weight loss. Stool or blood tests are considered when symptoms are severe, persistent or suggest a specific infection or underlying condition.",
    redFlags: [
      "Get urgent help for blood or pus in stool, black tarry stool, severe abdominal or rectal pain, a high fever, or symptoms that are rapidly worsening.",
      "Seek prompt advice for dehydration: very little or dark urine, dizziness, unusual sleepiness, confusion, dry mouth, or inability to keep fluids down.",
      "Get medical advice early for a baby or young child, an older adult, pregnancy, a weakened immune system, kidney disease, diabetes, cancer treatment, or diarrhoea lasting more than two days in an adult or 24 hours in a child."
    ],
    lifestyleAdvice: "Take frequent small drinks of water or an oral rehydration solution. Eat when you feel able, starting with simple foods, and avoid alcohol, rich foods, fruit juice and fizzy drinks if they make symptoms worse. Rest, wash hands carefully with soap and water, and do not prepare food for others while you are unwell. Ask a pharmacist or clinician before using medicine to stop diarrhoea, especially for a child or when there is fever or blood in stool.",
    references: [
      "CIT-0135",
      "CIT-0136"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0011-001",
        passage: "Blood or pus in stool, black tarry stool, severe pain, high fever or rapid worsening needs urgent assessment.",
        citationIds: ["CIT-0135", "CIT-0136"]
      },
      {
        claimId: "CLM-S0011-002",
        passage: "Very little or dark urine, dizziness, unusual sleepiness, confusion, dry mouth or inability to keep fluids down can signal dehydration and needs prompt advice.",
        citationIds: ["CIT-0135", "CIT-0136"]
      },
      {
        claimId: "CLM-S0011-003",
        passage: "Short-lived diarrhoea is often caused by infection or food exposure, while medicines, intolerance, IBS and long-term digestive conditions can also contribute.",
        citationIds: ["CIT-0135", "CIT-0136"]
      },
      {
        claimId: "CLM-S0011-004",
        passage: "A supportive or homeopathic consultation should not delay rehydration or medical assessment when warning signs are present.",
        citationIds: ["CIT-0135"]
      }
    ],
    faqs: [
      {
        question: "What should I drink when I have diarrhoea?",
        answer: "Take frequent small drinks of water or an oral rehydration solution. If you also feel sick, small sips are often easier. Avoid fruit juice and fizzy drinks if they make symptoms worse."
      },
      {
        question: "Should I stop eating?",
        answer: "Eat when you feel able. Start with simple foods and avoid rich, fatty or spicy foods if they worsen your symptoms. Staying hydrated matters more than forcing food."
      },
      {
        question: "When should I seek urgent help?",
        answer: "Get urgent help for blood or black stool, severe pain, high fever, rapid worsening, or signs of dehydration such as very little urine, marked dizziness, confusion or inability to keep fluids down."
      },
      {
        question: "Can diarrhoea spread to others?",
        answer: "Some causes, such as a stomach bug, can spread easily. Wash hands with soap and water often, clean shared surfaces, avoid preparing food for others, and stay home while unwell."
      },
      {
        question: "Can homeopathy help with diarrhoea?",
        answer: "A clinician may discuss individual supportive options for a known, non-urgent pattern, but this must not delay fluid replacement or medical care when warning signs are present."
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
  tags: ["Diarrhea", "Diarrhoea", "Hydration", "Digestive Health", "Symptom"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/diarrhea",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Diarrhea symptom profile", "1.2.0: Rewritten as a patient-first hydration and safety guide using the existing visual learning set."]
};
