import React from "react";
import { BookOpen, User, Calendar, Database, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { MateriaMedicaBook } from "../../types";

type BookCardProps = {
  book: MateriaMedicaBook;
  onViewDetails: (book: MateriaMedicaBook) => void;
  onViewAuthor: (authorId: string) => void;
};

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onViewDetails,
  onViewAuthor,
}) => {
  // Parse source provider host
  const provider = React.useMemo(() => {
    try {
      const url = new URL(book.sourceUrl);
      return url.hostname.replace("www.", "");
    } catch {
      return "Unknown Registry Source";
    }
  }, [book.sourceUrl]);

  // Color schemes for rights badges
  const rightsColors = {
    "public-domain": "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    licensed: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    "rights-review-required": "bg-amber-500/10 border-amber-500/20 text-amber-400",
    restricted: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  };

  const editorialColors = {
    approved: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    draft: "bg-slate-500/10 border-slate-500/20 text-slate-400",
    "needs-review": "bg-amber-500/10 border-amber-500/20 text-amber-400",
    rejected: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  };

  const isAvailable = book.ingestionStatus === "approved";
  const isRestricted = book.rightsStatus === "restricted";

  return (
    <article className="flex flex-col h-full bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Book Icon & Badges */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-400 group-hover:text-amber-400 group-hover:border-slate-700 transition-all">
          <BookOpen size={20} />
        </div>
        <div className="flex flex-wrap gap-1.5 justify-end">
          <span className={`text-[10px] font-mono px-2 py-0.5 border rounded-full uppercase tracking-wider ${rightsColors[book.rightsStatus]}`}>
            {book.rightsStatus.replace("-", " ")}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 border rounded-full uppercase tracking-wider ${editorialColors[book.editorialStatus]}`}>
            {book.editorialStatus.replace("-", " ")}
          </span>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-bold text-slate-100 mb-1 leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
          {book.title}
        </h3>
        
        {/* Author link */}
        <button
          onClick={() => onViewAuthor(book.author)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 text-left mb-4 self-start focus:outline-none focus:ring-1 focus:ring-amber-500/20 rounded px-1 -ml-1 transition-all"
          aria-label={`View author profile for ${book.author}`}
        >
          <User size={13} className="text-slate-500" />
          <span className="font-medium line-clamp-1">{book.author}</span>
        </button>

        <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-[11px] text-slate-400 border-t border-slate-900/60 pt-4 mt-auto">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-slate-600" />
            <span>Published:</span>
            <span className="text-slate-300 font-medium">{book.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database size={12} className="text-slate-600" />
            <span>Registry:</span>
            <span className="text-slate-300 font-medium truncate">{provider}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col gap-2.5 border-t border-slate-900/60 pt-4 mt-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-[11px]">
          {isAvailable ? (
            <>
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span className="text-emerald-400 font-semibold font-mono">AVAILABLE TO READ</span>
            </>
          ) : isRestricted ? (
            <>
              <Lock size={13} className="text-rose-400" />
              <span className="text-rose-400 font-semibold font-mono">RESTRICTED SOURCE</span>
            </>
          ) : (
            <>
              <AlertCircle size={13} className="text-slate-500 animate-pulse" />
              <span className="text-slate-400 font-mono font-medium">Content preparation pending</span>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(book)}
            className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-800 hover:border-slate-700 text-xs font-medium rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-slate-700 min-h-[38px] flex items-center justify-center"
          >
            Provenance
          </button>
          
          {isAvailable ? (
            <button
              disabled={true}
              className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 opacity-50 cursor-not-allowed text-slate-950 text-xs font-semibold rounded-lg min-h-[38px] flex items-center justify-center"
            >
              Read Online
            </button>
          ) : (
            <a
              href={book.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-850 hover:border-slate-700 text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1 focus:outline-none focus:ring-1 focus:ring-slate-700 min-h-[38px]"
              aria-label={`Open original source edition at ${provider}`}
            >
              Source Archive
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
