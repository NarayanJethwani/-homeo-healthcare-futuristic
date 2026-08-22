/**
 * OSTM™ Interactive Human Anatomy Atlas — GLB Anatomy Model Loader
 * Loads authentic GLB/GLTF models, auto-centers bounding volumes,
 * normalizes scale, and indexes named mesh nodes for interactive raycasting.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AnatomySystemId } from "../../data/medicalAcademyData";

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

// In-memory cache for loaded anatomical scenes to provide instant switching
const GLB_SCENE_CACHE = new Map<string, THREE.Group>();

export class GLBAnatomyModelLoader {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
  }

  /**
   * Load an authentic GLB model and index its anatomical sub-meshes
   */
  public async loadModel(
    filePath: string,
    systemId: AnatomySystemId,
    assetId: string
  ): Promise<LoadedAnatomyResult> {
    return new Promise((resolve, reject) => {
      // Check cache first
      if (GLB_SCENE_CACHE.has(filePath)) {
        const cachedRoot = GLB_SCENE_CACHE.get(filePath)!.clone(true);
        const indexed = this.processAndIndexScene(cachedRoot, systemId, assetId);
        resolve(indexed);
        return;
      }

      this.loader.load(
        filePath,
        (gltf) => {
          const rootGroup = gltf.scene;
          GLB_SCENE_CACHE.set(filePath, rootGroup.clone(true));
          const indexed = this.processAndIndexScene(rootGroup, systemId, assetId);
          resolve(indexed);
        },
        undefined,
        (error) => {
          console.error(`[OSTM Anatomy] Failed loading GLB: ${assetId} at ${filePath}`, error);
          reject(new Error(`Failed to load authentic anatomical model: ${assetId}`));
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
    assetId: string
  ): LoadedAnatomyResult {
    // 1. Calculate initial bounding box
    const box = new THREE.Box3().setFromObject(rootGroup);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    // 2. Auto-center pivot
    rootGroup.position.x += rootGroup.position.x - center.x;
    rootGroup.position.y += rootGroup.position.y - center.y;
    rootGroup.position.z += rootGroup.position.z - center.z;

    // 3. Normalize scale to standard viewport unit (~4 units maximum extent)
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0.001) {
      const targetScale = 3.6 / maxDim;
      rootGroup.scale.multiplyScalar(targetScale);
    }

    // 4. Recalculate normalized bounds
    const normalizedBox = new THREE.Box3().setFromObject(rootGroup);
    const sphere = new THREE.Sphere();
    normalizedBox.getBoundingSphere(sphere);

    // 5. Index named mesh nodes
    const nodes: AnatomyMeshNode[] = [];
    rootGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh || (child as THREE.Group).isGroup) {
        const mesh = child as THREE.Mesh;
        
        // Enable shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const structureId = mesh.userData?.structureId || mesh.name.toLowerCase();
        const anatomicalName = mesh.userData?.anatomicalName || mesh.name.replace(/_/g, " ");

        nodes.push({
          nodeId: `${assetId}_${mesh.name}`,
          meshName: mesh.name,
          structureId,
          anatomicalName,
          system: systemId,
          sourceAssetId: assetId,
          object3D: mesh,
          selectable: true,
        });
      }
    });

    return {
      rootGroup,
      nodes,
      boundingBox: normalizedBox,
      boundingSphere: sphere,
    };
  }

  /**
   * Clear in-memory cache
   */
  public clearCache() {
    GLB_SCENE_CACHE.clear();
  }
}
