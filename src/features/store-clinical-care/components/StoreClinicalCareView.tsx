import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClinicalCareHeader } from "./ClinicalCareHeader";
import { OrganSystemsDirectory } from "./OrganSystemsDirectory";
import { CareLevelCard } from "./CareLevelCard";
import { IncludedServicesList } from "./IncludedServicesList";
import { PatientJourneyForm } from "./PatientJourneyForm";
import { SubmissionSuccessView } from "./SubmissionSuccessView";
import { EmergencyGuidanceBanner } from "./EmergencyGuidanceBanner";
import { processCareAssessmentSubmission } from "../services/careAssessmentService";
import type {
  ClinicalCareDurationWeeks,
  PatientIntakeData,
  SanitizedAssessmentResponseDTO,
} from "../domain/types";

export const StoreClinicalCareView: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>("integrated");
  const [selectedDurationWeeks, setSelectedDurationWeeks] = useState<ClinicalCareDurationWeeks>(4);
  const [selectedAreaTitle, setSelectedAreaTitle] = useState<string>("");
  const [selectedConditionName, setSelectedConditionName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResponse, setSubmissionResponse] = useState<SanitizedAssessmentResponseDTO | null>(null);
  const assessmentFormRef = useRef<HTMLDivElement>(null);

  const handleProceedToTiers = () => {
    const el = document.getElementById("clinical-care-tiers");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProceedToAssessment = () => {
    const el = document.getElementById("clinical-assessment-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectAreaAndCondition = (areaTitle: string, conditionName: string) => {
    setSelectedAreaTitle(areaTitle);
    setSelectedConditionName(conditionName);
  };

  const handleSubmitAssessment = async (intakeData: PatientIntakeData) => {
    setIsSubmitting(true);
    try {
      // Merge selected area & condition into concern description if available
      const finalData: PatientIntakeData = {
        ...intakeData,
        mainHealthArea: selectedAreaTitle || intakeData.mainHealthArea,
        concernDescription: selectedConditionName
          ? `[Selected Condition: ${selectedConditionName}] ${intakeData.concernDescription}`
          : intakeData.concernDescription,
      };

      const result = processCareAssessmentSubmission(finalData);
      if (result.success) {
        setSubmissionResponse(result.data);
      }
    } catch (err) {
      console.error("Failed to submit clinical care assessment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionResponse(null);
    setSelectedTierId("integrated");
    setSelectedDurationWeeks(4);
    setSelectedAreaTitle("");
    setSelectedConditionName("");
  };

  return (
    <main className="bg-gradient-mesh min-h-screen pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-mint transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Main Platform
        </Link>

        <EmergencyGuidanceBanner />
        <ClinicalCareHeader />

        {submissionResponse ? (
          <SubmissionSuccessView response={submissionResponse} onReset={handleReset} />
        ) : (
          <>
            {/* Organ Systems & Conditions Browsing Experience */}
            <OrganSystemsDirectory
              selectedCondition={selectedConditionName}
              onSelectAreaAndCondition={handleSelectAreaAndCondition}
              onProceedToTiers={handleProceedToTiers}
            />

            {/* Clinical Care Tiers Section (Moved below Organ Systems & Conditions) */}
            <div id="clinical-care-tiers">
              <CareLevelCard
                selectedTierId={selectedTierId}
                selectedDurationWeeks={selectedDurationWeeks}
                onSelectTier={setSelectedTierId}
                onSelectDuration={setSelectedDurationWeeks}
                onProceedToAssessment={handleProceedToAssessment}
              />
            </div>

            <IncludedServicesList />

            <div ref={assessmentFormRef}>
              <PatientJourneyForm
                initialTierId={selectedTierId}
                initialDurationWeeks={selectedDurationWeeks}
                initialMainArea={selectedAreaTitle}
                initialCondition={selectedConditionName}
                onSubmitAssessment={handleSubmitAssessment}
                isSubmitting={isSubmitting}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
};
