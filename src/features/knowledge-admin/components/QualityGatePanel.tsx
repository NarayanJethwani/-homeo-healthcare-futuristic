import React from "react";
import { KmsKnowledgeEntity, QualityGateResult } from "../types";
import { runQualityGateChecks } from "../validation/qualityGates";
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";

interface QualityGatePanelProps {
  entity: KmsKnowledgeEntity;
  allEntities: KmsKnowledgeEntity[];
}

export default function QualityGatePanel({ entity, allEntities }: QualityGatePanelProps) {
  const result: QualityGateResult = runQualityGateChecks(entity, allEntities);
  
  const errors = result.issues.filter(i => i.severity === "error");
  const warnings = result.issues.filter(i => i.severity === "warning");

  return (
    <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4">
      {/* Header section with computed scores */}
      <div className="flex justify-between items-center pb-3 border-b border-neutral-850">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-neutral-200">
            Quality Gate Assessment
          </h4>
        </div>

        <div className="text-right">
          <span className={`text-xl font-bold font-mono ${
            result.passed ? "text-emerald-400" : "text-rose-400"
          }`}>
            {result.score}%
          </span>
          <span className="text-[9px] text-neutral-500 block uppercase">
            Completeness
          </span>
        </div>
      </div>

      {/* Action Indicator */}
      {result.passed ? (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-emerald-400">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold">Passed Quality Gates</h5>
            <p className="text-[10px] text-emerald-500/80">
              Entity satisfies all clinical safety, canonical alignment, and relationship gates. Publishing is enabled.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-400">
          <AlertOctagon className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold">Publishing Blocked</h5>
            <p className="text-[10px] text-rose-500/80">
              Clinical safety guidelines or broken relationships have failed. Resolve the errors listed below.
            </p>
          </div>
        </div>
      )}

      {/* Issues List */}
      <div className="space-y-3.5 pt-1">
        {/* Errors section */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-rose-400 tracking-wider uppercase">
              Blocking Errors ({errors.length})
            </h5>
            <div className="space-y-1.5">
              {errors.map((issue, idx) => (
                <div key={idx} className="p-2 text-xs bg-rose-500/5 border border-rose-500/10 rounded-lg text-rose-300 flex items-start gap-2">
                  <AlertOctagon className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-mono text-[9px] bg-rose-500/10 text-rose-400 px-1 py-0.5 rounded mr-1">
                      {issue.rule}
                    </strong>
                    {issue.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings section */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">
              Warnings & Recommendations ({warnings.length})
            </h5>
            <div className="space-y-1.5">
              {warnings.map((issue, idx) => (
                <div key={idx} className="p-2 text-xs bg-amber-500/5 border border-amber-500/10 rounded-lg text-amber-350 flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-mono text-[9px] bg-amber-500/10 text-amber-400 px-1 py-0.5 rounded mr-1">
                      {issue.rule}
                    </strong>
                    {issue.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All checklist ok indicator */}
        {result.issues.length === 0 && (
          <div className="text-center py-6 text-neutral-500 text-xs">
            All checklist rules matched. No problems reported.
          </div>
        )}
      </div>
    </div>
  );
}
