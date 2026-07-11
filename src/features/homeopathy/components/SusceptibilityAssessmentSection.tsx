import React from "react";
import { SusceptibilityAssessment, SusceptibilityLevel } from "../domain/homeopathy.types";
import { Activity } from "lucide-react";

interface SusceptibilityAssessmentSectionProps {
  susceptibility: SusceptibilityAssessment;
  onChange: (updated: SusceptibilityAssessment) => void;
}

export function SusceptibilityAssessmentSection({
  susceptibility,
  onChange
}: SusceptibilityAssessmentSectionProps) {

  const handleUpdateLevel = (lvl: SusceptibilityLevel) => {
    onChange({
      ...susceptibility,
      level: lvl,
      assessedAt: new Date().toISOString()
    });
  };

  const handleUpdateRationale = (text: string) => {
    onChange({
      ...susceptibility,
      rationale: text,
      assessedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" /> Susceptibility & Vitality Assessment
        </h3>
        <p className="text-xs text-slate-500 mt-1">Determine the patient's susceptibility and vital response. High susceptibility suggests high-potency remedies; low suggests lower potency or structural blockages.</p>
      </div>

      <div className="bg-slate-900 border border-slate-850 p-5 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label htmlFor="sus-level-select" className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Susceptibility level</label>
            <p className="text-xs text-slate-500">Assess response rate, sensitivity to allergens, environmental weather changes, emotional impressionability.</p>
          </div>

          <select
            id="sus-level-select"
            value={susceptibility.level}
            onChange={e => handleUpdateLevel(e.target.value as SusceptibilityLevel)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-350 px-3 py-1.5 rounded focus:outline-none w-[180px] cursor-pointer"
          >
            <option value="not_assessed">Not Assessed</option>
            <option value="low">Low Susceptibility</option>
            <option value="moderate">Moderate Susceptibility</option>
            <option value="high">High Susceptibility</option>
          </select>
        </div>

        <div>
          <label htmlFor="sus-rationale-textarea" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Clinical Rationale & Observations</label>
          <textarea
            id="sus-rationale-textarea"
            rows={4}
            value={susceptibility.rationale || ""}
            onChange={e => handleUpdateRationale(e.target.value)}
            placeholder="Record observations, allergy history, reactions to foods, thermal tolerances, and pathogenetic triggers..."
            className="w-full bg-slate-950 border border-slate-850 rounded p-3 text-xs text-slate-205 focus:outline-none"
          />
        </div>

        <div className="text-[10px] text-slate-550 italic flex items-center justify-between">
          <span>Assessed by Practitioner ID: {susceptibility.assessedBy}</span>
          <span>Last modified: {new Date(susceptibility.assessedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
