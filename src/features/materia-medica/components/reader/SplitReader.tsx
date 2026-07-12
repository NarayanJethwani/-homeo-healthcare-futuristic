"use client";

import React from "react";
import { PageTextAlignment, ScanPageAsset } from "../../reader/scanTypes";
import { canUseSplitReader } from "../../services/scanAssetEligibility";
import { ScanReader } from "./ScanReader";

type SplitReaderProps = {
  asset: ScanPageAsset;
  alignment: PageTextAlignment;
  approvedPassageIds: ReadonlySet<string>;
  text: React.ReactNode;
};

export function SplitReader({ asset, alignment, approvedPassageIds, text }: SplitReaderProps) {
  if (!canUseSplitReader(asset, alignment, approvedPassageIds)) {
    return <div role="status">Split comparison unavailable — page alignment is missing or insufficiently verified.</div>;
  }

  return (
    <section aria-label="Original scan and verified text comparison" className="grid gap-4 xl:grid-cols-2">
      <ScanReader asset={asset} alt={`Scanned source page ${asset.printedPage ?? asset.scanPageIndex}`} />
      <article className="max-h-[70vh] overflow-auto rounded-2xl border border-slate-700 p-5" aria-label="Verified cleaned text">
        {alignment.confidence === "probable" && (
          <p role="status" className="mb-3 text-amber-700">Page alignment is probable and should be checked against the scan.</p>
        )}
        {text}
      </article>
    </section>
  );
}

