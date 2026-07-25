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
  const getIndexLabel = (name: string) => {
    const structuralSection = name.match(/·\s*Section\s+\d+\s+—\s+(.+)$/i);
    return structuralSection?.[1]?.trim() || name.trim();
  };

  const groupId = (key: string) => `remedy-group-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const isAphorismIndex = remedies.length > 0 && remedies.every((remedy) =>
    /^Aphorism §\s*\d+/i.test(getIndexLabel(remedy.name))
  );

  const aphorismGroup = (name: string) => {
    const number = Number(getIndexLabel(name).match(/§\s*(\d+)/)?.[1]);
    if (!Number.isFinite(number)) return "Other";
    if (number < 50) return "1–49";
    const start = Math.floor(number / 50) * 50;
    return `${start}–${Math.min(start + 49, 291)}`;
  };

  // Filter remedies based on case-insensitive search
  const filteredRemedies = remedies.filter((r) =>
    `${getIndexLabel(r.name)} ${r.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group remedies alphabetically, or Organon aphorisms into readable numeric ranges.
  const groupedRemedies: Record<string, LegacyRemedyEntry[]> = {};
  filteredRemedies.forEach((r) => {
    const group = isAphorismIndex ? aphorismGroup(r.name) : getIndexLabel(r.name).charAt(0).toUpperCase();
    if (!groupedRemedies[group]) {
      groupedRemedies[group] = [];
    }
    groupedRemedies[group].push(r);
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const availableLetters = new Set(remedies.map((r) => getIndexLabel(r.name).charAt(0).toUpperCase()));
  const aphorismRanges = ["1–49", "50–99", "100–149", "150–199", "200–249", "250–291"];
  const quickGroups = isAphorismIndex ? aphorismRanges : alphabet;

  return (
    <aside className="flex flex-col bg-[var(--reader-surface)] text-[var(--reader-text)] border border-[var(--reader-border)] p-5 rounded-3xl h-[650px] select-none shadow-sm" aria-label="Remedy index">
      
      {/* Search Input */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--reader-muted)]">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search remedies and sections..."
          className="w-full pl-9 pr-4 py-2 bg-[var(--reader-control)] border border-[var(--reader-border)] focus:border-[var(--reader-accent)] rounded-xl text-sm text-[var(--reader-text)] placeholder:text-[var(--reader-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--reader-accent-surface)] transition-all"
        />
      </div>

      {/* Alphabet or aphorism-range quick navigation */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-[var(--reader-border)] pb-3 mb-4">
        {quickGroups.map((group) => {
          const exists = isAphorismIndex ? remedies.some((remedy) => aphorismGroup(remedy.name) === group) : availableLetters.has(group);
          return (
            <button
              key={group}
              disabled={!exists}
              onClick={() => onJumpToLetter(group)}
              aria-label={isAphorismIndex ? `Jump to aphorisms ${group}` : `Jump to letter ${group}`}
              className={`${isAphorismIndex ? "min-w-12 px-1.5" : "w-6"} h-6 flex items-center justify-center rounded text-[10px] font-bold uppercase transition-all focus:outline-none ${
                exists
                  ? "text-[var(--reader-muted)] hover:text-[var(--reader-accent)] hover:bg-[var(--reader-control)] cursor-pointer"
                  : "text-[var(--reader-subtle)] opacity-55 cursor-not-allowed"
              }`}
            >
              {group}
            </button>
          );
        })}
      </div>

      {/* Remedies List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 scroll-smooth" data-lenis-prevent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-[var(--reader-muted)]">
            <Loader2 size={24} className="animate-spin text-[var(--reader-accent)]" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Loading book sections...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center p-4 gap-2 text-rose-500 border border-rose-950/40 bg-rose-950/5 rounded-2xl h-48">
            <AlertCircle size={24} />
            <span className="text-xs font-bold">{error}</span>
          </div>
        ) : filteredRemedies.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-[var(--reader-muted)] text-xs italic">
            No matching sections found
          </div>
        ) : (
          Object.keys(groupedRemedies)
            .sort((a, b) => isAphorismIndex ? Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]) : a.localeCompare(b))
            .map((group) => (
              <div key={group} id={groupId(group)} className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[var(--reader-accent)] bg-[var(--reader-accent-surface)] px-2 py-0.5 rounded border border-[var(--reader-border)] w-fit select-none">
                  {group}
                </div>
                <div className="space-y-1 pl-1">
                  {groupedRemedies[group].map((rem) => (
                    <button
                      key={rem.path}
                      onClick={() => onSelectRemedy(rem.path)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-serif transition-all focus:outline-none cursor-pointer border ${
                        selectedRemedyPath === rem.path
                          ? "bg-[var(--reader-accent-surface)] border-[var(--reader-accent)] text-[var(--reader-accent)] font-bold"
                          : "border-transparent text-[var(--reader-text)] hover:bg-[var(--reader-control)] hover:border-[var(--reader-border)]"
                      }`}
                    >
                      {getIndexLabel(rem.name)}
                    </button>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

    </aside>
  );
};
export default ReaderIndexPanel;
