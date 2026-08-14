import { KnowledgeEntity } from "../../types";

export const PodophyllumRemedy: KnowledgeEntity = {
  id: "R0060",
  slug: "podophyllum",
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
    en: "Podophyllum Peltatum (May Apple)",
    hi: "पोडोफाइलम पेल्टाटम (मे एप्पल / वन ककड़ी)",
    gu: "પોડોફાયલમ પેલ્ટાટમ (મે એપલ)",
    mr: "पोडोफायलम (Podophyllum)",
    es: "Podophyllum Peltatum (Manzana de Mayo)",
    ar: "بودوفيلوم بيلتاتوم (Podophyllum)"
  },
  summary: {
    en: "A cardinal botanical gastrointestinal and hepatic remedy in classical homeopathic materia medica, historically described for profuse, gushing, explosive morning diarrhea, painless watery stool with spluttering flatus, rectal prolapse, and liver torpor.",
    hi: "होम्योपैथिक साहित्य में सुबह के समय तेजी से निकलने वाले अत्यधिक पतले दस्त, बिना दर्द के फव्वारे जैसे शौच, शौच के साथ कांच (गुदा) का बाहर निकलना, और लिवर की सुस्ती की प्रमुख वर्णित औषधि.",
    gu: "સવારે ઊઠતાની સાથે જ ધસમસતા આવતા પુષ્કળ પાણી જેવા ઝાડા, મળત્યાગ વખતે ગુદા બહાર નીકળી જવી (કાંચ નીકળવી) અને લીવરની નબળાઈ માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "सकाळी होणारे प्रचंड पाण्याच्या फवाऱ्यासारखे पातळ जुलाब, जुलाब होताना गुदद्वार बाहेर येणे (Proctoptosis) आणि यकृताच्या विकारांवर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico gastrointestinal y hepático fundamental en materia médica homeopática, descrito históricamente para diarrea matutina profusa, expulsiva e indolora, prolapso rectal y torpor hepático.",
    ar: "علاج نباتي هضمي وكبدي رئيسي في المعالجة المثلية يُوصف تاريخياً للإسهال الصباحي الغزير والمتفجر غير المؤلم وهبوط المستقيم وخمول الكبد."
  },
  content: {
    latinName: "Podophyllum peltatum",
    commonName: "May Apple / Mandrake of America",
    source: "Fresh rhizome of Podophyllum peltatum harvested after the fruit has ripened, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Podophyllum Peltatum (May Apple) is a major gastrointestinal and hepatobiliary botanical remedy proved by Dr. Williamson. In classical homeopathic texts, it is celebrated for its specific pathogenetic affinity for the duodenum, liver, and entire intestinal tract. Key features recorded in materia medica include profuse, gushing, explosive, watery, yellowish or green diarrhea that pours out of the bowel like water from a hydrant, painless evacuation with tremendous intestinal gurgling and spluttering flatus, characteristic morning aggravation (typically driving patient out of bed early in morning from 3:00 AM to 9:00 AM), prolapse of the rectum during or before stool, and alternating gastrointestinal and hepatic disturbances with headache.",
    keynotes: [
      "Historically described for diarrhea that is remarkably profuse, gushing, explosive, and watery, draining the patient yet completely painless",
      "Stool is yellowish, greenish, fetid, or muddy with enormous sputtering flatus and rumbling in abdomen",
      "Morning aggravation: diarrhea occurs early in morning (from 3:00 AM through morning hours) and during hot summer weather",
      "Prolapsus ani: prolapse of rectum occurs before, during, or after stool, or even from slight exertion",
      "Infantile dentition diarrhea: green, offensive, watery stools with rolling of the head from side to side and moaning in sleep",
      "Hepatic torpor: fullness, soreness in right hypochondrium, relieved by stroking or rubbing the liver region with the hand",
    ],
    mentalSymptoms: [
      "Depressed and hypochondriacal; imagines they are going to die or be severely ill",
      "Loquacity during fever stage of chills",
      "Restless and constantly tosses about in bed",
    ],
    physicalSymptoms: [
      "Sick headaches alternating with diarrhea; headache ceases when bowel movements start",
      "Bilious vomiting of thick green bile and bitter substances with gagging and empty retching",
      "Prolapse of uterus accompanying rectal prolapse, especially after parturition or stool",
    ],
    generalities:
      "Chilly patient, but ailments strongly aggravated in hot summer weather and during dentition. Strongly aggravated early morning (3:00 AM to 9:00 AM), hot weather, and after eating/drinking. Ameliorated by lying on the abdomen, warm applications, and rubbing the liver.",
    modalitiesBetter: [
      "Lying on abdomen (stomach and colic)",
      "Stroking or rubbing the liver region",
      "Warmth and rest in afternoon",
    ],
    modalitiesWorse: [
      "Early morning (3:00 AM to 9:00 AM)",
      "Hot summer weather and damp heat",
      "During dentition in children",
      "After eating or drinking fruit",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in summer diarrhea, infantile dentition bowel troubles, and rectal prolapse",
      "Historical materia medica reference for morning gushing diarrhea and hepatobiliary torpor profiles",
    ],
    organAffinity: [
      "Digestive tract (duodenum, small and large intestines, rectum)",
      "Liver, gallbladder, and portal system",
      "Female pelvic organs (uterus, ligaments)",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to bilious, lymphatic individuals, and teething infants with delicate digestive systems and tendency to hepatic sluggishness.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude May Apple root contains cytotoxic podophyllotoxin and resinous irritants; source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Severe acute dehydrating gastroenteritis, cholera infantum with hypovolemic shock, strangulated rectal prolapse, or acute electrolyte collapse requires immediate emergency intravenous rehydration and medical evaluation; this traditional profile must not delay proven care.",
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
        "question": "What is the classic stool characteristic of Podophyllum in traditional texts?",
        "answer": "In classical homeopathic materia medica, Podophyllum stool is extraordinarily profuse, watery, gushing, explosive, and painless, accompanied by spluttering flatus."
      },
      {
        "question": "What unique physical sign in infants is associated with Podophyllum during teething?",
        "answer": "In classical literature, teething infants with Podophyllum diarrhea frequently roll their head from side to side on the pillow, moan in their sleep, and press their gums together."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0060-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0060-TRADITIONAL-PROFILE" },
    { claimId: "R0060-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for choleraic diarrhea, severe dehydration, or rectal prolapse.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0060-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0060-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for severe dehydration, hypovolemic shock, or strangulated prolapse.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Severe acute dehydrating diarrhea with hypovolemic shock or sunken fontanelle in infants requires emergency intravenous rehydration.", "Strangulated gangrenous rectal prolapse or acute surgical abdomen requires emergency surgical evaluation."],
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
  tags: ["Podophyllum", "May Apple", "Remedy", "Gushing Diarrhea", "Prolapsus Ani", "Morning Worse", "Dentition"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/podophyllum",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional morning diarrhea keynotes, podophyllotoxin safety notes, and verified citations"],
  clinicalPearl: "Podophyllum is described in traditional materia medica for profuse, gushing, explosive morning diarrhea, painless watery stool, rectal prolapse, and liver sluggishness.",
  quickFacts: {
    "Latin Name": "Podophyllum peltatum",
    "Common Name": "May Apple",
    "Source Kingdom": "Plant (Berberidaceae family)",
    "Thermal State": "Chilly (Aggravated by summer heat & early morning)"
  },
  aiReadiness: {
    retrievalSummary: "Podophyllum Peltatum (May Apple) is a major botanical homeopathic remedy described historically for profuse, gushing, explosive morning diarrhea, painless watery stool with spluttering flatus, rectal prolapse, and liver torpor.",
    clinicalSummary: "Classical texts describe a May Apple rhizome symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency fluid resuscitation for dehydrating diarrhea or choleraic collapse.",
    patientSummary: "Podophyllum is a traditional homeopathic remedy described in literature for sudden watery morning diarrhea that rushes out with lots of gas and feeling weak afterward.",
    studentSummary: "Guiding traditional keynotes include profuse gushing painless diarrhea, early morning 3–9 AM aggravation, rectal prolapse before/during stool, head rolling in teething children, and relief lying on abdomen.",
    keywords: ["podophyllum", "may apple", "gushing diarrhea remedy", "morning diarrhea", "rectal prolapse remedy"],
    semanticKeywords: ["botanical remedy", "gastrointestinal hepatobiliary profile", "summer diarrhea"],
    bodySystem: "Gastrointestinal & Hepatic",
    urgency: "routine"
  }
};
