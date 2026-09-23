import { KnowledgeEntity } from "../types";
import { getAllKnowledgeEntities } from "../index";

export interface ClinicalCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string; // for UI lucide icons rendering reference
  entityIds: string[];
}

export const CURATED_COLLECTIONS: ClinicalCollection[] = [
  {
    id: "col-digestive",
    slug: "digestive-health",
    name: "Digestive Conditions",
    description: "GERD, IBS, gastritis, constipation, and the symptoms or tests commonly considered alongside them.",
    iconName: "Flame",
    entityIds: [
      "D0001", "D0004", "D0008", "D0046", "D0047", "D0049", // GERD, IBS, Gastritis, Constipation, Gastroenteritis, Peptic ulcer
      "S0001", "S0006", "S0010", "S0011", "S0024", "S0045", "S0046", // Heartburn, Bloating, Constipation, Diarrhea, Flatulence, Acid reflux, Indigestion
      "L0012", "L0033", "L0034" // LFT, Stool routine, H. pylori antigen
    ]
  },
  {
    id: "col-womens",
    slug: "womens-health",
    name: "Women’s Health Conditions",
    description: "PCOS, period concerns, menopause, and related symptoms and tests.",
    iconName: "Sparkles",
    entityIds: [
      "D0013", "D0033", "D0034", "D0059", // PCOS, Dysmenorrhea, Menopause, Fibroadenoma
      "S0050", "S0051", "S0067", "S0007", // Night sweats, Menstrual irregularity, Morning sickness, Hair fall
      "L0002", "L0009", "L0022" // TSH, Ferritin, Thyroid profile
    ]
  },
  {
    id: "col-childrens",
    slug: "childrens-health",
    name: "Children’s Common Conditions",
    description: "Child-focused guides for fever, ear symptoms, common rashes, mouth sores, and when to seek care.",
    iconName: "Baby",
    entityIds: [
      "D0026", "D0085", "D0086", "D0087", "D0088", "D0093", // Otitis media, HFMD, Chickenpox, Measles, Conjunctivitis, Influenza
      "S0004", "S0040", "S0042", "S0018", "S0059", // Fever, Earache, Mouth ulcers, Skin rash, Sticky discharges
      "L0001" // CBC
    ]
  },
  {
    id: "col-respiratory",
    slug: "respiratory-disorders",
    name: "Respiratory & Allergy Conditions",
    description: "Asthma, sinus and allergy concerns, coughs, sore throats, and breathing symptoms.",
    iconName: "Wind",
    entityIds: [
      "D0005", "D0006", "D0007", "D0027", "D0028", "D0029", "D0054", "D0055", "D0061", "D0093", // Allergy, sinus, asthma, bronchitis, throat, cough, cold, laryngitis, flu
      "S0107", "S0009", "S0034", "S0069", "S0008", "S0037", "S0038", // Dry/wet cough, breathlessness, wheezing, sore throat, congestion, sneezing
      "L0001", "L0032" // CBC, Total IgE
    ]
  },
  {
    id: "col-skin",
    slug: "skin-conditions",
    name: "Skin Conditions",
    description: "Eczema, acne, psoriasis, itchy rashes, and everyday skin concerns.",
    iconName: "Smile",
    entityIds: [
      "D0002", "D0014", "D0015", "D0016", "D0036", "D0037", "D0038", "D0076", "D0077", "D0083", // Eczema, acne, psoriasis, hives, vitiligo, scalp conditions, contact dermatitis, ringworm, scabies
      "S0002", "S0114", "S0066", "S0018", // Skin eruptions, itching, dry skin, skin rash
      "L0001", "L0003" // CBC, ESR
    ]
  },
  {
    id: "col-thyroid",
    slug: "thyroid-disorders",
    name: "Thyroid Conditions",
    description: "Underactive and overactive thyroid guides, related symptoms, and common thyroid tests.",
    iconName: "ShieldAlert",
    entityIds: [
      "D0011", "D0012", "D0035", // Hypothyroidism, hyperthyroidism, alopecia areata
      "S0020", "S0007", "S0054", "S0021", // Weight gain, hair fall, cold extremities, palpitations
      "L0002", "L0010", "L0011", "L0022", "L0035", "L0036", "L0039" // TSH, T3/T4, thyroid profile, FT3/FT4, anti-TPO
    ]
  },
  {
    id: "col-mental",
    slug: "mental-wellness",
    name: "Mental Health & Sleep",
    description: "Anxiety, low mood, sleeplessness, fatigue, and practical next steps for persistent symptoms.",
    iconName: "Brain",
    entityIds: [
      "D0019", "D0020", "D0021", "D0025", "D0068", // Anxiety, depression, insomnia, ME/CFS, post-viral fatigue
      "S0047", "S0016", "S0013", "S0061", "S0048", // Anxiety, sleeplessness, fatigue, brain fog, restlessness
      "L0001", "L0009", "L0002", "L0008" // CBC, ferritin, TSH, vitamin B12
    ]
  },
  {
    id: "col-musculoskeletal",
    slug: "musculoskeletal-health",
    name: "Joint, Muscle & Spine Conditions",
    description: "Arthritis, gout, back pain, muscle symptoms, and the tests often used to investigate them.",
    iconName: "Accessibility",
    entityIds: [
      "D0017", "D0018", "D0022", "D0023", "D0024", "D0056", "D0067", // OA, cervical spondylosis, RA, gout, fibromyalgia, low back pain, plantar fasciitis
      "S0014", "S0015", "S0105", "S0030", "S0053", // Knee pain, joint pain, back pain, muscle cramps, muscle stiffness
      "L0003", "L0004", "L0019", "L0023", "L0024" // ESR, CRP, uric acid, RF, anti-CCP
    ]
  },
  {
    id: "col-lifestyle",
    slug: "lifestyle-prevention",
    name: "Metabolic & Preventive Health",
    description: "Blood pressure, diabetes, nutrition-related conditions, and routine health checks.",
    iconName: "Activity",
    entityIds: [
      "D0009", "D0010", "D0051", "D0052", "D0053", "D0072", // Hypertension, diabetes, anemia, vitamin deficiencies, hypoglycemia
      "S0019", "S0020", "S0027", "S0055", // Weight loss, weight gain, excessive thirst, excessive sweating
      "L0005", "L0006", "L0007", "L0008", "L0015", "L0016" // HbA1c, lipid profile, vitamin D/B12, fasting and post-meal glucose
    ]
  }
];

export function getEntitiesForCollection(collectionId: string): KnowledgeEntity[] {
  const collection = CURATED_COLLECTIONS.find(c => c.id === collectionId);
  if (!collection) return [];

  const entities = getAllKnowledgeEntities();
  const idSet = new Set(collection.entityIds);

  return entities.filter(e => idSet.has(e.id));
}
