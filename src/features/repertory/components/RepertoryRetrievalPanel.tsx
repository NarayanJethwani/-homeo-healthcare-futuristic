import React, { useState, useEffect, useRef } from "react";
import { useRepertoryRetrieval } from "../hooks/useRepertoryRetrieval";
import { HighlightSegment } from "../search/RubricSearchIndex";
import {
  RepertorySource,
  RepertoryEdition,
  RepertoryChapter,
  RepertoryRubricRecord
} from "../types/repertoryTypes";

interface TreeItemState {
  id: string;
  label: string;
  type: "chapter" | "rubric";
  depth: number;
  expanded: boolean;
  hasChildren: boolean;
  record?: RepertoryRubricRecord;
  childrenLoaded: boolean;
}

export function RepertoryRetrievalPanel() {
  const {
    state,
    sources,
    editions,
    chapters,
    rubrics,
    searchResults,
    selectedSourceId,
    selectedEditionId,
    selectedChapterId,
    query,
    hasNextPage,
    selectSource,
    selectEdition,
    selectChapter,
    executeSearch,
    loadNextPage
  } = useRepertoryRetrieval();

  const [searchVal, setSearchVal] = useState("");
  const [treeItems, setTreeItems] = useState<TreeItemState[]>([]);
  const [activeFocusId, setActiveFocusId] = useState<string | null>(null);
  
  // Track loaded sub-children of rubrics in state to expand dynamically
  const [subChildren, setSubChildren] = useState<Record<string, RepertoryRubricRecord[]>>({});
  
  const treeContainerRef = useRef<HTMLDivElement>(null);

  // Re-build tree items when chapters or rubrics change
  useEffect(() => {
    if (state.status === "loaded") {
      if (selectedChapterId) {
        // Flattened list: parent chapter + loaded rubrics (and any expanded rubric children)
        const items: TreeItemState[] = [];
        
        // Add rubrics
        rubrics.forEach(rubric => {
          items.push({
            id: rubric.id,
            label: rubric.displayText,
            type: "rubric",
            depth: rubric.depth,
            expanded: !!subChildren[rubric.id],
            hasChildren: rubric.hasChildren,
            record: rubric,
            childrenLoaded: !!subChildren[rubric.id]
          });

          // If expanded, insert its children below it
          if (subChildren[rubric.id]) {
            subChildren[rubric.id].forEach(child => {
              items.push({
                id: child.id,
                label: child.displayText,
                type: "rubric",
                depth: child.depth,
                expanded: !!subChildren[child.id],
                hasChildren: child.hasChildren,
                record: child,
                childrenLoaded: !!subChildren[child.id]
              });
            });
          }
        });

        setTreeItems(items);
        if (items.length > 0 && !activeFocusId) {
          setActiveFocusId(items[0].id);
        }
      } else {
        setTreeItems([]);
      }
    }
  }, [state, rubrics, subChildren, selectedChapterId]);

  // Load children for expanding a rubric in the tree
  const toggleRubricExpansion = async (item: TreeItemState) => {
    if (!item.hasChildren) return;

    if (item.expanded) {
      // Collapse
      const updated = { ...subChildren };
      delete updated[item.id];
      setSubChildren(updated);
    } else {
      // Expand
      try {
        const res = await fetch(`/api/v1/repertory/knowledge/rubrics/${item.id}/hierarchy`);
        const json = await res.json();
        if (res.ok && json.data?.children) {
          setSubChildren(prev => ({
            ...prev,
            [item.id]: json.data.children
          }));
        }
      } catch (err) {
        console.error("Failed to load rubric children:", err);
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim().length >= 2) {
      executeSearch(searchVal.trim());
    }
  };

  // Keyboard navigation for WAI-ARIA Tree
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (treeItems.length === 0) return;

    const currentIndex = treeItems.findIndex(item => item.id === activeFocusId);
    if (currentIndex === -1) return;

    let targetIndex = currentIndex;
    const currentItem = treeItems[currentIndex];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (currentIndex < treeItems.length - 1) {
          targetIndex = currentIndex + 1;
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (currentIndex > 0) {
          targetIndex = currentIndex - 1;
        }
        break;

      case "ArrowRight":
        e.preventDefault();
        if (currentItem.type === "rubric" && currentItem.hasChildren) {
          if (!currentItem.expanded) {
            await toggleRubricExpansion(currentItem);
          } else {
            // Move to first child
            if (currentIndex < treeItems.length - 1) {
              targetIndex = currentIndex + 1;
            }
          }
        }
        break;

      case "ArrowLeft":
        e.preventDefault();
        if (currentItem.type === "rubric") {
          if (currentItem.expanded) {
            await toggleRubricExpansion(currentItem);
          } else if (currentItem.record?.parentRecordId) {
            // Move focus to parent
            const parentIdx = treeItems.findIndex(item => item.id === currentItem.record?.parentRecordId);
            if (parentIdx !== -1) {
              targetIndex = parentIdx;
            }
          }
        }
        break;

      case "Home":
        e.preventDefault();
        targetIndex = 0;
        break;

      case "End":
        e.preventDefault();
        targetIndex = treeItems.length - 1;
        break;

      case "Enter":
      case " ":
        e.preventDefault();
        if (currentItem.type === "rubric" && currentItem.hasChildren) {
          await toggleRubricExpansion(currentItem);
        }
        break;

      default:
        return;
    }

    if (targetIndex !== currentIndex) {
      const targetId = treeItems[targetIndex].id;
      setActiveFocusId(targetId);
      // Roving focus element trigger
      setTimeout(() => {
        const el = document.getElementById(`treeitem-${targetId}`);
        el?.focus();
      }, 10);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans p-6 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Header and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Clinical Repertory Search & Access
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse classical works and query symptoms with rights-aware entitlements.
          </p>
        </div>

        {/* Badges / Rights Status */}
        <div className="flex items-center gap-2">
          {selectedEditionId && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Active Edition: {selectedEditionId}
            </span>
          )}
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-950 text-blue-400 border border-blue-800">
            Public Domain
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Column: Source, Edition, Chapter selectors */}
        <div className="lg:col-span-1 flex flex-col gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
              Select Source
            </label>
            <select
              value={selectedSourceId || ""}
              onChange={e => selectSource(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Source...</option>
              {sources.map(src => (
                <option key={src.id} value={src.id}>
                  {src.shortName} ({src.author})
                </option>
              ))}
            </select>
          </div>

          {selectedSourceId && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
                Select Edition
              </label>
              <select
                value={selectedEditionId || ""}
                onChange={e => selectEdition(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select Edition...</option>
                {editions.map(ed => (
                  <option key={ed.id} value={ed.id}>
                    {ed.editionName} ({ed.publicationYear})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedEditionId && chapters.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
                Chapters
              </label>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1 flex flex-col gap-1">
                {chapters.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => selectChapter(ch.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-250 ${
                      selectedChapterId === ch.id
                        ? "bg-blue-600 text-white font-medium"
                        : "hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    {ch.displayTitle}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Main content & Search */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search symptom rubrics (e.g. pain stomach)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-4 pr-10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
            >
              Search
            </button>
          </form>

          {/* Results Area */}
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-hidden flex flex-col min-h-0">
            {state.status === "loading" && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400" aria-live="polite">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-sm">Loading repertory data...</span>
              </div>
            )}

            {state.status === "unavailable" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <span className="text-lg font-bold text-red-400 mb-2">Access Denied</span>
                <p className="text-sm max-w-md">{state.reason}</p>
              </div>
            )}

            {state.status === "error" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-red-400">
                <span className="text-lg font-bold mb-2">Error Occurred</span>
                <p className="text-sm max-w-md">{state.message}</p>
              </div>
            )}

            {state.status === "empty" && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <span className="text-sm font-semibold">No rubrics matched. Try another query or selection.</span>
              </div>
            )}

            {state.status === "loaded" && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Search Results Display */}
                {searchResults.length > 0 ? (
                  <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
                    <div className="text-xs text-slate-400 mb-2" aria-live="polite">
                      Found {searchResults.length} matches.
                    </div>
                    {searchResults.map((res, i) => (
                      <div key={res.rubric.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition duration-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-slate-200">
                            {res.highlightedFields.displayText ? (
                              res.highlightedFields.displayText.map((part, idx) => (
                                <span key={idx} className={part.matched ? "bg-amber-950 text-amber-300 font-semibold px-0.5 rounded" : ""}>
                                  {part.text}
                                </span>
                              ))
                            ) : (
                              res.rubric.displayText
                            )}
                          </span>
                          <span className="text-xs font-bold text-blue-400 ml-4 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                            Rel: {res.relevanceScore}
                          </span>
                        </div>
                        {res.rubric.classicalWording && (
                          <div className="text-xs text-slate-400 italic mt-1">
                            Classical: {res.rubric.classicalWording}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-2">
                          {res.rubric.editionId} • Chapter: {res.rubric.chapterId}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Chapter Tree Navigation (WAI-ARIA Tree) */
                  <div className="flex-1 flex flex-col min-h-0">
                    <div
                      role="tree"
                      aria-label="Repertory Rubrics Hierarchy"
                      className="flex-1 overflow-y-auto flex flex-col gap-1 pr-2 outline-none"
                      onKeyDown={handleKeyDown}
                      ref={treeContainerRef}
                    >
                      {treeItems.map(item => (
                        <div
                          key={item.id}
                          id={`treeitem-${item.id}`}
                          role="treeitem"
                          aria-level={item.depth}
                          aria-expanded={item.hasChildren ? item.expanded : undefined}
                          aria-selected={activeFocusId === item.id}
                          tabIndex={activeFocusId === item.id ? 0 : -1}
                          className={`flex items-center py-2 px-3 rounded-lg text-sm cursor-pointer outline-none transition-all duration-200 ${
                            activeFocusId === item.id
                              ? "bg-slate-800 text-white font-medium ring-2 ring-blue-500/50"
                              : "hover:bg-slate-900/50 text-slate-300"
                          }`}
                          style={{ paddingLeft: `${(item.depth) * 16}px` }}
                          onClick={() => {
                            setActiveFocusId(item.id);
                            if (item.hasChildren) toggleRubricExpansion(item);
                          }}
                        >
                          {/* Folder expansion icon */}
                          {item.hasChildren && (
                            <span className="mr-2 text-slate-400 font-mono text-xs">
                              {item.expanded ? "▼" : "▶"}
                            </span>
                          )}
                          {!item.hasChildren && <span className="mr-2 text-slate-600 font-mono text-xs">•</span>}
                          
                          <span className="flex-1 truncate">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pagination Controls */}
                {hasNextPage && (
                  <div className="flex justify-center mt-4 pt-4 border-t border-slate-800">
                    <button
                      onClick={loadNextPage}
                      className="px-6 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg shadow transition duration-200"
                    >
                      Load More Results
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
