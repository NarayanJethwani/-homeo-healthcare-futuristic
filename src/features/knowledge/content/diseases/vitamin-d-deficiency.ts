import { KnowledgeEntity } from "../../types";

export const VitaminDDeficiencyDisease: KnowledgeEntity = {
  id: "D0052",
  slug: "vitamin-d-deficiency",
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
    en: "Vitamin D Deficiency (Hypovitaminosis D, Osteomalacia & Bone Demineralization)",
    hi: "विटामिन डी की कमी / हाइपोविटामिनोसिस डी व हड्डियों की कमजोरी (Vitamin D Deficiency)",
    gu: "વિટામિન ડી ની ઉણપ / હાડકાં અને સ્નાયુઓની નબળાઈ (Vitamin D Deficiency)",
    mr: "व्हिटॅमिन डी ची कमतरता / हाडांची झीज व स्नायूंचा अशक्तपणा (Vitamin D Deficiency)",
    es: "Deficiencia de Vitamina D (Hipovitaminosis D, Osteomalacia y Desmineralización Ósea)",
    ar: "عوز فيتامين د وتلين العظام (Vitamin D Deficiency)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Vitamin D Deficiency (Hypovitaminosis D), covering cutaneous 7-dehydrocholesterol photo-activation, hepatic 25-hydroxylation, renal 1-alpha-hydroxylation (calcitriol synthesis), secondary hyperparathyroidism, bone demineralization (osteomalacia/rickets), constitutional homeopathic supportive management, and emergency red flags for severe acute hypocalcemic tetany, carpopedal spasm, laryngospasm, and pathological fragility fractures.",
    hi: "विटामिन डी की कमी (हाइपोविटामिनोसिस डी) का बायोकेमिकल पाथवे, सीरम 25(OH)D स्तर <20 ng/mL, सेकेंडरी हाइपरपैराथायरायडिज्म, ऑस्टियोमलेशिया, हड्डियों व मांसपेशियों में दर्द, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और तीव्र हाइपोकैल्सीमिक टिटैनी (Tetany), लैरिंजोस्पास्म व पैथोलॉजिकल फ्रैक्चर की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "વિટામિન ડી ની ઉણપની પેથોલોજી, લોહીમાં ૨૫-હાઇડ્રોક્સી વિટામિન ડીનું ઓછું સ્તર, હાડકાં-કમરનો દુખાવો, સ્નાયુઓની નબળાઈ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને ગંભીર કેલ્શિયમની ખામીથી આવતી તાણ (ટિટેની) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "व्हिटॅमिन डी ची कमतरता (Hypovitaminosis D), मणके व पायांच्या हाडांमध्ये तीव्र दुखणे, स्नायूंची कमजोरी, पारंपरिक होमिओपॅथिक पद्धत आणि तीव्र हायपोकॅल्सेमिक टिटॅनी (Tetany) व फ्रॅक्चरच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la deficiencia de vitamina D que cubre la síntesis de calcitriol, hiperparatiroidismo secundario, osteomalacia, manejo homeopático complementario y banderas rojas de tetania hipocalcémica y fracturas por fragilidad.",
    ar: "دليل سريري وتعليمي موثوق لعوز فيتامين د يغطي اصطناع الكالسيتريول والدريقات الثانوي وتلين العظام والرعاية التكميلية وعلامات الخطر للكزاز ونقص كلس الدم وتشنج الحنجرة والكسور المرضية."
  },
  content: {
    overview:
      "Vitamin D Deficiency (Hypovitaminosis D) is an extremely prevalent worldwide nutritional and metabolic disorder affecting over 1 billion children and adults across all ethnicities and geographic latitudes. Vitamin D (cholecalciferol / ergocalciferol) functions fundamentally as a secosteroid prohormone essential for intestinal absorption of calcium, magnesium, and phosphate. Inadequate ultraviolet-B (UVB) solar exposure, deficient dietary intake, or impaired metabolic activation triggers a cascade of compensatory endocrine responses: decreased ionized calcium absorption prompts compensatory Parathyroid Hormone (PTH) hypersecretion (Secondary Hyperparathyroidism). Elevated PTH mobilizes calcium from the skeletal reservoir by stimulating osteoclastic bone resorption and increasing renal phosphate excretion, leading to hypophosphatemia, defective osteoid bone matrix mineralization (Rickets in growing children, Osteomalacia in adults), generalized proximal muscle weakness, and accelerated Osteoporosis.",
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
      "Diagnosed biochemically with a definitive laboratory panel: (1) Total Serum 25-Hydroxyvitamin D [25(OH)D] (the undisputed gold-standard biomarker reflecting total cutaneous and dietary stores; <20 ng/mL = Deficient; 21–29 ng/mL = Insufficient; 30–100 ng/mL = Sufficient; >150 ng/mL = Potential Toxicity). (2) Serum Intact Parathyroid Hormone (iPTH; elevated in secondary hyperparathyroidism). (3) Serum Total & Ionized Calcium (typically low-normal or low). (4) Serum Inorganic Phosphorus (low or low-normal). (5) Serum Bone-Specific Alkaline Phosphatase (elevated indicating increased osteoblast turnover). (6) Dual-Energy X-Ray Absorptiometry (DEXA scan; evaluating T-scores for osteopenia/osteoporosis) and Plain Radiographs (demonstrating pseudofractures / Looser zones in osteomalacia).",
    differentialDiagnosis:
      "Differentiate Vitamin D Deficiency from Primary Hyperparathyroidism (elevated calcium with elevated PTH), Fibromyalgia (widespread tender points without laboratory bone turnover abnormalities), Polymyalgia Rheumatica (elevated ESR/CRP with morning shoulder/hip girdle stiffness in elderly), Hypothyroidism (elevated TSH), Myasthenia Gravis (fatigable ptosis and diplopia), and Multiple Myeloma (monoclonal paraprotein, osteolytic bone lesions).",
    conventionalManagement:
      "An evidence-based pharmacological repletion and maintenance protocol (Endocrine Society Guidelines): (1) Intensive Therapeutic Repletion: Ergocalciferol (Vitamin D2) or Cholecalciferol (Vitamin D3) 50,000 IU orally once weekly for 8 consecutive weeks, OR 6,000 IU daily for 8 weeks, targeting a serum 25(OH)D level >30 ng/mL. (2) Long-Term Maintenance: Cholecalciferol (D3) 1,500 to 2,000 IU orally daily (or 50,000 IU every 2 weeks). (3) Co-administration of Dietary Calcium: ensuring adequate elemental calcium intake of 1,000 to 1,200 mg/day through diet or calcium citrate/carbonate supplements to prevent 'hungry bone syndrome'. (4) Active Calcitriol (1,25-OH2-D3) or alpha-calcidol replacement specifically for patients with advanced chronic kidney disease or hypoparathyroidism. (5) Re-checking serum 25(OH)D levels after 3 months of therapy.",
    homeopathicApproach:
      "Homeopathic constitutional and mineral-assimilative remedies (such as Calcarea Carbonica, Calcarea Phosphorica, Calcarea Fluorica, Silicea, Symphytum Officinale, Phosphorus, Causticum, Ruta Graveolens, Lycopodium Clavatum) serve as supportive care to assist vitality, ease bone and joint soreness, and support mineral metabolic balance alongside mandatory oral cholecalciferol repletion, dietary calcium intake, and serial 25(OH)D blood monitoring.",
    lifestyleAdvice:
      "Obtain safe sensible solar UVB exposure (15 to 20 minutes of midday sunlight on arms and legs 2 to 3 times per week without sunscreen, adjusted for skin pigmentation and latitude), incorporate vitamin D-rich foods into your daily meals (wild salmon, fortified milk, fortified plant-based milks, egg yolks), ensure adequate daily dietary calcium intake, engage in regular weight-bearing and resistance exercises (brisk walking, strength training) to stimulate osteoblast bone density, and maintain scheduled laboratory blood test follow-ups.",
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
        question: "Why is vitamin D called the 'sunshine vitamin'?",
        answer: "When natural ultraviolet-B (UVB) rays from sunlight strike your bare skin, they convert a cholesterol compound (7-dehydrocholesterol) in your skin cells directly into pre-vitamin D3, which your liver and kidneys then transform into the active hormone your body uses."
      },
      {
        question: "Can I get enough vitamin D from food alone without sun or supplements?",
        answer: "It is very difficult. Very few foods naturally contain significant amounts of vitamin D (mainly fatty fish like salmon and egg yolks). For people living in northern climates, working indoors, or with dark skin, dietary supplements (vitamin D3) are generally necessary to maintain healthy levels."
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
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive secosteroid endocrinological clinical boundaries, hypocalcemic tetany/rickets red flags, and verified citations"],
  clinicalPearl: "Always test Total 25-Hydroxyvitamin D [25(OH)D], not 1,25-dihydroxyvitamin D; active 1,25-OH2-D levels are often falsely normal or elevated in deficiency due to secondary hyperparathyroidism.",
  quickFacts: {
    "Global Prevalence": "Affects over 1 billion people worldwide (>40% of adults in temperate climates)",
    "Primary System": "Endocrine System & Calcium-Phosphate Mineral Metabolism (Endocrinology / Rheumatology)",
    "Diagnostic Standard": "Serum Total 25-Hydroxyvitamin D [25(OH)D] (<20 ng/mL = Deficient)",
    "Clinical Character": "Secosteroid prohormone deficiency causing secondary hyperparathyroidism and osteomalacia"
  },
  aiReadiness: {
    retrievalSummary: "Vitamin D Deficiency is low blood 25(OH)D causing bone pain, muscle weakness, and fatigue, managed with supportive care, oral cholecalciferol repletion, safe sunlight, and calcium intake.",
    clinicalSummary: "Vitamin D Deficiency pathophysiology involves impaired intestinal calcium absorption triggering secondary hyperparathyroidism, bone resorption, and defective osteoid mineralization. Homeopathic remedies serve as supportive mineral-assimilative care and do not replace oral cholecalciferol repletion (50,000 IU/week), dietary calcium, or emergency IV calcium for hypocalcemic tetany.",
    patientSummary: "Vitamin D deficiency happens when your body does not get enough sunlight or dietary vitamin D, leading to low calcium, bone aches, and weak muscles, easily corrected by taking vitamin D3 supplements.",
    studentSummary: "Diagnosed by serum 25(OH)D <20 ng/mL (do not order 1,25-OH2-D). Triggers secondary hyperparathyroidism leading to osteomalacia and rickets. Treatment: 50,000 IU D3 weekly for 8 weeks. Red flags: hypocalcemic tetany (Trousseau/Chvostek signs, laryngospasm) and pathological fractures.",
    keywords: ["vitamin d deficiency", "hypovitaminosis d", "low 25-hydroxyvitamin d", "bone pain muscle weakness", "osteomalacia", "rickets", "cholecalciferol"],
    semanticKeywords: ["secosteroid prohormone deficiency", "secondary hyperparathyroidism bone loss", "defective osteoid mineralization"],
    icd: "E55.9",
    mesh: "D014808",
    bodySystem: "Endocrinology & Nutrition",
    urgency: "routine"
  }
};
