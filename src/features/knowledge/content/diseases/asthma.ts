import { KnowledgeEntity } from "../../types";

export const AsthmaDisease: KnowledgeEntity = {
  id: "D0007",
  slug: "asthma",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-09-24T12:00:00Z",
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
    en: "Asthma can cause wheezing, cough, chest tightness, and shortness of breath that vary over time. Learn how an action plan and prescribed inhalers help, and when an asthma attack needs emergency care.",
    hi: "अस्थमा का साक्ष्य-आधारित नैदानिक विवरण, जिसमें GINA 2023 दिशानिर्देश एवं आपातकालीन सीमाएं शामिल हैं।",
    gu: "અસ્થમાનું પુરાવા-આધારિત તબીબી માર્ગદર્શન અને ઈમરજન્સી લાલ નિશાનો.",
    mr: "दम्याचे वैद्यकीय मार्गदर्शन आणि आणीबाणीच्या सुरक्षिततेच्या मर्यादा.",
    es: "Una guía clínica basada en evidencia sobre el asma con límites de seguridad de emergencia.",
    ar: "دليل سريري قائم على الأدلة لمرض الربو مع حدود السلامة الطارئة.",
  },
  content: {
    overview:
      "Asthma is a long-term condition in which the airways become sensitive and narrow at times, making breathing harder. Symptoms can change from day to day. With the right action plan and inhaler technique, most people can keep asthma well controlled.",
    definition:
      "Asthma causes episodes of wheeze, cough, chest tightness or breathlessness. These can be triggered by infections, allergies, exercise, cold air, smoke or other individual factors.",
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
      "Reliable clinical evidence has not established homeopathy as a treatment for asthma. It must not replace an asthma action plan, prescribed inhalers, or emergency care during an asthma attack [D0007-HOMEOPATHY-LIMITS, CIT-0023].",
    lifestyleAdvice:
      "Keep an up-to-date written asthma action plan, check inhaler technique regularly and carry your reliever as advised. Avoid smoke and known triggers where possible, but do not avoid normal activity—ask the asthma team how to exercise safely.",
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
        question: "Can homeopathy replace inhalers during an asthma attack?",
        answer:
          "No. Use the personal asthma action plan and reliever medicine exactly as prescribed. If symptoms are severe, worsening or not improving with the plan, seek emergency help immediately.",
      },
      {
        question: "When is an asthma attack an emergency?",
        answer:
          "Call emergency services if you are struggling to speak, very breathless, becoming exhausted or confused, have blue/grey lips, a silent chest, or your reliever is not helping as your action plan says it should.",
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
  lastClinicalReview: "2026-09-24",
  nextClinicalReview: "2027-09-24",
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
