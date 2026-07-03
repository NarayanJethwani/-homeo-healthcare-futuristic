"use client";

import { ShieldAlert } from "lucide-react";

export function ClinicalSafetyBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-800">
      <ShieldAlert className="h-3.5 w-3.5" />
      <span>Clinical review required - do not auto-prescribe</span>
    </div>
  );
}
