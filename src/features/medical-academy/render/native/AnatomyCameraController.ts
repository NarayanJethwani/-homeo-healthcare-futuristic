/**
 * OSTM™ Interactive Human Anatomy Atlas — Camera Controller
 * Auto-frames anatomical models with 35% margin padding and smoothly transitions
 * camera focus when inspecting sub-structures.
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class AnatomyCameraController {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private targetPosition: THREE.Vector3;
  private targetLookAt: THREE.Vector3;

  constructor(camera: THREE.PerspectiveCamera, controls: OrbitControls) {
    this.camera = camera;
    this.controls = controls;
    this.targetPosition = camera.position.clone();
    this.targetLookAt = controls.target.clone();
  }

  /**
   * Frame the entire anatomical scene with balanced padding
   */
  public frameScene(boundingSphere: THREE.Sphere) {
    const radius = boundingSphere.radius || 2.0;
    const fov = (this.camera.fov * Math.PI) / 180;
    
    // Compute distance to fit sphere with 35% margin
    const distance = (radius / Math.sin(fov / 2)) * 1.35;

    this.targetPosition.set(
      boundingSphere.center.x,
      boundingSphere.center.y,
      boundingSphere.center.z + distance
    );
    this.targetLookAt.copy(boundingSphere.center);

    this.camera.position.copy(this.targetPosition);
    this.controls.target.copy(this.targetLookAt);
    this.controls.minDistance = radius * 0.8;
    this.controls.maxDistance = distance * 2.5;
    this.controls.update();
  }

  /**
   * Focus camera smoothly on a specific sub-structure
   */
  public focusOnObject(object: THREE.Object3D) {
    const box = new THREE.Box3().setFromObject(object);
    this.focusOnBox(box);
  }

  public focusOnObjects(objects: THREE.Object3D[]) {
    if (objects.length === 0) return;
    const box = new THREE.Box3();
    for (const object of objects) box.expandByObject(object);
    this.focusOnBox(box);
  }

  private focusOnBox(box: THREE.Box3) {
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);

    const fov = (this.camera.fov * Math.PI) / 180;
    const distance = Math.max(sphere.radius / Math.sin(fov / 2) * 1.4, 3.5);

    this.targetPosition.set(
      sphere.center.x,
      sphere.center.y,
      sphere.center.z + distance
    );
    this.targetLookAt.copy(sphere.center);
  }

  /**
   * Reset to default scene framing
   */
  public reset(defaultDistance: number = 7.0) {
    this.targetPosition.set(0, 0, defaultDistance);
    this.targetLookAt.set(0, 0, 0);
  }

  /**
   * Per-frame update for smooth lerp transitions
   */
  public update() {
    this.camera.position.lerp(this.targetPosition, 0.08);
    this.controls.target.lerp(this.targetLookAt, 0.08);
    this.controls.update();
  }
}
