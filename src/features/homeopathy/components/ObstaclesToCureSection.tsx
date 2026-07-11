import React, { useState } from "react";
import { ObstacleToCure, ObstacleCategory } from "../domain/homeopathy.types";
import { toObstacleId } from "../../../shared/domain/identifiers";
import { ShieldAlert, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface ObstaclesToCureSectionProps {
  obstacles: ObstacleToCure[];
  onChange: (updated: ObstacleToCure[]) => void;
}

export function ObstaclesToCureSection({
  obstacles,
  onChange
}: ObstaclesToCureSectionProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ObstacleCategory>("lifestyle");
  const [supportingNotes, setSupportingNotes] = useState("");

  const handleAddObstacle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newObstacle: ObstacleToCure = {
      id: toObstacleId(`ob_${Math.random().toString(36).substring(2, 11)}`),
      category,
      description: description.trim(),
      status: "active",
      identifiedOn: new Date().toISOString(),
      supportingNotes: supportingNotes.trim() || undefined
    };

    onChange([...obstacles, newObstacle]);
    setDescription("");
    setSupportingNotes("");
  };

  const handleRemoveObstacle = (id: string) => {
    onChange(obstacles.filter(o => o.id !== id));
  };

  const handleToggleResolved = (id: string) => {
    const updated = obstacles.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status: o.status === "resolved" ? ("active" as const) : ("resolved" as const)
        };
      }
      return o;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-400" /> Obstacles to Cure
        </h3>
        <p className="text-xs text-slate-500 mt-1">Record environmental, occupational, dietary, or structural obstacles that block the action of homeopathic remedies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Obstacle Form */}
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-4 h-fit">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Log Obstacle</h4>
          <form onSubmit={handleAddObstacle} className="space-y-3">
            <div>
              <label htmlFor="obs-category-select" className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Category</label>
              <select
                id="obs-category-select"
                value={category}
                onChange={e => setCategory(e.target.value as ObstacleCategory)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded focus:outline-none"
              >
                <option value="lifestyle">Lifestyle Factors</option>
                <option value="environmental">Environmental / Exposure</option>
                <option value="dietary">Dietary Habits</option>
                <option value="drug_related">Allopathic Drug interference</option>
                <option value="emotional">Emotional / Stress</option>
                <option value="occupational">Occupational strain</option>
                <option value="social">Social environment</option>
                <option value="other">Other factors</option>
              </select>
            </div>

            <div>
              <label htmlFor="obs-desc-input" className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Description</label>
              <input
                type="text"
                id="obs-desc-input"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. High caffeine consumption (3 cups daily)"
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="obs-notes-input" className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Supporting notes</label>
              <input
                type="text"
                id="obs-notes-input"
                value={supportingNotes}
                onChange={e => setSupportingNotes(e.target.value)}
                placeholder="e.g. interferes with Coffee cruda action"
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 rounded text-xs cursor-pointer transition-colors"
            >
              Add Obstacle
            </button>
          </form>
        </div>

        {/* Obstacles list */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Active Obstacles & Maintenance</h4>
          {obstacles.length > 0 ? (
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {obstacles.map(o => (
                <div key={o.id} className={`bg-slate-900 border p-4 rounded-xl flex items-start justify-between gap-4 transition-colors ${
                  o.status === "resolved" ? "border-slate-950 bg-slate-950/40 opacity-60" : "border-slate-850"
                }`}>
                  <div className="space-y-1">
                    <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-400">
                      {o.category}
                    </span>
                    <p className={`text-xs font-bold ${o.status === "resolved" ? "line-through text-slate-550" : "text-slate-200"}`}>
                      {o.description}
                    </p>
                    {o.supportingNotes && (
                      <p className="text-[10px] text-slate-500 italic mt-0.5">Notes: {o.supportingNotes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleResolved(o.id)}
                      className={`p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                        o.status === "resolved" ? "text-emerald-400" : "text-slate-500 hover:text-emerald-450"
                      }`}
                      title={o.status === "resolved" ? "Mark Active" : "Mark Resolved"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveObstacle(o.id)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-455 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-550 italic">No obstacles logged yet for this assessment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
