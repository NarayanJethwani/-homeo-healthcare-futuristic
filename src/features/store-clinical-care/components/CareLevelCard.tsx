import React from "react";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import {
  ALLOWED_CARE_DURATIONS,
  CLINICAL_CARE_TIER_OPTIONS,
  EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT,
  calculateCarePeriodTotalPaise,
  calculateListCarePeriodTotalPaise,
  formatINRFromPaise,
  getCarePeriodContinuityBenefit,
  type ClinicalCareDurationWeeks,
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

const PUBLIC_TIER_IDS = ["focused", "integrated", "complex"] as const;

function formatCarePeriod(weeks: ClinicalCareDurationWeeks): string {
  if (weeks === 4) return "1-month";
  if (weeks === 8) return "2-month";
  if (weeks === 12) return "3-month";
  return `${weeks}-week`;
}

const TIER_DETAILS: Record<(typeof PUBLIC_TIER_IDS)[number], { includes: string[]; accent: string; selected: string }> = {
  focused: {
    includes: ["One primary health concern", "Standard planned follow-up", "Routine prescribed medicines included"],
    accent: "text-teal-700",
    selected: "border-teal-500 bg-teal-50/90 ring-teal-500/20",
  },
  integrated: {
    includes: ["Related health concerns reviewed together", "Regular progress review", "Coordinated prescription adjustments"],
    accent: "text-sky-700",
    selected: "border-sky-500 bg-sky-50/90 ring-sky-500/20",
  },
  complex: {
    includes: ["Long-standing or multi-system concerns", "Enhanced clinical monitoring", "Closer scheduled physician follow-up"],
    accent: "text-violet-700",
    selected: "border-violet-500 bg-violet-50/90 ring-violet-500/20",
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
  const selectedTier = CLINICAL_CARE_TIER_OPTIONS[selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.focused;
  const recommendedPublicTier = preliminaryRecommendation?.suggestedTierId === "advanced"
    ? "complex"
    : preliminaryRecommendation?.suggestedTierId;
  const listTotalPaise = calculateListCarePeriodTotalPaise(selectedTier.weeklyRatePaise, selectedDurationWeeks);
  const careTotalPaise = calculateCarePeriodTotalPaise(selectedTier.weeklyRatePaise, selectedDurationWeeks);
  const continuityPercent = getCarePeriodContinuityBenefit(selectedDurationWeeks);
  const continuitySavingPaise = listTotalPaise - careTotalPaise;
  const carePeriodLabel = formatCarePeriod(selectedDurationWeeks);

  return (
    <section id="care-pathways-pricing" aria-labelledby="care-pathways-heading" className="mb-12 space-y-8 scroll-mt-28">
      <div className="max-w-4xl">
        <span className="text-xs font-bold uppercase tracking-widest text-mint">Care pathways & professional fees</span>
        <h2 id="care-pathways-heading" className="mt-2 font-serif text-3xl font-semibold text-[#1A2421] md:text-5xl">Choose a clear starting pathway</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600">
          Three public pathways keep the choice simple. Advanced Physician Care is assigned only after clinical review and cannot be self-selected.
        </p>
        {preliminaryRecommendation && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-mint/25 bg-mint/[0.07] p-4 text-xs font-semibold text-slate-700">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
            <div><strong className="block text-mint-dark">Recommended starting point: {CLINICAL_CARE_TIER_OPTIONS[recommendedPublicTier || "focused"].name}</strong>{preliminaryRecommendation.suggestedTierId === "advanced" ? "Your answers also indicate that an Advanced Physician Care review may be appropriate." : preliminaryRecommendation.rationale}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {PUBLIC_TIER_IDS.map((tierId) => {
          const tier = CLINICAL_CARE_TIER_OPTIONS[tierId];
          const detail = TIER_DETAILS[tierId];
          const selected = selectedTier.id === tier.id;
          const recommended = recommendedPublicTier === tier.id;
          const tierTotal = calculateCarePeriodTotalPaise(tier.weeklyRatePaise, selectedDurationWeeks);
          const tierListTotal = calculateListCarePeriodTotalPaise(tier.weeklyRatePaise, selectedDurationWeeks);

          return (
            <button key={tier.id} type="button" aria-pressed={selected} onClick={() => onSelectTier(tier.id)} className={`relative flex flex-col rounded-[1.75rem] border p-6 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 ${selected ? `${detail.selected} ring-2 shadow-[0_18px_55px_rgba(26,36,33,0.10)]` : "border-slate-200 bg-white/85 hover:-translate-y-1 hover:border-mint/50 hover:shadow-lg"}`}>
              {recommended && <span className="absolute right-5 top-5 rounded-full bg-[#1A2421] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">Recommended</span>}
              <h3 className="pr-24 font-serif text-2xl font-bold text-[#1A2421]">{tier.name}</h3>
              <p className="mt-3 min-h-14 text-sm font-semibold leading-relaxed text-slate-600">{tier.description}</p>
              <div className="mt-5"><span className="block text-3xl font-black text-[#1A2421]">{formatINRFromPaise(tier.weeklyRatePaise)}</span><span className="mt-1 block text-xs font-bold text-slate-500">Weekly care fee</span></div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
                <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">{carePeriodLabel} {continuityPercent > 0 ? "continuity care fee" : "care fee"}</span>
                {continuityPercent > 0 && <span className="mt-1 block text-xs font-bold text-slate-400 line-through">{formatINRFromPaise(tierListTotal)}</span>}
                <span className={`block text-2xl font-black ${detail.accent}`}>{formatINRFromPaise(tierTotal)}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-3">{detail.includes.map((item) => <li key={item} className="flex items-start gap-2 text-xs font-semibold text-slate-600"><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${detail.accent}`} aria-hidden="true" />{item}</li>)}</ul>
              <span className={`mt-6 rounded-full py-3 text-center text-[10px] font-black uppercase tracking-wider ${selected ? "bg-[#1A2421] text-white" : "bg-slate-100 text-slate-700"}`}>{selected ? "Selected pathway" : "Select pathway"}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/75 p-6 lg:col-span-7 md:p-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-mint">Continuity care benefit</span>
          <h3 className="mt-1 text-2xl font-bold text-[#1A2421]">Choose the physician-confirmed care period</h3>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">The benefit applies only to the professional care fee. Courier and separately approved products are excluded.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {ALLOWED_CARE_DURATIONS.map((weeks) => {
              const percent = getCarePeriodContinuityBenefit(weeks);
              const selected = selectedDurationWeeks === weeks;
              return <button key={weeks} type="button" aria-pressed={selected} onClick={() => onSelectDuration(weeks)} className={`rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${selected ? "border-mint bg-mint/10 ring-1 ring-mint/20" : "border-slate-200 bg-white hover:border-mint/50"}`}><span className="block text-sm font-black text-[#1A2421]">{weeks === 4 ? "1 month" : weeks === 8 ? "2 months" : weeks === 12 ? "3 months" : `${weeks} ${weeks === 1 ? "week" : "weeks"}`}</span><span className="mt-1 block text-xs font-black text-mint-dark">{percent === 0 ? "Standard rate" : `${percent}% benefit`}</span>{weeks === 4 && <span className="mt-2 inline-flex rounded-full bg-[#1A2421] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">Recommended start</span>}</button>;
            })}
          </div>
          <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50/60 p-4 text-xs font-semibold leading-relaxed text-slate-700"><strong className="text-sky-800">Commitment safeguard:</strong> two- and three-month continuity care fees require the corresponding confirmed care commitment. Cancellation, clinical modification, and any applicable credit terms are provided before payment.</div>
        </div>

        <aside className="rounded-[1.75rem] border border-mint/25 bg-white p-6 shadow-[0_20px_60px_rgba(26,36,33,0.10)] lg:sticky lg:top-28 lg:col-span-5 md:p-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-mint">Your selected care</span>
          <h3 className="mt-2 font-serif text-3xl font-bold text-[#1A2421]">{selectedTier.name}</h3>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Care period</dt><dd className="font-bold text-[#1A2421]">{selectedDurationWeeks} weeks</dd></div>
            <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Care fee before benefit</dt><dd className="font-bold text-[#1A2421]">{formatINRFromPaise(listTotalPaise)}</dd></div>
            {continuityPercent > 0 && <div className="flex justify-between gap-4 text-emerald-700"><dt className="font-bold">Continuity benefit ({continuityPercent}%)</dt><dd className="font-black">−{formatINRFromPaise(continuitySavingPaise)}</dd></div>}
          </dl>
          <div className="mt-5 border-t border-slate-200 pt-5"><span className="text-xs font-bold text-slate-500">Estimated {continuityPercent > 0 ? "continuity care fee" : "care fee"}</span><div className="mt-1 text-4xl font-black text-[#1A2421]">{formatINRFromPaise(careTotalPaise)}</div></div>
          <div className="mt-6 flex gap-3 rounded-2xl bg-[#1A2421] p-4 text-white"><Clock className="h-5 w-5 shrink-0 text-mint" aria-hidden="true" /><p className="text-xs font-semibold leading-relaxed">The physician confirms pathway, service schedule, duration, final fee, and response window before treatment begins.</p></div>
          <button type="button" onClick={onProceedToAssessment} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-mint py-4 text-xs font-black uppercase tracking-wider text-white shadow-md transition-colors hover:bg-mint-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"><span>Request physician review</span><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          <p className="mt-3 text-center text-[11px] font-semibold leading-relaxed text-slate-500">No payment now. Start with contact details, then complete the concise clinical review.</p>
        </aside>
      </div>

      <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/70 p-6 md:flex md:items-center md:justify-between md:gap-8">
        <div className="flex items-start gap-3"><Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" /><div><span className="text-[10px] font-black uppercase tracking-widest text-amber-800">Clinician-assigned only</span><h3 className="mt-1 font-serif text-2xl font-bold text-[#1A2421]">Advanced Physician Care</h3><p className="mt-1 max-w-3xl text-xs font-semibold leading-relaxed text-slate-600">For high-complexity cases needing frequent monitoring and direct physician supervision. Indicative weekly care fee ₹12,000; the same continuity benefit ladder applies only after physician assignment.</p></div></div>
        <button type="button" onClick={onProceedToAssessment} className="mt-5 shrink-0 rounded-full border border-amber-300 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-wider text-amber-900 md:mt-0">Request assessment</button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-mint" aria-hidden="true" /><p className="text-xs font-semibold leading-relaxed text-slate-600">{EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT}</p></div>
    </section>
  );
};
