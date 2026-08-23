/**
 * Combines the BodyParts3D v4.0 spleen and bilateral thymic-lobe OBJ
 * surfaces into a shared-coordinate lymphoid-organ reference GLB. Official
 * IS-A memberships are verified before import. Repeated face vertices are
 * welded into indexed geometry; no triangles are removed.
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
const outputPath = process.argv[4] ?? "public/models/anatomy/lymphatic/lymphoid_organs_bodyparts3d_v4.glb";

if (!sourceDir || !elementTablePath) {
  throw new Error("Usage: node scripts/importBodyParts3DLymphoid.mjs <OBJ directory> <isa_element_parts.txt> [output.glb]");
}

const rows = fs.readFileSync(elementTablePath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split("\t"));

const structures = [
  {
    id: "spleen",
    name: "Spleen",
    fileId: "FJ2561",
    conceptId: "FMA7196",
    ontologyId: "FMA:7196",
    representationId: "BP8804",
    color: 0x7f2638,
  },
  {
    id: "thymus_left_lobe",
    name: "Left Lobe of Thymus",
    fileId: "FJ3150",
    conceptId: "FMA71195",
    ontologyId: "FMA:71195",
    representationId: "BP8666",
    color: 0xd98a91,
  },
  {
    id: "thymus_right_lobe",
    name: "Right Lobe of Thymus",
    fileId: "FJ3151",
    conceptId: "FMA71194",
    ontologyId: "FMA:71194",
    representationId: "BP9220",
    color: 0xcf7881,
  },
];

for (const structure of structures) {
  const isVerified = rows.some(
    ([conceptId, , fileId]) => conceptId === structure.conceptId && fileId === structure.fileId,
  );
  if (!isVerified) {
    throw new Error(`${structure.id}: ${structure.fileId} is not mapped to ${structure.conceptId} in the official IS-A table.`);
  }
}

const root = new THREE.Group();
root.name = "BodyParts3D_Lymphoid_Organ_Collection";
root.userData = {
  anatomicalName: "Spleen and Thymus",
  sourceVersion: "BodyParts3D 4.0 IS-A tree, 99% polygon reduction",
  coverageNote: "Lymph-node chains and lymphatic vessels are not represented in this asset.",
};

const loader = new OBJLoader();
let sourceVertexCount = 0;
let indexedVertexCount = 0;
let triangleCount = 0;

for (const structure of structures) {
  const sourcePath = path.join(sourceDir, `${structure.fileId}.obj`);
  const parsed = loader.parse(fs.readFileSync(sourcePath, "utf8"));
  const sourceMeshes = [];
  parsed.traverse((child) => {
    if (child.isMesh) sourceMeshes.push(child);
  });
  if (sourceMeshes.length !== 1) {
    throw new Error(`${structure.id}: expected one source mesh but found ${sourceMeshes.length}.`);
  }

  const sourceMesh = sourceMeshes[0];
  sourceVertexCount += sourceMesh.geometry.attributes.position.count;
  const positionOnlyGeometry = new THREE.BufferGeometry();
  positionOnlyGeometry.setAttribute("position", sourceMesh.geometry.attributes.position.clone());
  const indexedGeometry = mergeVertices(positionOnlyGeometry, 1e-6);
  indexedGeometry.computeVertexNormals();
  indexedGeometry.computeBoundingBox();
  indexedGeometry.computeBoundingSphere();
  indexedVertexCount += indexedGeometry.attributes.position.count;
  triangleCount += indexedGeometry.index.count / 3;

  const mesh = new THREE.Mesh(
    indexedGeometry,
    new THREE.MeshStandardMaterial({
      name: `${structure.id}_display`,
      color: structure.color,
      roughness: 0.68,
      metalness: 0,
    }),
  );
  mesh.name = `BodyParts3D_${structure.id}_${structure.fileId}`;
  mesh.userData = {
    structureId: structure.id,
    anatomicalName: structure.name,
    ontologyId: structure.ontologyId,
    representationId: structure.representationId,
    sourceFileId: structure.fileId,
  };
  root.add(mesh);
}

const exporter = new GLTFExporter();
const buffer = await new Promise((resolve, reject) => {
  exporter.parse(root, resolve, reject, { binary: true, onlyVisible: true });
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(buffer));
console.log(
  `Imported BodyParts3D lymphoid organs: ${outputPath} ` +
  `(3 meshes, ${sourceVertexCount} source face vertices, ${indexedVertexCount} indexed vertices, ` +
  `${triangleCount} triangles, ${Buffer.byteLength(buffer)} bytes)`,
);
