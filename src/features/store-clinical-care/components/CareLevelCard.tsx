import React from "react";
import { Check, Clock } from "lucide-react";
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
}

export const CareLevelCard: React.FC<CareLevelCardProps> = ({
  selectedTierId,
  selectedDurationWeeks,
  onSelectTier,
  onSelectDuration,
}) => {
  const tiers = Object.values(CLINICAL_CARE_TIER_OPTIONS);

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Clinical Care Tiers & Planned Care Periods
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto">
          Select a planned care period below. Complete care-period totals are calculated transparently. No payment is requested during initial information submission.
        </p>

        {/* Duration Selector Bar */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 px-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            Planned Duration:
          </span>
          {ALLOWED_CARE_DURATIONS.map((weeks) => (
            <button
              key={weeks}
              type="button"
              onClick={() => onSelectDuration(weeks)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedDurationWeeks === weeks
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105"
                  : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/60"
              }`}
            >
              {weeks} {weeks === 1 ? "Week" : "Weeks"}
            </button>
          ))}
        </div>
      </div>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((tier: ClinicalCareTierOption) => {
          const isSelected = selectedTierId === tier.id;
          const totalPaise = calculateCarePeriodTotalPaise(tier.weeklyRatePaise, selectedDurationWeeks);
          const totalFormatted = formatINRFromPaise(totalPaise);
          const weeklyFormatted = formatINRFromPaise(tier.weeklyRatePaise);

          return (
            <div
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              className={`relative rounded-2xl p-5 transition-all cursor-pointer border flex flex-col justify-between ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/30 shadow-lg shadow-emerald-900/5 scale-[1.02]"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 right-4 bg-emerald-700 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                  <Check className="w-3 h-3" /> Selected
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">{tier.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{tier.description}</p>

                {/* Prominent Complete Care-Period Total Display */}
                <div className="my-4 p-3.5 rounded-xl bg-slate-50 border border-slate-150">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {totalFormatted}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Complete Total for {selectedDurationWeeks} {selectedDurationWeeks === 1 ? "Week" : "Weeks"} Care Period
                  </div>
                  <div className="text-[11px] font-medium text-emerald-800 mt-1 pt-1 border-t border-slate-200/60">
                    Equivalent to {weeklyFormatted} / week
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium leading-normal mb-4">
                  <span className="font-semibold text-slate-700">Suitable for:</span> {tier.recommendedFor}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTier(tier.id);
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {isSelected ? "Selected for Submission" : "Select Care Tier"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
