import React from "react";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { MateriaMedicaBook } from "../../types";

type ReaderUnavailableStateProps = {
  book: MateriaMedicaBook;
  onBack: () => void;
};

export const ReaderUnavailableState: React.FC<ReaderUnavailableStateProps> = ({
  book,
  onBack,
}) => {
  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn py-6">
      
      {/* Header Back Link */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-slate-100 transition-all focus:outline-none cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span>Library</span>
        </button>
      </div>

      {/* Main Error Box */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center bg-slate-950/40 border border-slate-800/80 rounded-3xl min-h-[400px] max-w-xl mx-auto">
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4 select-none">
          <AlertCircle size={24} />
        </div>
        
        <h2 className="text-xl font-serif font-bold text-slate-200">
          {book.title}
        </h2>
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">
          By {book.author} · Registered stub
        </span>

        <h3 className="text-sm font-bold text-amber-400 mt-6 leading-tight">
          Content Unavailable
        </h3>
        
        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed max-w-sm">
          This publication is currently registered in the database for citation and editorial review, but local text ingestion has not been approved or initiated.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-900 w-full flex flex-col gap-2.5 font-mono text-[9px] text-slate-500 uppercase select-none">
          <div className="flex justify-between">
            <span>License Status:</span>
            <span className="text-slate-400 font-bold">{book.rightsStatus}</span>
          </div>
          <div className="flex justify-between">
            <span>Ingestion Status:</span>
            <span className="text-slate-400 font-bold">{book.ingestionStatus}</span>
          </div>
          <div className="flex justify-between">
            <span>Editorial Status:</span>
            <span className="text-slate-400 font-bold">{book.editorialStatus}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
export default ReaderUnavailableState;
