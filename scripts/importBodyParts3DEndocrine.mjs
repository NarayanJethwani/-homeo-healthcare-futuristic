/**
 * Combines source-mapped BodyParts3D v4.0 pituitary, pineal, adrenal, and
 * pancreatic OBJ surfaces into a shared-coordinate endocrine reference GLB.
 * Thyroid and parathyroid structures are intentionally excluded because the
 * selected source release does not provide verified meshes for them.
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
const outputPath = process.argv[3] ?? "public/models/anatomy/endocrine/endocrine_glands_bodyparts3d_v4.glb";

if (!sourceDir) {
  throw new Error("Usage: node scripts/importBodyParts3DEndocrine.mjs <OBJ directory> [output.glb]");
}

const groups = [
  {
    id: "pituitary_gland",
    name: "Pituitary Gland",
    ontologyId: "FMA:13889",
    representationId: "BP6711",
    color: 0xc96b85,
    files: ["FJ1796"],
  },
  {
    id: "pineal_body",
    name: "Pineal Body",
    ontologyId: "FMA:62033",
    representationId: "BP6698",
    color: 0xb8689a,
    files: ["FJ1795"],
  },
  {
    id: "adrenal_gland_left",
    name: "Left Adrenal Gland",
    ontologyId: "FMA:15630",
    representationId: "BP10100",
    color: 0xd18a46,
    files: ["FJ3129"],
  },
  {
    id: "adrenal_gland_right",
    name: "Right Adrenal Gland",
    ontologyId: "FMA:15629",
    representationId: "BP10161",
    color: 0xd8954d,
    files: ["FJ3130"],
  },
  {
    id: "pancreas_endocrine",
    name: "Pancreas",
    ontologyId: "FMA:7198",
    representationId: "BP9653",
    color: 0xd7a66d,
    files: ["FJ1895", "FJ1896", "FJ2629", "FJ2630"],
  },
];

const root = new THREE.Group();
root.name = "BodyParts3D_Endocrine_Collection";
root.userData = {
  anatomicalName: "Endocrine Gland Collection",
  ontologyId: "FMA:9668",
  representationId: "BP9654",
  sourceVersion: "BodyParts3D 4.0 PART-OF tree, 99% polygon reduction",
  scopeNote: "Application collection; thyroid and parathyroid meshes are not included.",
};

const loader = new OBJLoader();
let meshCount = 0;

for (const groupDefinition of groups) {
  const material = new THREE.MeshStandardMaterial({
    name: `${groupDefinition.id}_display`,
    color: groupDefinition.color,
    roughness: 0.58,
    metalness: 0,
  });

  for (const fileId of groupDefinition.files) {
    const parsed = loader.parse(fs.readFileSync(path.join(sourceDir, `${fileId}.obj`), "utf8"));
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

if (meshCount !== 8) throw new Error(`Expected 8 source meshes but imported ${meshCount}.`);

const exporter = new GLTFExporter();
const buffer = await new Promise((resolve, reject) => {
  exporter.parse(root, resolve, reject, { binary: true, onlyVisible: true });
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(buffer));
console.log(`Imported BodyParts3D endocrine collection: ${outputPath} (${meshCount} meshes, ${Buffer.byteLength(buffer)} bytes)`);
