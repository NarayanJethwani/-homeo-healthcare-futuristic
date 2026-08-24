/**
 * Combines the BodyParts3D v4.0 whole-skin surface and three modeled hair
 * appendages in shared source coordinates. Exact IS-A memberships are
 * verified before import. Repeated face vertices are welded into indexed
 * geometry; no triangles are removed.
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
const outputPath = process.argv[4] ?? "public/models/anatomy/integumentary/skin_hair_bodyparts3d_v4.glb";

if (!sourceDir || !elementTablePath) {
  throw new Error("Usage: node scripts/importBodyParts3DIntegumentary.mjs <OBJ directory> <isa_element_parts.txt> [output.glb]");
}

const rows = fs.readFileSync(elementTablePath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split("\t"));

const structures = [
  {
    id: "skin_surface",
    sourceId: "skin",
    name: "Skin",
    fileId: "FJ2810",
    conceptId: "FMA7163",
    ontologyId: "FMA:7163",
    representationId: "BP9115",
    color: 0xc9866b,
    roughness: 0.82,
  },
  {
    id: "hair_appendages",
    sourceId: "eyebrow",
    name: "Eyebrow",
    fileId: "FJ2812",
    conceptId: "FMA54237",
    ontologyId: "FMA:54237",
    representationId: "BP8954",
    color: 0x493127,
    roughness: 0.76,
  },
  {
    id: "hair_appendages",
    sourceId: "hair_of_head",
    name: "Hair of Head",
    fileId: "FJ2813",
    conceptId: "FMA54241",
    ontologyId: "FMA:54241",
    representationId: "BP8565",
    color: 0x35251f,
    roughness: 0.74,
  },
  {
    id: "hair_appendages",
    sourceId: "pubic_hair",
    name: "Pubic Hair",
    fileId: "FJ2815",
    conceptId: "FMA54319",
    ontologyId: "FMA:54319",
    representationId: "BP8350",
    color: 0x3d2a22,
    roughness: 0.76,
  },
];

const root = new THREE.Group();
root.name = "BodyParts3D_Integumentary_Collection";
root.userData = {
  anatomicalName: "Skin and Modeled Hair Appendages",
  sourceVersion: "BodyParts3D 4.0 IS-A tree, 99% polygon reduction",
  coverageNote: "Microscopic skin layers, glands, follicles, and nails are not separately represented.",
};

const loader = new OBJLoader();
let sourceVertexCount = 0;
let indexedVertexCount = 0;
let triangleCount = 0;

for (const structure of structures) {
  const isVerified = rows.some(
    ([conceptId, , fileId]) => conceptId === structure.conceptId && fileId === structure.fileId,
  );
  if (!isVerified) {
    throw new Error(`${structure.sourceId}: ${structure.fileId} is not mapped to ${structure.conceptId} in the official IS-A table.`);
  }

  const parsed = loader.parse(fs.readFileSync(path.join(sourceDir, `${structure.fileId}.obj`), "utf8"));
  const sourceMeshes = [];
  parsed.traverse((child) => {
    if (child.isMesh) sourceMeshes.push(child);
  });
  if (sourceMeshes.length !== 1) {
    throw new Error(`${structure.sourceId}: expected one source mesh but found ${sourceMeshes.length}.`);
  }

  const sourceGeometry = sourceMeshes[0].geometry;
  sourceVertexCount += sourceGeometry.attributes.position.count;
  const positionOnlyGeometry = new THREE.BufferGeometry();
  positionOnlyGeometry.setAttribute("position", sourceGeometry.attributes.position.clone());
  const indexedGeometry = mergeVertices(positionOnlyGeometry, 1e-6);
  indexedGeometry.computeVertexNormals();
  indexedGeometry.computeBoundingBox();
  indexedGeometry.computeBoundingSphere();
  indexedVertexCount += indexedGeometry.attributes.position.count;
  triangleCount += indexedGeometry.index.count / 3;

  const mesh = new THREE.Mesh(
    indexedGeometry,
    new THREE.MeshStandardMaterial({
      name: `${structure.sourceId}_display`,
      color: structure.color,
      roughness: structure.roughness,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
  );
  mesh.name = `BodyParts3D_${structure.id}_${structure.sourceId}_${structure.fileId}`;
  mesh.userData = {
    structureId: structure.id,
    sourceStructureId: structure.sourceId,
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
  `Imported BodyParts3D integumentary collection: ${outputPath} ` +
  `(${structures.length} meshes, ${sourceVertexCount} source face vertices, ` +
  `${indexedVertexCount} indexed vertices, ${triangleCount} triangles, ${Buffer.byteLength(buffer)} bytes)`,
);
