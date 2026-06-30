import React, { useState, useEffect } from "react";
import { CitationRecord } from "../types";
import globalKmsRepository from "../repositories/MemoryRepository";
import { Search, Plus, Trash2, Edit2, Link } from "lucide-react";

export default function CitationLibrary() {
  const [citations, setCitations] = useState<CitationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCitation, setEditingCitation] = useState<CitationRecord | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [journal, setJournal] = useState("");
  const [doi, setDoi] = useState("");
  const [pubmedId, setPubmedId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const loadData = async () => {
    const list = await globalKmsRepository.getCitations();
    setCitations(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditClick = (c: CitationRecord) => {
    setEditingCitation(c);
    setTitle(c.title);
    setAuthors(c.authors.join(", "));
    setJournal(c.journal);
    setDoi(c.doi || "");
    setPubmedId(c.pubmedId || "");
    setYear(c.year);
  };

  const handleCancelEdit = () => {
    setEditingCitation(null);
    setTitle("");
    setAuthors("");
    setJournal("");
    setDoi("");
    setPubmedId("");
    setYear(new Date().getFullYear());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const citation: CitationRecord = {
      id: editingCitation?.id || `CIT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      title,
      authors: authors.split(",").map(a => a.trim()).filter(Boolean),
      journal,
      doi: doi || undefined,
      pubmedId: pubmedId || undefined,
      year: Number(year),
      citationStyle: "AMA",
      usageCount: editingCitation?.usageCount || 0,
      linkedEntities: editingCitation?.linkedEntities || []
    };

    await globalKmsRepository.saveCitation(citation);
    handleCancelEdit();
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this citation reference? It will be removed from all linked entities.")) return;
    await globalKmsRepository.deleteCitation(id);
    await loadData();
  };

  const filtered = citations.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.journal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Citation list panel */}
      <div className="lg:col-span-2 space-y-4">
        <div className="p-4 bg-neutral-900/40 border border-neutral-850 rounded-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-500" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search citation registry..."
              className="w-full text-xs pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-850 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
            />
          </div>
        </div>

        <div className="border border-neutral-850 rounded-2xl bg-neutral-900/40 overflow-hidden backdrop-blur-xl divide-y divide-neutral-850">
          {filtered.map(c => (
            <div key={c.id} className="p-4 flex justify-between items-start hover:bg-neutral-850/20 transition-colors">
              <div className="space-y-1.5 pr-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 border border-cyan-500/10 rounded">
                    {c.id}
                  </span>
                  <h4 className="font-semibold text-neutral-200 leading-tight">
                    {c.title}
                  </h4>
                </div>
                <p className="text-neutral-400">
                  {c.authors.join(", ")} &bull; <i>{c.journal}</i> ({c.year})
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-neutral-500">
                  {c.doi && <span>DOI: {c.doi}</span>}
                  {c.pubmedId && <span>PMID: {c.pubmedId}</span>}
                </div>
              </div>

              <div className="flex items-center gap-4 text-right shrink-0">
                <div className="text-xs space-y-0.5">
                  <span className="font-bold font-mono text-neutral-250 block">{c.usageCount}</span>
                  <span className="text-[9px] text-neutral-500 block uppercase">Links</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditClick(c)}
                    className="p-1 hover:bg-cyan-500/10 text-neutral-400 hover:text-cyan-400 rounded transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="p-1 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-500 rounded transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-neutral-500 text-xs">
              No citation references matched search criteria.
            </div>
          )}
        </div>
      </div>

      {/* 2. Registry CRUD editor form */}
      <form onSubmit={handleSave} className="p-5 border border-neutral-850 bg-neutral-900/60 rounded-2xl backdrop-blur-xl space-y-4 text-xs">
        <h4 className="text-sm font-bold text-neutral-200 pb-2 border-b border-neutral-850 flex items-center gap-1.5">
          <Plus className="h-4.5 w-4.5 text-cyan-400" />
          {editingCitation ? `Edit Citation ${editingCitation.id}` : "Register New Citation"}
        </h4>

        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 block font-bold">Title *</span>
            <textarea
              rows={3}
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Constitutional treatment outcomes..."
              className="w-full text-xs p-2 bg-neutral-950 border border-neutral-855 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600 resize-none"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 block font-bold">Authors (Comma separated) *</span>
            <input
              type="text"
              required
              value={authors}
              onChange={e => setAuthors(e.target.value)}
              placeholder="e.g. Jethwani N., Sharma R."
              className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-855 rounded-lg text-neutral-200 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 block font-bold">Journal Name *</span>
            <input
              type="text"
              required
              value={journal}
              onChange={e => setJournal(e.target.value)}
              placeholder="e.g. Int J Hom Res"
              className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-855 rounded-lg text-neutral-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">DOI</span>
              <input
                type="text"
                value={doi}
                onChange={e => setDoi(e.target.value)}
                placeholder="10.1007..."
                className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-855 rounded-lg text-neutral-200 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 block">PubMed ID</span>
              <input
                type="text"
                value={pubmedId}
                onChange={e => setPubmedId(e.target.value)}
                placeholder="34892..."
                className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-855 rounded-lg text-neutral-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 block font-bold">Publication Year *</span>
            <input
              type="number"
              required
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="w-full text-xs px-3 py-1.5 bg-neutral-950 border border-neutral-855 rounded-lg text-neutral-200"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {editingCitation && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 border border-neutral-800 rounded-lg text-neutral-450 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-1.5 rounded-lg transition-all"
          >
            {editingCitation ? "Save Changes" : "Register Reference"}
          </button>
        </div>
      </form>

    </div>
  );
}
