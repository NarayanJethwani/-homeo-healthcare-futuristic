import { KnowledgeEntity } from "../../types";

export const ChinaOfficinalisRemedy: KnowledgeEntity = {
  id: "R0035",
  slug: "cinchona-officinalis",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-01T12:00:00Z",
    reviewed: "2026-08-01T12:00:00Z",
  },
  title: {
    en: "China Officinalis (Cinchona Bark)",
    hi: "चाइना ऑफिसिनेलिस (सिंकोना छाल)",
    gu: "ચાઇના ઓફિસિનાલિસ (સિંકોના છાલ)",
    mr: "चायना ऑफिसिनालिस (China Off)",
    es: "China Officinalis (Corteza de Quina)",
    ar: "تشاينا أوفيسيناليس (Cinchona)"
  },
  summary: {
    en: "A cardinal botanical polychrest in classical homeopathic materia medica, historically described for debility following vital fluid loss, tympanitic abdominal flatulence, periodic thermal paroxysms, and extreme cutaneous hyperesthesia.",
    hi: "होम्योपैथिक साहित्य में शारीरिक तरलों (रक्त, पसीना, दस्त) के ह्रास से आई कमजोरी, पेट में अत्यधिक गैस, और रुक-रुक कर आने वाले बुखार के लिए वर्णित प्रमुख औषधि.",
    gu: "શરીરના પ્રવાહી (લોહી, પરસેવો, ઝાડા) ઘટવાથી આવતી અતિશય નબળાઈ, પેટમાં અસહ્ય ગેસ અને સમયાંતરે આવતા તાવ માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "शरीरातील द्रव (रक्त, घाम, जुलाब) कमी झाल्यामुळे येणारा अशक्तपणा आणि पोटात फुगणाऱ्या गॅसवर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico fundamental en materia médica homeopática, descrito históricamente para debilidad tras pérdida de fluidos vitales, flatulencia abdominal y paroxismos febriles periódicos.",
    ar: "علاج نباتي رئيسي في المعالجة المثلية يُوصف تاريخياً للوهن الناتج عن فقدان السوائل الحيوية وانتفاخ البطن."
  },
  content: {
    latinName: "Cinchona officinalis",
    commonName: "Peruvian Bark / Cinchona",
    source: "Dried bark of Cinchona officinalis harvested from Cinchona trees, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "China Officinalis (Cinchona) holds paramount historical significance as the remedy that inspired Samuel Hahnemann's discovery of the Law of Similars in 1790. In classical homeopathic texts, it is associated with marked weakness, anemia, and nervous irritability resulting from loss of vital fluids (blood loss, excessive lactation, diarrhea, suppuration, or profuse sweating). Key features recorded in materia medica include extreme abdominal flatulence with tympanitic distension without relief from eructation, hyperesthesia where light touch causes discomfort while hard pressure affords relief, and periodic thermal paroxysms.",
    keynotes: [
      "Historically described for extreme debility and trembling following loss of vital fluids (hemorrhage, diarrhea, lactation, suppuration)",
      "Tympanitic distension of abdomen with excessive flatulence, feeling full to bursting, where belching brings no relief",
      "Cutaneous hyperesthesia: light touch or gentle breeze aggravates pains, whereas firm steady pressure brings comfort",
      "Marked periodicity: thermal paroxysms, neuralgias, or headaches returning at regular interval hours",
      "Porous, anemic appearance with dark rings around eyes, ringing in ears (tinnitus), and thready rapid pulse",
      "Congestive throbbing headache following severe hemorrhage or exhaustion",
    ],
    mentalSymptoms: [
      "Apathy, taciturnity, and indifference; disinclined to mental work",
      "Hypersensitive, irritable, and easily offended; full of theoretical plans in evening",
      "Anxious apprehension and fear of animals or dark",
    ],
    physicalSymptoms: [
      "Debility and slow recovery after severe illness, dysentery, or blood loss",
      "Periodic malarial-type thermal paroxysms with distinct chill, fever, and drenching sweat stages",
      "Gallstone colic with jaundice and liver tenderness",
      "Painless, watery, undigested stool with marked weakness and thirst",
    ],
    generalities:
      "Chilly patient, sensitive to cold air and drafts. Strongly aggravated by fluid loss, light touch, periodic hours, and night. Ameliorated by hard pressure, bending double, and warmth.",
    modalitiesBetter: [
      "Hard pressure and bending double",
      "Warmth and resting in room",
    ],
    modalitiesWorse: [
      "Loss of vital fluids (hemorrhage, diarrhea)",
      "Light touch and gentle breezes",
      "Periodicity and autumn weather",
      "Night and after meals",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in fluid-loss debility and flatulent dyspepsia",
      "Historical materia medica reference for periodic neuralgias and post-febrile convalescence",
    ],
    organAffinity: [
      "Vascular system, blood composition, and spleen/liver",
      "Gastrointestinal tract and autonomic nerves",
      "Central and peripheral nervous system",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycotic",
      "Syphilitic"
    ],
    constitution:
      "Suited to anemic, broken-down constitutions with dark hair, swarthy complexion, and sensitive nervous stamina.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude Cinchona and quinine-containing products can cause serious adverse effects and require source-specific toxicology guidance. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute heavy bleeding, fainting, shock, or suspected severe anemia requires immediate emergency assessment; this traditional profile must not delay proven care.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007",
      "CIT-0023",
      "CIT-0024"
    ],
    faqs: [
      {
        "question": "What is the historical significance of China Officinalis in homeopathy?",
        "answer": "China Officinalis (Cinchona bark) was the initial substance tested by Dr. Samuel Hahnemann in 1790, leading directly to his formulation of the homeopathic Law of Similars (Similia Similibus Curentur)."
      },
      {
        "question": "How does touch affect China Officinalis symptom profiles in classical texts?",
        "answer": "In traditional homeopathic texts, light touching or gentle caressing aggravates pains, while firm, hard pressure provides comfort."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0035-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0035-TRADITIONAL-PROFILE" },
    { claimId: "R0035-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for bleeding, anemia, fever, or gastrointestinal disease.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0035-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0035-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for hemorrhage, shock, or poisoning.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Uncontrolled bleeding, fainting, confusion, or shock requires emergency care.", "Suspected crude-source toxicity, severe weakness, chest symptoms, or abnormal heartbeat requires urgent assessment."],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Governance & Materia Medica",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["China Off", "Cinchona", "Remedy", "Fluid Loss Debility", "Flatulence", "Periodicity"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/cinchona-officinalis",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional fluid-loss debility keynotes, cinchonism safety notes, and verified citations"],
  clinicalPearl: "China Officinalis is described in traditional materia medica for weakness following loss of vital fluids, flatulent abdomen, and hyperesthesia to light touch.",
  quickFacts: {
    "Latin Name": "Cinchona officinalis",
    "Common Name": "Peruvian Bark / Cinchona",
    "Source Kingdom": "Plant (Rubiaceae family)",
    "Thermal State": "Chilly (Sensitive to cold drafts)"
  },
  aiReadiness: {
    retrievalSummary: "China Officinalis (Cinchona) is a major botanical homeopathic remedy described historically for fluid-loss debility, tympanitic abdominal distension without relief from eructation, light-touch hyperesthesia, and periodic fever.",
    clinicalSummary: "Classical texts describe a Cinchona-bark symptom profile. This historical description does not establish clinical efficacy or product safety, and it must not delay emergency care for bleeding, shock, or serious adverse effects.",
    patientSummary: "China Officinalis is a traditional homeopathic remedy described in literature for weakness after loss of fluids (like sweating, diarrhea, or bleeding) and uncomfortable abdominal gas.",
    studentSummary: "Guiding traditional keynotes include fluid-loss debility, flatulent abdominal distension, light touch worse / hard pressure better, 1790 Hahnemann discovery role, and periodic paroxysms.",
    keywords: ["china off", "cinchona", "fluid loss debility", "flatulence remedy", "periodicity remedy"],
    semanticKeywords: ["botanical remedy", "cinchona bark profile", "fluid loss weakness"],
    bodySystem: "Hematologic & Gastrointestinal",
    urgency: "routine"
  }
};
