/**
 * Combines 275 BodyParts3D v4.0 elementary OBJ surfaces into a
 * source-preserving whole-skeleton GLB: 138 axial/girdle surfaces plus 77
 * upper-limb and 60 lower-limb bone surfaces.
 * Region membership follows the official PART-OF element table; shared source
 * coordinates and geometry are not altered.
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
const elementTablePath = process.argv[3];
const outputPath = process.argv[4] ?? "public/models/anatomy/skeletal/whole_skeleton_bodyparts3d_v4.glb";

if (!sourceDir || !elementTablePath) {
  throw new Error("Usage: node scripts/importBodyParts3DSkeleton.mjs <OBJ directory> <partof_element_parts.txt> [output.glb]");
}

const rows = fs.readFileSync(elementTablePath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split("\t"));

function filesForConcept(conceptId) {
  return new Set(rows.filter(([id]) => id === conceptId).map(([, , fileId]) => fileId));
}

const axialFiles = filesForConcept("FMA23881");
const upperLimbFiles = new Set([
  ...filesForConcept("FMA24880"),
  ...filesForConcept("FMA24881"),
]);
const lowerLimbFiles = new Set([
  ...filesForConcept("FMA24882"),
  ...filesForConcept("FMA24883"),
]);
const skeletalFiles = new Set([...axialFiles, ...upperLimbFiles, ...lowerLimbFiles]);
const sourceGroups = [
  {
    id: "skull",
    name: "Skull",
    ontologyId: "FMA:46565",
    representationId: "BP9486",
    conceptIds: ["FMA46565"],
    expectedCount: 43,
    color: 0xd9d1bf,
  },
  {
    id: "vertebral_column",
    name: "Vertebral Column",
    ontologyId: "FMA:13478",
    representationId: "BP9340",
    conceptIds: ["FMA13478"],
    expectedCount: 48,
    color: 0xcfc5ae,
  },
  {
    id: "rib_cage",
    name: "Rib Cage and Sternum",
    ontologyId: "FMA:7480",
    representationId: "BP9393",
    conceptIds: ["FMA7480"],
    expectedCount: 41,
    color: 0xe1d9c8,
  },
  {
    id: "pelvic_skeleton",
    name: "Pelvic Skeleton",
    ontologyId: "FMA:72062",
    representationId: "BP9952",
    conceptIds: ["FMA72062"],
    expectedCount: 2,
    color: 0xc8bda5,
  },
  {
    id: "pectoral_girdles",
    name: "Pectoral Girdles",
    ontologyId: "FMA:24163",
    representationId: "BP10147",
    conceptIds: ["FMA24163", "FMA24164"],
    expectedCount: 4,
    color: 0xd4cab5,
  },
  {
    id: "upper_limbs",
    name: "Upper Limb Skeleton",
    ontologyId: "FMA:24880/FMA:24881",
    representationId: "BP9410/BP9440",
    conceptIds: ["FMA24880", "FMA24881"],
    expectedCount: 77,
    color: 0xd8cfbb,
  },
  {
    id: "lower_limbs",
    name: "Lower Limb Skeleton",
    ontologyId: "FMA:24882/FMA:24883",
    representationId: "BP9466/BP9295",
    conceptIds: ["FMA24882", "FMA24883"],
    expectedCount: 60,
    color: 0xcfc4ae,
  },
];

const assignedFiles = new Set();
const groups = sourceGroups.map((definition) => {
  const candidates = new Set(definition.conceptIds.flatMap((id) => [...filesForConcept(id)]));
  const files = [...candidates]
    .filter((fileId) => skeletalFiles.has(fileId) && !assignedFiles.has(fileId))
    .sort();
  files.forEach((fileId) => assignedFiles.add(fileId));
  if (files.length !== definition.expectedCount) {
    throw new Error(`${definition.id}: expected ${definition.expectedCount} source files but found ${files.length}.`);
  }
  return { ...definition, files };
});

if (
  axialFiles.size !== 138 ||
  upperLimbFiles.size !== 77 ||
  lowerLimbFiles.size !== 60 ||
  skeletalFiles.size !== 275 ||
  assignedFiles.size !== skeletalFiles.size
) {
  throw new Error(`Expected complete coverage of 275 skeletal source files; mapped ${assignedFiles.size} of ${skeletalFiles.size}.`);
}

const root = new THREE.Group();
root.name = "BodyParts3D_Whole_Skeleton_Axial_Appendicular";
root.userData = {
  anatomicalName: "Whole Skeleton — Axial and Appendicular",
  ontologyId: "FMA:23881/FMA:24880/FMA:24881/FMA:24882/FMA:24883",
  representationId: "BP9343/BP9410/BP9440/BP9466/BP9295",
  sourceVersion: "BodyParts3D 4.0 PART-OF tree, 99% polygon reduction",
};

const loader = new OBJLoader();
let meshCount = 0;

for (const groupDefinition of groups) {
  const material = new THREE.MeshStandardMaterial({
    name: `${groupDefinition.id}_display`,
    color: groupDefinition.color,
    roughness: 0.68,
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

if (meshCount !== 275) throw new Error(`Expected 275 source meshes but imported ${meshCount}.`);

const exporter = new GLTFExporter();
const buffer = await new Promise((resolve, reject) => {
  exporter.parse(root, resolve, reject, { binary: true, onlyVisible: true });
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(buffer));
console.log(`Imported BodyParts3D whole skeleton: ${outputPath} (${meshCount} meshes, ${Buffer.byteLength(buffer)} bytes)`);
