import { KnowledgeEntity } from "../../types";

export const MercuriusCorrosivusRemedy: KnowledgeEntity = {
  id: "R0101",
  slug: "mercurius-corrosivus",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Mercurius Corrosivus (Mercuric Chloride / Corrosive Sublimate)",
    hi: "मर्क्यूरियस कोरोसिवस (Corrosive Sublimate / Mercuric Chloride)",
    gu: "મર્ક્યુરિયસ કોરોસિવસ (Mercurius Corrosivus)",
    mr: "मर्क्युरियस कोरोसिव्हस (Mercurius Corrosivus)",
    es: "Mercurius Corrosivus (Sublimado Corrosivo / Cloruro Mercúrico)",
    ar: "ميركوريوس كوروسيفوس (كلوريد الزئبقيك / السليماني)"
  },
  summary: {
    en: "An authoritative clinical and educational materia medica profile of Mercurius Corrosivus (Corrosive Sublimate), covering violent destructive mucosal ulceration, unrelenting rectovesical tenesmus ('never-get-done' sensation), acute bloody dysenteric colitis, severe burning stomatitis, constitutional indications, and emergency red flags for toxic megacolon, bowel perforation peritonitis, acute renal tubular necrosis (anuria), and acute corrosive chemical intoxication.",
    hi: "मर्क्यूरियस कोरोसिवस (कोरोसिव सब्लिमेट) का शास्त्रीय होम्योपैथिक मटेरिया मेडिका विवरण, जिसमें तीव्र विनाशकारी छाले व अल्सरेशन (Destructive Ulceration), मरोड़ व असहनीय दर्द के साथ खूनी पेचिश (Bloody Dysentery), लगातार मल व पेशाब की हाजत (Never-Get-Done Tenesmus), और टॉक्सिक मेगाकोलन (Toxic Megacolon), आंत फटने व एक्यूट किडनी फेलियर की आपातकालीन सुरक्षा सीमाएं शामिल हैं.",
    gu: "મર્ક્યુરિયસ કોરોસિવસ (મર્ક્યુરિક ક્લોરાઇડ) નું મટેરિયા મેડિકા વિવરણ, મોં અને આંતરડામાં ઊંડા ચાંદા પડવા, અસહ્ય ચૂક સાથે લોહી-પરુ વાળો ઝાડો (મરડો), ઝાડો અને પેશાબ કર્યા પછી પણ હાજત બાકી રહી જવાનો અહેસાસ (ટીનેસમસ), અને આંતરડું ફાટી જવું તથા કિડની ફેલ થવાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "मर्क्युरियस कोरोसिव्हस (Mercurius Corrosivus) चे सविस्तर विवरण, तीव्र अल्सरेशन, पोटात पीळ पडून रक्तमिश्रित शौच (Dysentery), लघवी व शौचानंतर तीव्र कुंथणे (Tenesmus), पारंपरिक होमिओपॅथिक पद्धत आणि टॉक्सिक मेगाकोलन (Toxic Megacolon) व किडनी निकामी होण्याच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de Mercurius Corrosivus que cubre ulceración mucosa destructiva violenta, tenesmo rectovesical incesante ('sensación de nunca acabar'), colitis disentérica sanguinolenta, estomatitis ardiente, y banderas rojas de megacolon tóxico y necrosis tubular aguda.",
    ar: "دليل موثوق لدواء ميركوريوس كوروسيفوس يغطي التقرح المخاطي التخريبي الشديد والزحير المستمر في المستقيم والمثانة والزحار المدمى والتهاب الفم الحارق والرعاية الداعمة وعلامات الخطر لتضخم القولون السمي والنخر الأنبوبي الكلوي الحاد."
  },
  content: {
    overview:
      "Mercurius Corrosivus (Mercuric Chloride, HgCl2; historically known in alchemy and toxicology as Corrosive Sublimate, and introduced into homeopathic practice by Dr. Samuel Hahnemann) is the most violent, intense, and destructive of all mercurial preparations. Prepared through serial trituration of pure crystalline mercuric chloride according to pharmacopoeial standards, its toxicological and pharmacological action represents an acute, catastrophic chemical corrosive attack on mucous membranes, the lower gastrointestinal tract, and renal tubular epithelium. In classical provings, it exhibits the core mercurial characteristics (nightly aggravation, profuse offensive sweat that affords no relief, salivation, metallic taste) magnified to their highest degree of inflammatory fury, producing severe aphthous and gangrenous ulcerations of the mouth and throat, acute bloody dysenteric colitis with shreds of intestinal mucosa, and violent, agonizing, unrelenting tenesmus of both rectum and urinary bladder.",
    definition:
      "A classical homeopathic medicine prepared from Mercuric Chloride (Mercurius corrosivus), historically utilized for acute destructive mucosal ulcerations, severe bloody dysentery, and violent rectovesical tenesmus with burning pain.",
    causes: [
      "Chemical source: Pure Mercuric Chloride (HgCl2, inorganic divalent mercury salt), triturated with pure lactose monohydrate through standardized decimal or centesimal methods",
      "Toxicological mechanism: mercury ions (Hg2+) bind covalently to sulfhydryl (-SH) groups of cellular proteins, inactivating vital enzymes, causing widespread coagulative mucosal necrosis and severe cytotoxic destruction of renal proximal tubular epithelial cells",
      "Gastrointestinal proving pathology: intense acute diffuse inflammation of the colon and rectum (hemorrhagic proctocolitis) with mucosal sloughing, deep jagged ulcers, and severe continuous parasympathetic pelvic nerve stimulation (violent tenesmus)",
      "Urogenital and buccal erosion: severe necrotizing stomatitis, uvular edema, destructive tonsillitis, and severe vesical trigonal tenesmus with strangury"
    ],
    riskFactors: [
      "Acute infectious dysenteric colitis (Shigella dysenteriae, Entamoeba histolytica, Campylobacter jejuni, Clostridioides difficile colitis)",
      "Severe acute flares of Inflammatory Bowel Disease (Ulcerative Colitis, Crohn's proctosigmoiditis)",
      "Exposure to raw unprocessed mercuric chloride chemical salts (extremely lethal poison; requires immediate emergency hazmat and poison control decontamination)",
      "Warm, humid nights or seasonal autumn dysentery epidemics"
    ],
    symptoms: [
      "Agonizing Rectal Tenesmus ('Never-Get-Done' Sensation; the cardinal keynote): violent, agonizing, unbearable bearing-down straining and cramping in the rectum BEFORE, DURING, and AFTER every stool, so severe that the patient cannot leave the toilet seat because the painful urge never completely subsides",
      "Bloody Dysenteric Stools: frequent, scanty bowel movements consisting of pure dark blood, slimy shredded mucus, and pale scraps of necrotic intestinal lining, with burning heat like fiery coals in the anus and rectum",
      "Concurrent Vesical Tenesmus (Strangury): intense, painful, burning tenesmus of the urinary bladder occurring simultaneously with rectal tenesmus; urine passes drop by drop with excruciating burning, often mixed with blood or albumin (oliguria)",
      "Destructive Pharyngeal & Buccal Ulceration: mouth, palate, and throat are dark red, swollen, and covered with deep, burning, ragged, foul-smelling ulcers; burning pain in the esophagus making swallowing liquids almost impossible",
      "Profuse Salivation & Fetid Odor: intense metallic, coppery taste in the mouth with continuous drooling of thick, acrid, fetid saliva that excoriates the lips",
      "Nightly Aggravation & Sweat: symptoms worsen intensely at night and from cold damp weather; profuse, drenching, oily perspiration during fever that brings ZERO relief to the pain"
    ],
    diagnosis:
      "Homeopathic diagnosis is established by matching the characteristic violent totality: bloody dysentery with pure blood/mucus, severe rectal and bladder tenesmus with the 'never-get-done' sensation, and destructive burning mucosal ulceration. In modern conventional medicine, any patient presenting with severe bloody diarrhea, acute tenesmus, or mucosal ulceration requires urgent objective diagnostic testing: Stool Studies (Fecal Occult Blood, Stool Leukocytes, Stool Culture & Sensitivity for Shigella/Salmonella/Campylobacter, Clostridioides difficile PCR toxin test, and Stool Microscopy for Entamoeba histolytica trophozoites), Flexible Sigmoidoscopy (assessing mucosal ulceration, friability, and pseudomembranes), Complete Blood Count (leukocytosis, anemia), Serum Electrolytes and Renal Function (BUN/Creatinine; monitoring for Acute Kidney Injury [AKI] and dehydration), and Abdominal Plain Radiograph / CT (to immediately rule out toxic megacolon or bowel perforation).",
    differentialDiagnosis:
      "Differentiate Mercurius Corrosivus from Mercurius Solubilis (Merc Sol has classic tenesmus 'worse after stool', profuse sweat, and coated indented tongue, but Merc Cor has far greater violent destructive intensity, pure bloody stools, and concurrent bladder tenesmus), Cantharis Vesicatoria (intense burning strangury of the bladder with drop-by-drop bloody urine, but lacks the prominent mercurial salivation, metallic taste, and bloody dysentery), Nux Vomica (frequent ineffectual urge to stool with tenesmus, but tenesmus CEASES completely as soon as stool is passed, whereas in Merc Cor the tenesmus continues unabated), Arsenicum Album (burning stomach/bowel pain and dark bloody diarrhea, but accompanied by extreme physical prostration, coldness, midnight aggravation [1–2 AM], and desire for warm drinks), and Colocynthis (severe cramping abdominal pain relieved by bending double and hard pressure, but lacks bloody mucus and destructive ulcers).",
    conventionalManagement:
      "Homeopathic Mercurius Corrosivus is administered in potentized preparations (6C, 30C, 200C) as supportive care. Conventional medical therapy is vital and mandatory: (1) Severe acute infectious dysentery requires targeted antimicrobial therapy (oral ciprofloxacin, azithromycin, or metronidazole for amebiasis), aggressive IV isotonic fluid and electrolyte rehydration to prevent hypovolemic shock and acute renal failure. (2) Severe acute ulcerative colitis flares require IV systemic corticosteroids (methylprednisolone 60 mg/day), biologic rescue therapy (infliximab), and close surgical monitoring. (3) Acute heavy metal ingestion requires emergency gastric lavage, oral chelation therapy (Dimercaprol [BAL], Succimer [DMSA]), and hemodialysis for acute tubular necrosis.",
    homeopathicApproach:
      "Mercurius Corrosivus serves as a supportive constitutional and acute bowel remedy to ease agonizing rectal straining, soothe mucosal burning, and support recovery alongside oral rehydration solutions, specific antimicrobial treatment, and gastroenterological monitoring.",
    lifestyleAdvice:
      "Stay aggressively hydrated by drinking Oral Rehydration Salts (ORS) in small, frequent sips to replace lost fluid and potassium, adhere strictly to a bland, non-irritating, low-residue diet (congee, boiled rice water, clear electrolyte broths) during acute colitis flares, completely avoid dairy products, spicy foods, raw vegetables, coffee, and alcohol which inflame the bowel lining, maintain meticulous hand hygiene with soap and water after using the toilet, and never hold in bowel movements.",
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
        question: "Is homeopathic Mercurius Corrosivus safe to take given that mercuric chloride is toxic?",
        answer: "Yes, when prepared according to standard homeopathic pharmacopoeias (HPUS). Through standardized serial micro-dilution and succussion (potentization) at or above the 6C or 30C potency, the chemical concentration of mercury is diluted far below toxicological thresholds. However, raw chemical mercuric chloride is a deadly poison and must never be handled or consumed."
      },
      {
        question: "What does 'never-get-done' tenesmus mean in Mercurius Corrosivus?",
        answer: "It describes a continuous, agonizing spasm of the bowel and bladder. After passing a tiny amount of bloody mucus, the severe, painful straining does not stop or feel relieved; the patient feels as though more stool is constantly stuck inside, forcing them to remain on the toilet seat in pain."
      }
    ],
    redFlags: [
      "Toxic Megacolon / Impending Bowel Perforation: severe abdominal distension, absent bowel sounds, severe rebound tenderness, high spiking fever, tachycardia, hypotension, and transverse colon diameter >6 cm on abdominal X-ray (life-threatening surgical emergency requiring immediate emergent colectomy and broad-spectrum IV antibiotics)",
      "Severe Dehydration & Hypovolemic Shock from Dysentery: sunken eyes, dry mucous membranes, lethargy, severe hypotension, and rapid weak pulse (requires emergent IV crystalloid resuscitation)",
      "Acute Renal Tubular Necrosis (Anuria): complete cessation of urine output (<100 mL/day), rapidly rising serum creatinine, and uremic encephalopathy (requires emergency hemodialysis)",
      "Ingestion of Raw Mercuric Chloride / Chemical Hazmat Exposure (requires immediate 911 dispatch, poison control, and dimercaprol chelation)"
    ]
  },
  claimCitations: [
    { claimId: "R0101-TRADITIONAL-PROFILE", statement: "Homeopathic Mercurius corrosivus profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0101-TRADITIONAL-PROFILE" },
    { claimId: "R0101-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for toxic megacolon emergency surgery, severe dysentery IV antibiotic clearance, or acute renal failure hemodialysis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0101-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0101-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for toxic megacolon, bowel perforation peritonitis, or acute renal tubular failure.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Severe abdominal swelling with high fever and absent bowel sounds indicating toxic megacolon requiring emergency surgical evaluation",
    "Passing large volumes of pure bloody diarrhea with severe dizziness and low blood pressure indicating hypovolemic shock",
    "Total absence of urine output with rising creatinine indicating acute renal tubular failure requiring emergency hospital care"
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
  tags: ["Mercurius Corrosivus", "Corrosive Sublimate", "Bloody Dysentery", "Tenesmus", "Mucosal Ulceration", "Remedy", "Materia Medica", "Gastroenterology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/mercurius-corrosivus",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive destructive mucosal ulceration, bloody dysenteric colitis, and rectovesical tenesmus clinical boundaries, toxic megacolon/renal necrosis red flags, and verified citations"],
  clinicalPearl: "Violent, agonizing tenesmus of both rectum and bladder that continues relentlessly AFTER passing bloody slimy stool is the cardinal hallmark of Mercurius Corrosivus.",
  quickFacts: {
    "Source Material": "Pure Mercuric Chloride (HgCl2, Corrosive Sublimate, inorganic salt, triturated)",
    "Key Keynote": "Violent continuous tenesmus of bowel and bladder ('never-get-done' sensation)",
    "Cardinal Field": "Destructive mucosal ulceration, bloody dysentery, and severe rectovesical spasms",
    "Safety Class": "Prescription homeopathic dilution; raw chemical is a lethal corrosive poison"
  },
  aiReadiness: {
    retrievalSummary: "Mercurius Corrosivus is a homeopathic remedy for bloody dysentery with severe straining that never feels relieved (tenesmus), and mouth ulcers, used as supportive care.",
    clinicalSummary: "Mercurius Corrosivus materia medica focuses on violent mucosal ulceration, bloody dysenteric colitis with mucosal shreds, and concurrent rectal and vesical tenesmus (never-get-done sensation). Homeopathic dilutions serve as supportive care and do not replace IV hydration, targeted antimicrobial therapy, or emergency colectomy for toxic megacolon.",
    patientSummary: "Mercurius Corrosivus is a traditional homeopathic medicine used for severe stomach bugs with painful cramps, bloody diarrhea, and constant painful straining where the urge never stops.",
    studentSummary: "Most violent mercurial preparation. Keynotes: bloody dysentery (scanty blood + mucosal shreds), continuous agonizing rectovesical tenesmus (never-get-done sensation, straining continues after stool), destructive aphthous stomatitis, and night sweat without relief. Red flags: toxic megacolon (emergency colectomy), hypovolemic shock, and acute renal failure (anuria).",
    keywords: ["mercurius corrosivus", "corrosive sublimate", "bloody dysentery", "rectal tenesmus never get done", "bladder tenesmus strangury", "mouth ulcers salivation", "destructive colitis"],
    semanticKeywords: ["acute hemorrhagic proctocolitis", "rectovesical tenesmus spasm", "destructive mucosal necrosis"],
    icd: "A09",
    mesh: "D004128",
    bodySystem: "Gastroenterology & Urology",
    urgency: "urgent"
  }
};
