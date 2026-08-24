/**
 * Converts the official Z-Anatomy LymphoidOrgans100 FBX into a web-ready,
 * source-preserving GLB with nine clinically useful viewer groups.
 *
 * Source hierarchy determines group membership. Empty hierarchy markers,
 * cross-section helpers, and the generic demonstration lymph node are excluded;
 * all 163 named anatomical meshes are retained without triangle simplification.
 */

import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

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

const sourcePath = process.argv[2];
const outputPath = process.argv[3] ?? "public/models/anatomy/lymphatic/lymphatic_nodes_organs_zanatomy.glb";

if (!sourcePath) {
  throw new Error("Usage: node scripts/importZAnatomyLymphatic.mjs <LymphoidOrgans100.fbx> [output.glb]");
}

const groups = [
  {
    id: "head_neck_nodes",
    name: "Head and Neck Lymph Nodes",
    expectedCount: 42,
    color: 0x65b891,
    matches: (hierarchy) => hierarchy.includes("Lymph_nodes_of_headg") || hierarchy.includes("Lymph_nodes_of_neckg"),
  },
  {
    id: "thoracic_nodes",
    name: "Thoracic Lymph Nodes",
    expectedCount: 16,
    color: 0x56a67f,
    matches: (hierarchy) => hierarchy.includes("Thoracic_lymph_nodesg"),
  },
  {
    id: "abdominal_nodes",
    name: "Abdominal Lymph Nodes",
    expectedCount: 32,
    color: 0x4f9b74,
    matches: (hierarchy) => hierarchy.includes("Abdominal_lymph_nodesg"),
  },
  {
    id: "pelvic_nodes",
    name: "Pelvic Lymph Nodes",
    expectedCount: 28,
    color: 0x438d68,
    matches: (hierarchy) => hierarchy.includes("Pelvic_lymph_nodesg"),
  },
  {
    id: "upper_limb_nodes",
    name: "Upper Limb Lymph Nodes",
    expectedCount: 20,
    color: 0x72c39c,
    matches: (hierarchy) => hierarchy.includes("Lymph_nodes_of_upper_limbg"),
  },
  {
    id: "lower_limb_nodes",
    name: "Lower Limb Lymph Nodes",
    expectedCount: 20,
    color: 0x7ac9a5,
    matches: (hierarchy) => hierarchy.includes("Lymph_nodes_of_lower_limbg"),
  },
  {
    id: "spleen",
    name: "Spleen",
    expectedCount: 1,
    color: 0x7f2638,
    matches: (_hierarchy, sourceName) => sourceName === "Spleen",
  },
  {
    id: "tonsils",
    name: "Palatine Tonsils",
    expectedCount: 2,
    color: 0xc35f72,
    matches: (_hierarchy, sourceName) => sourceName.startsWith("Palatine_tonsil"),
  },
  {
    id: "thymus",
    name: "Thymus",
    expectedCount: 2,
    color: 0xd98a91,
    matches: (hierarchy) => hierarchy.includes("Thymusg"),
  },
];

const sourceBytes = fs.readFileSync(sourcePath);
const sourceBuffer = sourceBytes.buffer.slice(
  sourceBytes.byteOffset,
  sourceBytes.byteOffset + sourceBytes.byteLength,
);
const sourceRoot = new FBXLoader().parse(sourceBuffer, "");
sourceRoot.updateMatrixWorld(true);

const outputRoot = new THREE.Group();
outputRoot.name = "ZAnatomy_Lymphatic_Nodes_and_Organs";
outputRoot.userData = {
  anatomicalName: "Lymph Nodes and Lymphoid Organs",
  sourceAsset: "LymphoidOrgans100.fbx",
  sourceVersion: "Z-Anatomy PC-Version",
  coverageNote: "Lymphatic vessels, trunks, and ducts are not modeled in this source asset.",
};

const counts = Object.fromEntries(groups.map((group) => [group.id, 0]));
let meshCount = 0;
let vertexCount = 0;
let triangleCount = 0;

const sanitizeName = (value) => value.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");

sourceRoot.traverse((sourceMesh) => {
  if (!sourceMesh.isMesh) return;
  const positions = sourceMesh.geometry.attributes.position;
  if (!positions || positions.count <= 36 || sourceMesh.name.startsWith("Cross_Section")) return;

  const ancestry = [];
  let ancestor = sourceMesh;
  while (ancestor) {
    ancestry.unshift(ancestor.name || ancestor.type);
    ancestor = ancestor.parent;
  }
  const hierarchy = ancestry.join("/");
  const group = groups.find((candidate) => candidate.matches(hierarchy, sourceMesh.name));

  // This standalone mesh is a source demonstration object, not part of a
  // documented anatomical chain. It is deliberately not presented as anatomy.
  if (!group && sourceMesh.name === "Lymph_node") return;
  if (!group) throw new Error(`Unmapped anatomical source mesh: ${hierarchy}`);

  const geometry = sourceMesh.geometry.clone();
  if (!geometry.attributes.normal) geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      name: `${group.id}_display`,
      color: group.color,
      roughness: 0.68,
      metalness: 0,
    }),
  );
  mesh.name = `ZAnatomy_${group.id}_${sanitizeName(sourceMesh.name)}`;
  mesh.matrix.copy(sourceMesh.matrixWorld);
  mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
  mesh.userData = {
    structureId: group.id,
    anatomicalName: group.name,
    sourceNodeName: sourceMesh.name,
    sourceHierarchy: hierarchy,
  };
  outputRoot.add(mesh);

  counts[group.id] += 1;
  meshCount += 1;
  vertexCount += positions.count;
  triangleCount += geometry.index ? geometry.index.count / 3 : positions.count / 3;
});

for (const group of groups) {
  if (counts[group.id] !== group.expectedCount) {
    throw new Error(`${group.id}: expected ${group.expectedCount} meshes but imported ${counts[group.id]}.`);
  }
}
if (meshCount !== 163) throw new Error(`Expected 163 anatomical meshes but imported ${meshCount}.`);

const outputBuffer = await new Promise((resolve, reject) => {
  new GLTFExporter().parse(outputRoot, resolve, reject, { binary: true, onlyVisible: true });
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(outputBuffer));
console.log(
  `Imported Z-Anatomy lymphatic reference: ${outputPath} ` +
  `(${meshCount} meshes, ${vertexCount} vertices, ${triangleCount} triangles, ` +
  `${Buffer.byteLength(outputBuffer)} bytes)`,
);
console.log(counts);
