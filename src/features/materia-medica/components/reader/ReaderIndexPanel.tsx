import React from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { LegacyRemedyEntry } from "./LegacyMateriaMedicaContentAdapter";

type ReaderIndexPanelProps = {
  remedies: LegacyRemedyEntry[];
  selectedRemedyPath: string | null;
  onSelectRemedy: (path: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isLoading: boolean;
  error: string | null;
  onJumpToLetter: (letter: string) => void;
};

export const ReaderIndexPanel: React.FC<ReaderIndexPanelProps> = ({
  remedies,
  selectedRemedyPath,
  onSelectRemedy,
  searchTerm,
  onSearchChange,
  isLoading,
  error,
  onJumpToLetter,
}) => {
  // Filter remedies based on case-insensitive search
  const filteredRemedies = remedies.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group remedies by starting character (e.g. A, B, C)
  const groupedRemedies: Record<string, LegacyRemedyEntry[]> = {};
  filteredRemedies.forEach((r) => {
    const firstChar = r.name.charAt(0).toUpperCase();
    if (!groupedRemedies[firstChar]) {
      groupedRemedies[firstChar] = [];
    }
    groupedRemedies[firstChar].push(r);
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const availableLetters = new Set(remedies.map((r) => r.name.charAt(0).toUpperCase()));

  return (
    <div className="flex flex-col bg-slate-950/40 border border-slate-800 p-5 rounded-3xl h-[650px] select-none">
      
      {/* Search Input */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search remedies..."
          className="w-full pl-9 pr-4 py-2 bg-slate-950 hover:bg-slate-900 focus:bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none transition-all"
        />
      </div>

      {/* Alphabet quick letters */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-slate-800/60 pb-3 mb-4">
        {alphabet.map((letter) => {
          const exists = availableLetters.has(letter);
          return (
            <button
              key={letter}
              disabled={!exists}
              onClick={() => onJumpToLetter(letter)}
              className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold uppercase transition-all focus:outline-none ${
                exists
                  ? "text-slate-400 hover:text-amber-500 hover:bg-slate-900 cursor-pointer"
                  : "text-slate-700 cursor-not-allowed"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Remedies List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 scroll-smooth" data-lenis-prevent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-slate-500">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Loading remedies...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center p-4 gap-2 text-rose-500 border border-rose-950/40 bg-rose-950/5 rounded-2xl h-48">
            <AlertCircle size={24} />
            <span className="text-xs font-bold">{error}</span>
          </div>
        ) : filteredRemedies.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-500 text-xs italic">
            No matching remedies found
          </div>
        ) : (
          Object.keys(groupedRemedies)
            .sort()
            .map((letter) => (
              <div key={letter} id={`remedy-letter-${letter.toLowerCase()}`} className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-amber-500/80 bg-slate-900/30 px-2 py-0.5 rounded border border-slate-800/40 w-fit select-none">
                  {letter}
                </div>
                <div className="space-y-1 pl-1">
                  {groupedRemedies[letter].map((rem) => (
                    <button
                      key={rem.path}
                      onClick={() => onSelectRemedy(rem.path)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-serif transition-all focus:outline-none cursor-pointer border ${
                        selectedRemedyPath === rem.path
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold"
                          : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      {rem.name}
                    </button>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

    </div>
  );
};
export default ReaderIndexPanel;
