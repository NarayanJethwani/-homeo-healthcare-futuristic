import React from "react";
import { BookOpen, ExternalLink } from "lucide-react";

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
        {references.map((ref, index) => {
          // Detect if reference includes a URL or DOI and extract it
          const urlMatch = ref.match(/(https?:\/\/[^\s]+)/g);
          const url = urlMatch ? urlMatch[0] : null;
          const cleanText = url ? ref.replace(url, "") : ref;

          return (
            <li key={index} className="leading-relaxed">
              <span className="ml-1">{cleanText}</span>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ml-2 text-teal-600 dark:text-teal-400 hover:underline"
                >
                  View Source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
