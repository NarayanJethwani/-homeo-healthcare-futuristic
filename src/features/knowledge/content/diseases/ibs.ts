import { KnowledgeEntity } from "../../types";

export const IbsDisease: KnowledgeEntity = {
  id: "D0004",
  slug: "ibs",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Irritable Bowel Syndrome (IBS)",
    hi: "इरिटेबल बॉवेल सिंड्रोम (आईबीएस)",
    gu: "સંગ્રહણી અને આંતરડાની નબળાઈ (IBS)",
    mr: "आय.बी.एस. (Irritable Bowel Syndrome)",
    es: "Síndrome del Intestino Irritable (SII)",
    ar: "متلازمة القولون العصبي (IBS)"
  },
  summary: {
    en: "A common gastrointestinal disorder characterized by recurrent abdominal pain, bloating, and altered bowel habits (constipation, diarrhea, or both) without structural disease.",
    hi: "एक आम पेट की बीमारी जिसमें पेट में ऐंठन, दर्द, सूजन, और मल त्याग की आदतों में बदलाव (कब्ज या दस्त) होता है.",
    gu: "આંતરડાની એક સામાન્ય તકલીફ જેમાં પેટમાં દુખાવો, ગેસ, અને મળત્યાગની આદતો બદલાવી (કબજિયાત અથવા ઝાડા) જેવા લક્ષણો દેખાય છે.",
    mr: "पोटाचा एक सामान्य आजार ज्यामध्ये पोटदुखी, फुगगी आणि शौचाच्या सवयींमध्ये वारंवार बदल होणे (बद्धकोष्ठता किंवा जुलाब) अशी लक्षणे दिसतात.",
    es: "Un trastorno gastrointestinal común caracterizado por dolor abdominal recurrente y hábitos intestinales alterados.",
    ar: "اضطراب شائع في الجهاز الهضمي يتميز بآلام متكررة في البطن والانتفاخ وتغير عادات الأمعاء."
  },
  content: {
    overview: "Irritable Bowel Syndrome (IBS) is a functional gastrointestinal disorder characterized by chronic abdominal pain, bloating, and alteration of bowel habits in the absence of any organic, structural, or biochemical abnormalities. It is a highly prevalent condition that significantly impacts patients' health-related quality of life.",
    definition: "IBS is defined clinically by the Rome IV criteria. It is characterized by recurrent abdominal pain on average at least 1 day per week in the last 3 months, associated with defecation, changes in frequency of stool, or changes in form (appearance) of stool.",
    causes: [
      "Visceral hypersensitivity: Increased pain perception in response to gut distension.",
      "Gastrointestinal motility alterations: Delayed or accelerated transit times.",
      "Gut-brain axis dysregulation: Altered communication between the central nervous system and enteric nervous system.",
      "Post-infectious inflammation: Persistent low-grade mucosal inflammation following acute gastroenteritis."
    ],
    riskFactors: [
      "Younger age (typically under 50 years of age).",
      "Female sex (twice as common in women, potentially linked to estrogen fluctuations).",
      "Psychological factors: History of anxiety, depression, chronic stress, or early life trauma.",
      "Family history of IBS."
    ],
    symptoms: [
      "Abdominal pain or cramping: Usually related to defecation and often relieved after passing stool.",
      "Altered bowel movements: Defecation patterns categorized as constipation-predominant (IBS-C), diarrhea-predominant (IBS-D), or mixed (IBS-M).",
      "Bloating and abdominal distension: Sensation of abdominal swelling, worsening throughout the day.",
      "Mucus in stool: Passage of clear or white mucus during defecation."
    ],
    diagnosis: "Diagnosed clinically based on the Rome IV criteria after excluding organic diseases. Key components include assessing symptoms for at least 6 months before diagnosis and testing for fecal calprotectin, celiac serology, and thyroid functions to rule out inflammatory bowel disease, celiac disease, or thyroid disorders.",
    differentialDiagnosis: "Celiac disease, Inflammatory Bowel Disease (Crohn's disease or Ulcerative Colitis), Microscopic colitis, Bile acid malabsorption, and Chronic pancreatitis.",
    labTests: [
      "Fecal Calprotectin to screen for intestinal mucosal inflammation (rules out IBD).",
      "Celiac Serology (tTG-IgA) to rule out celiac disease.",
      "Complete Blood Count (CBC) to screen for systemic inflammation or anemia."
    ],
    imaging: "Abdominal CT or Colonoscopy is not indicated unless red flags or atypical features (e.g. onset after 50 years, nocturnal symptoms, bleeding) are present.",
    redFlags: [
      "Onset of symptoms after age 50.",
      "Rectal bleeding or melena.",
      "Unexplained, progressive weight loss.",
      "Nocturnal diarrhea (waking up to pass stool).",
      "Unexplained iron deficiency anemia.",
      "Family history of colon cancer, celiac disease, or IBD."
    ],
    conventionalManagement: "Conventional therapy is symptomatic: dietary modifications (Low-FODMAP diet), fiber supplements for constipation, antispasmodics (Dicyclomine) for cramping, antidiarrheals (Loperamide) for diarrhea, and low-dose tricyclic antidepressants (TCAs) to regulate visceral pain transmission.",
    homeopathicApproach: "Homeopathy focuses on the gut-brain axis, aiming to normalize gut motility and reduce visceral hypersensitivity. Selection of remedies like Lycopodium (for lower abdominal flatulence and anticipatory anxiety) or Nux Vomica (for constrictive spasms and work-induced stress) corresponds directly to the patient's emotional temperament and physical modalities.",
    lifestyleAdvice: "Follow a Low-FODMAP diet under supervision, avoiding fermentable carbohydrates. Increase dietary soluble fiber gradually. Drink plenty of water. Exercise regularly to promote digestive motility. Manage stress through mindfulness, therapy, or biofeedback.",
    references: ["CIT-0001"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Gastroenterology & Constitutional Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-A",
  tags: ["IBS", "Irritable Bowel Syndrome", "Spastic Colon", "Bloating", "Digestive Disease"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/ibs",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of IBS disease profile"]
};
