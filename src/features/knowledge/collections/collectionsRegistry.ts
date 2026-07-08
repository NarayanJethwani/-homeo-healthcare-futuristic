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
    name: "Digestive Health & Gastrointestinal Alignment",
    description: "Clinical guidelines for GERD, Gastritis, IBS, and related metabolic indicators.",
    iconName: "Flame",
    entityIds: [
      "D0001", "D0004", "D0008", "D0032", "D0033", // GERD, IBS, Gastritis, Dyspepsia, Inflammatory Bowel Disease
      "S0001", "S0010", "S0025", "S0038", // Heartburn, Constipation, Bloating, Flatulence
      "R0002", "R0003", "R0005", "R0013", // Nux Vomica, Lycopodium, Carbo Veg, Pulsatilla
      "L0006" // LFT (Liver Function Test)
    ]
  },
  {
    id: "col-womens",
    slug: "womens-health",
    name: "Women's Health & Endocrine Balance",
    description: "Hormonal cycles, PCOS, ovarian indicators, and related clinical support guidelines.",
    iconName: "Sparkles",
    entityIds: [
      "D0013", "D0041", "D0042", // PCOS, Endometriosis, Menopause
      "S0020", "S0035", // Irregular periods, Hot flashes
      "R0004", "R0013", "R0014", // Sepia, Pulsatilla, Lachesis
      "L0002", "L0007" // TSH, LH/FSH Panel
    ]
  },
  {
    id: "col-childrens",
    slug: "childrens-health",
    name: "Children's & Pediatric Therapeutics",
    description: "Gentle pediatric homeopathic guidelines for colic, acute fevers, and physical growth indicators.",
    iconName: "Baby",
    entityIds: [
      "D0034", "D0043", // Infant Colic, Otitis Media
      "S0015", "S0030", // Acute Fever, Pediatric Colic
      "R0006", "R0007", "R0009", // Chamomilla, Calc Carb, Belladonna
      "L0001" // CBC
    ]
  },
  {
    id: "col-respiratory",
    slug: "respiratory-disorders",
    name: "Respiratory, Allergies & Airway Health",
    description: "Management protocols for Asthma, Sinusitis, Allergic Rhinitis, and breathing support.",
    iconName: "Wind",
    entityIds: [
      "D0005", "D0006", "D0007", "D0035", // Allergic Rhinitis, Sinusitis, Asthma, Bronchitis
      "S0007", "S0011", "S0026", // Sneezing, Cough, Dyspnea
      "R0008", "R0009", "R0012", "R0015", // Arsenicum Alb, Belladonna, Hepar Sulph, Gelsemium
      "L0001", "L0004" // CBC, Chest X-Ray
    ]
  },
  {
    id: "col-skin",
    slug: "skin-conditions",
    name: "Skin & Dermatological Care",
    description: "Deep research on Eczema, Psoriasis, Acne, and chronic immune-mediated skin eruptions.",
    iconName: "Smile",
    entityIds: [
      "D0002", "D0014", "D0015", "D0016", // Eczema, Acne Vulgaris, Psoriasis, Urticaria
      "S0002", "S0012", "S0032", // Skin Eruptions, Itching, Dryness
      "R0001", "R0010", "R0018", // Sulphur, Graphites, Thuja
      "L0001", "L0003" // CBC, ESR
    ]
  },
  {
    id: "col-thyroid",
    slug: "thyroid-disorders",
    name: "Thyroid & Endocrine Function",
    description: "Investigation parameters and supportive homeo-care for Hypothyroidism & Hyperthyroidism.",
    iconName: "ShieldAlert",
    entityIds: [
      "D0011", "D0012", // Hypothyroidism, Hyperthyroidism
      "S0021", "S0022", "S0031", // Weight gain, Cold intolerance, Hair loss
      "R0011", "R0019", // Thyroidinum, Iodum
      "L0002" // TSH
    ]
  },
  {
    id: "col-mental",
    slug: "mental-wellness",
    name: "Mental Wellness & Cognitive Equilibrium",
    description: "Support for anxiety, stress adaptation, acute grief responses, and physical fatigue syndromes.",
    iconName: "Brain",
    entityIds: [
      "D0037", "D0044", // Generalized Anxiety, Chronic Fatigue
      "S0006", "S0019", "S0028", // Sleep onset insomnia, Mental fatigue, Grief
      "R0015", "R0016", "R0020", // Gelsemium, Ignatia, Aconitum
      "L0001" // CBC (rules out anemia-induced fatigue)
    ]
  },
  {
    id: "col-musculoskeletal",
    slug: "musculoskeletal-health",
    name: "Musculoskeletal & Joint Care",
    description: "Clinical guidelines on arthritis, backache, inflammatory joint markers, and pain control.",
    iconName: "Accessibility",
    entityIds: [
      "D0022", "D0023", "D0045", // Rheumatoid Arthritis, Osteoarthritis, Gout
      "S0016", "S0027", "S0039", // Joint pain, Joint stiffness, Muscle cramps
      "R0017", "R0021", "R0022", // Rhus Tox, Bryonia, Arnica
      "L0003", "L0005" // ESR, CRP (C-Reactive Protein)
    ]
  },
  {
    id: "col-lifestyle",
    slug: "lifestyle-prevention",
    name: "Lifestyle, Diet & Preventive Health",
    description: "General wellness disclaimers, routine blood checks, and long-term metabolic health.",
    iconName: "Activity",
    entityIds: [
      "D0009", "D0010", "D0038", // Hypertension, Diabetes Mellitus, Dyslipidemia
      "S0023", "S0034", // High blood pressure, Polyuria
      "R0002", "R0007", "R0023", // Nux Vomica, Calc Carb, Syzygium
      "L0004", "L0006", "L0008" // HbA1c, LFT, Lipid Profile
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
