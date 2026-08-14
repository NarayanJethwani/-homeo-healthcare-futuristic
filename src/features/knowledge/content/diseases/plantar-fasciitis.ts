import { KnowledgeEntity } from "../../types";

export const PlantarFasciitisDisease: KnowledgeEntity = {
  id: "D0067",
  slug: "plantar-fasciitis",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Plantar Fasciitis (Plantar Fasciopathy & Calcaneal Spur Heel Pain)",
    hi: "प्लांटार फैसीसाइटिस / एड़ी का दर्द व तलवे की सूजन (Plantar Fasciitis / Heel Pain)",
    gu: "પ્લાન્ટાર ફેસાઇટિસ / પગની એડીનો અસહ્ય દુખાવો (Plantar Fasciitis)",
    mr: "टाचदुखी / प्लांटार फॅसिटिस (Plantar Fasciitis / Heel Pain)",
    es: "Fascitis Plantar (Fasciopatía Plantar y Espolón Calcáneo)",
    ar: "التهاب اللفافة الأخمصية وألم كعب القدم (Plantar Fasciitis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Plantar Fasciitis (Plantar Fasciopathy), covering repetitive tensile microtrauma at the medial calcaneal tuberosity, myxoid collagen degeneration, pathognomonic first-step morning heel pain, constitutional homeopathic supportive management, and emergency red flags for acute complete plantar fascia rupture, calcaneal stress fracture, and deep plantar space abscess.",
    hi: "प्लांटार फैसीसाइटिस (एड़ी का दर्द व तलवे के लिगामेंट की क्षति) का कोलेजन डिजनरेशन पैथोलॉजी, सुबह उठते ही पहला कदम रखने पर तेज चुभन, कैल्केनियल स्पर, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और प्लांटार फेशिया टूटने (Fascial Rupture) व कैल्केनियम फ्रैक्चर की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પ્લાન્ટાર ફેસાઇટિસ (એડીનો તીવ્ર દુખાવો) ની બાયોમેકેનિકલ પેથોલોજી, સવારે ઉઠતાં જ જમીન પર પગ મૂકતી વખતે થતી સોય જેવી પીડા, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને એડીના હાડકાના ફ્રેક્ચરની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "टाचदुखी (Plantar Fasciitis), सकाळी उठल्यावर जमिनीवर पहिले पाऊल ठेवताना होणाऱ्या सुईसारख्या तीव्र वेदना, टाचेचे हाड वाढणे, पारंपरिक होमिओपॅथिक पद्धत आणि हाडांच्या फ्रॅक्चरच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la fascitis plantar que cubre la degeneración del colágeno calcáneo, dolor con el primer paso matutino, manejo homeopático complementario y banderas rojas de rotura de la fascia plantar y fractura por estrés del calcáneo.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب اللفافة الأخمصية يغطي التنكس الكولاجيني في الحديبة العقبية الإنسية وألم الخطوة الأولى الصباحي والرعاية التكميلية وعلامات الخطر للتمزق الكامل للفافة وكسر الإجهاد العقبي."
  },
  content: {
    overview:
      "Plantar Fasciitis (more accurately termed Plantar Fasciopathy) is the most common cause of inferior heel and medial arch pain in adults, affecting more than 10% of the general population during their lifetime and accounting for approximately 1 million clinical visits annually. Rather than being a primary acute inflammatory condition, chronic plantar fasciitis is fundamentally a degenerative enthesopathy characterized by repetitive micro-tearing, abnormal neovascularization, non-inflammatory myxoid collagen disorganization, and thickening at the proximal enthesis of the thick, fibrous plantar aponeurosis as it inserts onto the medial process of the calcaneal tuberosity. Its classic, pathognomonic clinical hallmark is sharp, stabbing heel pain upon taking the first few steps out of bed in the morning or after prolonged seated rest (post-static dyskinesia).",
    definition:
      "A chronic degenerative overuse syndrome of the plantar aponeurosis at its proximal medial calcaneal attachment, resulting in mechanical inferior heel pain that is worst during initial weight-bearing following periods of inactivity.",
    causes: [
      "Repetitive tensile overload and microtrauma at the calcaneal origin of the plantar fascia during the 'windlass mechanism' of gait (as the metatarsophalangeal joints dorsiflex during toe-off)",
      "Histological degenerative changes: fibroblastic proliferation, disorganized collagen bundles, hypervascularity, and avascular myxoid necrosis (in the absence of classic acute inflammatory cells)",
      "Biomechanical anatomical variations: pes planus (flat feet; creates excessive static stretch and flattening of the medial longitudinal arch) and pes cavus (high arched feet; creates poor shock absorption)",
      "Triceps surae (gastrocnemius and soleus) and Achilles tendon tightness, severely restricting ankle dorsiflexion (<10 degrees)",
      "Sudden increases in running mileage, sudden changes in athletic intensity, or prolonged occupational standing on hard unyielding concrete surfaces"
    ],
    riskFactors: [
      "Elevated Body Mass Index (BMI \u226530 kg/m^2; present in up to 70% of non-athletic patients; dramatically increases vertical ground reaction forces)",
      "Occupational prolonged weight-bearing: nurses, factory workers, teachers, military personnel, and retail clerks standing >6–8 hours daily",
      "Age (peak prevalence between 40 and 60 years of age)",
      "Wearing unsupportive footwear (flat-soled sandals, worn-out running shoes, high heels causing gastrocnemius shortening)",
      "Presence of a subcalcaneal traction osteophyte ('heel spur'; present in 50% of plantar fasciitis patients, representing a bony remodeling response to chronic fascial traction rather than the primary cause of pain)"
    ],
    symptoms: [
      "Pathognomonic 'first-step' heel pain: intense, sharp, stabbing, or bruised pain on the bottom of the heel when taking the first morning steps out of bed or when standing up after prolonged sitting (post-static dyskinesia)",
      "Warm-up phenomenon: pain gradually eases and dulls after 10–15 minutes of gentle walking as the fascia warms and stretches, but typically worsens again toward the end of the day after prolonged standing or strenuous walking",
      "Point tenderness: exquisite, localized tenderness elicited upon deep firm thumb palpation directly over the anteromedial plantar aspect of the calcaneus (medial calcaneal tubercle)",
      "Windlass test exacerbation: passive forceful dorsiflexion of the great toe (hallux) stretches the plantar fascia and sharply reproduces the inferior heel pain",
      "Limping gait (antalgic gait) with patients walking on their toes or the outer lateral border of the foot to avoid putting weight on the heel"
    ],
    diagnosis:
      "Diagnosed primarily clinically based on the characteristic first-step pain history, focal medial calcaneal tuberosity tenderness, and a positive Windlass test. Diagnostic imaging is indicated when symptoms are refractory (>6–8 weeks) or when red flags are present: High-Resolution Musculoskeletal Ultrasound (shows thickened proximal plantar fascia >4.0 mm [normal <2.5–3.0 mm], hypoechogenicity, and loss of fibrillar architecture) and Weight-bearing Plain Radiographs of the Foot (assessing for calcaneal stress fractures, bone cysts, and traction osteophytes). MRI of the Ankle/Foot is reserved for surgical planning or excluding occult calcaneal stress fractures, osteomyelitis, or soft tissue tumors.",
    differentialDiagnosis:
      "Differentiate Plantar Fasciitis from Calcaneal Stress Fracture (positive 'calcaneal squeeze test', pain with direct medial/lateral calcaneal compression, pain worsens continuously with walking), Tarsal Tunnel Syndrome (posterior tibial nerve entrapment; tingling, numbness, burning in the sole with positive Tinel's behind the medial malleolus), Fat Pad Atrophy (central heel pain aggravated by barefoot walking on hard floors in elderly), Spondyloarthritis Enthesitis (bilateral heel pain in ankylosing spondylitis or reactive arthritis), Baxter's Nerve Entrapment (first branch of lateral plantar nerve), and Achilles Tendinopathy.",
    conventionalManagement:
      "Over 90% of patients successfully resolve with conservative non-surgical management within 6 to 12 months: (1) Targeted home stretching protocols (plantar fascia-specific stretching and gastrocnemius-soleus eccentric calf stretching performed 3 times daily). (2) Biomechanical support: custom or prefabricated functional arch-supporting orthotics, silicone heel cups, and rigid night splints (maintaining the foot in 5 degrees of dorsiflexion overnight to prevent fascial shortening). (3) Physical therapy and short-term oral NSAIDs for acute pain flares. (4) Second-line interventional therapies for chronic refractory fasciitis (>3–6 months): Extracorporeal Shockwave Therapy (ESWT; stimulates tissue neovascularization and regenerative healing) or ultrasound-guided Platelet-Rich Plasma (PRP) / Autologous Blood injections. Corticosteroid injections provide rapid short-term relief but carry significant risks of plantar fat pad atrophy and complete plantar fascia rupture. (5) Endoscopic Plantar Fasciotomy (surgical partial release) is reserved strictly as a last resort for chronic disabling cases persisting >12 months.",
    homeopathicApproach:
      "Homeopathic constitutional and tendon/enthesis remedies (such as Ruta Graveolens, Rhus Toxicodendron, Calcarea Fluorica, Phytolacca Decandra, Ledum Palustre, Arnica Montana, Ammonium Muriaticum, Valeriana Officinalis, Silicea) serve as supportive care to ease first-step morning stiffness, soothe periosteal irritation, and support tissue elasticity alongside structured calf stretching, arch orthotics, and footwear optimization.",
    lifestyleAdvice:
      "Perform plantar fascia and calf stretches for 2 minutes before ever stepping out of bed in the morning, roll the sole of the foot over a frozen water bottle for 10 minutes in the evening to massage the fascia and cool inflammation, never walk barefoot on hard tile or hardwood floors (wear supportive, cushioned indoor footwear), replace athletic running shoes every 500 kilometers (300 miles), and manage body weight through low-impact aerobic exercise (swimming, stationary cycling).",
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
        question: "Why does plantar fasciitis hurt the most with the very first steps in the morning?",
        answer: "While you sleep, your feet naturally point downward (plantarflexion), causing the injured plantar fascia to tighten, shorten, and begin microscopic healing in a contracted position. When you take your first steps out of bed, your body weight violently stretches and re-tears this contracted tissue, producing a sharp, stabbing jolt of pain until the fibers gradually stretch out."
      },
      {
        question: "Is the bone spur on my heel X-ray the cause of my pain?",
        answer: "No. A calcaneal spur is simply a calcified traction line where the fascia pulls on the bone. Many people with large heel spurs have no pain at all, while many patients with severe plantar fasciitis have no spur. The pain comes from the injured, thickened ligament itself, not the bone spur poking into the heel."
      }
    ],
    redFlags: [
      "Acute Plantar Fascia Rupture: sudden, violent 'pop' or snapping sensation in the sole of the foot during running or jumping (often following a recent cortisone injection), followed by immediate severe tearing pain, visible plantar ecchymosis (bruising), and a palpable defect in the plantar arch (requires immediate orthopedic immobilization and non-weight-bearing MRI evaluation)",
      "Calcaneal Stress Fracture: constant, severe heel pain that worsens progressively throughout the entire walking duration (does not warm up) and excruciating pain when squeezing the calcaneus from both sides (positive Calcaneal Squeeze Test; mandates urgent non-weight-bearing MRI/radiographs)",
      "Deep Plantar Space Abscess or Necrotizing Infection: rapid-onset severe heel and arch swelling, erythema, high fever, localized warmth, and purulent skin breakdown (especially in diabetic patients; surgical emergency requiring immediate drainage and IV antibiotics)",
      "Numbness, loss of protective sensation, or burning paresthesias in the entire plantar foot (suspected severe diabetic peripheral neuropathy or tarsal tunnel syndrome)"
    ]
  },
  claimCitations: [
    { claimId: "D0067-TRADITIONAL-PROFILE", statement: "Homeopathic plantar fasciitis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0067-TRADITIONAL-PROFILE" },
    { claimId: "D0067-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for complete fascial rupture repair, calcaneal stress fracture healing, or shockwave therapy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0067-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0067-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute plantar fascia rupture, calcaneal stress fracture, or deep plantar space infection.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden audible pop with plantar bruising and acute inability to bear weight indicating complete plantar fascia rupture",
    "Severe heel pain with positive calcaneal squeeze test indicating calcaneal stress fracture requiring non-weight-bearing MRI",
    "Rapidly spreading plantar foot erythema, fever, and purulent swelling indicating deep plantar space infection"
  ],
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
  tags: ["Plantar Fasciitis", "Heel Pain", "Plantar Fasciopathy", "Calcaneal Spur", "Disease", "Morning Heel Pain", "Windlass Mechanism", "Podiatry"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/plantar-fasciitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive biomechanical plantar fasciopathy clinical boundaries, fascial rupture/fracture red flags, and verified citations"],
  clinicalPearl: "Stabbing inferior medial heel pain on the very first steps in the morning that eases after walking for 10 minutes is virtually pathognomonic for plantar fasciitis.",
  quickFacts: {
    "Lifetime Risk": "Affects approximately 10% of the general population (most common cause of adult heel pain)",
    "Primary System": "Musculoskeletal System & Plantar Aponeurosis (Podiatry / Sports Medicine)",
    "Diagnostic Standard": "Clinical Exam (Medial Tuberosity Tenderness + Positive Windlass Test) & Ultrasound (>4mm)",
    "Clinical Character": "Degenerative enthesopathy of the plantar fascia causing first-step morning heel stabbing pain"
  },
  aiReadiness: {
    retrievalSummary: "Plantar Fasciitis is a common heel condition causing sharp pain on the first morning steps due to plantar fascia degeneration, managed with supportive care, calf stretching, arch orthotics, and podiatric guidance.",
    clinicalSummary: "Plantar Fasciitis pathophysiology involves repetitive tensile microtrauma, myxoid collagen degeneration, and enthesopathy at the medial calcaneal tuberosity. Homeopathic remedies serve as supportive musculoskeletal care and do not replace calf/fascia stretching, arch orthotics, or emergency care for complete plantar fascia rupture or calcaneal stress fractures.",
    patientSummary: "Plantar fasciitis is a common cause of heel pain where the strong tissue band supporting your arch gets irritated, causing sharp stabbing pain when you take your first steps out of bed, improved by stretching your calves and wearing supportive shoes.",
    studentSummary: "Degenerative enthesopathy (not primary inflammation) at the medial calcaneal tubercle. Hallmark: post-static dyskinesia (first-step morning pain). Ultrasound shows thickness >4mm. Over 90% resolve with conservative stretching and orthotics. Red flags: fascial rupture and calcaneal stress fracture (squeeze test).",
    keywords: ["plantar fasciitis", "heel pain", "first step morning heel pain", "calcaneal spur", "sole of foot pain", "plantar fasciopathy", "windlass test"],
    semanticKeywords: ["plantar aponeurosis degeneration", "medial calcaneal enthesopathy", "post static dyskinesia heel"],
    icd: "M72.2",
    mesh: "D036981",
    bodySystem: "Orthopedics & Podiatry",
    urgency: "routine"
  }
};
