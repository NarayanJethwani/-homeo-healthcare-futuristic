import React, { useState } from "react";
import { HomeopathicTimelineEvent } from "../domain/homeopathy.types";
import { Calendar, Plus, Trash2 } from "lucide-react";

interface HomeopathicTimelineSectionProps {
  timelineEvents: HomeopathicTimelineEvent[];
  onChange: (updated: HomeopathicTimelineEvent[]) => void;
}

export function HomeopathicTimelineSection({
  timelineEvents,
  onChange
}: HomeopathicTimelineSectionProps) {
  const [eventType, setEventType] = useState<"characteristic_symptom" | "general" | "etiology">("characteristic_symptom");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateOrAge, setDateOrAge] = useState("");

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim() || !dateOrAge.trim()) return;

    const newEvent: HomeopathicTimelineEvent = {
      id: `ev_${Math.random().toString(36).substring(2, 11)}`,
      eventType,
      milestoneTitle: milestoneTitle.trim(),
      description: description.trim(),
      dateOrAge: dateOrAge.trim()
    };

    onChange([...timelineEvents, newEvent]);
    setMilestoneTitle("");
    setDescription("");
    setDateOrAge("");
  };

  const handleRemoveEvent = (id: string) => {
    onChange(timelineEvents.filter(ev => ev.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-405" /> Homeopathic Illness Timeline
        </h3>
        <p className="text-xs text-slate-500 mt-1">Trace the chronological evolution of physical complaints, emotional traumas, vaccinations, or suppressive treatments over the patient's lifetime.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Event Form */}
        <div className="bg-slate-955 p-4 border border-slate-850 rounded-xl space-y-4 h-fit">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Log Milestone</h4>
          <form onSubmit={handleAddEvent} className="space-y-3">
            <div>
              <label htmlFor="evt-type-select" className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Event Type</label>
              <select
                id="evt-type-select"
                value={eventType}
                onChange={e => setEventType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded focus:outline-none"
              >
                <option value="characteristic_symptom">Onset of Characteristic Symptom</option>
                <option value="etiology">Etiological trauma / Causation</option>
                <option value="general">General clinical milestone</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="evt-date-input" className="block text-[9px] text-slate-505 font-bold uppercase mb-1">Date / Age</label>
                <input
                  type="text"
                  id="evt-date-input"
                  value={dateOrAge}
                  onChange={e => setDateOrAge(e.target.value)}
                  placeholder="e.g. 2018 / Age 24"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="evt-title-input" className="block text-[9px] text-slate-505 font-bold uppercase mb-1">Milestone Title</label>
                <input
                  type="text"
                  id="evt-title-input"
                  value={milestoneTitle}
                  onChange={e => setMilestoneTitle(e.target.value)}
                  placeholder="e.g. Grief after loss"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="evt-desc-input" className="block text-[9px] text-slate-505 font-bold uppercase mb-1">Detailed Description</label>
              <textarea
                id="evt-desc-input"
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Nuance of physical progression or emotional symptoms..."
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 rounded text-xs cursor-pointer transition-colors"
            >
              Add Milestone
            </button>
          </form>
        </div>

        {/* Timeline representation */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Illness Path / Progression</h4>
          {timelineEvents.length > 0 ? (
            <div className="relative border-l border-slate-800 ml-4 pl-6 space-y-5 max-h-[360px] overflow-y-auto pr-1 py-2">
              {timelineEvents.map(ev => (
                <div key={ev.id} className="relative bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-start justify-between gap-4">
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] top-5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950 flex-shrink-0" />
                  
                  <div>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-400">
                      {ev.dateOrAge}
                    </span>
                    <h5 className="text-xs font-black text-slate-100 mt-1">{ev.milestoneTitle}</h5>
                    {ev.description && (
                      <p className="text-[10px] text-slate-500 mt-0.5">{ev.description}</p>
                    )}
                    <span className="text-[9px] text-emerald-500 uppercase font-bold mt-1.5 block tracking-wider">
                      {ev.eventType === "characteristic_symptom" ? "Characteristic Symptom" : ev.eventType}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveEvent(ev.id)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-455 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-555 italic">No timeline milestones logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
