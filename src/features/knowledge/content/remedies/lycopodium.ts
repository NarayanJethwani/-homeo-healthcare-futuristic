import { KnowledgeEntity } from "../../types";

export const LycopodiumRemedy: KnowledgeEntity = {
  id: "R0003",
  slug: "lycopodium",
  entityType: "remedy",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Lycopodium (Club Moss Spores)",
    hi: "लाइकोपोडियम (क्लब मॉस बीजाणु)",
    gu: "લાયકોપોડિયમ (ક્લબ મોસ)",
    mr: "लायकोपोडियम (क्लब मॉस)",
    es: "Lycopodium (Esporas de Musgo de Club)",
    ar: "لايكوبوديوم (Lycopodium)"
  },
  summary: {
    en: "A key deep-acting constitutional remedy prepared from club moss spores, widely utilized for liver, kidney, digestive, and urinary issues.",
    hi: "मॉस वनस्पति के बीजाणुओं से तैयार एक गहरी क्रियाशील संवैधानिक दवा, जो पेट फूलने, गैस और यकृत रोगों में विशेष रूप से उपयोगी है.",
    gu: "વનસ્પતિના બીજાણુઓમાંથી બનેલી ઊંડી અસરકારક બંધારણીય દવા, જે ગેસ અને લિવરની તકલીફોમાં ઉપયોગી છે.",
    mr: "यकृत, मुतखडा आणि पोटातील गॅस यावर अत्यंत गुणकारी असलेले खोलवर परिणाम करणारे औषध.",
    es: "Un remedio constitucional profundo preparado a partir de esporas de musgo de club.",
    ar: "علاج دستوري عميق الأثر يُحضر من أبواغ طحلب النادي."
  },
  content: {
    latinName: "Lycopodium clavatum",
    commonName: "Club Moss / Wolf's Claw",
    source: "Vegetable Kingdom (Spores of Lycopodium clavatum)",
    kingdom: "Plant",
    remedyType: "Polychrest / Constitutional",
    description: "Lycopodium matches a constitutional profile characterized by intellectual strength but physical weakness, often exhibiting lack of self-confidence initially, which they compensate for with an authoritative air. Commonly has digestive weakness and right-sided complaints.\n\n### Classical References:\n- **Kent's Lectures**: 'The Lycopodium patient is intellectual, but lacks physical power. He is apprehersive, yet performs duties successfully.'\n- **Boericke's Materia Medica**: 'Affects primarily the right side, and complains traveling from right to left.'\n\n### Clinical Pearls:\n- Desires warm drinks; cold drinks or foods trigger severe bloating and discomfort.\n- Pains and symptoms have a strict diurnal cycle, peaking between 4 PM and 8 PM.\n\n### Common Prescribing Mistakes:\n- Do not prescribe Lycopodium in acute febrile congestions unless clear right-sided, 4-8 PM aggravation modalities are verified.",
    keynotes: [
      "Extreme flatulence and bloating, especially in the lower abdomen, worse 4-8 PM.",
      "Excessive hunger, but eating a few mouthfuls fills them up immediately.",
      "Complaints travel from right to left (right-sided sore throat, right-sided kidney stones, right hernia).",
      "Craves warm food, warm drinks, and sweets."
    ],
    mentalSymptoms: [
      "Lack of self-confidence, dread of undertaking new things, yet performs well once started.",
      "Authoritative, domineering behavior at home, but submissive in public.",
      "Irritability in the morning on waking; doesn't want to be spoken to."
    ],
    physicalSymptoms: [
      "Dyspepsia with sour eructations, burning sensation in stomach.",
      "Constipation with ineffectual urging, often combined with hemorrhoids.",
      "Renal colic, especially right-sided, with red sand in urine."
    ],
    generalities: "Complaints aggravated from 4 to 8 PM; right-sided complaints; warm-blooded but loves warm food; unrefreshed sleep, wakes up cross.",
    modalitiesBetter: [
      "Warm food and drinks",
      "Uncovering the head",
      "Motion / Walking in open air"
    ],
    modalitiesWorse: [
      "4 to 8 PM",
      "Cold food and drinks",
      "Warm room",
      "On waking in the morning"
    ],
    clinicalUses: [
      "Chronic Dyspepsia / Flatulence",
      "Irritable Bowel Syndrome (IBS)",
      "Kidney Stones (Renal Calculi)",
      "Fatty Liver Disease",
      "Gastroesophageal Reflux Disease (GERD)"
    ],
    organAffinity: ["Liver", "Digestive Tract", "Kidneys", "Urinary System"],
    miasmaticAffinity: ["Psora", "Sycosis", "Syphilis"],
    constitution: "Intellectual, mentally active but physically weak persons, looking older than they are, with pale, sallow skin.",
    potencies: ["30C", "200C", "1M", "10M"],
    safetyNotes: "Due to deep-acting nature, avoid repeating high potencies frequently in cases with weak organic structural integrity (advanced cirrhosis, severe renal failure).",
    references: ["CIT-0007", "CIT-0008"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Constitutional Medicine & Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Lycopodium", "Remedy", "Bloating", "Flatulence", "Right-Sided"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/lycopodium",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Lycopodium remedy profile"]
};
