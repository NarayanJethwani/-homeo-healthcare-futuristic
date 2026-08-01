import { KnowledgeEntity } from "../../types";

export const CantharisRemedy: KnowledgeEntity = {
  id: "R0032",
  slug: "cantharis",
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
      "Traditional materia-medica profile associated with burning urinary symptoms and tenesmus",
      "Historical homeopathic literature association with blistering and burning skin sensations",
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
      "The source beetle contains cantharidin, a potent blistering agent that can cause gastrointestinal and urinary-tract injury and kidney toxicity. A dilution label alone does not prove absence of active ingredient or guarantee quality. Fever with flank pain, inability to urinate, visible blood, suspected ingestion, or significant burns requires urgent or emergency medical care.",
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
        "question": "What is the classic urinary symptom pattern for Cantharis?",
        "answer": "Constant, unbearable, agonizing urge to urinate where urine is passed drop by drop with intense, raw, scalding burning pain."
      },
      {
        "question": "How is Cantharis applied in burn emergencies?",
        "answer": "Classical materia medica associates Cantharis with blistering and burning sensations, but it is not proven to prevent burn blistering. Cool running water and prompt evidence-based burn assessment should not be delayed."
      }
    ]
  },
  claimCitations: [
    {
      claimId: "R0032-TRADITIONAL-PROFILE",
      statement: "Verified classical materia-medica sources describe Cantharis using burning urinary pain, tenesmus, drop-by-drop urination, and blistering sensations.",
      citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"],
      passageId: "CIT-0006-R0032-TRADITIONAL-PROFILE",
    },
    {
      claimId: "R0032-EVIDENCE-LIMITS",
      statement: "The historical profile is traditional literature evidence and does not establish modern clinical efficacy for any disease.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS",
    },
    {
      claimId: "R0032-PRODUCT-SAFETY",
      statement: "A homeopathic dilution label does not by itself guarantee product composition, quality, safety, or effectiveness.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY",
    },
    {
      claimId: "R0032-CONVENTIONAL-CARE-BOUNDARY",
      statement: "Homeopathic products must not delay emergency assessment or replace proven conventional treatment for serious or life-threatening symptoms.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY",
    },
  ],
  redFlags: [
    "Fever with flank pain, visible blood in urine, inability to urinate, or suspected kidney injury requires urgent care.",
    "Significant burns or cantharidin exposure require evidence-based first aid, poison-control advice, and medical assessment.",
  ],
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
    clinicalSummary: "Classical literature derives this profile from Spanish fly, whose cantharidin is toxic; the profile does not establish efficacy or guarantee that a marketed product lacks active cantharidin.",
    patientSummary: "Classical texts associate Cantharis with burning urination and blisters. Blood in urine, fever with flank pain, inability to urinate, or significant burns require prompt conventional care.",
    studentSummary: "Guiding keynotes include raw scalding dysuria drop by drop, constant tenesmus, vesicular burn blisters, burning thirst with liquid aversion, and violent frenzy.",
    keywords: ["cantharis", "spanish fly", "cystitis remedy", "scalding dysuria", "burn blisters"],
    semanticKeywords: ["urological polychrest", "UTI cystitis remedy", "thermal burn remedy"],
    bodySystem: "Urological & Dermatologic",
    urgency: "urgent"
  }
};
