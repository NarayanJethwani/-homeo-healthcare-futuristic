import { PageTextAlignment, ScanPageAsset } from "../reader/scanTypes";

export type GovernedScanRegistration = {
  asset: ScanPageAsset;
  alignment: PageTextAlignment;
};

// Phase 7 intentionally starts empty. Assets may be added only after local
// acquisition, checksum, rights, editorial, and page-alignment approval.
export const GOVERNED_SCAN_REGISTRY: readonly GovernedScanRegistration[] = [];

export function findGovernedScanForPassage(passageId: string): GovernedScanRegistration | null {
  return GOVERNED_SCAN_REGISTRY.find(item => item.alignment.passageId === passageId) ?? null;
}

