import React from 'react';
import { BarChart3 } from 'lucide-react';
import { EvidenceBreakdown } from '../types';

interface ConfidenceBreakdownPanelProps {
  evidenceBreakdown: EvidenceBreakdown;
  remedyId: string;
}

export const ConfidenceBreakdownPanel: React.FC<ConfidenceBreakdownPanelProps> = ({ evidenceBreakdown, remedyId }) => {
  const scores = evidenceBreakdown.remedyScores[remedyId];

  if (!scores) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
        <p className="text-xs text-slate-400 italic">No score breakdown available for this remedy.</p>
      </div>
    );
  }

  const items = [
    { label: 'Mental Generals & State', value: scores.mental, color: 'bg-indigo-500' },
    { label: 'Physical Generals & Particulars', value: scores.physical, color: 'bg-emerald-500' },
    { label: 'Modalities / Aggravation / Amelioration', value: scores.modalities, color: 'bg-blue-500' },
    { label: 'Thermal Affinities', value: scores.thermals, color: 'bg-amber-500' },
    { label: 'Miasmatic Load Match', value: scores.miasm, color: 'bg-purple-500' },
    { label: 'Clinical Experience Weighting', value: scores.clinicalWeight, color: 'bg-rose-500' }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          Evidence & Score Breakdown
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-mono">
          For clinician review only
        </span>
      </div>

      <div className="text-[10px] text-amber-700/85 font-semibold bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl">
        ⚠️ Clinical reasoning support for clinician review only. Do not prescribe automatically.
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
            Metric Breakdown for {remedyId}
          </span>
          <span className="text-xs font-black text-slate-900">Total: {scores.total}</span>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const pct = scores.total > 0 ? Math.min(100, Math.round((item.value / scores.total) * 100)) : 0;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[9px] font-semibold text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.value} points ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
