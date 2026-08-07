import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Stethoscope, HeartHandshake, Award } from "lucide-react";
import { CLINICAL_CARE_FEE_EXPLANATION } from "../domain/types";

export const ClinicalCareHeader: React.FC = () => {
  return (
    <header className="max-w-4xl mb-12">
      <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-2">
        <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
        Physician-Led Individualized Care
      </span>
      <h1 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mt-4">
        Clinical Care & Physician Supervision
      </h1>
      <p className="text-base text-slate-700 font-semibold leading-relaxed mt-6">
        Homeopathic care at Homeo Healthcare is thoroughly individualized. Rather than pre-packaged products or self-selected remedies, your care is led by experienced classical homeopathic physicians through structured clinical assessment, constitutional prescribing, and continuous progress monitoring.
      </p>

      {/* Fee Philosophy Card */}
      <div className="mt-8 rounded-3xl border border-mint/20 bg-white/60 backdrop-blur-md p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-mint/10 text-mint-dark shrink-0">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1A2421]">
              How Clinical Care is Provided & Valued
            </h2>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-2">
              {CLINICAL_CARE_FEE_EXPLANATION}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200/80 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-mint shrink-0" aria-hidden="true" />
                <span>Coordinated Health Review</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-mint shrink-0" aria-hidden="true" />
                <span>Physician Supervision</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-mint shrink-0" aria-hidden="true" />
                <span>Continuity of Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
