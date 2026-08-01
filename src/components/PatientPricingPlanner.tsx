"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, ShieldCheck, Stethoscope } from "lucide-react";
import {
  CARE_LEVELS_DETAILS,
  COMPLETE_HEALTH_TRANSFORMATION_DURATIONS,
  COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE,
  PUBLIC_CARE_LEVEL_KEYS,
  RECORDS_PATHOLOGY_REVIEW_PRICE,
  calculateCarePrice,
  toPublicCarePathway,
  type CarePriceSummary,
  type PublicCarePathwayKey,
} from "@/lib/pricingConfig";

export interface PatientPricingSelection {
  pathway: PublicCarePathwayKey | "comprehensive";
  durationWeeks: number;
  organSystemBreadth?: OrganSystemBreadth;
  additionalAcuteEpisode: boolean;
  priorityAcuteSupport: boolean;
  recordsPathologyReview: boolean;
  durationPendingConfirmation?: boolean;
  summary: CarePriceSummary;
}

export type OrganSystemBreadth = "1" | "2-3" | "4-5" | "6+" | "unsure";

const ORGAN_SYSTEM_OPTIONS: ReadonlyArray<{ value: OrganSystemBreadth; label: string }> = [
  { value: "1", label: "1 system" },
  { value: "2-3", label: "2–3 systems" },
  { value: "4-5", label: "4–5 systems" },
  { value: "6+", label: "6+ systems" },
  { value: "unsure", label: "Not sure" },
];

const ORGAN_SYSTEM_GUIDANCE: Record<OrganSystemBreadth, string> = {
  "1": "One body system can still need any pathway; duration and clinical intensity matter more than count alone.",
  "2-3": "Related symptoms across a few systems often fit Constitutional or Advanced Care. Your physician will review how they interact.",
  "4-5": "Advanced assessment is commonly appropriate when several systems interact, but the count does not increase the fee automatically.",
  "6+": "A physician may consider Advanced Care or the Complete program when many systems require intensive coordination—not because of count alone.",
  unsure: "That is completely fine. Your physician will map the involved systems from your history and reports.",
};

export const getOrganSystemBreadthLabel = (value?: OrganSystemBreadth) =>
  ORGAN_SYSTEM_OPTIONS.find((option) => option.value === value)?.label;

const isOrganSystemBreadth = (value: unknown): value is OrganSystemBreadth =>
  ORGAN_SYSTEM_OPTIONS.some((option) => option.value === value);

interface PatientPricingPlannerProps {
  onContinue?: (selection: PatientPricingSelection) => void;
  showComparison?: boolean;
}

const STORAGE_KEY = "homeo_care_pathway_selection_v2";

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function PatientPricingPlanner({
  onContinue,
  showComparison = true,
}: PatientPricingPlannerProps) {
  const [pathway, setPathway] = useState<PublicCarePathwayKey>("moderate");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [additionalAcuteEpisode, setAdditionalAcuteEpisode] = useState(false);
  const [priorityAcuteSupport, setPriorityAcuteSupport] = useState(false);
  const [recordsPathologyReview, setRecordsPathologyReview] = useState(false);
  const [organSystemBreadth, setOrganSystemBreadth] = useState<OrganSystemBreadth | undefined>();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const requestedPathway = params.get("pathway") || params.get("level") || params.get("careLevel");
      const legacyCycle = params.get("cycle") || params.get("billingCycle");
      const rawRequestedDuration = Number(params.get("weeks") || params.get("duration") || params.get("durationValue"));
      const requestedDuration = legacyCycle === "monthly" ? rawRequestedDuration * 4 : rawRequestedDuration;
      const currentStored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Partial<PatientPricingSelection> | null;
      const legacySaved = JSON.parse(localStorage.getItem("homeo_saved_configs") || "[]") as Array<{
        careLevel?: string;
        billingCycle?: "weekly" | "monthly";
        durationValue?: number;
      }>;
      const latestLegacy = legacySaved.at(-1);
      const stored = currentStored || (latestLegacy
        ? {
            pathway: toPublicCarePathway(latestLegacy.careLevel || "moderate"),
            durationWeeks: latestLegacy.billingCycle === "monthly"
              ? (latestLegacy.durationValue || 1) * 4
              : latestLegacy.durationValue || 1,
          }
        : null);
      const nextPathway = requestedPathway
        ? toPublicCarePathway(requestedPathway)
        : stored?.pathway
          ? toPublicCarePathway(stored.pathway)
          : "moderate";
      const allowedDurations = CARE_LEVELS_DETAILS[nextPathway].durations;
      const nextDuration = allowedDurations.includes(requestedDuration)
        ? requestedDuration
        : allowedDurations.includes(stored?.durationWeeks || 0)
          ? stored!.durationWeeks!
          : CARE_LEVELS_DETAILS[nextPathway].defaultDurationWeeks;
      const requestedOrganSystemBreadth = params.get("systems");
      const nextOrganSystemBreadth = isOrganSystemBreadth(requestedOrganSystemBreadth)
        ? requestedOrganSystemBreadth
        : isOrganSystemBreadth(stored?.organSystemBreadth)
          ? stored.organSystemBreadth
          : undefined;

      setPathway(nextPathway);
      setDurationWeeks(nextDuration);
      setAdditionalAcuteEpisode(nextPathway === "mild" && (params.get("extraAcute") === "1" || Boolean(stored?.additionalAcuteEpisode)));
      setPriorityAcuteSupport(nextPathway === "mild" && (params.get("priority") === "1" || Boolean(stored?.priorityAcuteSupport)));
      setRecordsPathologyReview(params.get("recordsReview") === "1" || Boolean(stored?.recordsPathologyReview));
      setOrganSystemBreadth(nextOrganSystemBreadth);
    } catch {
      // Invalid or legacy browser data falls back to the recommended pathway.
    }
  }, []);

  const summary = useMemo(
    () =>
      calculateCarePrice({
        pathway,
        durationWeeks,
        additionalAcuteEpisode,
        priorityAcuteSupport,
        recordsPathologyReview,
      }),
    [additionalAcuteEpisode, durationWeeks, pathway, priorityAcuteSupport, recordsPathologyReview],
  );

  const selection = useMemo<PatientPricingSelection>(
    () => ({
      pathway,
      durationWeeks,
      additionalAcuteEpisode,
      priorityAcuteSupport,
      recordsPathologyReview,
      organSystemBreadth,
      summary,
    }),
    [additionalAcuteEpisode, durationWeeks, organSystemBreadth, pathway, priorityAcuteSupport, recordsPathologyReview, summary],
  );

  const completeSelection = useMemo<PatientPricingSelection>(
    () => ({
      pathway: "comprehensive",
      durationWeeks: 0,
      organSystemBreadth,
      additionalAcuteEpisode: false,
      priorityAcuteSupport: false,
      recordsPathologyReview: false,
      durationPendingConfirmation: true,
      summary: {
        baseCareTotal: COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE,
        additionalAcuteEpisodeTotal: 0,
        priorityAcuteSupportTotal: 0,
        recordsPathologyReviewTotal: 0,
        total: COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE,
      },
    }),
    [organSystemBreadth],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // Pricing remains fully usable when browser storage is unavailable.
    }
  }, [selection]);

  const selectPathway = (nextPathway: PublicCarePathwayKey) => {
    setPathway(nextPathway);
    setDurationWeeks(CARE_LEVELS_DETAILS[nextPathway].defaultDurationWeeks);
    if (nextPathway !== "mild") {
      setAdditionalAcuteEpisode(false);
      setPriorityAcuteSupport(false);
    }
  };

  const activeDetail = CARE_LEVELS_DETAILS[pathway];
  const queryParams = new URLSearchParams({
    pathway,
    weeks: String(durationWeeks),
    extraAcute: additionalAcuteEpisode ? "1" : "0",
    priority: priorityAcuteSupport ? "1" : "0",
    recordsReview: recordsPathologyReview ? "1" : "0",
  });
  if (organSystemBreadth) queryParams.set("systems", organSystemBreadth);
  const query = queryParams.toString();

  return (
    <div className="patient-pricing-planner space-y-10">
      <section aria-labelledby="pathway-heading" className="space-y-6">
        <div className="max-w-3xl">
          <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Step 1</span>
          <h2 id="pathway-heading" className="font-serif text-3xl md:text-4xl font-semibold text-[#1A2421] mt-2">
            Which best describes the care you need?
          </h2>
          <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-3">
            Choose the closest pathway. A physician reviews your clinical assessment and confirms suitability before treatment begins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {PUBLIC_CARE_LEVEL_KEYS.map((key) => {
            const detail = CARE_LEVELS_DETAILS[key];
            const selected = pathway === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => selectPathway(key)}
                className={`pricing-pathway-card relative rounded-3xl border p-6 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 ${
                  selected
                    ? "border-mint bg-mint/[0.055] shadow-[0_16px_50px_rgba(20,184,166,0.12)]"
                    : "border-slate-200/80 bg-white/55 hover:border-mint/40 hover:bg-white/80"
                }`}
              >
                {key === "moderate" && (
                  <span className="pricing-recommended-badge absolute right-5 top-5 rounded-full bg-[#1A2421] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                    Recommended
                  </span>
                )}
                <span className="text-2xl" aria-hidden="true">{detail.icon}</span>
                <h3 className="font-serif text-xl font-bold text-[#1A2421] mt-4 pr-20">{detail.title}</h3>
                {detail.subtitle && <p className="text-xs font-bold text-mint-dark mt-1">{detail.subtitle}</p>}
                <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-3">{detail.description}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  {detail.pricePrefix && <span className="text-xs font-black uppercase text-slate-500">From</span>}
                  <span className="text-3xl font-black text-[#1A2421]">{formatPrice(detail.weeklyPrice)}</span>
                  <span className="text-xs font-bold text-slate-500">/week</span>
                </div>
                <ul className="mt-5 space-y-2">
                  {detail.bestFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-mint shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="organ-system-heading" className="pricing-panel rounded-3xl border border-slate-200 bg-white/55 p-6 md:p-8">
        <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Optional complexity guide</span>
        <h2 id="organ-system-heading" className="text-xl font-bold text-[#1A2421] mt-1">How many body systems appear to be involved?</h2>
        <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-2 max-w-3xl">
          This helps your physician understand case breadth. It is a patient-friendly assessment indicator and never changes the price automatically.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5" role="group" aria-label="Number of body systems involved">
          {ORGAN_SYSTEM_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={organSystemBreadth === option.value}
              onClick={() => setOrganSystemBreadth(option.value)}
              className={`pricing-option rounded-2xl border px-4 py-3 text-sm font-black text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
                organSystemBreadth === option.value
                  ? "border-mint bg-mint/[0.08] text-[#1A2421] ring-1 ring-mint/10"
                  : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="pricing-subtle-panel rounded-2xl border border-mint/15 bg-mint/[0.025] p-4 mt-4">
          <p className="text-xs font-semibold text-slate-650 leading-relaxed">
            {organSystemBreadth
              ? ORGAN_SYSTEM_GUIDANCE[organSystemBreadth]
              : "Select the closest estimate if you know it, or choose “Not sure.” Examples include skin, respiratory, digestive, endocrine, joints, urinary, cardiovascular, neurological, reproductive, and mental-emotional systems."}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="pricing-panel lg:col-span-7 glass-panel border-white/60 bg-white/45 rounded-3xl p-6 md:p-8 space-y-7">
          <div>
            <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Step 2</span>
            <h2 className="text-xl font-bold text-[#1A2421] mt-1">Select a care duration</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Each option shows the complete care fee for that period.</p>
          </div>

          <div className={`grid grid-cols-2 ${activeDetail.durations.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"} gap-3`}>
            {activeDetail.durations.map((weeks) => (
              <button
                key={weeks}
                type="button"
                aria-pressed={durationWeeks === weeks}
                onClick={() => setDurationWeeks(weeks)}
                className={`pricing-option rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
                  durationWeeks === weeks
                    ? "border-mint bg-mint/[0.06] ring-1 ring-mint/10"
                    : "border-slate-200 bg-white/70 hover:border-slate-400"
                }`}
              >
                <span className="block text-sm font-black text-[#1A2421]">{weeks} {weeks === 1 ? "week" : "weeks"}</span>
                <span className="block text-lg font-black text-mint-dark mt-1">{formatPrice(activeDetail.weeklyPrice * weeks)}</span>
                {weeks === 4 && (pathway === "moderate" || pathway === "focused") && (
                  <span className="inline-flex rounded-full bg-[#1A2421] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white mt-2">Recommended</span>
                )}
                {weeks === 2 && (pathway === "moderate" || pathway === "focused") && (
                  <span className="block text-[10px] font-bold text-slate-500 mt-2">Short initial period</span>
                )}
              </button>
            ))}
          </div>

          {(pathway === "moderate" || pathway === "focused") && (
            <div className="pricing-info-panel rounded-2xl border border-sky-200/70 bg-sky-50/50 p-4 text-xs font-semibold text-slate-700 leading-relaxed">
              <strong className="text-sky-800">Why 4 weeks is recommended:</strong> It usually provides a clearer initial review period. A 2-week period is available when a shorter first review is appropriate; your physician confirms or adjusts the duration before treatment.
            </div>
          )}

          <div className="pricing-subtle-panel rounded-2xl border border-mint/15 bg-mint/[0.025] p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A2421]">Your care scope</h3>
            <p className="text-sm font-semibold text-slate-650 leading-relaxed mt-2">{activeDetail.scopeMessage}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A2421]">Optional clinical support</h3>
            {pathway === "mild" && (
              <>
                <label className="pricing-option flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/65 p-4 cursor-pointer">
                  <input type="checkbox" checked={additionalAcuteEpisode} onChange={(event) => setAdditionalAcuteEpisode(event.target.checked)} className="mt-1 accent-teal-600" />
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-[#1A2421]">Additional unrelated acute episode</span>
                    <span className="block text-xs font-semibold text-slate-500 mt-1">A separate acute assessment during the selected care period.</span>
                  </span>
                  <span className="text-sm font-black text-[#1A2421]">+₹1,000</span>
                </label>
                <label className="pricing-option flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/65 p-4 cursor-pointer">
                  <input type="checkbox" checked={priorityAcuteSupport} onChange={(event) => setPriorityAcuteSupport(event.target.checked)} className="mt-1 accent-teal-600" />
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-[#1A2421]">Priority Acute Support</span>
                    <span className="block text-xs font-semibold text-slate-500 mt-1">Priority access and closer short-term monitoring. Not emergency care.</span>
                  </span>
                  <span className="text-sm font-black text-[#1A2421]">+₹2,000/week</span>
                </label>
              </>
            )}
            <label className="pricing-option flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/65 p-4 cursor-pointer">
              <input type="checkbox" checked={recordsPathologyReview} onChange={(event) => setRecordsPathologyReview(event.target.checked)} className="mt-1 accent-teal-600" />
              <span className="flex-1">
                <span className="block text-sm font-bold text-[#1A2421]">Advanced Records & Pathology Review</span>
                <span className="block text-xs font-semibold text-slate-500 mt-1">For substantial reports, prior prescriptions, or multi-system investigations.</span>
              </span>
              <span className="text-sm font-black text-[#1A2421]">from {formatPrice(RECORDS_PATHOLOGY_REVIEW_PRICE)}</span>
            </label>
          </div>
        </div>

        <aside className="pricing-panel lg:col-span-5 glass-panel border-mint/20 bg-white/60 rounded-3xl p-6 md:p-8 lg:sticky lg:top-28">
          <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Selected care</span>
          <h2 className="font-serif text-2xl font-bold text-[#1A2421] mt-2">{activeDetail.title}</h2>
          {activeDetail.subtitle && <p className="text-xs font-bold text-slate-600 mt-1">{activeDetail.subtitle}</p>}

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Duration</dt><dd className="font-bold text-[#1A2421]">{durationWeeks} {durationWeeks === 1 ? "week" : "weeks"}</dd></div>
            {organSystemBreadth && <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Reported case breadth</dt><dd className="font-bold text-[#1A2421] text-right">{getOrganSystemBreadthLabel(organSystemBreadth)}</dd></div>}
            <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Care fee</dt><dd className="font-bold text-[#1A2421]">{formatPrice(summary.baseCareTotal)}</dd></div>
            {summary.additionalAcuteEpisodeTotal > 0 && <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Additional acute assessment</dt><dd className="font-bold text-[#1A2421]">+{formatPrice(summary.additionalAcuteEpisodeTotal)}</dd></div>}
            {summary.priorityAcuteSupportTotal > 0 && <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Priority support</dt><dd className="font-bold text-[#1A2421]">+{formatPrice(summary.priorityAcuteSupportTotal)}</dd></div>}
            {summary.recordsPathologyReviewTotal > 0 && <div className="flex justify-between gap-4"><dt className="font-semibold text-slate-500">Records review</dt><dd className="font-bold text-[#1A2421]">+{formatPrice(summary.recordsPathologyReviewTotal)}</dd></div>}
          </dl>

          <div className="border-t border-slate-200 mt-5 pt-5">
            <span className="text-xs font-bold text-slate-500">Care-period total{activeDetail.pricePrefix ? " from" : ""}</span>
            <div className="text-4xl font-black text-[#1A2421] mt-1">{formatPrice(summary.total)}</div>
          </div>

          <div className="pricing-dark-surface rounded-2xl bg-[#1A2421] text-white p-4 mt-6 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-mint shrink-0" aria-hidden="true" />
            <p className="text-xs font-semibold leading-relaxed">A physician confirms pathway suitability, care scope, and any “from” pricing before treatment begins.</p>
          </div>

          {onContinue ? (
            <button type="button" onClick={() => onContinue(selection)} className="pricing-primary-action w-full mt-5 py-4 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2">
              Continue to Clinical Assessment <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <Link href={`/store?${query}`} className="pricing-primary-action w-full mt-5 py-4 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2">
              Continue to Clinical Assessment <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
          <p className="text-center text-[11px] font-semibold text-slate-500 leading-relaxed mt-3">
            No payment at this step. Submit details → physician review → pathway, scope, and fee confirmed.
          </p>
        </aside>
      </section>

      {showComparison && (
        <section aria-labelledby="comparison-heading" className="space-y-5">
          <div className="max-w-3xl">
            <h2 id="comparison-heading" className="font-serif text-3xl font-semibold text-[#1A2421]">Compare the three pathways</h2>
            <p className="text-sm text-slate-600 font-semibold mt-2">The meaningful difference is clinical scope and follow-up—not the number of symptoms you enter.</p>
          </div>
          <div className="pricing-table overflow-x-auto rounded-3xl border border-slate-200 bg-white/60">
            <table className="w-full min-w-[760px] text-left">
              <thead className="pricing-dark-surface bg-[#1A2421] text-white">
                <tr>
                  <th className="p-4 text-xs uppercase tracking-wider">Care pathway</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Best suited to</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Included scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {PUBLIC_CARE_LEVEL_KEYS.map((key) => {
                  const detail = CARE_LEVELS_DETAILS[key];
                  return (
                    <tr key={key}>
                      <td className="p-4 align-top"><strong className="text-[#1A2421]">{detail.title}</strong><span className="block text-xs font-bold text-mint-dark mt-1">{detail.pricePrefix ? "From " : ""}{formatPrice(detail.weeklyPrice)}/week</span></td>
                      <td className="p-4 align-top text-sm font-semibold text-slate-600">{detail.bestFor.join("; ")}</td>
                      <td className="p-4 align-top text-sm font-semibold text-slate-600">{detail.scopeMessage}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section aria-labelledby="fee-inclusions-heading" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="pricing-panel rounded-3xl border border-mint/20 bg-mint/[0.035] p-6 md:p-7">
          <h2 id="fee-inclusions-heading" className="font-serif text-2xl font-semibold text-[#1A2421]">What the care fee includes</h2>
          <ul className="mt-5 space-y-3">
            {["Physician consultation and clinical assessment", "Individualized treatment plan for the agreed scope", "Scheduled follow-up during the confirmed care period", "Prescribed standard homeopathic remedy supply for the agreed care period"].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-semibold text-slate-650">
                <CheckCircle2 className="w-4 h-4 text-mint shrink-0 mt-0.5" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed mt-5">Follow-up frequency and the WhatsApp response window are documented in the physician-confirmed plan. This service is not emergency medical care.</p>
        </div>
        <div className="pricing-panel rounded-3xl border border-slate-200 bg-white/60 p-6 md:p-7">
          <h2 className="font-serif text-2xl font-semibold text-[#1A2421]">Possible additional fees</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-5"><dt className="font-semibold text-slate-600">Advanced Records & Pathology Review</dt><dd className="font-black text-[#1A2421] whitespace-nowrap">from ₹3,000</dd></div>
            <div className="flex justify-between gap-5"><dt className="font-semibold text-slate-600">Priority Acute Support, when assigned</dt><dd className="font-black text-[#1A2421] whitespace-nowrap">+₹2,000/week</dd></div>
            <div className="flex justify-between gap-5"><dt className="font-semibold text-slate-600">Domestic courier</dt><dd className="font-black text-[#1A2421] whitespace-nowrap">₹300</dd></div>
            <div className="flex justify-between gap-5"><dt className="font-semibold text-slate-600">International delivery</dt><dd className="font-black text-[#1A2421] whitespace-nowrap">at dispatch</dd></div>
          </dl>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed mt-5">Advanced Care does not increase automatically because more symptoms or organ systems are discussed. If the required supervision is substantially more intensive, the physician recommends the Complete program instead.</p>
        </div>
      </section>

      <section id="complete-health-transformation" aria-labelledby="complete-program-heading" className="pricing-complete relative overflow-hidden rounded-[2rem] border border-mint/25 bg-[#1A2421] p-6 md:p-9 text-white shadow-[0_24px_70px_rgba(26,36,33,0.18)]">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-mint/15 blur-3xl" aria-hidden="true" />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-mint">
              <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" /> Clinician-assigned program
            </span>
            <h2 id="complete-program-heading" className="font-serif text-3xl md:text-4xl font-semibold mt-4">Complete Health Transformation Program</h2>
            <p className="text-sm md:text-base font-semibold text-slate-300 leading-relaxed mt-3 max-w-2xl">
              For exceptionally intensive cases requiring frequent review, coordinated treatment adjustments, and direct physician supervision—not simply a higher number of symptoms or organ systems.
            </p>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl font-black">{formatPrice(COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE)}</span>
              <span className="text-sm font-bold text-slate-300">/week</span>
            </div>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Clinically relevant conditions within the agreed scope", "Comprehensive constitutional assessment", "High-frequency monitoring and direct physician guidance", "Available only after clinical assessment"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-mint shrink-0" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-white/[0.06] p-5 md:p-6 backdrop-blur-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-mint">Indicative care-period totals</h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {COMPLETE_HEALTH_TRANSFORMATION_DURATIONS.map((weeks) => (
                <div key={weeks} className="rounded-2xl border border-white/15 bg-white/[0.03] p-3">
                  <span className="block text-xs font-black">{weeks} weeks</span>
                  <span className="block text-sm font-black text-mint mt-1">{formatPrice(weeks * COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-300 leading-relaxed mt-4">
              These totals are references, not selectable packages. Your physician recommends the appropriate duration and confirms scope and final fee after assessment. This is individual—not family—care, and outcomes vary by individual clinical response.
            </p>
            <div className="rounded-2xl border border-mint/20 bg-mint/10 p-4 mt-4 text-xs font-semibold text-slate-200 leading-relaxed">
              <strong className="text-mint">Transparent intensive-care example:</strong> Program ₹10,000/week + physician-assigned Priority Acute Support ₹2,000/week = ₹12,000 for that week.
            </div>
            {onContinue ? (
              <button type="button" onClick={() => onContinue(completeSelection)} className="pricing-primary-action w-full mt-5 py-4 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A2421]">
                Request Clinical Assessment <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <Link href="/store#complete-health-transformation" className="pricing-primary-action w-full mt-5 py-4 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A2421]">
                Request Clinical Assessment <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
            <p className="text-center text-[11px] font-semibold text-slate-300 leading-relaxed mt-3">No payment at this step. Submit details → physician review → program suitability, duration, scope, and fee confirmed.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="pricing-faq-heading" className="pricing-panel rounded-3xl border border-slate-200 bg-white/60 p-6 md:p-8">
        <h2 id="pricing-faq-heading" className="font-serif text-2xl md:text-3xl font-semibold text-[#1A2421]">Before you continue</h2>
        <div className="mt-5 divide-y divide-slate-200">
          {[
            ["Can the physician recommend a different pathway?", "Yes. The assessment request is not a purchase. Your physician may recommend a simpler or more intensive pathway before any payment."],
            ["Are remedies and delivery included?", "Prescribed standard homeopathic remedies for the agreed care period are included. Domestic courier is ₹300; international delivery is calculated at dispatch."],
            ["Why might Advanced Care cost more than ₹5,000/week?", "The care fee starts at ₹5,000/week. Substantial records or pathology review is shown separately from ₹3,000. There is no automatic charge per symptom or organ system."],
            ["What if I need urgent or emergency treatment?", "Priority Acute Support is not emergency care. For severe, rapidly worsening, or life-threatening symptoms, seek appropriate emergency medical services immediately."],
            ["What are the cancellation and refund terms?", "No payment is taken with the assessment request. Any cancellation or refund terms for the confirmed individualized plan are provided in writing before payment."],
          ].map(([question, answer]) => (
            <details key={question} className="group py-4">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-bold text-[#1A2421] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded-lg">
                {question}<span className="text-mint text-lg group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
              </summary>
              <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-3 pr-8">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="pricing-panel rounded-3xl border border-slate-200 bg-white/55 p-6 flex gap-4">
          <Stethoscope className="w-6 h-6 text-mint shrink-0" aria-hidden="true" />
          <div><h2 className="text-base font-bold text-[#1A2421]">Not sure which pathway fits?</h2><p className="text-sm font-semibold text-slate-600 leading-relaxed mt-1">Choose the closest description and continue. Your physician can recommend a different pathway or duration after reviewing your assessment.</p></div>
      </section>
    </div>
  );
}
