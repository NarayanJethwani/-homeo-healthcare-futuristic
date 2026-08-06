import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  ALLOWED_CARE_DURATIONS,
  calculateCarePeriodTotalPaise,
  formatINRFromPaise,
  type PatientIntakeData,
  type ClinicalCareDurationWeeks,
  type PatientJourneyStep,
} from "../domain/types";
import { validatePatientIntake } from "../services/careAssessmentService";

interface PatientJourneyFormProps {
  initialTierId: string;
  initialDurationWeeks: ClinicalCareDurationWeeks;
  onSubmitAssessment: (data: PatientIntakeData) => Promise<void>;
  isSubmitting: boolean;
}

const HEALTH_AREAS = [
  "Respiratory & Allergy",
  "Dermatology & Skin",
  "Gastrointestinal & Digestive",
  "Endocrine & Metabolic (Thyroid/PCOS)",
  "Musculoskeletal & Joints",
  "Neurological & Mental Health",
  "Cardiovascular & Vascular",
  "Pediatric Health",
  "Women's Health & Hormonal Balance",
  "General Vitality & Immunological Care",
];

export const PatientJourneyForm: React.FC<PatientJourneyFormProps> = ({
  initialTierId,
  initialDurationWeeks,
  onSubmitAssessment,
  isSubmitting,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [data, setData] = useState<PatientIntakeData>({
    patientName: "",
    phone: "",
    email: "",
    age: "",
    gender: "Male",
    city: "",
    mainHealthArea: "Respiratory & Allergy",
    concernDescription: "",
    relatedHealthAreas: [],
    durationText: "1 to 3 years",
    previousTreatments: "",
    recordsSummary: "",
    preferredDurationWeeks: initialDurationWeeks,
    selectedTierId: initialTierId,
    emergencyAcknowledged: false,
    accuracyConfirmed: false,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const steps: { key: PatientJourneyStep; title: string; subtitle: string }[] = [
    { key: "welcome", title: "1. Welcome & Care Philosophy", subtitle: "Understanding physician-led homeopathic care" },
    { key: "main_health_area", title: "2. Primary Health Area", subtitle: "Select your main area of health concern" },
    { key: "concern_description", title: "3. Concern Description", subtitle: "Describe your symptoms and chief complaints" },
    { key: "related_health_areas", title: "4. Related Health Areas", subtitle: "Select any secondary or overlapping health concerns" },
    { key: "history_duration", title: "5. History & Duration", subtitle: "How long has this situation been present?" },
    { key: "investigations_records", title: "6. Records & Investigations", subtitle: "Details of previous treatments or available lab reports" },
    { key: "review_safety", title: "7. Review & Safety Confirmation", subtitle: "Acknowledge emergency guidance and confirm intake details" },
    { key: "submission_complete", title: "8. Submit for Physician Review", subtitle: "Send information to the clinical care team" },
  ];

  const step = steps[currentStepIndex];

  const updateField = <K extends keyof PatientIntakeData>(field: K, value: PatientIntakeData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRelatedArea = (area: string) => {
    setData((prev) => {
      const exists = prev.relatedHealthAreas.includes(area);
      const updated = exists
        ? prev.relatedHealthAreas.filter((a) => a !== area)
        : [...prev.relatedHealthAreas, area];
      return { ...prev, relatedHealthAreas: updated };
    });
  };

  const handleNext = () => {
    setValidationErrors([]);
    if (currentStepIndex < steps.length - 1) {
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
    await onSubmitAssessment(data);
  };

  const selectedTier = CLINICAL_CARE_TIER_OPTIONS[data.selectedTierId] || CLINICAL_CARE_TIER_OPTIONS.integrated;
  const totalPaise = calculateCarePeriodTotalPaise(selectedTier.weeklyRatePaise, data.preferredDurationWeeks);
  const totalFormatted = formatINRFromPaise(totalPaise);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      {/* Progress Steps Header */}
      <div className="mb-6 border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Step {currentStepIndex + 1} of 8</span>
          <span>{Math.round(((currentStepIndex + 1) / 8) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / 8) * 100}%` }}
          />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mt-4">{step.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{step.subtitle}</p>
      </div>

      {validationErrors.length > 0 && (
        <div role="alert" className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 text-xs">
          <span className="font-bold block mb-1">Please address the following items:</span>
          <ul className="list-disc pl-4 space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step Contents */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {step.key === "welcome" && (
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p>
              Welcome to the Homeo Healthcare Physician Review Request. Our clinical care model is founded on rigorous classical homeopathy, detailed constitutional synthesis, and dedicated physician oversight.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-900 block">Patient Submission Principles:</span>
              <p>• You will not be asked to self-diagnose or select prescription medicines.</p>
              <p>• No payment is requested at this submission stage.</p>
              <p>• Your assigned physician will review your submission and construct a tailored Clinical Care Recommendation.</p>
            </div>
          </div>
        )}

        {step.key === "main_health_area" && (
          <div className="space-y-4">
            <label htmlFor="mainHealthArea" className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Select Primary Area of Concern *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HEALTH_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => updateField("mainHealthArea", area)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    data.mainHealthArea === area
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600/30"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}

        {step.key === "concern_description" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="concernDescription" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Describe Your Chief Complaints & Symptoms *
              </label>
              <textarea
                id="concernDescription"
                rows={5}
                value={data.concernDescription}
                onChange={(e) => updateField("concernDescription", e.target.value)}
                placeholder="Please describe your primary symptoms, how they affect your daily routine, aggravating/relieving factors, and any specific concerns..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Minimum 10 characters required.</span>
            </div>
          </div>
        )}

        {step.key === "related_health_areas" && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Select Secondary or Overlapping Health Areas (Optional)
            </label>
            <p className="text-xs text-slate-500">
              Check any additional areas that may be clinically relevant to your overall constitutional health:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HEALTH_AREAS.filter((a) => a !== data.mainHealthArea).map((area) => {
                const isChecked = data.relatedHealthAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleRelatedArea(area)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      isChecked
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span>{area}</span>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step.key === "history_duration" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="durationText" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Duration of Current Condition *
              </label>
              <select
                id="durationText"
                value={data.durationText}
                onChange={(e) => updateField("durationText", e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-emerald-600 outline-none"
              >
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1 to 6 months">1 to 6 months</option>
                <option value="6 months to 1 year">6 months to 1 year</option>
                <option value="1 to 3 years">1 to 3 years</option>
                <option value="3 to 5 years">3 to 5 years</option>
                <option value="More than 5 years">More than 5 years</option>
              </select>
            </div>

            <div>
              <label htmlFor="previousTreatments" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Previous Treatments & Current Medications (Optional)
              </label>
              <textarea
                id="previousTreatments"
                rows={3}
                value={data.previousTreatments}
                onChange={(e) => updateField("previousTreatments", e.target.value)}
                placeholder="Mention any conventional, homeopathic, or other treatments you have taken..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>
        )}

        {step.key === "investigations_records" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="recordsSummary" className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Lab Reports & Investigation Summary (Optional)
              </label>
              <textarea
                id="recordsSummary"
                rows={4}
                value={data.recordsSummary}
                onChange={(e) => updateField("recordsSummary", e.target.value)}
                placeholder="Summarize recent blood tests, imaging, or lab findings (e.g. TSH, HbA1c, Lipid profile, Ultrasound)..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-emerald-600 outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Detailed lab documents can also be shared directly with your care team during consultation review.
              </span>
            </div>
          </div>
        )}

        {step.key === "review_safety" && (
          <div className="space-y-5">
            {/* Patient Contact Details Sub-Form */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Patient Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="patientName" className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    id="patientName"
                    type="text"
                    required
                    value={data.patientName}
                    onChange={(e) => updateField("patientName", e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={data.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-[11px] font-semibold text-slate-700 mb-1">City / Location</label>
                  <input
                    id="city"
                    type="text"
                    value={data.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Safety & Accuracy Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={data.emergencyAcknowledged}
                  onChange={(e) => updateField("emergencyAcknowledged", e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
                />
                <span>
                  I acknowledge that this service is not for medical emergencies and I should seek immediate emergency care for severe or acute life-threatening symptoms. *
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={data.accuracyConfirmed}
                  onChange={(e) => updateField("accuracyConfirmed", e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
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
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold text-slate-900">Ready to Submit for Physician Review</h4>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Selected Care Tier:</span>
                <span className="font-bold text-slate-900">{selectedTier.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Planned Care Period:</span>
                <span className="font-bold text-slate-900">{data.preferredDurationWeeks} Weeks</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Complete Care-Period Amount:</span>
                <span className="font-extrabold text-slate-900 text-sm">{totalFormatted}</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Primary Area: <span className="font-semibold text-slate-800">{data.mainHealthArea}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Payment is coordinated after your physician prepares your individualized Clinical Care Recommendation. Our care coordination team will provide secure payment instructions and confirm your treatment commencement.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {currentStepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {currentStepIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-sm flex items-center gap-1.5"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 transition-all shadow-md shadow-emerald-700/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Submitting for Physician Review...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
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
