"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  id?: string;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  id,
  icon,
  defaultExpanded = true,
  children
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section id={id} className="border border-neutral-500/10 rounded-2xl bg-white/5 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left text-neutral-900 dark:text-neutral-50 font-bold hover:bg-neutral-500/5 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-neutral-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-5 border-t border-neutral-500/5 text-neutral-700 dark:text-neutral-350 text-sm leading-relaxed space-y-4">
          {children}
        </div>
      )}
    </section>
  );
}
