"use client";

import React, { useState } from "react";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { ScanPageAsset } from "../../reader/scanTypes";
import { adjustScanZoom, resetScanViewport, rotateScan, setScanZoomMode } from "../../services/scanViewport";
import { isEligibleScanAsset } from "../../services/scanAssetEligibility";

export function ScanReader({ asset, alt }: { asset: ScanPageAsset; alt: string }) {
  const [viewport, setViewport] = useState(resetScanViewport);

  if (!isEligibleScanAsset(asset)) {
    return <div role="status">Original scan unavailable — the registered asset has not passed governance checks.</div>;
  }

  return (
    <section aria-label="Original scanned page" className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">
      <div className="flex min-h-11 flex-wrap items-center gap-2 border-b border-slate-800 p-2">
        <button aria-label="Zoom out" onClick={() => setViewport(value => adjustScanZoom(value, -0.25))}><ZoomOut /></button>
        <button aria-label="Zoom in" onClick={() => setViewport(value => adjustScanZoom(value, 0.25))}><ZoomIn /></button>
        {(["fit-width", "fit-page", "actual-size"] as const).map(mode => (
          <button key={mode} onClick={() => setViewport(value => setScanZoomMode(value, mode))}>{mode.replace("-", " ")}</button>
        ))}
        <button aria-label="Rotate page clockwise" onClick={() => setViewport(rotateScan)}><RotateCw /></button>
      </div>
      <div className="h-[70vh] overflow-auto overscroll-contain" data-scan-viewport>
        {/* Governed paths are local and validated before reaching this element. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.localAssetPath}
          alt={alt}
          draggable={false}
          className="mx-auto block max-w-none origin-top select-none"
          style={{ transform: `rotate(${viewport.rotation}deg) scale(${viewport.zoom})` }}
        />
      </div>
    </section>
  );
}

