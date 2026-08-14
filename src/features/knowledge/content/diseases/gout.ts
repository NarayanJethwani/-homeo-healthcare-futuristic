import { KnowledgeEntity } from "../../types";

export const GoutDisease: KnowledgeEntity = {
  id: "D0023",
  slug: "gout",
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
    en: "Gout & Hyperuricemia (Gouty Arthritis)",
    hi: "गाउट / गठिया वात (Gout & Hyperuricemia)",
    gu: "ગાઉટ / સંધિવા (Gout & Hyperuricemia)",
    mr: "गाउट / युरिक अ‍ॅसिड वाढणे (Gouty Arthritis)",
    es: "Gota e Hiperuricemia (Artritis Gotosa)",
    ar: "النقرس وفرط حمض اليوريك (Gout)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Gout, covering monosodium urate crystal deposition, acute podagra, purine metabolic pathways, constitutional homeopathic supportive management, and emergency red flags for acute septic arthritis and severe joint infection.",
    hi: "गाउट (यूरिक एसिड गठिया) का मोनोसोडियम यूरेट क्रिस्टल पैथोलॉजी, तीव्र पोडाग्रा (पैर के अंगूठे का दर्द), प्यूरीन मेटाबॉलिज्म, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सेप्टिक आर्थराइटिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ગાઉટ (યુરિક એસિડ સંધિવા) ના સ્ફટિકોની પેથોલોજી, પગના અંગૂઠાનો તીવ્ર સોજો (પોડાગ્રા), પ્યુરીન ચયાપચય, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને સેપ્ટિક આર્થરાઇટિસની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "गाउट (युरिक अ‍ॅसिड संधिवात), पायाच्या अंगठ्याची तीव्र सूज व जळजळ, प्युरीन पचनक्रिया, पारंपरिक होमिओपॅथिक पद्धत आणि सांध्यातील इन्फेक्शनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la gota que cubre el depósito de cristales de urato, podagra aguda, manejo homeopático complementario y banderas rojas de artritis séptica.",
    ar: "دليل سريري وتعليمي موثوق للنقرس يغطي ترسب بلورات اليورات ونوبات النقرس الحادة في إبهام القدم والرعاية التكميلية وعلامات الخطر لالتهاب المفاصل الإنتاني."
  },
  content: {
    overview:
      "Gout is a common, intensely painful metabolic inflammatory crystal arthropathy caused by the chronic supersaturation of body fluids with monosodium urate (MSU), leading to crystal deposition in synovial joints, periarticular soft tissues, and kidneys. An acute attack of gout (classically affecting the first metatarsophalangeal joint, termed 'podagra') is marked by rapid onset of excruciating joint pain, erythema, edema, warmth, and marked tenderness, often peaking within 12 to 24 hours.",
    definition:
      "A metabolic disease characterized by recurrent paroxysms of acute inflammatory arthritis resulting from the intra-articular precipitation of monosodium urate monohydrate crystals triggered by hyperuricemia (serum urate >6.8 mg/dL).",
    causes: [
      "Impaired renal clearance of uric acid (responsible for ~90% of chronic hyperuricemia cases)",
      "Excessive hepatic purine catabolism and uric acid overproduction (PRPP synthetase superactivity, HGPRT deficiency)",
      "Intra-articular crystallization of needle-shaped negatively birefringent monosodium urate (MSU) crystals",
      "Activation of the NLRP3 inflammasome in synovial macrophages, releasing potent interleukin-1β (IL-1β) cytokines"
    ],
    riskFactors: [
      "Male gender (male-to-female ratio 4:1 before female menopause)",
      "High-purine dietary intake: red meat, organ meats (liver, kidneys), game meats, seafood (anchovies, sardines, shellfish)",
      "Excessive alcohol consumption, particularly beer (high purine content) and spirits",
      "Sugar-sweetened beverages containing high-fructose corn syrup (fructose accelerates purine nucleotide degradation)",
      "Comorbid metabolic syndrome: obesity, hypertension, type 2 diabetes, hyperlipidemia, and chronic kidney disease (CKD)",
      "Pharmacological triggers: thiazide and loop diuretics, low-dose aspirin, cyclosporine, and pyrazinamide"
    ],
    symptoms: [
      "Sudden, excruciating, explosive joint pain (frequently waking the patient from sleep in early morning hours)",
      "Podagra: severe inflammation, dark red or violaceous erythema, warmth, and tense edema of the first metatarsophalangeal (MTP) joint",
      "Extreme cutaneous hyperesthesia: affected joint is so tender that even the weight of a bedsheet is agonizing",
      "Desquamation (peeling of the skin) and severe pruritus over the joint as the acute inflammatory flare subsides",
      "Chronic tophaceous gout: development of hard, chalky, painless nodular deposits of urate crystals (tophi) in helix of ear, olecranon bursa, Achilles tendon, and finger pads"
    ],
    diagnosis:
      "The definitive diagnostic gold standard is arthrocentesis (synovial fluid aspiration) demonstrating needle-shaped, negatively birefringent monosodium urate crystals under polarized light microscopy. Supported by serum uric acid testing (>6.8 mg/dL; note that serum urate may be transiently normal during an acute inflammatory flare), ultrasound demonstrating the 'double contour sign' over hyaline cartilage, and DECT (Dual-Energy CT) identifying subclinical urate deposits.",
    differentialDiagnosis:
      "Differentiate Gout from Septic Arthritis (medical emergency), Pseudogout / CPPD (calcium pyrophosphate dihydrate deposition with rhomboid positively birefringent crystals), Cellulitis, Psoriatic Arthritis, Reactive Arthritis, and Acute Rheumatoid Arthritis flare.",
    conventionalManagement:
      "Acute flare treatment includes oral colchicine (within 36 hours of onset), NSAIDs (indomethacin, naproxen), or intra-articular/systemic corticosteroids. Long-term management focuses on urate-lowering therapy (ULT) with xanthine oxidase inhibitors (allopurinol, febuxostat) or uricosuric agents (probenecid) to maintain serum uric acid <6.0 mg/dL (or <5.0 mg/dL in severe tophaceous gout).",
    homeopathicApproach:
      "Homeopathic constitutional and drainage remedies (such as Colchicum Autumnale, Urtica Urens, Benzoic Acid, Ledum Palustre, Lycopodium Clavatum, Lithium Carbonicum, Berberis Vulgaris) serve as supportive care to ease joint soreness, assist constitutional metabolic balance, and relieve chronic stiffness alongside dietary purine moderation and conventional urate-lowering guidance.",
    lifestyleAdvice:
      "Maintain generous daily water hydration (2.5–3 liters/day) to enhance renal urate clearance, eliminate beer and liquor, strictly limit purine-dense foods and high-fructose corn syrup beverages, incorporate low-fat dairy products and tart cherries (contain anthocyanins which promote uricosuria), and achieve gradual weight reduction.",
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
        question: "Can someone have an acute gout attack with a normal blood uric acid level?",
        answer: "Yes, during an acute gout flare, systemic inflammatory cytokines often increase renal uric acid excretion, causing serum urate levels to drop into the normal reference range in up to 30% of patients. Diagnostic re-testing should be performed 2 to 4 weeks after the flare resolves."
      },
      {
        question: "What foods are highest in purines that gout patients should avoid?",
        answer: "Organ meats (liver, kidneys, sweetbreads), game meats, certain seafoods (anchovies, sardines, mussels, scallops), beer, and drinks sweetened with high-fructose corn syrup."
      }
    ],
    redFlags: [
      "Severe monoarthritis accompanied by high spiking fever, shaking chills, and purulent joint aspirate (suspected acute septic arthritis requiring emergency arthrocentesis and IV antibiotics)",
      "Rapidly spreading cutaneous erythema, lymphangitic streaking, or skin necrosis around the joint (suspected necrotizing soft tissue infection)",
      "Acute oliguria, anuria, or flank pain indicating acute uric acid nephropathy or obstructive urate urolithiasis"
    ]
  },
  claimCitations: [
    { claimId: "D0023-TRADITIONAL-PROFILE", statement: "Homeopathic gout profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0023-TRADITIONAL-PROFILE" },
    { claimId: "D0023-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for enzymatic purine defects or acute septic joint destruction.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0023-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0023-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute septic arthritis, joint infection, or acute renal failure.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Acute hot swollen joint accompanied by systemic fever and chills (suspected septic arthritis requiring immediate emergency joint aspiration)",
    "Acute oliguria or anuria indicating acute uric acid obstructive nephropathy",
    "Rapidly spreading cellulitis or soft tissue necrosis around the joint"
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
  tags: ["Gout", "Hyperuricemia", "Disease", "Podagra", "Uric Acid", "Arthritis", "Tophi", "Joint Inflammation"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gout",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive hyperuricemic clinical boundaries, septic joint red flags, and verified citations"],
  clinicalPearl: "Every acute hot, erythematous, swollen single joint must be evaluated to rule out septic arthritis before initiating steroid or gout anti-inflammatory therapy.",
  quickFacts: {
    "Prevalence": "Est. 3–4% of adult population (strongly male-predominant)",
    "Primary System": "Metabolic & Musculoskeletal System (Purine Metabolism)",
    "Diagnostic Standard": "Synovial fluid MSU crystal analysis (Polarized Light Microscopy)",
    "Clinical Character": "Paroxysmal acute inflammatory crystal arthritis with tophaceous subcutaneous deposits"
  },
  aiReadiness: {
    retrievalSummary: "Gout is a painful crystal-induced inflammatory arthritis driven by hyperuricemia and monosodium urate crystal deposition, presenting as acute podagra and managed with supportive constitutional care, purine diet control, and conventional medical guidance.",
    clinicalSummary: "Gout pathophysiology involves urate supersaturation, MSU crystal precipitation, and NLRP3 inflammasome activation. Homeopathic remedies serve as supportive metabolic care and do not replace emergency arthrocentesis or antibiotics for acute septic arthritis or xanthine oxidase inhibitors for chronic tophaceous gout.",
    patientSummary: "Gout is a type of arthritis caused by excess uric acid crystals collecting in joints (most often the big toe), causing sudden intense swelling, redness, and severe pain that can be triggered by rich foods or alcohol.",
    studentSummary: "Caused by monosodium urate crystals showing negative birefringence under polarized light. Hallmark is podagra. Differentiate from septic arthritis and pseudogout (CPPD crystals with positive birefringence).",
    keywords: ["gout", "gouty arthritis", "podagra", "uric acid", "hyperuricemia", "tophi", "big toe joint pain"],
    semanticKeywords: ["monosodium urate crystals", "purine metabolism", "crystal arthropathy"],
    icd: "M10.9",
    mesh: "D006073",
    bodySystem: "Metabolic & Musculoskeletal",
    urgency: "routine"
  }
};
