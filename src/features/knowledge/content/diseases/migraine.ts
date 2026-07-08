import { KnowledgeEntity } from "../../types";

export const MigraineDisease: KnowledgeEntity = {
  id: "D0003",
  slug: "migraine",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Migraine Headache",
    hi: "माइग्रेन (आधासीसी का दर्द)",
    gu: "આધાશીશી અને માથાનો દુખાવો (Migraine)",
    mr: "अर्धशिशी आणि डोकेदुखी (Migraine)",
    es: "Migraña",
    ar: "الصداع النصفي (Migraine)"
  },
  summary: {
    en: "A neurological condition characterized by recurrent, moderate-to-severe throbbing headaches, often unilateral and accompanied by nausea and sensory sensitivity.",
    hi: "एक न्यूरोलॉजिकल स्थिति जिसमें सिर के एक हिस्से में तेज, धड़कता हुआ दर्द होता है, साथ ही मतली और प्रकाश के प्रति संवेदनशीलता होती है.",
    gu: "એક ન્યુરોલોજીકલ સ્થિતિ જેમાં માથાના એક ભાગમાં તીવ્ર, ધબકારા સાથે દુખાવો થાય છે, સાથે ઉબકા અને પ્રકાશ-અવાજની એલર્જી હોય છે.",
    mr: "मेंदूशी संबंधित आजार ज्यामध्ये डोक्याच्या एका भागात तीव्र वेदना होतात, सोबत मळमळ आणि प्रकाश-आवाज न सहन होणे अशी लक्षणे दिसतात.",
    es: "Una condición neurológica caracterizada por dolores de cabeza recurrentes y palpitantes.",
    ar: "حالة عصبية تتميز بنوبات متكررة من الصداع النابض المعتدل إلى الشديد."
  },
  content: {
    overview: "Migraine: A chronic neurological disorder characterized by recurrent attacks of moderate to severe headache pain, typically unilateral, throbbing, pulsating, and aggravated by physical activity. Associated features include photophobia, phonophobia, nausea, and in about 20-30% of patients, transient focal neurological symptoms known as aura.",
    definition: "A complex neurovascular syndrome characterized by hypersensitivity of the trigeminovascular system, leading to cortical spreading depression (CSD), neurogenic inflammation, and pain transmission in cranial nerve pathways.",
    causes: [
      "Hypersensitivity of the trigeminovascular system",
      "Cortical spreading depression (CSD) triggering transient focal neurological symptoms (aura)",
      "Genetic predisposition involving ion channel variations in the central nervous system",
      "Fluctuations in vasoactive peptides, specifically Calcitonin Gene-Related Peptide (CGRP)"
    ],
    riskFactors: [
      "Hormonal fluctuations (e.g., menstruation, pregnancy, estrogen changes)",
      "Chronic stress and emotional exhaustion",
      "Sensory triggers (bright lights, flashing screens, loud noises, strong odors)",
      "Sleep deprivation, irregular sleep-wake cycles, or oversleeping",
      "Dietary triggers (aged cheese, nitrites, red wine, monosodium glutamate)"
    ],
    symptoms: [
      "Severe throbbing or pulsating headache, typically unilateral (one-sided)",
      "Photophobia (light sensitivity) and phonophobia (sound sensitivity)",
      "Nausea, vomiting, or generalized gastrointestinal upset during attacks",
      "Visual aura (scintillating scotomas, zigzag lines, temporary blind spots) preceding pain",
      "Sensory aura (tingling, numbness in fingers or face) or dysphasic speech aura"
    ],
    diagnosis: "Diagnosed clinically based on the International Classification of Headache Disorders (ICHD-3) criteria, ruling out secondary headaches through neuroimaging (MRI or CT brain) when red flags are present.",
    differentialDiagnosis: "Differentiate migraine from tension-type headache, cluster headache, sinus headache, cervicogenic headache, and secondary headache causes (e.g., temporal arteritis, subarachnoid hemorrhage).",
    conventionalManagement: "Involves acute abortive therapy (triptans, NSAIDs, CGRP receptor antagonists) and preventive therapy (beta-blockers, topiramate, amitriptyline, CGRP monoclonal antibodies).",
    homeopathicApproach: "Constitutional homeopathic management focuses on reducing susceptibility to trigger events, modulating autonomic nervous system reactivity, and stabilizing neurovascular response pathways using individualized remedies.",
    lifestyleAdvice: "Maintain a consistent sleep schedule, eat regular meals, avoid identified dietary triggers, practice mindfulness or relaxation techniques for stress reduction, and maintain a headache diary.",
    references: [
      "CIT-0011",
      "CIT-0022"
    ],
    faqs: [
      {
        question: "What is a migraine aura?",
        answer: "A migraine aura is a temporary neurological symptom, most commonly visual (such as zigzag lines or flashing lights), that usually occurs before the headache starts and lasts for 20 to 60 minutes."
      },
      {
        question: "How do hormonal cycles trigger migraines?",
        answer: "Fluctuations in estrogen levels, particularly the drop in estrogen right before a menstrual period, can trigger migraines in susceptible women."
      },
      {
        question: "Can homeopathy prevent migraine attacks?",
        answer: "Homeopathy utilizes individualized constitutional remedies to reduce the frequency and intensity of migraine attacks by optimizing the body's adaptive responses."
      }
    ],
    redFlags: [
      "Sudden thunderclap headache (onset to maximum intensity within seconds)",
      "Fever associated with neck stiffness (meningeal signs)",
      "Focal motor weakness or sensory loss",
      "New headache onset after age 50",
      "Headache progressing in frequency or severity over weeks"
    ]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Neurology & Constitutional Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["Migraine", "Headache", "Throbbing Pain", "Neurology", "Aura"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/migraine",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of Migraine disease profile", "1.1.0: Corrected classification to neurology, updated clinical contents, and added structured panels."],
  clinicalPearl: "Always evaluate atypical migraines or new onset after age 50 with a brain MRI to rule out space-occupying lesions or cerebral vasculitis.",
  quickFacts: {
    "Prevalence": "Est. 12% of global population",
    "Primary System": "Nervous System (Neurology)",
    "Primary Screen": "Clinical diagnostic criteria (ICHD-3)",
    "Clinical Nature": "Recurrent neurovascular syndrome"
  },
  aiReadiness: {
    retrievalSummary: "Migraine is a chronic neurovascular disorder characterized by periodic throbbing headaches, typically unilateral, associated with trigeminovascular pathway activation.",
    clinicalSummary: "Migraine pathophysiology involves cortical spreading depression (CSD), activation and sensitization of the trigeminovascular system, and increased Calcitonin Gene-Related Peptide (CGRP) release.",
    patientSummary: "Migraine is a severe, throbbing headache, often on one side of the head, that can cause nausea and light/sound sensitivity, sometimes preceded by warning signs called aura.",
    studentSummary: "Diagnosed using ICHD-3 criteria. Visual aura includes scintillating scotomas. Differential includes tension headaches (bilateral, non-pulsatile) and cluster headaches (severe orbital pain, autonomic features).",
    keywords: ["migraine", "throbbing headache", "migraine aura", "trigeminal nerve", "neurological headache"],
    semanticKeywords: ["neurovascular headache", "cortical spreading depression", "hemicrania"],
    icd: "G43.909",
    mesh: "D008881",
    bodySystem: "Neurology",
    urgency: "routine"
  },
  visualBodySystem: {
    system: "Neurology",
    organs: ["Brain", "Trigeminal Nerve", "Cranial Blood Vessels"],
    hormones: ["Serotonin", "CGRP"]
  },
  structuredEvidence: {
    system: "Neurology",
    prevalence: "12% globally, female predominance (3:1)",
    typicalAge: "15–45 years",
    causes: [
      "Trigeminovascular activation and neurogenic inflammation",
      "Cortical spreading depression (CSD)",
      "Genetic channelopathies and family history"
    ],
    investigations: ["Clinical evaluation (ICHD-3)", "Brain MRI (if atypical or red flags present)"],
    urgency: "routine"
  },
  structuredDifferentials: [
    {
      condition: "Tension Headache",
      similarity: "Generalized dull headache, physical fatigue.",
      differentiator: "Bilateral, non-pulsating band-like tightness; not aggravated by normal physical activity; no nausea or photophobia.",
      investigation: "Clinical evaluation"
    },
    {
      condition: "Cluster Headache",
      similarity: "Severe unilateral head pain.",
      differentiator: "Strictly unilateral, brief (15-180m), highly repetitive; associated with ipsilateral lacrimation, rhinorrhea, ptosis, and extreme restlessness.",
      investigation: "Clinical evaluation, Brain MRI (to rule out lesions)"
    },
    {
      condition: "Sinus Headache",
      similarity: "Frontal head pain, facial pressure.",
      differentiator: "Bilateral localized pain over sinuses; accompanied by purulent nasal discharge, fever; no visual aura or nausea.",
      investigation: "Sinus CT, Clinical evaluation"
    },
    {
      condition: "Temporal Arteritis",
      similarity: "Severe localized unilateral headache in older patients.",
      differentiator: "Age > 50; associated with jaw claudication, scalp tenderness, visual disturbances, and highly elevated ESR.",
      investigation: "ESR, C-Reactive Protein, Temporal Artery Biopsy"
    }
  ],
  homeopathicPerspective: {
    conventionalUnderstanding: "A primary neurovascular disorder characterized by trigeminovascular activation, neurogenic inflammation, and central pain sensitization, treated with triptans, CGRP blockers, and prophylactic medications.",
    homeopathicInterpretation: "An expression of chronic psoric or sycotic dysregulation, manifesting as periodic neurovascular storms triggered by stress, environmental factors, or physiological transitions.",
    constitutionalConsiderations: "Remedies such as Natrum Muriaticum, Belladonna, Sanguinaria, and Iris Versicolor are indicated based on pain location (e.g. right-sided vs left-sided), onset, and relief modalities.",
    individualization: "Considers the headache's periodicity, whether it is relieved by cold pressure, lying in a dark room, or sleep, and accompanying symptoms like visual disturbances or sour vomiting.",
    limitations: "Acute severe status migrainosus or secondary headaches caused by intracranial pathology (e.g. mass lesions, vascular malformations) require emergency conventional care."
  },
  aiKnowledge: {
    retrievalSummary: "Comprehensive neurological guide to Migraine, explaining trigeminovascular system pathology, cortical spreading depression, visual aura, and constitutional homeopathic care protocols.",
    differentialSummary: "Differentiate migraine from tension-type, cluster, sinus, and secondary headaches like temporal arteritis.",
    practitionerSummary: "Neurologist's guide to migraine management. Reviews triptan pharmacology, ICHD-3 criteria, CGRP antibody targets, and constitutional remedy selection.",
    patientSummary: "A guide to understanding migraines, identifying triggers, managing visual aura, and using homeopathic constitutional remedies.",
    educationalSummary: "Study guide detailing pathophysiology of migraine attacks, CSD, trigeminal ganglion transmission, and comparison tables for primary headaches.",
    graphContext: "Primary neurology node. Connects to Headache (S0003), remedies Belladonna (R0009), Lycopodium (R0003), and TSH (L0002) for screening.",
    embeddingText: "migraine headache throbbing unilateral pain aura photophobia nausea trigeminal nerve neurology belladonna natrum muriaticum"
  },
  clinicalImportance: "Migraines are a major neurovascular cause of chronic disability, severely impacting workplace productivity, social functioning, and cognitive performance.",
  whyItMatters: "Uncontrolled or chronic migraines lead to pain sensitization, medication overuse headache, severe sleep disruptions, and increased cardiovascular risks.",
  complications: [
    "Status migrainosus (relentless attack > 72 hours)",
    "Medication overuse headache (rebound headache)",
    "Migrainous infarction (ischemic stroke associated with migraine)",
    "Severe psychiatric co-morbidities (anxiety, depression)"
  ],
  knowledgeEmbedding: {
    overview: "Migraine is a chronic neurological disorder characterized by recurrent, pulsating, unilateral moderate-to-severe headaches.",
    pathology: "Involves trigeminovascular activation, release of calcitonin gene-related peptide (CGRP), and neurogenic inflammation.",
    diagnosis: "Mainly clinical using the ICHD-3 criteria; visual or sensory aura assists in classification.",
    investigations: "Diagnosed clinically; neuroimaging (MRI) is indicated only for atypical red flag presentations.",
    differentialDiagnosis: "Must differentiate from tension-type headaches, cluster headaches, sinus headaches, and temporal arteritis.",
    managementOverview: "Utilizes acute abortive therapies (triptans, NSAIDs) and prophylactic agents (CGRP inhibitors, beta-blockers).",
    homeopathicPerspective: "A neurovascular reactivity storm linked to vital force imbalance, requiring deep anti-psoric remedies suited to thermal states.",
    complications: "Severe forms manifest as status migrainosus, chronic rebound headache, or migrainous stroke.",
    prognosis: "Favorable; identifying and eliminating environmental/dietary triggers reduces attack frequency.",
    patientEducation: "Focuses on maintaining a trigger diary, managing stress, sleep hygiene, and avoiding medication overconsumption.",
    graphContext: "Main neurological hub linked to remedies Belladonna, Natrum Muriaticum, and symptom headache.",
    semanticKeywords: ["migraine", "headache", "trigeminovascular", "cgrp", "aura"],
    embeddingText: "migraine headache unilateral pulsating pain visual aura trigeminal nerve"
  },
  qualityScore: {
    editorialQuality: 5,
    clinicalDepth: 94,
    graphConnectivity: 95,
    citationQuality: 92,
    educationalValue: 95,
    aiReadiness: 100,
    seoReadiness: 97
  }
};
