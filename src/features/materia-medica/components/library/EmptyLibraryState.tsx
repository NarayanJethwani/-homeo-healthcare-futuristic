import React from "react";
import { HelpCircle } from "lucide-react";

type EmptyLibraryStateProps = {
  searchTerm: string;
  onClearFilters: () => void;
};

export const EmptyLibraryState: React.FC<EmptyLibraryStateProps> = ({
  searchTerm,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-2xl max-w-lg mx-auto my-8 transition-all hover:border-slate-700/80">
      <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400 mb-4 animate-pulse">
        <HelpCircle size={32} />
      </div>
      <h3 className="text-xl font-semibold text-slate-100 mb-2">No Governed Editions Found</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-sm">
        {searchTerm ? (
          <>
            No records matched your search query <span className="text-amber-300 font-mono">"{searchTerm}"</span> or selected filter options.
          </>
        ) : (
          "No records matched your active filter selections in the governed registry."
        )}
      </p>
      <button
        onClick={onClearFilters}
        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm font-medium rounded-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      >
        Reset Filters
      </button>
    </div>
  );
};
