/**
 * OSTM™ 3D Anatomy Preview — Development Placeholder Builder
 * Generates the remaining procedural GLB placeholders with named sub-meshes
 * for viewer development. Digestive assets are maintained by source-specific
 * imports and must not be overwritten by this builder. Placeholders are not
 * imaging-derived, externally
 * sourced, anatomically validated, or approved for production education use.
 */

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

// Node.js FileReader polyfill for Three.js GLTFExporter
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then(buf => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
        if (this.onload) this.onload();
      });
    }
  };
}

// Helper to export a THREE.Object3D scene graph as a binary GLB buffer
function exportToGLB(object) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      object,
      (buffer) => resolve(Buffer.from(buffer)),
      (error) => reject(error),
      { binary: true }
    );
  });
}

// 1. Procedural stomach placeholder
function buildStomachModel() {
  const root = new THREE.Group();
  root.name = 'Stomach_Anatomical_System';

  // Realistic Gastric Wall Material
  const stomachMat = new THREE.MeshStandardMaterial({
    color: 0xc2410c, // Rich mucosal terracotta
    roughness: 0.35,
    metalness: 0.05,
  });

  // Gastric Fundus (Superior anatomical dome)
  const fundusCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 1.4, 0.1),
    new THREE.Vector3(-0.8, 1.25, 0.15),
    new THREE.Vector3(-0.95, 0.7, 0.2),
  ]);
  const fundusGeom = new THREE.TubeGeometry(fundusCurve, 32, 0.48, 24, false);
  const fundusMesh = new THREE.Mesh(fundusGeom, stomachMat);
  fundusMesh.name = 'Fundus';
  fundusMesh.userData = { structureId: 'stomach_fundus', anatomicalName: 'Gastric Fundus' };

  // Gastric Body (Main reservoir with greater/lesser curvature contour)
  const bodyPoints = [];
  for (let deg = 0; deg <= 180; deg += 6) {
    const rad = (deg * Math.PI) / 180;
    const x = -0.9 * Math.cos(rad) - 0.2;
    const y = 0.8 * Math.sin(rad) - 0.1;
    const z = 0.15 * Math.sin(rad * 2);
    bodyPoints.push(new THREE.Vector3(x, y, z));
  }
  const bodyCurve = new THREE.CatmullRomCurve3(bodyPoints);
  const bodyGeom = new THREE.TubeGeometry(bodyCurve, 64, 0.55, 32, false);
  const bodyMesh = new THREE.Mesh(bodyGeom, stomachMat);
  bodyMesh.name = 'Body';
  bodyMesh.userData = { structureId: 'stomach_body', anatomicalName: 'Gastric Body & Rugae' };

  // Pyloric Antrum & Canal
  const pylorusCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, -0.6, 0.1),
    new THREE.Vector3(1.0, -0.7, 0.0),
    new THREE.Vector3(1.4, -0.45, -0.1),
  ]);
  const pylorusGeom = new THREE.TubeGeometry(pylorusCurve, 32, 0.32, 24, false);
  const pylorusMesh = new THREE.Mesh(pylorusGeom, stomachMat);
  pylorusMesh.name = 'Pylorus';
  pylorusMesh.userData = { structureId: 'stomach_pylorus', anatomicalName: 'Pyloric Antrum & Sphincter' };

  // Lesser Curvature Rib
  const lesserCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 1.1, 0.05),
    new THREE.Vector3(-0.1, 0.4, 0.05),
    new THREE.Vector3(0.2, -0.3, 0.05),
    new THREE.Vector3(0.7, -0.5, 0.0),
  ]);
  const lesserMesh = new THREE.Mesh(new THREE.TubeGeometry(lesserCurve, 32, 0.08, 16, false), stomachMat);
  lesserMesh.name = 'LesserCurvature';
  lesserMesh.userData = { structureId: 'lesser_curvature', anatomicalName: 'Lesser Curvature' };

  // Greater Curvature Ridge
  const greaterCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.7, 1.35, 0.1),
    new THREE.Vector3(-1.35, 0.5, 0.15),
    new THREE.Vector3(-1.1, -0.7, 0.2),
    new THREE.Vector3(-0.2, -1.1, 0.15),
    new THREE.Vector3(0.6, -0.85, 0.05),
  ]);
  const greaterMesh = new THREE.Mesh(new THREE.TubeGeometry(greaterCurve, 48, 0.1, 16, false), stomachMat);
  greaterMesh.name = 'GreaterCurvature';
  greaterMesh.userData = { structureId: 'greater_curvature', anatomicalName: 'Greater Curvature' };

  root.add(fundusMesh, bodyMesh, pylorusMesh, lesserMesh, greaterMesh);
  return root;
}

// 2. Procedural liver and gallbladder placeholder
function buildLiverModel() {
  const root = new THREE.Group();
  root.name = 'Liver_Gallbladder_System';

  const liverMat = new THREE.MeshStandardMaterial({
    color: 0x7c2d12, // Hepatic terracotta brown
    roughness: 0.32,
    metalness: 0.05,
  });

  const gallbladderMat = new THREE.MeshStandardMaterial({
    color: 0x4d7c0f, // Gallbladder olive green
    roughness: 0.25,
    metalness: 0.1,
  });

  // Right Hepatic Lobe
  const rLobeGeom = new THREE.SphereGeometry(1.3, 32, 32);
  rLobeGeom.scale(1.3, 0.9, 0.75);
  const rLobe = new THREE.Mesh(rLobeGeom, liverMat);
  rLobe.position.set(0.5, 0.2, 0);
  rLobe.rotation.z = -0.15;
  rLobe.name = 'RightLobe';
  rLobe.userData = { structureId: 'liver_right_lobe', anatomicalName: 'Right Hepatic Lobe' };

  // Left Hepatic Lobe
  const lLobeGeom = new THREE.SphereGeometry(0.95, 32, 32);
  lLobeGeom.scale(1.1, 0.75, 0.5);
  const lLobe = new THREE.Mesh(lLobeGeom, liverMat);
  lLobe.position.set(-1.0, 0.1, 0.1);
  lLobe.rotation.z = 0.25;
  lLobe.name = 'LeftLobe';
  lLobe.userData = { structureId: 'liver_left_lobe', anatomicalName: 'Left Hepatic Lobe' };

  // Gallbladder
  const gbGeom = new THREE.SphereGeometry(0.32, 24, 24);
  gbGeom.scale(0.7, 1.3, 0.7);
  const gb = new THREE.Mesh(gbGeom, gallbladderMat);
  gb.position.set(0.4, -0.6, 0.5);
  gb.rotation.z = 0.3;
  gb.name = 'Gallbladder';
  gb.userData = { structureId: 'gallbladder', anatomicalName: 'Gallbladder & Cystic Duct' };

  root.add(rLobe, lLobe, gb);
  return root;
}

// 3. Procedural heart and great-vessels placeholder
function buildHeartModel() {
  const root = new THREE.Group();
  root.name = 'Heart_Cardiovascular_System';

  const myoMat = new THREE.MeshStandardMaterial({
    color: 0x881337, // Deep myocardial ruby
    roughness: 0.3,
    metalness: 0.08,
  });

  const artMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c, // Arterial red
    roughness: 0.25,
  });

  const veinMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8, // Venous blue
    roughness: 0.28,
  });

  // Left Ventricle & Apex
  const ventGeom = new THREE.SphereGeometry(1.1, 32, 32);
  ventGeom.scale(0.9, 1.25, 0.85);
  const ventMesh = new THREE.Mesh(ventGeom, myoMat);
  ventMesh.rotation.z = -0.25;
  ventMesh.rotation.x = 0.2;
  ventMesh.name = 'LeftVentricle';
  ventMesh.userData = { structureId: 'left_ventricle', anatomicalName: 'Left Ventricle & Myocardium' };

  // Right Ventricle
  const rVentGeom = new THREE.SphereGeometry(0.85, 24, 24);
  rVentGeom.scale(0.8, 1.1, 0.7);
  const rVent = new THREE.Mesh(rVentGeom, myoMat);
  rVent.position.set(0.65, 0.2, 0.2);
  rVent.rotation.z = 0.15;
  rVent.name = 'RightVentricle';
  rVent.userData = { structureId: 'right_ventricle', anatomicalName: 'Right Ventricle' };

  // Aorta Arch with 3 Branches
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.6, 0.2),
    new THREE.Vector3(0, 1.6, 0.1),
    new THREE.Vector3(-0.5, 2.1, -0.1),
    new THREE.Vector3(-0.9, 1.6, -0.3),
    new THREE.Vector3(-0.9, -1.4, -0.4),
  ]);
  const aortaMesh = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 64, 0.26, 16, false), artMat);
  aortaMesh.name = 'AorticArch';
  aortaMesh.userData = { structureId: 'aorta_arch', anatomicalName: 'Ascending Aorta & Arch' };

  // Pulmonary Trunk
  const pulmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 0.4, 0.45),
    new THREE.Vector3(-0.1, 1.2, 0.25),
    new THREE.Vector3(-0.8, 1.4, -0.1),
  ]);
  const pulmMesh = new THREE.Mesh(new THREE.TubeGeometry(pulmCurve, 32, 0.22, 16, false), veinMat);
  pulmMesh.name = 'PulmonaryArtery';
  pulmMesh.userData = { structureId: 'pulmonary_trunk', anatomicalName: 'Pulmonary Trunk' };

  // LAD Coronary Artery
  const ladCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.1, 0.8, 0.8),
    new THREE.Vector3(-0.2, 0.2, 0.9),
    new THREE.Vector3(-0.4, -0.6, 0.7),
    new THREE.Vector3(-0.35, -1.0, 0.4),
  ]);
  const ladMesh = new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 32, 0.045, 8, false), artMat);
  ladMesh.name = 'LAD_Coronary';
  ladMesh.userData = { structureId: 'coronary_arteries', anatomicalName: 'Coronary Arterial Vasculature' };

  root.add(ventMesh, rVent, aortaMesh, pulmMesh, ladMesh);
  return root;
}

async function main() {
  const rootDir = process.cwd();
  // All procedural anatomy placeholders have been retired. Historical builder
  // functions remain only to document the superseded development geometry.
  const models = [];

  for (const m of models) {
    const targetDir = path.join(rootDir, 'public', 'models', 'anatomy', m.dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, m.file);
    const scene = m.builder();
    const buffer = await exportToGLB(scene);
    fs.writeFileSync(targetPath, buffer);
    console.log(`Generated: ${targetPath} (${buffer.length} bytes)`);
  }

  console.log('All remaining procedural anatomy placeholder GLBs generated.');
}

main().catch(console.error);
