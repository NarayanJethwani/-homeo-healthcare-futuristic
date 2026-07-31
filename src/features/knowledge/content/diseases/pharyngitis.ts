import { KnowledgeEntity } from "../../types";

export const PharyngitisDisease: KnowledgeEntity = {
  id: "D0029",
  slug: "pharyngitis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Acute Pharyngitis (Sore Throat)",
    hi: "ग्रसनीशोथ / गले का दर्द (Pharyngitis)",
    gu: "ગળાનો સોજો / દૂખાવો (Pharyngitis)",
    mr: "घशाचा दाह / घसा दुखणे (Pharyngitis)",
    es: "Faringitis Aguda",
    ar: "التهاب البلعوم",
  },
  summary: {
    en: "An authoritative clinical profile of Acute Pharyngitis covering IDSA 2012 guidelines, viral vs GABHS streptococcal etiology, epiglottitis and rheumatic fever emergency red flags, and diagnostic swab safety boundaries.",
    hi: "फैरिंजाइटिस का IDSA 2012 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ફેરિન્જાઇટિસનું IDSA 2012 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "फॅरिंजायटिसचे IDSA 2012 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Faringitis según los criterios IDSA 2012 y límites de emergencia.",
    ar: "دليل سريري موثوق لالتهاب البلعوم وفقًا لمعايير IDSA 2012 وحدود السلامة.",
  },
  content: {
    overview:
      "Acute Pharyngitis is an inflammation of the pharyngeal mucosa causing sore throat, dryness, and pain on swallowing [D0029-KEYNOTES, CIT-0056]. IDSA 2012 guidelines highlight that most cases are viral (70-90%), requiring symptomatic care without routine antibiotics unless GABHS is confirmed.",
    definition:
      "Acute infectious or non-infectious inflammation of the posterior pharynx and soft palate mucosa. GABHS accounts for 15-30% of pediatric cases and 5-15% of adult cases.",
    causes: [
      "Respiratory viral infections (Rhinovirus, Coronavirus, Adenovirus, Parainfluenza, EBV, HSV) [D0029-KEYNOTES, CIT-0056]",
      "Group A Beta-Hemolytic Streptococcus (GABHS / Streptococcus pyogenes)",
      "Non-infectious irritants (dry indoor air, GERD post-nasal drip, tobacco smoke, chemical fumes)",
    ],
    riskFactors: [
      "Childhood age (5-15 years) and close environmental crowding",
      "Active or passive smoking and environmental exposure to indoor dry air",
      "Pre-existing allergic rhinitis with chronic mouth breathing and post-nasal drip",
    ],
    symptoms: [
      "Sore, raw, or scratchy throat sensation aggravated by swallowing [D0029-KEYNOTES, CIT-0056]",
      "Pharyngeal mucosal erythema, posterior wall lymphoid follicle hypertrophy, and mild soft palate edema",
      "Low-grade fever, rhinorrhea, nasal congestion, cough, and mild anterior cervical lymphadenopathy (characteristic of viral etiology)",
    ],
    diagnosis:
      "Diagnosed clinically by pharyngeal inspection. Centor score guides testing: patients meeting ≥3 criteria undergo Rapid Antigen Detection Testing (RADT) or throat swab culture to confirm or rule out GABHS before prescribing antibiotics [CIT-0056].",
    differentialDiagnosis:
      "Differentiate Viral Pharyngitis from GABHS Streptococcal Pharyngitis, Acute Epiglottitis (tripod position, drooling, stridor), Retropharyngeal Abscess (neck stiffness), Infectious Mononucleosis, and Kawasaki Disease.",
    conventionalManagement:
      "Management of viral pharyngitis involves supportive therapy: oral analgesics (acetaminophen, ibuprofen), warm saline gargles, throat lozenges, and hydration. Confirmed GABHS pharyngitis requires 10 days of oral penicillin V or amoxicillin [CIT-0056].",
    homeopathicApproach:
      "Homeopathic remedies (such as Belladonna, Ferrum Phosphoricum, Lachesis Mutus, Merc Sol, Hepar Sulph) serve as supportive care to soothe pharyngeal dryness, ease burning throat pain, and reduce local congestion alongside proper medical testing.",
    lifestyleAdvice:
      "Gargle with warm salt water (1/2 tsp salt in 8 oz water), drink warm soothing teas with honey, use a cool-mist humidifier, and rest your voice.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0056"],
    faqs: [
      {
        question: "When does a simple sore throat indicate a dangerous airway or autoimmune emergency?",
        answer:
          "Inability to swallow saliva with drooling, inspiratory stridor / difficulty breathing, tripod posture (ACUTE EPIGLOTTITIS), or new joint swelling, fever, and heart murmur weeks after sore throat (RHEUMATIC FEVER) is a LIFE-THREATENING EMERGENCY [D0029-EMERGENCY-LIMITS, CIT-0056]. Go to nearest ER immediately.",
      },
      {
        question: "Can homeopathic remedies replace throat swab testing or prescribed penicillin for GABHS pharyngitis?",
        answer:
          "NO. Homeopathy MUST NOT replace throat swab diagnostic testing (RADT) or prescribed antibiotic treatment in confirmed GABHS pharyngitis [D0029-REGULATORY-LIMITS]. Eradicating GABHS is essential to prevent rheumatic heart disease.",
      },
      {
        question: "How does homeopathy integrate with standard upper respiratory care?",
        answer:
          "Homeopathy serves as complementary symptomatic support while patients undergo standard diagnostic evaluation, hydration, and primary care supervision [D0029-REGULATORY-LIMITS].",
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
    specialty: "ENT & Primary Care Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Pharyngitis", "Disease", "IDSA-2012", "Sore-Throat", "ENT", "Epiglottitis-Safety", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/pharyngitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Pharyngitis profile",
    "1.1.0: Upgraded with IDSA 2012 evidence citations (CIT-0056), passage-level claim citations (D0029-KEYNOTES, D0029-EMERGENCY-LIMITS, D0029-REGULATORY-LIMITS), epiglottitis / rheumatic fever red flags, and GABHS swab safety boundaries",
  ],
};
