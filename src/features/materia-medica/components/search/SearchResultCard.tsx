import React from "react";
import { BookOpen, FileText, Plus } from "lucide-react";
import { LocalSearchResult } from "../../search/localSearchTypes";

type SearchResultCardProps = {
  result: LocalSearchResult;
  onOpenInReader: (passageId: string) => void;
  onAddToComparison: (remedyId: string) => void;
  onViewProvenance: (result: LocalSearchResult) => void;
};

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  onOpenInReader,
  onAddToComparison,
  onViewProvenance,
}) => {
  const { entry, matchingExcerpt, matchedAliases } = result;

  return (
    <div className="flex flex-col bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 p-5 rounded-2xl transition-all gap-4">
      
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-serif font-bold text-amber-400">
            {entry.remedyDisplayName}
          </h4>
          {matchedAliases.length > 0 && (
            <span className="text-[10px] text-slate-500 font-mono">
              Matched Alias: {matchedAliases.join(", ")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">
          <span>Score: {result.score}</span>
        </div>
      </div>

      {/* Structured safe React rendering of highlighted excerpt (no dangerouslySetInnerHTML!) */}
      <p className="text-xs text-slate-300 leading-relaxed font-serif bg-slate-950/40 p-3 rounded-xl border border-slate-900">
        {matchingExcerpt.truncatedAtStart && "..."}
        {matchingExcerpt.segments.map((seg, idx) =>
          seg.highlighted ? (
            <mark key={idx} className="bg-amber-500/25 text-amber-300 px-0.5 rounded font-bold">
              {seg.text}
            </mark>
          ) : (
            <span key={idx}>{seg.text}</span>
          )
        )}
        {matchingExcerpt.truncatedAtEnd && "..."}
      </p>

      {/* Source Citation Info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <BookOpen size={12} />
          {entry.bookTitle}
        </span>
        <span>·</span>
        <span>By {entry.authorName} ({entry.publicationYear})</span>
        <span>·</span>
        <span>Printed Pages {entry.printedPageStart}-{entry.printedPageEnd}</span>
        <span>·</span>
        <span>Scan Pages {entry.scanPageIndexStart}-{entry.scanPageIndexEnd}</span>
      </div>

      {/* Metadata tags */}
      <div className="flex flex-wrap gap-2 text-[9px] font-mono select-none">
        <span className="bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-wider">
          Source: {entry.sourceVersionId}
        </span>
        <span className="bg-slate-950 border border-amber-500/20 text-amber-500/90 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
          Verified Integrity
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-900">
        <button
          onClick={() => onOpenInReader(entry.passageId)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 border border-transparent rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-950 transition-all cursor-pointer"
        >
          <BookOpen size={12} />
          <span>Open in Reader</span>
        </button>

        <button
          onClick={() => onAddToComparison(entry.remedyId)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-300 hover:text-slate-100 transition-all cursor-pointer"
        >
          <Plus size={12} />
          <span>Add to Comparison</span>
        </button>

        <button
          onClick={() => onViewProvenance(result)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-850 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-all cursor-pointer ml-auto"
        >
          <FileText size={12} />
          <span>View Provenance</span>
        </button>
      </div>

    </div>
  );
};
export default SearchResultCard;
