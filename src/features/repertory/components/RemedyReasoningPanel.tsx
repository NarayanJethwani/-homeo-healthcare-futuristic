import React from 'react';
import { FileText, BookOpen, Layers, ShieldAlert, Activity } from 'lucide-react';
import { RemedyReasoning } from '../types';

interface RemedyReasoningPanelProps {
  reasoning: RemedyReasoning & {
    materiaMedicaSummary?: string;
    keynotes?: string[];
    modalities?: string[];
    mentals?: string[];
    physicalGenerals?: string[];
    relationships?: {
      complementary?: string[];
      followsWell?: string[];
      inimical?: string[];
    };
    clinicalConfirmations?: string[];
  };
}

export const RemedyReasoningPanel: React.FC<RemedyReasoningPanelProps> = ({ reasoning }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          Remedy Reasoning Analysis: {reasoning.remedyName}
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
          For clinician review only
        </span>
      </div>

      <div className="text-[10px] text-amber-700/85 font-semibold bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl">
        ⚠️ Clinical reasoning support for clinician review only. Do not prescribe automatically.
      </div>

      <div className="space-y-4">
        {/* Core Analysis Explanation */}
        <div className="space-y-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <Activity className="w-3 h-3 text-slate-400" /> Case Affinity Logic
          </span>
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl whitespace-pre-wrap text-[10px] font-semibold text-slate-700 leading-relaxed font-mono">
            {reasoning.explanation}
          </div>
        </div>

        {/* Materia Medica Summary */}
        {reasoning.materiaMedicaSummary && (
          <div className="space-y-1 pt-2 border-t border-slate-200/50">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-emerald-500" /> Materia Medica Summary
            </span>
            <p className="text-[10px] text-slate-700 font-semibold bg-emerald-50/20 border border-emerald-100/50 p-3 rounded-2xl leading-relaxed">
              {reasoning.materiaMedicaSummary}
            </p>
          </div>
        )}

        {/* Keynotes & Clinical Confirmations */}
        {reasoning.keynotes && reasoning.keynotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200/50">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Keynote Characteristics</span>
              <ul className="list-disc list-inside text-[9px] text-slate-700 font-semibold space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                {reasoning.keynotes.map((k, i) => <li key={i}>{k}</li>)}
              </ul>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Clinical Confirmations</span>
              {reasoning.clinicalConfirmations && reasoning.clinicalConfirmations.length > 0 ? (
                <ul className="list-disc list-inside text-[9px] text-emerald-700 font-bold space-y-1 bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100/30">
                  {reasoning.clinicalConfirmations.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              ) : (
                <p className="text-[9px] text-slate-400 italic">None</p>
              )}
            </div>
          </div>
        )}

        {/* Mentals & Physical Generals */}
        {reasoning.mentals && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200/50">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Mental Generals</span>
              <ul className="list-disc list-inside text-[9px] text-slate-600 font-semibold space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                {reasoning.mentals.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Physical Generals</span>
              <ul className="list-disc list-inside text-[9px] text-slate-600 font-semibold space-y-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                {reasoning.physicalGenerals?.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        )}

        {/* Modalities */}
        {reasoning.modalities && (
          <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Modalities</span>
            <ul className="list-disc list-inside text-[9px] text-indigo-700 font-bold space-y-1 bg-indigo-50/30 p-2.5 rounded-xl border border-indigo-100/30">
              {reasoning.modalities.map((mod, i) => <li key={i}>{mod}</li>)}
            </ul>
          </div>
        )}

        {/* Support Rubrics Analysis */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/50">
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

        {/* Missing Confirmations */}
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

        {/* Relationships */}
        {reasoning.relationships && (
          <div className="space-y-2 pt-2 border-t border-slate-200/50">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" /> Remedy Relationship Network
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Complementary</span>
                <div className="flex flex-wrap gap-1">
                  {reasoning.relationships.complementary?.map((name, i) => (
                    <span key={i} className="text-[8px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100">{name}</span>
                  )) || <span className="text-[8px] text-slate-400 italic">None</span>}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Follows Well</span>
                <div className="flex flex-wrap gap-1">
                  {reasoning.relationships.followsWell?.map((name, i) => (
                    <span key={i} className="text-[8px] font-bold bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded border border-blue-100">{name}</span>
                  )) || <span className="text-[8px] text-slate-400 italic">None</span>}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Inimical (Antagonist)</span>
                <div className="flex flex-wrap gap-1">
                  {reasoning.relationships.inimical?.map((name, i) => (
                    <span key={i} className="text-[8px] font-black bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded border border-rose-100 flex items-center gap-0.5">
                      <ShieldAlert className="w-2 h-2 text-rose-500" /> {name}
                    </span>
                  )) || <span className="text-[8px] text-slate-400 italic">None</span>}
                </div>
              </div>
            </div>
          </div>
        )}

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
