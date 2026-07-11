"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  HomeopathicAssessment, 
  TotalitySymptom, 
  SelectedRubric, 
  DifferentialRubricReasoning, 
  MiasmaticAssessmentItem, 
  SusceptibilityAssessment, 
  ConstitutionalAssessment, 
  ObstacleToCure, 
  HomeopathicTimelineEvent
} from "@/features/homeopathy/domain/homeopathy.types";

import { MockEncounterRepository } from "@/features/encounter/repositories/encounterRepository";
import { MockConsultationRepository } from "@/features/consultation/repositories/consultationRepository";
import { MockAllergyRepository } from "@/features/allergy/repositories/allergyRepository";
import { MockPatientRepository } from "@/features/patient/repositories/patientRepository";
import { MockHomeopathyRepository } from "@/features/homeopathy/repositories/homeopathyRepository";
import { HomeopathyService, AssessmentValidationIssue } from "@/features/homeopathy/services/homeopathyService";
import { AssessmentWorkspaceService, AssessmentWorkspaceReadModel } from "@/features/homeopathy/application/AssessmentWorkspaceService";
import { useHomeopathyAssessmentAutosave } from "@/features/homeopathy/hooks/useHomeopathyAssessmentAutosave";
import { DomainEventDispatcher } from "@/shared/events/eventDispatcher";

// Core components
import { TotalityBuilderSection } from "@/features/homeopathy/components/TotalityBuilderSection";
import { RubricSelectionSection } from "@/features/homeopathy/components/RubricSelectionSection";
import { DifferentialReasoningSection } from "@/features/homeopathy/components/DifferentialReasoningSection";
import { MiasmaticAssessmentSection } from "@/features/homeopathy/components/MiasmaticAssessmentSection";
import { SusceptibilityAssessmentSection } from "@/features/homeopathy/components/SusceptibilityAssessmentSection";
import { ObstaclesToCureSection } from "@/features/homeopathy/components/ObstaclesToCureSection";
import { EtiologicalFactorsSection } from "@/features/homeopathy/components/EtiologicalFactorsSection";
import { MaintainingCausesSection } from "@/features/homeopathy/components/MaintainingCausesSection";
import { ConstitutionalAssessmentSection } from "@/features/homeopathy/components/ConstitutionalAssessmentSection";
import { HomeopathicTimelineSection } from "@/features/homeopathy/components/HomeopathicTimelineSection";

import { 
  Heart, Folder, Scale, Sparkles, Activity, ShieldAlert, FileText, Calendar, 
  Save, CheckCircle, AlertTriangle, RotateCcw, User, ArrowLeft, Loader2
} from "lucide-react";

// Singletons & setup inside Next.js dev server context
const eventDispatcher = new DomainEventDispatcher();
const patientRepo = new MockPatientRepository();
const allergyRepo = new MockAllergyRepository();
const encounterRepo = new MockEncounterRepository();
const consultationRepo = new MockConsultationRepository();
const homeopathyRepo = new MockHomeopathyRepository();

const homeopathyService = new HomeopathyService(homeopathyRepo, eventDispatcher);
const workspaceService = new AssessmentWorkspaceService(
  encounterRepo,
  consultationRepo,
  allergyRepo,
  patientRepo,
  homeopathyRepo,
  homeopathyService
);

const clientRubricSearchService = {
  search: async (query: { queryText: string; category?: string; sourceId?: string }) => {
    const url = new URL("/api/repertory/search", window.location.origin);
    url.searchParams.set("q", query.queryText);
    if (query.category) url.searchParams.set("category", query.category);
    if (query.sourceId) url.searchParams.set("sourceId", query.sourceId);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return (data.rubrics || []).map((r: any) => ({
      rubricId: r.rubricId,
      title: r.title,
      plainLanguageMeaning: r.displayText || r.title,
      chapter: r.organSystem || "General",
      rubricPath: [r.title],
      sourceId: r.sourceId || "pub_boericke_1927",
      sourceName: r.source || "Boericke",
      remedyCount: r.remedies ? Object.keys(r.remedies).length : 0
    }));
  }
};

type ActiveTab = 
  | "totality"
  | "rubrics"
  | "differential"
  | "miasmatic"
  | "susceptibility"
  | "obstacles"
  | "causes"
  | "constitutional"
  | "timeline";

export default function HomeopathicAssessmentWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const encounterId = params.encounterId as string;
  const actorId = "doc_jethwani_007";

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("totality");
  const [workspaceData, setWorkspaceData] = useState<AssessmentWorkspaceReadModel | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationIssues, setValidationIssues] = useState<AssessmentValidationIssue[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [conflictState, setConflictState] = useState<{ isConflict: boolean; serverVersion?: number }>({ isConflict: false });

  // Load and seed mock workspace data if needed
  useEffect(() => {
    async function initWorkspace() {
      try {
        setLoading(true);

        // Pre-populate mock databases if records don't exist yet
        let patient = await patientRepo.findById("pat_george_001" as any);
        if (!patient) {
          // Seed Patient
          patient = await patientRepo.registerPatient({
            organizationId: "org_homeo_healthcare" as any,
            clinicId: "clinic_main" as any,
            createdBy: actorId,
            demographics: {
              name: "George Miller",
              dateOfBirth: "1978-05-14",
              gender: "male",
              phone: "9876543210",
              email: "george.miller@example.com",
              address: "Boston, US",
              bloodGroup: "A+"
            }
          });

          // Seed Allergies
          await allergyRepo.recordAllergy({
            organizationId: "org_homeo_healthcare" as any,
            patientId: patient.id,
            substanceText: "Penicillin",
            category: "medication",
            criticality: "high",
            reactionDescriptions: ["Anaphylaxis"],
            createdBy: actorId
          });

          await allergyRepo.recordAllergy({
            organizationId: "org_homeo_healthcare" as any,
            patientId: patient.id,
            substanceText: "Peanuts",
            category: "food",
            criticality: "moderate",
            reactionDescriptions: ["Severe hives", "Angioedema"],
            createdBy: actorId
          });

          // Seed Consultation Intake
          const intake = await consultationRepo.createDraft({
            patientId: patient.id,
            organizationId: "org_homeo_healthcare" as any,
            clinicId: "clinic_main" as any,
            practitionerId: actorId as any,
            encounterType: "initial_consultation",
            provenance: {
              createdBy: actorId,
              createdAt: new Date().toISOString(),
              updatedBy: actorId,
              updatedAt: new Date().toISOString(),
              sourceType: "clinician",
              enteredByRole: "practitioner"
            }
          });

          // Seed Intake Symptoms
          await consultationRepo.updateDraft(
            intake.id,
            {
              ...intake,
              chiefComplaints: [
                {
                  id: "sym_throbbing_headache" as any,
                  patientWording: "violent throbbing headache in forehead, worse in afternoon warmth, relieved by ice cold compresses",
                  normalizedName: "Throbbing Headache",
                  location: "forehead",
                  sensation: "throbbing",
                  aggravations: ["afternoon warmth", "sunlight"],
                  ameliorations: ["ice cold compresses", "dark quiet room"],
                  concomitants: ["nausea", "irritability"],
                  causation: [],
                  isCharacteristic: true
                },
                {
                  id: "sym_anticipatory_anxiety" as any,
                  patientWording: "severe anxiety and diarrhea before any public presentation or meeting",
                  normalizedName: "Anticipatory Anxiety",
                  location: "mind / intestines",
                  sensation: "nervous apprehension",
                  aggravations: ["public presentations", "anticipation"],
                  ameliorations: ["motion", "cool fresh air"],
                  concomitants: ["loose watery stools"],
                  causation: [],
                  isCharacteristic: true
                }
              ]
            },
            1
          );

          // Seed Encounter
          await encounterRepo.create({
            patientId: patient!.id as any,
            organizationId: "org_homeo_healthcare" as any,
            clinicId: "clinic_main" as any,
            practitionerId: actorId as any,
            encounterType: "initial_consultation",
            encounterDate: new Date().toISOString(),
            provenance: {
              createdBy: actorId,
              createdAt: new Date().toISOString(),
              updatedBy: actorId,
              updatedAt: new Date().toISOString(),
              sourceType: "clinician",
              enteredByRole: "practitioner"
            }
          });

          // Hook encounter to the intake
          const encounters = await encounterRepo.findByPatientId(patient!.id as any);
          const firstEnc = encounters[0];
          if (firstEnc) {
            await encounterRepo.updateDraft(
              firstEnc.id,
              {
                clinicalIntakeId: intake.id,
                provenance: firstEnc.provenance
              },
              0
            );
          }
        }

        const resolvedEncId = encounterId || "enc_milestone3_test";
        // Ensure the encounter is registered in the repo
        let existingEnc = await encounterRepo.findById(resolvedEncId as any);
        if (!existingEnc) {
          const encs = await encounterRepo.findByPatientId(patient!.id as any);
          if (encs.length > 0) {
            // Re-map the ID in the repository
            const orig = encs[0];
            await encounterRepo.save({
              ...orig,
              id: resolvedEncId as any
            });
          }
        }

        const ws = await workspaceService.loadWorkspace(resolvedEncId as any, actorId);
        setWorkspaceData(ws);
      } catch (err) {
        console.error("Failed to load workspace data:", err);
      } finally {
        setLoading(false);
      }
    }
    initWorkspace();
  }, [encounterId]);

  // Hook up debounced autosave
  const {
    saveStatus,
    lastSaved,
    errorMessage,
    triggerAutosave,
    forceSave
  } = useHomeopathyAssessmentAutosave({
    assessment: workspaceData ? workspaceData.assessment : null,
    homeopathyService,
    actorId,
    onUpdateAssessment: (updatedAssessment) => {
      if (workspaceData) {
        setWorkspaceData({
          ...workspaceData,
          assessment: updatedAssessment,
          completionProgress: {
            totality: updatedAssessment.totalitySymptoms.length > 0,
            rubrics: updatedAssessment.selectedRubrics.length > 0,
            differential: updatedAssessment.differentialReasoning.length > 0,
            miasmatic: updatedAssessment.miasmaticProfile.some(m => m.strength !== "not_assessed"),
            susceptibility: updatedAssessment.susceptibility.level !== "not_assessed",
            timeline: updatedAssessment.timelineEvents.length > 0,
            obstacles: updatedAssessment.obstaclesToCure.length > 0
          }
        });
      }
    }
  });

  const handleUpdateField = (key: keyof HomeopathicAssessment, value: any) => {
    if (!workspaceData) return;
    triggerAutosave({ [key]: value });
  };

  const handleGoToError = (issue: AssessmentValidationIssue) => {
    if (issue.fieldPath.includes("totality")) {
      setActiveTab("totality");
      setTimeout(() => {
        const elem = document.getElementById("totality-builder-section");
        elem?.scrollIntoView({ behavior: "smooth" });
        elem?.focus();
      }, 100);
    } else if (issue.fieldPath.includes("selectedRubrics")) {
      setActiveTab("rubrics");
      setTimeout(() => {
        const elem = document.getElementById("rubrics-section");
        elem?.scrollIntoView({ behavior: "smooth" });
        elem?.focus();
      }, 100);
    } else if (issue.fieldPath.includes("differential")) {
      setActiveTab("differential");
      setTimeout(() => {
        const elem = document.getElementById("differential-section");
        elem?.scrollIntoView({ behavior: "smooth" });
        elem?.focus();
      }, 100);
    }
  };

  const handleSubmitForReview = async () => {
    if (!workspaceData) return;
    setSubmitting(true);
    setValidationIssues([]);
    setSubmitSuccess(false);

    try {
      const res = await homeopathyService.submitAssessmentForReview(
        workspaceData.assessment.id,
        { actorId, organizationId: workspaceData.encounter.organizationId },
        workspaceData.assessment.recordVersion
      );

      if (res.success) {
        setSubmitSuccess(true);
        if (res.assessment) {
          setWorkspaceData({
            ...workspaceData,
            assessment: res.assessment
          });
        }
      } else {
        const conflictIssue = res.validationIssues.find(i => i.code === "VERSION_CONFLICT");
        if (conflictIssue) {
          setConflictState({ isConflict: true, serverVersion: workspaceData.assessment.recordVersion + 1 });
        } else {
          setValidationIssues(res.validationIssues);
          // Auto-scroll to validation issues block
          setTimeout(() => {
            const block = document.getElementById("validation-errors-block");
            block?.scrollIntoView({ behavior: "smooth" });
          }, 150);
        }
      }
    } catch (err: any) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveConflict = async () => {
    if (!workspaceData) return;
    setLoading(true);
    setConflictState({ isConflict: false });
    try {
      const resolvedEncId = encounterId || "enc_milestone3_test";
      const ws = await workspaceService.loadWorkspace(resolvedEncId as any, actorId);
      setWorkspaceData(ws);
    } catch (err) {
      console.error("Conflict resolve failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-955 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-bold">Compiling Homeopathic Assessment Workspace...</p>
        </div>
      </div>
    );
  }

  if (conflictState.isConflict) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 bg-rose-955/30 border border-rose-900 rounded-full flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Concurrent Modification Conflict</h2>
            <p className="text-xs text-slate-500 mt-2">
              Another clinical authority updated this patient's assessment workspace in another active browser session. To prevent data corruption, your draft has been locked.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResolveConflict}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-955 font-black rounded-lg text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reload & Sync Latest Session
          </button>
        </div>
      </div>
    );
  }

  const assessment = workspaceData!.assessment;
  const isSubmitted = assessment.status === "ready_for_review";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-6">
      {/* Header breadcrumb bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5">
        <div className="space-y-1">
          <button 
            onClick={() => router.push("/admin/clinical")}
            className="text-[10px] font-black uppercase text-emerald-400 tracking-wider hover:underline flex items-center gap-1.5 cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Clinical Portal
          </button>
          <h1 className="text-xl font-black tracking-tight text-slate-100 flex items-center gap-2">
            Homeopathic Assessment Engine <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-405">Workspace</span>
          </h1>
        </div>

        {/* Live Autosave and submission controls */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-855 px-3 py-1.5 rounded-lg text-xs font-bold">
            <span className="text-slate-500">Status:</span>
            {isSubmitted ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Ready for Review
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" /> Draft Active
              </span>
            )}
          </div>

          {/* Autosave Status */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-855 px-3 py-1.5 rounded-lg text-xs font-bold">
              <span className="text-slate-550">Autosave:</span>
              {saveStatus === "saving" && <span className="text-emerald-450 animate-pulse">Saving...</span>}
              {saveStatus === "saved" && <span className="text-slate-400">Saved {lastSaved}</span>}
              {saveStatus === "unsaved" && <span className="text-amber-400">Unsaved Changes</span>}
              {saveStatus === "error" && <span className="text-rose-400 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Error</span>}
            </div>
          )}

          {/* Submission button */}
          {!isSubmitted && (
            <button
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
            >
              {submitting ? "Submitting..." : "Submit Assessment"}
            </button>
          )}
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="bg-slate-900 border border-slate-855 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center text-emerald-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-100">{workspaceData?.patient?.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              DOB: {workspaceData?.patient?.dateOfBirth} | Gender: {workspaceData?.patient?.gender} | ID: {workspaceData?.patient?.id}
            </p>
          </div>
        </div>

        {/* High priority allergy tags */}
        <div className="space-y-1">
          <p className="text-[9px] text-slate-550 font-extrabold uppercase tracking-wider">Allergy Intolerances</p>
          <div className="flex flex-wrap gap-2">
            {workspaceData?.allergies && workspaceData.allergies.length > 0 ? (
              workspaceData.allergies.map(a => (
                <span key={a.id} className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-955/20 border border-rose-900 text-rose-450">
                  {a.substanceText} ({a.criticality})
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-600 italic">No drug/food allergies on record</span>
            )}
          </div>
        </div>
      </div>

      {/* Submission Success Box */}
      {submitSuccess && (
        <div className="bg-emerald-950/20 border border-emerald-900 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-emerald-400">Assessment Submitted Successfully</p>
            <p className="text-[10px] text-slate-500 mt-1">The homeopathic totality, rubric groups, and constitutional analysis have been locked and queued for review.</p>
          </div>
        </div>
      )}

      {/* Screen-reader Accessible Validation Errors Block */}
      {validationIssues.length > 0 && (
        <div id="validation-errors-block" tabIndex={-1} className="bg-rose-955/10 border border-rose-900/60 p-4 rounded-xl space-y-3 focus:outline-none">
          <h4 className="text-xs font-extrabold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Validation Errors Found ({validationIssues.length})
          </h4>
          <p className="text-[10px] text-slate-400">Please resolve the following issues before submitting the homeopathic assessment:</p>
          <ul className="space-y-2">
            {validationIssues.map((issue, idx) => (
              <li key={idx} className="text-[11px]">
                <button
                  onClick={() => handleGoToError(issue)}
                  className="text-rose-455 underline hover:text-rose-400 font-semibold cursor-pointer text-left bg-transparent border-0"
                >
                  {issue.message} (Field: {issue.fieldPath})
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Workspace Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <nav className="space-y-1 bg-slate-900/50 border border-slate-855/60 p-3 rounded-2xl h-fit">
          <span className="block text-[9px] font-black uppercase text-slate-550 tracking-wider px-3 mb-2">Workspace Sections</span>
          
          <button
            onClick={() => setActiveTab("totality")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "totality" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" /> Totality Builder
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.totality} 
              readOnly 
              aria-label="Totality completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>

          <button
            onClick={() => setActiveTab("rubrics")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "rubrics" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4" /> Rubric Selection
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.rubrics} 
              readOnly 
              aria-label="Rubric selection completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>

          <button
            onClick={() => setActiveTab("differential")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "differential" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4" /> Differential Reasoning
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.differential} 
              readOnly 
              aria-label="Differential reasoning completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>

          <button
            onClick={() => setActiveTab("miasmatic")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "miasmatic" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Miasmatic Profile
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.miasmatic} 
              readOnly 
              aria-label="Miasmatic profile completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>

          <button
            onClick={() => setActiveTab("susceptibility")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "susceptibility" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> Susceptibility & Vitality
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.susceptibility} 
              readOnly 
              aria-label="Susceptibility completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>

          <button
            onClick={() => setActiveTab("obstacles")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "obstacles" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Obstacles to Cure
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.obstacles} 
              readOnly 
              aria-label="Obstacles to cure completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>

          <button
            onClick={() => setActiveTab("causes")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "causes" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> Etiology & Causes
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.timeline} 
              readOnly 
              aria-label="Etiology completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>

          <button
            onClick={() => setActiveTab("constitutional")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "constitutional" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Constitutional Analysis
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.miasmatic} 
              readOnly 
              aria-label="Constitutional completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer border-0 bg-transparent ${
              activeTab === "timeline" 
                ? "bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 pl-2.5" 
                : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Illness Timeline
            </span>
            <input 
              type="checkbox" 
              checked={workspaceData?.completionProgress.timeline} 
              readOnly 
              aria-label="Timeline completed"
              className="w-3.5 h-3.5 accent-emerald-500 cursor-default" 
            />
          </button>
        </nav>

        {/* Form Work Area */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-855 p-6 rounded-2xl min-h-[500px]">
          {activeTab === "totality" && (
            <div id="totality-builder-section" tabIndex={-1} className="focus:outline-none">
              <TotalityBuilderSection
                intakeSymptoms={workspaceData?.intake?.chiefComplaints || []}
                totalitySymptoms={assessment.totalitySymptoms}
                actorId={actorId}
                onChange={updated => handleUpdateField("totalitySymptoms", updated)}
              />
            </div>
          )}

          {activeTab === "rubrics" && (
            <div id="rubrics-section" tabIndex={-1} className="focus:outline-none">
              <RubricSelectionSection
                selectedRubrics={assessment.selectedRubrics}
                rubricGroups={assessment.rubricGroups}
                totalitySymptoms={assessment.totalitySymptoms}
                searchService={clientRubricSearchService}
                actorId={actorId}
                onChange={updated => handleUpdateField("selectedRubrics", updated)}
              />
            </div>
          )}

          {activeTab === "differential" && (
            <div id="differential-section" tabIndex={-1} className="focus:outline-none">
              <DifferentialReasoningSection
                differentialReasoning={assessment.differentialReasoning}
                totalitySymptoms={assessment.totalitySymptoms}
                selectedRubrics={assessment.selectedRubrics}
                onChange={updated => handleUpdateField("differentialReasoning", updated)}
              />
            </div>
          )}

          {activeTab === "miasmatic" && (
            <MiasmaticAssessmentSection
              miasmaticProfile={assessment.miasmaticProfile}
              totalitySymptoms={assessment.totalitySymptoms}
              onChange={updated => handleUpdateField("miasmaticProfile", updated)}
            />
          )}

          {activeTab === "susceptibility" && (
            <SusceptibilityAssessmentSection
              susceptibility={assessment.susceptibility}
              onChange={updated => handleUpdateField("susceptibility", updated)}
            />
          )}

          {activeTab === "obstacles" && (
            <ObstaclesToCureSection
              obstacles={assessment.obstaclesToCure}
              onChange={updated => handleUpdateField("obstaclesToCure", updated)}
            />
          )}

          {activeTab === "causes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EtiologicalFactorsSection
                etiologicalFactors={assessment.etiologicalFactors}
                onChange={updated => handleUpdateField("etiologicalFactors", updated)}
              />
              <MaintainingCausesSection
                maintainingCauses={assessment.maintainingCauses}
                onChange={updated => handleUpdateField("maintainingCauses", updated)}
              />
            </div>
          )}

          {activeTab === "constitutional" && (
            <ConstitutionalAssessmentSection
              constitutional={assessment.constitutional}
              onChange={updated => handleUpdateField("constitutional", updated)}
            />
          )}

          {activeTab === "timeline" && (
            <HomeopathicTimelineSection
              timelineEvents={assessment.timelineEvents}
              onChange={updated => handleUpdateField("timelineEvents", updated)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
