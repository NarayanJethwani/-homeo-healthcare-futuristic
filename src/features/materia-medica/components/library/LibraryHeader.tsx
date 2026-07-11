import React from "react";
import { Search, ShieldAlert, BookOpen, Layers } from "lucide-react";

type LibraryHeaderProps = {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  totalBooks: number;
  filteredCount: number;
};

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  searchTerm,
  onSearchChange,
  totalBooks,
  filteredCount,
}) => {
  return (
    <header className="relative flex flex-col gap-6 p-8 bg-slate-950/80 backdrop-blur-lg border border-slate-800 rounded-3xl shadow-3xl mb-8 overflow-hidden">
      {/* Decorative backdrop gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <BookOpen size={24} />
            </span>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
              Materia Medica Online Library
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Access governed, verified public domain and licensed historical homeopathic reference literature. Each work undergoes a strict licensing, checksum, and editorial approval workflow prior to ingestion.
          </p>
        </div>

        {/* Source & Rights Transparency Panel */}
        <div className="flex items-center gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl md:max-w-xs transition-all hover:border-slate-700">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Editorial Provenance</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Every registry record maps directly to audited public domain archives. No unverified third-party scraping permitted.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 pt-6 border-t border-slate-900 relative z-10">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search books by title, author, year, category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 hover:bg-slate-900/80 focus:bg-slate-900 text-slate-100 placeholder-slate-500 text-sm border border-slate-800 focus:border-amber-500/50 rounded-xl transition-all focus:ring-1 focus:ring-amber-500/20 focus:outline-none"
            aria-label="Search governed books catalog"
          />
        </div>

        {/* Library Stats */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/30 border border-slate-800/40 rounded-lg px-3 py-1.5 self-start sm:self-auto">
          <Layers size={14} className="text-amber-500/70" />
          <span>Catalog:</span>
          <span className="text-amber-400 font-semibold">{filteredCount}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{totalBooks} works</span>
        </div>
      </div>
    </header>
  );
};
