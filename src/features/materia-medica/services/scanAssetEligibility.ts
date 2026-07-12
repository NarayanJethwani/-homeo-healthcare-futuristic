import { PageTextAlignment, ScanPageAsset } from "../reader/scanTypes";

const SAFE_LOCAL_SCAN_PATH = /^\/data\/materia-medica\/scans\/[a-z0-9/_-]+\.(?:avif|jpe?g|png|webp)$/;

export function isEligibleScanAsset(asset: ScanPageAsset): boolean {
  const rightsAllowed = asset.rightsStatus === "public-domain" || asset.rightsStatus === "licensed";
  return rightsAllowed
    && asset.status === "editorially-approved"
    && asset.deprecatedAt == null
    && /^[a-f0-9]{64}$/i.test(asset.checksum)
    && SAFE_LOCAL_SCAN_PATH.test(asset.localAssetPath);
}

export function canUseSplitReader(
  asset: ScanPageAsset,
  alignment: PageTextAlignment,
  approvedPassageIds: ReadonlySet<string>,
): boolean {
  return isEligibleScanAsset(asset)
    && alignment.sourceVersionId === asset.sourceVersionId
    && alignment.scanPageIndexStart <= asset.scanPageIndex
    && alignment.scanPageIndexEnd >= asset.scanPageIndex
    && alignment.confidence !== "uncertain"
    && approvedPassageIds.has(alignment.passageId);
}

