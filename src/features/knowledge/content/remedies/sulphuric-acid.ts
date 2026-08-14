import { KnowledgeEntity } from "../../types";

export const SulphuricAcidRemedy: KnowledgeEntity = {
  id: "R0072",
  slug: "sulphuric-acid",
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
    en: "Sulphuricum Acidum (Sulphuric Acid)",
    hi: "सल्फ्यूरिकम एसिडम (सल्फ्यूरिक एसिड / गंधक का तेजाब)",
    gu: "સલ્ફ્યુરિકમ એસિડમ (સલ્ફ્યુરિક એસિડ)",
    mr: "सल्फ्यूरिक अ‍ॅसिड (Sulphuric Acid)",
    es: "Sulphuricum Acidum (Ácido Sulfúrico)",
    ar: "سلفوريكوم أسيدوم (Sulphuric Acid)"
  },
  summary: {
    en: "A cardinal mineral acid remedy in classical homeopathic materia medica, historically described for profound internal trembling without visible shaking, hurried and impatient disposition, extreme sour regurgitations that set teeth on edge, and dark ecchymoses / purpura from slight trauma in debilitated states.",
    hi: "होम्योपैथिक साहित्य में बाहर से बिना हिले भीतर पूरे शरीर में भयंकर कंपन (इंटरनल ट्रेम्बलिंग), हर काम में भारी हड़बड़ी व जल्दबाजी, दांत खट्टे करने वाली खट्टी डकारें व उल्टी, और हल्की सी चोट पर नीले-काले चकत्ते (इकाइमोसिस) पड़ने की प्रमुख वर्णित खनिज अम्ल औषधि.",
    gu: "બહારથી ધ્રૂજારી દેખાયા વગર અંદરથી થતી ભયંકર કંપન, દરેક કામમાં ઉતાવળ અને અધિરાઈ, દાંત ખાટા કરી નાખતી ખાટી ઊલટી અને સહેજ વાગવાથી પડતા કાળા-વાદળી ડાઘા માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "बाहेरून न दिसता आतून होणारी प्रचंड थरथर, प्रत्येक कामात अति घाई, दात आंबवणारी आंबट उलटी आणि लहानशा दुखापतीने त्वचेखाली होणाऱ्या काळसर रक्तस्रावावर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio mineral ácido fundamental en materia médica homeopática, descrito históricamente para temblor interno profundo sin temblor visible, prisa extrema, eructos muy ácidos y equimosis por traumatismos mínimos.",
    ar: "علاج حمضي معدني رئيسي في المعالجة المثلية يُوصف تاريخياً للارتعاش الداخلي الشديد بدون ارتعاش خارجي مرئي والتسرع الشديد والحموضة الحارقة للأسنان والكدمات الداكنة الناتجة عن رضوض طفيفة."
  },
  content: {
    latinName: "Acidum sulphuricum",
    commonName: "Sulphuric Acid / Oil of Vitriol",
    source: "Pure concentrated sulphuric acid diluted with distilled water, prepared by potentization according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Sulphuricum Acidum (Sulphuric Acid) is a major deep-acting mineral acid remedy proved by Samuel Hahnemann. In classical homeopathic texts, it occupies a specialized therapeutic sphere characterized by profound physical debility, gastrointestinal hyperacidity, vascular fragility, and nervous exhaustion. Key features recorded in materia medica include an unmistakable keynote sensation of deep internal trembling throughout the whole body without any visible shaking of the limbs, extreme impatience, haste, and hurry where the patient cannot do anything fast enough, intense sourness of the stomach where all vomited matter and regurgitations are so excessively sour that they set the teeth on edge, dark blue or purpuric ecchymoses and petechiae from slight mechanical bruises (especially in aged, cachectic, or alcoholic subjects), and aphthous ulcerations of the mouth and esophagus.",
    keynotes: [
      "Historically described for profound sensation of internal trembling across the whole body without visible tremor",
      "Haste and hurry: extremely impatient, hurried in movements, and feels that everything must be done in an instant",
      "Excessive sourness: sour eructations, sour vomiting, and heartburn so intensely sour that it sets the teeth on edge",
      "Vascular ecchymosis: slight mechanical knocks or trauma leave large dark, purplish, black-and-blue ecchymoses and subcutaneous hematomas",
      "Severe aphthous stomatitis: painful bleeding ulcers of mouth and gums with foul breath and extreme salivation",
      "Craving for alcoholic stimulants with severe chronic dyspepsia and morning vomiting of alcoholics",
    ],
    mentalSymptoms: [
      "Hurried, irritable, and restless; fretful over the slightest delay",
      "Despondent and weeping, especially after physical exhaustion",
      "Aversion to answering questions; wishes to be left alone",
    ],
    physicalSymptoms: [
      "Hemorrhages of dark, uncoagulable blood from any mucous outlet (epistaxis, hematemesis, melena)",
      "Profound weakness and trembling in the stomach with sinking feeling, relieved by sipping warm aromatic drinks",
      "Sciatica and periosteal contusions with black-and-blue discoloration (following Arnica)",
    ],
    generalities:
      "Chilly patient, sensitive to open cold air. Strongly aggravated by cold air, open air, after trauma, and smell of coffee. Ameliorated by warmth, hot drinks, resting, and hands held on parts.",
    modalitiesBetter: [
      "Warmth and hot applications",
      "Warm drinks and small sips of hot water",
      "Resting in bed",
    ],
    modalitiesWorse: [
      "Cold air, cold wind, and bathing in cold water",
      "Physical and mental exertion",
      "Slight mechanical bruises and trauma",
      "Smell or use of coffee",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in internal trembling sensation, severe sour dyspepsia, and purpuric ecchymoses",
      "Historical materia medica reference for post-traumatic black-and-blue hematomas and alcoholic gastritis profiles",
    ],
    organAffinity: [
      "Gastrointestinal tract (stomach, esophagus, oral mucosa)",
      "Vascular capillaries, venous system, and blood coagulation",
      "Central and peripheral nervous system",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis",
      "Syphilis"
    ],
    constitution:
      "Suited to aged, debilitated, cachectic individuals, chronic alcoholics, or women near menopause with nervous trembling and vascular weakness.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude concentrated sulphuric acid is a lethal caustic mineral acid causing catastrophic chemical burns, esophageal perforation, and tissue necrosis; source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute corrosive ingestion, perforated peptic ulcer, acute upper gastrointestinal hemorrhage with hematemesis/shock, or severe thrombocytopenic purpura requires immediate emergency hospital resuscitation; this traditional profile must not delay proven care.",
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
        "question": "What is the classic internal sensation of Sulphuricum Acidum in traditional texts?",
        "answer": "In classical homeopathic materia medica, Sulphuricum Acidum is characterized by a sensation of profound internal trembling throughout the whole body without any visible shaking."
      },
      {
        "question": "What characteristic vascular tendency is noted in Sulphuricum Acidum?",
        "answer": "In traditional literature, Sulphuricum Acidum exhibits extreme capillary fragility, where slight knocks or minor trauma result in large dark purplish ecchymoses and subcutaneous hematomas."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0072-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0072-TRADITIONAL-PROFILE" },
    { claimId: "R0072-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for caustic ingestions, GI hemorrhage, or thrombocytopenic purpura.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0072-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0072-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for caustic burns, active GI bleeding, or acute coagulopathy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute corrosive ingestion with airway burns or esophageal perforation requires immediate emergency toxicology and endoscopy care.", "Massive upper gastrointestinal bleeding with vomiting of blood and hypovolemic shock requires emergency resuscitation."],
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
  tags: ["Sulphuric Acid", "Acidum Sulphuricum", "Remedy", "Internal Trembling", "Extreme Haste", "Sour Vomiting Teeth on Edge", "Dark Ecchymoses"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/sulphuric-acid",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional internal trembling keynotes, mineral acid safety notes, and verified citations"],
  clinicalPearl: "Sulphuricum Acidum is described in traditional materia medica for internal trembling without visible shaking, hurried impatience, intensely sour regurgitations, and dark bruises from slight knocks.",
  quickFacts: {
    "Latin Name": "Acidum sulphuricum",
    "Common Name": "Sulphuric Acid",
    "Source Kingdom": "Mineral (Inorganic Acid)",
    "Thermal State": "Chilly (Aggravated by cold open air & exertion)"
  },
  aiReadiness: {
    retrievalSummary: "Sulphuricum Acidum (Sulphuric Acid) is a major mineral homeopathic remedy described historically for internal trembling without visible shaking, hurried impatience, sour regurgitations setting teeth on edge, and dark ecchymoses.",
    clinicalSummary: "Classical texts describe a Sulphuric acid symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency endoscopy, transfusion, or critical resuscitation for corrosive ingestion or gastrointestinal hemorrhage.",
    patientSummary: "Sulphuric Acid is a traditional homeopathic remedy described in literature for feeling trembling inside while looking still on the outside, rushing around in a hurry, intensely sour stomach reflux, and bruising very easily from slight knocks.",
    studentSummary: "Guiding traditional keynotes include internal trembling without visible tremor, hurried impatience, intensely sour vomiting setting teeth on edge, dark ecchymoses from slight trauma, and alcoholic gastritis debility.",
    keywords: ["sulphuric acid", "acidum sulphuricum", "internal trembling remedy", "sour vomiting teeth on edge", "easy bruising ecchymosis"],
    semanticKeywords: ["mineral acid remedy", "debilitated vascular profile", "capillary fragility"],
    bodySystem: "Gastrointestinal & Vascular",
    urgency: "routine"
  }
};
