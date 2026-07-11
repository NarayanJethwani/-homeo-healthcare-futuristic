import React, { useState } from "react";
import { MentalGenerals } from "../domain/consultation.types";
import { Plus, X } from "lucide-react";

interface MentalGeneralsSectionProps {
  mentalGenerals: MentalGenerals;
  onChange: (updated: MentalGenerals) => void;
}

export function MentalGeneralsSection({ mentalGenerals, onChange }: MentalGeneralsSectionProps) {
  const [fearInput, setFearInput] = useState("");
  const [causationInput, setCausationInput] = useState("");

  const updateField = (key: keyof MentalGenerals, value: any) => {
    onChange({
      ...mentalGenerals,
      [key]: value
    });
  };

  const addFear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fearInput.trim()) return;
    const current = mentalGenerals.fears || [];
    if (!current.includes(fearInput.trim())) {
      updateField("fears", [...current, fearInput.trim()]);
    }
    setFearInput("");
  };

  const removeFear = (fear: string) => {
    const current = mentalGenerals.fears || [];
    updateField("fears", current.filter(f => f !== fear));
  };

  const addCausation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!causationInput.trim()) return;
    const current = mentalGenerals.emotionalCausation || [];
    if (!current.includes(causationInput.trim())) {
      updateField("emotionalCausation", [...current, causationInput.trim()]);
    }
    setCausationInput("");
  };

  const removeCausation = (cause: string) => {
    const current = mentalGenerals.emotionalCausation || [];
    updateField("emotionalCausation", current.filter(c => c !== cause));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100">Mental Generals</h3>
        <p className="text-xs text-slate-500 mt-1">Record the patient's emotional disposition, fears, memory, and causation traits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fears tag manager */}
        <div className="space-y-2.5">
          <label className="block text-[10px] text-slate-500 font-bold uppercase">Specific Fears / Phobias</label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg min-h-[40px]">
            {(mentalGenerals.fears || []).map(f => (
              <span key={f} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-350 px-2 py-0.5 rounded-full flex items-center gap-1">
                {f}
                <button type="button" onClick={() => removeFear(f)} className="hover:text-rose-400 focus:outline-none cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            {(mentalGenerals.fears || []).length === 0 && (
              <span className="text-[10px] text-slate-650 italic p-0.5">No specific fears added...</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={fearInput}
              onChange={e => setFearInput(e.target.value)}
              placeholder="e.g. Fear of dogs, heights, dark"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={addFear}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Emotional Causation */}
        <div className="space-y-2.5">
          <label className="block text-[10px] text-slate-500 font-bold uppercase">Emotional Causations (Ailments from)</label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg min-h-[40px]">
            {(mentalGenerals.emotionalCausation || []).map(c => (
              <span key={c} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-350 px-2 py-0.5 rounded-full flex items-center gap-1">
                {c}
                <button type="button" onClick={() => removeCausation(c)} className="hover:text-rose-400 focus:outline-none cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            {(mentalGenerals.emotionalCausation || []).length === 0 && (
              <span className="text-[10px] text-slate-650 italic p-0.5">No causations listed...</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={causationInput}
              onChange={e => setCausationInput(e.target.value)}
              placeholder="e.g. Grief, anger suppressed, shock"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={addCausation}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-900 pt-4">
        <div>
          <label htmlFor="consolation" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Consolation Response</label>
          <select
            id="consolation"
            value={mentalGenerals.consolationResponse || ""}
            onChange={e => updateField("consolationResponse", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-400"
          >
            <option value="">Select or leave blank...</option>
            <option value="aggravates">Aggravates (worse from consolation)</option>
            <option value="ameliorates">Ameliorates (desires/comforted by consolation)</option>
            <option value="indifferent">Indifferent</option>
          </select>
        </div>

        <div>
          <label htmlFor="company" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Company Preference</label>
          <select
            id="company"
            value={mentalGenerals.companyPreference || ""}
            onChange={e => updateField("companyPreference", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-400"
          >
            <option value="">Select...</option>
            <option value="desires_company">Desires Company (fears solitude)</option>
            <option value="aversion_to_company">Aversion to Company (desires solitude)</option>
            <option value="indifferent">Indifferent</option>
          </select>
        </div>

        <div>
          <label htmlFor="irritability" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Anger / Irritability</label>
          <input
            type="text"
            id="irritability"
            value={mentalGenerals.irritability || ""}
            onChange={e => updateField("irritability", e.target.value)}
            placeholder="e.g. Easily angered, throws things, suppresses anger"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="grief" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Grief / Melancholy</label>
          <input
            type="text"
            id="grief"
            value={mentalGenerals.grief || ""}
            onChange={e => updateField("grief", e.target.value)}
            placeholder="Silent grief, sighing, weeping in solitude"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="dreams" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Dreams</label>
          <input
            type="text"
            id="dreams"
            value={mentalGenerals.dreams || ""}
            onChange={e => updateField("dreams", e.target.value)}
            placeholder="Dreams of falling, flying, robbers, dead relatives"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="mentalNotes" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Mental generals free-text notes</label>
        <textarea
          id="mentalNotes"
          rows={3}
          value={mentalGenerals.clinicianNotes || ""}
          onChange={e => updateField("clinicianNotes", e.target.value)}
          placeholder="Log notes on disposition, memory, concentration issues, speech speed..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none placeholder-slate-650"
        />
      </div>
    </div>
  );
}
