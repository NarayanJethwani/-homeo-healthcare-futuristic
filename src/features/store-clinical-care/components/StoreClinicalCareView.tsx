import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClinicalCareHeader } from "./ClinicalCareHeader";
import { OrganSystemsDirectory } from "./OrganSystemsDirectory";
import { CareLevelCard } from "./CareLevelCard";
import { IncludedServicesList } from "./IncludedServicesList";
import { PatientJourneyForm } from "./PatientJourneyForm";
import { SubmissionSuccessView } from "./SubmissionSuccessView";
import { PhysicianQuotationBuilder } from "./PhysicianQuotationBuilder";
import { ClinicalCareFAQ } from "./ClinicalCareFAQ";
import { EmergencyGuidanceBanner } from "./EmergencyGuidanceBanner";
import { processCareAssessmentSubmission } from "../services/careAssessmentService";
import { calculatePreliminaryCareRecommendation } from "../services/careRecommendationEngine";
import type {
  ClinicalCareDurationWeeks,
  PatientIntakeData,
  SanitizedAssessmentResponseDTO,
} from "../domain/types";

export const StoreClinicalCareView: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>("integrated");
  const [selectedDurationWeeks, setSelectedDurationWeeks] = useState<ClinicalCareDurationWeeks>(4);
  const [selectedAreaTitles, setSelectedAreaTitles] = useState<string[]>([]);
  const [selectedConditionName, setSelectedConditionName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResponse, setSubmissionResponse] = useState<SanitizedAssessmentResponseDTO | null>(null);

  const assessmentFormRef = useRef<HTMLDivElement>(null);

  const preliminaryRec = useMemo(() => {
    return calculatePreliminaryCareRecommendation({
      selectedOrganSystems: selectedAreaTitles,
    });
  }, [selectedAreaTitles]);

  const handleProceedToTiers = () => {
    const el = document.getElementById("care-pathways-pricing");
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

  const handleSelectAreasAndCondition = (areaTitles: string[], conditionName: string) => {
    setSelectedAreaTitles(areaTitles);
    setSelectedConditionName(conditionName);
  };

  const handleSubmitAssessment = async (intakeData: PatientIntakeData) => {
    setIsSubmitting(true);
    try {
      const finalData: PatientIntakeData = {
        ...intakeData,
        selectedOrganSystems: selectedAreaTitles.length > 0 ? selectedAreaTitles : [intakeData.mainHealthArea],
        mainHealthArea: selectedAreaTitles.join(", ") || intakeData.mainHealthArea,
        concernDescription: selectedConditionName
          ? `[Primary Condition: ${selectedConditionName}] ${intakeData.concernDescription}`
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
    setSelectedAreaTitles([]);
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

        {/* 1. Hero Section (Clinical Care Pathways) */}
        <ClinicalCareHeader />

        {submissionResponse ? (
          <div className="space-y-12">
            <SubmissionSuccessView response={submissionResponse} onReset={handleReset} />
            <PhysicianQuotationBuilder assessmentResponse={submissionResponse} />
          </div>
        ) : (
          <>
            {/* 2 & 3. Organ Systems Directory (Multi-Select) & Conditions Browsing */}
            <OrganSystemsDirectory
              selectedAreaIds={[]}
              selectedCondition={selectedConditionName}
              onSelectAreasAndCondition={handleSelectAreasAndCondition}
              onProceedToAssessment={handleProceedToAssessment}
              onProceedToTiers={handleProceedToTiers}
            />

            {/* 4. 8-Step Clinical Assessment Wizard */}
            <div ref={assessmentFormRef}>
              <PatientJourneyForm
                initialTierId={selectedTierId}
                initialDurationWeeks={selectedDurationWeeks}
                initialMainArea={selectedAreaTitles.join(", ")}
                initialCondition={selectedConditionName}
                onSubmitAssessment={handleSubmitAssessment}
                isSubmitting={isSubmitting}
              />
            </div>

            {/* 5 & 6. Initial Care Recommendation & Care Pathways Fees */}
            <div id="care-pathways-pricing">
              <CareLevelCard
                selectedTierId={selectedTierId}
                selectedDurationWeeks={selectedDurationWeeks}
                preliminaryRecommendation={preliminaryRec}
                onSelectTier={setSelectedTierId}
                onSelectDuration={setSelectedDurationWeeks}
                onProceedToAssessment={handleProceedToAssessment}
              />
            </div>

            {/* Included Services & Disclosures */}
            <IncludedServicesList />

            {/* 8. Frequently Asked Questions (FAQ) */}
            <ClinicalCareFAQ />

            {/* 9. Medical Safety Notice (Collapsible Card with Red Accent above footer) */}
            <EmergencyGuidanceBanner />
          </>
        )}
      </div>
    </main>
  );
};
