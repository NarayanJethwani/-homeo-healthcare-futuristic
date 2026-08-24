/**
 * Procedural 3D anatomy development placeholders.
 * Handcrafted geometry used only for software and interaction prototyping.
 */

import * as THREE from "three";
import { AnatomySystemId } from "../../data/medicalAcademyData";
import { RealisticMaterialSuite } from "./BioDigitalOrganShaders";
import { SubOrganMeshMeta } from "./systemMeshBuilders";

export interface RealisticSceneBuildResult {
  group: THREE.Group;
  subOrganMetas: SubOrganMeshMeta[];
  animatables: Array<{
    mesh: THREE.Object3D;
    type: "pulse" | "rotate" | "wave" | "flow";
    speed: number;
  }>;
}

export function buildBioDigitalOrganSystem(
  systemId: AnatomySystemId,
  materials: RealisticMaterialSuite,
  activeSubOrganId: string | null,
  activeRemedyTropismId: string | null
): RealisticSceneBuildResult {
  const root = new THREE.Group();
  const subOrganMetas: SubOrganMeshMeta[] = [];
  const animatables: Array<{ mesh: THREE.Object3D; type: "pulse" | "rotate" | "wave" | "flow"; speed: number }> = [];

  const getMat = (subId: string, defaultMat: THREE.Material) => {
    if (activeSubOrganId && activeSubOrganId === subId) {
      return materials.highlightSelected;
    }
    if (activeRemedyTropismId) {
      return materials.homeopathicAura;
    }
    if (activeSubOrganId && activeSubOrganId !== subId) {
      return materials.ghostUnselected;
    }
    return defaultMat;
  };

  switch (systemId) {
    case "endocrine": {
      // 1. Pituitary Gland & Sella Turcica with Infundibulum & Optic Chiasm
      const pituitaryGroup = new THREE.Group();
      
      const adenoGeom = new THREE.SphereGeometry(0.35, 24, 24);
      adenoGeom.scale(1.0, 0.8, 0.7);
      const adenoMesh = new THREE.Mesh(adenoGeom, getMat("pituitary", materials.primaryOrgan));
      adenoMesh.position.set(0, 0, 0.15);

      const neuroGeom = new THREE.SphereGeometry(0.28, 24, 24);
      neuroGeom.scale(0.9, 0.8, 0.6);
      const neuroMesh = new THREE.Mesh(neuroGeom, getMat("pituitary", materials.secondaryOrgan));
      neuroMesh.position.set(0, 0, -0.15);

      const stalkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0.6, -0.1),
        new THREE.Vector3(0, 1.1, -0.2),
      ]);
      const stalkGeom = new THREE.TubeGeometry(stalkCurve, 24, 0.08, 12, false);
      const stalkMesh = new THREE.Mesh(stalkGeom, getMat("pituitary", materials.primaryOrgan));

      const circleCurve = new THREE.EllipseCurve(0, 0, 0.25, 0.25, 0, 2 * Math.PI, false, 0);
      const circlePts = circleCurve.getPoints(32).map(p => new THREE.Vector3(p.x, 0.4, p.y));
      const ringCurve = new THREE.CatmullRomCurve3(circlePts, true);
      const ringGeom = new THREE.TubeGeometry(ringCurve, 32, 0.03, 8, true);
      const ringMesh = new THREE.Mesh(ringGeom, materials.vascularArtery);

      pituitaryGroup.add(adenoMesh, neuroMesh, stalkMesh, ringMesh);
      pituitaryGroup.position.set(0, 3.2, 0);
      pituitaryGroup.userData = { subOrganId: "pituitary", name: "Pituitary Gland & Sella Turcica" };
      root.add(pituitaryGroup);

      subOrganMetas.push({
        subOrganId: "pituitary",
        name: "Pituitary & Hypothalamus",
        focusTarget: [0, 3.2, 0],
        cameraOffset: [0, 3.2, 3.2],
      });

      // 2. Realistic Lobulated Butterfly Thyroid & Parathyroid Glands
      const thyroidGroup = new THREE.Group();
      
      for (let i = 0; i < 7; i++) {
        const ringGeom = new THREE.TorusGeometry(0.55, 0.08, 12, 24, Math.PI * 1.5);
        const trRing = new THREE.Mesh(ringGeom, materials.connectiveTissue);
        trRing.rotation.x = Math.PI / 2;
        trRing.rotation.z = -Math.PI * 0.25;
        trRing.position.set(0, 0.7 - i * 0.22, 0);
        thyroidGroup.add(trRing);
      }

      const leftLobeGeom = new THREE.CapsuleGeometry(0.38, 0.9, 16, 32);
      const leftLobe = new THREE.Mesh(leftLobeGeom, getMat("thyroid", materials.primaryOrgan));
      leftLobe.position.set(-0.62, 0.05, 0.35);
      leftLobe.rotation.z = -0.25;
      leftLobe.rotation.x = 0.15;
      leftLobe.scale.set(0.9, 1.1, 0.75);

      const rightLobeGeom = new THREE.CapsuleGeometry(0.38, 0.9, 16, 32);
      const rightLobe = new THREE.Mesh(rightLobeGeom, getMat("thyroid", materials.primaryOrgan));
      rightLobe.position.set(0.62, 0.05, 0.35);
      rightLobe.rotation.z = 0.25;
      rightLobe.rotation.x = 0.15;
      rightLobe.scale.set(0.95, 1.1, 0.75);

      const isthmusGeom = new THREE.BoxGeometry(0.65, 0.35, 0.18, 16, 8, 8);
      const isthmus = new THREE.Mesh(isthmusGeom, getMat("thyroid", materials.primaryOrgan));
      isthmus.position.set(0, -0.05, 0.58);

      const paraGeom = new THREE.SphereGeometry(0.09, 12, 12);
      const lpSup = new THREE.Mesh(paraGeom, materials.secondaryOrgan);
      lpSup.position.set(-0.7, 0.35, 0.1);
      const lpInf = new THREE.Mesh(paraGeom, materials.secondaryOrgan);
      lpInf.position.set(-0.7, -0.25, 0.1);

      const rpSup = new THREE.Mesh(paraGeom, materials.secondaryOrgan);
      rpSup.position.set(0.7, 0.35, 0.1);
      const rpInf = new THREE.Mesh(paraGeom, materials.secondaryOrgan);
      rpInf.position.set(0.7, -0.25, 0.1);

      const leftThyArteryCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.9, 1.2, 0.2),
        new THREE.Vector3(-0.7, 0.7, 0.4),
        new THREE.Vector3(-0.6, 0.3, 0.45),
      ]);
      const leftThyArtery = new THREE.Mesh(new THREE.TubeGeometry(leftThyArteryCurve, 16, 0.04, 8, false), materials.vascularArtery);

      const rightThyArteryCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.9, 1.2, 0.2),
        new THREE.Vector3(0.7, 0.7, 0.4),
        new THREE.Vector3(0.6, 0.3, 0.45),
      ]);
      const rightThyArtery = new THREE.Mesh(new THREE.TubeGeometry(rightThyArteryCurve, 16, 0.04, 8, false), materials.vascularArtery);

      thyroidGroup.add(leftLobe, rightLobe, isthmus, lpSup, lpInf, rpSup, rpInf, leftThyArtery, rightThyArtery);
      thyroidGroup.position.set(0, 1.5, 0);
      thyroidGroup.userData = { subOrganId: "thyroid", name: "Thyroid & Parathyroids" };
      root.add(thyroidGroup);

      subOrganMetas.push({
        subOrganId: "thyroid",
        name: "Thyroid & Parathyroids",
        focusTarget: [0, 1.5, 0.3],
        cameraOffset: [0, 1.5, 3.2],
      });

      // 3. Suprarenal Adrenal Glands
      const adrenalGroup = new THREE.Group();
      
      const leftAdrenalGeom = new THREE.TorusGeometry(0.35, 0.14, 16, 24, Math.PI * 0.85);
      const leftAdrenal = new THREE.Mesh(leftAdrenalGeom, getMat("adrenals", materials.secondaryOrgan));
      leftAdrenal.position.set(-1.4, -0.2, 0.2);
      leftAdrenal.rotation.z = 0.6;
      leftAdrenal.rotation.x = -0.2;

      const rightAdrenalGeom = new THREE.ConeGeometry(0.38, 0.55, 4);
      const rightAdrenal = new THREE.Mesh(rightAdrenalGeom, getMat("adrenals", materials.secondaryOrgan));
      rightAdrenal.position.set(1.4, -0.15, 0.2);
      rightAdrenal.rotation.z = -0.3;
      rightAdrenal.rotation.y = Math.PI / 4;

      const leftAdrArt = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, -0.4, 0), new THREE.Vector3(-1.1, -0.25, 0.15)]), 12, 0.035, 8, false),
        materials.vascularArtery
      );
      const rightAdrArt = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, -0.4, 0), new THREE.Vector3(1.1, -0.2, 0.15)]), 12, 0.035, 8, false),
        materials.vascularArtery
      );

      adrenalGroup.add(leftAdrenal, rightAdrenal, leftAdrArt, rightAdrArt);
      adrenalGroup.userData = { subOrganId: "adrenals", name: "Suprarenal Adrenal Glands" };
      root.add(adrenalGroup);

      subOrganMetas.push({
        subOrganId: "adrenals",
        name: "Suprarenal Adrenal Glands",
        focusTarget: [0, -0.2, 0.2],
        cameraOffset: [0, -0.2, 3.6],
      });

      // 4. Endocrine Pancreas
      const pancGroup = new THREE.Group();
      const pancCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.2, -1.8, 0.1),
        new THREE.Vector3(0.3, -1.6, 0.3),
        new THREE.Vector3(-1.1, -1.3, 0.1),
      ]);
      const pancGeom = new THREE.TubeGeometry(pancCurve, 32, 0.22, 16, false);
      const pancMesh = new THREE.Mesh(pancGeom, getMat("pancreas_endocrine", materials.primaryOrgan));

      for (let i = 0; i < 8; i++) {
        const islet = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), materials.secondaryOrgan);
        islet.position.set(-0.4 - i * 0.08, -1.45 + (Math.random() - 0.5) * 0.15, 0.25 + (Math.random() - 0.5) * 0.1);
        pancGroup.add(islet);
      }

      pancGroup.add(pancMesh);
      pancGroup.userData = { subOrganId: "pancreas_endocrine", name: "Endocrine Pancreas & Islets" };
      root.add(pancGroup);

      subOrganMetas.push({
        subOrganId: "pancreas_endocrine",
        name: "Islets of Langerhans (Pancreas)",
        focusTarget: [-0.4, -1.5, 0.2],
        cameraOffset: [-0.4, -1.5, 3.2],
      });

      // 5. Pineal Gland
      const pinealGroup = new THREE.Group();
      const pinealGeom = new THREE.ConeGeometry(0.18, 0.4, 16);
      const pinealMesh = new THREE.Mesh(pinealGeom, getMat("pineal", materials.secondaryOrgan));
      pinealMesh.rotation.x = -Math.PI / 3;
      pinealGroup.add(pinealMesh);
      pinealGroup.position.set(0, 3.9, -0.4);
      pinealGroup.userData = { subOrganId: "pineal", name: "Pineal Gland" };
      root.add(pinealGroup);

      subOrganMetas.push({
        subOrganId: "pineal",
        name: "Pineal Gland",
        focusTarget: [0, 3.9, -0.4],
        cameraOffset: [0, 3.9, 2.8],
      });

      animatables.push({ mesh: adenoMesh, type: "pulse", speed: 1.6 });
      break;
    }

    case "cardiovascular": {
      // 1. Anatomical 4-Chambered Myocardial Heart
      const heartGroup = new THREE.Group();
      
      const ventGeom = new THREE.SphereGeometry(1.1, 32, 32);
      ventGeom.scale(0.9, 1.25, 0.85);
      const ventMesh = new THREE.Mesh(ventGeom, getMat("left_ventricle", materials.primaryOrgan));
      ventMesh.rotation.z = -0.25;
      ventMesh.rotation.x = 0.2;

      const atriaGeom = new THREE.SphereGeometry(0.65, 24, 24);
      const atriaMesh = new THREE.Mesh(atriaGeom, getMat("left_ventricle", materials.secondaryOrgan));
      atriaMesh.position.set(0.65, 0.85, -0.1);

      const aortaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.6, 0.2),
        new THREE.Vector3(0, 1.6, 0.1),
        new THREE.Vector3(-0.5, 2.1, -0.1),
        new THREE.Vector3(-0.9, 1.6, -0.3),
        new THREE.Vector3(-0.9, -1.4, -0.4),
      ]);
      const aortaMesh = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 64, 0.26, 16, false), materials.vascularArtery);

      const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6), materials.vascularArtery);
      b1.position.set(-0.2, 2.1, 0.05);
      b1.rotation.z = -0.2;
      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), materials.vascularArtery);
      b2.position.set(-0.45, 2.15, -0.05);
      const b3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), materials.vascularArtery);
      b3.position.set(-0.7, 2.05, -0.15);
      b3.rotation.z = 0.2;

      const pulmCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 0.4, 0.45),
        new THREE.Vector3(-0.1, 1.2, 0.25),
        new THREE.Vector3(-0.8, 1.4, -0.1),
      ]);
      const pulmMesh = new THREE.Mesh(new THREE.TubeGeometry(pulmCurve, 32, 0.22, 16, false), materials.vascularVein);

      const ladCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.1, 0.8, 0.8),
        new THREE.Vector3(-0.2, 0.2, 0.9),
        new THREE.Vector3(-0.4, -0.6, 0.7),
        new THREE.Vector3(-0.35, -1.0, 0.4),
      ]);
      const ladMesh = new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 32, 0.04, 8, false), materials.vascularArtery);

      const svcGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 16);
      const svcMesh = new THREE.Mesh(svcGeom, materials.vascularVein);
      svcMesh.position.set(0.75, 1.5, -0.15);

      heartGroup.add(ventMesh, atriaMesh, aortaMesh, b1, b2, b3, pulmMesh, ladMesh, svcMesh);
      heartGroup.userData = { subOrganId: "left_ventricle", name: "Myocardial Heart & Vasculature" };
      root.add(heartGroup);

      subOrganMetas.push(
        {
          subOrganId: "left_ventricle",
          name: "Left Ventricle & Myocardium",
          focusTarget: [0, 0, 0],
          cameraOffset: [0, 0, 3.8],
        },
        {
          subOrganId: "aorta_valves",
          name: "Aorta & Coronary Arteries",
          focusTarget: [-0.3, 1.5, 0],
          cameraOffset: [-0.3, 1.5, 3.4],
        },
        {
          subOrganId: "conduction_system",
          name: "SA/AV Conduction System",
          focusTarget: [0.6, 0.8, 0.2],
          cameraOffset: [0.6, 0.8, 2.6],
        }
      );

      animatables.push({ mesh: ventMesh, type: "pulse", speed: 2.2 });
      break;
    }

    case "nervous": {
      // High-Fidelity Cerebral Cortex, Cerebellum & Spinal Cord
      const neuroGroup = new THREE.Group();
      
      // Left & Right Neocortical Hemispheres with longitudinal fissure
      const leftHemiGeom = new THREE.SphereGeometry(1.3, 32, 32);
      leftHemiGeom.scale(0.85, 0.95, 1.2);
      const leftHemi = new THREE.Mesh(leftHemiGeom, getMat("cerebral_cortex", materials.primaryOrgan));
      leftHemi.position.set(-0.7, 0.8, 0);

      const rightHemiGeom = new THREE.SphereGeometry(1.3, 32, 32);
      rightHemiGeom.scale(0.85, 0.95, 1.2);
      const rightHemi = new THREE.Mesh(rightHemiGeom, getMat("cerebral_cortex", materials.primaryOrgan));
      rightHemi.position.set(0.7, 0.8, 0);

      // Cerebellum with horizontal folia
      const cerebGeom = new THREE.SphereGeometry(0.75, 24, 24);
      cerebGeom.scale(1.4, 0.7, 0.9);
      const cerebMesh = new THREE.Mesh(cerebGeom, getMat("cerebellum", materials.secondaryOrgan));
      cerebMesh.position.set(0, -0.5, -0.85);

      // Brainstem (Pons & Medulla) & Cervical Spinal Cord
      const cordCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.2, -0.2),
        new THREE.Vector3(0, -1.0, -0.3),
        new THREE.Vector3(0, -2.6, -0.25),
      ]);
      const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 32, 0.22, 16, false), getMat("spinal_cord", materials.secondaryOrgan));

      // Circle of Willis Basilar Artery
      const basilarCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.9, -0.05),
        new THREE.Vector3(0, -0.2, 0.0),
        new THREE.Vector3(0.2, 0.2, 0.1),
      ]);
      const basilarMesh = new THREE.Mesh(new THREE.TubeGeometry(basilarCurve, 16, 0.04, 8, false), materials.vascularArtery);

      neuroGroup.add(leftHemi, rightHemi, cerebMesh, cordMesh, basilarMesh);
      neuroGroup.userData = { subOrganId: "cerebral_cortex", name: "Cerebral Cortex & Nervous System" };
      root.add(neuroGroup);

      subOrganMetas.push(
        {
          subOrganId: "cerebral_cortex",
          name: "Cerebral Cortex & Hemispheres",
          focusTarget: [0, 0.8, 0],
          cameraOffset: [0, 0.8, 4.2],
        },
        {
          subOrganId: "cerebellum",
          name: "Cerebellum & Brainstem",
          focusTarget: [0, -0.5, -0.85],
          cameraOffset: [0, -0.5, 3.2],
        },
        {
          subOrganId: "spinal_cord",
          name: "Spinal Cord & Nerve Tracts",
          focusTarget: [0, -1.8, -0.25],
          cameraOffset: [0, -1.8, 3.6],
        }
      );
      break;
    }

    case "respiratory": {
      // Trachea with C-Rings & 5 Anatomical Lung Lobes
      const respGroup = new THREE.Group();
      
      const tracheaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2.6, 0),
        new THREE.Vector3(0, 0.9, 0),
      ]);
      const tracheaMesh = new THREE.Mesh(new THREE.TubeGeometry(tracheaCurve, 32, 0.24, 16, false), materials.connectiveTissue);

      const lungLeftGeom = new THREE.CapsuleGeometry(0.85, 1.7, 16, 32);
      lungLeftGeom.scale(0.9, 1.0, 0.8);
      const lungLeft = new THREE.Mesh(lungLeftGeom, getMat("lung_parenchyma", materials.primaryOrgan));
      lungLeft.position.set(-1.3, 0.2, 0);
      lungLeft.rotation.z = -0.15;

      const lungRightGeom = new THREE.CapsuleGeometry(0.85, 1.7, 16, 32);
      lungRightGeom.scale(1.05, 1.0, 0.85);
      const lungRight = new THREE.Mesh(lungRightGeom, getMat("lung_parenchyma", materials.primaryOrgan));
      lungRight.position.set(1.3, 0.2, 0);
      lungRight.rotation.z = 0.15;

      const pulmArtCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.9, 0.2),
        new THREE.Vector3(-1.0, 0.5, 0.1),
      ]);
      const pulmArt = new THREE.Mesh(new THREE.TubeGeometry(pulmArtCurve, 16, 0.08, 8, false), materials.vascularVein);

      respGroup.add(tracheaMesh, lungLeft, lungRight, pulmArt);
      respGroup.userData = { subOrganId: "lung_parenchyma", name: "Pulmonary Respiratory System" };
      root.add(respGroup);

      subOrganMetas.push(
        {
          subOrganId: "lung_parenchyma",
          name: "Lung Parenchyma & Lobes",
          focusTarget: [0, 0.2, 0],
          cameraOffset: [0, 0.2, 4.6],
        },
        {
          subOrganId: "trachea_bronchi",
          name: "Trachea & Primary Bronchi",
          focusTarget: [0, 1.6, 0],
          cameraOffset: [0, 1.6, 3.2],
        }
      );

      animatables.push({ mesh: lungLeft, type: "pulse", speed: 1.0 });
      animatables.push({ mesh: lungRight, type: "pulse", speed: 1.0 });
      break;
    }

    case "renal": {
      const renalGroup = new THREE.Group();
      
      const aorta = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 5.0, 16), materials.vascularArtery);
      aorta.position.set(-0.25, 0, 0);
      const ivc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 5.0, 16), materials.vascularVein);
      ivc.position.set(0.25, 0, 0);

      const leftKidneyGeom = new THREE.SphereGeometry(0.9, 32, 32);
      leftKidneyGeom.scale(0.65, 1.15, 0.7);
      const leftKidney = new THREE.Mesh(leftKidneyGeom, getMat("renal_cortex", materials.primaryOrgan));
      leftKidney.position.set(-1.6, 0.5, 0.1);
      leftKidney.rotation.z = 0.12;

      const rightKidneyGeom = new THREE.SphereGeometry(0.9, 32, 32);
      rightKidneyGeom.scale(0.65, 1.15, 0.7);
      const rightKidney = new THREE.Mesh(rightKidneyGeom, getMat("renal_cortex", materials.primaryOrgan));
      rightKidney.position.set(1.6, 0.2, 0.1);
      rightKidney.rotation.z = -0.12;

      const leftArt = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.25, 0.4, 0), new THREE.Vector3(-1.3, 0.45, 0.1)]), 16, 0.07, 8, false),
        materials.vascularArtery
      );
      const rightArt = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.25, 0.1, 0), new THREE.Vector3(1.3, 0.15, 0.1)]), 16, 0.07, 8, false),
        materials.vascularArtery
      );

      const leftVein = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.25, 0.5, 0.1), new THREE.Vector3(-1.25, 0.55, 0.15)]), 16, 0.08, 8, false),
        materials.vascularVein
      );
      const rightVein = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.25, 0.25, 0.1), new THREE.Vector3(1.25, 0.25, 0.15)]), 16, 0.08, 8, false),
        materials.vascularVein
      );

      const leftUreterCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.3, 0.3, 0.1),
        new THREE.Vector3(-0.7, -1.0, 0.15),
        new THREE.Vector3(-0.35, -2.1, 0.25),
      ]);
      const leftUreter = new THREE.Mesh(new THREE.TubeGeometry(leftUreterCurve, 32, 0.05, 8, false), materials.connectiveTissue);

      const rightUreterCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.3, 0.0, 0.1),
        new THREE.Vector3(0.7, -1.0, 0.15),
        new THREE.Vector3(0.35, -2.1, 0.25),
      ]);
      const rightUreter = new THREE.Mesh(new THREE.TubeGeometry(rightUreterCurve, 32, 0.05, 8, false), materials.connectiveTissue);

      const bladderGeom = new THREE.SphereGeometry(0.75, 24, 24);
      bladderGeom.scale(1.0, 0.9, 0.95);
      const bladderMesh = new THREE.Mesh(bladderGeom, getMat("urinary_bladder", materials.secondaryOrgan));
      bladderMesh.position.set(0, -2.4, 0.3);

      renalGroup.add(aorta, ivc, leftKidney, rightKidney, leftArt, rightArt, leftVein, rightVein, leftUreter, rightUreter, bladderMesh);
      renalGroup.userData = { subOrganId: "renal_cortex", name: "Renal System & Kidneys" };
      root.add(renalGroup);

      subOrganMetas.push(
        {
          subOrganId: "renal_cortex",
          name: "Renal Cortex & Glomeruli",
          focusTarget: [-1.6, 0.5, 0.1],
          cameraOffset: [-1.6, 0.5, 3.0],
        },
        {
          subOrganId: "ureters_pelvis",
          name: "Renal Pelvis & Ureters",
          focusTarget: [0, -0.8, 0.1],
          cameraOffset: [0, -0.8, 3.6],
        },
        {
          subOrganId: "urinary_bladder",
          name: "Detrusor Urinary Bladder",
          focusTarget: [0, -2.4, 0.3],
          cameraOffset: [0, -2.4, 2.8],
        }
      );
      break;
    }

    case "digestive": {
      // Organic J-Stomach, Multi-lobed Liver, Gallbladder & Intestinal Loops
      const giGroup = new THREE.Group();
      
      const liverGeom = new THREE.CylinderGeometry(1.5, 0.7, 1.3, 32);
      liverGeom.scale(1.1, 0.9, 0.8);
      const liverMesh = new THREE.Mesh(liverGeom, getMat("liver_hepatic", materials.primaryOrgan));
      liverMesh.rotation.z = -0.35;
      liverMesh.position.set(0.8, 0.9, 0);

      const stomachGeom = new THREE.TorusGeometry(0.85, 0.42, 16, 32, Math.PI * 0.95);
      const stomachMesh = new THREE.Mesh(stomachGeom, getMat("stomach", materials.secondaryOrgan));
      stomachMesh.rotation.z = Math.PI / 1.35;
      stomachMesh.position.set(-0.7, 0.5, 0.25);

      const gbGeom = new THREE.SphereGeometry(0.28, 16, 16);
      gbGeom.scale(0.7, 1.2, 0.7);
      const gbMesh = new THREE.Mesh(gbGeom, materials.connectiveTissue);
      gbMesh.position.set(0.6, 0.3, 0.65);

      const intCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.5, 0.25),
        new THREE.Vector3(-0.7, -1.1, 0.3),
        new THREE.Vector3(0.7, -1.6, 0.3),
        new THREE.Vector3(-0.6, -2.2, 0.3),
        new THREE.Vector3(0.5, -2.7, 0.2),
      ]);
      const intMesh = new THREE.Mesh(new THREE.TubeGeometry(intCurve, 64, 0.25, 16, false), getMat("intestines", materials.secondaryOrgan));

      giGroup.add(liverMesh, stomachMesh, gbMesh, intMesh);
      giGroup.userData = { subOrganId: "stomach", name: "Gastrointestinal System" };
      root.add(giGroup);

      subOrganMetas.push(
        {
          subOrganId: "stomach",
          name: "Gastric Rugae & Stomach",
          focusTarget: [-0.7, 0.5, 0.25],
          cameraOffset: [-0.7, 0.5, 3.4],
        },
        {
          subOrganId: "liver_hepatic",
          name: "Hepatic Lobules & Liver",
          focusTarget: [0.8, 0.9, 0],
          cameraOffset: [0.8, 0.9, 3.6],
        },
        {
          subOrganId: "intestines",
          name: "Small & Large Intestine",
          focusTarget: [0, -1.6, 0.3],
          cameraOffset: [0, -1.6, 4.0],
        }
      );
      break;
    }

    default: {
      // Universal High-Fidelity Anatomical Structure
      const defGroup = new THREE.Group();
      const defGeom = new THREE.CapsuleGeometry(0.95, 2.0, 24, 32);
      const defMesh = new THREE.Mesh(defGeom, materials.primaryOrgan);
      defGroup.add(defMesh);
      root.add(defGroup);

      subOrganMetas.push({
        subOrganId: "primary_organ",
        name: "Primary Anatomical Structure",
        focusTarget: [0, 0, 0],
        cameraOffset: [0, 0, 4.2],
      });
      break;
    }
  }

  return { group: root, subOrganMetas, animatables };
}
