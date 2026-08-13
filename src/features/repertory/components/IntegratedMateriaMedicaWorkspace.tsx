"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Check, Columns3, Library, Plus, ShieldCheck, X } from "lucide-react";
import type { Rubric } from "@/lib/repertoryData";
import { REMEDIES_METADATA } from "@/lib/repertoryData";
import { MateriaMedicaReader } from "@/features/materia-medica/components/reader/MateriaMedicaReader";
import { MATERIA_MEDICA_REGISTRY } from "@/features/materia-medica/data/registry";
import { GovernedMateriaMedicaRepository } from "@/features/materia-medica/services/GovernedMateriaMedicaRepository";
import { MachineValidatedCorpusRepository } from "@/features/materia-medica/services/MachineValidatedCorpusRepository";
import { findRemedyHeadingIndex } from "./remedyReaderResolution";

type Keynote = { keynotes: string[]; aggravations: string[]; ameliorations: string[]; miasm: string };
type Score = { remedy: string; score: number; coverage: string };
type Selection = { rubric: Rubric; grade: number; weightMultiplier?: number };

type Props = {
  activeRemedy?: string | null;
  scores: Score[];
  selectedRubrics: Selection[];
  keynotes: Record<string, Keynote>;
  onActiveRemedyChange: (remedy: string) => void;
};

async function resolveReaderPath(bookId: string, remedy: string): Promise<string | undefined> {
  const fullName = REMEDIES_METADATA[remedy]?.fullName || remedy;
  const identity = { abbreviation: remedy, fullName };
  try {
    const passages = await GovernedMateriaMedicaRepository.listApprovedPassages(bookId);
    const passageIndex = findRemedyHeadingIndex(passages.map((item) => item.remedyDisplayName), identity);
    if (passageIndex >= 0) return passages[passageIndex].remedyId;

    const manifest = await MachineValidatedCorpusRepository.getManifest(bookId);
    for (const chunk of manifest?.chunks || []) {
      const headings = chunk.indexHeadings?.length ? chunk.indexHeadings : [chunk.title];
      const headingIndex = findRemedyHeadingIndex(headings, identity);
      if (headingIndex >= 0) return `ocr:${chunk.id}:${headingIndex}`;
    }
  } catch (error) {
    console.warn("Unable to resolve Materia Medica reader path", error);
  }
  return undefined;
}

export function IntegratedMateriaMedicaWorkspace({
  activeRemedy,
  scores,
  selectedRubrics,
  keynotes,
  onActiveRemedyChange,
}: Props) {
  const readableBooks = useMemo(
    () => MATERIA_MEDICA_REGISTRY.filter((book) => book.editorialStatus === "approved" && !book.deprecatedAt),
    [],
  );
  const [bookId, setBookId] = useState("james-tyler-kent");
  const [view, setView] = useState<"compare" | "reader">("compare");
  const [comparison, setComparison] = useState<string[]>([]);
  const [readerPath, setReaderPath] = useState<string | undefined>();
  const [resolving, setResolving] = useState(false);
  const activeBook = readableBooks.find((book) => book.id === bookId) || readableBooks[0];
  const ranked = scores.slice(0, 10);

  useEffect(() => {
    if (!activeRemedy) return;
    setComparison((current) => current.includes(activeRemedy) ? current : [activeRemedy, ...current].slice(0, 3));
  }, [activeRemedy]);

  const openReader = async (remedy: string) => {
    onActiveRemedyChange(remedy);
    setResolving(true);
    const path = await resolveReaderPath(activeBook.id, remedy);
    setReaderPath(path);
    setResolving(false);
    setView("reader");
  };

  const toggleComparison = (remedy: string) => {
    setComparison((current) => {
      if (current.includes(remedy)) return current.filter((item) => item !== remedy);
      return [...current, remedy].slice(-3);
    });
  };

  if (view === "reader") {
    return (
      <section className="integrated-mm integrated-mm--reader">
        <div className="integrated-mm__reader-context">
          <button type="button" onClick={() => setView("compare")}><ArrowLeft aria-hidden="true" /> Back to case comparison</button>
          <span><ShieldCheck aria-hidden="true" /> {activeBook.title} · governed reader</span>
          {resolving && <small>Locating remedy…</small>}
        </div>
        <MateriaMedicaReader
          key={`${activeBook.id}:${activeRemedy || "index"}:${readerPath || "index"}`}
          selection={{ type: "governed", book: activeBook }}
          initialRemedyPath={readerPath}
          onBack={() => setView("compare")}
        />
      </section>
    );
  }

  return (
    <section className="integrated-mm" aria-label="Integrated Materia Medica workspace">
      <header className="integrated-mm__header">
        <div><span>Case-linked reference</span><h3><Library aria-hidden="true" /> Materia Medica comparison</h3><p>Read source text without leaving the repertory case.</p></div>
        <label><span>Reading source</span><select value={bookId} onChange={(event) => setBookId(event.target.value)}>{readableBooks.map((book) => <option key={book.id} value={book.id}>{book.author} · {book.year}</option>)}</select></label>
      </header>

      <div className="integrated-mm__ranked" aria-label="Ranked remedies">
        {ranked.map((item, index) => {
          const included = comparison.includes(item.remedy);
          return <button key={item.remedy} type="button" className={included ? "is-active" : ""} onClick={() => toggleComparison(item.remedy)}><small>#{index + 1}</small><strong>{item.remedy}</strong><span>{item.score} · {item.coverage}</span>{included ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}</button>;
        })}
      </div>

      {comparison.length === 0 ? (
        <div className="integrated-mm__empty"><Columns3 aria-hidden="true" /><h4>Select up to three ranked remedies</h4><p>The comparison uses case coverage and existing local clinical notes. Open a remedy to read the governed source text.</p></div>
      ) : (
        <div className="integrated-mm__columns" data-lenis-prevent>
          {comparison.map((remedy) => {
            const score = scores.find((item) => item.remedy === remedy);
            const note = keynotes[remedy];
            const meta = REMEDIES_METADATA[remedy];
            const coveredRubrics = selectedRubrics.filter(({ rubric }) => Boolean(rubric.remedies[remedy]));
            return (
              <article key={remedy}>
                <header><div><span>{meta?.source || "Remedy"}</span><h4>{meta?.fullName || remedy}</h4><small>{remedy} · score {score?.score || 0} · coverage {score?.coverage || "0/0"}</small></div><button type="button" onClick={() => toggleComparison(remedy)} title={`Remove ${remedy}`}><X aria-hidden="true" /></button></header>
                <section><h5>Case correspondence</h5>{coveredRubrics.slice(0, 6).map(({ rubric }) => <div className="integrated-mm__rubric" key={rubric.id}><span>{rubric.source} · grade {rubric.remedies[remedy]}</span><strong>{rubric.name}</strong></div>)}{coveredRubrics.length === 0 && <p>No selected rubric coverage.</p>}</section>
                <section><h5>Existing clinical notes</h5>{note ? <><ul>{note.keynotes.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul><div className="integrated-mm__modalities"><span>Worse: {note.aggravations.slice(0, 2).join(", ") || "—"}</span><span>Better: {note.ameliorations.slice(0, 2).join(", ") || "—"}</span></div></> : <p>No local keynote summary. Use the governed reader.</p>}</section>
                <button type="button" className="integrated-mm__read" onClick={() => openReader(remedy)}><BookOpen aria-hidden="true" /> Read in {activeBook.author}</button>
              </article>
            );
          })}
        </div>
      )}

      <footer><ShieldCheck aria-hidden="true" /> Educational source comparison only. Repertory ranking and Materia Medica text remain distinct evidence layers; clinician review is required.</footer>
    </section>
  );
}
