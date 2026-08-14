import { KnowledgeEntity } from "../../types";

export const RutaGraveolensRemedy: KnowledgeEntity = {
  id: "R0062",
  slug: "ruta-graveolens",
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
    en: "Ruta Graveolens (Garden Rue)",
    hi: "रूटा ग्रेवियोलेन्स (सदाब / गार्डन रू)",
    gu: "રૂટા ગ્રેવિયોલેન્સ (સદાબ / ગાર્ડન રુ)",
    mr: "रुटा (Ruta)",
    es: "Ruta Graveolens (Ruda)",
    ar: "روتا جرافولينس (Ruta)"
  },
  summary: {
    en: "A cardinal musculoskeletal, periosteal, and ocular botanical remedy in classical homeopathic materia medica, historically described for bruised aching of the periosteum and cartilages, sprains and strains of flexor tendons, eye strain from fine visual work (asthenopia), and ganglion cysts of the wrist.",
    hi: "होम्योपैथिक साहित्य में हड्डियों के आवरण (पेरियोस्टियम) और टेंडन में चोट जैसा कुचलन का दर्द, मोच, बारीक काम या पढ़ाई से आंखों में खिंचाव (एस्टेनोपिया), और कलाई की गांठ (गैंग्लियन) की प्रमुख वर्णित औषधि.",
    gu: "હાડકાંના પડ અને સ્નાયુબંધ (ટેન્ડન્સ)માં મચકોડ જેવી પીડા, બારીક કામ કરવાથી આંખોમાં થતો થાક અને કાંડા પર થતી ગાંઠ (ગેંગ્લિઅન) માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "हाडांचे आवरण आणि सांध्यांच्या नसांचा ताण/मुरगळणे, डोळ्यांवर बारीक कामामुळे पडणारा ताण (Eye Strain) आणि मनगटावरील गाठींवर अत्यंत गुणकारी पारंपरिक औषध.",
    es: "Un remedio botánico musculoesquelético, perióstico y ocular fundamental en materia médica homeopática, descrito históricamente para dolor contusivo en periostio y cartílagos, esguinces de tendones flexores y astenopía.",
    ar: "علاج نباتي عظمي ومفصلي وبصري رئيسي في المعالجة المثلية يُوصف تاريخياً لألم السمحاق والغضاريف ورضوض الأوتار وإجهاد العين من العمل الدقيق والتكيسات العقدية."
  },
  content: {
    latinName: "Ruta graveolens",
    commonName: "Garden Rue / Herb-of-Grace",
    source: "Fresh herb of Ruta graveolens gathered before flowering, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Ruta Graveolens (Garden Rue) is a major musculoskeletal, ocular, and connective tissue botanical remedy proved by Samuel Hahnemann. In classical homeopathic texts, it occupies a specialized therapeutic sphere characterized by its deep elective affinity for the periosteum, cartilages, joints, flexor tendons, and ocular ciliary muscles. Key features recorded in materia medica include an intense bruised, bruised-bone sensation as if the parts had been beaten or crushed, sprains and strains resulting from mechanical overexertion (especially of wrists, ankles, and Achilles tendons), eye strain with burning, aching, and blurred vision following fine needlework, reading fine print, or screen work (accommodative asthenopia), ganglion cysts on the flexor tendons of the wrists, and rectal prolapse during stool.",
    keynotes: [
      "Historically described for bruised, aching, sore pain in periosteum, bones, and cartilages as if beaten or crushed",
      "Strains and mechanical injuries of tendons, ligaments, and joints (especially flexor tendons of wrists and tarsal joints)",
      "Severe eye strain (asthenopia): eyes feel hot, fiery, and ache deep in orbits following prolonged fine visual exertion or screen work",
      "Ganglion cysts: small, hard, nodular swellings on the flexor tendons of wrists or ankles following chronic strain",
      "Prolapsus recti: prolapse of rectum occurs with every bowel evacuation, on bending, or stooping",
      "Lameness and stiffness in lumbar spine and extremities, with great restlessness in legs forcing constant movement",
    ],
    mentalSymptoms: [
      "Anxious, dissatisfied, and quarrelsome; inclined to contradict others",
      "Melancholy and easily discouraged; suspicious of family members",
      "Restless and constantly changes position due to bone aching",
    ],
    physicalSymptoms: [
      "Achilles tendinitis, tennis elbow, and bursitis with pain aggravated on initial motion and cold damp",
      "Sciatica with deep-seated bone aching, worse lying down at night and relieved by gentle walking",
      "Contusions and periosteal trauma with deep persistent soreness (complementary to Arnica and Symphytum)",
    ],
    generalities:
      "Chilly patient, sensitive to cold damp air, rain, and wet weather. Strongly aggravated by cold damp, lying down on painful side, sitting, and overexertion. Ameliorated by motion, warmth, and rubbing.",
    modalitiesBetter: [
      "Continuous motion and gentle walking",
      "Warmth and warm dry weather",
      "Lying on the back",
    ],
    modalitiesWorse: [
      "Cold, damp, wet weather and rain",
      "Rest and sitting still",
      "Lying on painful side",
      "Overexertion of eyes or tendons",
    ],
    clinicalUses: [
      "Educational description of classical homeopathic symptom patterns in flexor tendon strains, asthenopia, and periosteal contusions",
      "Historical materia medica reference for ganglion cysts and tendonitis profiles",
    ],
    organAffinity: [
      "Periosteum, cartilages, and flexor tendons",
      "Eyes (ciliary muscles, optical accommodation)",
      "Rectal mucosa and lumbar spine",
    ],
    miasmaticAffinity: [
      "Psora",
      "Sycosis"
    ],
    constitution:
      "Suited to athletes, craftsmen, desk workers, or elderly individuals with stiff, strained tendons and eye fatigue.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Crude Garden Rue contains phototoxic furanocoumarins and volatile rue oil (rutin, arborinine); source-specific toxicology guidance is required. A homeopathic dilution label does not by itself guarantee composition, quality, safety, or effectiveness. Acute tendon ruptures, compound fractures, acute retinal detachment, or acute visual loss requires immediate conventional orthopedic/ophthalmologic emergency evaluation; this traditional profile must not delay proven care.",
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
        "question": "What classic ocular complaint is associated with Ruta in traditional texts?",
        "answer": "In classical homeopathic materia medica, Ruta is characterized by accommodative asthenopia, where the eyes feel hot, strained, and bruised following prolonged close visual work, fine sewing, or screen reading."
      },
      {
        "question": "How does Ruta differ from Rhus Tox in tendon and joint sprains?",
        "answer": "Both remedies are relieved by motion and aggravated by cold damp; however, Ruta exhibits specific elective affinity for the periosteum, cartilages, flexor tendons, and ganglion cysts, whereas Rhus Tox acts predominantly on fibrous ligaments and joint sheaths."
      }
    ]
  },
  claimCitations: [
    { claimId: "R0062-TRADITIONAL-PROFILE", statement: "The keynote profile is a historical description from classical homeopathic literature.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0062-TRADITIONAL-PROFILE" },
    { claimId: "R0062-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern clinical efficacy for tendon ruptures, fractures, or retinal detachment.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0062-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0062-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute tendon tears, bone fractures, or sudden vision loss.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" },
  ],
  redFlags: ["Complete tendon rupture with inability to bear weight or flex joint requires urgent orthopedic surgical repair.", "Sudden painless vision loss, flashes of light, or curtain over visual field requires emergency ophthalmologic evaluation for retinal detachment."],
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
  tags: ["Ruta", "Garden Rue", "Remedy", "Periosteal Bruising", "Eye Strain Asthenopia", "Tendon Sprains", "Ganglion Cysts"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/ruta-graveolens",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with traditional periosteal keynotes, asthenopia profile, and verified citations"],
  clinicalPearl: "Ruta Graveolens is described in traditional materia medica for bruised soreness of periosteum and tendons, eye strain from fine work, and ganglion cysts of wrists.",
  quickFacts: {
    "Latin Name": "Ruta graveolens",
    "Common Name": "Garden Rue",
    "Source Kingdom": "Plant (Rutaceae family)",
    "Thermal State": "Chilly (Aggravated by cold damp & rest)"
  },
  aiReadiness: {
    retrievalSummary: "Ruta Graveolens (Garden Rue) is a major botanical homeopathic remedy described historically for bruised aching of periosteum and cartilages, sprains of flexor tendons, eye strain from fine work, and ganglion cysts.",
    clinicalSummary: "Classical texts describe a Garden Rue symptom profile. This historical description does not establish clinical efficacy or product safety, and it does not guarantee effectiveness or replace emergency orthopedic or ophthalmologic care for tendon tears or retinal emergencies.",
    patientSummary: "Ruta is a traditional homeopathic remedy described in literature for sore aching joints and tendons after straining them, painful wrist lumps, and tired burning eyes after close work or screen time.",
    studentSummary: "Guiding traditional keynotes include periosteal bruised pain, flexor tendon sprains, asthenopia from fine print, ganglion cysts of wrists, and rectal prolapse on stool.",
    keywords: ["ruta", "garden rue", "tendon sprain remedy", "eye strain asthenopia", "periosteal pain remedy"],
    semanticKeywords: ["botanical remedy", "musculoskeletal periosteal profile", "connective tissue strain"],
    bodySystem: "Musculoskeletal & Ophthalmologic",
    urgency: "routine"
  }
};
