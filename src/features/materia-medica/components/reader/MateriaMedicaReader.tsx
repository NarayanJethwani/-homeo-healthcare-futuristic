import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, Loader2, AlertTriangle, Book, Bookmark } from "lucide-react";
import { ReaderBookSelection, SampleMateriaMedicaPassage } from "../../types";
import { useReaderPreferences } from "../../hooks/useReaderPreferences";
import { THEME_CSS_VARIABLES } from "../../reader/preferences";
import { ReaderToolbar } from "./ReaderToolbar";
import { ReaderIndexPanel } from "./ReaderIndexPanel";
import { ReaderContentView } from "./ReaderContentView";
import { ReaderKeyboardShortcuts } from "./ReaderKeyboardShortcuts";
import { LegacyMateriaMedicaContentAdapter, LegacyRemedyEntry } from "./LegacyMateriaMedicaContentAdapter";
import { GovernedMateriaMedicaRepository } from "../../services/GovernedMateriaMedicaRepository";
import { computeSha256Browser } from "../../services/checksum/checksum.browser";
import {
  MachineCorpusChunk,
  MachineCorpusChunkIndex,
  MachineCorpusManifest,
  MachineValidatedCorpusRepository,
} from "../../services/MachineValidatedCorpusRepository";
import { getRegistryBook } from "../../data/registry";
import { featureFlags } from "../../../dashboard/constants/featureFlags";
import Portal from "@/components/Portal";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { PrivateWorkspacePanel } from "./PrivateWorkspacePanel";
import { getAnnotationsForBook, saveAnnotation, deleteAnnotation, clearLocalGuestAnnotations } from "../../services/annotationsService";
import { getBookmarks, toggleBookmark, clearLocalGuestBookmarks } from "../../services/bookmarksService";
import { getLastReaderPosition, saveReaderPosition, clearLocalGuestPositions } from "../../services/readerPositionService";
import { MateriaMedicaBookmark, MateriaMedicaAnnotation } from "../../types/persistenceTypes";
import { findGovernedScanForPassage } from "../../data/scanAssetRegistry";
import { isEligibleScanAsset } from "../../services/scanAssetEligibility";
import { ScanReader } from "./ScanReader";
import { SplitReader } from "./SplitReader";


type MateriaMedicaReaderProps = {
  selection: ReaderBookSelection;
  onBack: () => void;
  initialRemedyPath?: string;
};

type PassageLoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "verifying" }
  | { status: "verified"; passage: SampleMateriaMedicaPassage }
  | { status: "failed"; reason: "checksum" | "unapproved" | "deprecated" | "missing" };

type MachineChunkLoadState =
  | { status: "idle" }
  | { status: "loading" | "verifying" }
  | { status: "verified"; chunk: MachineCorpusChunk }
  | { status: "failed"; reason: "checksum" | "missing" };

type ReaderIndexEntry = {
  name: string;
  path: string;
  passageId?: string;
  contentKind: "human-reviewed" | "machine-ocr" | "legacy";
};

function machineTextToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  return escaped
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

export const MateriaMedicaReader: React.FC<MateriaMedicaReaderProps> = ({
  selection,
  onBack,
  initialRemedyPath,
}) => {
  const { preferences, setPreferences } = useReaderPreferences();

  const book = React.useMemo(() => {
    return selection.type === "governed"
      ? selection.book
      : (getRegistryBook(selection.bookId) || {
          id: selection.bookId,
          title: selection.bookId,
          author: "Unknown Author",
          year: 1900,
          rightsStatus: "public-domain" as const,
          editorialStatus: "approved" as const,
          ingestionStatus: "search-indexed" as const,
          sourceUrl: "",
          sourceVersion: 1,
          lastUpdated: ""
        });
  }, [selection]);
  
  // Dynamic lists for legacy or governed books
  const [remedies, setRemedies] = useState<ReaderIndexEntry[]>([]);
  const [machineManifest, setMachineManifest] = useState<MachineCorpusManifest | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(initialRemedyPath || null);

  useEffect(() => {
    if (initialRemedyPath) {
      setSelectedPath(initialRemedyPath);
    }
  }, [initialRemedyPath]);
  // Legacy selected remedy
  const [legacyTitle, setLegacyTitle] = useState<string | null>(null);
  const [legacyContent, setLegacyContent] = useState<string | null>(null);

  // Governed selected remedy passage state machine
  const [passageState, setPassageState] = useState<PassageLoadState>({ status: "idle" });
  const [machineChunkState, setMachineChunkState] = useState<MachineChunkLoadState>({ status: "idle" });

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingIndex, setIsLoadingIndex] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [errorIndex, setErrorIndex] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullscreenTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Determine if sample corpus feature is active for this reading session
  const isSampleCorpusActive = featureFlags.MATERIA_MEDICA_SAMPLE_CORPUS;
  const isScanSplitEnabled = featureFlags.MATERIA_MEDICA_SCAN_SPLIT_READER;
  const [readerMode, setReaderMode] = useState<"text" | "scan" | "split">("text");

  const scanRegistration = React.useMemo(() => {
    if (!isScanSplitEnabled || passageState.status !== "verified") return null;
    const registration = findGovernedScanForPassage(passageState.passage.id);
    return registration && isEligibleScanAsset(registration.asset) ? registration : null;
  }, [isScanSplitEnabled, passageState]);

  // Phase 6 Workspace State
  const [sidebarTab, setSidebarTab] = useState<"index" | "workspace">("index");
  const [bookmarks, setBookmarks] = useState<MateriaMedicaBookmark[]>([]);
  const [annotations, setAnnotations] = useState<MateriaMedicaAnnotation[]>([]);
  const [practitionerId, setPractitionerId] = useState<string>("guest");

  const isWorkspaceEnabled = featureFlags.MATERIA_MEDICA_PRIVATE_WORKSPACE;

  // Watch Auth State to reload user-scoped data
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPractitionerId(user.uid);
      } else {
        setPractitionerId("guest");
        setBookmarks([]);
        setAnnotations([]);
      }
    });
    return () => unsub();
  }, []);

  // Fetch bookmarks & annotations for the current book
  const loadWorkspaceData = useCallback(async () => {
    if (!isWorkspaceEnabled) return;
    try {
      const bookBookmarks = await getBookmarks(book.id);
      const bookAnnotations = await getAnnotationsForBook(book.id);
      setBookmarks(bookBookmarks);
      setAnnotations(bookAnnotations);
    } catch (e) {
      console.error("Failed to load workspace data:", e);
    }
  }, [book.id, isWorkspaceEnabled]);

  useEffect(() => {
    loadWorkspaceData();
  }, [loadWorkspaceData, practitionerId]);

  // Load last position on mount
  useEffect(() => {
    if (!isWorkspaceEnabled) return;
    const loadPosition = async () => {
      const pos = await getLastReaderPosition(book.id);
      if (pos && pos.passageId) {
        // Resolve remedy ID from passage ID
        const matchingRemedy = pos.passageId.includes("aconitum") ? "aconitum-napellus" : pos.passageId.includes("belladonna") ? "belladonna" : "bryonia";
        setSelectedPath(matchingRemedy);
      }
    };
    loadPosition();
  }, [book.id, isWorkspaceEnabled]);

  // Save reader position when passage changes
  useEffect(() => {
    if (!isWorkspaceEnabled || !selectedPath || selection.type !== "governed" || passageState.status !== "verified") return;
    
    const savePos = async () => {
      const sourceVersionId = book.versionId || (book.id + "_v1");
      const passageId = passageState.passage.id;
      
      await saveReaderPosition({
        practitionerId,
        bookId: book.id,
        sourceVersionId,
        passageId,
        blockId: undefined,
        relativeOffset: 0,
        updatedAt: new Date().toISOString()
      });
    };
    savePos();
  }, [selectedPath, passageState, practitionerId, isWorkspaceEnabled, selection.type, book.id, book.versionId]);

  const handleToggleBookmark = async (arg?: string | MateriaMedicaBookmark) => {
    if (selection.type !== "governed" || passageState.status !== "verified") return;
    const sourceVersionId = book.versionId || (book.id + "_v1");
    const passageId = passageState.passage.id;
    
    let targetBookmark: MateriaMedicaBookmark;
    if (arg && typeof arg === "object") {
      targetBookmark = arg;
    } else {
      targetBookmark = {
        id: "",
        practitionerId,
        bookId: book.id,
        sourceVersionId,
        passageId,
        blockId: arg,
        createdAt: new Date().toISOString()
      };
    }

    await toggleBookmark(targetBookmark);
    await loadWorkspaceData();
  };

  const handleSaveAnnotation = async (ann: MateriaMedicaAnnotation) => {
    const result = await saveAnnotation(ann);
    await loadWorkspaceData();
    return result;
  };

  const handleDeleteAnnotation = async (annId: string) => {
    const result = await deleteAnnotation(annId);
    await loadWorkspaceData();
    return result;
  };

  const handleClearGuestData = () => {
    clearLocalGuestAnnotations();
    clearLocalGuestBookmarks();
    clearLocalGuestPositions();
    setBookmarks([]);
    setAnnotations([]);
  };

  // Load remedy index
  useEffect(() => {
    let active = true;
    const loadIndex = async () => {
      setIsLoadingIndex(true);
      setErrorIndex(null);
      try {
        if (selection.type === "governed") {
          const [manifest, approvedPassages] = await Promise.all([
            MachineValidatedCorpusRepository.getManifest(book.id),
            isSampleCorpusActive
              ? GovernedMateriaMedicaRepository.listApprovedPassages(book.id)
              : Promise.resolve([]),
          ]);
          if (active) {
            setMachineManifest(manifest);
            const reviewedEntries: ReaderIndexEntry[] = approvedPassages.map((p) => ({
                name: `${p.remedyDisplayName} (Pages ${p.sourcePageRange.printedPageStart}-${p.sourcePageRange.printedPageEnd})`,
                path: p.remedyId,
                passageId: p.id,
                contentKind: "human-reviewed",
              }));
            const seenMachineHeadings = new Set<string>();
            const machineEntries: ReaderIndexEntry[] = (manifest?.chunks ?? []).flatMap((chunk) => {
              const headings = chunk.indexHeadings?.length ? chunk.indexHeadings : [chunk.title];
              return headings.flatMap((heading, headingIndex) => {
                // Keep numeric identifiers so numbered works (for example Organon
                // aphorisms §1–§291) do not collapse into a single index entry.
                const normalizedHeading = heading.toUpperCase().replace(/[^A-Z0-9]/g, "");
                if (!normalizedHeading || seenMachineHeadings.has(normalizedHeading)) return [];
                seenMachineHeadings.add(normalizedHeading);
                return [{
                  name: heading,
                  path: `ocr:${chunk.id}:${headingIndex}`,
                  passageId: chunk.id,
                  contentKind: "machine-ocr" as const,
                }];
              });
            });
            setRemedies([...reviewedEntries, ...machineEntries]);
          }
        } else {
          // Legacy content adapter
          const legacyIndex = await LegacyMateriaMedicaContentAdapter.fetchRemediesIndex(book.id);
          if (active) {
            setRemedies(legacyIndex.map((r) => ({ name: r.name, path: r.path, contentKind: "legacy" })));
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
  }, [selection.type, book, isSampleCorpusActive]);

  // Load content
  useEffect(() => {
    if (!selectedPath) {
      setLegacyTitle(null);
      setLegacyContent(null);
      setPassageState({ status: "idle" });
      setMachineChunkState({ status: "idle" });
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

          if (matchingRemedy.contentKind === "machine-ocr") {
            setPassageState({ status: "idle" });
            setMachineChunkState({ status: "loading" });
            const chunkIndex = machineManifest?.chunks.find((chunk) => chunk.id === matchingRemedy.passageId);
            if (!chunkIndex) {
              if (active) setMachineChunkState({ status: "failed", reason: "missing" });
              return;
            }
            const chunk = await MachineValidatedCorpusRepository.getChunk(book.id, chunkIndex as MachineCorpusChunkIndex);
            if (active) setMachineChunkState({ status: "verifying" });
            const computedHash = await computeSha256Browser(chunk.text);
            if (computedHash !== chunk.sha256 || computedHash !== chunkIndex.sha256) {
              if (active) setMachineChunkState({ status: "failed", reason: "checksum" });
              return;
            }
            if (active) setMachineChunkState({ status: "verified", chunk });
            return;
          }

          setMachineChunkState({ status: "idle" });

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
          const data = await LegacyMateriaMedicaContentAdapter.fetchRemedyContent(book.id, selectedPath);
          if (active) {
            setLegacyTitle(data.title);
            setLegacyContent(data.content);
          }
        }
      } catch (err: any) {
        if (active) {
          if (selection.type === "governed") {
            if (selectedPath.startsWith("ocr:")) {
              setMachineChunkState({ status: "failed", reason: "checksum" });
            } else {
              setPassageState({ status: "failed", reason: "checksum" });
            }
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
  }, [selection.type, book, selectedPath, remedies, machineManifest]);

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
    const group = letter.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const el = document.getElementById(`remedy-group-${group}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
    "--reader-surface": themeVars.surface,
    "--reader-control": themeVars.control,
    "--reader-text": themeVars.text,
    "--reader-muted": themeVars.muted,
    "--reader-subtle": themeVars.subtle,
    "--reader-border": themeVars.border,
    "--reader-accent": themeVars.accent,
    "--reader-accent-surface": themeVars.accentSurface,
    background: "var(--reader-bg)",
    color: "var(--reader-text)",
    borderColor: "var(--reader-border)",
  } as React.CSSProperties;

  const selectedIndexEntry = remedies.find((entry) => entry.path === selectedPath);

  // Render passage content based on verification status
  const renderPassageView = () => {
    if (selection.type === "governed") {
      if (machineChunkState.status === "loading" || machineChunkState.status === "verifying") {
        return (
          <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] gap-2 text-[var(--reader-muted)] bg-[var(--reader-surface)] border border-[var(--reader-border)] rounded-3xl">
            <Loader2 size={32} className="animate-spin text-[var(--reader-accent)]" />
            <span className="text-xs font-bold">Verifying OCR section integrity...</span>
          </div>
        );
      }
      if (machineChunkState.status === "failed") {
        return (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center border border-rose-500/30 bg-rose-950/10 rounded-3xl min-h-[300px]">
            <AlertTriangle size={36} className="text-rose-500 mb-3" />
            <h4 className="text-rose-400 font-bold text-sm">OCR section unavailable — integrity verification failed.</h4>
          </div>
        );
      }
      if (machineChunkState.status === "verified") {
        return (
          <ReaderContentView
            selectedRemedyTitle={selectedIndexEntry?.name || machineChunkState.chunk.title}
            selectedRemedyContent={machineTextToHtml(machineChunkState.chunk.text)}
            preferences={preferences}
            bookTitle={book.title}
            bookAuthor={book.author}
            bookYear={Number(book.year)}
          />
        );
      }
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
          if (readerMode === "scan" && scanRegistration) {
            return <ScanReader asset={scanRegistration.asset} alt={`${book.title}, printed page ${scanRegistration.asset.printedPage ?? "unknown"}`} />;
          }
          if (readerMode === "split" && scanRegistration) {
            return (
              <SplitReader
                asset={scanRegistration.asset}
                alignment={scanRegistration.alignment}
                approvedPassageIds={new Set([passageState.passage.id])}
                text={passageState.passage.blocks.map((block, index) => (
                  block.type === "heading"
                    ? <h3 key={index}>{block.text}</h3>
                    : block.type === "section-label"
                      ? <h4 key={index}>{block.text}</h4>
                      : <p key={index}>{block.text}</p>
                ))}
              />
            );
          }
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
              bookId={book.id}
              sourceVersionId={passageState.passage.sourceVersionId}
              passageId={passageState.passage.id}
              blocks={passageState.passage.blocks}
              bookmarks={bookmarks}
              annotations={annotations}
              onToggleBookmark={handleToggleBookmark}
              onSaveAnnotation={handleSaveAnnotation}
              onDeleteAnnotation={handleDeleteAnnotation}
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
            <span className="text-[10px] text-[var(--reader-muted)] font-bold uppercase tracking-wider">
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
          {scanRegistration && (
            <div className="mt-2 flex justify-end gap-2" aria-label="Reader source mode">
              {(["text", "scan", "split"] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={readerMode === mode}
                  onClick={() => setReaderMode(mode)}
                  className="min-h-11 rounded-lg border border-slate-700 px-3 text-xs capitalize"
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {machineManifest && (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-[var(--reader-text)]" role="status">
          <span className="font-bold text-amber-500">Complete machine-validated OCR edition.</span>{" "}
          All {machineManifest.chunkCount.toLocaleString()} sections are source-checksummed and verified again before display. OCR transcription errors may remain; human editorial review is pending.
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-12">
        
        <div className="lg:col-span-4 flex flex-col gap-4">
          {isWorkspaceEnabled && (
            <div className="flex bg-slate-900/60 p-1 rounded-2xl border border-slate-850">
              <button
                onClick={() => setSidebarTab("index")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 focus:outline-none ${
                  sidebarTab === "index"
                    ? "bg-slate-950 text-amber-500 border border-slate-800"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Book size={14} />
                Book Sections
              </button>
              <button
                onClick={() => setSidebarTab("workspace")}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 focus:outline-none ${
                  sidebarTab === "workspace"
                    ? "bg-slate-950 text-amber-500 border border-slate-800"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bookmark size={14} />
                Private Workspace
              </button>
            </div>
          )}

          {(!isWorkspaceEnabled || sidebarTab === "index") ? (
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
          ) : (
            <PrivateWorkspacePanel
              bookmarks={bookmarks}
              annotations={annotations}
              onSelectRemedy={setSelectedPath}
              onDeleteAnnotation={handleDeleteAnnotation}
              onToggleBookmark={handleToggleBookmark}
              onClearGuestData={handleClearGuestData}
            />
          )}
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
                      : machineChunkState.status === "verified"
                        ? selectedIndexEntry?.name || machineChunkState.chunk.title
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
                  ? machineChunkState.status === "verified"
                    ? `Machine-validated OCR · SHA-256 verified · Editorial review pending`
                    : `Human-reviewed governed passage · Source Version: ${book.versionId || "unknown"}`
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
