import React from "react";
import { BookCard } from "./BookCard";
import { MateriaMedicaBook } from "../../types";

type LibrarySectionProps = {
  title: string;
  description?: string;
  books: MateriaMedicaBook[];
  onViewDetails: (book: MateriaMedicaBook) => void;
  onViewAuthor: (authorId: string) => void;
};

export const LibrarySection: React.FC<LibrarySectionProps> = ({
  title,
  description,
  books,
  onViewDetails,
  onViewAuthor,
}) => {
  if (books.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 mb-10 last:mb-0">
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs font-normal text-slate-500 font-mono">({books.length})</span>
        </h2>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onViewDetails={onViewDetails}
            onViewAuthor={onViewAuthor}
          />
        ))}
      </div>
    </section>
  );
};
