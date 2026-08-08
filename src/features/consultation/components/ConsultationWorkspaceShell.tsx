"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Brain, CheckCircle, Clock, FileText,
  Save, Video, Mic, Pill, User, RefreshCw
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
  const [prescriptionRemedy, setPrescriptionRemedy] = useState<string>("");

  // Concurrency & Revision State
  const [recordVersion, setRecordVersion] = useState<number>(
    initialIntake?.recordVersion || 1
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    initialIntake?.provenance?.updatedAt || new Date().toISOString()
  );

  // Timer State (Server-validated accumulated seconds + live elapsed timer)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    initialIntake?.accumulatedActiveSeconds || 0
  );

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
    setSaveStatus("saving");
    try {
      await new Promise(r => setTimeout(r, 400));
      setRecordVersion(v => v + 1);
      setSaveStatus("saved");
      setLastSavedAt(new Date().toLocaleTimeString());
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err) {
      setSaveStatus("error");
    }
  };

  // Guarded Completion Command
  const handleCompleteConsultation = () => {
    if (!outcome) {
      alert("Please select an explicit Consultation Outcome before completing.");
      return;
    }
    if (!isValidLifecycleTransition(status, "completed")) {
      alert("Consultation cannot be completed from current status.");
      return;
    }

    if (confirm(`Finalize consultation with outcome: "${outcome.replace('_', ' ').toUpperCase()}"?`)) {
      handleTransition("completed");
      handleSaveDraft();
    }
  };

  // Ergonomic Workspace Layout Modes
  const [layoutMode, setLayoutMode] = useState<"balanced" | "case_taking" | "repertory_focus">("balanced");
  const [isTelemedicineCollapsed, setIsTelemedicineCollapsed] = useState<boolean>(false);
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
                  ? "bg-purple-600 text-white shadow-sm"
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

        {/* Right Actions (Outcome + Guarded Completion) */}
        <div className="flex items-center space-x-2 shrink-0">
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as ConsultationOutcome)}
            className="text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-teal-500"
          >
            <option value="">-- Select Outcome --</option>
            <option value="prescription_issued">Prescription Issued</option>
            <option value="no_prescription">No Prescription Required</option>
            <option value="follow_up_required">Follow-Up Required</option>
            <option value="referred">Referred Specialist</option>
          </select>

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

          <button
            onClick={handleCompleteConsultation}
            disabled={status === "completed"}
            className="flex items-center space-x-1.5 text-xs px-3.5 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{status === "completed" ? "Completed" : "End Consultation"}</span>
          </button>
        </div>
      </header>

      {/* 2. Adaptive Ergonomic Workspace Grid */}
      <main className="flex-1 flex flex-col lg:flex-row gap-3 p-3 min-h-0 overflow-hidden bg-slate-950">
        
        {/* Panel 1: Telemedicine Console (Collapsible / Compact) */}
        <div
          className={`transition-all duration-300 flex flex-col min-h-0 overflow-hidden ${
            isTelemedicineCollapsed
              ? "lg:w-14 shrink-0"
              : layoutMode === "case_taking" || layoutMode === "repertory_focus"
              ? "lg:w-56 shrink-0"
              : "lg:w-64 xl:w-72 shrink-0"
          }`}
        >
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-b-0 border-slate-800 rounded-t-xl text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              {!isTelemedicineCollapsed ? "Telemedicine & Video" : "Media"}
            </span>
            <button
              onClick={() => setIsTelemedicineCollapsed(!isTelemedicineCollapsed)}
              className="hover:text-teal-400 transition-colors p-0.5 rounded"
              title={isTelemedicineCollapsed ? "Expand Video Panel" : "Collapse Video Panel"}
            >
              {isTelemedicineCollapsed ? "▶" : "◀"}
            </button>
          </div>

          {!isTelemedicineCollapsed ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <TelemedicinePanel
                patientId={patientId}
                consultationId={initialIntake?.id || "consultation_draft"}
                startedAt={initialIntake?.startedAt}
                pausedAt={initialIntake?.pausedAt}
                isPaused={status === "paused"}
                isCompleted={status === "completed"}
                consent={{ status: "granted", recordedAt: new Date().toISOString(), recordedBy: "patient_portal" }}
                currentNotes={notes}
                onNotesUpdated={setNotes}
              />
            </div>
          ) : (
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-b-xl flex flex-col items-center py-4 space-y-4 text-slate-400">
              <Video className="w-5 h-5 text-teal-400 animate-pulse" />
              <div className="writing-mode-vertical text-xs tracking-wider uppercase font-semibold text-slate-500">
                Telemedicine Active
              </div>
            </div>
          )}
        </div>

        {/* Panel 2: Structured Clinical Documentation */}
        <div
          className={`transition-all duration-300 flex flex-col min-h-0 overflow-hidden ${
            layoutMode === "case_taking"
              ? "lg:flex-[2.2]"
              : layoutMode === "repertory_focus"
              ? "lg:flex-[1]"
              : "lg:flex-[1.4]"
          }`}
        >
          <ClinicalNotesPanel
            notes={notes}
            onChange={setNotes}
            outcome={outcome || undefined}
            readOnly={status === "completed"}
          />
        </div>

        {/* Panel 3: AI Repertory Workbench & Remedy Analysis */}
        <div
          className={`transition-all duration-300 flex flex-col min-h-0 overflow-hidden ${
            layoutMode === "repertory_focus"
              ? "lg:flex-[2.5]"
              : layoutMode === "case_taking"
              ? "lg:flex-[1.2]"
              : "lg:flex-[1.6]"
          }`}
        >
          <RepertoryIntelligencePanel
            patientId={patientId}
            consultationId={initialIntake?.id || "consultation_draft"}
            chiefComplaints={notes.chiefComplaints.map((c) => c.complaint)}
            patientThermal={notes.thermalState === "hot" ? "warm" : notes.thermalState === "chilly" ? "chilly" : "ambithermal"}
            patientMiasm={notes.miasmaticExpression}
            onSelectRemedyForPrescription={(remedyId, remedyName) => {
              setPrescriptionRemedy(remedyName);
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
            <button
              onClick={() => setIsPrescriptionCollapsed(!isPrescriptionCollapsed)}
              className="hover:text-teal-400 transition-colors p-0.5 rounded"
              title={isPrescriptionCollapsed ? "Expand Prescription Panel" : "Collapse Prescription Panel"}
            >
              {isPrescriptionCollapsed ? "◀" : "▶"}
            </button>
          </div>

          {!isPrescriptionCollapsed ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <PrescriptionPanel
                patientId={patientId}
                consultationId={initialIntake?.id || "consultation_draft"}
                recordVersion={recordVersion}
                notes={notes}
                selectedRemedyName={prescriptionRemedy}
                onConsultationCompleted={(newOutcome, newRecordVersion) => {
                  setStatus("completed");
                  setOutcome(newOutcome);
                  setRecordVersion(newRecordVersion);
                }}
              />
            </div>
          ) : (
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-b-xl flex flex-col items-center py-4 space-y-4 text-slate-400">
              <Pill className="w-5 h-5 text-emerald-400" />
              <div className="writing-mode-vertical text-xs tracking-wider uppercase font-semibold text-slate-500">
                Prescription Draft
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
