import { KnowledgeEntity } from "../../types";

export const AlliumCepaRemedy: KnowledgeEntity = {
  id: "R0024",
  slug: "allium-cepa",
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
    en: "Allium Cepa (Red Onion)",
    hi: "एलियम सीपा (लाल प्याज)",
    gu: "એલિયમ સીપા (લાલ કાંદો)",
    mr: "एलियम सीपा (Allium Cepa)",
    es: "Allium Cepa (Cebolla Roja)",
    ar: "أليوم سيبا (Allium Cepa)"
  },
  summary: {
    en: "A cardinal respiratory, allergic rhinitis, and neuralgic botanical polychrest in classical homeopathy, indicated for acrid burning nasal discharge excoriating the lip, bland lachrymation, laryngeal coughing, and relief in open cool air.",
    hi: "होम्योपैथी में बहती नाक, जलने वाला जुकाम, आंखों से सादा पानी, और ठंडी हवा में आराम की प्रमुख दवा.",
    gu: "નાકમાંથી બળતરાયુક્ત પાણી ગળવું, આંખમાંથી સાદું પાણી આવવું અને ખુલ્લી હવામાં રાહત માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "नाक गळणे, जळजळणारा सर्दी-खोकला आणि थंड हवेत बरं वाटण्यावर अत्यंत गुणकारी औषध.",
    es: "Un remedio botánico fundamental en homeopatía para rinitis alérgica, secreción nasal ardiente que excoria el labio, lagrimeo suave y alivio en aire fresco.",
    ar: "علاج نباتي رئيسي لالتهاب الأنف التحسسي في المعالجة المثلية يُشار إليه للإفرازات الأنفية الحارقة والدموع اللطيفة."
  },
  content: {
    latinName: "Allium cepa",
    commonName: "Red Onion",
    source: "Fresh bulb of Allium cepa harvested in autumn, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Allium Cepa is a major acute respiratory polychrest proved by Constantine Hering. Recognized for its specific action on upper respiratory mucous membranes, conjunctiva, and nerve endings. Key hallmarks include profuse acrid nasal discharge that excoriates the upper lip, bland non-irritating lachrymation, violent coughing with painful larynx, and relief in cool open air.",
    keynotes: [
      "Profuse, acrid, burning nasal discharge that excoriates nostrils and upper lip with raw red soreness",
      "Profuse, bland, non-irritating lachrymation; eyes burn and smart, but tears do not inflame eyelids or cheeks",
      "Severe laryngeal cough; tickling in larynx causes tearing pain as if larynx would split; patient supports throat while coughing",
      "Symptoms strongly aggravated in a warm room and in the evening; marked relief in open cool air",
      "Neuralgic pains like a long thread following nerve tracts after trauma or amputation (stump neuralgia)",
      "Frequent sneezing, especially upon entering a warm room",
    ],
    mentalSymptoms: [
      "Anxious, melancholy, and fearful of pain; mind feels dull during acute coryza",
      "Confusion of head with frontal catarrhal headache",
    ],
    physicalSymptoms: [
      "Acute allergic rhinitis, hay fever, and spring colds with profuse watery discharge",
      "Catarrhal laryngitis and bronchitis with painful hoarseness",
      "Ciliary neuralgia and burning sensation in eyes",
      "Traumatic neuralgia of surgical stumps or injured nerve fibers",
    ],
    generalities:
      "Chilly patient, yet respiratory symptoms worsen in warm air. Strongly aggravated by warm rooms and evening. Ameliorated by cold open air.",
    modalitiesBetter: [
      "Open cool air and cold room",
      "Motion in open air",
    ],
    modalitiesWorse: [
      "Warm close room and evening (4 PM)",
      "Wet feet and cold damp wind",
      "Handling peaches or smelling flowers",
    ],
    clinicalUses: [
      "Traditional materia-medica profile associated with coryza, rhinitis-like symptoms, and catarrhal laryngeal symptoms",
      "Historical homeopathic literature association with neuralgic symptom patterns",
    ],
    organAffinity: [
      "Nasal mucous membranes and sinuses",
      "Conjunctiva and eyes",
      "Larynx and peripheral nerve endings",
    ],
    miasmaticAffinity: [
      "Psora"
    ],
    constitution:
      "Suited to individuals of phlegmatic or lymphatic temperament prone to acute catarrhal colds.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "This is a traditional materia-medica description, not evidence that a homeopathic product is safe or effective for a disease. Product composition and quality can vary; FDA has approved no product labeled homeopathic. Breathing difficulty, facial swelling, severe infection, or persistent symptoms require prompt conventional medical assessment.",
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
        "question": "What is the key discharge diagnostic rule for Allium Cepa?",
        "answer": "Allium Cepa has ACRID nasal discharge (excoriating lip) paired with BLAND eye lachrymation (non-irritating tears). Euphrasia has the exact reverse."
      },
      {
        "question": "What environmental modality relieves Allium Cepa colds?",
        "answer": "Allium Cepa colds and coughs are characteristically relieved by stepping out into cool open air."
      }
    ]
  },
  claimCitations: [
    {
      claimId: "R0024-TRADITIONAL-PROFILE",
      statement: "Verified classical materia-medica sources describe Allium Cepa using acrid nasal discharge, bland tearing, warm-room aggravation, and cool-air amelioration.",
      citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"],
      passageId: "CIT-0006-R0024-TRADITIONAL-PROFILE",
    },
    {
      claimId: "R0024-EVIDENCE-LIMITS",
      statement: "The historical profile is traditional literature evidence and does not establish modern clinical efficacy for any disease.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS",
    },
    {
      claimId: "R0024-PRODUCT-SAFETY",
      statement: "A homeopathic dilution label does not by itself guarantee product composition, quality, safety, or effectiveness.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY",
    },
    {
      claimId: "R0024-CONVENTIONAL-CARE-BOUNDARY",
      statement: "Homeopathic products must not delay emergency assessment or replace proven conventional treatment for serious or life-threatening symptoms.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY",
    },
  ],
  redFlags: [
    "Breathing difficulty, throat swelling, facial swelling, or cyanosis requires emergency care.",
    "Persistent fever, severe facial pain, or suspected bacterial sinusitis requires conventional assessment.",
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Respiratory & Allergic Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Allium Cepa", "Remedy", "Coryza", "Acrid Nasal Discharge", "Cool Air Better"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/allium-cepa",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with rhinitis keynotes, acrid nasal discharge, and classical citations"],
  clinicalPearl: "Allium Cepa is indicated in acute coryza with acrid burning nasal discharge excoriating the lip, bland eye tears, and relief in cool open air.",
  quickFacts: {
    "Latin Name": "Allium cepa",
    "Common Name": "Red Onion",
    "Source Kingdom": "Plant (Liliaceae family)",
    "Thermal State": "Worse warm room / Better open cool air"
  },
  aiReadiness: {
    retrievalSummary: "Allium Cepa is a major botanical homeopathic polychrest for acute allergic rhinitis, acrid burning nasal discharge excoriating the lip, bland lachrymation, laryngeal cough, and relief in cool air.",
    clinicalSummary: "Classical literature derives this profile from red onion and describes nasal, ocular, and laryngeal symptom patterns; it does not establish modern clinical efficacy or product safety.",
    patientSummary: "Classical homeopathic texts associate Allium Cepa with watery nasal discharge and tearing. It should not replace evaluation or proven treatment for allergy, infection, or breathing difficulty.",
    studentSummary: "Guiding keynotes include acrid nasal discharge excoriating lip, bland lachrymation, laryngeal tearing cough, aggravation in warm rooms, and relief in cool open air.",
    keywords: ["allium cepa", "red onion", "coryza", "acrid nose bland tears", "cool air better"],
    semanticKeywords: ["rhinitis polychrest", "hay fever remedy", "laryngeal cough remedy"],
    bodySystem: "Respiratory & Immune",
    urgency: "routine"
  }
};
