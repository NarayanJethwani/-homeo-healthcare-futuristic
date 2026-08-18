import React from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import {
  ALLOWED_CARE_DURATIONS,
  CLINICAL_CARE_TIER_OPTIONS,
  EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT,
  calculateTierCarePeriodTotalPaise,
  calculateTierListCarePeriodTotalPaise,
  formatINRFromPaise,
  getTierCarePeriodLabel,
  getTierContinuityBenefit,
  type ClinicalCareDurationWeeks,
  type PreliminaryCareRecommendation,
  type StoreClinicalCareTierId,
} from "../domain/types";

interface CareLevelCardProps {
  selectedTierId: string;
  selectedDurationWeeks: ClinicalCareDurationWeeks;
  preliminaryRecommendation?: PreliminaryCareRecommendation;
  onSelectTier: (tierId: string) => void;
  onSelectDuration: (weeks: ClinicalCareDurationWeeks) => void;
  onProceedToAssessment?: () => void;
}

const ACUTE_TIER_IDS: StoreClinicalCareTierId[] = ["acute_mild", "acute_wellness"];
const CHRONIC_TIER_IDS: StoreClinicalCareTierId[] = ["focused", "integrated", "complex", "advanced"];

const TIER_DETAILS: Record<StoreClinicalCareTierId, { includes: string[]; accent: string; selected: string }> = {
  acute_mild: { includes: ["One suitable mild acute concern", "Three-day care period", "Reassessment before renewal"], accent: "text-emerald-700", selected: "border-emerald-500 bg-emerald-50/90 ring-emerald-500/20" },
  acute_wellness: { includes: ["Suitable non-emergency acute concern", "Seven-day care period", "Reassessment before renewal"], accent: "text-teal-700", selected: "border-teal-500 bg-teal-50/90 ring-teal-500/20" },
  focused: { includes: ["One defined non-emergency concern", "Subacute, acute-transition, or chronic", "Standard weekly follow-up"], accent: "text-green-700", selected: "border-green-500 bg-green-50/90 ring-green-500/20" },
  integrated: { includes: ["Closer planned review", "Records coordination when agreed", "Physician-confirmed scope"], accent: "text-sky-700", selected: "border-sky-500 bg-sky-50/90 ring-sky-500/20" },
  complex: { includes: ["Frequent planned review", "Multi-clinician coordination when needed", "Enhanced supervision"], accent: "text-violet-700", selected: "border-violet-500 bg-violet-50/90 ring-violet-500/20" },
  advanced: { includes: ["Direct physician supervision", "High-frequency review", "Assigned after physician assessment"], accent: "text-amber-700", selected: "border-amber-500 bg-amber-50/90 ring-amber-500/20" },
};

function CareCard({ tierId, selectedTierId, selectedDurationWeeks, recommendedTierId, onSelectTier }: { tierId: StoreClinicalCareTierId; selectedTierId: string; selectedDurationWeeks: ClinicalCareDurationWeeks; recommendedTierId?: StoreClinicalCareTierId; onSelectTier: (tierId: string) => void }) {
  const tier = CLINICAL_CARE_TIER_OPTIONS[tierId];
  const detail = TIER_DETAILS[tierId];
  const selected = tierId === selectedTierId;
  const periodLabel = getTierCarePeriodLabel(tierId, selectedDurationWeeks);
  const total = calculateTierCarePeriodTotalPaise(tierId, selectedDurationWeeks);
  return (
    <button type="button" aria-pressed={selected} onClick={() => onSelectTier(tierId)} className={`relative flex flex-col rounded-[1.75rem] border p-6 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 ${selected ? `${detail.selected} ring-2 shadow-[0_18px_55px_rgba(26,36,33,0.10)]` : "border-slate-200 bg-white/85 hover:-translate-y-1 hover:border-mint/50 hover:shadow-lg"}`}>
      {recommendedTierId === tierId && <span className="absolute right-5 top-5 rounded-full bg-[#1A2421] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">Suggested start</span>}
      <h3 className="pr-24 font-serif text-2xl font-bold text-[#1A2421]">{tier.name}</h3>
      <p className="mt-3 min-h-14 text-sm font-semibold leading-relaxed text-slate-600">{tier.description}</p>
      <div className="mt-5"><span className="block text-3xl font-black text-[#1A2421]">{formatINRFromPaise(tier.weeklyRatePaise)}</span><span className="mt-1 block text-xs font-bold text-slate-500">{tier.family === "acute" ? `Complete ${periodLabel} care period` : "Per week"}</span></div>
      <ul className="mt-5 flex-1 space-y-3">{detail.includes.map(item => <li key={item} className="flex items-start gap-2 text-xs font-semibold text-slate-600"><CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${detail.accent}`} aria-hidden="true" />{item}</li>)}</ul>
      {tier.family === "chronic" && selectedDurationWeeks > 1 && <div className="mt-4 rounded-xl bg-white/75 px-3 py-2 text-xs font-bold text-slate-600">Selected {periodLabel}: {formatINRFromPaise(total)}</div>}
      <span className={`mt-6 rounded-full py-3 text-center text-[10px] font-black uppercase tracking-wider ${selected ? "bg-[#1A2421] text-white" : "bg-slate-100 text-slate-700"}`}>{selected ? "Selected plan" : "Select plan"}</span>
    </button>
  );
}

export const CareLevelCard: React.FC<CareLevelCardProps> = ({ selectedTierId, selectedDurationWeeks, preliminaryRecommendation, onSelectTier, onSelectDuration, onProceedToAssessment }) => {
  const safeSelectedId = (selectedTierId in CLINICAL_CARE_TIER_OPTIONS ? selectedTierId : "focused") as StoreClinicalCareTierId;
  const selectedTier = CLINICAL_CARE_TIER_OPTIONS[safeSelectedId];
  const blocked = preliminaryRecommendation?.blockedBySafetyGate === true;
  const listTotal = calculateTierListCarePeriodTotalPaise(safeSelectedId, selectedDurationWeeks);
  const careTotal = calculateTierCarePeriodTotalPaise(safeSelectedId, selectedDurationWeeks);
  const continuityPercent = getTierContinuityBenefit(safeSelectedId, selectedDurationWeeks);
  const periodLabel = getTierCarePeriodLabel(safeSelectedId, selectedDurationWeeks);

  return (
    <section id="care-pathways-pricing" aria-labelledby="care-pathways-heading" className="mb-12 space-y-8 scroll-mt-28">
      <div className="max-w-4xl">
        <span className="text-xs font-bold uppercase tracking-widest text-mint">Care plans & professional fees</span>
        <h2 id="care-pathways-heading" className="mt-2 font-serif text-3xl font-semibold text-[#1A2421] md:text-5xl">Choose a transparent starting plan</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600">Two fixed short acute plans and four weekly clinical plans are shown with exact starting periods. The physician may assign Focused Clinical Care to a suitable subacute, acute-transition, or chronic case. Selection is a request for review—not a diagnosis, prescription, or guarantee of suitability.</p>
        {blocked ? <div className="mt-5 flex gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-900"><AlertTriangle className="h-5 w-5 shrink-0" />Urgent or uncertain warning signs must be assessed before a care plan or quotation is requested.</div> : preliminaryRecommendation && <div className="mt-5 rounded-2xl border border-mint/25 bg-mint/[0.07] p-4 text-xs font-semibold text-slate-700"><strong className="block text-mint-dark">Suggested starting point: {preliminaryRecommendation.suggestedTierName}</strong>{preliminaryRecommendation.rationale}</div>}
      </div>

      <div><h3 className="mb-4 text-sm font-black uppercase tracking-wider text-[#1A2421]">Short acute care</h3><div className="grid grid-cols-1 gap-5 md:grid-cols-2">{ACUTE_TIER_IDS.map(id => <CareCard key={id} tierId={id} selectedTierId={safeSelectedId} selectedDurationWeeks={selectedDurationWeeks} recommendedTierId={preliminaryRecommendation?.suggestedTierId} onSelectTier={onSelectTier} />)}</div></div>
      <div><h3 className="mb-4 text-sm font-black uppercase tracking-wider text-[#1A2421]">Weekly clinical care</h3><div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">{CHRONIC_TIER_IDS.map(id => <CareCard key={id} tierId={id} selectedTierId={safeSelectedId} selectedDurationWeeks={selectedDurationWeeks} recommendedTierId={preliminaryRecommendation?.suggestedTierId} onSelectTier={onSelectTier} />)}</div></div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/75 p-6 lg:col-span-7 md:p-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-mint">Care period</span>
          <h3 className="mt-1 text-2xl font-bold text-[#1A2421]">{selectedTier.family === "acute" ? `Fixed ${periodLabel} period` : "Choose a physician-confirmed weekly care period"}</h3>
          {selectedTier.family === "acute" ? <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">Acute plans do not receive continuity discounts. Physician reassessment is required before renewal, extension, or movement to a weekly clinical plan.</p> : <><p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">Continuity benefits apply only to the professional clinical care fee for the confirmed period.</p><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">{ALLOWED_CARE_DURATIONS.map(weeks => { const percent = getTierContinuityBenefit(safeSelectedId, weeks); const selected = selectedDurationWeeks === weeks; return <button key={weeks} type="button" aria-pressed={selected} onClick={() => onSelectDuration(weeks)} className={`rounded-2xl border p-4 text-left ${selected ? "border-mint bg-mint/10 ring-1 ring-mint/20" : "border-slate-200 bg-white hover:border-mint/50"}`}><span className="block text-sm font-black text-[#1A2421]">{weeks} {weeks === 1 ? "week" : "weeks"}</span><span className="mt-1 block text-xs font-black text-mint-dark">{percent ? `${percent}% benefit` : "Standard rate"}</span></button>; })}</div></>}
          <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50/60 p-4 text-xs font-semibold leading-relaxed text-slate-700"><strong className="text-sky-800">Reassessment safeguard:</strong> continuation, cancellation, clinical modification, response windows, and any applicable credit terms are confirmed before payment.</div>
        </div>

        <aside className="rounded-[1.75rem] border border-mint/25 bg-white p-6 shadow-[0_20px_60px_rgba(26,36,33,0.10)] lg:sticky lg:top-28 lg:col-span-5 md:p-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-mint">Your selected plan</span><h3 className="mt-2 font-serif text-3xl font-bold text-[#1A2421]">{selectedTier.name}</h3>
          <dl className="mt-6 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Care period</dt><dd className="font-bold text-[#1A2421]">{periodLabel}</dd></div><div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Care fee before benefit</dt><dd className="font-bold text-[#1A2421]">{formatINRFromPaise(listTotal)}</dd></div>{continuityPercent > 0 && <div className="flex justify-between gap-4 text-emerald-700"><dt className="font-bold">Continuity benefit ({continuityPercent}%)</dt><dd className="font-black">−{formatINRFromPaise(listTotal - careTotal)}</dd></div>}</dl>
          <div className="mt-5 border-t border-slate-200 pt-5"><span className="text-xs font-bold text-slate-500">Estimated care fee</span><div className="mt-1 text-4xl font-black text-[#1A2421]">{formatINRFromPaise(careTotal)}</div></div>
          <div className="mt-6 flex gap-3 rounded-2xl bg-[#1A2421] p-4 text-white"><Clock className="h-5 w-5 shrink-0 text-mint" /><p className="text-xs font-semibold leading-relaxed">The physician confirms clinical suitability, scope, duration, response window, and final quotation before treatment begins.</p></div>
          <button type="button" disabled={blocked} onClick={onProceedToAssessment} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-mint py-4 text-xs font-black uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:bg-slate-300"><span>{blocked ? "Urgent assessment required" : "Request physician review"}</span><ArrowRight className="h-4 w-4" /></button>
          <p className="mt-3 text-center text-[11px] font-semibold leading-relaxed text-slate-500">No payment now. This request does not replace emergency or conventional medical care.</p>
        </aside>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs font-semibold leading-relaxed text-amber-950"><ShieldCheck className="h-5 w-5 shrink-0" /><p>{EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT} Acute plans are never emergency services.</p></div>
    </section>
  );
};
