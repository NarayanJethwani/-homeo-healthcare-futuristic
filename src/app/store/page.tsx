"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LayoutGrid,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import Magnetic from "@/components/Magnetic";
import PatientPricingPlanner, {
  getOrganSystemBreadthLabel,
  type PatientPricingSelection,
} from "@/components/PatientPricingPlanner";
import Portal from "@/components/Portal";
import { CARE_LEVELS_DETAILS } from "@/lib/pricingConfig";
import {
  SPECIALTY_PROGRAMS,
  createSpecialtyAssessmentRequest,
  formatSpecialtyPriceRange,
  type SpecialtyProgram,
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
  specialtyProgramId?: string;
}

interface AssessmentForm {
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  city: string;
  complaint: string;
}

const EMPTY_FORM: AssessmentForm = {
  name: "",
  phone: "",
  email: "",
  age: "",
  gender: "Male",
  city: "",
  complaint: "",
};

const accentClasses: Record<SpecialtyProgram["accent"], string> = {
  rose: "border-rose-200/70 bg-rose-50/40 dark:border-rose-400/25 dark:bg-rose-400/[0.06]",
  emerald: "border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-400/25 dark:bg-emerald-400/[0.06]",
  teal: "border-teal-200/70 bg-teal-50/40 dark:border-teal-400/25 dark:bg-teal-400/[0.06]",
  lime: "border-lime-200/70 bg-lime-50/40 dark:border-lime-400/25 dark:bg-lime-400/[0.06]",
  amber: "border-amber-200/70 bg-amber-50/40 dark:border-amber-400/25 dark:bg-amber-400/[0.06]",
  indigo: "border-indigo-200/70 bg-indigo-50/40 dark:border-indigo-400/25 dark:bg-indigo-400/[0.06]",
  orange: "border-orange-200/70 bg-orange-50/40 dark:border-orange-400/25 dark:bg-orange-400/[0.06]",
  cyan: "border-cyan-200/70 bg-cyan-50/40 dark:border-cyan-400/25 dark:bg-cyan-400/[0.06]",
  purple: "border-purple-200/70 bg-purple-50/40 dark:border-purple-400/25 dark:bg-purple-400/[0.06]",
};

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function StorePage() {
  const [view, setView] = useState<StoreView>("pathways");
  const [searchQuery, setSearchQuery] = useState("");
  const [assessmentPlan, setAssessmentPlan] = useState<AssessmentPlan | null>(null);
  const [assessmentStep, setAssessmentStep] = useState<AssessmentStep>("intake");
  const [form, setForm] = useState<AssessmentForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AssessmentForm, boolean>>>({});

  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get("mode");
    if (mode === "catalog" || mode === "specialty") setView("specialty");
  }, []);

  const filteredSpecialtyPrograms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return SPECIALTY_PROGRAMS;
    return SPECIALTY_PROGRAMS.filter((program) =>
      program.title.toLowerCase().includes(query) ||
      program.description.toLowerCase().includes(query) ||
      program.features.some((feature) => feature.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const openPathwayAssessment = (selection: PatientPricingSelection) => {
    const detail = CARE_LEVELS_DETAILS[selection.pathway];
    const organSystemBreadthLabel = getOrganSystemBreadthLabel(selection.organSystemBreadth);
    const selectedSupport = [
      selection.additionalAcuteEpisode ? "Additional unrelated acute episode assessment" : null,
      selection.priorityAcuteSupport ? "Priority Acute Support" : null,
      selection.recordsPathologyReview ? "Advanced Records & Pathology Review" : null,
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
    setForm((current) => ({
      ...current,
      complaint: current.complaint || `Clinical assessment request for ${detail.title}. Please describe the main symptoms, their duration, current medicines, and relevant medical history: `,
    }));
  };

  const openSpecialtyAssessment = (program: SpecialtyProgram) => {
    const request = createSpecialtyAssessmentRequest(program);
    setAssessmentPlan({
      title: request.title,
      description: program.description,
      durationText: request.durationText,
      scopeText: "The physician reviews clinical suitability, care scope, duration, and the final fee before treatment begins.",
      feeLabel: "Indicative fee range",
      feeDisplay: formatSpecialtyPriceRange(request.priceRange),
      specialtyProgramId: request.programId,
    });
    setAssessmentStep("intake");
    setFormErrors({});
    setForm((current) => ({
      ...current,
      complaint: current.complaint || `Clinical assessment request for ${program.title}. Please describe the main symptoms, their duration, current medicines, and relevant medical history: `,
    }));
  };

  const closeAssessment = () => {
    setAssessmentPlan(null);
    setAssessmentStep("intake");
    setFormErrors({});
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
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const message = `Hello Dr. Jethwani, I would like a clinical assessment.\n\n*PATIENT DETAILS*\n- Name: ${form.name.trim()} (${form.age.trim()} years, ${form.gender})\n- Contact: ${form.phone.trim()}\n- Email: ${form.email.trim() || "Not provided"}\n- City: ${form.city.trim() || "Not provided"}\n\n*SELECTED CARE*\n- Program: ${assessmentPlan.title}\n- Duration: ${assessmentPlan.durationText}\n- Scope: ${assessmentPlan.scopeText}\n- ${assessmentPlan.feeLabel}: ${assessmentPlan.feeDisplay}\n\n*CLINICAL HISTORY*\n${form.complaint.trim()}\n\nI understand that this is an assessment request, not a purchase. A physician will confirm suitability, care scope, duration, and the final fee before treatment begins.`;
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
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" /> Specialty Programs
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
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
                <div className="max-w-3xl">
                  <span className="text-[10px] font-bold text-mint uppercase tracking-widest">Assessment-led specialty care</span>
                  <h2 id="specialty-heading" className="font-serif text-3xl md:text-4xl font-semibold text-[#1A2421] dark:text-[#F8FAFC] mt-2">Specialty support programs</h2>
                  <p className="text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] leading-relaxed mt-3">Displayed ranges are indicative. No payment is requested until a physician confirms clinical suitability, scope, duration, and the final fee.</p>
                </div>
                <label className="relative w-full md:max-w-sm">
                  <span className="sr-only">Search specialty programs</span>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search specialty programs..." className="w-full pl-11 pr-5 py-3 rounded-full border border-slate-200 dark:border-white/15 bg-white/70 dark:bg-[#111827] text-sm text-[#1A2421] dark:text-white outline-none focus:border-mint" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSpecialtyPrograms.map((program) => (
                  <article key={program.id} className={`rounded-3xl border p-6 md:p-7 flex flex-col ${accentClasses[program.accent]}`}>
                    <div className="flex-1">
                      {program.badge && <span className="inline-flex rounded-full bg-[#1A2421] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white mb-3">{program.badge}</span>}
                      <h3 className="text-xl font-bold text-[#1A2421] dark:text-[#F8FAFC]">{program.title}</h3>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mt-1">{program.durationLabel}</p>
                      <div className="text-2xl font-black text-[#1A2421] dark:text-white mt-5">{formatSpecialtyPriceRange(program.priceRange)}</div>
                      <p className="text-[11px] font-bold text-mint-dark dark:text-[#5EEAD4] mt-1">Indicative range · confirmed after assessment</p>
                      <p className="text-sm font-semibold text-slate-650 dark:text-[#CBD5E1] leading-relaxed mt-5">{program.description}</p>
                      <ul className="space-y-2.5 mt-5">
                        {program.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-xs font-semibold text-slate-650 dark:text-[#CBD5E1]">
                            <CheckCircle2 className="w-4 h-4 text-mint shrink-0 mt-0.5" aria-hidden="true" /> {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button type="button" onClick={() => openSpecialtyAssessment(program)} className="w-full mt-7 py-3.5 rounded-full bg-[#1A2421] hover:bg-[#2b3a36] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                      Continue to Clinical Assessment <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </article>
                ))}
              </div>
              {!filteredSpecialtyPrograms.length && <p className="rounded-3xl border border-slate-200 p-8 text-center text-sm font-semibold text-slate-600 dark:text-[#CBD5E1]">No specialty programs match that search.</p>}
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
                      <label className="md:col-span-2 space-y-1">
                        <span className="text-[10px] font-black text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">Symptoms and clinical history *</span>
                        <textarea rows={5} value={form.complaint} onChange={(event) => updateForm("complaint", event.target.value)} className={`w-full p-3 rounded-xl border bg-white dark:bg-[#0F172A] text-sm text-[#1A2421] dark:text-white outline-none resize-y ${formErrors.complaint ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 dark:border-white/15 focus:border-mint"}`} />
                      </label>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                      <button type="button" onClick={closeAssessment} className="px-6 py-3 rounded-full border border-slate-200 dark:border-white/15 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">Cancel</button>
                      <button type="button" onClick={submitAssessment} className="px-7 py-3 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">Submit for Physician Review <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 max-w-lg mx-auto">
                    <CheckCircle2 className="w-14 h-14 text-mint mx-auto" aria-hidden="true" />
                    <span className="block text-[10px] font-bold text-mint uppercase tracking-widest mt-5">Assessment request prepared</span>
                    <h2 id="assessment-title" className="font-serif text-3xl font-semibold text-[#1A2421] dark:text-white mt-2">Complete the request in WhatsApp</h2>
                    <p className="text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] leading-relaxed mt-3">A pre-filled WhatsApp message has opened. Send it to the clinic for physician review. No payment has been requested or authorized.</p>
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
