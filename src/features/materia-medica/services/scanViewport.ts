import { DEFAULT_SCAN_VIEWPORT, ScanViewportState, ScanZoomMode } from "../reader/scanTypes";

export function setScanZoomMode(state: ScanViewportState, mode: ScanZoomMode): ScanViewportState {
  if (mode === "custom") return { ...state, zoomMode: mode };
  return { ...state, zoomMode: mode, zoom: 1, panX: 0, panY: 0 };
}

export function adjustScanZoom(state: ScanViewportState, delta: number): ScanViewportState {
  const zoom = Math.min(4, Math.max(0.5, Math.round((state.zoom + delta) * 100) / 100));
  return { ...state, zoomMode: "custom", zoom };
}

export function rotateScan(state: ScanViewportState): ScanViewportState {
  const rotation = ((state.rotation + 90) % 360) as ScanViewportState["rotation"];
  return { ...state, rotation, panX: 0, panY: 0 };
}

export function resetScanViewport(): ScanViewportState {
  return { ...DEFAULT_SCAN_VIEWPORT };
}

