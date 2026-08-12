"use client";

import { useMemo, useState } from "react";
import { Calculator, ChevronDown, ShieldCheck } from "lucide-react";
import type { ScoringResult } from "../types";

type Props = {
  result: ScoringResult;
  selectedRubricCount: number;
  onSelectRemedy?: (remedyId: string) => void;
};

export function ClinicalScoreAuditPanel({ result, selectedRubricCount, onSelectRemedy }: Props) {
  const [remedyId, setRemedyId] = useState(result.topRemedies[0]?.remedyId || "");
  const active = useMemo(
    () => result.topRemedies.find((remedy) => remedy.remedyId === remedyId) || result.topRemedies[0],
    [remedyId, result.topRemedies],
  );
  const contributions = active?.rubricContributions || [];

  if (!active) return null;

  return (
    <section className="clinical-score-audit" aria-labelledby="clinical-score-audit-title">
      <header>
        <div><span>Explainable calculation</span><h4 id="clinical-score-audit-title"><Calculator aria-hidden="true" /> Clinical score audit</h4></div>
        <label>Inspect remedy<div><select value={active.remedyId} onChange={(event) => { setRemedyId(event.target.value); onSelectRemedy?.(event.target.value); }}>{result.topRemedies.map((remedy) => <option key={remedy.remedyId} value={remedy.remedyId}>{remedy.remedyId} · {remedy.remedyName}</option>)}</select><ChevronDown aria-hidden="true" /></div></label>
      </header>

      <div className="clinical-score-audit__metrics">
        <section><span>Final score</span><strong>{active.score}</strong></section>
        <section><span>Raw score</span><strong>{active.rawScore ?? active.score}</strong></section>
        <section><span>Balanced score</span><strong>{active.balancedScore ?? active.score}</strong></section>
        <section><span>Coverage</span><strong>{active.coverageRatio || `${active.matches}/${selectedRubricCount}`}</strong></section>
      </div>

      <div className="clinical-score-audit__table" role="region" aria-label={`${active.remedyName} rubric contributions`}>
        <table>
          <thead><tr><th>Selected rubric</th><th>Grade</th><th>Contribution</th><th>Source</th></tr></thead>
          <tbody>
            {contributions.length ? contributions.map((item) => <tr key={`${item.rubricId}-${item.sourceId || "clinical"}`}><td><strong>{item.rubricTitle}</strong><small>{item.rubricId}</small></td><td>{item.grade}</td><td>{item.contribution}</td><td>{item.sourceId || "Jethwani clinical"}</td></tr>) : <tr><td colSpan={4}>This result did not return row-level contribution records. The governed aggregate score remains unchanged.</td></tr>}
          </tbody>
        </table>
      </div>

      <footer><ShieldCheck aria-hidden="true" /> This view explains the existing clinical calculation. It does not alter rubric grades, modifiers, rankings or the saved case.</footer>
    </section>
  );
}
