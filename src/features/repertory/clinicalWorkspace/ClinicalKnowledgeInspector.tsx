"use client";

import { useEffect, useState } from "react";
import { Activity, BookOpen, FileText, Info, Sparkles } from "lucide-react";
import type { RepertoryCatalogEntry } from "../components/RepertoryCatalogSelector";

type InspectorTab = "context" | "case" | "remedy" | "assistant";

type Props = {
  source: RepertoryCatalogEntry;
  selectedRubricCount: number;
  remedyCount: number;
  selectedRemedy?: string | null;
  onOpenMateriaMedica?: (remedy: string) => void;
};

const tabs: Array<{ id: InspectorTab; label: string; icon: typeof Info }> = [
  { id: "context", label: "Source", icon: Info },
  { id: "case", label: "Case", icon: FileText },
  { id: "remedy", label: "Remedy", icon: BookOpen },
  { id: "assistant", label: "Assist", icon: Sparkles },
];

export function ClinicalKnowledgeInspector({
  source,
  selectedRubricCount,
  remedyCount,
  selectedRemedy,
  onOpenMateriaMedica,
}: Props) {
  const [tab, setTab] = useState<InspectorTab>(selectedRemedy ? "remedy" : "context");

  useEffect(() => {
    if (selectedRemedy) setTab("remedy");
  }, [selectedRemedy]);

  return (
    <aside className="ckw-inspector" aria-label="Clinical inspector">
      <header>
        <div>
          <span>Contextual inspector</span>
          <h3>{selectedRemedy || source.shortLabel}</h3>
        </div>
        <span className="ckw-inspector__live">Case linked</span>
      </header>

      <nav aria-label="Inspector sections">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={tab === id ? "is-active" : ""}>
            <Icon aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>

      <div className="ckw-inspector__content">
        {tab === "context" && (
          <>
            <section>
              <span>Active edition</span>
              <strong>{source.label}</strong>
              <p>{source.author} · {source.year}</p>
            </section>
            <section>
              <span>Source governance</span>
              <strong>{source.scoringLabel}</strong>
              <p>{source.scoringDetail}</p>
            </section>
            <section className="ckw-inspector__notice">
              <Info aria-hidden="true" />
              Original source grades and citations remain attached to every selected rubric.
            </section>
          </>
        )}

        {tab === "case" && (
          <>
            <div className="ckw-inspector__metrics">
              <section><strong>{selectedRubricCount}</strong><span>Rubrics</span></section>
              <section><strong>{remedyCount}</strong><span>Remedies</span></section>
            </div>
            <section>
              <span>Analysis state</span>
              <strong>{selectedRubricCount ? "Ready for comparison" : "Waiting for rubric selection"}</strong>
              <p>The current scoring engine is unchanged in this workspace preview.</p>
            </section>
          </>
        )}

        {tab === "remedy" && (
          <section>
            <span>Materia Medica</span>
            <strong>{selectedRemedy || "Select a remedy in the matrix"}</strong>
            <p>Remedy reading will stay beside the repertory in the next integration phase.</p>
            {selectedRemedy && onOpenMateriaMedica && (
              <button type="button" className="ckw-inspector__primary" onClick={() => onOpenMateriaMedica(selectedRemedy)}>
                <BookOpen aria-hidden="true" />
                Open current Materia Medica
              </button>
            )}
          </section>
        )}

        {tab === "assistant" && (
          <section className="ckw-inspector__notice">
            <Sparkles aria-hidden="true" />
            Contextual suggestions will require explicit clinician approval and will never alter source grades or scores automatically.
          </section>
        )}
      </div>

      <footer>
        <Activity aria-hidden="true" />
        Independent clinical review required
      </footer>
    </aside>
  );
}
