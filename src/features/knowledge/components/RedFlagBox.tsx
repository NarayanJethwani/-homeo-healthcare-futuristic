"use client";

import React from "react";
import { AlertOctagon, Check } from "lucide-react";
import { KnowledgeEntity } from "../types";

interface RedFlagBoxProps {
  entity: KnowledgeEntity;
}

export default function RedFlagBox({ entity }: RedFlagBoxProps) {
  const flags = entity.content?.redFlags || [];

  if (flags.length === 0) {
    return null; // Gracefully hide if no data exists
  }

  return (
    <div id="red-flags-alert" className="p-6 border border-rose-500/25 bg-rose-500/5 rounded-3xl flex gap-4 scroll-mt-24">
      <AlertOctagon className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
      <div className="space-y-3 w-full">
        <div className="space-y-1">
          <h4 className="font-extrabold text-rose-800 dark:text-rose-400 text-sm uppercase tracking-wide">
            Clinical Red Flags
          </h4>
          <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 font-medium">
            Seek urgent medical attention at an emergency department or primary care clinic if you present with any of the following symptoms:
          </p>
        </div>
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-800 dark:text-neutral-300">
          {flags.map((flag: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
              <span className="bg-rose-500 text-white rounded-full p-0.5 shrink-0 mt-0.5">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="font-semibold text-rose-950 dark:text-rose-200">{flag}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
