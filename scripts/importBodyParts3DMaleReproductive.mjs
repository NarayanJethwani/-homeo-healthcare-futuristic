/**
 * Combines twelve BodyParts3D v4.0 male reproductive OBJ surfaces in shared
 * source coordinates. Exact IS-A memberships are verified before import.
 * Repeated face vertices are welded into indexed geometry; no triangles are
 * removed and no anatomical parts are procedurally generated.
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
const outputPath = process.argv[4] ?? "public/models/anatomy/reproductive/male_reproductive_bodyparts3d_v4.glb";

if (!sourceDir || !elementTablePath) {
  throw new Error("Usage: node scripts/importBodyParts3DMaleReproductive.mjs <OBJ directory> <isa_element_parts.txt> [output.glb]");
}

const rows = fs.readFileSync(elementTablePath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split("\t"));

const structures = [
  ["testis_left", "Left Testis", "FJ3138", "FMA7212", "FMA:7212", "BP8578", 0xc58d75],
  ["testis_right", "Right Testis", "FJ3142", "FMA7211", "FMA:7211", "BP9204", 0xc58d75],
  ["epididymis_left", "Left Epididymis", "FJ3136", "FMA18257", "FMA:18257", "BP8772", 0xd9a983],
  ["epididymis_right", "Right Epididymis", "FJ3141", "FMA18256", "FMA:18256", "BP8141", 0xd9a983],
  ["deferent_duct_left", "Left Deferent Duct", "FJ3135", "FMA19236", "FMA:19236", "BP8796", 0xd7c0a0],
  ["deferent_duct_right", "Right Deferent Duct", "FJ3140", "FMA19235", "FMA:19235", "BP9116", 0xd7c0a0],
  ["seminal_vesicle_left", "Left Seminal Vesicle", "FJ3137", "FMA19388", "FMA:19388", "BP9064", 0xc79b67],
  ["seminal_vesicle_right", "Right Seminal Vesicle", "FJ3143", "FMA19387", "FMA:19387", "BP8530", 0xc79b67],
  ["prostate", "Prostate", "FJ3139", "FMA9600", "FMA:9600", "BP8469", 0xb37854],
  ["glans_penis", "Glans Penis", "FJ3134", "FMA18247", "FMA:18247", "BP8793", 0xbd746e],
  ["corpus_spongiosum", "Corpus Spongiosum", "FJ3133", "FMA19617", "FMA:19617", "BP8470", 0xaa625f],
  ["corpus_cavernosum", "Corpus Cavernosum", "FJ3132", "FMA19618", "FMA:19618", "BP9224", 0x95524f],
].map(([id, name, fileId, conceptId, ontologyId, representationId, color]) => ({
  id, name, fileId, conceptId, ontologyId, representationId, color,
}));

const root = new THREE.Group();
root.name = "BodyParts3D_Male_Reproductive_Collection";
root.userData = {
  anatomicalName: "Male Reproductive Structures",
  sourceVersion: "BodyParts3D 4.0 IS-A tree, 99% polygon reduction",
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
    throw new Error(`${structure.id}: ${structure.fileId} is not mapped to ${structure.conceptId} in the official IS-A table.`);
  }

  const parsed = loader.parse(fs.readFileSync(path.join(sourceDir, `${structure.fileId}.obj`), "utf8"));
  const sourceMeshes = [];
  parsed.traverse((child) => {
    if (child.isMesh) sourceMeshes.push(child);
  });
  if (sourceMeshes.length !== 1) {
    throw new Error(`${structure.id}: expected one source mesh but found ${sourceMeshes.length}.`);
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
      name: `${structure.id}_display`,
      color: structure.color,
      roughness: 0.7,
      metalness: 0,
    }),
  );
  mesh.name = `BodyParts3D_${structure.id}_${structure.fileId}`;
  mesh.userData = {
    structureId: "male_reproductive_organs",
    sourceStructureId: structure.id,
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
  `Imported BodyParts3D male reproductive collection: ${outputPath} ` +
  `(${structures.length} meshes, ${sourceVertexCount} source face vertices, ` +
  `${indexedVertexCount} indexed vertices, ${triangleCount} triangles, ${Buffer.byteLength(buffer)} bytes)`,
);
