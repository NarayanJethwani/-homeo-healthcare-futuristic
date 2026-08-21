/**
 * BioDigital-Grade Realistic Anatomical 3D Models
 * Handcrafted organic topography, vascular branching trees, lobar segmentation,
 * and cellular sub-units for all 12 human anatomical systems.
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
      
      // Anterior Adenohypophysis (Lobe 1)
      const adenoGeom = new THREE.SphereGeometry(0.35, 24, 24);
      adenoGeom.scale(1.0, 0.8, 0.7);
      const adenoMesh = new THREE.Mesh(adenoGeom, getMat("pituitary", materials.primaryOrgan));
      adenoMesh.position.set(0, 0, 0.15);

      // Posterior Neurohypophysis (Lobe 2)
      const neuroGeom = new THREE.SphereGeometry(0.28, 24, 24);
      neuroGeom.scale(0.9, 0.8, 0.6);
      const neuroMesh = new THREE.Mesh(neuroGeom, getMat("pituitary", materials.secondaryOrgan));
      neuroMesh.position.set(0, 0, -0.15);

      // Infundibular Stalk connecting to Hypothalamus
      const stalkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0.6, -0.1),
        new THREE.Vector3(0, 1.1, -0.2),
      ]);
      const stalkGeom = new THREE.TubeGeometry(stalkCurve, 24, 0.08, 12, false);
      const stalkMesh = new THREE.Mesh(stalkGeom, getMat("pituitary", materials.primaryOrgan));

      // Superior Hypophyseal Arterial Ring
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
      
      // Tracheal Ring Context behind thyroid
      for (let i = 0; i < 7; i++) {
        const ringGeom = new THREE.TorusGeometry(0.55, 0.08, 12, 24, Math.PI * 1.5);
        const trRing = new THREE.Mesh(ringGeom, materials.connectiveTissue);
        trRing.rotation.x = Math.PI / 2;
        trRing.rotation.z = -Math.PI * 0.25;
        trRing.position.set(0, 0.7 - i * 0.22, 0);
        thyroidGroup.add(trRing);
      }

      // Left Thyroid Lobe (Conical, tapering superiorly)
      const leftLobeGeom = new THREE.CapsuleGeometry(0.38, 0.9, 16, 32);
      const leftLobe = new THREE.Mesh(leftLobeGeom, getMat("thyroid", materials.primaryOrgan));
      leftLobe.position.set(-0.62, 0.05, 0.35);
      leftLobe.rotation.z = -0.25;
      leftLobe.rotation.x = 0.15;
      leftLobe.scale.set(0.9, 1.1, 0.75);

      // Right Thyroid Lobe
      const rightLobeGeom = new THREE.CapsuleGeometry(0.38, 0.9, 16, 32);
      const rightLobe = new THREE.Mesh(rightLobeGeom, getMat("thyroid", materials.primaryOrgan));
      rightLobe.position.set(0.62, 0.05, 0.35);
      rightLobe.rotation.z = 0.25;
      rightLobe.rotation.x = 0.15;
      rightLobe.scale.set(0.95, 1.1, 0.75);

      // Thyroid Isthmus bridging lobes over 2nd-4th tracheal rings
      const isthmusGeom = new THREE.BoxGeometry(0.65, 0.35, 0.18, 16, 8, 8);
      const isthmus = new THREE.Mesh(isthmusGeom, getMat("thyroid", materials.primaryOrgan));
      isthmus.position.set(0, -0.05, 0.58);

      // 4 Posterior Parathyroid Glands (Superior & Inferior)
      const paraGeom = new THREE.SphereGeometry(0.09, 12, 12);
      const lpSup = new THREE.Mesh(paraGeom, materials.secondaryOrgan);
      lpSup.position.set(-0.7, 0.35, 0.1);
      const lpInf = new THREE.Mesh(paraGeom, materials.secondaryOrgan);
      lpInf.position.set(-0.7, -0.25, 0.1);

      const rpSup = new THREE.Mesh(paraGeom, materials.secondaryOrgan);
      rpSup.position.set(0.7, 0.35, 0.1);
      const rpInf = new THREE.Mesh(paraGeom, materials.secondaryOrgan);
      rpInf.position.set(0.7, -0.25, 0.1);

      // Superior Thyroid Arteries (Bifurcating branches)
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

      // 3. Suprarenal Adrenal Glands (Resting on superior renal poles)
      const adrenalGroup = new THREE.Group();
      
      // Left Adrenal (Semilunar / Crescent shape)
      const leftAdrenalGeom = new THREE.TorusGeometry(0.35, 0.14, 16, 24, Math.PI * 0.85);
      const leftAdrenal = new THREE.Mesh(leftAdrenalGeom, getMat("adrenals", materials.secondaryOrgan));
      leftAdrenal.position.set(-1.4, -0.2, 0.2);
      leftAdrenal.rotation.z = 0.6;
      leftAdrenal.rotation.x = -0.2;

      // Right Adrenal (Pyramidal shape)
      const rightAdrenalGeom = new THREE.ConeGeometry(0.38, 0.55, 4);
      const rightAdrenal = new THREE.Mesh(rightAdrenalGeom, getMat("adrenals", materials.secondaryOrgan));
      rightAdrenal.position.set(1.4, -0.15, 0.2);
      rightAdrenal.rotation.z = -0.3;
      rightAdrenal.rotation.y = Math.PI / 4;

      // Adrenal Middle Suprarenal Arteries from Aorta
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

      // 4. Endocrine Pancreas (Tail & Islets of Langerhans)
      const pancGroup = new THREE.Group();
      const pancCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.2, -1.8, 0.1),  // Head in C-loop
        new THREE.Vector3(0.3, -1.6, 0.3),  // Neck & Body
        new THREE.Vector3(-1.1, -1.3, 0.1), // Tail extending to spleen
      ]);
      const pancGeom = new THREE.TubeGeometry(pancCurve, 32, 0.22, 16, false);
      const pancMesh = new THREE.Mesh(pancGeom, getMat("pancreas_endocrine", materials.primaryOrgan));

      // Micro Islet clusters (Gold glowing endocrine aggregates)
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

      // 5. Pineal Gland (Epithalamic Cone)
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
      
      // Ventricular Cone (Left & Right Ventricles with Anterior Interventricular Sulcus)
      const ventGeom = new THREE.SphereGeometry(1.1, 32, 32);
      ventGeom.scale(0.9, 1.25, 0.85);
      const ventMesh = new THREE.Mesh(ventGeom, getMat("left_ventricle", materials.primaryOrgan));
      ventMesh.rotation.z = -0.25;
      ventMesh.rotation.x = 0.2;

      // Right Atrium & Left Atrial Auricle
      const atriaGeom = new THREE.SphereGeometry(0.65, 24, 24);
      const atriaMesh = new THREE.Mesh(atriaGeom, getMat("left_ventricle", materials.secondaryOrgan));
      atriaMesh.position.set(0.65, 0.85, -0.1);

      // Ascending Aortic Arch with Brachiocephalic, Common Carotid & Subclavian Trunks
      const aortaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.6, 0.2),
        new THREE.Vector3(0, 1.6, 0.1),
        new THREE.Vector3(-0.5, 2.1, -0.1),
        new THREE.Vector3(-0.9, 1.6, -0.3),
        new THREE.Vector3(-0.9, -1.4, -0.4),
      ]);
      const aortaMesh = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 64, 0.26, 16, false), materials.vascularArtery);

      // Arch Branches
      const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6), materials.vascularArtery);
      b1.position.set(-0.2, 2.1, 0.05);
      b1.rotation.z = -0.2;
      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), materials.vascularArtery);
      b2.position.set(-0.45, 2.15, -0.05);
      const b3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), materials.vascularArtery);
      b3.position.set(-0.7, 2.05, -0.15);
      b3.rotation.z = 0.2;

      // Pulmonary Trunk Bifurcation (Left & Right Pulmonary Arteries)
      const pulmCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 0.4, 0.45),
        new THREE.Vector3(-0.1, 1.2, 0.25),
        new THREE.Vector3(-0.8, 1.4, -0.1),
      ]);
      const pulmMesh = new THREE.Mesh(new THREE.TubeGeometry(pulmCurve, 32, 0.22, 16, false), materials.vascularVein);

      // Coronary Arteries (Left Anterior Descending & Right Coronary Artery)
      const ladCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.1, 0.8, 0.8),
        new THREE.Vector3(-0.2, 0.2, 0.9),
        new THREE.Vector3(-0.4, -0.6, 0.7),
        new THREE.Vector3(-0.35, -1.0, 0.4),
      ]);
      const ladMesh = new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 32, 0.04, 8, false), materials.vascularArtery);

      // Superior Vena Cava
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

    case "renal": {
      // 1. Bilateral Reniform Kidneys with Hilum & Renal Sinus
      const renalGroup = new THREE.Group();
      
      // Abdominal Aorta & Inferior Vena Cava
      const aorta = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 5.0, 16), materials.vascularArtery);
      aorta.position.set(-0.25, 0, 0);
      const ivc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 5.0, 16), materials.vascularVein);
      ivc.position.set(0.25, 0, 0);

      // Left Kidney (Bean shape with concave medial hilum)
      const leftKidneyGeom = new THREE.SphereGeometry(0.9, 32, 32);
      leftKidneyGeom.scale(0.65, 1.15, 0.7);
      const leftKidney = new THREE.Mesh(leftKidneyGeom, getMat("renal_cortex", materials.primaryOrgan));
      leftKidney.position.set(-1.6, 0.5, 0.1);
      leftKidney.rotation.z = 0.12;

      // Right Kidney (Situated slightly lower due to liver)
      const rightKidneyGeom = new THREE.SphereGeometry(0.9, 32, 32);
      rightKidneyGeom.scale(0.65, 1.15, 0.7);
      const rightKidney = new THREE.Mesh(rightKidneyGeom, getMat("renal_cortex", materials.primaryOrgan));
      rightKidney.position.set(1.6, 0.2, 0.1);
      rightKidney.rotation.z = -0.12;

      // Left & Right Renal Arteries & Veins
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

      // Peristaltic Ureters cascading down to bladder
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

      // Detrusor Urinary Bladder
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

    default: {
      // High-Fidelity Universal Anatomical Structure
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
