import React, { useState } from "react";
import { SymptomRecord } from "../domain/consultation.types";
import { toSymptomId } from "../../../shared/domain/identifiers";
import { Plus, Trash2, ShieldAlert } from "lucide-react";

interface ChiefComplaintSectionProps {
  symptoms: SymptomRecord[];
  onChange: (updated: SymptomRecord[]) => void;
}

export function ChiefComplaintSection({ symptoms, onChange }: ChiefComplaintSectionProps) {
  const [patientWording, setPatientWording] = useState("");
  const [normalizedName, setNormalizedName] = useState("");
  const [location, setLocation] = useState("");
  const [sensation, setSensation] = useState("");
  const [intensity, setIntensity] = useState<"mild" | "moderate" | "severe" | "extreme">("moderate");
  const [agg, setAgg] = useState("");
  const [amel, setAmel] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientWording.trim() || !normalizedName.trim()) return;

    const newSymptom: SymptomRecord = {
      id: toSymptomId(`sym_${Math.random().toString(36).substring(2, 11)}`),
      patientWording: patientWording.trim(),
      normalizedName: normalizedName.trim(),
      location: location.trim() || undefined,
      sensation: sensation.trim() || undefined,
      intensity,
      aggravations: agg.trim() ? [agg.trim()] : [],
      ameliorations: amel.trim() ? [amel.trim()] : [],
      concomitants: [],
      causation: [],
      isCharacteristic: false
    };

    onChange([...symptoms, newSymptom]);
    
    // Reset form
    setPatientWording("");
    setNormalizedName("");
    setLocation("");
    setSensation("");
    setAgg("");
    setAmel("");
  };

  const handleRemove = (id: string) => {
    onChange(symptoms.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100">Chief Complaints</h3>
        <p className="text-xs text-slate-500 mt-1">Record patient-reported symptoms and normalized interpretations.</p>
      </div>

      {symptoms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {symptoms.map(s => (
            <div key={s.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                      {s.intensity}
                    </span>
                    {s.isCharacteristic && (
                      <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800/60 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide ml-1.5">
                        Characteristic
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(s.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                    aria-label={`Remove complaint: ${s.normalizedName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Patient Description</label>
                    <p className="text-xs font-semibold text-slate-200 italic mt-0.5">"{s.patientWording}"</p>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Clinician Normalization</label>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{s.normalizedName}</p>
                  </div>

                  {(s.location || s.sensation) && (
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-900 pt-2 text-[10px] text-slate-400">
                      {s.location && <p><span className="text-slate-650 font-bold">Location:</span> {s.location}</p>}
                      {s.sensation && <p><span className="text-slate-650 font-bold">Sensation:</span> {s.sensation}</p>}
                    </div>
                  )}

                  {(s.aggravations.length > 0 || s.ameliorations.length > 0) && (
                    <div className="border-t border-slate-900 pt-2 text-[10px] space-y-0.5 text-slate-400">
                      {s.aggravations.length > 0 && <p><span className="text-rose-500/80 font-bold">Aggravating:</span> {s.aggravations.join(", ")}</p>}
                      {s.ameliorations.length > 0 && <p><span className="text-emerald-500/80 font-bold">Ameliorating:</span> {s.ameliorations.join(", ")}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 text-center text-slate-550 flex items-center justify-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500/70" />
          <p className="text-xs">No chief complaints registered. At least one required for initial consultations.</p>
        </div>
      )}

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-slate-900/50 border border-slate-850 p-5 rounded-xl space-y-4">
        <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wide flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-400" /> Add Symptom Record
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patientWording" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Patient Wording (Verbatim)</label>
            <input
              type="text"
              id="patientWording"
              value={patientWording}
              onChange={e => setPatientWording(e.target.value)}
              placeholder="e.g. Sharp burning pain in stomach, worst after morning tea"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="normalizedName" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Normalized Remedy Rubric Name</label>
            <input
              type="text"
              id="normalizedName"
              value={normalizedName}
              onChange={e => setNormalizedName(e.target.value)}
              placeholder="e.g. Stomach pain; burning, tea after"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="location" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Epigastric region"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="sensation" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Sensation</label>
            <input
              type="text"
              id="sensation"
              value={sensation}
              onChange={e => setSensation(e.target.value)}
              placeholder="e.g. Burning / raw"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="intensity" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Intensity</label>
            <select
              id="intensity"
              value={intensity}
              onChange={e => setIntensity(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-400"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-3">
          <div>
            <label htmlFor="aggravation" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Aggravation (Worse from)</label>
            <input
              type="text"
              id="aggravation"
              value={agg}
              onChange={e => setAgg(e.target.value)}
              placeholder="e.g. Hot tea, empty stomach"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="amelioration" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Amelioration (Better from)</label>
            <input
              type="text"
              id="amelioration"
              value={amel}
              onChange={e => setAmel(e.target.value)}
              placeholder="e.g. Warm water milk, pressure"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Complaint
        </button>
      </form>
    </div>
  );
}
