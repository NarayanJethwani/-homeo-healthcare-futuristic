"use client";

import { useState } from "react";
import { MessageSquarePlus, Send } from "lucide-react";
import { V2ClinicalFeedbackDecision, V2ClinicalFeedbackPayload } from "../liveMode";

const FEEDBACK_OPTIONS: Array<{ decision: V2ClinicalFeedbackDecision; label: string }> = [
  { decision: "v2_better", label: "V2 better" },
  { decision: "v1_better", label: "V1 better" },
  { decision: "both_acceptable", label: "Both acceptable" },
  { decision: "v2_missed_important_rubric", label: "V2 missed important rubric" },
  { decision: "v2_found_useful_rubric", label: "V2 found useful rubric" },
  { decision: "needs_correction", label: "Needs correction" },
  { decision: "clinical_note", label: "Add clinical note" },
];

interface V2ClinicalFeedbackPanelProps {
  payloadBase: Omit<V2ClinicalFeedbackPayload, "decision" | "note">;
}

export function V2ClinicalFeedbackPanel({ payloadBase }: V2ClinicalFeedbackPanelProps) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string>("");
  const [savingDecision, setSavingDecision] = useState<V2ClinicalFeedbackDecision | null>(null);

  const saveFeedback = async (decision: V2ClinicalFeedbackDecision) => {
    setSavingDecision(decision);
    setStatus("");
    try {
      const response = await fetch("/api/repertory/v2-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payloadBase,
          decision,
          note: note.trim() || undefined,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.message || "Feedback was not saved.");
      setStatus("Feedback saved to v2ClinicalFeedback.");
      setNote("");
    } catch (error: any) {
      setStatus(error?.message || "Feedback could not be saved.");
    } finally {
      setSavingDecision(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-600">
        <MessageSquarePlus className="h-3.5 w-3.5" />
        Clinical Feedback
      </div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Optional clinical note..."
        className="mb-2 min-h-16 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400"
      />
      <div className="flex flex-wrap gap-2">
        {FEEDBACK_OPTIONS.map((option) => (
          <button
            key={option.decision}
            type="button"
            onClick={() => saveFeedback(option.decision)}
            disabled={savingDecision !== null}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-600 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-3 w-3" />
            {savingDecision === option.decision ? "Saving..." : option.label}
          </button>
        ))}
      </div>
      {status && <p className="mt-2 text-[10px] font-bold text-slate-500">{status}</p>}
    </div>
  );
}
