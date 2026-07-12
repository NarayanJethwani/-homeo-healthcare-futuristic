import React, { useState } from "react";
import { MateriaMedicaBookmark, MateriaMedicaAnnotation } from "../../types/persistenceTypes";
import { Bookmark, MessageSquare, Trash2, ShieldAlert, AlertTriangle } from "lucide-react";
import { auth } from "@/lib/firebase";

type PrivateWorkspacePanelProps = {
  bookmarks: MateriaMedicaBookmark[];
  annotations: MateriaMedicaAnnotation[];
  onSelectRemedy: (remedyId: string) => void;
  onDeleteAnnotation: (annotationId: string) => Promise<any>;
  onToggleBookmark: (bookmark: MateriaMedicaBookmark) => Promise<any>;
  onClearGuestData?: () => void;
};

export const PrivateWorkspacePanel: React.FC<PrivateWorkspacePanelProps> = ({
  bookmarks,
  annotations,
  onSelectRemedy,
  onDeleteAnnotation,
  onToggleBookmark,
  onClearGuestData,
}) => {
  const [activeTab, setActiveTab] = useState<"bookmarks" | "notes">("bookmarks");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const user = auth.currentUser;

  return (
    <div className="flex flex-col bg-slate-950/40 border border-slate-800 p-5 rounded-3xl h-[650px] select-none text-xs">
      {/* Workspace Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800/60 pb-3 mb-4">
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all focus:outline-none ${
            activeTab === "bookmarks"
              ? "bg-slate-900 text-amber-500 border border-slate-850"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Bookmarks ({bookmarks.length})
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all focus:outline-none ${
            activeTab === "notes"
              ? "bg-slate-900 text-amber-500 border border-slate-850"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Notes ({annotations.length})
        </button>
      </div>

      {/* Panel Content */}
      <div className="flex-grow overflow-y-auto pr-1 space-y-3" data-lenis-prevent>
        {activeTab === "bookmarks" ? (
          bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-center gap-2">
              <Bookmark size={20} className="text-slate-650" />
              <span>No bookmarks saved yet</span>
            </div>
          ) : (
            bookmarks.map(b => (
              <div
                key={b.id}
                onClick={() => onSelectRemedy(b.passageId.includes("aconitum") ? "aconitum-napellus" : b.passageId.includes("belladonna") ? "belladonna" : "bryonia")}
                className="p-3 bg-slate-950/60 border border-slate-850 hover:border-slate-700 hover:bg-slate-900/65 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-serif font-bold text-slate-200 capitalize">
                    {b.passageId.replace("james-tyler-kent_", "").replace("_passage", "").replace("-", " ")}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                    {b.blockId ? "Passage Section" : "Full Remedy"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(b);
                  }}
                  className="text-slate-600 hover:text-rose-400 p-1 rounded group-hover:block"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )
        ) : (
          annotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-center gap-2">
              <MessageSquare size={20} className="text-slate-650" />
              <span>No private annotations saved yet</span>
            </div>
          ) : (
            annotations.map(a => (
              <div
                key={a.id}
                onClick={() => onSelectRemedy(a.passageId.includes("aconitum") ? "aconitum-napellus" : a.passageId.includes("belladonna") ? "belladonna" : "bryonia")}
                className="p-3 bg-slate-950/60 border border-slate-850 hover:border-slate-700 hover:bg-slate-900/65 rounded-2xl cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-blue-400 font-bold bg-blue-950/30 px-1.5 py-0.5 rounded">
                    {a.annotationType}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAnnotation(a.id);
                    }}
                    className="text-slate-650 hover:text-rose-400 p-0.5 rounded group-hover:block"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-slate-200 text-xs italic">"{a.noteText}"</p>
                <div className="text-[10px] text-slate-500 flex justify-between font-mono">
                  <span className="capitalize">{a.passageId.replace("james-tyler-kent_", "").replace("_passage", "").replace("-", " ")}</span>
                  <span>{new Date(a.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Guest Mode Protection Banner */}
      {!user && onClearGuestData && (
        <div className="mt-4 pt-3 border-t border-slate-850">
          {showClearConfirm ? (
            <div className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2 text-[10px]">
              <div className="flex items-start gap-1.5 text-rose-400">
                <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
                <span>Clear all bookmarks and notes stored on this device? This cannot be undone.</span>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    onClearGuestData();
                    setShowClearConfirm(false);
                  }}
                  className="px-2 py-0.5 bg-rose-650 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-[10px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-850 rounded-2xl gap-2">
              <span className="text-[10px] text-slate-500 italic">Saved on this device only</span>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-[9px] uppercase font-bold tracking-wider text-rose-500 hover:text-rose-400 focus:outline-none"
              >
                Clear Data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default PrivateWorkspacePanel;
