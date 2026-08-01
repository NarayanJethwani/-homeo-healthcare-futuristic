import { KnowledgeEntity } from "../../types";

export const PhosphorusRemedy: KnowledgeEntity = {
  id: "R0018",
  slug: "phosphorus",
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
    en: "Phosphorus (Elemental Phosphorus)",
    hi: "फास्फोरस (तत्व फास्फोरस)",
    gu: "ફોસ્ફરસ (તત્વ ફોસ્ફરસ)",
    mr: "फॉस्फरस (Phosphorus)",
    es: "Phosphorus (Fósforo Elemental)",
    ar: "فوسفوروس (Phosphorus)"
  },
  summary: {
    en: "A cardinal hemorrhagic, respiratory, nervous, and constitutional mineral polychrest in classical homeopathy, indicated for burning pains, icy cold water cravings, vomiting of water when warmed in stomach, bleeding tendency, and fear of dark or thunderstorms.",
    hi: "होम्योपैथी में जलन वाला दर्द, बर्फ जैसा ठंडा पानी पीने की इच्छा, पानी गर्म होते ही उल्टी, खून बहने की प्रवृत्ति, और अंधेरे के डर की प्रमुख दवा.",
    gu: "બળતરાયુક્ત દુખાવો, બરફ જેવા ઠંડા પાણીની ઈચ્છા, પેટમાં પાણી ગરમ થતાં જ ઊલટી, રક્તસ્રાવની પ્રવૃત્તિ અને અંધારાના ડર માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "जळजळणाऱ्या वेदना, बर्फासारख्या थंड पाण्याची आवड, पोटात पाणी गरम होताच उलट्या होणे आणि रक्तस्रावाच्या प्रवृत्तीवर अत्यंत प्रभावी औषध.",
    es: "Un remedio mineral fundamental en homeopatía para dolores ardientes, sed de agua helada, vómito cuando el agua se calienta en el estómago, tendencia a hemorragias y temor a la oscuridad o tormentas.",
    ar: "علاج معدني رئيسي متعدد الاستخدامات في المعالجة المثلية يُشار إليه للآلام الحارقة، الشهوة للماء المثلج، والنزيف."
  },
  content: {
    latinName: "Phosphorus",
    commonName: "Elemental Yellow/White Phosphorus",
    source: "Elemental phosphorus purified and potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Phosphorus is a major antipsoric, antisycotic, and antisyphilitic mineral polychrest proved by Samuel Hahnemann. Celebrated for its profound action on the nervous system, lungs, liver, bones, and vascular capillary walls. Key features include tall slender habitus, burning pains in spine or stomach, craving for icy cold drinks which are vomited as soon as warmed in the stomach, tendency to profuse hemorrhages, and anxiety during thunderstorms.",
    keynotes: [
      "Tall, slender, narrow-chested, fair-skinned constitution with open, sympathetic, impressionable disposition",
      "Burning pains in isolated spots, along spine, in pit of stomach, palms, and chest",
      "Intense thirst for icy cold water; water is vomited as soon as it becomes warm in the stomach",
      "Marked hemorrhagic diathesis; slight wounds bleed freely, nosebleeds, and rust-colored sputum ('bleeder')",
      "Anxiety and fears: dread of darkness, solitude, thunderstorms, twilight, and impending disease",
      "Emptiness sensation in abdomen, head, and chest; craves cold food, ice cream, and juicy items",
    ],
    mentalSymptoms: [
      "Affectionate, sensitive, and highly impressionable; absorbs feelings of others",
      "Fears when left alone in darkness or during thunderstorms; craves reassurance and touch",
      "Apathy and exhaustion following mental exertion or acute disease",
    ],
    physicalSymptoms: [
      "Pneumonia with tightness across chest, rusty bloody sputum, and lying on right side",
      "Gastritis with burning stomach pain relieved temporarily by cold drinks",
      "Frequent epistaxis, purpura, petechiae, and postoperative capillary bleeding",
      "Fatty degeneration of liver, jaundice, and optic nerve atrophy",
    ],
    generalities:
      "Chilly patient, yet craves cold food/water in stomach. Strongly aggravated by lying on left side, twilight, and thunderstorms. Ameliorated by cold food/water, sleep, and massage.",
    modalitiesBetter: [
      "Icy cold water, ice cream, and cold food",
      "Sleep and resting",
      "Massage, rubbing, and gentle touch",
      "Lying on right side",
    ],
    modalitiesWorse: [
      "Lying on left side or painful side",
      "Thunderstorms, twilight, and evening",
      "Cold air (throat/chest symptoms)",
      "Physical or mental exertion",
    ],
    clinicalUses: [
      "Management of acute pneumonia, acute/chronic bronchitis, epistaxis, and capillary hemorrhage",
      "Supportive care in gastritis, fatty liver disease, anxiety disorders, and post-viral debility",
    ],
    organAffinity: [
      "Lungs, pleura, and respiratory passages",
      "Blood vessels, capillaries, and liver",
      "Nervous system, spine, and eyes",
    ],
    miasmaticAffinity: [
      "Psora",
      "Syphilis",
      "Sycosis"
    ],
    constitution:
      "Suited to tall, thin, delicate individuals with quick perceptions, sensitive nervous systems, and rapid growth.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Raw yellow elemental phosphorus is highly toxic and flammable (causes jaw osteonecrosis and hepatic acute necrosis). Potentized homeopathic preparations (6C, 30C, 200C) contain no free elemental phosphorus and are non-toxic. Seek immediate emergency care for severe hemoptysis, active arterial hemorrhage, or severe lobar pneumonia.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What is the classic stomach vomiting keynote of Phosphorus?",
        "answer": "Phosphorus patients crave icy cold water, but as soon as the water warms up in the stomach, it is vomited out."
      },
      {
        "question": "What mental fear strongly indicates Phosphorus?",
        "answer": "Fear of the dark, fear of being alone, and intense dread during thunderstorms are cardinal mental keynotes of Phosphorus."
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
    specialty: "Respiratory & Hemorrhagic Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Phosphorus", "Remedy", "Icy Cold Thirst", "Hemorrhage", "Thunderstorm Fear"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/phosphorus",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with burning/hemorrhage keynotes, icy cold thirst, and classical citations"],
  clinicalPearl: "Phosphorus is indicated in burning pains, thirst for icy cold water vomited when warmed, bleeding tendencies, and fear of thunderstorms.",
  quickFacts: {
    "Latin Name": "Phosphorus",
    "Common Name": "Elemental Phosphorus",
    "Source Kingdom": "Mineral",
    "Thermal State": "Chilly (Craves cold stomach drinks)"
  },
  aiReadiness: {
    retrievalSummary: "Phosphorus is a major mineral homeopathic polychrest for burning pains, icy cold water cravings, vomiting of water when warmed in stomach, bleeding tendency, and fear of dark or thunderstorms.",
    clinicalSummary: "Source is elemental phosphorus. Potentized homeopathic dilutions are safe and non-toxic. Primary clinical affinities include lungs, capillary blood vessels, liver, and nervous system.",
    patientSummary: "Phosphorus is a homeopathic remedy used for chest colds, burning stomach pain relieved by ice-cold water, nosebleeds, and fear of storms or darkness.",
    studentSummary: "Guiding keynotes include burning pains, icy cold water thirst vomited when warm, bleeding from small wounds, tall slender habitus, thunderstorm fear, and aggravation lying on left side.",
    keywords: ["phosphorus", "elemental phosphorus", "icy cold water", "bleeding remedy", "thunderstorm fear"],
    semanticKeywords: ["hemorrhagic polychrest", "pneumonia remedy", "capillary vascular remedy"],
    bodySystem: "Respiratory & Hematologic",
    urgency: "routine"
  }
};
