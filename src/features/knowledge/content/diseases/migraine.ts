import { KnowledgeEntity } from "../../types";

export const MigraineDisease: KnowledgeEntity = {
  id: "D0003",
  slug: "migraine",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.2.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-09-24T12:00:00Z"
  },
  title: {
    en: "Migraine Headache (Hemicrania)",
    hi: "माइग्रेन (आधासीसी का दर्द)",
    gu: "આધાશીશી અને માથાનો દુખાવો (Migraine)",
    mr: "अर्धशिशी आणि डोकेदुखी (Migraine)",
    es: "Migraña (Cefalea Vascular)",
    ar: "الصداع النصفي (Migraine)"
  },
  summary: {
    en: "Migraine is more than a headache: it can cause throbbing pain, nausea and sensitivity to light or sound. Learn how to track patterns, use a treatment plan and recognise emergency warning signs.",
    hi: "माइग्रेन (आधासीसी सिरदर्द) का ट्राइजेमिनोवास्कुलर पैथोफिजियोलॉजी, ऑरा के लक्षण, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और थंडरक्लैप सिरदर्द की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "આધાશીશી (માઇગ્રેન) ન્યુરોવાસ્ક્યુલર પેથોલોજી, વિઝ્યુઅલ ઓરા, પરંપરાગત બંધારણીય હોમિયોપેથીક સહાયક વ્યવસ્થાપન અને અચાનક થતા ભયંકર માથાના દુખાવા (થંડરક્લેપ) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "अर्धशिशी (Migraine) आजाराचे मज्जातंतूशी संबंधित विश्लेषण, व्हिज्युअल ऑरा, पारंपरिक होमिओपॅथिक पद्धत आणि अचानक सुरू होणाऱ्या तीव्र डोकेदुखीच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la migraña que cubre la activación trigeminovascular, aura visual, manejo homeopático constitucional y banderas rojas de emergencia.",
    ar: "دليل سريري وتعليمي موثوق للصداع النصفي يغطي مسارات الأوعية الدموية العصبية وهالة الصداع والرعاية التكميلية وعلامات الخطر للصداع الصاعق والنزيف الدماغي."
  },
  content: {
    overview:
      "Migraine is a neurological condition that causes repeated headache attacks, often with nausea and sensitivity to light, sound or movement. Some people have aura—temporary visual, sensory or speech symptoms—before or during an attack. A new or unusual severe headache needs assessment.",
    definition:
      "Migraine affects the way the nervous system processes pain and sensory information. Attacks often follow a pattern, but symptoms and triggers vary from person to person.",
    causes: [
      "Hypersensitivity and neurogenic inflammatory activation of the trigeminovascular pathway",
      "Cortical spreading depression (CSD) wave triggering focal visual or sensory aura",
      "Vasoactive neuropeptide release, particularly Calcitonin Gene-Related Peptide (CGRP) and Substance P",
      "Genetic channelopathies and familial hemiplegic migraine gene mutations (CACNA1A, ATP1A2, SCN1A)"
    ],
    riskFactors: [
      "Hormonal fluctuations in estrogen (menstrual cycle, oral contraceptives, perimenopause)",
      "Irregular sleep-wake cycles, sleep deprivation, or excess sleep",
      "Psychological stress, emotional exhaustion, or 'let-down' periods after stress",
      "Dietary triggers: aged cheeses (tyramine), red wine, nitrites, artificial sweeteners, monosodium glutamate (MSG)",
      "Sensory overload: flickering bright lights, loud noises, strong perfumes, weather/barometric pressure changes"
    ],
    symptoms: [
      "Unilateral, pulsating, throbbing moderate-to-severe headache, worse from physical exertion (walking, climbing stairs)",
      "Photophobia (extreme sensitivity to light) and phonophobia (sensitivity to sounds)",
      "Gastrointestinal symptoms: anorexia, nausea, vomiting, and delayed gastric emptying (gastroparesis)",
      "Visual aura: scintillating scotomas, fortification spectra (zigzag lines), central blurring, or temporary hemianopia",
      "Sensory aura: unilateral paresthesias (tingling/numbness) in fingers spreading up arm to face and tongue"
    ],
    diagnosis:
      "Diagnosed clinically according to the International Classification of Headache Disorders (ICHD-3) criteria. Routine neuroimaging is not required for typical recurrent presentations, but Brain MRI or CT angiography is mandatory for atypical auras, sudden new onset after age 50, or when red flag 'SNOOP' criteria are present.",
    differentialDiagnosis:
      "Differentiate Migraine from Tension-Type Headache (bilateral band-like non-throbbing), Cluster Headache (strictly unilateral orbital autonomic headache), Cervicogenic Headache, Sinusitis, Temporal (Giant Cell) Arteritis, Subarachnoid Hemorrhage, and Cerebral Venous Sinus Thrombosis.",
    conventionalManagement:
      "Includes acute abortive treatment (triptans, 5-HT1F receptor agonists, NSAIDs, oral CGRP receptor antagonists) and prophylactic therapy (beta-blockers like propranolol, topiramate, amitriptyline, CGRP monoclonal antibodies like erenumab/galcanezumab, and botulinum toxin for chronic migraine).",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for migraine. It must not replace prescribed acute treatment, preventive treatment or emergency assessment for a sudden or unusual severe headache.",
    lifestyleAdvice:
      "Keep a simple headache diary with the timing, symptoms, medicines and possible triggers. Regular meals, hydration, sleep and pacing caffeine can help. A clinician can use the diary to decide whether acute or preventive treatment is appropriate.",
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
        question: "What is migraine aura?",
        answer: "Aura is a temporary neurological symptom, often flashing lights, zigzag lines, blind spots, tingling or speech difficulty. It is different from a persistent weakness, confusion or vision loss, which needs urgent assessment."
      },
      {
        question: "When does a headache need emergency care?",
        answer: "Call emergency services for a sudden ‘worst-ever’ headache, a headache after significant head injury, or headache with weakness, trouble speaking, persistent vision loss, seizure, fainting, fever with a stiff neck, or confusion."
      }
    ],
    redFlags: [
      "Sudden thunderclap headache reaching maximum severity within 60 seconds (suspected subarachnoid hemorrhage)",
      "New focal neurological deficit (limb weakness, aphasia, ataxia, cranial nerve palsy) persisting beyond aura duration",
      "New-onset headache in an individual over 50 years of age with scalp tenderness or jaw claudication (suspected temporal arteritis)",
      "Headache associated with high fever, neck stiffness, confusion, or altered consciousness (suspected meningitis or encephalitis)",
      "Progressive worsening of headache frequency or severity following head trauma or in an immunocompromised individual"
    ]
  },
  claimCitations: [
    { claimId: "D0003-TRADITIONAL-PROFILE", statement: "Homeopathic migraine profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0003-TRADITIONAL-PROFILE" },
    { claimId: "D0003-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for neurovascular migraines or stroke prevention.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0003-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0003-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for thunderclap headache, intracranial hemorrhage, or meningitis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden thunderclap headache reaching maximum intensity within seconds (suspected subarachnoid hemorrhage)",
    "Focal neurological weakness, aphasia, or persistent vision loss requiring emergency stroke imaging",
    "Headache accompanied by high fever, nuchal rigidity, and photophobia (suspected meningitis)"
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
  tags: ["Migraine", "Hemicrania", "Disease", "Vascular Headache", "Aura", "Trigeminovascular", "Photophobia"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/migraine",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive ICHD-3 clinical boundaries, neurovascular red flags, and verified citations"],
  clinicalPearl: "Always evaluate thunderclap headaches or new headaches in patients over 50 with emergency neuroimaging to rule out intracranial hemorrhage or temporal arteritis.",
  quickFacts: {
    "Prevalence": "Est. 12–15% of global population (3:1 female-to-male ratio)",
    "Primary System": "Central Nervous System & Trigeminovascular System",
    "Diagnostic Standard": "International Classification of Headache Disorders (ICHD-3)",
    "Clinical Character": "Recurrent episodic neurovascular headache with sensory hypersensitivity"
  },
  aiReadiness: {
    retrievalSummary: "Migraine is a chronic neurovascular disorder characterized by recurrent throbbing headaches, typically unilateral, photophobia, nausea, and visual aura, managed through supportive constitutional care and lifestyle trigger control.",
    clinicalSummary: "Migraine pathophysiology involves cortical spreading depression (CSD), trigeminovascular sensitization, and CGRP neuropeptide release. Homeopathic protocols serve as supportive constitutional care and do not replace emergency neuroimaging or medical care for thunderclap headaches, intracranial hemorrhage, or status migrainosus.",
    patientSummary: "Migraine is a severe, throbbing headache, often on one side of the head, causing light and sound sensitivity and nausea, sometimes preceded by flashing zigzag visual warning signs (aura).",
    studentSummary: "Diagnosed using ICHD-3 criteria. Distinguish from tension headache (bilateral, dull) and cluster headache (periorbital, autonomic). Red flags include sudden thunderclap onset and focal neurological deficits.",
    keywords: ["migraine", "hemicrania", "vascular headache", "migraine aura", "photophobia", "throbbing headache"],
    semanticKeywords: ["neurovascular headache", "cortical spreading depression", "trigeminovascular activation"],
    icd: "G43.909",
    mesh: "D008881",
    bodySystem: "Neurology",
    urgency: "routine"
  }
};
