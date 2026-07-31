import { KnowledgeEntity } from "../../types";

export const AsthmaDisease: KnowledgeEntity = {
  id: "D0007",
  slug: "asthma",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Asthma",
    hi: "अस्थमा / दमा (Asthma)",
    gu: "અસ્થમા / દમ (Asthma)",
    mr: "दमा (Asthma)",
    es: "Asma (Asthma)",
    ar: "الربو (Asthma)",
  },
  summary: {
    en: "An evidence-based clinical guide to Asthma, emphasizing GINA 2023 guidelines, emergency status asthmaticus red flags, and strict non-replacement safety boundaries.",
    hi: "अस्थमा का साक्ष्य-आधारित नैदानिक विवरण, जिसमें GINA 2023 दिशानिर्देश एवं आपातकालीन सीमाएं शामिल हैं।",
    gu: "અસ્થમાનું પુરાવા-આધારિત તબીબી માર્ગદર્શન અને ઈમરજન્સી લાલ નિશાનો.",
    mr: "दम्याचे वैद्यकीय मार्गदर्शन आणि आणीबाणीच्या सुरक्षिततेच्या मर्यादा.",
    es: "Una guía clínica basada en evidencia sobre el asma con límites de seguridad de emergencia.",
    ar: "دليل سريري قائم على الأدلة لمرض الربو مع حدود السلامة الطارئة.",
  },
  content: {
    overview:
      "Asthma is a chronic inflammatory disorder of the lower airways characterized by variable airflow limitation, bronchial hyper-responsiveness, mucosal edema, and bronchospasm. Global clinical management is guided by GINA 2023 evidence standards [CIT-0037].",
    definition:
      "A heterogenous lower respiratory disease marked by recurrent wheezing, shortness of breath, chest tightness, and cough that vary over time and in intensity, alongside variable expiratory airflow limitation.",
    causes: [
      "IgE-mediated bronchial smooth muscle hyper-responsiveness to environmental triggers (dust mites, pollen, pet dander)",
      "Airway inflammation and remodeling driven by Type 2 helper T-cell (Th2) cytokine cascades (IL-4, IL-5, IL-13)",
      "Viral respiratory infections (rhinovirus, RSV) triggering acute exacerbations",
      "Occupational sensitizers, cold air, exercise, and NSAID-exacerbated respiratory disease (NERD)",
    ],
    riskFactors: [
      "Personal or family history of atopic diseases (eczema, allergic rhinitis)",
      "Early childhood exposure to secondhand tobacco smoke or air pollution",
      "Recurrent severe viral lower respiratory tract infections in early life",
      "Occupational exposure to chemical fumes or organic dusts",
    ],
    symptoms: [
      "Recurrent episodic wheezing during expiration [D0007-KEYNOTES]",
      "Shortness of breath (dyspnea) worsening at night or early morning",
      "Chest tightness and dry nocturnal coughing spasms",
      "Exertional breathlessness triggered by physical exercise or cold air",
    ],
    diagnosis:
      "Confirmed via spirometry demonstrating reversible airflow obstruction (FEV1 increase >12% and >200 mL post-bronchodilator), peak expiratory flow (PEF) variability >10%, and fractional exhaled nitric oxide (FeNO) testing [CIT-0037].",
    differentialDiagnosis:
      "Differentiate asthma from COPD, vocal cord dysfunction, congestive heart failure, pulmonary embolism, foreign body aspiration, and bronchiectasis.",
    conventionalManagement:
      "First-line management follows GINA 2023 guidelines: inhaled corticosteroid (ICS)-formoterol track for maintenance and reliever therapy, SABA bronchodilators for acute symptoms, leukotriene receptor antagonists, and biologic therapies (anti-IgE, anti-IL5) for severe refractory asthma [CIT-0037].",
    homeopathicApproach:
      "Homeopathic prescribing aims to complement overall patient presprescribings and reduce constitutional sensitivity in chronic stable phases. Homeopathy does NOT replace acute pharmaceutical bronchodilators [D0007-HOMEOPATHY-LIMITS, CIT-0023].",
    lifestyleAdvice:
      "Use peak flow meters to monitor diurnal PEFR variability, avoid known environmental triggers, utilize HEPA air filtration, maintain up-to-date influenza/pneumococcal vaccinations, and follow an individualized Asthma Action Plan.",
    emergencyRedFlags: [
      "Status asthmaticus: acute severe asthma exacerbation unresponsive to reliever inhalers [D0007-EMERGENCY-LIMITS]",
      "Peak Expiratory Flow Rate (PEFR) < 30% of predicted or personal best",
      "Silent chest: absence of audible breath sounds or wheezing due to severe airflow limitation",
      "Central cyanosis (bluish lips or fingernails), intercostal retractions, and inability to speak in complete sentences",
      "Altered mental status, confusion, drowsiness, or exhaustion during a respiratory attack",
    ],
    references: ["CIT-0037", "CIT-0023", "CIT-0024"],
    faqs: [
      {
        question: "Can homeopathic remedies replace inhaled asthma medication during an acute attack?",
        answer:
          "No. Acute asthma exacerbations and status asthmaticus are life-threatening emergencies requiring immediate conventional emergency bronchodilators, inhaled corticosteroids, and oxygen therapy. Homeopathy must never delay emergency medical care [D0007-EMERGENCY-LIMITS, CIT-0023].",
      },
      {
        question: "What are the key clinical diagnostic criteria for asthma under GINA guidelines?",
        answer:
          "GINA guidelines require a history of variable respiratory symptoms (wheeze, shortness of breath, cough) combined with objective evidence of variable expiratory airflow limitation, typically confirmed by spirometry reversibility testing [CIT-0037].",
      },
      {
        question: "How does constitutional homeopathic care complement chronic asthma management?",
        answer:
          "In stable non-emergency phases, individual constitutional prescribing under professional medical supervision aims to address general patient susceptibility, provided all conventional controller medications are maintained according to the patient's Asthma Action Plan [CIT-0023].",
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
    specialty: "Clinical Homeopathy & Pulmonology",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Asthma", "Disease", "Pulmonology", "GINA-2023", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/asthma",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Asthma profile",
    "1.1.0: Upgraded with GINA 2023 guidelines (CIT-0037), status asthmaticus emergency red flag boundaries, and explicit conventional care non-replacement rules",
  ],
};
