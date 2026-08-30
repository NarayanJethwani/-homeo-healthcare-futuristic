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
  private framedSphere: THREE.Sphere | null = null;
  private framePadding = 1.35;
  private frameMinimumDistance = 1.1;

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
    this.rememberFrame(boundingSphere, 1.35, Math.max(boundingSphere.radius * 0.8, 1.1));
    this.applyRememberedFrame(true);
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
    if (sphere.isEmpty()) return;

    // A selected gland or vessel should fill the viewport without the former
    // 3.5-unit floor making small structures appear lost in empty space.
    this.rememberFrame(sphere, 1.25, 1.1);
    this.applyRememberedFrame(false);
  }

  /** Recalculate the current frame after its container changes shape. */
  public reframeCurrent(immediate = true) {
    this.applyRememberedFrame(immediate);
  }

  /**
   * Reset to default scene framing
   */
  public reset(defaultDistance: number = 7.0) {
    this.framedSphere = null;
    this.targetPosition.set(0, 0, defaultDistance);
    this.targetLookAt.set(0, 0, 0);
  }

  private rememberFrame(sphere: THREE.Sphere, padding: number, minimumDistance: number) {
    this.framedSphere = sphere.clone();
    this.framePadding = padding;
    this.frameMinimumDistance = minimumDistance;
  }

  private applyRememberedFrame(immediate: boolean) {
    if (!this.framedSphere) return;

    const radius = Math.max(this.framedSphere.radius, 0.01);
    const verticalFov = THREE.MathUtils.degToRad(this.camera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(this.camera.aspect, 0.01));
    const limitingFov = Math.min(verticalFov, horizontalFov);
    const distance = Math.max(
      (radius / Math.sin(limitingFov / 2)) * this.framePadding,
      this.frameMinimumDistance
    );

    this.targetPosition.set(
      this.framedSphere.center.x,
      this.framedSphere.center.y,
      this.framedSphere.center.z + distance
    );
    this.targetLookAt.copy(this.framedSphere.center);
    this.controls.minDistance = Math.max(radius * 0.45, 0.25);
    this.controls.maxDistance = Math.max(distance * 4, 4);

    if (immediate) {
      this.camera.position.copy(this.targetPosition);
      this.controls.target.copy(this.targetLookAt);
      this.controls.update();
    }
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
