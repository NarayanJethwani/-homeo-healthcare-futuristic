import React from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";

type FilterState = {
  author: string;
  yearRange: string;
  sourceProvider: string;
  rightsStatus: string;
  editorialStatus: string;
  ingestionStatus: string;
};

type LibraryFiltersProps = {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, val: string) => void;
  onClearFilters: () => void;
  availableAuthors: string[];
  availableProviders: string[];
  availableYears: number[];
};

export const LibraryFilters: React.FC<LibraryFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  availableAuthors,
  availableProviders,
  availableYears,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);


  return (
    <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl transition-all">
      {/* Header Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-900/20 select-none rounded-t-2xl"
      >
        <div className="flex items-center gap-2 text-slate-200 font-medium text-sm">
          <SlidersHorizontal size={16} className="text-amber-500" />
          <span>Search Filters</span>
          {(filters.author || filters.yearRange || filters.sourceProvider || filters.rightsStatus || filters.editorialStatus || filters.ingestionStatus) && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>

        <div className="flex items-center gap-4">
          {(filters.author || filters.yearRange || filters.sourceProvider || filters.rightsStatus || filters.editorialStatus || filters.ingestionStatus) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-500/80 hover:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/20 rounded-md transition-all"
              aria-label="Clear active filters"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
          <span className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
            <ChevronDown size={16} />
          </span>
        </div>
      </div>

      {/* Filter Body */}
      {isOpen && (
        <div className="p-5 border-t border-slate-900/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Author Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Author</label>
            <select
              value={filters.author}
              onChange={(e) => onFilterChange("author", e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500/40 text-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              <option value="">All Authors</option>
              {availableAuthors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* Historical Epochs / Years Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Historical Epoch / Year</label>
            <select
              value={filters.yearRange}
              onChange={(e) => onFilterChange("yearRange", e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500/40 text-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              <option value="">All Times</option>
              <optgroup label="Centuries">
                <option value="1800-1899">19th Century (1800 – 1899)</option>
                <option value="1900-1999">20th Century (1900 – 1999)</option>
              </optgroup>
              <optgroup label="Historical Epochs">
                <option value="1800-1850">Early Pioneer Period (1800 – 1850)</option>
                <option value="1851-1880">Proving & Golden Era (1851 – 1880)</option>
                <option value="1881-1900">Late 19th Century (1881 – 1900)</option>
                <option value="1901-1910">Early 20th Century (1901 – 1910)</option>
                <option value="1911-1930">Post-Kentian Epoch (1911 – 1930)</option>
              </optgroup>
              <optgroup label="Exact Publication Years">
                {availableYears.map((year) => (
                  <option key={year} value={`${year}-${year}`}>
                    {year}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Source Provider Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Source Registry Provider</label>
            <select
              value={filters.sourceProvider}
              onChange={(e) => onFilterChange("sourceProvider", e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500/40 text-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              <option value="">All Providers</option>
              <option value="archive.org">Internet Archive (archive.org)</option>
              {availableProviders.filter(p => p !== "archive.org").map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* Rights Status Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Rights Status</label>
            <select
              value={filters.rightsStatus}
              onChange={(e) => onFilterChange("rightsStatus", e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500/40 text-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              <option value="">All Rights</option>
              <option value="public-domain">Public Domain</option>
              <option value="licensed">Licensed</option>
              <option value="rights-review-required">Rights Review Required</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          {/* Editorial Approval Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Editorial Approval Status</label>
            <select
              value={filters.editorialStatus}
              onChange={(e) => onFilterChange("editorialStatus", e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500/40 text-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="draft">Draft / Pending Review</option>
              <option value="needs-review">Needs Medical Review</option>
              <option value="rejected">Rejected / Blocked</option>
            </select>
          </div>

          {/* Ingestion Availability Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Ingestion Availability</label>
            <select
              value={filters.ingestionStatus}
              onChange={(e) => onFilterChange("ingestionStatus", e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 focus:border-amber-500/40 text-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all cursor-pointer"
            >
              <option value="">All Availability</option>
              <option value="approved">Available to Read (Approved)</option>
              <option value="not-ingested">Preparation Pending (Registered)</option>
              <option value="blocked">Blocked / Restricted</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
