"use client";

import React, { useState } from "react";
import { History, Calendar, Award, ChevronDown, ChevronUp } from "lucide-react";

interface TimelineHistoryProps {
  versionInfo: {
    version: string;
    created: string;
    updated: string;
    reviewed: string;
    deprecated?: boolean;
    replacementEntityId?: string;
  };
  reviewer: {
    name: string;
    credentials?: string;
    specialty?: string;
  };
}

export default function TimelineHistory({ versionInfo, reviewer }: TimelineHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  const createdDate = new Date(versionInfo.created).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const updatedDate = new Date(versionInfo.updated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="p-5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-4 print-hide">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <History className="h-4 w-4 text-teal-500" /> Article Editorial Timeline
        </h4>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline font-bold flex items-center gap-0.5"
        >
          {expanded ? (
            <>Collapse Revisions <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>View Revision History <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-neutral-450 shrink-0" />
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Originally Published</span>
            <span className="font-semibold text-neutral-850 dark:text-neutral-200">{createdDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-neutral-450 shrink-0" />
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Last Clinically Updated</span>
            <span className="font-semibold text-neutral-850 dark:text-neutral-200">{updatedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-neutral-450 shrink-0" />
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Reviewer Validation</span>
            <span className="font-semibold text-neutral-850 dark:text-neutral-200 truncate max-w-[150px] block">
              {reviewer.name} {reviewer.credentials && `, ${reviewer.credentials}`}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 animate-fadeIn text-xs">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Revision Changelog (v{versionInfo.version})</span>
          {(versionInfo as any).changelog && (versionInfo as any).changelog.length > 0 ? (
            <ul className="space-y-1.5 pl-4 list-disc text-neutral-600 dark:text-neutral-400">
              {(versionInfo as any).changelog.map((log: string, idx: number) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-neutral-500">Initial medical validation audit and publication release.</p>
          )}
        </div>
      )}
    </div>
  );
}
