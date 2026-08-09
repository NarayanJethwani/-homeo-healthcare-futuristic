"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Pill,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Send,
  Printer,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  ConsultationOutcome,
  PrescriptionDraft,
  PotencyScale,
  PharmacyDispatchState,
} from "../types/prescription.types";
import { StructuredClinicalNotes } from "../types/clinical-notes.types";
import { evaluateGuardedCompletionReadiness } from "../utils/prescription-validation";
import type { SelectedRubric } from "../types/repertory-intelligence.types";
import type { ConsultationRemedySelection } from "../application/consultationWorkspace.types";

interface PrescriptionPanelProps {
  patientId: string;
  consultationId: string;
  recordVersion: number;
  notes: StructuredClinicalNotes;
  outcome: ConsultationOutcome | "";
  onOutcomeChange: (outcome: ConsultationOutcome | "") => void;
  initialDraft?: Partial<PrescriptionDraft>;
  onDraftChange?: (draft: Partial<PrescriptionDraft>) => void;
  selectedRubrics: SelectedRubric[];
  selectedRemedy: ConsultationRemedySelection | null;
  accumulatedActiveSeconds: number;
  selectedRemedyName?: string;
  isAnalysisStale?: boolean;
  onConsultationCompleted: (outcome: ConsultationOutcome, updatedRecordVersion: number) => void;
}

export function PrescriptionPanel({
  patientId,
  consultationId,
  recordVersion,
  notes,
  outcome,
  onOutcomeChange,
  initialDraft = {},
  onDraftChange,
  selectedRubrics,
  selectedRemedy,
  accumulatedActiveSeconds,
  selectedRemedyName = "",
  isAnalysisStale = false,
  onConsultationCompleted,
}: PrescriptionPanelProps) {
  // Prescription Form State
  const [remedyName, setRemedyName] = useState<string>(selectedRemedyName || initialDraft.selectedRemedyName || "");
  const [potencyScale, setPotencyScale] = useState<PotencyScale>(initialDraft.potency?.scale || "centesimal");
  const [potencyValue, setPotencyValue] = useState<string>(initialDraft.potency?.value || "");
  const [dose, setDose] = useState<string>(initialDraft.dose || "");
  const [repetition, setRepetition] = useState<string>(initialDraft.repetition || "");
  const [duration, setDuration] = useState<string>(initialDraft.duration || "");
  const [instructions, setInstructions] = useState<string>(initialDraft.instructions || "");
  const [dietaryAdvice, setDietaryAdvice] = useState<string>(initialDraft.dietaryAdvice || "");
  const [followUpInstructions, setFollowUpInstructions] = useState<string>(initialDraft.followUpInstructions || "");
  const [pharmacyNotes, setPharmacyNotes] = useState<string>(initialDraft.pharmacyNotes || "");

  // Server Operation States
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [finalizedDocumentId, setFinalizedDocumentId] = useState<string | null>(null);
  const [finalizedPrescriptionId, setFinalizedPrescriptionId] = useState<string | null>(null);

  // Draft Preview Drawer State
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Pharmacy Dispatch State
  const [dispatchState, setDispatchState] = useState<PharmacyDispatchState>({
    status: "not_requested",
    providerName: "Unconfigured Local Adapter",
  });

  // Sync remedy name when Panel 3 selection changes
  useEffect(() => {
    if (selectedRemedyName) {
      setRemedyName(selectedRemedyName);
    }
  }, [selectedRemedyName]);

  // Construct current draft object
  const currentDraft: Partial<PrescriptionDraft> = useMemo(
    () => ({
      consultationId,
      patientId,
      selectedRemedyId: selectedRemedy?.remedyId,
      selectedRemedyName: remedyName,
      sourceAnalysisSnapshotHash: selectedRemedy?.analysisSnapshotHash,
      potency: {
        scale: potencyScale,
        value: potencyValue,
        displayLabel: `${potencyValue} (${potencyScale.toUpperCase()})`,
      },
      dose,
      repetition,
      duration,
      instructions,
      dietaryAdvice,
      followUpInstructions,
      pharmacyNotes,
      revision: 1,
    }),
    [
      consultationId,
      patientId,
      selectedRemedy,
      remedyName,
      potencyScale,
      potencyValue,
      dose,
      repetition,
      duration,
      instructions,
      dietaryAdvice,
      followUpInstructions,
      pharmacyNotes,
    ]
  );

  useEffect(() => {
    onDraftChange?.(currentDraft);
  }, [currentDraft, onDraftChange]);

  // Evaluate Live Guarded Completion Readiness
  const readiness = useMemo(
    () =>
      evaluateGuardedCompletionReadiness({
        notes,
        outcome,
        prescriptionDraft: currentDraft,
        isAnalysisStale,
        isSaving: isSavingDraft,
        isCompleting,
      }),
    [notes, outcome, currentDraft, isAnalysisStale, isSavingDraft, isCompleting]
  );

  // Finalize Prescription & Generate Canonical PDF
  const handleFinalizePrescription = async () => {
    setIsSavingDraft(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/clinical/consultation/finalize-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          consultationId,
          prescriptionDraft: currentDraft,
          isAnalysisStale,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFinalizedDocumentId(data.documentRecord.id);
        setFinalizedPrescriptionId(data.prescription.id);
        setStatusMessage(`✅ Prescription Finalized! Canonical Document ID: ${data.documentRecord.id}`);
      } else {
        setStatusMessage(`❌ Finalization failed: ${data.error || "Server error"}`);
      }
    } catch {
      setStatusMessage("❌ Network error during prescription finalization.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Finalize Prescription & Complete Consultation Handler
  const handleCompleteConsultation = async () => {
    if (!readiness.ready || !outcome) return;

    setIsCompleting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/clinical/consultation/complete-consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          consultationId,
          idempotencyKey: `idemp_${Date.now()}`,
          recordVersion,
          outcome,
          notes,
          prescriptionDraft: outcome === "prescription_issued" ? currentDraft : undefined,
          selectedRubrics,
          selectedRemedy,
          accumulatedActiveSeconds,
          analysisSnapshotHash: selectedRemedy?.analysisSnapshotHash,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage(`✅ Consultation completed successfully! Record Version #${data.recordVersion}`);
        onConsultationCompleted(data.outcome, data.recordVersion);
      } else {
        setStatusMessage(`❌ Completion failed: ${data.error || "Server error"}`);
      }
    } catch {
      setStatusMessage("❌ Network failure during consultation completion.");
    } finally {
      setIsCompleting(false);
    }
  };

  // Decoupled Pharmacy Dispatch Handler
  const handleDispatchPharmacy = async () => {
    setIsDispatching(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/clinical/consultation/dispatch-pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescriptionId: finalizedPrescriptionId,
          consultationId,
          patientId,
          pharmacyNotes,
        }),
      });

      const data = await res.json();
      if (data.dispatchState) {
        setDispatchState(data.dispatchState);
      }
      setStatusMessage(`ℹ️ ${data.dispatchState?.errorMessage || "Pharmacy dispatch processed."}`);
    } catch {
      setStatusMessage("❌ Network failure during pharmacy dispatch request.");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative text-xs">
      {/* Console Header */}
      <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-emerald-400">
          <Pill className="w-4 h-4" />
          <h3 className="font-semibold text-slate-100 uppercase tracking-wider">
            Digital Prescription & Guarded Completion
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
              readiness.ready
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/60"
                : "bg-amber-950/60 text-amber-400 border-amber-800/60"
            }`}
          >
            {readiness.ready ? "Ready to Complete" : "Requirements Pending"}
          </span>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {statusMessage && (
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs">
            {statusMessage}
          </div>
        )}

        {/* Outcome Selector */}
        <div className="space-y-1.5">
          <label className="block text-slate-300 font-semibold text-xs uppercase tracking-wider">
            Consultation Outcome <span className="text-red-400">*</span>
          </label>
          <select
            value={outcome}
            onChange={(e) => onOutcomeChange(e.target.value as ConsultationOutcome | "")}
            className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="">-- Select Outcome --</option>
            <option value="prescription_issued">Prescription Issued</option>
            <option value="no_prescription">No Prescription Required</option>
            <option value="follow_up_required">Follow-up Required Only</option>
            <option value="referred">Referred to Specialist / Hospital</option>
          </select>
        </div>

        {/* Prescription Fields (Only enabled when outcome === "prescription_issued") */}
        {outcome === "prescription_issued" && (
          <div className="space-y-3 p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            {/* Selected Remedy Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Selected Remedy</span>
                <span className="font-bold text-slate-100 text-sm">
                  {remedyName || "No remedy selected"}
                </span>
              </div>
              {isAnalysisStale && (
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 text-[10px] flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Stale Analysis</span>
                </span>
              )}
            </div>

            {/* Potency Scale & Value */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Potency Scale</label>
                <select
                  value={potencyScale}
                  onChange={(e) => setPotencyScale(e.target.value as PotencyScale)}
                  className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                >
                  <option value="centesimal">Centesimal (C)</option>
                  <option value="decimal">Decimal (X)</option>
                  <option value="lm">LM Potency (0/X)</option>
                  <option value="q">Mother Tincture (Q)</option>
                  <option value="custom">Custom Scale</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Potency Value</label>
                <input
                  type="text"
                  value={potencyValue}
                  onChange={(e) => setPotencyValue(e.target.value)}
                  placeholder="e.g. 30C, 200C, 1M, 6X"
                  className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                />
              </div>
            </div>

            {/* Dose & Repetition */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Dose</label>
                <input
                  type="text"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder="e.g. 4 pills, 5 drops"
                  className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Repetition</label>
                <input
                  type="text"
                  value={repetition}
                  onChange={(e) => setRepetition(e.target.value)}
                  placeholder="e.g. Twice daily, Once at bedtime"
                  className="w-full p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200"
                />
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="text-slate-400 block mb-1">Prescription Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="Specific intake instructions..."
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-slate-200 resize-none"
              />
            </div>
          </div>
        )}

        {/* Dynamic Completion Readiness Summary Box */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-300 text-[11px] border-b border-slate-800 pb-1.5">
            <span>Guarded Completion Readiness Summary</span>
            {readiness.ready ? (
              <span className="text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            ) : (
              <span className="text-amber-400 flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Blocked</span>
              </span>
            )}
          </div>

          {!readiness.ready && (
            <ul className="space-y-1 text-[11px] text-amber-300/90 list-disc pl-4">
              {readiness.clinicalValidationErrors.map((err, i) => (
                <li key={`c_${i}`}>{err}</li>
              ))}
              {readiness.prescriptionValidationErrors.map((err, i) => (
                <li key={`p_${i}`}>{err}</li>
              ))}
              {readiness.staleRemedyAnalysis && (
                <li>Selected remedy analysis is stale. Reconfirm selection in Panel 3.</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Footer Controls: Draft Preview, Download Canonical PDF, Pharmacy Dispatch, & Guarded End Consultation */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 rounded-lg font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Draft Preview</span>
          </button>

          {finalizedDocumentId ? (
            <a
              href={`/api/admin/clinical/consultation/prescription-pdf?documentId=${finalizedDocumentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 rounded-lg font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Canonical PDF</span>
            </a>
          ) : (
            <button
              disabled={isSavingDraft || !readiness.ready || recordVersion === 0}
              onClick={handleFinalizePrescription}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 rounded-lg font-medium transition-colors disabled:opacity-40"
              title="Finalize prescription and generate canonical document"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{isSavingDraft ? "Finalizing..." : "Finalize Rx"}</span>
            </button>
          )}

          <button
            disabled={isDispatching || !finalizedPrescriptionId || dispatchState.providerName === "Unconfigured Local Adapter"}
            onClick={handleDispatchPharmacy}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 rounded-lg font-medium transition-colors disabled:opacity-50"
            title="Decoupled pharmacy dispatch adapter"
          >
            <Send className="w-3.5 h-3.5 text-purple-400" />
            <span>{isDispatching ? "Dispatching..." : "Dispatch Pharmacy"}</span>
          </button>
        </div>

        {/* Guarded End Consultation Button */}
        <button
          disabled={!readiness.ready || isCompleting}
          onClick={handleCompleteConsultation}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isCompleting ? "Completing..." : "Complete Consultation"}</span>
        </button>
      </div>

      {/* Draft Preview Drawer */}
      {isPreviewOpen && (
        <div className="absolute inset-x-0 bottom-16 top-12 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-4 shadow-2xl z-30 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Printer className="w-4 h-4 text-emerald-400" />
              <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">
                Draft Prescription Preview — Unfinalized
              </h4>
            </div>
            <button onClick={() => setIsPreviewOpen(false)} className="text-slate-500 hover:text-slate-300 text-xs">
              ✕ Close
            </button>
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-[11px] text-slate-300 space-y-3 overflow-y-auto">
            <div className="border-b border-slate-800 pb-2 text-center">
              <h5 className="font-bold text-slate-100 text-xs">HOMEO HEALTHCARE CLINICAL PORTAL</h5>
              <p className="text-slate-500 text-[10px]">Canonical Digital Prescription Document Draft</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>Patient ID: {patientId}</div>
              <div>Consultation ID: {consultationId}</div>
              <div>Outcome: {outcome || "Unselected"}</div>
              <div>Status: DRAFT PREVIEW</div>
            </div>

            {outcome === "prescription_issued" && (
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-300 text-xs">Rx: {remedyName}</div>
                <div>Potency: {potencyValue} ({potencyScale})</div>
                <div>Dose: {dose} | Repetition: {repetition}</div>
                <div>Duration: {duration}</div>
                <div>Instructions: {instructions}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
