import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, HeartPulse, Route } from "lucide-react";
import { ClinicalCareHeader } from "./ClinicalCareHeader";
import { CarePathwayCheck, type CarePathwayCheckAnswers } from "./CarePathwayCheck";
import { CareLevelCard } from "./CareLevelCard";
import { OrganSystemsDirectory } from "./OrganSystemsDirectory";
import { IncludedServicesList } from "./IncludedServicesList";
import { PatientJourneyForm } from "./PatientJourneyForm";
import { SubmissionSuccessView } from "./SubmissionSuccessView";
import { ClinicalCareFAQ } from "./ClinicalCareFAQ";
import { EmergencyGuidanceBanner } from "./EmergencyGuidanceBanner";
import { processCareAssessmentSubmission } from "../services/careAssessmentService";
import { calculatePreliminaryCareRecommendation } from "../services/careRecommendationEngine";
import { trackStoreFunnelEvent } from "../services/storeAnalytics";
import { CLINICAL_CARE_TIER_OPTIONS, type ClinicalCareDurationWeeks, PatientIntakeData, SanitizedAssessmentResponseDTO, StoreClinicalCareTierId } from "../domain/types";

const ALLOWED_DURATIONS = new Set<ClinicalCareDurationWeeks>([1, 2, 4, 8, 12]);

function normalizeStoreTier(value: string | null): StoreClinicalCareTierId {
  const clean = (value || "").toLowerCase();
  if (Object.hasOwn(CLINICAL_CARE_TIER_OPTIONS, clean)) return clean as StoreClinicalCareTierId;
  if (["acute_mild", "acute_mild_3d", "mild acute"].includes(clean)) return "acute_mild";
  if (["acute_wellness", "acute_wellness_7d", "acute", "wellness", "mild"].includes(clean)) return "acute_wellness";
  if (["integrated", "moderate", "constitutional", "chronic"].includes(clean)) return "integrated";
  if (["complex"].includes(clean)) return "complex";
  if (["advanced", "comprehensive"].includes(clean)) return "advanced";
  return "focused";
}

export const StoreClinicalCareView: React.FC = () => {
  const [activeDiscoveryTab, setActiveDiscoveryTab] = useState<"pathways" | "concerns">("pathways");
  const [selectedTierId, setSelectedTierId] = useState<StoreClinicalCareTierId>("focused");
  const [selectedDurationWeeks, setSelectedDurationWeeks] = useState<ClinicalCareDurationWeeks>(4);
  const [pathwayAnswers, setPathwayAnswers] = useState<CarePathwayCheckAnswers>({});
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [selectedAreaTitles, setSelectedAreaTitles] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);
  const guideRef = useRef<HTMLDetailsElement>(null);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [preparedReviewUrl, setPreparedReviewUrl] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<SanitizedAssessmentResponseDTO | null>(null);
  const assessmentFormRef = useRef<HTMLDivElement>(null);
  const discoveryTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTier = normalizeStoreTier(params.get("pathway") || params.get("level") || params.get("careLevel"));
    const requestedWeeks = Number(params.get("weeks") || params.get("duration"));
    setSelectedTierId(requestedTier);
    if (ALLOWED_DURATIONS.has(requestedWeeks as ClinicalCareDurationWeeks)) setSelectedDurationWeeks(requestedWeeks as ClinicalCareDurationWeeks);
    if (params.get("start") === "assessment") setAssessmentOpen(true);
  }, []);

  const preliminaryRec = useMemo(() => {
    return calculatePreliminaryCareRecommendation({
      careFamily: pathwayAnswers.careFamily,
      supportIntensity: pathwayAnswers.supportIntensity,
      safetyStatus: pathwayAnswers.safetyStatus,
    });
  }, [pathwayAnswers]);

  const answeredCount = Object.values(pathwayAnswers).filter(Boolean).length;

  useEffect(() => {
    if (answeredCount === 0) return;
    if (!preliminaryRec.blockedBySafetyGate) {
      setSelectedTierId(preliminaryRec.suggestedTierId);
      if (preliminaryRec.suggestedTierId.startsWith("acute_")) setSelectedDurationWeeks(1);
    }
  }, [answeredCount, preliminaryRec.blockedBySafetyGate, preliminaryRec.suggestedTierId]);

  const openAssessment = () => {
    setAssessmentOpen(true);
    trackStoreFunnelEvent("store_assessment_started", { pathway: selectedTierId, durationWeeks: selectedDurationWeeks });
    window.setTimeout(() => assessmentFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handlePathwayAnswersChange = (answers: CarePathwayCheckAnswers) => {
    const changedKey = (Object.keys(answers) as Array<keyof CarePathwayCheckAnswers>).find((key) => answers[key] !== pathwayAnswers[key]);
    if (changedKey && answers[changedKey] !== undefined) {
      trackStoreFunnelEvent("store_pathway_check_answered", { question: changedKey, answer: answers[changedKey] });
    }
    setPathwayAnswers(answers);
  };

  const handleHealthConcernSelection = (areaIds: string[], areaTitles: string[], conditionName: string) => {
    setSelectedAreaIds(areaIds);
    setSelectedAreaTitles(areaTitles);
    setSelectedCondition(conditionName);
    if (areaTitles.length > 0) {
      trackStoreFunnelEvent("store_health_concern_selected", { healthAreas: areaTitles.length });
    }
  };

  const openGuide = () => {
    setActiveDiscoveryTab("pathways");
    setGuideOpen(true);
    window.setTimeout(() => guideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const showCarePathways = () => {
    setActiveDiscoveryTab("pathways");
    window.setTimeout(() => discoveryTabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleSubmitAssessment = async (intakeData: PatientIntakeData, reviewUrl: string) => {
    setIsSubmitting(true);
    try {
      const result = processCareAssessmentSubmission(intakeData);
      if (result.success) {
        trackStoreFunnelEvent("store_assessment_submitted", { pathway: intakeData.selectedTierId, durationWeeks: intakeData.preferredDurationWeeks });
        setPreparedReviewUrl(reviewUrl);
        setSubmissionResponse(result.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionResponse(null);
    setPreparedReviewUrl(undefined);
    setSelectedTierId("focused");
    setSelectedDurationWeeks(4);
    setPathwayAnswers({});
    setSelectedAreaIds([]);
    setSelectedAreaTitles([]);
    setSelectedCondition("");
    setActiveDiscoveryTab("pathways");
    setAssessmentOpen(false);
  };

  return (
    <main className="store-care-page min-h-screen px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-mint"><ArrowLeft className="h-4 w-4" /> Return to Main Platform</Link>
        <ClinicalCareHeader />

        {submissionResponse ? (
          <SubmissionSuccessView response={submissionResponse} preparedReviewUrl={preparedReviewUrl} onReset={handleReset} />
        ) : (
          <>
            <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {["No payment before physician review", "Routine prescribed medicines included", "Every additional fee requires approval"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs font-bold text-slate-700"><CheckCircle2 className="h-4 w-4 shrink-0 text-mint" />{item}</div>)}
            </div>

            <section aria-labelledby="care-start-heading" className="mb-8 rounded-3xl border border-[#d6e3dc] bg-gradient-to-br from-[#fbfdfb] via-white to-[#f1f7f4] p-6 shadow-[0_18px_50px_rgba(28,67,49,0.08)]">
              <h2 id="care-start-heading" className="font-serif text-2xl font-bold text-[#1A2421]">What brings you here?</h2>
              <p className="mt-2 text-sm text-slate-600">Choose a starting point to compare options. Your doctor confirms what is suitable.</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  { id: "chronic", title: "An ongoing or recurring concern", note: "Structured case analysis and planned review across one or more organ systems", label: "Explore chronic care", tone: "border-[#8eaa98] bg-[#f1f7f2] hover:border-[#3e7054]" },
                  { id: "acute", title: "A recent concern or acute flare-up", note: "Short, defined care for a suitable non-emergency concern", label: "Explore acute & subacute care", tone: "border-[#a8c9d0] bg-[#f2f9fa] hover:border-[#397887]" },
                  { id: "membership", title: "Stable follow-up after improvement", note: "Lower-intensity review of agreed mild, stable concerns", label: "Explore membership", tone: "border-[#c7bad8] bg-[#f8f5fb] hover:border-[#70588f]" },
                ].map(item => <button key={item.id} type="button" onClick={() => { setActiveDiscoveryTab("pathways"); window.setTimeout(() => document.getElementById(`care-group-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }} className={`rounded-2xl border p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${item.tone}`}><strong className="block text-base text-[#1A2421]">{item.title}</strong><span className="mt-2 block text-sm text-slate-600">{item.note}</span><span className="mt-4 block text-sm font-bold text-mint">{item.label} →</span></button>)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600"><strong className="text-[#294a3a]">For suitable new and walk-in patients:</strong> Acute care offers a practical short starting period. Your doctor confirms whether it is appropriate and discusses any longer-term care after review.</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                <button type="button" onClick={openGuide} className="rounded-xl bg-[#1A2421] px-5 py-3 font-bold text-white">Help me choose a plan</button>
                <a href="https://wa.me/918446056789?text=Hello%2C%20I%20would%20like%20help%20choosing%20a%20suitable%20care%20plan." target="_blank" rel="noopener noreferrer" className="font-bold text-mint underline underline-offset-4">Ask the clinic on WhatsApp</a>
                <span className="text-slate-600">No plan selection or payment needed to ask.</span>
              </div>
            </section>

            <div ref={discoveryTabsRef} className="mb-8 scroll-mt-28 rounded-[1.75rem] border border-slate-200 bg-white/80 p-2 shadow-sm">
              <div role="tablist" aria-label="Choose how to begin" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button id="care-pathways-tab" type="button" role="tab" aria-selected={activeDiscoveryTab === "pathways"} aria-controls="care-pathways-panel" onClick={() => setActiveDiscoveryTab("pathways")} className={`flex items-center gap-3 rounded-[1.25rem] px-5 py-4 text-left transition-all ${activeDiscoveryTab === "pathways" ? "bg-[#1A2421] text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}>
                  <span className={`rounded-xl p-2 ${activeDiscoveryTab === "pathways" ? "bg-white/10 text-mint" : "bg-mint/10 text-mint-dark"}`}><Route className="h-5 w-5" aria-hidden="true" /></span>
                  <span><strong className="block text-sm">Compare Plans &amp; Fees</strong><span className={`mt-0.5 block text-[10px] font-semibold ${activeDiscoveryTab === "pathways" ? "text-white/70" : "text-slate-500"}`}>See care scope, payment periods and fees</span></span>
                </button>
                <button id="health-concerns-tab" type="button" role="tab" aria-selected={activeDiscoveryTab === "concerns"} aria-controls="health-concerns-panel" onClick={() => setActiveDiscoveryTab("concerns")} className={`flex items-center gap-3 rounded-[1.25rem] px-5 py-4 text-left transition-all ${activeDiscoveryTab === "concerns" ? "bg-[#1A2421] text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}>
                  <span className={`rounded-xl p-2 ${activeDiscoveryTab === "concerns" ? "bg-white/10 text-mint" : "bg-mint/10 text-mint-dark"}`}><HeartPulse className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1"><strong className="flex items-center gap-2 text-sm">Explore by Health Concern {selectedAreaIds.length > 0 && <span className="rounded-full bg-mint px-2 py-0.5 text-[9px] text-white">{selectedAreaIds.length}</span>}</strong><span className={`mt-0.5 block text-[10px] font-semibold ${activeDiscoveryTab === "concerns" ? "text-white/70" : "text-slate-500"}`}>Browse organ systems and common conditions</span></span>
                </button>
              </div>
            </div>

            {activeDiscoveryTab === "pathways" ? (
              <div id="care-pathways-panel" role="tabpanel" aria-labelledby="care-pathways-tab">

                <CareLevelCard
                  selectedTierId={selectedTierId}
                  selectedDurationWeeks={selectedDurationWeeks}
                  preliminaryRecommendation={answeredCount > 0 ? preliminaryRec : undefined}
                  onSelectTier={(tierId) => {
                    const nextTier = normalizeStoreTier(tierId);
                    setSelectedTierId(nextTier);
                    const nextFamily = CLINICAL_CARE_TIER_OPTIONS[nextTier].family;
                    if (nextFamily === "acute" || nextFamily === "subacute") setSelectedDurationWeeks(1);
                    else if (nextFamily === "membership" && CLINICAL_CARE_TIER_OPTIONS[selectedTierId].family !== "membership") setSelectedDurationWeeks(4);
                    trackStoreFunnelEvent("store_pathway_selected", { pathway: nextTier, durationWeeks: selectedDurationWeeks });
                  }}
                  onSelectDuration={(weeks) => {
                    setSelectedDurationWeeks(weeks);
                    trackStoreFunnelEvent("store_duration_selected", { pathway: selectedTierId, durationWeeks: weeks });
                  }}
                  onProceedToAssessment={openAssessment}
                />
                <details ref={guideRef} open={guideOpen} onToggle={event => setGuideOpen(event.currentTarget.open)} className="mb-8 scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold text-slate-700">Not sure where to begin? Open the pathway guide</summary><div className="mt-5"><CarePathwayCheck answers={pathwayAnswers} recommendation={preliminaryRec} onChange={handlePathwayAnswersChange} /></div></details>
              </div>
            ) : (
              <div id="health-concerns-panel" role="tabpanel" aria-labelledby="health-concerns-tab">
                <OrganSystemsDirectory
                  selectedAreaIds={selectedAreaIds}
                  selectedCondition={selectedCondition}
                  onSelectionChange={handleHealthConcernSelection}
                  onContinueToPathways={showCarePathways}
                  onProceedToAssessment={openAssessment}
                />
              </div>
            )}

            {assessmentOpen && (
              <div ref={assessmentFormRef} className="scroll-mt-28">
                <PatientJourneyForm
                  initialTierId={selectedTierId}
                  initialDurationWeeks={selectedDurationWeeks}
                  initialMainArea={selectedAreaTitles.join(", ")}
                  initialCondition={selectedCondition}
                  onSubmitAssessment={handleSubmitAssessment}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}

            <section aria-label="Appointments and practical information" className="mb-8 grid gap-4 md:grid-cols-3">
              {[
                { title: "Appointments", text: "In-person or online review according to suitability. Some concerns require an examination or referral." },
                { title: "Clinic support", text: "Brief clarification of existing instructions during clinic hours. Additional concerns or consultations are assessed separately." },
                { title: "Medicine delivery", text: "Routine prescribed medicines are included. Delivery availability and any courier charges are confirmed before payment." },
              ].map(item => <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-base font-bold text-[#1A2421]">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p></div>)}
              <Link href="/contact-us" className="text-sm font-bold text-mint underline underline-offset-4 md:col-span-3">View clinic locations, hours and appointment options →</Link>
            </section>
            <IncludedServicesList />
            <ClinicalCareFAQ />
            <EmergencyGuidanceBanner />
          </>
        )}
      </div>
    </main>
  );
};
