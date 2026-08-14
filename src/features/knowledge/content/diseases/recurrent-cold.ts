import { KnowledgeEntity } from "../../types";

export const RecurrentColdDisease: KnowledgeEntity = {
  id: "D0055",
  slug: "recurrent-cold",
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
    en: "Recurrent Common Cold (Frequent Viral Upper Respiratory Tract Infections)",
    hi: "बार-बार सर्दी-जुकाम होना / आवर्तक श्वसन संक्रमण (Recurrent Common Cold)",
    gu: "વારંવાર શરદી-સળેખમ થવું / વાયરલ શ્વસન ચેપ (Recurrent Cold)",
    mr: "वारंवार होणारी सर्दी-पडसे / वारंवार होणारे श्वसन संसर्ग (Recurrent Cold)",
    es: "Resfriado Común Recurrente (Infecciones Virales Frecuentes de Vías Respiratorias Altas)",
    ar: "الزكام المتكرر وإنتانات الجهاز التنفسي العلوي الفيروسية (Recurrent Cold)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Recurrent Common Cold (Frequent Viral URTIs), covering viral antigenic diversity (Rhinovirus ICAM-1 entry, Coronaviruses, Adenoviruses), respiratory mucosal epithelial barrier integrity, humoral immune maturation, constitutional homeopathic supportive management, and emergency red flags for acute bacterial pneumonia, peritonsillar abscess (quinsy), severe respiratory distress, and primary immunodeficiency disorders.",
    hi: "बार-बार होने वाले सर्दी-जुकाम (रिकरेंट कॉमन कोल्ड) का राइनोवायरस पैथोलॉजी, म्यूकोसल बैरियर इम्युनिटी, नाक बहना, छींकें व गले की खराश, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और बैक्टीरियल निमोनिया, क्विन्सी (Peritonsillar Abscess) व इम्यूनोडेफिशिएंसी की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "વારંવાર થતી શરદી-સળેખમ (વાયરલ ઇન્ફેક્શન) ની પેથોલોજી, રોગપ્રતિકારક શક્તિની નબળાઈ, નાકમાંથી પાણી વહેવું અને ગળામાં દુખાવો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને ફેફસામાં ન્યુમોનિયા તથા શ્વાસ ચડવાની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "वारंवार होणारी सर्दी-पडसे (Recurrent Common Cold), नाकातून पाणी वाहणे, शिंका व घशातील खवखव, रोगप्रतिकारशक्ती, पारंपरिक होमिओपॅथिक पद्धत आणि न्यूमोनिया व श्वसनाच्या गंभीर त्रासाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del resfriado común recurrente que cubre la diversidad antigénica viral, barrera epitelial respiratoria, manejo homeopático complementario y banderas rojas de neumonía bacteriana y absceso periamigdalino.",
    ar: "دليل سريري وتعليمي موثوق للزكام المتكرر يغطي التنوع المستضدي الفيروسي وحاجز المخاطية التنفسية والرعاية التكميلية وعلامات الخطر لذات الرئة الجرثومية والخراج حول اللوزة."
  },
  content: {
    overview:
      "The Recurrent Common Cold (Frequent Viral Upper Respiratory Tract Infection [URTI]) is the most frequent acute human illness, characterized by repeated self-limiting viral infections of the nasal cavity, pharynx, and paranasal sinuses. While healthy adults experience an average of 2 to 4 episodes annually, young children attending daycare typically experience 6 to 8 (and up to 10–12) episodes per year due to an immunologically naive state and dense social exposure. Driven by over 200 distinct viral serotypes—predominantly Human Rhinoviruses (HRV-A, B, C; binding to intercellular adhesion molecule-1 [ICAM-1] or LDL receptors on ciliated nasal epithelial cells), followed by seasonal Coronaviruses, Respiratory Syncytial Virus (RSV), Adenoviruses, Enteroviruses, and Parainfluenza viruses—each episode is characterized by acute rhinitis, sneezing, nasal congestion, pharyngitis, low-grade fever, and malaise. Because immunity is serotype-specific, antigenic diversity permits lifelong repeated reinfections.",
    definition:
      "A clinical pattern of frequent, distinct viral infections of the upper respiratory mucosa (typically >4–6 episodes/year in adults or >8–10 episodes/year in young children) characterized by acute coryza, rhinorrhea, nasal congestion, and sore throat.",
    causes: [
      "Vast Viral Antigenic Diversity: infection by >160 antigenic serotypes of Human Rhinovirus (HRV) and dozens of non-rhinoviruses providing no cross-protective permanent immunity",
      "Respiratory Epithelial Pathophysiology: viral replication within nasal epithelial cells triggers localized release of pro-inflammatory kinins, substance P, IL-1beta, IL-6, and IL-8, inducing mucosal hypervascularity, vascular leakage (rhinorrhea), and sensory nerve stimulation (sneezing and cough reflex)",
      "Anatomical and environmental host factors: hypertrophic adenoids, chronic allergic rhinitis (inducing ICAM-1 upregulation and facilitating viral docking), and gastroesophageal reflux causing micro-aspiration and mucosal barrier breakdown",
      "Immature or impaired host immune defenses: transient physiological hypogammaglobulinemia of infancy, or underlying primary/secondary humoral immunodeficiencies (Selective IgA Deficiency, Common Variable Immunodeficiency [CVID])",
      "Environmental and lifestyle stressors: exposure to active or passive secondhand tobacco smoke (paralyzes respiratory ciliary motility and damages tight junctions), cold stress, sleep deprivation, and crowded indoor daycare settings"
    ],
    riskFactors: [
      "Young age (preschool and daycare attendance; single most powerful risk factor for high-frequency viral transmission)",
      "Chronic active or passive secondhand tobacco smoke exposure (significantly multiplies URTI duration and secondary bacterial complications)",
      "Coexisting untreated Allergic Rhinitis or atopic diathesis (disrupts mucosal barrier integrity)",
      "Chronic psychological stress and sleep deprivation (<7 hours/night reduces natural killer cell cytotoxicity and doubles viral susceptibility)",
      "Poor hand hygiene and frequent touching of the T-zone (eyes, nose, mouth) after contact with viral fomites"
    ],
    symptoms: [
      "Early prodrome: scratchy, dry, tickling sore throat followed rapidly by sneezing and clear watery rhinorrhea",
      "Nasal symptoms: bilateral nasal congestion, obstruction, mouth breathing, and progressive thickening of nasal secretions (changing from clear to cloudy, white, or yellow/green over 3–5 days due to normal neutrophil myeloperoxidase enzyme activity—which does NOT indicate bacterial infection)",
      "Systemic constitutional features: mild malaise, low-grade fever (<38.3°C / 101°F; more prominent in infants/toddlers), mild headache, and myalgias",
      "Post-nasal drip and cough: throat clearing and dry to loose cough, especially when lying supine, typically peaking at days 4–5 and lingering for 10–14 days",
      "Normal resolution timeline: symptoms typically peak within 48 to 72 hours and resolve completely within 7 to 10 days (up to 14 days in smokers and toddlers)"
    ],
    diagnosis:
      "Diagnosed primarily clinically based on the acute onset of characteristic coryzal symptoms and normal physical examination of the chest, ears, and throat (anterior rhinoscopy reveals erythematous, edematous nasal turbinates with clear/mucoid discharge). Routine viral diagnostic PCR panels are unnecessary for uncomplicated colds. A formal immunological workup is warranted ONLY if warning signs of Primary Immunodeficiency (Jeffrey Modell Foundation criteria) are present: \u22658 new ear infections/year, \u22652 serious sinus infections/year, \u22652 episodes of pneumonia in a year, failure to thrive, recurrent deep abscesses, or persistent oral thrush (workup includes Complete Blood Count with differential, Quantitative Serum Immunoglobulins [IgG, IgA, IgM, IgE], and vaccine-specific antibody titers).",
    differentialDiagnosis:
      "Differentiate Recurrent Viral Cold from Allergic Rhinitis (afebrile, pale boggy nasal turbinates, clear watery rhinorrhea, prominent nasal/ocular itching, allergic shiners), Acute Bacterial Rhinosinusitis (symptoms lasting >10 days without improvement, 'double sickening' with high fever and facial pain), Streptococcal Pharyngitis (Centor criteria: exudative tonsillitis, anterior cervical adenopathy, absence of cough), Influenza (sudden abrupt high fever >39°C, severe prostrating myalgias, profound fatigue), and COVID-19 (anosmia, dysgeusia, confirmed by rapid antigen test).",
    conventionalManagement:
      "Symptomatic, supportive, and non-antibiotic evidence-based care: (1) Absolute avoidance of routine systemic antibiotics (antibiotics have zero efficacy against viral pathogens and drive antimicrobial resistance and Clostridioides difficile colitis). (2) Nasal symptom relief: isotonic or hypertonic nasal saline sprays/irrigations (clears mucus and reduces mucosal edema), short-term topical decongestants (oxymetazoline 0.05% spray; strictly limited to \u22643–5 days to prevent rhinitis medicamentosa rebound congestion), and first-generation antihistamine/decongestant combinations for adults. (3) Analgesics/Antipyretics: oral acetaminophen (paracetamol) or ibuprofen for sore throat, headache, and fever. (4) Humidification and hydration: cool mist humidifiers and adequate oral fluids. (5) Zinc lozenges (>75 mg/day elemental zinc started within 24 hours of onset reduces cold duration by ~30%).",
    homeopathicApproach:
      "Homeopathic constitutional and acute coryzal remedies (such as Aconitum Napellus, Allium Cepa, Arsenicum Album, Gelsemium Sempervirens, Nux Vomica, Pulsatilla Nigricans, Hepar Sulphuris, Dulcamara, Silicea, Calcarea Carbonica) serve as supportive care to ease nasal congestion, soothe sneezing fits, and support constitutional immune vitality alongside saline nasal sprays, hydration, and rest.",
    lifestyleAdvice:
      "Practice meticulous hand hygiene (wash hands thoroughly with soap and water for 20 seconds or use alcohol-based hand rub after public transit or coughing), completely eliminate indoor tobacco smoke exposure, get 7 to 9 hours of quality sleep nightly to optimize natural killer cell activity, maintain a nutrient-dense diet rich in Vitamin C, Zinc, and bioflavonoids, use a clean cool mist room humidifier during dry winter months, and stay home during the first 48 hours of an acute cold to prevent transmitting the virus to coworkers or classmates.",
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
        question: "Does green or yellow snot mean I have a bacterial infection that needs antibiotics?",
        answer: "No. Nasal mucus turning yellow or green is a normal, healthy part of a viral cold. It happens when white blood cells (neutrophils) rush into the nose to fight the virus, releasing a natural green enzyme (myeloperoxidase) as they break down. Green mucus alone is NOT a reason to take antibiotics."
      },
      {
        question: "Why do children get so many more colds than adults?",
        answer: "Young children's immune systems are encountering these hundreds of common respiratory viruses for the very first time in their lives, having built no previous antibodies. By adulthood, after catching dozens of different strains, the immune system recognizes and clears many exposures before symptoms even develop."
      }
    ],
    redFlags: [
      "Secondary Bacterial Pneumonia: acute worsening of fever, tachypnea (rapid breathing), chest indrawing, severe dyspnea, focal chest crackles, pleuritic chest pain, or hypoxia (SpO2 <92–94%; requires urgent chest radiograph and antibiotic therapy)",
      "Peritonsillar Abscess (Quinsy) or Retropharyngeal Abscess: severe unilateral throat pain, 'hot potato' muffled voice, trismus (inability to open mouth), drooling, and uvular deviation away from the swollen tonsillar pillar (urgent ENT surgical drainage)",
      "Primary Immunodeficiency Warning Signs: \u22652 episodes of pneumonia in a year, \u22658 ear infections in a year, failure to thrive in a child, or recurrent deep cutaneous/organ abscesses (mandates formal quantitative immunoglobulin and immunology workup)",
      "Acute Epiglottitis / Stridor: high-pitched inspiratory sound (stridor), tripod posture, drooling, and acute airway compromise (life-threatening emergency)"
    ]
  },
  claimCitations: [
    { claimId: "D0055-TRADITIONAL-PROFILE", statement: "Homeopathic recurrent cold profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0055-TRADITIONAL-PROFILE" },
    { claimId: "D0055-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for bacterial pneumonia antibiotic therapy, quinsy drainage, or immunodeficiency replacement.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0055-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0055-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for bacterial pneumonia, peritonsillar abscess, or severe respiratory distress.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "High fever with rapid breathing and hypoxia indicating secondary bacterial pneumonia requiring urgent chest X-ray and antibiotics",
    "Severe unilateral throat pain with inability to open mouth and drooling indicating peritonsillar abscess (quinsy)",
    "Inspiratory stridor and airway distress indicating acute upper airway compromise requiring emergency 911 dispatch"
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
  tags: ["Recurrent Cold", "Common Cold", "Viral URTI", "Rhinovirus", "Disease", "Nasal Congestion", "Sore Throat", "Infectious Diseases"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/recurrent-cold",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive viral URTI antigenic diversity clinical boundaries, bacterial pneumonia/quinsy red flags, and verified citations"],
  clinicalPearl: "Yellow or green nasal discharge is a normal phase of viral shedding and does not indicate bacterial infection or require antibiotics.",
  quickFacts: {
    "Annual Frequency": "Adults average 2–4 colds/year; preschool children average 6–8 colds/year",
    "Primary System": "Upper Respiratory Tract & Mucosal Immune System (Infectious Diseases / Otolaryngology)",
    "Diagnostic Standard": "Clinical Diagnosis of Acute Coryza & Rhinorrhea (Exclusion of Pneumonia/Strep)",
    "Clinical Character": "Recurrent viral upper respiratory tract infections driven by hundreds of distinct viral serotypes"
  },
  aiReadiness: {
    retrievalSummary: "Recurrent Common Cold is frequent viral upper respiratory infections causing runny nose, sneezing, and sore throat, managed with supportive care, nasal saline, rest, and avoiding unnecessary antibiotics.",
    clinicalSummary: "Recurrent Common Cold pathophysiology involves infection by over 200 viral serotypes (primarily Rhinovirus) causing mucosal kinin release and vascular leakage. Homeopathic remedies serve as supportive constitutional care and do not replace symptomatic saline irrigations, or emergency medical treatment for secondary bacterial pneumonia, quinsy, or airway stridor.",
    patientSummary: "The common cold is a mild, self-limiting viral infection of your nose and throat that causes sneezing, stuffiness, and a sore throat, which gets better on its own in 7 to 10 days with rest, fluids, and saline sprays.",
    studentSummary: "Most common human infection. Etiology: >200 viruses (Rhinovirus most common). Green mucus is due to neutrophil myeloperoxidase, NOT bacterial infection. Antibiotics are contraindicated. Red flags: pneumonia (tachypnea, hypoxia), peritonsillar abscess (trismus, uvular deviation), and epiglottitis.",
    keywords: ["recurrent cold", "frequent colds", "common cold", "viral urti", "rhinovirus", "runny nose sneezing", "nasal congestion"],
    semanticKeywords: ["viral upper respiratory tract infection", "nasal mucosal kinin release", "recurrent rhinopharyngitis"],
    icd: "J00",
    mesh: "D003139",
    bodySystem: "Pulmonology & Infectious Diseases",
    urgency: "routine"
  }
};
