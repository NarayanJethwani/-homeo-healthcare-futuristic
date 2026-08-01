import { KnowledgeEntity } from "../../types";

export const BaptisiaTinctoriaRemedy: KnowledgeEntity = {
  id: "R0028",
  slug: "baptisia-tinctoria",
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
    en: "Baptisia Tinctoria (Wild Indigo)",
    hi: "बैप्टीशिया टिंक्टोरिया (वाइल्ड इंडिगो)",
    gu: "બેપ્ટીશિયા ટિંક્ટોરિયા (વાઇલ્ડ ઇન્ડિગો)",
    mr: "बॅप्टिशिया (Baptisia Tinctoria)",
    es: "Baptisia Tinctoria (Índigo Silvestre)",
    ar: "بابتيشيا تينكتوريا (Baptisia)"
  },
  summary: {
    en: "A cardinal septic, typhoid, and acute prostration botanical polychrest in classical homeopathy, indicated for rapid septic decomposition, dark besotted face, offensive discharges, body-scattered delusion, and liquid-only dysphagia.",
    hi: "होम्योपैथी में टाइफाइड बुखार, शरीर में सड़ांध जैसी बदबू, चेहरा डार्क/उनींदा होना, और केवल तरल पदार्थ निगल पाने की प्रमुख दवा.",
    gu: "ટાઈફોઈડ નો તાવ, શરીરના પરસેવા-શ્વાસની ભારે દુર્ગંધ, મોં અને ચહેરો ઘેરો-ઘેનવાળો થવો અને માત્ર પ્રવાહી જ ગળી શકવા માટે હોમિયોપેથીની ઉત્તમ દવા.",
    mr: "टायफॉइड तापाची गंभीर अवस्था, शरीराची दुर्गंधी, ग्लानी आणि केवळ द्रव पदार्थ गिळता येण्यावर अत्यंत गुणकारी औषध.",
    es: "Un remedio botánico fundamental en homeopatía para estados sépticos y tifoideos, cara abotagada oscura, descargas fétidas y delirio de cuerpo fragmentado.",
    ar: "علاج نباتي رئيسي للحالات التيفية والتعفنية في المعالجة المثلية يُشار إليه بالإنهاك السريع، الوجه الداكن، والإفرازات الكريهة."
  },
  content: {
    latinName: "Baptisia tinctoria",
    commonName: "Wild Indigo / Yellow Indigo",
    source: "Fresh bark of the root of Baptisia tinctoria, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Baptisia Tinctoria is a major acute septic polychrest proved by Dr. James Thompson. Celebrated for its unique action on blood chemistry, septic decomposition, typhoid states, and sensorium. Key features include rapid overwhelming prostration, dark besotted facial expression like a drunkard, foul offensive breath and body discharges, and the characteristic delusion that the body is broken into pieces in bed.",
    keynotes: [
      "Rapidly developing septic or typhoid prostration with muscular soreness, heaviness, and decomposition",
      "Besotted, dark red, dusky facial expression; eyes heavy, half-closed, giving a stuporous or intoxicated look",
      "Extremely offensive body odor, breath, perspiration, stool, urine, and sordes on teeth",
      "Somatic delusion: feels as if body were scattered in pieces around the bed; patient tosses about to gather the pieces",
      "Dysphagia: can swallow liquid fluids only; solids choke and cause pain in esophagus",
      "Indolent, dark, painless ulcerations of throat, tonsils, or bowel (Peyer's patches)",
    ],
    mentalSymptoms: [
      "Stupor and delirium; falls asleep while answering a question or in the middle of a sentence",
      "Confusion of mind; cannot pull thoughts together",
      "Restlessness driven by the sensation that body parts are separated",
    ],
    physicalSymptoms: [
      "Typhoid fever, septicemia, and severe infectious fevers with high pulse and temperature",
      "Septic sore throat, diphtheria, and gangrenous stomatitis with painless dark ulcers and putrid breath",
      "Dysentery or typhoid diarrhea with dark, thin, bloody, offensive stools ('prune-juice stool')",
      "Bed feels too hard; causes aching soreness of muscles all over body",
    ],
    generalities:
      "Hot, septic, stuporous patient. Strongly aggravated by warmth, humid heat, motion, and pressure. Ameliorated by rest.",
    modalitiesBetter: [
      "Rest and quietness",
      "Fresh cool air",
    ],
    modalitiesWorse: [
      "Humid heat and fog",
      "Motion and physical exertion",
      "Pressure on sore parts",
    ],
    clinicalUses: [
      "Traditional materia-medica profile associated with febrile prostration and offensive-discharge patterns",
      "Historical homeopathic literature association with delirium and the sensation that the body is scattered",
    ],
    organAffinity: [
      "Blood and vascular system",
      "Gastrointestinal tract and intestinal Peyer's patches",
      "Throat, mouth, and nervous system",
    ],
    miasmaticAffinity: [
      "Psora",
      "Syphilis"
    ],
    constitution:
      "Suited to individuals suffering from severe acute septic infections with rapid vital breakdown.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "This is a historical materia-medica profile, not evidence that Baptisia treats sepsis, typhoid, influenza, or another infection. A dilution label does not guarantee composition or safety. Fever with confusion, hypotension, breathing difficulty, neck stiffness, severe dehydration, or suspected sepsis requires emergency medical care and proven antimicrobial or supportive treatment as indicated.",
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
        "question": "What mental delusion is unique to Baptisia during fever?",
        "answer": "During high fever or delirium, Baptisia patients feel as if their body were broken into scattered pieces in bed, tossing about to gather the parts together."
      },
      {
        "question": "What is the swallowing capability keynote of Baptisia?",
        "answer": "Baptisia patients can swallow liquid fluids easily, but solid food chokes them due to esophageal weakness or throat ulceration."
      }
    ]
  },
  claimCitations: [
    {
      claimId: "R0028-TRADITIONAL-PROFILE",
      statement: "Verified classical materia-medica sources describe Baptisia Tinctoria using febrile prostration, offensive discharges, a dark besotted appearance, and a scattered-body delusion.",
      citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"],
      passageId: "CIT-0006-R0028-TRADITIONAL-PROFILE",
    },
    {
      claimId: "R0028-EVIDENCE-LIMITS",
      statement: "The historical profile is traditional literature evidence and does not establish modern clinical efficacy for any disease.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS",
    },
    {
      claimId: "R0028-PRODUCT-SAFETY",
      statement: "A homeopathic dilution label does not by itself guarantee product composition, quality, safety, or effectiveness.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY",
    },
    {
      claimId: "R0028-CONVENTIONAL-CARE-BOUNDARY",
      statement: "Homeopathic products must not delay emergency assessment or replace proven conventional treatment for serious or life-threatening symptoms.",
      citationIds: ["CIT-0023", "CIT-0024"],
      passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY",
    },
  ],
  redFlags: [
    "Fever with confusion, hypotension, neck stiffness, or breathing difficulty may indicate sepsis and requires emergency care.",
    "Homeopathy must not replace antimicrobial treatment or hospital supportive care for serious infection.",
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Infectious & Septic Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Baptisia", "Remedy", "Typhoid Fever", "Septic Prostration", "Offensive Discharges"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/baptisia-tinctoria",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with septic keynotes, body-scattered delusion, and classical citations"],
  clinicalPearl: "Baptisia is indicated in rapid septic prostration with a dark besotted face, offensive discharges, body-scattered delusion, and liquid-only swallowing.",
  quickFacts: {
    "Latin Name": "Baptisia tinctoria",
    "Common Name": "Wild Indigo",
    "Source Kingdom": "Plant (Fabaceae family)",
    "Thermal State": "Hot (Septic feverish state)"
  },
  aiReadiness: {
    retrievalSummary: "Baptisia Tinctoria is a major botanical homeopathic polychrest for acute septic prostration, typhoid fevers, dark besotted facial look, foul offensive body discharges, and body-scattered delusion.",
    clinicalSummary: "Classical literature derives this profile from wild indigo and describes febrile prostration patterns; it does not establish efficacy for infection or product safety.",
    patientSummary: "Classical texts associate Baptisia with feverish prostration and confusion. High fever or confusion can be an emergency and requires immediate medical assessment.",
    studentSummary: "Guiding keynotes include rapid septic prostration, besotted face, offensive discharges, body scattered in pieces, liquid-only swallowing, and falls asleep mid-sentence.",
    keywords: ["baptisia", "wild indigo", "typhoid fever", "septic prostration", "offensive discharges"],
    semanticKeywords: ["septic polychrest", "typhoid remedy", "infectious fever remedy"],
    bodySystem: "Hematologic & Gastrointestinal",
    urgency: "emergency"
  }
};
