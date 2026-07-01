import React from 'react';
import { FileText } from 'lucide-react';
import { RemedyReasoning } from '../types';

interface RemedyReasoningPanelProps {
  reasoning: RemedyReasoning;
}

export const RemedyReasoningPanel: React.FC<RemedyReasoningPanelProps> = ({ reasoning }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          Remedy Reasoning Analysis
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-mono">
          For clinician review only
        </span>
      </div>

      <div className="text-[10px] text-amber-700/85 font-semibold bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl">
        ⚠️ Clinical reasoning support for clinician review only. Do not prescribe automatically.
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl whitespace-pre-wrap text-[10px] font-semibold text-slate-700 leading-relaxed font-mono">
          {reasoning.explanation}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">
              Strongest Supporting Rubrics:
            </span>
            {reasoning.strongestRubrics.length === 0 ? (
              <p className="text-[9px] text-slate-400 italic">None</p>
            ) : (
              <ul className="list-disc list-inside text-[9px] text-emerald-700 font-bold space-y-1">
                {reasoning.strongestRubrics.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            )}
          </div>
          
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">
              Weakest Mapped Rubrics:
            </span>
            {reasoning.weakestRubrics.length === 0 ? (
              <p className="text-[9px] text-slate-400 italic">None</p>
            ) : (
              <ul className="list-disc list-inside text-[9px] text-slate-500 font-semibold space-y-1">
                {reasoning.weakestRubrics.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">
            Missing Confirmations:
          </span>
          {reasoning.missingInformation.length === 0 ? (
            <p className="text-[9px] text-slate-400 italic">None</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {reasoning.missingInformation.map((c, i) => (
                <span 
                  key={i} 
                  className="text-[9px] font-bold bg-rose-50 text-rose-850 border border-rose-150 px-2 py-0.5 rounded-lg"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">
            Differential Considerations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {reasoning.differentialRemedies.map((name, i) => (
              <span 
                key={i} 
                className="text-[9px] font-bold bg-white text-slate-650 border border-slate-200 px-2 py-0.5 rounded-lg"
              >
                Differentiate from {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
