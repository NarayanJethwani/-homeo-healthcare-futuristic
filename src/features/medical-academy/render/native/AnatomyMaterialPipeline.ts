/**
 * OSTM™ Interactive Human Anatomy Atlas — Restrained Medical Material Pipeline
 * Preserves available GLB materials while providing selection separation,
 * soft rim highlights, and visual cross-section clipping.
 */

import * as THREE from "three";

export class AnatomyMaterialPipeline {
  private clippingPlane: THREE.Plane | null = null;
  private isClippingEnabled: boolean = false;

  constructor() {
    // Frontal sagittal clipping plane for visual cross-section inspection
    this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.1);
  }

  /**
   * Apply medical visualization styling to an imported GLB model
   */
  public applyMedicalShading(
    rootGroup: THREE.Group,
    accentColor: string,
    activeStructureId: string | null,
    enableClipping: boolean,
    showVasculature: boolean = true
  ) {
    this.isClippingEnabled = enableClipping;

    rootGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const structureId = mesh.userData?.structureId || mesh.name.toLowerCase();
        const isSelected = Boolean(
          activeStructureId &&
          (structureId === activeStructureId || mesh.name.toLowerCase().includes(activeStructureId.toLowerCase()))
        );
        const isVasculature = mesh.userData?.viewerLayer === "vasculature";
        const isAvailableLayer = showVasculature || !isVasculature;

        // The viewer explicitly describes focus as "isolate". Hiding nearby
        // structures keeps a small gland or vessel unobstructed and makes its
        // camera bounds match what the learner can actually see.
        mesh.visible = isAvailableLayer && (!activeStructureId || isSelected);

        // Preserve and upgrade material
        if (mesh.material) {
          const originalMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          
          if (originalMat instanceof THREE.MeshStandardMaterial || originalMat instanceof THREE.MeshPhysicalMaterial) {
            // Apply visual clipping plane if enabled
            originalMat.clippingPlanes = this.isClippingEnabled && this.clippingPlane ? [this.clippingPlane] : null;
            originalMat.clipShadows = true;

            if (isSelected) {
              // Subtle medical glowing rim on selected structure
              originalMat.emissive = new THREE.Color(accentColor);
              originalMat.emissiveIntensity = 0.35;
              originalMat.transparent = false;
              originalMat.opacity = 1.0;
            } else if (activeStructureId) {
              // Hidden context retains neutral material state for restoration.
              originalMat.emissive = new THREE.Color(0x000000);
              originalMat.emissiveIntensity = 0.0;
              originalMat.transparent = false;
              originalMat.opacity = 1.0;
            } else {
              // Default natural anatomical presentation
              originalMat.emissive = new THREE.Color(0x000000);
              originalMat.emissiveIntensity = 0.0;
              originalMat.transparent = false;
              originalMat.opacity = 1.0;
            }
          }
        }
      }
    });
  }

  /**
   * Toggle visual cross-section clipping plane
   */
  public setClippingEnabled(enabled: boolean) {
    this.isClippingEnabled = enabled;
  }
}
