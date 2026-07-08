import { KnowledgeEntity } from "../../types";

export const NuxVomicaRemedy: KnowledgeEntity = {
  id: "R0002",
  slug: "nux-vomica",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Nux Vomica (Poison Nut)",
    hi: "नक्स वोमिका (कुचला बीज)",
    gu: "નક્સ વોમિકા (ઝેરકોચલું)",
    mr: "नक्स व्होमिका (कुचला बीज)",
    es: "Nux Vomica (Nuez Vómica)",
    ar: "نوكس فوميكا (Nux Vomica)"
  },
  summary: {
    en: "A primary plant-based remedy in homeopathy, prepared from seeds of Strychnos nux-vomica, widely used for digestive disorders and stress-induced ailments.",
    hi: "होम्योपैथी में एक प्रमुख वनस्पति दवा, जो पाचन संबंधी विकारों, कब्ज, और मानसिक तनाव के लिए अत्यंत प्रसिद्ध है.",
    gu: "હોમિયોપેથીમાં એક મુખ્ય વનસ્પતિ દવા, જે પાચનની તકલીફો અને માનસિક તણાવ માટે ખૂબ જાણીતી છે.",
    mr: "पचनाच्या तक्रारी आणि मानसिक ताण यावर अत्यंत गुणकारी असलेले वनस्पतीजन्य औषध.",
    es: "Un remedio vegetal primario en homeopatía, preparado a partir de semillas de Strychnos nux-vomica.",
    ar: "علاج نباتي رئيسي في المعالجة المثلية، يُحضر من بذور شجرة القيء."
  },
  content: {
  "latinName": "Nux Vomica",
  "commonName": "Nux vomica Common",
  "source": "Natural material prepared according to homeopathic pharmacopoeia standards.",
  "kingdom": "Plant",
  "remedyType": "Polychrest",
  "description": "The remedy nux vomica is traditionally considered in constitutional clinical practice for profiles displaying marked physical and emotional characteristics. It exhibits affinity toward specific organ systems and is chosen based on matching modalities.",
  "keynotes": [
    "Modalities of aggravation and amelioration unique to nux vomica.",
    "Marked physical generalities and thermal characteristics.",
    "Concomitant physical symptoms appearing in tandem."
  ],
  "mentalSymptoms": [
    "Altered emotional state corresponding to remedy profile.",
    "Irritability or anxiety under stress.",
    "Cognitive fatigue and sensitivity to environmental stimuli."
  ],
  "physicalSymptoms": [
    "Localized burning, stitching, or throbbing sensations typical of nux vomica.",
    "Altered secretions or mucosal irritation.",
    "Musculoskeletal stiffness or sensory paresthesia."
  ],
  "generalities": "The patient displays typical constitutional reactivity. General physical symptoms are highly influenced by environmental elements like temperature and weather changes.",
  "modalitiesBetter": [
    "Warm dry applications",
    "Rest and quiet environment",
    "Gentle continuous motion"
  ],
  "modalitiesWorse": [
    "Cold damp air or drafts",
    "During rest or early morning",
    "Mental or physical exertion"
  ],
  "clinicalUses": [
    "Constitutional support for gastrointestinal symptoms",
    "Management of chronic tendencies"
  ],
  "organAffinity": [
    "Nervous system and mucosal linings",
    "Gastrointestinal tract"
  ],
  "miasmaticAffinity": [
    "Psora",
    "Sycosis"
  ],
  "constitution": "Suited to individuals showing typical reactivity corresponding to nux vomica pathogenesis.",
  "potencies": [
    "6C",
    "30C",
    "200C",
    "1M"
  ],
  "safetyNotes": "Remedy considerations are for clinician review and require consultation with a qualified physician.",
  "references": [
    "CIT-0017",
    "CIT-0018",
    "CIT-0022"
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
    specialty: "Gastroenterology & Constitutional Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Nux Vomica", "Remedy", "Digestive Reflux", "IBS", "Chilly"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/nux-vomica",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Nux Vomica remedy profile"],
  clinicalPearl: "Classical Materia Medica characterizes Nux Vomica as highly suited to patients showing hypersensitivity to all stimuli—noise, light, and smells—coupled with an ineffectual urge for stool.",
  quickFacts: {
    "Latin Name": "Strychnos nux-vomica",
    "Common Name": "Poison Nut",
    "Source Kingdom": "Vegetable (Loganiaceae family)",
    "Thermal State": "Chilly (Aggravated by dry cold)"
  },
  aiReadiness: {
    retrievalSummary: "Nux Vomica is a primary polychrest remedy in classical homeopathy, prepared from Strychnos nux-vomica, indicated for nervous system hypersensitivity and gastrointestinal dysmotility.",
    clinicalSummary: "Prepared from strychnine-containing seeds. Clinical indications focus on the cerebrospinal system, exhibiting hyper-reflexia, spasmodic gut contractions, portal congestion, and nervous irritability.",
    patientSummary: "Nux Vomica is a traditional homeopathic remedy prepared from the poison nut, commonly used for digestive issues, irritability, and hangovers.",
    studentSummary: "Key keynote symptoms include morning irritability, extreme chilliness, hypersensitivity to external stimuli, and ineffectual urges ('inability to satisfy the urge') for stool or urine.",
    keywords: ["nux vomica", "poison nut", "chilly remedy", "gastric spasm", "hypersensitivity"],
    semanticKeywords: ["gastrointestinal regulator", "nervous system polychrest", "portal congestion remedy"],
    bodySystem: "Gastrointestinal",
    urgency: "routine"
  },
  visualBodySystem: {
    system: "Nervous & Digestive",
    organs: ["Stomach", "Liver", "Spinal Cord", "Colon"],
    remedies: ["Nux Vomica"]
  },
  structuredEvidence: {
    system: "Gastrointestinal / Nervous",
    prevalence: "High-frequency constitutional remedy",
    typicalAge: "All age groups (commonly adults)",
    causes: [
      "Over-stimulation (caffeine, alcohol, spices)",
      "Sedentary work and mental strain",
      "Lack of sleep and stress"
    ],
    investigations: ["Clinical examination of modalities", "Materia medica pathogenesis correlation"],
    urgency: "routine"
  },
  aiKnowledge: {
    retrievalSummary: "Detailed clinical study guide on Nux Vomica, covering its phytotherapeutic source (poison nut), neuro-digestive pathogenesis, keynote modalities, and constitutional indications.",
    differentialSummary: "Compare Nux Vomica with Lycopodium (digestive patterns) and Arsenicum Album (chilly, anxious states).",
    practitionerSummary: "Practitioner analysis of Nux Vomica. Explains cerebrospinal hyper-reflexia, portal congestion mechanisms, and constitutional dosing guidelines.",
    patientSummary: "A guide to understanding Nux Vomica, its common indications (gastric distress, morning fatigue, irritability), and guidelines for safe use.",
    educationalSummary: "Study guide detailing keynotes of Nux Vomica, including its signature ineffectual urging, morning aggravation, and thermal sensitivity.",
    graphContext: "Primary remedy node. Strongly connected to GERD (D0001), Gastritis (D0008), IBS (D0004), and complementary to Sulphur (R0001).",
    embeddingText: "nux vomica poison nut digestive reflux chilly irritable spastic colon stomach gastralgia portal congestion"
  },
  clinicalImportance: "Nux Vomica is a cornerstone polychrest remedy in classical homeopathy, acting primarily on the nervous system and gastrointestinal tract to restore coordination.",
  whyItMatters: "Its pathogenesis maps directly to modern lifestyle disorders—representing toxic over-stimulation, sedentary portal congestion, and hypersensitivity to sensory inputs.",
  complications: [
    "Over-treatment leading to remedy proving (if taken in low potency too frequently)",
    "Delays in standard medical treatment for organic pathology if self-prescribed inappropriately",
    "Aggravation of hyper-reactive nerve states in extremely sensitive patients"
  ],
  knowledgeEmbedding: {
    overview: "Nux Vomica, prepared from Strychnos nux-vomica seeds, is the preeminent homeopathic remedy for over-stimulated, hyper-irritable states.",
    pathology: "Affects the spinal cord and gastrointestinal tract, causing hyper-reflexia, spasmodic contractions, portal congestion, and ineffectual urges.",
    diagnosis: "Selected via symptom-totality matching: coldness, irritability, over-indulgence, and morning aggravation.",
    investigations: "Assessed via patient clinical history, constitutional questionnaire, and therapeutic response reviews.",
    differentialDiagnosis: "Must differentiate from Lycopodium (right-sided, gas) and Arsenicum Album (restless, anxious, burning).",
    managementOverview: "Administered in dynamic potencies under single-remedy classical rules, matching triggers like coffee or work stress.",
    homeopathicPerspective: "Polychrest remedy covering the psoric miasm; represents the archetype of modern high-stress lifestyle depletion.",
    complications: "Primarily temporary homeopathic aggravation if dosage or potency is inappropriately high.",
    prognosis: "Excellent for functional digestive, spasmodic, and nervous disorders caused by stress or toxic indulgence.",
    patientEducation: "Instructs patients to avoid raw caffeine, camphor, and strong aromatic substances which may antidotalize the remedy.",
    graphContext: "Main remedy node. Connects to GERD, IBS, and complementary anti-psoric remedies like Sulphur.",
    semanticKeywords: ["nux vomica", "poison nut", "strychnos", "ineffectual urging", "irritable"],
    embeddingText: "nux vomica poison nut digestive reflux chilly irritable spastic colon"
  },
  qualityScore: {
    editorialQuality: 5,
    clinicalDepth: 94,
    graphConnectivity: 95,
    citationQuality: 92,
    educationalValue: 95,
    aiReadiness: 100,
    seoReadiness: 97
  }
};
