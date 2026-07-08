"use client";

import React from "react";
import { BookOpen, ExternalLink, Shield } from "lucide-react";
import { getCitationById } from "../content/citations";
import { CitationCategory } from "../types";

interface ReferencesListProps {
  references: string[];
}

const CATEGORY_TITLES: Record<string, string> = {
  "Clinical-Guidelines": "Clinical Guidelines & Consensus Statements",
  "Primary-Research": "Primary Clinical Research & Trials",
  "Systematic-Reviews": "Systematic Reviews & Meta-Analyses",
  "Classical-Homeopathic-Literature": "Classical Homeopathic Literature",
  "Materia-Medica": "Materia Medica & Keynotes",
  "Organon": "Organon & Philosophy",
  "Historical-References": "Historical Clinical References",
  "Clinical-Review": "Clinical Reviews & Textbooks"
};

export default function ReferencesList({ references }: ReferencesListProps) {
  if (!references || references.length === 0) return null;

  // Group resolved citations
  const categoriesMap: Record<string, { refId: string; citation: any }[]> = {};

  references.forEach((refId) => {
    const citation = getCitationById(refId);
    let resolvedCategory: string = "Clinical-Review";

    if (citation) {
      if (citation.category) {
        resolvedCategory = citation.category;
      } else {
        // Auto-assign based on historical and literature properties
        const authorLower = citation.authors.join(" ").toLowerCase();
        const titleLower = citation.title.toLowerCase();
        if (authorLower.includes("hahnemann") && (titleLower.includes("organon") || titleLower.includes("organon of medicine"))) {
          resolvedCategory = "Organon";
        } else if (authorLower.includes("hahnemann") || authorLower.includes("kent") || authorLower.includes("boericke") || authorLower.includes("allen") || authorLower.includes("clarke") || authorLower.includes("phatak")) {
          resolvedCategory = "Materia-Medica";
        } else if (titleLower.includes("guideline") || titleLower.includes("consensus")) {
          resolvedCategory = "Clinical-Guidelines";
        } else if (titleLower.includes("review") || titleLower.includes("meta-analysis") || titleLower.includes("systematic")) {
          resolvedCategory = "Systematic-Reviews";
        } else if (citation.year && citation.year < 1950) {
          resolvedCategory = "Historical-References";
        } else {
          resolvedCategory = "Primary-Research";
        }
      }
    }

    if (!categoriesMap[resolvedCategory]) {
      categoriesMap[resolvedCategory] = [];
    }
    categoriesMap[resolvedCategory].push({ refId, citation });
  });

  // Order categories to display Guidelines, Reviews, Primary Research first, then Classical literature
  const displayOrder = [
    "Clinical-Guidelines",
    "Systematic-Reviews",
    "Primary-Research",
    "Classical-Homeopathic-Literature",
    "Organon",
    "Materia-Medica",
    "Historical-References",
    "Clinical-Review"
  ];

  return (
    <div className="my-8 rounded-2xl border border-neutral-250 dark:border-neutral-850 bg-neutral-500/5 p-6 backdrop-blur-md print:border-neutral-400 print:bg-transparent">
      <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 mb-6 border-b border-neutral-500/5 pb-2 print:text-neutral-900">
        <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" /> Reference Citations & Evidence Sources
      </h4>

      <div className="space-y-6">
        {displayOrder.map((catKey) => {
          const items = categoriesMap[catKey];
          if (!items || items.length === 0) return null;

          return (
            <div key={catKey} className="space-y-3">
              <h5 className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5 print:text-neutral-800">
                <Shield className="h-3 w-3 shrink-0" />
                {CATEGORY_TITLES[catKey] || catKey.replace(/-/g, " ")}
              </h5>
              <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-350 list-none pl-1">
                {items.map(({ refId, citation }, idx) => {
                  if (!citation) {
                    return (
                      <li key={idx} className="leading-relaxed border-l-2 border-neutral-300 pl-3">
                        <span className="font-mono text-[10px] text-neutral-400 block mb-0.5">{refId}</span>
                        <span>Clinical Review pending verification</span>
                      </li>
                    );
                  }

                  const authorsStr = citation.authors.join(", ");
                  const citationText = `${authorsStr}. "${citation.title}." ${citation.journal}${citation.year ? ` (${citation.year})` : ""}.`;

                  return (
                    <li key={idx} className="leading-relaxed border-l-2 border-teal-500/20 dark:border-teal-500/10 pl-3 hover:border-teal-500/40 transition-colors">
                      <span className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 block mb-0.5">{refId}</span>
                      <span>{citationText}</span>
                      {citation.doi && (
                        <a
                          href={`https://doi.org/${citation.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 ml-2 text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          DOI <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                      {citation.pubmedId && (
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${citation.pubmedId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 ml-2 text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          PubMed <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
