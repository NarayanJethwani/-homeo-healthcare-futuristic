import React, { useState } from "react";
import { SelectedRubric, RubricGroup, TotalitySymptom } from "../domain/homeopathy.types";
import { RubricSearchService, RubricSearchResult } from "../../repertory/search/rubricSearchService";
import { toSelectedRubricId, toConceptId } from "../../../shared/domain/identifiers";
import { Search, Plus, Trash2, ShieldAlert, Folder, ShieldX } from "lucide-react";

interface RubricSelectionSectionProps {
  selectedRubrics: SelectedRubric[];
  rubricGroups: RubricGroup[];
  totalitySymptoms: TotalitySymptom[];
  searchService: RubricSearchService;
  actorId: string;
  onChange: (updated: SelectedRubric[]) => void;
}

export function RubricSelectionSection({
  selectedRubrics,
  rubricGroups,
  totalitySymptoms,
  searchService,
  actorId,
  onChange
}: RubricSelectionSectionProps) {
  const [queryText, setQueryText] = useState("");
  const [searchResults, setSearchResults] = useState<RubricSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    setSearching(true);
    setSearchError("");
    try {
      const results = await searchService.search({ queryText: queryText.trim() });
      setSearchResults(results);
    } catch (err: any) {
      setSearchError("Failed to search repertory rubrics.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectRubric = (res: RubricSearchResult) => {
    const isAlreadySelected = selectedRubrics.some(r => r.rubricId === res.rubricId);
    if (isAlreadySelected) return;

    const newSelected: SelectedRubric = {
      id: toSelectedRubricId(`sr_${res.rubricId}`),
      rubricId: toConceptId(res.rubricId) as any,
      sourceId: res.sourceId,
      sourceName: res.sourceName,
      chapter: res.chapter,
      rubricPath: res.rubricPath,
      displayText: res.title,
      linkedTotalitySymptomIds: [],
      status: "selected",
      selectedBy: actorId as any,
      selectedAt: new Date().toISOString(),
      searchTraceability: {
        query: queryText.trim(),
        timestamp: new Date().toISOString()
      }
    };

    onChange([...selectedRubrics, newSelected]);
  };

  const handleRemoveRubric = (id: string) => {
    onChange(selectedRubrics.filter(r => r.id !== id));
  };

  const handleToggleExclude = (id: string) => {
    const updated = selectedRubrics.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: r.status === "excluded" ? ("selected" as const) : ("excluded" as const)
        };
      }
      return r;
    });
    onChange(updated);
  };

  const handleAssignGroup = (id: string, groupId: string) => {
    const updated = selectedRubrics.map(r => {
      if (r.id === id) {
        return { ...r, groupId: groupId || undefined };
      }
      return r;
    });
    onChange(updated);
  };

  const handleToggleLinkSymptom = (rubricId: string, symptomId: string) => {
    const updated = selectedRubrics.map(r => {
      if (r.id === rubricId) {
        const currentLinks = r.linkedTotalitySymptomIds || [];
        const exists = currentLinks.includes(symptomId as any);
        return {
          ...r,
          linkedTotalitySymptomIds: exists 
            ? currentLinks.filter(sid => sid !== symptomId) 
            : [...currentLinks, symptomId as any]
        };
      }
      return r;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Folder className="w-5 h-5 text-emerald-400" /> Rubric Selection Workspace
        </h3>
        <p className="text-xs text-slate-500 mt-1">Search the Boericke repertory corpus, map rubrics to totality symptoms, and group them clinically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Rubrics Panel */}
        <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Search Repertory</h4>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={queryText}
                onChange={e => setQueryText(e.target.value)}
                placeholder="Search rubrics e.g. headache, burning..."
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 pl-9 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-550 absolute left-3 top-2" />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 rounded text-xs cursor-pointer disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </form>

          {searchError && <p className="text-xs text-rose-400">{searchError}</p>}

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {searchResults.length > 0 ? (
              searchResults.map(res => {
                const isSelected = selectedRubrics.some(r => r.rubricId === res.rubricId);
                return (
                  <div key={res.rubricId} className="bg-slate-900 border border-slate-850 p-3 rounded-lg flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{res.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{res.chapter} &gt; {res.rubricPath.join(" &gt; ")}</p>
                      <p className="text-[9px] text-slate-650 mt-0.5">Source: {res.sourceName}</p>
                    </div>
                    <button
                      type="button"
                      disabled={isSelected}
                      onClick={() => handleSelectRubric(res)}
                      className={`p-1.5 rounded cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-slate-950 text-slate-600 border border-slate-900" 
                          : "bg-emerald-950/45 border border-emerald-900 text-emerald-400 hover:bg-emerald-900/50"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-650 italic">Enter search terms to discover matching rubrics.</p>
            )}
          </div>
        </div>

        {/* Selected Rubrics List */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Selected Rubrics</h4>
          {selectedRubrics.length > 0 ? (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {selectedRubrics.map(r => (
                <div key={r.id} className={`border p-4 rounded-xl space-y-3 transition-colors ${
                  r.status === "excluded" ? "bg-rose-955/10 border-rose-950/60 opacity-60" : "bg-slate-900 border-slate-850"
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-xs font-bold ${r.status === "excluded" ? "line-through text-slate-500" : "text-slate-100"}`}>
                        {r.displayText}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{r.chapter} &gt; {r.rubricPath.join(" &gt; ")}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleExclude(r.id)}
                        className={`p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer ${
                          r.status === "excluded" ? "text-rose-400" : "text-slate-500"
                        }`}
                        title={r.status === "excluded" ? "Include Rubric" : "Exclude Rubric"}
                      >
                        <ShieldX className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRubric(r.id)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-850/50">
                    {/* Rubric Group selection */}
                    <div>
                      <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Group Category</label>
                      <select
                        value={r.groupId || ""}
                        onChange={e => handleAssignGroup(r.id, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300 px-2 py-1 rounded"
                      >
                        <option value="">No group</option>
                        {rubricGroups.map(g => (
                          <option key={g.id} value={g.id}>{g.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Linking to totality symptoms */}
                    <div>
                      <label className="block text-[9px] text-slate-500 font-bold uppercase mb-1">Link to Totality Symptom</label>
                      <div className="space-y-1 max-h-[80px] overflow-y-auto bg-slate-950 p-2 border border-slate-850 rounded">
                        {totalitySymptoms.map(ts => {
                          const isLinked = (r.linkedTotalitySymptomIds || []).includes(ts.id);
                          return (
                            <button
                              key={ts.id}
                              type="button"
                              onClick={() => handleToggleLinkSymptom(r.id, ts.id)}
                              className={`w-full text-left text-[9px] px-1.5 py-0.5 rounded transition-all block ${
                                isLinked ? "bg-emerald-950 text-emerald-400 font-bold" : "text-slate-450 hover:bg-slate-900"
                              }`}
                            >
                              {ts.sourceSnapshot.normalizedName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-550 italic">No rubrics selected yet. Search the database on the left panel.</p>
          )}
        </div>
      </div>
    </div>
  );
}
