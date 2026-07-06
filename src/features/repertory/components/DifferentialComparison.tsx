import React from 'react';
import { Columns } from 'lucide-react';
import { DifferentialComparisonResult } from '../types';

interface DifferentialComparisonProps {
  comparisons: DifferentialComparisonResult[];
}

export const DifferentialComparison: React.FC<DifferentialComparisonProps> = ({ comparisons }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Columns className="w-4 h-4 text-emerald-500" />
          Remedy Differential Analysis
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-250/30 font-mono">
          Decision Support
        </span>
      </div>

      {comparisons.length === 0 ? (
        <p className="text-xs text-slate-400 font-semibold italic text-center py-4">
          Select at least two rubrics mapping to multiple remedies to see differential comparison.
        </p>
      ) : (
        <div className="space-y-6 max-h-[450px] overflow-y-auto pr-1">
          {comparisons.map((c, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                  {c.remedyA} vs {c.remedyB}
                </span>
                <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Gap: {c.confidenceGap}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Shared Active Rubrics:</div>
                {c.sharedRubrics.length === 0 ? (
                  <p className="text-[9px] text-slate-400 italic">None</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {c.sharedRubrics.map((r, rIdx) => (
                      <span key={rIdx} className="text-[9px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Unique to {c.remedyA}:</div>
                  {c.uniqueToA.length === 0 ? (
                    <p className="text-[9px] text-slate-400 italic">None</p>
                  ) : (
                    <ul className="list-disc list-inside text-[9px] text-slate-600 font-semibold space-y-1">
                      {c.uniqueToA.map((r, rIdx) => <li key={rIdx}>{r}</li>)}
                    </ul>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Unique to {c.remedyB}:</div>
                  {c.uniqueToB.length === 0 ? (
                    <p className="text-[9px] text-slate-400 italic">None</p>
                  ) : (
                    <ul className="list-disc list-inside text-[9px] text-slate-600 font-semibold space-y-1">
                      {c.uniqueToB.map((r, rIdx) => <li key={rIdx}>{r}</li>)}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/50">
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-rose-500/80 uppercase tracking-wide">Missing confirmation ({c.remedyA}):</div>
                  {c.missingConfirmationA.length === 0 ? (
                    <p className="text-[9px] text-slate-400 italic">None</p>
                  ) : (
                    <ul className="list-disc list-inside text-[9px] text-slate-500 font-semibold space-y-1">
                      {c.missingConfirmationA.map((r, rIdx) => <li key={rIdx}>{r}</li>)}
                    </ul>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-rose-500/80 uppercase tracking-wide">Missing confirmation ({c.remedyB}):</div>
                  {c.missingConfirmationB.length === 0 ? (
                    <p className="text-[9px] text-slate-400 italic">None</p>
                  ) : (
                    <ul className="list-disc list-inside text-[9px] text-slate-500 font-semibold space-y-1">
                      {c.missingConfirmationB.map((r, rIdx) => <li key={rIdx}>{r}</li>)}
                    </ul>
                  )}
                </div>
              </div>

              {/* Strong Differentiators */}
              {c.strongDifferentiators && c.strongDifferentiators.length > 0 && (
                <div className="bg-amber-50/50 border border-amber-250/30 p-2.5 rounded-xl space-y-1">
                  <div className="text-[9px] font-black text-amber-800 uppercase tracking-wide">Key Differential Differentiators:</div>
                  <ul className="list-disc list-inside text-[9px] text-amber-700 font-bold space-y-0.5 pl-1 text-left">
                    {c.strongDifferentiators.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                  </ul>
                </div>
              )}

              {/* Rationale Comparison */}
              {(c.whyAInsteadOfB || c.whyBInsteadOfA) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {c.whyAInsteadOfB && (
                    <div className="bg-slate-100/50 p-2.5 rounded-xl border border-slate-200/40 text-left">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Indications for {c.remedyA}:</span>
                      <p className="text-[9.5px] text-slate-700 font-semibold leading-relaxed">{c.whyAInsteadOfB}</p>
                    </div>
                  )}
                  {c.whyBInsteadOfA && (
                    <div className="bg-slate-100/50 p-2.5 rounded-xl border border-slate-200/40 text-left">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Indications for {c.remedyB}:</span>
                      <p className="text-[9.5px] text-slate-700 font-semibold leading-relaxed">{c.whyBInsteadOfA}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/50 space-y-2">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Differentiating Considerations:</div>
                <ul className="list-disc list-inside text-[9px] text-slate-600 font-semibold space-y-1">
                  {c.differentiatingQuestions.map((q, qIdx) => <li key={qIdx} className="text-emerald-700">{q}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
