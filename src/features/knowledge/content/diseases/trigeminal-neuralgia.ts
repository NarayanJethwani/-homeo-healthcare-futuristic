import { KnowledgeEntity } from "../../types";

export const TrigeminalNeuralgiaDisease: KnowledgeEntity = {
  id: "D0041",
  slug: "trigeminal-neuralgia",
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
    en: "Trigeminal Neuralgia (Tic Douloureux / Prosopalgia)",
    hi: "ट्राइजेमिनल न्यूराल्जिया / चेहरे का तीव्र दर्द (Trigeminal Neuralgia)",
    gu: "ટ્રાઇજેમિનલ ન્યુરાલ્જિયા / ચહેરાનો અસહ્ય દુખાવો (Tic Douloureux)",
    mr: "ट्रायजेमिनल न्यूराल्जिया / चेहऱ्यावरील तीव्र वेदना (Trigeminal Neuralgia)",
    es: "Neuralgia del Trigémino (Tic Doloroso / Prosopalgia)",
    ar: "ألم العصب ثلاثي التوائم (Trigeminal Neuralgia)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Trigeminal Neuralgia, covering neurovascular compression of cranial nerve V, paroxysmal electric shock-like facial pain, trigger zones, constitutional homeopathic supportive management, and emergency red flags for secondary cerebellopontine angle tumors and multiple sclerosis.",
    hi: "ट्राइजेमिनल न्यूराल्जिया (टिक डोलोरेक्स/चेहरे का तीव्र तंत्रिका दर्द) का न्यूरोवास्कुलर कंप्रेशन पैथोलॉजी, बिजली के झटके जैसा दर्द, ट्रिगर जोन्स, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और सीपी एंगल ट्यूमर व मल्टीपल स्केलेरोसिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ટ્રાઇજેમિનલ ન્યુરાલ્જિયા (ચહેરાની ચેતાનો કરંટ જેવો દુખાવો) ની ન્યુરોવાસ્ક્યુલર પેથોલોજી, સ્પર્શ કે પવનથી થતો તીવ્ર આંચકો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને બ્રેઇન ટ્યુમર ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "ट्रायजेमिनल न्यूराल्जिया (चेहऱ्याचा तीव्र झटका देणारा मज्जातंतूचा त्रास), दात घासताना वा बोलताना होणाऱ्या असह्य वेदना, पारंपरिक होमिओपॅथिक पद्धत आणि मेंदूतील गाठींच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la neuralgia del trigémino que cubre la compresión neurovascular, dolor facial paroxístico en descarga eléctrica, manejo homeopático complementario y banderas rojas de tumores del ángulo pontocerebeloso.",
    ar: "دليل سريري وتعليمي موثوق لألم العصب ثلاثي التوائم يغطي الانضغاط الوعائي العصبي والآلام الكهربائية الوجهية الصاعقة والرعاية التكميلية وعلامات الخطر لأورام الزاوية الجسرية المخيخية والتصلب المتعدد."
  },
  content: {
    overview:
      "Trigeminal Neuralgia (tic douloureux) is an excruciating, disabling neuropathic pain disorder affecting the sensory distribution of the fifth cranial nerve (CN V). Characterized by sudden, unilateral, brief, electric shock-like, lancinating, or stabbing paroxysms of severe facial pain, attacks last from a fraction of a second up to two minutes and are reliably triggered by innocuous light tactile stimuli to sensitive facial trigger zones (such as washing the face, shaving, brushing teeth, chewing, speaking, or a light breeze blowing on the cheek).",
    definition:
      "A severe facial pain syndrome characterized by paroxysmal, unilateral, shock-like pain limited to the distribution of one or more divisions of the trigeminal nerve (most commonly the maxillary V2 and mandibular V3 branches).",
    causes: [
      "Classical Trigeminal Neuralgia: neurovascular compression of the trigeminal nerve root entry zone (REZ) in the prepontine cistern, most frequently by an aberrant or ectatic loop of the Superior Cerebellar Artery (SCA)",
      "Secondary Trigeminal Neuralgia: structural demyelinating plaque in the brainstem from Multiple Sclerosis (MS), or extrinsic compression by a benign tumor (vestibular schwannoma, meningioma, epidermoid cyst in the cerebellopontine angle)",
      "Focal demyelination of primary afferent sensory A-beta fibers at the root entry zone leading to ephaptic transmission ('cross-talk') and paroxysmal neuronal hyperexcitability",
      "Idiopathic Trigeminal Neuralgia without identifiable neurovascular or structural contact on high-resolution MRI"
    ],
    riskFactors: [
      "Advanced age (incidence increases markedly after 50 years of age)",
      "Female gender (female-to-male ratio approximately 1.5:1 to 2:1)",
      "Diagnosis of Multiple Sclerosis (MS patients have a 20-fold increased risk and often present with bilateral symptoms)",
      "Hypertension and vascular tortuosity (atherosclerotic vascular elongation accelerating pulsatile neurovascular compression)",
      "Dental procedures or facial trauma acting as precipitating stressors"
    ],
    symptoms: [
      "Paroxysmal, intense, sharp, stabbing, burning, or electric shock-like facial pain confined strictly to the distribution of CN V (unilateral in >95% of classical cases)",
      "Pain most commonly involves the maxillary (V2; cheek, upper lip, upper teeth, side of nose) and mandibular (V3; lower jaw, chin, lower teeth, anterior tongue) branches",
      "Presence of specific cutaneous or mucosal 'trigger zones' where light touch instantly provokes an agonizing paroxysm",
      "Triggering activities: light touch, shaving, applying makeup, washing face with cold water, brushing teeth, eating, smiling, or speaking",
      "Reflexive grimacing or facial muscle twitching during the attack (the historical 'tic douloureux')",
      "Refractory periods following a paroxysm during which tactile stimulation temporarily fails to trigger pain"
    ],
    diagnosis:
      "Diagnosed clinically based on the International Classification of Headache Disorders (ICHD-3) criteria. High-resolution Brain MRI with specialized sequences (3D FIESTA / CISS and MR Angiography) is mandatory to evaluate for neurovascular compression at the root entry zone, quantify nerve distortion, and rigorously exclude secondary causes (multiple sclerosis demyelinating lesions or cerebellopontine angle tumors).",
    differentialDiagnosis:
      "Differentiate Trigeminal Neuralgia from Dental Pain / Odontogenic Infections (pulpitis, cracked tooth syndrome), Temporomandibular Joint (TMJ) Dysfunction, Persistent Idiopathic Facial Pain (atypical facial pain; constant dull aching), Cluster Headache / SUNCT / SUNA (trigeminal autonomic cephalalgias with autonomic tearing and rhinorrhea), Post-Herpetic Neuralgia (history of herpes zoster ophthalmicus), and Glossopharyngeal Neuralgia (CN IX; tonsillar and ear pain on swallowing).",
    conventionalManagement:
      "First-line pharmacotherapy consists of voltage-gated sodium channel blockers: carbamazepine (200–1200 mg/day; monitor CBC for agranulocytosis and liver function) or oxcarbazepine. Second-line agents include baclofen, lamotrigine, and gabapentin. When medical therapy fails or causes intolerable toxicity, surgical interventions include Microvascular Decompression (MVD / Jannetta procedure; the definitive curative surgery), Stereotactic Radiosurgery (Gamma Knife), percutaneous balloon compression, and radiofrequency rhizotomy.",
    homeopathicApproach:
      "Homeopathic constitutional and neuralgic remedies (such as Spigelia Anthelmia, Magnesia Phosphorica, Hypericum Perforatum, Plantago Major, Verbascum Thapsus, Mezereum, Aconitum Napellus, Causticum) serve as supportive care to soothe facial nerve sensitivity, ease cold-wind-induced spasms, and address individual pain modalities alongside close neurologist monitoring and neuroimaging guidance.",
    lifestyleAdvice:
      "Avoid known tactile triggers on facial trigger zones, wash the face with lukewarm water rather than icy water, use a soft-bristled toothbrush or gentle oral rinses during flare-ups, shield the face with a scarf or wrap in cold windy weather, chew food on the unaffected side of the mouth, and consume soft, nutritious foods during acute pain periods.",
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
        question: "Why is trigeminal neuralgia sometimes called 'tic douloureux'?",
        answer: "The French term 'tic douloureux' translates to 'painful tic', describing the involuntary facial grimace or muscle twitching that often accompanies the sudden, agonizing electric shock-like facial spasms."
      },
      {
        question: "Can trigeminal neuralgia affect both sides of the face?",
        answer: "Classical trigeminal neuralgia is almost always unilateral (one-sided). Bilateral facial pain is rare (<2%) and strongly suggests secondary trigeminal neuralgia associated with Multiple Sclerosis (MS)."
      }
    ],
    redFlags: [
      "Objective sensory loss (numbness) in the distribution of the trigeminal nerve or absent corneal reflex (indicates structural secondary pathology rather than classical neurovascular compression)",
      "Bilateral facial neuralgia or onset in a young patient under 40 years of age (strongly suggests demyelinating Multiple Sclerosis)",
      "Associated cranial nerve deficits: hearing loss, tinnitus, ataxia, dysphagia, or extraocular muscle palsy (suspected cerebellopontine angle tumor or brainstem neoplasm)",
      "Intractable severe pain leading to severe malnutrition, dehydration, or profound depression/suicidal ideation"
    ]
  },
  claimCitations: [
    { claimId: "D0041-TRADITIONAL-PROFILE", statement: "Homeopathic trigeminal neuralgia profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0041-TRADITIONAL-PROFILE" },
    { claimId: "D0041-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for vascular loop compression, neurosurgery, or multiple sclerosis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0041-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0041-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for cerebellopontine tumors, multiple sclerosis, or severe dehydration.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Facial sensory numbness, absent corneal reflex, or ataxia indicating secondary cerebellopontine angle mass lesion requiring urgent MRI",
    "Bilateral facial neuralgias in young adults indicating multiple sclerosis",
    "Severe dehydration and acute malnutrition resulting from inability to swallow liquids or open mouth"
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
  tags: ["Trigeminal Neuralgia", "Tic Douloureux", "Prosopalgia", "Disease", "Facial Nerve Pain", "Electric Shock Pain", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/trigeminal-neuralgia",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive cranial neuropathy clinical boundaries, brainstem/CPA red flags, and verified citations"],
  clinicalPearl: "Any finding of objective facial numbness or an absent corneal reflex on neurological exam rules out classical trigeminal neuralgia and mandates brain MRI to locate a structural tumor or MS plaque.",
  quickFacts: {
    "Annual Incidence": "Approximately 4 to 12 cases per 100,000 population (increases with age)",
    "Primary System": "Cranial Nervous System (Trigeminal Nerve / CN V)",
    "Diagnostic Standard": "Clinical Diagnostic Criteria (ICHD-3) & High-Resolution Brain MRI (3D CISS/FIESTA)",
    "Clinical Character": "Paroxysmal, unilateral, electric shock-like facial pain triggered by light touch"
  },
  aiReadiness: {
    retrievalSummary: "Trigeminal Neuralgia is a severe neuropathic facial pain disorder caused by neurovascular compression of the fifth cranial nerve, presenting with brief electric shock-like spasms triggered by light touch, managed with supportive care, carbamazepine, and neurosurgical evaluation.",
    clinicalSummary: "Trigeminal Neuralgia pathophysiology involves focal demyelination and ephaptic transmission at the trigeminal root entry zone. Homeopathic remedies serve as supportive neuralgic care and do not replace emergency MRI evaluation or neurosurgical decompression (MVD) for structural cerebellopontine tumors, multiple sclerosis, or severe refractory malnutrition.",
    patientSummary: "Trigeminal Neuralgia causes sudden, extreme, electric shock-like pains on one side of the face triggered by light touch, eating, shaving, or brushing teeth, caused by irritation to the main facial nerve.",
    studentSummary: "Affects V2/V3 divisions of CN V. Neurovascular compression by the Superior Cerebellar Artery (SCA) is the most common cause. Carbamazepine is the first-line drug. Red flags: sensory deficits (numbness) and bilateral pain (think MS).",
    keywords: ["trigeminal neuralgia", "tic douloureux", "prosopalgia", "facial nerve pain", "electric shock face pain", "cranial nerve v", "carbamazepine"],
    semanticKeywords: ["neurovascular compression", "superior cerebellar artery", "cranial nerve v neuropathy"],
    icd: "G50.0",
    mesh: "D014277",
    bodySystem: "Neurology",
    urgency: "routine"
  }
};
