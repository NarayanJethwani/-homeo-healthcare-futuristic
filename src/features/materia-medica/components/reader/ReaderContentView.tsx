import React, { useState } from "react";
import { ReaderPreferences, FONT_SIZE_MAPPING, LINE_HEIGHT_MAPPING, COLUMN_WIDTH_MAPPING } from "../../reader/preferences";
import { MateriaMedicaBookmark, MateriaMedicaAnnotation, PersistenceState } from "../../types/persistenceTypes";
import { Bookmark, MessageSquare, Trash2, Edit, CheckCircle, RefreshCw, AlertTriangle, X } from "lucide-react";
import { featureFlags } from "../../../dashboard/constants/featureFlags";
import { auth } from "@/lib/firebase";

type ReaderContentViewProps = {
  selectedRemedyTitle: string | null;
  selectedRemedyContent: string | null;
  preferences: ReaderPreferences;
  bookTitle: string;
  bookAuthor: string;
  bookYear: number;
  // Phase 6 addition
  bookId?: string;
  sourceVersionId?: string;
  passageId?: string;
  blocks?: Array<{ type: string; level?: number; text: string }>;
  bookmarks?: MateriaMedicaBookmark[];
  annotations?: MateriaMedicaAnnotation[];
  onToggleBookmark?: (blockId?: string) => Promise<void>;
  onSaveAnnotation?: (annotation: MateriaMedicaAnnotation) => Promise<PersistenceState>;
  onDeleteAnnotation?: (annotationId: string) => Promise<PersistenceState>;
};

// Robust HTML Sanitizer to prevent XSS attacks on proving texts
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  let clean = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");
  clean = clean.replace(/on\w+\s*=\s*(['"])(.*?)\1/gi, "");
  clean = clean.replace(/on\w+\s*=\s*([^>\s]+)/gi, "");
  clean = clean.replace(/href\s*=\s*(['"])javascript:.*?\1/gi, 'href="#"');
  return clean;
}

export function getDeterministicBlockId(index: number, text: string): string {
  let hash = 0;
  const str = index + "_" + text;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return "block_" + Math.abs(hash).toString(16);
}

export function getSimpleTextChecksum(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export const ReaderContentView: React.FC<ReaderContentViewProps> = ({
  selectedRemedyTitle,
  selectedRemedyContent,
  preferences,
  bookTitle,
  bookAuthor,
  bookYear,
  bookId = "",
  sourceVersionId = "",
  passageId = "",
  blocks = [],
  bookmarks = [],
  annotations = [],
  onToggleBookmark,
  onSaveAnnotation,
  onDeleteAnnotation,
}) => {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [activeNoteText, setActiveNoteText] = useState("");
  const [activeCategory, setActiveCategory] = useState<MateriaMedicaAnnotation["annotationType"]>("personal");
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showCancelWarningBlockId, setShowCancelWarningBlockId] = useState<string | null>(null);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);
  const [syncStates, setSyncStates] = useState<Record<string, PersistenceState>>({});

  const contentStyle = {
    fontSize: FONT_SIZE_MAPPING[preferences.fontSize],
    lineHeight: LINE_HEIGHT_MAPPING[preferences.lineHeight],
    maxWidth: COLUMN_WIDTH_MAPPING[preferences.columnWidth],
  } as React.CSSProperties;

  const isWorkspaceEnabled = featureFlags.MATERIA_MEDICA_PRIVATE_WORKSPACE;

  if (!selectedRemedyTitle || !selectedRemedyContent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--reader-surface)] border border-[var(--reader-border)] rounded-3xl min-h-[350px] shadow-sm">
        <span className="text-xl font-serif text-[var(--reader-text)] font-bold">Select a section to begin reading</span>
        <p className="text-sm text-[var(--reader-muted)] max-w-sm mt-2 leading-relaxed">
          Choose a section from the index on the left to open the source-verified text from {bookTitle}.
        </p>
      </div>
    );
  }

  const handleStartEdit = (blockId: string, text: string, existing?: MateriaMedicaAnnotation) => {
    setEditingBlockId(blockId);
    if (existing) {
      setActiveNoteText(existing.noteText || "");
      setActiveCategory(existing.annotationType);
      setEditingAnnotationId(existing.id);
    } else {
      setActiveNoteText("");
      setActiveCategory("personal");
      setEditingAnnotationId(null);
    }
    setIsDirty(false);
    setShowCancelWarningBlockId(null);
  };

  const handleCancelEdit = (blockId: string) => {
    if (isDirty) {
      setShowCancelWarningBlockId(blockId);
    } else {
      setEditingBlockId(null);
      setShowCancelWarningBlockId(null);
    }
  };

  const forceCancelEdit = () => {
    setEditingBlockId(null);
    setShowCancelWarningBlockId(null);
    setIsDirty(false);
  };

  const handleSave = async (blockId: string, blockText: string) => {
    if (!onSaveAnnotation) return;

    // Check for HTML tags
    const htmlRegex = /<[^>]*>/g;
    if (htmlRegex.test(activeNoteText)) {
      alert("HTML tags are not allowed in annotations.");
      return;
    }

    const user = auth.currentUser;
    const practitionerId = user?.uid || "guest";
    const annId = editingAnnotationId || `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const annotation: MateriaMedicaAnnotation = {
      id: annId,
      practitionerId,
      bookId,
      sourceVersionId,
      passageId,
      blockId,
      annotationType: activeCategory,
      noteText: activeNoteText,
      selectedText: blockText,
      anchor: {
        startOffset: 0,
        endOffset: blockText.length,
        textChecksum: getSimpleTextChecksum(blockText)
      },
      anchorState: "valid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revision: 0
    };

    setSyncStates(prev => ({ ...prev, [annId]: "saving" }));
    const resultState = await onSaveAnnotation(annotation);
    setSyncStates(prev => ({ ...prev, [annId]: resultState }));

    if (resultState !== "failed" && resultState !== "conflict") {
      setEditingBlockId(null);
      setIsDirty(false);
    } else {
      alert(resultState === "conflict"
        ? "This note was changed elsewhere. Refresh it before saving again."
        : "The note could not be saved. Please try again.");
    }
  };

  const handleDelete = async (annotationId: string) => {
    if (!onDeleteAnnotation) return;
    setSyncStates(prev => ({ ...prev, [annotationId]: "saving" }));
    const resultState = await onDeleteAnnotation(annotationId);
    setSyncStates(prev => ({ ...prev, [annotationId]: resultState }));
    setShowDeleteConfirmId(null);
  };

  const sanitized = sanitizeHtml(selectedRemedyContent);

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 bg-[var(--reader-surface)] border border-[var(--reader-border)] rounded-3xl min-h-[400px] shadow-sm">
      <article className="prose prose-slate mx-auto w-full" style={contentStyle}>
        <div className="border-b border-[var(--reader-border)] pb-6 mb-6">
          <h1 className="text-3xl font-serif font-bold text-[var(--reader-accent)] mb-2 leading-tight">
            {selectedRemedyTitle}
          </h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[var(--reader-muted)] font-mono text-[10px] uppercase tracking-wider">
            <span>{bookTitle}</span>
            <span>·</span>
            <span>By {bookAuthor} ({bookYear})</span>
          </div>
        </div>

        {isWorkspaceEnabled && blocks.length > 0 ? (
          <div className="reader-proving-content font-serif text-[var(--reader-text)] leading-relaxed space-y-6">
            {blocks.map((block, idx) => {
              const blockId = getDeterministicBlockId(idx, block.text);
              const isBookmarkedFlag = bookmarks.some(b => b.blockId === blockId || (!b.blockId && block.type === "heading"));
              const activeAnnotation = annotations.find(a => a.blockId === blockId);
              const isEditing = editingBlockId === blockId;

              const isHeading = block.type === "heading";
              const isSectionLabel = block.type === "section-label";

              return (
                <div key={blockId} className="group relative block-container pr-8 hover:bg-slate-950/20 rounded p-2 transition-all">
                  {/* Block content */}
                  {isHeading ? (
                    <h3 className="text-xl font-bold text-[var(--reader-text)]">{block.text}</h3>
                  ) : isSectionLabel ? (
                    <h4 className="text-md font-bold text-[var(--reader-muted)] mt-4 mb-2">{block.text}</h4>
                  ) : (
                    <p className="text-[var(--reader-text)] text-sm leading-relaxed">{block.text}</p>
                  )}

                  {/* Actions (Bookmark + Notes) */}
                  <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1 bg-slate-900/90 border border-slate-850 px-1.5 py-0.5 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => onToggleBookmark && onToggleBookmark(blockId)}
                      title={isBookmarkedFlag ? "Remove Bookmark" : "Add Bookmark"}
                      className={`p-1 rounded hover:bg-slate-850 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500/50 ${
                        isBookmarkedFlag ? "text-amber-500" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Bookmark size={14} className={isBookmarkedFlag ? "fill-amber-500" : ""} />
                    </button>
                    <button
                      onClick={() => handleStartEdit(blockId, block.text, activeAnnotation)}
                      title={activeAnnotation ? "Edit Annotation" : "Add Annotation"}
                      className={`p-1 rounded hover:bg-slate-850 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500/50 ${
                        activeAnnotation ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>

                  {/* Note display */}
                  {activeAnnotation && !isEditing && (
                    <div className="mt-3 p-3 bg-slate-950/80 border-l-2 border-blue-500/80 rounded-r-xl space-y-1.5 shadow-sm text-xs font-sans">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-blue-400 font-bold bg-blue-950/30 px-1.5 py-0.5 rounded">
                          {activeAnnotation.annotationType} Note
                        </span>
                        <div className="flex items-center gap-2">
                          {/* Sync state indicator */}
                          <span className="flex items-center gap-1 font-mono text-[9px] text-slate-500">
                            {syncStates[activeAnnotation.id] === "saving" ? (
                              <>
                                <RefreshCw size={8} className="animate-spin" /> Saving
                              </>
                            ) : syncStates[activeAnnotation.id] === "offline-pending" ? (
                              <>
                                <AlertTriangle size={8} className="text-amber-500" /> Offline Pending
                              </>
                            ) : auth.currentUser ? (
                              <>
                                <CheckCircle size={8} className="text-green-500" /> Synced
                              </>
                            ) : (
                              <>
                                <AlertTriangle size={8} className="text-slate-500" /> Saved to device only
                              </>
                            )}
                          </span>
                          <button
                            onClick={() => handleStartEdit(blockId, block.text, activeAnnotation)}
                            className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirmId(activeAnnotation.id)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-300 italic font-sans pr-4">{activeAnnotation.noteText}</p>

                      {/* Delete Confirmation Overlay */}
                      {showDeleteConfirmId === activeAnnotation.id && (
                        <div className="mt-2 p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-4">
                          <span className="text-[10px] text-slate-400 font-bold">Delete this note?</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(activeAnnotation.id)}
                              className="px-2 py-0.5 bg-rose-650 hover:bg-rose-700 text-white rounded text-[10px]"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirmId(null)}
                              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Note Editor */}
                  {isEditing && (
                    <div className="mt-3 p-4 bg-slate-950/90 border border-slate-800/80 rounded-2xl space-y-3 shadow-md font-sans text-xs">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Note Category
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {(["keynote", "mental", "general", "modality", "causation", "clinical", "differential", "personal"] as const).map(cat => (
                            <button
                              key={cat}
                              onClick={() => {
                                setActiveCategory(cat);
                                setIsDirty(true);
                              }}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize border transition-all ${
                                activeCategory === cat
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold"
                                  : "bg-slate-900 text-slate-400 border-slate-850 hover:border-slate-700"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Practitioner Note (Plain Text Only)
                        </label>
                        <textarea
                          rows={3}
                          value={activeNoteText}
                          onChange={(e) => {
                            setActiveNoteText(e.target.value);
                            setIsDirty(true);
                          }}
                          placeholder="Add clinical or personal annotation here..."
                          maxLength={2000}
                          className="w-full p-2.5 bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none font-sans"
                        />
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{2000 - activeNoteText.length} characters remaining</span>
                          <span>
                            {auth.currentUser
                              ? "Private to your practitioner account"
                              : "Stored only on this device and not synchronized"}
                          </span>
                        </div>
                      </div>

                      {/* Cancel warning block */}
                      {showCancelWarningBlockId === blockId && (
                        <div className="p-2 bg-amber-950/20 border border-amber-900/40 rounded-lg flex items-center justify-between gap-4">
                          <span className="text-[10px] text-amber-400 flex items-center gap-1">
                            <AlertTriangle size={10} /> Discard unsaved changes?
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={forceCancelEdit}
                              className="px-2 py-0.5 bg-amber-600/80 hover:bg-amber-600 text-white rounded text-[10px]"
                            >
                              Discard
                            </button>
                            <button
                              onClick={() => setShowCancelWarningBlockId(null)}
                              className="px-2 py-0.5 bg-slate-850 text-slate-300 rounded text-[10px]"
                            >
                              Resume
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => handleCancelEdit(blockId)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-850 flex items-center gap-1"
                        >
                          <X size={10} /> Cancel
                        </button>
                        <button
                          onClick={() => handleSave(blockId, block.text)}
                          disabled={!activeNoteText.trim()}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg text-[10px] flex items-center gap-1 shadow"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="reader-proving-content font-serif text-[var(--reader-text)] leading-relaxed space-y-6 [&_h3]:text-[var(--reader-text)] [&_h4]:text-[var(--reader-muted)] [&_p]:text-[var(--reader-text)]"
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
        )}
      </article>
    </div>
  );
};
export default ReaderContentView;
