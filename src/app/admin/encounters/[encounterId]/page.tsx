"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { 
  Heart, Shield, Clock, Brain, FileText, CheckCircle, AlertTriangle, 
  HelpCircle, ChevronRight, User, Calendar, FolderHeart, Save, Play
} from "lucide-react";

// Import Shared Identifiers
import { 
  toEncounterId, toPatientId, toConsultationId, toEpisodeId, 
  toOrganizationId, toClinicId, toPractitionerId,
  EncounterId, PatientId, ConsultationId, EpisodeId, SymptomId 
} from "@/shared/domain/identifiers";
import { DomainEventDispatcher } from "@/shared/events/eventDispatcher";

// Import Patient, Allergy, Episode
import { MockPatientRepository, PatientService, Patient } from "@/features/patient";
import { MockAllergyRepository, AllergyService, AllergyIntolerance } from "@/features/allergy";
import { MockEpisodeRepository, EpisodeService, TreatmentEpisode } from "@/features/treatment-episode";

// Import Encounter & Consultation Services
import { 
  MockEncounterRepository, EncounterService, Encounter, EncounterType, 
  ReviewValidationIssue, validateEncounterForReview 
} from "@/features/encounter";

import { 
  MockConsultationRepository, ConsultationService, ClinicalIntake, 
  SymptomRecord, IllnessTimelineEvent, MentalGenerals, PhysicalGenerals, 
  FollowUpClinicalIntake 
} from "@/features/consultation";

import { RbacEngine } from "@/server/authorization/rbacEngine";

// Import Section Components
import { ChiefComplaintSection } from "@/features/consultation/components/ChiefComplaintSection";
import { HistoryPresentIllnessSection } from "@/features/consultation/components/HistoryPresentIllnessSection";
import { MentalGeneralsSection } from "@/features/consultation/components/MentalGeneralsSection";
import { PhysicalGeneralsSection } from "@/features/consultation/components/PhysicalGeneralsSection";
import { IllnessTimelineSection } from "@/features/consultation/components/IllnessTimelineSection";
import { FollowUpSection } from "@/features/consultation/components/FollowUpSection";
import { ReviewValidationSummary } from "@/features/consultation/components/ReviewValidationSummary";

// Initialize repositories & services
const patientRepo = new MockPatientRepository();
const allergyRepo = new MockAllergyRepository();
const episodeRepo = new MockEpisodeRepository();
const encounterRepo = new MockEncounterRepository();
const consultationRepo = new MockConsultationRepository();

const patientService = new PatientService(patientRepo);
const allergyService = new AllergyService(allergyRepo);
const episodeService = new EpisodeService(episodeRepo);
const encounterService = new EncounterService(encounterRepo);
const consultationService = new ConsultationService(consultationRepo);

// Seed synthetic data helper
async function seedMockData() {
  const patient = await patientService.registerPatient({
    organizationId: "org_homeo_premium",
    clinicId: "clinic_pune_baner",
    createdBy: "doc_jethwani_007",
    demographics: {
      name: "Aarav Sharma",
      dateOfBirth: "1988-05-15",
      gender: "male",
      phone: "9876543210",
      email: "aarav.sharma@example.com",
      address: "Pune, IN",
      bloodGroup: "O+",
      emergencyContact: { name: "Priya", phone: "9876543211", relationship: "Spouse" }
    }
  });

  await allergyService.recordAllergy({
    organizationId: "org_homeo_premium",
    patientId: patient.id,
    substanceText: "Penicillin",
    category: "medication",
    criticality: "high",
    reactionDescriptions: ["Severe anaphylaxis", "Dermatitis hives"],
    createdBy: "doc_jethwani_007"
  });

  const episode = await episodeService.startEpisode({
    organizationId: "org_homeo_premium",
    patientId: patient.id,
    title: "Chronic Reflux Esophagitis",
    conditionConceptIds: ["gerd_01"],
    primaryPractitionerId: "doc_jethwani_007",
    createdBy: "doc_jethwani_007"
  });

  // Create initial consultation draft
  const encounter = await encounterService.createEncounter({
    patientId: toPatientId(patient.id),
    organizationId: toOrganizationId("org_homeo_premium"),
    clinicId: toClinicId("clinic_pune_baner"),
    practitionerId: toPractitionerId("doc_jethwani_007"),
    encounterType: "initial_consultation",
    encounterDate: new Date().toISOString(),
    primaryEpisodeId: toEpisodeId(episode.id),
    createdBy: "doc_jethwani_007"
  });

  const intake = await consultationService.createIntake({
    encounterId: toEncounterId(encounter.id),
    patientId: toPatientId(patient.id),
    organizationId: toOrganizationId("org_homeo_premium"),
    clinicId: toClinicId("clinic_pune_baner"),
    treatmentEpisodeId: toEpisodeId(episode.id),
    createdBy: "doc_jethwani_007"
  });

  // Link intake to encounter
  const mockEncRepo = encounterRepo as any;
  await mockEncRepo.updateDraft(
    encounter.id, 
    { clinicalIntakeId: toConsultationId(intake.id), provenance: encounter.provenance }, 
    encounter.recordVersion
  );

  return encounter.id;
}

type SaveState = "unsaved" | "saving" | "saved" | "error" | "conflict" | "offline_demo_only";

interface PageProps {
  params: Promise<{ encounterId: string }>;
}

export default function ClinicianWorkspace({ params }: PageProps) {
  const unwrappedParams = use(params);
  const routeEncounterId = unwrappedParams.encounterId;

  // Domain entity states
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [intake, setIntake] = useState<ClinicalIntake | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<AllergyIntolerance[]>([]);
  const [episode, setEpisode] = useState<TreatmentEpisode | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<"complaints" | "histories" | "generals" | "timeline" | "followup">("complaints");
  const [saveStatus, setSaveStatus] = useState<SaveState>("saved");
  const [lastSaved, setLastSaved] = useState<string>("");
  const [validationIssues, setValidationIssues] = useState<ReviewValidationIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Refs for navigation alerts
  const isDirty = useRef(false);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Load and restore persisted draft data
  useEffect(() => {
    async function loadData() {
      try {
        let encId = routeEncounterId;
        // If loading a synthetic workspace stub, auto-seed the demo model
        if (encId === "synthetic-demo" || encId === "new") {
          encId = await seedMockData();
        }

        const enc = await encounterService.getEncounter(toEncounterId(encId));
        if (!enc) {
          setErrorMessage("Target clinical encounter was not found.");
          setLoading(false);
          return;
        }

        setEncounter(enc);

        const pat = await patientService.getPatient(enc.patientId);
        setPatient(pat);

        if (pat) {
          const listAllergies = await allergyService.getPatientAllergies(pat.id);
          setAllergies(listAllergies);
        }

        if (enc.primaryEpisodeId) {
          const ep = await episodeRepo.findById(enc.primaryEpisodeId);
          setEpisode(ep);
        }

        if (enc.clinicalIntakeId) {
          const clinicalIntake = await consultationService.getIntakeById(enc.clinicalIntakeId);
          setIntake(clinicalIntake);
        }

        setLastSaved(new Date().toLocaleTimeString());
        setLoading(false);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load clinical workspace context.");
        setLoading(false);
      }
    }

    loadData();
  }, [routeEncounterId]);

  // Alert before unloading if unsaved edits are present
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.current) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to discard them?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Debounced Autosave Orchestration (2-seconds delay)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerAutosave = (updatedIntake: ClinicalIntake) => {
    isDirty.current = true;
    setSaveStatus("unsaved");

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (!encounter || !intake) return;
      setSaveStatus("saving");

      try {
        const result = await consultationService.saveDraft(
          intake.id,
          updatedIntake,
          intake.recordVersion,
          "doc_jethwani_007"
        );

        if (result.status === "updated") {
          setIntake(result.entity);
          setSaveStatus("saved");
          setLastSaved(new Date().toLocaleTimeString());
          isDirty.current = false;
        } else if (result.status === "version_conflict") {
          setSaveStatus("conflict");
          setErrorMessage("Autosave rejected: A concurrent modification conflict occurred on the server.");
        } else {
          setSaveStatus("error");
        }
      } catch (err) {
        setSaveStatus("error");
      }
    }, 2000);
  };

  // Mutators passed down to panels
  const handleIntakeFieldChange = (fields: Partial<ClinicalIntake>) => {
    if (!intake) return;
    const updated = { ...intake, ...fields };
    setIntake(updated);
    triggerAutosave(updated);
  };

  const handleSymptomListChange = (newSymptoms: SymptomRecord[]) => {
    handleIntakeFieldChange({ chiefComplaints: newSymptoms });
  };

  const handleTimelineEventsChange = (newEvents: IllnessTimelineEvent[]) => {
    handleIntakeFieldChange({ illnessTimeline: newEvents });
  };

  const handleMentalGeneralsChange = (updatedMental: MentalGenerals) => {
    handleIntakeFieldChange({ mentalGenerals: updatedMental });
  };

  const handlePhysicalGeneralsChange = (updatedPhysical: PhysicalGenerals) => {
    handleIntakeFieldChange({ physicalGenerals: updatedPhysical });
  };

  const handleFollowUpDetailsChange = (updatedFup: FollowUpClinicalIntake) => {
    handleIntakeFieldChange({ followUpDetails: updatedFup });
  };

  // Submit Encounter domain action
  const handleSubmitReview = async () => {
    if (!encounter) return;
    setLoading(true);
    setValidationIssues([]);

    try {
      const actorContext = {
        actorId: "doc_jethwani_007",
        organizationId: encounter.organizationId,
        clinicId: encounter.clinicId
      };

      const result = await encounterService.submitEncounterForReview(
        encounter.id,
        actorContext,
        intake
      );

      if (result.success && result.encounter) {
        setEncounter(result.encounter);
        setSaveStatus("saved");
        setLastSaved(new Date().toLocaleTimeString());
        isDirty.current = false;
      } else {
        setValidationIssues(result.validationIssues);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit encounter for clinical review.");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard navigation for WAI-ARIA tab lists
  const handleTabKeyDown = (e: React.KeyboardEvent, tab: typeof activeTab) => {
    const tabs: typeof activeTab[] = ["complaints", "histories", "generals", "timeline"];
    if (encounter?.encounterType === "follow_up") {
      tabs.push("followup");
    }

    const idx = tabs.indexOf(tab);
    let nextTab: typeof activeTab | null = null;

    if (e.key === "ArrowRight") {
      nextTab = tabs[(idx + 1) % tabs.length];
    } else if (e.key === "ArrowLeft") {
      nextTab = tabs[(idx - 1 + tabs.length) % tabs.length];
    }

    if (nextTab) {
      setActiveTab(nextTab);
      // Accessibility focus shift
      const button = tabListRef.current?.querySelector(`[data-tab-id="${nextTab}"]`) as HTMLButtonElement;
      button?.focus();
    }
  };

  const focusFieldRef = (fieldPath: string) => {
    // Focus the UI tab and input element associated with validation errors
    if (fieldPath.startsWith("chiefComplaints")) {
      setActiveTab("complaints");
    } else if (fieldPath.startsWith("historyPresentIllness")) {
      setActiveTab("histories");
      setTimeout(() => document.getElementById("hpi")?.focus(), 100);
    } else if (fieldPath.startsWith("mentalGenerals")) {
      setActiveTab("generals");
      setTimeout(() => document.getElementById("mentalNotes")?.focus(), 100);
    } else if (fieldPath.startsWith("physicalGenerals")) {
      setActiveTab("generals");
      setTimeout(() => document.getElementById("physicalNotes")?.focus(), 100);
    } else if (fieldPath.startsWith("illnessTimeline")) {
      setActiveTab("timeline");
    } else if (fieldPath.startsWith("followUpDetails")) {
      setActiveTab("followup");
      setTimeout(() => document.getElementById("responseSummary")?.focus(), 100);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans text-xs">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-slate-350">Restoring clinical draft state...</p>
        </div>
      </div>
    );
  }

  if (errorMessage && !encounter) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex items-center justify-center font-sans text-xs">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-sm font-black text-slate-100 uppercase tracking-wide">Workspace Initialization Failed</h2>
          <p className="text-slate-400">{errorMessage}</p>
          <Link href="/admin/clinical" className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg cursor-pointer">
            Return to Clinical Console
          </Link>
        </div>
      </div>
    );
  }

  const highPriorityAllergies = allergies.filter(a => a.criticality === "high");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* High priority allergy notification panel */}
      {highPriorityAllergies.length > 0 && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-200 px-4 py-3 rounded-xl flex items-center justify-between gap-3 mb-6 shadow-lg shadow-rose-950/20" role="alert">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                CRITICAL ALLERGY ALERT
              </span>
              <p className="text-[10px] text-rose-450 mt-0.5">
                Patient is allergic to: <strong className="text-rose-100">{highPriorityAllergies.map(a => a.substanceText).join(", ")}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Header */}
      <header className="mb-6 bg-slate-900 border border-slate-850 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] uppercase font-extrabold tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
              {patient?.uhid || "UHID-TEMP"}
            </span>
            <span className="text-[9px] uppercase font-extrabold tracking-wider bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full">
              {encounter?.encounterType.replace("_", " ")}
            </span>
            <span className={`text-[9px] uppercase font-extrabold tracking-wider border px-2 py-0.5 rounded-full ${
              encounter?.status === "ready_for_review" 
                ? "bg-amber-950 text-amber-400 border-amber-800" 
                : "bg-slate-950 text-slate-500 border-slate-850"
            }`}>
              {encounter?.status.replace("_", " ")}
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-100 mt-2 flex items-center gap-2">
            <User className="w-5 h-5 text-slate-450" />
            {patient?.name || "Anonymous Patient"}
          </h2>

          <div className="flex gap-4 mt-1.5 text-[10px] text-slate-400 flex-wrap">
            {episode && (
              <span className="flex items-center gap-1"><FolderHeart className="w-3.5 h-3.5 text-rose-500/80" /> Episode: {episode.title}</span>
            )}
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> Date: {encounter ? new Date(encounter.encounterDate).toLocaleDateString() : ""}</span>
          </div>
        </div>

        {/* Save Status & Action buttons */}
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500">
              Last saved: <strong className="text-slate-400">{lastSaved}</strong>
            </span>
            
            {/* Visual Save Status Indicator */}
            <span 
              className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                saveStatus === "saved" ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" :
                saveStatus === "saving" ? "bg-slate-950 border-slate-800 text-slate-400 animate-pulse" :
                saveStatus === "unsaved" ? "bg-amber-955/20 border-amber-800 text-amber-400" :
                saveStatus === "conflict" ? "bg-rose-955/20 border-rose-800 text-rose-450" :
                "bg-rose-955/20 border-rose-850 text-rose-400"
              }`}
              role="status"
              aria-live="polite"
            >
              {saveStatus === "saved" && "All Changes Persisted"}
              {saveStatus === "saving" && "Saving Draft..."}
              {saveStatus === "unsaved" && "Unsaved Changes"}
              {saveStatus === "conflict" && "Version Conflict Error"}
              {saveStatus === "error" && "Autosave Error"}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => {
                if (intake) triggerAutosave(intake);
              }}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Force Save
            </button>
            {encounter?.status === "draft" && (
              <button
                onClick={handleSubmitReview}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Submit For Review
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Validation Summary (focused automatically on failed submit) */}
      <div className="mb-6">
        <ReviewValidationSummary issues={validationIssues} onFocusField={focusFieldRef} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar: WAI-ARIA tabs */}
        <div className="space-y-4">
          <div 
            ref={tabListRef}
            className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 flex flex-col space-y-1"
            role="tablist"
            aria-label="Clinician Workspace Intake Sections"
          >
            <button
              role="tab"
              aria-selected={activeTab === "complaints"}
              aria-controls="panel-complaints"
              id="tab-complaints"
              data-tab-id="complaints"
              tabIndex={activeTab === "complaints" ? 0 : -1}
              onClick={() => setActiveTab("complaints")}
              onKeyDown={e => handleTabKeyDown(e, "complaints")}
              className={`w-full text-left px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                activeTab === "complaints" 
                  ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900" 
                  : "bg-transparent text-slate-450 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Heart className="w-4 h-4" /> Chief Complaints
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "histories"}
              aria-controls="panel-histories"
              id="tab-histories"
              data-tab-id="histories"
              tabIndex={activeTab === "histories" ? 0 : -1}
              onClick={() => setActiveTab("histories")}
              onKeyDown={e => handleTabKeyDown(e, "histories")}
              className={`w-full text-left px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                activeTab === "histories" 
                  ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900" 
                  : "bg-transparent text-slate-450 hover:text-slate-200 border border-transparent"
              }`}
            >
              <FileText className="w-4 h-4" /> Histories (HPI/PMH)
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "generals"}
              aria-controls="panel-generals"
              id="tab-generals"
              data-tab-id="generals"
              tabIndex={activeTab === "generals" ? 0 : -1}
              onClick={() => setActiveTab("generals")}
              onKeyDown={e => handleTabKeyDown(e, "generals")}
              className={`w-full text-left px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                activeTab === "generals" 
                  ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900" 
                  : "bg-transparent text-slate-450 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Brain className="w-4 h-4" /> Generals (Mental/Physical)
            </button>

            <button
              role="tab"
              aria-selected={activeTab === "timeline"}
              aria-controls="panel-timeline"
              id="tab-timeline"
              data-tab-id="timeline"
              tabIndex={activeTab === "timeline" ? 0 : -1}
              onClick={() => setActiveTab("timeline")}
              onKeyDown={e => handleTabKeyDown(e, "timeline")}
              className={`w-full text-left px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                activeTab === "timeline" 
                  ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900" 
                  : "bg-transparent text-slate-450 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Clock className="w-4 h-4" /> Illness Chronology
            </button>

            {encounter?.encounterType === "follow_up" && (
              <button
                role="tab"
                aria-selected={activeTab === "followup"}
                aria-controls="panel-followup"
                id="tab-followup"
                data-tab-id="followup"
                tabIndex={activeTab === "followup" ? 0 : -1}
                onClick={() => setActiveTab("followup")}
                onKeyDown={e => handleTabKeyDown(e, "followup")}
                className={`w-full text-left px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  activeTab === "followup" 
                    ? "bg-emerald-950/45 text-emerald-400 border border-emerald-900" 
                    : "bg-transparent text-slate-450 hover:text-slate-200 border border-transparent"
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Follow-up Assessment
              </button>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-center">
            <Link href="/admin/clinical" className="text-xs text-slate-400 hover:text-emerald-400 font-bold transition-colors cursor-pointer inline-flex items-center gap-1">
              ← Return to Clinical Console
            </Link>
          </div>
        </div>

        {/* Tab panels content */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-850 rounded-xl p-6 shadow-md min-h-[460px]">
          
          <div 
            id="panel-complaints"
            role="tabpanel"
            aria-labelledby="tab-complaints"
            hidden={activeTab !== "complaints"}
          >
            {activeTab === "complaints" && intake && (
              <ChiefComplaintSection 
                symptoms={intake.chiefComplaints || []} 
                onChange={handleSymptomListChange} 
              />
            )}
          </div>

          <div 
            id="panel-histories"
            role="tabpanel"
            aria-labelledby="tab-histories"
            hidden={activeTab !== "histories"}
          >
            {activeTab === "histories" && intake && (
              <HistoryPresentIllnessSection
                historyPresentIllness={intake.historyPresentIllness || ""}
                pastMedicalHistory={intake.pastMedicalHistory || ""}
                familyHistory={intake.familyHistory || ""}
                onChange={handleIntakeFieldChange}
              />
            )}
          </div>

          <div 
            id="panel-generals"
            role="tabpanel"
            aria-labelledby="tab-generals"
            hidden={activeTab !== "generals"}
          >
            {activeTab === "generals" && intake && (
              <div className="space-y-8">
                <MentalGeneralsSection 
                  mentalGenerals={intake.mentalGenerals} 
                  onChange={handleMentalGeneralsChange} 
                />
                <PhysicalGeneralsSection 
                  physicalGenerals={intake.physicalGenerals} 
                  onChange={handlePhysicalGeneralsChange} 
                />
              </div>
            )}
          </div>

          <div 
            id="panel-timeline"
            role="tabpanel"
            aria-labelledby="tab-timeline"
            hidden={activeTab !== "timeline"}
          >
            {activeTab === "timeline" && intake && (
              <IllnessTimelineSection 
                events={intake.illnessTimeline || []} 
                onChange={handleTimelineEventsChange} 
              />
            )}
          </div>

          {encounter?.encounterType === "follow_up" && (
            <div 
              id="panel-followup"
              role="tabpanel"
              aria-labelledby="tab-followup"
              hidden={activeTab !== "followup"}
            >
              {activeTab === "followup" && intake && (
                <FollowUpSection
                  followUpDetails={intake.followUpDetails}
                  chiefComplaints={intake.chiefComplaints}
                  onChange={handleFollowUpDetailsChange}
                />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
