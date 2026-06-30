import React, { useState, useEffect } from "react";
import { CitationRecord } from "../types";
import globalKmsRepository from "../repositories/MemoryRepository";
import { Search, Plus, Check } from "lucide-react";

interface ReferencePickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function ReferencePicker({ selectedIds, onChange }: ReferencePickerProps) {
  const [citations, setCitations] = useState<CitationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New citation form
  const [newTitle, setNewTitle] = useState("");
  const [newAuthors, setNewAuthors] = useState("");
  const [newJournal, setNewJournal] = useState("");
  const [newDoi, setNewDoi] = useState("");
  const [newPubmed, setNewPubmed] = useState("");
  const [newYear, setNewYear] = useState(new Date().getFullYear());

  const loadCitations = async () => {
    const list = await globalKmsRepository.getCitations();
    setCitations(list);
  };

  useEffect(() => {
    loadCitations();
  }, []);

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = `CIT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const citation: CitationRecord = {
      id: newId,
      title: newTitle,
      authors: newAuthors.split(",").map(a => a.trim()).filter(Boolean),
      journal: newJournal,
      doi: newDoi || undefined,
      pubmedId: newPubmed || undefined,
      year: Number(newYear),
      citationStyle: "AMA",
      usageCount: 0,
      linkedEntities: []
    };

    await globalKmsRepository.saveCitation(citation);
    await loadCitations();

    // Select the newly added reference
    onChange([...selectedIds, newId]);

    // Reset Form
    setNewTitle("");
    setNewAuthors("");
    setNewJournal("");
    setNewDoi("");
    setNewPubmed("");
    setShowAddForm(false);
  };

  const filtered = citations.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <label className="text-sm font-bold text-neutral-300">
          Scientific References & Citations ({selectedIds.length} Linked)
        </label>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs flex items-center gap-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20 transition-all"
        >
          <Plus className="h-3 w-3" /> New Reference
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddNew} className="p-4 border border-cyan-500/20 bg-cyan-500/5 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-cyan-400">Add New Reference to Registry</h4>
          
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 block">Title *</span>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Constitutional treatment of GERD..."
              className="w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">Authors (Comma separated)</span>
              <input
                type="text"
                value={newAuthors}
                onChange={e => setNewAuthors(e.target.value)}
                placeholder="e.g. Jethwani N., Sharma R."
                className="w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">Journal Name</span>
              <input
                type="text"
                value={newJournal}
                onChange={e => setNewJournal(e.target.value)}
                placeholder="e.g. Int J Hom Res"
                className="w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">DOI</span>
              <input
                type="text"
                value={newDoi}
                onChange={e => setNewDoi(e.target.value)}
                placeholder="10.1007..."
                className="w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">PubMed ID</span>
              <input
                type="text"
                value={newPubmed}
                onChange={e => setNewPubmed(e.target.value)}
                placeholder="34892..."
                className="w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">Year</span>
              <input
                type="number"
                value={newYear}
                onChange={e => setNewYear(Number(e.target.value))}
                className="w-full text-xs px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-neutral-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded"
            >
              Register & Add
            </button>
          </div>
        </form>
      )}

      {/* Registry Search */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 text-neutral-500" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search central citation registry..."
          className="w-full text-xs pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
        />
      </div>

      {/* Selected Items Indicator */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedIds.map(id => {
            const match = citations.find(c => c.id === id);
            return (
              <span key={id} className="inline-flex items-center gap-1 text-[10px] bg-neutral-800 border border-neutral-750 text-cyan-400 px-2 py-0.5 rounded-full">
                {id}: {match ? match.title.substring(0, 30) + "..." : ""}
                <button
                  type="button"
                  onClick={() => handleToggle(id)}
                  className="text-neutral-500 hover:text-rose-500 font-bold ml-1"
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Filtered Registry List */}
      <div className="max-h-48 overflow-y-auto border border-neutral-850 rounded-lg bg-neutral-950 divide-y divide-neutral-900 custom-scrollbar">
        {filtered.map(c => {
          const isSelected = selectedIds.includes(c.id);
          return (
            <div
              key={c.id}
              onClick={() => handleToggle(c.id)}
              className="p-2.5 flex justify-between items-center hover:bg-neutral-900 cursor-pointer transition-colors"
            >
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-500">{c.id}</span>
                  <h5 className="text-xs font-semibold text-neutral-200 leading-tight">
                    {c.title}
                  </h5>
                </div>
                <p className="text-[10px] text-neutral-400">
                  {c.authors.join(", ")} &bull; <i>{c.journal}</i> ({c.year})
                </p>
              </div>

              <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                isSelected ? "border-cyan-500 bg-cyan-600 text-neutral-950" : "border-neutral-750"
              }`}>
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-4 text-center text-xs text-neutral-500">
            No matching citations found in registry.
          </div>
        )}
      </div>
    </div>
  );
}
