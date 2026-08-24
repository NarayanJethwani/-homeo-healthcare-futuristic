/**
 * HoloHuman™ Experimental Anatomy Asset Engine
 * Development GLB loader with DRACO support, clipping planes, and procedural
 * fallbacks. This legacy path does not imply anatomical validation.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { AnatomySystemId } from "../../data/medicalAcademyData";
import { RealisticMaterialSuite } from "./BioDigitalOrganShaders";
import { buildBioDigitalOrganSystem, RealisticSceneBuildResult } from "./realisticOrganModels";

export interface AnatomyLayerVisibility {
  visceralOrgans: boolean;
  vasculature: boolean;
  nervousPathways: boolean;
  skeletalContext: boolean;
  crossSectionSlice: boolean;
}

export const DEFAULT_ANATOMY_LAYERS: AnatomyLayerVisibility = {
  visceralOrgans: true,
  vasculature: false,
  nervousPathways: true,
  skeletalContext: false,
  crossSectionSlice: false,
};

// Optional legacy GLB development registry. No external provenance is asserted.
export const MEDICAL_GLB_ASSET_MAP: Partial<Record<AnatomySystemId, string>> = {
  cardiovascular: "/models/anatomy/heart.glb",
  nervous: "/models/anatomy/brain.glb",
  skeletal: "/models/anatomy/skeleton.glb",
  renal: "/models/anatomy/kidney.glb",
};

let dracoLoaderInstance: DRACOLoader | null = null;
let gltfLoaderInstance: GLTFLoader | null = null;

function getGLTFLoader(): GLTFLoader {
  if (!gltfLoaderInstance) {
    gltfLoaderInstance = new GLTFLoader();
    if (typeof window !== "undefined") {
      dracoLoaderInstance = new DRACOLoader();
      dracoLoaderInstance.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
      gltfLoaderInstance.setDRACOLoader(dracoLoaderInstance);
    }
  }
  return gltfLoaderInstance;
}

export async function loadOrBuildRealisticAnatomy(
  systemId: AnatomySystemId,
  materials: RealisticMaterialSuite,
  activeSubOrganId: string | null,
  activeRemedyTropismId: string | null,
  layers: AnatomyLayerVisibility = DEFAULT_ANATOMY_LAYERS
): Promise<RealisticSceneBuildResult> {
  const glbUrl = MEDICAL_GLB_ASSET_MAP[systemId];

  // Try to load pre-scanned GLB model if available on client
  if (glbUrl && typeof window !== "undefined") {
    try {
      const loader = getGLTFLoader();
      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load(glbUrl, resolve, undefined, reject);
      });

      if (gltf && gltf.scene) {
        const group = gltf.scene;
        // Apply generic PBR material adjustments.
        group.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.3;
              child.material.metalness = 0.05;
              if (child.material.clearcoat !== undefined) {
                child.material.clearcoat = 0.9;
                child.material.clearcoatRoughness = 0.12;
              }
            }
          }
        });

        return {
          group,
          subOrganMetas: [
            {
              subOrganId: "primary_organ",
              name: "Imported GLB Development Model",
              focusTarget: [0, 0, 0],
              cameraOffset: [0, 0, 3.8],
            },
          ],
          animatables: [],
        };
      }
    } catch {
      // Graceful fallback to procedural development geometry.
    }
  }

  // Generate procedural development geometry.
  const result = buildBioDigitalOrganSystem(
    systemId,
    materials,
    activeSubOrganId,
    activeRemedyTropismId
  );

  // Apply layer visibility filters
  result.group.traverse((obj: any) => {
    if (obj.isMesh && obj.material) {
      if (!layers.vasculature && (obj.material === materials.vascularArtery || obj.material === materials.vascularVein)) {
        obj.visible = false;
      }
      if (!layers.visceralOrgans && (obj.material === materials.primaryOrgan || obj.material === materials.secondaryOrgan)) {
        obj.visible = false;
      }
    }
  });

  return result;
}
