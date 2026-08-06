import React from "react";
import { ShieldCheck, Stethoscope, Award, HeartHandshake } from "lucide-react";
import { CLINICAL_CARE_FEE_EXPLANATION } from "../domain/types";

export const ClinicalCareHeader: React.FC = () => {
  return (
    <header className="mb-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide uppercase mb-4">
        <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Physician-Led Individualized Homeopathic Care</span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        Clinical Care & Physician Supervision
      </h1>

      <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto mb-6">
        Homeopathic care at Homeo Healthcare is thoroughly individualized. Rather than pre-packaged products or self-selected remedies, your care is led by experienced classical homeopathic physicians through structured clinical assessment, constitutional prescribing, and continuous progress monitoring.
      </p>

      {/* Fee Philosophy Box */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 text-left shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              How Clinical Care is Provided & Valued
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              {CLINICAL_CARE_FEE_EXPLANATION}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-slate-700 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>Coordinated Health Review</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>Physician Supervision</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                <span>Continuity of Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
