import { KnowledgeEntity } from "../../types";

export const CantharisRemedy: KnowledgeEntity = {
  id: "R0032",
  slug: "cantharis",
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
    en: "Cantharis (Spanish Fly)",
    hi: "कैंथरिस (स्पैनिश फ्लाई)",
    gu: "કેન્થરિસ (સ્પેનિશ ફ્લાય)",
    mr: "कँथरिस (Cantharis)",
    es: "Cantharis (Mosca Española)",
    ar: "كانثاريس (Cantharis)"
  },
  summary: {
    en: "A cardinal urinary, dermatological, and burn-management animal polychrest in classical homeopathy, indicated for raw burning dysuria, constant urinary tenesmus passing urine drop by drop, vesicular burns with blisters, and intense thirst with liquid aversion.",
    hi: "होम्योपैथी में पेशाब में अत्यधिक जलन, बूंद-बूंद दर्दनाक पेशाब, त्वचा के जलने या छाले पड़ने, और मूत्रमार्ग के संक्रमण की प्रमुख आपातकालीन दवा.",
    gu: "પેશાબમાં અતિશય બળતરા, ટીપે-ટીપે દુખાવો થવો, ચામડી દાઝી જવાથી પડેલા ફોલ્લા અને પેશાબના ચેપ માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "लघवी करताना होणारी तीव्र जळजळ, थेंब थेंब लघवी होणे आणि आगीने भाजल्यावर उठणाऱ्या फोडांवर अत्यंत गुणकारी औषध.",
    es: "Un remedio animal fundamental en homeopatía para disuria ardiente intensa, tenesmo urinario constante gota a gota, quemaduras vesiculares y aversión a líquidos.",
    ar: "علاج حيواني رئيسي في المعالجة المثلية يُشار إليه للحرقة الشديدة عند التبول، التبول قطرة قطرة، والحروق البثرية."
  },
  content: {
    latinName: "Lytta vesicatoria",
    commonName: "Spanish Fly / Blister Beetle",
    source: "Dried whole beetle Lytta vesicatoria containing cantharidin, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Animal",
    remedyType: "Polychrest",
    description:
      "Cantharis is a major animal polychrest proved by Samuel Hahnemann. Recognized for its intense specific irritation of urinary mucous membranes, skin epidermis, and serous membranes. Key features include unmanageable burning pain throughout the urinary apparatus, constant unbearable urging to urinate passing urine drop by drop, vesicular burn blisters, and burning thirst with aggravation from drinking.",
    keynotes: [
      "Intense, raw, cutting, burning pain throughout the urinary tract (kidneys, ureters, bladder, urethra)",
      "Constant unbearable urinary tenesmus; patient passes urine drop by drop with severe scalding agony",
      "Scalds, thermal/chemical burns, and vesicular skin eruptions with large serum-filled blisters",
      "Burning thirst with aversion to liquids; drinking water increases urinary bladder spasms and throat pain",
      "Violent, frenzied mental excitement, sexual mania, or satyriasis with painful priapism",
      "Stool containing shreddy mucous membrane flakes ('scrapings of intestines') with burning tenesmus",
    ],
    mentalSymptoms: [
      "Furious delirium, paroxysms of rage, and screaming; attempts to bite or strike",
      "Restlessness and anxiety driven by unbearable urinary or burn agony",
      "Hydrophobia-like aversion to liquids or shiny objects",
    ],
    physicalSymptoms: [
      "Acute cystitis, urethritis, pyelonephritis, and hematuria with scalding pain",
      "Second-degree thermal scalds and solar dermatitis with tense blistering",
      "Gastritis and dysentery with raw burning pain throughout alimentary canal",
      "Erysipelas of face with large blister formation and dark red inflammation",
    ],
    generalities:
      "Hot, burning patient. Strongly aggravated by drinking cold water, urination, touch, and coffee. Ameliorated by warmth and rubbing.",
    modalitiesBetter: [
      "Warmth and gentle rubbing",
      "Resting in bed",
    ],
    modalitiesWorse: [
      "Urination and during micturition",
      "Drinking cold water or coffee",
      "Touch and pressure on bladder",
    ],
    clinicalUses: [
      "Emergency management of acute urinary tract infections (UTI), cystitis, dysuria, and hematuria",
      "Management of acute second-degree burns, scalds, sunburn blisters, and blistering erysipelas",
    ],
    organAffinity: [
      "Urinary system (bladder, urethra, kidneys)",
      "Skin, epidermis, and serous membranes",
      "Gastrointestinal mucosa and reproductive organs",
    ],
    miasmaticAffinity: [
      "Psora",
      "Syphilis"
    ],
    constitution:
      "Suited to individuals suffering from acute, violent, rapidly developing urinary or dermatological burn emergencies.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Source beetle contains cantharidin, a potent vesicant and nephrotoxin. Potentized homeopathic preparations (6C, 30C, 200C) are non-toxic and free of active cantharidin nephrotoxicity. Immediate emergency medical care is required for acute pyelonephritis, gross hematuria, acute renal failure, or extensive third-degree burns.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007"
    ],
    faqs: [
      {
        "question": "What is the classic urinary symptom pattern for Cantharis?",
        "answer": "Constant, unbearable, agonizing urge to urinate where urine is passed drop by drop with intense, raw, scalding burning pain."
      },
      {
        "question": "How is Cantharis applied in burn emergencies?",
        "answer": "Cantharis is the premier homeopathic remedy for first- and second-degree thermal scalds and burns to prevent blistering and relieve burning pain."
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
    specialty: "Urological & Burn Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Cantharis", "Remedy", "Cystitis", "Scalding Dysuria", "Burn Blisters"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/cantharis",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with cystitis keynotes, burn blistering, and classical citations"],
  clinicalPearl: "Cantharis is indicated in severe acute cystitis with scalding drop-by-drop dysuria, and in second-degree thermal burns with large blisters.",
  quickFacts: {
    "Latin Name": "Lytta vesicatoria",
    "Common Name": "Spanish Fly / Blister Beetle",
    "Source Kingdom": "Animal (Insecta)",
    "Thermal State": "Hot (Raw burning heat)"
  },
  aiReadiness: {
    retrievalSummary: "Cantharis is a major animal homeopathic polychrest for acute cystitis, scalding dysuria passing urine drop by drop, raw burning pain, second-degree burn blisters, and urinary tenesmus.",
    clinicalSummary: "Source is Spanish fly beetle containing cantharidin. Potentized homeopathic dilutions are safe and non-toxic. Primary clinical affinities include bladder, urethra, kidneys, skin, and mucosa.",
    patientSummary: "Cantharis is a homeopathic remedy used for severe urinary tract infection with intense burning pain while urinating, and for skin burns or scalds with painful blisters.",
    studentSummary: "Guiding keynotes include raw scalding dysuria drop by drop, constant tenesmus, vesicular burn blisters, burning thirst with liquid aversion, and violent frenzy.",
    keywords: ["cantharis", "spanish fly", "cystitis remedy", "scalding dysuria", "burn blisters"],
    semanticKeywords: ["urological polychrest", "UTI cystitis remedy", "thermal burn remedy"],
    bodySystem: "Urological & Dermatologic",
    urgency: "routine"
  }
};
