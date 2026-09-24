import { KnowledgeEntity } from "../../types";

export const DizzinessSymptom: KnowledgeEntity = {
  id: "S0029",
  slug: "dizziness",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T00:00:00Z",
    reviewed: "2026-09-24T00:00:00Z"
  },
  title: {
    en: "Dizziness and Vertigo",
    hi: "चक्कर आना (Dizziness and Vertigo)",
    gu: "ચક્કર આવવા (Dizziness and Vertigo)",
    mr: "चक्कर येणे (Dizziness and Vertigo)",
    es: "Mareo y Vértigo (Dizziness and Vertigo)",
    ar: "الدوخة والدوار (Dizziness and Vertigo)"
  },
  summary: {
    en: "Dizziness can mean feeling faint, off-balance or as if you or the room is spinning. Learn how to describe the pattern, stay safe, and know when to seek urgent help.",
    hi: "चक्कर आने के लक्षण की नैदानिक समझ और स्ट्रोक चेतावनी लक्षण.",
    gu: "ચક્કર આવવાના લક્ષણની તબીબી સમજણ અને ઈમરજન્સી ચેતવણી લક્ષણો.",
    mr: "चक्कर येण्याच्या लक्षणांची वैद्यकीय माहिती आणि आपत्कालीन इशारे.",
    es: "Evaluación clínica, examen HINTS y señales de alarma de ictus según AAN 2020.",
    ar: "التقييم السريري وعلامات الخطر للدوخة."
  },
  content: {
    definition: "Dizziness is a broad word people use for different sensations. You may feel light-headed or close to fainting, unsteady on your feet, or as though you or the room is spinning. The spinning feeling is called vertigo. Describing exactly what happens, how long it lasts and what brings it on helps identify the cause.",
    clinicalMeaning: "Many causes of dizziness are not serious, but dizziness can occasionally signal a problem that needs urgent care. It may relate to dehydration, a sudden blood-pressure drop, medicines, an inner-ear balance problem, migraine, low blood sugar, a heart rhythm problem or a neurological condition. New, severe or persistent symptoms deserve medical advice rather than self-diagnosis.",
    commonCauses: [
      "Dehydration, fever, not eating enough, getting up quickly, or a sudden drop in blood pressure",
      "Medicines, alcohol, caffeine, nicotine or other substances that can affect alertness or blood pressure",
      "Inner-ear balance conditions, including positional vertigo, labyrinthitis or Ménière's disease",
      "Migraine, low blood sugar, anaemia, anxiety, a heart rhythm problem or another physical health condition"
    ],
    differentialDiagnosis: "A clinician may ask whether the feeling is spinning, faintness or imbalance; when it started; whether head movement, standing, food, illness, medicines or stress affect it; and whether there is hearing loss, ringing in the ears, headache, palpitations, chest pain or neurological symptoms. They may check blood pressure, heart rhythm, walking, balance, hearing or blood tests depending on the pattern.",
    redFlags: [
      "Call emergency services or go to the nearest emergency department for sudden or severe dizziness with weakness or numbness on one side, facial drooping, trouble speaking, trouble swallowing, loss of vision, double vision, new confusion, or a severe new headache.",
      "Seek emergency help for dizziness with chest pain, severe shortness of breath, fainting, a new irregular or racing heartbeat, seizure, or a head injury.",
      "Seek urgent medical advice if you cannot keep fluids down, cannot stand or walk safely, have sudden hearing loss, or have fever with a severe headache or a stiff neck.",
      "Arrange a clinical review if dizziness is new, keeps returning, is getting worse, follows a medicine change, or is affecting driving, work or daily life."
    ],
    lifestyleAdvice: "When dizzy, sit or lie down promptly and get up slowly. Move carefully, use support if you are unsteady, drink fluids if you can, and avoid driving, ladders, swimming alone or operating machinery until you feel safe again. Keep a brief note of timing, triggers, food and fluids, medicines and other symptoms. Do not try a manoeuvre or exercise for vertigo unless a clinician has identified the likely cause and shown you how to do it safely.",
    references: ["CIT-0143", "CIT-0144"],
    claimCitations: [
      {
        claimId: "S0029-DIZZINESS-UNDERSTANDING",
        passage: "definition; clinicalMeaning; commonCauses; differentialDiagnosis",
        citationIds: ["CIT-0143", "CIT-0144"]
      },
      {
        claimId: "S0029-DIZZINESS-SAFETY-AND-SUPPORT",
        passage: "redFlags; lifestyleAdvice; FAQs",
        citationIds: ["CIT-0143", "CIT-0144"]
      }
    ],
  "faqs": [
    {
      question: "What is the difference between dizziness and vertigo?",
      answer: "Dizziness can mean feeling faint, light-headed, unsteady or off-balance. Vertigo is the specific feeling that you or the room is spinning when nothing is moving. The distinction helps a clinician look for the cause."
    },
    {
      question: "What should I do when I feel dizzy?",
      answer: "Sit or lie down promptly, move slowly and avoid driving, climbing or machinery until you are steady. Drink fluids if you can. Get urgent help for warning signs such as weakness, trouble speaking, chest pain, fainting, severe breathlessness or sudden vision changes."
    },
    {
      question: "Could a medicine be causing my dizziness?",
      answer: "Yes. Some medicines and substances can contribute to dizziness or low blood pressure. Do not stop a prescribed medicine suddenly; ask a clinician or pharmacist to review it, especially if dizziness began after a new medicine or dose change."
    },
    {
      question: "When should I book an appointment?",
      answer: "Arrange an appointment if dizziness is new, keeps coming back, is worsening, comes with hearing changes, follows a medicine change, or affects normal activities. A clinician can assess the pattern and decide whether tests or balance support are needed."
    },
    {
      question: "Can homeopathy treat dizziness or vertigo?",
      answer: "Reliable clinical evidence has not established homeopathy as a treatment for dizziness or vertigo. It should not replace assessment for inner-ear conditions, heart problems, neurological causes or urgent warning signs."
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
  tags: ["Dizziness", "Vertigo", "Balance", "Inner Ear", "Symptom"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/dizziness",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Dizziness symptom profile", "1.2.0: Rewritten as a patient-first guide with clear safety boundaries and fall-prevention advice."]
};
