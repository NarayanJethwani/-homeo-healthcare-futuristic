import React from "react";

interface HistoryPresentIllnessSectionProps {
  historyPresentIllness: string;
  pastMedicalHistory: string;
  familyHistory: string;
  onChange: (fields: { historyPresentIllness?: string; pastMedicalHistory?: string; familyHistory?: string }) => void;
}

export function HistoryPresentIllnessSection({
  historyPresentIllness,
  pastMedicalHistory,
  familyHistory,
  onChange
}: HistoryPresentIllnessSectionProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100">Clinical Histories</h3>
        <p className="text-xs text-slate-500 mt-1">Record HPI details and long-term diagnostic narratives.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="hpi" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">
            History of Present Illness (HPI) <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="hpi"
            rows={4}
            value={historyPresentIllness}
            onChange={e => onChange({ historyPresentIllness: e.target.value })}
            placeholder="Describe origin, onset, progress, and previous treatments of the active complaint..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-650"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pmh" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Past Medical History</label>
            <textarea
              id="pmh"
              rows={4}
              value={pastMedicalHistory}
              onChange={e => onChange({ pastMedicalHistory: e.target.value })}
              placeholder="Childhood illnesses, surgeries, long-term suppressions, previous drug reactions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-650"
            />
          </div>
          <div>
            <label htmlFor="fh" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Family History & Inherited Miasms</label>
            <textarea
              id="fh"
              rows={4}
              value={familyHistory}
              onChange={e => onChange({ familyHistory: e.target.value })}
              placeholder="Tuberculosis, cancer, diabetes, asthma history in parents or siblings..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-650"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
