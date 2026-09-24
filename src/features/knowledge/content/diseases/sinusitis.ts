import { KnowledgeEntity } from "../../types";

export const SinusitisDisease: KnowledgeEntity = {
  id: "D0006",
  slug: "sinusitis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Sinusitis",
    hi: "साइनसाइटिस / नाक का पोलिप (Sinusitis)",
    gu: "સાઇનસાઇટિસ (Sinusitis)",
    mr: "सायनसायटिस (Sinusitis)",
    es: "Sinusitis",
    ar: "التهاب الجيوب الأنفية",
  },
  summary: {
    en: "Sinusitis is swelling of the sinuses, often after a cold or flu. It can cause a blocked nose, facial pressure, reduced smell, and discoloured mucus. Learn what usually helps and when symptoms need review.",
    hi: "साइनसाइटिस का EPOS 2020 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "સાઇનસાઇટિસનું EPOS 2020 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "सायनसायटिसचे EPOS 2020 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Sinusitis según los criterios EPOS 2020 y límites de emergencia.",
    ar: "دليل سريري موثوق لالتهاب الجيوب الأنفية وفقًا لمعايير EPOS 2020 وحدود السلامة.",
  },
  content: {
    overview:
      "Sinusitis is swelling in the small air spaces around the nose. It commonly follows a viral illness and usually improves without antibiotics. Allergies, nasal swelling, or other factors can contribute when symptoms keep returning or last longer than expected.",
    definition:
      "An inflammatory disorder of the paranasal sinus lining caused by viral or bacterial infection, allergic sensitization, or anatomical obstruction of the ostiomeatal complex.",
    causes: [
      "Viral upper respiratory tract infection (Rhinovirus, Influenza, Parainfluenza) initiating acute viral rhinosinusitis [D0006-KEYNOTES, CIT-0043]",
      "Secondary bacterial superinfection (Streptococcus pneumoniae, Haemophilus influenzae, Moraxella catarrhalis) following persistent ostial obstruction",
      "Allergic fungal rhinosinusitis, environmental atopy, or anatomical deviations (septal spur, nasal polyposis)",
    ],
    riskFactors: [
      "Allergic rhinitis, asthma, or chronic environmental airborne irritant exposure",
      "Anatomical ostial blockage (deviated nasal septum, hypertrophied turbinates, nasal polyps)",
      "Dental infections of upper maxillary molars radiating to the maxillary sinus cavity",
    ],
    symptoms: [
      "Anterior or posterior mucopurulent nasal discharge, nasal obstruction, and facial pain/fullness [D0006-KEYNOTES, CIT-0043]",
      "Hyposmia or anosmia (reduced or lost sense of smell) and frontal or maxillary pressure worsening on bending forward",
      "Halitosis, ear fullness, dental aching, and persistent nocturnal cough",
    ],
    diagnosis:
      "Evaluated clinically via EPOS 2020 criteria (2 or more symptoms, 1 being obstruction or discharge). Confirmed by anterior rhinoscopy, nasal endoscopy, or non-contrast sinus CT scans for chronic recalcitrant cases [CIT-0043].",
    differentialDiagnosis:
      "Differentiate acute bacterial rhinosinusitis from viral URTI, allergic rhinitis, tension headache, migraine, dental abscess, and trigeminal neuralgia.",
    conventionalManagement:
      "Management includes hypertonic saline nasal lavage, topical intranasal corticosteroids, analgesics, short-course oral antibiotics for severe bacterial superinfections, or functional endoscopic sinus surgery (FESS) for anatomical ostial blockages [CIT-0043].",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for sinusitis. It should not delay assessment of severe, worsening, persistent, or eye-related symptoms, or treatment advised by a clinician.",
    lifestyleAdvice:
      "Perform daily warm saline nasal rinses, maintain adequate hydration, utilize facial steam inhalation, avoid tobacco smoke, and treat underlying allergic rhinitis promptly.",
    references: ["CIT-0020", "CIT-0021", "CIT-0022", "CIT-0043"],
    faqs: [
      {
        question: "When does acute Sinusitis require emergency ENT evaluation?",
        answer:
          "Periorbital edema/erythema, diplopia, reduced visual acuity, severe unilateral frontal headache, high fever (>39°C), neck stiffness, or altered sensorium indicates COMPLICATED ORBITAL CELLULITIS OR INTRACRANIAL EXTENSION [D0006-EMERGENCY-LIMITS, CIT-0043]. This is a MEDICAL EMERGENCY requiring IMMEDIATE ER evaluation.",
      },
      {
        question: "Can homeopathic remedies replace antibiotics or ENT surgical evaluation in complicated sinusitis?",
        answer:
          "NO. Homeopathy MUST NOT be used to delay urgent antibiotic therapy in severe acute bacterial sinusitis or surgical drainage in complicated orbital/intracranial extension [D0006-REGULATORY-LIMITS]. Delaying emergency ENT care risks permanent vision loss or meningitis.",
      },
      {
        question: "How does homeopathy integrate with standard sinus care?",
        answer:
          "Homeopathy acts as a complementary modality alongside standard saline irrigation, allergic risk management, and clinical ENT oversight [D0006-REGULATORY-LIMITS].",
      },
    ],
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Otolaryngology & Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Sinusitis", "Disease", "EPOS-2020", "Rhinology", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/sinusitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Sinusitis profile",
    "1.1.0: Upgraded with EPOS 2020 evidence citations (CIT-0043), passage-level claim citations (D0006-KEYNOTES, D0006-EMERGENCY-LIMITS, D0006-REGULATORY-LIMITS), orbital cellulitis red flags, and emergency ENT non-replacement rules",
    "1.2.0: Reframed the opening around symptoms, expected recovery, and evidence-based care boundaries.",
  ],
};
