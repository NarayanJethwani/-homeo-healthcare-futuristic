/**
 * BioDigital-Grade PBR Photorealistic Organ Shaders
 * Simulates living human biological tissues with wet serous reflections,
 * procedural cellular micro-bump textures, subsurface scattering approximations,
 * and authentic physiological pigmentation.
 */

import * as THREE from "three";
import { AnatomySystemId } from "../../data/medicalAcademyData";

// Generate procedural micro-bump texture for living biological tissue
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

  // 3. Isolated Focus Highlight Material
  const highlightSelected = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x38bdf8),
    emissive: new THREE.Color(0x0284c7),
    emissiveIntensity: 0.45,
    roughness: 0.2,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  // 4. Translucent Blue X-Ray Ghost Material
  const ghostUnselected = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x38bdf8),
    transparent: true,
    opacity: 0.16,
    roughness: 0.15,
    metalness: 0.05,
    transmission: 0.85,
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
        // Glandular amber-rose living parenchyma with lobular bump
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xd97706), // Authentic Thyroid Amber-Rose
          emissive: new THREE.Color(0x78350f),
          emissiveIntensity: 0.18,
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
          emissiveIntensity: 0.2,
          roughness: 0.35,
          metalness: 0.05,
          clearcoat: 0.88,
          bumpMap: glandularBump,
          bumpScale: 0.035,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected,
        ghostUnselected,
        homeopathicAura,
      };

    case "cardiovascular":
      return {
        // Deep living myocardial muscle with striated fiber bump
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x991b1b), // Deep Myocardial Ruby
          emissive: new THREE.Color(0x450a0a),
          emissiveIntensity: 0.25,
          roughness: 0.28,
          metalness: 0.08,
          clearcoat: 0.95, // Serous pericardium wet gleam
          clearcoatRoughness: 0.1,
          bumpMap: muscleBump,
          bumpScale: 0.045,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xe11d48), // Atrial Myocardium
          roughness: 0.3,
          clearcoat: 0.9,
          bumpMap: muscleBump,
          bumpScale: 0.03,
        }),
        vascularArtery,
        vascularVein,
        connectiveTissue,
        highlightSelected,
        ghostUnselected,
        homeopathicAura,
      };

    case "nervous":
      return {
        // Living gray/white cerebral cortex with gyral convolution bump
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xd4d4d8), // Neocortical Gray-Beige
          emissive: new THREE.Color(0x52525b),
          emissiveIntensity: 0.15,
          roughness: 0.38,
          metalness: 0.02,
          clearcoat: 0.85, // Arachnoid mater wet sheen
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
        highlightSelected,
        ghostUnselected,
        homeopathicAura,
      };

    case "respiratory":
      return {
        // Spongy pulmonary parenchyma
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xf472b6), // Healthy Oxygenated Alveolar Pink
          emissive: new THREE.Color(0x831843),
          emissiveIntensity: 0.12,
          roughness: 0.4,
          metalness: 0.03,
          clearcoat: 0.9, // Visceral pleura sheen
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
        highlightSelected,
        ghostUnselected,
        homeopathicAura,
      };

    case "renal":
      return {
        // Mahogany-red renal parenchyma with smooth renal capsule
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x881337), // Mahogany Renal Cortex
          emissive: new THREE.Color(0x4c0519),
          emissiveIntensity: 0.2,
          roughness: 0.28,
          metalness: 0.08,
          clearcoat: 0.95, // Glisson/renal fibrous capsule sheen
          clearcoatRoughness: 0.1,
          bumpMap: capsularBump,
          bumpScale: 0.025,
        }),
        secondaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xbe123c), // Medullary Pyramids
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

    case "digestive":
      return {
        // Hepatic terracotta & Gastric rugae wall
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x7c2d12), // Hepatic Terracotta Brown
          emissive: new THREE.Color(0x451a03),
          emissiveIntensity: 0.18,
          roughness: 0.28,
          metalness: 0.06,
          clearcoat: 0.95, // Peritoneal wet gleam
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
        highlightSelected,
        ghostUnselected,
        homeopathicAura,
      };

    case "skeletal":
      return {
        // Cortical compact bone with osteon microscopic grain
        primaryOrgan: new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xfef3c7), // Authentic Bone Ivory
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
        highlightSelected,
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
