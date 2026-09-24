import { KnowledgeEntity } from "../../types";

export const MenstrualIrregularitySymptom: KnowledgeEntity = {
  id: "S0051",
  slug: "menstrual-irregularity",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-23T21:30:00Z",
    reviewed: "2026-09-23T21:30:00Z"
  },
  title: {
    en: "Menstrual Irregularity",
    hi: "Menstrual Irregularity",
    gu: "Menstrual Irregularity",
    mr: "Menstrual Irregularity",
    es: "Menstrual Irregularity",
    ar: "Menstrual Irregularity"
  },
  summary: {
    en: "Periods can vary, especially around puberty and menopause. Learn what counts as an irregular pattern, what can contribute, and when to arrange medical advice.",
    hi: "Menstrual Irregularity के लक्षण की नैदानिक समझ.",
    gu: "Menstrual Irregularity ના લક્ષણ ની સમજણ.",
    mr: "Menstrual Irregularity चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Menstrual Irregularity.",
    ar: "التعريف السريري والأهمية لـ Menstrual Irregularity."
  },
  content: {
  definition: "Menstrual irregularity means your periods have changed from their usual timing, duration or pattern. For many adults, a gap of less than 21 days or more than 35 days is considered irregular, but normal patterns vary with age and life stage.",
  clinicalMeaning: "An irregular cycle is not automatically PCOS. Puberty, perimenopause, pregnancy, contraception, stress, major weight change, thyroid conditions and other health factors can all affect periods.",
  "commonCauses": [
    "Puberty, perimenopause, pregnancy, breastfeeding or hormonal contraception",
    "Stress, anxiety, major weight change or a high level of exercise",
    "PCOS, thyroid conditions or another hormone-related condition",
    "Some medicines or an underlying health condition"
  ],
  differentialDiagnosis: "A clinician may ask about your usual pattern, pregnancy possibility, contraception, weight and stress changes, medicines and related symptoms. Blood tests or other assessment are considered when the history suggests they are needed.",
  "redFlags": [
    "Get urgent help for very heavy bleeding with fainting, severe pelvic pain, shoulder-tip pain, dizziness, or a possible pregnancy.",
    "Arrange prompt medical advice for bleeding between periods, after sex or after menopause, or for periods lasting more than 7 days.",
    "See a clinician if you miss three periods in a row, your usual pattern changes, or irregular periods are affecting fertility or daily life."
  ],
  lifestyleAdvice: "Track the first day of each period, the length of bleeding and any pain, bleeding between periods, acne, hair changes or mood symptoms. A calendar or app can make a pattern easier to discuss. Avoid self-starting hormonal or complementary medicines for unexplained bleeding; seek care promptly for the warning signs above.",
  references: ["CIT-0139", "CIT-0140"],
  faqs: [
    {
      question: "Are irregular periods always a sign of PCOS?",
      answer: "No. PCOS is one possible cause, but irregular periods can also occur with puberty, perimenopause, pregnancy, contraception, stress, weight changes, thyroid conditions and other factors."
    },
    {
      question: "What should I track before an appointment?",
      answer: "Track cycle dates, bleeding days, bleeding between periods, pain, pregnancy possibility, contraception, medicines, weight changes and symptoms such as acne, hair changes or tiredness."
    },
    {
      question: "When should I get urgent help?",
      answer: "Get urgent help for very heavy bleeding with fainting, severe pelvic pain, shoulder-tip pain, dizziness, or possible pregnancy. Seek prompt care for bleeding between periods, after sex or after menopause."
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
  tags: ["Menstrual Irregularity", "Periods", "Cycle Tracking", "Reproductive Health", "Symptom"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/menstrual-irregularity",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Menstrual Irregularity symptom profile", "1.2.0: Rewritten as a patient-first guide with cycle tracking and clear care-seeking boundaries."]
};
