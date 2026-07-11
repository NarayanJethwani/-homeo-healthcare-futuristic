import React, { useState } from "react";
import { IllnessTimelineEvent } from "../domain/consultation.types";
import { Plus, Trash2, Clock } from "lucide-react";

interface IllnessTimelineSectionProps {
  events: IllnessTimelineEvent[];
  onChange: (updated: IllnessTimelineEvent[]) => void;
}

export function IllnessTimelineSection({ events, onChange }: IllnessTimelineSectionProps) {
  const [desc, setDesc] = useState("");
  const [period, setPeriod] = useState("");
  const [type, setType] = useState<IllnessTimelineEvent["eventType"]>("symptom_onset");
  const [source, setSource] = useState<IllnessTimelineEvent["source"]>("patient");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    const newEvent: IllnessTimelineEvent = {
      id: `tle_${Math.random().toString(36).substring(2, 11)}`,
      approximatePeriod: period.trim() || undefined,
      eventType: type,
      description: desc.trim(),
      source
    };

    onChange([...events, newEvent]);
    setDesc("");
    setPeriod("");
  };

  const handleRemove = (id: string) => {
    onChange(events.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100">Chronology & Timeline</h3>
        <p className="text-xs text-slate-500 mt-1">Log structured events, trigger events, hospitalizations, or previous treatment lines.</p>
      </div>

      {events.length > 0 ? (
        <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-4 py-2">
          {events.map((e, index) => (
            <div key={e.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 group-hover:bg-emerald-450 transition-colors"></div>

              <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 flex items-start justify-between hover:border-slate-750 transition-all">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-450 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      {e.approximatePeriod || "Date unknown"}
                    </span>
                    <span className="text-[9px] bg-slate-900 text-emerald-400 border border-emerald-950/60 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">
                      {e.eventType.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-2 font-medium">{e.description}</p>
                  <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Source: {e.source}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(e.id)}
                  className="p-1 text-slate-550 hover:text-rose-400 transition-colors cursor-pointer"
                  aria-label="Remove timeline event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 text-center text-slate-550 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-amber-500/70" />
          <p className="text-xs">No chronological events registered yet. At least one required for initial consultations.</p>
        </div>
      )}

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-slate-900/50 border border-slate-850 p-5 rounded-xl space-y-4">
        <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wide flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-400" /> Log Timeline Event
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label htmlFor="timelineDesc" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Event Description</label>
            <input
              type="text"
              id="timelineDesc"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="e.g. Back pain started after lifting heavy furniture in rainy season"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="timelinePeriod" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Approximate Period / Date</label>
            <input
              type="text"
              id="timelinePeriod"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              placeholder="e.g. October 2025 or 3 months ago"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="timelineType" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Event Type</label>
            <select
              id="timelineType"
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-400"
            >
              <option value="symptom_onset">Symptom Onset</option>
              <option value="worsening">Worsening</option>
              <option value="improvement">Improvement</option>
              <option value="treatment">Treatment</option>
              <option value="investigation">Investigation</option>
              <option value="hospitalization">Hospitalization</option>
              <option value="stress_event">Stress Event (Grief/Anger etc)</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="timelineSource" className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Reporting Source</label>
            <select
              id="timelineSource"
              value={source}
              onChange={e => setSource(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-400"
            >
              <option value="patient">Patient Reported</option>
              <option value="caregiver">Caregiver Reported</option>
              <option value="clinician">Clinician Interpreted</option>
              <option value="document">Extracted from Document</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </form>
    </div>
  );
}
