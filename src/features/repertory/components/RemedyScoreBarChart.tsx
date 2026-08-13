"use client";

import { useMemo, useState } from "react";
import { BarChart3, CheckSquare, Info } from "lucide-react";

export type RemedyChartScore = {
  remedy: string;
  score: number;
  coverage: string;
};

type ChartMetric = "score" | "coverage";

type Props = {
  scores: RemedyChartScore[];
  onSelectRemedy?: (remedy: string) => void;
  limit?: number;
};

function parseCoverage(value: string): { covered: number; total: number; percent: number } {
  const [coveredValue, totalValue] = value.split("/").map(Number);
  const covered = Number.isFinite(coveredValue) ? coveredValue : 0;
  const total = Number.isFinite(totalValue) && totalValue > 0 ? totalValue : 0;
  return { covered, total, percent: total ? Math.round((covered / total) * 100) : 0 };
}
export function RemedyScoreBarChart({ scores, onSelectRemedy, limit = 10 }: Props) {
  const [metric, setMetric] = useState<ChartMetric>("score");
  const ranked = useMemo(() => scores.slice(0, limit), [scores, limit]);
  const maximum = useMemo(() => {
    if (metric === "coverage") return 100;
    return Math.max(1, ...ranked.map((item) => item.score));
  }, [metric, ranked]);

  if (ranked.length === 0) return null;

  return (
    <section className="remedy-score-chart" aria-labelledby="remedy-score-chart-title">
      <header>
        <div>
          <span className="remedy-score-chart__eyebrow">Transparent case statistics</span>
          <h4 id="remedy-score-chart-title">
            <BarChart3 aria-hidden="true" />
            Remedy ranking profile
          </h4>
        </div>
        <div role="group" aria-label="Chart metric">
          <button type="button" className={metric === "score" ? "is-active" : ""} onClick={() => setMetric("score")}>
            <BarChart3 aria-hidden="true" /> Score
          </button>
          <button type="button" className={metric === "coverage" ? "is-active" : ""} onClick={() => setMetric("coverage")}>
            <CheckSquare aria-hidden="true" /> Coverage
          </button>
        </div>
      </header>

      <div className="remedy-score-chart__plot" role="list" aria-label={`Top ${ranked.length} remedies by ${metric}`}>
        {ranked.map((item, index) => {
          const coverage = parseCoverage(item.coverage);
          const value = metric === "score" ? item.score : coverage.percent;
          const height = Math.max(value > 0 ? 8 : 2, Math.round((value / maximum) * 100));
          const displayedValue = metric === "score" ? String(item.score) : `${coverage.percent}%`;
          return (
            <button
              key={item.remedy}
              type="button"
              role="listitem"
              onClick={() => onSelectRemedy?.(item.remedy)}
              className="remedy-score-chart__column"
              title={`${item.remedy}: score ${item.score}; coverage ${item.coverage}`}
            >
              <span className="remedy-score-chart__value">{displayedValue}</span>
              <span className="remedy-score-chart__bar-track" aria-hidden="true">
                <span className="remedy-score-chart__bar" style={{ height: `${height}%` }}>
                  <span>{index + 1}</span>
                </span>
              </span>
              <strong>{item.remedy}</strong>
              <small>{metric === "score" ? item.coverage : `Score ${item.score}`}</small>
            </button>
          );
        })}
      </div>

      <footer>
        <Info aria-hidden="true" />
        Calculated from the active case matrix. These bars do not represent experimental probability or statistical significance.
      </footer>
    </section>
  );
}
