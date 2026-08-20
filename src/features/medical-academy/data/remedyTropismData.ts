/**
 * HoloHuman™ Academy - 3D Remedy Organotropism & Affinity Knowledge Base
 * Maps homeopathic remedies to 3D anatomical structures, systems, and tissues.
 */

export interface RemedyOrganTropism {
  id: string;
  remedyName: string;
  commonName: string;
  sourceKingdom: "Plant" | "Mineral" | "Animal" | "Nosode" | "Sarcodes";
  miasmaticDominance: "Psora" | "Sycosis" | "Syphilis" | "Tubercular" | "Multi-Miasmatic";
  overallAffinityIntensity: number; // 0 - 100
  primaryGlowColor: string;
  targetOrgans: Array<{
    systemId: string;
    structureName: string;
    affinityScore: number; // 0 - 100
    pathologicalEffect: string;
    clinicalKeynotes: string;
  }>;
  differentialComparisons: string[];
}

export const REMEDY_TROPISM_DATA: Record<string, RemedyOrganTropism> = {
  nux_vomica: {
    id: "nux_vomica",
    remedyName: "Nux Vomica",
    commonName: "Poison Nut",
    sourceKingdom: "Plant",
    miasmaticDominance: "Psora",
    overallAffinityIntensity: 94,
    primaryGlowColor: "#F59E0B", // Amber Gold Aura
    targetOrgans: [
      {
        systemId: "digestive",
        structureName: "Stomach & Pyloric Sphincter",
        affinityScore: 96,
        pathologicalEffect: "Spastic hyperchlorhydria, gastralgia, reverse peristalsis",
        clinicalKeynotes: "Weight in stomach 2 hours after meals, irritable dyspepsia.",
      },
      {
        systemId: "digestive",
        structureName: "Hepatic Parenchyma & Portal Vein",
        affinityScore: 91,
        pathologicalEffect: "Portal congestion, toxic metabolite stagnation",
        clinicalKeynotes: "Liver engorged, sore to pressure; hemorrhoids with ineffectual urging.",
      },
      {
        systemId: "nervous",
        structureName: "Cerebrospinal Axis & Motor Neurons",
        affinityScore: 88,
        pathologicalEffect: "Hyperreflexia, nervous irritability, tetanic tendencies",
        clinicalKeynotes: "Extreme over-sensitiveness to noise, light, odors, and cold.",
      },
    ],
    differentialComparisons: ["Lycopodium Clavatum", "Sulphur", "Bryonia Alba"],
  },

  lycopodium: {
    id: "lycopodium",
    remedyName: "Lycopodium Clavatum",
    commonName: "Club Moss",
    sourceKingdom: "Plant",
    miasmaticDominance: "Psora",
    overallAffinityIntensity: 92,
    primaryGlowColor: "#E11D48", // Crimson-Coral Aura
    targetOrgans: [
      {
        systemId: "digestive",
        structureName: "Hepato-Biliary Axis & Gallbladder",
        affinityScore: 95,
        pathologicalEffect: "Biliary dyskinesia, hepatic sluggishness, lithiasis",
        clinicalKeynotes: "Fullness after a few mouthfuls, right hypochondriac tension.",
      },
      {
        systemId: "renal",
        structureName: "Right Kidney & Ureter",
        affinityScore: 93,
        pathologicalEffect: "Uric acid diathesis, renal lithiasis, micro-crystalluria",
        clinicalKeynotes: "Red sand in urine, renal colic aggravated 4 to 8 PM.",
      },
      {
        systemId: "digestive",
        structureName: "Ascending Colon & Ileocecal Valve",
        affinityScore: 89,
        pathologicalEffect: "Excessive fermentation, meteorism, atonic flatus",
        clinicalKeynotes: "Severe lower abdominal flatulence, aggravated late afternoon.",
      },
      {
        systemId: "respiratory",
        structureName: "Right Lower Lung Base",
        affinityScore: 82,
        pathologicalEffect: "Fan-like motion of alae nasi, chronic bronchopulmonary catarrh",
        clinicalKeynotes: "Right-to-left pneumonia resolution lag.",
      },
    ],
    differentialComparisons: ["Nux Vomica", "Chelidonium Majus", "Berberis Vulgaris"],
  },

  apis_mellifica: {
    id: "apis_mellifica",
    remedyName: "Apis Mellifica",
    commonName: "Honeybee",
    sourceKingdom: "Animal",
    miasmaticDominance: "Sycosis",
    overallAffinityIntensity: 95,
    primaryGlowColor: "#06B6D4", // Electric Cyan Aura
    targetOrgans: [
      {
        systemId: "renal",
        structureName: "Glomerular Filtration Membrane & Tubules",
        affinityScore: 98,
        pathologicalEffect: "Acute glomerulonephritis, albuminuria, rapid fluid transudation",
        clinicalKeynotes: "Oliguria, edema under eyes like water bags, absence of thirst.",
      },
      {
        systemId: "integumentary",
        structureName: "Dermal Capillary Plexus & Subcutis",
        affinityScore: 94,
        pathologicalEffect: "Urticaria, giant angioedema, erysipelatous inflammation",
        clinicalKeynotes: "Stinging, burning pains like hot needles; ameliorated by cold application.",
      },
      {
        systemId: "reproductive",
        structureName: "Right Ovary & Broad Ligament",
        affinityScore: 88,
        pathologicalEffect: "Oophoritis, follicular cysts, serous effusion",
        clinicalKeynotes: "Right ovarian stinging pain radiating across pelvis.",
      },
    ],
    differentialComparisons: ["Cantharis", "Arsenicum Album", "Rhus Toxicodendron"],
  },

  phosphorus: {
    id: "phosphorus",
    remedyName: "Phosphorus",
    commonName: "Elemental Phosphorus",
    sourceKingdom: "Mineral",
    miasmaticDominance: "Tubercular",
    overallAffinityIntensity: 96,
    primaryGlowColor: "#8B5CF6", // Violet-Amber Luminescence
    targetOrgans: [
      {
        systemId: "respiratory",
        structureName: "Lower Lobes of Lungs & Alveolar Capillaries",
        affinityScore: 97,
        pathologicalEffect: "Hepatization, alveolar hemorrhage, hemoptysis",
        clinicalKeynotes: "Tightness across chest, cough worse lying on left side.",
      },
      {
        systemId: "cardiovascular",
        structureName: "Capillary Endothelium & Microvascular Bed",
        affinityScore: 94,
        pathologicalEffect: "Endothelial fragility, diffuse petechiae, spontaneous ecchymosis",
        clinicalKeynotes: "Hemorrhagic diathesis; small wounds bleed profusely.",
      },
      {
        systemId: "nervous",
        structureName: "Cerebral White Matter & Spinal Cord",
        affinityScore: 90,
        pathologicalEffect: "Fatty degenerative change, neural exhaustion",
        clinicalKeynotes: "Brain fog, burning sensations along spine, sensory clairvoyance.",
      },
    ],
    differentialComparisons: ["Arsenicum Album", "Tuberculinum", "Sanguinaria"],
  },

  cactus_grandiflorus: {
    id: "cactus_grandiflorus",
    remedyName: "Cactus Grandiflorus",
    commonName: "Night-Blooming Cereus",
    sourceKingdom: "Plant",
    miasmaticDominance: "Sycosis",
    overallAffinityIntensity: 93,
    primaryGlowColor: "#DC2626", // Crimson Pulsing Aura
    targetOrgans: [
      {
        systemId: "cardiovascular",
        structureName: "Cardiac Myocardium & Coronary Arteries",
        affinityScore: 99,
        pathologicalEffect: "Coronary spasm, myocardial ischemia, circular muscle constriction",
        clinicalKeynotes: "Sensation as if heart were clutched and squeezed by an iron band.",
      },
    ],
    differentialComparisons: ["Digitalis Purpurea", "Crataegus", "Latrodectus Mactans"],
  },
};
