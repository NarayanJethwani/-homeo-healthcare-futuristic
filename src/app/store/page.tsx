"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LayoutGrid,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import Magnetic from "@/components/Magnetic";
import PatientPricingPlanner, {
  getOrganSystemBreadthLabel,
  type PatientPricingSelection,
} from "@/components/PatientPricingPlanner";
import SpecialtySupportDirectory from "@/components/SpecialtySupportDirectory";
import Portal from "@/components/Portal";
import { CARE_LEVELS_DETAILS } from "@/lib/pricingConfig";
import {
  SPECIALTY_SUPPORT_TIERS,
  calculateSpecialtyTierTotal,
  createSpecialtyAssessmentRequest,
  findSpecialtyArea,
  getClinicalAreaLeadership,
  getExpertReviewOption,
  type SpecialtySelection,
} from "@/lib/specialtyPrograms";

type StoreView = "pathways" | "specialty";
type AssessmentStep = "intake" | "submitted";

interface AssessmentPlan {
  title: string;
  description: string;
  durationText: string;
  scopeText: string;
  feeLabel: string;
  feeDisplay: string;
  organSystemBreadthLabel?: string;
  specialtyAreaId?: string;
  selectedCondition?: string;
  requestedExpertReview?: string;
  careLead?: string;
  referralGuidance?: string;
  urgentBoundary?: string;
}

interface AssessmentForm {
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  city: string;
  diagnosisStatus: string;
  currentMedicines: string;
  treatingClinicians: string;
  reportsSummary: string;
  complaint: string;
}

const EMPTY_FORM: AssessmentForm = {
  name: "",
  phone: "",
  email: "",
  age: "",
  gender: "Male",
  city: "",
  diagnosisStatus: "Under evaluation",
  currentMedicines: "",
  treatingClinicians: "",
  reportsSummary: "",
  complaint: "",
};

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function StorePage() {
  const [view, setView] = useState<StoreView>("pathways");
  const [assessmentPlan, setAssessmentPlan] = useState<AssessmentPlan | null>(null);
  const [assessmentStep, setAssessmentStep] = useState<AssessmentStep>("intake");
  const [form, setForm] = useState<AssessmentForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AssessmentForm, boolean>>>({});
  const [emergencyAcknowledged, setEmergencyAcknowledged] = useState(false);

  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get("mode");
    if (mode === "catalog" || mode === "specialty") setView("specialty");
  }, []);

  const openPathwayAssessment = (selection: PatientPricingSelection) => {
    const detail = CARE_LEVELS_DETAILS[selection.pathway];
    const organSystemBreadthLabel = getOrganSystemBreadthLabel(selection.organSystemBreadth);
    const selectedSupport = [
      selection.additionalAcuteEpisode ? "Additional unrelated acute episode assessment" : null,
      selection.priorityAcuteSupport ? "Priority Acute Support" : null,
    ].filter(Boolean);

    setAssessmentPlan({
      title: detail.title,
      description: detail.subtitle || detail.description,
      durationText: selection.durationPendingConfirmation
        ? "Physician-recommended after assessment"
        : `${selection.durationWeeks} ${selection.durationWeeks === 1 ? "week" : "weeks"}`,
      scopeText: `${detail.scopeMessage}${organSystemBreadthLabel ? ` Patient-reported case breadth: ${organSystemBreadthLabel}; this is guidance only.` : ""}${selectedSupport.length ? ` Selected support: ${selectedSupport.join(", ")}.` : ""}`,
      feeLabel: selection.durationPendingConfirmation ? "Indicative weekly fee" : "Care-period total",
      feeDisplay: `${formatPrice(selection.summary.total)}${selection.durationPendingConfirmation ? "/week" : ""}`,
      organSystemBreadthLabel,
    });
    setAssessmentStep("intake");
    setFormErrors({});
    setEmergencyAcknowledged(false);
    setForm((current) => ({
      ...current,
      complaint: current.complaint || `Clinical assessment request for ${detail.title}. Please describe the main symptoms, their duration, current medicines, and relevant medical history: `,
    }));
  };

  const openSpecialtyAssessment = (selection: SpecialtySelection) => {
    const request = createSpecialtyAssessmentRequest(selection);
    const area = findSpecialtyArea(request.areaId);
    if (!area) return;
    const leadership = getClinicalAreaLeadership(area);
    const expertReview = getExpertReviewOption(request.requestedExpertReview);
    const startingTier = SPECIALTY_SUPPORT_TIERS[request.allowedTierKeys[0]];
    const startingDuration = startingTier.durations[0];
    const organSystemBreadthLabel = getOrganSystemBreadthLabel(request.organSystemBreadth);
    setAssessmentPlan({
      title: request.title,
      description: area.description,
      durationText: request.durationText,
      scopeText: `${request.condition}. Patient-reported case breadth: ${organSystemBreadthLabel}. This guides clinical assessment only and never creates an automatic organ-system charge.`,
      feeLabel: "Starting care-period total",
      feeDisplay: `${formatPrice(calculateSpecialtyTierTotal(startingTier.key, startingDuration))} / ${startingDuration} weeks`,
      specialtyAreaId: request.areaId,
      selectedCondition: request.condition,
      requestedExpertReview: expertReview.title,
      careLead: leadership.careLead,
      referralGuidance: leadership.referralGuidance,
      organSystemBreadthLabel,
      urgentBoundary: area.urgentBoundary,
    });
    setAssessmentStep("intake");
    setFormErrors({});
    setEmergencyAcknowledged(false);
    setForm((current) => ({
      ...current,
      complaint: current.complaint || `Clinical assessment request for ${area.title} — ${request.condition}. Please describe the main symptoms, their duration, and relevant history: `,
    }));
  };

  const closeAssessment = () => {
    setAssessmentPlan(null);
    setAssessmentStep("intake");
    setFormErrors({});
    setEmergencyAcknowledged(false);
  };

  const updateForm = (field: keyof AssessmentForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: false }));
  };

  const submitAssessment = () => {
    if (!assessmentPlan) return;
    const errors: Partial<Record<keyof AssessmentForm, boolean>> = {};
    if (!form.name.trim()) errors.name = true;
    if (!form.phone.trim()) errors.phone = true;
    if (!form.age.trim()) errors.age = true;
    if (form.email && !form.email.includes("@")) errors.email = true;
    if (form.complaint.trim().length < 5) errors.complaint = true;
    if (assessmentPlan.specialtyAreaId && !emergencyAcknowledged) return;
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const specialtyContext = assessmentPlan.specialtyAreaId
      ? `\n\n*SPECIALTY CONTEXT*\n- Main concern: ${assessmentPlan.selectedCondition}\n- Requested review or coordination: ${assessmentPlan.requestedExpertReview || "Standard physician assessment"}\n- Diagnosis status: ${form.diagnosisStatus}\n- Current medicines: ${form.currentMedicines.trim() || "Not provided"}\n- Treating clinicians: ${form.treatingClinicians.trim() || "Not provided"}\n- Reports available: ${form.reportsSummary.trim() || "Not provided"}\n- Emergency-service limitation acknowledged: Yes`
      : "";
    const message = `Hello Dr. Jethwani, I would like a clinical assessment.\n\n*PATIENT DETAILS*\n- Name: ${form.name.trim()} (${form.age.trim()} years, ${form.gender})\n- Contact: ${form.phone.trim()}\n- Email: ${form.email.trim() || "Not provided"}\n- City: ${form.city.trim() || "Not provided"}\n\n*SELECTED CARE*\n- Program: ${assessmentPlan.title}\n- Duration: ${assessmentPlan.durationText}\n- Scope: ${assessmentPlan.scopeText}\n- ${assessmentPlan.feeLabel}: ${assessmentPlan.feeDisplay}${specialtyContext}\n\n*CLINICAL HISTORY*\n${form.complaint.trim()}\n\nI understand that this is an assessment request, not a purchase. A physician will confirm suitability, care scope, duration, and the final fee before treatment begins.`;
    window.open(
      `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918446056789"}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
    setAssessmentStep("submitted");
  };

  return (
    <main className="pt-28 pb-24 px-4 md:px-8 lg:px-12 relative min-h-screen">
      <div className="w-full z-10 relative">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <Magnetic>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark dark:text-[#5EEAD4] text-xs font-bold uppercase tracking-wider transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to Home
            </Link>
          </Magnetic>
        </motion.div>

        <header className="mb-8 max-w-5xl">
          <span className="text-xs font-bold text-mint uppercase tracking-widest">Physician-led care pathways</span>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] dark:text-[#F8FAFC] mt-4">
            Clear care pathways for individual treatment
          </h1>
          <p className="text-base text-slate-700 dark:text-[#CBD5E1] font-semibold leading-relaxed mt-5">
            Choose the pathway closest to your needs and continue to a clinical assessment. A physician confirms suitability, scope, duration, and the final fee before treatment begins.
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <div className="inline-flex items-center gap-1.5 bg-slate-900/5 dark:bg-white/[0.07] p-1.5 rounded-full border border-slate-200/50 dark:border-white/10">
            <button type="button" onClick={() => setView("pathways")} className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${view === "pathways" ? "bg-[#1A2421] text-white" : "text-slate-600 dark:text-[#CBD5E1]"}`}>
              <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" /> Care Pathways
            </button>
            <button type="button" onClick={() => setView("specialty")} className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${view === "specialty" ? "bg-[#1A2421] text-white" : "text-slate-600 dark:text-[#CBD5E1]"}`}>
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" /> Clinical Areas
            </button>
          </div>
          <Link href="/store/plans" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark dark:text-[#5EEAD4] text-xs font-extrabold uppercase tracking-wider transition-colors">
            Compare Care Pathways
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {view === "pathways" ? (
            <motion.section key="pathways" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <PatientPricingPlanner onContinue={openPathwayAssessment} />
            </motion.section>
          ) : (
            <motion.section key="specialty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} aria-labelledby="specialty-heading">
              <div className="max-w-4xl mb-8">
                <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Integrated clinical-area care</span>
                <h2 id="specialty-heading" className="font-serif text-3xl md:text-4xl font-semibold text-[#1A2421] dark:text-[#F8FAFC] mt-2">Find the right care team—not a disease-priced package</h2>
                <p className="text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] leading-relaxed mt-3">Choose the health area closest to your concern. We assess the right level of care, coordinate with your treating team when needed, and arrange appropriate referral or expert review.</p>
              </div>
              <SpecialtySupportDirectory onContinue={openSpecialtyAssessment} />
            </motion.section>
          )}
        </AnimatePresence>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16">
          {[
            [ShieldCheck, "Physician confirmation", "Suitability, scope, duration, and the final fee are confirmed before treatment."],
            [ClipboardList, "No payment at assessment", "Submitting clinical details does not purchase a program or authorize payment."],
            [Stethoscope, "Individual care", "Recommendations reflect clinical complexity and supervision needs—not symptom count alone."],
          ].map(([Icon, title, description]) => {
            const CardIcon = Icon as typeof ShieldCheck;
            return (
              <div key={title as string} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/55 dark:bg-[#111827] p-6">
                <CardIcon className="w-5 h-5 text-mint" aria-hidden="true" />
                <h2 className="text-sm font-bold text-[#1A2421] dark:text-white mt-4">{title as string}</h2>
                <p className="text-xs font-semibold text-slate-600 dark:text-[#CBD5E1] leading-relaxed mt-2">{description as string}</p>
              </div>
            );
          })}
        </section>
      </div>

      <Portal>
        <AnimatePresence>
          {assessmentPlan && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:py-12 bg-slate-900/65 backdrop-blur-md overflow-y-auto" data-lenis-prevent>
              <motion.div role="dialog" aria-modal="true" aria-labelledby="assessment-title" initial={{ opacity: 0, scale: 0.97, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 16 }} className="w-full max-w-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl p-6 md:p-8 relative my-6">
                <button type="button" onClick={closeAssessment} aria-label="Close assessment" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white flex items-center justify-center">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>

                {assessmentStep === "intake" ? (
                  <div className="space-y-6">
                    <div className="pr-10">
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Clinical assessment</span>
                      <h2 id="assessment-title" className="font-serif text-2xl md:text-3xl font-semibold text-[#1A2421] dark:text-white mt-2">{assessmentPlan.title}</h2>
                      <p className="text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] leading-relaxed mt-2">{assessmentPlan.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-mint/20 bg-mint/[0.04] p-4 text-xs">
                      <div><span className="block font-bold text-slate-500 dark:text-[#94A3B8]">Care duration</span><strong className="text-[#1A2421] dark:text-white">{assessmentPlan.durationText}</strong></div>
                      {assessmentPlan.organSystemBreadthLabel && <div><span className="block font-bold text-slate-500 dark:text-[#94A3B8]">Reported case breadth</span><strong className="text-[#1A2421] dark:text-white">{assessmentPlan.organSystemBreadthLabel}</strong></div>}
                      <div><span className="block font-bold text-slate-500 dark:text-[#94A3B8]">{assessmentPlan.feeLabel}</span><strong className="text-[#1A2421] dark:text-white">{assessmentPlan.feeDisplay}</strong></div>
                    </div>
                    <p className="rounded-2xl bg-[#1A2421] p-4 text-xs font-semibold text-white leading-relaxed"><strong className="text-mint">No payment at this step.</strong> This request goes to the physician for clinical confirmation first.</p>
                    {assessmentPlan.urgentBoundary && (
                      <p className="rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-xs font-semibold leading-relaxed text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/[0.08] dark:text-amber-100">
                        <strong>Urgent-care boundary:</strong> {assessmentPlan.urgentBoundary}
                      </p>
                    )}
                    {assessmentPlan.careLead && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] p-4 text-xs font-semibold leading-relaxed text-slate-700 dark:text-[#CBD5E1]">
                        <p><strong className="block text-[#1A2421] dark:text-white mb-1">Who leads care</strong>{assessmentPlan.careLead}</p>
                        <p><strong className="block text-[#1A2421] dark:text-white mb-1">Referral & expert review</strong>{assessmentPlan.referralGuidance} Requested: {assessmentPlan.requestedExpertReview}.</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {([
                        ["name", "Patient name *", "Full name", "text"],
                        ["phone", "WhatsApp number *", "+91 98765 43210", "tel"],
                        ["email", "Email address", "email@example.com", "email"],
                        ["age", "Age *", "Age", "number"],
                        ["city", "City", "City", "text"],
                      ] as const).map(([field, label, placeholder, type]) => (
                        <label key={field} className="space-y-1">
                          <span className="text-[10px] font-black text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">{label}</span>
                          <input type={type} value={form[field]} onChange={(event) => updateForm(field, event.target.value)} placeholder={placeholder} className={`w-full p-3 rounded-xl border bg-white dark:bg-[#0F172A] text-sm text-[#1A2421] dark:text-white outline-none ${formErrors[field] ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 dark:border-white/15 focus:border-mint"}`} />
                        </label>
                      ))}
                      <label className="space-y-1">
                        <span className="text-[10px] font-black text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">Gender</span>
                        <select value={form.gender} onChange={(event) => updateForm("gender", event.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0F172A] text-sm text-[#1A2421] dark:text-white outline-none focus:border-mint">
                          <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                        </select>
                      </label>
                      {assessmentPlan.specialtyAreaId && (
                        <>
                          <label className="space-y-1">
                            <span className="text-[10px] font-black text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">Diagnosis status</span>
                            <select value={form.diagnosisStatus} onChange={(event) => updateForm("diagnosisStatus", event.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0F172A] text-sm text-[#1A2421] dark:text-white outline-none focus:border-mint">
                              <option>Confirmed diagnosis</option>
                              <option>Under evaluation</option>
                              <option>Symptoms only / not diagnosed</option>
                            </select>
                          </label>
                          <label className="space-y-1">
                            <span className="text-[10px] font-black text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">Current doctors or specialists</span>
                            <input value={form.treatingClinicians} onChange={(event) => updateForm("treatingClinicians", event.target.value)} placeholder="Example: cardiologist, pediatrician, none" className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0F172A] text-sm text-[#1A2421] dark:text-white outline-none focus:border-mint" />
                          </label>
                          <label className="md:col-span-2 space-y-1">
                            <span className="text-[10px] font-black text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">Current medicines and treatments</span>
                            <textarea rows={3} value={form.currentMedicines} onChange={(event) => updateForm("currentMedicines", event.target.value)} placeholder="List prescribed medicines, inhalers, insulin, therapy, supplements, or write none" className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0F172A] text-sm text-[#1A2421] dark:text-white outline-none resize-y focus:border-mint" />
                          </label>
                          <label className="md:col-span-2 space-y-1">
                            <span className="text-[10px] font-black text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">Reports available</span>
                            <textarea rows={2} value={form.reportsSummary} onChange={(event) => updateForm("reportsSummary", event.target.value)} placeholder="Example: blood tests, scan, discharge summary, pathology report, none" className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0F172A] text-sm text-[#1A2421] dark:text-white outline-none resize-y focus:border-mint" />
                          </label>
                        </>
                      )}
                      <label className="md:col-span-2 space-y-1">
                        <span className="text-[10px] font-black text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">Symptoms and clinical history *</span>
                        <textarea rows={5} value={form.complaint} onChange={(event) => updateForm("complaint", event.target.value)} className={`w-full p-3 rounded-xl border bg-white dark:bg-[#0F172A] text-sm text-[#1A2421] dark:text-white outline-none resize-y ${formErrors.complaint ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 dark:border-white/15 focus:border-mint"}`} />
                      </label>
                    </div>

                    {assessmentPlan.specialtyAreaId && (
                      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] p-4 cursor-pointer">
                        <input type="checkbox" checked={emergencyAcknowledged} onChange={(event) => setEmergencyAcknowledged(event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-600" />
                        <span className="text-xs font-semibold leading-relaxed text-slate-700 dark:text-[#CBD5E1]">I understand that this assessment request is not an emergency service and that prescribed medicines should not be stopped without the treating physician.</span>
                      </label>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                      <button type="button" onClick={closeAssessment} className="px-6 py-3 rounded-full border border-slate-200 dark:border-white/15 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">Cancel</button>
                      <button type="button" disabled={Boolean(assessmentPlan.specialtyAreaId && !emergencyAcknowledged)} onClick={submitAssessment} className="px-7 py-3 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40">Submit for Physician Review <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 max-w-lg mx-auto">
                    <CheckCircle2 className="w-14 h-14 text-mint mx-auto" aria-hidden="true" />
                    <span className="block text-[10px] font-bold text-mint uppercase tracking-widest mt-5">Assessment request prepared</span>
                    <h2 id="assessment-title" className="font-serif text-3xl font-semibold text-[#1A2421] dark:text-white mt-2">Complete the request in WhatsApp</h2>
                    <p className="text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] leading-relaxed mt-3">A pre-filled WhatsApp message has opened. Send it to the clinic and attach any relevant reports there for physician review. No payment has been requested or authorized.</p>
                    <button type="button" onClick={() => { closeAssessment(); setForm(EMPTY_FORM); }} className="w-full mt-7 px-7 py-3 rounded-full bg-[#1A2421] text-white text-xs font-black uppercase tracking-wider">Close</button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </main>
  );
}
