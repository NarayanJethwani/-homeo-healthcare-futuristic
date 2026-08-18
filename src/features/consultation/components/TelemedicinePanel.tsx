"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Clock,
  FileText,
  AlertTriangle,
  Radio,
} from "lucide-react";
import { useTelemedicineSession } from "../hooks/useTelemedicineSession";
import { useConsultationElapsedTime } from "../hooks/useConsultationElapsedTime";
import { TranscriptionConsent } from "../types/telemedicine.types";
import { StructuredClinicalNotes } from "../types/clinical-notes.types";
import { ClinicalCareFeeSimulator, ClinicalCareSimulatorDecision } from "@/components/doctor/ClinicalCareFeeSimulator";

interface TelemedicinePanelProps {
  patientId: string;
  consultationId: string;
  startedAt?: string;
  pausedAt?: string;
  isPaused?: boolean;
  isCompleted?: boolean;
  consent?: TranscriptionConsent;
  currentNotes: StructuredClinicalNotes;
  onNotesUpdated: (notes: StructuredClinicalNotes) => void;
  onToggleExpandPlanner?: () => void;
  isPlannerExpanded?: boolean;
}

export function TelemedicinePanel({
  patientId,
  consultationId,
  startedAt,
  pausedAt,
  isPaused,
  isCompleted,
  consent = { status: "not_granted" },
  currentNotes,
  onNotesUpdated,
  onToggleExpandPlanner,
  isPlannerExpanded = false,
}: TelemedicinePanelProps) {
  const {
    state,
    attachVideoRef,
    requestBothMedia,
    toggleCamera,
    toggleMicrophone,
    setAudioOnly,
    switchCameraDevice,
    switchMicrophoneDevice,
  } = useTelemedicineSession({ initialConsent: consent });

  const { formattedTime } = useConsultationElapsedTime({
    startedAt,
    pausedAt,
    isPaused,
    isCompleted,
  });

  const [googleMeetUrl, setGoogleMeetUrl] = useState<string>(
    "https://meet.google.com/new"
  );
  const [isEditingMeetUrl, setIsEditingMeetUrl] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);
  const [appendStatusMessage, setAppendStatusMessage] = useState<string | null>(null);
  const [isAppending, setIsAppending] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"telemedicine" | "treatment_planner">("telemedicine");
  const [plannerSubTab, setPlannerSubTab] = useState<"fee_simulator" | "remedy_strategy" | "discussion_log">("fee_simulator");
  const [simulatorStatusMsg, setSimulatorStatusMsg] = useState<string | null>(null);
  const [newDiscussionNote, setNewDiscussionNote] = useState<string>("");
  const [discussionAuthor, setDiscussionAuthor] = useState<string>("Dr. Jethwani");

  // Auto initialize preview if allowed
  useEffect(() => {
    if (consent.status === "granted") {
      requestBothMedia();
    }
  }, [consent.status, requestBothMedia]);

  // Server-authoritative excerpt append handler
  const handleAppendExcerpt = async (excerptText: string, speaker?: "patient" | "clinician") => {
    if (!excerptText || !excerptText.trim()) return;

    setIsAppending(true);
    setAppendStatusMessage(null);

    try {
      const res = await fetch("/api/admin/clinical/consultation/append-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          consultationId,
          excerptText,
          speaker,
          consentStatus: consent.status,
          lifecycleStatus: isCompleted ? "completed" : isPaused ? "paused" : "active",
          currentNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onNotesUpdated(data.notes);
        setAppendStatusMessage(`✅ Appended excerpt to HPI & logged audit event (${data.auditEvent.id})`);
      } else {
        setAppendStatusMessage(`❌ Append failed: ${data.error || "Server error"}`);
      }
    } catch {
      setAppendStatusMessage("❌ Network failure during transcript append request.");
    } finally {
      setIsAppending(false);
    }
  };

  // Treatment Plan Updates Handler
  const handleUpdateTreatmentPlan = (field: string, value: any) => {
    const updatedPlan = {
      ...currentNotes.treatmentPlan,
      [field]: value,
    };
    onNotesUpdated({
      ...currentNotes,
      treatmentPlan: updatedPlan,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleApplySimulatorDecision = (decision: ClinicalCareSimulatorDecision) => {
    const updatedPlan = {
      ...currentNotes.treatmentPlan,
      savedFeeSimulatorDecision: decision,
    };
    onNotesUpdated({
      ...currentNotes,
      treatmentPlan: updatedPlan,
      updatedAt: new Date().toISOString(),
    });
    setSimulatorStatusMsg(`✅ Applied ${decision.recommendation.title} quotation (₹${decision.quote.finalTotal.toLocaleString("en-IN")}) to pending care plan!`);
  };

  const handleAddDiscussionNote = () => {
    if (!newDiscussionNote.trim()) return;
    const newEntry = {
      id: `disc_${Date.now()}`,
      author: discussionAuthor || "Clinician",
      noteText: newDiscussionNote.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const existingLogs = currentNotes.treatmentPlan?.caseDiscussionLogs || [];
    handleUpdateTreatmentPlan("caseDiscussionLogs", [newEntry, ...existingLogs]);
    setNewDiscussionNote("");
  };

  const hasConsent = consent.status === "granted";

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Top Console Header: Connection Truthfulness & Live Elapsed Timer */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/90 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 font-medium text-[11px]">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Provider Unconfigured</span>
          </div>
        </div>

        {/* Live Elapsed Consultation Timer */}
        <div className="flex items-center space-x-2 font-mono text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isPaused ? `PAUSED (${formattedTime})` : formattedTime}</span>
        </div>
      </div>

      {/* 2-Tab Switcher: Telemedicine vs Treatment Planner */}
      <div className="flex items-center justify-between bg-slate-950 border-b border-slate-800 px-3 py-1.5 gap-2">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            onClick={() => setActiveTab("telemedicine")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === "telemedicine"
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Telemedicine Video</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("treatment_planner");
              if (!isPlannerExpanded && onToggleExpandPlanner) {
                onToggleExpandPlanner();
              }
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === "treatment_planner"
                ? "bg-purple-600 text-white shadow-sm font-bold"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Treatment Planner</span>
            {currentNotes.treatmentPlan?.caseDiscussionLogs?.length ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 font-mono text-[10px] border border-purple-800">
                {currentNotes.treatmentPlan.caseDiscussionLogs.length}
              </span>
            ) : null}
          </button>
        </div>

        {onToggleExpandPlanner && (
          <button
            type="button"
            onClick={onToggleExpandPlanner}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              isPlannerExpanded
                ? "bg-purple-900/80 text-purple-200 border border-purple-500 shadow-md"
                : "bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-800/60"
            }`}
            title={isPlannerExpanded ? "Restore Standard Width" : "Expand Treatment Planner to Full Spacious Width"}
          >
            <span>{isPlannerExpanded ? " Standard Width" : "⤢ Expand Size"}</span>
          </button>
        )}
      </div>

      {activeTab === "telemedicine" ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {/* Google Meet 2-Way Remote Call Launcher Bar */}
          <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-800/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex-shrink-0">
                Meet URL:
              </span>
              {isEditingMeetUrl ? (
                <input
                  type="text"
                  value={googleMeetUrl}
                  onChange={(e) => setGoogleMeetUrl(e.target.value)}
                  onBlur={() => setIsEditingMeetUrl(false)}
                  className="flex-1 px-2 py-0.5 text-xs font-mono bg-slate-950 border border-emerald-500/50 rounded text-emerald-200 outline-none"
                  placeholder="https://meet.google.com/new"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditingMeetUrl(true)}
                  className="text-xs font-mono text-emerald-200/90 font-medium hover:underline cursor-pointer truncate max-w-[180px]"
                  title="Click to edit Google Meet URL"
                >
                  {googleMeetUrl}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setGoogleMeetUrl("https://meet.google.com/new")}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold transition-all cursor-pointer"
                title="Create instant Google Meet room"
              >
                + New Room
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = googleMeetUrl.startsWith("http") ? googleMeetUrl : `https://${googleMeetUrl}`;
                  window.open(target, "_blank");
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px] flex items-center gap-1 transition-all shadow-md cursor-pointer"
              >
                <Video className="w-3 h-3" />
                <span>Launch Meet</span>
              </button>
            </div>
          </div>

          {/* Video Viewport Container */}
          <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden min-h-0">
            {state.localMedia.cameraEnabled && !state.localMedia.audioOnly ? (
              <video
                ref={attachVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  {state.localMedia.audioOnly ? (
                    <Volume2 className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <VideoOff className="w-7 h-7 text-slate-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-slate-300">
                    {state.localMedia.audioOnly
                      ? "Audio-Only Mode Active"
                      : state.permissions.camera === "denied"
                      ? "Camera Permission Denied"
                      : state.error?.kind === "insecure_context_or_policy_block"
                      ? "Insecure Context Block"
                      : "Local Camera Off"}
                  </h3>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    {state.error
                      ? state.error.message
                      : state.localMedia.audioOnly
                      ? "Camera track stopped for privacy. Microphone remains active."
                      : "Click the camera button below to initialize local preview."}
                  </p>
                </div>
              </div>
            )}

            {/* Patient Consent Badge (Top-Right Overlay) */}
            <div className="absolute top-2 right-2 flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900/90 backdrop-blur border border-slate-800 text-[10px]">
              {hasConsent ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Consent Granted</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300 font-medium">Consent Pending</span>
                </>
              )}
            </div>
          </div>

          {/* Accessible Media Control Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-t border-slate-800 shrink-0">
            <div className="flex items-center space-x-1.5">
              {/* Mic Toggle */}
              <button
                onClick={toggleMicrophone}
                disabled={!hasConsent}
                aria-label={state.localMedia.microphoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
                aria-pressed={state.localMedia.microphoneEnabled}
                className={`p-2 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  state.localMedia.microphoneEnabled
                    ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                    : "bg-red-950/60 text-red-400 border-red-800/60 hover:bg-red-900/60"
                }`}
                title={state.localMedia.microphoneEnabled ? "Mute Mic" : "Unmute Mic"}
              >
                {state.localMedia.microphoneEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={toggleCamera}
                disabled={!hasConsent}
                aria-label={state.localMedia.cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
                aria-pressed={state.localMedia.cameraEnabled}
                className={`p-2 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  state.localMedia.cameraEnabled
                    ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                    : "bg-red-950/60 text-red-400 border-red-800/60 hover:bg-red-900/60"
                }`}
                title={state.localMedia.cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
              >
                {state.localMedia.cameraEnabled ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </button>

              {/* Audio-Only Mode Toggle */}
              <button
                onClick={() => setAudioOnly(!state.localMedia.audioOnly)}
                disabled={!hasConsent}
                aria-label={state.localMedia.audioOnly ? "Disable Audio-Only Mode" : "Enable Audio-Only Mode"}
                aria-pressed={state.localMedia.audioOnly}
                className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  state.localMedia.audioOnly
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                Audio-Only
              </button>
            </div>

            {/* Action Buttons: Device Settings & Transcript Review */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                aria-label="Open Transcript Review Drawer"
                className={`flex items-center space-x-1 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
                  isTranscriptOpen
                    ? "bg-teal-600 text-white border-teal-500 shadow-sm"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Transcript</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                aria-label="Open Audio/Video Device Settings"
                className="p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-all"
                title="Device Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Treatment Planner & Clinical Care Fee Simulator View */
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950 overflow-hidden text-xs">
          {/* Sub-tab Navigation */}
          <div className="flex items-center bg-slate-900 border-b border-slate-800 px-3 py-1.5 gap-1 shrink-0">
            <button
              onClick={() => setPlannerSubTab("fee_simulator")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                plannerSubTab === "fee_simulator"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              💰 Fee Simulator & Planner
            </button>
            <button
              onClick={() => setPlannerSubTab("remedy_strategy")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                plannerSubTab === "remedy_strategy"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📋 Remedy Strategy
            </button>
            <button
              onClick={() => setPlannerSubTab("discussion_log")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                plannerSubTab === "discussion_log"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              💬 Discussion Log
            </button>
          </div>

          {/* Sub-tab Content Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {simulatorStatusMsg && (
              <div className="p-2 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-between">
                <span>{simulatorStatusMsg}</span>
                <button
                  onClick={() => setSimulatorStatusMsg(null)}
                  className="text-emerald-400 hover:text-white text-xs ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {plannerSubTab === "fee_simulator" && (
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-2">
                <ClinicalCareFeeSimulator
                  patientId={patientId}
                  patientName={`Patient ${patientId}`}
                  onApply={handleApplySimulatorDecision}
                />
              </div>
            )}

            {plannerSubTab === "remedy_strategy" && (
              <div className="space-y-4">
                {/* Strategy Section */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2.5">
                  <h4 className="font-bold text-purple-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>📋 Case Strategy & Remedy Progression</span>
                  </h4>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-semibold">Primary Constitutional Plan</label>
                      <input
                        type="text"
                        value={currentNotes.treatmentPlan?.primaryRemedyStrategy || ""}
                        onChange={(e) => handleUpdateTreatmentPlan("primaryRemedyStrategy", e.target.value)}
                        placeholder="e.g. Sulphur 200C - Single dose, wait & observe 4 weeks"
                        className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:border-purple-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold">Intercurrent Strategy</label>
                        <input
                          type="text"
                          value={currentNotes.treatmentPlan?.intercurrentRemedyStrategy || ""}
                          onChange={(e) => handleUpdateTreatmentPlan("intercurrentRemedyStrategy", e.target.value)}
                          placeholder="e.g. Psorinum 1M intercurrent"
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:border-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase font-semibold">Potency Progression</label>
                        <input
                          type="text"
                          value={currentNotes.treatmentPlan?.potencyLadder || ""}
                          onChange={(e) => handleUpdateTreatmentPlan("potencyLadder", e.target.value)}
                          placeholder="e.g. 30C -> 200C -> 1M"
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:border-purple-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hering's Law Checklist Section */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-teal-300 uppercase tracking-wider text-[11px]">
                    ⚖️ Hering's Law of Cure Progress Checklist
                  </h4>
                  <div className="space-y-1.5 pt-1">
                    {[
                      { key: "aboveToDownward", label: "Symptoms moving from Above Downward" },
                      { key: "insideToOutward", label: "Symptoms moving from Inside Outward" },
                      { key: "reverseOrderOfAppearance", label: "Symptoms disappearing in Reverse Order of Appearance" },
                    ].map((item) => {
                      const isChecked = Boolean(
                        currentNotes.treatmentPlan?.heringsLawObserved?.[
                          item.key as keyof NonNullable<typeof currentNotes.treatmentPlan>["heringsLawObserved"]
                        ]
                      );
                      return (
                        <label
                          key={item.key}
                          className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const existingHL = currentNotes.treatmentPlan?.heringsLawObserved || {};
                              handleUpdateTreatmentPlan("heringsLawObserved", {
                                ...existingHL,
                                [item.key]: e.target.checked,
                              });
                            }}
                            className="rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500"
                          />
                          <span className="text-[11px]">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {plannerSubTab === "discussion_log" && (
              /* Case Updates & Discussion Log Section */
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span>💬 Case Discussion & Update Log</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">
                    {currentNotes.treatmentPlan?.caseDiscussionLogs?.length || 0} entries
                  </span>
                </h4>

                {/* Add New Entry Form */}
                <div className="space-y-1.5 pt-1">
                  <textarea
                    value={newDiscussionNote}
                    onChange={(e) => setNewDiscussionNote(e.target.value)}
                    placeholder="Type case discussion remark, senior doctor suggestion, or progress update..."
                    className="w-full h-16 p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-purple-500 outline-none resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={discussionAuthor}
                      onChange={(e) => setDiscussionAuthor(e.target.value)}
                      placeholder="Author"
                      className="w-32 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddDiscussionNote}
                      disabled={!newDiscussionNote.trim()}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-semibold text-[11px] transition-all disabled:opacity-40 cursor-pointer"
                    >
                      + Add Discussion Note
                    </button>
                  </div>
                </div>

                {/* Timeline of Logs */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  {currentNotes.treatmentPlan?.caseDiscussionLogs?.map((log) => (
                    <div key={log.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-purple-300">{log.author}</span>
                        <span className="font-mono text-slate-500">{log.createdAt}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{log.noteText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Device Selection Modal / Drawer */}
      {isSettingsOpen && (
        <div className="absolute inset-x-0 bottom-16 bg-slate-950/95 border-t border-slate-800 p-4 shadow-2xl z-20 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider">
              Media Device Selection
            </h4>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Camera Device</label>
              <select
                value={state.devices.selectedCameraId || ""}
                onChange={(e) => switchCameraDevice(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-slate-200"
              >
                {state.devices.cameras.map((cam) => (
                  <option key={cam.deviceId} value={cam.deviceId}>
                    {cam.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Microphone Device</label>
              <select
                value={state.devices.selectedMicrophoneId || ""}
                onChange={(e) => switchMicrophoneDevice(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-slate-200"
              >
                {state.devices.microphones.map((mic) => (
                  <option key={mic.deviceId} value={mic.deviceId}>
                    {mic.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Review Drawer */}
      {isTranscriptOpen && (
        <div className="absolute inset-x-0 bottom-16 top-12 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl z-20 flex flex-col space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-teal-400" />
              <h4 className="font-semibold text-slate-200 uppercase tracking-wider">
                Transcript Review & Clinician Authorization
              </h4>
            </div>
            <button
              onClick={() => setIsTranscriptOpen(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕ Close
            </button>
          </div>

          {appendStatusMessage && (
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
              {appendStatusMessage}
            </div>
          )}

          {!hasConsent ? (
            <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-amber-200">Patient Consent Required</h5>
                <p className="text-slate-400 text-[11px] mt-1">
                  Live transcription is disabled because patient telemedicine and AI processing consent status is not granted.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between space-y-3 overflow-hidden">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-center text-slate-400 space-y-2">
                <Radio className="w-6 h-6 text-slate-600 mx-auto" />
                <h5 className="font-semibold text-slate-300">Transcription Provider Not Configured</h5>
                <p className="text-slate-500 text-[11px]">
                  No live transcription provider adapter is connected to this workspace. Once configured, real-time interim and final transcript segments will appear here for clinician review.
                </p>
              </div>

              {/* Sample Clinician Test Excerpt Append Trigger (Demonstrates Server-Authoritative Flow) */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
                <label className="text-slate-400 font-medium block text-[11px]">
                  Manual Excerpt Authorization & Append Test
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id="manual-excerpt-input"
                    type="text"
                    placeholder="Enter transcript excerpt to append..."
                    className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                  />
                  <button
                    disabled={isAppending}
                    onClick={() => {
                      const input = document.getElementById("manual-excerpt-input") as HTMLInputElement;
                      if (input && input.value) {
                        handleAppendExcerpt(input.value, "patient");
                        input.value = "";
                      }
                    }}
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded font-medium text-xs transition-colors disabled:opacity-50"
                  >
                    {isAppending ? "Appending..." : "Append to Notes & Audit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
