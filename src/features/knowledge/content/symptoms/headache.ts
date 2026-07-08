import { KnowledgeEntity } from "../../types";

export const HeadacheSymptom: KnowledgeEntity = {
  id: "S0003",
  slug: "headache",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Headache (Cephalgia)",
    hi: "सिरदर्द (सेफैल्जिया)",
    gu: "માથાનો દુખાવો (Headache)",
    mr: "डोकेदुखी (Headache)",
    es: "Dolor de Cabeza (Cefalea)",
    ar: "الصداع (Headache)"
  },
  summary: {
    en: "Pain or discomfort in the head, scalp, or neck, originating from tension, vascular irritation, or neurological pathways.",
    hi: "सिर, खोपड़ी या गर्दन में दर्द या बेचैनी, जो तनाव, संवहनी जलन या न्यूरोलॉजिकल कारणों से उत्पन्न होती है.",
    gu: "માથામાં કે ગળાના ભાગમાં દુખાવો કે અસ્વસ્થતા, જે તાણ કે ન્યુરોલોજીકલ કારણોસર થાય છે.",
    mr: "डोके, कवटी किंवा मान या भागातील वेदना, ज्या मानसिक ताण किंवा रक्तवाहिन्यांच्या उत्तेजनामुळे होतात.",
    es: "Dolor o malestar en la cabeza, el cuero cabelludo o el cuello.",
    ar: "ألم أو انزعاج في الرأس أو فروة الرأس أو الرقبة."
  },
  content: {
    definition: "Headache (cephalgia) is a subjective sensation of pain or discomfort located in the region of the cranial vault, upper cervical spine, or facial structures.",
    clinicalMeaning: "From a physiological perspective, headache occurs when pain-sensitive structures (meninges, cerebral arteries, cranial nerves, or cervical muscles) are stimulated or irritated, triggering nociceptive pathways to the brain.",
    commonCauses: [
      "Tension-type muscle contractions.",
      "Vascular dilation (Migraine).",
      "Cervicogenic spine strain.",
      "Sinus congestion or pressure."
    ],
    differentialDiagnosis: "Tension headache, Migraine cephalgia, Cluster headache, Sinusitis, and Giant cell arteritis.",
    redFlags: [
      "Sudden, explosive 'thunderclap' pain reaching maximum severity in seconds.",
      "Concomitant high fever, stiff neck, vomiting, or confusion (meningitis symptoms).",
      "Headache following a recent head trauma.",
      "Progressive worsening of headache over weeks, especially when waking in the morning or aggravated by coughing (suggests raised intracranial pressure)."
    ],
    lifestyleAdvice: "Ensure adequate hydration (drink at least 2 liters of water daily). Maintain a consistent sleep schedule. Avoid skipping meals. Take regular breaks from screens. Massage neck and shoulder muscles to relieve tension.",
    references: ["CIT-0003"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Neurology & Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["Headache", "Cephalgia", "Head Pain", "Symptom", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/headache",
  readingTimeMinutes: 4,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of Headache symptom profile"]
};
