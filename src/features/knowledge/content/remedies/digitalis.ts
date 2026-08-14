import { KnowledgeEntity } from "../../types";

export const DigitalisRemedy: KnowledgeEntity = {
  id: "R0038",
  slug: "digitalis",
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
    en: "Digitalis Purpurea (Foxglove)",
    hi: "डिजिटैलिस परप्यूरिया (Foxglove)",
    gu: "ડિજિટેલિસ પરપ્યુરિયા (Digitalis Purpurea)",
    mr: "डिजिटॅलिस परप्युरिया (Digitalis)",
    es: "Digitalis Purpurea (Dedalera)",
    ar: "ديجيتاليس بوربوريا (قفاز الثعلب)"
  },
  summary: {
    en: "An authoritative clinical and educational materia medica profile of Digitalis Purpurea (Foxglove), covering marked bradycardia indications, irregular intermittent pulse, the classic sensation as if the heart would cease beating if moving, cardiac dropsy (edema), constitutional indications, and emergency red flags for acute decompensated heart failure, cardiogenic shock, complete atrioventricular block, and digoxin toxicity.",
    hi: "डिजिटैलिस परप्यूरिया (फॉक्सग्लोव) का शास्त्रीय होम्योपैथिक मटेरिया मेडिका विवरण, जिसमें अत्यधिक धीमी नाड़ी (Bradycardia / Pulse <50 bpm), दिल की अनियमित धड़कन, हिलने-डुलने पर दिल रुक जाने का गंभीर अहसास, कार्डियक एडिमा (सूजन), और एक्यूट हार्ट फेलियर (Heart Failure) व डिगॉक्सिन टॉक्सिसिटी की आपातकालीन सुरक्षा सीमाएं शामिल हैं.",
    gu: "ડિજિટેલિસ પરપ્યુરિયા (ફોક્સગ્લોવ) નું મટેરિયા મેડિકા વિવરણ, નાડીના ધબકારા ખૂબ ધીમા પડી જવા (બ્રેડીકાર્ડિયા), હૃદયના ધબકારા અનિયમિત થવા, હલનચલન કરવાથી હૃદય બંધ પડી જશે તેવો ભય, પગમાં સોજા, અને હાર્ટ એટેક તથા હાર્ટ બ્લોકની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "डिजिटॅलिस परप्युरिया (Digitalis Purpurea) चे सविस्तर विवरण, नाडीचे ठोके मंदावणे (Bradycardia), हालचाल केल्यास हृदय बंद पडेल अशी भीती, पायांवर सूज, पारंपरिक होमिओपॅथिक पद्धत आणि एक्यूट हार्ट फेल्युअर व हृदयविकाराच्या झटक्याच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de Digitalis Purpurea que cubre bradicardia marcada, pulso irregular e intermitente, sensación de que el corazón se detendrá al menor movimiento, edema cardíaco y banderas rojas de insuficiencia cardíaca aguda y bloqueo AV.",
    ar: "دليل موثوق لدواء ديجيتاليس بوربوريا يغطي بطء القلب الشديد والنبض المتقطع والشعور بتوقف القلب عند الحركة والوذمة القلبية والرعاية الداعمة وعلامات الخطر للقصور القلبي الحاد والحصار الأذيني البطيني."
  },
  content: {
    overview:
      "Digitalis Purpurea (Purple Foxglove, belonging to the Plantaginaceae / Scrophulariaceae family; historically introduced into modern medicine by William Withering in 1785) is a renowned classical homeopathic cardiac polychrest and constitutional remedy. Prepared from the fresh leaves harvested just before the plant blossoms in its second year of growth, its classical toxicological and pharmacological action centers upon powerful cardiac glycosides (digitoxin, gitoxin, gitalin). In toxicology and pharmacology, cardiac glycosides inhibit the myocardial sarcolemmal Na+/K+ ATPase pump, increasing intracellular calcium to enhance inotropic contractility while slowing atrioventricular (AV) nodal conduction and sinus rate. In classical homeopathic provings, Digitalis produces a profound disturbance of cardiac rhythm, characterized by marked sinus bradycardia, intermittent weak pulses, a sensation of suffocating cardiac anxiety, and the pathognomonic symptom where the patient feels as if the heart would stop beating if they made the slightest movement.",
    definition:
      "A classical homeopathic medicine prepared from Foxglove (Digitalis purpurea), historically indicated for severe bradycardia, irregular intermittent cardiac action, and dropsical effusions with extreme weakness.",
    causes: [
      "Historical source: Digitalis purpurea (Purple Foxglove, Plantaginaceae family), native to Western and Southwestern Europe, rich in steroidal cardiac glycosides",
      "Pharmacological mechanism: reversible inhibition of the active sodium-potassium ATPase enzyme pump in cardiac myocytes, altering sodium-calcium exchange and augmenting intracellular free calcium",
      "Electrophysiological provings action: enhanced vagal parasympathetic tone slowing the sinoatrial (SA) node and depressing atrioventricular (AV) nodal conduction velocity, precipitating severe bradyarrhythmias and ectopic ventricular complexes",
      "Hepatorenal and circulatory congestion: reduced cardiac forward output leading to passive hepatic congestion, portal hypertension, oliguria, and generalized systemic anasarca / peripheral edema"
    ],
    riskFactors: [
      "Underlying structural heart disease (ischemic cardiomyopathy, dilated cardiomyopathy, valvular heart disease)",
      "Coexisting electrolyte abnormalities (hypokalemia, hypomagnesemia, hypercalcemia; severely potentiates cardiac glycoside sensitivity)",
      "Advanced age with renal impairment reducing drug clearance",
      "Accidental ingestion of wild foxglove plants or unmonitored herbal teas (highly lethal cardiac glycoside poisoning)"
    ],
    symptoms: [
      "Severe Bradycardia with Irregular Pulse (the cardinal keynote): pulse is extraordinarily slow, weak, soft, irregular, and intermittent, frequently dropping every 3rd, 5th, or 7th beat (pulse rate <40–50 beats/min)",
      "Cardiac Anxiety & Immobility: profound, suffocating sensation as if the heart would instantly stop beating if the patient made the slightest motion, forcing them to sit in absolute, motionless silence with shallow breathing (contrasting with Gelsemium, where the patient feels the heart will stop unless they constantly keep moving)",
      "Cardiac Dropsy & Oliguria: widespread pitting edema of the ankles, legs, scrotum, and ascites, accompanied by scanty, dark, burning urine and extreme breathlessness on ascending stairs or lying supine (orthopnea)",
      "Gastrointestinal & Hepatic Congestion: faint, sinking, deathly nausea in the stomach pit not relieved by vomiting, white/chalk-like ashy stools, and hepatic enlargement with dull right hypochondriac aching (passive congestive hepatomegaly)",
      "Ocular Xanthopsia: objects appear yellow, green, or surrounded by bright halos (classic digitalis visual disturbance)",
      "Profound Prostration & Cold Sweat: cold extremities, pale/cyanotic lips and tongue, and cold sweat on forehead with faintness upon sitting up"
    ],
    diagnosis:
      "Homeopathic diagnosis is based on repertorization of the characteristic totality: profound sinus bradycardia, intermittent pulse, fear that heart will stop if moving, faint sinking nausea in stomach, and cardiac edema. In conventional clinical medicine, any patient presenting with severe bradycardia, irregular pulse, syncope, or edema mandates urgent 12-lead Electrocardiogram (ECG; evaluating for complete 3rd-degree AV block, junctional escape rhythm, atrial fibrillation with slow ventricular response, ST-segment 'sagging' scooped depression, or life-threatening ventricular tachyarrhythmias), Serum Electrolytes (potassium, magnesium), Serum Digoxin Level (if taking pharmaceuticals; therapeutic 0.5–0.9 ng/mL, toxic >2.0 ng/mL), Serum Troponin, NT-proBNP, and Echocardiogram (evaluating left ventricular ejection fraction [LVEF]).",
    differentialDiagnosis:
      "Differentiate Digitalis from Gelsemium Sempervirens (feels heart will stop unless constantly moving and walking; slow pulse, but lacks edema and ashy stools), Crataegus Oxyacantha (mild tonic for failing heart with dyspnea on exertion, but lacks Digitalis's extreme bradycardia and deathly nausea), Spigelia Anthelmia (violent, visible, audible cardiac palpitations with sharp stitching chest pains), Cactus Grandiflorus (sensation of an iron band constricting the heart as if in a vice), and Strophanthus Hispidus (cardiac edema with rapid, weak, irregular pulse rather than severe bradycardia).",
    conventionalManagement:
      "Homeopathic Digitalis is administered in micro-diluted potentized preparations (6C, 30C, 200C) as supportive constitutional care. Conventional medical therapy remains vital and mandatory: (1) Acute symptomatic bradycardia (<40 bpm) with hypotension or syncope requires emergency IV Atropine (0.5–1 mg), temporary transcutaneous/transvenous pacing, and permanent pacemaker implantation for complete heart block. (2) Decompensated heart failure requires loop diuretics (furosemide), guideline-directed medical therapy (ACEi/ARNI, beta-blockers, SGLT2 inhibitors, MRAs), and ICU hemodynamic monitoring. (3) Pharmaceutical Digoxin Toxicity requires immediate discontinuation, IV potassium/magnesium correction, and administration of Digoxin-Specific Antibody Fragments (DigiFab).",
    homeopathicApproach:
      "Digitalis serves as a supportive constitutional remedy to ease nervous cardiac anxiety, soothe digestive sinking sensations, and support vitality alongside formal cardiological care, guideline-directed heart failure medications, and ECG monitoring.",
    lifestyleAdvice:
      "Adhere strictly to a low-sodium diet (<2,000 mg/day sodium) to reduce fluid retention and circulatory volume strain, monitor and log daily morning weight (report sudden weight gains >2–3 lbs in 24 hours to your cardiologist), strictly avoid strenuous physical exertion or lifting heavy weights, take prescribed cardiac medications at consistent times daily, and never self-administer raw foxglove herbal preparations.",
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
        question: "How does homeopathic Digitalis differ from the prescription heart drug Digoxin?",
        answer: "Prescription Digoxin is a concentrated, potent pharmaceutical cardiac glycoside requiring strict blood-level monitoring. Homeopathic Digitalis is prepared through standardized serial dilution and succussion (potentization), meaning it contains only ultra-dilute micro-doses used as supportive care for constitutional symptoms."
      },
      {
        question: "Can homeopathic Digitalis replace my heart failure medications or pacemaker?",
        answer: "No, absolutely not. Severe heart rhythm disorders, heart failure, and heart blocks are life-threatening conditions that require modern cardiology treatment, prescription medications, and potentially pacemaker implantation. Homeopathic remedies must never replace standard cardiology care."
      }
    ],
    redFlags: [
      "Acute Cardiogenic Shock / Complete AV Block: severe bradycardia (HR <35–40 bpm), dizziness, unresponsiveness, syncope (Stokes-Adams attacks), severe hypotension, and pale clammy skin (life-threatening cardiac emergency requiring immediate 911 dispatch, IV atropine, and emergency electrical pacing)",
      "Acute Cardiogenic Pulmonary Edema: sudden severe shortness of breath, inability to lie flat (orthopnea), pink frothy sputum, loud bubbling lung crackles, and hypoxia (SpO2 <88%; requires emergent hospital admission, IV loop diuretics, and non-invasive positive pressure ventilation)",
      "Pharmaceutical Digoxin Toxicity: nausea, vomiting, yellow-green visual halos (xanthopsia), severe confusion, and complex ventricular arrhythmias (requires immediate emergency hospital admission and Digoxin-specific Fab antibodies)",
      "Ingestion of Wild Foxglove Plant: accidental poisoning causing severe nausea, heart-stopping arrhythmias, and death (requires immediate emergency medical decontamination)"
    ]
  },
  claimCitations: [
    { claimId: "R0038-TRADITIONAL-PROFILE", statement: "Homeopathic Digitalis purpurea profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0038-TRADITIONAL-PROFILE" },
    { claimId: "R0038-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for cardiogenic shock pacing, acute pulmonary edema diuresis, or digoxin toxicity antibody rescue.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0038-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0038-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for cardiogenic shock, complete AV block, or acute heart failure.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Severe slow heart rate with fainting and low blood pressure indicating complete heart block requiring emergency pacing",
    "Pink frothy sputum with extreme breathlessness indicating cardiogenic pulmonary edema requiring emergency hospital care",
    "Yellow visual halos with nausea in a patient taking digoxin indicating acute cardiac glycoside toxicity"
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
  tags: ["Digitalis Purpurea", "Foxglove", "Bradycardia", "Heart Rhythm", "Cardiac Edema", "Remedy", "Materia Medica", "Cardiology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/digitalis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive cardiac glycoside Na+/K+ ATPase, bradycardia, and immobility clinical boundaries, complete AV block/pulmonary edema red flags, and verified citations"],
  clinicalPearl: "Digitalis features a slow, intermittent pulse and the sensation that the heart will stop if moving, whereas Gelsemium feels the heart will stop unless continuously moving.",
  quickFacts: {
    "Source Material": "Fresh leaves of Digitalis purpurea (Purple Foxglove, Plantaginaceae)",
    "Key Keynote": "Slow, intermittent pulse with sensation heart will cease beating if moving",
    "Cardinal Field": "Cardiac conduction, bradyarrhythmias, and congestive dropsy",
    "Safety Class": "Prescription homeopathic dilution; raw plant material is a lethal cardiac glycoside"
  },
  aiReadiness: {
    retrievalSummary: "Digitalis Purpurea is a homeopathic remedy for very slow, irregular heart rate, fear that heart will stop if moving, and swelling, used as supportive constitutional care.",
    clinicalSummary: "Digitalis Purpurea materia medica focuses on sinus bradycardia, intermittent pulse, cardiac anxiety with fear of motion, and congestive dropsy. Homeopathic dilutions serve as supportive constitutional care and do not replace cardiological interventions, emergency pacing for complete heart block, or standard heart failure medications.",
    patientSummary: "Digitalis is a traditional homeopathic remedy prepared from the foxglove plant, used for slow or uneven pulse, feeling anxious about heartbeats, and fluid retention in the legs.",
    studentSummary: "Classical cardiac remedy characterized by marked sinus bradycardia, intermittent weak pulse (drops every 3rd/5th beat), and sensation that heart will stop if moving. Contains cardiac glycosides (Na+/K+ ATPase inhibitors). Red flags: complete AV block (emergency pacing), cardiogenic pulmonary edema, and digoxin toxicity.",
    keywords: ["digitalis purpurea", "foxglove", "slow pulse bradycardia", "heart stops if moving", "irregular intermittent pulse", "cardiac dropsy edema", "yellow vision halos"],
    semanticKeywords: ["sinus bradycardia intermittent pulse", "cardiac glycoside pharmacodynamics", "congestive cardiac dropsy"],
    icd: "T46.0X1A",
    mesh: "D004071",
    bodySystem: "Cardiovascular Medicine",
    urgency: "urgent"
  }
};
