import React from "react";
import { AlertTriangle } from "lucide-react";
import { EMERGENCY_GUIDANCE_NOTICE } from "../domain/types";

export const EmergencyGuidanceBanner: React.FC = () => {
  return (
    <div
      role="alert"
      className="mb-8 rounded-xl border border-amber-200 bg-amber-50/90 p-4 sm:p-5 text-amber-900 shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm leading-relaxed font-medium">
          <span className="font-semibold text-amber-950 block mb-0.5">Medical Safety Notice</span>
          {EMERGENCY_GUIDANCE_NOTICE}
        </div>
      </div>
    </div>
  );
};
