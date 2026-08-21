/**
 * HoloHuman™ Native Procedural Anatomical 3D Mesh Builders
 * Generates rich, hardware-accelerated 3D organ structures, vascular trees,
 * and cellular sub-units for all 12 anatomical systems.
 */

import * as THREE from "three";
import { AnatomySystemId } from "../../data/medicalAcademyData";
import { OrganMaterialSet } from "./organShaderMaterials";

export interface SubOrganMeshMeta {
  subOrganId: string;
  name: string;
  focusTarget: [number, number, number];
  cameraOffset: [number, number, number];
}

export function buildSystem3DScene(
  systemId: AnatomySystemId,
  materials: OrganMaterialSet,
  activeSubOrganId: string | null,
  activeRemedyTropismId: string | null
): {
  group: THREE.Group;
  subOrganMetas: SubOrganMeshMeta[];
  animatables: Array<{
    mesh: THREE.Object3D;
    type: "pulse" | "rotate" | "wave" | "flow";
    speed: number;
  }>;
} {
  const root = new THREE.Group();
  const subOrganMetas: SubOrganMeshMeta[] = [];
  const animatables: Array<{ mesh: THREE.Object3D; type: "pulse" | "rotate" | "wave" | "flow"; speed: number }> = [];

  const getMat = (subId: string, defaultMat: THREE.Material) => {
    if (activeSubOrganId && activeSubOrganId === subId) {
      return materials.highlight;
    }
    if (activeRemedyTropismId) {
      return materials.tropismAura;
    }
    if (activeSubOrganId && activeSubOrganId !== subId) {
      return materials.ghost;
    }
    return defaultMat;
  };

  switch (systemId) {
    case "endocrine": {
      // 1. Pituitary & Hypothalamus
      const pituitaryGroup = new THREE.Group();
      const pituitaryGeom = new THREE.SphereGeometry(0.5, 32, 32);
      const pituitaryMesh = new THREE.Mesh(pituitaryGeom, getMat("pituitary", materials.accent));
      pituitaryMesh.userData = { subOrganId: "pituitary", name: "Pituitary & Hypothalamus" };
      pituitaryGroup.add(pituitaryMesh);
      pituitaryGroup.position.set(0, 3.2, 0);
      root.add(pituitaryGroup);
      subOrganMetas.push({
        subOrganId: "pituitary",
        name: "Pituitary & Hypothalamus",
        focusTarget: [0, 3.2, 0],
        cameraOffset: [0, 3.2, 3.5],
      });

      // 2. Thyroid & Parathyroids (Butterfly lobes)
      const thyroidGroup = new THREE.Group();
      const lobeGeom = new THREE.CapsuleGeometry(0.4, 0.8, 16, 32);
      
      const leftLobe = new THREE.Mesh(lobeGeom, getMat("thyroid", materials.secondary));
      leftLobe.position.set(-0.6, 0, 0);
      leftLobe.rotation.z = -0.3;
      leftLobe.userData = { subOrganId: "thyroid", name: "Thyroid Left Lobe" };
      
      const rightLobe = new THREE.Mesh(lobeGeom, getMat("thyroid", materials.secondary));
      rightLobe.position.set(0.6, 0, 0);
      rightLobe.rotation.z = 0.3;
      rightLobe.userData = { subOrganId: "thyroid", name: "Thyroid Right Lobe" };
      
      const isthmusGeom = new THREE.TorusGeometry(0.5, 0.15, 16, 32, Math.PI);
      const isthmus = new THREE.Mesh(isthmusGeom, getMat("thyroid", materials.secondary));
      isthmus.rotation.x = Math.PI / 2;
      isthmus.position.set(0, -0.2, 0.2);
      isthmus.userData = { subOrganId: "thyroid", name: "Thyroid Isthmus" };

      thyroidGroup.add(leftLobe, rightLobe, isthmus);
      thyroidGroup.position.set(0, 1.6, 0.2);
      root.add(thyroidGroup);
      subOrganMetas.push({
        subOrganId: "thyroid",
        name: "Thyroid & Parathyroids",
        focusTarget: [0, 1.6, 0.2],
        cameraOffset: [0, 1.6, 3.2],
      });

      // 3. Adrenal Glands (Suprarenal pyramidal caps)
      const adrenalsGroup = new THREE.Group();
      const adrenalGeom = new THREE.ConeGeometry(0.5, 0.6, 16);
      
      const leftAdrenal = new THREE.Mesh(adrenalGeom, getMat("adrenals", materials.primary));
      leftAdrenal.position.set(-1.4, -0.6, 0);
      leftAdrenal.rotation.z = 0.2;
      leftAdrenal.userData = { subOrganId: "adrenals", name: "Left Adrenal Gland" };

      const rightAdrenal = new THREE.Mesh(adrenalGeom, getMat("adrenals", materials.primary));
      rightAdrenal.position.set(1.4, -0.5, 0);
      rightAdrenal.rotation.z = -0.2;
      rightAdrenal.userData = { subOrganId: "adrenals", name: "Right Adrenal Gland" };

      adrenalsGroup.add(leftAdrenal, rightAdrenal);
      root.add(adrenalsGroup);
      subOrganMetas.push({
        subOrganId: "adrenals",
        name: "Suprarenal Adrenal Glands",
        focusTarget: [0, -0.6, 0],
        cameraOffset: [0, -0.6, 3.8],
      });

      // 4. Endocrine Pancreas (Islets of Langerhans)
      const pancreasGroup = new THREE.Group();
      const pancreasGeom = new THREE.CapsuleGeometry(0.35, 1.6, 16, 32);
      const pancreasMesh = new THREE.Mesh(pancreasGeom, getMat("pancreas_endocrine", materials.primary));
      pancreasMesh.rotation.z = 1.2;
      pancreasMesh.position.set(-0.2, -1.8, 0.2);
      pancreasMesh.userData = { subOrganId: "pancreas_endocrine", name: "Endocrine Pancreas & Islets" };
      pancreasGroup.add(pancreasMesh);
      root.add(pancreasGroup);
      subOrganMetas.push({
        subOrganId: "pancreas_endocrine",
        name: "Islets of Langerhans (Pancreas)",
        focusTarget: [-0.2, -1.8, 0.2],
        cameraOffset: [-0.2, -1.8, 3.5],
      });

      // 5. Pineal Gland
      const pinealGroup = new THREE.Group();
      const pinealGeom = new THREE.ConeGeometry(0.25, 0.5, 16);
      const pinealMesh = new THREE.Mesh(pinealGeom, getMat("pineal", materials.accent));
      pinealMesh.position.set(0, 3.8, -0.3);
      pinealMesh.rotation.x = -Math.PI / 4;
      pinealMesh.userData = { subOrganId: "pineal", name: "Pineal Gland" };
      pinealGroup.add(pinealMesh);
      root.add(pinealGroup);
      subOrganMetas.push({
        subOrganId: "pineal",
        name: "Pineal Gland",
        focusTarget: [0, 3.8, -0.3],
        cameraOffset: [0, 3.8, 3.0],
      });

      animatables.push({ mesh: pituitaryMesh, type: "pulse", speed: 1.5 });
      break;
    }

    case "cardiovascular": {
      // 1. Left Ventricle & Myocardium
      const heartGroup = new THREE.Group();
      const heartGeom = new THREE.SphereGeometry(1.2, 32, 32);
      const heartMesh = new THREE.Mesh(heartGeom, getMat("left_ventricle", materials.primary));
      heartMesh.scale.set(1.0, 1.25, 0.9);
      heartMesh.position.set(0, 0, 0);
      heartMesh.userData = { subOrganId: "left_ventricle", name: "Left Ventricle & Myocardium" };
      heartGroup.add(heartMesh);

      // 2. Aortic Arch & Coronary Vasculature
      const aortaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.0, 0),
        new THREE.Vector3(0, 2.0, 0),
        new THREE.Vector3(-0.6, 2.4, -0.2),
        new THREE.Vector3(-1.0, 1.8, -0.4),
        new THREE.Vector3(-1.0, -1.5, -0.4),
      ]);
      const aortaGeom = new THREE.TubeGeometry(aortaCurve, 64, 0.28, 16, false);
      const aortaMesh = new THREE.Mesh(aortaGeom, getMat("aorta_valves", materials.secondary));
      aortaMesh.userData = { subOrganId: "aorta_valves", name: "Aorta & Coronary Arteries" };
      heartGroup.add(aortaMesh);

      // 3. Electrical Conduction SA/AV Node
      const saNodeGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const saNode = new THREE.Mesh(saNodeGeom, getMat("conduction_system", materials.accent));
      saNode.position.set(0.6, 1.0, 0.4);
      saNode.userData = { subOrganId: "conduction_system", name: "SA & AV Conduction Nodes" };
      heartGroup.add(saNode);

      root.add(heartGroup);
      subOrganMetas.push(
        {
          subOrganId: "left_ventricle",
          name: "Left Ventricle & Myocardium",
          focusTarget: [0, 0, 0],
          cameraOffset: [0, 0, 4.0],
        },
        {
          subOrganId: "aorta_valves",
          name: "Aorta & Coronary Arteries",
          focusTarget: [-0.3, 1.8, -0.2],
          cameraOffset: [-0.3, 1.8, 3.6],
        },
        {
          subOrganId: "conduction_system",
          name: "SA/AV Nodes & Purkinje Fibers",
          focusTarget: [0.6, 1.0, 0.4],
          cameraOffset: [0.6, 1.0, 2.8],
        }
      );

      animatables.push({ mesh: heartMesh, type: "pulse", speed: 2.2 });
      break;
    }

    case "nervous": {
      // 1. Cerebral Hemispheres
      const brainGroup = new THREE.Group();
      const hemiGeom = new THREE.SphereGeometry(1.4, 32, 32);
      
      const leftHemi = new THREE.Mesh(hemiGeom, getMat("cerebral_cortex", materials.primary));
      leftHemi.scale.set(0.85, 0.95, 1.2);
      leftHemi.position.set(-0.7, 1.0, 0);
      leftHemi.userData = { subOrganId: "cerebral_cortex", name: "Left Cerebral Hemisphere" };

      const rightHemi = new THREE.Mesh(hemiGeom, getMat("cerebral_cortex", materials.primary));
      rightHemi.scale.set(0.85, 0.95, 1.2);
      rightHemi.position.set(0.7, 1.0, 0);
      rightHemi.userData = { subOrganId: "cerebral_cortex", name: "Right Cerebral Hemisphere" };

      // 2. Cerebellum
      const cerebGeom = new THREE.SphereGeometry(0.75, 24, 24);
      const cerebMesh = new THREE.Mesh(cerebGeom, getMat("cerebellum", materials.secondary));
      cerebMesh.scale.set(1.4, 0.7, 0.85);
      cerebMesh.position.set(0, -0.4, -0.8);
      cerebMesh.userData = { subOrganId: "cerebellum", name: "Cerebellar Vermis & Lobes" };

      // 3. Brainstem & Spinal Cord
      const cordCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.2, -0.1),
        new THREE.Vector3(0, -1.2, -0.2),
        new THREE.Vector3(0, -3.0, -0.15),
      ]);
      const cordGeom = new THREE.TubeGeometry(cordCurve, 32, 0.22, 16, false);
      const cordMesh = new THREE.Mesh(cordGeom, getMat("spinal_cord", materials.accent));
      cordMesh.userData = { subOrganId: "spinal_cord", name: "Brainstem & Spinal Cord" };

      brainGroup.add(leftHemi, rightHemi, cerebMesh, cordMesh);
      root.add(brainGroup);

      subOrganMetas.push(
        {
          subOrganId: "cerebral_cortex",
          name: "Cerebral Cortex & Lobes",
          focusTarget: [0, 1.0, 0],
          cameraOffset: [0, 1.0, 4.5],
        },
        {
          subOrganId: "cerebellum",
          name: "Cerebellum",
          focusTarget: [0, -0.4, -0.8],
          cameraOffset: [0, -0.4, 3.2],
        },
        {
          subOrganId: "spinal_cord",
          name: "Spinal Cord & Brainstem",
          focusTarget: [0, -2.0, -0.15],
          cameraOffset: [0, -2.0, 3.8],
        }
      );
      break;
    }

    case "respiratory": {
      // 1. Trachea & Primary Bronchi
      const respGroup = new THREE.Group();
      const tracheaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2.5, 0),
        new THREE.Vector3(0, 0.8, 0),
      ]);
      const tracheaGeom = new THREE.TubeGeometry(tracheaCurve, 32, 0.25, 16, false);
      const tracheaMesh = new THREE.Mesh(tracheaGeom, getMat("trachea_bronchi", materials.secondary));
      tracheaMesh.userData = { subOrganId: "trachea_bronchi", name: "Trachea & Primary Bronchi" };

      // 2. Right (3 lobes) & Left (2 lobes) Lungs
      const lungGeom = new THREE.CapsuleGeometry(0.9, 1.8, 16, 32);
      
      const leftLung = new THREE.Mesh(lungGeom, getMat("lung_parenchyma", materials.primary));
      leftLung.position.set(-1.3, 0.2, 0);
      leftLung.rotation.z = -0.15;
      leftLung.scale.set(0.9, 1.0, 0.8);
      leftLung.userData = { subOrganId: "lung_parenchyma", name: "Left Lung (2 Lobes)" };

      const rightLung = new THREE.Mesh(lungGeom, getMat("lung_parenchyma", materials.primary));
      rightLung.position.set(1.3, 0.2, 0);
      rightLung.rotation.z = 0.15;
      rightLung.scale.set(1.05, 1.0, 0.85);
      rightLung.userData = { subOrganId: "lung_parenchyma", name: "Right Lung (3 Lobes)" };

      // 3. Alveolar Micro-Clusters
      const alvGeom = new THREE.DodecahedronGeometry(0.35, 1);
      const alvMesh = new THREE.Mesh(alvGeom, getMat("alveolar_bed", materials.accent));
      alvMesh.position.set(1.3, -0.6, 0.4);
      alvMesh.userData = { subOrganId: "alveolar_bed", name: "Alveolar-Capillary Diffusion Bed" };

      respGroup.add(tracheaMesh, leftLung, rightLung, alvMesh);
      root.add(respGroup);

      subOrganMetas.push(
        {
          subOrganId: "lung_parenchyma",
          name: "Lung Parenchyma & Lobes",
          focusTarget: [0, 0.2, 0],
          cameraOffset: [0, 0.2, 4.8],
        },
        {
          subOrganId: "trachea_bronchi",
          name: "Trachea & Primary Bronchi",
          focusTarget: [0, 1.6, 0],
          cameraOffset: [0, 1.6, 3.2],
        },
        {
          subOrganId: "alveolar_bed",
          name: "Alveolar Sacs & Surfactant",
          focusTarget: [1.3, -0.6, 0.4],
          cameraOffset: [1.3, -0.6, 2.5],
        }
      );

      animatables.push({ mesh: leftLung, type: "pulse", speed: 1.0 });
      animatables.push({ mesh: rightLung, type: "pulse", speed: 1.0 });
      break;
    }

    case "renal": {
      // Bilateral Kidneys & Ureters
      const renalGroup = new THREE.Group();
      const kidneyGeom = new THREE.SphereGeometry(0.9, 32, 32);
      
      const leftKidney = new THREE.Mesh(kidneyGeom, getMat("renal_cortex", materials.primary));
      leftKidney.scale.set(0.65, 1.2, 0.7);
      leftKidney.position.set(-1.4, 0.6, 0);
      leftKidney.rotation.z = 0.15;
      leftKidney.userData = { subOrganId: "renal_cortex", name: "Left Renal Cortex" };

      const rightKidney = new THREE.Mesh(kidneyGeom, getMat("renal_cortex", materials.primary));
      rightKidney.scale.set(0.65, 1.2, 0.7);
      rightKidney.position.set(1.4, 0.4, 0);
      rightKidney.rotation.z = -0.15;
      rightKidney.userData = { subOrganId: "renal_cortex", name: "Right Renal Cortex" };

      // Ureters to Bladder
      const leftUreterCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.2, 0.2, 0),
        new THREE.Vector3(-0.6, -1.2, 0.1),
        new THREE.Vector3(-0.2, -2.4, 0.2),
      ]);
      const leftUreterGeom = new THREE.TubeGeometry(leftUreterCurve, 32, 0.08, 12, false);
      const leftUreter = new THREE.Mesh(leftUreterGeom, getMat("ureters_pelvis", materials.secondary));

      const rightUreterCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.2, 0.0, 0),
        new THREE.Vector3(0.6, -1.2, 0.1),
        new THREE.Vector3(0.2, -2.4, 0.2),
      ]);
      const rightUreterGeom = new THREE.TubeGeometry(rightUreterCurve, 32, 0.08, 12, false);
      const rightUreter = new THREE.Mesh(rightUreterGeom, getMat("ureters_pelvis", materials.secondary));

      // Urinary Bladder
      const bladderGeom = new THREE.SphereGeometry(0.7, 24, 24);
      const bladderMesh = new THREE.Mesh(bladderGeom, getMat("urinary_bladder", materials.accent));
      bladderMesh.position.set(0, -2.6, 0.2);
      bladderMesh.userData = { subOrganId: "urinary_bladder", name: "Detrusor Urinary Bladder" };

      renalGroup.add(leftKidney, rightKidney, leftUreter, rightUreter, bladderMesh);
      root.add(renalGroup);

      subOrganMetas.push(
        {
          subOrganId: "renal_cortex",
          name: "Renal Cortex & Glomeruli",
          focusTarget: [-1.4, 0.6, 0],
          cameraOffset: [-1.4, 0.6, 3.2],
        },
        {
          subOrganId: "ureters_pelvis",
          name: "Renal Pelvis & Ureters",
          focusTarget: [0, -1.0, 0.1],
          cameraOffset: [0, -1.0, 3.8],
        },
        {
          subOrganId: "urinary_bladder",
          name: "Detrusor Urinary Bladder",
          focusTarget: [0, -2.6, 0.2],
          cameraOffset: [0, -2.6, 3.0],
        }
      );
      break;
    }

    case "digestive": {
      // Liver, Stomach, Gallbladder, Intestines
      const giGroup = new THREE.Group();
      
      // Liver (Right hypochondrium)
      const liverGeom = new THREE.CylinderGeometry(1.6, 0.8, 1.2, 32);
      const liverMesh = new THREE.Mesh(liverGeom, getMat("liver_hepatic", materials.primary));
      liverMesh.rotation.z = -0.4;
      liverMesh.position.set(0.8, 1.0, 0);
      liverMesh.userData = { subOrganId: "liver_hepatic", name: "Hepatic Lobules & Liver" };

      // Stomach (Left epigastrium)
      const stomachGeom = new THREE.TorusGeometry(0.9, 0.45, 16, 32, Math.PI * 0.9);
      const stomachMesh = new THREE.Mesh(stomachGeom, getMat("stomach", materials.secondary));
      stomachMesh.rotation.z = Math.PI / 1.3;
      stomachMesh.position.set(-0.7, 0.6, 0.3);
      stomachMesh.userData = { subOrganId: "stomach", name: "Gastric Rugae & Stomach" };

      // Gallbladder
      const gbGeom = new THREE.SphereGeometry(0.3, 16, 16);
      const gbMesh = new THREE.Mesh(gbGeom, getMat("gallbladder_biliary", materials.accent));
      gbMesh.scale.set(0.6, 1.2, 0.6);
      gbMesh.position.set(0.6, 0.4, 0.7);
      gbMesh.userData = { subOrganId: "gallbladder_biliary", name: "Gallbladder & Cystic Duct" };

      // Intestines
      const intCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.6, 0.3),
        new THREE.Vector3(-0.8, -1.2, 0.3),
        new THREE.Vector3(0.8, -1.8, 0.3),
        new THREE.Vector3(-0.6, -2.4, 0.3),
        new THREE.Vector3(0.5, -2.8, 0.2),
      ]);
      const intGeom = new THREE.TubeGeometry(intCurve, 64, 0.28, 16, false);
      const intMesh = new THREE.Mesh(intGeom, getMat("intestines", materials.secondary));
      intMesh.userData = { subOrganId: "intestines", name: "Small & Large Intestines" };

      giGroup.add(liverMesh, stomachMesh, gbMesh, intMesh);
      root.add(giGroup);

      subOrganMetas.push(
        {
          subOrganId: "stomach",
          name: "Gastric Rugae & Acid Secretion",
          focusTarget: [-0.7, 0.6, 0.3],
          cameraOffset: [-0.7, 0.6, 3.4],
        },
        {
          subOrganId: "liver_hepatic",
          name: "Hepatic Lobules & Bile Synthesis",
          focusTarget: [0.8, 1.0, 0],
          cameraOffset: [0.8, 1.0, 3.6],
        },
        {
          subOrganId: "gallbladder_biliary",
          name: "Gallbladder & Cystic Duct",
          focusTarget: [0.6, 0.4, 0.7],
          cameraOffset: [0.6, 0.4, 2.4],
        },
        {
          subOrganId: "intestines",
          name: "Small & Large Intestine (Microbiome)",
          focusTarget: [0, -1.8, 0.3],
          cameraOffset: [0, -1.8, 4.2],
        }
      );
      break;
    }

    case "skeletal": {
      // Cranium, Ribcage, Spine, Pelvis
      const skelGroup = new THREE.Group();
      
      // Cranium
      const skullGeom = new THREE.SphereGeometry(1.0, 24, 24);
      const skullMesh = new THREE.Mesh(skullGeom, getMat("axial_skeleton", materials.primary));
      skullMesh.position.set(0, 2.6, 0);
      skullMesh.scale.set(0.85, 1.0, 0.95);
      skullMesh.userData = { subOrganId: "axial_skeleton", name: "Cranium & Axial Bones" };

      // Spine column
      const spineCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.8, -0.2),
        new THREE.Vector3(0, 0.4, 0.1),
        new THREE.Vector3(0, -1.4, -0.1),
        new THREE.Vector3(0, -2.4, 0.1),
      ]);
      const spineGeom = new THREE.TubeGeometry(spineCurve, 32, 0.18, 12, false);
      const spineMesh = new THREE.Mesh(spineGeom, getMat("axial_skeleton", materials.primary));
      spineMesh.userData = { subOrganId: "axial_skeleton", name: "Vertebral Column" };

      // Ribcage basket
      for (let i = 0; i < 6; i++) {
        const ribY = 1.4 - i * 0.4;
        const ribGeom = new THREE.TorusGeometry(1.2 - i * 0.08, 0.08, 12, 24, Math.PI * 1.6);
        const rib = new THREE.Mesh(ribGeom, getMat("axial_skeleton", materials.secondary));
        rib.rotation.x = Math.PI / 2;
        rib.position.set(0, ribY, 0);
        skelGroup.add(rib);
      }

      // Synovial Joints & Cartilage
      const jointGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16);
      const joint = new THREE.Mesh(jointGeom, getMat("synovial_joints", materials.accent));
      joint.position.set(0, -1.4, 0);
      joint.userData = { subOrganId: "synovial_joints", name: "Synovial Joints & Cartilage" };

      skelGroup.add(skullMesh, spineMesh, joint);
      root.add(skelGroup);

      subOrganMetas.push(
        {
          subOrganId: "axial_skeleton",
          name: "Cranium & Vertebral Column",
          focusTarget: [0, 1.0, 0],
          cameraOffset: [0, 1.0, 4.8],
        },
        {
          subOrganId: "synovial_joints",
          name: "Synovial Joints & Cartilage",
          focusTarget: [0, -1.4, 0],
          cameraOffset: [0, -1.4, 3.2],
        }
      );
      break;
    }

    default: {
      // Universal Modular Fallback Body Geometry
      const genericGroup = new THREE.Group();
      const coreGeom = new THREE.CapsuleGeometry(1.1, 2.2, 24, 32);
      const coreMesh = new THREE.Mesh(coreGeom, materials.primary);
      coreMesh.userData = { subOrganId: "primary_organ", name: "Primary Anatomical Structure" };
      genericGroup.add(coreMesh);
      root.add(genericGroup);

      subOrganMetas.push({
        subOrganId: "primary_organ",
        name: "Primary Anatomical Structure",
        focusTarget: [0, 0, 0],
        cameraOffset: [0, 0, 4.5],
      });
      break;
    }
  }

  return { group: root, subOrganMetas, animatables };
}
