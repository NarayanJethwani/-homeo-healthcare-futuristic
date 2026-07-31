import { KnowledgeEntity } from "../../types";

export const HemorrhoidsDisease: KnowledgeEntity = {
  id: "D0044",
  slug: "hemorrhoids",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Internal & External Hemorrhoids (Piles)",
    hi: "बवासीर / अर्श (Hemorrhoids / Piles)",
    gu: "હરસ અને મસા (Hemorrhoids / Piles)",
    mr: "मूळव्याध / मोड (Hemorrhoids / Piles)",
    es: "Hemorroides Internas y Externas",
    ar: "البواسير",
  },
  summary: {
    en: "An authoritative clinical profile of Internal and External Hemorrhoids covering ASCRS 2018 guidelines, vascular cushion engorgement mechanics, acute thrombosis and colorectal bleeding red flags, and colonoscopy safety boundaries.",
    hi: "बवासीर (Hemorrhoids) का ASCRS 2018 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "હરસ-મસાનું ASCRS 2018 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "मूळव्याधीचे ASCRS 2018 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de las Hemorroides según los criterios ASCRS 2018 y límites de emergencia.",
    ar: "دليل سريري موثوق للبواسير وفقًا لمعايير ASCRS 2018 وحدود السلامة.",
  },
  content: {
    overview:
      "Hemorrhoids are symptomatically enlarged vascular cushions located in the sub-mucosal lumen of the anal canal [D0044-KEYNOTES, CIT-0061]. ASCRS 2018 guidelines classify internal hemorrhoids (Grades I-IV) above the dentate line and external hemorrhoids distal to the dentate line.",
    definition:
      "Pathological engorgement, hyper-laxity, and displacement of normal anal cushions composed of arteriovenous plexuses, smooth muscle (Treitz's muscle), and connective tissue.",
    causes: [
      "Increased intra-abdominal pressure during prolonged straining from chronic constipation or low-fiber diet [D0044-KEYNOTES, CIT-0061]",
      "Venous engorgement during pregnancy, pelvic tumors, or portal hypertension (rectal varices)",
      "Degeneration of supportive fibroelastic connective tissue supporting anal vascular cushions with advancing age",
    ],
    riskFactors: [
      "Chronic constipation, inadequate dietary fiber, and prolonged sitting on the toilet",
      "Pregnancy, multiparity, and chronic heavy weight lifting",
      "Advancing age (45-65 years) and chronic diarrheal illness",
    ],
    symptoms: [
      "Painless bright red rectal bleeding coating the stool or dripping into the toilet bowl (Internal Hemorrhoids) [D0044-KEYNOTES, CIT-0061]",
      "Perianal itching (pruritus ani), mucus discharge, and sensation of rectal fullness or prolapse",
      "Acute perianal pain and tender purplish swelling (Thrombosed External Hemorrhoid)",
    ],
    diagnosis:
      "Diagnosed by visual inspection, digital rectal examination (DRE), and mandatory anoscopy or flexible sigmoidoscopy/colonoscopy in patients >45 years or those with alarm features to rule out colorectal malignancy [CIT-0061].",
    differentialDiagnosis:
      "Differentiate Hemorrhoids from Colorectal Cancer, Anal Fissure (excruciating knife-like pain during defecation), Anorectal Abscess / Fistula, Rectal Prolapse, and Inflammatory Bowel Disease.",
    conventionalManagement:
      "Management includes high-fiber diet (25-30g/day), increased water intake, sitz baths, topical hydrocortisone/phlebotonics, rubber band ligation (RBL for Grades I-III internal hemorrhoids), infrared coagulation, and surgical hemorrhoidectomy for Grade IV prolapsed or thrombosed hemorrhoids [CIT-0061].",
    homeopathicApproach:
      "Homeopathic remedies (such as Aesculus Hippocastanum, Aloe Socotrina, Nux Vomica, Hamamelis Virginiana, Nitricum Acidum) serve as supportive constitutional care to relieve venous congestion, soothe perianal soreness, and ease constipation alongside high-fiber dietary measures.",
    lifestyleAdvice:
      "Increase dietary fiber gradually, drink 2-3 liters of water daily, avoid sitting on the toilet for longer than 3-5 minutes, avoid straining during bowel movements, and take warm sitz baths.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0061"],
    faqs: [
      {
        question: "When does rectal bleeding or hemorrhoidal pain indicate a severe emergency or hidden cancer risk?",
        answer:
          "Excruciating perianal pain with a purplish tender lump (THROMBOSED EXTERNAL HEMORRHOID), dark maroon blood / black tarry melena, massive bleeding causing weakness or fainting, or strangulated prolapsed hemorrhoids with dark necrotic mucosa requires IMMEDIATE EMERGENCY SURGICAL / PROCTOLOGICAL EVALUATION [D0044-EMERGENCY-LIMITS, CIT-0061]. Rectal bleeding must NEVER be assumed to be hemorrhoids without proper medical exam.",
      },
      {
        question: "Can homeopathic remedies replace diagnostic colonoscopy or surgical excision for severe hemorrhoids?",
        answer:
          "NO. Homeopathy MUST NOT be used to replace diagnostic colonoscopy (essential to rule out colorectal cancer in bleeding patients) or surgical intervention for strangulated/thrombosed hemorrhoids [D0044-REGULATORY-LIMITS].",
      },
      {
        question: "How does homeopathy integrate with standard proctology care?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard fiber protocols, anoscopy evaluation, and proctological follow-up [D0044-REGULATORY-LIMITS].",
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
    specialty: "Proctology & Clinical Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Hemorrhoids", "Disease", "ASCRS-2018", "Proctology", "Piles", "Colonoscopy-Safety", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hemorrhoids",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Hemorrhoids profile",
    "1.1.0: Upgraded with ASCRS 2018 evidence citations (CIT-0061), passage-level claim citations (D0044-KEYNOTES, D0044-EMERGENCY-LIMITS, D0044-REGULATORY-LIMITS), acute thrombosis / colorectal bleeding red flags, and colonoscopy safety boundaries",
  ],
};
