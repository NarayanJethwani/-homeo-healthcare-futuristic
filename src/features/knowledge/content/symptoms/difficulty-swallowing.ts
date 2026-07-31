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
    en: "Clinical triage, emergency differentiation, and supportive management of Difficulty Swallowing (Dysphagia) under ACG 2022 standards.",
    hi: "निगलने में कठिनाई की नैदानिक समझ और आपातकालीन रेड फ्लैग्स.",
    gu: "ગળવામાં તકલીફના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "गिळण्यास त्रासाचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y señales de emergencia de la disfagia.",
    ar: "التفرقة السريرية والعلامات التحذيرية لصعوبة البلع."
  },
  content: {
    definition: "Difficulty Swallowing (Dysphagia): Impaired transit of liquid or solid boluses from the oral cavity into the stomach, classified into oropharyngeal (neuromuscular/structural) and esophageal (motility/obstructive) origins.",
    clinicalMeaning: "Reflects esophageal stricture, eosinophilic esophagitis, achalasia, esophageal adenocarcinoma, or cranial nerve neuromuscular palsy requiring urgent endoscopic or barium evaluation.",
    commonCauses: [
      "Gastroesophageal Reflux Disease (GERD) Stricture or Eosinophilic Esophagitis",
      "Esophageal Malignancy or Benign Web/Ring",
      "Achalasia or Diffuse Esophageal Spasm",
      "Stroke, Parkinson's, or Myasthenia Gravis (Oropharyngeal Dysphagia)"
    ],
    differentialDiagnosis: "Differentiate oropharyngeal transfer dysphagia (aspiration risk) from esophageal transport dysphagia, globus sensation, and odynophagia.",
    redFlags: [
      "Complete inability to swallow liquids or saliva with bolus impaction (Esophageal Impaction)",
      "Progressive solid-to-liquid dysphagia with unintended weight loss (Esophageal Cancer)",
      "Severe chest/neck pain after vomiting with subcutaneous emphysema (Esophageal Perforation / Boerhaave)"
    ],
    lifestyleAdvice: "Eat small, well-chewed food boluses in an upright posture; seek immediate endoscopic evaluation for complete food impaction or progressive dysphagia.",
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
      "question": "What is a constitutional remedy in homeopathy?",
      "answer": "A constitutional remedy is a deep-acting medicine selected to match a patient's overall physical, mental, and emotional makeup, rather than just treating a single local symptom."
    },
    {
      "question": "Why does the homeopath ask so many detailed questions?",
      "answer": "To find the individualized remedy, the homeopath must understand all unique characteristics—such as sleep patterns, thermal sensitivities, food cravings, and emotional triggers."
    },
    {
      "question": "How should homeopathic remedies be stored?",
      "answer": "Remedies should be stored in a cool, dry place, away from direct sunlight, strong odors (like camphor, perfumes), and electronic devices to maintain their potency."
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
