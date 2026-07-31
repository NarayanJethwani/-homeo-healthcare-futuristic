import { KnowledgeEntity } from "../../types";

export const AcidRefluxSymptom: KnowledgeEntity = {
  id: "S0045",
  slug: "acid-reflux",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Acid Reflux (Heartburn)",
    hi: "एसिड रिफ्लक्स / खट्टी डकार (Acid Reflux)",
    gu: "એસિડ રિફ્લક્સ / એસિડિટી (Acid Reflux)",
    mr: "ॲसिड रिफ्लक्स / पित्त (Acid Reflux)",
    es: "Reflujo Ácido (Acid Reflux)",
    ar: "ارتجاع الحمض (Acid Reflux)"
  },
  summary: {
    en: "Clinical evaluation, differential diagnosis, red flag alarm features, and supportive management for Acid Reflux under ACG 2022 guidelines.",
    hi: "एसिड रिफ्लक्स लक्षण की नैदानिक समझ और चेतावनी लक्षण.",
    gu: "એસિડ રિફ્લક્સ લક્ષણની તબીબી સમજણ અને ચેતવણી લક્ષણો.",
    mr: "ॲसिड रिफ्लक्स लक्षणांची वैद्यकीय माहिती आणि इशारे.",
    es: "Evaluación clínica, síntomas de alarma y manejo del reflujo ácido según ACG 2022.",
    ar: "التقييم السريري وعلامات الخطر لارتجاع الحمض."
  },
  content: {
    definition: "Acid Reflux: Retrograde flow of gastric acid and pepsin into the esophagus causing retrosternal burning (heartburn), acid regurgitation, or atypical extra-esophageal symptoms.",
    clinicalMeaning: "Reflects lower esophageal sphincter (LES) transient relaxations, hiatal hernia, or delayed gastric emptying; persistent reflux leads to erosive esophagitis, strictures, or Barrett's Esophagus.",
    commonCauses: [
      "Gastroesophageal Reflux Disease (GERD), Hiatal Hernia",
      "Gastroparesis, Delayed Gastric Emptying, Pregnancy",
      "Dietary Triggers (Fatty foods, chocolate, caffeine, citrus, alcohol)",
      "Medication-Induced LES Relaxation (Calcium channel blockers, nitrates)"
    ],
    differentialDiagnosis: "Differentiate acute coronary syndrome (ACS) / angina (demanding urgent ECG), peptic ulcer disease, eosinophilic esophagitis, esophageal spasm, and achalasia.",
    redFlags: [
      "Progressive difficulty swallowing (dysphagia) or painful swallowing (odynophagia)",
      "Hematemesis, melena, or unexplained iron deficiency anemia",
      "Persistent vomiting, unintentional weight loss, or epigastric mass",
      "Crushing substernal chest pain radiating to jaw or left arm (rule out ACS)"
    ],
    lifestyleAdvice: "Elevate head of bed 6 inches, avoid eating within 3 hours of sleep, eliminate dietary triggers, maintain optimal weight, and avoid tight-fitting garments.",
    references: [
      "CIT-0073",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0002-001",
        passage: "Alarm features such as dysphagia, odynophagia, GI bleeding, or weight loss in acid reflux mandate prompt upper gastrointestinal endoscopy.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0002-002",
        passage: "Retrosternal burning pain must be clinically differentiated from acute coronary syndrome prior to diagnosing uncomplicated GERD.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0002-003",
        passage: "Chronic acid reflux persisting over 5 years in patients over 50 requires screening for Barrett's Esophagus and esophageal adenocarcinoma.",
        citationIds: ["CIT-0073"]
      },
      {
        claimId: "CLM-S0002-004",
        passage: "Homeopathic supportive care (e.g., Nux Vomica, Robinia) does not replace diagnostic endoscopy in patients with GERD alarm symptoms.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What are the common triggers for digestive flares?",
      "answer": "Common triggers include dietary irritants (caffeine, alcohol, fatty foods), chronic emotional stress, irregular eating habits, and dysbiosis."
    },
    {
      "question": "How does the gut-brain axis affect digestive health?",
      "answer": "The gut and brain are in constant communication via the vagus nerve. Emotional stress can alter gut motility, increase visceral sensitivity, and worsen symptoms of GERD, gastritis, or IBS."
    },
    {
      "question": "Can homeopathy manage chronic acid reflux (GERD)?",
      "answer": "Yes, individualized homeopathy can help manage symptoms of chronic acid reflux by addressing digestive motility and hyperacidity alongside lifestyle modifications."
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
  tags: ["Acid Reflux", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/acid-reflux",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Acid Reflux symptom profile"]
};
