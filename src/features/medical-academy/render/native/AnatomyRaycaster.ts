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

    for (const intersection of intersects) {
      const hitObject = intersection.object;

      const matchedNode = nodes.find(
        (node) => node.selectable && (node.object3D === hitObject || hitObject.name === node.meshName)
      );
      if (matchedNode) return matchedNode;

      let current: THREE.Object3D | null = hitObject.parent;
      while (current && current !== rootGroup) {
        const parentMatch = nodes.find(
          (node) => node.selectable && (node.object3D === current || current?.name === node.meshName)
        );
        if (parentMatch) return parentMatch;
        current = current.parent;
      }
    }

    return null;
  }
}
