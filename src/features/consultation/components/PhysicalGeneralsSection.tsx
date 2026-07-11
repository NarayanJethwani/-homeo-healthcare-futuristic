import React, { useState } from "react";
import { PhysicalGenerals } from "../domain/consultation.types";
import { Plus, X } from "lucide-react";

interface PhysicalGeneralsSectionProps {
  physicalGenerals: PhysicalGenerals;
  onChange: (updated: PhysicalGenerals) => void;
}

export function PhysicalGeneralsSection({ physicalGenerals, onChange }: PhysicalGeneralsSectionProps) {
  const [cravingInput, setCravingInput] = useState("");
  const [aversionInput, setAversionInput] = useState("");

  const updateField = (key: keyof PhysicalGenerals, value: any) => {
    onChange({
      ...physicalGenerals,
      [key]: value
    });
  };

  const addCraving = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cravingInput.trim()) return;
    const current = physicalGenerals.cravings || [];
    if (!current.includes(cravingInput.trim())) {
      updateField("cravings", [...current, cravingInput.trim()]);
    }
    setCravingInput("");
  };

  const removeCraving = (item: string) => {
    const current = physicalGenerals.cravings || [];
    updateField("cravings", current.filter(c => c !== item));
  };

  const addAversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aversionInput.trim()) return;
    const current = physicalGenerals.aversions || [];
    if (!current.includes(aversionInput.trim())) {
      updateField("aversions", [...current, aversionInput.trim()]);
    }
    setAversionInput("");
  };

  const removeAversion = (item: string) => {
    const current = physicalGenerals.aversions || [];
    updateField("aversions", current.filter(a => a !== item));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100">Physical Generals</h3>
        <p className="text-xs text-slate-500 mt-1">Record the patient's thermal temperature preferences, thirst, cravings, sleep, and weather responses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="thermal" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Thermal Preference</label>
          <select
            id="thermal"
            value={physicalGenerals.thermalPreference || ""}
            onChange={e => updateField("thermalPreference", e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-400"
          >
            <option value="">Select...</option>
            <option value="chilly">Chilly (sensitive to cold)</option>
            <option value="hot">Hot (sensitive to heat)</option>
            <option value="ambithermal">Ambithermal (comfortable in both)</option>
          </select>
        </div>

        <div>
          <label htmlFor="thirst" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Thirst</label>
          <input
            type="text"
            id="thirst"
            value={physicalGenerals.thirst || ""}
            onChange={e => updateField("thirst", e.target.value)}
            placeholder="e.g. Thirstless, large quantities at long intervals"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="appetite" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Appetite</label>
          <input
            type="text"
            id="appetite"
            value={physicalGenerals.appetite || ""}
            onChange={e => updateField("appetite", e.target.value)}
            placeholder="e.g. Ravenous, easy satiety, hungry at night"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-900 pt-4">
        {/* Cravings */}
        <div className="space-y-2.5">
          <label className="block text-[10px] text-slate-550 font-bold uppercase">Food Cravings</label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg min-h-[40px]">
            {(physicalGenerals.cravings || []).map(c => (
              <span key={c} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-350 px-2 py-0.5 rounded-full flex items-center gap-1">
                {c}
                <button type="button" onClick={() => removeCraving(c)} className="hover:text-rose-400 focus:outline-none cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            {(physicalGenerals.cravings || []).length === 0 && (
              <span className="text-[10px] text-slate-650 italic p-0.5">No craving tags added...</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={cravingInput}
              onChange={e => setCravingInput(e.target.value)}
              placeholder="e.g. Sweets, salt, spicy, sour, milk"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={addCraving}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Aversions */}
        <div className="space-y-2.5">
          <label className="block text-[10px] text-slate-550 font-bold uppercase">Food Aversions</label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-lg min-h-[40px]">
            {(physicalGenerals.aversions || []).map(a => (
              <span key={a} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-350 px-2 py-0.5 rounded-full flex items-center gap-1">
                {a}
                <button type="button" onClick={() => removeAversion(a)} className="hover:text-rose-400 focus:outline-none cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            {(physicalGenerals.aversions || []).length === 0 && (
              <span className="text-[10px] text-slate-650 italic p-0.5">No aversion tags added...</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={aversionInput}
              onChange={e => setAversionInput(e.target.value)}
              placeholder="e.g. Meat, warm food, fat, bread"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs focus:outline-none"
            />
            <button
              type="button"
              onClick={addAversion}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-900 pt-4">
        <div>
          <label htmlFor="perspiration" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Perspiration</label>
          <input
            type="text"
            id="perspiration"
            value={physicalGenerals.perspiration || ""}
            onChange={e => updateField("perspiration", e.target.value)}
            placeholder="e.g. Head only, stains yellow, offensive"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="sleep" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Sleep & Rest</label>
          <input
            type="text"
            id="sleep"
            value={physicalGenerals.sleep || ""}
            onChange={e => updateField("sleep", e.target.value)}
            placeholder="e.g. Restless, unrefreshing, sleeps late"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="sleepPosition" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Sleep Position</label>
          <input
            type="text"
            id="sleepPosition"
            value={physicalGenerals.sleepPosition || ""}
            onChange={e => updateField("sleepPosition", e.target.value)}
            placeholder="e.g. Right side, on abdomen, hands under head"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="bowels" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Bowel Habits / Urination</label>
          <input
            type="text"
            id="bowels"
            value={physicalGenerals.bowelHabits || ""}
            onChange={e => updateField("bowelHabits", e.target.value)}
            placeholder="e.g. Constipated, urging ineffectual, pale urine"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="weather" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Weather / Temperature Sensitivity</label>
          <input
            type="text"
            id="weather"
            value={physicalGenerals.weatherSensitivity || ""}
            onChange={e => updateField("weatherSensitivity", e.target.value)}
            placeholder="e.g. Worse during thunderstorms, damp air, sea air"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="physicalNotes" className="block text-[10px] text-slate-550 font-bold uppercase mb-1">Physical generals free-text notes</label>
        <textarea
          id="physicalNotes"
          rows={3}
          value={physicalGenerals.clinicianNotes || ""}
          onChange={e => updateField("clinicianNotes", e.target.value)}
          placeholder="Log notes on discharges, nail appearance, tongue coatings..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none placeholder-slate-650"
        />
      </div>
    </div>
  );
}
