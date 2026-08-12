"use client";

import { useMemo, useState } from "react";
import { Calculator, ChevronDown, CircleHelp, FlaskConical, ShieldCheck } from "lucide-react";
import type { SelectedWorkbenchRubric, WorkbenchSensitivityMode } from "../scoring/repertoryWorkbenchScoring";
import {
  calculateWorkbenchRemedyContributions,
  calculateWorkbenchRemedyRankings,
} from "../scoring/repertoryWorkbenchScoring";

type Props = {
  selectedRubrics: SelectedWorkbenchRubric[];
  selectedRemedy?: string | null;
  onSelectRemedy: (remedy: string) => void;
};

const scenarios: Array<{ id: WorkbenchSensitivityMode; label: string; detail: string }> = [
  { id: "current", label: "Current case", detail: "Uses the case importance and multipliers currently selected." },
  { id: "equal-case-importance", label: "Equal importance", detail: "Sets case importance to 1 while preserving every source remedy grade." },
  { id: "without-multipliers", label: "No multipliers", detail: "Keeps case importance but previews every rubric at a 1× multiplier." },
];

export function RemedyScoreTracePanel({ selectedRubrics, selectedRemedy, onSelectRemedy }: Props) {
  const [mode, setMode] = useState<WorkbenchSensitivityMode>("current");
  const [expanded, setExpanded] = useState(false);
  const rankings = useMemo(
    () => calculateWorkbenchRemedyRankings(selectedRubrics, mode).slice(0, 10),
    [mode, selectedRubrics],
  );
  const remedy = selectedRemedy && rankings.some((item) => item.remedy === selectedRemedy)
    ? selectedRemedy
    : rankings[0]?.remedy;
  const contributions = useMemo(
    () => remedy ? calculateWorkbenchRemedyContributions(selectedRubrics, remedy, mode) : [],
    [mode, remedy, selectedRubrics],
  );
  const total = contributions.reduce((sum, item) => sum + item.contribution, 0);
  const covered = contributions.filter((item) => item.covered && item.scoringEnabled).length;

  if (rankings.length === 0) return null;

  return (
    <section className="remedy-score-trace" aria-labelledby="remedy-score-trace-title">
      <header>
        <div>
          <span>Audit and sensitivity</span>
          <h4 id="remedy-score-trace-title"><Calculator aria-hidden="true" /> Why this score?</h4>
        </div>
        <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? "Hide audit" : "Show audit"}<ChevronDown aria-hidden="true" />
        </button>
      </header>

      <div className="remedy-score-trace__scenarios" role="group" aria-label="Sensitivity preview">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            className={mode === scenario.id ? "is-active" : ""}
            onClick={() => setMode(scenario.id)}
            title={scenario.detail}
          >
            {scenario.id === "current" ? <ShieldCheck aria-hidden="true" /> : <FlaskConical aria-hidden="true" />}
            {scenario.label}
          </button>
        ))}
        <span><CircleHelp aria-hidden="true" /> Preview only—source grades and the saved case are unchanged.</span>
      </div>

      <div className="remedy-score-trace__ranking" aria-label="Sensitivity ranking preview">
        {rankings.slice(0, 6).map((item, index) => (
          <button key={item.remedy} type="button" className={item.remedy === remedy ? "is-active" : ""} onClick={() => onSelectRemedy(item.remedy)}>
            <small>#{index + 1}</small><strong>{item.remedy}</strong><span>{item.score}</span>
          </button>
        ))}
      </div>

      {expanded && remedy && (
        <div className="remedy-score-trace__audit">
          <div className="remedy-score-trace__summary">
            <div><span>Remedy</span><strong>{remedy}</strong></div>
            <div><span>Covered</span><strong>{covered}/{contributions.filter((item) => item.scoringEnabled).length}</strong></div>
            <div><span>Scenario total</span><strong>{total}</strong></div>
          </div>
          <div className="remedy-score-trace__table-wrap" data-lenis-prevent>
            <table>
              <thead><tr><th>Rubric and source</th><th>Source grade</th><th>Case importance</th><th>Multiplier</th><th>Contribution</th></tr></thead>
              <tbody>
                {contributions.map((item) => (
                  <tr key={item.rubricId} className={!item.covered || !item.scoringEnabled ? "is-zero" : ""} title={item.citation}>
                    <td><strong>{item.rubricName}</strong><span>{item.source || "source"} · {item.chapter}</span></td>
                    <td>{item.scoringEnabled ? item.sourceGrade || "—" : "Reference only"}</td>
                    <td>{item.occurrenceOnly ? "Fixed 1" : item.caseImportance}</td>
                    <td>{item.occurrenceOnly ? "Fixed 1×" : `${item.multiplier}×`}</td>
                    <td><strong>{item.contribution}</strong></td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td colSpan={4}>Audited total</td><td>{total}</td></tr></tfoot>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
