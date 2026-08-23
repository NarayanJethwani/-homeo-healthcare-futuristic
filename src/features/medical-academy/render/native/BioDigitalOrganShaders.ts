/**
 * Experimental PBR materials for procedural anatomy placeholders.
 * These visual approximations are not calibrated tissue simulations and do not
 * imply photorealism, anatomical validation, or BioDigital affiliation.
 */

import * as THREE from "three";
import { AnatomySystemId } from "../../data/medicalAcademyData";

// Generate a procedural noise texture for development materials.
function generateBiologicalNoiseTexture(type: "glandular" | "muscle" | "cortical" | "capsular"): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      let val = 128;
      const x = (i / 4) % size;
      const y = Math.floor(i / 4 / size);

      if (type === "glandular") {
        // Micro-lobular cobblestone texture
        val += Math.sin(x * 0.2) * 25 + Math.cos(y * 0.2) * 25 + (Math.random() - 0.5) * 20;
      } else if (type === "muscle") {
        // Striated linear muscle fiber grain
        val += Math.sin(y * 0.4) * 35 + (Math.random() - 0.5) * 15;
      } else if (type === "cortical") {
        // Gyral convolution noise
        val += Math.sin(x * 0.1 + y * 0.1) * 30 + Math.cos(x * 0.15 - y * 0.05) * 25;
      } else {
        // Smooth capsular micro-grain
        val += (Math.random() - 0.5) * 18;
      }

      val = Math.max(0, Math.min(255, val));
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export interface RealisticMaterialSuite {
  primaryOrgan: THREE.MeshPhysicalMaterial;
  secondaryOrgan: THREE.MeshPhysicalMaterial;
  vascularArtery: THREE.MeshPhysicalMaterial;
  vascularVein: THREE.MeshPhysicalMaterial;
  connectiveTissue: THREE.MeshPhysicalMaterial;
  highlightSelected: THREE.MeshPhysicalMaterial;
  ghostUnselected: THREE.MeshPhysicalMaterial;
  homeopathicAura: THREE.MeshPhysicalMaterial;
}

export function createBioDigitalShaders(
  systemId: AnatomySystemId,
  accentColor: string
): RealisticMaterialSuite {
  const isClient = typeof window !== "undefined";
  const glandularBump = isClient ? generateBiologicalNoiseTexture("glandular") : null;
  const muscleBump = isClient ? generateBiologicalNoiseTexture("muscle") : null;
  const corticalBump = isClient ? generateBiologicalNoiseTexture("cortical") : null;
  const capsularBump = isClient ? generateBiologicalNoiseTexture("capsular") : null;

  // 1. Universal Vascular Materials (Arterial Oxygenated Red & Venous Deep Blue)
  const vascularArtery = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xb91c1c), // Oxygenated Red
    emissive: new THREE.Color(0x450a0a),
    emissiveIntensity: 0.15,
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.85,
    clearcoatRoughness: 0.15,
    bumpMap: capsularBump,
    bumpScale: 0.02,
  });

  const vascularVein = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x1d4ed8), // Deoxygenated Deep Blue
    emissive: new THREE.Color(0x172554),
    emissiveIntensity: 0.1,
    roughness: 0.28,
    metalness: 0.1,
    clearcoat: 0.85,
    clearcoatRoughness: 0.15,
    bumpMap: capsularBump,
    bumpScale: 0.02,
  });

  // 2. Translucent Fascia / Cartilage
  const connectiveTissue = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xf1f5f9),
    roughness: 0.2,
    metalness: 0.05,
    transmission: 0.45,
    thickness: 0.5,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    bumpMap: capsularBump,
    bumpScale: 0.015,
  });

  // 3. Isolated focus highlight material with an emissive rim.
  const highlightSelected = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(accentColor),
    emissive: new THREE.Color(accentColor),
    emissiveIntensity: 0.4,
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    bumpMap: capsularBump,
    bumpScale: 0.03,
  });

  // 4. Ghost Material (Preserves anatomical structure without harsh blue wash)
  const ghostUnselected = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x64748b),
    transparent: true,
    opacity: 0.35,
    roughness: 0.3,
    metalness: 0.05,
    transmission: 0.6,
    depthWrite: false,
  });

  // 5. Homeopathic Organotropism Active Energy Aura
  const homeopathicAura = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xf59e0b),
    emissive: new THREE.Color(0xd97706),
    emissiveIntensity: 0.75,
    roughness: 0.1,
    metalness: 0.2,
    clearcoat: 1.0,
  });

  // 6. System-Specific Living Biological Materials
  switch (systemId) {
    case "endocrine":
      return {
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xd97706), // Placeholder thyroid color
          emissive: new THREE.Color(0x78350f),
          emissiveIntensity: 0.15,
          roughness: 0.32,
          metalness: 0.05,
          clearcoat: 0.92,
          clearcoatRoughness: 0.12,
          bumpMap: glandularBump,
          bumpScale: 0.04,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xeab308), // Suprarenal Adrenal Ochre
          emissive: new THREE.Color(0x713f12),
          emissiveIntensity: 0.18,
          roughness: 0.35,
          metalness: 0.05,
          clearcoat: 0.88,
          bumpMap: glandularBump,
          bumpScale: 0.035,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf59e0b),
          emissive: new THREE.Color(0xd97706),
          emissiveIntensity: 0.35,
          roughness: 0.28,
          clearcoat: 0.95,
          bumpMap: glandularBump,
          bumpScale: 0.04,
        }),
        ghostUnselected,
        homeopathicAura,
      };

    case "cardiovascular":
      return {
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x881337), // Deep Myocardial Ruby
          emissive: new THREE.Color(0x4c0519),
          emissiveIntensity: 0.2,
          roughness: 0.28,
          metalness: 0.08,
          clearcoat: 0.95,
          clearcoatRoughness: 0.1,
          bumpMap: muscleBump,
          bumpScale: 0.045,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xbe123c), // Atrial Myocardium
          roughness: 0.3,
          clearcoat: 0.9,
          bumpMap: muscleBump,
          bumpScale: 0.03,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xbe123c),
          emissive: new THREE.Color(0xe11d48),
          emissiveIntensity: 0.4,
          roughness: 0.25,
          clearcoat: 0.95,
          bumpMap: muscleBump,
          bumpScale: 0.045,
        }),
        ghostUnselected,
        homeopathicAura,
      };

    case "nervous":
      return {
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xd4d4d8), // Neocortical Gray-Beige
          emissive: new THREE.Color(0x52525b),
          emissiveIntensity: 0.12,
          roughness: 0.38,
          metalness: 0.02,
          clearcoat: 0.85,
          clearcoatRoughness: 0.15,
          bumpMap: corticalBump,
          bumpScale: 0.06,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xa1a1aa), // Cerebellar Folia & Brainstem
          roughness: 0.42,
          clearcoat: 0.8,
          bumpMap: corticalBump,
          bumpScale: 0.04,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xa855f7),
          emissive: new THREE.Color(0x7c3aed),
          emissiveIntensity: 0.35,
          roughness: 0.3,
          clearcoat: 0.9,
          bumpMap: corticalBump,
          bumpScale: 0.06,
        }),
        ghostUnselected,
        homeopathicAura,
      };

    case "respiratory":
      return {
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf472b6), // Healthy Oxygenated Alveolar Pink
          emissive: new THREE.Color(0x831843),
          emissiveIntensity: 0.12,
          roughness: 0.4,
          metalness: 0.03,
          clearcoat: 0.9,
          bumpMap: glandularBump,
          bumpScale: 0.05,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xe2e8f0), // Cartilaginous Tracheal C-Rings
          roughness: 0.25,
          clearcoat: 0.85,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x38bdf8),
          emissive: new THREE.Color(0x0284c7),
          emissiveIntensity: 0.35,
          roughness: 0.3,
          clearcoat: 0.9,
          bumpMap: glandularBump,
          bumpScale: 0.05,
        }),
        ghostUnselected,
        homeopathicAura,
      };

    case "renal":
      return {
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x713f12), // Deep Mahogany Renal Cortex
          emissive: new THREE.Color(0x451a03),
          emissiveIntensity: 0.15,
          roughness: 0.28,
          metalness: 0.06,
          clearcoat: 0.95,
          clearcoatRoughness: 0.1,
          bumpMap: capsularBump,
          bumpScale: 0.03,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xb45309), // Renal Medulla Pyramids
          roughness: 0.35,
          clearcoat: 0.85,
          bumpMap: capsularBump,
          bumpScale: 0.025,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x9a3412),
          emissive: new THREE.Color(0xc2410c),
          emissiveIntensity: 0.35,
          roughness: 0.28,
          clearcoat: 0.95,
          bumpMap: capsularBump,
          bumpScale: 0.03,
        }),
        ghostUnselected,
        homeopathicAura,
      };

    case "digestive":
      return {
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x7c2d12), // Hepatic Terracotta Brown
          emissive: new THREE.Color(0x451a03),
          emissiveIntensity: 0.15,
          roughness: 0.28,
          metalness: 0.06,
          clearcoat: 0.95,
          bumpMap: capsularBump,
          bumpScale: 0.02,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xc2410c), // Gastric Wall & Rugae
          roughness: 0.34,
          clearcoat: 0.9,
          bumpMap: glandularBump,
          bumpScale: 0.04,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xea580c),
          emissive: new THREE.Color(0xc2410c),
          emissiveIntensity: 0.35,
          roughness: 0.3,
          clearcoat: 0.95,
          bumpMap: glandularBump,
          bumpScale: 0.04,
        }),
        ghostUnselected,
        homeopathicAura,
      };

    case "skeletal":
      return {
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xfef3c7), // Placeholder bone color
          roughness: 0.45,
          metalness: 0.02,
          clearcoat: 0.4,
          bumpMap: capsularBump,
          bumpScale: 0.03,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xe0f2fe), // Hyaline Articular Cartilage
          roughness: 0.15,
          transmission: 0.6,
          clearcoat: 0.95,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x38bdf8),
          emissive: new THREE.Color(0x0284c7),
          emissiveIntensity: 0.35,
          roughness: 0.3,
          clearcoat: 0.8,
        }),
        ghostUnselected,
        homeopathicAura,
      };

    default:
      return {
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(accentColor),
          roughness: 0.3,
          metalness: 0.05,
          clearcoat: 0.9,
          clearcoatRoughness: 0.12,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(accentColor).offsetHSL(0, 0.1, 0.1),
          roughness: 0.35,
          clearcoat: 0.85,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected,
        ghostUnselected,
        homeopathicAura,
      };
  }
}
