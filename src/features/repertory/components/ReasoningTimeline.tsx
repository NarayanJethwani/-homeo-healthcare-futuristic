import React from 'react';
import { GitCommit, ShieldAlert, ArrowRight, Activity, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LongitudinalCaseSummary } from '../clinicalWorkspace/longitudinalTypes';

interface ReasoningTimelineProps {
  summary: LongitudinalCaseSummary | null;
}

export const ReasoningTimeline: React.FC<ReasoningTimelineProps> = ({ summary }) => {
  if (!summary || summary.timeline.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-8 text-center space-y-3">
        <GitCommit className="w-8 h-8 text-slate-350 mx-auto animate-pulse" />
        <p className="text-[11px] text-slate-500 font-bold">No historical patient visits loaded for longitudinal tracking.</p>
        <p className="text-[9.5px] text-slate-400">Initialize a mock case or patient profile to see clinical evolution intelligence.</p>
      </div>
    );
  }

  // Curate color based on response trend
  let trendColor = 'bg-slate-50 text-slate-700 border-slate-200';
  if (summary.responseTrend === 'improving') {
    trendColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (summary.responseTrend === 'regressing') {
    trendColor = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (summary.responseTrend === 'suppressed') {
    trendColor = 'bg-red-50 text-red-800 border-red-200 animate-pulse';
  }

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-5 shadow-xs text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-emerald-500 animate-pulse" />
          Longitudinal Case History & Evolution
        </h3>
        <span className={`text-[9px] font-black uppercase tracking-wide border px-2.5 py-0.5 rounded-full ${trendColor}`}>
          Evolution Trend: {summary.responseTrend}
        </span>
      </div>

      {/* Suppression Warnings */}
      {summary.suppressionWarnings && summary.suppressionWarnings.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/50 p-4 rounded-2xl space-y-2">
          <span className="text-[10px] font-black text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" /> Systemic Suppression Warned
          </span>
          <p className="text-[9.5px] text-rose-700 font-bold leading-relaxed pl-1">
            {summary.suppressionWarnings[0]}
          </p>
        </div>
      )}

      {/* Relapses & Unexpected Shifts */}
      {(summary.relapseIndicators?.length || 0) + (summary.unexpectedFindings?.length || 0) > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {summary.relapseIndicators && summary.relapseIndicators.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/50 p-3 rounded-2xl space-y-1">
              <span className="text-[9px] font-black text-amber-800 uppercase tracking-wide flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Relapse Indicator
              </span>
              <ul className="list-disc list-inside text-[8.5px] text-amber-700 font-bold space-y-0.5 pl-0.5">
                {summary.relapseIndicators.map((val, idx) => <li key={idx}>{val}</li>)}
              </ul>
            </div>
          )}
          {summary.unexpectedFindings && summary.unexpectedFindings.length > 0 && (
            <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-2xl space-y-1">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-slate-500" /> Unexpected Shifts
              </span>
              <ul className="list-disc list-inside text-[8.5px] text-slate-600 font-semibold space-y-0.5 pl-0.5">
                {summary.unexpectedFindings.map((val, idx) => <li key={idx}>{val}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Confidence Evolution Timeline Steps */}
      <div className="space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Case Certainty Evolution
        </span>
        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
          <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 scrollbar-none">
            {summary.confidenceHistory.map((item, index) => (
              <React.Fragment key={item.visitId}>
                <div className="flex flex-col items-center space-y-1 min-w-[70px]">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Visit {index + 1}</span>
                  <span className="text-[10px] font-bold text-slate-800 font-mono">{item.scoringConfidence}%</span>
                  <span className="text-[7.5px] text-slate-500 font-bold">{new Date(item.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                </div>
                {index < summary.confidenceHistory.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 border-t border-slate-200/60 pt-2 flex items-center justify-between text-[9px] font-bold text-slate-700">
            <span>Case Resolution Stability:</span>
            <span className="text-emerald-600 font-black uppercase tracking-wide">
              {summary.responseTrend === 'improving' ? 'Increasing Confidence / High Stability' : 'Stable Adjustment Required'}
            </span>
          </div>
        </div>
      </div>

      {/* Chronological Visit Ledger */}
      <div className="space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Historical Visit Ledger</span>
        <div className="space-y-3 relative pl-4 border-l border-slate-200 ml-2 pt-1">
          {summary.timeline.map((visit, idx) => (
            <div key={visit.visitId} className="relative space-y-1 text-left">
              <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs ${visit.prescribedRemedyId ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-800">
                  Visit {idx + 1}: {new Date(visit.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                {visit.prescribedRemedyId && (
                  <span className="text-[8.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg font-mono">
                    Rx: {visit.prescribedRemedyId} {visit.potency} ({visit.dosage})
                  </span>
                )}
              </div>
              <div className="text-[8.5px] text-slate-500 font-semibold pl-1 leading-relaxed">
                <span className="font-bold text-slate-600 block">Clinician Notes: {visit.notes}</span>
                <span className="font-medium">Amelioration Index: </span>
                <span className={`font-bold ${visit.generalAmeliorationRating >= 2 ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {visit.generalAmeliorationRating > 0 ? `+${visit.generalAmeliorationRating}` : visit.generalAmeliorationRating} / +5 rating
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Symptom Intensity Progression Table */}
      <div className="space-y-2 pt-2 border-t border-slate-200/50">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide">Symptom Intensity Evolution</span>
        <div className="overflow-x-auto rounded-2xl border border-slate-150 bg-slate-50/20">
          <table className="w-full text-[9px] text-slate-650 font-semibold border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-250 bg-slate-50 text-slate-450 uppercase text-[8px] tracking-wider font-bold">
                <th className="py-2 pl-3">Symptom Rubric</th>
                <th className="py-2 px-3">Intensity Progression</th>
                <th className="py-2 pr-3 text-right">Evolution Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.symptomTrends.map((trend, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 bg-white">
                  <td className="py-2.5 pl-3 font-medium text-slate-700">{trend.rubricTitle}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-650 flex items-center gap-1">
                    {trend.intensityHistory.map((h, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-[8.5px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                          {h.intensity}
                        </span>
                        {idx < trend.intensityHistory.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-slate-350 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className={`inline-block font-bold text-[8.5px] px-2 py-0.5 rounded-full border capitalize ${
                      trend.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      trend.status === 'improving' ? 'bg-emerald-50/60 text-emerald-800 border-emerald-150' :
                      trend.status === 'aggravated' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      'bg-slate-50 text-slate-650 border-slate-200'
                    }`}>
                      {trend.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-emerald-50/60 border border-emerald-100/50 p-3 rounded-2xl text-[9px] text-emerald-800 font-semibold text-center flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        Hering's Law Check: Healing proceeds from within outward, from above downward, and in reverse order of appearance of symptoms.
      </div>
    </div>
  );
};
