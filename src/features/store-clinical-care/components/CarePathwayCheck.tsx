import React from "react";
import { Activity, AlertTriangle, CalendarClock, Sparkles } from "lucide-react";
import type { PreliminaryCareRecommendation } from "../domain/types";

export type CareFamilyAnswer = "acute" | "chronic" | "unsure";
export type SupportIntensity = "standard" | "closer" | "frequent" | "direct" | "unsure";
export type SafetyStatus = "clear" | "unsure" | "red-flag";

export interface CarePathwayCheckAnswers {
  careFamily?: CareFamilyAnswer;
  supportIntensity?: SupportIntensity;
  safetyStatus?: SafetyStatus;
}

interface CarePathwayCheckProps {
  answers: CarePathwayCheckAnswers;
  recommendation: PreliminaryCareRecommendation;
  onChange: (answers: CarePathwayCheckAnswers) => void;
}

const choiceClass = (selected: boolean) =>
  `rounded-2xl border px-4 py-3 text-left text-xs font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
    selected
      ? "border-mint bg-mint/10 text-[#1A2421] ring-1 ring-mint/20"
      : "border-slate-200 bg-white/80 text-slate-600 hover:border-mint/50"
  }`;

export const CarePathwayCheck: React.FC<CarePathwayCheckProps> = ({
  answers,
  recommendation,
  onChange,
}) => {
  const completed = Number(Boolean(answers.careFamily))
    + Number(Boolean(answers.supportIntensity))
    + Number(Boolean(answers.safetyStatus));

  return (
    <section aria-labelledby="pathway-check-heading" className="mb-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_20px_70px_rgba(26,36,33,0.08)]">
      <div className="border-b border-slate-200 bg-[#1A2421] px-6 py-6 text-white md:px-8">
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-mint">
          <Sparkles className="h-4 w-4" aria-hidden="true" /> 60-second pathway check
        </span>
        <h2 id="pathway-check-heading" className="mt-2 font-serif text-3xl font-semibold md:text-4xl">Start with three simple questions</h2>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-slate-300">
          No personal details are required. This guide separates acute and chronic care, checks the emergency boundary, and never prices by diagnosis or organ count.
        </p>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-3 md:p-8">
        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <legend className="sr-only">Care timeframe</legend>
          <div className="flex items-center gap-2 text-sm font-black text-[#1A2421]"><CalendarClock className="h-4 w-4 text-mint" /> Which best describes the need?</div>
          <div className="mt-4 grid gap-2">
            {([["acute", "Recent or short-term"], ["chronic", "Ongoing or recurring"], ["unsure", "Not sure yet"]] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={answers.careFamily === value} onClick={() => onChange({ ...answers, careFamily: value })} className={choiceClass(answers.careFamily === value)}>{label}</button>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <legend className="sr-only">Support intensity</legend>
          <div className="flex items-center gap-2 text-sm font-black text-[#1A2421]"><Activity className="h-4 w-4 text-mint" /> Follow-up workload expected</div>
          <div className="mt-4 grid gap-2">
            {([["standard", "Standard planned review"], ["closer", "Closer review / records"], ["frequent", "Frequent review / coordination"], ["direct", "Direct supervision"], ["unsure", "Not sure yet"]] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={answers.supportIntensity === value} onClick={() => onChange({ ...answers, supportIntensity: value })} className={choiceClass(answers.supportIntensity === value)}>{label}</button>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <legend className="sr-only">Emergency warning signs</legend>
          <div className="flex items-center gap-2 text-sm font-black text-[#1A2421]"><AlertTriangle className="h-4 w-4 text-amber-600" /> Emergency warning signs now?</div>
          <div className="mt-4 grid gap-2">
            {([["clear", "No warning signs"], ["unsure", "Not sure"], ["red-flag", "Yes"]] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={answers.safetyStatus === value} onClick={() => onChange({ ...answers, safetyStatus: value })} className={choiceClass(answers.safetyStatus === value)}>{label}</button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mx-6 mb-6 rounded-3xl border border-mint/25 bg-mint/[0.06] p-5 md:mx-8 md:mb-8 md:flex md:items-center md:justify-between md:gap-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-mint-dark">Preliminary recommendation</span>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#1A2421]">
            {completed === 0 ? "Answer the questions to identify a safe starting point" : recommendation.blockedBySafetyGate ? "Urgent assessment before plan selection" : recommendation.suggestedTierName}
          </h3>
          {completed > 0 && <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600">{recommendation.rationale}</p>}
        </div>
        <span className="mt-4 inline-flex shrink-0 rounded-full bg-[#1A2421] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white md:mt-0">{completed}/3 answered</span>
      </div>
    </section>
  );
};
