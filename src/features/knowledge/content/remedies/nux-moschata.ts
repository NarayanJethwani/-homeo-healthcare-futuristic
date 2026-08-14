import { KnowledgeEntity } from "../../types";

export const NuxMoschataRemedy: KnowledgeEntity = {
  id: "R0056",
  slug: "nux-moschata",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z",
  },
  title: {
    en: "Nux Moschata (Nutmeg)",
    hi: "नक्स मोशचाटा (जायफल)",
    gu: "નક્સ મોસ્ચાટા (જાયફળ)",
    mr: "नक्स मोस्काटा (Nux Moschata)",
    es: "Nux Moschata (Nuez Moscada)",
    ar: "نوكس موشاتا (Nux Moschata)"
  },
  summary: {
    en: "A cardinal botanical neurological and digestive remedy in classical homeopathic materia medica, historically described for overpowering irresistible drowsiness, extreme dryness of mouth and tongue without thirst, sudden absence of mind, and enormous flatulent abdominal distension.",
    hi: "होम्योपैथिक साहित्य में अदम्य नींद और उनींदापन, बिना प्यास के मुंह और जीभ का बेहद सूखना (जीभ तालू से चिपकना), याददाश्त की अचानक कमी, और पेट में भयंकर गैस फूलने की प्रमुख वर्णित औषधि.",
    gu: "અતિશય ઘેન અને ઊંઘની લાગણી, તરસ વિના મોં અને જીભની અત્યંત શુષ્કતા, અચાનક વિસ્મૃતિ અને પેટમાં પુષ્કળ ગેસ ભરાવા માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "अतिशय सुस्ती व अनावर झोप, तहान नसताना तोंड व जीभ कोरडी पडणे आणि पोटात प्रचंड गॅस होण्यावर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico neurológico y digestivo fundamental en materia médica homeopática, descrito históricamente para somnolencia irresistible y abrumadora, sequedad extrema de boca sin sed, ausencia mental y distensión flatulenta.",
    ar: "علاج نباتي عصبي وهضمي رئيسي في المعالجة المثلية يُوصف تاريخياً للنعاس الشديد الذي لا يُقاوم وجفاف الفم الشديد بدون عطش والشرود الذهني وانتفاخ البطن."
  },
  content: {
    latinName: "Myristica fragrans",
    commonName: "Nutmeg",
    source: "Dried seed kernels of Myristica fragrans (nutmeg), potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Nux Moschata (Nutmeg) is a major neurological and gastrointestinal botanical remedy proved by Dr. Helbig. In classical homeopathic texts, it is celebrated for its remarkable trio of pathogenetic keynotes: overpowering, irresistible sleepiness and drowsiness accompanying almost every symptom, extreme and intense dryness of the mouth, tongue, and throat so severe that the tongue sticks to the roof of the mouth yet with complete absence of thirst, and sudden vanishing of thoughts or fainting spells on slightest emotional exertion or standing. Other core features include enormous flatulent distension of the stomach and abdomen where all food seems to turn to gas, and extreme sensitivity to cold damp winds.",
    keynotes: [
      "Historically described for overwhelming, overpowering drowsiness, stupor, and irresistible desire to sleep with all ailments",
      "Extreme dryness of mouth, tongue, and throat; tongue is so dry it sticks to palate, yet there is total thirstlessness",
      "Sudden vanishing of thoughts while speaking, reading, or writing; profound absence of mind and trance-like states",
      "Enormous flatulent distension of stomach and abdomen; every meal immediately turns to gas, causing fullness and dyspnea",
      "Hysterical emotional volatility: laughing changes to weeping in an instant; nervous fainting fits on sight of blood or emotion",
      "Dryness of mucous membranes and skin: dry cough during pregnancy or from getting warm in bed",
    ],
    mentalSymptoms: [
      "Absence of mind and loss of memory; uses wrong words or cannot complete a sentence",
      "Laughs involuntarily, particularly in open air or under emotional stress",
      "Surroundings appear changed, enlarged, or distant (macropsia / altered spatial perception)",
    ],
    physicalSymptoms: [
      "Dry, hacking cough aggravated by getting warm in bed or cold damp air",
      "Dyspepsia with immense bloating, slow digestion, and sleepiness immediately following meals",
      "Summer diarrhea in children from overheating or cold drinks, with dry mouth and stupor",
    ],
    generalities:
      "Extremely chilly patient; hypersensitive to cold air, cold wind, and draft. Strongly aggravated by cold damp weather, washing, mental exertion, and pregnancy. Ameliorated by warmth, warm dry room, and wrapping up warmly.",
    modalitiesBetter: [
      "Warmth and warm dry weather",
      "Wrapping up warmly (especially head)",
      "Resting quietly",
    ],
    modalitiesWorse: [
      "Cold damp weather, cold wind, and drafts",
      "Mental exertion and emotional excitement",
      "During pregnancy and menses",
      "Lying on painful side",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in daytime drowsiness, non-thirst xerostomia, and flatulent dyspepsia",
      "Historical materia medica reference for hysterical fainting and pregnancy-drowsiness profiles",
    ],
    organAffinity: [
      "Central nervous system and higher cognitive faculties",
      "Digestive tract (stomach, intestines, salivary glands)",
      "Mucous membranes and female reproductive organs",
    ],
    miasmaticAffinity: [
      "Psora"
    ],
    constitution:
      "Suited to women, children, and nervous, hysterical individuals with delicate skin, sluggish circulation, and tendency to faint.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude nutmeg contains neurotoxic myristicin and elemicin and requires source-specific toxicology guidance. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute stupor / unresponsiveness, narcoleptic collapse, suspected intracranial mass, anticholinergic poisoning, or severe bowel obstruction requires immediate emergency hospital management; this traditional profile must not delay proven care.",
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
        "question": "What is the hallmark mental and sleep symptom of Nux Moschata?",
        "answer": "In traditional homeopathic materia medica, Nux Moschata is characterized by overwhelming, irresistible drowsiness, stupor, and sudden vanishing of thoughts while speaking or writing."
      },
      {
        "question": "What paradoxical oral symptom is associated with Nux Moschata?",
        "answer": "In classical literature, Nux Moschata exhibits extreme dryness of the mouth and tongue (so dry that the tongue sticks to the palate) accompanied by complete absence of thirst."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0056-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0056-TRADITIONAL-PROFILE" },
    { claimId: "R0056-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for narcolepsy, coma, or intestinal obstruction.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0056-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0056-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for coma, acute poisoning, or mechanical bowel obstruction.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute unresponsiveness, coma GCS <8, or suspected intracranial hemorrhage requires emergency hospitalization.", "Feculent vomiting with acute bowel obstruction requires immediate emergency surgical evaluation."],
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
  tags: ["Nux Moschata", "Nutmeg", "Remedy", "Irresistible Drowsiness", "Dry Mouth No Thirst", "Absence of Mind", "Flatulent Bloating"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/nux-moschata",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional drowsiness keynotes, myristicin safety notes, and verified citations"],
  clinicalPearl: "Nux Moschata is described in traditional materia medica for irresistible drowsiness, extreme dryness of mouth without thirst, vanishing of thoughts, and enormous bloating.",
  quickFacts: {
    "Latin Name": "Myristica fragrans",
    "Common Name": "Nutmeg",
    "Source Kingdom": "Plant (Myristicaceae family)",
    "Thermal State": "Chilly (Aggravated by cold damp air & drafts)"
  },
  aiReadiness: {
    retrievalSummary: "Nux Moschata (Nutmeg) is a major botanical homeopathic remedy described historically for overpowering irresistible drowsiness, extreme dryness of mouth without thirst, sudden absence of mind, and enormous flatulent abdominal distension.",
    clinicalSummary: "Classical texts describe a Nutmeg symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency care for acute coma, poisoning, or mechanical bowel obstruction.",
    patientSummary: "Nux Moschata is a traditional homeopathic remedy described in literature for constant overwhelming sleepiness, a dry sticky mouth without feeling thirsty, and severe stomach gas.",
    studentSummary: "Guiding traditional keynotes include irresistible sleepiness with ailments, dry mouth/tongue without thirst, sudden loss of memory/thoughts while speaking, enormous abdominal distension, and chilliness.",
    keywords: ["nux moschata", "nutmeg", "irresistible sleepiness remedy", "dry mouth without thirst", "bloating remedy"],
    semanticKeywords: ["botanical remedy", "neurological digestive profile", "somnolence profile"],
    bodySystem: "Neurological & Gastrointestinal",
    urgency: "routine"
  }
};
