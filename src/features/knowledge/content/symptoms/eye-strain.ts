import { KnowledgeEntity } from "../../types";

export const EyeStrainSymptom: KnowledgeEntity = {
  id: "S0058",
  slug: "eye-strain",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Eye Strain",
    hi: "Eye Strain",
    gu: "Eye Strain",
    mr: "Eye Strain",
    es: "Eye Strain",
    ar: "Eye Strain"
  },
  summary: {
    en: "Eye strain is tired, uncomfortable, dry, or watery eyes after sustained visual tasks. Persistent symptoms should prompt an eye-health review.",
    hi: "Eye Strain के लक्षण की नैदानिक समझ.",
    gu: "Eye Strain ના લક્ષણ ની સમજણ.",
    mr: "Eye Strain चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Eye Strain.",
    ar: "التعريف السريري والأهمية لـ Eye Strain."
  },
  content: {
  "definition": "Eye strain is discomfort or fatigue in and around the eyes, sometimes with headache, blurred focus, dryness, or watering, often after reading, driving, or screen work.",
  "clinicalMeaning": "It is often linked to visual demand or dry eyes, but it can also be a sign that vision correction or an eye-health assessment is needed.",
  "commonCauses": [
    "Long periods of close work, computer use, reading, or driving",
    "Glare, poor lighting, small text, or an uncomfortable viewing distance",
    "Dry eyes or reduced blinking during focused screen work",
    "An out-of-date glasses prescription or another focusing problem"
  ],
  "differentialDiagnosis": "Eye strain should be distinguished from infection, allergy, migraine, dry eye disease, and more urgent causes of eye pain or visual change. An optometrist or clinician can assess persistent symptoms.",
  "redFlags": [
    "Seek urgent eye care for sudden loss or change of vision, severe eye pain, marked redness, light sensitivity, or a new injury or chemical splash.",
    "Seek urgent help for eye symptoms with a severe headache, weakness, speech difficulty, or facial droop.",
    "Arrange an eye examination if discomfort, headaches, blurred vision, or watering keeps returning or does not improve with rest."
  ],
  "lifestyleAdvice": "Take regular visual breaks, blink fully, and vary close work with looking into the distance. Reduce glare, adjust text size and screen position, use comfortable lighting, and keep glasses or contact-lens checks up to date.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "Can screens cause eye strain?",
      "answer": "Long screen sessions can contribute because people focus closely and blink less. Glare, small text, and uncorrected vision can add to the problem."
    },
    {
      "question": "How can I make close work easier on my eyes?",
      "answer": "Use comfortable lighting, reduce glare, increase text size if needed, blink deliberately, and take regular breaks that let you focus into the distance."
    },
    {
      "question": "When should I have my eyes checked?",
      "answer": "Arrange an eye examination if symptoms persist, recur, affect vision, or you have headaches or trouble focusing. Sudden visual change or severe pain is urgent."
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
  evidenceLevel: "Traditional-Literature",
  tags: ["Eye Strain", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/eye-strain",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Eye Strain symptom profile"]
};
