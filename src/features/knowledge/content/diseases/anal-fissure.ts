import { KnowledgeEntity } from "../../types";

export const AnalFissureDisease: KnowledgeEntity = {
  id: "D0045",
  slug: "anal-fissure",
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
    en: "Anal Fissure (Fissure-in-Ano / Acute & Chronic Anoderm Tear)",
    hi: "गुदा विदर / एनल फिशर (Anal Fissure / Fissure-in-Ano)",
    gu: "હરસ-મસા અને ફિશર / ગુદામાં ચીરો પડવો (Anal Fissure)",
    mr: "फिशर / गुदद्वारात चीर पडणे (Anal Fissure)",
    es: "Fisura Anal (Fisura en Ano / Desgarro Anodérmico)",
    ar: "الشق الشرجي (Anal Fissure)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Anal Fissure (Fissure-in-Ano), covering posterior midline anoderm tearing, internal anal sphincter hypertonicity, microvascular ischemia, constitutional homeopathic supportive management, and emergency red flags for deep ischiorectal perianal abscess, necrotizing fasciitis, and Crohn's complex fistulae.",
    hi: "एनल फिशर (गुदा मार्ग में चीरा व घाव) का एनोडर्म टीयर पैथोलॉजी, इंटरनल स्फिंक्टर की ऐंठन व जकड़न, शौच के समय व बाद में तीव्र जलन, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और पेरिएनल फोड़ा (एब्सेस) व फिस्टुला की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "એનલ ફિશર (ગુદાના ભાગમાં ચીરો) ની પેથોલોજી, શૌચ વખતે કાચ ભોંકાતો હોય તેવી અસહ્ય બળતરા, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને ગુદાના પરુવાળા ગૂમડાં (એબ્સેસ) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "फिशर (गुदद्वारात पडलेली चीर), शौचाच्या वेळी होणाऱ्या काचेसारख्या टोचणाऱ्या तीव्र वेदना व जळजळ, पारंपरिक होमिओपॅथिक पद्धत आणि भगंदर/गळूच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la fisura anal que cubre el desgarro anodérmico, hipertonía del esfínter anal interno, isquemia, manejo homeopático complementario y banderas rojas de absceso isquiorrectal y fístulas complejas.",
    ar: "دليل سريري وتعليمي موثوق للشق الشرجي يغطي تمزق بطانة الشرج وفرط توتر المصرة الشرجية الداخلية ونقص التروية الدموية والرعاية التكميلية وعلامات الخطر للخراج الشرجي والناسور المعقد."
  },
  content: {
    overview:
      "An Anal Fissure (fissure-in-ano) is a painful, longitudinal or elliptical linear tear in the specialized non-keratinized stratified squamous epithelium (anoderm) lining the distal anal canal, extending from the dentate (pectinate) line to the anal verge. Located in the posterior midline in >90% of cases (due to relative posterior microvascular hypoperfusion and elliptical configuration of the external sphincter fibers), it triggers a vicious pathophysiological cycle of severe pain, reactive hypertonicity and spasm of the internal anal sphincter (IAS), localized microvascular ischemia, and impaired epithelial wound healing.",
    definition:
      "A linear breach or ulceration in the specialized anoderm of the lower anal canal distal to the dentate line, classified as acute (<6 weeks duration with fresh mucosal edges) or chronic (>6 weeks duration with visible internal sphincter fibers, sentinel skin tag, and hypertrophied anal papilla).",
    causes: [
      "Mechanical trauma and shear forces caused by the passage of hard, dry, bulky, impacted fecal matter during severe constipation",
      "Severe acute or chronic explosive watery diarrhea causing chemical irritation and excoriation of the delicate anoderm",
      "Hypertonicity and spasm of the internal anal sphincter (IAS; elevated resting anal canal pressure >90–100 mmHg impeding arteriolar blood flow)",
      "Microvascular ischemia: relative physiological watershed hypoperfusion of the posterior midline anal canal",
      "Secondary etiologies: Crohn's disease, anal tuberculosis, syphilis, HIV/AIDS, herpes simplex, anal squamous cell carcinoma, or trauma from vaginal childbirth / instrumentation"
    ],
    riskFactors: [
      "Chronic constipation, hard stools, and low dietary fiber intake",
      "Withholding bowel movements due to fear of defecation pain (worsening fecal compaction and sphincter spasm)",
      "Recent vaginal delivery with perineal laceration or episiotomy",
      "Prior anorectal surgery or tight anal band scarring",
      "Inflammatory Bowel Disease (IBD; particularly Crohn's disease with atypical lateral or multiple fissures)"
    ],
    symptoms: [
      "Severe, sharp, cutting, tearing, or burning pain during defecation (often described as 'passing razor blades or broken glass')",
      "Persistent post-defecation burning spasm: agonizing, throbbing ache lasting for 30 minutes up to several hours after bowel evacuation",
      "Bright red rectal bleeding (hematochezia): small streaks of fresh bright red blood visible on the toilet paper or exterior surface of the stool",
      "Chronic triad features: classic triad of (1) visible deep ulcer with exposed circular internal sphincter fibers, (2) a distal 'sentinel pile' or skin tag at the anal verge, and (3) a proximal hypertrophied anal papilla at the dentate line",
      "Pruritus ani and mild serous perianal discharge from chronic unhealed granulation tissue"
    ],
    diagnosis:
      "Diagnosed clinically via gentle visual inspection of the perianal region and anal verge while gently parting the buttocks (in the left lateral prone or jackknife position). Digital Rectal Examination (DRE) and anoscopy are excruciatingly painful and strictly avoided during acute flares unless under local/general anesthesia. Atypical locations (lateral, anterior, multiple, painless, or deeply indurated fissures) mandate colonoscopy and biopsy to exclude Crohn's disease, tuberculosis, STI, or malignancy.",
    differentialDiagnosis:
      "Differentiate Anal Fissure from Thrombosed External Hemorrhoids (painful bluish perianal lump), Perianal / Ischiorectal Abscess (constant throbbing pain with fluctuant fever/swelling), Fistula-in-Ano, Pruritus Ani, Anal Malignancy (squamous cell / adenocarcinoma with hard indurated borders), and Proctalgia Fugax (fleeting nocturnal sphincter spasms without mucosal ulcer).",
    conventionalManagement:
      "First-line conservative medical therapy resolves >80% of acute fissures: high-fiber diet (\u226525–35 g/day), bulk-forming laxatives (psyllium husk), stool softeners, warm water sitz baths (15–20 minutes 2 to 3 times daily to relax the internal sphincter), and topical chemical sphincter relaxants (0.2%–0.4% nitroglycerin ointment [GTN] or 2% diltiazem / 0.3% nifedipine gel twice daily for 6–8 weeks). Second-line therapy includes Botulinum toxin (Botox) injection into the internal sphincter. Lateral Internal Sphincterotomy (LIS; partial surgical division of the lower internal sphincter) is the definitive surgical gold standard (>95% healing rate) for chronic refractory fissures.",
    homeopathicApproach:
      "Homeopathic constitutional and anorectal remedies (such as Ratanhia Peruviana, Nitricum Acidum, Paeonia Officinalis, Graphites, Nux Vomica, Sulphur, Silicea, Aesculus Hippocastanum, Thuja) serve as supportive care to ease burning post-defecation spasms, promote mucosal healing, and relieve chronic stool straining alongside high-fiber hydration and warm sitz baths.",
    lifestyleAdvice:
      "Consume a high-fiber diet rich in whole grains, fruits, and vegetables, drink at least 2.5 to 3 liters of water daily to maintain soft pliable bowel movements, take a 15-minute warm water sitz bath immediately after every bowel movement to relax sphincter muscle spasms, respond promptly to the urge to defecate without straining, and avoid using dry toilet paper (use warm water or unscented wet wipes instead).",
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
        question: "Why does an anal fissure cause pain that lasts for hours after having a bowel movement?",
        answer: "Passing stool tears the sensitive nerve-rich anoderm, triggering a reactive, involuntary spasm (cramp) of the underlying internal anal sphincter muscle. This sustained muscle cramp pinches the blood supply and produces a deep, throbbing ache that can persist for several hours."
      },
      {
        question: "What is a 'sentinel pile' in a chronic anal fissure?",
        answer: "A sentinel pile is a small, painless swelling or skin tag that forms at the outer lower edge of a chronic fissure. It is not a true hemorrhoid, but a protective inflammatory skin fold resulting from chronic edema and lymphatic obstruction."
      }
    ],
    redFlags: [
      "Perianal or Ischiorectal Abscess: constant, severe, throbbing perianal pain unrelated to defecation, accompanied by high fever, chills, and a red, warm, fluctuant perianal swelling (surgical emergency requiring immediate emergency incision and drainage)",
      "Fournier's Gangrene: rapidly spreading perianal/scrotal erythema, crepitus, exquisite tenderness, foul purulent drainage, and septic shock (life-threatening necrotizing fasciitis requiring immediate emergency surgical debridement)",
      "Atypical, painless, or non-healing fissures located laterally or anteriorly with hard, rolled, indurated margins (suspected Anal Carcinoma or Crohn's disease requiring urgent colorectal biopsy)",
      "Continuous, heavy, dark rectal bleeding leading to hemodynamic instability or acute anemia"
    ]
  },
  claimCitations: [
    { claimId: "D0045-TRADITIONAL-PROFILE", statement: "Homeopathic anal fissure profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0045-TRADITIONAL-PROFILE" },
    { claimId: "D0045-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for sphincterotomy surgery, perianal abscess drainage, or necrotizing infection.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0045-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0045-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for ischiorectal abscess, Fournier gangrene, or colorectal malignancy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Constant severe throbbing pain, perianal swelling, and fever indicating acute perianal/ischiorectal abscess requiring emergency incision and drainage",
    "Rapidly spreading perineal erythema with crepitus and septic shock indicating Fournier's necrotizing fasciitis",
    "Atypical lateral or painless indurated fissure requiring urgent colorectal biopsy to rule out malignancy or Crohn's disease"
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
  tags: ["Anal Fissure", "Fissure-in-Ano", "Anoderm Tear", "Disease", "Rectal Pain", "Painful Defecation", "Sentinel Pile", "Proctology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/anal-fissure",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive proctological anoderm clinical boundaries, perianal abscess red flags, and verified citations"],
  clinicalPearl: "Severe cutting pain during and for hours after defecation with a tiny streak of bright red blood on toilet paper is the classic hallmark of an anal fissure.",
  quickFacts: {
    "Lifetime Incidence": "Estimated 10% across the general population (equally common in men and women)",
    "Primary System": "Lower Gastrointestinal & Colorectal System (Proctology)",
    "Diagnostic Standard": "Direct Visual Perianal Inspection (Posterior Midline Linear Tear)",
    "Clinical Character": "Painful linear mucosal ulceration of the distal anal canal driven by sphincter hypertonicity and ischemia"
  },
  aiReadiness: {
    retrievalSummary: "Anal Fissure is a painful tear in the lining of the lower anal canal caused by hard stools and sphincter spasm, presenting with sharp pain during and after defecation and bright blood streaks, managed with supportive care, fiber, sitz baths, and proctologic care.",
    clinicalSummary: "Anal Fissure pathophysiology involves anoderm tearing, internal anal sphincter hypertonicity, and posterior midline microvascular ischemia. Homeopathic remedies serve as supportive proctological care and do not replace sitz baths, topical diltiazem, or emergency surgical drainage for acute perianal abscess or necrotizing fasciitis.",
    patientSummary: "An anal fissure is a small, sharp cut in the skin of the anus that causes burning, glass-like pain when passing stool that can linger for hours, helped by drinking water, eating high-fiber foods, and warm water sitz baths.",
    studentSummary: "Occurs predominantly in the posterior midline (>90%). Driven by internal anal sphincter hypertonicity and microvascular ischemia. Chronic triad: deep fissure, sentinel pile, hypertrophied anal papilla. Red flags: perianal abscess and atypical lateral ulcers (Crohn's/malignancy).",
    keywords: ["anal fissure", "fissure in ano", "rectal tearing pain", "painful bowel movement", "sentinel pile", "blood on toilet paper", "sphincter spasm"],
    semanticKeywords: ["anoderm mucosal tear", "internal anal sphincter hypertonicity", "proctological fissure ulcer"],
    icd: "K60.2",
    mesh: "D005400",
    bodySystem: "Colorectal & Proctology",
    urgency: "routine"
  }
};
