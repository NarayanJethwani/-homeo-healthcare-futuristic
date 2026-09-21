import { KnowledgeEntity } from "../../types";

export const VitaminDDeficiencyDisease: KnowledgeEntity = {
  id: "D0052",
  slug: "vitamin-d-deficiency",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-20T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Vitamin D Deficiency",
    hi: "विटामिन डी की कमी / हाइपोविटामिनोसिस डी व हड्डियों की कमजोरी (Vitamin D Deficiency)",
    gu: "વિટામિન ડી ની ઉણપ / હાડકાં અને સ્નાયુઓની નબળાઈ (Vitamin D Deficiency)",
    mr: "व्हिटॅमिन डी ची कमतरता / हाडांची झीज व स्नायूंचा अशक्तपणा (Vitamin D Deficiency)",
    es: "Deficiencia de Vitamina D (Hipovitaminosis D, Osteomalacia y Desmineralización Ósea)",
    ar: "عوز فيتامين د وتلين العظام (Vitamin D Deficiency)"
  },
  summary: {
    en: "A clear guide to low vitamin D: possible symptoms, the usual blood test, common risk factors, safe next steps, and when to seek clinical advice.",
    hi: "विटामिन डी की कमी (हाइपोविटामिनोसिस डी) का बायोकेमिकल पाथवे, सीरम 25(OH)D स्तर <20 ng/mL, सेकेंडरी हाइपरपैराथायरायडिज्म, ऑस्टियोमलेशिया, हड्डियों व मांसपेशियों में दर्द, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और तीव्र हाइपोकैल्सीमिक टिटैनी (Tetany), लैरिंजोस्पास्म व पैथोलॉजिकल फ्रैक्चर की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "વિટામિન ડી ની ઉણપની પેથોલોજી, લોહીમાં ૨૫-હાઇડ્રોક્સી વિટામિન ડીનું ઓછું સ્તર, હાડકાં-કમરનો દુખાવો, સ્નાયુઓની નબળાઈ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને ગંભીર કેલ્શિયમની ખામીથી આવતી તાણ (ટિટેની) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "व्हिटॅमिन डी ची कमतरता (Hypovitaminosis D), मणके व पायांच्या हाडांमध्ये तीव्र दुखणे, स्नायूंची कमजोरी, पारंपरिक होमिओपॅथिक पद्धत आणि तीव्र हायपोकॅल्सेमिक टिटॅनी (Tetany) व फ्रॅक्चरच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la deficiencia de vitamina D que cubre la síntesis de calcitriol, hiperparatiroidismo secundario, osteomalacia, manejo homeopático complementario y banderas rojas de tetania hipocalcémica y fracturas por fragilidad.",
    ar: "دليل سريري وتعليمي موثوق لعوز فيتامين د يغطي اصطناع الكالسيتريول والدريقات الثانوي وتلين العظام والرعاية التكميلية وعلامات الخطر للكزاز ونقص كلس الدم وتشنج الحنجرة والكسور المرضية."
  },
  content: {
    overview:
      "Vitamin D helps the body absorb calcium and supports normal bone, muscle, nerve, and immune function. Low levels are common and may cause no symptoms at all. When deficiency is more significant, people can develop bone discomfort, muscle aches or weakness, and a greater risk of bone problems. A blood test and the wider clinical picture—not symptoms alone—help a clinician decide whether low vitamin D is contributing.",
    definition:
      "A clinical and biochemical metabolic disorder defined by the Endocrine Society as a serum 25-hydroxyvitamin D [25(OH)D] concentration <20 ng/mL (<50 nmol/L), with levels of 21–29 ng/mL classified as insufficiency and \u226530 ng/mL as sufficiency.",
    causes: [
      "Inadequate Cutaneous Photobiogenesis: insufficient ultraviolet-B (UVB; 290–315 nm) solar irradiation to convert epidermal 7-dehydrocholesterol to pre-vitamin D3 due to indoor lifestyles, high geographic latitude, sunscreen use (SPF 30 reduces synthesis by >95%), clothing coverage, or high melanin pigmentation",
      "Inadequate Dietary Intake: low consumption of vitamin D-rich foods (fatty fish [salmon, mackerel], fortified dairy products, egg yolks, UV-exposed mushrooms)",
      "Gastrointestinal Malabsorption: celiac disease, Crohn's disease, cystic fibrosis, pancreatic insufficiency, bariatric Roux-en-Y gastric bypass surgery, or chronic cholestatic liver disease impairing fat-soluble vitamin absorption",
      "Hepatic Hydroxylation Impairment: chronic severe liver disease impairing conversion of vitamin D to 25-hydroxyvitamin D [25(OH)D] via CYP2R1",
      "Renal 1-Alpha-Hydroxylation Deficiency: Chronic Kidney Disease (CKD stage 3–5) losing functional CYP27B1 activity and failing to synthesize active 1,25-dihydroxyvitamin D3 (Calcitriol)",
      "Pharmacological accelerated catabolism: cytochrome P450 enzyme-inducing anticonvulsants (phenytoin, carbamazepine, phenobarbital), rifampin, and glucocorticoids accelerating conversion of vitamin D metabolites to inactive forms"
    ],
    riskFactors: [
      "Dark skin pigmentation (high melanin acts as a natural sunscreen, requiring 3 to 5 times longer sun exposure to synthesize equivalent vitamin D)",
      "Institutionalized elderly individuals and homebound adults with minimal outdoor daylight exposure",
      "Exclusive breastfeeding in infants without standard 400 IU/day vitamin D supplementation",
      "Obesity (BMI \u226530 kg/m^2; lipophilic vitamin D is sequestered in excess adipose stores, decreasing bioavailability)",
      "Chronic kidney disease or inflammatory bowel disease"
    ],
    symptoms: [
      "Often completely asymptomatic in mild to moderate deficiency",
      "Diffuse, dull, aching musculoskeletal pain affecting the lower back, pelvis, hips, thighs, and rib cage",
      "Proximal Muscle Weakness (Myopathy): difficulty standing up from a chair without using arms, difficulty climbing stairs, or a waddling gait (due to impaired muscle calcium flux and low type II fast-twitch muscle fibers)",
      "Bone tenderness on firm thumb palpation over the anterior tibia, sternum, or pelvic crest (hallmark of adult osteomalacia)",
      "Chronic generalized fatigue, lethargy, impaired physical endurance, and depressive mood symptoms",
      "Pediatric Rickets manifestations: craniotabes, delayed fontanelle closure, rachitic rosary (beading of costochondral junctions), wrist/ankle widening, and lower limb bowing (genu varum/valgum)"
    ],
    diagnosis:
      "The usual test is total 25-hydroxyvitamin D [25(OH)D]. A clinician may consider it when symptoms, a health condition, medicines, or individual risk factors make a low level more likely; it is not a routine screening test for everyone. Calcium, kidney function, bone health, and other tests may be considered when the history or result calls for them.",
    differentialDiagnosis:
      "Differentiate Vitamin D Deficiency from Primary Hyperparathyroidism (elevated calcium with elevated PTH), Fibromyalgia (widespread tender points without laboratory bone turnover abnormalities), Polymyalgia Rheumatica (elevated ESR/CRP with morning shoulder/hip girdle stiffness in elderly), Hypothyroidism (elevated TSH), Myasthenia Gravis (fatigable ptosis and diplopia), and Multiple Myeloma (monoclonal paraprotein, osteolytic bone lesions).",
    conventionalManagement:
      "Treatment is individual. A clinician may recommend a vitamin D supplement, dietary changes, follow-up testing, or investigation of an underlying cause. The right dose, timing, and whether calcium or other treatment is needed depend on age, the test result, kidney function, medicines, pregnancy status, and other health conditions. Do not start high-dose vitamin D on your own: excessive supplementation can be harmful.",
    homeopathicApproach:
      "If you use complementary care, discuss it openly with your clinician and pharmacist. It should not replace a clinician-led plan for confirmed vitamin D deficiency, recommended supplements, or follow-up testing.",
    lifestyleAdvice:
      "Choose vitamin-D-containing or fortified foods where they suit your diet, including fatty fish, egg yolks, fortified milk or plant drinks, and some fortified cereals. Regular weight-bearing movement supports bone health. Do not use intentional unprotected sun exposure as a treatment plan; balance daylight habits with skin-cancer safety advice and ask a clinician whether a supplement is appropriate for you.",
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
        question: "What does a vitamin D blood result measure?",
        answer: "Most tests measure total 25-hydroxyvitamin D, written as 25(OH)D. It reflects vitamin D from skin exposure, food, and supplements. Your clinician should interpret the number alongside your laboratory range, symptoms, medical history, and medicines."
      },
      {
        question: "Does fatigue mean that I have low vitamin D?",
        answer: "Not necessarily. Fatigue is common and can have many causes, including sleep problems, anaemia, thyroid conditions, stress, infections, and medicines. A test may be useful when your clinician thinks vitamin D is a relevant possibility."
      },
      {
        question: "Can I take a high-dose vitamin D supplement without a test?",
        answer: "It is safer to ask a clinician or pharmacist first, particularly if you have kidney disease, take other medicines, are pregnant, or plan to take a high dose. Too much vitamin D from supplements can raise calcium levels and harm the kidneys."
      },
      {
        question: "Is sunlight the best way to correct a low level?",
        answer: "Sunlight can contribute to vitamin D production, but it is not a predictable or universally safe treatment. Food, clinician-advised supplements, and follow-up testing are often more reliable ways to manage a confirmed deficiency."
      },
      {
        question: "When should I seek medical advice sooner?",
        answer: "Seek timely advice for persistent bone pain or muscle weakness, a fracture after a minor injury, symptoms in a child, or symptoms after taking large amounts of vitamin D. Seek urgent care for a seizure, severe breathing difficulty, sudden inability to bear weight, or confusion."
      }
    ],
    redFlags: [
      "Acute Severe Hypocalcemic Tetany: severe neuromuscular excitability, perioral tingling (numbness around the mouth), painful Carpopedal Spasm (Trousseau's sign / involuntary hand flexion), facial muscle twitching on tapping the facial nerve (Chvostek's sign), and Laryngospasm with acute airway stridor (life-threatening medical emergency requiring immediate IV Calcium Gluconate in an emergency setting)",
      "Pathological Fragility Fracture: sudden acute bone pain and inability to bear weight after minimal or no trauma (e.g., femoral neck fracture, vertebral wedge compression fracture; requires urgent orthopedic surgical evaluation and hospitalization)",
      "Severe Pediatric Rickets with Hypocalcemic Seizures: generalized tonic-clonic seizures, severe hypotonia, apnea, or respiratory failure in an infant (pediatric emergency requiring immediate IV calcium and intensive care monitoring)",
      "Vitamin D Toxicity (Hypervitaminosis D): nausea, persistent vomiting, severe constipation, polydipsia, polyuria, nephrocalcinosis, acute kidney injury, and altered mental status resulting from massive over-supplementation (serum 25(OH)D >150 ng/mL with severe hypercalcemia)"
    ]
  },
  claimCitations: [
    { claimId: "D0052-TRADITIONAL-PROFILE", statement: "Homeopathic vitamin D deficiency profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0052-TRADITIONAL-PROFILE" },
    { claimId: "D0052-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for oral cholecalciferol repletion, hypocalcemic tetany IV calcium resuscitation, or fracture repair.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0052-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0052-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for hypocalcemic tetany, pathological fracture, or hypocalcemic seizures.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Carpopedal spasm, facial twitching, and laryngospasm indicating acute hypocalcemic tetany requiring immediate IV calcium gluconate",
    "Sudden inability to bear weight after minor fall indicating pathological fragility fracture requiring urgent orthopedic care",
    "Generalized seizures and severe hypotonia in an infant indicating rachitic hypocalcemia requiring emergency pediatric admission"
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
  tags: ["Vitamin D Deficiency", "Hypovitaminosis D", "Osteomalacia", "Bone Pain", "Disease", "Cholecalciferol", "25-OH-D", "Endocrinology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/vitamin-d-deficiency",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.2.0: Simplified the patient-first overview, treatment boundaries, and question-led guidance while retaining clinical safety information.", "1.1.0: Promoted to governed v1.1.0 with comprehensive secosteroid endocrinological clinical boundaries, hypocalcemic tetany/rickets red flags, and verified citations"],
  clinicalPearl: "Total 25-hydroxyvitamin D [25(OH)D] is the usual test for vitamin D status; interpretation should be individualised rather than based on a number alone.",
  quickFacts: {
    "Why it matters": "Vitamin D supports bone, muscle, nerve, and immune function",
    "Usual test": "Total 25-Hydroxyvitamin D [25(OH)D] blood test",
    "Often missed because": "Mild deficiency may cause no clear symptoms",
    "Next step": "Discuss the result, risk factors, and safe supplement plan with a clinician"
  },
  aiReadiness: {
    retrievalSummary: "Vitamin D deficiency is a low 25(OH)D blood result that may affect bone and muscle health. Management is individual and can include clinician-guided supplements, diet, and follow-up testing.",
    clinicalSummary: "Total 25(OH)D is the usual measure of vitamin D status. Consider symptoms, risk factors, medicines, kidney or liver disease, and laboratory ranges; avoid unsupervised high-dose supplementation because excess can cause hypercalcaemia and kidney injury.",
    patientSummary: "Low vitamin D may not cause obvious symptoms. A clinician can help you understand whether a blood result matters for you and whether food changes, a supplement, or follow-up testing is appropriate.",
    studentSummary: "Use total 25(OH)D to assess vitamin D status. Interpret a result in context; identify malabsorption, renal/hepatic disease, medicines, and excess-supplement risk. Urgent symptoms include seizure, severe breathing difficulty, confusion, or acute inability to bear weight.",
    keywords: ["vitamin d deficiency", "hypovitaminosis d", "low 25-hydroxyvitamin d", "bone pain muscle weakness", "osteomalacia", "rickets", "cholecalciferol"],
    semanticKeywords: ["secosteroid prohormone deficiency", "secondary hyperparathyroidism bone loss", "defective osteoid mineralization"],
    icd: "E55.9",
    mesh: "D014808",
    bodySystem: "Endocrinology & Nutrition",
    urgency: "routine"
  }
};
