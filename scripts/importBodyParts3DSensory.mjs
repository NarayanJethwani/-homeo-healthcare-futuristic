/**
 * Combines 22 ocular surfaces and one bilateral external-ear surface from
 * BodyParts3D v4.0 in shared source coordinates. Exact IS-A memberships are
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
const outputPath = process.argv[4] ?? "public/models/anatomy/sensory/ocular_external_ear_bodyparts3d_v4.glb";

if (!sourceDir || !elementTablePath) {
  throw new Error("Usage: node scripts/importBodyParts3DSensory.mjs <OBJ directory> <isa_element_parts.txt> [output.glb]");
}

const rows = fs.readFileSync(elementTablePath, "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split("\t"));

const ocular = [
  ["anterior_chamber_right", "Anterior Chamber of Right Eyeball", "FJ1332", "FMA58081", "FMA:58081", "BP6492", 0x9ecfd6, 0.22, true],
  ["anterior_chamber_left", "Anterior Chamber of Left Eyeball", "FJ1282", "FMA58082", "FMA:58082", "BP6493", 0x9ecfd6, 0.22, true],
  ["iris_right", "Right Iris", "FJ1348", "FMA58236", "FMA:58236", "BP5519", 0x557a69, 0.7, false],
  ["iris_left", "Left Iris", "FJ1297", "FMA58237", "FMA:58237", "BP5520", 0x557a69, 0.7, false],
  ["cornea_right", "Right Cornea", "FJ1340", "FMA58239", "FMA:58239", "BP6522", 0xc8e8ee, 0.12, true],
  ["cornea_left", "Left Cornea", "FJ1289", "FMA58240", "FMA:58240", "BP6523", 0xc8e8ee, 0.12, true],
  ["lens_right", "Right Lens", "FJ1356", "FMA58242", "FMA:58242", "BP6530", 0xe6dfc0, 0.25, true],
  ["lens_left", "Left Lens", "FJ1305", "FMA58243", "FMA:58243", "BP6529", 0xe6dfc0, 0.25, true],
  ["sclera_right", "Right Sclera", "FJ1368", "FMA58271", "FMA:58271", "BP6519", 0xe8e4da, 0.78, false],
  ["sclera_left", "Left Sclera", "FJ1317", "FMA58272", "FMA:58272", "BP6520", 0xe8e4da, 0.78, false],
  ["choroid_right_1", "Right Choroid", "FJ1336", "FMA58299", "FMA:58299", "BP5522", 0x713949, 0.7, false],
  ["choroid_right_2", "Right Choroid", "FJ1337", "FMA58299", "FMA:58299", "BP5522", 0x713949, 0.7, false],
  ["choroid_left_1", "Left Choroid", "FJ1285", "FMA58300", "FMA:58300", "BP5523", 0x713949, 0.7, false],
  ["choroid_left_2", "Left Choroid", "FJ1286", "FMA58300", "FMA:58300", "BP5523", 0x713949, 0.7, false],
  ["corona_ciliaris_right", "Right Corona Ciliaris", "FJ1338", "FMA58483", "FMA:58483", "BP5504", 0x805563, 0.68, false],
  ["corona_ciliaris_left", "Left Corona Ciliaris", "FJ1287", "FMA58484", "FMA:58484", "BP5505", 0x805563, 0.68, false],
  ["retina_right", "Optic Part of Right Retina", "FJ1367", "FMA58607", "FMA:58607", "BP5500", 0xd69a63, 0.72, false],
  ["retina_left", "Optic Part of Left Retina", "FJ1316", "FMA58608", "FMA:58608", "BP5501", 0xd69a63, 0.72, false],
  ["optic_nerve_right_1", "Right Optic Nerve", "FJ1364", "FMA50875", "FMA:50875", "BP5708", 0xe2c67b, 0.75, false],
  ["optic_nerve_right_2", "Right Optic Nerve", "FJ1819", "FMA50875", "FMA:50875", "BP5708", 0xe2c67b, 0.75, false],
  ["optic_nerve_left_1", "Left Optic Nerve", "FJ1313", "FMA50878", "FMA:50878", "BP5709", 0xe2c67b, 0.75, false],
  ["optic_nerve_left_2", "Left Optic Nerve", "FJ1772", "FMA50878", "FMA:50878", "BP5709", 0xe2c67b, 0.75, false],
];

const definitions = [
  ...ocular.map(([sourceId, name, fileId, conceptId, ontologyId, representationId, color, roughness, transparent]) => ({
    structureId: "ocular_structures", sourceId, name, fileId, conceptId, ontologyId, representationId, color, roughness, transparent,
  })),
  {
    structureId: "external_ears",
    sourceId: "external_ears",
    name: "External Ears",
    fileId: "FJ2811",
    conceptId: "FMA52781",
    ontologyId: "FMA:52781",
    representationId: "BP9255",
    color: 0xc9866b,
    roughness: 0.82,
    transparent: false,
  },
];

const root = new THREE.Group();
root.name = "BodyParts3D_Sensory_Collection";
root.userData = {
  anatomicalName: "Ocular Structures and External Ears",
  sourceVersion: "BodyParts3D 4.0 IS-A tree, 99% polygon reduction",
  coverageNote: "Inner-ear, organ-of-Corti, and olfactory structures are not represented.",
};

const loader = new OBJLoader();
let sourceVertexCount = 0;
let indexedVertexCount = 0;
let triangleCount = 0;

for (const definition of definitions) {
  const isVerified = rows.some(
    ([conceptId, , fileId]) => conceptId === definition.conceptId && fileId === definition.fileId,
  );
  if (!isVerified) {
    throw new Error(`${definition.sourceId}: ${definition.fileId} is not mapped to ${definition.conceptId} in the official IS-A table.`);
  }

  const parsed = loader.parse(fs.readFileSync(path.join(sourceDir, `${definition.fileId}.obj`), "utf8"));
  const sourceMeshes = [];
  parsed.traverse((child) => {
    if (child.isMesh) sourceMeshes.push(child);
  });
  if (sourceMeshes.length !== 1) {
    throw new Error(`${definition.sourceId}: expected one source mesh but found ${sourceMeshes.length}.`);
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
      name: `${definition.sourceId}_display`,
      color: definition.color,
      roughness: definition.roughness,
      metalness: 0,
      transparent: definition.transparent,
      opacity: definition.transparent ? 0.42 : 1,
      side: THREE.DoubleSide,
      depthWrite: !definition.transparent,
    }),
  );
  mesh.name = `BodyParts3D_${definition.structureId}_${definition.sourceId}_${definition.fileId}`;
  mesh.userData = {
    structureId: definition.structureId,
    sourceStructureId: definition.sourceId,
    anatomicalName: definition.name,
    ontologyId: definition.ontologyId,
    representationId: definition.representationId,
    sourceFileId: definition.fileId,
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
  `Imported BodyParts3D sensory collection: ${outputPath} ` +
  `(${definitions.length} meshes, ${sourceVertexCount} source face vertices, ` +
  `${indexedVertexCount} indexed vertices, ${triangleCount} triangles, ${Buffer.byteLength(buffer)} bytes)`,
);
