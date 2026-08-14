import { KnowledgeEntity } from "../../types";

export const LaryngitisDisease: KnowledgeEntity = {
  id: "D0061",
  slug: "laryngitis",
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
    en: "Acute & Chronic Laryngitis (Vocal Cord Inflammation, Dysphonia & Hoarseness)",
    hi: "लैरिंजाइटिस / स्वरयंत्र की सूजन व आवाज बैठना (Acute & Chronic Laryngitis)",
    gu: "લેરીન્જાઇટિસ / સ્વરપેટીનો સોજો અને અવાજ બેસી જવો (Laryngitis)",
    mr: "लॅरिंजायटिस / स्वरयंत्राची सूज व आवाज बसणे (Laryngitis / Hoarseness)",
    es: "Laringitis Aguda y Crónica (Inflamación de Cuerdas Vocales y Disfonía)",
    ar: "التهاب الحنجرة وبحة الصوت (Laryngitis)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Acute and Chronic Laryngitis, covering vocal fold mucosal edema, phonotraumatic vibratory stress, viral upper respiratory infections, Laryngopharyngeal Reflux (LPR / silent reflux), constitutional homeopathic supportive management, and emergency red flags for life-threatening acute epiglottitis, laryngeal stridor / airway obstruction, and laryngeal squamous cell carcinoma.",
    hi: "लैरिंजाइटिस (स्वरयंत्र व वोकल कॉर्ड्स की सूजन) का वायरल व फोनोट्रॉमा पैथोलॉजी, आवाज बैठना (Hoarseness / Dysphonia), गले में सूखापन व खांसी, रिफ्लक्स, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और एक्यूट एपिग्लॉट्टाइटिस (Epiglottitis) व वोकल कॉर्ड कैंसर की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "લેરીન્જાઇટિસ (અવાજ બેસી જવો) ની પેથોલોજી, વાયરલ ઇન્ફેક્શન, મોટેથી બોલવાથી થતો સોજો, એસિડ રિફ્લક્સ, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને શ્વાસનળીમાં સોજો (એપિગ્લોટાઇટિસ) તથા ગળાના કેન્સરની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "लॅरिंजायटिस (Laryngitis), घसा बसणे, बोलताना होणारा त्रास, स्वरयंत्राची सूज, पारंपरिक होमिओपॅथिक पद्धत आणि श्वास अडकणे (Epiglottitis) व घशाच्या कर्करोगाच्या (Laryngeal Cancer) आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la laringitis aguda y crónica que cubre el edema de cuerdas vocales, fonotrauma, reflujo laringofaríngeo, manejo homeopático complementario y banderas rojas de epiglotitis aguda y carcinoma laríngeo.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب الحنجرة يغطي وذمة الحبال الصوتية والصدمة الصوتية والقلس الحنجري البلعومي والرعاية التكميلية وعلامات الخطر لالتهاب لسان المزمار الحاد والصرير وسرطان الحنجرة."
  },
  content: {
    overview:
      "Laryngitis is an inflammatory disorder involving the mucosal lining and underlying lamina propria of the larynx and vocal folds (true vocal cords). Subdivided by clinical duration into Acute Laryngitis (<3 weeks; most commonly a self-limiting viral infection or acute phonotrauma) and Chronic Laryngitis (>3 weeks; driven by chronic noxious exposures, laryngopharyngeal reflux, or persistent vocal misuse), it is characteristically defined by Dysphonia (alteration in vocal pitch, volume, or quality, presenting as a raspy, husky, breathy, strained hoarseness or complete vocal loss [aphonia]), localized laryngeal soreness, dry tickling throat clearing, and a dry hacking spasmodic cough. Because prolonged hoarseness can represent an early presentation of premalignant vocal dysplasia or invasive laryngeal malignancy, any unexplained dysphonia persisting longer than 3 weeks mandates direct visualization of the vocal cords via flexible laryngoscopy.",
    definition:
      "An acute or chronic inflammation of the laryngeal mucosa and vocal fold epithelium, resulting in hoarseness, reduced vocal loudness, throat irritation, and vocal fatigue.",
    causes: [
      "Acute Viral Respiratory Infection: infection by common respiratory viruses (Rhinovirus, Adenovirus, Influenza, Parainfluenza, Coronavirus) producing acute vascular congestion and mucosal edema of the vocal folds",
      "Acute or Chronic Phonotrauma / Vocal Overuse: excessive shouting, singing, prolonged screaming, or incorrect vocal projection causing mechanical shear stress, localized microvascular hemorrhage, and vocal fold edema (nodules/polyps)",
      "Laryngopharyngeal Reflux (LPR / Silent Reflux): retrograde flow of gastric acid and digestive pepsin enzyme reaching the posterior laryngeal mucosa, triggering chemical inflammation, interarytenoid erythema, and pachydermia laryngis",
      "Chronic Environmental and Chemical Inhalants: active cigarette smoking, secondhand tobacco smoke, cannabis, vaping, occupational chemical fumes, and airborne industrial dusts",
      "Pharmacological triggers: Inhaled Corticosteroids (ICS; e.g., fluticasone, budesonide for asthma; causes localized steroid-induced laryngeal myopathy or secondary laryngeal candidiasis)",
      "Bacterial and Fungal infections: Moraxella catarrhalis, Streptococcus pneumoniae, Haemophilus influenzae, Bordetella pertussis, or Candida albicans (in immunocompromised or steroid inhaler users)"
    ],
    riskFactors: [
      "Professional voice users (teachers, public speakers, singers, trial lawyers, drill instructors, telephone operators)",
      "Active tobacco smoking or heavy chronic alcohol consumption",
      "Underlying Gastroesophageal Reflux Disease (GERD) or chronic rhinosinusitis with post-nasal drip",
      "Frequent or improper use of metered-dose inhaled corticosteroids without a spacer or post-inhalation mouth rinsing",
      "Coexisting upper respiratory tract infections and environmental dry climate"
    ],
    symptoms: [
      "Dysphonia / Hoarseness: rough, raspy, strained, breathy, or low-pitched voice quality, or complete loss of voice (aphonia)",
      "Vocal fatigue: voice weakens or breaks after short periods of speaking",
      "Dry, scratchy, tickling throat discomfort prompting an irresistible, constant urge to clear the throat",
      "Dry, barking, hacking cough, often worsening at night or during speech attempts",
      "Mild odynophagia (painful swallowing) or a constant foreign-body 'globus' sensation in the throat",
      "Absence of inspiratory stridor, drooling, or dyspnea in uncomplicated viral laryngitis"
    ],
    diagnosis:
      "Diagnosed clinically through history and acoustic vocal evaluation in acute viral cases. In chronic cases (>3 weeks) or in patients with red flag features, the definitive gold standard diagnostic test is Flexible Fiberoptic Video-Laryngostroboscopy (performed by an Otolaryngologist / ENT: provides high-definition, slow-motion visualization of the vocal fold mucosal wave, vibratory amplitude, symmetry, closure patterns, and rules out vocal cord nodules, polyps, cysts, contact ulcers, granulomas, vocal cord leukoplakia, papillomatosis, vocal cord paralysis, and invasive laryngeal squamous cell carcinoma).",
    differentialDiagnosis:
      "Differentiate Laryngitis from Acute Epiglottitis (life-threatening emergency: high fever, tripod posture, severe sore throat, drooling, inspiratory stridor, 'thumb sign' on lateral neck radiograph), Laryngeal Squamous Cell Carcinoma (persistent progressive hoarseness >3 weeks in a smoker/drinker with neck mass or otalgia), Vocal Cord Nodules / Polyps ('singer's nodes'), Vocal Cord Paralysis (unilateral recurrent laryngeal nerve palsy following thyroid surgery or thoracic malignancy), Spasmodic Dysphonia (laryngeal dystonia), and Croup (Laryngotracheobronchitis; pediatric barking seal-like cough and subglottic 'steeple sign').",
    conventionalManagement:
      "A comprehensive evidence-based vocal hygiene and medical protocol: (1) Mandatory Complete Vocal Rest: absolute avoidance of speaking, singing, and especially whispering (whispering exerts significantly higher mechanical friction and strain on the vocal fold adductor muscles than normal relaxed speaking). (2) Optimal Hydration and Humidification: drinking 2 to 3 liters of water daily and inhaling warm unmedicated steam or using cool mist room humidifiers. (3) Elimination of Aggravating Factors: treating underlying LPR with dietary antireflux precautions and Proton Pump Inhibitors (PPIs) / H2 blockers for 8–12 weeks; using a spacer device and rinsing the mouth thoroughly after inhaled steroid use; smoking cessation. (4) Antibiotics are strictly contraindicated in acute viral laryngitis (provide zero benefit and risk adverse drug events). (5) Short-term oral corticosteroids (dexamethasone / prednisone) are reserved strictly for professional performers needing urgent short-term recovery or severe inflammatory laryngeal edema.",
    homeopathicApproach:
      "Homeopathic constitutional and vocal-fatigue remedies (such as Argentum Metallicum, Causticum, Phosphorus, Spongia Tosta, Drosera Rotundifolia, Belladonna, Arum Triphyllum, Ferrum Phosphoricum, Lachesis Muta, Hepar Sulphuris Calcareum) serve as supportive care to ease laryngeal dryness, soothe hoarseness, and assist mucosal recovery alongside strict vocal rest, steam inhalation, and ENT evaluation.",
    lifestyleAdvice:
      "Practice strict vocal rest (avoid speaking, shouting, and NEVER whisper; use pen and paper or smartphone messaging to communicate during acute flares), inhale warm plain steam for 10 minutes twice daily, drink plenty of room-temperature water throughout the day, avoid throat clearing (instead, take a sip of water or perform a silent hard swallow), avoid caffeine, mints, and alcohol which dry the vocal cords, elevate the head of your bed if acid reflux is present, and never smoke.",
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
        question: "Why is whispering worse for a lost voice than speaking quietly?",
        answer: "When you whisper, you tightly squeeze the vocal cords together in an unnatural, tense posture, forcing air through a narrow gap. This creates extreme mechanical friction and muscular strain, irritating inflamed vocal cords far more than gentle, normal speech."
      },
      {
        question: "When does hoarseness become a warning sign of something serious?",
        answer: "Any hoarseness or voice change that lasts for more than 3 consecutive weeks—especially in anyone with a history of smoking or alcohol use—must be examined by an Ear, Nose, and Throat (ENT) doctor with a camera (laryngoscopy) to rule out vocal polyps, nerve damage, or laryngeal cancer."
      }
    ],
    redFlags: [
      "Acute Epiglottitis / Supraglottitis: rapid onset of high fever, severe sore throat, difficulty swallowing, drooling, 'hot potato' muffled voice, and inspiratory stridor with the patient sitting upright and leaning forward in a 'tripod position' (life-threatening airway emergency requiring immediate 911 emergency dispatch, emergency airway equipment, and avoiding any invasive oral tongue-blade examination)",
      "Laryngeal Stridor and Impending Airway Obstruction: high-pitched musical sound on breathing in, intercostal/suprasternal retractions, and acute cyanosis (immediate emergency intubation/tracheostomy)",
      "Persistent Unexplained Hoarseness >3 Weeks: mandatory flexible laryngoscopy to rule out Laryngeal Squamous Cell Carcinoma, vocal cord leukoplakia, or thoracic tumor compressing the recurrent laryngeal nerve",
      "Hoarseness accompanied by Hemoptysis (coughing up blood), dysphagia, or a hard, painless palpable neck mass (cervical lymphadenopathy)"
    ]
  },
  claimCitations: [
    { claimId: "D0061-TRADITIONAL-PROFILE", statement: "Homeopathic laryngitis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0061-TRADITIONAL-PROFILE" },
    { claimId: "D0061-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for acute epiglottitis airway resuscitation, laryngeal carcinoma excision, or flexible video-laryngoscopy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0061-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0061-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute epiglottitis, laryngeal stridor, or laryngeal malignancy.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "High fever with drooling, tripod posture, and stridor indicating acute epiglottitis requiring emergency airway management",
    "Persistent hoarseness lasting >3 weeks in a smoker indicating possible laryngeal carcinoma requiring urgent flexible laryngoscopy",
    "Hoarseness accompanied by coughing up blood or a hard fixed neck lump requiring oncology evaluation"
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
  tags: ["Laryngitis", "Hoarseness", "Dysphonia", "Vocal Cord Inflammation", "Disease", "Vocal Rest", "Epiglottitis", "Otolaryngology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/laryngitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive vocal fold mucosal clinical boundaries, epiglottitis/laryngeal cancer red flags, and verified citations"],
  clinicalPearl: "Whispering causes greater adductor muscle strain and vocal fold friction than quiet speech; absolute vocal silence is mandatory during acute laryngitis.",
  quickFacts: {
    "Clinical Threshold": "Hoarseness lasting >3 weeks mandates flexible laryngoscopy to rule out malignancy",
    "Primary System": "Respiratory & Phonatory System (Otolaryngology / Laryngology)",
    "Diagnostic Standard": "Clinical Acoustic Exam & Flexible Fiberoptic Laryngostroboscopy (>3 weeks)",
    "Clinical Character": "Inflammatory dysphonia and hoarseness involving vocal fold mucosal edema and vibratory strain"
  },
  aiReadiness: {
    retrievalSummary: "Laryngitis is inflammation of the vocal cords causing hoarseness, throat tickling, and loss of voice, managed with supportive care, strict vocal rest, steam inhalation, and ENT evaluation for chronic cases.",
    clinicalSummary: "Laryngitis pathophysiology involves vocal fold mucosal edema, vibratory phonotrauma, or LPR acid irritation. Homeopathic remedies serve as supportive phonatory care and do not replace complete vocal rest, hydration, or emergency airway management for acute epiglottitis or laryngoscopy for hoarseness >3 weeks.",
    patientSummary: "Laryngitis is swelling of your vocal cords that makes your voice sound hoarse, raspy, or disappear completely, cured by resting your voice (do not whisper!), drinking water, and breathing warm steam.",
    studentSummary: "Vocal fold mucosal edema presenting as dysphonia. Causes: viral URTI, vocal overuse, LPR (reflux). Whispering increases vocal strain. The 3-week rule: hoarseness >3 weeks mandates flexible laryngoscopy to exclude laryngeal cancer. Red flags: acute epiglottitis (stridor, tripod posture, drooling).",
    keywords: ["laryngitis", "hoarseness", "lost voice aphonia", "vocal cord swelling", "raspy voice", "laryngopharyngeal reflux", "throat tickle cough"],
    semanticKeywords: ["vocal fold mucosal edema", "laryngeal phonotrauma", "dysphonia laryngostroboscopy"],
    icd: "J04.0",
    mesh: "D007827",
    bodySystem: "Otolaryngology & Respiratory Medicine",
    urgency: "routine"
  }
};
