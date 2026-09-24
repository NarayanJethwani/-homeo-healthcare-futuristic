import { KnowledgeEntity } from "../../types";

export const DifficultySwallowingSymptom: KnowledgeEntity = {
  id: "S0043",
  slug: "difficulty-swallowing",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Difficulty Swallowing (Dysphagia)",
    hi: "निगलने में कठिनाई (Dysphagia)",
    gu: "ગળવામાં તકલીફ (Dysphagia)",
    mr: "गिळण्यास त्रास (Dysphagia)",
    es: "Disfagia / Dificultad para Tragar (Dysphagia)",
    ar: "صعوبة البلع (Dysphagia)"
  },
  summary: {
    en: "Difficulty swallowing, called dysphagia, can cause coughing, choking, or food sticking. It should be assessed urgently to prevent dehydration, weight loss, or food entering the airway.",
    hi: "निगलने में कठिनाई की नैदानिक समझ और आपातकालीन रेड फ्लैग्स.",
    gu: "ગળવામાં તકલીફના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "गिळण्यास त्रासाचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y señales de emergencia de la disfagia.",
    ar: "التفرقة السريرية والعلامات التحذيرية لصعوبة البلع."
  },
  content: {
    definition: "Difficulty swallowing, or dysphagia, means food, drink, or saliva does not move safely or easily from the mouth through the throat and food pipe to the stomach.",
    clinicalMeaning: "It can lead to choking, food getting stuck, dehydration, weight loss, or chest infections when food or drink enters the airway. It is a symptom that needs timely assessment.",
    commonCauses: [
      "Acid reflux or another food-pipe condition",
      "A condition affecting the brain, nerves, or muscles, such as stroke or Parkinson's disease",
      "Medicines, mouth or throat problems, or an obstructing food-pipe condition",
      "Cancer or its treatment, which requires specialist assessment"
    ],
    differentialDiagnosis: "A clinician may ask whether the problem is with starting a swallow, solids, liquids, coughing or choking, food sticking, or pain. Speech and language therapists and dietitians may help make eating and drinking safer.",
    redFlags: [
      "Seek emergency help if you cannot swallow saliva, have severe chest pain, trouble breathing, or feel very unwell because food is stuck.",
      "Get urgent advice for coughing or choking with food or drink, food sticking in the throat or chest, a wet or gurgly voice after swallowing, or breathlessness after eating.",
      "Arrange prompt assessment for repeated chest infections, dehydration, weight loss, or progressive difficulty swallowing."
    ],
    lifestyleAdvice: "Sit fully upright for meals and do not rush. Do not change food or fluid textures without an individual swallowing assessment, because what is safest depends on the cause. Follow any existing speech and language therapy plan.",
    references: [
      "CIT-0064",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0043-001",
        passage: "Acute complete inability to swallow liquids or saliva indicates esophageal food impaction requiring emergency endoscopic bolus removal.",
        citationIds: ["CIT-0064"]
      },
      {
        claimId: "CLM-S0043-002",
        passage: "Progressive solid food dysphagia advancing to liquid dysphagia associated with weight loss requires urgent upper endoscopy to exclude esophageal adenocarcinoma.",
        citationIds: ["CIT-0064"]
      },
      {
        claimId: "CLM-S0043-003",
        passage: "Sudden retrosternal pain and subcutaneous emphysema following emesis indicates transmural esophageal rupture (Boerhaave syndrome) demanding surgical emergency care.",
        citationIds: ["CIT-0064"]
      },
      {
        claimId: "CLM-S0043-004",
        passage: "Homeopathic supportive care does not replace diagnostic endoscopy, esophageal manometry, or emergency airway protection in severe dysphagia.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What are signs of dysphagia?",
      "answer": "Coughing or choking during meals, a wet voice after eating, food sticking, bringing food back up, drooling, difficulty chewing, or repeated chest infections can all be signs."
    },
    {
      "question": "Who can help with swallowing problems?",
      "answer": "A clinician can assess the cause and may refer you to a speech and language therapist or dietitian for individual strategies and safer food or drink textures."
    },
    {
      "question": "When is swallowing difficulty an emergency?",
      "answer": "Inability to swallow saliva, severe chest pain, trouble breathing, or feeling very unwell with food stuck needs emergency help."
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
  tags: ["Difficulty Swallowing", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/difficulty-swallowing",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Difficulty Swallowing symptom profile"]
};
