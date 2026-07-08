import { KnowledgeEntity } from "../../types";

export const TshLabTest: KnowledgeEntity = {
  id: "L0002",
  slug: "tsh",
  entityType: "lab-test",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Thyroid Stimulating Hormone (TSH)",
    hi: "थायराइड उत्तेजक हार्मोन (टीएसएच)",
    gu: "થાઇરોઇડ હોર્મોન તપાસ (TSH)",
    mr: "थायरॉईड टेस्ट (TSH)",
    es: "Hormona Estimulante de la Tiroides (TSH)",
    ar: "هرمون الغدة الدرقية (TSH)"
  },
  summary: {
    en: "A diagnostic blood test measuring TSH levels to screen for thyroid dysfunction, including hypothyroidism (underactive) and hyperthyroidism (overactive).",
    hi: "एक रक्त जांच जो थायराइड ग्रंथि की कार्यप्रणाली का आकलन करने के लिए टीएसएच स्तर को मापती है.",
    gu: "લોહીની તપાસ જે થાઇરોઇડ ગ્રંથિની સક્રિયતા માપે છે, હાઇપો કે હાઇપર થાઇરોઇડ નક્કી કરવા.",
    mr: "थायरॉईड ग्रंथीचे कार्य मोजण्यासाठी रक्तातील टीएसएच संप्रेरकाची तपासणी.",
    es: "Un análisis de sangre para evaluar la función tiroidea midiendo los niveles de TSH.",
    ar: "فحص دم تشخيصي يقيس مستويات TSH للكشف عن خلل الغدة الدرقية."
  },
  content: {
    overview: "Thyroid Stimulating Hormone (TSH) is produced by the anterior pituitary gland. It regulates endocrine hormone production by the thyroid gland (Thyroxine T4, Triiodothyronine T3). TSH is the primary screening tool for suspected thyroid abnormalities.",
    normalRange: "Typical adult reference range: 0.40 - 4.50 uIU/mL. Pregnancy and age-specific ranges differ significantly.",
    highValues: [
      "High TSH (> 4.50 uIU/mL) (Hypothyroidism): Suggests primary thyroid gland failure (Hashimoto's thyroiditis), iodine deficiency, or thyroid surgery aftermath.",
      "High TSH with normal free T4 (Subclinical Hypothyroidism): Early-stage thyroid dysfunction often requiring monitoring."
    ],
    lowValues: [
      "Low TSH (< 0.40 uIU/mL) (Hyperthyroidism): Suggests overactive thyroid (Graves' disease, toxic multinodular goiter) or thyroid hormone over-replacement.",
      "Low TSH in central hypothyroidism: Pituitary or hypothalamic failure (secondary hypothyroidism, rare)."
    ],
    clinicalInterpretation: "TSH is extremely sensitive; slight changes in thyroid hormones trigger exponential changes in TSH. High TSH (hypothyroidism) correlates with slow metabolism, fatigue, cold sensitivity, and dry skin, mimicking chronic eczema features. Low TSH (hyperthyroidism) can trigger anxiety and sweating.",
    references: ["CIT-0003"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Endocrinology & Clinical Diagnostics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-A",
  tags: ["TSH", "Thyroid", "Hormone", "Blood Test", "Diagnostics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/tsh",
  readingTimeMinutes: 5,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of TSH lab test profile"]
};
