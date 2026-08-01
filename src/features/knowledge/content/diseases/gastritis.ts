import { KnowledgeEntity } from "../../types";

export const GastritisDisease: KnowledgeEntity = {
  id: "D0008",
  slug: "gastritis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Gastritis",
    hi: "गैस्ट्र्रिटिस / पेट की सूजन (Gastritis)",
    gu: "ગેસ્ટ્રાઇટિસ (Gastritis)",
    mr: "गॅस्ट्रोबायटिस (Gastritis)",
    es: "Gastritis",
    ar: "التهاب المعدة",
  },
  summary: {
    en: "An authoritative clinical profile of Gastritis covering ACG 2021 diagnostic guidelines, H. pylori vs NSAID-induced etiologies, upper GI hemorrhage emergency red flags, and endoscopy non-delay boundaries.",
    hi: "गैस्ट्र्रिटिस का ACG 2021 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "ગેસ્ટ્રાઇટિસનું ACG 2021 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "गॅस्ट्रोबायटिसचे ACG 2021 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Gastritis según los criterios ACG 2021 y límites de emergencia.",
    ar: "دليل سريري موثوق لالتهاب المعدة وفقًا لمعايير ACG 2021 وحدود السلامة.",
  },
  content: {
    overview:
      "Gastritis is defined as inflammation of the gastric mucosal lining confirmed histologically or endoscopically [D0008-KEYNOTES, CIT-0044]. It ranges from acute erosive hemorrhagic gastropathy to chronic Helicobacter pylori or autoimmune gastritis.",
    definition:
      "A histologically or endoscopically documented inflammatory mucosal breakdown of the stomach wall induced by bacterial infection, chemical irritants, or autoantibodies.",
    causes: [
      "Helicobacter pylori bacterial colonization causing chronic antral or pangastritis [D0008-KEYNOTES, CIT-0044]",
      "Chronic nonsteroidal anti-inflammatory drug (NSAID) or aspirin use disrupting protective mucosal prostaglandins",
      "Excessive alcohol intake, heavy smoking, severe physiological stress (stress ulcers), or autoimmune parietal cell antibodies",
    ],
    riskFactors: [
      "Frequent or unmonitored use of NSAIDs, corticosteroids, or anticoagulants",
      "Untreated H. pylori infection, chronic alcohol ingestion, and high physiological stress",
      "Autoimmune conditions (e.g. Hashimoto's thyroiditis, Type 1 diabetes) predisposing to autoimmune gastritis",
    ],
    symptoms: [
      "Epigastric gnawing or burning pain, early satiety, postprandial fullness, and nausea [D0008-KEYNOTES, CIT-0044]",
      "Abdominal distension, belching, regurgitation, and anorexia",
      "Erosive gastropathy symptoms: Occult blood loss, microcytic anemia, or hematemesis",
    ],
    diagnosis:
      "Diagnosed via Esophagogastroduodenoscopy (EGD) with mucosal biopsy, H. pylori urea breath test or stool antigen assay, and serum anti-parietal cell antibody panels [CIT-0044].",
    differentialDiagnosis:
      "Differentiate Gastritis from Peptic Ulcer Disease (PUD), GERD, Functional Dyspepsia, Cholecystitis, Pancreatitis, and Gastric Adenocarcinoma.",
    conventionalManagement:
      "Management involves proton pump inhibitors (PPIs), H2-receptor antagonists, sucralfate mucosal protectants, discontinuing offending NSAIDs, and quad-therapy antibiotic regimens for H. pylori eradication [CIT-0044].",
    homeopathicApproach:
      "Homeopathic remedies (such as Nux Vomica, Arsenicum Album, Phosphorus, Lycopodium) act as supportive care to soothe burning epigastric discomfort, balance digestive acidity, and improve dietary tolerance alongside gastroenterological evaluation.",
    lifestyleAdvice:
      "Avoid NSAIDs, alcohol, smoking, and highly spiced or greasy foods; eat small, regular meals; maintain adequate hydration; and manage chronic stress.",
    references: ["CIT-0017", "CIT-0018", "CIT-0022", "CIT-0044"],
    faqs: [
      {
        question: "When is Gastritis considered a gastroenterological emergency requiring immediate hospitalization?",
        answer:
          "Hematemesis (vomiting frank blood or 'coffee-ground' material), melena (black tarry stools), acute severe epigastric agony, dizziness with hypotension, or persistent uncontrollable vomiting indicates ACUTE UPPER GI HEMORRHAGE OR PERFORATION [D0008-EMERGENCY-LIMITS, CIT-0044]. This is a MEDICAL EMERGENCY requiring IMMEDIATE ER evaluation.",
      },
      {
        question: "Can homeopathic remedies replace endoscopy or antibiotic H. pylori eradication therapy?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace diagnostic upper endoscopy in red-flag cases or delay prescribed antibiotic eradication therapy for H. pylori infection [D0008-REGULATORY-LIMITS]. Untreated H. pylori carries risks of peptic ulceration and gastric MALT lymphoma.",
      },
      {
        question: "How does homeopathy complement conventional gastritis treatment?",
        answer:
          "Homeopathy provides supportive constitutional care for symptomatic relief while patients remain under standard gastroenterology diagnostic and monitoring protocols [D0008-REGULATORY-LIMITS].",
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
    specialty: "Gastroenterology & Clinical Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Gastritis", "Disease", "ACG-2021", "Gastroenterology", "H-Pylori", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/gastritis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Gastritis profile",
    "1.1.0: Upgraded with ACG 2021 evidence citations (CIT-0044), passage-level claim citations (D0008-KEYNOTES, D0008-EMERGENCY-LIMITS, D0008-REGULATORY-LIMITS), upper GI hemorrhage red flags, and endoscopy non-delay rules",
  ],
};
