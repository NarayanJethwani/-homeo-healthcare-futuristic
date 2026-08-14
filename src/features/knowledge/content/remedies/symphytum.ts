import { KnowledgeEntity } from "../../types";

export const SymphytumRemedy: KnowledgeEntity = {
  id: "R0073",
  slug: "symphytum",
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
    en: "Symphytum Officinale (Knitbone / Comfrey)",
    hi: "सिम्फाइटम ऑफिसिनेल (हड्डजोड़ / कॉनफ्रे)",
    gu: "સિમ્ફાઇટમ ઓફિસિનેલ (હાડજોડ / કૉમફ્રે)",
    mr: "सिम्फायटम (Symphytum)",
    es: "Symphytum Officinale (Consuelda Mayor)",
    ar: "سيمفايتوم أوفيسينال (Symphytum)"
  },
  summary: {
    en: "A cardinal orthopedic, periosteal, bone-repair, and ophthalmic botanical remedy in classical homeopathic materia medica, historically described for delayed union and non-union of fractures, pricking periosteal pain at the fracture site, and blunt mechanical trauma to the eyeball (blows from fist, snowball, or blunt objects).",
    hi: "होम्योपैथिक साहित्य में टूटी हुई हड्डियों के जुड़ने में देरी (नॉन-यूनियन फ्रैक्चर), फ्रैक्चर वाली जगह पर सुई चुभने जैसा दर्द, और आंख की पुतली पर कुंद चोट (मुक्के, गेंद या बर्फ के गोले की चोट) की प्रमुख वर्णित 'हड्डी जोड़ने वाली' औषधि.",
    gu: "હાડકાંના ફ્રેક્ચર પછી હાડકું સંધાવામાં થતો વિલંબ, ફ્રેક્ચરવાળી જગ્યાએ સોય ભોંકાવા જેવી પીડા અને આંખની કીકી પર વાગતી બુઠ્ઠી ઈજા (મુક્કો કે દડાનો ઘા) માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "हाड मोडल्यानंतर ते जोडण्यास उशीर होणे (Delayed Union), फ्रॅक्चरच्या जागी टोचल्यासारख्या वेदना आणि डोळ्यावर बसलेला मुका मार यावर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico ortopédico, perióstico y oftálmico fundamental en materia médica homeopática, descrito históricamente para retraso en consolidación de fracturas, dolor punzante en el periostio y traumatismos contusos en el globo ocular.",
    ar: "علاج نباتي عظمي ورضحي رئيسي في المعالجة المثلية يُوصف تاريخياً لتأخر التئام كسور العظام والآلام الوخزية في السمحاق ورضوض العين الكليلة الناتجة عن اللكمات."
  },
  content: {
    latinName: "Symphytum officinale",
    commonName: "Knitbone / Comfrey / Boneset",
    source: "Fresh root of Symphytum officinale collected before flowering and in autumn, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Symphytum Officinale (Knitbone) is a major orthopedic, periosteal, and ocular traumatic botanical remedy proved by Dr. Macfarlan and classical homeopathic practitioners. In classical homeopathic texts, it is celebrated as the premier remedy for bone and periosteal repair following fractures, periosteal contusions, and surgical osteotomies. Key features recorded in materia medica include its remarkable power in stimulating the production of callous and accelerating the union of broken bones once properly set and aligned, severe, sharp, pricking, or stitching pains persisting at the fracture site or in the periosteum long after injury, mechanical blunt trauma to the eyeball and orbit from a blow of a blunt object (such as a fist, cane, snowball, or infant's fist) where Arnica fails to relieve the deep orbital soreness, and stump neuralgia following surgical amputation of limbs.",
    keynotes: [
      "Historically described for accelerating callous formation and promoting union of bone fractures after proper reduction",
      "Severe pricking, stitching, sore pains persisting in the periosteum and bone at the site of old fractures or mechanical trauma",
      "Mechanical blunt trauma to the eye and orbit: severe contusive pain from blows from a fist, ball, or blunt object to the eyeball",
      "Phantom limb pain and agonizing stump neuralgia following surgical amputation of extremities",
      "Periostitis, bone bruised soreness, and irritable bone ulcers with stitching pain on touch",
      "Psoas abscess, lumbar spinal caries, and backache from mechanical lifting strain or fall",
    ],
    mentalSymptoms: [
      "Anxious, apprehensive, and discouraged regarding the healing of bone injuries",
      "Restless and irritable when immobilized in casts or traction",
      "Hypersensitive to touch of injured bone or joint",
    ],
    physicalSymptoms: [
      "Non-union of fractures with mobility at fracture site despite adequate immobilization",
      "Subconjunctival ecchymosis and traumatic iritis following blunt ocular contusions",
      "Sprains, tenosynovitis, and cartilage injuries of the knee and ankle (complementary to Ruta and Rhus Tox)",
    ],
    generalities:
      "Chilly patient, sensitive to cold damp air and touch. Strongly aggravated by touch, jar, motion of fractured bone, and pressure. Ameliorated by warmth, gentle support, and resting the affected part.",
    modalitiesBetter: [
      "Warmth and warm applications",
      "Gentle supportive bandaging or splinting",
      "Complete rest of affected limb",
    ],
    modalitiesWorse: [
      "Touch and pressure on injured periosteum",
      "Motion, walking, and jarring of bone",
      "Cold air and drafts",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in delayed fracture union, periosteal pricking pain, and blunt ocular contusions",
      "Historical materia medica reference for amputation stump neuralgia and bone callous formation profiles",
    ],
    organAffinity: [
      "Bones, periosteum, and osteogenic cellular matrix",
      "Eyes (eyeball, orbit, ciliary apparatus)",
      "Cartilage, tendons, and surgical amputation stumps",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to individuals of all ages recovering from bone fractures, orthopedic surgeries, ocular trauma, or surgical amputations.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude comfrey contains toxic pyrrolizidine alkaloids (echimidine, symphytine) causing hepatic veno-occlusive disease and hepatotoxicity upon ingestion; source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute displaced or unstable fractures requiring surgical reduction/fixation, open compound fractures with neurovascular compromise, or traumatic globe rupture/hyphema requires immediate emergency orthopedic or ophthalmologic surgical intervention; this traditional profile must not delay proven care.",
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
        "question": "What is the classic orthopedic role of Symphytum in traditional literature?",
        "answer": "In classical homeopathic materia medica, Symphytum is described as stimulating callous formation, relieving pricking periosteal pains, and aiding bone repair after fractures have been properly set."
      },
      {
        "question": "What specific type of ocular injury is characteristic for Symphytum?",
        "answer": "In traditional texts, Symphytum is specifically indicated for mechanical blunt trauma to the eyeball and orbit caused by a blow from a fist, ball, or blunt object."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0073-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0073-TRADITIONAL-PROFILE" },
    { claimId: "R0073-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for surgical fracture fixation, open fractures, or globe rupture.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0073-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0073-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for displaced fractures, open bone trauma, or traumatic globe rupture.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Open compound fracture, neurovascular compromise, or unstable bone displacement requires emergency orthopedic surgery.", "Traumatic eyeball perforation, hyphema, or ruptured globe requires immediate emergency ophthalmologic surgery."],
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
  tags: ["Symphytum", "Knitbone", "Comfrey", "Remedy", "Fracture Non-Union", "Periosteal Pricking Pain", "Blunt Eye Trauma", "Amputation Stump"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/symphytum",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional bone repair keynotes, pyrrolizidine alkaloid safety notes, and verified citations"],
  clinicalPearl: "Symphytum is described in traditional materia medica for non-union of fractures, pricking periosteal pain at fracture site, blunt eyeball trauma, and stump neuralgia.",
  quickFacts: {
    "Latin Name": "Symphytum officinale",
    "Common Name": "Knitbone / Comfrey",
    "Source Kingdom": "Plant (Boraginaceae family)",
    "Thermal State": "Chilly (Aggravated by touch, jar, & pressure on bone)"
  },
  aiReadiness: {
    retrievalSummary: "Symphytum Officinale (Knitbone) is a major botanical homeopathic remedy described historically for delayed union of bone fractures, pricking periosteal pain, blunt eyeball trauma, and stump neuralgia.",
    clinicalSummary: "Classical texts describe a Comfrey root symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency orthopedic reduction or emergency ophthalmology surgery for globe trauma.",
    patientSummary: "Symphytum is a traditional homeopathic remedy described in literature for slow-healing broken bones with nagging sharp pains at the fracture point, and black eyes or bruised eyeballs from a blunt blow or punch.",
    studentSummary: "Guiding traditional keynotes include delayed fracture callous formation, periosteal pricking pain, blunt ocular contusions (snowball/fist), amputation stump neuralgia, and bone bruising.",
    keywords: ["symphytum", "knitbone", "fracture healing remedy", "blunt eye trauma remedy", "periosteal pain"],
    semanticKeywords: ["botanical remedy", "orthopedic bone repair profile", "ocular contusion"],
    bodySystem: "Musculoskeletal & Ophthalmologic",
    urgency: "routine"
  }
};
