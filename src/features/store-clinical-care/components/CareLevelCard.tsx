import React from "react";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  ALLOWED_CARE_DURATIONS,
  calculateCarePeriodTotalPaise,
  formatINRFromPaise,
  type ClinicalCareDurationWeeks,
  type ClinicalCareTierOption,
} from "../domain/types";

interface CareLevelCardProps {
  selectedTierId: string;
  selectedDurationWeeks: ClinicalCareDurationWeeks;
  onSelectTier: (tierId: string) => void;
  onSelectDuration: (weeks: ClinicalCareDurationWeeks) => void;
  onProceedToAssessment?: () => void;
}

export const CareLevelCard: React.FC<CareLevelCardProps> = ({
  selectedTierId,
  selectedDurationWeeks,
  onSelectTier,
  onSelectDuration,
  onProceedToAssessment,
}) => {
  const tiers = Object.values(CLINICAL_CARE_TIER_OPTIONS);

  return (
    <section className="space-y-10 mb-12">
      {/* Step 1: Pathway Selection Header */}
      <div className="max-w-3xl">
        <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Step 1</span>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A2421] mt-2">
          Which best describes the care you need?
        </h2>
        <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-3">
          Choose the closest pathway. A physician reviews your clinical assessment and confirms suitability before treatment begins.
        </p>
      </div>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((tier: ClinicalCareTierOption) => {
          const isSelected = selectedTierId === tier.id;
          const isRecommended = tier.id === "integrated";
          const totalPaise = calculateCarePeriodTotalPaise(tier.weeklyRatePaise, selectedDurationWeeks);
          const totalFormatted = formatINRFromPaise(totalPaise);
          const weeklyFormatted = formatINRFromPaise(tier.weeklyRatePaise);

          return (
            <button
              key={tier.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectTier(tier.id)}
              className={`relative rounded-3xl border p-6 text-left transition-all flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 ${
                isSelected
                  ? "border-mint bg-mint/[0.055] shadow-[0_16px_50px_rgba(20,184,166,0.12)] ring-1 ring-mint/20"
                  : "border-slate-200/80 bg-white/55 hover:border-mint/40 hover:bg-white/80"
              }`}
            >
              {isRecommended && (
                <span className="absolute right-5 top-5 rounded-full bg-[#1A2421] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                  Recommended
                </span>
              )}

              <div>
                <h3 className="font-serif text-xl font-bold text-[#1A2421] pr-20">{tier.name}</h3>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-3">{tier.description}</p>

                {/* Price Display */}
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-[#1A2421]">{weeklyFormatted}</span>
                  <span className="text-xs font-bold text-slate-500">/week</span>
                </div>

                <div className="mt-4 p-3 rounded-2xl border border-mint/15 bg-white/80">
                  <span className="block text-xs font-bold text-slate-500">Care-period total</span>
                  <span className="block text-lg font-black text-[#1A2421] mt-0.5">{totalFormatted}</span>
                  <span className="block text-[10px] font-semibold text-mint-dark mt-0.5">
                    For {selectedDurationWeeks} {selectedDurationWeeks === 1 ? "week" : "weeks"}
                  </span>
                </div>

                <div className="mt-4 text-xs font-semibold text-slate-600 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-mint shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{tier.recommendedFor}</span>
                </div>
              </div>

              <div className="mt-6 w-full py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-center transition-all ${
                isSelected
                  ? 'bg-mint text-white shadow-sm'
                  : 'bg-[#1A2421]/10 text-[#1A2421] hover:bg-mint hover:text-white'
              }">
                {isSelected ? "Selected Pathway" : "Select Pathway"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Step 2: Care Duration Selection Panel & Selected Care Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 glass-panel border-white/60 bg-white/45 rounded-3xl p-6 md:p-8 space-y-7 border">
          <div>
            <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Step 2</span>
            <h2 className="text-xl font-bold text-[#1A2421] mt-1">Select a care duration</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Each option shows the complete care fee for that period.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {ALLOWED_CARE_DURATIONS.map((weeks) => {
              const activeTier = CLINICAL_CARE_TIER_OPTIONS[selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.integrated;
              const periodTotal = calculateCarePeriodTotalPaise(activeTier.weeklyRatePaise, weeks);
              const formattedPeriod = formatINRFromPaise(periodTotal);
              const isDurationSelected = selectedDurationWeeks === weeks;

              return (
                <button
                  key={weeks}
                  type="button"
                  aria-pressed={isDurationSelected}
                  onClick={() => onSelectDuration(weeks)}
                  className={`rounded-2xl border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
                    isDurationSelected
                      ? "border-mint bg-mint/[0.08] ring-1 ring-mint/20"
                      : "border-slate-200 bg-white/70 hover:border-slate-400"
                  }`}
                >
                  <span className="block text-xs font-black text-[#1A2421]">{weeks} {weeks === 1 ? "week" : "weeks"}</span>
                  <span className="block text-sm font-black text-mint-dark mt-1">{formattedPeriod}</span>
                  {weeks === 4 && (
                    <span className="inline-flex rounded-full bg-[#1A2421] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white mt-1.5">
                      Recommended
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-sky-200/70 bg-sky-50/50 p-4 text-xs font-semibold text-slate-700 leading-relaxed">
            <strong className="text-sky-800">Why 4 weeks is recommended:</strong> It provides a clear initial review period for constitutional response. A physician confirms or adjusts the care duration following clinical assessment review.
          </div>
        </div>

        {/* Selected Care Sidebar */}
        <aside className="lg:col-span-5 glass-panel border-mint/20 bg-white/60 rounded-3xl p-6 md:p-8 border lg:sticky lg:top-28">
          <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Selected Care</span>
          <h3 className="font-serif text-2xl font-bold text-[#1A2421] mt-2">
            {(CLINICAL_CARE_TIER_OPTIONS[selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.integrated).name}
          </h3>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-slate-500">Planned Duration</dt>
              <dd className="font-bold text-[#1A2421]">{selectedDurationWeeks} {selectedDurationWeeks === 1 ? "week" : "weeks"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-slate-500">Weekly Equivalent</dt>
              <dd className="font-bold text-[#1A2421]">
                {formatINRFromPaise((CLINICAL_CARE_TIER_OPTIONS[selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.integrated).weeklyRatePaise)}/week
              </dd>
            </div>
          </dl>

          <div className="border-t border-slate-200 mt-5 pt-5">
            <span className="text-xs font-bold text-slate-500">Care-period total</span>
            <div className="text-4xl font-black text-[#1A2421] mt-1">
              {formatINRFromPaise(calculateCarePeriodTotalPaise((CLINICAL_CARE_TIER_OPTIONS[selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.integrated).weeklyRatePaise, selectedDurationWeeks))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#1A2421] text-white p-4 mt-6 flex gap-3">
            <Clock className="w-5 h-5 text-mint shrink-0" aria-hidden="true" />
            <p className="text-xs font-semibold leading-relaxed">
              A physician confirms pathway suitability, care scope, and final fee before treatment begins.
            </p>
          </div>

          <button
            type="button"
            onClick={onProceedToAssessment}
            className="w-full mt-5 py-4 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          >
            Continue to Clinical Assessment <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <p className="text-center text-[11px] font-semibold text-slate-500 leading-relaxed mt-3">
            No payment at this step. Submit details → physician review → recommendation prepared.
          </p>
        </aside>
      </div>
    </section>
  );
};
