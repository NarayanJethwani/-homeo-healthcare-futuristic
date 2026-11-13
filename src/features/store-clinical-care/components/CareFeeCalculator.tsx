import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  MessageCircle,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  CARE_FEE_CARD_LEVELS,
  STANDARD_ORGAN_SYSTEMS,
  calculateCareEstimate,
  computeSuggestedLevel,
  type CareFeeLevel,
  type ClinicalConcernInput,
  type ClinicalOrganSystemConfig,
  type LevelAdjusterAnswers,
  type CareEstimateResult,
} from "../domain/types";
import { trackStoreFunnelEvent } from "../services/storeAnalytics";

interface ActiveConcernState {
  instanceId: string;
  name: string;
  organSystemId: string;
  organSystemName: string;
  defaultLevel: CareFeeLevel;
  answers: LevelAdjusterAnswers;
  computedLevel: CareFeeLevel;
  chosenLevel: CareFeeLevel;
  isAdjusterOpen: boolean;
}

interface CareFeeCalculatorProps {
  onProceedToReview?: (estimate: CareEstimateResult, concerns: ClinicalConcernInput[]) => void;
  className?: string;
}

export const CareFeeCalculator: React.FC<CareFeeCalculatorProps> = ({
  onProceedToReview,
  className = "",
}) => {
  // 1. Safety Gate State: null = unanswered, "clear" = passed, "red_flag" = blocked
  const [safetyStatus, setSafetyStatus] = useState<"unanswered" | "clear" | "red_flag">("unanswered");
  const [safetyGateAnswer, setSafetyGateAnswer] = useState<string | null>(null);

  // 2. Concern Selection State
  const [concerns, setConcerns] = useState<ActiveConcernState[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string>("all");
  const [durationWeeks, setDurationWeeks] = useState<number>(2);

  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackStoreFunnelEvent("calculator_started");
  }, []);

  const handleSafetyAnswer = (answer: "no" | "yes" | "not_sure") => {
    setSafetyGateAnswer(answer);
    if (answer === "no") {
      setSafetyStatus("clear");
      trackStoreFunnelEvent("safety_gate_passed");
    } else {
      setSafetyStatus("red_flag");
      trackStoreFunnelEvent("safety_gate_passed", { answer: "blocked" });
    }
  };

  const filteredConditions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list: Array<{ name: string; defaultLevel: CareFeeLevel; system: ClinicalOrganSystemConfig }> = [];

    for (const sys of STANDARD_ORGAN_SYSTEMS) {
      if (selectedSystemFilter !== "all" && sys.id !== selectedSystemFilter) continue;
      for (const cond of sys.commonConditions) {
        if (!q || cond.name.toLowerCase().includes(q) || sys.name.toLowerCase().includes(q)) {
          list.push({ ...cond, system: sys });
        }
      }
    }
    return list;
  }, [searchQuery, selectedSystemFilter]);

  const handleAddConcern = (
    name: string,
    defaultLevel: CareFeeLevel,
    system: ClinicalOrganSystemConfig
  ) => {
    if (concerns.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    const defaultAnswers: LevelAdjusterAnswers = {
      chronicity: defaultLevel === "mild" ? "under_3_months" : "3_months_plus",
      impactOnDailyLife: defaultLevel !== "mild",
      hasMedicalReports: defaultLevel === "complex",
    };

    const initialComputed = computeSuggestedLevel(defaultLevel, defaultAnswers);

    const newConcern: ActiveConcernState = {
      instanceId: `${system.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      organSystemId: system.id,
      organSystemName: system.name,
      defaultLevel,
      answers: defaultAnswers,
      computedLevel: initialComputed,
      chosenLevel: initialComputed,
      isAdjusterOpen: true,
    };

    const nextConcerns = [...concerns, newConcern];
    setConcerns(nextConcerns);
    setSearchQuery("");

    trackStoreFunnelEvent("store_health_concern_selected", {
      healthAreas: new Set(nextConcerns.map((c) => c.organSystemId)).size,
      concernCount: nextConcerns.length,
    });
  };

  const handleRemoveConcern = (instanceId: string) => {
    setConcerns(concerns.filter((c) => c.instanceId !== instanceId));
  };

  const handleUpdateAdjuster = (
    instanceId: string,
    updates: Partial<LevelAdjusterAnswers>
  ) => {
    setConcerns((prev) =>
      prev.map((c) => {
        if (c.instanceId !== instanceId) return c;
        const newAnswers = { ...c.answers, ...updates };
        const newComputed = computeSuggestedLevel(c.defaultLevel, newAnswers);
        const newChosen =
          c.chosenLevel === "complex" && newComputed !== "complex"
            ? c.chosenLevel
            : newComputed;

        return {
          ...c,
          answers: newAnswers,
          computedLevel: newComputed,
          chosenLevel: newChosen,
        };
      })
    );
  };

  const toggleAdjusterOpen = (instanceId: string) => {
    setConcerns((prev) =>
      prev.map((c) =>
        c.instanceId === instanceId ? { ...c, isAdjusterOpen: !c.isAdjusterOpen } : c
      )
    );
  };

  const pricingInputs: ClinicalConcernInput[] = useMemo(() => {
    return concerns.map((c) => ({
      id: c.instanceId,
      name: c.name,
      organSystemId: c.organSystemId,
      organSystemName: c.organSystemName,
      level: c.chosenLevel,
    }));
  }, [concerns]);

  const estimateResult = useMemo(() => {
    return calculateCareEstimate(pricingInputs, durationWeeks);
  }, [pricingInputs, durationWeeks]);

  useEffect(() => {
    if (estimateResult.containsModerateOrComplex && durationWeeks < 2) {
      setDurationWeeks(2);
    }
  }, [estimateResult.containsModerateOrComplex, durationWeeks]);

  useEffect(() => {
    if (estimateResult.hasConcerns) {
      trackStoreFunnelEvent("estimate_viewed", {
        systemCount: estimateResult.systemGroups.length,
        durationWeeks: estimateResult.effectiveDurationWeeks,
      });
    }
  }, [estimateResult.hasConcerns, estimateResult.weeklyFeeINR, estimateResult.effectiveDurationWeeks]);

  const whatsappUrl = useMemo(() => {
    if (!estimateResult.hasConcerns) return "";

    const lines: string[] = [
      "Hello Dr. Jethwani & Care Team,",
      "",
      "I have completed the Care Fee Calculator on your website and would like to request physician review for my case.",
      "",
      `*Selected Concerns & Organ Systems:*`,
    ];

    for (const group of estimateResult.systemGroups) {
      const names = group.concerns.map((c) => c.name).join(", ");
      lines.push(`• ${group.organSystemName}: ${names} [${CARE_FEE_CARD_LEVELS[group.highestLevel].name}]`);
    }

    lines.push("");
    lines.push(`*Estimated Weekly Fee:* ₹${estimateResult.weeklyFeeINR.toLocaleString("en-IN")}/week`);
    lines.push(`*Selected Care Period:* ${estimateResult.effectiveDurationWeeks} weeks`);
    lines.push(`*Estimated Starting Total:* ₹${estimateResult.totalEstimateINR.toLocaleString("en-IN")}`);
    lines.push(`*Routine Prescribed Medicines:* Included`);
    lines.push("");
    lines.push("Please let me know the next steps for clinical review. Thank you!");

    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/918446056789?text=${text}`;
  }, [estimateResult]);

  const handleWhatsAppClick = () => {
    trackStoreFunnelEvent("whatsapp_clicked", {
      durationWeeks: estimateResult.effectiveDurationWeeks,
      systemCount: estimateResult.systemGroups.length,
    });
  };

  const handleReviewClick = () => {
    trackStoreFunnelEvent("review_requested", {
      durationWeeks: estimateResult.effectiveDurationWeeks,
      systemCount: estimateResult.systemGroups.length,
    });
    onProceedToReview?.(estimateResult, pricingInputs);
  };

  return (
    <section
      id="care-fee-calculator"
      aria-labelledby="calculator-heading"
      className={`rounded-[1.75rem] border border-slate-200 bg-white/90 backdrop-blur-md p-6 md:p-8 shadow-sm ${className}`}
    >
      {/* Section Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-mint" aria-hidden="true" />
          Interactive Care Fee Calculator
        </span>
        <h2 id="calculator-heading" className="mt-2 font-serif text-3xl md:text-4xl font-bold text-[#1A2421]">
          Calculate Your Weekly Care Fee
        </h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
          Add your symptoms to see your transparent weekly fee. Related symptoms in one organ system count as one concern.
          Doctor confirms your level before any payment. Prescribed medicines are included.
        </p>
      </div>

      {/* STEP 1: SAFETY SCREENING */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 shrink-0">
            <ShieldAlert className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Step 1: Clinical Safety Screening
            </span>
            <p className="text-sm font-semibold text-slate-800">
              Are you experiencing any of these right now: <strong>chest pain, difficulty breathing, blood in stool or urine, sudden severe pain, high fever, or fainting?</strong>
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => handleSafetyAnswer("no")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  safetyGateAnswer === "no"
                    ? "bg-[#1A2421] text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                No, none of these
              </button>
              <button
                type="button"
                onClick={() => handleSafetyAnswer("yes")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  safetyGateAnswer === "yes"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Yes, I have one of these
              </button>
              <button
                type="button"
                onClick={() => handleSafetyAnswer("not_sure")}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                  safetyGateAnswer === "not_sure"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Not sure
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Boundary Banner */}
        {safetyStatus === "red_flag" && (
          <div className="mt-5 rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-950">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="block text-sm font-bold text-rose-900">
                  Please seek urgent medical care now.
                </strong>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-rose-800">
                  Homeo Healthcare provides planned, non-emergency care. Your symptoms require immediate conventional emergency assessment.
                  Do not delay urgent medical evaluation.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSafetyStatus("unanswered");
                      setSafetyGateAnswer(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-800 hover:bg-rose-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Re-screen safety question
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CALCULATOR MAIN: Rendered when safety screening is clear */}
      {safetyStatus === "clear" && (
        <div className="mt-8 space-y-6">
          {/* STEP 2: ADD HEALTH CONCERNS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                  Step 2: Add Health Concerns
                </span>
                <h3 className="text-sm font-bold text-[#1A2421]">
                  Search or select by organ system
                </h3>
              </div>
              <span className="text-xs font-bold text-mint-dark bg-mint/10 px-3 py-1 rounded-full self-start sm:self-auto">
                {concerns.length} {concerns.length === 1 ? "concern" : "concerns"} selected
              </span>
            </div>

            {/* Organ System Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSystemFilter("all")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedSystemFilter === "all"
                    ? "bg-[#1A2421] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Systems
              </button>
              {STANDARD_ORGAN_SYSTEMS.map((sys) => (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => setSelectedSystemFilter(sys.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedSystemFilter === sys.id
                      ? "bg-[#1A2421] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {sys.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search condition (e.g. Acidity, Sinusitis, IBS, Migraine, Acne, Knee pain...)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-mint focus:bg-white focus:ring-1 focus:ring-mint"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Condition Chips */}
            <div className="mt-4 flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredConditions.map((item) => {
                const isSelected = concerns.some((c) => c.name.toLowerCase() === item.name.toLowerCase());
                return (
                  <button
                    key={`${item.system.id}-${item.name}`}
                    type="button"
                    disabled={isSelected}
                    onClick={() => handleAddConcern(item.name, item.defaultLevel, item.system)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 opacity-60 cursor-not-allowed"
                        : "border-slate-200 bg-white text-slate-700 hover:border-mint hover:bg-mint/5 shadow-sm"
                    }`}
                  >
                    {isSelected ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-mint" />
                    )}
                    <span>{item.name}</span>
                    <span className="text-[10px] font-semibold text-slate-400">({item.system.name})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: CONCERNS LIST & CLINICAL LEVEL ADJUSTERS */}
          {concerns.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                    Step 3: Clinical Criteria & Level Check
                  </span>
                  <h3 className="text-sm font-bold text-[#1A2421]">
                    Verify criteria for your selected concerns
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setConcerns([])}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600"
                >
                  Clear all
                </button>
              </div>

              {concerns.map((concern) => {
                const levelDef = CARE_FEE_CARD_LEVELS[concern.chosenLevel];
                return (
                  <div
                    key={concern.instanceId}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-base font-bold text-[#1A2421]">{concern.name}</strong>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                            {concern.organSystemName}
                          </span>
                        </div>
                        <span className="mt-1 block text-xs font-semibold text-slate-500">
                          Assigned:{" "}
                          <strong className="text-mint-dark font-bold">
                            {levelDef.name} (₹{levelDef.weeklyFeeINR.toLocaleString("en-IN")}/wk)
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => toggleAdjusterOpen(concern.instanceId)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          <span>Adjust Criteria</span>
                          {concern.isAdjusterOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveConcern(concern.instanceId)}
                          aria-label={`Remove ${concern.name}`}
                          className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {concern.isAdjusterOpen && (
                      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-xs space-y-3">
                        <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                          Clinical Criteria Questionnaire:
                        </span>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-semibold text-slate-600">
                            (a) How long have you had this concern?
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateAdjuster(concern.instanceId, { chronicity: "under_3_months" })}
                              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                concern.answers.chronicity === "under_3_months"
                                  ? "bg-[#1A2421] text-white"
                                  : "border border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              Under 3 months
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateAdjuster(concern.instanceId, { chronicity: "3_months_plus" })}
                              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                concern.answers.chronicity === "3_months_plus"
                                  ? "bg-[#1A2421] text-white"
                                  : "border border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              3+ months (Recurring)
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-semibold text-slate-600">
                            (b) Does it affect sleep, work, or daily activity?
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateAdjuster(concern.instanceId, { impactOnDailyLife: false })}
                              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                !concern.answers.impactOnDailyLife
                                  ? "bg-[#1A2421] text-white"
                                  : "border border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              Mostly normal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateAdjuster(concern.instanceId, { impactOnDailyLife: true })}
                              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                concern.answers.impactOnDailyLife
                                  ? "bg-[#1A2421] text-white"
                                  : "border border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              Yes, affects activity
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-semibold text-slate-600">
                            (c) Do you have medical reports / investigation records?
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateAdjuster(concern.instanceId, { hasMedicalReports: false })}
                              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                !concern.answers.hasMedicalReports
                                  ? "bg-[#1A2421] text-white"
                                  : "border border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              No reports
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateAdjuster(concern.instanceId, { hasMedicalReports: true })}
                              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                                concern.answers.hasMedicalReports
                                  ? "bg-[#1A2421] text-white"
                                  : "border border-slate-200 bg-white text-slate-600"
                              }`}
                            >
                              Yes, have reports
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>
                            Suggested level: <strong>{CARE_FEE_CARD_LEVELS[concern.computedLevel].name}</strong>
                          </span>
                          <span className="italic">Patient cannot lower level below criteria threshold</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 4: LIVE CARE ESTIMATE SUMMARY */}
          {estimateResult.hasConcerns && (
            <div
              ref={summaryRef}
              className="rounded-2xl border border-mint/30 bg-white p-6 md:p-8 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-mint-dark bg-mint/10 px-3 py-1 rounded-full">
                    Step 4: Live Care Fee Estimate
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-[#1A2421]">
                    Your Estimated Care Summary
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Calculated using the official organ-system single-concern rule.
                  </p>
                </div>

                {/* Duration Selector */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 self-start">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Care Duration:
                  </span>
                  <div className="flex gap-2">
                    {!estimateResult.containsModerateOrComplex && (
                      <button
                        type="button"
                        onClick={() => setDurationWeeks(1)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                          durationWeeks === 1
                            ? "bg-[#1A2421] text-white shadow-sm"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        1 Week
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDurationWeeks(2)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        durationWeeks === 2
                          ? "bg-[#1A2421] text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      2 Weeks (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationWeeks(4)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        durationWeeks === 4
                          ? "bg-[#1A2421] text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      4 Weeks
                    </button>
                  </div>
                  {estimateResult.containsModerateOrComplex && (
                    <span className="block mt-1 text-[10px] font-semibold text-amber-800">
                      Moderate and complex care starts with a 2-week minimum.
                    </span>
                  )}
                </div>
              </div>

              {/* Organ System Breakdown */}
              <div className="mt-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Organ System Grouping Breakdown:
                </span>
                {estimateResult.systemGroups.map((group) => (
                  <div
                    key={group.organSystemId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-50 p-4 border border-slate-100"
                  >
                    <div>
                      <strong className="text-sm font-bold text-[#1A2421]">{group.organSystemName}</strong>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">{group.groupingNote}</p>
                    </div>
                    <span className="text-sm font-bold text-mint-dark">
                      ₹{group.weeklyFeeINR.toLocaleString("en-IN")}/week
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation Row */}
              <div className="mt-6 rounded-2xl bg-mint/5 p-5 border border-mint/20 space-y-3">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Weekly Care Rate (Sum of unique systems)</span>
                  <span className="font-bold text-[#1A2421]">₹{estimateResult.weeklyFeeINR.toLocaleString("en-IN")}/wk</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Routine Prescribed Medicines</span>
                  <span className="font-bold text-emerald-700">Included (₹0 extra)</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Care Cycle Duration</span>
                  <span className="font-bold text-[#1A2421]">{estimateResult.effectiveDurationWeeks} Weeks</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                      Estimated Starting Total
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      (Weekly fee × {estimateResult.effectiveDurationWeeks} weeks)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#1A2421]">
                      ₹{estimateResult.totalEstimateINR.toLocaleString("en-IN")}
                    </span>
                    <span className="block text-[10px] font-bold text-slate-400">Estimate only</span>
                  </div>
                </div>
              </div>

              {/* Trust Notice */}
              <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-xs font-semibold text-sky-950 flex items-start gap-2.5">
                <Info className="h-4 w-4 shrink-0 text-sky-700 mt-0.5" />
                <p>
                  <strong>Doctor review first:</strong> Your doctor confirms your exact level and scope after reviewing your case details.
                  No payment is requested before that. As you improve, your level and fee step down.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleReviewClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-mint px-6 py-4 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-mint-dark transition-all"
                >
                  <span>Request physician review (₹0 due now)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-700 hover:border-mint hover:bg-slate-50 transition-all"
                  >
                    <MessageCircle className="h-4 w-4 text-mint" />
                    <span>Send via WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {concerns.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">
                No concerns added yet. Click any condition above or type in the search box to begin.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      {estimateResult.hasConcerns && safetyStatus === "clear" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-500 block">Estimated Starting Total</span>
            <span className="text-lg font-black text-[#1A2421]">
              ₹{estimateResult.totalEstimateINR.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-slate-400 block">({estimateResult.effectiveDurationWeeks} wks)</span>
          </div>

          <div className="flex gap-2">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="rounded-full bg-slate-100 p-2.5 text-slate-700 border border-slate-200 shadow-sm"
                aria-label="Send via WhatsApp"
              >
                <MessageCircle className="h-4 w-4 text-mint" />
              </a>
            )}
            <button
              type="button"
              onClick={handleReviewClick}
              className="rounded-full bg-mint px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm"
            >
              Request Review (₹0)
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
