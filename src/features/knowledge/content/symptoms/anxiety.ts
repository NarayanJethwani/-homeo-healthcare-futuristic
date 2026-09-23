import { KnowledgeEntity } from "../../types";

export const AnxietySymptom: KnowledgeEntity = {
  id: "S0047",
  slug: "anxiety",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T00:00:00Z",
    reviewed: "2026-09-24T00:00:00Z"
  },
  title: {
    en: "Anxiety",
    hi: "Anxiety",
    gu: "Anxiety",
    mr: "Anxiety",
    es: "Anxiety",
    ar: "Anxiety"
  },
  summary: {
    en: "Anxiety is a common response to threat or uncertainty. Learn what it can feel like, practical next steps, and when to seek professional or urgent support.",
    hi: "Anxiety के लक्षण की नैदानिक समझ.",
    gu: "Anxiety ના લક્ષણ ની સમજણ.",
    mr: "Anxiety चे लक्षण आणि उपचार.",
    es: "Definición clínica y significado de Anxiety.",
    ar: "التعريف السريري والأهمية لـ Anxiety."
  },
  content: {
  definition: "Anxiety is a feeling of worry, fear or unease. It can affect thoughts, behaviour and the body, causing symptoms such as a racing heart, sweating, shaking, breathlessness, dizziness, stomach upset or difficulty sleeping. Feeling anxious sometimes is a normal part of life; it deserves support when it is persistent, intense or getting in the way of daily life.",
  clinicalMeaning: "Anxiety is real and treatable, not a personal weakness. It can be a short-term response to stress, or part of an anxiety disorder such as generalized anxiety, panic disorder, social anxiety or a phobia. Physical symptoms should not automatically be assumed to be anxiety, especially when they are new, severe or concerning.",
  commonCauses: [
    "Stressful events, uncertainty, grief, trauma, relationship or work pressures",
    "Anxiety disorders, panic attacks, depression, post-traumatic stress or another mental-health concern",
    "Poor sleep, pain, long-term illness, caffeine, nicotine, alcohol, recreational substances or some medicines",
    "A physical health issue that needs assessment, such as a thyroid problem, heart rhythm concern or low blood sugar"
  ],
  differentialDiagnosis: "A clinician may ask what you are feeling, when it started, triggers, panic-like episodes, sleep, mood, medicines and substances, physical symptoms, and how anxiety is affecting everyday life. They may also consider whether a physical health condition or medicine could be contributing. Assessment is individual; a diagnosis is not made from a checklist alone.",
  redFlags: [
    "If you are thinking about harming yourself, feel unable to keep yourself safe, or someone else is in immediate danger, contact local emergency services or go to the nearest emergency department now.",
    "Seek urgent assessment for chest pain, fainting, severe shortness of breath, a new irregular heartbeat, new one-sided weakness, new confusion, or symptoms that could be a medical emergency.",
    "Arrange prompt professional support if panic, fear or worry is escalating, stopping you from working, studying, caring for yourself or leaving home, or if alcohol, medicines or other substances are becoming a way of coping."
  ],
  lifestyleAdvice: "Start small and be kind to yourself. Notice what situations, thoughts, body sensations, sleep, caffeine and alcohol seem to affect your anxiety. A regular sleep and meal routine, gentle physical activity, a short breathing or grounding exercise, and talking with someone you trust may help some people. These steps are support, not a replacement for professional care when anxiety is persistent, severe or affecting safety. Avoid changing prescribed medicine or using alcohol or sedatives to self-treat without advice from a clinician.",
  references: ["CIT-0141", "CIT-0142"],
  claimCitations: [
    { claimId: "S0047-ANXIETY-UNDERSTANDING", passage: "definition; clinicalMeaning; commonCauses", citationIds: ["CIT-0141", "CIT-0142"] },
    { claimId: "S0047-ANXIETY-SAFETY-AND-SUPPORT", passage: "differentialDiagnosis; redFlags; lifestyleAdvice", citationIds: ["CIT-0141", "CIT-0142"] }
  ],
  faqs: [
    {
      question: "When is anxiety more than everyday worry?",
      answer: "Everyone feels anxious sometimes. It is worth seeking support when worry or fear is hard to control, happens often, keeps returning, or affects sleep, work, study, relationships, confidence or daily tasks. A clinician or qualified mental-health professional can help you understand the pattern."
    },
    {
      question: "Can anxiety cause physical symptoms?",
      answer: "Yes. Anxiety can cause symptoms such as a racing heartbeat, sweating, shaking, breathlessness, nausea, stomach discomfort, dizziness and difficulty sleeping. But new or severe chest pain, fainting, severe breathlessness, weakness or confusion need urgent medical assessment rather than being assumed to be anxiety."
    },
    {
      question: "What can I do during a wave of anxiety or panic?",
      answer: "If you are safe, try slowing your breathing, naming a few things you can see and feel around you, and moving to a calmer space or contacting someone you trust. If symptoms are new, severe, or feel like a medical emergency, seek urgent medical help."
    },
    {
      question: "What kinds of professional support can help?",
      answer: "Support can include talking therapies, practical coping strategies, and sometimes medicines after an individual assessment. A primary-care clinician or mental-health professional can help you choose a plan based on your symptoms, preferences and medical situation."
    },
    {
      question: "Can homeopathy treat anxiety?",
      answer: "Reliable clinical evidence has not established homeopathy as a treatment for anxiety disorders. It should not replace assessment, psychological therapy, prescribed treatment, or urgent support for a mental-health crisis."
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
  tags: ["Anxiety", "Mental Wellbeing", "Panic", "Stress", "Symptom"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/anxiety",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Anxiety symptom profile", "1.2.0: Rewritten as a patient-first guide with evidence-based support, physical-health boundaries and crisis guidance."]
};
