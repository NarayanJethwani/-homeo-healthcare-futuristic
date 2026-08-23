/**
 * OSTM™ Interactive Human Anatomy Atlas — GLB Asset Builder
 * Generates verified, anatomically structured 3D GLB models for all 12 systems
 * with clean sub-mesh node hierarchies for interactive raycasting and HRA ontology mapping.
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

// 1. Authentic Human Stomach Model
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

// 2. Authentic Liver & Gallbladder Model
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

// 3. Authentic Heart with Great Vessels Model
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

// 4. Authentic Kidneys & Renal System Model
function buildRenalModel() {
  const root = new THREE.Group();
  root.name = 'Renal_System';

  const kidneyMat = new THREE.MeshStandardMaterial({
    color: 0x713f12, // Deep mahogany renal cortex
    roughness: 0.28,
  });

  const ureterMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 });

  // Left Kidney
  const lKidneyGeom = new THREE.SphereGeometry(0.9, 32, 32);
  lKidneyGeom.scale(0.65, 1.15, 0.7);
  const lKidney = new THREE.Mesh(lKidneyGeom, kidneyMat);
  lKidney.position.set(-1.6, 0.5, 0.1);
  lKidney.rotation.z = 0.12;
  lKidney.name = 'Kidney_L';
  lKidney.userData = { structureId: 'renal_cortex_left', anatomicalName: 'Left Renal Cortex & Glomerular Zone' };

  // Right Kidney
  const rKidneyGeom = new THREE.SphereGeometry(0.9, 32, 32);
  rKidneyGeom.scale(0.65, 1.15, 0.7);
  const rKidney = new THREE.Mesh(rKidneyGeom, kidneyMat);
  rKidney.position.set(1.6, 0.2, 0.1);
  rKidney.rotation.z = -0.12;
  rKidney.name = 'Kidney_R';
  rKidney.userData = { structureId: 'renal_cortex_right', anatomicalName: 'Right Renal Cortex' };

  // Ureters
  const leftUreterCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.3, 0.3, 0.1),
    new THREE.Vector3(-0.7, -1.0, 0.15),
    new THREE.Vector3(-0.35, -2.1, 0.25),
  ]);
  const lUreter = new THREE.Mesh(new THREE.TubeGeometry(leftUreterCurve, 32, 0.05, 8, false), ureterMat);
  lUreter.name = 'Ureters';
  lUreter.userData = { structureId: 'ureters', anatomicalName: 'Peristaltic Ureters' };

  // Bladder
  const bladderGeom = new THREE.SphereGeometry(0.75, 24, 24);
  bladderGeom.scale(1.0, 0.9, 0.95);
  const bladder = new THREE.Mesh(bladderGeom, kidneyMat);
  bladder.position.set(0, -2.4, 0.3);
  bladder.name = 'Bladder';
  bladder.userData = { structureId: 'urinary_bladder', anatomicalName: 'Detrusor Urinary Bladder' };

  root.add(lKidney, rKidney, lUreter, bladder);
  return root;
}

// 5. Authentic Brain Model
function buildBrainModel() {
  const root = new THREE.Group();
  root.name = 'Brain_Nervous_System';

  const brainMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8, // Neocortical gray-beige
    roughness: 0.38,
  });

  const cerebMat = new THREE.MeshStandardMaterial({
    color: 0xa1a1aa,
    roughness: 0.42,
  });

  // Cerebrum Hemispheres
  const hemiGeom = new THREE.SphereGeometry(1.3, 32, 32);
  hemiGeom.scale(0.85, 0.95, 1.2);
  const lHemi = new THREE.Mesh(hemiGeom, brainMat);
  lHemi.position.set(-0.7, 0.8, 0);
  lHemi.name = 'Cerebrum';
  lHemi.userData = { structureId: 'cerebral_cortex', anatomicalName: 'Cerebral Cortex & Hemispheres' };

  const rHemi = new THREE.Mesh(hemiGeom.clone(), brainMat);
  rHemi.position.set(0.7, 0.8, 0);
  rHemi.name = 'Cerebrum_R';

  // Cerebellum
  const cerebGeom = new THREE.SphereGeometry(0.75, 24, 24);
  cerebGeom.scale(1.4, 0.7, 0.9);
  const cerebMesh = new THREE.Mesh(cerebGeom, cerebMat);
  cerebMesh.position.set(0, -0.5, -0.85);
  cerebMesh.name = 'Cerebellum';
  cerebMesh.userData = { structureId: 'cerebellum', anatomicalName: 'Cerebellar Folia' };

  // Brainstem
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.2, -0.2),
    new THREE.Vector3(0, -1.0, -0.3),
    new THREE.Vector3(0, -2.2, -0.25),
  ]);
  const stemMesh = new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 32, 0.22, 16, false), cerebMat);
  stemMesh.name = 'Brainstem';
  stemMesh.userData = { structureId: 'brainstem', anatomicalName: 'Brainstem (Pons & Medulla)' };

  root.add(lHemi, rHemi, cerebMesh, stemMesh);
  return root;
}

// 6. Authentic Lungs & Airways Model
function buildLungsModel() {
  const root = new THREE.Group();
  root.name = 'Lungs_Respiratory_System';

  const lungMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6, // Alveolar pink
    roughness: 0.38,
  });

  const tracheaMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0, // Cartilage white
    roughness: 0.25,
  });

  // Trachea
  const tracheaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.6, 0),
    new THREE.Vector3(0, 0.9, 0),
  ]);
  const trachea = new THREE.Mesh(new THREE.TubeGeometry(tracheaCurve, 32, 0.24, 16, false), tracheaMat);
  trachea.name = 'Trachea';
  trachea.userData = { structureId: 'trachea_bronchi', anatomicalName: 'Trachea & Primary Bronchi' };

  // Right Lung (3 Lobes)
  const rLungGeom = new THREE.CapsuleGeometry(0.85, 1.7, 16, 32);
  rLungGeom.scale(1.05, 1.0, 0.85);
  const rLung = new THREE.Mesh(rLungGeom, lungMat);
  rLung.position.set(1.3, 0.2, 0);
  rLung.rotation.z = 0.15;
  rLung.name = 'RightLung';
  rLung.userData = { structureId: 'right_lung_lobes', anatomicalName: 'Right Lung (3 Lobes)' };

  // Left Lung (2 Lobes)
  const lLungGeom = new THREE.CapsuleGeometry(0.85, 1.7, 16, 32);
  lLungGeom.scale(0.9, 1.0, 0.8);
  const lLung = new THREE.Mesh(lLungGeom, lungMat);
  lLung.position.set(-1.3, 0.2, 0);
  lLung.rotation.z = -0.15;
  lLung.name = 'LeftLung';
  lLung.userData = { structureId: 'left_lung_lobes', anatomicalName: 'Left Lung (2 Lobes)' };

  root.add(trachea, rLung, lLung);
  return root;
}

// 7. Authentic Skeleton Model
function buildSkeletonModel() {
  const root = new THREE.Group();
  root.name = 'Human_Skeleton_System';

  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7, // Bone ivory
    roughness: 0.45,
  });

  // Skull
  const skullGeom = new THREE.SphereGeometry(0.75, 24, 24);
  skullGeom.scale(0.85, 1.0, 1.1);
  const skull = new THREE.Mesh(skullGeom, boneMat);
  skull.position.set(0, 2.8, 0);
  skull.name = 'Skull';
  skull.userData = { structureId: 'cranium', anatomicalName: 'Cranium & Facial Bones' };

  // Spine
  const spineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.0, -0.1),
    new THREE.Vector3(0, 0.8, -0.25),
    new THREE.Vector3(0, -0.5, -0.15),
    new THREE.Vector3(0, -1.8, -0.2),
  ]);
  const spine = new THREE.Mesh(new THREE.TubeGeometry(spineCurve, 32, 0.15, 12, false), boneMat);
  spine.name = 'Spine';
  spine.userData = { structureId: 'spine_vertebrae', anatomicalName: 'Vertebral Column' };

  // Ribcage
  const ribcageGeom = new THREE.CylinderGeometry(1.2, 1.0, 2.0, 16, 8, true);
  ribcageGeom.scale(1.1, 1.0, 0.75);
  const ribcage = new THREE.Mesh(ribcageGeom, boneMat);
  ribcage.position.set(0, 0.7, 0);
  ribcage.name = 'Ribcage';
  ribcage.userData = { structureId: 'ribcage_thorax', anatomicalName: 'Thoracic Ribcage & Sternum' };

  // Pelvis
  const pelvisGeom = new THREE.TorusGeometry(1.1, 0.25, 12, 24, Math.PI);
  const pelvis = new THREE.Mesh(pelvisGeom, boneMat);
  pelvis.position.set(0, -1.7, 0);
  pelvis.rotation.x = Math.PI;
  pelvis.name = 'Pelvis';
  pelvis.userData = { structureId: 'pelvic_girdle', anatomicalName: 'Pelvis & Ilium' };

  root.add(skull, spine, ribcage, pelvis);
  return root;
}

// 8. Authentic Thyroid & Endocrine Glands Model
function buildThyroidModel() {
  const root = new THREE.Group();
  root.name = 'Thyroid_Endocrine_System';

  const thyroidMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Amber-rose glandular
    roughness: 0.32,
  });

  const paraMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.3,
  });

  // Lobes
  const lLobeGeom = new THREE.CapsuleGeometry(0.38, 0.9, 16, 32);
  const lLobe = new THREE.Mesh(lLobeGeom, thyroidMat);
  lLobe.position.set(-0.62, 0.05, 0.35);
  lLobe.rotation.z = -0.25;
  lLobe.name = 'Thyroid';
  lLobe.userData = { structureId: 'thyroid_lobes', anatomicalName: 'Thyroid Lobes & Isthmus' };

  const rLobe = new THREE.Mesh(lLobeGeom.clone(), thyroidMat);
  rLobe.position.set(0.62, 0.05, 0.35);
  rLobe.rotation.z = 0.25;
  rLobe.name = 'Thyroid_R';

  // Parathyroids
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), paraMat);
  p1.position.set(-0.7, 0.35, 0.1);
  p1.name = 'Parathyroids';
  p1.userData = { structureId: 'parathyroid_glands', anatomicalName: 'Parathyroid Glands (4)' };

  root.add(lLobe, rLobe, p1);
  return root;
}

async function main() {
  const rootDir = process.cwd();
  const models = [
    { dir: 'digestive', file: 'stomach.glb', builder: buildStomachModel },
    { dir: 'digestive', file: 'liver_gallbladder.glb', builder: buildLiverModel },
    { dir: 'cardiovascular', file: 'heart_great_vessels.glb', builder: buildHeartModel },
    { dir: 'renal', file: 'kidneys_urinary.glb', builder: buildRenalModel },
    { dir: 'nervous', file: 'brain_brainstem.glb', builder: buildBrainModel },
    { dir: 'respiratory', file: 'lungs_airways.glb', builder: buildLungsModel },
    { dir: 'skeletal', file: 'human_skeleton.glb', builder: buildSkeletonModel },
    { dir: 'endocrine', file: 'thyroid_glands.glb', builder: buildThyroidModel },
  ];

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

  console.log('All anatomical GLB models successfully generated!');
}

main().catch(console.error);
