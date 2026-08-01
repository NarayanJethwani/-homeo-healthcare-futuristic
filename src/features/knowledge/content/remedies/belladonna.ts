import { KnowledgeEntity } from "../../types";

export const BelladonnaRemedy: KnowledgeEntity = {
  id: "R0007",
  slug: "belladonna",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Belladonna (Deadly Nightshade)",
    hi: "बेलाडोना (डेडली नाईटशेड)",
    gu: "બેલાડોના (ડેડલી નાઇટશેડ)",
    mr: "बेलाडोना (Deadly Nightshade)",
    es: "Belladonna (Belladona / Sombra Nocturna Mortal)",
    ar: "بيلاادونا (Belladonna)"
  },
  summary: {
    en: "A cardinal acute polychrest in classical homeopathy, indicated for sudden violent vascular congestions, high radiant fever with red face, throbbing pain, dilated pupils, and hypersensitivity to sensory stimuli.",
    hi: "अचानक तेज दर्द, लाल चेहरा, थ्रॉबिंग सिरदर्द, और उच्च बुखार की होम्योपैथिक दवा.",
    gu: "અચાનક આવતો તીવ્ર તાવ, લાલ ચહેરો અને ધબકારા મારતા માથાના દુખાવા માટે હોમિયોપેથીની મુખ્ય દવા.",
    mr: "अचानक येणारा तीव्र ताप, लालसर चेहरा आणि ठणकणाऱ्या वेदनांवर अत्यंत गुणकारी औषध.",
    es: "Un remedio agudo cardinal en homeopatía para congestiones vasculares súbitas, fiebre alta radiante, dolor pulsátil y pupilas dilatadas.",
    ar: "علاج حاد رئيسي في المعالجة المثلية للاحتشائات الوعائية المفاجئة والشديدة والحمى المرتفعة."
  },
  content: {
    latinName: "Atropa belladonna",
    commonName: "Deadly Nightshade / Dwale",
    source: "Fresh whole plant of Atropa belladonna at time of flowering, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Belladonna is a cardinal acute polychrest introduced by Hahnemann. Characterized by the classical triad of acute inflammation: intense Redness, radiant Heat, and Throbbing/pulsating pain. Symptoms appear suddenly, strike violently, and disappear abruptly.",
    keynotes: [
      "Triad of acute inflammation: Redness, radiant Heat, and Throbbing pulsating pain (visible carotid pulsation)",
      "Sudden violent onset and sudden resolution of symptoms",
      "High fever with radiant heat, red flushed face, glassy eyes, dilated pupils, cold feet, and absence of thirst",
      "Extreme hypersensitivity to light, noise, touch, motion, and jarring of the bed",
      "Delirium during fever with desire to escape, bite, strike, or visions of animals/monsters",
    ],
    mentalSymptoms: [
      "Violent mania or delirium during acute fever; wild look, dilated pupils, biting or striking",
      "Hallucinations and fear of ghosts, monsters, or black dogs",
      "Hypersensitivity to sensory input; sudden anger and excitability",
    ],
    physicalSymptoms: [
      "Vascular congestion to the head with throbbing frontal headache and pulsating carotids",
      "Bright red, swollen, dry mucous membranes (pharynx, tonsils, tongue like strawberry)",
      "Spasmodic pain in abdomen, gall bladder, or right iliac fossa aggravated by slightest jar",
      "Dry hot skin that imparts a burning sensation to the examining clinician's hand",
    ],
    generalities:
      "Vascular fullness and heat. Patient cannot tolerate light, noise, jarring, or cold drafts. Absence of thirst during fever.",
    modalitiesBetter: [
      "Resting quietly in a dark, warm room",
      "Semi-erect sitting posture",
      "Warm covering",
    ],
    modalitiesWorse: [
      "Touch, motion, and jarring of bed or floor",
      "Bright light, loud noise, and cold air drafts",
      "Afternoon at 3 PM",
      "Lying flat on bed",
    ],
    clinicalUses: [
      "First-line support for acute congestive fever, acute tonsillitis, and throbbing headache",
      "Management of acute otitis media and right-sided spasmodic pain",
    ],
    organAffinity: [
      "Central nervous system and cerebral circulation",
      "Vascular system and mucous membranes",
      "Skin and glands (right tonsil, parotid)",
    ],
    miasmaticAffinity: [
      "Psora",
      "Acute Miasm"
    ],
    constitution:
      "Suited to plethoric, vigorous, intellectual individuals or children prone to sudden congestive fevers and convulsions.",
    potencies: [
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Raw Atropa belladonna is a potent anticholinergic poison containing atropine, scopolamine, and hyoscyamine (causing toxic mydriasis, hyperthermia, delirium, urinary retention, and tachycardia). Raw plant parts are strictly prohibited; homeopathic preparations must be potentized (30C/200C). Urgent emergency medical evaluation is required for stiff neck/meningismus, high fever convulsions, or acute abdomen.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006"
    ],
    faqs: [
      {
        "question": "What is the classic physical triad of Belladonna?",
        "answer": "The classic Belladonna triad consists of intense Redness, radiant Heat, and Throbbing (pulsating) pain."
      },
      {
        "question": "Is raw Belladonna nightshade plant poisonous?",
        "answer": "Yes. Raw Atropa belladonna is a dangerous poison containing atropine. Homeopathic Belladonna is potentized (e.g. 30C, 200C) and contains no toxic molecules, making it safe for clinical use."
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
    specialty: "Acute Congestive Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Belladonna", "Remedy", "High Fever", "Throbbing Headache", "Redness"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/belladonna",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, atropine toxicity warnings, and classical citations"],
  clinicalPearl: "Belladonna is indicated in sudden violent congestive fevers with red flushed face, throbbing carotids, dilated pupils, and hypersensitivity to jarring.",
  quickFacts: {
    "Latin Name": "Atropa belladonna",
    "Common Name": "Deadly Nightshade / Dwale",
    "Source Kingdom": "Vegetable (Solanaceae family)",
    "Thermal State": "Radiant heat (Thirstless during fever)"
  },
  aiReadiness: {
    retrievalSummary: "Belladonna is a cardinal acute homeopathic polychrest indicated for sudden vascular congestion, radiant fever, red flushed face, throbbing headache, and dilated pupils.",
    clinicalSummary: "Botanical source contains tropane alkaloids (atropine). Homeopathic dilutions are non-toxic. Primary clinical indications include acute tonsillitis, otitis media, throbbing congestive headache, and febrile delirium.",
    patientSummary: "Belladonna is a homeopathic remedy used for sudden high fevers, red throbbing headaches, sore throat, and earache with sensitivity to light and noise.",
    studentSummary: "Guiding keynotes include sudden onset, redness, heat, throbbing headache, dilated pupils, thirstlessness in fever, and aggravation from jarring.",
    keywords: ["belladonna", "deadly nightshade", "throbbing headache", "high fever", "flushed face"],
    semanticKeywords: ["acute congestive polychrest", "tonsillitis remedy", "anticholinergic source remedy"],
    bodySystem: "Nervous & Vascular",
    urgency: "routine"
  }
};
