"use client";

import { useMemo, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { RepertoryRubric } from "../types";

type Props = {
  rubrics: RepertoryRubric[];
  selectedRubricIds: string[];
  onToggleRubric: (rubric: RepertoryRubric) => void;
};

const PAGE_SIZE = 12;

export function ClinicalEditionBookView({ rubrics, selectedRubricIds, onToggleRubric }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rubrics;
    return rubrics.filter((rubric) => [rubric.title, rubric.classicalWording, rubric.category, rubric.organSystem, ...(rubric.synonyms || [])].some((value) => value?.toLowerCase().includes(normalized)));
  }, [query, rubrics]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const halves = [visible.slice(0, 6), visible.slice(6, 12)];

  return (
    <section className="clinical-edition-book" aria-labelledby="clinical-edition-book-title">
      <header>
        <div><span>Browser edition</span><h3 id="clinical-edition-book-title"><BookOpen aria-hidden="true" /> Dr. Jethwani’s Clinical Repertory</h3><p>Clinical wording, source grades, editorial notes and remedy coverage remain together.</p></div>
        <label><Search aria-hidden="true" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Find in clinical edition…" /></label>
      </header>

      <div className="clinical-edition-book__spread">
        {halves.map((items, side) => <article key={side} aria-label={side === 0 ? "Left clinical edition page" : "Right clinical edition page"}>
          <div className="clinical-edition-book__running-head"><span>{items[0]?.category || "Clinical repertory"}</span><strong>{side === 0 ? "DR. JETHWANI" : items[0]?.organSystem || "CLINICAL EDITION"}</strong></div>
          {items.length ? items.map((rubric) => {
            const selected = selectedRubricIds.includes(rubric.rubricId);
            return <button key={rubric.rubricId} type="button" className={selected ? "is-selected" : ""} onClick={() => onToggleRubric(rubric)} aria-pressed={selected}>
              <span className="clinical-edition-book__path">{rubric.category} · {rubric.organSystem}</span>
              <strong>{rubric.title}</strong>
              <small>{rubric.classicalWording}</small>
              <span className="clinical-edition-book__remedies">{(rubric.relatedRemedies || []).slice(0, 7).map((remedy) => `${remedy.remedyId}${remedy.grade ? `⁽${remedy.grade}⁾` : ""}`).join(" · ") || "No governed remedy grades"}</span>
              {rubric.clinicalNotes && <em>Clinical note: {rubric.clinicalNotes}</em>}
              {selected && <span className="clinical-edition-book__selected"><Check aria-hidden="true" /> In workbench</span>}
            </button>;
          }) : <p className="clinical-edition-book__empty">No rubrics match this edition search.</p>}
        </article>)}
      </div>

      <footer><button type="button" disabled={safePage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft aria-hidden="true" /> Previous</button><span>Pages {safePage * 2 + 1}–{safePage * 2 + 2} · {filtered.length} visible rubrics</span><button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>Next <ChevronRight aria-hidden="true" /></button></footer>
    </section>
  );
}
