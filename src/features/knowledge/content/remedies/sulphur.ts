import { KnowledgeEntity } from "../../types";

export const SulphurRemedy: KnowledgeEntity = {
  id: "R0001",
  slug: "sulphur",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Sulphur (Sublimed Sulphur)",
    hi: "सल्फर (सब्लाइम्ड गंधक)",
    gu: "સલ્ફર (શુદ્ધ ગંધક)",
    mr: "सल्फर (शुद्ध गंधक)",
    es: "Sulphur (Azufre Sublimado)",
    ar: "الكبريت (Sulphur)"
  },
  summary: {
    en: "A primary mineral remedy in homeopathy, traditionally referred to as the 'king of chronic remedies' with a strong affinity for the skin and venous systems.",
    hi: "होम्योपैथी में एक प्रमुख खनिज दवा, जिसे पारंपरिक रूप से पुरानी बीमारियों का राजा माना जाता है, विशेष रूप से त्वचा रोगों में उपयोगी है.",
    gu: "હોમિયોપેથીમાં એક મુખ્ય ખનિજ દવા જેને ક્રોનિક રોગોના રાજા કહેવાય છે, ચામડીના દર્દોમાં ખૂબ જ ગુણકારી છે.",
    mr: "होम्योपैथीमधील एक प्रमुख खनिज औषध ज्याला जुनाट आजारांचा राजा म्हटले जाते, विशेषतः त्वचेच्या आजारात प्रभावी आहे.",
    es: "Un remedio mineral primario en homeopatía, tradicionalmente conocido como el 'rey de los remedios crónicos'.",
    ar: "علاج معدني رئيسي في المعالجة المثلية، يُشار إليه تقليديًا باسم ملك الأدوية المزمنة."
  },
  content: {
    latinName: "Sulphur",
    commonName: "Brimstone / Sublimed Sulphur",
    source: "Mineral Kingdom (Elemental Sulfur)",
    kingdom: "Mineral",
    remedyType: "Polychrest / Constitutional",
    description: "Sulphur is prepared from purified sublimed sulfur. In classical homeopathy, it matches a hot-blooded, philosophically inclined constitutional type (the 'ragged philosopher') who is sensitive to heat and prone to burning sensations and dry, itchy skin eruptions.\n\n### Classical References:\n- **Boericke's Materia Medica**: 'Stands at the head of the remedies that stimulate reactiveness, especially in skin eruptions.'\n- **Kent's Lectures**: 'The great anti-psoric. Matches dirty, ragged philosophers with a tendency to burning sensations.'\n\n### Clinical Pearls:\n- Always prescribe with caution in deep structural pathologies; Sulphur's strong reactive push can trigger severe aggravations.\n- solcs of the feet burning at night, making the patient stick them out of bed, is a reliable prescribing indicator.\n\n### Common Prescribing Mistakes:\n- Do not prescribe in high potencies (e.g. 10M+) to patients with severe skin lesions without starting with low potencies (e.g. 30C or 200C).",
    keynotes: [
      "Burning sensations in various parts, especially soles of feet, palms, and vertex.",
      "Empty, weak, hungry feeling in stomach at 11 AM.",
      "Aversion to bathing, skin symptoms are aggravated by washing.",
      "Redness of all external orifices (lips, eyelids, ears, anus)."
    ],
    mentalSymptoms: [
      "Philosophical mania: Occupied with grand theories or religious speculations.",
      "Irritability, selfishness, and laziness; indifference to personal appearance or surroundings.",
      "Dislike for mental or physical labor, yet highly active imagination."
    ],
    physicalSymptoms: [
      "Dry, scaly, itchy skin eruptions that bleed after scratching.",
      "Venous congestion, especially portal system, causing hemorrhoids.",
      "Morning diarrhea driving the patient out of bed at 5 AM."
    ],
    generalities: "Chilly but has hot flushes; extreme sensitivity to heat of bed; complains of burning sensations; standing is the most uncomfortable position.",
    modalitiesBetter: [
      "Dry, warm weather",
      "Lying on the right side",
      "Motion"
    ],
    modalitiesWorse: [
      "Warmth of bed",
      "Washing / Bathing",
      "Standing",
      "11 AM"
    ],
    clinicalUses: [
      "Atopic Dermatitis (Eczema)",
      "Psoriasis",
      "Chronic Gastritis",
      "Hemorrhoids",
      "Chronic Asthma"
    ],
    organAffinity: ["Skin", "Venous System", "Digestive Tract", "Liver"],
    miasmaticAffinity: ["Psora (Primary antipsoric)"],
    constitution: "Lean, stoop-shouldered, dirty-looking persons, prone to skin eruptions and metabolic sluggishness. Often warm-blooded.",
    potencies: ["6C", "30C", "200C", "1M"],
    safetyNotes: "Avoid high potencies in cases of active tuberculous processes or highly sensitive advanced pathological states without strict professional oversight.",
    references: ["CIT-0006", "CIT-0007"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Constitutional Prescribing",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Sulphur", "Remedy", "Skin Eczema", "Hot-Blooded", "Chronic"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/sulphur",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Sulphur remedy profile"]
};
