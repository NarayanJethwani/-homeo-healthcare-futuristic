import React from "react";
import { Stethoscope } from "lucide-react";

export const ClinicalCareHeader: React.FC = () => (
  <header className="max-w-4xl mb-8">
    <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-2">
      <Stethoscope className="w-4 h-4" aria-hidden="true" /> Individualised homeopathic care
    </span>
    <h1 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mt-4">Care Plans &amp; Fees</h1>
    <p className="text-base text-slate-700 leading-relaxed mt-5">
      Compare care options, fees and what is included. Your doctor will review your concerns and confirm a suitable plan before payment.
    </p>
    <p className="text-sm text-slate-600 leading-relaxed mt-3">
      Fees reflect the agreed scope of case history, case analysis, homeopathic prescribing and follow-up. Every plan is for one person.
    </p>
  </header>
);
