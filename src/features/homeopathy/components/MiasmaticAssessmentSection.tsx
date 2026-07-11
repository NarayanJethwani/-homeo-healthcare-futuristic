import React from "react";
import { MiasmaticAssessmentItem, MiasmaticStrength, TotalitySymptom } from "../domain/homeopathy.types";
import { Shield, Sparkles } from "lucide-react";

interface MiasmaticAssessmentSectionProps {
  miasmaticProfile: MiasmaticAssessmentItem[];
  totalitySymptoms: TotalitySymptom[];
  onChange: (updated: MiasmaticAssessmentItem[]) => void;
}

export function MiasmaticAssessmentSection({
  miasmaticProfile,
  totalitySymptoms,
  onChange
}: MiasmaticAssessmentSectionProps) {

  const handleUpdateStrength = (miasmName: string, str: MiasmaticStrength) => {
    const updated = miasmaticProfile.map(m => {
      if (m.miasm === miasmName) {
        return { ...m, strength: str };
      }
      return m;
    });
    onChange(updated);
  };

  const handleUpdateRationale = (miasmName: string, text: string) => {
    const updated = miasmaticProfile.map(m => {
      if (m.miasm === miasmName) {
        return { ...m, rationale: text };
      }
      return m;
    });
    onChange(updated);
  };

  const handleToggleSymptom = (miasmName: string, symId: any) => {
    const updated = miasmaticProfile.map(m => {
      if (m.miasm === miasmName) {
        const currentSyms = m.supportingSymptomIds || [];
        const exists = currentSyms.includes(symId);
        return {
          ...m,
          supportingSymptomIds: exists 
            ? currentSyms.filter(id => id !== symId) 
            : [...currentSyms, symId]
        };
      }
      return m;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" /> Miasmatic Assessment Profile
        </h3>
        <p className="text-xs text-slate-500 mt-1">Classify the patient's pathological and structural load according to classical homeopathic miasms.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {miasmaticProfile.map(m => (
          <div key={m.miasm} className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" /> {m.miasm} Load
                </h4>
              </div>

              <div>
                <label htmlFor={`str-${m.miasm}`} className="sr-only">Select Strength</label>
                <select
                  id={`str-${m.miasm}`}
                  value={m.strength}
                  onChange={e => handleUpdateStrength(m.miasm, e.target.value as MiasmaticStrength)}
                  className="bg-slate-950 border border-slate-800 text-[10px] text-slate-300 px-3 py-1.5 rounded focus:outline-none"
                >
                  <option value="not_assessed">Not Assessed</option>
                  <option value="low">Low Intensity</option>
                  <option value="moderate">Moderate intensity</option>
                  <option value="high">High Intensity</option>
                  <option value="predominant">Predominant / Active Miasm</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Supporting Totality Symptoms</label>
                <div className="space-y-1 max-h-[100px] overflow-y-auto bg-slate-950 p-2.5 border border-slate-850 rounded">
                  {totalitySymptoms.map(ts => {
                    const isLinked = (m.supportingSymptomIds || []).includes(ts.sourceSymptomId);
                    return (
                      <button
                        key={ts.id}
                        type="button"
                        onClick={() => handleToggleSymptom(m.miasm, ts.sourceSymptomId)}
                        className={`w-full text-left text-[10px] px-2 py-0.5 rounded transition-all block ${
                          isLinked ? "bg-emerald-955 text-emerald-400 font-bold" : "text-slate-450 hover:bg-slate-900"
                        }`}
                      >
                        {ts.sourceSnapshot.normalizedName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor={`rat-${m.miasm}`} className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Miasmatic Rationale</label>
                <textarea
                  id={`rat-${m.miasm}`}
                  rows={3}
                  value={m.rationale || ""}
                  onChange={e => handleUpdateRationale(m.miasm, e.target.value)}
                  placeholder="Record pathogenetic reasonings, heredity links, or constitutional triggers..."
                  className="w-full bg-slate-950 border border-slate-850 rounded p-2.5 text-xs text-slate-205 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
