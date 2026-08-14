import { KnowledgeEntity } from "../../types";

export const SabinaRemedy: KnowledgeEntity = {
  id: "R0064",
  slug: "sabina",
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
    en: "Sabina (Savin / Juniperus Sabina)",
    hi: "सबीना (सेविन / जुनिपरस सबीना)",
    gu: "સબીના (સેવિન / જુનિપરસ સબીના)",
    mr: "सबीना (Sabina)",
    es: "Sabina (Enebro Sabina)",
    ar: "سابينا (Sabina)"
  },
  summary: {
    en: "A cardinal gynecological, pelvic, and hemorrhagic botanical remedy in classical homeopathic materia medica, historically described for profuse, active, bright red uterine hemorrhages mixed with dark clots, characteristic shooting pains extending from sacrum to pubes, and dysmenorrhea.",
    hi: "होम्योपैथिक साहित्य में चमकीले लाल व काले थक्केदार भारी गर्भाशय रक्तस्राव (मेनोरेजिया), त्रिकास्थि (सैक्रम) से आगे पेडू (प्यूबिस) की ओर जाने वाले तेज दर्द, और गर्भपात की प्रवृत्ति की प्रमुख वर्णित औषधि.",
    gu: "કાળા ગઠ્ઠાવાળા તેજસ્વી લાલ ગર્ભાશયના ભારે રક્તસ્રાવ, કમરના પાછળના ભાગથી આગળ પેડૂ તરફ આવતી તીવ્ર કળ અને ગર્ભપાતની આશંકા માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "काळ्या गुठळ्यांसह होणारा भडक लाल रक्तस्राव आणि माकडहाडापासून पुढे ओटीपोटाकडे जाणारी तीव्र कळ यावर अत्यंत गुणकारी पारंपरिक स्त्री-रोग औषध.",
    es: "Un remedio botánico ginecológico y hemorrágico fundamental en materia médica homeopática, descrito históricamente para hemorragias uterinas activas de sangre roja brillante con coágulos oscuros y dolor del sacro al pubis.",
    ar: "علاج نباتي نسائي ونزفي رئيسي في المعالجة المثلية يُوصف تاريخياً للنزيف الرحمي الغزير والمشرق المختلط بالجلطات الداكنة والآلام الممتدة من العجز إلى العانة."
  },
  content: {
    latinName: "Juniperus sabina",
    commonName: "Savin",
    source: "Fresh young tender twigs and leaves of Juniperus sabina, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Sabina (Savin) is a major gynecological and vascular botanical remedy proved by Samuel Hahnemann. In classical homeopathic texts, it is celebrated for its specific pathogenetic affinity for the pelvic vascular system, uterus, fibrous tissues, and arthritic joints. Key features recorded in materia medica include profuse, gushing, active hemorrhages of bright red blood mixed with dark clotted lumps (menorrhagia, metrorrhagia, post-partum bleeding), an unmistakable radiating pain that shoots directly from the sacrum through the pelvis to the pubes, labor-like bearing-down pains extending into the thighs, threatened abortion typically occurring around the third month of pregnancy, and arthritic joint swellings alternating with uterine complaints.",
    keynotes: [
      "Historically described for active, profuse, gushing uterine hemorrhages of bright red blood mixed with dark clotted lumps, worse on motion",
      "Characteristic pathway of pelvic pain: labor-like cramping pains shooting directly from the sacrum to the pubes",
      "Threatened abortion or miscarriage occurring characteristically at the third month of gestation with sacrum-to-pubes pains",
      "Severe dysmenorrhea with violent drawing and tearing pains down the thighs and intense sexual excitation",
      "Figwarts, condylomata, and sycotic excrescences accompanied by burning and intolerable itching",
      "Arthritic and gouty nodes in joints alternating with or accompanied by profuse uterine discharges",
    ],
    mentalSymptoms: [
      "Music is intolerable and causes nervous trembling and weeping",
      "Irritable, depressed, and disinclined to conversation",
      "Anxious apprehension and fear of fatal hemorrhage",
    ],
    physicalSymptoms: [
      "Menorrhagia: menstrual flow is copious, protracted, clotted, and offensive, flowing in gushes on slight movement",
      "Post-partum hemorrhage due to uterine atony with sacrum-to-pubes pain",
      "Gouty nodosities in toe and finger joints with intense burning and throbbing",
    ],
    generalities:
      "Warm-blooded, congested patient; cannot bear heat or a warm room. Strongly aggravated by warmth, motion, exertion, touch, and during menses. Ameliorated by cool open air and resting quietly.",
    modalitiesBetter: [
      "Cool open air and unheated room",
      "Resting in recumbent position",
      "Cool applications",
    ],
    modalitiesWorse: [
      "Warmth of room and warm bed covers",
      "Least physical motion and walking",
      "Touch and jarring",
      "During menses and pregnancy (third month)",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in menorrhagia, sacrum-to-pubes dysmenorrhea, and gouty-pelvic alternations",
      "Historical materia medica reference for third-month gestational hemorrhage profiles",
    ],
    organAffinity: [
      "Female pelvic organs (uterus, ovaries, broad ligaments)",
      "Vascular system (pelvic and capillary circulation)",
      "Fibrous tissues, cartilages, and small joints",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to plethoric, warm-blooded women with early and profuse menses, gouty diathesis, and tendency to pelvic congestion.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude Savin oil contains volatile sabinol and terpene irritants with potent oxytocic and abortifacient properties; source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute torrential pelvic hemorrhage, active miscarriage in progress, ruptured ectopic pregnancy, retained placenta, or hypovolemic shock requires immediate emergency surgical/obstetric resuscitation; this traditional profile must not delay proven care.",
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
        "question": "What is the classic path of pain for Sabina in traditional literature?",
        "answer": "In classical homeopathic materia medica, Sabina is characterized by labor-like pelvic pain that shoots directly from the sacrum forward to the pubes."
      },
      {
        "question": "What appearance does Sabina hemorrhage have in classical descriptions?",
        "answer": "In traditional texts, Sabina hemorrhage is profuse, active, and flows in gushes of bright red blood mixed with dark clotted lumps, aggravated by the slightest motion."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0064-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0064-TRADITIONAL-PROFILE" },
    { claimId: "R0064-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for threatened miscarriage, ectopic pregnancy, or severe hemorrhage.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0064-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0064-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for active obstetric hemorrhage, shock, or ectopic pregnancy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Torrential pelvic hemorrhage with hypovolemic shock, pallor, or fainting requires immediate emergency obstetric intervention.", "Suspected ruptured ectopic pregnancy with acute peritoneal collapse requires emergency surgical resuscitation."],
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
  tags: ["Sabina", "Savin", "Remedy", "Sacrum to Pubes Pain", "Clotted Bright Red Hemorrhage", "Third Month Miscarriage", "Menorrhagia"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/sabina",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional sacrum-to-pubes keynotes, savinol safety notes, and verified citations"],
  clinicalPearl: "Sabina is described in traditional materia medica for profuse bright red hemorrhage mixed with dark clots, and labor-like pain shooting from sacrum to pubes.",
  quickFacts: {
    "Latin Name": "Juniperus sabina",
    "Common Name": "Savin",
    "Source Kingdom": "Plant (Cupressaceae family)",
    "Thermal State": "Hot (Cannot tolerate heat or warm room)"
  },
  aiReadiness: {
    retrievalSummary: "Sabina (Savin) is a major botanical homeopathic remedy described historically for profuse active bright red uterine hemorrhages mixed with dark clots, sacrum-to-pubes shooting pains, and dysmenorrhea.",
    clinicalSummary: "Classical texts describe a Savin symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency obstetric resuscitation for hemorrhage, ectopic pregnancy, or miscarriage.",
    patientSummary: "Sabina is a traditional homeopathic remedy described in literature for heavy, clotty period bleeding that gushes on moving and sharp pains going from the lower back through to the front.",
    studentSummary: "Guiding traditional keynotes include sacrum-to-pubes radiating pain, bright red hemorrhage with dark clots worse on motion, third-month miscarriage tendency, and intolerance of warm rooms.",
    keywords: ["sabina", "savin", "sacrum to pubes pain", "clotted menorrhagia remedy", "uterine hemorrhage"],
    semanticKeywords: ["botanical remedy", "pelvic gynecological profile", "active hemorrhage"],
    bodySystem: "Reproductive & Hematologic",
    urgency: "routine"
  }
};
