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

  // Auto initialize preview if allowed
  useEffect(() => {
    requestBothMedia();
  }, [requestBothMedia]);

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

  const hasConsent = consent.status === "granted";

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Top Console Header: Connection Truthfulness & Live Elapsed Timer */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 font-medium">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Provider Unconfigured (Local Preview Only)</span>
          </div>
        </div>

        {/* Live Elapsed Consultation Timer */}
        <div className="flex items-center space-x-2 font-mono text-slate-300 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isPaused ? `PAUSED (${formattedTime})` : formattedTime}</span>
        </div>
      </div>

      {/* Google Meet 2-Way Remote Call Launcher Bar */}
      <div className="px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-800/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex-shrink-0">
            Meet URL:
          </span>
          {isEditingMeetUrl ? (
            <input
              type="text"
              value={googleMeetUrl}
              onChange={(e) => setGoogleMeetUrl(e.target.value)}
              onBlur={() => setIsEditingMeetUrl(false)}
              className="flex-1 px-2.5 py-1 text-xs font-mono bg-slate-950 border border-emerald-500/50 rounded text-emerald-200 outline-none"
              placeholder="https://meet.google.com/xxx-yyyy-zzz"
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditingMeetUrl(true)}
              className="text-xs font-mono text-emerald-200/90 font-medium hover:underline cursor-pointer truncate max-w-[220px]"
              title="Click to edit Google Meet URL"
            >
              {googleMeetUrl}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGoogleMeetUrl("https://meet.google.com/new")}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
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
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Launch Google Meet</span>
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">
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
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              {state.localMedia.audioOnly ? (
                <Volume2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <VideoOff className="w-8 h-8 text-slate-600" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">
                {state.localMedia.audioOnly
                  ? "Audio-Only Mode Active"
                  : state.permissions.camera === "denied"
                  ? "Camera Permission Denied"
                  : state.error?.kind === "insecure_context_or_policy_block"
                  ? "Insecure Context Block"
                  : "Local Camera Off"}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs">
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
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur border border-slate-800 text-[11px]">
          {hasConsent ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Telemedicine & AI Consent Granted</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-medium">Consent Pending / Not Granted</span>
            </>
          )}
        </div>
      </div>

      {/* Accessible Media Control Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Mic Toggle */}
          <button
            onClick={toggleMicrophone}
            aria-label={state.localMedia.microphoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
            aria-pressed={state.localMedia.microphoneEnabled}
            className={`p-2.5 rounded-lg border transition-all ${
              state.localMedia.microphoneEnabled
                ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                : "bg-red-950/60 text-red-400 border-red-800/60 hover:bg-red-900/60"
            }`}
            title={state.localMedia.microphoneEnabled ? "Mute Mic" : "Unmute Mic"}
          >
            {state.localMedia.microphoneEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={toggleCamera}
            aria-label={state.localMedia.cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
            aria-pressed={state.localMedia.cameraEnabled}
            className={`p-2.5 rounded-lg border transition-all ${
              state.localMedia.cameraEnabled
                ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                : "bg-red-950/60 text-red-400 border-red-800/60 hover:bg-red-900/60"
            }`}
            title={state.localMedia.cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
          >
            {state.localMedia.cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          {/* Audio-Only Mode Toggle */}
          <button
            onClick={() => setAudioOnly(!state.localMedia.audioOnly)}
            aria-label={state.localMedia.audioOnly ? "Disable Audio-Only Mode" : "Enable Audio-Only Mode"}
            aria-pressed={state.localMedia.audioOnly}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
              state.localMedia.audioOnly
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            Audio-Only
          </button>
        </div>

        {/* Action Buttons: Device Settings & Transcript Review */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
            aria-label="Open Transcript Review Drawer"
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
              isTranscriptOpen
                ? "bg-teal-600 text-white border-teal-500 shadow-sm"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcript Review</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            aria-label="Open Device Settings"
            className={`p-2.5 rounded-lg border transition-all ${
              isSettingsOpen
                ? "bg-slate-800 text-slate-200 border-slate-700"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
            title="Device Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

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
