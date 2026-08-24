/**
 * OSTM™ Interactive Human Anatomy Atlas — GLB Anatomy Model Loader
 * Loads registered GLB/GLTF anatomy models, auto-centers bounding volumes,
 * normalizes scale, and indexes named mesh nodes for interactive raycasting.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AnatomySystemId } from "../../data/medicalAcademyData";
import {
  AnatomicalStructureDefinition,
  resolveStructureForMesh,
} from "../system3DRegistry";

export interface AnatomyMeshNode {
  nodeId: string;
  meshName: string;
  structureId?: string;
  anatomicalName?: string;
  system: AnatomySystemId;
  sourceAssetId: string;
  object3D: THREE.Object3D;
  selectable: boolean;
}

export interface LoadedAnatomyResult {
  rootGroup: THREE.Group;
  nodes: AnatomyMeshNode[];
  boundingBox: THREE.Box3;
  boundingSphere: THREE.Sphere;
}

export function normalizeAnatomyScene(rootGroup: THREE.Group): {
  boundingBox: THREE.Box3;
  boundingSphere: THREE.Sphere;
} {
  const initialBox = new THREE.Box3().setFromObject(rootGroup);
  const size = new THREE.Vector3();
  initialBox.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0.001) {
    rootGroup.scale.multiplyScalar(3.6 / maxDim);
  }

  // Recenter after scaling. Object3D translation is applied after scale, so
  // centering first leaves real-world-coordinate source meshes far off-screen.
  const scaledBox = new THREE.Box3().setFromObject(rootGroup);
  const scaledCenter = new THREE.Vector3();
  scaledBox.getCenter(scaledCenter);
  rootGroup.position.sub(scaledCenter);
  rootGroup.updateMatrixWorld(true);

  const boundingBox = new THREE.Box3().setFromObject(rootGroup);
  const boundingSphere = new THREE.Sphere();
  boundingBox.getBoundingSphere(boundingSphere);

  return { boundingBox, boundingSphere };
}

// In-memory cache for loaded anatomical scenes to provide instant switching
const GLB_SCENE_CACHE = new Map<string, THREE.Group>();

export class GLBAnatomyModelLoader {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
  }

  /**
   * Load a registered GLB model and index its sub-mesh labels.
   */
  public async loadModel(
    filePath: string,
    systemId: AnatomySystemId,
    assetId: string,
    fallbackStructureId?: string,
    fallbackAnatomicalName?: string,
    structures: AnatomicalStructureDefinition[] = []
  ): Promise<LoadedAnatomyResult> {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (GLB_SCENE_CACHE.has(filePath)) {
        const cachedRoot = GLB_SCENE_CACHE.get(filePath)!.clone(true);
        const indexed = this.processAndIndexScene(
          cachedRoot,
          systemId,
          assetId,
          fallbackStructureId,
          fallbackAnatomicalName,
          structures
        );
        resolve(indexed);
        return;
      }

      this.loader.load(
        filePath,
        (gltf) => {
          const rootGroup = gltf.scene;
          GLB_SCENE_CACHE.set(filePath, rootGroup.clone(true));
          const indexed = this.processAndIndexScene(
            rootGroup,
            systemId,
            assetId,
            fallbackStructureId,
            fallbackAnatomicalName,
            structures
          );
          resolve(indexed);
        },
        undefined,
        (error) => {
          console.error(`[OSTM Anatomy] Failed loading GLB: ${assetId} at ${filePath}`, error);
          reject(new Error(`Failed to load 3D anatomy model: ${assetId}`));
        }
      );
    });
  }

  /**
   * Process bounding box, center coordinates, and index all mesh nodes
   */
  private processAndIndexScene(
    rootGroup: THREE.Group,
    systemId: AnatomySystemId,
    assetId: string,
    fallbackStructureId?: string,
    fallbackAnatomicalName?: string,
    structures: AnatomicalStructureDefinition[] = []
  ): LoadedAnatomyResult {
    // Normalize source assets into a shared, camera-centered viewport space.
    const { boundingBox, boundingSphere } = normalizeAnatomyScene(rootGroup);

    // 5. Index named mesh nodes
    const nodes: AnatomyMeshNode[] = [];
    rootGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        // Enable shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const mappedStructure = resolveStructureForMesh(structures, mesh.name);
        const singleStructureFallback = structures.length === 1 ? fallbackStructureId : undefined;
        const structureId =
          mesh.userData?.structureId ||
          mappedStructure?.id ||
          singleStructureFallback ||
          mesh.name.toLowerCase();
        const anatomicalName =
          mesh.userData?.anatomicalName ||
          mesh.userData?.label ||
          mappedStructure?.name ||
          (structures.length === 1 ? fallbackAnatomicalName : undefined) ||
          mesh.name.replace(/_/g, " ");

        const materialName = Array.isArray(mesh.material)
          ? mesh.material.map((material) => material.name).join(" ")
          : mesh.material?.name || "";
        const sourceLayerHint = String(mesh.userData?.anatomical_structure_of || "").toLowerCase();
        const vascularNameHint = `${mesh.name} ${materialName}`.toLowerCase();
        const isSourceVasculature =
          sourceLayerHint.includes("bloodvasculature") ||
          /arter|vein|aorta|vena_cava|pulmonary_trunk|coronary_sinus/.test(vascularNameHint);

        // Normalize source-specific metadata to the viewer's stable organ ID.
        // Original userData fields remain intact for provenance and inspection.
        mesh.userData.structureId = structureId;
        mesh.userData.anatomicalName = anatomicalName;
        mesh.userData.viewerLayer = mappedStructure?.layer || (isSourceVasculature ? "vasculature" : "visceral");

        nodes.push({
          nodeId: `${assetId}_${mesh.name}`,
          meshName: mesh.name,
          structureId,
          anatomicalName,
          system: systemId,
          sourceAssetId: assetId,
          object3D: mesh,
          selectable: Boolean(mappedStructure || structures.length === 1),
        });
      }
    });

    return {
      rootGroup,
      nodes,
      boundingBox,
      boundingSphere,
    };
  }

  /**
   * Clear in-memory cache
   */
  public clearCache() {
    GLB_SCENE_CACHE.clear();
  }
}
