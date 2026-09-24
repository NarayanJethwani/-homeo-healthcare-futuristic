import { KnowledgeEntity } from "../../types";

export const TinnitusSymptom: KnowledgeEntity = {
  id: "S0041",
  slug: "tinnitus",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-08T12:00:00Z",
    reviewed: "2026-07-08T12:00:00Z"
  },
  title: {
    en: "Tinnitus",
    hi: "Tinnitus",
    gu: "Tinnitus",
    mr: "Tinnitus",
    es: "Tinnitus",
    ar: "Tinnitus"
  },
  summary: {
    en: "Tinnitus is hearing a sound such as ringing, buzzing, or hissing when there is no outside sound. Persistent or changing tinnitus deserves a health review.",
    hi: "Tinnitus के लक्षण की नैदानिक समझ.",
    gu: "Tinnitus ના લક્ષણ ની સમજણ.",
    mr: "Tinnitus चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Tinnitus.",
    ar: "التعريف السريري والأهمية لـ Tinnitus."
  },
  content: {
  "definition": "Tinnitus is the perception of sound in one or both ears, or in the head, without an external sound source. It may be a ring, buzz, hiss, hum, or pulse-like sound.",
  "clinicalMeaning": "It is common and can be temporary, but a new, persistent, one-sided, or changing sound should be assessed so hearing and ear health can be checked.",
  "commonCauses": [
    "Hearing changes, including noise-related hearing loss",
    "Earwax, an ear infection, or another ear condition",
    "Some medicines or recent exposure to loud sound",
    "Stress, poor sleep, or anxiety, which can make the sound harder to cope with"
  ],
  "differentialDiagnosis": "A clinician may examine the ears, review medicines, and arrange hearing assessment when appropriate. A heartbeat-synchronous sound or tinnitus with hearing or balance symptoms needs particular attention.",
  "redFlags": [
    "Seek urgent help for tinnitus after a head injury, or with sudden hearing loss, facial weakness, severe vertigo, new confusion, weakness, or speech difficulty.",
    "Contact a clinician promptly if the sound beats in time with your pulse, is only on one side, or is getting worse.",
    "Ask for support if tinnitus is severely affecting sleep, mood, concentration, or daily life."
  ],
  "lifestyleAdvice": "Avoid complete silence if it makes tinnitus more noticeable: a low, comfortable background sound may help. Protect hearing around loud noise, keep a regular sleep routine, and discuss persistent symptoms rather than repeatedly increasing headphone volume.",
  "references": [
    "CIT-0004",
    "CIT-0005",
    "CIT-0006",
    "CIT-0007",
    "CIT-0008"
  ],
  "faqs": [
    {
      "question": "What does tinnitus sound like?",
      "answer": "People describe ringing, buzzing, hissing, humming, clicking, or a pulse-like sound. It may be constant or come and go."
    },
    {
      "question": "Will tinnitus go away?",
      "answer": "It may settle when a temporary trigger resolves, but some people have it for longer. Assessment and strategies for sleep, hearing protection, and sound management can make it less intrusive."
    },
    {
      "question": "When is tinnitus urgent?",
      "answer": "Seek urgent help if it begins after a head injury or comes with sudden hearing loss, facial weakness, severe spinning, or stroke-like symptoms."
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
  tags: ["Tinnitus", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/tinnitus",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Tinnitus symptom profile"]
};
