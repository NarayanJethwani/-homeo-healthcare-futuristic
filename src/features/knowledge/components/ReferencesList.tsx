import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { getCitationById } from "../content/citations";

interface ReferencesListProps {
  references: string[];
}

export default function ReferencesList({ references }: ReferencesListProps) {
  if (!references || references.length === 0) return null;

  return (
    <div className="my-8 rounded-2xl border border-neutral-500/10 bg-neutral-500/5 p-6 backdrop-blur-md">
      <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" /> Reference Citations
      </h4>
      <ol className="list-decimal list-inside space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
        {references.map((refId, index) => {
          const citation = getCitationById(refId);
          if (!citation) {
            // Fallback to raw string if it's not in our database
            return (
              <li key={index} className="leading-relaxed">
                <span className="ml-1">{refId}</span>
              </li>
            );
          }

          const authorsStr = citation.authors.join(", ");
          const citationText = `${authorsStr}. "${citation.title}." ${citation.journal}${citation.year ? ` (${citation.year})` : ""}.`;

          return (
            <li key={index} className="leading-relaxed">
              <span className="ml-1">{citationText}</span>
              {citation.doi && (
                <a
                  href={`https://doi.org/${citation.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 ml-2 text-teal-600 dark:text-teal-400 hover:underline text-xs"
                >
                  DOI <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
              {citation.pubmedId && (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${citation.pubmedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 ml-2 text-teal-600 dark:text-teal-400 hover:underline text-xs"
                >
                  PubMed <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
