import React from 'react';
import { Layers } from 'lucide-react';
import { ConfidenceBreakdown } from '../types';

interface RubricCoverageHeatmapProps {
  confidenceBreakdown: Record<string, ConfidenceBreakdown>;
  remedyId: string;
}

export const RubricCoverageHeatmap: React.FC<RubricCoverageHeatmapProps> = ({ confidenceBreakdown, remedyId }) => {
  const conf = confidenceBreakdown[remedyId];

  if (!conf) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
        <p className="text-xs text-slate-400 italic">No category coverage breakdown available.</p>
      </div>
    );
  }

  const items = [
    { name: 'Mental & Emotional Generals', pct: conf.mental, color: 'from-purple-500 to-indigo-500' },
    { name: 'Physical Particulars', pct: conf.physical, color: 'from-emerald-400 to-emerald-600' },
    { name: 'Modalities (Better / Worse)', pct: conf.modalities, color: 'from-blue-400 to-blue-600' },
    { name: 'Etiological Triggers / Causation', pct: conf.etiology, color: 'from-rose-400 to-rose-600' },
    { name: 'Thermal State & Cravings', pct: conf.thermals, color: 'from-amber-400 to-amber-600' }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          Symptom Coverage Heatmap
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-mono">
          For clinician review only
        </span>
      </div>

      <div className="text-[10px] text-amber-700/85 font-semibold bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl">
        ⚠️ Clinical reasoning support for clinician review only. Do not prescribe automatically.
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const filledBlocks = Math.round(item.pct / 10);
          const blocks = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks);

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-semibold text-slate-600">
                <span>{item.name}</span>
                <span>{item.pct}% Coverage</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tracking-wider text-emerald-600 font-black select-none">
                  {blocks}
                </span>
                <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`} 
                    style={{ width: `${item.pct}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
