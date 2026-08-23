import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  resolveStructureForMesh,
  resolveSystem3DAsset,
  SYSTEM_3D_REGISTRY,
} from "../src/features/medical-academy/render/system3DRegistry";
import { AnatomyMaterialPipeline } from "../src/features/medical-academy/render/native/AnatomyMaterialPipeline";
import * as THREE from "three";

describe("digestive anatomy asset selection", () => {
  const digestive = SYSTEM_3D_REGISTRY.digestive;

  it.each([
    ["stomach", "bodyparts3d_stomach_v4", "/models/anatomy/digestive/stomach_bodyparts3d_v4.glb"],
    ["liver", "hra_liver_male_v1", "/models/anatomy/digestive/liver_hra_male_v1.glb"],
    ["pancreas", "hra_pancreas_male_v1", "/models/anatomy/digestive/pancreas_hra_male_v1.glb"],
  ])("maps %s to its source asset", (structureId, assetId, filePath) => {
    const asset = resolveSystem3DAsset(digestive, structureId);

    expect(asset?.id).toBe(assetId);
    expect(asset?.filePath).toBe(filePath);
    expect(asset?.provenanceStatus).toBe("source-verified");
    expect(asset?.productionEligible).toBe(false);
  });

  it("falls back safely for reset or unknown structures", () => {
    expect(resolveSystem3DAsset(digestive, null)?.id).toBe("bodyparts3d_stomach_v4");
    expect(resolveSystem3DAsset(digestive, "unknown")?.id).toBe("bodyparts3d_stomach_v4");
  });
});

describe("cardiovascular source hierarchy", () => {
  const cardiovascular = SYSTEM_3D_REGISTRY.cardiovascular;
  const heart = resolveSystem3DAsset(cardiovascular, "cardiac_valves");

  it("uses the source-verified HRA heart for every supported focus target", () => {
    expect(heart?.id).toBe("hra_heart_female_v1_1");
    expect(heart?.capabilities?.vasculature).toBe(true);
    expect(heart?.productionEligible).toBe(false);

    for (const structureId of ["left_ventricle", "aorta_arch", "coronary_arteries", "cardiac_valves"]) {
      expect(resolveSystem3DAsset(cardiovascular, structureId)?.id).toBe(heart?.id);
    }
  });

  it.each([
    ["VH_F_left_ventricle", "left_ventricle"],
    ["VH_F_descending_aorta_b", "aorta_arch"],
    ["VH_F_right_coronary_artery", "coronary_arteries"],
    ["VH_F_tricuspid_valve", "cardiac_valves"],
  ])("maps source mesh %s to %s", (meshName, structureId) => {
    expect(resolveStructureForMesh(heart?.structures ?? [], meshName)?.id).toBe(structureId);
  });

  it("shows and hides meshes classified as source vasculature", () => {
    const root = new THREE.Group();
    const vascularMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial()
    );
    vascularMesh.userData.viewerLayer = "vasculature";
    root.add(vascularMesh);

    const pipeline = new AnatomyMaterialPipeline();
    pipeline.applyMedicalShading(root, "#E11D48", null, false, false);
    expect(vascularMesh.visible).toBe(false);

    pipeline.applyMedicalShading(root, "#E11D48", null, false, true);
    expect(vascularMesh.visible).toBe(true);
  });
});

describe("renal source hierarchy", () => {
  const renal = SYSTEM_3D_REGISTRY.renal;

  it.each([
    ["kidney_left", "hra_kidney_male_left_v1_2", "/models/anatomy/renal/kidney_hra_male_left_v1_2.glb"],
    ["kidney_right", "hra_kidney_male_right_v1_2", "/models/anatomy/renal/kidney_hra_male_right_v1_2.glb"],
    ["ureter_left", "hra_ureter_male_left_v1_2", "/models/anatomy/renal/ureter_hra_male_left_v1_2.glb"],
    ["ureter_right", "hra_ureter_male_right_v1_2", "/models/anatomy/renal/ureter_hra_male_right_v1_2.glb"],
    ["urinary_bladder", "hra_urinary_bladder_male_v1_2", "/models/anatomy/renal/urinary_bladder_hra_male_v1_2.glb"],
  ])("maps %s to its source asset", (structureId, assetId, filePath) => {
    const asset = resolveSystem3DAsset(renal, structureId);

    expect(asset?.id).toBe(assetId);
    expect(asset?.filePath).toBe(filePath);
    expect(asset?.provenanceStatus).toBe("source-verified");
    expect(asset?.productionEligible).toBe(false);
    expect(asset?.capabilities?.vasculature).not.toBe(true);
  });

  it.each([
    ["kidney_left", "VH_M_renal_pyramid_L_i", "kidney_left"],
    ["kidney_right", "VH_M_renal_papilla_R_a", "kidney_right"],
    ["ureter_left", "VH_M_minor_calyx_L_i", "ureter_left"],
    ["ureter_right", "VH_M_major_calyx_R_b", "ureter_right"],
    ["urinary_bladder", "VH_M_trigone_of_urinary_bladder", "urinary_bladder"],
  ])("maps %s source mesh %s", (structureId, meshName, expectedId) => {
    const asset = resolveSystem3DAsset(renal, structureId);
    expect(resolveStructureForMesh(asset?.structures ?? [], meshName)?.id).toBe(expectedId);
  });
});

describe("nervous-system source hierarchy", () => {
  const nervous = SYSTEM_3D_REGISTRY.nervous;
  const brain = resolveSystem3DAsset(nervous, "brainstem");

  it("uses one source-preserving BodyParts3D brain assembly for every supported focus", () => {
    expect(brain?.id).toBe("bodyparts3d_brain_v4");
    expect(brain?.filePath).toBe("/models/anatomy/nervous/brain_bodyparts3d_v4.glb");
    expect(brain?.provenanceStatus).toBe("source-verified");
    expect(brain?.productionEligible).toBe(false);
    expect(brain?.capabilities?.vasculature).not.toBe(true);

    for (const structureId of [
      "cerebral_hemisphere_left",
      "cerebral_hemisphere_right",
      "cerebellum",
      "brainstem",
      "deep_brain_ventricles",
    ]) {
      expect(resolveSystem3DAsset(nervous, structureId)?.id).toBe(brain?.id);
    }
  });

  it.each([
    ["BodyParts3D_cerebral_hemisphere_left_FJ1833", "cerebral_hemisphere_left"],
    ["BodyParts3D_cerebral_hemisphere_right_FJ1834", "cerebral_hemisphere_right"],
    ["BodyParts3D_cerebellum_FJ1781", "cerebellum"],
    ["BodyParts3D_brainstem_FJ1769", "brainstem"],
    ["BodyParts3D_deep_brain_ventricles_FJ1730", "deep_brain_ventricles"],
  ])("maps source mesh %s to %s", (meshName, structureId) => {
    expect(resolveStructureForMesh(brain?.structures ?? [], meshName)?.id).toBe(structureId);
  });
});

describe("respiratory source hierarchy", () => {
  const respiratory = SYSTEM_3D_REGISTRY.respiratory;

  it.each([
    ["left_lung_segments", "hra_lung_male_v1_4", "/models/anatomy/respiratory/lung_hra_male_v1_4.glb"],
    ["right_lung_segments", "hra_lung_male_v1_4", "/models/anatomy/respiratory/lung_hra_male_v1_4.glb"],
    ["intrapulmonary_bronchi", "hra_lung_male_v1_4", "/models/anatomy/respiratory/lung_hra_male_v1_4.glb"],
    ["main_bronchi", "hra_main_bronchus_male_v1_1", "/models/anatomy/respiratory/main_bronchus_hra_male_v1_1.glb"],
    ["trachea", "hra_trachea_male_v1_1", "/models/anatomy/respiratory/trachea_hra_male_v1_1.glb"],
  ])("maps %s to its source asset", (structureId, assetId, filePath) => {
    const asset = resolveSystem3DAsset(respiratory, structureId);
    expect(asset?.id).toBe(assetId);
    expect(asset?.filePath).toBe(filePath);
    expect(asset?.provenanceStatus).toBe("source-verified");
    expect(asset?.productionEligible).toBe(false);
    expect(asset?.capabilities?.vasculature).not.toBe(true);
  });

  it.each([
    ["left_lung_segments", "VH_M_left_lingula_superior_bronchopulmonary_segment", "left_lung_segments"],
    ["right_lung_segments", "VH_M_right_posterior_basal_bronchopulmonary_segment", "right_lung_segments"],
    ["intrapulmonary_bronchi", "VH_M_left_superior_lobar_bronchus", "intrapulmonary_bronchi"],
    ["main_bronchi", "VH_M_right_main_bronchus", "main_bronchi"],
    ["trachea", "VH_M_carina", "trachea"],
  ])("maps %s source mesh %s", (structureId, meshName, expectedId) => {
    const asset = resolveSystem3DAsset(respiratory, structureId);
    expect(resolveStructureForMesh(asset?.structures ?? [], meshName)?.id).toBe(expectedId);
  });

  it("maps every source mesh in all three respiratory GLBs", () => {
    for (const asset of respiratory.assets) {
      const bytes = readFileSync(path.join(process.cwd(), "public", asset.filePath));
      const jsonChunkLength = bytes.readUInt32LE(12);
      const glb = JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim()) as {
        nodes?: Array<{ name?: string; mesh?: number }>;
      };
      const meshNodeNames = (glb.nodes ?? [])
        .filter((node) => node.mesh !== undefined)
        .map((node) => node.name ?? "");

      expect(meshNodeNames.length).toBeGreaterThan(0);
      expect(
        meshNodeNames.filter((meshName) => !resolveStructureForMesh(asset.structures, meshName))
      ).toEqual([]);
    }
  });
});

describe("skeletal source hierarchy", () => {
  const skeletal = SYSTEM_3D_REGISTRY.skeletal;
  const skeleton = resolveSystem3DAsset(skeletal, "vertebral_column");

  it("uses the source-preserving axial skeleton for every supported focus", () => {
    expect(skeleton?.id).toBe("bodyparts3d_axial_skeleton_v4");
    expect(skeleton?.filePath).toBe("/models/anatomy/skeletal/axial_skeleton_bodyparts3d_v4.glb");
    expect(skeleton?.provenanceStatus).toBe("source-verified");
    expect(skeleton?.productionEligible).toBe(false);

    for (const structureId of [
      "skull",
      "vertebral_column",
      "rib_cage",
      "pelvic_skeleton",
      "pectoral_girdles",
    ]) {
      expect(resolveSystem3DAsset(skeletal, structureId)?.id).toBe(skeleton?.id);
    }
  });

  it.each([
    ["BodyParts3D_skull_FJ1282", "skull"],
    ["BodyParts3D_vertebral_column_FJ3154", "vertebral_column"],
    ["BodyParts3D_rib_cage_FJ3153", "rib_cage"],
    ["BodyParts3D_pelvic_skeleton_FJ3152", "pelvic_skeleton"],
    ["BodyParts3D_pectoral_girdles_FJ3237", "pectoral_girdles"],
  ])("maps source mesh %s to %s", (meshName, structureId) => {
    expect(resolveStructureForMesh(skeleton?.structures ?? [], meshName)?.id).toBe(structureId);
  });

  it("maps all 138 source meshes to a declared skeletal focus", () => {
    expect(skeleton).toBeDefined();
    const bytes = readFileSync(path.join(process.cwd(), "public", skeleton?.filePath ?? ""));
    const jsonChunkLength = bytes.readUInt32LE(12);
    const glb = JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim()) as {
      nodes?: Array<{ name?: string; mesh?: number }>;
    };
    const meshNodeNames = (glb.nodes ?? [])
      .filter((node) => node.mesh !== undefined)
      .map((node) => node.name ?? "");

    expect(meshNodeNames).toHaveLength(138);
    expect(
      meshNodeNames.filter((meshName) => !resolveStructureForMesh(skeleton?.structures ?? [], meshName))
    ).toEqual([]);
  });
});

describe("endocrine source hierarchy", () => {
  const endocrine = SYSTEM_3D_REGISTRY.endocrine;
  const collection = resolveSystem3DAsset(endocrine, "pituitary_gland");

  it("uses the source-preserving gland collection for every supported focus", () => {
    expect(collection?.id).toBe("bodyparts3d_endocrine_collection_v4");
    expect(collection?.filePath).toBe("/models/anatomy/endocrine/endocrine_glands_bodyparts3d_v4.glb");
    expect(collection?.provenanceStatus).toBe("source-verified");
    expect(collection?.productionEligible).toBe(false);

    for (const structureId of [
      "pituitary_gland",
      "pineal_body",
      "adrenal_gland_left",
      "adrenal_gland_right",
      "pancreas_endocrine",
    ]) {
      expect(resolveSystem3DAsset(endocrine, structureId)?.id).toBe(collection?.id);
    }
  });

  it.each([
    ["BodyParts3D_pituitary_gland_FJ1796", "pituitary_gland"],
    ["BodyParts3D_pineal_body_FJ1795", "pineal_body"],
    ["BodyParts3D_adrenal_gland_left_FJ3129", "adrenal_gland_left"],
    ["BodyParts3D_adrenal_gland_right_FJ3130", "adrenal_gland_right"],
    ["BodyParts3D_pancreas_endocrine_FJ2630", "pancreas_endocrine"],
  ])("maps source mesh %s to %s", (meshName, structureId) => {
    expect(resolveStructureForMesh(collection?.structures ?? [], meshName)?.id).toBe(structureId);
  });

  it("maps all eight source meshes and excludes unsupported thyroid claims", () => {
    expect(collection).toBeDefined();
    const bytes = readFileSync(path.join(process.cwd(), "public", collection?.filePath ?? ""));
    const jsonChunkLength = bytes.readUInt32LE(12);
    const glb = JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim()) as {
      nodes?: Array<{ name?: string; mesh?: number }>;
    };
    const meshNodeNames = (glb.nodes ?? [])
      .filter((node) => node.mesh !== undefined)
      .map((node) => node.name ?? "");

    expect(meshNodeNames).toHaveLength(8);
    expect(
      meshNodeNames.filter((meshName) => !resolveStructureForMesh(collection?.structures ?? [], meshName))
    ).toEqual([]);
    expect(endocrine.subOrgans.map((item) => item.id)).not.toContain("thyroid");
    expect(endocrine.subOrgans.map((item) => item.id)).not.toContain("parathyroids");
  });
});

describe("muscular source hierarchy", () => {
  const muscular = SYSTEM_3D_REGISTRY.muscular;
  const muscleSystem = resolveSystem3DAsset(muscular, "head_neck_muscles");

  it("uses the complete source-mapped muscle-organ asset for every regional focus", () => {
    expect(muscleSystem?.id).toBe("bodyparts3d_muscular_system_v4");
    expect(muscleSystem?.filePath).toBe("/models/anatomy/muscular/muscular_system_bodyparts3d_v4.glb");
    expect(muscleSystem?.provenanceStatus).toBe("source-verified");
    expect(muscleSystem?.productionEligible).toBe(false);

    for (const structureId of [
      "head_neck_muscles",
      "axial_trunk_muscles",
      "upper_limb_muscles",
      "lower_limb_muscles",
    ]) {
      expect(resolveSystem3DAsset(muscular, structureId)?.id).toBe(muscleSystem?.id);
    }
  });

  it.each([
    ["BodyParts3D_head_neck_muscles_FJ1294", "head_neck_muscles"],
    ["BodyParts3D_axial_trunk_muscles_FJ1431", "axial_trunk_muscles"],
    ["BodyParts3D_upper_limb_muscles_FJ1456", "upper_limb_muscles"],
    ["BodyParts3D_lower_limb_muscles_FJ1383", "lower_limb_muscles"],
  ])("maps source mesh %s to %s", (meshName, structureId) => {
    expect(resolveStructureForMesh(muscleSystem?.structures ?? [], meshName)?.id).toBe(structureId);
  });

  it("maps all 323 source muscle meshes and avoids unsupported connective-tissue claims", () => {
    expect(muscleSystem).toBeDefined();
    const bytes = readFileSync(path.join(process.cwd(), "public", muscleSystem?.filePath ?? ""));
    const jsonChunkLength = bytes.readUInt32LE(12);
    const glb = JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim()) as {
      nodes?: Array<{ name?: string; mesh?: number }>;
    };
    const meshNodeNames = (glb.nodes ?? [])
      .filter((node) => node.mesh !== undefined)
      .map((node) => node.name ?? "");

    expect(meshNodeNames).toHaveLength(323);
    expect(
      meshNodeNames.filter((meshName) => !resolveStructureForMesh(muscleSystem?.structures ?? [], meshName))
    ).toEqual([]);
    expect(muscular.subOrgans.map((item) => item.id)).not.toContain("tendons_fascia");
  });
});

describe("lymphatic source hierarchy", () => {
  const lymphatic = SYSTEM_3D_REGISTRY.lymphatic;
  const lymphoidOrgans = resolveSystem3DAsset(lymphatic, "spleen");

  it("uses the source-mapped lymphoid-organ collection for supported focus targets", () => {
    expect(lymphoidOrgans?.id).toBe("bodyparts3d_lymphoid_organs_v4");
    expect(lymphoidOrgans?.filePath).toBe("/models/anatomy/lymphatic/lymphoid_organs_bodyparts3d_v4.glb");
    expect(lymphoidOrgans?.provenanceStatus).toBe("source-verified");
    expect(lymphoidOrgans?.productionEligible).toBe(false);
    expect(resolveSystem3DAsset(lymphatic, "spleen")?.id).toBe(lymphoidOrgans?.id);
    expect(resolveSystem3DAsset(lymphatic, "thymus")?.id).toBe(lymphoidOrgans?.id);
  });

  it.each([
    ["BodyParts3D_spleen_FJ2561", "spleen"],
    ["BodyParts3D_thymus_left_lobe_FJ3150", "thymus"],
    ["BodyParts3D_thymus_right_lobe_FJ3151", "thymus"],
  ])("maps source mesh %s to %s", (meshName, structureId) => {
    expect(resolveStructureForMesh(lymphoidOrgans?.structures ?? [], meshName)?.id).toBe(structureId);
  });

  it("maps all source meshes and excludes unsupported network claims", () => {
    expect(lymphoidOrgans).toBeDefined();
    const bytes = readFileSync(path.join(process.cwd(), "public", lymphoidOrgans?.filePath ?? ""));
    const jsonChunkLength = bytes.readUInt32LE(12);
    const glb = JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim()) as {
      nodes?: Array<{ name?: string; mesh?: number }>;
    };
    const meshNodeNames = (glb.nodes ?? [])
      .filter((node) => node.mesh !== undefined)
      .map((node) => node.name ?? "");

    expect(meshNodeNames).toHaveLength(3);
    expect(
      meshNodeNames.filter((meshName) => !resolveStructureForMesh(lymphoidOrgans?.structures ?? [], meshName))
    ).toEqual([]);
    expect(lymphatic.subOrgans.map((item) => item.id)).not.toContain("lymph_nodes");
    expect(lymphatic.overview).toContain("not modeled");
  });
});

describe("reproductive source hierarchy", () => {
  const reproductive = SYSTEM_3D_REGISTRY.reproductive;
  const expectedAssets = [
    ["uterus", "hra_uterus_female_v1_2", 11, "VH_F_cervix"],
    ["ovary_left", "hra_ovary_female_left_v1_1", 1, "VH_F_left_ovary"],
    ["ovary_right", "hra_ovary_female_right_v1_1", 1, "VH_F_right_ovary"],
    ["fallopian_tube_left", "hra_fallopian_tube_female_left_v1_1", 4, "VH_F_ampulla_of_uterine_tube_L"],
    ["fallopian_tube_right", "hra_fallopian_tube_female_right_v1_1", 4, "VH_F_ampulla_of_uterine_tube_R"],
    ["male_reproductive_organs", "bodyparts3d_male_reproductive_v4", 12, "BodyParts3D_prostate_FJ3139"],
  ] as const;

  it.each(expectedAssets)("selects the exact source asset for %s", (structureId, assetId) => {
    const asset = resolveSystem3DAsset(reproductive, structureId);
    expect(asset?.id).toBe(assetId);
    expect(asset?.provenanceStatus).toBe("source-verified");
    expect(asset?.productionEligible).toBe(false);
  });

  it.each(expectedAssets)(
    "maps every source mesh for %s without crossing source boundaries",
    (structureId, _assetId, expectedMeshCount, representativeMesh) => {
      const asset = resolveSystem3DAsset(reproductive, structureId);
      expect(asset).toBeDefined();
      expect(resolveStructureForMesh(asset?.structures ?? [], representativeMesh)?.id).toBe(structureId);

      const bytes = readFileSync(path.join(process.cwd(), "public", asset?.filePath ?? ""));
      const jsonChunkLength = bytes.readUInt32LE(12);
      const glb = JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim()) as {
        nodes?: Array<{ name?: string; mesh?: number }>;
      };
      const meshNodeNames = (glb.nodes ?? [])
        .filter((node) => node.mesh !== undefined)
        .map((node) => node.name ?? "");

      expect(meshNodeNames).toHaveLength(expectedMeshCount);
      expect(
        meshNodeNames.filter((meshName) => !resolveStructureForMesh(asset?.structures ?? [], meshName))
      ).toEqual([]);
    },
  );

  it("keeps sex-specific assets explicit and removes unsupported generic focus claims", () => {
    expect(reproductive.assets.filter((asset) => asset.name.includes("Female"))).toHaveLength(5);
    expect(reproductive.assets.filter((asset) => asset.name.includes("Male"))).toHaveLength(1);
    expect(reproductive.subOrgans.map((item) => item.id)).not.toContain("gonads");
    expect(reproductive.subOrgans.map((item) => item.id)).not.toContain("uterus_tract");
    expect(reproductive.overview).toContain("remain separate");
  });
});

describe("integumentary source hierarchy", () => {
  const integumentary = SYSTEM_3D_REGISTRY.integumentary;
  const collection = resolveSystem3DAsset(integumentary, "skin_surface");

  it("uses the source-preserving skin and hair collection for supported focuses", () => {
    expect(collection?.id).toBe("bodyparts3d_integumentary_v4");
    expect(collection?.filePath).toBe("/models/anatomy/integumentary/skin_hair_bodyparts3d_v4.glb");
    expect(collection?.provenanceStatus).toBe("source-verified");
    expect(collection?.productionEligible).toBe(false);
    expect(resolveSystem3DAsset(integumentary, "skin_surface")?.id).toBe(collection?.id);
    expect(resolveSystem3DAsset(integumentary, "hair_appendages")?.id).toBe(collection?.id);
  });

  it.each([
    ["BodyParts3D_skin_surface_skin_FJ2810", "skin_surface"],
    ["BodyParts3D_hair_appendages_eyebrow_FJ2812", "hair_appendages"],
    ["BodyParts3D_hair_appendages_hair_of_head_FJ2813", "hair_appendages"],
    ["BodyParts3D_hair_appendages_pubic_hair_FJ2815", "hair_appendages"],
  ])("maps source mesh %s to %s", (meshName, structureId) => {
    expect(resolveStructureForMesh(collection?.structures ?? [], meshName)?.id).toBe(structureId);
  });

  it("maps every source mesh and excludes unsupported microanatomy claims", () => {
    expect(collection).toBeDefined();
    const bytes = readFileSync(path.join(process.cwd(), "public", collection?.filePath ?? ""));
    const jsonChunkLength = bytes.readUInt32LE(12);
    const glb = JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim()) as {
      nodes?: Array<{ name?: string; mesh?: number }>;
    };
    const meshNodeNames = (glb.nodes ?? [])
      .filter((node) => node.mesh !== undefined)
      .map((node) => node.name ?? "");

    expect(meshNodeNames).toHaveLength(4);
    expect(
      meshNodeNames.filter((meshName) => !resolveStructureForMesh(collection?.structures ?? [], meshName))
    ).toEqual([]);
    expect(integumentary.subOrgans.map((item) => item.id)).not.toContain("epidermis_dermis");
    expect(integumentary.subOrgans.map((item) => item.id)).not.toContain("hair_sebaceous");
    expect(integumentary.overview).toContain("not modeled");
  });
});

describe("sensory source hierarchy", () => {
  const sensory = SYSTEM_3D_REGISTRY.sensory;
  const collection = resolveSystem3DAsset(sensory, "ocular_structures");

  it("uses the source-preserving sensory collection for both supported focuses", () => {
    expect(collection?.id).toBe("bodyparts3d_sensory_collection_v4");
    expect(collection?.filePath).toBe("/models/anatomy/sensory/ocular_external_ear_bodyparts3d_v4.glb");
    expect(collection?.provenanceStatus).toBe("source-verified");
    expect(collection?.productionEligible).toBe(false);
    expect(resolveSystem3DAsset(sensory, "ocular_structures")?.id).toBe(collection?.id);
    expect(resolveSystem3DAsset(sensory, "external_ears")?.id).toBe(collection?.id);
  });

  it.each([
    ["BodyParts3D_ocular_structures_cornea_right_FJ1340", "ocular_structures"],
    ["BodyParts3D_ocular_structures_lens_left_FJ1305", "ocular_structures"],
    ["BodyParts3D_ocular_structures_retina_right_FJ1367", "ocular_structures"],
    ["BodyParts3D_ocular_structures_optic_nerve_left_2_FJ1772", "ocular_structures"],
    ["BodyParts3D_external_ears_external_ears_FJ2811", "external_ears"],
  ])("maps source mesh %s to %s", (meshName, structureId) => {
    expect(resolveStructureForMesh(collection?.structures ?? [], meshName)?.id).toBe(structureId);
  });

  it("maps all 23 source meshes and excludes unsupported special-sense claims", () => {
    expect(collection).toBeDefined();
    const bytes = readFileSync(path.join(process.cwd(), "public", collection?.filePath ?? ""));
    const jsonChunkLength = bytes.readUInt32LE(12);
    const glb = JSON.parse(bytes.subarray(20, 20 + jsonChunkLength).toString("utf8").trim()) as {
      nodes?: Array<{ name?: string; mesh?: number }>;
    };
    const meshNodeNames = (glb.nodes ?? [])
      .filter((node) => node.mesh !== undefined)
      .map((node) => node.name ?? "");

    expect(meshNodeNames).toHaveLength(23);
    expect(
      meshNodeNames.filter((meshName) => !resolveStructureForMesh(collection?.structures ?? [], meshName))
    ).toEqual([]);
    expect(sensory.subOrgans.map((item) => item.id)).not.toContain("ear_cochlea");
    expect(sensory.subOrgans.map((item) => item.id)).not.toContain("eye_retina");
    expect(sensory.overview).toContain("not modeled");
  });

  it("completes source-backed coverage for all twelve system viewers", () => {
    const systems = Object.values(SYSTEM_3D_REGISTRY);
    expect(systems).toHaveLength(12);
    expect(systems.filter((system) => system.assets.length === 0)).toEqual([]);
    expect(systems.flatMap((system) => system.assets)).toHaveLength(25);
    expect(
      systems.flatMap((system) => system.assets).filter((asset) => asset.provenanceStatus !== "source-verified")
    ).toEqual([]);
  });
});
