/**
 * Combines the 323 BodyParts3D v4.0 OBJ surfaces classified as muscle organs
 * (FMA5022) into a shared-coordinate muscular reference GLB. Regional viewer
 * groups are derived from the official IS-A element table. Repeated face
 * vertices are welded into indexed geometry; positions are not transformed
 * and no triangles are removed.
 */

import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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
const outputPath = process.argv[4] ?? "public/models/anatomy/muscular/muscular_system_bodyparts3d_v4.glb";

if (!sourceDir || !elementTablePath) {
  throw new Error("Usage: node scripts/importBodyParts3DMuscular.mjs <OBJ directory> <isa_element_parts.txt> [output.glb]");
}

const rows = fs.readFileSync(elementTablePath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split("\t"));

function filesForConcept(conceptId) {
  return new Set(rows.filter(([id]) => id === conceptId).map(([, , fileId]) => fileId));
}

const muscleFiles = filesForConcept("FMA5022");
const sourceGroups = [
  {
    id: "head_neck_muscles",
    name: "Head and Neck Muscles",
    ontologyId: "FMA:9616",
    representationId: "BP8080",
    conceptIds: ["FMA9616", "FMA9617"],
    expectedCount: 77,
    color: 0xa94742,
  },
  {
    id: "axial_trunk_muscles",
    name: "Axial and Trunk Muscles",
    ontologyId: "FMA:58274",
    representationId: "BP8021",
    conceptIds: ["FMA9619", "FMA9620", "FMA19086", "FMA22594", "FMA58274"],
    expectedCount: 76,
    color: 0x9e3f3a,
  },
  {
    id: "upper_limb_muscles",
    name: "Upper Limb Muscles",
    ontologyId: "FMA:9621",
    representationId: "BP7787",
    conceptIds: ["FMA9621"],
    expectedCount: 78,
    color: 0xb6534b,
  },
  {
    id: "lower_limb_muscles",
    name: "Lower Limb Muscles",
    ontologyId: "FMA:9622",
    representationId: "BP7834",
    conceptIds: ["FMA9622"],
    expectedCount: 92,
    color: 0x8f3835,
  },
];

const assignedFiles = new Set();
const groups = sourceGroups.map((definition) => {
  const candidates = new Set(definition.conceptIds.flatMap((id) => [...filesForConcept(id)]));
  const files = [...candidates]
    .filter((fileId) => muscleFiles.has(fileId) && !assignedFiles.has(fileId))
    .sort();
  files.forEach((fileId) => assignedFiles.add(fileId));
  if (files.length !== definition.expectedCount) {
    throw new Error(`${definition.id}: expected ${definition.expectedCount} source files but found ${files.length}.`);
  }
  return { ...definition, files };
});

if (muscleFiles.size !== 323 || assignedFiles.size !== muscleFiles.size) {
  throw new Error(`Expected complete coverage of 323 muscle files; mapped ${assignedFiles.size} of ${muscleFiles.size}.`);
}

const root = new THREE.Group();
root.name = "BodyParts3D_Muscular_System_FMA5022";
root.userData = {
  anatomicalName: "Muscular System",
  ontologyId: "FMA:5022",
  representationId: "BP7788",
  sourceVersion: "BodyParts3D 4.0 IS-A tree, 99% polygon reduction",
};

const loader = new OBJLoader();
let meshCount = 0;
let sourceVertexCount = 0;
let indexedVertexCount = 0;
let triangleCount = 0;

for (const groupDefinition of groups) {
  const material = new THREE.MeshStandardMaterial({
    name: `${groupDefinition.id}_display`,
    color: groupDefinition.color,
    roughness: 0.66,
    metalness: 0,
  });

  for (const fileId of groupDefinition.files) {
    const parsed = loader.parse(fs.readFileSync(path.join(sourceDir, `${fileId}.obj`), "utf8"));
    parsed.traverse((child) => {
      if (!child.isMesh) return;
      meshCount += 1;
      sourceVertexCount += child.geometry.attributes.position.count;
      const positionOnlyGeometry = new THREE.BufferGeometry();
      positionOnlyGeometry.setAttribute("position", child.geometry.attributes.position.clone());
      const indexedGeometry = mergeVertices(positionOnlyGeometry, 1e-6);
      indexedGeometry.computeVertexNormals();
      indexedGeometry.computeBoundingBox();
      indexedGeometry.computeBoundingSphere();
      indexedVertexCount += indexedGeometry.attributes.position.count;
      triangleCount += indexedGeometry.index.count / 3;
      child.name = `BodyParts3D_${groupDefinition.id}_${fileId}`;
      child.material = material;
      child.geometry = indexedGeometry;
      child.userData = {
        structureId: groupDefinition.id,
        anatomicalName: groupDefinition.name,
        ontologyId: groupDefinition.ontologyId,
        representationId: groupDefinition.representationId,
        sourceFileId: fileId,
      };
      root.add(child.clone());
    });
  }
}

if (meshCount !== 323) throw new Error(`Expected 323 source meshes but imported ${meshCount}.`);

const exporter = new GLTFExporter();
const buffer = await new Promise((resolve, reject) => {
  exporter.parse(root, resolve, reject, { binary: true, onlyVisible: true });
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(buffer));
console.log(
  `Imported BodyParts3D muscular system: ${outputPath} ` +
  `(${meshCount} meshes, ${sourceVertexCount} source face vertices, ` +
  `${indexedVertexCount} indexed vertices, ${triangleCount} triangles, ${Buffer.byteLength(buffer)} bytes)`,
);
