import React from "react";
import { ReaderPreferences, FONT_SIZE_MAPPING, LINE_HEIGHT_MAPPING, COLUMN_WIDTH_MAPPING } from "../../reader/preferences";

type ReaderContentViewProps = {
  selectedRemedyTitle: string | null;
  selectedRemedyContent: string | null;
  preferences: ReaderPreferences;
  bookTitle: string;
  bookAuthor: string;
  bookYear: number;
};

// Robust HTML Sanitizer to prevent XSS attacks on proving texts
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // 1. Remove script tags and their contents
  let clean = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "");

  // 2. Remove inline event handlers (e.g. onerror, onload, onclick, etc.)
  clean = clean.replace(/on\w+\s*=\s*(['"])(.*?)\1/gi, "");
  clean = clean.replace(/on\w+\s*=\s*([^>\s]+)/gi, "");

  // 3. Neutralize javascript: protocol links
  clean = clean.replace(/href\s*=\s*(['"])javascript:.*?\1/gi, 'href="#"');

  return clean;
}

export const ReaderContentView: React.FC<ReaderContentViewProps> = ({
  selectedRemedyTitle,
  selectedRemedyContent,
  preferences,
  bookTitle,
  bookAuthor,
  bookYear,
}) => {
  const contentStyle = {
    fontSize: FONT_SIZE_MAPPING[preferences.fontSize],
    lineHeight: LINE_HEIGHT_MAPPING[preferences.lineHeight],
    maxWidth: COLUMN_WIDTH_MAPPING[preferences.columnWidth],
  } as React.CSSProperties;

  if (!selectedRemedyTitle || !selectedRemedyContent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900/10 border border-slate-800 rounded-3xl min-h-[350px]">
        <span className="text-xl font-serif text-slate-400 font-bold">Select a remedy to begin reading</span>
        <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
          Choose a remedy from the alphabetical list on the left to view James Tyler Kent's lectures and clinical provings.
        </p>
      </div>
    );
  }

  const sanitized = sanitizeHtml(selectedRemedyContent);

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 bg-slate-900/10 border border-slate-800 rounded-3xl min-h-[400px]">
      <article className="prose prose-slate mx-auto w-full" style={contentStyle}>
        <div className="border-b border-slate-800/60 pb-6 mb-6">
          <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2 leading-tight">
            {selectedRemedyTitle}
          </h1>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
            <span>{bookTitle}</span>
            <span>·</span>
            <span>By {bookAuthor} ({bookYear})</span>
          </div>
        </div>

        <div
          className="reader-proving-content font-serif text-slate-300 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      </article>
    </div>
  );
};
export default ReaderContentView;
