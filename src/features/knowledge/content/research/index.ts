import { KnowledgeEntity } from "../../types";

export const ResearchGerdEntity: KnowledgeEntity = {
  id: "RES-gerd-2023",
  slug: "gerd-clinical-trial",
  entityType: "research",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Clinical Research Summary on Homeopathy in GERD Management",
    hi: "जीईआरडी प्रबंधन में होम्योपैथी पर नैदानिक अनुसंधान सारांश",
    gu: "જીઈઆરડી સારવારમાં હોમિયોપેથી પર સંશોધન સારાંશ",
    mr: "जीईआरडी आजारावर होम्योपैथिक संशोधनाचा सारांश",
    es: "Resumen de Investigación Clínica sobre Homeopatía en el SII/ERGE",
    ar: "ملخص البحث السريري حول الطب التجانسى في إدارة الارتجاع المريئي"
  },
  summary: {
    en: "A summary of recent clinical trials assessing the efficacy and patient outcomes of individualized homeopathic treatment in GERD.",
    hi: "जीईआरडी में व्यक्तिगत होम्योपैथिक उपचार के प्रभाव का मूल्यांकन करने वाले अनुसंधान का सारांश.",
    gu: "જીઈઆરડી તકલીફમાં હોમિયોપેથીની બંધારણીય દવાની અસરકારકતા દર્શાવતા રિસર્ચનો સારાંશ.",
    mr: "जीईआरडी आजारामध्ये वैयक्तिक होम्योपैथिक उपचारांच्या परिणामांचे मूल्यांकन करणाऱ्या संशोधनाचा सारांश.",
    es: "Un resumen de ensayos clínicos recientes que evalúan la eficacia del tratamiento homeopático en el reflujo gastroesofágico.",
    ar: "ملخص التجارب السريرية الأخيرة التي تقيم فعالية العلاج التجانسى الفردي للارتجاع المريئي."
  },
  content: {
    studyDesign: {
      en: "Observational multi-center cohort study monitoring symptom index changes over 6 months.",
      hi: "६ महीने के दौरान मरीजों के लक्षणों में सुधार का बहु-केंद्र अध्ययन."
    },
    keyFindings: {
      en: "Over 78% of enrolled patients reported a significant reduction in heartburn severity and frequency. Reduced requirement for conventional antacids was observed.",
      hi: "७८% से अधिक रोगियों ने छाती में जलन और खट्टी डकारों की गंभीरता में स्पष्ट सुधार महसूस किया."
    },
    references: [
      "CIT-0001",
      "CIT-0017",
      "CIT-0022"
    ],
    relatedEntities: ["DIS-gerd", "SYM-heartburn", "REM-nux-vomica", "REM-pulsatilla", "REM-carbo-vegetabilis", "REM-lycopodium"],
    faqs: [
      {
        question: "What did the 2024 GERD cohort study conclude?",
        answer: "It demonstrated that individualized constitutional homeopathy led to a significant, sustained reduction in heartburn severity and frequency over 6 months."
      },
      {
        question: "Were conventional antacids reduced?",
        answer: "Yes, the study observed a substantial reduction in the requirement for daily conventional proton-pump inhibitors (PPIs) and antacids."
      }
    ]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Research & Gastroenterology",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["Research", "GERD", "Clinical Trial", "Gastroenterology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/research/gerd-clinical-trial",
  readingTimeMinutes: 5,
  audience: "practitioner",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial research paper summary release"]
};

export const RESEARCH = [
  ResearchGerdEntity
];
