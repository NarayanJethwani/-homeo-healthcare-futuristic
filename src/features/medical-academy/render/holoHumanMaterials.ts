/**
 * HoloHuman™ Academy - Photorealistic PBR Material & Shader Definitions
 * Calibrated against BioDigital Human™ & Complete Anatomy clinical visualization standards.
 * 
 * Supports physically based rendering (PBR):
 * - Subsurface Scattering (SSS) approximations for parenchymal & fleshy tissues
 * - Optical transmission & IOR for articular cartilage & ocular structures
 * - Anisotropic / clearcoat specular highlights for wet serosa, myocardium, and fascial sheaths
 * - Calibrated dark/light mode contrast values
 */

export interface SystemMaterialConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  sssColor?: string;
  roughness: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  thickness?: number;
  ior?: number;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
  wireframe?: boolean;
}

/**
 * Photorealistic 12-System Clinical Colorimetry Matrix
 */
export const HOLOHUMAN_SYSTEM_MATERIALS: Record<string, SystemMaterialConfig> = {
  // 1. Skeletal & Articular System
  skeletal_bone: {
    id: "skeletal_bone",
    name: "Cortical Bone (Osteon Matrix)",
    primaryColor: "#F4EBD9", // Aged ivory with micro-porosity
    roughness: 0.42,
    metalness: 0.05,
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
  },
  skeletal_cartilage: {
    id: "skeletal_cartilage",
    name: "Articular Hyaline Cartilage",
    primaryColor: "#D8E8F5", // Opalescent translucent blue-white
    roughness: 0.15,
    metalness: 0.02,
    transmission: 0.65,
    thickness: 0.8,
    ior: 1.38,
    sssColor: "#93C5FD",
  },
  skeletal_marrow: {
    id: "skeletal_marrow",
    name: "Cancellous Bone Marrow",
    primaryColor: "#C29B38", // Deep ochre trabecular matrix
    roughness: 0.75,
    metalness: 0.0,
  },

  // 2. Muscular System
  muscular_superficial: {
    id: "muscular_superficial",
    name: "Superficial Muscle Bellies",
    primaryColor: "#8B263E", // Rich myoglobin crimson
    sssColor: "#B91C1C",
    roughness: 0.38,
    metalness: 0.05,
    clearcoat: 0.65,
    clearcoatRoughness: 0.25,
    thickness: 1.2,
  },
  muscular_deep: {
    id: "muscular_deep",
    name: "Deep Postural Muscle",
    primaryColor: "#6B1D2F", // Dark mahogany red
    sssColor: "#991B1B",
    roughness: 0.45,
    metalness: 0.05,
    clearcoat: 0.4,
  },
  muscular_tendon: {
    id: "muscular_tendon",
    name: "Tendons & Aponeuroses",
    primaryColor: "#EAECEE", // Glistening pearlescent tendon white
    roughness: 0.18,
    metalness: 0.08,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
  },
  muscular_fascia: {
    id: "muscular_fascia",
    name: "Myofascial Sheath",
    primaryColor: "#F1F5F9",
    roughness: 0.2,
    metalness: 0.02,
    transmission: 0.7,
    opacity: 0.35,
    thickness: 0.3,
  },

  // 3. Cardiovascular System
  cardiovascular_artery: {
    id: "cardiovascular_artery",
    name: "Systemic Arterial Network",
    primaryColor: "#C51E28", // Oxygenated arterial ruby
    sssColor: "#EF4444",
    roughness: 0.25,
    metalness: 0.05,
    clearcoat: 0.85,
    clearcoatRoughness: 0.15,
  },
  cardiovascular_vein: {
    id: "cardiovascular_vein",
    name: "Systemic Venous Network",
    primaryColor: "#1E40AF", // Deoxygenated deep venous indigo
    roughness: 0.3,
    metalness: 0.05,
    clearcoat: 0.75,
    clearcoatRoughness: 0.2,
    opacity: 0.92,
  },
  cardiovascular_myocardium: {
    id: "cardiovascular_myocardium",
    name: "Cardiac Myocardium",
    primaryColor: "#5C1425", // Dense muscular oxblood
    sssColor: "#991B1B",
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
  },
  cardiovascular_capillary: {
    id: "cardiovascular_capillary",
    name: "Microvascular Capillary Bed",
    primaryColor: "#F43F5E", // Delicate coral pink
    roughness: 0.4,
    metalness: 0.0,
    opacity: 0.75,
  },

  // 4. Nervous System
  nervous_cortex: {
    id: "nervous_cortex",
    name: "Cerebral Cortex (Grey Matter)",
    primaryColor: "#B8A29A", // Warm mauve-beige
    roughness: 0.55,
    metalness: 0.02,
    clearcoat: 0.3,
  },
  nervous_white_matter: {
    id: "nervous_white_matter",
    name: "White Matter (Axon Tracts)",
    primaryColor: "#F1EBE0", // Glistening porcelain cream
    roughness: 0.35,
    metalness: 0.05,
    transmission: 0.3,
  },
  nervous_peripheral: {
    id: "nervous_peripheral",
    name: "Peripheral & Cranial Nerves",
    primaryColor: "#FDE047", // Myelin electric pale yellow
    roughness: 0.22,
    metalness: 0.08,
    clearcoat: 0.75,
    clearcoatRoughness: 0.2,
  },

  // 5. Respiratory System
  respiratory_lung: {
    id: "respiratory_lung",
    name: "Lung Parenchyma (Alveoli)",
    primaryColor: "#DB8B95", // Spongy pale rose
    sssColor: "#FB7185",
    roughness: 0.58,
    metalness: 0.0,
    thickness: 1.2,
  },
  respiratory_trachea: {
    id: "respiratory_trachea",
    name: "Tracheobronchial Cartilage",
    primaryColor: "#93C5FD", // Semi-translucent bluish white C-rings
    roughness: 0.2,
    metalness: 0.02,
    transmission: 0.5,
    clearcoat: 0.6,
  },

  // 6. Digestive System & Hepatic-Biliary
  digestive_liver: {
    id: "digestive_liver",
    name: "Hepatic Parenchyma (Liver)",
    primaryColor: "#4A1D1A", // Deep reddish-brown satin
    sssColor: "#7F1D1D",
    roughness: 0.32,
    metalness: 0.05,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
    thickness: 1.5,
  },
  digestive_gallbladder: {
    id: "digestive_gallbladder",
    name: "Gallbladder & Bile Duct",
    primaryColor: "#166534", // Emerald-olive bile luster
    roughness: 0.2,
    metalness: 0.05,
    clearcoat: 0.85,
    transmission: 0.25,
  },
  digestive_stomach: {
    id: "digestive_stomach",
    name: "Gastric Rugae & Wall",
    primaryColor: "#BE5A6B", // Rugae-textured warm gastric pink
    sssColor: "#F43F5E",
    roughness: 0.35,
    metalness: 0.02,
    clearcoat: 0.8,
  },
  digestive_pancreas: {
    id: "digestive_pancreas",
    name: "Pancreatic Glandular Lobules",
    primaryColor: "#D4A373", // Lobular buff yellow-tan
    roughness: 0.65,
    metalness: 0.0,
  },
  digestive_intestine: {
    id: "digestive_intestine",
    name: "Small & Large Intestine",
    primaryColor: "#C86D74", // Vascular warm salmon
    roughness: 0.38,
    metalness: 0.02,
    clearcoat: 0.75,
  },

  // 7. Renal & Urinary System
  renal_cortex: {
    id: "renal_cortex",
    name: "Renal Cortex & Glomeruli",
    primaryColor: "#64201E", // Dense red-brown parenchyma
    sssColor: "#991B1B",
    roughness: 0.36,
    metalness: 0.05,
    clearcoat: 0.7,
  },
  renal_medulla: {
    id: "renal_medulla",
    name: "Renal Medullary Pyramids",
    primaryColor: "#831843", // Striated purplish crimson
    roughness: 0.45,
    metalness: 0.0,
  },
  renal_bladder: {
    id: "renal_bladder",
    name: "Urinary Bladder & Ureters",
    primaryColor: "#D9777F", // Elastic detrusor amber-pink
    roughness: 0.28,
    metalness: 0.02,
    clearcoat: 0.9,
  },

  // 8. Lymphatic & Immune System
  lymphatic_vessel: {
    id: "lymphatic_vessel",
    name: "Lymphatic Vessels & Nodes",
    primaryColor: "#10B981", // Translucent pale jade
    roughness: 0.25,
    metalness: 0.05,
    transmission: 0.45,
    opacity: 0.75,
    emissive: "#059669",
    emissiveIntensity: 0.15,
  },
  lymphatic_spleen: {
    id: "lymphatic_spleen",
    name: "Splenic Red & White Pulp",
    primaryColor: "#4C0519", // Deep friable purple-maroon
    roughness: 0.3,
    metalness: 0.05,
    clearcoat: 0.75,
  },

  // 9. Endocrine System
  endocrine_thyroid: {
    id: "endocrine_thyroid",
    name: "Thyroid Gland Lobes",
    primaryColor: "#9F1239", // Vascular ruby-tan
    roughness: 0.4,
    metalness: 0.02,
    clearcoat: 0.6,
  },
  endocrine_adrenal: {
    id: "endocrine_adrenal",
    name: "Suprarenal Adrenal Glands",
    primaryColor: "#EAB308", // Golden-yellow cortex
    roughness: 0.55,
    metalness: 0.05,
  },
  endocrine_pituitary: {
    id: "endocrine_pituitary",
    name: "Pituitary Gland (Hypophysis)",
    primaryColor: "#F43F5E", // Rose pearl
    roughness: 0.3,
    metalness: 0.02,
    transmission: 0.4,
  },

  // 10. Integumentary & Fascia System
  integumentary_skin: {
    id: "integumentary_skin",
    name: "Epidermis & Dermis (Fitzpatrick II/III)",
    primaryColor: "#E0B398", // Natural human skin tone
    sssColor: "#EA580C",
    roughness: 0.48,
    metalness: 0.02,
    clearcoat: 0.25,
    clearcoatRoughness: 0.4,
    thickness: 1.0,
  },
  integumentary_adipose: {
    id: "integumentary_adipose",
    name: "Subcutaneous Adipose Tissue",
    primaryColor: "#FBBF24", // Golden honeycomb lipid cells
    roughness: 0.65,
    metalness: 0.0,
  },

  // 11. Reproductive System
  reproductive_uterus: {
    id: "reproductive_uterus",
    name: "Uterine Myometrium & Adnexa",
    primaryColor: "#991B1B", // Muscular crimson
    roughness: 0.35,
    metalness: 0.02,
    clearcoat: 0.7,
  },
  reproductive_gonads: {
    id: "reproductive_gonads",
    name: "Gonadal Tissue (Ovaries/Testes)",
    primaryColor: "#E2E8F0", // Pearlescent ivory-white
    roughness: 0.25,
    metalness: 0.02,
    transmission: 0.35,
    clearcoat: 0.8,
  },

  // 12. Sensory System (Eye / Ear)
  sensory_cornea: {
    id: "sensory_cornea",
    name: "Cornea & Anterior Chamber",
    primaryColor: "#FFFFFF",
    roughness: 0.0,
    metalness: 0.0,
    transmission: 1.0,
    thickness: 0.5,
    ior: 1.376,
  },
  sensory_cochlea: {
    id: "sensory_cochlea",
    name: "Bony Labyrinth (Cochlea)",
    primaryColor: "#F59E0B", // Bone amber gold
    roughness: 0.3,
    metalness: 0.15,
  },
};

/**
 * X-Ray Ghost Material (applied to non-focused organs during search or isolation)
 */
export const HOLOHUMAN_GHOST_MATERIAL = {
  darkMode: {
    color: "#1E293B",
    opacity: 0.12,
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    depthWrite: false,
  },
  lightMode: {
    color: "#CBD5E1",
    opacity: 0.18,
    roughness: 0.8,
    metalness: 0.0,
    transparent: true,
    depthWrite: false,
  },
};
