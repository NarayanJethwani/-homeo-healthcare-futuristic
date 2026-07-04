import React from 'react';
import { FileText, BookOpen, Layers, ShieldAlert, Activity } from 'lucide-react';
import { RemedyReasoning, RemedyProvenance } from '../types';

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
      antidotes?: string[];
      acuteChronic?: string;
      family?: string;
    };
    clinicalConfirmations?: string[];
    coverageRatio?: string;
    rubricContributions?: Array<{ rubricId: string; rubricTitle: string; contribution: number; grade: number }>;
    contradictoryEvidence?: string[];
    provenance?: RemedyProvenance;
  };
  matchedPatterns?: Array<{
    patternName: string;
    matchPercentage: number;
    remedyId: string;
    missingIndicators: Array<{ rubricId: string; title: string }>;
  }>;
}

export const RemedyReasoningPanel: React.FC<RemedyReasoningPanelProps> = ({ reasoning, matchedPatterns }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          Remedy Reasoning Analysis: {reasoning.remedyName}
        </h3>
        <div className="flex items-center gap-1.5">
          {reasoning.coverageRatio && (
            <span className="text-[9px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full font-mono">
              Coverage: {reasoning.coverageRatio}
            </span>
          )}
          <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100 font-mono">
            Score: {reasoning.confidence}%
          </span>
        </div>
      </div>

      <div className="text-[10px] text-amber-700/85 font-semibold bg-amber-50/60 border border-amber-200/50 p-3 rounded-2xl">
        ⚠️ Clinical reasoning support for clinician review only. Do not prescribe automatically.
      </div>

      {/* Contradictory Evidence Section */}
      {reasoning.contradictoryEvidence && reasoning.contradictoryEvidence.length > 0 && (
        <div className="bg-rose-50/60 border border-rose-200/50 p-3.5 rounded-2xl space-y-1.5">
          <span className="text-[9px] font-black text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Contradictory Evidence Detected
          </span>
          <ul className="list-disc list-inside text-[9px] text-rose-700 font-bold space-y-1 pl-1">
            {reasoning.contradictoryEvidence.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}

      {/* Pattern Recognition Section */}
      {matchedPatterns && matchedPatterns.filter(p => p.remedyId === reasoning.remedyId).map((pat, i) => (
        <div key={i} className="bg-amber-50/60 border border-amber-200/50 p-3.5 rounded-2xl space-y-1.5">
          <span className="text-[9px] font-black text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
            🔥 Clinical Pattern Match: {pat.patternName} ({pat.matchPercentage}% Overlap)
          </span>
          {pat.missingIndicators.length > 0 && (
            <div className="text-[9px] text-slate-700 font-semibold pl-1">
              <span className="text-amber-700 font-bold">Consider investigating missing indicators to confirm case selection:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {pat.missingIndicators.map((mi, miIdx) => (
                  <span key={miIdx} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg font-bold text-[8.5px]">
                    {mi.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

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

        {/* Rubric contributions table */}
        {reasoning.rubricContributions && reasoning.rubricContributions.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-200/50">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Rubric Score Contributions</span>
            <div className="overflow-x-auto rounded-2xl border border-slate-150 bg-slate-50/20">
              <table className="w-full text-[9px] text-slate-650 font-semibold border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-450 uppercase text-[8px] tracking-wider font-bold">
                    <th className="py-2 pl-3">Symptom Rubric</th>
                    <th className="py-2 px-3">Grade</th>
                    <th className="py-2 pr-3 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {reasoning.rubricContributions.map((c, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 bg-white">
                      <td className="py-2 pl-3 font-medium text-slate-700">{c.rubricTitle}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">Grade {c.grade}</td>
                      <td className="py-2 pr-3 text-right font-mono text-emerald-600 font-bold">+{c.contribution} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Follows Well / Antidotes</span>
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

        {/* Knowledge Provenance Tracing Section */}
        {reasoning.provenance && (
          <div className="space-y-1.5 pt-2.5 border-t border-slate-200/50 text-[8.5px] text-slate-500">
            <div className="flex items-center justify-between text-slate-450 font-black uppercase tracking-wider text-[8px] mb-1">
              <span>Knowledge Provenance Citation Registry</span>
              <span>Verification Status: {reasoning.provenance.editorialVerification}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left bg-slate-50 p-2.5 rounded-2xl border border-slate-150">
              <div>
                <span className="font-black block text-slate-500 uppercase text-[7.5px] tracking-wider mb-0.5">Repertory Source citation:</span>
                <span className="italic block font-mono text-[8px]">{reasoning.provenance.repertorySources.join(', ') || 'No active citations'}</span>
              </div>
              <div>
                <span className="font-black block text-slate-500 uppercase text-[7.5px] tracking-wider mb-0.5">Materia Medica citations:</span>
                <span className="italic block font-mono text-[8px]">{reasoning.provenance.materiaMedicaSources.join(', ') || 'No active citations'}</span>
              </div>
              {reasoning.provenance.graphRelationships.length > 0 && (
                <div className="col-span-1 md:col-span-2 border-t border-slate-100 pt-1.5">
                  <span className="font-black block text-slate-500 uppercase text-[7.5px] tracking-wider mb-0.5">Clinical Knowledge Graph Inference Trace:</span>
                  <span className="font-mono block text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 text-[7.5px]">
                    {reasoning.provenance.graphRelationships.join(' | ')}
                  </span>
                </div>
              )}
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
