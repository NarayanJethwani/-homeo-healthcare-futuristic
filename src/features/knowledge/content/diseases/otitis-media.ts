import { KnowledgeEntity } from "../../types";

export const OtitisMediaDisease: KnowledgeEntity = {
  id: "D0026",
  slug: "otitis-media",
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
    en: "Otitis Media (Middle Ear Infection & Effusion)",
    hi: "ओटाइटिस मीडिया / कान का संक्रमण (Otitis Media)",
    gu: "ઓટાઇટિસ મીડિયા / કાનનો ચેપ (Otitis Media)",
    mr: "कान दुखणे आणि कान वाहणे (Otitis Media)",
    es: "Otitis Media (Infección del Oído Medio)",
    ar: "التهاب الأذن الوسطى (Otitis Media)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Otitis Media, covering acute otitis media (AOM), otitis media with effusion (OME), Eustachian tube dysfunction, constitutional homeopathic supportive management, and emergency red flags for acute mastoiditis, facial nerve palsy, and intracranial infection.",
    hi: "ओटाइटिस मीडिया (मध्य कर्ण संक्रमण) का एक्यूट ओटाइटिस मीडिया (AOM), यूस्टेशियन ट्यूब डिसफंक्शन, कान में मवाद/द्रव का संचय, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और तीव्र मास्टॉयडाइटिस की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "ઓટાઇટિસ મીડિયા (કાનનો ચેપ અને પરુ), યુસ્ટેચિયન ટ્યુબની ખામી, કાનનો તીવ્ર દુખાવો, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને માસ્ટોઇડાઇટિસ ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "मध्यम कानाचा संसर्ग (Otitis Media), कानात पू होणे, ऐकू कमी येणे, पारंपरिक होमिओपॅथिक पद्धत आणि मास्टॉइड इन्फेक्शनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la otitis media que cubre AOM, derrame timpánico, disfunción tubárica, manejo homeopático complementario y banderas rojas de mastoiditis.",
    ar: "دليل سريري وتعليمي موثوق لالتهاب الأذن الوسطى يغطي الالتهاب الحاد والارتشاح المصلي واعتلال قناة استاكيوس والرعاية التكميلية وعلامات الخطر لالتهاب الخشاء الحاد."
  },
  content: {
    overview:
      "Otitis Media encompasses a spectrum of inflammatory and infectious conditions of the middle ear space, most commonly Acute Otitis Media (AOM), Otitis Media with Effusion (OME / 'glue ear'), and Chronic Suppurative Otitis Media (CSOM). Driven by Eustachian tube dysfunction following viral upper respiratory tract infections, it is one of the leading pediatric diagnoses globally, presenting with acute otalgia (earache), fever, irritability, tympanic membrane erythema/bulging, and conductive hearing loss.",
    definition:
      "An acute or chronic inflammatory process within the mucoperiosteal lining of the middle ear cleft, manifesting with fluid accumulation, middle ear effusion, and tympanic membrane inflammation.",
    causes: [
      "Eustachian tube dysfunction and mucosal edema following viral upper respiratory tract infections (RSV, rhinovirus, influenza, adenovirus)",
      "Secondary bacterial proliferation in the trapped middle ear fluid (Streptococcus pneumoniae, non-typeable Haemophilus influenzae, Moraxella catarrhalis)",
      "Immature pediatric Eustachian tube anatomy (shorter, wider, and more horizontally aligned in infants and young children under age 2)",
      "Adenoid hypertrophy acting as a mechanical obstruction and bacterial biofilm reservoir at the nasopharyngeal orifice"
    ],
    riskFactors: [
      "Young pediatric age (peak incidence 6 to 24 months of age)",
      "Attendance at group day-care centers and exposure to viral respiratory illnesses",
      "Exposure to secondhand environmental tobacco smoke (impairs middle ear mucociliary clearance)",
      "Pacifier use beyond 6–12 months and bottle feeding in the supine (flat) position",
      "Craniofacial anomalies (cleft palate, Down syndrome) causing tensor veli palatini muscle dysfunction",
      "Seasonal winter/spring climate and lack of exclusive breastfeeding during first 6 months"
    ],
    symptoms: [
      "Acute, severe, throbbing otalgia (ear pain), often causing pediatric patients to tug, pull, or rub the affected ear",
      "Systemic fever, excessive crying, nocturnal restlessness, and reduced oral intake in infants",
      "Conductive hearing loss, ear fullness, subjective popping, or autophony",
      "Otorrhea: sudden discharge of purulent or serosanguineous fluid following spontaneous tympanic membrane perforation (often accompanied by sudden relief of pain)",
      "Otoscopic signs: bulging, opaque, erythematous tympanic membrane with loss of normal light reflex and diminished pneumatic mobility"
    ],
    diagnosis:
      "Diagnosed clinically via pneumatic otoscopy demonstrating moderate-to-severe tympanic membrane bulging, new-onset otorrhea not due to acute otitis externa, or mild bulging accompanied by intense erythema and acute otalgia. Tympanometry (Type B flat tracing) confirms middle ear effusion. Audiometry is indicated for persistent OME lasting >3 months.",
    differentialDiagnosis:
      "Differentiate Otitis Media from Otitis Externa ('swimmer's ear' with pain on tragal pressure or pinna traction), Referred Otalgia (dental caries, temporomandibular joint dysfunction, tonsillitis/pharyngitis, cervical spine strain), Foreign Body in the external auditory canal, and Cholesteatoma.",
    conventionalManagement:
      "Initial management includes strict weight-based analgesia (acetaminophen, ibuprofen). In mild unilateral AOM in older children, a watchful waiting strategy (48–72 hours observation) is recommended by AAP guidelines. First-line antibiotic therapy (high-dose amoxicillin or amoxicillin-clavulanate) is indicated for severe bilateral disease, infants <6 months, or persistent symptoms. Tympanostomy tube insertion (grommets) and adenoidectomy are indicated for recurrent AOM or chronic OME with hearing deficit.",
    homeopathicApproach:
      "Homeopathic constitutional and acute remedies (such as Belladonna, Chamomilla, Pulsatilla Nigricans, Hepar Sulphuris, Mercurius Solubilis, Silicea, Ferrum Phosphoricum) serve as supportive care to ease pain, soothe infant distress, and assist fluid resorption alongside close otoscopic monitoring and pediatrician evaluation.",
    lifestyleAdvice:
      "Feed infants in a semi-upright position rather than lying flat, eliminate household tobacco smoke exposure, practice good hand hygiene, avoid inserting cotton swabs or foreign objects into the ear canal, keep water out of the ear if a tympanic perforation or grommet tube is present, and adhere to recommended pediatric pneumococcal and influenza immunizations.",
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
        question: "Why do children get ear infections much more frequently than adults?",
        answer: "In young children, the Eustachian tube is shorter, wider, and more horizontally oriented compared to adults. This makes it easier for viruses and bacteria from the nasopharynx to migrate into the middle ear space, especially when lying flat."
      },
      {
        question: "Does fluid in the ear always mean a child needs antibiotics?",
        answer: "No. Otitis Media with Effusion (fluid behind the eardrum without acute signs of infection or severe pain) is often viral or post-infectious and usually resolves spontaneously within 6 to 12 weeks without antibiotics."
      }
    ],
    redFlags: [
      "Post-auricular erythema, swelling, tenderness, or forward displacement of the pinna (suspected acute mastoiditis requiring emergency hospital admission and CT scan)",
      "Ipsilateral facial nerve paresis or asymmetry (weakness of facial muscles around mouth or eye)",
      "High spiking fever accompanied by lethargy, neck stiffness, severe vomiting, or altered consciousness (suspected intracranial abscess or meningitis)",
      "Acute onset of vertigo, nystagmus, and sensorineural hearing loss (suspected acute infectious labyrinthitis)",
      "Persistent foul-smelling otorrhea unresponsive to therapy (suspected cholesteatoma)"
    ]
  },
  claimCitations: [
    { claimId: "D0026-TRADITIONAL-PROFILE", statement: "Homeopathic otitis media profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0026-TRADITIONAL-PROFILE" },
    { claimId: "D0026-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for mastoid osteitis, tympanic rupture repair, or intracranial abscess.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0026-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0026-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute mastoiditis, facial nerve palsy, or meningitis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Post-auricular swelling, redness, and pinna displacement indicating acute coalescent mastoiditis requiring emergency CT and IV therapy",
    "New-onset ipsilateral facial nerve paralysis indicating intratemporal neurological complication",
    "High fever accompanied by nuchal rigidity, lethargy, or projectile vomiting indicating intracranial spread"
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
  tags: ["Otitis Media", "Middle Ear Infection", "Disease", "Earache", "Otalgia", "Glue Ear", "Eustachian Tube", "Pediatric ENT"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/otitis-media",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive pediatric otology clinical boundaries, mastoiditis red flags, and verified citations"],
  clinicalPearl: "Always inspect behind the ear for post-auricular swelling or tenderness to immediately rule out acute mastoiditis in any child presenting with otalgia and fever.",
  quickFacts: {
    "Prevalence": "Peak incidence between 6 and 24 months of age (>80% of children experience at least 1 episode)",
    "Primary System": "Ear, Nose, and Throat (ENT / Pediatric Otology)",
    "Diagnostic Standard": "Pneumatic Otoscopy (Tympanic Membrane Bulging & Erythema)",
    "Clinical Character": "Acute or chronic middle ear cleft inflammation driven by Eustachian tube dysfunction"
  },
  aiReadiness: {
    retrievalSummary: "Otitis Media is an inflammation of the middle ear space resulting from Eustachian tube dysfunction and bacterial/viral colonization, presenting with ear pain, fever, and hearing dullness, managed with supportive care and close pediatrician monitoring.",
    clinicalSummary: "Otitis Media pathophysiology involves viral Eustachian tube mucosal edema, negative pressure generation, and bacterial proliferation. Homeopathic remedies serve as supportive pediatric care and do not replace emergency ENT evaluation, antibiotics, or surgery for acute coalescent mastoiditis or facial nerve palsy.",
    patientSummary: "Otitis Media is a middle ear infection common in children that causes sharp ear pain, fever, trouble hearing, and ear pulling, often developing after a head cold.",
    studentSummary: "Pneumatic otoscopy showing a bulging, erythematous tympanic membrane confirms acute otitis media (AOM). Differentiate from otitis media with effusion (fluid without acute infection) and otitis externa. Red flags: mastoid swelling and facial nerve palsy.",
    keywords: ["otitis media", "middle ear infection", "ear pain", "otalgia", "glue ear", "ear pulling baby", "eardrum bulge"],
    semanticKeywords: ["middle ear inflammation", "eustachian tube dysfunction", "pediatric otology"],
    icd: "H66.90",
    mesh: "D010033",
    bodySystem: "Otolaryngology (ENT)",
    urgency: "routine"
  }
};
