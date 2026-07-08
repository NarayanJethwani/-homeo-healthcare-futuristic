"use client";

import React from "react";
import { GitCompare, ArrowDown, HelpCircle, Activity, Info } from "lucide-react";
import { KnowledgeEntity } from "../types";

interface InterpretationAlgorithmProps {
  entity: KnowledgeEntity;
}

export default function InterpretationAlgorithm({ entity }: InterpretationAlgorithmProps) {
  const algo = entity.interpretationAlgorithm;

  if (!algo || !algo.steps || algo.steps.length === 0) {
    return null; // Gracefully hide if no data exists
  }

  return (
    <div id="interpretation-algorithm" className="space-y-4 border-t border-neutral-500/5 pt-6 scroll-mt-24">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
        <Activity className="h-5 w-5 text-indigo-500" /> {algo.title || "How Clinicians Interpret This Test"}
      </h3>
      
      <div className="flex flex-col items-center justify-center p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-neutral-50/50 dark:bg-neutral-950/20 max-w-lg mx-auto space-y-4">
        {algo.steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="w-full flex flex-col items-center">
              {/* Step Card */}
              <div className={`p-4 w-full rounded-2xl border text-center transition-all shadow-sm ${
                step.type === "question"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300"
                  : step.type === "action"
                  ? "bg-teal-500/10 border-teal-500/30 text-teal-900 dark:text-teal-300 font-semibold"
                  : "bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-300"
              }`}>
                {step.type === "question" && (
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-amber-500 dark:text-amber-400 block mb-1">
                    Decision Point
                  </span>
                )}
                {step.type === "action" && (
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-teal-500 dark:text-teal-400 block mb-1">
                    Diagnostic Action
                  </span>
                )}
                {step.type === "consideration" && (
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-indigo-500 dark:text-indigo-400 block mb-1">
                    Clinical Consideration
                  </span>
                )}
                <p className="text-xs md:text-sm">{step.label}</p>

                {step.options && step.options.length > 0 && (
                  <div className="flex justify-center gap-4 mt-2">
                    {step.options.map((opt, oIdx) => (
                      <span key={oIdx} className="text-[10px] bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-neutral-750">
                        {opt.value} → {opt.nextStepLabel}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Connecting Arrow */}
            {idx < algo.steps.length - 1 && (
              <ArrowDown className="h-4.5 w-4.5 text-neutral-400 dark:text-neutral-650 animate-bounce" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
