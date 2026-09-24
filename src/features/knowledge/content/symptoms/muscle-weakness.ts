import { KnowledgeEntity } from "../../types";

export const MuscleWeaknessSymptom: KnowledgeEntity = {
  id: "S0044",
  slug: "muscle-weakness",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Muscle Weakness (Paresis)",
    hi: "मांसपेशियों की कमजोरी (Muscle Weakness)",
    gu: "સ્નાયુઓની નબળાઈ (Muscle Weakness)",
    mr: "स्नायूंची दुर्बलता (Muscle Weakness)",
    es: "Debilidad Muscular (Paresia)",
    ar: "ضعف العضلات (Muscle Weakness)"
  },
  summary: {
    en: "Muscle weakness means loss of power, not simply tiredness. Sudden weakness—especially on one side—is an emergency.",
    hi: "मांसपेशियों की कमजोरी की नैदानिक समझ और आपातकालीन रेड फ्लैग्स.",
    gu: "સ્નાયુઓની નબળાઈના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "स्नायूंच्या दुर्बलतेचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y evaluación neurológica de la debilidad muscular.",
    ar: "التفرقة السريرية والعلامات التحذيرية لضعف العضلات."
  },
  content: {
    definition: "Muscle weakness is reduced ability to move or hold a part of the body as usual. It is different from fatigue, which is a low-energy feeling without a clear loss of power.",
    clinicalMeaning: "Weakness may follow illness, injury, nerve or muscle problems, medicines, or metabolic conditions. Sudden or rapidly progressive weakness needs emergency assessment.",
    commonCauses: [
      "Stroke or a transient ischaemic attack",
      "A nerve, spinal cord, muscle, or neuromuscular condition",
      "Illness, injury, medicine effects, or electrolyte changes",
      "A long-term neurological or muscle condition"
    ],
    differentialDiagnosis: "A clinician considers onset, one- or two-sided pattern, sensation, pain, speech or swallowing changes, breathing, injury, medicines, and other neurological symptoms.",
    redFlags: [
      "Call emergency services for sudden face, arm, or leg weakness or numbness on one side, facial droop, speech difficulty, confusion, or sudden vision change—even if it settles.",
      "Seek emergency help for rapidly spreading weakness, weakness with breathing or swallowing difficulty, or new bladder or bowel control problems.",
      "Arrange prompt review for new, persistent, progressive, or function-limiting weakness."
    ],
    lifestyleAdvice: "Do not force exercise through unexplained weakness or use supplements as a substitute for assessment. Note the onset, body parts affected, triggers, and associated symptoms to support a clinical review.",
    references: [
      "CIT-0066",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0044-001",
        passage: "Sudden onset of hemiparesis or facial droop demands hyperacute stroke protocol activation for thrombolysis or mechanical thrombectomy.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0044-002",
        passage: "Rapidly progressive ascending flaccid weakness following viral infection suggests Guillain-Barré syndrome requiring urgent IVIG or plasma exchange.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0044-003",
        passage: "Fluctuating muscle weakness involving ocular and bulbar muscles that worsens with exertion suggests myasthenia gravis.",
        citationIds: ["CIT-0066"]
      },
      {
        claimId: "CLM-S0044-004",
        passage: "Homeopathic supportive care does not replace urgent neuroimaging, nerve conduction studies, or emergency airway stabilization in acute paralysis.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "Is weakness the same as fatigue?",
      "answer": "No. Fatigue is low energy; weakness is a real reduction in power, such as being unable to lift an arm or stand as usual."
    },
    {
      "question": "When is weakness a stroke emergency?",
      "answer": "Sudden one-sided weakness or numbness, face droop, speech difficulty, confusion, or sudden vision change requires emergency help."
    },
    {
      "question": "When should I get a review?",
      "answer": "New, persistent, worsening, or function-limiting weakness should be assessed promptly."
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
  tags: ["Muscle Weakness", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/muscle-weakness",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Muscle Weakness symptom profile"]
};
