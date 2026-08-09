"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Brain, Clock, FileText,
  Save, Video, Pill, RefreshCw
} from "lucide-react";
import {
  ClinicalIntake,
  ConsultationLifecycleStatus,
  ConsultationOutcome,
  isValidLifecycleTransition
} from "../domain/consultation.types";
import { ClinicalNotesPanel } from "./ClinicalNotesPanel";
import { TelemedicinePanel } from "./TelemedicinePanel";
import { RepertoryIntelligencePanel } from "./RepertoryIntelligencePanel";
import { PrescriptionPanel } from "./PrescriptionPanel";
import { StructuredClinicalNotes, DEFAULT_CLINICAL_NOTES } from "../types/clinical-notes.types";
import type { PrescriptionDraft } from "../types/prescription.types";
import type { SelectedRubric } from "../types/repertory-intelligence.types";
import type { TranscriptionConsent } from "../types/telemedicine.types";
import type {
  ConsultationRemedySelection,
  ConsultationWorkspaceRecord,
} from "../application/consultationWorkspace.types";

interface ConsultationWorkspaceShellProps {
  patientId: string;
  initialIntake?: ClinicalIntake | null;
}

export function ConsultationWorkspaceShell({
  patientId,
  initialIntake
}: ConsultationWorkspaceShellProps) {
  // Lifecycle State
  const [status, setStatus] = useState<ConsultationLifecycleStatus>(
    initialIntake?.lifecycleStatus || "active"
  );
  const [outcome, setOutcome] = useState<ConsultationOutcome | "">(
    initialIntake?.outcome || ""
  );
  const [notes, setNotes] = useState<StructuredClinicalNotes>(DEFAULT_CLINICAL_NOTES);
  const [selectedRubrics, setSelectedRubrics] = useState<SelectedRubric[]>([]);
  const [selectedRemedy, setSelectedRemedy] = useState<ConsultationRemedySelection | null>(null);
  const [analysisSnapshotHash, setAnalysisSnapshotHash] = useState<string>("");
  const [prescriptionDraft, setPrescriptionDraft] = useState<Partial<PrescriptionDraft>>({});
  const [consent, setConsent] = useState<TranscriptionConsent>({ status: "unknown" });
  const [consultationId, setConsultationId] = useState<string>(initialIntake?.id || "");
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    initialIntake?.accumulatedActiveSeconds || 0
  );

  // Concurrency & Revision State
  const [recordVersion, setRecordVersion] = useState<number>(
    initialIntake?.recordVersion || 0
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    initialIntake?.provenance?.updatedAt || null
  );

  useEffect(() => {
    let active = true;
    async function loadWorkspace() {
      try {
        const response = await fetch(
          `/api/admin/clinical/consultation/workspace?patientId=${encodeURIComponent(patientId)}`,
          { cache: "no-store" }
        );
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Unable to load consultation");
        if (!active) return;
        const workspace = data.workspace as ConsultationWorkspaceRecord;
        setConsultationId(workspace.id);
        setStatus(workspace.lifecycleStatus);
        setOutcome(workspace.outcome);
        setNotes(workspace.notes);
        setSelectedRubrics(workspace.selectedRubrics || []);
        setSelectedRemedy(workspace.selectedRemedy || null);
        setPrescriptionDraft(workspace.prescriptionDraft || {});
        setConsent(workspace.consent || { status: "unknown" });
        setElapsedSeconds(workspace.accumulatedActiveSeconds || 0);
        setRecordVersion(workspace.recordVersion);
        setLastSavedAt(workspace.recordVersion > 0 ? workspace.updatedAt : null);
      } catch (error) {
        if (active) setWorkspaceError(error instanceof Error ? error.message : "Unable to load consultation");
      } finally {
        if (active) setIsWorkspaceLoading(false);
      }
    }
    void loadWorkspace();
    return () => {
      active = false;
    };
  }, [patientId]);

  // Timer State (Server-validated accumulated seconds + live elapsed timer)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (status === "active") {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Transition Handler
  const handleTransition = (nextStatus: ConsultationLifecycleStatus) => {
    if (!isValidLifecycleTransition(status, nextStatus)) {
      alert(`Invalid transition from ${status} to ${nextStatus}`);
      return;
    }
    setStatus(nextStatus);
  };

  // Manual Save Draft
  const handleSaveDraft = async () => {
    if (!consultationId) return;
    setSaveStatus("saving");
    try {
      const response = await fetch("/api/admin/clinical/consultation/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedVersion: recordVersion,
          draft: {
            id: consultationId,
            patientId,
            lifecycleStatus: status,
            outcome,
            notes,
            selectedRubrics,
            selectedRemedy,
            prescriptionDraft,
            accumulatedActiveSeconds: elapsedSeconds,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Draft save failed");
      const saved = data.workspace as ConsultationWorkspaceRecord;
      setRecordVersion(saved.recordVersion);
      setSaveStatus("saved");
      setLastSavedAt(saved.updatedAt);
      setConsent(saved.consent);
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (error) {
      setSaveStatus("error");
      setWorkspaceError(error instanceof Error ? error.message : "Draft save failed");
    }
  };

  const handlePrescriptionDraftChange = useCallback(
    (draft: Partial<PrescriptionDraft>) => setPrescriptionDraft(draft),
    []
  );
  const handleSelectedRubricsChange = useCallback(
    (rubrics: SelectedRubric[]) => setSelectedRubrics(rubrics),
    []
  );
  const handleAnalysisSnapshotChange = useCallback(
    (snapshotHash: string) => setAnalysisSnapshotHash(snapshotHash),
    []
  );

  // Ergonomic Workspace Layout & Fullscreen Modes
  const [layoutMode, setLayoutMode] = useState<"balanced" | "case_taking" | "repertory_focus" | "planner_focus">("case_taking");
  const [maximizedPanel, setMaximizedPanel] = useState<"none" | "panel1" | "panel2" | "panel3" | "panel4">("none");
  const [isTelemedicineCollapsed, setIsTelemedicineCollapsed] = useState<boolean>(true);
  const [isPrescriptionCollapsed, setIsPrescriptionCollapsed] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Bar (Patient • Status • Timer • Layout Presets • Save • End) */}
      <header className="flex-none h-16 bg-slate-900 border-b border-slate-800 px-4 xl:px-6 flex items-center justify-between z-20 gap-3">
        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/admin/dashboard?tab=patients"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-100 text-base">Clinical Consultation</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-mono font-medium border border-teal-500/20">
                UHID: {patientId}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
              <span>Status: <strong className="text-slate-200 capitalize">{status}</strong></span>
              <span>•</span>
              <span>Rev: v{recordVersion}</span>
              {lastSavedAt && (
                <>
                  <span>•</span>
                  <span>Saved: {lastSavedAt}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center Timer & Ergonomic Layout Mode Switcher */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
          <div className="flex items-center space-x-2 font-mono text-xs text-teal-400">
            <Clock className="w-4 h-4 animate-pulse text-teal-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Ergonomic Workflow View Presets */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setIsTelemedicineCollapsed(false);
                setLayoutMode("planner_focus");
              }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
                layoutMode === "planner_focus"
                  ? "bg-purple-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Expand Treatment Planner & Fee Simulator to wide view"
            >
              <span>💰 Treatment Planner Focus</span>
            </button>

            <button
              onClick={() => setLayoutMode("case_taking")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
                layoutMode === "case_taking"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Expand Clinical Notes for deep symptom entry"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Case-Taking Focus</span>
            </button>

            <button
              onClick={() => setLayoutMode("repertory_focus")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
                layoutMode === "repertory_focus"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Expand Repertory Workbench for remedy analysis"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Repertory Focus</span>
            </button>

            <button
              onClick={() => setLayoutMode("balanced")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
                layoutMode === "balanced"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Balanced Overview across all panels"
            >
              <span>Overview</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Lifecycle Action Buttons */}
          <div className="flex items-center space-x-1.5">
            {status === "active" && (
              <button
                onClick={() => handleTransition("paused")}
                className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium transition-colors border border-amber-500/30"
              >
                Pause
              </button>
            )}
            {status === "paused" && (
              <button
                onClick={() => handleTransition("active")}
                className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium transition-colors border border-emerald-500/30"
              >
                Resume
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleSaveDraft}
            disabled={saveStatus === "saving"}
            className="flex items-center space-x-1.5 text-xs px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            {saveStatus === "saving" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
            ) : (
              <Save className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Draft"}</span>
          </button>

        </div>
      </header>

      {workspaceError && (
        <div className="px-4 py-2 bg-red-950 text-red-200 border-b border-red-800 text-xs">
          {workspaceError}
        </div>
      )}

      {isWorkspaceLoading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading consultation record…
        </div>
      ) : (
      <>
      {/* 2. Adaptive Ergonomic Workspace Grid */}
      <main className="flex-1 flex flex-col lg:flex-row gap-3 p-3 min-h-0 overflow-hidden bg-slate-950">
        
        {/* Panel 1: Telemedicine & Treatment Planner Console */}
        <div
          className={`transition-all duration-300 flex flex-col min-h-0 overflow-hidden ${
            isTelemedicineCollapsed
              ? "lg:w-14 shrink-0"
              : layoutMode === "planner_focus"
              ? "lg:flex-[2.5] xl:flex-[3] shrink-0"
              : layoutMode === "case_taking" || layoutMode === "repertory_focus"
              ? "lg:w-56 shrink-0"
              : "lg:w-64 xl:w-72 shrink-0"
          }`}
        >
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-b-0 border-slate-800 rounded-t-xl text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              {!isTelemedicineCollapsed
                ? layoutMode === "planner_focus"
                  ? "💰 Expanded Treatment Planner"
                  : "Telemedicine & Treatment Planner"
                : "Media"}
            </span>
            <div className="flex items-center space-x-1.5">
              {!isTelemedicineCollapsed && (
                <>
                  <button
                    type="button"
                    onClick={() => setMaximizedPanel("panel1")}
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-800/60 transition-colors"
                    title="Maximize Panel 1 to Fullscreen"
                  >
                    ⛶ Fullscreen
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutMode(layoutMode === "planner_focus" ? "balanced" : "planner_focus")}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                      layoutMode === "planner_focus"
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                    }`}
                    title={layoutMode === "planner_focus" ? "Restore Standard Width" : "Expand Treatment Planner to Full Width"}
                  >
                    {layoutMode === "planner_focus" ? "Standard" : "⤢ Expand Size"}
                  </button>
                </>
              )}
              <button
                onClick={() => setIsTelemedicineCollapsed(!isTelemedicineCollapsed)}
                className="hover:text-teal-400 transition-colors p-0.5 rounded"
                title={isTelemedicineCollapsed ? "Expand Video Panel" : "Collapse Video Panel"}
              >
                {isTelemedicineCollapsed ? "▶" : "◀"}
              </button>
            </div>
          </div>

          {!isTelemedicineCollapsed ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <TelemedicinePanel
                patientId={patientId}
                consultationId={consultationId}
                startedAt={initialIntake?.startedAt}
                pausedAt={initialIntake?.pausedAt}
                isPaused={status === "paused"}
                isCompleted={status === "completed"}
                consent={consent}
                currentNotes={notes}
                onNotesUpdated={setNotes}
                onToggleExpandPlanner={() => setLayoutMode(layoutMode === "planner_focus" ? "balanced" : "planner_focus")}
                isPlannerExpanded={layoutMode === "planner_focus"}
              />
            </div>
          ) : (
            <div
              onClick={() => setIsTelemedicineCollapsed(false)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-b-xl flex flex-col items-center justify-between py-6 px-1 cursor-pointer hover:bg-slate-800/80 transition-all text-slate-400 group"
              title="Click anywhere to expand Media & Treatment Planner Panel"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTelemedicineCollapsed(false);
                }}
                className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 flex items-center justify-center font-bold text-xs shadow-md transition-transform group-hover:scale-110"
                title="Expand Media & Treatment Planner"
              >
                ▶
              </button>

              <div className="flex flex-col items-center space-y-3">
                <Video className="w-5 h-5 text-teal-400 animate-pulse group-hover:scale-110 transition-transform" />
                <div className="writing-mode-vertical text-xs tracking-wider uppercase font-semibold text-slate-400 group-hover:text-teal-300">
                  Media & Treatment Planner
                </div>
              </div>

              <span className="text-[10px] text-teal-400 font-mono font-bold uppercase tracking-wider">Expand</span>
            </div>
          )}
        </div>

        {/* Panel 2: Structured Clinical Documentation */}
        <div
          className={`transition-all duration-300 flex flex-col min-h-0 overflow-hidden relative ${
            layoutMode === "case_taking"
              ? "lg:flex-[2.2]"
              : layoutMode === "repertory_focus"
              ? "lg:flex-[1]"
              : "lg:flex-[1.4]"
          }`}
        >
          <div className="absolute top-2 right-3 z-10">
            <button
              type="button"
              onClick={() => setMaximizedPanel("panel2")}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 hover:bg-slate-800 text-teal-300 border border-teal-800/60 shadow-md transition-colors"
              title="Maximize Clinical Notes Panel to Fullscreen"
            >
              ⛶ Fullscreen
            </button>
          </div>
          <ClinicalNotesPanel
            notes={notes}
            onChange={setNotes}
            outcome={outcome || undefined}
            readOnly={status === "completed"}
          />
        </div>

        {/* Panel 3: AI Repertory Workbench & Remedy Analysis */}
        <div
          className={`transition-all duration-300 flex flex-col min-h-0 overflow-hidden relative ${
            layoutMode === "repertory_focus"
              ? "lg:flex-[2.5]"
              : layoutMode === "case_taking"
              ? "lg:flex-[1.2]"
              : "lg:flex-[1.6]"
          }`}
        >
          <div className="absolute top-2 right-3 z-10">
            <button
              type="button"
              onClick={() => setMaximizedPanel("panel3")}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 hover:bg-slate-800 text-purple-300 border border-purple-800/60 shadow-md transition-colors"
              title="Maximize Repertory Intelligence Panel to Fullscreen"
            >
              ⛶ Fullscreen
            </button>
          </div>
          <RepertoryIntelligencePanel
            patientId={patientId}
            consultationId={consultationId}
            initialSelectedRubrics={selectedRubrics}
            onSelectedRubricsChange={handleSelectedRubricsChange}
            onAnalysisSnapshotChange={handleAnalysisSnapshotChange}
            chiefComplaints={notes.chiefComplaints.map((c) => c.complaint)}
            patientThermal={notes.thermalState === "hot" ? "warm" : notes.thermalState === "chilly" ? "chilly" : "ambithermal"}
            patientMiasm={notes.miasmaticExpression}
            onSelectRemedyForPrescription={(remedyId, remedyName, snapshotHash) => {
              setSelectedRemedy({
                remedyId,
                remedyName,
                analysisSnapshotHash: snapshotHash,
                selectedAt: new Date().toISOString(),
              });
            }}
          />
        </div>

        {/* Panel 4: Digital Prescription & Dispatch Builder */}
        <div
          className={`transition-all duration-300 flex flex-col min-h-0 overflow-hidden ${
            isPrescriptionCollapsed
              ? "lg:w-14 shrink-0"
              : layoutMode === "case_taking" || layoutMode === "repertory_focus"
              ? "lg:w-64 shrink-0"
              : "lg:w-72 xl:w-80 shrink-0"
          }`}
        >
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-b-0 border-slate-800 rounded-t-xl text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              {!isPrescriptionCollapsed ? "Prescription" : "Rx"}
            </span>
            <div className="flex items-center space-x-1.5">
              {!isPrescriptionCollapsed && (
                <button
                  type="button"
                  onClick={() => setMaximizedPanel("panel4")}
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-800/60 transition-colors"
                  title="Maximize Prescription Panel to Fullscreen"
                >
                  ⛶ Fullscreen
                </button>
              )}
              <button
                onClick={() => setIsPrescriptionCollapsed(!isPrescriptionCollapsed)}
                className="hover:text-teal-400 transition-colors p-0.5 rounded"
                title={isPrescriptionCollapsed ? "Expand Prescription Panel" : "Collapse Prescription Panel"}
              >
                {isPrescriptionCollapsed ? "◀" : "▶"}
              </button>
            </div>
          </div>

          {!isPrescriptionCollapsed ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <PrescriptionPanel
                patientId={patientId}
                consultationId={consultationId}
                recordVersion={recordVersion}
                notes={notes}
                outcome={outcome}
                onOutcomeChange={setOutcome}
                initialDraft={prescriptionDraft}
                onDraftChange={handlePrescriptionDraftChange}
                selectedRubrics={selectedRubrics}
                selectedRemedy={selectedRemedy}
                accumulatedActiveSeconds={elapsedSeconds}
                selectedRemedyName={selectedRemedy?.remedyName}
                isAnalysisStale={Boolean(selectedRemedy && selectedRemedy.analysisSnapshotHash !== analysisSnapshotHash)}
                onConsultationCompleted={(newOutcome, newRecordVersion) => {
                  setStatus("completed");
                  setOutcome(newOutcome);
                  setRecordVersion(newRecordVersion);
                }}
              />
            </div>
          ) : (
            <div
              onClick={() => setIsPrescriptionCollapsed(false)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-b-xl flex flex-col items-center justify-between py-6 px-1 cursor-pointer hover:bg-slate-800/80 transition-all text-slate-400 group"
              title="Click anywhere to expand Prescription Panel"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPrescriptionCollapsed(false);
                }}
                className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shadow-md transition-transform group-hover:scale-110"
                title="Expand Prescription Panel"
              >
                ◀
              </button>

              <div className="flex flex-col items-center space-y-3">
                <Pill className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="writing-mode-vertical text-xs tracking-wider uppercase font-semibold text-slate-400 group-hover:text-emerald-300">
                  Prescription Draft
                </div>
              </div>

              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Expand</span>
            </div>
          )}
        </div>

      </main>
      </>
      )}

      {/* 3. Fullscreen Panel Modal Overlay */}
      {maximizedPanel !== "none" && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-slate-950/98 backdrop-blur-md p-3 flex flex-col min-h-0 overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-t-xl text-xs font-bold text-slate-200 shrink-0">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
              <span className="text-teal-300 uppercase tracking-wider text-xs">
                {maximizedPanel === "panel1" && "🎥 Telemedicine & Treatment Planner Console (Fullscreen View)"}
                {maximizedPanel === "panel2" && "📝 Structured Clinical Documentation & Case Taking (Fullscreen View)"}
                {maximizedPanel === "panel3" && "📊 Repertory & Clinical Decision Support (Fullscreen View)"}
                {maximizedPanel === "panel4" && "💊 Digital Prescription & Guarded Completion (Fullscreen View)"}
              </span>
            </div>
            <button
              onClick={() => setMaximizedPanel("none")}
              className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>✕ Exit Fullscreen</span>
            </button>
          </div>

          <div className="flex-1 bg-slate-900 border border-t-0 border-slate-800 rounded-b-xl overflow-hidden min-h-0 relative">
            {maximizedPanel === "panel1" && (
              <TelemedicinePanel
                patientId={patientId}
                consultationId={consultationId}
                startedAt={initialIntake?.startedAt}
                pausedAt={initialIntake?.pausedAt}
                isPaused={status === "paused"}
                isCompleted={status === "completed"}
                consent={consent}
                currentNotes={notes}
                onNotesUpdated={setNotes}
                isPlannerExpanded={true}
              />
            )}
            {maximizedPanel === "panel2" && (
              <ClinicalNotesPanel
                notes={notes}
                onChange={setNotes}
                outcome={outcome || undefined}
                readOnly={status === "completed"}
              />
            )}
            {maximizedPanel === "panel3" && (
              <RepertoryIntelligencePanel
                patientId={patientId}
                consultationId={consultationId}
                initialSelectedRubrics={selectedRubrics}
                onSelectedRubricsChange={handleSelectedRubricsChange}
                onAnalysisSnapshotChange={handleAnalysisSnapshotChange}
                chiefComplaints={notes.chiefComplaints.map((c) => c.complaint)}
                patientThermal={notes.thermalState === "hot" ? "warm" : notes.thermalState === "chilly" ? "chilly" : "ambithermal"}
                patientMiasm={notes.miasmaticExpression}
                onSelectRemedyForPrescription={(remedyId, remedyName, snapshotHash) => {
                  setSelectedRemedy({ remedyId, remedyName, analysisSnapshotHash: snapshotHash, selectedAt: new Date().toISOString() });
                }}
              />
            )}
            {maximizedPanel === "panel4" && (
              <PrescriptionPanel
                patientId={patientId}
                consultationId={consultationId}
                recordVersion={recordVersion}
                notes={notes}
                outcome={outcome}
                onOutcomeChange={setOutcome}
                initialDraft={prescriptionDraft}
                onDraftChange={handlePrescriptionDraftChange}
                selectedRubrics={selectedRubrics}
                selectedRemedy={selectedRemedy}
                accumulatedActiveSeconds={elapsedSeconds}
                selectedRemedyName={selectedRemedy?.remedyName}
                isAnalysisStale={Boolean(selectedRemedy && selectedRemedy.analysisSnapshotHash !== analysisSnapshotHash)}
                onConsultationCompleted={(newOutcome, newRecordVersion) => {
                  setStatus("completed");
                  setOutcome(newOutcome);
                  setRecordVersion(newRecordVersion);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
