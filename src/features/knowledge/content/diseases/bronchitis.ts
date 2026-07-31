import { KnowledgeEntity } from "../../types";

export const BronchitisDisease: KnowledgeEntity = {
  id: "D0027",
  slug: "bronchitis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Acute & Chronic Bronchitis",
    hi: "ब्रोंकाइटिस / श्वासप्रणाली शोध (Bronchitis)",
    gu: "બ્રોન્કાઇટિસ / શ્વાસનળીનો સોજો (Bronchitis)",
    mr: "ब्रॉन्कायटिस / श्वासनलिका दाह (Bronchitis)",
    es: "Bronquitis Aguda y Crónica",
    ar: "التهاب الشعب الهوائية",
  },
  summary: {
    en: "An authoritative clinical profile of Acute and Chronic Bronchitis covering ERS 2020 guidelines, bronchial mucosal inflammatory mechanics, pneumonia/hemoptysis emergency red flags, and antibiotic stewardship boundaries.",
    hi: "ब्रोंकाइटिस का ERS 2020 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "બ્રોન્કાઇટિસનું ERS 2020 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "ब्रॉन्कायटिसचे ERS 2020 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Bronquitis según los criterios ERS 2020 y límites de emergencia.",
    ar: "دليل سريري موثوق لالتهاب الشعب الهوائية وفقًا لمعايير ERS 2020 وحدود السلامة.",
  },
  content: {
    overview:
      "Bronchitis is an inflammation of the bronchial mucous membranes characterized by cough, sputum production, and airway hyper-responsiveness [D0027-KEYNOTES, CIT-0055]. ERS 2020 guidelines distinguish self-limiting acute viral bronchitis from chronic bronchitis (COPD spectrum).",
    definition:
      "Acute or chronic inflammation of the tracheobronchial tree. Acute bronchitis is predominantly viral (90%+), while chronic bronchitis is defined by productive cough lasting ≥3 months/year for 2 consecutive years.",
    causes: [
      "Respiratory viral infections (Rhinovirus, Influenza A/B, Parainfluenza, RSV, Coronavirus) causing acute bronchial epithelial desquamation [D0027-KEYNOTES, CIT-0055]",
      "Cigarette smoking and chronic exposure to biomass smoke, industrial dusts, or air pollution (Chronic Bronchitis)",
      "Secondary bacterial superinfection (Streptococcus pneumoniae, Haemophilus influenzae, Moraxella catarrhalis)",
    ],
    riskFactors: [
      "Active or passive cigarette smoking and occupational toxic dust exposure",
      "Pre-existing asthma, COPD, gastroesophageal reflux (micro-aspiration), or immunodeficiency",
      "Extremes of age (young children and elderly adults >65 years)",
    ],
    symptoms: [
      "Persistent cough lasting 1 to 3 weeks, progressing from dry to mucoid or purulent sputum [D0027-KEYNOTES, CIT-0055]",
      "Substernal chest soreness aggravated by coughing, low-grade fever, and fatigue",
      "Expiratory wheezing, rhonchi clearing with cough, and mild exertional breathlessness",
    ],
    diagnosis:
      "Diagnosed clinically based on acute cough history (<3 weeks) without signs of consolidation. Pulse oximetry, chest radiography (to exclude pneumonia), and sputum cultures/spirometry are reserved for severe or chronic cases [CIT-0055].",
    differentialDiagnosis:
      "Differentiate Bronchitis from Pneumonia (fever >38°C, focal crackles, tachypnea, opacity on chest X-ray), Bronchial Asthma, Pertussis, GERD cough, and Heart Failure.",
    conventionalManagement:
      "Management of acute viral bronchitis focuses on symptomatic care (hydration, humidification, antitussives/expectorants, short-acting beta-agonists if wheezing). Routine antibiotics are strongly discouraged by ERS guidelines due to lack of efficacy and resistance risks [CIT-0055].",
    homeopathicApproach:
      "Homeopathic remedies (such as Antimonium Tartaricum, Bryonia Alba, Hepar Sulphuris, Drosera, Pulsatilla) act as supportive care to loosen tenacious mucus, soothe cough spasms, and ease chest soreness alongside rest and hydration.",
    lifestyleAdvice:
      "Avoid cigarette smoke and air pollutants, use cool-mist humidifiers, drink warm fluids, and rest. Wash hands frequently to prevent respiratory pathogen transmission.",
    references: ["CIT-0020", "CIT-0021", "CIT-0022", "CIT-0055"],
    faqs: [
      {
        question: "When does acute bronchitis indicate pneumonia or a severe respiratory emergency?",
        answer:
          "Severe shortness of breath, oxygen saturation <92%, coughing up blood (hemoptysis), high fever >39°C with chills, or confusion indicates PNEUMONIA OR ACUTE RESPIRATORY FAILURE [D0027-EMERGENCY-LIMITS, CIT-0055]. Seek IMMEDIATE EMERGENCY MEDICAL EVALUATION.",
      },
      {
        question: "Can homeopathic remedies replace oxygen therapy, hospitalization, or antibiotics in severe lung infections?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace supplemental oxygen, bacterial antibiotic therapy when indicated, or emergency hospital care for pneumonia [D0027-REGULATORY-LIMITS].",
      },
      {
        question: "How does homeopathy integrate with standard respiratory care for bronchitis?",
        answer:
          "Homeopathy serves as complementary symptomatic support while patients maintain adequate hydration, resting protocols, and pulmonology evaluation [D0027-REGULATORY-LIMITS].",
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
    specialty: "Pulmonology & Clinical Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Bronchitis", "Disease", "ERS-2020", "Pulmonology", "Antibiotic-Stewardship", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/bronchitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Bronchitis profile",
    "1.1.0: Upgraded with ERS 2020 evidence citations (CIT-0055), passage-level claim citations (D0027-KEYNOTES, D0027-EMERGENCY-LIMITS, D0027-REGULATORY-LIMITS), pneumonia / hemoptysis red flags, and antibiotic stewardship boundaries",
  ],
};
