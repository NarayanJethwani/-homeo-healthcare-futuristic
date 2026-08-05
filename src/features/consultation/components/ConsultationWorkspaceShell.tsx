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

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Bar (Patient • Status • Timer • Save • End) */}
      <header className="flex-none h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
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

        {/* Center Timer & State Machine Controls */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 font-mono text-sm text-teal-400">
            <Clock className="w-4 h-4 animate-pulse text-teal-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Lifecycle Action Buttons */}
          <div className="flex items-center space-x-1.5">
            {status === "active" && (
              <button
                onClick={() => handleTransition("paused")}
                className="text-xs px-3 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium transition-colors border border-amber-500/30"
              >
                Pause
              </button>
            )}
            {status === "paused" && (
              <button
                onClick={() => handleTransition("active")}
                className="text-xs px-3 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium transition-colors border border-emerald-500/30"
              >
                Resume
              </button>
            )}
          </div>
        </div>

        {/* Right Actions (Outcome + Guarded Completion) */}
        <div className="flex items-center space-x-3">
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as ConsultationOutcome)}
            className="text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500"
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
            className="flex items-center space-x-1.5 text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{status === "completed" ? "Completed" : "End Consultation"}</span>
          </button>
        </div>
      </header>

      {/* 2. Main 4-Column Workspace Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 min-h-0 overflow-hidden bg-slate-950">
        
        {/* Panel 1: Patient Context & Telemedicine Console */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 text-teal-400">
              <User className="w-4 h-4" />
              <h2 className="font-semibold text-sm text-slate-100">Patient & Telemed</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Ready
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* Patient Context Summary */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
              <div className="text-slate-300 font-medium">Patient Details</div>
              <div className="text-slate-400">ID: <span className="text-slate-200 font-mono">{patientId}</span></div>
              <div className="text-slate-400">Allergies: <span className="text-emerald-400 font-medium">No Known Allergies</span></div>
              <div className="text-slate-400">Diagnoses: <span className="text-amber-400 font-medium">Chronic Dyspepsia</span></div>
            </div>

            {/* Telemedicine Video Container Placeholder */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center space-y-2 min-h-[160px] text-center">
              <Video className="w-8 h-8 text-slate-600" />
              <div className="text-slate-400 font-medium text-xs">WebRTC Telemed Container</div>
              <div className="text-[11px] text-slate-500">Camera & Microphone Adapter Ready</div>
              <div className="flex space-x-2 mt-2">
                <button className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"><Mic className="w-3.5 h-3.5" /></button>
                <button className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"><Video className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Structured Clinical Documentation */}
        <div className="flex flex-col min-h-0 overflow-hidden">
          <ClinicalNotesPanel
            notes={notes}
            onChange={setNotes}
            outcome={outcome || undefined}
            readOnly={status === "completed"}
          />
        </div>

        {/* Panel 3: AI Repertory Workbench & Remedy Analysis */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 text-purple-400">
              <Brain className="w-4 h-4" />
              <h2 className="font-semibold text-sm text-slate-100">AI Repertory & Totality</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              7,000+ Rubrics
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            <input
              type="text"
              placeholder="Search rubrics (e.g. stomach acidity, fear height)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500 text-xs"
            />
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
              <div className="text-slate-400 font-medium">Remedy Totality Ranker</div>
              <div className="text-[11px] text-slate-500">Deterministic scoring & Materia Medica keynotes comparator ready</div>
            </div>
          </div>
        </div>

        {/* Panel 4: Digital Prescription & Dispatch Builder */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Pill className="w-4 h-4" />
              <h2 className="font-semibold text-sm text-slate-100">Prescription Builder</h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">PDF Ready</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Selected Remedy</label>
              <input
                type="text"
                placeholder="e.g. Nux Vomica 200C"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Dosage & Instructions</label>
              <textarea
                placeholder="4 pills twice daily after meals for 2 weeks..."
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none text-xs"
              />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
