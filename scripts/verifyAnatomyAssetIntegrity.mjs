import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "public/models/anatomy/ASSET_MANIFEST.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const failures = [];

function requireCondition(condition, message) {
  if (!condition) failures.push(message);
}

function readGlbJson(bytes, modelId) {
  try {
    const jsonChunkLength = bytes.readUInt32LE(12);
    const jsonChunkType = bytes.subarray(16, 20).toString("ascii");
    requireCondition(jsonChunkType === "JSON", `${modelId}: first GLB chunk must be JSON.`);
    return JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim());
  } catch {
    failures.push(`${modelId}: GLB JSON metadata could not be parsed.`);
    return null;
  }
}

requireCondition(manifest.status === "development-only", "Manifest must remain development-only.");
requireCondition(manifest.version === "5.5.0", "Source-only manifest must use version 5.5.0.");

const modelIds = new Set();
for (const model of manifest.models ?? []) {
  requireCondition(!modelIds.has(model.id), `${model.id}: duplicate manifest identifier.`);
  modelIds.add(model.id);
  requireCondition(model.productionEligible === false, `${model.id}: must remain blocked from production.`);
  requireCondition(model.medicalEducationUseApproved === false, `${model.id}: must not be approved for medical education.`);
  requireCondition(Boolean(model.anatomyReviewStatus), `${model.id}: anatomy review status is required.`);

  const relativeAssetPath = model.file.replace(/^\//, "");
  const absoluteAssetPath = path.join(root, "public", relativeAssetPath);
  let bytes;
  try {
    bytes = readFileSync(absoluteAssetPath);
  } catch {
    failures.push(`${model.id}: asset file is missing at ${model.file}.`);
    continue;
  }

  requireCondition(bytes.subarray(0, 4).toString("ascii") === "glTF", `${model.id}: file is not a binary GLB.`);
  const digest = createHash("sha256").update(bytes).digest("hex");
  requireCondition(digest === model.sha256, `${model.id}: SHA-256 does not match the manifest.`);
  requireCondition(statSync(absoluteAssetPath).size === model.sizeBytes, `${model.id}: byte size does not match the manifest.`);
  const glbJson = readGlbJson(bytes, model.id);
  const sourceNodeNames = new Set((glbJson?.nodes ?? []).map((node) => node.name));
  for (const structure of model.structures ?? []) {
    requireCondition(
      sourceNodeNames.has(structure.meshName),
      `${model.id}/${structure.id}: declared source mesh ${structure.meshName} is absent from the GLB.`,
    );
  }

  if (model.assetClass === "procedural-placeholder") {
    requireCondition(model.id.includes("placeholder"), `${model.id}: placeholder identifier must disclose its status.`);
    requireCondition(model.provenance?.status === "repository-generated", `${model.id}: placeholder provenance must be repository-generated.`);
    requireCondition(Boolean(model.builderFunction), `${model.id}: builder function is required.`);
    requireCondition(model.derivedFromImaging === false, `${model.id}: placeholder cannot claim imaging derivation.`);
    for (const structure of model.structures ?? []) {
      requireCondition(structure.confidence === "placeholder-label", `${model.id}/${structure.id}: placeholder confidence is invalid.`);
    }
  } else {
    requireCondition(model.provenance?.status === "source-verified", `${model.id}: reference provenance must be source-verified.`);
    requireCondition(Boolean(model.provenance?.sourcePage), `${model.id}: exact source page is required.`);
    requireCondition(Boolean(model.provenance?.sourceVersion), `${model.id}: source version is required.`);
    requireCondition(Boolean(model.provenance?.creator), `${model.id}: creator attribution is required.`);
    requireCondition(Boolean(model.provenance?.license), `${model.id}: verified license is required.`);
    requireCondition(Boolean(model.provenance?.derivation), `${model.id}: derivation record is required.`);
    for (const structure of model.structures ?? []) {
      requireCondition(
        structure.confidence === "source-defined" || structure.confidence === "metadata-mapped",
        `${model.id}/${structure.id}: source structure confidence is invalid.`,
      );
      requireCondition(Boolean(structure.terminologyId), `${model.id}/${structure.id}: terminology identifier is required.`);
    }
  }
}

const placeholders = manifest.models.filter((model) => model.assetClass === "procedural-placeholder");
const references = manifest.models.filter((model) => model.provenance?.status === "source-verified");
requireCondition(placeholders.length === 0, "No procedural placeholders may remain after the endocrine slice.");
requireCondition(references.length === 25, "Exactly twenty-five source-verified assets are expected after the sensory slice.");

const registryPath = path.join(root, "src/features/medical-academy/render/system3DRegistry.ts");
const registry = readFileSync(registryPath, "utf8");
for (const model of manifest.models) {
  if (model.provenance?.status === "source-verified") {
    requireCondition(registry.includes(`id: "${model.id}"`), `${model.id}: source asset identifier is missing from the registry.`);
  }
  requireCondition(registry.includes(`filePath: "${model.file}"`), `${model.id}: manifest path is missing from the registry.`);
}
requireCondition((registry.match(/sourceType: "procedural-placeholder",/g) ?? []).length === placeholders.length, "Registry placeholder count must match the manifest.");
requireCondition((registry.match(/provenanceStatus: "source-verified",/g) ?? []).length === references.length, "Registry source-verified count must match the manifest.");
requireCondition((registry.match(/productionEligible: false/g) ?? []).length === manifest.models.length, "Every registered asset must be blocked from production.");
requireCondition(!registry.includes("/models/anatomy/digestive/stomach.glb"), "Registry still references the retired procedural stomach.");
requireCondition(!registry.includes("/models/anatomy/digestive/liver_gallbladder.glb"), "Registry still references the retired procedural liver.");
requireCondition(!registry.includes("/models/anatomy/cardiovascular/heart_great_vessels.glb"), "Registry still references the retired procedural heart.");
requireCondition(!registry.includes("/models/anatomy/renal/kidneys_urinary.glb"), "Registry still references the retired procedural renal model.");
requireCondition(!registry.includes("/models/anatomy/nervous/brain_brainstem.glb"), "Registry still references the retired procedural brain model.");
requireCondition(!registry.includes("/models/anatomy/respiratory/lungs_airways.glb"), "Registry still references the retired procedural respiratory model.");
requireCondition(!registry.includes("/models/anatomy/skeletal/human_skeleton.glb"), "Registry still references the retired procedural skeletal model.");
requireCondition(!registry.includes("/models/anatomy/endocrine/thyroid_glands.glb"), "Registry still references the retired procedural endocrine model.");

const builder = readFileSync(path.join(root, "scripts/buildAnatomyGLBAssets.mjs"), "utf8");
const activeBuilderList = builder.slice(builder.indexOf("const models = ["), builder.indexOf("];", builder.indexOf("const models = [")));
requireCondition(!activeBuilderList.includes("dir: 'digestive'"), "Placeholder builder must not overwrite digestive source assets.");
requireCondition(!activeBuilderList.includes("dir: 'cardiovascular'"), "Placeholder builder must not overwrite the cardiovascular source asset.");
requireCondition(!activeBuilderList.includes("dir: 'renal'"), "Placeholder builder must not overwrite renal source assets.");
requireCondition(!activeBuilderList.includes("dir: 'nervous'"), "Placeholder builder must not overwrite the nervous-system source asset.");
requireCondition(!activeBuilderList.includes("dir: 'respiratory'"), "Placeholder builder must not overwrite respiratory source assets.");
requireCondition(!activeBuilderList.includes("dir: 'skeletal'"), "Placeholder builder must not overwrite the skeletal source asset.");
requireCondition(!activeBuilderList.includes("dir: 'endocrine'"), "Placeholder builder must not overwrite the endocrine source asset.");
requireCondition(!activeBuilderList.includes("dir: 'muscular'"), "Placeholder builder must not overwrite the muscular source asset.");
requireCondition(!activeBuilderList.includes("dir: 'lymphatic'"), "Placeholder builder must not overwrite the lymphatic source asset.");
requireCondition(!activeBuilderList.includes("dir: 'reproductive'"), "Placeholder builder must not overwrite reproductive source assets.");
requireCondition(!activeBuilderList.includes("dir: 'integumentary'"), "Placeholder builder must not overwrite the integumentary source asset.");
requireCondition(!activeBuilderList.includes("dir: 'sensory'"), "Placeholder builder must not overwrite the sensory source asset.");
requireCondition(!registry.includes("assets: []"), "Every anatomy-system viewer must now have at least one source-verified asset.");

const userFacingFiles = [
  "src/features/medical-academy/components/SystemSpecific3DViewer.tsx",
  "src/features/medical-academy/components/MedicalAcademyWorkspace.tsx",
  "src/features/medical-academy/render/native/NativeSystem3DCanvas.tsx",
  "src/features/medical-academy/render/native/AnatomyModelErrorBoundary.tsx",
];
const unsupportedUiClaims = /Streaming Authentic|BioDigital-grade|Living 3D Anatomy|production-ready anatomy/i;
for (const relativePath of userFacingFiles) {
  const contents = readFileSync(path.join(root, relativePath), "utf8");
  requireCondition(!unsupportedUiClaims.test(contents), `${relativePath}: contains an unsupported production-quality claim.`);
}

if (failures.length > 0) {
  console.error("Anatomy asset integrity verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const placeholderLabel = placeholders.length === 1 ? "placeholder" : "placeholders";
  console.log(`Anatomy integrity verified: ${references.length} source-verified references and ${placeholders.length} procedural ${placeholderLabel}; all production-blocked.`);
}
