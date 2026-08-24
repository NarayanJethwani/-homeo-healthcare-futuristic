/**
 * Combines the 147 BodyParts3D v4.0 elementary OBJ surfaces mapped to the
 * alimentary system (FMA7152) into a source-preserving system reference GLB.
 * Group membership follows the official PART-OF element table; shared source
 * coordinates and geometry are retained.
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
const outputPath = process.argv[4] ?? "public/models/anatomy/digestive/alimentary_system_bodyparts3d_v4.glb";

if (!sourceDir || !elementTablePath) {
  throw new Error("Usage: node scripts/importBodyParts3DAlimentary.mjs <OBJ directory> <partof_element_parts.txt> [output.glb]");
}

const rows = fs.readFileSync(elementTablePath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split("\t"));

function filesForConcept(conceptId) {
  return new Set(rows.filter(([id]) => id === conceptId).map(([, , fileId]) => fileId));
}

const alimentaryFiles = filesForConcept("FMA7152");
const sourceGroups = [
  {
    id: "mouth",
    name: "Mouth and Oral Structures",
    ontologyId: "FMA:49184",
    representationId: "BP9620",
    conceptIds: ["FMA49184"],
    expectedCount: 11,
    color: 0xc76f67,
  },
  {
    id: "esophagus",
    name: "Esophagus",
    ontologyId: "FMA:7131",
    representationId: "BP10206",
    conceptIds: ["FMA7131"],
    expectedCount: 1,
    color: 0xb95f55,
  },
  {
    id: "stomach",
    name: "Stomach",
    ontologyId: "FMA:7148",
    representationId: "BP9480",
    conceptIds: ["FMA7148"],
    expectedCount: 1,
    color: 0xa83b32,
  },
  {
    id: "large_intestine",
    name: "Large Intestine and Mesocolon",
    ontologyId: "FMA:7201",
    representationId: "BP9747",
    conceptIds: ["FMA7201", "FMA14542", "FMA16549", "FMA14647"],
    expectedCount: 11,
    color: 0xa85c3c,
  },
  {
    id: "small_intestine",
    name: "Small Intestine and Mesentery",
    ontologyId: "FMA:7200",
    representationId: "BP9352",
    conceptIds: ["FMA7200", "FMA14643"],
    expectedCount: 56,
    color: 0xc98652,
  },
  {
    id: "liver",
    name: "Liver",
    ontologyId: "FMA:7197",
    representationId: "BP9334",
    conceptIds: ["FMA7197"],
    expectedCount: 60,
    color: 0x8f332e,
  },
  {
    id: "gallbladder",
    name: "Gallbladder and Extrahepatic Ducts",
    ontologyId: "FMA:7202",
    representationId: "BP10105",
    conceptIds: ["FMA7202", "FMA14668", "FMA14539"],
    expectedCount: 3,
    color: 0x6f8f3b,
  },
  {
    id: "pancreas",
    name: "Pancreas",
    ontologyId: "FMA:7198",
    representationId: "BP9653",
    conceptIds: ["FMA7198"],
    expectedCount: 4,
    color: 0xd6a15f,
  },
];

const assignedFiles = new Set();
const groups = sourceGroups.map((definition) => {
  const candidates = new Set(definition.conceptIds.flatMap((id) => [...filesForConcept(id)]));
  const files = [...candidates]
    .filter((fileId) => alimentaryFiles.has(fileId) && !assignedFiles.has(fileId))
    .sort();
  files.forEach((fileId) => assignedFiles.add(fileId));
  if (files.length !== definition.expectedCount) {
    throw new Error(`${definition.id}: expected ${definition.expectedCount} source files but found ${files.length}.`);
  }
  return { ...definition, files };
});

if (alimentaryFiles.size !== 147 || assignedFiles.size !== alimentaryFiles.size) {
  throw new Error(`Expected complete coverage of 147 alimentary source files; mapped ${assignedFiles.size} of ${alimentaryFiles.size}.`);
}

const root = new THREE.Group();
root.name = "BodyParts3D_Alimentary_System_FMA7152";
root.userData = {
  anatomicalName: "Alimentary System",
  ontologyId: "FMA:7152",
  representationId: "BP9331",
  sourceVersion: "BodyParts3D 4.0 PART-OF tree, 99% polygon reduction",
};

const loader = new OBJLoader();
let meshCount = 0;

for (const groupDefinition of groups) {
  const material = new THREE.MeshStandardMaterial({
    name: `${groupDefinition.id}_display`,
    color: groupDefinition.color,
    roughness: 0.64,
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

if (meshCount !== 147) throw new Error(`Expected 147 source meshes but imported ${meshCount}.`);

const exporter = new GLTFExporter();
const buffer = await new Promise((resolve, reject) => {
  exporter.parse(root, resolve, reject, { binary: true, onlyVisible: true });
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(buffer));
console.log(`Imported BodyParts3D alimentary system: ${outputPath} (${meshCount} meshes, ${Buffer.byteLength(buffer)} bytes)`);
