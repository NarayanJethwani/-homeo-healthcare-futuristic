export type ScanZoomMode = "custom" | "fit-width" | "fit-page" | "actual-size";

export type ScanAssetStatus =
  | "registered"
  | "rights-approved"
  | "checksum-verified"
  | "editorially-approved"
  | "deprecated";

export type ScanPageAsset = {
  id: string;
  bookId: string;
  sourceVersionId: string;
  scanPageIndex: number;
  printedPage?: number;
  localAssetPath: string;
  checksum: string;
  rightsStatus: "public-domain" | "licensed" | "rights-review-required" | "restricted";
  status: ScanAssetStatus;
  deprecatedAt?: string;
};

export type PageTextAlignment = {
  passageId: string;
  sourceVersionId: string;
  scanPageIndexStart: number;
  scanPageIndexEnd: number;
  confidence: "verified" | "probable" | "uncertain";
  reviewedBy?: string;
  reviewedAt?: string;
};

export type ScanViewportState = {
  zoomMode: ScanZoomMode;
  zoom: number;
  rotation: 0 | 90 | 180 | 270;
  panX: number;
  panY: number;
};

export const DEFAULT_SCAN_VIEWPORT: ScanViewportState = {
  zoomMode: "fit-width",
  zoom: 1,
  rotation: 0,
  panX: 0,
  panY: 0,
};

