import React, { useState } from "react";
import { TotalitySymptom, ReasoningEntry } from "../domain/homeopathy.types";
import { SymptomRecord } from "../../consultation/domain/consultation.types";
import { toTotalitySymptomId } from "../../../shared/domain/identifiers";
import { Heart, Plus, Check, ChevronDown, MessageSquare } from "lucide-react";

interface TotalityBuilderSectionProps {
  intakeSymptoms: SymptomRecord[];
  totalitySymptoms: TotalitySymptom[];
  actorId: string;
  onChange: (updated: TotalitySymptom[]) => void;
}

export function TotalityBuilderSection({
  intakeSymptoms,
  totalitySymptoms,
  actorId,
  onChange
}: TotalityBuilderSectionProps) {
  const [selectedClassification, setSelectedClassification] = useState<any>("common");
  const [selectedImportance, setSelectedImportance] = useState<1 | 2 | 3>(1);
  const [rationaleText, setRationaleText] = useState("");
  const [symptomNotes, setSymptomNotes] = useState("");

  const handleToggleSymptom = (s: SymptomRecord) => {
    const existingIdx = totalitySymptoms.findIndex(ts => ts.sourceSymptomId === s.id);
    const updated = [...totalitySymptoms];

    if (existingIdx >= 0) {
      updated.splice(existingIdx, 1);
    } else {
      const reasonEntry: ReasoningEntry = {
        authorId: actorId as any,
        timestamp: new Date().toISOString(),
        rationale: rationaleText.trim() || "Initial totality inclusion"
      };

      const newSymptom: TotalitySymptom = {
        id: toTotalitySymptomId(`ts_${Math.random().toString(36).substring(2, 11)}`),
        sourceSymptomId: s.id,
        sourceSnapshot: {
          patientWording: s.patientWording,
          normalizedName: s.normalizedName,
          location: s.location,
          sensation: s.sensation,
          aggravations: s.aggravations || [],
          ameliorations: s.ameliorations || [],
          concomitants: s.concomitants || [],
          causation: s.causation || []
        },
        primaryClassification: selectedClassification,
        secondaryTags: [],
        clinicalImportance: selectedImportance,
        reasoningHistory: [reasonEntry],
        selectedBy: actorId as any,
        selectedAt: new Date().toISOString()
      };
      updated.push(newSymptom);
      setRationaleText("");
    }
    onChange(updated);
  };

  const handleUpdateImportance = (symId: string, imp: 1 | 2 | 3) => {
    const updated = totalitySymptoms.map(ts => {
      if (ts.id === symId) {
        return { ...ts, clinicalImportance: imp };
      }
      return ts;
    });
    onChange(updated);
  };

  const handleUpdateClassification = (symId: string, cls: any) => {
    const updated = totalitySymptoms.map(ts => {
      if (ts.id === symId) {
        return { ...ts, primaryClassification: cls };
      }
      return ts;
    });
    onChange(updated);
  };

  const handleAddRationale = (symId: string, text: string) => {
    if (!text.trim()) return;
    const updated = totalitySymptoms.map(ts => {
      if (ts.id === symId) {
        const last = ts.reasoningHistory[ts.reasoningHistory.length - 1];
        const newEntry: ReasoningEntry = {
          authorId: actorId as any,
          timestamp: new Date().toISOString(),
          rationale: text.trim(),
          previousVersion: last ? last.rationale : undefined
        };
        return {
          ...ts,
          reasoningHistory: [...ts.reasoningHistory, newEntry]
        };
      }
      return ts;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-400" /> Totality Builder
        </h3>
        <p className="text-xs text-slate-500 mt-1">Select key intake symptoms and assign their primary classification weights and clinical importance rationales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source symptoms checklists */}
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Source Intake Symptoms</h4>
          {intakeSymptoms.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {intakeSymptoms.map(s => {
                const isSelected = totalitySymptoms.some(ts => ts.sourceSymptomId === s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleToggleSymptom(s)}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" 
                        : "bg-slate-900 border-slate-850 text-slate-350 hover:bg-slate-800"
                    }`}
                  >
                    <div>
                      <p>{s.normalizedName}</p>
                      <p className="text-[10px] text-slate-500 italic mt-0.5">"{s.patientWording}"</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-550 italic">No symptoms found in clinical intake.</p>
          )}
        </div>

        {/* Selected Totality Weighting Configuration */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Configure Selected Symptoms</h4>
          {totalitySymptoms.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {totalitySymptoms.map(s => {
                const lastReasoning = s.reasoningHistory[s.reasoningHistory.length - 1];
                return (
                  <div key={s.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-100">{s.sourceSnapshot.normalizedName}</p>
                        <p className="text-[9px] text-slate-500 italic">"{s.sourceSnapshot.patientWording}"</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Primary Class</label>
                        <select
                          value={s.primaryClassification}
                          onChange={e => handleUpdateClassification(s.id, e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300 px-2 py-1 rounded"
                        >
                          <option value="common">Common</option>
                          <option value="characteristic">Characteristic</option>
                          <option value="peculiar">Peculiar (SRP)</option>
                          <option value="strange_rare_peculiar">Strange & Rare</option>
                          <option value="keynote">Keynote</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Clinical Importance</label>
                        <select
                          value={s.clinicalImportance}
                          onChange={e => handleUpdateImportance(s.id, parseInt(e.target.value) as any)}
                          className="w-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300 px-2 py-1 rounded"
                        >
                          <option value={1}>1 - Supporting</option>
                          <option value={2}>2 - Important</option>
                          <option value={3}>3 - Decisive</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-slate-850/50 pt-2.5">
                      <p className="text-[10px] text-slate-450 font-bold flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        Rationale: <span className="text-slate-300 font-normal italic">"{lastReasoning?.rationale || 'None'}"</span>
                      </p>
                      
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Update rationale explanation..."
                          id={`rat-input-${s.id}`}
                          className="flex-1 bg-slate-950 border border-slate-850 rounded px-2.5 py-1 text-[10px] focus:outline-none"
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              const input = e.currentTarget;
                              handleAddRationale(s.id, input.value);
                              input.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-550 italic">Select symptoms from the left panel to begin Totality configuration.</p>
          )}
        </div>
      </div>
    </div>
  );
}
