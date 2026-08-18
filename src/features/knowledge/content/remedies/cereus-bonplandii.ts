import { KnowledgeEntity } from "../../types";

export const CereusBonplandiiRemedy: KnowledgeEntity = {
  id: "R0141",
  slug: "cereus-bonplandii",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-18T14:00:00Z",
    reviewed: "2026-08-18T14:00:00Z"
  },
  title: {
    en: "Cereus Bonplandii (Bonpland's Night-Blooming Cactus)",
    hi: "सेरियस बॉनप्लांडी (Cereus Bonplandii / बॉनप्लांड कैक्टस)",
    gu: "સીરિયસ બોનપ્લાન્ડી (Cereus Bonplandii / બોનપ્લાન્ડ કેક્ટસ)",
    mr: "सिरिअस बॉनप्लँडी (Cereus Bonplandii / Bonpland's Cactus)",
    es: "Cereus Bonplandii (Cactus de Noche de Bonpland / Cereus)",
    ar: "سيريوس بونبلاندي (صبار بونبلاند المزهر ليلاً)"
  },
  summary: {
    en: "An authoritative clinical and educational materia medica profile of Cereus Bonplandii (Bonpland's Night-Blooming Cactus), covering functional and organic cardiac neuroses and congestive thoracic disorders characterized by pathognomonic violent, agonizing constriction as if an iron band or vice were clamped tightly around the heart or chest wall, violent cardiac palpitations with profound left arm numbness and heavy paresthesias, sensation as if the heart were suspended by a thread or suddenly expanded to bursting, chronic hypertrophy and valvular irritability aggravated by lying on the left side, constitutional indications, and emergency red flags for acute coronary syndrome (STEMI/NSTEMI with crushing substernal chest pressure radiating to the jaw/left arm), acute life-threatening ventricular arrhythmias (ventricular tachycardia / fibrillation), acute cardiogenic pulmonary edema, and complete atrioventricular heart block with syncope.",
    hi: "सेरियस बॉनप्लांडी (बॉनप्लांड कैक्टस) का शास्त्रीय होम्योपैथिक मटेरिया मेडिका विवरण, जिसमें दिल की नसों की बेचैनी व जकड़न (Cardiac Neurosis - दिल व सीने पर लोहे की पट्टी या शिकंजा कसे होने का अहसास), दिल की तेज धड़कन (Palpitations) के साथ बाएं हाथ का सुन्न पड़ना (Left Arm Numbness), दिल के अचानक फटने या धागे से लटके होने का अहसास, बाईं करवट लेटने पर तकलीफ बढ़ना, और दिल का दौरा (Acute Myocardial Infarction / STEMI), जानलेवा धड़कन की अनियमितता (Ventricular Arrhythmias) व कार्डियोजेनिक शॉक की आपातकालीन सुरक्षा सीमाएं शामिल हैं.",
    gu: "સીરિયસ બોનપ્લાન્ડી (બોનપ્લાન્ડ કેક્ટસ) નું મટેરિયા મેડિકા વિવરણ, હૃદયની નર્વસ ઉત્તેજના અને જકડન (કાર્ડિયાક ન્યુરોસિસ - હૃદય કે છાતી પર લોખંડનો પટ્ટો ચુસ્ત રીતે બાંધ્યો હોય તેવી ભયંકર ભીંસ), હૃદયના ધબકારા ઝડપી થવા સાથે ડાબા હાથમાં ખાલી ચડી જવી અને સુન્ન થઈ જવું (લેફ્ટ આર્મ નમ્બનેસ), ડાબી બાજુ સૂવાથી તકલીફ વધવી, અને હાર્ટ એટેક (એક્યુટ કોરોનરી સિન્ડ્રોમ / STEMI) તથા ગંભીર એરિથમિયાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "सिरिअस बॉनप्लँडी (Cereus Bonplandii / Bonpland's Cactus) चे सविस्तर विवरण, हृदयाचा नर्व्हस आजार व छातीतील जकडण (Cardiac Neurosis - हृदयाभोवती लोखंडी पट्टी घट्ट आवळल्यासारखी भावना), हृदयाच्या प्रचंड धडधडीसोबत डावा हात बधीर होणे (Left Arm Numbness), डाव्या कुशीवर झोपल्यास त्रास वाढणे, पारंपरिक होमिओपॅथिक पद्धत आणि हृदयविकाराचा तीव्र झटका (Heart Attack / STEMI) व धोकादायक अ‍ॅरिथमियाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de Cereus Bonplandii que cubre neurosis cardíacas y afecciones torácicas patognomónicas caracterizadas por constricción violenta como una banda de hierro alrededor del corazón, palpitaciones con entumecimiento del brazo izquierdo, sensación de que el corazón pende de un hilo, y banderas rojas de síndrome coronario agudo y arritmias ventriculares.",
    ar: "دليل موثوق لدواء سيريوس بونبلاندي يغطي العصاب القلبي الوظيفي والعضوي واضطرابات الصدر الاحتقانية المميزة بالتضيق الشديد المبرح كأن رباطاً حديدياً مشدود بقوة حول القلب أو جدار الصدر والخفقان القلبي العنيف مع خدر الذراع اليسرى والتنمل الشديد والإحساس بأن القلب معلق بخيط ويتفاقم بالاستلقاء على الجانب الأيسر وعلامات الخطر للمتلازمة الإكليلية الحادة واحتشاء العضلة القلبية والاضطرابات البطينية النظمية المهددة للحياة."
  },
  content: {
    overview:
      "Cereus Bonplandii (Peniocereus serpentinus / Selenicereus serpentinus / Cereus bonplandii, Bonpland's Night-Blooming Cactus, belonging to the Cactaceae family; introduced and systematically proven in classical homeopathic practice by Dr. John H. Fitch and Dr. Constantine Hering) is a premier cardiovascular organopathic and constitutional polychrest for nervous cardiac palpitations, hyperesthesia of the coronary-autonomic plexus, functional cardioneurosis, and thoracic congestive constriction. Prepared from the fresh stems and fragrant nocturnal flowers harvested during nocturnal blooming and potentized according to pharmacopoeial standards, its botanical phytochemistry contains distinctive cactus phenethylamine alkaloids (cactine / hordenine, tyramine derivatives) and flavonols (rutin, hyperoside) that exert targeted chronotropic, inotropic, and coronary-vasomotor regulatory actions upon the intrinsic cardiac conduction system and cardiac sympathetic afferents. In classical homeopathic provings and cardiological practice, Cereus Bonplandii is celebrated for its hallmark keynote: AGONIZING SENSATION OF CONSTRICTION AS IF A BAND OF IRON OR CLAW OF A TIGHT VICE WERE SQUEEZING THE HEART AND CHEST—accompanied by violent, tumultuous cardiac palpitations, sharp stitching precordial lancinations, profound NUMBNESS AND PARESTHESIA EXTENDING DOWN THE ENTIRE LEFT ARM to the fingertips, and a vivid sensation as if the heart were suspended by a delicate thread or suddenly expanding to burst through the rib cage, characteristically aggravated when lying on the left side.",
    definition:
      "A classical homeopathic medicine prepared from Bonpland's Night-Blooming Cactus (Cereus bonplandii), historically indicated for cardiac neurosis, sensation of an iron band clutching the heart, violent palpitations with left arm numbness, and precordial stitching pains.",
    causes: [
      "Botanical night-blooming cactus source: Fresh stems and nocturnal flowers of Cereus bonplandii (Cactaceae family), rich in phenethylamine alkaloids (cactine) and cardiac flavonoids",
      "Coronary-autonomic proving pathophysiology: acute paroxysmal hyper-excitability of intrinsic cardiac sympathetic postganglionic fibers and coronary vasospasm, producing localized myocardial ischemia, violent palpitations, and thoracic suffocative constriction",
      "Cardiac nociceptive referral proving paresthesia: convergence of cardiac visceral afferent fibers with somatic dermatomal afferents at the $T_1$–$T_4$ spinal segments, producing referred numbness, heaviness, and aching throughout the left medial arm and hand",
      "Mechanical-positional proving aggravation: direct thoracic wall contact and apex-beat displacement when rotating into the left lateral decubitus position, amplifying mechanical cardiac awareness and dyspnea"
    ],
    riskFactors: [
      "Individuals experiencing acute cardiac palpitations, extra-systoles, or 'skipped beats' driven by emotional anxiety or coffee",
      "Patients suffering from angina-like thoracic chest constriction with left arm aching without acute troponin elevation",
      "Individuals with chronic tobacco heart, athletic cardiac hypertrophy, or mild mitral valve prolapse (MVP)",
      "Patients presenting with sharp precordial stitching pains aggravated when attempting to sleep on the left side"
    ],
    symptoms: [
      "Sensation of an Iron Band Clutching the Heart (the cardinal keynote): patient feels as if the heart and whole chest were seized tightly in an iron hoop, vice, or metal band that prevents deep inspiration; chest feels squeezed and oppressed",
      "Violent Tumultuous Palpitations with Left Arm Numbness: heart thumps violently against the chest wall, shaking the bed, accompanied by marked coldness, deadness, and numbness extending down the whole left arm to the fingers",
      "Sensation as if Heart Were Suspended by a Thread: curious physical illusion as if the heart were swinging loosely suspended by a thin string, or suddenly expanding and swelling until it feels as if it will burst through the ribs",
      "Sharp Precordial Stitches & Anginoid Pains: sharp, knife-like, cutting pains darting from the heart to the left shoulder-blade, left clavicle, and down the left arm, with shortness of breath",
      "Marked Aggravation Lying on the Left Side: patient cannot lie on the left side because it instantly triggers suffocative gasping, rapid pounding palpitations, and panic",
      "Occipital-Parietal Throbbing Headache: severe throbbing ache across the crown of the head and behind the eyes, coinciding with cardiac palpitations",
      "Modality: symptoms worsen when lying on the left side, from mental emotion, exertion, and at night (9:00–11:00 PM); relieved by resting quietly on the right side, fresh open air, and gentle deep breathing"
    ],
    diagnosis:
      "Homeopathic diagnosis is established by matching the characteristic cardiovascular totality: iron band clutching sensation around the heart, violent palpitations with left arm numbness, and aggravation lying on the left side. In modern conventional medicine, any patient presenting with acute chest pain, thoracic constriction, or palpitations requires immediate, mandatory emergency cardiovascular evaluation: Immediate 12-Lead Electrocardiogram (ECG; mandatory within 10 minutes of presentation evaluating ST-Segment Elevation [STEMI], ST-Depression, T-Wave Inversion, Pathological Q-Waves, Bundle Branch Blocks, or Arrhythmias), High-Sensitivity Cardiac Troponin (hs-cTnI / hs-cTnT; serial measurements at 0, 1, and 3 hours evaluating Acute Myocardial Infarction), Transthoracic Echocardiogram (TTE; evaluating Regional Wall Motion Abnormalities [RWMA], Left Ventricular Ejection Fraction [LVEF], Valvular Regurgitation/Stenosis, and Pericardial Effusion), Continuous Cardiac Telemetry / 24-Hour Holter Monitoring (evaluating Paroxysmal Supraventricular Tachycardia, Ventricular Ectopy, and AFib), CT Coronary Angiography (CCTA) / Invasive Coronary Catheterization (evaluating Obstructive Coronary Artery Disease), Serum Electrolytes (Potassium, Magnesium), and Complete Blood Count.",
    differentialDiagnosis:
      "Differentiate Cereus Bonplandii from Cactus Grandiflorus (Cactus Grandiflorus is the primary sister polychrest with the classic 'iron band around heart' sensation, but Cactus Grandiflorus is dominated by ACTIVE CONGESTIVE HEMORRHAGES [bright red epistaxis, hematemesis, hemoptysis], severe valvular lesions, and regular 11:00 AM/PM periodicity, whereas Cereus Bonplandii is dominated by NERVOUS CARDIOPATHY, thread-suspension sensation, expansion sensation, and pronounced left arm numbness without frank hemorrhage), Spigelia Anthelmia (violent visible palpitations shaking chest wall with sharp needle stitches radiating to left arm, but Spigelia has extreme left supraorbital neuralgia that follows the sun and no iron band sensation), Digitalis Purpurea (extremely slow, weak, irregular pulse <40 bpm with deathly sinking sensation at epigastrium and blue lips), Crataegus Oxyacantha (heart tonic for chronic myocardial weakness, dyspnea on slight exertion, and hypertension without the acute claw-like band), and Latrodectus Mactans (agonizing precordial angina with pain shooting into both arms and wrist constriction with fear of instant death).",
    conventionalManagement:
      "Homeopathic Cereus Bonplandii is administered in medium to high centesimal potencies (30C, 200C, 1M) as supportive cardiovascular and neuro-cardiac care. Conventional cardiology, emergency medicine, and intensive care management is paramount, vital, and mandatory: (1) Acute ST-Elevation Myocardial Infarction (STEMI) is a code-STEMI emergency requiring immediate 911 transport to a PCI-capable center for Primary Percutaneous Coronary Intervention (PCI / Balloon Angioplasty & Stenting; door-to-balloon time <90 minutes), Dual Antiplatelet Therapy (Aspirin 325 mg + Ticagrelor 180 mg), IV Heparin, Sublingual Nitroglycerin, and High-Intensity Statin. (2) Sustained Ventricular Tachycardia / Ventricular Fibrillation requires immediate Synchronized Cardioversion or Defibrillation and IV Amiodarone. (3) Decompensated Cardiogenic Pulmonary Edema requires Non-Invasive Positive Pressure Ventilation (BiPAP/CPAP), IV Furosemide, and IV Nitroglycerin.",
    homeopathicApproach:
      "Cereus Bonplandii serves as a supportive constitutional and cardiac remedy to soothe nervous palpitations, ease muscular chest tightness, and reduce functional cardiac anxiety alongside guideline-directed cardiology care, Holter monitoring, and physician supervision.",
    lifestyleAdvice:
      "Avoid all cardiotoxic stimulants including excess caffeine, energy drinks, nicotine, and recreational stimulants that provoke autonomic tachycardia and extra-systoles, practice daily heart-rate variability (HRV) breathing exercises (inhaling for 4 seconds, exhaling for 6 seconds) to enhance vagal tone, sleep on the right side or with head slightly elevated to prevent apex-wall chest irritation, engage in regular physician-approved low-intensity aerobic walking, maintain optimal hydration and magnesium-rich dietary intake, and seek immediate emergency hospital care (call 911) if crushing substernal chest pressure, shortness of breath, or fainting occurs.",
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
        question: "What is the sensation of an 'iron band around the heart' in Cereus Bonplandii?",
        answer: "This is the signature keynote of the Cactus family. Patients experience a vivid, frightening constriction where it feels as if an iron strap, metal claw, or rigid wire were squeezed tightly around their heart and chest wall, restricting their ability to take a deep breath."
      },
      {
        question: "Why does Cereus Bonplandii cause numbness in the left arm?",
        answer: "The nerves supplying sensation to the heart share spinal cord pathways with the nerves that run down the inside of the left arm. When the cardiac nerves are irritated or hyperactive during palpitations, referred numbness and tingling radiate down the left arm to the fingers."
      }
    ],
    redFlags: [
      "Acute Coronary Syndrome (Heart Attack / STEMI): severe crushing, squeezing substernal chest pain lasting >10 minutes, radiating to the left arm, neck, or jaw, accompanied by cold sweats, nausea, and shortness of breath (life-threatening emergency requiring immediate 911 dispatch, aspirin, and emergent catheterization)",
      "Sustained Ventricular Tachycardia / Malignant Arrhythmia: sudden racing heart rate >150 bpm with dizziness, lightheadedness, chest pain, or sudden loss of consciousness (requires emergent cardioversion/defibrillation)",
      "Acute Cardiogenic Pulmonary Edema: severe sudden shortness of breath while resting, coughing pink frothy sputum, and inability to lie flat (medical emergency requiring urgent hospital ICU care)",
      "Complete Heart Block with Syncope (Stokes-Adams Attack): sudden collapse or blacking out with a severe drop in heart rate to <35 bpm"
    ]
  },
  claimCitations: [
    { claimId: "R0141-TRADITIONAL-PROFILE", statement: "Homeopathic Cereus bonplandii profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0141-TRADITIONAL-PROFILE" },
    { claimId: "R0141-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for acute coronary syndrome percutaneous coronary intervention, ventricular arrhythmia defibrillation, or cardiogenic shock ICU inotropic stabilization.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0141-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0141-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for suspected acute myocardial infarction, hemodynamically unstable arrhythmias, or cardiogenic pulmonary edema.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Crushing heavy chest pain spreading to the left arm and jaw with cold sweat requiring emergency 911 care",
    "Extremely fast fluttering heart rate with dizziness or fainting requiring emergency hospital care",
    "Sudden severe breathlessness with coughing pink frothy fluid"
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
  tags: ["Cereus Bonplandii", "Bonpland's Cactus", "Night-Blooming Cactus", "Peniocereus Serpentinus", "Cardiac Neurosis", "Iron Band Around Heart", "Palpitations", "Left Arm Numbness", "Precordial Pain", "Remedy", "Materia Medica", "Cardiology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/cereus-bonplandii",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive cardiac neurosis, iron band heart constriction, palpitations with left arm numbness, thread-suspension sensation, and precordial stitching clinical boundaries, acute coronary syndrome/arrhythmia red flags, and verified citations"],
  clinicalPearl: "Violent sensation of an iron band clutching the heart and chest, paired with tumultuous palpitations and numbness extending down the left arm, worse lying on the left side, is pathognomonic of Cereus Bonplandii.",
  quickFacts: {
    "Source Material": "Fresh stems and nocturnal flowers of Cereus bonplandii (Cactaceae)",
    "Key Keynote": "Iron band constriction around heart; palpitations with left arm numbness; worse left side",
    "Cardinal Field": "Cardiac neurosis, nervous palpitations, precordial lancinations, and coronary hyperesthesia",
    "Safety Class": "Prescription homeopathic dilution; non-toxic in potentized forms"
  },
  aiReadiness: {
    retrievalSummary: "Cereus Bonplandii is a homeopathic remedy for a feeling like an iron band is squeezing your heart and chest, racing pounding heartbeats with numbness in your left arm, and chest pain worse when lying on your left side, used as supportive care.",
    clinicalSummary: "Cereus Bonplandii materia medica focuses on cardiac neurosis and coronary hyperesthesia (pathognomonic sensation of an iron band or vice clutching the heart and chest, tumultuous palpitations with numbness/paresthesias radiating down the left arm, precordial lancinations, and sensation as if the heart were suspended by a thread), aggravated by lying on the left side. Homeopathic dilutions serve as supportive care and do not replace primary PCI/antiplatelet therapy for acute myocardial infarction, cardioversion/defibrillation for ventricular arrhythmias, or ICU resuscitation for cardiogenic shock.",
    patientSummary: "Cereus Bonplandii (Night-Blooming Cactus) is a traditional homeopathic medicine for people who feel a tight squeezing iron band around their heart, have a hard-pounding heartbeat that makes their left arm feel numb, and cannot lie on their left side.",
    studentSummary: "Premier cardioneurosis, coronary hyperesthesia, and thoracic constrictive polychrest. Keynotes: agonizing sensation of an iron band/vice squeezing the heart and chest, tumultuous palpitations with numbness/deadness extending down the left arm to fingertips, sensation of heart suspended by a thread or expanding to bursting, and precordial stitches worse lying on left side. Phenethylamine alkaloids (cactine). Red flags: acute coronary syndrome (STEMI emergency) and sustained ventricular tachycardia.",
    keywords: ["cereus bonplandii", "bonplands cactus", "night blooming cactus", "iron band around heart", "palpitations left arm numbness", "cardiac neurosis", "heart suspended by thread", "precordial pain worse left side"],
    semanticKeywords: ["coronary-autonomic sympathetic hyper-excitability", "cardiac visceral-somatic T1-T4 dermatomal paresthesia", "left lateral decubitus apex mechanical aggravation"],
    icd: "I49.9",
    mesh: "D029877",
    bodySystem: "Cardiology",
    urgency: "routine"
  }
};
