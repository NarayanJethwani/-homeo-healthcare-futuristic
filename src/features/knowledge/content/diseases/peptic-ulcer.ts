import { KnowledgeEntity } from "../../types";

export const PepticUlcerDisease: KnowledgeEntity = {
  id: "D0049",
  slug: "peptic-ulcer",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Peptic Ulcer",
    hi: "पेप्टिक अल्सर / पेट व आंत का छाला (Peptic Ulcer Disease)",
    gu: "પેપ્ટીક અલ્સર / પેટ અને આંતરડાના ચાંદા (Peptic Ulcer Disease)",
    mr: "पेप्टिक अल्सर / पोटातील व्रण व अल्सर (Peptic Ulcer Disease)",
    es: "Úlcera Péptica (Úlcera Gástrica y Duodenal)",
    ar: "مرض القرحة الهضمية (Peptic Ulcer Disease)"
  },
  summary: {
    en: "A peptic ulcer is a sore in the stomach or upper small intestine, most often linked to H. pylori infection or anti-inflammatory pain medicines. Learn when testing and treatment are needed and the bleeding or perforation warning signs.",
    hi: "पेप्टिक अल्सर (पेट व ग्रहणी के छाले) का हेलिकोबैक्टर पाइलोरी पैथोलॉजी, दर्द निवारक दवाओं (NSAIDs) से म्यूकोसल क्षति, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और अल्सर फटने (परफोरेशन) व खून की उल्टी (हेमाटेमेसिस) की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "પેપ્ટીક અલ્સર (જઠર અને આંતરડાના ચાંદા) ની એચ. પાયલોરી બેક્ટેરિયલ પેથોલોજી, એસિડિટી અને બળતરા, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને હોજરી ફાટવા (પરફોરેશન) ની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "पेप्टिक अल्सर (पोटातील व लहान आतड्यातील अल्सर), पोटात जळजळ व तीव्र दुखणे, पारंपरिक होमिओपॅथिक पद्धत आणि अल्सर फुटून पोटात रक्तस्राव होण्याच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de la úlcera péptica que cubre la infección por H. pylori, toxicidad por AINEs, manejo homeopático complementario y banderas rojas de perforación y hemorragia digestiva alta.",
    ar: "دليل سريري وتعليمي موثوق لمرض القرحة الهضمية يغطي عدوى الملوية البوابية وأضرار مضادات الالتهاب غير الستيرويدية والرعاية التكميلية وعلامات الخطر للثقب الهضمي والنزيف الحاد."
  },
  content: {
    overview:
      "A peptic ulcer is a sore in the lining of the stomach or first part of the small intestine. Common causes are H. pylori infection and anti-inflammatory pain medicines such as ibuprofen or naproxen. It needs medical assessment because treatment is specific to the cause and bleeding or perforation can be serious.",
    definition:
      "It is a break in the protective lining of the stomach or duodenum (the first part of the small intestine).",
    causes: [
      "H. pylori, a common stomach infection.",
      "Anti-inflammatory pain medicines called NSAIDs, including ibuprofen and naproxen; aspirin can also contribute.",
      "Less commonly, another illness or medicine can be involved."
    ],
    riskFactors: [
      "Regular or high-dose NSAID use, especially with some other medicines that increase bleeding risk.",
      "A past ulcer or digestive bleeding, smoking, or older age.",
      "H. pylori infection."
    ],
    symptoms: [
      "Pain or discomfort in the upper tummy, feeling full early, nausea, bloating, or belching.",
      "The pain may be dull or burning and can vary with meals; some people have no symptoms until there is a complication.",
      "Vomiting blood, black stools, fainting, or sudden severe tummy pain are emergency warning signs."
    ],
    diagnosis:
      "Testing can include an H. pylori breath or stool test and, in some situations, an upper endoscopy. The clinician chooses tests based on your symptoms, age, medical history, and risk of complications.",
    differentialDiagnosis:
      "Differentiate Peptic Ulcer Disease from Functional Dyspepsia, Gastroesophageal Reflux Disease (GERD), Biliary Colic / Acute Cholecystitis, Acute or Chronic Pancreatitis, Gastric Malignancy, Mesenteric Ischemia, and Coronary Artery Disease (inferior wall myocardial infarction presenting as epigastric burning).",
    conventionalManagement:
      "Treatment usually includes medicine to reduce stomach acid and treatment for the underlying cause. H. pylori needs a clinician-prescribed course of medicine. If anti-inflammatory pain medicine contributed, a clinician can advise on a safer plan; do not stop prescribed aspirin, anticoagulants, or other medicines without asking.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for peptic ulcers. It must not replace H. pylori treatment, an endoscopy when advised, or emergency care for bleeding or a possible perforation.",
    lifestyleAdvice:
      "Avoid non-prescription anti-inflammatory pain medicines if they trigger or worsen symptoms, unless a clinician advises otherwise. Avoid smoking and heavy alcohol use. Food does not usually cause ulcers, but it can be sensible to avoid foods or drinks that clearly worsen your symptoms while you arrange care.",
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
        question: "When is possible ulcer pain an emergency?",
        answer: "Seek emergency care for vomiting blood or material that looks like coffee grounds, black or bloody stools, fainting or severe dizziness, a rapid heartbeat, or sudden severe tummy pain that does not go away."
      },
      {
        question: "Does spicy food cause peptic ulcers?",
        answer: "No. Spicy food may worsen discomfort for some people, but the common causes are H. pylori infection and NSAID pain medicines."
      },
      {
        question: "Can homeopathy treat an ulcer?",
        answer: "No. It should not replace testing, H. pylori treatment, prescribed medicines, or urgent assessment for bleeding or severe pain."
      }
    ],
    redFlags: [
      "Acute Perforated Peptic Ulcer: sudden, catastrophic, explosive epigastric pain rapidly spreading across the entire abdomen, accompanied by rigid 'board-like' abdominal wall, rebound tenderness, and subdiaphragmatic free air on upright abdominal X-ray (surgical emergency requiring emergency laparoscopy/laparotomy)",
      "Massive Upper Gastrointestinal Hemorrhage: vomiting frank bright red blood or dark 'coffee-ground' emesis (hematemesis), or passing dark, tarry, sticky foul-smelling stools (melena), accompanied by tachycardia, dizziness, or hypovolemic shock (requires emergency endoscopic hemostasis and blood resuscitation)",
      "Gastric Outlet Obstruction (GOO): intractable projectile vomiting of undigested food eaten hours earlier, severe weight loss, and visible abdominal peristalsis due to chronic pyloric cicatricial scarring"
    ]
  },
  claimCitations: [
    { claimId: "D0049-TRADITIONAL-PROFILE", statement: "Homeopathic peptic ulcer profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0049-TRADITIONAL-PROFILE" },
    { claimId: "D0049-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for H. pylori eradication, endoscopic clipping, or perforated ulcer surgery.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0049-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0049-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for gastrointestinal perforation, hematemesis, or hypovolemic shock.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Sudden explosive abdominal pain with board-like rigidity indicating acute gastrointestinal perforation requiring emergency surgery",
    "Hematemesis (vomiting blood) or melena (black tarry stool) with tachycardia and shock indicating massive upper GI hemorrhage",
    "Intractable vomiting and rapid weight loss indicating gastric outlet obstruction"
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
  tags: ["Peptic Ulcer Disease", "Gastric Ulcer", "Duodenal Ulcer", "PUD", "Disease", "Epigastric Pain", "H Pylori", "Dyspepsia", "Gastroenterology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/peptic-ulcer",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.2.0: Simplified causes, testing, treatment boundaries, and emergency signs for a patient-first path.", "1.1.0: Promoted to governed v1.1.0 with comprehensive gastroduodenal ulcer clinical boundaries, GI bleeding/perforation red flags, and verified citations"],
  clinicalPearl: "Every gastric ulcer visualized on endoscopy must be biopsied and followed to complete endoscopic healing to rigorously exclude early gastric adenocarcinoma.",
  quickFacts: {
    "Lifetime Prevalence": "Approximately 5% to 10% in the general population globally",
    "Primary System": "Gastrointestinal System (Gastroenterology / Upper GI)",
    "Diagnostic Standard": "Upper Endoscopy (Esophagogastroduodenoscopy / EGD) with Biopsy",
    "Clinical Character": "Acid-peptic mucosal defect in stomach or duodenum driven by H. pylori or NSAIDs"
  },
  aiReadiness: {
    retrievalSummary: "Peptic Ulcer Disease is an ulceration of the stomach or duodenal lining caused by H. pylori infection or NSAID use, presenting with burning epigastric pain, managed with supportive care, PPI acid suppression, and conventional antibiotic therapy.",
    clinicalSummary: "Peptic Ulcer Disease pathophysiology involves mucosal breakdown from H. pylori cytotoxins or NSAID COX-1 prostaglandin inhibition. Homeopathic remedies serve as supportive digestive care and do not replace emergency endoscopic hemostasis, surgery, or quadruple antibiotic therapy for active bleeding, perforation, or H. pylori infection.",
    patientSummary: "A peptic ulcer is a sore in the lining of the stomach or upper small intestine that causes burning stomach pain between meals or at night, heartburn, and bloating, usually caused by bacteria or painkiller medications.",
    studentSummary: "Caused primarily by H. pylori and NSAIDs. Differentiate gastric ulcer (pain worse with food) from duodenal ulcer (pain relieved by food, nocturnal pain). Red flags: perforation (board-like rigidity) and massive upper GI bleeding (hematemesis/melena).",
    keywords: ["peptic ulcer", "gastric ulcer", "duodenal ulcer", "pud", "stomach ulcer", "epigastric pain", "h pylori", "burning stomach"],
    semanticKeywords: ["acid peptic disease", "helicobacter pylori gastritis", "upper gastrointestinal ulceration"],
    icd: "K27.9",
    mesh: "D010437",
    bodySystem: "Gastroenterology",
    urgency: "routine"
  }
};
