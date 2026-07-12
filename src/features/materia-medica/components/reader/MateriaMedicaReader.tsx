import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Loader2, AlertTriangle } from "lucide-react";
import { ReaderBookSelection, SampleMateriaMedicaPassage } from "../../types";
import { useReaderPreferences } from "../../hooks/useReaderPreferences";
import { THEME_CSS_VARIABLES } from "../../reader/preferences";
import { ReaderToolbar } from "./ReaderToolbar";
import { ReaderIndexPanel } from "./ReaderIndexPanel";
import { ReaderContentView } from "./ReaderContentView";
import { ReaderKeyboardShortcuts } from "./ReaderKeyboardShortcuts";
import { ReaderUnavailableState } from "./ReaderUnavailableState";
import { LegacyMateriaMedicaContentAdapter, LegacyRemedyEntry } from "./LegacyMateriaMedicaContentAdapter";
import { GovernedMateriaMedicaRepository } from "../../services/GovernedMateriaMedicaRepository";
import { computeSha256Browser } from "../../services/checksum/checksum.browser";
import { getRegistryBook } from "../../data/registry";
import { featureFlags } from "../../../dashboard/constants/featureFlags";
import Portal from "@/components/Portal";
import { motion, AnimatePresence } from "framer-motion";

type MateriaMedicaReaderProps = {
  selection: ReaderBookSelection;
  onBack: () => void;
};

type PassageLoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "verifying" }
  | { status: "verified"; passage: SampleMateriaMedicaPassage }
  | { status: "failed"; reason: "checksum" | "unapproved" | "deprecated" | "missing" };

export const MateriaMedicaReader: React.FC<MateriaMedicaReaderProps> = ({
  selection,
  onBack,
}) => {
  const { preferences, setPreferences } = useReaderPreferences();
  
  // Dynamic lists for legacy or governed books
  const [remedies, setRemedies] = useState<Array<{ name: string; path: string; passageId?: string }>>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  // Legacy selected remedy
  const [legacyTitle, setLegacyTitle] = useState<string | null>(null);
  const [legacyContent, setLegacyContent] = useState<string | null>(null);

  // Governed selected remedy passage state machine
  const [passageState, setPassageState] = useState<PassageLoadState>({ status: "idle" });

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingIndex, setIsLoadingIndex] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [errorIndex, setErrorIndex] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullscreenTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Determine if sample corpus feature is active for this reading session
  const isSampleCorpusActive = featureFlags.MATERIA_MEDICA_SAMPLE_CORPUS;

  // Load remedy index
  useEffect(() => {
    let active = true;
    const loadIndex = async () => {
      setIsLoadingIndex(true);
      setErrorIndex(null);
      try {
        if (selection.type === "governed") {
          // Check flag
          if (!isSampleCorpusActive) {
            if (active) setRemedies([]);
            return;
          }

          // Discover through repository layer
          const approvedPassages = await GovernedMateriaMedicaRepository.listApprovedPassages(selection.book.id);
          if (active) {
            setRemedies(
              approvedPassages.map((p) => ({
                name: `${p.remedyDisplayName} (Pages ${p.sourcePageRange.printedPageStart}-${p.sourcePageRange.printedPageEnd})`,
                path: p.remedyId,
                passageId: p.id,
              }))
            );
          }
        } else {
          // Legacy content adapter
          const legacyIndex = await LegacyMateriaMedicaContentAdapter.fetchRemediesIndex((selection as any).book?.id || (selection as any).bookId);
          if (active) {
            setRemedies(legacyIndex.map((r) => ({ name: r.name, path: r.path })));
          }
        }
      } catch (err: any) {
        if (active) setErrorIndex(err.message || "Failed to load index.");
      } finally {
        if (active) setIsLoadingIndex(false);
      }
    };

    loadIndex();
    return () => {
      active = false;
    };
  }, [selection, isSampleCorpusActive]);

  // Load content
  useEffect(() => {
    if (!selectedPath) {
      setLegacyTitle(null);
      setLegacyContent(null);
      setPassageState({ status: "idle" });
      return;
    }

    let active = true;

    const loadContent = async () => {
      setIsLoadingContent(true);
      try {
        if (selection.type === "governed") {
          setPassageState({ status: "loading" });
          const matchingRemedy = remedies.find((r) => r.path === selectedPath);
          if (!matchingRemedy || !matchingRemedy.passageId) {
            if (active) setPassageState({ status: "failed", reason: "missing" });
            return;
          }

          const passage = await GovernedMateriaMedicaRepository.getApprovedPassage(matchingRemedy.passageId);
          if (!passage) {
            if (active) setPassageState({ status: "failed", reason: "unapproved" });
            return;
          }

          if (active) setPassageState({ status: "verifying" });

          // Run browser-side verification (defense in depth integrity check)
          const computedOriginalHash = await computeSha256Browser(passage.originalText);
          const computedNormalizedHash = await computeSha256Browser(passage.normalizedText);
          const computedBlocksHash = await computeSha256Browser(JSON.stringify(passage.blocks));

          const integrityValid =
            computedOriginalHash === passage.originalTextChecksum &&
            computedNormalizedHash === passage.normalizedTextChecksum &&
            computedBlocksHash === passage.blocksChecksum;

          if (!integrityValid) {
            console.error(`Passage checksum mismatch detected for passage ID: ${passage.id}`);
            if (active) setPassageState({ status: "failed", reason: "checksum" });
            return;
          }

          if (active) setPassageState({ status: "verified", passage });
        } else {
          // Legacy
          const data = await LegacyMateriaMedicaContentAdapter.fetchRemedyContent(selection.bookId, selectedPath);
          if (active) {
            setLegacyTitle(data.title);
            setLegacyContent(data.content);
          }
        }
      } catch (err: any) {
        if (active) {
          if (selection.type === "governed") {
            setPassageState({ status: "failed", reason: "checksum" });
          } else {
            setLegacyTitle("Error");
            setLegacyContent(`<p class="text-rose-500 font-bold">${err.message || "Failed to load remedy proving content."}</p>`);
          }
        }
      } finally {
        if (active) setIsLoadingContent(false);
      }
    };

    loadContent();
    return () => {
      active = false;
    };
  }, [selection, selectedPath, remedies]);

  // Body scroll lock on fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isFullscreen]);

  const handleJumpToLetter = (letter: string) => {
    const el = document.getElementById(`remedy-letter-${letter.toLowerCase()}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // If governed and sample corpus is disabled OR no approved passages exist, show unavailable state
  if (selection.type === "governed" && (!isSampleCorpusActive || remedies.length === 0)) {
    return <ReaderUnavailableState book={selection.book} onBack={onBack} />;
  }

  const book = selection.type === "governed" ? selection.book : getRegistryBook(selection.bookId);
  if (!book) {
    return <div role="alert">This registered book is unavailable.</div>;
  }

  const handleToggleFullscreen = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      setTimeout(() => {
        fullscreenTriggerRef.current?.focus();
      }, 50);
    } else {
      setIsFullscreen(true);
    }
  };

  const themeVars = THEME_CSS_VARIABLES[preferences.theme];
  const scopedStyles = {
    "--reader-bg": themeVars.bg,
    "--reader-text": themeVars.text,
    "--reader-border": themeVars.border,
    background: "var(--reader-bg)",
    color: "var(--reader-text)",
    borderColor: "var(--reader-border)",
  } as React.CSSProperties;

  // Render passage content based on verification status
  const renderPassageView = () => {
    if (selection.type === "governed") {
      switch (passageState.status) {
        case "loading":
        case "verifying":
          return (
            <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] gap-2 text-slate-500 bg-slate-900/10 border border-slate-800 rounded-3xl">
              <Loader2 size={32} className="animate-spin text-amber-500" />
              <span className="text-xs font-bold">Verifying content integrity...</span>
            </div>
          );
        case "failed":
          return (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center border border-rose-950/40 bg-rose-950/5 rounded-3xl min-h-[300px] max-w-lg mx-auto">
              <AlertTriangle size={36} className="text-rose-500 mb-3" />
              <h4 className="text-rose-400 font-bold text-sm">Content unavailable — integrity verification failed.</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                This passage was not displayed because it failed cryptographic verification or metadata approval policies. Please report the issue to an administrator.
              </p>
            </div>
          );
        case "verified":
          const contentHtml = passageState.passage.blocks
            .map((b) => {
              if (b.type === "heading") return `<h3>${b.text}</h3>`;
              if (b.type === "section-label") return `<h4>${b.text}</h4>`;
              return `<p>${b.text}</p>`;
            })
            .join("\n");
          return (
            <ReaderContentView
              selectedRemedyTitle={passageState.passage.remedyDisplayName}
              selectedRemedyContent={contentHtml}
              preferences={preferences}
              bookTitle={book.title}
              bookAuthor={book.author}
              bookYear={Number(book.year)}
            />
          );
        default:
          return (
            <ReaderContentView
              selectedRemedyTitle={null}
              selectedRemedyContent={null}
              preferences={preferences}
              bookTitle={book.title}
              bookAuthor={book.author}
              bookYear={Number(book.year)}
            />
          );
      }
    } else {
      // Legacy layout view
      return (
        <ReaderContentView
          selectedRemedyTitle={legacyTitle}
          selectedRemedyContent={legacyContent}
          preferences={preferences}
          bookTitle={book.title}
          bookAuthor={book.author}
          bookYear={Number(book.year)}
        />
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn" style={scopedStyles}>
      
      <ReaderKeyboardShortcuts
        preferences={preferences}
        onPreferenceChange={setPreferences}
        onClose={onBack}
        isFullscreen={isFullscreen}
        onExitFullscreen={handleToggleFullscreen}
        isActive={true}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b pb-4 mt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-slate-100 transition-all focus:outline-none cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Library</span>
          </button>
          <div>
            <h2 className="text-lg font-serif font-bold leading-tight">{book.title}</h2>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              By {book.author} · Published {book.year}
            </span>
          </div>
        </div>

        <div ref={(el) => {
          if (el) {
            const btn = el.querySelector("button[title='Fullscreen Mode'], button[title='Exit Fullscreen']");
            if (btn) fullscreenTriggerRef.current = btn as HTMLButtonElement;
          }
        }}>
          <ReaderToolbar
            preferences={preferences}
            onPreferenceChange={setPreferences}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-12">
        
        <div className="lg:col-span-4">
          <ReaderIndexPanel
            remedies={remedies as LegacyRemedyEntry[]}
            selectedRemedyPath={selectedPath}
            onSelectRemedy={setSelectedPath}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isLoading={isLoadingIndex}
            error={errorIndex}
            onJumpToLetter={handleJumpToLetter}
          />
        </div>

        <div className="lg:col-span-8 flex flex-col">
          {isLoadingContent ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] gap-2 text-slate-500 bg-slate-900/10 border border-slate-800 rounded-3xl">
              <Loader2 size={32} className="animate-spin text-amber-500" />
              <span className="text-xs font-bold">Loading Proving Text...</span>
            </div>
          ) : (
            renderPassageView()
          )}
        </div>
      </div>

      <Portal>
        <AnimatePresence>
          {isFullscreen && selectedPath && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] flex flex-col pointer-events-auto overflow-hidden select-text"
              role="dialog"
              aria-modal="true"
              aria-labelledby="fullscreen-dialog-title"
              style={scopedStyles}
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    {book.title}
                  </span>
                  <h2 id="fullscreen-dialog-title" className="font-serif text-lg font-bold mt-0.5">
                    {selection.type === "governed" && passageState.status === "verified"
                      ? passageState.passage.remedyDisplayName
                      : legacyTitle}
                  </h2>
                </div>

                <div ref={(el) => {
                  if (el) {
                    const btn = el.querySelector("button[title='Exit Fullscreen']");
                    if (btn) fullscreenTriggerRef.current = btn as HTMLButtonElement;
                  }
                }}>
                  <ReaderToolbar
                    preferences={preferences}
                    onPreferenceChange={setPreferences}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={handleToggleFullscreen}
                  />
                </div>
              </div>

              <div 
                data-lenis-prevent
                className="flex-grow overflow-y-auto p-8 md:p-16 flex justify-center bg-slate-950/5"
              >
                {isLoadingContent ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2 size={32} className="animate-spin text-amber-500" />
                    <span className="text-xs font-bold">Loading Proving Text...</span>
                  </div>
                ) : (
                  renderPassageView()
                )}
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-[10px] text-slate-500 text-right italic font-mono pr-8">
                {selection.type === "governed"
                  ? `* Governed local sample corpus. Source Version: ${book.versionId || `v${book.sourceVersion}`}`
                  : "* Sourced from free library at materiamedica.info. Provided without warranty."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
};
export default MateriaMedicaReader;
