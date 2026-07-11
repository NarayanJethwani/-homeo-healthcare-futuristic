import React, { useState, useMemo } from "react";
import { LibraryHeader } from "./LibraryHeader";
import { LibraryFilters } from "./LibraryFilters";
import { LibrarySection } from "./LibrarySection";
import { BookProvenancePanel } from "./BookProvenancePanel";
import { AuthorProfile } from "../authors/AuthorProfile";
import { EmptyLibraryState } from "./EmptyLibraryState";
import { MATERIA_MEDICA_REGISTRY } from "../../data/registry";
import { MateriaMedicaBook } from "../../types";

type FilterState = {
  author: string;
  yearRange: string;
  sourceProvider: string;
  rightsStatus: string;
  editorialStatus: string;
  ingestionStatus: string;
};

const initialFilters: FilterState = {
  author: "",
  yearRange: "",
  sourceProvider: "",
  rightsStatus: "",
  editorialStatus: "",
  ingestionStatus: "",
};

export const MateriaMedicaLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedBook, setSelectedBook] = useState<MateriaMedicaBook | null>(null);
  const [selectedAuthorName, setSelectedAuthorName] = useState<string | null>(null);

  // Extract unique filters from registry
  const availableAuthors = useMemo(() => {
    return Array.from(new Set(MATERIA_MEDICA_REGISTRY.map((b) => b.author))).sort();
  }, []);

  const availableProviders = useMemo(() => {
    return Array.from(
      new Set(
        MATERIA_MEDICA_REGISTRY.map((b) => {
          try {
            return new URL(b.sourceUrl).hostname.replace("www.", "");
          } catch {
            return "";
          }
        }).filter(Boolean)
      )
    ).sort();
  }, []);

  const availableYears = useMemo(() => {
    return Array.from(new Set(MATERIA_MEDICA_REGISTRY.map((b) => b.year))).sort((a, b) => a - b);
  }, []);

  // Filter book collection
  const filteredBooks = useMemo(() => {
    return MATERIA_MEDICA_REGISTRY.filter((book) => {
      // 1. Search Query Match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.year.toString().includes(query) ||
          book.rightsStatus.toLowerCase().includes(query) ||
          book.id.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 2. Author Filter
      if (filters.author && book.author !== filters.author) return false;

      // 3. Provider Filter
      if (filters.sourceProvider) {
        try {
          const providerHost = new URL(book.sourceUrl).hostname.replace("www.", "");
          if (providerHost !== filters.sourceProvider) return false;
        } catch {
          return false;
        }
      }

      // 4. Rights Status Filter
      if (filters.rightsStatus && book.rightsStatus !== filters.rightsStatus) return false;

      // 5. Editorial Status Filter
      if (filters.editorialStatus && book.editorialStatus !== filters.editorialStatus) return false;

      // 6. Ingestion Status Filter
      if (filters.ingestionStatus) {
        if (filters.ingestionStatus === "approved" && book.ingestionStatus !== "approved") return false;
        if (filters.ingestionStatus === "not-ingested" && book.ingestionStatus === "approved") return false;
        if (filters.ingestionStatus === "blocked" && book.ingestionStatus !== "blocked" && book.rightsStatus !== "restricted") return false;
      }

      // 7. Year Range Epoch Filter
      if (filters.yearRange) {
        const [start, end] = filters.yearRange.split("-").map(Number);
        if (book.year < start || book.year > end) return false;
      }

      return true;
    });
  }, [searchTerm, filters]);

  // Group filtered books by sections
  const sections = useMemo(() => {
    const groups = {
      foundational: [] as MateriaMedicaBook[],
      pure: [] as MateriaMedicaBook[],
      keynotes: [] as MateriaMedicaBook[],
      clinical: [] as MateriaMedicaBook[],
      comparative: [] as MateriaMedicaBook[],
      rightsReview: [] as MateriaMedicaBook[],
    };

    filteredBooks.forEach((book) => {
      // Rights review overrides sections if unverified or requested
      if (book.rightsStatus === "rights-review-required") {
        groups.rightsReview.push(book);
        return;
      }

      // Category grouping based on historical usage
      if (
        book.id === "james-tyler-kent" ||
        book.id === "samuel-hahnemann-organon" ||
        book.id === "constantine-hering-guiding"
      ) {
        groups.foundational.push(book);
      }
      
      if (book.id === "samuel-hahnemann-organon") {
        groups.pure.push(book);
      } else if (book.id === "henry-c-allen" || book.id === "adolf-zur-lippe") {
        groups.keynotes.push(book);
      } else if (
        book.id === "william-boericke" ||
        book.id === "william-boericke-short" ||
        book.id === "john-henry-clarke"
      ) {
        groups.clinical.push(book);
      } else if (book.id === "cyrus-maxwell-boger" || book.id === "benoit-mure") {
        groups.comparative.push(book);
      } else {
        // Fallback catch-all
        groups.clinical.push(book);
      }
    });

    return groups;
  }, [filteredBooks]);

  const handleFilterChange = (key: keyof FilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters(initialFilters);
  };

  // Associated books for author profile modal lookup
  const authorAssociatedBooks = useMemo(() => {
    if (!selectedAuthorName) return [];
    return MATERIA_MEDICA_REGISTRY.filter((b) => b.author === selectedAuthorName);
  }, [selectedAuthorName]);

  return (
    <div className="flex flex-col gap-8 p-1 sm:p-4 text-slate-100 max-w-7xl mx-auto w-full">
      {/* Header */}
      <LibraryHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalBooks={MATERIA_MEDICA_REGISTRY.length}
        filteredCount={filteredBooks.length}
      />

      {/* Filters */}
      <LibraryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        availableAuthors={availableAuthors}
        availableProviders={availableProviders}
        availableYears={availableYears}
      />

      {/* Catalog Sections */}
      {filteredBooks.length === 0 ? (
        <EmptyLibraryState searchTerm={searchTerm} onClearFilters={handleClearFilters} />
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          <LibrarySection
            title="Foundational Works"
            description="Core classical structures outlining key provings and homeopathic theory."
            books={sections.foundational}
            onViewDetails={setSelectedBook}
            onViewAuthor={setSelectedAuthorName}
          />

          <LibrarySection
            title="Pure Materia Medica"
            description="Pure drug pathogeneses and primary case record provings."
            books={sections.pure}
            onViewDetails={setSelectedBook}
            onViewAuthor={setSelectedAuthorName}
          />

          <LibrarySection
            title="Keynotes & Characteristics"
            description="Concise outlines of characteristic and diagnostic indicators."
            books={sections.keynotes}
            onViewDetails={setSelectedBook}
            onViewAuthor={setSelectedAuthorName}
          />

          <LibrarySection
            title="Clinical References"
            description="Comprehensive dictionaries and manuals with clinical therapeutic indexes."
            books={sections.clinical}
            onViewDetails={setSelectedBook}
            onViewAuthor={setSelectedAuthorName}
          />

          <LibrarySection
            title="Comparative & Regional Works"
            description="Comparative studies, synoptic keys, and geographical provings."
            books={sections.comparative}
            onViewDetails={setSelectedBook}
            onViewAuthor={setSelectedAuthorName}
          />

          <LibrarySection
            title="Rights Review Required"
            description="Registered stubs currently blocked pending clinical copyright review."
            books={sections.rightsReview}
            onViewDetails={setSelectedBook}
            onViewAuthor={setSelectedAuthorName}
          />
        </div>
      )}

      {/* Details Provenance Overlay Modal */}
      {selectedBook && (
        <BookProvenancePanel book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {/* Author Profile Drawer Modal */}
      {selectedAuthorName && (
        <AuthorProfile
          authorName={selectedAuthorName}
          associatedBooks={authorAssociatedBooks}
          onClose={() => setSelectedAuthorName(null)}
          onViewBookDetails={(b) => {
            setSelectedAuthorName(null);
            setSelectedBook(b);
          }}
        />
      )}
    </div>
  );
};
