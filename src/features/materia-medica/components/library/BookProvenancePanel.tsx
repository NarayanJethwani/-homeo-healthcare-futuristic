import React, { useEffect } from "react";
import { X, ShieldCheck, FileText, ExternalLink, Calendar } from "lucide-react";
import { MateriaMedicaBook } from "../../types";

type BookProvenancePanelProps = {
  book: MateriaMedicaBook | null;
  onClose: () => void;
};

export const BookProvenancePanel: React.FC<BookProvenancePanelProps> = ({
  book,
  onClose,
}) => {
  // Split source provider host
  const provider = React.useMemo(() => {
    if (!book) return "Unknown Registry Provider";
    try {
      const url = new URL(book.sourceUrl);
      return url.hostname.replace("www.", "");
    } catch {
      return "Unknown Registry Provider";
    }
  }, [book]);

  // Escape key close behavior & body-scroll locking
  useEffect(() => {
    if (!book) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [book, onClose]);

  if (!book) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provenance-dialog-title"
    >
      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <ShieldCheck size={20} />
            </span>
            <h2 id="provenance-dialog-title" className="text-lg font-bold text-slate-100">Edition Provenance Registry</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800/80 text-slate-400 hover:text-slate-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Close provenance details panel"
            autoFocus
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          {/* Work Summary */}
          <div>
            <h3 className="text-base font-bold text-slate-100 leading-snug mb-1">{book.title}</h3>
            <p className="text-xs text-slate-400">Written by <span className="text-slate-300 font-semibold">{book.author}</span></p>
          </div>

          {/* Audit Metrics Table */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 border-b border-slate-900 px-4 py-3 text-xs">
              <span className="text-slate-400 font-medium">Record ID</span>
              <span className="col-span-2 text-slate-200 font-mono truncate">{book.id}</span>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-900 px-4 py-3 text-xs">
              <span className="text-slate-400 font-medium">Source Edition Year</span>
              <span className="col-span-2 text-slate-200 font-mono">{book.year}</span>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-900 px-4 py-3 text-xs">
              <span className="text-slate-400 font-medium">Source Version</span>
              <span className="col-span-2 text-slate-200 font-mono">v{book.sourceVersion}</span>
            </div>

            {book.versionId && (
              <div className="grid grid-cols-3 border-b border-slate-900 px-4 py-3 text-xs">
                <span className="text-slate-400 font-medium">Version UID</span>
                <span className="col-span-2 text-slate-200 font-mono truncate">{book.versionId}</span>
              </div>
            )}

            <div className="grid grid-cols-3 border-b border-slate-900 px-4 py-3 text-xs">
              <span className="text-slate-400 font-medium">Rights Status</span>
              <span className="col-span-2">
                <span className="px-2 py-0.5 border border-slate-800 text-[10px] uppercase font-mono rounded bg-slate-900 text-slate-300">
                  {book.rightsStatus.replace("-", " ")}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-900 px-4 py-3 text-xs">
              <span className="text-slate-400 font-medium">Editorial Status</span>
              <span className="col-span-2">
                <span className="px-2 py-0.5 border border-slate-800 text-[10px] uppercase font-mono rounded bg-slate-900 text-slate-300">
                  {book.editorialStatus.replace("-", " ")}
                </span>
              </span>
            </div>

            {book.checksum && (
              <div className="grid grid-cols-3 border-b border-slate-900 px-4 py-3 text-xs">
                <span className="text-slate-400 font-medium">Source Checksum</span>
                <span className="col-span-2 text-slate-300 font-mono truncate text-[10px]">{book.checksum}</span>
              </div>
            )}

            <div className="grid grid-cols-3 px-4 py-3 text-xs">
              <span className="text-slate-400 font-medium">Registry URL</span>
              <span className="col-span-2">
                <a
                  href={book.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline truncate max-w-full font-medium"
                >
                  {provider}
                  <ExternalLink size={11} />
                </a>
              </span>
            </div>
          </div>

          {/* Legal Rights Basis */}
          <div className="p-4 bg-slate-950/20 border border-slate-800/60 rounded-2xl">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-1.5">
              <FileText size={14} className="text-amber-500" />
              Rights & Verification Notes
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {book.provenanceNotes || "No audit details recorded. Rights review pending clinical-legal validation."}
            </p>
          </div>

          {/* Ingestion Audit */}
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 text-blue-400 rounded-2xl flex gap-3">
            <Calendar size={18} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Ingestion Audit</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                Last reviewed on <span className="font-semibold text-slate-300">{book.lastUpdated.split("T")[0]}</span>. This record serves as a validated metadata schema stub. No external scraping, OCR extraction, or indexing occurs without active permissions checks.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t border-slate-800/80 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-650"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </div>
  );
};
