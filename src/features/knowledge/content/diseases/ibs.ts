import { KnowledgeEntity } from "../../types";

export const IbsDisease: KnowledgeEntity = {
  id: "D0004",
  slug: "ibs",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Irritable Bowel Syndrome (IBS)",
    hi: "इरिटेबल बॉवेल सिंड्रोम (IBS)",
    gu: "સંગ્રહણી અને આંતરડાની નબળાઈ (IBS)",
    mr: "आय.बी.एस. (Irritable Bowel Syndrome)",
    es: "Síndrome del Intestino Irritable (SII)",
    ar: "متلازمة القولون العصبي (IBS)",
  },
  summary: {
    en: "An authoritative clinical profile of Irritable Bowel Syndrome covering ACG 2021 Rome IV guidelines, gut-brain axis motility mechanisms, nocturnal diarrhea red flags, and organic GI disease safety boundaries.",
    hi: "इरिटेबल बॉवेल सिंड्रोम (IBS) का ACG 2021 रोम IV मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "IBS નું ACG 2021 રોમ IV ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "आय.बी.एस. चे ACG 2021 रोम IV निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del Síndrome del Intestino Irritable según los criterios ACG 2021 y límites de emergencia.",
    ar: "دليل سريري موثوق لمتلازمة القولون العصبي وفقًا لمعايير ACG 2021 وحدود السلامة.",
  },
  content: {
    overview:
      "Irritable Bowel Syndrome (IBS) is a functional gastrointestinal disorder characterized by recurrent abdominal pain related to defecation or changes in stool frequency/form, without structural mucosal abnormalities [D0004-KEYNOTES, CIT-0054]. ACG 2021 guidelines emphasize Rome IV diagnostic criteria.",
    definition:
      "A disorder of gut-brain interaction involving altered intestinal motility, visceral hypersensitivity, low-grade mucosal immune activation, and dysregulated stool transit (IBS-C, IBS-D, IBS-M).",
    causes: [
      "Visceral hypersensitivity and altered central processing of gut stimuli along the brain-gut axis [D0004-KEYNOTES, CIT-0054]",
      "Post-infectious GI changes following acute gastroenteritis (Post-Infectious IBS)",
      "Intestinal dysbiosis, altered bile acid metabolism, and dietary FODMAP intolerance",
    ],
    riskFactors: [
      "Young age (<50 years), female sex, and personal history of acute bacterial gastroenteritis",
      "Chronic psychosocial stress, generalized anxiety disorder, and childhood adverse events",
      "Frequent broad-spectrum antibiotic usage altering gut microbiome architecture",
    ],
    symptoms: [
      "Recurrent abdominal pain occurring on average at least 1 day per week in the last 3 months [D0004-KEYNOTES, CIT-0054]",
      "Pain associated with defecation, change in frequency of stool, or change in appearance of stool",
      "Abdominal distension, bloating, passage of mucus, and feeling of incomplete bowel evacuation",
    ],
    diagnosis:
      "Diagnosed via Rome IV criteria without invasive testing in young patients (<50 years) lacking alarm features. Screening includes CBC, serologic testing for Celiac Disease (tTG IgA), and fecal calprotectin/CRP to exclude IBD [CIT-0054].",
    differentialDiagnosis:
      "Differentiate IBS from Inflammatory Bowel Disease (Crohn's Disease, Ulcerative Colitis), Celiac Disease, Microscopic Colitis, Endometriosis, Chronic Pancreatitis, and Colorectal Cancer.",
    conventionalManagement:
      "Management includes a low-FODMAP dietary plan, soluble fiber (psyllium), antispasmodics (dicyclomine, hyoscyamine), gut-targeted antibiotics (rifaximin for IBS-D), secretagogues (linaclotide for IBS-C), and gut-brain neuromodulators (tricyclics/SSRIs) [CIT-0054].",
    homeopathicApproach:
      "Homeopathic remedies (such as Nux Vomica, Lycopodium, Colocynthis, Argentum Nitricum, Aloe Socotrina) serve as supportive constitutional care to ease abdominal cramping, regulate bowel habits, and soothe stress-triggered digestive spasms alongside dietary modification.",
    lifestyleAdvice:
      "Follow a structured low-FODMAP diet under dietitian guidance, engage in regular aerobic exercise, practice gut-directed hypnotherapy or CBT, and maintain consistent meal schedules.",
    references: ["CIT-0017", "CIT-0018", "CIT-0022", "CIT-0054"],
    faqs: [
      {
        question: "When do bowel symptoms in suspected IBS require urgent diagnostic evaluation or emergency care?",
        answer:
          "Nocturnal diarrhea that wakes you from sleep, visible rectal bleeding (hematochezia/melena), unexplained weight loss, fever, or severe acute abdominal pain is an ALARM SIGNAL [D0004-EMERGENCY-LIMITS, CIT-0054]. These symptoms rule out simple IBS and require PROMPT GASTROENTEROLOGY EVALUATION / COLONOSCOPY.",
      },
      {
        question: "Can homeopathic remedies replace diagnostic testing for celiac disease or colon cancer?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace essential celiac screening, fecal inflammatory markers, or diagnostic colonoscopy [D0004-REGULATORY-LIMITS]. Delaying evaluation in patients with alarm features risks missing inflammatory bowel disease or colorectal malignancy.",
      },
      {
        question: "How does homeopathy integrate with standard low-FODMAP dietary therapy for IBS?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard dietary guidance, gastroenterological supervision, and routine screening [D0004-REGULATORY-LIMITS].",
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
  tags: ["IBS", "Disease", "ACG-2021", "Rome-IV", "Gastroenterology", "Low-FODMAP", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/ibs",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of IBS profile",
    "1.1.0: Upgraded with ACG 2021 Rome IV evidence citations (CIT-0054), passage-level claim citations (D0004-KEYNOTES, D0004-EMERGENCY-LIMITS, D0004-REGULATORY-LIMITS), nocturnal diarrhea / hematochezia red flags, and celiac/IBD diagnostic boundaries",
  ],
};
