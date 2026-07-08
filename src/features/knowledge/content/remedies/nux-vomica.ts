import { KnowledgeEntity } from "../../types";

export const NuxVomicaRemedy: KnowledgeEntity = {
  id: "R0002",
  slug: "nux-vomica",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Nux Vomica (Poison Nut)",
    hi: "नक्स वोमिका (कुचला बीज)",
    gu: "નક્સ વોમિકા (ઝેરકોચલું)",
    mr: "नक्स व्होमिका (कुचला बीज)",
    es: "Nux Vomica (Nuez Vómica)",
    ar: "نوكس فوميكا (Nux Vomica)"
  },
  summary: {
    en: "A primary plant-based remedy in homeopathy, prepared from seeds of Strychnos nux-vomica, widely used for digestive disorders and stress-induced ailments.",
    hi: "होम्योपैथी में एक प्रमुख वनस्पति दवा, जो पाचन संबंधी विकारों, कब्ज, और मानसिक तनाव के लिए अत्यंत प्रसिद्ध है.",
    gu: "હોમિયોપેથીમાં એક મુખ્ય વનસ્પતિ દવા, જે પાચનની તકલીફો અને માનસિક તણાવ માટે ખૂબ જાણીતી છે.",
    mr: "पचनाच्या तक्रारी आणि मानसिक ताण यावर अत्यंत गुणकारी असलेले वनस्पतीजन्य औषध.",
    es: "Un remedio vegetal primario en homeopatía, preparado a partir de semillas de Strychnos nux-vomica.",
    ar: "علاج نباتي رئيسي في المعالجة المثلية، يُحضر من بذور شجرة القيء."
  },
  content: {
    latinName: "Strychnos nux-vomica",
    commonName: "Poison Nut / Quaker Buttons",
    source: "Vegetable Kingdom (Seeds of Strychnos nux-vomica)",
    kingdom: "Plant",
    remedyType: "Polychrest / Constitutional",
    description: "Nux Vomica corresponds to a chilly, irritable, highly active, and ambitious constitutional profile. It is often indicated for those who lead sedentary lifestyles with high mental stress, excess stimulants (caffeine, alcohol, spices), or rich foods.\n\n### Classical References:\n- **Boericke's Materia Medica**: 'The greatest of polychrests because it is the remedy for many conditions incident to modern life.'\n- **Allen's Keynotes**: 'Adapted to thin, irritable, active, brain-workers; leading a sedentary life.'\n\n### Clinical Pearls:\n- Indispensable as an antidote to previous over-drugging or excessive use of stimulants/spices.\n- Ineffectual urging for stool is the absolute guiding clinical symptom.\n\n### Common Prescribing Mistakes:\n- Do not prescribe Nux Vomica immediately before sleep; its high stimulant properties may cause temporary sleeplessness.",
    keynotes: [
      "Frequent, ineffectual urging to stool; feels like a part remains unpassed.",
      "Extreme sensitiveness to all external impressions: noise, light, odors, and draft of air.",
      "Wakes at 3-4 AM with thoughts of business, then falls into a dull sleep, waking up feeling tired.",
      "Chilly; wants to be covered in all stages of fever."
    ],
    mentalSymptoms: [
      "Highly irritable, easily angered, impatient, and competitive.",
      "Over-sensitive to criticism; fits of temper over small matters.",
      "Workaholic tendencies; prone to mental fatigue from overexertion."
    ],
    physicalSymptoms: [
      "Gastroesophageal reflux (heartburn) and spasmodic stomach cramps.",
      "Nausea and vomiting, with an expressing: 'If I could only vomit, I would feel better.'",
      "Spasmodic colic, constrictive sensations in the abdomen."
    ],
    generalities: "Chilly; highly sensitive to drafts of cold air; symptoms worse in the morning and after eating; craves stimulants but is aggravated by them.",
    modalitiesBetter: [
      "Warmth / Hot drinks",
      "Rest / Naps",
      "Damp, wet weather",
      "In the evening"
    ],
    modalitiesWorse: [
      "Dry, cold air / Drafts",
      "Morning (waking)",
      "Stimulants (coffee, alcohol)",
      "Mental exertion",
      "After eating"
    ],
    clinicalUses: [
      "Gastroesophageal Reflux Disease (GERD)",
      "Irritable Bowel Syndrome (IBS)",
      "Dyspepsia / Acid Indigestion",
      "Tension Headaches",
      "Insomnia from stress"
    ],
    organAffinity: ["Stomach", "Intestines", "Nervous System", "Liver"],
    miasmaticAffinity: ["Psora", "Sycosis"],
    constitution: "Thin, spare, quick, active, irritable persons, with dark hair, who lead a sedentary life and consume stimulants.",
    potencies: ["30C", "200C", "1M"],
    safetyNotes: "Avoid prolonged daily repeating of high potencies without clinical supervision due to potential nervous system hypersensitivity.",
    references: ["CIT-0004", "CIT-0005"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Gastroenterology & Constitutional Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Nux Vomica", "Remedy", "Digestive Reflux", "IBS", "Chilly"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/nux-vomica",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Nux Vomica remedy profile"]
};
