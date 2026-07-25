import sampleCorpus from "./sampleCorpus.json";
import machineCorpus from "./machineCorpusManifest.json";

export type MateriaMedicaContentInventory = {
  bookId: string;
  verifiedPassageCount: number;
  verifiedCharacterCount: number;
  machineChunkCount: number;
  machineCharacterCount: number;
  sourceVolumeCount: number;
  coverage: "complete-machine-validated" | "partial" | "not-ingested";
  editorialStatus: "approved" | "needs-review" | "not-ingested";
};

const verifiedPassages = sampleCorpus.passages.filter(
  (passage) => passage.editorialStatus === "approved" && passage.correctionStatus === "human-reviewed",
);

const inventoryByBook = new Map<string, MateriaMedicaContentInventory>();

for (const passage of verifiedPassages) {
  const current = inventoryByBook.get(passage.bookId) ?? {
    bookId: passage.bookId,
    verifiedPassageCount: 0,
    verifiedCharacterCount: 0,
    machineChunkCount: 0,
    machineCharacterCount: 0,
    sourceVolumeCount: 0,
    coverage: "partial" as const,
    editorialStatus: "approved" as const,
  };

  current.verifiedPassageCount += 1;
  current.verifiedCharacterCount += passage.originalText.length;
  inventoryByBook.set(passage.bookId, current);
}

for (const machineBook of machineCorpus.books) {
  const current = inventoryByBook.get(machineBook.bookId) ?? {
    bookId: machineBook.bookId,
    verifiedPassageCount: 0,
    verifiedCharacterCount: 0,
    machineChunkCount: 0,
    machineCharacterCount: 0,
    sourceVolumeCount: 0,
    coverage: "not-ingested" as const,
    editorialStatus: "not-ingested" as const,
  };
  current.machineChunkCount = machineBook.chunkCount;
  current.machineCharacterCount = machineBook.characterCount;
  current.sourceVolumeCount = machineBook.sourceCount;
  current.coverage = "complete-machine-validated";
  current.editorialStatus = "needs-review";
  inventoryByBook.set(machineBook.bookId, current);
}

export function getBookContentInventory(bookId: string): MateriaMedicaContentInventory {
  return inventoryByBook.get(bookId) ?? {
    bookId,
    verifiedPassageCount: 0,
    verifiedCharacterCount: 0,
    machineChunkCount: 0,
    machineCharacterCount: 0,
    sourceVolumeCount: 0,
    coverage: "not-ingested",
    editorialStatus: "not-ingested",
  };
}

export const VERIFIED_PASSAGE_COUNT = verifiedPassages.length;
export const BOOKS_WITH_VERIFIED_CONTENT_COUNT = new Set(verifiedPassages.map((passage) => passage.bookId)).size;
export const MACHINE_VALIDATED_BOOK_COUNT = machineCorpus.books.length;
export const MACHINE_VALIDATED_CHUNK_COUNT = machineCorpus.books.reduce((sum, book) => sum + book.chunkCount, 0);
export const MACHINE_VALIDATED_CHARACTER_COUNT = machineCorpus.books.reduce((sum, book) => sum + book.characterCount, 0);
export const INGESTED_SOURCE_VOLUME_COUNT = machineCorpus.books.reduce((sum, book) => sum + book.sourceCount, 0);
