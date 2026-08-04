"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import {
  SPECIALTY_CLINICAL_AREAS,
  SPECIALTY_SUPPORT_TIERS,
  EXPERT_REVIEW_OPTIONS,
  formatSpecialtyTierTotal,
  getClinicalAreaLeadership,
  type SpecialtyAccent,
  type SpecialtySelection,
  type SpecialtyTierKey,
} from "@/lib/specialtyPrograms";
import type { OrganSystemBreadth } from "@/components/PatientPricingPlanner";

interface SpecialtySupportDirectoryProps {
  onContinue: (selection: SpecialtySelection) => void;
}

const accentClasses: Record<SpecialtyAccent, string> = {
  rose: "border-rose-200/80 bg-rose-50/55 dark:border-rose-400/30 dark:bg-rose-400/[0.08]",
  emerald: "border-emerald-200/80 bg-emerald-50/55 dark:border-emerald-400/30 dark:bg-emerald-400/[0.08]",
  teal: "border-teal-200/80 bg-teal-50/55 dark:border-teal-400/30 dark:bg-teal-400/[0.08]",
  lime: "border-lime-200/80 bg-lime-50/55 dark:border-lime-400/30 dark:bg-lime-400/[0.08]",
  amber: "border-amber-200/80 bg-amber-50/55 dark:border-amber-400/30 dark:bg-amber-400/[0.08]",
  indigo: "border-indigo-200/80 bg-indigo-50/55 dark:border-indigo-400/30 dark:bg-indigo-400/[0.08]",
  orange: "border-orange-200/80 bg-orange-50/55 dark:border-orange-400/30 dark:bg-orange-400/[0.08]",
  cyan: "border-cyan-200/80 bg-cyan-50/55 dark:border-cyan-400/30 dark:bg-cyan-400/[0.08]",
  purple: "border-purple-200/80 bg-purple-50/55 dark:border-purple-400/30 dark:bg-purple-400/[0.08]",
};

const ORGAN_SYSTEM_OPTIONS: ReadonlyArray<{
  value: OrganSystemBreadth;
  label: string;
  guidance: string;
}> = [
  { value: "1", label: "1 system", guidance: "Focused" },
  { value: "2-3", label: "2–3 systems", guidance: "Layered" },
  { value: "4-5", label: "4–5 systems", guidance: "Multisystem" },
  { value: "6+", label: "6+ systems", guidance: "Extensive" },
  { value: "unsure", label: "Not sure", guidance: "Physician will map" },
];

const TIER_ORDER: readonly SpecialtyTierKey[] = ["constitutional", "advanced", "complete"];
const DISPLAY_DURATIONS = [1, 2, 4, 8, 12] as const;

export default function SpecialtySupportDirectory({ onContinue }: SpecialtySupportDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<string>();
  const [selectedCondition, setSelectedCondition] = useState("");
  const [otherConcern, setOtherConcern] = useState("");
  const [organSystemBreadth, setOrganSystemBreadth] = useState<OrganSystemBreadth>();
  const [requestedExpertReview, setRequestedExpertReview] = useState<SpecialtySelection["requestedExpertReview"]>("none");

  const filteredAreas = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return SPECIALTY_CLINICAL_AREAS;
    return SPECIALTY_CLINICAL_AREAS.filter((area) =>
      [area.title, area.description, ...area.specialties, ...area.conditions]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const selectedArea = useMemo(
    () => SPECIALTY_CLINICAL_AREAS.find((area) => area.id === selectedAreaId),
    [selectedAreaId],
  );

  const chooseArea = (areaId: string) => {
    setSelectedAreaId(areaId);
    setSelectedCondition("");
    setOtherConcern("");
  };

  const resolvedCondition = selectedCondition === "Other or not sure"
    ? otherConcern.trim() || selectedCondition
    : selectedCondition;
  const canContinue = Boolean(selectedArea && resolvedCondition && organSystemBreadth);
  const leadership = selectedArea ? getClinicalAreaLeadership(selectedArea) : null;

  return (
    <div className="space-y-10">
      <section aria-labelledby="specialty-pricing-heading" className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white/65 dark:bg-[#111827] p-5 md:p-8">
        <div className="max-w-3xl">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-mint">One pricing model for every clinical area</span>
          <h3 id="specialty-pricing-heading" className="font-serif text-2xl md:text-3xl font-semibold text-[#1A2421] dark:text-white mt-2">Care intensity determines the fee—not the disease name</h3>
          <p className="text-sm font-semibold leading-relaxed text-slate-650 dark:text-[#CBD5E1] mt-3">These are fixed care-period totals. The physician assigns the suitable level and confirms the scope before treatment; organ-system count never creates an automatic surcharge.</p>
        </div>

        <div className="overflow-x-auto mt-6 rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="bg-[#1A2421] text-white">
              <tr>
                <th className="px-4 py-3 font-bold">Physician-assigned level</th>
                {DISPLAY_DURATIONS.map((weeks) => <th key={weeks} className="px-4 py-3 font-bold">{weeks} weeks</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {TIER_ORDER.map((tierKey) => {
                const tier = SPECIALTY_SUPPORT_TIERS[tierKey];
                return (
                  <tr key={tierKey}>
                    <th className="px-4 py-4 align-top">
                      <span className="block font-extrabold text-[#1A2421] dark:text-white">{tier.title}</span>
                      <span className="block max-w-xs font-semibold text-slate-500 dark:text-[#94A3B8] mt-1">{tier.assignmentGuidance}</span>
                    </th>
                    {DISPLAY_DURATIONS.map((weeks) => (
                      <td key={weeks} className="px-4 py-4 font-extrabold text-[#1A2421] dark:text-white">
                        {tier.durations.includes(weeks) ? formatSpecialtyTierTotal(tierKey, weeks) : "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="clinical-area-heading">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-mint">Step 1</span>
            <h3 id="clinical-area-heading" className="font-serif text-2xl md:text-3xl font-semibold text-[#1A2421] dark:text-white mt-2">Choose your main health area</h3>
            <p className="text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] mt-2">Search by a familiar condition or select the body system closest to your concern.</p>
          </div>
          <label className="relative w-full lg:max-w-md">
            <span className="sr-only">Search health areas and conditions</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" aria-hidden="true" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search diabetes, migraine, skin, digestion..."
              className="w-full rounded-full border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#111827] py-3.5 pl-11 pr-5 text-sm text-[#1A2421] dark:text-white outline-none focus:border-mint focus:ring-2 focus:ring-mint/15"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-7">
          {filteredAreas.map((area) => {
            const selected = selectedAreaId === area.id;
            return (
              <button
                key={area.id}
                type="button"
                aria-pressed={selected}
                onClick={() => chooseArea(area.id)}
                className={`rounded-3xl border p-5 text-left transition-all ${accentClasses[area.accent]} ${selected ? "ring-2 ring-mint shadow-lg shadow-mint/10" : "hover:-translate-y-0.5 hover:shadow-md"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {area.badge && <span className="inline-flex rounded-full bg-[#1A2421] px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-white mb-2">{area.badge}</span>}
                    <h4 className="text-base font-extrabold text-[#1A2421] dark:text-white">{area.title}</h4>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mt-1">{area.specialties.join(" · ")}</p>
                  </div>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${selected ? "bg-mint text-white" : "bg-white/70 dark:bg-white/10 text-slate-400"}`}>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-slate-650 dark:text-[#CBD5E1] mt-4">{area.description}</p>
                <p className="text-[11px] font-bold text-mint-dark dark:text-[#5EEAD4] mt-4">Examples: {area.conditions.slice(0, 3).join(" · ")}</p>
              </button>
            );
          })}
        </div>
        {!filteredAreas.length && (
          <p className="rounded-3xl border border-slate-200 dark:border-white/10 p-8 text-center text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] mt-6">No exact match. Try the body system or a shorter condition name.</p>
        )}
      </section>

      {selectedArea && (
        <section aria-labelledby="specialty-scope-heading" className={`rounded-[2rem] border p-5 md:p-8 ${accentClasses[selectedArea.accent]}`}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-mint">Step 2</span>
              <h3 id="specialty-scope-heading" className="font-serif text-2xl md:text-3xl font-semibold text-[#1A2421] dark:text-white mt-2">What best describes your concern?</h3>
              <p className="text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] mt-2">Choose the closest option. This helps route your assessment; it does not diagnose you or change the fee.</p>

              <div className="flex flex-wrap gap-2 mt-5">
                {[...selectedArea.conditions, "Other or not sure"].map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    aria-pressed={selectedCondition === condition}
                    onClick={() => setSelectedCondition(condition)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-colors ${selectedCondition === condition ? "border-[#1A2421] bg-[#1A2421] text-white" : "border-slate-300 dark:border-white/20 bg-white/65 dark:bg-white/[0.06] text-slate-700 dark:text-[#CBD5E1]"}`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
              {selectedCondition === "Other or not sure" && (
                <label className="block mt-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-[#CBD5E1]">Describe the main concern, if known</span>
                  <input
                    value={otherConcern}
                    onChange={(event) => setOtherConcern(event.target.value)}
                    placeholder="Example: recurring symptoms under evaluation"
                    className="w-full mt-1.5 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0F172A] p-3 text-sm text-[#1A2421] dark:text-white outline-none focus:border-mint"
                  />
                </label>
              )}

              <div className="mt-8">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-mint">Step 3</span>
                <h4 className="text-lg font-extrabold text-[#1A2421] dark:text-white mt-2">How many organ systems seem involved?</h4>
                <p className="text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] mt-1">This is a patient-friendly complexity indicator only. Your physician will confirm the actual clinical scope.</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                  {ORGAN_SYSTEM_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={organSystemBreadth === option.value}
                      onClick={() => setOrganSystemBreadth(option.value)}
                      className={`rounded-2xl border p-3 text-left transition-colors ${organSystemBreadth === option.value ? "border-mint bg-mint/10 text-[#1A2421] dark:text-white" : "border-slate-200 dark:border-white/15 bg-white/65 dark:bg-white/[0.05] text-slate-600 dark:text-[#CBD5E1]"}`}
                    >
                      <span className="block text-xs font-extrabold">{option.label}</span>
                      <span className="block text-[9px] font-bold opacity-75 mt-1">{option.guidance}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-mint">Step 4</span>
                <h4 className="text-lg font-extrabold text-[#1A2421] dark:text-white mt-2">Would you like to request additional review or coordination?</h4>
                <p className="text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] mt-1">This is a request for discussion—not a booking or an automatic fee. The physician confirms whether it is appropriate.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {EXPERT_REVIEW_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      aria-pressed={requestedExpertReview === option.key}
                      onClick={() => setRequestedExpertReview(option.key)}
                      className={`rounded-2xl border p-3 text-left transition-colors ${requestedExpertReview === option.key ? "border-mint bg-mint/10 text-[#1A2421] dark:text-white" : "border-slate-200 dark:border-white/15 bg-white/65 dark:bg-white/[0.05] text-slate-600 dark:text-[#CBD5E1]"}`}
                    >
                      <span className="block text-xs font-extrabold">{option.title}</span>
                      <span className="block text-[10px] font-semibold leading-relaxed opacity-85 mt-1">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:w-[22rem] space-y-4">
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-400/20 bg-emerald-50/80 dark:bg-emerald-400/[0.08] p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                <h4 className="text-xs font-extrabold text-[#1A2421] dark:text-white mt-3">Support boundary</h4>
                <p className="text-[11px] font-semibold leading-relaxed text-slate-650 dark:text-[#CBD5E1] mt-1.5">{selectedArea.supportBoundary}</p>
              </div>
              {selectedArea.urgentBoundary && (
                <div className="rounded-2xl border border-amber-200 dark:border-amber-400/25 bg-amber-50/85 dark:bg-amber-400/[0.08] p-4">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  <h4 className="text-xs font-extrabold text-[#1A2421] dark:text-white mt-3">When not to wait</h4>
                  <p className="text-[11px] font-semibold leading-relaxed text-slate-650 dark:text-[#CBD5E1] mt-1.5">{selectedArea.urgentBoundary}</p>
                </div>
              )}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/75 dark:bg-[#111827] p-4">
                <Stethoscope className="h-5 w-5 text-mint" aria-hidden="true" />
                <h4 className="text-xs font-extrabold text-[#1A2421] dark:text-white mt-3">Possible care levels</h4>
                <ul className="space-y-2 mt-2">
                  {selectedArea.allowedTierKeys.map((tierKey) => (
                    <li key={tierKey} className="flex items-start gap-2 text-[11px] font-semibold text-slate-650 dark:text-[#CBD5E1]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-mint mt-0.5" aria-hidden="true" />
                      {SPECIALTY_SUPPORT_TIERS[tierKey].title}
                    </li>
                  ))}
                </ul>
              </div>
              {leadership && (
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/75 dark:bg-[#111827] p-4">
                  <Stethoscope className="h-5 w-5 text-mint" aria-hidden="true" />
                  <h4 className="text-xs font-extrabold text-[#1A2421] dark:text-white mt-3">Who leads your care</h4>
                  <p className="text-[11px] font-semibold leading-relaxed text-slate-650 dark:text-[#CBD5E1] mt-1.5">{leadership.careLead}</p>
                  <p className="text-[11px] font-semibold leading-relaxed text-slate-650 dark:text-[#CBD5E1] mt-2">{leadership.referralGuidance}</p>
                </div>
              )}
            </aside>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10">
            <p className="max-w-2xl text-xs font-semibold leading-relaxed text-slate-600 dark:text-[#CBD5E1]">No payment is requested now. A physician first confirms diagnosis status, suitability, care intensity, duration, scope, and the fixed total.</p>
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => {
                if (!selectedArea || !organSystemBreadth || !resolvedCondition) return;
                onContinue({ areaId: selectedArea.id, condition: resolvedCondition, organSystemBreadth, requestedExpertReview });
              }}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1A2421] px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-[#2b3a36] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to Clinical Assessment <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
