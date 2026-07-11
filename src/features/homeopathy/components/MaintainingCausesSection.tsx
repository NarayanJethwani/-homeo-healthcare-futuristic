import React, { useState } from "react";
import { Plus, X, Tag } from "lucide-react";

interface MaintainingCausesSectionProps {
  maintainingCauses: string[];
  onChange: (updated: string[]) => void;
}

export function MaintainingCausesSection({
  maintainingCauses,
  onChange
}: MaintainingCausesSectionProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val || maintainingCauses.includes(val)) return;
    onChange([...maintainingCauses, val]);
    setInputValue("");
  };

  const handleRemove = (item: string) => {
    onChange(maintainingCauses.filter(f => f !== item));
  };

  return (
    <div className="bg-slate-900 border border-slate-850 p-5 rounded-xl space-y-4">
      <div>
        <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-405" /> Maintaining Causes
        </h4>
        <p className="text-[10px] text-slate-500 mt-1">Record structural, physical, or habit-based triggers that prevent resolution of symptoms.</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Add maintaining cause e.g. lack of sleep..."
          className="flex-1 bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-slate-950 border border-slate-850 text-slate-300 font-bold hover:bg-slate-800 rounded text-xs cursor-pointer flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2 pt-1">
        {maintainingCauses.length > 0 ? (
          maintainingCauses.map(f => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300"
            >
              {f}
              <button
                type="button"
                onClick={() => handleRemove(f)}
                className="text-slate-500 hover:text-rose-400 font-normal cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-555 italic">No maintaining causes logged yet.</p>
        )}
      </div>
    </div>
  );
}
export default MaintainingCausesSection;
