import React, { useState } from "react";
import { ConstitutionalAssessment, AssessmentConfidence } from "../domain/homeopathy.types";
import { Sparkles, Plus, X } from "lucide-react";

interface ConstitutionalAssessmentSectionProps {
  constitutional: ConstitutionalAssessment;
  onChange: (updated: ConstitutionalAssessment) => void;
}

export function ConstitutionalAssessmentSection({
  constitutional,
  onChange
}: ConstitutionalAssessmentSectionProps) {
  const [impressionInput, setImpressionInput] = useState("");

  const handleUpdateConfidence = (conf: AssessmentConfidence) => {
    onChange({ ...constitutional, confidence: conf });
  };

  const handleUpdateRationale = (text: string) => {
    onChange({ ...constitutional, rationale: text });
  };

  const handleAddImpression = (e: React.FormEvent) => {
    e.preventDefault();
    const val = impressionInput.trim();
    if (!val || constitutional.impressions.includes(val)) return;
    onChange({
      ...constitutional,
      impressions: [...constitutional.impressions, val]
    });
    setImpressionInput("");
  };

  const handleRemoveImpression = (val: string) => {
    onChange({
      ...constitutional,
      impressions: constitutional.impressions.filter(i => i !== val)
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-405" /> Constitutional Assessment
        </h3>
        <p className="text-xs text-slate-500 mt-1">Record constitutional remedy archetypes, impressions (e.g. "Sulphur type", "chilly", "introverted"), and overall confidence level.</p>
      </div>

      <div className="bg-slate-900 border border-slate-850 p-5 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label htmlFor="conf-level-select" className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Assessment Confidence</label>
            <p className="text-xs text-slate-500">How clear is the constitutional picture? (e.g. Calcarea Carb type expression vs. unclear mix)</p>
          </div>

          <select
            id="conf-level-select"
            value={constitutional.confidence}
            onChange={e => handleUpdateConfidence(e.target.value as AssessmentConfidence)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-350 px-3 py-1.5 rounded focus:outline-none w-[180px] cursor-pointer"
          >
            <option value="not_assessed">Not Assessed</option>
            <option value="low">Low Confidence</option>
            <option value="moderate">Moderate Confidence</option>
            <option value="high">High Confidence</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tag impressions */}
          <div className="space-y-3">
            <label className="block text-[10px] text-slate-400 font-bold uppercase">Constitutional Impressions / Types</label>
            <form onSubmit={handleAddImpression} className="flex gap-2">
              <input
                type="text"
                value={impressionInput}
                onChange={e => setImpressionInput(e.target.value)}
                placeholder="e.g. Chilly Calcarea Carb type..."
                className="flex-1 bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-950 border border-slate-850 text-slate-300 font-bold hover:bg-slate-800 rounded text-xs cursor-pointer flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {constitutional.impressions.length > 0 ? (
                constitutional.impressions.map(imp => (
                  <span
                    key={imp}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded bg-slate-955 border border-slate-800 text-slate-300"
                  >
                    {imp}
                    <button
                      type="button"
                      onClick={() => handleRemoveImpression(imp)}
                      className="text-slate-500 hover:text-rose-455 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-550 italic">No impressions recorded yet.</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="rat-const-textarea" className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">Constitutional Analysis Rationale</label>
            <textarea
              id="rat-const-textarea"
              rows={3}
              value={constitutional.rationale || ""}
              onChange={e => handleUpdateRationale(e.target.value)}
              placeholder="Record notes detailing patient's bodily habitus, temperament, weather preferences..."
              className="w-full bg-slate-950 border border-slate-850 rounded p-2.5 text-xs text-slate-205 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
