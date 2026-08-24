/**
 * Converts the BodyParts3D v4.0 stomach OBJ (FJ2564 / BP9480 / FMA7148)
 * into the GLB consumed by the anatomy viewer. Geometry is preserved; this
 * script only assigns stable metadata and a neutral PBR display material.
 *
 * The source OBJ embeds a CC BY-SA 2.1 Japan notice. Preserve attribution and
 * share-alike terms for this derived GLB even though the current database page
 * advertises CC BY 4.0 for the database as a whole.
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

const sourcePath = process.argv[2];
const outputPath = process.argv[3] ?? "public/models/anatomy/digestive/stomach_bodyparts3d_v4.glb";

if (!sourcePath) {
  throw new Error("Usage: node scripts/importBodyParts3DStomach.mjs <FJ2564.obj> [output.glb]");
}

const source = fs.readFileSync(sourcePath, "utf8");
const parsed = new OBJLoader().parse(source);
const root = new THREE.Group();
root.name = "BodyParts3D_Stomach_FMA7148";
root.userData = {
  structureId: "stomach",
  anatomicalName: "Stomach",
  ontologyId: "FMA:7148",
  representationId: "BP9480",
  sourceFileId: "FJ2564",
};

const material = new THREE.MeshStandardMaterial({
  name: "Stomach_Tissue_Display",
  color: 0xa83b32,
  roughness: 0.58,
  metalness: 0,
});

let meshCount = 0;
parsed.traverse((child) => {
  if (!child.isMesh) return;
  meshCount += 1;
  child.name = meshCount === 1 ? "BodyParts3D_Stomach" : `BodyParts3D_Stomach_${meshCount}`;
  child.material = material;
  child.userData = { ...root.userData };
  if (!child.geometry.attributes.normal) child.geometry.computeVertexNormals();
  root.add(child.clone());
});

if (meshCount === 0) throw new Error("The source OBJ did not contain a mesh.");

const exporter = new GLTFExporter();
const buffer = await new Promise((resolve, reject) => {
  exporter.parse(root, resolve, reject, { binary: true, onlyVisible: true });
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(buffer));
console.log(`Imported BodyParts3D stomach: ${outputPath} (${Buffer.byteLength(buffer)} bytes)`);
