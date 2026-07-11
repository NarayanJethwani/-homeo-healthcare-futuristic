import React from "react";
import { SearchIndexEntry } from "../../search/localSearchTypes";

type SearchFiltersProps = {
  indexEntries: SearchIndexEntry[];
  selectedAuthor: string;
  onAuthorChange: (val: string) => void;
  selectedBook: string;
  onBookChange: (val: string) => void;
  selectedEdition: string;
  onEditionChange: (val: string) => void;
  selectedSection: string;
  onSectionChange: (val: string) => void;
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  indexEntries,
  selectedAuthor,
  onAuthorChange,
  selectedBook,
  onBookChange,
  selectedEdition,
  onEditionChange,
  selectedSection,
  onSectionChange,
}) => {
  // Derive options only from active eligible index entries
  const authors = Array.from(new Set(indexEntries.map((e) => e.authorName)));
  const books = Array.from(new Set(indexEntries.map((e) => e.bookTitle)));
  const editions = Array.from(new Set(indexEntries.map((e) => e.editionId)));
  const sections = Array.from(new Set(indexEntries.flatMap((e) => entrySections(e))));

  function entrySections(entry: SearchIndexEntry) {
    return entry.sectionLabels.map((s) => {
      if (s.startsWith("Introduction:")) return "Introduction";
      return s;
    });
  }

  const uniqueSections = Array.from(new Set(sections));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
      <div>
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
          Author Filter
        </label>
        <select
          value={selectedAuthor}
          onChange={(e) => onAuthorChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500/50 focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Authors ({authors.length})</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
          Book Filter
        </label>
        <select
          value={selectedBook}
          onChange={(e) => onBookChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500/50 focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Books ({books.length})</option>
          {books.map((book) => (
            <option key={book} value={book}>
              {book}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
          Edition Filter
        </label>
        <select
          value={selectedEdition}
          onChange={(e) => onEditionChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500/50 focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Editions ({editions.length})</option>
          {editions.map((ed) => (
            <option key={ed} value={ed}>
              {ed}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">
          Section Filter
        </label>
        <select
          value={selectedSection}
          onChange={(e) => onSectionChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:border-amber-500/50 focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Sections ({uniqueSections.length})</option>
          {uniqueSections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default SearchFilters;
