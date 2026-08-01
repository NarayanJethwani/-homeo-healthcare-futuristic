import { KnowledgeEntity } from "../../types";

export const ArnicaMontanaRemedy: KnowledgeEntity = {
  id: "R0005",
  slug: "arnica-montana",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorized-source-bound",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Arnica Montana (Leopard's Bane / Mountain Daisy)",
    hi: "अर्नाका मोन्टाना (अर्निका / माउंटेन डेज़ी)",
    gu: "અર્નિકા મોન્ટાના (માઉન્ટેન ડેઝી)",
    mr: "अर्निाका मॉन्टाना (Arnica Montana)",
    es: "Arnica Montana (Árnica / Pericón de Montaña)",
    ar: "أرنيكا مونتانا (Arnica Montana)"
  },
  summary: {
    en: "The premier traumatic and muscular remedy in classical homeopathy, indicated for blunt trauma, contusions, sprains, sore bruised sensations, and post-exertional muscular soreness.",
    hi: "होम्योपैथी में चोट, सूजन, मोच और शरीर में कुचले हुए दर्द की प्रमुख दवा.",
    gu: "ઈજા, મોચ, અને શરીરના દુખાવા માટે હોમિયોપેથીની શ્રેષ્ઠ દવા.",
    mr: "मार लागणे, दुखापत, सूज आणि अंगदुखीवर अत्यंत प्रभावी औषध.",
    es: "El remedio principal en homeopatía para traumatismos, contusiones, esguinces y dolor muscular por esfuerzo.",
    ar: "العلاج الأول في المعالجة المثلية للإصابات والكدمات والالتواءات وآلام العضلات."
  },
  content: {
    latinName: "Arnica montana",
    commonName: "Leopard's Bane / Mountain Arnica",
    source: "Dried rootstock or whole flowering plant of Arnica montana, potentized according to homeopathic pharmacopoeia standards.",
    kingdom: "Plant",
    remedyType: "Polychrest",
    description:
      "Arnica montana is an essential classical polychrest described by Hahnemann, Kent, and Boericke. Famous for its affinity for capillaries, blood extravasation, and muscular tissue. Key symptoms include a sore, bruised feeling throughout the body, bed feeling too hard, and mental denial of illness ('I am well').",
    keynotes: [
      "Sore, bruised, beaten sensation all over the body; bed feels too hard to lie upon",
      "Says 'I am well' and sends the clinician away despite obvious illness or trauma",
      "Dread of being touched or approached due to fear of pain in sore parts",
      "Head hot with body and limbs cold (or face hot, body cold)",
      "Remedy of choice for blunt mechanical trauma, concussions, hematomas, and muscle strain",
    ],
    mentalSymptoms: [
      "Stupor or apathy after head injury; answers correctly when spoken to but lapses back into stupor",
      "Restlessness, constantly moving to find a soft spot on the bed",
      "Irritability and desire to be left alone; fears being touched or bumped",
    ],
    physicalSymptoms: [
      "Capillary extravasation, ecchymosis, purpura, and post-traumatic tissue swelling",
      "Musculoskeletal soreness after heavy physical exertion, labor, or athletic overstrain",
      "Fetid breath, belching with taste of rotten eggs, and involuntary stool in septic states",
      "Cardiac hypertrophy or chest soreness in athletes ('athlete's heart')",
    ],
    generalities:
      "Marked physical soreness. Highly sensitive to touch, motion, and damp cold. Head hot while body remains cool.",
    modalitiesBetter: [
      "Lying down with head low",
      "Absolute rest",
      "Outstretched posture",
    ],
    modalitiesWorse: [
      "Least touch or motion",
      "Resting on hard surfaces",
      "Damp cold weather",
      "Physical exertion and over-exertion",
    ],
    clinicalUses: [
      "First-line support for blunt soft tissue trauma, contusions, and surgical recovery",
      "Muscular strain and hematoma resorption support",
    ],
    organAffinity: [
      "Capillaries and blood vessels (extravasation)",
      "Musculoskeletal system and soft tissues",
      "Central nervous system (concussion)",
    ],
    miasmaticAffinity: [
      "Psora",
      "Traumatic Miasm"
    ],
    constitution:
      "Suited to plethoric individuals prone to capillary hemorrhages, or patients suffering acute physical trauma.",
    potencies: [
      "6C",
      "30C",
      "200C",
      "1M"
    ],
    safetyNotes:
      "Arnica mother tincture or concentrated herbal preparations must NEVER be applied directly to open wounds or abraded skin, as it causes severe irritant contact dermatitis and tissue necrosis. Oral homeopathic preparations (6C, 30C, 200C) are non-toxic. Seek emergency neurosurgical trauma care immediately for head injuries with loss of consciousness, suspected fractures, or uncontrolled internal bleeding.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006"
    ],
    faqs: [
      {
        "question": "Can Arnica cream or tincture be applied to open bleeding wounds?",
        "answer": "No. Herbal Arnica tinctures or concentrated ointments should only be applied to intact skin. Applying it to open wounds can cause severe contact dermatitis and skin irritation. Oral homeopathic Arnica pellets can be taken orally regardless of skin integrity."
      },
      {
        "question": "What is the key sensation characteristic of Arnica?",
        "answer": "The hallmark Arnica sensation is a sore, bruised, beaten feeling, making the bed feel too hard to rest comfortably."
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
    specialty: "Trauma & Musculoskeletal Therapeutics",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Arnica", "Remedy", "Trauma", "Bruising", "Sore Muscle"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/arnica-montana",
  readingTimeMinutes: 5,
  audience: "student",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with clinical keynotes, topical safety warnings, and classical citations"],
  clinicalPearl: "Arnica is indicated in acute traumatic swelling and soreness where the patient feels bruised all over and insists they are fine.",
  quickFacts: {
    "Latin Name": "Arnica montana",
    "Common Name": "Leopard's Bane / Mountain Daisy",
    "Source Kingdom": "Vegetable (Asteraceae family)",
    "Thermal State": "Hot head, cool body"
  },
  aiReadiness: {
    retrievalSummary: "Arnica montana is a major classical homeopathic polychrest indicated for blunt trauma, contusions, muscle strain, hematomas, and sore bruised sensations.",
    clinicalSummary: "Botanical source contains sesquiterpene lactones (helenalin). Concentrated topical application to broken skin is contra-indicated. Oral potentized remedies are safe for traumatic swelling and capillary extravasation.",
    patientSummary: "Arnica montana is a popular homeopathic remedy used for bruises, muscle soreness, sprains, and healing after physical injury or surgery.",
    studentSummary: "Guiding keynotes include sore bruised sensation, bed feels too hard, patient claims they are well when ill, fear of touch, and head hot with cold body.",
    keywords: ["arnica", "leopards bane", "bruises", "trauma remedy", "muscle soreness"],
    semanticKeywords: ["trauma polychrest", "hematoma remedy", "capillary extravasation remedy"],
    bodySystem: "Musculoskeletal & Hematological",
    urgency: "routine"
  }
};
