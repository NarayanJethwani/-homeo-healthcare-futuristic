import React from 'react';
import { AlertCircle } from 'lucide-react';
import { MissingInformationItem } from '../types';

interface MissingInformationCardProps {
  missingInfo: MissingInformationItem[];
}

export const MissingInformationCard: React.FC<MissingInformationCardProps> = ({ missingInfo }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-emerald-500 animate-pulse" />
          Missing Constitutional Information
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-mono">
          For clinician review only
        </span>
      </div>

      <div className="text-[10px] text-amber-700/85 font-semibold bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl">
        ⚠️ Clinical reasoning support for clinician review only. Do not prescribe automatically.
      </div>

      {missingInfo.length === 0 ? (
        <p className="text-xs text-slate-400 font-semibold italic text-center py-4">
          All key constitutional parameters have been addressed.
        </p>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {missingInfo.map((item, idx) => (
            <div 
              key={item.key || idx} 
              className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex items-start gap-3 hover:bg-slate-100/50 transition"
            >
              <div className="w-4 h-4 mt-0.5 border border-slate-350 rounded-md flex items-center justify-center bg-white text-slate-400 font-bold select-none text-[8px]">
                □
              </div>
              <div className="flex-grow min-w-0">
                <span className="text-[10px] font-black text-slate-800">{item.displayName}</span>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5">{item.clinicianPrompt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
