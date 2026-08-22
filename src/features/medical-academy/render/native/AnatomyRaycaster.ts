/**
 * OSTM™ Interactive Human Anatomy Atlas — Recursive Sub-Mesh Raycaster
 * Handles pointer raycasting against imported GLB mesh hierarchies.
 */

import * as THREE from "three";
import { AnatomyMeshNode } from "./GLBAnatomyModelLoader";

export class AnatomyRaycaster {
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  private camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.camera = camera;
  }

  /**
   * Cast a ray from pointer coordinates and return the intersected anatomical node
   */
  public castRay(
    event: MouseEvent | TouchEvent,
    container: HTMLElement,
    rootGroup: THREE.Group,
    nodes: AnatomyMeshNode[]
  ): AnatomyMeshNode | null {
    const rect = container.getBoundingClientRect();
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(rootGroup.children, true);

    if (intersects.length > 0) {
      const hitObject = intersects[0].object;
      
      // Match with indexed node
      const matchedNode = nodes.find(
        (n) => n.object3D === hitObject || hitObject.name === n.meshName
      );

      if (matchedNode) {
        return matchedNode;
      }

      // Fallback to closest named parent
      let curr: THREE.Object3D | null = hitObject;
      while (curr && curr !== rootGroup) {
        const parentMatch = nodes.find((n) => n.object3D === curr || curr?.name === n.meshName);
        if (parentMatch) return parentMatch;
        curr = curr.parent;
      }
    }

    return null;
  }
}
