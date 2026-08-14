import { KnowledgeEntity } from "../../types";

export const SecaleCornutumRemedy: KnowledgeEntity = {
  id: "R0067",
  slug: "secale-cornutum",
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
    en: "Secale Cornutum (Ergot of Rye)",
    hi: "सिकेल कॉर्न्यूटम (अरगट ऑफ राई / मदार)",
    gu: "સિકેલ કોર્ન્યુટમ (અરગટ ઑફ રાઈ)",
    mr: "सिकेल कॉर (Secale Cor)",
    es: "Secale Cornutum (Cornezuelo de Centeno)",
    ar: "سيكال كورنوتوم (Secale Cornutum)"
  },
  summary: {
    en: "A cardinal vascular, neurological, and gynecological fungal remedy in classical homeopathic materia medica, historically described for internal burning heat with icy cold skin, extreme aversion to being covered, dry senile gangrene of extremities, and continuous passive dark liquid hemorrhages.",
    hi: "होम्योपैथिक साहित्य में त्वचा बर्फ जैसी ठंडी होने पर भी भीतर भयंकर जलन, कपड़े ओढ़ने से सख्त नफरत (कपड़े फेंक देना), उंगलियों का सूखा गैंग्रीन (सड़न), और लगातार बहने वाले पतले काले रक्तस्राव की प्रमुख वर्णित औषधि.",
    gu: "શરીર બરફ જેવું ઠંડું હોવા છતાં અંદર અસહ્ય બળતરા, કપડાં કે ધાબળો ઓઢવા સામે સખત નફરત, પગની આંગળીઓનું સૂકું ગેંગરીન અને કાળો પાતળો રક્તસ્રાવ માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "त्वचा बर्फासारखी थंड असूनही आतून तीव्र जळजळ, पांघरूण अंगावर घेण्यास तीव्र तिरस्कार आणि हातापायांच्या सुक्या गँगरीनवर (Gangrene) अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio fúngico vascular, neurológico y ginecológico fundamental en materia médica homeopática, descrito históricamente para calor ardiente interno con piel helada, aversión absoluta al abrigo, gangrena seca y hemorragias oscuras.",
    ar: "علاج فطري وعائي وعصبي رئيسي في المعالجة المثلية يُوصف تاريخياً للحرارة الداخلية الحارقة مع برودة الجلد الشديدة والنفور التام من التغطية والغرغرينا الجافة والنزيف المائي الداكن المستمر."
  },
  content: {
    latinName: "Claviceps purpurea",
    commonName: "Ergot of Rye / Spurred Rye",
    source: "Fresh sclerotium of Claviceps purpurea developed on rye grain (Secale cereale), potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Fungi",
    remedyType: "Polychrest",
    description:
      "Secale Cornutum (Ergot of Rye) is a profound vascular, neuromuscular, and obstetrical fungal remedy proved by Samuel Hahnemann and Dr. Hartlaub. In classical homeopathic texts, it is celebrated for its extraordinary pathogenetic action on the unstriped muscular fibers, peripheral arterioles, spinal cord, and uterus. Key features recorded in materia medica include an unmistakable and paradoxical keynote: the skin and extremities feel icy cold and clammy to the touch yet the patient complains of intolerable internal burning heat and frantically uncovers, throws off all clothing, and cannot bear heat in any form; dry senile gangrene of toes, fingers, and extremities from intense arteriolar vasospasm; continuous passive dark thin watery hemorrhages from relaxed blood vessels; and severe formication (sensation of mice or ants creeping under the skin).",
    keynotes: [
      "Historically described for paradoxical thermoregulatory state: body feels icy cold to touch, yet patient feels burning heat inside and cannot bear being covered",
      "Frantic desire to be uncovered: uncovers entirely, throws off all bedclothes, and craves cold open air even in freezing weather",
      "Dry senile gangrene of extremities: toes and fingers turn mottled, blue, cold, and shriveled, with burning pains relieved by cold air",
      "Passive, continuous, painless uterine hemorrhage: dark, thin, watery, uncoagulated, offensive blood from relaxed atonic uterus",
      "Formication: sensation as if ants or mice are crawling beneath the skin, with numbness, tingling, and tonic spasms",
      "Violent, hour-glass uterine contraction or total uterine inertia during labor with prolonged, distressing, inefficient pains",
    ],
    mentalSymptoms: [
      "Anxious, raving, and delirious with wild laughter and frantic desire to strip off all clothes",
      "Apathy and stupor alternating with manic frenzy",
      "Fear of death and profound melancholia in cachectic patients",
    ],
    physicalSymptoms: [
      "Raynaud's phenomenon, Buerger's disease (thromboangiitis obliterans), and peripheral arterial ischemia",
      "Severe choleraic diarrhea with watery, olive-green, gushing stools, extreme collapse, cold skin, and aversion to covers",
      "Suppression of milk (agalactia) in nursing mothers with shriveled, atrophic breasts",
    ],
    generalities:
      "Intensely hot patient subjectively, despite objective icy coldness. Strongly aggravated by heat, warm room, warm covers, and touch. Ameliorated by cold air, uncovering, cold bathing, and moving affected limbs.",
    modalitiesBetter: [
      "Uncovering completely (throwing off all covers)",
      "Cold open air and cold applications",
      "Continuous gentle motion of extremities",
    ],
    modalitiesWorse: [
      "Heat of room, warm bed, and warm applications",
      "Covering up (produces agony and restlessness)",
      "During pregnancy, parturition, and menses",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in peripheral vasospasm, dry gangrene profiles, and atonic uterine hemorrhage",
      "Historical materia medica reference for cold-skin-uncovering and ant-crawling formication profiles",
    ],
    organAffinity: [
      "Peripheral arterioles, precapillary sphincters, and vasomotor nerves",
      "Smooth muscle (uterus, intestines, bladder sphincter)",
      "Spinal cord (posterior columns, sensory nerve roots)",
    ],
    miasmaticAffinity: [
      "Psora",
      "Syphilis"
    ],
    constitution:
      "Suited to thin, scrawny, cachectic, prematurely aged women or elderly individuals with withered, desiccated skin and relaxed vascular tone.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude ergot contains potent ergot alkaloids (ergotamine, ergonovine) causing severe ergotism, gangrenous vasoconstriction, and convulsions; source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute peripheral arterial occlusion with threatened limb loss, acute dry gangrene with infection, active postpartum uterine hemorrhage with hypovolemic shock, or severe choleraic dehydration requires immediate emergency surgical/vascular/obstetric resuscitation; this traditional profile must not delay proven care.",
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
        "question": "What is the hallmark paradoxical keynote of Secale Cornutum in traditional texts?",
        "answer": "In classical homeopathic materia medica, Secale Cornutum is characterized by body and limbs that feel icy cold to the touch, yet the patient feels an intolerable internal burning heat and frantically refuses to be covered."
      },
      {
        "question": "How does Secale Cornutum hemorrhage differ from Sabina?",
        "answer": "Secale hemorrhage is continuous, dark, thin, watery, and uncoagulated from a relaxed atonic uterus with relief from cold and uncovering, whereas Sabina hemorrhage is bright red with dark clots and accompanied by sacrum-to-pubes pains."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0067-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0067-TRADITIONAL-PROFILE" },
    { claimId: "R0067-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for peripheral arterial occlusion, dry gangrene, or postpartum hemorrhage.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0067-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0067-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute limb ischemia, gangrene revascularization, or obstetric hemorrhage.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Acute limb ischemia or gangrene with absent pulses and ischemic pain requires emergency vascular surgical evaluation.", "Severe postpartum hemorrhage with hemodynamic instability requires emergency obstetric resuscitation."],
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
  tags: ["Secale", "Ergot of Rye", "Remedy", "Icy Cold Skin Burning Inside", "Aversion to Covers", "Dry Gangrene", "Dark Watery Hemorrhage"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/secale-cornutum",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional cold-uncovering keynotes, ergot alkaloid safety notes, and verified citations"],
  clinicalPearl: "Secale Cornutum is described in traditional materia medica for icy cold skin with burning internal heat, frantic desire to uncover, dry gangrene of toes, and dark watery hemorrhage.",
  quickFacts: {
    "Latin Name": "Claviceps purpurea",
    "Common Name": "Ergot of Rye",
    "Source Kingdom": "Fungi (Clavicipitaceae family)",
    "Thermal State": "Hot (Frantic intolerance of heat & covers despite cold skin)"
  },
  aiReadiness: {
    retrievalSummary: "Secale Cornutum (Ergot of Rye) is a major fungal homeopathic remedy described historically for internal burning heat with icy cold skin, extreme aversion to being covered, dry senile gangrene, and dark watery hemorrhages.",
    clinicalSummary: "Classical texts describe an Ergot sclerotium symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency vascular revascularization or critical obstetric resuscitation.",
    patientSummary: "Secale is a traditional homeopathic remedy described in literature for feeling boiling hot inside even when the skin is icy cold to the touch, kicking off all blankets, and poor circulation in the fingers and toes.",
    studentSummary: "Guiding traditional keynotes include icy cold skin with internal burning, throwing off all covers, dry senile gangrene relieved by cold, continuous dark watery uterine hemorrhage, and ant-crawling formication.",
    keywords: ["secale cornutum", "ergot of rye", "aversion to covers remedy", "dry gangrene remedy", "cold skin burning inside"],
    semanticKeywords: ["fungal remedy", "peripheral vascular profile", "arteriolar vasospasm"],
    bodySystem: "Vascular & Reproductive",
    urgency: "routine"
  }
};
