import { KnowledgeEntity } from "../../types";

export const CaseStudyEczemaEntity: KnowledgeEntity = {
  id: "CAS-eczema-001",
  slug: "eczema-constitutional-recovery",
  entityType: "case-study",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Constitutional Homeopathic Management of Atopic Eczema",
    hi: "एटोपिक एक्जिमा का संवैधानिक होम्योपैथिक प्रबंधन - केस अध्ययन",
    gu: "એટોપિક એકઝીમાની બંધારણીય હોમિયોપેથિક સારવાર - કેસ સ્ટડી",
    mr: "एटोपिक एक्झिमाचे वैयक्तिक होम्योपैथिक व्यवस्थापन - केस स्टडी",
    es: "Manejo Homeopático Constitucional de un Caso de Eczema Crónico",
    ar: "الإدارة المثلية الدستورية لحالة التهاب الجلد التأتبي"
  },
  summary: {
    en: "A de-identified clinical case report demonstrating the step-wise recovery of chronic eczema using individualized prescribing of Sulphur.",
    hi: "सल्फर के व्यक्तिगत उपयोग द्वारा पुराने एक्जिमा के रोगी के चरण-दर-चरण सुधार को दर्शाने वाली नैदानिक केस रिपोर्ट.",
    gu: "સલ્ફર દવાની બંધારણીય પસંદગી દ્વારા જૂની ખંજવાળ અને ધાધરના કેસમાં ક્રમશઃ સુધારાનો અહેવાલ.",
    mr: "सल्फर या औषधाच्या वापराने जुनाट एक्झिमाच्या रुग्णामध्ये झालेल्या सुधारणेचा अहवाल.",
    es: "Un reporte clínico desidentificado que demuestra la recuperación gradual del eczema usando Sulphur.",
    ar: "تقرير حالة سريرية يوضح التعافي التدريجي للإكزيما المزمنة باستخدام دواء الكبريت."
  },
  content: {
    caseIntake: {
      en: "A 28-year-old male presented with dry, red, scaly patches on the flexures of elbows and knees. Intense itching, worse at night and from hot baths. Patient is hot-blooded, desires sweets, and dislikes warm rooms.",
      hi: "२८ वर्षीय पुरुष को कोहनी और घुटनों के जोड़ों पर सूखी, पपड़ीदार और लाल फुंसियां थीं, जिनमें रात को बिस्तर में बहुत खुजली होती थी."
    },
    repertorization: {
      en: "Repertorial analysis showed high mapping for Sulphur based on modalities: worse heat, worse bathing, burning soles of feet, and craving sweets.",
      hi: "लक्षणों के आधार पर सल्फर का चयन किया गया."
    },
    prescriptionAndFollowUp: {
      en: "Sulphur 200C single dose, followed by placebo. Over 12 weeks, eruptions subsided completely without suppressive topical steroids. Skin barrier restored.",
      hi: "सल्फर २००C की एक खुराक दी गई. १२ सप्ताह में चकत्ते पूरी तरह साफ हो गए."
    },
    references: [
      "CIT-0007",
      "CIT-0022"
    ],
    relatedEntities: ["DIS-eczema", "SYM-skin-eruptions", "REM-sulphur", "REM-graphites", "REM-hepar-sulphur", "REM-arsenicum-album"],
    faqs: [
      {
        question: "Why was Sulphur chosen for this eczema case?",
        answer: "Sulphur was chosen based on the characteristic modalities: intense itching aggravated by warmth and bathing, burning of soles, and thermal heat sensitivity."
      },
      {
        question: "How long did the skin barrier recovery take?",
        answer: "Complete clearance of eruptions and skin barrier restoration were achieved progressively over 12 weeks with a single dose of Sulphur 200C."
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
    specialty: "Clinical Repertory & Constitutional Prescribing",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Clinical-Experience",
  tags: ["Case Study", "Eczema", "Sulphur", "Skin", "Constitutional"],
  canonicalUrl: "https://homeo.healthcare/knowledge/case-studies/eczema-constitutional-recovery",
  readingTimeMinutes: 6,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial publication of Eczema clinical case report"]
};

export const CASE_STUDIES = [
  CaseStudyEczemaEntity
];
