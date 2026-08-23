/**
 * Combines the 59 BodyParts3D v4.0 elementary OBJ surfaces mapped to FMA50801
 * (brain) into one source-preserving GLB. The grouping below follows the
 * official PART-OF terminology and element tables; geometry and coordinates
 * are not altered.
 */

import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        this.onloadend?.();
        this.onload?.();
      });
    }
  };
}

const sourceDir = process.argv[2];
const outputPath = process.argv[3] ?? "public/models/anatomy/nervous/brain_bodyparts3d_v4.glb";

if (!sourceDir) {
  throw new Error("Usage: node scripts/importBodyParts3DBrain.mjs <OBJ directory> [output.glb]");
}

const groups = [
  {
    id: "cerebral_hemisphere_left",
    name: "Left Cerebral Hemisphere",
    ontologyId: "FMA:61819",
    representationId: "BP10491",
    color: 0xb97872,
    files: ["FJ1732", "FJ1739", "FJ1744", "FJ1746", "FJ1748", "FJ1750", "FJ1758", "FJ1759", "FJ1767", "FJ1783", "FJ1785", "FJ1787", "FJ1789", "FJ1791", "FJ1797", "FJ1800", "FJ1833", "FJ1835", "FJ1841"],
  },
  {
    id: "cerebral_hemisphere_right",
    name: "Right Cerebral Hemisphere",
    ontologyId: "FMA:67292",
    representationId: "BP10498",
    color: 0xc9857f,
    files: ["FJ1733", "FJ1740", "FJ1745", "FJ1747", "FJ1749", "FJ1751", "FJ1784", "FJ1786", "FJ1788", "FJ1790", "FJ1792", "FJ1798", "FJ1801", "FJ1806", "FJ1807", "FJ1814", "FJ1834", "FJ1836", "FJ1842"],
  },
  {
    id: "cerebellum",
    name: "Cerebellum",
    ontologyId: "FMA:67944",
    representationId: "BP6702",
    color: 0x9f625e,
    files: ["FJ1781", "FJ1830"],
  },
  {
    id: "brainstem",
    name: "Brainstem",
    ontologyId: "FMA:79876",
    representationId: "BP7432",
    color: 0xcaa16f,
    files: ["FJ1738", "FJ1762", "FJ1769", "FJ1770", "FJ1775", "FJ1779", "FJ1810", "FJ1817", "FJ1822", "FJ1826", "FJ1831"],
  },
  {
    id: "deep_brain_ventricles",
    name: "Deep Brain and Ventricular Structures",
    ontologyId: "FMA:50801",
    representationId: "BP6687",
    color: 0xd7b38d,
    files: ["FJ1730", "FJ1731", "FJ1743", "FJ1760", "FJ1780", "FJ1795", "FJ1808", "FJ1828"],
  },
];

const root = new THREE.Group();
root.name = "BodyParts3D_Brain_FMA50801";
root.userData = {
  anatomicalName: "Brain",
  ontologyId: "FMA:50801",
  representationId: "BP6687",
  sourceVersion: "BodyParts3D 4.0 PART-OF tree, 99% polygon reduction",
};

const loader = new OBJLoader();
let meshCount = 0;

for (const groupDefinition of groups) {
  const material = new THREE.MeshStandardMaterial({
    name: `${groupDefinition.id}_display`,
    color: groupDefinition.color,
    roughness: 0.62,
    metalness: 0,
  });

  for (const fileId of groupDefinition.files) {
    const sourcePath = path.join(sourceDir, `${fileId}.obj`);
    const parsed = loader.parse(fs.readFileSync(sourcePath, "utf8"));
    parsed.traverse((child) => {
      if (!child.isMesh) return;
      meshCount += 1;
      child.name = `BodyParts3D_${groupDefinition.id}_${fileId}`;
      child.material = material;
      child.userData = {
        structureId: groupDefinition.id,
        anatomicalName: groupDefinition.name,
        ontologyId: groupDefinition.ontologyId,
        representationId: groupDefinition.representationId,
        sourceFileId: fileId,
      };
      if (!child.geometry.attributes.normal) child.geometry.computeVertexNormals();
      root.add(child.clone());
    });
  }
}

if (meshCount !== 59) {
  throw new Error(`Expected 59 source meshes but imported ${meshCount}.`);
}

const exporter = new GLTFExporter();
const buffer = await new Promise((resolve, reject) => {
  exporter.parse(root, resolve, reject, { binary: true, onlyVisible: true });
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(buffer));
console.log(`Imported BodyParts3D brain: ${outputPath} (${meshCount} meshes, ${Buffer.byteLength(buffer)} bytes)`);
