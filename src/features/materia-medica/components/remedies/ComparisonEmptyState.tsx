import React from "react";
import { Plus } from "lucide-react";

export const ComparisonEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/10 border border-slate-800 rounded-3xl min-h-[300px]">
      <Plus size={32} className="text-slate-500 mb-3" />
      <span className="text-sm font-bold text-slate-350">Remedy Comparison Workspace is Empty</span>
      <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
        Select up to 3 approved remedies from the search results or book catalog above to evaluate their symptoms and clinical records side-by-side.
      </p>
      <span className="text-[10px] text-amber-500/80 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded mt-4">
        Kent's 1911 Approved Sample Corpus
      </span>
    </div>
  );
};
export default ComparisonEmptyState;
