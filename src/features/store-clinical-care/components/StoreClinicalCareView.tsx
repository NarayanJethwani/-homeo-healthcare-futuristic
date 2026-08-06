"use client";

import React, { useState } from "react";
import { EmergencyGuidanceBanner } from "./EmergencyGuidanceBanner";
import { ClinicalCareHeader } from "./ClinicalCareHeader";
import { CareLevelCard } from "./CareLevelCard";
import { IncludedServicesList } from "./IncludedServicesList";
import { PatientJourneyForm } from "./PatientJourneyForm";
import { SubmissionSuccessView } from "./SubmissionSuccessView";
import type {
  ClinicalCareDurationWeeks,
  PatientIntakeData,
  SanitizedAssessmentResponseDTO,
} from "../domain/types";

export const StoreClinicalCareView: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>("integrated");
  const [selectedDurationWeeks, setSelectedDurationWeeks] = useState<ClinicalCareDurationWeeks>(4);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedDTO, setSubmittedDTO] = useState<SanitizedAssessmentResponseDTO | null>(null);

  const handleSubmitAssessment = async (intakeData: PatientIntakeData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/store/clinical-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...intakeData,
          selectedTierId,
          preferredDurationWeeks: selectedDurationWeeks,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSubmittedDTO(json.data);
      } else {
        alert(json.error || "Failed to submit assessment. Please check fields and try again.");
      }
    } catch (err: any) {
      alert(`Submission Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedDTO(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <EmergencyGuidanceBanner />
        <ClinicalCareHeader />

        {submittedDTO ? (
          <SubmissionSuccessView response={submittedDTO} onReset={handleReset} />
        ) : (
          <>
            <CareLevelCard
              selectedTierId={selectedTierId}
              selectedDurationWeeks={selectedDurationWeeks}
              onSelectTier={setSelectedTierId}
              onSelectDuration={setSelectedDurationWeeks}
            />

            <IncludedServicesList showAdditionalProductsNotice={true} />

            <PatientJourneyForm
              initialTierId={selectedTierId}
              initialDurationWeeks={selectedDurationWeeks}
              onSubmitAssessment={handleSubmitAssessment}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </div>
    </div>
  );
};
