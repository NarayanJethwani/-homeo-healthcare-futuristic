"use client";

import { useMemo, useState } from "react";
import { BookOpen, Check, Columns2, Search, TextCursorInput } from "lucide-react";
import type { Rubric } from "@/lib/repertoryData";
import type { RepertoryCatalogEntry } from "./RepertoryCatalogSelector";

type Props = {
  source: RepertoryCatalogEntry;
  chapters: string[];
  chapter: string;
  rubrics: Rubric[];
  selectedRubricIds: ReadonlySet<string>;
  onChapterChange: (chapter: string) => void;
  onAddRubric: (rubric: Rubric) => void;
  onInspectRemedy: (remedy: string) => void;
};

const MAX_VISIBLE_RUBRICS = 120;

function BookPage({
  rubrics,
  selectedRubricIds,
  onAddRubric,
  onInspectRemedy,
}: Pick<Props, "rubrics" | "selectedRubricIds" | "onAddRubric" | "onInspectRemedy">) {
  return (
    <div className="repertory-book__page">
      {rubrics.map((rubric) => {
        const selected = selectedRubricIds.has(rubric.id);
        const remedies = Object.entries(rubric.remedies).sort((a, b) => b[1] - a[1]);
        return (
          <article key={rubric.id} className={selected ? "repertory-book__entry is-selected" : "repertory-book__entry"}>
            <button type="button" className="repertory-book__rubric" onClick={() => onAddRubric(rubric)} title={rubric.citation || `Add ${rubric.name} to the case`}>
              {selected && <Check aria-hidden="true" />}
              {rubric.name}
            </button>
            <div className="repertory-book__remedies" aria-label={`Remedies for ${rubric.name}`}>
              {remedies.length === 0 ? (
                <span className="repertory-book__reference">Reference rubric · no governed remedy mapping</span>
              ) : remedies.map(([remedy, grade]) => (
                <button
                  key={remedy}
                  type="button"
                  className={`repertory-book__remedy grade-${Math.max(1, Math.min(5, grade))}`}
                  onClick={() => onInspectRemedy(remedy)}
                  title={`Open ${remedy} in the clinical inspector · source grade ${grade}`}
                >
                  {remedy}
                </button>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function RepertoryBookView({
  source,
  chapters,
  chapter,
  rubrics,
  selectedRubricIds,
  onChapterChange,
  onAddRubric,
  onInspectRemedy,
}: Props) {
  const [query, setQuery] = useState("");
  const [twoPage, setTwoPage] = useState(true);
  const [compact, setCompact] = useState(false);

  const visibleRubrics = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matching = needle
      ? rubrics.filter((rubric) => rubric.name.toLowerCase().includes(needle))
      : rubrics;
    return matching.slice(0, MAX_VISIBLE_RUBRICS);
  }, [query, rubrics]);
  const pageBreak = twoPage ? Math.ceil(visibleRubrics.length / 2) : visibleRubrics.length;

  return (
    <section className={`repertory-book ${compact ? "is-compact" : ""}`} aria-label={`${source.label} book view`}>
      <header className="repertory-book__toolbar">
        <div>
          <span className="repertory-book__eyebrow">Source-faithful browser edition</span>
          <h3><BookOpen aria-hidden="true" /> {source.label}</h3>
          <p>{source.author} · {source.year} · remedy grades remain source-specific</p>
        </div>
        <div className="repertory-book__tools">
          <label>
            <span className="sr-only">Book chapter</span>
            <select value={chapter} onChange={(event) => onChapterChange(event.target.value)}>
              {chapters.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="repertory-book__find">
            <Search aria-hidden="true" />
            <span className="sr-only">Find rubric in book</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find in this chapter…" />
          </label>
          <button type="button" className={twoPage ? "is-active" : ""} onClick={() => setTwoPage((value) => !value)} title="Toggle one or two page layout">
            <Columns2 aria-hidden="true" /> Pages
          </button>
          <button type="button" className={compact ? "is-active" : ""} onClick={() => setCompact((value) => !value)} title="Toggle compact typography">
            <TextCursorInput aria-hidden="true" /> Density
          </button>
        </div>
      </header>

      <div className={twoPage ? "repertory-book__spread is-two-page" : "repertory-book__spread"} data-lenis-prevent>
        <BookPage rubrics={visibleRubrics.slice(0, pageBreak)} selectedRubricIds={selectedRubricIds} onAddRubric={onAddRubric} onInspectRemedy={onInspectRemedy} />
        {twoPage && <BookPage rubrics={visibleRubrics.slice(pageBreak)} selectedRubricIds={selectedRubricIds} onAddRubric={onAddRubric} onInspectRemedy={onInspectRemedy} />}
        {visibleRubrics.length === 0 && <div className="repertory-book__empty">No matching rubrics in this chapter.</div>}
      </div>

      <footer className="repertory-book__footer">
        <span>Showing {visibleRubrics.length.toLocaleString()} of {rubrics.length.toLocaleString()} chapter rubrics</span>
        <span className="repertory-book__legend"><i className="grade-1">1</i><i className="grade-2">2</i><i className="grade-3">3</i><i className="grade-4">4</i><i className="grade-5">5</i> Source grade</span>
        <span>Click rubric to add · click remedy to inspect</span>
      </footer>
    </section>
  );
}
