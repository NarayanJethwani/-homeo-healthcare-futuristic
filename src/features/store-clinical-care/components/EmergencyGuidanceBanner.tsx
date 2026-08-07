import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { EMERGENCY_GUIDANCE_NOTICE } from "../domain/types";

export const EmergencyGuidanceBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      role="alert"
      className="my-12 rounded-3xl border border-rose-200 bg-rose-50/70 p-5 md:p-6 text-rose-950 shadow-sm backdrop-blur-md transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-rose-100 text-rose-600 shrink-0">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="font-bold text-rose-950 text-sm block">Medical Safety Notice & Emergency Boundary</span>
            <span className="text-xs text-rose-700 font-semibold hidden sm:inline">
              Homeo Healthcare provides planned, non-emergency homeopathic care.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 bg-white/80 text-xs font-bold text-rose-900 hover:bg-white transition-all shrink-0"
        >
          <span>{isOpen ? "Hide Guidance" : "View Safety Notice"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-rose-200/80 text-xs leading-relaxed font-semibold text-rose-900 space-y-2 animate-fadeIn">
          <p>{EMERGENCY_GUIDANCE_NOTICE}</p>
          <p className="text-[11px] text-rose-800">
            If you are experiencing severe, sudden, or life-threatening symptoms, please immediately call local emergency services or visit the nearest emergency room.
          </p>
        </div>
      )}
    </div>
  );
};
