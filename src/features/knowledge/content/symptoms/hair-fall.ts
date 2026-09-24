import { KnowledgeEntity } from "../../types";

export const HairFallSymptom: KnowledgeEntity = {
  id: "S0007",
  slug: "hair-fall",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T00:00:00Z",
    reviewed: "2026-09-24T00:00:00Z"
  },
  title: {
    en: "Hair Fall",
    hi: "Hair Fall",
    gu: "Hair Fall",
    mr: "Hair Fall",
    es: "Hair Fall",
    ar: "Hair Fall"
  },
  summary: {
    en: "Noticing more hair in your brush or shower can be worrying. Learn the difference between temporary shedding and hair loss, what can contribute, and when to seek advice.",
    hi: "Hair Fall के लक्षण की नैदानिक समझ.",
    gu: "Hair Fall ના લક્ષણ ની સમજણ.",
    mr: "Hair Fall चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Hair Fall.",
    ar: "التعريف السريري والأهمية لـ Hair Fall."
  },
  content: {
  definition: "Hair fall can mean normal daily shedding, temporary increased shedding, hair breakage or true hair loss. It is normal to shed some hairs each day. Increased shedding often begins a few months after a trigger such as illness, high fever, childbirth, major stress, surgery or significant weight loss. A receding hairline, a widening part, a bald patch or thinning that continues may point to a different type of hair loss.",
  clinicalMeaning: "Hair loss is common and can affect confidence and wellbeing. There is no single cause or single solution. Hereditary pattern hair loss, temporary shedding, tightly pulled hairstyles, hair-care damage, medicines, thyroid or iron-related problems, scalp conditions and autoimmune conditions can all play a part. Knowing the pattern and cause is the useful first step.",
  commonCauses: [
    "Temporary shedding after illness, high fever, childbirth, surgery, a major stressor or significant weight loss",
    "Hereditary pattern hair loss, which may appear as gradual thinning, a widening part or a receding hairline",
    "Tight hairstyles, extensions, chemical treatments, heat or repeated breakage from hair-care practices",
    "A scalp or medical condition, medicine side effect, nutritional deficiency, thyroid issue or autoimmune hair loss"
  ],
  differentialDiagnosis: "A clinician or dermatologist may ask when it started, whether it is shedding, breakage or thinning, recent illness or life changes, family history, medicines, diet, periods or hormonal symptoms, and how you style your hair. They may examine the scalp, hair and nails. Blood tests or other checks are considered only when the story or examination suggests a medical contributor.",
  redFlags: [
    "Arrange prompt medical or dermatology advice for sudden round or patchy bald areas, a rapidly widening part, loss of eyebrows or eyelashes, or hair loss affecting large areas.",
    "Seek prompt assessment for scalp pain, redness, swelling, crusting, pus, scarring, marked itching or scaling, especially if hair is breaking or falling out in patches.",
    "Book a clinical review if hair loss follows a new medicine, comes with unexplained weight change, fatigue, menstrual changes or other new symptoms, or is causing significant distress. Do not stop prescribed treatment without advice."
  ],
  lifestyleAdvice: "Treat hair and scalp gently: avoid styles that pull, frequent high heat, harsh chemicals and vigorous brushing. Eat regular, balanced meals with enough protein and avoid restrictive diets unless supervised. Be cautious with products and supplements marketed for hair growth—too much of some nutrients can be harmful, and supplements do not replace finding the cause. Take a few well-lit photographs over time and note recent illness, stress, medicines and hair-care changes; this can make an appointment more useful.",
  references: ["CIT-0145", "CIT-0146"],
  claimCitations: [
    { claimId: "S0007-HAIR-FALL-UNDERSTANDING", passage: "definition; clinicalMeaning; commonCauses; differentialDiagnosis", citationIds: ["CIT-0145", "CIT-0146"] },
    { claimId: "S0007-HAIR-FALL-SAFETY-AND-SUPPORT", passage: "redFlags; lifestyleAdvice; FAQs", citationIds: ["CIT-0145", "CIT-0146"] }
  ],
  faqs: [
    {
      question: "Is some hair shedding normal?",
      answer: "Yes. It is normal to shed some hair each day. A temporary increase in shedding can happen a few months after fever, illness, childbirth, surgery, stress or major weight loss. If you are unsure whether it is shedding, breakage or ongoing thinning, a dermatologist can help identify the pattern."
    },
    {
      question: "Can stress cause hair fall?",
      answer: "A significant physical or emotional stressor can trigger temporary increased shedding, often after a delay of a few months. Ongoing thinning or patchy hair loss can have other causes too, so it is worth getting advice if the pattern persists or concerns you."
    },
    {
      question: "Should I take biotin or other hair supplements?",
      answer: "Do not assume a supplement is needed or harmless. Excess of some nutrients can be harmful or even worsen hair loss, and supplements can interfere with some tests or medicines. Ask a clinician or pharmacist before starting one, particularly if you take regular medicines or have a health condition."
    },
    {
      question: "When should I see a dermatologist?",
      answer: "See a dermatologist or clinician for patchy or rapid hair loss, scalp inflammation or scarring, a new receding hairline or widening part, hair loss after a new medicine, or shedding that keeps going. Earlier assessment can make it easier to identify the cause and discuss options."
    },
    {
      question: "Can homeopathy treat hair loss?",
      answer: "Reliable clinical evidence has not established homeopathy as a treatment for hair loss. It should not replace assessment for scalp disease, hereditary hair loss, a medicine side effect, nutritional deficiency or another medical cause."
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
  tags: ["Hair Fall", "Hair Loss", "Scalp Health", "Alopecia", "Symptom"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/hair-fall",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Hair Fall symptom profile", "1.2.0: Rewritten as a patient-first guide with safe care boundaries and practical scalp-care support."]
};
