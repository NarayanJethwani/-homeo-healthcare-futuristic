"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import styles from "./ClinicalCareFeeSimulator.module.css";
import {
  applyPhysicianPlanOverride,
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
import { CARE_PLAN_CATALOG, CARE_PLAN_IDS, calculateCarePlanTotal, formatCarePlanDuration, type CarePlanDurationUnit, type CarePlanFamily, type CarePlanId } from "@/lib/pricingConfig";

export interface ClinicalCareSimulatorDecision {
  assessment: ClinicalCareAssessment;
  recommendation: ClinicalCareRecommendation;
  durationWeeks: number;
  planId: CarePlanId;
  planFamily: CarePlanFamily;
  durationValue: number;
  durationUnit: CarePlanDurationUnit;
  conditionsCount: number;
  selectedConcerns: string[];
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
  recommendedPlanId: CarePlanId;
  selectedPlanId: CarePlanId;
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

const legacyPathwayPlanMap: Record<string, CarePlanId> = {
  mild: "acute_wellness_7d",
  chronic_focused: "chronic_focused_1w",
  moderate: "chronic_integrated_1w",
  focused: "chronic_complex_1w",
  organ: "chronic_pathological_1w",
  comprehensive: "chronic_advanced_1w",
  acute_critical: "acute_priority_1w",
};

const breadthLabels: Record<OrganBreadth, string> = {
  one: "1 organ system",
  "two-three": "2–3 organ systems",
  "four-five": "4–5 organ systems",
  "six-plus": "6+ organ systems",
  unsure: "Not yet established",
};

const DOCTOR_PLAN_CATEGORIES = [
  { id: "all", label: "All Concerns" },
  { id: "digestive", label: "Digestive & Gut" },
  { id: "respiratory", label: "Respiratory & ENT" },
  { id: "skin", label: "Skin & Hair" },
  { id: "joints", label: "Bones & Joints" },
  { id: "metabolic", label: "Metabolic & Thyroid" },
  { id: "neuro", label: "Stress & Headaches" },
  { id: "women", label: "Women's Health" },
  { id: "pediatric", label: "Child Health" },
];

const POPULAR_DOCTOR_PLAN_CONCERNS = [
  { id: "acidity", label: "Acidity / GERD", category: "digestive", system: "Digestive", level: "mild" },
  { id: "ibs", label: "Chronic IBS", category: "digestive", system: "Digestive", level: "moderate" },
  { id: "fatty-liver", label: "Fatty Liver", category: "digestive", system: "Digestive", level: "organ" },
  { id: "sinusitis", label: "Recurrent Sinusitis / Allergy", category: "respiratory", system: "Respiratory & ENT", level: "moderate" },
  { id: "asthma", label: "Bronchial Asthma", category: "respiratory", system: "Respiratory & ENT", level: "focused" },
  { id: "eczema", label: "Chronic Eczema / Dermatitis", category: "skin", system: "Skin & Hair", level: "moderate" },
  { id: "psoriasis", label: "Psoriasis", category: "skin", system: "Skin & Hair", level: "focused" },
  { id: "hair-fall", label: "Hair Fall / Alopecia", category: "skin", system: "Skin & Hair", level: "mild" },
  { id: "joint-pain", label: "Knee / Joint Pain (Arthritis)", category: "joints", system: "Bones & Joints", level: "moderate" },
  { id: "cervical", label: "Cervical / Lumbar Spondylosis", category: "joints", system: "Bones & Joints", level: "moderate" },
  { id: "migraine", label: "Vascular Migraine / Headaches", category: "neuro", system: "Stress & Neuro", level: "focused" },
  { id: "insomnia", label: "Stress / Sleep Disturbances", category: "neuro", system: "Stress & Neuro", level: "mild" },
  { id: "thyroid", label: "Hypothyroidism (Hashimoto's)", category: "metabolic", system: "Metabolic & Endocrine", level: "focused" },
  { id: "pcos", label: "PCOS / Irregular Cycles", category: "women", system: "Women's Health", level: "focused" },
  { id: "uti", label: "Recurrent UTI / Renal Spasms", category: "metabolic", system: "Urology", level: "moderate" },
  { id: "pediatric", label: "Frequent Colds / Tonsillitis", category: "pediatric", system: "Child Health", level: "mild" },
];

const surchargesLookup: Record<string, { unitWeekly: number }> = {
  mild: { unitWeekly: 500 },
  chronic_focused: { unitWeekly: 1000 },
  moderate: { unitWeekly: 1500 },
  focused: { unitWeekly: 3000 },
  organ: { unitWeekly: 2000 },
  comprehensive: { unitWeekly: 3000 },
  acute_critical: { unitWeekly: 1250 },
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
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          {label}
        </span>
        <span className="text-xs font-mono font-black text-teal-700 dark:text-teal-400">
          {options.find((o) => o.value === selectedValue)?.label}
        </span>
      </div>

      {/* Interactive Segment Line-Bar */}
      <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 gap-1.5">
        {options.map((opt) => {
          const isSelected = opt.value === selectedValue;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 min-w-[75px] py-2 px-2 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center text-center cursor-pointer border-2 ${
                isSelected
                  ? "bg-teal-700 text-white border-teal-600 shadow-sm scale-[1.01]"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <span className="truncate w-full">{opt.label}</span>
              {opt.subtext && (
                <span className={`text-[9.5px] font-mono mt-0.5 truncate ${isSelected ? "text-teal-100" : "text-slate-500 dark:text-slate-400"}`}>
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
    chronicity: "recent",
    intensity: "standard",
    coordination: "minimal",
    stability: "stable",
    accessConsideration: patientAge && patientAge >= 60 ? "senior" : "none",
  });
  const automaticRecommendation = useMemo(() => recommendClinicalCare(assessment), [assessment]);
  const [selectedPlanId, setSelectedPlanId] = useState<"recommended" | CarePlanId>("recommended");
  const [manualSelectionReason, setManualSelectionReason] = useState("");
  const recommendation = useMemo(
    () => selectedPlanId === "recommended"
      ? automaticRecommendation
      : applyPhysicianPlanOverride(automaticRecommendation, selectedPlanId),
    [automaticRecommendation, selectedPlanId],
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
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [concernCategory, setConcernCategory] = useState<string>("all");
  const [conditionsCount, setConditionsCount] = useState<number>(1);
  const [confirmed, setConfirmed] = useState(false);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState("");

  useEffect(() => {
    setDraftHydrated(false);
    const defaultAssessment: ClinicalCareAssessment = {
      breadth: "one",
      pathologyDepth: "functional",
      chronicity: "recent",
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
        const storedSelection = draft.selectedPlanId || legacyPathwayPlanMap[draft.selectedPathway] || "recommended";
        setSelectedPlanId(storedSelection === "recommended" || storedSelection in CARE_PLAN_CATALOG ? storedSelection : "recommended");
        setManualSelectionReason(draft.manualSelectionReason || "");
        setDurationWeeks(Number(draft.durationWeeks) || 1);
        setSelectedConcerns(Array.isArray(draft.selectedConcerns) ? draft.selectedConcerns : []);
        setConditionsCount(Number(draft.conditionsCount) || 1);
        setSupportAmount(Number(draft.supportAmount) || 0);
        setSupportCategory(draft.supportCategory || clinicalSupportCategories[0]);
        setSupportReason(draft.supportReason || "");
        setConcessionAmount(Number(draft.concessionAmount) || 0);
        setConcessionReason(draft.concessionReason || "");
        setPharmacyItems(Array.isArray(draft.pharmacyItems) ? draft.pharmacyItems : []);
        setDraftSavedAt(draft.updatedAt || "");
      } else {
        setAssessment(defaultAssessment);
        setSelectedPlanId("recommended");
        setManualSelectionReason("");
        setSelectedConcerns([]);
        setConditionsCount(1);
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
      assessment, selectedPlanId, manualSelectionReason, durationWeeks, selectedConcerns, conditionsCount, supportAmount, supportCategory,
      supportReason, concessionAmount, concessionReason, pharmacyItems, updatedAt,
    }));
    setDraftSavedAt(updatedAt);
  }, [assessment, concessionAmount, concessionReason, conditionsCount, draftHydrated, durationWeeks, manualSelectionReason, patientId, pharmacyItems, selectedConcerns, selectedPlanId, supportAmount, supportCategory, supportReason]);

  const toggleConcern = (concernLabel: string) => {
    setSelectedConcerns((prev) => {
      const exists = prev.includes(concernLabel);
      const next = exists ? prev.filter((c) => c !== concernLabel) : [...prev, concernLabel];
      const count = Math.min(5, Math.max(1, next.length));
      setConditionsCount(count);
      return next;
    });
    setConfirmed(false);
  };

  const clearConcerns = () => {
    setSelectedConcerns([]);
    setConditionsCount(1);
    setConfirmed(false);
  };

  useEffect(() => {
    setDurationWeeks(current => recommendation.allowedDurationsWeeks.includes(current)
      ? current
      : recommendation.suggestedDurationWeeks);
    setConfirmed(false);
  }, [recommendation.allowedDurationsWeeks, recommendation.planId, recommendation.suggestedDurationWeeks]);

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
  const missingOverrideReason = selectedPlanId !== "recommended" && manualSelectionReason.trim().length < 5;
  const pharmacyItemsTotal = pharmacyItems.reduce((sum, item) => sum + item.amount, 0);
  const canApply = Boolean(quote && confirmed && !missingSupportReason && !missingConcessionReason && !missingOverrideReason);

  const updateAssessment = <K extends keyof ClinicalCareAssessment>(key: K, value: ClinicalCareAssessment[K]) => {
    setAssessment(current => ({ ...current, [key]: value }));
    setConfirmed(false);
  };

  const pathwayOptions = CARE_PLAN_IDS.map(value => ({ value, ...CARE_PLAN_CATALOG[value] }));

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
          <h3 className={`${styles.title} mt-1 text-lg font-bold`}>Clinical Care Plan & Quotation Builder</h3>
          <p className={`${styles.bodyText} mt-1 max-w-3xl text-xs leading-relaxed`}>
            Complete the clinical safety and workload review first, then create a separate itemized quotation. Diagnosis, organ-system count, pathology depth, chronicity, age and financial circumstances never increase the fee automatically.
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

          {/* 3. Health Concerns & Multi-System Scope */}
          <fieldset className={`${styles.fieldset} rounded-2xl border p-4 sm:p-5 space-y-4`}>
            <legend className={`${styles.legend} px-2 text-xs font-black`}>3. Health Concerns & Multi-System Scope</legend>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={`${styles.helperText} text-xs leading-relaxed`}>
                  Select active health complaints to cover simultaneously under this care program. Multi-system tracking scales physician analysis time.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-teal-100 dark:bg-teal-950/80 px-2.5 py-1 text-[10.5px] font-black text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                  {conditionsCount === 1 ? "1 Primary Concern" : `${conditionsCount} Concerns (Multi-System)`}
                </span>
                {selectedConcerns.length > 0 && (
                  <button
                    type="button"
                    onClick={clearConcerns}
                    className="text-[11px] font-black text-rose-600 hover:text-rose-800 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Selected Concerns Active Strip */}
            {selectedConcerns.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-teal-50/80 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800">
                {selectedConcerns.map((concern) => (
                  <span
                    key={concern}
                    className="inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 text-teal-950 dark:text-teal-100 shadow-2xs"
                  >
                    <span>{concern}</span>
                    <button
                      type="button"
                      onClick={() => toggleConcern(concern)}
                      className="hover:text-rose-600 transition-colors cursor-pointer text-slate-400 font-black text-xs leading-none"
                      title="Remove concern"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DOCTOR_PLAN_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setConcernCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    concernCategory === cat.id
                      ? "bg-teal-700 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Popular Condition Chips (Selection-Friendly Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/60">
              {POPULAR_DOCTOR_PLAN_CONCERNS.filter(
                (item) => concernCategory === "all" || item.category === concernCategory
              ).map((item) => {
                const isSelected = selectedConcerns.includes(item.label);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleConcern(item.label)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-950 dark:text-teal-100 font-black ring-1 ring-teal-500/30"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs leading-tight font-black">{item.label}</span>
                      {isSelected && (
                        <span className="w-3.5 h-3.5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[9px] shrink-0 font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mt-1">
                      {item.system}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Manual Condition Count Pill Bar */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
                  Total Concerns to Coordinate
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                  Auto-calculated from selection or set manually:
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 w-full sm:w-auto">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isCurrent = conditionsCount === val;
                  const tierSurchargeUnit = surchargesLookup[recommendation.pathway]?.unitWeekly || 500;
                  const surchargeText = val > 1 ? `+₹${((val - 1) * tierSurchargeUnit).toLocaleString("en-IN")}/wk` : "Base";
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setConditionsCount(val);
                        setConfirmed(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-center transition-all duration-200 cursor-pointer border-2 flex flex-col items-center ${
                        isCurrent
                          ? "bg-teal-700 text-white border-teal-600 shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-black">{val === 5 ? "5+" : val}</span>
                      <span className={`text-[9px] font-bold leading-none mt-0.5 ${isCurrent ? "text-teal-100" : "text-slate-500"}`}>
                        {surchargeText}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multi-System Coordination Notice */}
            {conditionsCount > 1 && (
              <div className="p-3.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl text-left flex items-start gap-2.5">
                <span className="text-teal-700 dark:text-teal-400 text-base leading-none mt-0.5">ℹ</span>
                <p className="text-xs text-slate-850 dark:text-slate-200 font-medium leading-relaxed">
                  <strong className="font-black text-slate-950 dark:text-white">Dual/Multi-System Care Active ({conditionsCount} Concerns):</strong>{" "}
                  Treating multiple co-existing complaints across organ systems requires cross-repertorization, synergistic remedy balancing, and closer clinical supervision by the consulting doctor.
                </p>
              </div>
            )}
          </fieldset>

          <fieldset className={`${styles.fieldset} rounded-2xl border p-4 sm:p-5`}>
            <legend className={`${styles.legend} px-2 text-sm font-black`}>4. Itemized support and medicines</legend>
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
            <legend className={`${styles.legend} px-2 text-xs font-black`}>5. Access consideration (never a surcharge)</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label><span className={labelClass}>Consideration</span><select className={inputClass} value={assessment.accessConsideration} onChange={e => updateAssessment("accessConsideration", e.target.value as AccessConsideration)}><option value="none">None</option><option value="senior">Senior citizen</option><option value="financial-hardship">Financial hardship</option><option value="custom">Other documented reason</option></select></label>
              <label><span className={labelClass}>Concession amount (₹)</span><input className={inputClass} type="number" min="0" step="1000" value={concessionAmount || ""} placeholder="0" onChange={e => { setConcessionAmount(Math.max(0, Number(e.target.value))); setConfirmed(false); }} /></label>
              <label><span className={labelClass}>Reason</span><input className={inputClass} value={concessionReason} placeholder="Required when concession applies" onChange={e => { setConcessionReason(e.target.value); setConfirmed(false); }} /></label>
            </div>
            {missingConcessionReason && <p className="mt-1 text-[10px] font-bold text-rose-600">Document the reason for the concession.</p>}
          </fieldset>
        </div>

        <aside className="self-start rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-slate-950 p-6 text-slate-100 xl:sticky xl:top-4 xl:col-span-5 shadow-xl">
          {recommendation.blockedBySafetyGate ? (
            <div className="rounded-2xl border-2 border-rose-500 bg-rose-500/10 p-5">
              <div className="flex items-center gap-2 font-black text-rose-300"><AlertTriangle className="h-5 w-5" /> Safety gate active</div>
              <p className="mt-2 text-xs font-semibold leading-relaxed text-rose-100">Address urgent assessment, referral or emergency care before confirming a pathway or quotation.</p>
            </div>
          ) : (
            <>
              <div className="inline-block px-3 py-1 rounded-full bg-teal-950 border border-teal-600 text-[10px] font-black uppercase tracking-widest text-teal-300">
                Suggested pathway
              </div>
              <h4 className="mt-2 text-2xl font-black text-white tracking-tight">{automaticRecommendation.title}</h4>
              
              {/* Clinical Care Scope & Active Concerns */}
              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Clinical Care Scope</span>
                  <span className="font-mono font-black text-teal-300">
                    {conditionsCount === 1 ? "1 Active Concern" : `${conditionsCount} Concerns (Multi-System)`}
                  </span>
                </div>
                {selectedConcerns.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 pt-2 border-t border-slate-850">
                    {selectedConcerns.map((concern) => (
                      <span key={concern} className="rounded-md bg-teal-950 border border-teal-800 px-2 py-0.5 text-[10px] font-bold text-teal-200">
                        {concern}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">
                This is an administrative workload suggestion after clinical review—not a diagnosis or treatment recommendation. Acute Wellness Care starts at ₹2,000/week for suitable non-emergency cases.
              </p>
              
              <label className="mt-4 block">
                <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-200">Pathway decision</span>
                <select
                  className="w-full rounded-xl border-2 border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-black text-white focus:border-teal-400 focus:outline-none shadow-xs cursor-pointer"
                  value={selectedPlanId}
                  onChange={e => {
                    setSelectedPlanId(e.target.value as "recommended" | CarePlanId);
                    setConfirmed(false);
                  }}
                >
                  <option value="recommended">Use recommendation — {automaticRecommendation.title}</option>
                  {pathwayOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.title} — ₹{option.price.toLocaleString("en-IN")} / {formatCarePlanDuration(option)}
                    </option>
                  ))}
                </select>
              </label>

              {selectedPlanId !== "recommended" && (
                <div className="mt-2.5 rounded-xl border border-sky-400/40 bg-sky-950/60 p-3.5 text-xs leading-relaxed text-sky-200">
                  <p className="font-bold">Manual physician selection: {recommendation.title}. The recommendation remains recorded for audit.</p>
                  <label className="mt-2 block"><span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-sky-300">Reason for physician selection</span><input className="w-full rounded-lg border-2 border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-sky-400" value={manualSelectionReason} placeholder="Document the clinical reason" onChange={e => { setManualSelectionReason(e.target.value); setConfirmed(false); }} /></label>
                  {missingOverrideReason && <p className="mt-1 text-xs font-black text-amber-300">A brief reason is required.</p>}
                </div>
              )}

              <p className="mt-3 text-xs font-black text-teal-300">
                Selected plan fee: <span className="text-sm font-sans">₹{recommendation.carePeriodFee.toLocaleString("en-IN")}</span> / {recommendation.planFamily === "acute" ? formatCarePlanDuration(recommendation) : "week"}
              </p>

              <label className="mt-3.5 block">
                <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-slate-200">Care period</span>
                <select className="w-full rounded-xl border-2 border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-black text-white focus:border-teal-400 focus:outline-none shadow-xs cursor-pointer" value={durationWeeks} disabled={recommendation.planFamily === "acute"} onChange={e => { setDurationWeeks(Number(e.target.value)); setConfirmed(false); }}>
                  {recommendation.allowedDurationsWeeks.map(weeks => {
                    const continuity = recommendation.planFamily === "acute" ? calculateCarePlanTotal(recommendation.planId) : calculateCarePlanTotal(recommendation.planId, weeks);
                    return <option key={weeks} value={weeks}>{recommendation.planFamily === "acute" ? formatCarePlanDuration(recommendation) : `${weeks} ${weeks === 1 ? "week" : "weeks"}`} · ₹{continuity.total.toLocaleString("en-IN")}{continuity.discountPercent > 0 ? ` · ${continuity.discountPercent}% benefit` : ""}{recommendation.planFamily === "chronic" && weeks === 1 ? " · initial period; reassessment required" : ""}</option>;
                  })}
                </select>
              </label>

              <p className="mt-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-2 text-[11px] font-medium leading-relaxed text-amber-200">Physician reassessment is required before renewal or movement to another plan. This is not emergency care.</p>
              
              <div className="mt-4 space-y-2">
                {recommendation.reasons.map(reason => (
                  <div key={reason} className="flex gap-2 text-xs font-medium leading-relaxed text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] font-medium leading-relaxed text-slate-300">
                {recommendation.cautions.join(" ")}
              </div>

              {quote && (
                <div className="mt-5 space-y-2 border-t-2 border-slate-800 pt-4 text-xs font-semibold">
                  <div className="flex justify-between text-slate-300">
                    <span>List care-period fee</span>
                    <strong className="font-sans text-white font-black">₹{quote.listCareTotal.toLocaleString("en-IN")}</strong>
                  </div>
                  {quote.continuityDiscountTotal > 0 && (
                    <div className="flex justify-between text-teal-400">
                      <span>Continuity care benefit ({quote.continuityDiscountPercent}%)</span>
                      <strong className="font-sans font-black">−₹{quote.continuityDiscountTotal.toLocaleString("en-IN")}</strong>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-300">
                    <span>Care fee after benefit</span>
                    <strong className="font-sans text-white font-black">₹{quote.baseCareTotal.toLocaleString("en-IN")}</strong>
                  </div>
                  {quote.caseSpecificSupportTotal > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Clinical support</span>
                      <strong className="font-sans text-white font-black">+₹{quote.caseSpecificSupportTotal.toLocaleString("en-IN")}</strong>
                    </div>
                  )}
                  {quote.pharmacyTotal > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Itemized pharmacy</span>
                      <strong className="font-sans text-white font-black">+₹{quote.pharmacyTotal.toLocaleString("en-IN")}</strong>
                    </div>
                  )}
                  {quote.concessionTotal > 0 && (
                    <div className="flex justify-between text-indigo-300">
                      <span>Documented concession</span>
                      <strong className="font-sans font-black">−₹{quote.concessionTotal.toLocaleString("en-IN")}</strong>
                    </div>
                  )}
                  <div className="flex justify-between border-t-2 border-slate-700 pt-3 text-sm font-black text-white items-baseline">
                    <span>Pending quotation</span>
                    <strong className="text-2xl font-black text-teal-300 font-sans tracking-tight">₹{quote.finalTotal.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              )}

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border-2 border-slate-800 bg-slate-900/90 p-3.5 text-xs font-bold leading-relaxed text-slate-200">
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-teal-500 rounded cursor-pointer" />
                <span>I confirm the pathway, duration, scope and fee after clinical review.</span>
              </label>

              <button
                type="button"
                disabled={!canApply}
                onClick={() => {
                  if (!quote) return;
                  const now = new Date();
                  const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                  const quotationId = `QTN-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`;
                  onApply({ assessment, recommendation, durationWeeks, planId: recommendation.planId, planFamily: recommendation.planFamily, durationValue: quote.durationValue, durationUnit: quote.durationUnit, conditionsCount, selectedConcerns, caseSpecificSupportAmount: supportAmount, caseSpecificSupportCategory: supportCategory, caseSpecificSupportReason: supportReason.trim(), pharmacyItems, concessionAmount: quote.concessionTotal, concessionReason: concessionReason.trim(), quote, physicianConfirmed: true, confirmedAt: now.toISOString(), quotationId, validUntil: validUntil.toISOString(), approvalStatus: "pending-patient-approval", selectionMode: selectedPlanId === "recommended" ? "recommended" : "physician-override", recommendedPathway: automaticRecommendation.pathway, selectedPathway: recommendation.pathway, recommendedPlanId: automaticRecommendation.planId, selectedPlanId: recommendation.planId, manualSelectionReason: manualSelectionReason.trim(), pricingRuleVersion: recommendation.version });
                }}
                className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Apply to pending plan</span>
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
