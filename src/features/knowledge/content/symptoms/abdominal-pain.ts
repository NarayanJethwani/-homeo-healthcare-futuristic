import { KnowledgeEntity } from "../../types";

export const AbdominalPainSymptom: KnowledgeEntity = {
  id: "S0012",
  slug: "abdominal-pain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-23T20:00:00Z",
    reviewed: "2026-09-23T20:00:00Z"
  },
  title: {
    en: "Abdominal Pain",
    hi: "पेट दर्द (Abdominal Pain)",
    gu: "પેટમાં દુખાવો (Abdominal Pain)",
    mr: "पोटदुखी (Abdominal Pain)",
    es: "Dolor Abdominal (Abdominal Pain)",
    ar: "ألم البطن (Abdominal Pain)"
  },
  summary: {
    en: "Belly pain is common and often settles, but its pattern matters. Learn what may be behind it, what to notice, and when pain needs urgent medical care.",
    hi: "पेट दर्द लक्षण की नैदानिक समझ और आपातकालीन चेतावनी लक्षण.",
    gu: "પેટમાં દુખાવાની તબીબી સમજણ અને ઈમરજન્સી રેડ ફ્લેગ્સ.",
    mr: "पोटदुखीच्या लक्षणांची वैद्यकीय माहिती आणि आपत्कालीन इशारे.",
    es: "El dolor abdominal es frecuente y a menudo mejora, pero su patrón importa.",
    ar: "التقييم السريري والتشخيص التفريقي وعلامات الخطر لألم البطن."
  },
  content: {
    definition: "Abdominal pain, often called stomach or belly pain, is discomfort anywhere between the chest and groin. It can feel crampy, sharp, burning, aching, or like pressure, and it may be short-lived or keep returning.",
    clinicalMeaning: "Pain intensity alone does not reliably show how serious the cause is. The location, timing, change over time, bowel or urine changes, vomiting, fever, pregnancy possibility and other symptoms help determine the right next step.",
    commonCauses: [
      "Indigestion, trapped wind, constipation, food intolerance, a stomach bug or food poisoning",
      "Irritable bowel syndrome or a recurring digestive pattern",
      "A urinary or kidney problem, period pain, pregnancy-related pain or another pelvic cause",
      "Appendicitis, gallstones, an ulcer, inflammation or a bowel blockage—conditions that may need prompt assessment"
    ],
    differentialDiagnosis: "A clinician may ask exactly where the pain is, whether it moves, when it started, its relation to meals or periods, and whether there is fever, vomiting, bleeding, bowel or urine change. Examination, urine, blood tests or imaging are used only when the pattern suggests they are needed.",
    redFlags: [
      "Get emergency help now for sudden or severe pain, a hard or very tender abdomen, chest pain, trouble breathing, fainting or collapse.",
      "Get emergency help for vomiting blood or coffee-ground-like material; blood in stool or black, tarry stool; or if you cannot pass stool or gas and are vomiting.",
      "Seek urgent advice if pain is worsening, keeps returning, lasts more than 24–48 hours, comes with fever or ongoing vomiting, or occurs in pregnancy or possible pregnancy."
    ],
    lifestyleAdvice: "For mild, familiar pain without warning signs, rest, sip fluids, and note what happened before it started. If you have recently been vomiting, begin with small amounts of bland food only once fluids are staying down. Avoid alcohol and avoid starting new pain medicines or remedies for unexplained pain without pharmacist or clinician advice. Do not self-diagnose if the pain is new, severe, worsening or unusual for you.",
    references: [
      "CIT-0133",
      "CIT-0134"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0012-001",
        passage: "Sudden or severe abdominal pain, a rigid or very tender abdomen, collapse, chest pain or breathing difficulty needs emergency assessment.",
        citationIds: ["CIT-0133", "CIT-0134"]
      },
      {
        claimId: "CLM-S0012-002",
        passage: "Vomiting blood, blood in stool or black tarry stool, or being unable to pass stool or gas while vomiting are emergency warning signs.",
        citationIds: ["CIT-0133", "CIT-0134"]
      },
      {
        claimId: "CLM-S0012-003",
        passage: "Abdominal pain can come from digestive, urinary, pelvic or other causes; the location, timing and accompanying symptoms guide clinical assessment.",
        citationIds: ["CIT-0133"]
      },
      {
        claimId: "CLM-S0012-004",
        passage: "A supportive or homeopathic consultation should not delay emergency assessment or treatment for severe, worsening or unexplained abdominal pain.",
        citationIds: ["CIT-0133"]
      }
    ],
    faqs: [
      {
        question: "What details should I notice about abdominal pain?",
        answer: "Note where it is, when it began, whether it moves, its relation to food or periods, and whether you have fever, vomiting, bowel changes, urine symptoms or bleeding. This is more useful than trying to name the cause yourself."
      },
      {
        question: "Can gas or indigestion cause abdominal pain?",
        answer: "Yes. Trapped wind, indigestion and constipation are common causes. However, a new pain, pain that is getting worse or recurring, or pain with warning signs should be assessed."
      },
      {
        question: "When should I get urgent help?",
        answer: "Get emergency help for sudden or severe pain, a hard or very tender abdomen, blood in vomit or stool, black stool, fainting, chest pain, breathing difficulty, or vomiting with inability to pass stool or gas."
      },
      {
        question: "Could abdominal pain be related to pregnancy?",
        answer: "It can be. Get urgent medical advice for pain during pregnancy or if pregnancy is possible, especially if pain is sudden, one-sided, severe, or comes with bleeding, dizziness or fainting."
      },
      {
        question: "Can homeopathy help with abdominal pain?",
        answer: "A clinician may discuss individual supportive options for a known, non-urgent pattern, but homeopathy should never delay diagnosis or emergency care for new, severe, worsening or unexplained pain."
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
    specialty: "Internal Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Consensus-Guidance",
  tags: ["Abdominal Pain", "Stomach Pain", "Digestive Health", "Symptom", "Urgent Care"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/abdominal-pain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Abdominal Pain symptom profile", "1.2.0: Rewritten as a patient-first guide with visual learning support, clearer causes and safety boundaries."]
};
