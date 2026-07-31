import { KnowledgeEntity } from "../../types";

export const TonsillitisDisease: KnowledgeEntity = {
  id: "D0028",
  slug: "tonsillitis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Acute Tonsillitis & Peritonsillar Cellulitis",
    hi: "टॉन्सिलाइटिस / टॉन्सिल की सूजन (Tonsillitis)",
    gu: "ટોન્સિલાઇટિસ / ટાકણાનો સોજો (Tonsillitis)",
    mr: "टॉन्सिलायटिस / टॉन्सिलची सुज (Tonsillitis)",
    es: "Amigdalitis Aguda",
    ar: "التهاب اللوزتين",
  },
  summary: {
    en: "An authoritative clinical profile of Acute Tonsillitis covering IDSA 2012 guidelines, GABHS streptococcal infection mechanics, peritonsillar abscess (Quinsy) emergency red flags, and ENT safety boundaries.",
    hi: "टॉन्सिलाइटिस का IDSA 2012 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ટોન્સિલાઇટિસનું IDSA 2012 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "टॉन्सिलायटिसचे IDSA 2012 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Amigdalitis según los criterios IDSA 2012 y límites de emergencia.",
    ar: "دليل سريري موثوق لالتهاب اللوزتين وفقًا لمعايير IDSA 2012 وحدود السلامة.",
  },
  content: {
    overview:
      "Tonsillitis is an acute infection or inflammation of the palatine tonsils characterized by sore throat, fever, dysphagia, and tonsillar exudate [D0028-KEYNOTES, CIT-0056]. IDSA 2012 guidelines mandate rapid antigen testing (RADT) or throat culture before antibiotic administration for Group A Streptococcus (GABHS).",
    definition:
      "Acute or recurrent mucosal and lymphoid inflammation of the palatine tonsils. Viruses cause 70-80% of acute episodes; Streptococcus pyogenes (GABHS) is the most common bacterial pathogen (15-30% in children).",
    causes: [
      "Group A Beta-Hemolytic Streptococcus (GABHS / Streptococcus pyogenes) infection causing suppurative tonsillar cryptitis [D0028-KEYNOTES, CIT-0056]",
      "Respiratory viral pathogens (Epstein-Barr Virus / Infectious Mononucleosis, Adenovirus, Enterovirus, Influenza)",
      "Anaerobic bacteria (Fusobacterium necrophorum) implicated in recurrent tonsillitis or Lemierre syndrome",
    ],
    riskFactors: [
      "School-age children (5 to 15 years) and close contact in classrooms or daycares",
      "Cold seasonal exposure, enlarged lymphatic tissues, and impaired mucosal immunity",
      "Prior episodes of recurrent streptococcal pharyngotonsillitis",
    ],
    symptoms: [
      "Severe odynophagia (painful swallowing), high fever (>38.5°C), and sudden onset sore throat [D0028-KEYNOTES, CIT-0056]",
      "Hyperemic, enlarged palatine tonsils with white or yellowish follicular exudates",
      "Tender anterior cervical lymphadenopathy, halitosis, headache, and abdominal pain (in young children)",
    ],
    diagnosis:
      "Diagnosed clinically using Centor or McIsaac criteria (fever >38°C, tonsillar exudates, tender anterior cervical nodes, absence of cough). Verified by Rapid Antigen Detection Test (RADT) or throat swab culture [CIT-0056].",
    differentialDiagnosis:
      "Differentiate Tonsillitis from Infectious Mononucleosis (EBV - posterior cervical lymphadenopathy, splenomegaly, atypical lymphocytosis), Peritonsillar Abscess (Quinsy), Diphtheria (adherent pseudomembrane), and Epiglottitis.",
    conventionalManagement:
      "Management includes analgesics/antipyretics (acetaminophen, ibuprofen), warm saline gargles, and oral penicillin V or amoxicillin for 10 days in confirmed GABHS cases to prevent acute rheumatic fever and post-streptococcal glomerulonephritis [CIT-0056].",
    homeopathicApproach:
      "Homeopathic remedies (such as Belladonna, Phytolacca Decandra, Mercurius Solubilis, Hepar Sulphuris, Baryta Carbonica) serve as supportive care to reduce throat inflammation, ease painful swallowing, and relieve cervical lymph node tenderness alongside proper diagnostic testing.",
    lifestyleAdvice:
      "Maintain soft diet, drink abundant warm fluids, practice warm salt-water gargles, replace toothbrush after GABHS treatment, and rest.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0056"],
    faqs: [
      {
        question: "When does acute tonsillitis indicate a life-threatening airway or abscess emergency?",
        answer:
          "Muffled 'hot-potato' voice, inability to open mouth (trismus), severe unilateral throat pain with uvular deviation (PERITONSILLAR ABSCESS / QUINSY), or inspiratory stridor / drooling indicates AN AIRWAY EMERGENCY [D0028-EMERGENCY-LIMITS, CIT-0056]. Seek IMMEDIATE ER / ENT EVALUATION.",
      },
      {
        question: "Can homeopathic remedies replace antibiotic therapy in confirmed Group A Streptococcal (GABHS) tonsillitis?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace prescribed antibiotic therapy in confirmed GABHS tonsillitis [D0028-REGULATORY-LIMITS]. Untreated GABHS carries serious risks of acute rheumatic fever and rheumatic heart disease.",
      },
      {
        question: "How does homeopathy integrate with standard pediatric and ENT throat care?",
        answer:
          "Homeopathy serves as complementary symptomatic support while patients remain under standard medical testing (RADT), antibiotic protocols when positive, and ENT surgical evaluation if indicated [D0028-REGULATORY-LIMITS].",
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
    specialty: "ENT & Clinical Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Tonsillitis", "Disease", "IDSA-2012", "ENT", "GABHS", "Quinsy-Safety", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/tonsillitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Tonsillitis profile",
    "1.1.0: Upgraded with IDSA 2012 evidence citations (CIT-0056), passage-level claim citations (D0028-KEYNOTES, D0028-EMERGENCY-LIMITS, D0028-REGULATORY-LIMITS), peritonsillar abscess / airway red flags, and GABHS antibiotic safety boundaries",
  ],
};
