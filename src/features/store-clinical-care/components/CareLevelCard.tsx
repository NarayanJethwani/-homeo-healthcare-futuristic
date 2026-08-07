import React from "react";
import { CheckCircle2, Clock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  ALLOWED_CARE_DURATIONS,
  calculateCarePeriodTotalPaise,
  formatINRFromPaise,
  EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT,
  type ClinicalCareDurationWeeks,
  type ClinicalCareTierOption,
  type PreliminaryCareRecommendation,
} from "../domain/types";

interface CareLevelCardProps {
  selectedTierId: string;
  selectedDurationWeeks: ClinicalCareDurationWeeks;
  preliminaryRecommendation?: PreliminaryCareRecommendation;
  onSelectTier: (tierId: string) => void;
  onSelectDuration: (weeks: ClinicalCareDurationWeeks) => void;
  onProceedToAssessment?: () => void;
}

interface TierTheme {
  borderUnselected: string;
  bgUnselected: string;
  hoverUnselected: string;
  borderSelected: string;
  bgSelected: string;
  ringSelected: string;
  shadowSelected: string;
  priceBoxBg: string;
  priceBoxBorder: string;
  checkColor: string;
  buttonSelected: string;
  buttonUnselected: string;
}

const tierThemesMap: Record<string, TierTheme> = {
  focused: {
    borderUnselected: "border-teal-200/90",
    bgUnselected: "bg-gradient-to-b from-teal-50/70 via-emerald-50/30 to-white/95 text-teal-950",
    hoverUnselected: "hover:border-teal-400 hover:shadow-md",
    borderSelected: "border-teal-500",
    bgSelected: "bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-teal-50/70",
    ringSelected: "ring-2 ring-teal-500/30",
    shadowSelected: "shadow-[0_16px_50px_rgba(20,184,166,0.22)]",
    priceBoxBg: "bg-white/90",
    priceBoxBorder: "border-teal-200/80",
    checkColor: "text-teal-600",
    buttonSelected: "bg-teal-600 text-white shadow-md",
    buttonUnselected: "bg-teal-900/10 text-teal-950 hover:bg-teal-600 hover:text-white",
  },
  integrated: {
    borderUnselected: "border-sky-200/90",
    bgUnselected: "bg-gradient-to-b from-sky-50/70 via-blue-50/30 to-white/95 text-sky-950",
    hoverUnselected: "hover:border-sky-400 hover:shadow-md",
    borderSelected: "border-sky-500",
    bgSelected: "bg-gradient-to-b from-sky-500/15 via-blue-500/10 to-sky-50/70",
    ringSelected: "ring-2 ring-sky-500/30",
    shadowSelected: "shadow-[0_16px_50px_rgba(14,165,233,0.22)]",
    priceBoxBg: "bg-white/90",
    priceBoxBorder: "border-sky-200/80",
    checkColor: "text-sky-600",
    buttonSelected: "bg-sky-600 text-white shadow-md",
    buttonUnselected: "bg-sky-900/10 text-sky-950 hover:bg-sky-600 hover:text-white",
  },
  complex: {
    borderUnselected: "border-violet-200/90",
    bgUnselected: "bg-gradient-to-b from-violet-50/70 via-purple-50/30 to-white/95 text-violet-950",
    hoverUnselected: "hover:border-violet-400 hover:shadow-md",
    borderSelected: "border-violet-500",
    bgSelected: "bg-gradient-to-b from-violet-500/15 via-purple-500/10 to-violet-50/70",
    ringSelected: "ring-2 ring-violet-500/30",
    shadowSelected: "shadow-[0_16px_50px_rgba(139,92,246,0.22)]",
    priceBoxBg: "bg-white/90",
    priceBoxBorder: "border-violet-200/80",
    checkColor: "text-violet-600",
    buttonSelected: "bg-violet-600 text-white shadow-md",
    buttonUnselected: "bg-violet-900/10 text-violet-950 hover:bg-violet-600 hover:text-white",
  },
  advanced: {
    borderUnselected: "border-amber-200/90",
    bgUnselected: "bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-white/95 text-amber-950",
    hoverUnselected: "hover:border-amber-400 hover:shadow-md",
    borderSelected: "border-amber-500",
    bgSelected: "bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-amber-50/70",
    ringSelected: "ring-2 ring-amber-500/30",
    shadowSelected: "shadow-[0_16px_50px_rgba(245,158,11,0.22)]",
    priceBoxBg: "bg-white/90",
    priceBoxBorder: "border-amber-200/80",
    checkColor: "text-amber-600",
    buttonSelected: "bg-amber-600 text-white shadow-md",
    buttonUnselected: "bg-amber-900/10 text-amber-950 hover:bg-amber-600 hover:text-white",
  },
};

export const CareLevelCard: React.FC<CareLevelCardProps> = ({
  selectedTierId,
  selectedDurationWeeks,
  preliminaryRecommendation,
  onSelectTier,
  onSelectDuration,
  onProceedToAssessment,
}) => {
  const tiers = Object.values(CLINICAL_CARE_TIER_OPTIONS);

  return (
    <section className="space-y-10 mb-12">
      {/* Step Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold text-mint uppercase tracking-widest block mb-1">
          Care Pathways & Professional Fees
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[#1A2421]">
          Which best describes the care level you need?
        </h2>
        <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-3">
          Explore care levels and planned durations below. All professional fees are structured per week and confirmed by your physician after clinical assessment review.
        </p>

        {preliminaryRecommendation && (
          <div className="mt-4 p-4 rounded-2xl bg-mint/10 border border-mint/25 text-xs text-slate-700 font-semibold space-y-1">
            <span className="font-bold text-mint-dark block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-mint" aria-hidden="true" />
              Preliminary Care Recommendation: {preliminaryRecommendation.suggestedTierName}
            </span>
            <p>{preliminaryRecommendation.rationale}</p>
          </div>
        )}
      </div>

      {/* Tier Cards Grid with Distinct Plan Background Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((tier: ClinicalCareTierOption) => {
          const isSelected = selectedTierId === tier.id;
          const isSuggested = preliminaryRecommendation
            ? preliminaryRecommendation.suggestedTierId === tier.id
            : tier.id === "integrated";

          const theme = tierThemesMap[tier.id] || tierThemesMap.integrated;
          const totalPaise = calculateCarePeriodTotalPaise(tier.weeklyRatePaise, selectedDurationWeeks);
          const totalFormatted = formatINRFromPaise(totalPaise);
          const weeklyFormatted = formatINRFromPaise(tier.weeklyRatePaise);

          return (
            <button
              key={tier.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectTier(tier.id)}
              className={`relative rounded-3xl border p-6 text-left transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 ${
                isSelected
                  ? `${theme.borderSelected} ${theme.bgSelected} ${theme.ringSelected} ${theme.shadowSelected}`
                  : `${theme.borderUnselected} ${theme.bgUnselected} ${theme.hoverUnselected}`
              }`}
            >
              {isSuggested && (
                <span className="absolute right-5 top-5 rounded-full bg-[#1A2421] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
                  Recommended
                </span>
              )}

              <div>
                <h3 className="font-serif text-xl font-bold text-[#1A2421] pr-20">{tier.name}</h3>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed mt-3">{tier.description}</p>

                {/* Price Display */}
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-[#1A2421]">{weeklyFormatted}</span>
                  <span className="text-xs font-bold text-slate-500">/week</span>
                </div>

                <div className={`mt-4 p-3 rounded-2xl border ${theme.priceBoxBorder} ${theme.priceBoxBg}`}>
                  <span className="block text-[11px] font-bold text-slate-500">Estimated Care-Period Fee</span>
                  <span className="block text-lg font-black text-[#1A2421] mt-0.5">{totalFormatted}</span>
                  <span className="block text-[10px] font-semibold text-mint-dark mt-0.5">
                    For {selectedDurationWeeks} {selectedDurationWeeks === 1 ? "week" : "weeks"}
                  </span>
                </div>

                <div className="mt-4 text-xs font-semibold text-slate-600 flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${theme.checkColor}`} aria-hidden="true" />
                  <span>{tier.recommendedFor}</span>
                </div>
              </div>

              <div className={`mt-6 w-full py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-center transition-all ${
                isSelected
                  ? theme.buttonSelected
                  : theme.buttonUnselected
              }`}>
                {isSelected ? "Selected Pathway" : "Select Pathway"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explicit Physician Authority Statement Banner */}
      <div className="p-4 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-mint shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs font-semibold text-slate-600 leading-relaxed">
          {EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT}
        </p>
      </div>

      {/* Care Duration Selection Panel & Selected Care Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 glass-panel border-white/60 bg-white/45 rounded-3xl p-6 md:p-8 space-y-7 border">
          <div>
            <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Care Duration</span>
            <h2 className="text-xl font-bold text-[#1A2421] mt-1">Select planned duration</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Each option shows the estimated care fee for that period.</p>
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
                  className={`rounded-2xl border p-3.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
                    isDurationSelected
                      ? "border-mint bg-mint/[0.08] ring-2 ring-mint/20 shadow-sm"
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
            <strong className="text-sky-800">Why 4 weeks is recommended:</strong> It provides a clear initial review period for constitutional response. Your treating physician confirms or adjusts the care duration following clinical assessment review.
          </div>
        </div>

        {/* Selected Care Sidebar */}
        <aside className="lg:col-span-5 glass-panel border-mint/20 bg-white/60 rounded-3xl p-6 md:p-8 border lg:sticky lg:top-28">
          <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Selected Care Summary</span>
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
            <span className="text-xs font-bold text-slate-500">Estimated Care-Period Fee</span>
            <div className="text-4xl font-black text-[#1A2421] mt-1">
              {formatINRFromPaise(calculateCarePeriodTotalPaise((CLINICAL_CARE_TIER_OPTIONS[selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.integrated).weeklyRatePaise, selectedDurationWeeks))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#1A2421] text-white p-4 mt-6 flex gap-3">
            <Clock className="w-5 h-5 text-mint shrink-0" aria-hidden="true" />
            <p className="text-xs font-semibold leading-relaxed">
              Your treating physician confirms pathway suitability, care scope, and final fee before treatment begins.
            </p>
          </div>

          <button
            type="button"
            onClick={onProceedToAssessment}
            className="w-full mt-5 py-4 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          >
            Continue to Clinical Assessment <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <p className="text-center text-[11px] font-semibold text-slate-500 leading-relaxed mt-3">
            No payment at this step. Submit details → physician review → official quotation prepared.
          </p>
        </aside>
      </div>
    </section>
  );
};
