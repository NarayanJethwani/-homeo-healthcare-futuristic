import { KnowledgeEntity } from "../../types";

export const PlumbumMetallicumRemedy: KnowledgeEntity = {
  id: "R0059",
  slug: "plumbum-metallicum",
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
    en: "Plumbum Metallicum (Metallic Lead)",
    hi: "प्लम्बम मेटालिकम (धात्विक सीसा / लेड)",
    gu: "પ્લમ્બમ મેટાલિકમ (ધાતુ સીસું)",
    mr: "प्लंबम मेट (Plumbum Met)",
    es: "Plumbum Metallicum (Plomo Metálico)",
    ar: "بلومبوم ميتاليكوم (Plumbum)"
  },
  summary: {
    en: "A cardinal neurological, neuromuscular, and digestive mineral polychrest in classical homeopathic materia medica, historically described for violent abdominal colic with navel retracted to spine, extensor paralysis with wrist drop, obstinate constipation with sheep-dung stool, and progressive muscular atrophy.",
    hi: "होम्योपैथिक साहित्य में नाभि के रीढ़ की हड्डी से चिपक जाने जैसा भयंकर पेट दर्द, कलाई का लटकना (रिस्ट ड्रॉप), आंतों के लकवे से भेड़ की लीद जैसी सख्त काली गोलियों का कब्ज, और मांसपेशियों के सूखने की प्रमुख वर्णित धातु-औषधि.",
    gu: "દૂંટી પીઠ તરફ ખેંચાઈ જતી હોય તેવો અસહ્ય પેટનો ચૂંક, કાંડાનો લકવો (રિસ્ટ ડ્રોપ), લીંડી જેવો અત્યંત કઠણ મળ અને સ્નાયુઓની નબળાઈ માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "हनुवटी किंवा बेंबी पाठीच्या कण्याकडे खेचल्यासारख्या तीव्र पोटदुखीच्या कळा, मनगट लोंबकळणे (Wrist Drop) आणि शेळीच्या लेंड्यांसारख्या बद्धकोष्ठतेवर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio mineral neuromuscular y digestivo fundamental en materia médica homeopática, descrito históricamente para cólico abdominal violento con retracción del ombligo hacia la columna, caída de la muñeca y estreñimiento obstinado.",
    ar: "علاج معدني عصبي عضلي رئيسي في المعالجة المثلية يُوصف تاريخياً للمغص الحاد مع انكماش السرة نحو العمود الفقري وسقوط الرسغ والإمساك المستعصي."
  },
  content: {
    latinName: "Plumbum metallicum",
    commonName: "Metallic Lead",
    source: "Pure metallic lead precipitated by electrolysis or chemical reduction, prepared by trituration according to homeopathic pharmacopoeia standards.",
    kingdom: "Mineral",
    remedyType: "Polychrest",
    description:
      "Plumbum Metallicum (Metallic Lead) is a profound deep-acting mineral polychrest proved by Samuel Hahnemann and Dr. C. G. Nenning. In classical homeopathic texts, it is celebrated for its remarkable pathogenetic action on the central and peripheral nervous system, smooth and striated muscles, and gastrointestinal canal. Key features recorded in materia medica include violent, agonizing abdominal colic where the abdominal wall feels pulled or retracted by a string toward the spine, peripheral motor nerve degeneration resulting in extensor paralysis (characteristic wrist drop), blue line along the gingival margins (Burtonian line), obstinate constipation with hard, black, sheep-dung-like fecal balls, and progressive emaciation and muscular atrophy.",
    keynotes: [
      "Historically described for agonizing abdominal colic radiating in all directions with sensation of navel retracted by a string to the spine",
      "Extensor muscle paralysis affecting forearms and hands, causing characteristic wrist drop (paresis of radial nerve)",
      "Obstinate, intractable constipation: violent spasm of anus with feces forming hard, black, round balls resembling sheep dung",
      "Blue line along margin of gums (lead line / Burtonian line) with sweetish metallic taste in mouth",
      "Progressive muscular atrophy, localized emaciation of paralyzed parts, and trembling of extremities",
      "Excessive hyperesthesia to touch alternating with complete cutaneous anesthesia and numbness",
    ],
    mentalSymptoms: [
      "Slow perception, apathy, loss of memory, and progressive mental dullness",
      "Melancholy and taciturnity; quiet depression with dread of assassination or poison",
      "Restlessness at night with hallucinations and delirious episodes",
    ],
    physicalSymptoms: [
      "Peripheral neuropathy, sciatica, and lightning-like neuralgic pains in lower limbs",
      "Dupuytren's contracture and sclerotic changes in arteries and connective tissues",
      "Hypertension with granular contracted kidney and arteriosclerosis in aged patients",
    ],
    generalities:
      "Chilly patient, sensitive to cold and open air. Strongly aggravated at night, by motion, touch, and cold. Ameliorated by hard pressure, rubbing, bending double, and warmth.",
    modalitiesBetter: [
      "Hard pressure and massage",
      "Bending double (during colic)",
      "Warmth and warm wraps",
    ],
    modalitiesWorse: [
      "Night (especially pains in limbs)",
      "Motion and physical exertion",
      "Cold air and exposure",
      "Touch (light contact)",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in wrist drop, motor neuropathy, and spasmodic lead-colic profiles",
      "Historical materia medica reference for retracted navel sensation and sheep-dung constipation profiles",
    ],
    organAffinity: [
      "Central and peripheral nervous system (motor neurons, radial nerve)",
      "Gastrointestinal musculature and abdominal sympathetic ganglia",
      "Vascular system, kidneys, and skeletal muscles",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis",
      "Syphilis"
    ],
    constitution:
      "Suited to pale, sallow, cachectic, prematurely aged individuals with dark rings under eyes and tendency to arteriosclerosis and neural degeneration.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude lead is a cumulative heavy metal poison causing encephalopathy, renal failure, and peripheral neuropathy; source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute lead poisoning, acute lead encephalopathy, severe unresolving bowel obstruction, or acute ischemic abdomen requires immediate emergency medical resuscitation and hospital management; this traditional profile must not delay proven care.",
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
        "question": "What is the classic abdominal keynote for Plumbum Metallicum in traditional texts?",
        "answer": "In classical homeopathic materia medica, Plumbum is characterized by violent colic with an intense sensation of the navel and abdominal wall being retracted by a string toward the spine."
      },
      {
        "question": "What characteristic motor nerve lesion is associated with Plumbum?",
        "answer": "In traditional literature, Plumbum exhibits elective affinity for extensor motor nerves of the forearm, causing wrist drop and localized muscular atrophy."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0059-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0059-TRADITIONAL-PROFILE" },
    { claimId: "R0059-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for lead poisoning, motor neuron disease, or acute colic.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0059-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0059-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for lead encephalopathy, chelation therapy, or bowel obstruction.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute lead encephalopathy, seizures, or coma requires emergency toxicology and chelation management.", "Acute mechanical bowel obstruction with unresolving vomiting and peritonitis requires emergency surgical care."],
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
  tags: ["Plumbum", "Lead", "Remedy", "Retracted Navel Colic", "Wrist Drop", "Sheep Dung Stool", "Muscular Atrophy"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/plumbum-metallicum",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional lead colic keynotes, heavy metal toxicology notes, and verified citations"],
  clinicalPearl: "Plumbum Metallicum is described in traditional materia medica for violent colic with navel retracted to spine, wrist drop extensor paralysis, and sheep-dung constipation.",
  quickFacts: {
    "Latin Name": "Plumbum metallicum",
    "Common Name": "Metallic Lead",
    "Source Kingdom": "Mineral (Heavy Metal)",
    "Thermal State": "Chilly (Sensitive to cold & drafts)"
  },
  aiReadiness: {
    retrievalSummary: "Plumbum Metallicum (Metallic Lead) is a major mineral homeopathic remedy described historically for violent abdominal colic with navel retracted to spine, extensor paralysis with wrist drop, obstinate constipation with sheep-dung stool, and progressive muscular atrophy.",
    clinicalSummary: "Classical texts describe a Metallic Lead symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency toxicology, chelation, or critical neurological care.",
    patientSummary: "Plumbum Metallicum is a traditional homeopathic remedy described in literature for severe cramping belly pains where the navel feels pulled in toward the spine, muscle weakness in the wrists, and hard dry bowel movements.",
    studentSummary: "Guiding traditional keynotes include retracted navel colic relieved by hard pressure, wrist drop extensor paralysis, obstinate sheep-dung constipation, blue gum line, and progressive muscular atrophy.",
    keywords: ["plumbum", "metallic lead", "retracted navel colic", "wrist drop remedy", "sheep dung constipation"],
    semanticKeywords: ["mineral remedy", "neuromuscular profile", "heavy metal pathology"],
    bodySystem: "Neurological & Gastrointestinal",
    urgency: "routine"
  }
};
