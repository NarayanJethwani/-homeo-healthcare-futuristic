import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  calculateCarePeriodTotalPaise,
  formatINRFromPaise,
  type PatientJourneyStep,
  type PatientIntakeData,
  type ClinicalCareDurationWeeks,
} from "../domain/types";
import { validatePatientIntake } from "../services/careAssessmentService";
import { buildPatientWhatsAppReviewLink } from "../services/careRecommendationEngine";

interface PatientJourneyFormProps {
  initialTierId?: string;
  initialDurationWeeks?: ClinicalCareDurationWeeks;
  initialMainArea?: string;
  initialCondition?: string;
  onSubmitAssessment: (intakeData: PatientIntakeData) => Promise<void>;
  isSubmitting?: boolean;
}

interface StepConfig {
  key: PatientJourneyStep;
  title: string;
  subtitle: string;
}

const STEPS: StepConfig[] = [
  {
    key: "welcome",
    title: "Patient Information",
    subtitle: "Provide basic patient details for your clinical record",
  },
  {
    key: "main_health_area",
    title: "Primary Health Focus",
    subtitle: "Select the organ system or health area requiring attention",
  },
  {
    key: "concern_description",
    title: "Clinical Description & Symptoms",
    subtitle: "Describe your chief symptoms, onset, and day-to-day impact",
  },
  {
    key: "related_health_areas",
    title: "Interrelated Health Systems",
    subtitle: "Select any secondary or overlapping organ systems",
  },
  {
    key: "history_duration",
    title: "Chronicity & Previous Care",
    subtitle: "Specify symptom duration and prior treatments attempted",
  },
  {
    key: "investigations_records",
    title: "Diagnostic Records & Reports",
    subtitle: "Summarize existing blood tests, imaging, or specialist notes",
  },
  {
    key: "review_safety",
    title: "Safety Notice & Confirm Details",
    subtitle: "Review emergency boundary notice and confirm accuracy",
  },
  {
    key: "submission_complete",
    title: "Physician Review & WhatsApp Assistance",
    subtitle: "Submit details and connect directly on WhatsApp with Dr. Jethwani (8446056789)",
  },
];

export const PatientJourneyForm: React.FC<PatientJourneyFormProps> = ({
  initialTierId = "integrated",
  initialDurationWeeks = 4,
  initialMainArea = "",
  initialCondition = "",
  onSubmitAssessment,
  isSubmitting = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [data, setData] = useState<PatientIntakeData>({
    patientName: "",
    phone: "",
    email: "",
    age: "",
    gender: "female",
    city: "",
    mainHealthArea: initialMainArea || "Digestive & Liver Support",
    concernDescription: initialCondition ? `Primary concern: ${initialCondition}` : "",
    relatedHealthAreas: [],
    durationText: "1 to 3 years",
    previousTreatments: "Standard conventional medication",
    recordsSummary: "Recent lab reports available for physician review",
    preferredDurationWeeks: initialDurationWeeks,
    selectedTierId: initialTierId,
    emergencyAcknowledged: false,
    accuracyConfirmed: false,
  });

  const step = STEPS[currentStepIndex];

  const updateField = <K extends keyof PatientIntakeData>(field: K, value: PatientIntakeData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setValidationErrors([]);
    if (currentStepIndex === 0) {
      if (!data.patientName.trim()) {
        setValidationErrors(["Please enter the patient name."]);
        return;
      }
      if (!data.phone.trim() || data.phone.trim().length < 8) {
        setValidationErrors(["Please enter a valid phone number."]);
        return;
      }
    }
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationErrors([]);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = validatePatientIntake(data);
    if (!val.valid) {
      setValidationErrors(val.errors);
      return;
    }
    setValidationErrors([]);

    const selectedTier = CLINICAL_CARE_TIER_OPTIONS[data.selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.integrated;
    const totalPaise = calculateCarePeriodTotalPaise(selectedTier.weeklyRatePaise, data.preferredDurationWeeks);
    const totalFormatted = formatINRFromPaise(totalPaise);

    const waPayload = buildPatientWhatsAppReviewLink({
      patientName: data.patientName,
      phone: data.phone,
      selectedTierName: selectedTier.name,
      preferredDurationWeeks: data.preferredDurationWeeks,
      totalEstimatedAmountFormatted: totalFormatted,
      mainHealthArea: data.mainHealthArea,
      concernDescription: data.concernDescription,
    });

    // Launch WhatsApp directly for Doctor Assistance & Guidance (+91 8446056789)
    if (typeof window !== "undefined") {
      window.open(waPayload.whatsappUrl, "_blank", "noopener,noreferrer");
    }

    await onSubmitAssessment(data);
  };

  const selectedTier = CLINICAL_CARE_TIER_OPTIONS[data.selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.integrated;
  const totalPaise = calculateCarePeriodTotalPaise(selectedTier.weeklyRatePaise, data.preferredDurationWeeks);
  const totalFormatted = formatINRFromPaise(totalPaise);

  return (
    <div id="clinical-assessment-form" className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-6 md:p-10 shadow-xl mb-12">
      {/* Progress Steps Header */}
      <div className="mb-8 border-b border-slate-200/80 pb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          <span>Step {currentStepIndex + 1} of 8</span>
          <span className="text-mint">{Math.round(((currentStepIndex + 1) / 8) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-mint h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / 8) * 100}%` }}
          />
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#1A2421] mt-5">{step.title}</h3>
        <p className="text-xs font-semibold text-slate-500 mt-1">{step.subtitle}</p>
      </div>

      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-950">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Please resolve the following required items:
          </div>
          <ul className="list-disc list-inside space-y-0.5 pt-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {step.key === "welcome" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="patientName" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
                Patient Full Name *
              </label>
              <input
                id="patientName"
                type="text"
                required
                value={data.patientName}
                onChange={(e) => updateField("patientName", e.target.value)}
                placeholder="e.g. Dr. Ramesh Patel"
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
                Phone Number (WhatsApp) *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={data.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
                Email Address (Optional)
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="patient@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="age" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  value={data.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  placeholder="e.g. 42"
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={data.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step.key === "main_health_area" && (
          <div className="space-y-4">
            <label htmlFor="mainHealthArea" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
              Primary Organ System Focus *
            </label>
            <input
              id="mainHealthArea"
              type="text"
              required
              value={data.mainHealthArea}
              onChange={(e) => updateField("mainHealthArea", e.target.value)}
              placeholder="e.g. Digestive & Liver Support, Respiratory & Allergy"
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
            />
          </div>
        )}

        {step.key === "concern_description" && (
          <div className="space-y-4">
            <label htmlFor="concernDescription" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
              Describe your main health concern & symptoms in detail *
            </label>
            <textarea
              id="concernDescription"
              rows={4}
              required
              value={data.concernDescription}
              onChange={(e) => updateField("concernDescription", e.target.value)}
              placeholder="Please describe symptom onset, triggers, daily severity, and any aggravating factors..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-semibold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
            />
          </div>
        )}

        {step.key === "related_health_areas" && (
          <div className="space-y-4">
            <label htmlFor="relatedHealthAreas" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
              Secondary or Overlapping Health Areas
            </label>
            <input
              id="relatedHealthAreas"
              type="text"
              value={data.relatedHealthAreas.join(", ")}
              onChange={(e) => updateField("relatedHealthAreas", e.target.value.split(",").map((s) => s.trim()))}
              placeholder="e.g., Sleep difficulties, Mild anxiety, Joint stiffness"
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
            />
          </div>
        )}

        {step.key === "history_duration" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="durationText" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
                Symptom Duration / Chronicity
              </label>
              <select
                id="durationText"
                value={data.durationText}
                onChange={(e) => updateField("durationText", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
              >
                <option value="Less than 6 months">Less than 6 months</option>
                <option value="6 months to 1 year">6 months to 1 year</option>
                <option value="1 to 3 years">1 to 3 years</option>
                <option value="More than 3 years (Chronic)">More than 3 years (Chronic)</option>
              </select>
            </div>

            <div>
              <label htmlFor="previousTreatments" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
                Prior Treatments & Medications
              </label>
              <input
                id="previousTreatments"
                type="text"
                value={data.previousTreatments}
                onChange={(e) => updateField("previousTreatments", e.target.value)}
                placeholder="e.g. Conventional medicines, inhalers, antacids..."
                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
              />
            </div>
          </div>
        )}

        {step.key === "investigations_records" && (
          <div className="space-y-4">
            <label htmlFor="recordsSummary" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
              Summary of Lab Reports, Imaging & Medical Records
            </label>
            <textarea
              id="recordsSummary"
              rows={3}
              value={data.recordsSummary}
              onChange={(e) => updateField("recordsSummary", e.target.value)}
              placeholder="e.g., Blood test results (HbA1c 6.8%), Thyroid panel normal, Ultrasound showing mild fatty liver..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-semibold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
            />
          </div>
        )}

        {step.key === "review_safety" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold space-y-2">
              <span className="font-bold block text-amber-950">Safety Boundary & Emergency Guidance</span>
              <p>
                Homeo Healthcare provides planned, non-emergency homeopathic care. If you are experiencing acute severe symptoms (e.g. chest pain, severe breathing difficulty), please seek emergency care immediately.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={data.emergencyAcknowledged}
                  onChange={(e) => updateField("emergencyAcknowledged", e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-mint focus:ring-mint shrink-0 h-4 w-4"
                />
                <span>
                  I acknowledge that this service is not for medical emergencies and I should seek immediate emergency care for severe or acute life-threatening symptoms. *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={data.accuracyConfirmed}
                  onChange={(e) => updateField("accuracyConfirmed", e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-mint focus:ring-mint shrink-0 h-4 w-4"
                />
                <span>
                  I confirm that the health details provided are accurate to the best of my knowledge for clinical review. *
                </span>
              </label>
            </div>
          </div>
        )}

        {step.key === "submission_complete" && (
          <div className="space-y-5 text-center py-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-mint/10 text-mint-dark flex items-center justify-center">
              <UserCheck className="w-7 h-7 text-mint" />
            </div>

            <h4 className="font-serif text-2xl font-bold text-[#1A2421]">Ready to Submit for Physician Review</h4>

            <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs font-semibold text-slate-700 shadow-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Selected Care Tier:</span>
                <span className="font-bold text-[#1A2421]">{selectedTier.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Planned Care Period:</span>
                <span className="font-bold text-[#1A2421]">{data.preferredDurationWeeks} Weeks</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Complete Care-Period Amount:</span>
                <span className="font-extrabold text-[#1A2421] text-sm">{totalFormatted}</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Primary Area: <span className="font-bold text-[#1A2421]">{data.mainHealthArea}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold text-left flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">WhatsApp Doctor Guidance (+91 8446056789):</span>
                Clicking <strong>"Continue to Physician Review"</strong> will process your assessment and launch WhatsApp directly to connect with Dr. Jethwani for assistance and guidance.
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200/80">
          {currentStepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-full border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {currentStepIndex < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting for Physician Review...</span>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>Continue to Physician Review</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
