import { KnowledgeEntity } from "../../types";

export const IbsDisease: KnowledgeEntity = {
  id: "D0004",
  slug: "ibs",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-09-24T12:00:00Z",
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
    en: "IBS can cause recurring tummy pain with constipation, diarrhoea, or both. Learn how to notice patterns, support day-to-day symptoms, and recognise signs that need medical review.",
    hi: "इरिटेबल बॉवेल सिंड्रोम (IBS) का ACG 2021 रोम IV मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "IBS નું ACG 2021 રોમ IV ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "आय.बी.एस. चे ACG 2021 रोम IV निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado del Síndrome del Intestino Irritable según los criterios ACG 2021 y límites de emergencia.",
    ar: "دليل سريري موثوق لمتلازمة القولون العصبي وفقًا لمعايير ACG 2021 وحدود السلامة.",
  },
  content: {
    overview:
      "Irritable bowel syndrome (IBS) is a common condition that affects how the gut works. It can cause recurring tummy pain with a change in bowel habits, such as constipation, diarrhoea, or both. IBS is real and can be disruptive, but it does not damage the bowel; new warning signs still need assessment.",
    definition:
      "IBS is a disorder of gut–brain interaction: the bowel can be more sensitive and its movement can change. People may describe IBS with constipation, diarrhoea, or a mixed pattern.",
    causes: [
      "A sensitive gut–brain connection and changes in bowel movement",
      "A past stomach or bowel infection in some people",
      "Individual food patterns, stress, sleep disruption or hormonal changes that can trigger symptoms",
    ],
    riskFactors: [
      "A previous bowel infection or a family history of IBS",
      "Stress, anxiety, poor sleep or ongoing life disruption",
      "A change in routine, diet, medicines or hormonal cycle that clearly tracks with symptoms",
    ],
    symptoms: [
      "Recurring tummy pain or cramps that may improve or worsen after opening the bowels",
      "Constipation, diarrhoea, or switching between the two",
      "Bloating, wind, mucus, urgency or the feeling that the bowel has not fully emptied",
    ],
    diagnosis:
      "A clinician can often diagnose IBS from the symptom pattern and examination. They may arrange targeted tests to rule out conditions such as coeliac disease or inflammatory bowel disease when symptoms, age, family history or warning signs make that appropriate.",
    differentialDiagnosis:
      "Differentiate IBS from Inflammatory Bowel Disease (Crohn's Disease, Ulcerative Colitis), Celiac Disease, Microscopic Colitis, Endometriosis, Chronic Pancreatitis, and Colorectal Cancer.",
    conventionalManagement:
      "Treatment is tailored to the main pattern—pain, constipation, diarrhoea or bloating. It may include practical food changes, soluble fibre, medicines for specific symptoms, and gut-directed psychological therapies. A structured low-FODMAP trial should be supported by an experienced clinician or dietitian rather than becoming a long-term restrictive diet.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for IBS. It must not replace assessment of bleeding, weight loss, fever, severe pain or persistent change in bowel habits. Anyone considering complementary care should keep their clinician informed.",
    lifestyleAdvice:
      "Keep a simple symptom-and-food diary for a few weeks to spot personal patterns without blaming every food. Eat regular meals, drink enough fluid, build activity and sleep into the routine, and seek dietitian support before making a restrictive diet change.",
    references: ["CIT-0017", "CIT-0018", "CIT-0022", "CIT-0054"],
    faqs: [
      {
        question: "When do bowel symptoms need prompt medical review?",
        answer:
          "Blood in the stool or black stools, unexplained weight loss, fever, vomiting, severe or worsening pain, dehydration, or diarrhoea that wakes you from sleep need prompt clinical advice. Sudden severe pain, fainting or signs of serious illness need urgent emergency assessment.",
      },
      {
        question: "Can homeopathy replace tests or prescribed IBS treatment?",
        answer:
          "No. Complementary products should never delay tests or treatment recommended to rule out another cause of bowel symptoms. Discuss them with your clinician, especially if you use regular medicines.",
      },
      {
        question: "What is a useful first step for IBS?",
        answer:
          "Track symptoms, food, sleep and stress briefly, then review the pattern with a clinician or dietitian. This is more useful than starting several restrictive diets or supplements at once.",
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
  lastClinicalReview: "2026-09-24",
  nextClinicalReview: "2027-09-24",
  evidenceLevel: "Consensus-Guidance",
  tags: ["IBS", "Disease", "ACG-2021", "Rome-IV", "Gastroenterology", "Low-FODMAP", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/ibs",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of IBS profile",
    "1.1.0: Upgraded with ACG 2021 Rome IV evidence citations (CIT-0054), passage-level claim citations (D0004-KEYNOTES, D0004-EMERGENCY-LIMITS, D0004-REGULATORY-LIMITS), nocturnal diarrhea / hematochezia red flags, and celiac/IBD diagnostic boundaries",
    "1.2.0: Patient-first rewrite with clearer self-management and investigation boundaries",
  ],
};
