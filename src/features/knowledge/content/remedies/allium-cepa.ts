import { KnowledgeEntity } from "../../types";

export const AlliumCepaRemedy: KnowledgeEntity = {
  id: "R0024",
  slug: "allium-cepa",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
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
      "Management of acute coryza, allergic rhinitis, hay fever, and acute catarrhal laryngitis",
      "Supportive care in stump neuralgia and post-traumatic nerve pain",
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
      "Botanical source tincture prepared from fresh red onion. Homeopathic potentized preparations (6C, 30C, 200C) are non-toxic. Clinical evaluation is recommended for severe laryngeal dyspnea or bacterial sinusitis.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
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
    clinicalSummary: "Source is red onion. Potentized homeopathic dilutions are safe and non-toxic. Primary clinical affinities include nasal mucous membranes, eyes, larynx, and peripheral nerves.",
    patientSummary: "Allium Cepa is a homeopathic remedy used for watery runny nose with burning lip soreness, sneezing, and watery eyes that feel better in fresh cool air.",
    studentSummary: "Guiding keynotes include acrid nasal discharge excoriating lip, bland lachrymation, laryngeal tearing cough, aggravation in warm rooms, and relief in cool open air.",
    keywords: ["allium cepa", "red onion", "coryza", "acrid nose bland tears", "cool air better"],
    semanticKeywords: ["rhinitis polychrest", "hay fever remedy", "laryngeal cough remedy"],
    bodySystem: "Respiratory & Immune",
    urgency: "routine"
  }
};
