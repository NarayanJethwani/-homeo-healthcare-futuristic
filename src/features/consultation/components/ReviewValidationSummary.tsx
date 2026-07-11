import React, { useEffect, useRef } from "react";
import { ReviewValidationIssue } from "../../encounter/services/encounterService";
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface ReviewValidationSummaryProps {
  issues: ReviewValidationIssue[];
  onFocusField: (fieldPath: string) => void;
}

export function ReviewValidationSummary({ issues, onFocusField }: ReviewValidationSummaryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus container when validation fails on submit to satisfy accessibility
  useEffect(() => {
    if (issues.length > 0 && containerRef.current) {
      containerRef.current.focus();
    }
  }, [issues]);

  if (issues.length === 0) return null;

  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="bg-rose-950/40 border border-rose-900 text-rose-250 p-4 rounded-xl space-y-3 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-lg"
      role="alert"
      aria-labelledby="val-summary-title"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
        <h4 id="val-summary-title" className="text-xs font-black uppercase tracking-wider">
          Encounter Submission Failed - Review validation errors
        </h4>
      </div>

      <p className="text-[11px] text-rose-350">
        Please resolve the following required details before submitting the case intake file.
      </p>

      <ul className="space-y-1.5 border-t border-rose-900/60 pt-2.5">
        {errors.map((issue, idx) => (
          <li key={idx} className="text-xs flex items-start gap-1.5">
            <span className="text-rose-400 font-bold">•</span>
            <div>
              <button
                type="button"
                onClick={() => onFocusField(issue.fieldPath)}
                className="text-left font-bold hover:underline hover:text-rose-300 text-rose-200 cursor-pointer focus:outline-none"
              >
                {issue.message}
              </button>
            </div>
          </li>
        ))}

        {warnings.map((issue, idx) => (
          <li key={idx} className="text-xs text-amber-300/90 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <button
                type="button"
                onClick={() => onFocusField(issue.fieldPath)}
                className="text-left font-semibold hover:underline text-amber-250 cursor-pointer focus:outline-none"
              >
                {issue.message}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
