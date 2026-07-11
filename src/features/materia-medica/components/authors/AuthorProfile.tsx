import React, { useEffect } from "react";
import { X, BookOpen, ShieldAlert } from "lucide-react";
import { MateriaMedicaAuthor, getAuthorRecord } from "../../data/authors";
import { MateriaMedicaBook } from "../../types";

type AuthorProfileProps = {
  authorName: string;
  associatedBooks: MateriaMedicaBook[];
  onClose: () => void;
  onViewBookDetails: (book: MateriaMedicaBook) => void;
};

export const AuthorProfile: React.FC<AuthorProfileProps> = ({
  authorName,
  associatedBooks,
  onClose,
  onViewBookDetails,
}) => {
  // Fetch detailed author profile or construct mock unverified stub
  const authorRecord = React.useMemo(() => {
    return getAuthorRecord(authorName);
  }, [authorName]);

  const fallbackRecord: MateriaMedicaAuthor = {
    id: authorName.toLowerCase().replace(/\s+/g, "-"),
    displayName: authorName,
    verificationStatus: "unverified",
    referenceSources: []
  };

  const record = authorRecord || fallbackRecord;
  const isVerified = record.verificationStatus !== "unverified";

  // Escape key close behavior
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    // Body scroll locking
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all"
      role="dialog"
      aria-modal="true"
      aria-labelledby="author-dialog-title"
    >
      {/* Modal Drawer container */}
      <div className="relative w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <ShieldAlert size={20} />
            </span>
            <h2 id="author-dialog-title" className="text-lg font-bold text-slate-100">Historical Author Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800/80 text-slate-400 hover:text-slate-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Close author profile panel"
            autoFocus
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
          {/* Biography Block */}
          <div>
            <div className="flex items-baseline justify-between gap-4 mb-2">
              <h3 className="text-xl font-bold text-slate-50">{record.displayName}</h3>
              {isVerified && record.birthYear && record.deathYear && (
                <span className="text-xs font-semibold font-mono text-amber-400/90 bg-amber-500/5 px-2.5 py-0.5 border border-amber-500/10 rounded-full">
                  {record.birthYear} – {record.deathYear}
                </span>
              )}
            </div>
            {isVerified && record.biography && (
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                {record.biography}
              </p>
            )}
          </div>

          {/* Associated Works list */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Associated Governed Works</h4>
            <div className="flex flex-col gap-3">
              {associatedBooks.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No works registered for this author in the governed catalog.</p>
              ) : (
                associatedBooks.map((book) => (
                  <div 
                    key={book.id}
                    className="flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-800 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
                      <div>
                        <h5 className="text-xs font-semibold text-slate-200 line-clamp-1">{book.title}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Edition: {book.year} (v{book.sourceVersion})</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewBookDetails(book)}
                      className="px-2.5 py-1 text-[11px] font-medium text-amber-500/90 hover:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 hover:border-amber-500/20 rounded transition-all focus:outline-none"
                    >
                      Provenance
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Source References */}
          {isVerified && record.referenceSources.length > 0 && (
            <div className="p-4 bg-slate-950/20 border border-slate-850 rounded-2xl">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
                <ShieldAlert size={14} className="text-blue-500" />
                Source Verification Bibliography
              </h4>
              <ul className="list-disc list-inside text-[11px] text-slate-400 flex flex-col gap-1.5">
                {record.referenceSources.map((ref, idx) => (
                  <li key={idx} className="leading-snug">
                    <span className="font-semibold text-slate-300">{ref.provider}</span>: {ref.title}
                    {ref.url && (
                      <a 
                        href={ref.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-0.5 ml-1"
                      >
                        [Archive]
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t border-slate-800/80 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-650"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
