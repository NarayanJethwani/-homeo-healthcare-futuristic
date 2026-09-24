import { KnowledgeEntity } from "../../types";

export const ItchingSymptom: KnowledgeEntity = {
  id: "S0114",
  slug: "itching",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Itching (Pruritus)",
    hi: "खुजली (Itching / Pruritus)",
    gu: "ખંજવાળ (Itching / Pruritus)",
    mr: "खाज / खाज सुटणे (Itching / Pruritus)",
    es: "Picazón / Prurito (Itching / Pruritus)",
    ar: "الحكة (Pruritus)"
  },
  summary: {
    en: "Itchy skin is often linked to dryness or irritation; learn simple skin care and when persistent itching needs a check-up.",
    hi: "खुजली के लक्षण की नैदानिक समझ और प्रणालीगत चेतावनी लक्षण.",
    gu: "ખંજવાળના લક્ષણની તબીબી સમજણ અને ઈમરજન્સી ચેતવણી લક્ષણો.",
    mr: "खाजेच्या लक्षणांची वैद्यकीय माहिती आणि आपत्कालीन इशारे.",
    es: "Evaluación clínica, causas sistémicas y señales de alarma del prurito según AAD 2020.",
    ar: "التقييم السريري وعلامات الخطر للحكة."
  },
  content: {
    definition: "Itching, also called pruritus, is an uncomfortable skin sensation that makes you want to scratch. It may affect one small area or much of the body.",
    clinicalMeaning: "Itchy skin is usually caused by dryness, irritation, eczema, hives, infection, or a reaction to a product or medicine. Itching all over the body, persistent itch without an obvious rash, or itch in pregnancy should be assessed rather than self-diagnosed.",
    commonCauses: [
      "Dry skin, eczema, contact dermatitis, hives, or psoriasis",
      "Irritants or allergens such as fragranced products, detergents, metals, plants, fabrics, or medicines",
      "Fungal infection, scabies, insect bites, or lice",
      "Less commonly, a thyroid, liver, kidney, or blood condition"
    ],
    differentialDiagnosis: "Notice where the itch began, whether there is a rash or swelling, what new products or medicines were introduced, and whether anyone close to you is itchy. A clinician can assess for skin conditions, allergy, infection, or a medical cause when necessary.",
    redFlags: [
      "Get emergency help for itching with trouble breathing or swallowing, or swelling of the lips, tongue, throat, or face",
      "Seek urgent advice for a rapidly spreading, painful, blistering rash, skin that is hot or leaking pus, or itch with fever and feeling very unwell",
      "Book a GP review for severe, widespread, recurrent, or persistent itching; yellow skin or eyes, dark urine, unplanned weight loss, or itch during pregnancy should be checked promptly"
    ],
    lifestyleAdvice: "Use an unperfumed moisturiser regularly, take cool or lukewarm showers, choose loose cotton clothes, and keep nails short. Pat or press the skin instead of scratching. Stop a clearly irritating new product if it is safe to do so, and ask a pharmacist before using medicated creams.",
    references: [
      "CIT-0079",
      "CIT-0023"
    ],
  "faqs": [
    {
      "question": "What can help itchy skin at home?",
      "answer": "Unperfumed moisturiser, cool or lukewarm showers, loose cotton clothing, and avoiding fragranced products can help. A pharmacist can advise on suitable products or medicines."
    },
    {
      "question": "When should I see a clinician?",
      "answer": "Seek advice if the itching is severe, widespread, keeps returning, disrupts daily life, comes with a new rash or swelling, or does not improve with simple care."
    },
    {
      "question": "Can I use a steroid cream for any itch?",
      "answer": "No. The right treatment depends on the cause and body area. Ask a pharmacist or clinician before using a steroid cream, especially on the face, genitals, or broken skin."
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
  tags: ["Itching", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/itching",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Itching symptom profile"]
};
