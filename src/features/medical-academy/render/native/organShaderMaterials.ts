/**
 * HoloHuman™ Native 3D Physical Shaders & Material Presets
 * Experimental PBR materials for procedural development placeholders,
 * including translucency and emissive focus effects.
 */

import * as THREE from "three";
import { AnatomySystemId } from "../../data/medicalAcademyData";

export interface OrganMaterialSet {
  primary: THREE.MeshPhysicalMaterial;
  secondary: THREE.MeshPhysicalMaterial;
  accent: THREE.MeshPhysicalMaterial;
  ghost: THREE.MeshPhysicalMaterial;
  highlight: THREE.MeshPhysicalMaterial;
  tropismAura: THREE.MeshPhysicalMaterial;
}

export function createOrganMaterials(systemId: AnatomySystemId, accentColor: string): OrganMaterialSet {
  const primaryColor = new THREE.Color(accentColor);
  
  // Ghost material (translucent X-Ray background)
  const ghost = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x38bdf8),
    transparent: true,
    opacity: 0.14,
    roughness: 0.2,
    metalness: 0.1,
    transmission: 0.85,
    ior: 1.2,
    depthWrite: false,
    wireframe: false,
  });

  // Focused highlight material
  const highlight = new THREE.MeshPhysicalMaterial({
    color: primaryColor.clone().offsetHSL(0, 0.2, 0.2),
    emissive: primaryColor.clone().multiplyScalar(0.4),
    emissiveIntensity: 0.6,
    roughness: 0.25,
    metalness: 0.15,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  });

  // Organotropism Homeopathic Energy Aura
  const tropismAura = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xf59e0b),
    emissive: new THREE.Color(0xd97706),
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.75,
    roughness: 0.1,
    metalness: 0.3,
    clearcoat: 1.0,
  });

  switch (systemId) {
    case "endocrine":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xeab308), // Glandular Amber
          emissive: new THREE.Color(0x713f12),
          emissiveIntensity: 0.2,
          roughness: 0.35,
          metalness: 0.05,
          clearcoat: 0.6,
          clearcoatRoughness: 0.2,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf97316), // Thyroid Peach
          roughness: 0.4,
          metalness: 0.05,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x38bdf8), // Pituitary / Pineal Crystal
          emissive: new THREE.Color(0x0284c7),
          emissiveIntensity: 0.4,
          roughness: 0.2,
          metalness: 0.2,
          clearcoat: 0.9,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "cardiovascular":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xbe123c), // Deep Myocardial Crimson
          emissive: new THREE.Color(0x4c0519),
          emissiveIntensity: 0.25,
          roughness: 0.3,
          metalness: 0.1,
          clearcoat: 0.7,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x2563eb), // Deoxygenated Venous Blue
          roughness: 0.35,
          metalness: 0.1,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xfacc15), // Conduction SA/AV Node Gold
          emissive: new THREE.Color(0xeab308),
          emissiveIntensity: 0.6,
          roughness: 0.2,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "nervous":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x8b5cf6), // Cortical Gray/Purple Matter
          emissive: new THREE.Color(0x4c1d95),
          emissiveIntensity: 0.2,
          roughness: 0.45,
          metalness: 0.05,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xc084fc), // Cerebellar Folia
          roughness: 0.4,
          metalness: 0.05,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x06b6d4), // Axon Action Potential Cyan
          emissive: new THREE.Color(0x0891b2),
          emissiveIntensity: 0.7,
          roughness: 0.15,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "respiratory":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x38bdf8), // Pulmonary Alveolar Sky
          roughness: 0.35,
          metalness: 0.05,
          transmission: 0.3,
          opacity: 0.9,
          transparent: true,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x94a3b8), // Cartilaginous Trachea
          roughness: 0.25,
          metalness: 0.15,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x0ea5e9), // Bronchial Arborization
          emissive: new THREE.Color(0x0369a1),
          emissiveIntensity: 0.3,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "renal":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x0f766e), // Renal Cortex Deep Teal
          roughness: 0.3,
          metalness: 0.1,
          clearcoat: 0.5,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x14b8a6), // Medullary Pyramids
          roughness: 0.35,
          metalness: 0.05,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf59e0b), // Ureters & Bladder
          roughness: 0.3,
          metalness: 0.1,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "digestive":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xb45309), // Hepatic Ochre Brown
          roughness: 0.35,
          metalness: 0.05,
          clearcoat: 0.4,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xd97706), // Gastric Wall Amber
          roughness: 0.4,
          metalness: 0.05,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x15803d), // Gallbladder Emerald
          emissive: new THREE.Color(0x166534),
          emissiveIntensity: 0.3,
          roughness: 0.25,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "skeletal":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xe2e8f0), // Compact Cortical Bone Ivory
          roughness: 0.4,
          metalness: 0.05,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x94a3b8), // Trabecular Cancellous Matrix
          roughness: 0.5,
          metalness: 0.1,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x38bdf8), // Hyaline Articular Cartilage
          roughness: 0.15,
          metalness: 0.1,
          transmission: 0.6,
          transparent: true,
          opacity: 0.85,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "muscular":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xdc2626), // Striated Muscle Belly Red
          roughness: 0.4,
          metalness: 0.05,
          clearcoat: 0.3,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf1f5f9), // Tendinous Aponeurosis Pearl
          roughness: 0.25,
          metalness: 0.1,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf87171), // Myofascial Sheath
          roughness: 0.3,
          transmission: 0.3,
          transparent: true,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "lymphatic":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x10b981), // Emerald Lymph Vessels
          roughness: 0.25,
          metalness: 0.1,
          transmission: 0.5,
          transparent: true,
          opacity: 0.8,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x34d399), // Lymph Node Nodes
          emissive: new THREE.Color(0x059669),
          emissiveIntensity: 0.3,
          roughness: 0.3,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x8b5cf6), // Splenic Pulp Purple
          roughness: 0.35,
          metalness: 0.1,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "reproductive":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xdb2777), // Myometrial Deep Rose
          roughness: 0.35,
          metalness: 0.05,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf472b6), // Endometrial Layer
          roughness: 0.3,
          metalness: 0.05,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xfbbf24), // Gonadal Ovarian/Testicular Follicles
          emissive: new THREE.Color(0xd97706),
          emissiveIntensity: 0.3,
          roughness: 0.25,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "integumentary":
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf59e0b), // Epidermal Stratum Corneum
          roughness: 0.45,
          metalness: 0.05,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xfb7185), // Vascularized Dermal Bed
          roughness: 0.35,
          metalness: 0.05,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xfef08a), // Subcutaneous Adipose Tissue
          roughness: 0.3,
          metalness: 0.1,
        }),
        ghost,
        highlight,
        tropismAura,
      };

    case "sensory":
    default:
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x38bdf8), // Optical Vitreous / Cochlea
          roughness: 0.15,
          metalness: 0.1,
          transmission: 0.7,
          transparent: true,
          opacity: 0.85,
        }),
        secondary: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x0284c7), // Retinal Macula / Organ of Corti
          emissive: new THREE.Color(0x0369a1),
          emissiveIntensity: 0.4,
          roughness: 0.3,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xfbbf24), // Photoreceptor / Acoustic Nerve
          emissive: new THREE.Color(0xd97706),
          emissiveIntensity: 0.6,
          roughness: 0.2,
        }),
        ghost,
        highlight,
        tropismAura,
      };
  }
}
