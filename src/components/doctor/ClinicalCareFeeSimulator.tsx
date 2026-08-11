"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import styles from "./ClinicalCareFeeSimulator.module.css";
import {
  applyPhysicianPathwayOverride,
  buildClinicalCareQuote,
  recommendClinicalCare,
  type AccessConsideration,
  type CareIntensity,
  type CaseChronicity,
  type CaseStability,
  type ClinicalCareAssessment,
  type ClinicalCareQuote,
  type ClinicalCareRecommendation,
  type CoordinationLoad,
  type OrganBreadth,
  type PathologyDepth,
  type PharmacyQuoteItem,
} from "@/lib/clinicalCareSimulator";
import { CARE_LEVELS_DETAILS, calculateContinuityCareTotal } from "@/lib/pricingConfig";

export interface ClinicalCareSimulatorDecision {
  assessment: ClinicalCareAssessment;
  recommendation: ClinicalCareRecommendation;
  durationWeeks: number;
  caseSpecificSupportAmount: number;
  caseSpecificSupportCategory: string;
  caseSpecificSupportReason: string;
  pharmacyItems: PharmacyQuoteItem[];
  concessionAmount: number;
  concessionReason: string;
  quote: ClinicalCareQuote;
  physicianConfirmed: true;
  confirmedAt: string;
  quotationId: string;
  validUntil: string;
  approvalStatus: "pending-patient-approval" | "approved" | "revision-requested" | "declined";
  selectionMode: "recommended" | "physician-override";
  recommendedPathway: ClinicalCareRecommendation["pathway"];
  selectedPathway: ClinicalCareRecommendation["pathway"];
  manualSelectionReason: string;
  pricingRuleVersion: string;
}

interface Props {
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  onApply: (decision: ClinicalCareSimulatorDecision) => void;
}

const inputClass = `${styles.input} w-full rounded-xl border px-3 py-2.5 text-xs font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30`;
const labelClass = `${styles.label} mb-1 block text-[10px] font-extrabold uppercase tracking-wider`;

const pharmacyTypes = [
  "Dilution",
  "Mother Tincture",
  "Cream / Ointment",
  "Drops",
  "Biochemic",
  "Trituration",
  "Special Compound",
  "Delivery",
];

const clinicalSupportCategories = [
  "Case-specific clinical support",
  "Senior physician case review",
  "External specialist coordination",
  "Multidisciplinary case conference",
  "Care navigation & records coordination",
];

const breadthLabels: Record<OrganBreadth, string> = {
  one: "1 organ system",
  "two-three": "2–3 organ systems",
  "four-five": "4–5 organ systems",
  "six-plus": "6+ organ systems",
  unsure: "Not yet established",
};

function VisualLineBarSelector<T extends string>({
  label,
  options,
  selectedValue,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string; subtext?: string }>;
  selectedValue: T;
  onChange: (val: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-300">
          {label}
        </span>
        <span className="text-[10px] font-mono font-extrabold text-teal-400">
          {options.find((o) => o.value === selectedValue)?.label}
        </span>
      </div>

      {/* Interactive Segment Line-Bar */}
      <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
        {options.map((opt) => {
          const isSelected = opt.value === selectedValue;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 min-w-[70px] py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all flex flex-col items-center justify-center text-center cursor-pointer border ${
                isSelected
                  ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-400 shadow-md shadow-teal-500/20 scale-[1.02]"
                  : "bg-slate-900/80 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span className="truncate w-full">{opt.label}</span>
              {opt.subtext && (
                <span className={`text-[9px] font-mono mt-0.5 truncate ${isSelected ? "text-teal-100" : "text-slate-500"}`}>
                  {opt.subtext}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ClinicalCareFeeSimulator({ patientId, patientName, patientAge, onApply }: Props) {
  const [assessment, setAssessment] = useState<ClinicalCareAssessment>({
    breadth: "one",
    pathologyDepth: "functional",
    chronicity: "months",
    intensity: "standard",
    coordination: "minimal",
    stability: "stable",
    accessConsideration: patientAge && patientAge >= 60 ? "senior" : "none",
  });
  const automaticRecommendation = useMemo(() => recommendClinicalCare(assessment), [assessment]);
  const [selectedPathway, setSelectedPathway] = useState<"recommended" | ClinicalCareRecommendation["pathway"]>("recommended");
  const [manualSelectionReason, setManualSelectionReason] = useState("");
  const recommendation = useMemo(
    () => selectedPathway === "recommended"
      ? automaticRecommendation
      : applyPhysicianPathwayOverride(automaticRecommendation, selectedPathway),
    [automaticRecommendation, selectedPathway],
  );
  const [durationWeeks, setDurationWeeks] = useState(recommendation.suggestedDurationWeeks);
  const [supportAmount, setSupportAmount] = useState(0);
  const [supportCategory, setSupportCategory] = useState(clinicalSupportCategories[0]);
  const [supportReason, setSupportReason] = useState("");
  const [concessionAmount, setConcessionAmount] = useState(0);
  const [concessionReason, setConcessionReason] = useState("");
  const [pharmacyItems, setPharmacyItems] = useState<PharmacyQuoteItem[]>([]);
  const [pharmacyType, setPharmacyType] = useState(pharmacyTypes[0]);
  const [pharmacyDetails, setPharmacyDetails] = useState("");
  const [pharmacyQuantity, setPharmacyQuantity] = useState(1);
  const [pharmacyUnitPrice, setPharmacyUnitPrice] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState("");

  useEffect(() => {
    setDraftHydrated(false);
    const defaultAssessment: ClinicalCareAssessment = {
      breadth: "one",
      pathologyDepth: "functional",
      chronicity: "months",
      intensity: "standard",
      coordination: "minimal",
      stability: "stable",
      accessConsideration: patientAge && patientAge >= 60 ? "senior" : "none",
    };
    const storageKey = `homeo.clinical-care-draft.${patientId || "standalone"}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const draft = JSON.parse(saved);
        setAssessment(draft.assessment || defaultAssessment);
        setSelectedPathway(draft.selectedPathway || "recommended");
        setManualSelectionReason(draft.manualSelectionReason || "");
        setDurationWeeks(Number(draft.durationWeeks) || 1);
        setSupportAmount(Number(draft.supportAmount) || 0);
        setSupportCategory(draft.supportCategory || clinicalSupportCategories[0]);
        setSupportReason(draft.supportReason || "");
        setConcessionAmount(Number(draft.concessionAmount) || 0);
        setConcessionReason(draft.concessionReason || "");
        setPharmacyItems(Array.isArray(draft.pharmacyItems) ? draft.pharmacyItems : []);
        setDraftSavedAt(draft.updatedAt || "");
      } else {
        setAssessment(defaultAssessment);
        setSelectedPathway("recommended");
        setManualSelectionReason("");
        setSupportAmount(0);
        setSupportCategory(clinicalSupportCategories[0]);
        setSupportReason("");
        setConcessionAmount(0);
        setConcessionReason("");
        setPharmacyItems([]);
        setDraftSavedAt("");
      }
    } catch {
      setAssessment(defaultAssessment);
    }
    setConfirmed(false);
    setDraftHydrated(true);
  }, [patientId, patientName, patientAge]);

  useEffect(() => {
    if (!draftHydrated) return;
    const updatedAt = new Date().toISOString();
    localStorage.setItem(`homeo.clinical-care-draft.${patientId || "standalone"}`, JSON.stringify({
      assessment, selectedPathway, manualSelectionReason, durationWeeks, supportAmount, supportCategory,
      supportReason, concessionAmount, concessionReason, pharmacyItems, updatedAt,
    }));
    setDraftSavedAt(updatedAt);
  }, [assessment, concessionAmount, concessionReason, draftHydrated, durationWeeks, manualSelectionReason, patientId, pharmacyItems, selectedPathway, supportAmount, supportCategory, supportReason]);

  useEffect(() => {
    setDurationWeeks(current => recommendation.allowedDurationsWeeks.includes(current)
      ? current
      : recommendation.suggestedDurationWeeks);
    setConfirmed(false);
  }, [recommendation.pathway, recommendation.suggestedDurationWeeks]);

  const quote = useMemo(() => {
    if (recommendation.blockedBySafetyGate) return null;
    try {
      return buildClinicalCareQuote({
        recommendation,
        durationWeeks,
        caseSpecificSupportAmount: supportAmount,
        pharmacyItems,
        concessionAmount,
      });
    } catch {
      return null;
    }
  }, [recommendation, durationWeeks, supportAmount, pharmacyItems, concessionAmount]);

  const missingSupportReason = supportAmount > 0 && supportReason.trim().length < 5;
  const missingConcessionReason = concessionAmount > 0 && concessionReason.trim().length < 5;
  const missingOverrideReason = selectedPathway !== "recommended" && manualSelectionReason.trim().length < 5;
  const pharmacyItemsTotal = pharmacyItems.reduce((sum, item) => sum + item.amount, 0);
  const canApply = Boolean(quote && confirmed && !missingSupportReason && !missingConcessionReason && !missingOverrideReason);

  const updateAssessment = <K extends keyof ClinicalCareAssessment>(key: K, value: ClinicalCareAssessment[K]) => {
    setAssessment(current => ({ ...current, [key]: value }));
    setConfirmed(false);
  };

  const pathwayOptions: Array<{ value: ClinicalCareRecommendation["pathway"]; label: string; weeklyFee: number }> = [
    { value: "mild", label: CARE_LEVELS_DETAILS.mild.title, weeklyFee: CARE_LEVELS_DETAILS.mild.weeklyPrice },
    { value: "moderate", label: CARE_LEVELS_DETAILS.moderate.title, weeklyFee: CARE_LEVELS_DETAILS.moderate.weeklyPrice },
    { value: "focused", label: CARE_LEVELS_DETAILS.focused.title, weeklyFee: CARE_LEVELS_DETAILS.focused.weeklyPrice },
    { value: "comprehensive", label: CARE_LEVELS_DETAILS.comprehensive.title, weeklyFee: CARE_LEVELS_DETAILS.comprehensive.weeklyPrice },
  ];

  const addPharmacyItem = () => {
    if (pharmacyUnitPrice <= 0 || pharmacyQuantity <= 0) return;
    const amount = pharmacyQuantity * pharmacyUnitPrice;
    setPharmacyItems(items => [...items, {
      id: `${Date.now()}-${items.length}`,
      type: pharmacyType,
      details: pharmacyDetails.trim() || "As clinically prescribed",
      quantity: pharmacyQuantity,
      unitPrice: pharmacyUnitPrice,
      amount,
    }]);
    setPharmacyDetails("");
    setPharmacyQuantity(1);
    setPharmacyUnitPrice(0);
    setConfirmed(false);
  };

  return (
    <section className={`${styles.root} rounded-3xl border border-teal-300 p-5 shadow-sm dark:border-teal-700 sm:p-6`}>
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-4 dark:border-slate-700 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Doctor decision support</p>
          <h3 className={`${styles.title} mt-1 text-lg font-bold`}>Clinical Care & Fee Simulator</h3>
          <p className={`${styles.bodyText} mt-1 max-w-3xl text-xs leading-relaxed`}>
            Assess workload first, then build an itemized quotation. Organ-system count, disease name, age and financial circumstances never create an automatic surcharge.
          </p>
        </div>
        <span className="w-fit rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white dark:bg-teal-300 dark:text-slate-950">
          {patientName ? `Patient: ${patientName}` : "Standalone simulation"}
        </span>
        {draftSavedAt && <span className={`${styles.helperText} text-[10px]`}>Draft autosaved</span>}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-7">
          <fieldset className={`${styles.fieldset} rounded-2xl border p-4 space-y-4`}>
            <legend className={`${styles.legend} px-2 text-xs font-black`}>1. Clinical breadth, depth and stability</legend>

            <VisualLineBarSelector
              label="Organ-System Involvement"
              selectedValue={assessment.breadth}
              onChange={(val) => updateAssessment("breadth", val as OrganBreadth)}
              options={[
                { value: "one", label: "1 System" },
                { value: "two-three", label: "2–3 Systems" },
                { value: "four-five", label: "4–5 Systems" },
                { value: "six-plus", label: "6+ Systems" },
              ]}
            />

            <VisualLineBarSelector
              label="Pathology Depth"
              selectedValue={assessment.pathologyDepth}
              onChange={(val) => updateAssessment("pathologyDepth", val as PathologyDepth)}
              options={[
                { value: "functional", label: "Functional" },
                { value: "established", label: "Established" },
                { value: "structural", label: "Structural" },
                { value: "advanced", label: "Advanced" },
              ]}
            />

            <VisualLineBarSelector
              label="Current Stability"
              selectedValue={assessment.stability}
              onChange={(val) => updateAssessment("stability", val as CaseStability)}
              options={[
                { value: "stable", label: "Stable" },
                { value: "fluctuating", label: "Fluctuating" },
                { value: "rapid-change", label: "Rapid Change" },
                { value: "red-flag", label: "Red Flag" },
              ]}
            />
          </fieldset>

          <fieldset className={`${styles.fieldset} rounded-2xl border p-4 space-y-4`}>
            <legend className={`${styles.legend} px-2 text-xs font-black`}>2. Time, intensity and coordination</legend>

            <VisualLineBarSelector
              label="Case Duration"
              selectedValue={assessment.chronicity}
              onChange={(val) => updateAssessment("chronicity", val as CaseChronicity)}
              options={[
                { value: "recent", label: "Acute (< 1 mo)" },
                { value: "months", label: "Months" },
                { value: "one-five-years", label: "1–5 Years" },
                { value: "over-five-years", label: "> 5 Years" },
              ]}
            />

            <VisualLineBarSelector
              label="Review Intensity Needed"
              selectedValue={assessment.intensity}
              onChange={(val) => updateAssessment("intensity", val as CareIntensity)}
              options={[
                { value: "standard", label: "Standard" },
                { value: "closer", label: "Closer" },
                { value: "frequent", label: "Frequent" },
                { value: "direct", label: "Direct Supervision" },
              ]}
            />

            <VisualLineBarSelector
              label="Records / Coordination"
              selectedValue={assessment.coordination}
              onChange={(val) => updateAssessment("coordination", val as CoordinationLoad)}
              options={[
                { value: "minimal", label: "Minimal" },
                { value: "records", label: "Records Review" },
                { value: "multi-clinician", label: "Multi-Clinician" },
                { value: "extensive", label: "Extensive" },
              ]}
            />
          </fieldset>

          <fieldset className={`${styles.fieldset} rounded-2xl border p-4 sm:p-5`}>
            <legend className={`${styles.legend} px-2 text-sm font-black`}>3. Itemized support and medicines</legend>
            <p className={`${styles.helperText} mb-4 text-xs leading-relaxed`}>
              Add only confirmed, case-specific work and supplied medicines. Each amount remains visible as a separate quotation item.
            </p>

            <section className={`${styles.subPanel} rounded-2xl border p-4`} aria-labelledby="clinical-support-heading">
              <div className="mb-3">
                <h4 id="clinical-support-heading" className={`${styles.subTitle} text-sm font-black`}>Case-Specific Clinical Support</h4>
                <p className={`${styles.helperText} mt-1 text-[11px] leading-relaxed`}>Optional doctor-entered fee for documented additional review, monitoring, or coordination. It is never calculated automatically.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
                <label className="sm:col-span-2">
                  <span className={`${labelClass} !text-[11px]`}>Support type</span>
                  <select className={inputClass} value={supportCategory} onChange={e => { setSupportCategory(e.target.value); setConfirmed(false); }}>
                    {clinicalSupportCategories.map(category => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className={`${labelClass} !text-[11px]`}>Support fee (₹)</span>
                  <input className={inputClass} type="number" min="0" step="1000" value={supportAmount || ""} placeholder="Enter amount" onChange={e => { setSupportAmount(Math.max(0, Number(e.target.value))); setConfirmed(false); }} />
                  <span className={`${styles.helperText} mt-1 block text-[10px]`}>Use ₹1,000 increments</span>
                </label>
                <label className="sm:col-span-3">
                  <span className={`${labelClass} !text-[11px]`}>Clinical reason</span>
                  <input className={inputClass} value={supportReason} placeholder="e.g. extended records review and care coordination" onChange={e => { setSupportReason(e.target.value); setConfirmed(false); }} />
                  <span className={`${styles.helperText} mt-1 block text-[10px]`}>Required whenever a support fee is entered</span>
                </label>
              </div>
              {missingSupportReason && <p className="mt-2 rounded-lg bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-600 dark:text-rose-300">Please document why this additional clinical workload is required.</p>}
            </section>

            <section className={`${styles.subPanel} mt-4 rounded-2xl border p-4`} aria-labelledby="medicines-heading">
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 id="medicines-heading" className={`${styles.subTitle} text-sm font-black`}>Medicines, Applications & Delivery</h4>
                  <p className={`${styles.helperText} mt-1 text-[11px] leading-relaxed`}>Record only items actually prescribed or supplied for this case.</p>
                </div>
                <span className="w-fit rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-black text-teal-800 dark:bg-teal-400/15 dark:text-teal-200">Items total: ₹{pharmacyItemsTotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
                <label className="sm:col-span-3"><span className={`${labelClass} !text-[11px]`}>Item type</span><select className={inputClass} value={pharmacyType} onChange={e => setPharmacyType(e.target.value)}>{pharmacyTypes.map(type => <option key={type}>{type}</option>)}</select></label>
                <label className="sm:col-span-3"><span className={`${labelClass} !text-[11px]`}>Details</span><input className={inputClass} value={pharmacyDetails} placeholder="Potency, size or directions" onChange={e => setPharmacyDetails(e.target.value)} /></label>
                <label className="sm:col-span-2"><span className={`${labelClass} !text-[11px]`}>Quantity</span><input className={inputClass} type="number" min="1" value={pharmacyQuantity} onChange={e => setPharmacyQuantity(Math.max(1, Number(e.target.value)))} /></label>
                <label className="sm:col-span-2"><span className={`${labelClass} !text-[11px]`}>Unit price (₹)</span><input className={inputClass} type="number" min="0" step="100" value={pharmacyUnitPrice || ""} placeholder="0" onChange={e => setPharmacyUnitPrice(Math.max(0, Number(e.target.value)))} /></label>
                <button type="button" onClick={addPharmacyItem} className="flex min-h-10 items-center justify-center gap-1 rounded-xl bg-teal-600 px-3 py-2 text-xs font-black text-white hover:bg-teal-500 sm:col-span-2" aria-label="Add pharmacy item"><Plus className="h-4 w-4" /><span>Add item</span></button>
              </div>

              {pharmacyItems.length === 0 ? (
                <div className={`${styles.helperText} mt-4 rounded-xl border border-dashed border-slate-400/50 px-4 py-3 text-center text-[11px]`}>No medicines or delivery items added.</div>
              ) : (
                <div className="mt-4 space-y-2" aria-label="Added medicine items">
                  <div className="flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-300"><span>Added items</span><span>Amount</span></div>
                  {pharmacyItems.map(item => (
                    <div key={item.id} className={`${styles.itemRow} flex flex-col gap-2 rounded-xl border px-3 py-3 text-xs sm:flex-row sm:items-center sm:justify-between`}>
                      <div className="min-w-0">
                        <div className="font-black">{item.type}</div>
                        <div className={`${styles.helperText} mt-0.5 break-words text-[11px]`}>{item.details}</div>
                        <div className={`${styles.helperText} mt-1 text-[10px]`}>{item.quantity} × ₹{item.unitPrice.toLocaleString("en-IN")} per item</div>
                      </div>
                      <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                        <strong className="text-sm">₹{item.amount.toLocaleString("en-IN")}</strong>
                        <button type="button" aria-label={`Remove ${item.type}`} onClick={() => { setPharmacyItems(items => items.filter(candidate => candidate.id !== item.id)); setConfirmed(false); }} className="rounded-lg border border-rose-400/40 p-2 text-rose-600 hover:bg-rose-500/10 dark:text-rose-300"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </fieldset>

          <fieldset className={`${styles.fieldset} rounded-2xl border p-4`}>
            <legend className={`${styles.legend} px-2 text-xs font-black`}>4. Access consideration (never a surcharge)</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label><span className={labelClass}>Consideration</span><select className={inputClass} value={assessment.accessConsideration} onChange={e => updateAssessment("accessConsideration", e.target.value as AccessConsideration)}><option value="none">None</option><option value="senior">Senior citizen</option><option value="financial-hardship">Financial hardship</option><option value="custom">Other documented reason</option></select></label>
              <label><span className={labelClass}>Concession amount (₹)</span><input className={inputClass} type="number" min="0" step="1000" value={concessionAmount || ""} placeholder="0" onChange={e => { setConcessionAmount(Math.max(0, Number(e.target.value))); setConfirmed(false); }} /></label>
              <label><span className={labelClass}>Reason</span><input className={inputClass} value={concessionReason} placeholder="Required when concession applies" onChange={e => { setConcessionReason(e.target.value); setConfirmed(false); }} /></label>
            </div>
            {missingConcessionReason && <p className="mt-1 text-[10px] font-bold text-rose-600">Document the reason for the concession.</p>}
          </fieldset>
        </div>

        <aside className="self-start rounded-2xl border border-slate-200 bg-slate-950 p-5 text-slate-100 xl:sticky xl:top-4 xl:col-span-5 dark:border-slate-700">
          {recommendation.blockedBySafetyGate ? (
            <div className="rounded-2xl border border-rose-500 bg-rose-500/10 p-4">
              <div className="flex items-center gap-2 font-black text-rose-300"><AlertTriangle className="h-5 w-5" /> Safety gate active</div>
              <p className="mt-2 text-xs leading-relaxed text-rose-100">Address urgent assessment, referral or emergency care before confirming a pathway or quotation.</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-300">Suggested pathway</p>
              <h4 className="mt-1 text-xl font-black text-white">{automaticRecommendation.title}</h4>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-300">The recommendation supports judgment; the treating physician may select any pathway below.</p>
              <label className="mt-4 block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-300">Pathway decision</span>
                <select
                  className={`${styles.input} w-full rounded-xl border px-3 py-2.5 text-xs font-bold`}
                  value={selectedPathway}
                  onChange={e => {
                    setSelectedPathway(e.target.value as "recommended" | ClinicalCareRecommendation["pathway"]);
                    setConfirmed(false);
                  }}
                >
                  <option value="recommended">Use recommendation — {automaticRecommendation.title}</option>
                  {pathwayOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} — ₹{option.weeklyFee.toLocaleString("en-IN")}/week
                    </option>
                  ))}
                </select>
              </label>
              {selectedPathway !== "recommended" && (
                <div className="mt-2 rounded-xl border border-sky-400/40 bg-sky-400/10 p-3 text-[10px] leading-relaxed text-sky-100">
                  <p>Manual physician selection: {recommendation.title}. The recommendation remains recorded for audit.</p>
                  <label className="mt-2 block"><span className="mb-1 block font-bold uppercase tracking-wider">Reason for physician selection</span><input className={`${styles.input} w-full rounded-lg border px-3 py-2 text-xs`} value={manualSelectionReason} placeholder="Document the clinical reason" onChange={e => { setManualSelectionReason(e.target.value); setConfirmed(false); }} /></label>
                  {missingOverrideReason && <p className="mt-1 font-bold text-amber-200">A brief reason is required.</p>}
                </div>
              )}
              <p className="mt-2 text-sm font-bold text-teal-300">Selected pathway fee: ₹{recommendation.weeklyFee.toLocaleString("en-IN")} / week</p>
              <label className="mt-4 block"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-300">Care period</span><select className={`${styles.input} w-full rounded-xl border px-3 py-2.5 text-xs font-bold`} value={durationWeeks} onChange={e => { setDurationWeeks(Number(e.target.value)); setConfirmed(false); }}>{recommendation.allowedDurationsWeeks.map(weeks => { const continuity = calculateContinuityCareTotal(recommendation.weeklyFee, weeks); return <option key={weeks} value={weeks}>{weeks} {weeks === 1 ? "week" : "weeks"} · ₹{continuity.total.toLocaleString("en-IN")}{continuity.discountPercent > 0 ? ` · ${continuity.discountPercent}% benefit` : ""}{weeks === 1 && recommendation.pathway !== "mild" ? " · initial period; reassessment required" : ""}</option>; })}</select></label>
              {durationWeeks === 1 && recommendation.pathway !== "mild" && <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-[10px] leading-relaxed text-amber-100">One-week initial care period — physician reassessment is required before continuation.</p>}
              <div className="mt-4 space-y-2">{recommendation.reasons.map(reason => <div key={reason} className="flex gap-2 text-xs leading-relaxed text-slate-200"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />{reason}</div>)}</div>
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[10px] leading-relaxed text-amber-100">{recommendation.cautions.join(" ")}</div>
              {quote && <div className="mt-5 space-y-2 border-t border-slate-700 pt-4 text-xs"><div className="flex justify-between"><span>List care-period fee</span><strong>₹{quote.listCareTotal.toLocaleString("en-IN")}</strong></div>{quote.continuityDiscountTotal > 0 && <div className="flex justify-between text-teal-300"><span>Continuity care benefit ({quote.continuityDiscountPercent}%)</span><strong>−₹{quote.continuityDiscountTotal.toLocaleString("en-IN")}</strong></div>}<div className="flex justify-between"><span>Care fee after benefit</span><strong>₹{quote.baseCareTotal.toLocaleString("en-IN")}</strong></div>{quote.caseSpecificSupportTotal > 0 && <div className="flex justify-between"><span>Clinical support</span><strong>+₹{quote.caseSpecificSupportTotal.toLocaleString("en-IN")}</strong></div>}{quote.pharmacyTotal > 0 && <div className="flex justify-between"><span>Itemized pharmacy</span><strong>+₹{quote.pharmacyTotal.toLocaleString("en-IN")}</strong></div>}{quote.concessionTotal > 0 && <div className="flex justify-between text-indigo-300"><span>Documented concession</span><strong>−₹{quote.concessionTotal.toLocaleString("en-IN")}</strong></div>}<div className="flex justify-between border-t border-slate-700 pt-3 text-base"><span className="font-black">Pending quotation</span><strong className="text-teal-300">₹{quote.finalTotal.toLocaleString("en-IN")}</strong></div></div>}
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs leading-relaxed"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-teal-500" /><span>I confirm the pathway, duration, scope and fee after clinical review.</span></label>
              <button type="button" disabled={!canApply} onClick={() => {
                if (!quote) return;
                const now = new Date();
                const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                const quotationId = `QTN-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`;
                onApply({ assessment, recommendation, durationWeeks, caseSpecificSupportAmount: supportAmount, caseSpecificSupportCategory: supportCategory, caseSpecificSupportReason: supportReason.trim(), pharmacyItems, concessionAmount: quote.concessionTotal, concessionReason: concessionReason.trim(), quote, physicianConfirmed: true, confirmedAt: now.toISOString(), quotationId, validUntil: validUntil.toISOString(), approvalStatus: "pending-patient-approval", selectionMode: selectedPathway === "recommended" ? "recommended" : "physician-override", recommendedPathway: automaticRecommendation.pathway, selectedPathway: recommendation.pathway, manualSelectionReason: manualSelectionReason.trim(), pricingRuleVersion: recommendation.version });
              }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-40"><ShieldCheck className="h-4 w-4" /> Apply to pending plan</button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
