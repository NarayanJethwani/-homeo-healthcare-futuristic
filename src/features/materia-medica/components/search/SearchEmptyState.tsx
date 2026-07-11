import React from "react";
import { Info } from "lucide-react";

type SearchEmptyStateProps = {
  searchTerm: string;
};

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/10 border border-slate-800 rounded-3xl min-h-[300px]">
      <Info size={32} className="text-slate-500 mb-3" />
      <span className="text-sm font-bold text-slate-300">
        {searchTerm ? `No matches found for "${searchTerm}"` : "Enter a search term to begin"}
      </span>
      <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
        Search and comparison currently cover a limited, approved sample corpus of three remedies from Kent’s 1911 edition.
      </p>
    </div>
  );
};
export default SearchEmptyState;
