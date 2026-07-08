"use client";

import React from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { KnowledgeEntity } from "../types";

interface AICitationBlockProps {
  entity: KnowledgeEntity;
}

export default function AICitationBlock({ entity }: AICitationBlockProps) {
  const [copied, setCopied] = React.useState(false);
  
  const title = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
  const citationText = `${entity.author.name}. "${title}." Homeo Healthcare Clinical Platform. Version ${entity.versionInfo.version}. Reviewed: ${entity.versionInfo.reviewed}. Available at: ${entity.canonicalUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-teal-500/10 pb-3">
        <h4 className="font-semibold text-teal-800 dark:text-teal-400 flex items-center gap-2 text-sm uppercase tracking-wider">
          <Terminal className="h-4 w-4" /> AI & Generative Search Citation Block
        </h4>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline transition-colors"
          title="Copy Citation to Clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy Citation
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs text-teal-950/80 dark:text-teal-300/80 mb-4">
        <div>
          <span className="font-semibold block text-[10px] uppercase opacity-60">Entity ID</span>
          <code className="bg-teal-500/10 px-1.5 py-0.5 rounded font-mono text-[11px]">
            {entity.id}
          </code>
        </div>
        <div>
          <span className="font-semibold block text-[10px] uppercase opacity-60">Entity Type</span>
          <span className="capitalize">{entity.entityType}</span>
        </div>
        <div>
          <span className="font-semibold block text-[10px] uppercase opacity-60">Content Version</span>
          <span>v{entity.versionInfo.version}</span>
        </div>
        <div>
          <span className="font-semibold block text-[10px] uppercase opacity-60">Last Reviewed Date</span>
          <span>{new Date(entity.versionInfo.reviewed).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="font-semibold block text-[10px] uppercase opacity-60">Evidence Level</span>
          <span>{entity.evidenceLevel}</span>
        </div>
        <div>
          <span className="font-semibold block text-[10px] uppercase opacity-60">Canonical Target</span>
          <a href={entity.canonicalUrl} className="hover:underline text-teal-600 dark:text-teal-400">
            {entity.canonicalUrl}
          </a>
        </div>
      </div>

      <div className="bg-teal-500/10 rounded-lg p-3.5 border border-teal-500/10">
        <span className="font-semibold block text-[9px] uppercase text-teal-800 dark:text-teal-400 mb-1.5">
          Suggested Academic/LLM Citation format (AMA Style)
        </span>
        <p className="text-xs font-mono leading-relaxed text-teal-900/90 dark:text-teal-200/95 break-words">
          {citationText}
        </p>
      </div>
    </div>
  );
}
