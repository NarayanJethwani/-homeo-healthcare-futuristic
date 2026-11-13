import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HeartHandshake,
  HelpCircle,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ClinicalCareHeader } from "./ClinicalCareHeader";
import { CareFeeCalculator } from "./CareFeeCalculator";
import { IncludedServicesList } from "./IncludedServicesList";
import { ClinicalCareFAQ } from "./ClinicalCareFAQ";
import { EmergencyGuidanceBanner } from "./EmergencyGuidanceBanner";
import {
  CARE_FEE_CARD_LEVELS,
  type CareEstimateResult,
  type ClinicalConcernInput,
} from "../domain/types";
import { trackStoreFunnelEvent } from "../services/storeAnalytics";

export const StoreClinicalCareV2View: React.FC = () => {
  const [activeEstimate, setActiveEstimate] = useState<CareEstimateResult | null>(null);
  const [activeConcerns, setActiveConcerns] = useState<ClinicalConcernInput[]>([]);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [intakeSubmitted, setIntakeSubmitted] = useState(false);

  // Intake Form Fields
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientCity, setPatientCity] = useState("");
  const [patientNotes, setPatientNotes] = useState("");

  const intakeFormRef = useRef<HTMLDivElement>(null);

  const handleProceedToReview = (estimate: CareEstimateResult, concerns: ClinicalConcernInput[]) => {
    setActiveEstimate(estimate);
    setActiveConcerns(concerns);
    setIntakeOpen(true);
    window.setTimeout(() => {
      intakeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) return;

    trackStoreFunnelEvent("store_assessment_submitted", {
      durationWeeks: activeEstimate?.effectiveDurationWeeks,
      healthAreas: activeEstimate?.systemGroups.length,
    });

    setIntakeSubmitted(true);
  };

  return (
    <main className="store-care-page min-h-screen px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-mint"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Main Platform
        </Link>

        {/* Existing Site Header Component */}
        <ClinicalCareHeader />

        {/* Top 3 Trust Badges (Existing Site Style) */}
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            "No payment before physician review",
            "Routine prescribed medicines included",
            "Every additional fee requires approval",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs font-bold text-slate-700 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-mint" />
              {item}
            </div>
          ))}
        </div>

        {/* SECTION 1: THREE CARE LEVEL CARDS (Existing Card Design & Colors) */}
        <section aria-labelledby="care-levels-heading" className="mb-14 scroll-mt-28">
          <div className="max-w-4xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-mint">
              Transparent Care Fee Schedule
            </span>
            <h2 id="care-levels-heading" className="mt-2 font-serif text-3xl md:text-5xl font-semibold text-[#1A2421]">
              Three Clinical Care Levels
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600">
              Clear weekly rates with routine prescribed medicines included. Your physician confirms your level and clinical scope before any payment is requested.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Mild Concern Card */}
            <div className="relative flex flex-col rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 md:p-8 text-left transition-all hover:-translate-y-1 hover:border-mint/50 hover:shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-widest text-mint bg-mint/10 px-2.5 py-1 rounded-full self-start">
                Level 1
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-[#1A2421]">
                {CARE_FEE_CARD_LEVELS.mild.name}
              </h3>
              <p className="mt-3 min-h-[3.5rem] text-sm font-semibold leading-relaxed text-slate-600">
                {CARE_FEE_CARD_LEVELS.mild.description}
              </p>
              <div className="mt-5">
                <span className="block text-3xl font-black text-[#1A2421]">₹1,000</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">Per week · 1 or 2 weeks allowed</span>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Example conditions:
                </span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {CARE_FEE_CARD_LEVELS.mild.examples.join(", ")}
                </p>
              </div>
              <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>Routine prescribed medicines included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>No investigative reports needed</span>
                </li>
              </ul>
            </div>

            {/* Moderate Concern Card */}
            <div className="relative flex flex-col rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 md:p-8 text-left transition-all hover:-translate-y-1 hover:border-mint/50 hover:shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-widest text-mint bg-mint/10 px-2.5 py-1 rounded-full self-start">
                Level 2
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-[#1A2421]">
                {CARE_FEE_CARD_LEVELS.moderate.name}
              </h3>
              <p className="mt-3 min-h-[3.5rem] text-sm font-semibold leading-relaxed text-slate-600">
                {CARE_FEE_CARD_LEVELS.moderate.description}
              </p>
              <div className="mt-5">
                <span className="block text-3xl font-black text-[#1A2421]">₹2,000</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">Per week · 2-week minimum</span>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Example conditions:
                </span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {CARE_FEE_CARD_LEVELS.moderate.examples.join(", ")}
                </p>
              </div>
              <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>Routine prescribed medicines included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>Report analysis & symptom monitoring</span>
                </li>
              </ul>
            </div>

            {/* Complex / Whole-System Card */}
            <div className="relative flex flex-col rounded-[1.75rem] border border-slate-200 bg-white/85 p-6 md:p-8 text-left transition-all hover:-translate-y-1 hover:border-mint/50 hover:shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-widest text-mint bg-mint/10 px-2.5 py-1 rounded-full self-start">
                Level 3 · Whole-System
              </span>
              <h3 className="mt-3 font-serif text-2xl font-bold text-[#1A2421]">
                {CARE_FEE_CARD_LEVELS.complex.name}
              </h3>
              <p className="mt-3 min-h-[3.5rem] text-sm font-semibold leading-relaxed text-slate-600">
                {CARE_FEE_CARD_LEVELS.complex.description}
              </p>
              <div className="mt-5">
                <span className="block text-3xl font-black text-[#1A2421]">₹3,000</span>
                <span className="mt-1 block text-xs font-bold text-slate-500">Per week · 2-week minimum</span>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Example conditions:
                </span>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  {CARE_FEE_CARD_LEVELS.complex.examples.join(", ")}
                </p>
              </div>
              <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>Routine prescribed medicines included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-mint shrink-0" />
                  <span>Detailed whole-organ system case analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE CARE FEE CALCULATOR */}
        <CareFeeCalculator
          onProceedToReview={handleProceedToReview}
          className="mb-14"
        />

        {/* SECTION 3: HOW YOUR FEE IS COUNTED & EXAMPLE BILLS */}
        <section aria-labelledby="counting-heading" className="mb-14 rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <span className="text-[10px] font-black uppercase tracking-widest text-mint">
                Clinical Billing Rules
              </span>
              <h2 id="counting-heading" className="mt-1 font-serif text-2xl md:text-3xl font-bold text-[#1A2421]">
                How Your Fee Is Counted
              </h2>

              <ol className="mt-6 space-y-4 text-xs font-semibold text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A2421] text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <strong className="block text-sm text-[#1A2421]">
                      Related symptoms in one organ system count as one concern.
                    </strong>
                    <span className="text-slate-500">
                      Symptoms in the same system (e.g. acidity and bloating under digestive) are grouped and billed at the single highest level.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A2421] text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <strong className="block text-sm text-[#1A2421]">
                      Concerns in different organ systems are added together.
                    </strong>
                    <span className="text-slate-500">
                      Your weekly fee is the sum total of all distinct organ system concerns because clinical analysis scales with each affected system.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A2421] text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <strong className="block text-sm text-[#1A2421]">
                      Moderate and complex care starts with a 2-week minimum.
                    </strong>
                    <span className="text-slate-500">
                      Recurring or long-standing conditions require adequate time for remedy action and patient observation.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A2421] text-xs font-bold text-white">
                    4
                  </span>
                  <div>
                    <strong className="block text-sm text-[#1A2421]">
                      As you improve, your level and fee step down.
                    </strong>
                    <span className="text-slate-500">
                      As whole-system symptoms stabilize, your physician steps down the care level (e.g. Complex ₹3,000 → Moderate ₹2,000 → Mild ₹1,000).
                    </span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Example Bills Table */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 md:p-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                Official Reference
              </span>
              <h3 className="font-serif text-lg font-bold text-[#1A2421] mb-4">
                Example Bills
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 pr-2">Case</th>
                      <th className="py-2.5 px-2 text-right">Per week</th>
                      <th className="py-2.5 pl-2 text-right">2 weeks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 font-semibold text-slate-700">
                    <tr>
                      <td className="py-2.5 pr-2 font-bold text-[#1A2421]">Acidity (mild)</td>
                      <td className="py-2.5 px-2 text-right">₹1,000</td>
                      <td className="py-2.5 pl-2 text-right font-bold text-mint-dark">₹2,000</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-2 font-bold text-[#1A2421]">Recurrent sinusitis (moderate)</td>
                      <td className="py-2.5 px-2 text-right">₹2,000</td>
                      <td className="py-2.5 pl-2 text-right font-bold text-mint-dark">₹4,000</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-2 font-bold text-[#1A2421]">Sinusitis + acidity (two systems)</td>
                      <td className="py-2.5 px-2 text-right">₹3,000</td>
                      <td className="py-2.5 pl-2 text-right font-bold text-mint-dark">₹6,000</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-2 font-bold text-[#1A2421]">Complex + moderate + mild (3 systems)</td>
                      <td className="py-2.5 px-2 text-right">₹6,000</td>
                      <td className="py-2.5 pl-2 text-right font-bold text-mint-dark">₹12,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 italic">
                Routine prescribed medicines are included in all care plans.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: INTAKE REQUEST REVIEW FORM (When Triggered) */}
        {intakeOpen && activeEstimate && (
          <div
            ref={intakeFormRef}
            className="mb-14 rounded-[1.75rem] border border-mint/30 bg-white p-6 md:p-8 shadow-sm scroll-mt-28"
          >
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-mint">
                Direct Physician Review
              </span>
              <h2 className="mt-1 font-serif text-2xl md:text-3xl font-bold text-[#1A2421]">
                Request Case Assessment (₹0 Due Now)
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                Provide your basic contact details. Dr. Jethwani will review your selected concerns and confirm clinical suitability before any fee is requested.
              </p>
            </div>

            {intakeSubmitted ? (
              <div className="mt-6 rounded-2xl bg-mint/10 border border-mint/25 p-6 text-center text-slate-800">
                <CheckCircle2 className="h-10 w-10 text-mint mx-auto mb-2" />
                <h3 className="font-serif text-xl font-bold">Request Received Successfully</h3>
                <p className="mt-2 text-xs font-semibold max-w-md mx-auto text-slate-600">
                  Our care coordinator and Dr. Jethwani will review your details and connect with you via WhatsApp / phone to confirm your care level and schedule.
                </p>
                <div className="mt-4">
                  <a
                    href="https://wa.me/918446056789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-xs font-bold text-white hover:bg-mint-dark"
                  >
                    <MessageCircle className="h-4 w-4" /> Message Care Team on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleIntakeSubmit} className="mt-6 space-y-5">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-[#1A2421] block">
                    Calculated Estimate: ₹{activeEstimate.totalEstimateINR.toLocaleString("en-IN")} for {activeEstimate.effectiveDurationWeeks} weeks (₹{activeEstimate.weeklyFeeINR.toLocaleString("en-IN")}/wk)
                  </span>
                  <span className="text-slate-500 block">
                    Concerns: {activeConcerns.map((c) => `${c.name} (${c.organSystemName})`).join(", ")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1.5">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1.5">
                      WhatsApp / Mobile Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1.5">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 38"
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1.5">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={patientCity}
                      onChange={(e) => setPatientCity(e.target.value)}
                      placeholder="e.g. Pune, Mumbai, Bangalore..."
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1.5">
                    Brief Notes / Previous Diagnoses (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    placeholder="Mention any existing medicines, recent blood tests, or specific symptoms..."
                    className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-800 outline-none focus:border-mint focus:ring-1 focus:ring-mint"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded text-mint focus:ring-mint"
                    />
                    <span className="text-xs font-semibold text-slate-700 leading-relaxed">
                      I understand that this service provides planned, non-emergency homeopathic consultation and does not replace emergency medical care.
                      I agree to the{" "}
                      <Link href="/privacy" className="underline font-bold text-[#1A2421]" target="_blank">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="underline font-bold text-[#1A2421]" target="_blank">
                        Telehealth Clinical Consent
                      </Link>. No health information is shared with third parties.
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!consentAgreed}
                    className="rounded-full bg-mint px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-mint-dark disabled:cursor-not-allowed disabled:bg-slate-300 shadow-md transition-all"
                  >
                    Submit for Doctor Review (₹0 Due Now)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntakeOpen(false)}
                    className="rounded-full border border-slate-200 px-5 py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Existing Services, FAQ, Emergency Guidance Components */}
        <IncludedServicesList />
        <ClinicalCareFAQ />
        <EmergencyGuidanceBanner />
      </div>
    </main>
  );
};
