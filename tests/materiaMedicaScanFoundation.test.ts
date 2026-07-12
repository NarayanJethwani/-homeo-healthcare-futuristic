import assert from "assert";
import { canUseSplitReader, isEligibleScanAsset } from "../src/features/materia-medica/services/scanAssetEligibility";
import { ScanPageAsset } from "../src/features/materia-medica/reader/scanTypes";
import { GOVERNED_SCAN_REGISTRY, findGovernedScanForPassage } from "../src/features/materia-medica/data/scanAssetRegistry";

const asset: ScanPageAsset = {
  id: "kent-1911-scan-23",
  bookId: "james-tyler-kent",
  sourceVersionId: "kent-1911-second-edition-v1",
  scanPageIndex: 23,
  printedPage: 11,
  localAssetPath: "/data/materia-medica/scans/kent-1911/0023.webp",
  checksum: "a".repeat(64),
  rightsStatus: "public-domain",
  status: "editorially-approved",
};

assert.equal(isEligibleScanAsset(asset), true);
assert.equal(isEligibleScanAsset({ ...asset, localAssetPath: "https://archive.org/page.jpg" }), false);
assert.equal(isEligibleScanAsset({ ...asset, rightsStatus: "rights-review-required" }), false);
assert.equal(isEligibleScanAsset({ ...asset, status: "deprecated" }), false);

const alignment = {
  passageId: "kent-aconitum",
  sourceVersionId: asset.sourceVersionId,
  scanPageIndexStart: 23,
  scanPageIndexEnd: 36,
  confidence: "verified" as const,
};

assert.equal(canUseSplitReader(asset, alignment, new Set(["kent-aconitum"])), true);
assert.equal(canUseSplitReader(asset, { ...alignment, confidence: "uncertain" }, new Set(["kent-aconitum"])), false);
assert.equal(canUseSplitReader(asset, alignment, new Set()), false);
assert.equal(GOVERNED_SCAN_REGISTRY.length, 0);
assert.equal(findGovernedScanForPassage("unknown"), null);

console.log("Materia Medica Phase 7 scan foundation tests passed");
