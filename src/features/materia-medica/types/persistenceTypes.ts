export type PersistenceState =
  | "idle"
  | "saving"
  | "synced"
  | "offline-pending"
  | "local-only"
  | "conflict"
  | "failed";

export type AnnotationAnchorState =
  | "valid"
  | "source-version-changed"
  | "text-mismatch"
  | "orphaned";

export interface MateriaMedicaAnnotation {
  id: string;
  practitionerId: string;

  bookId: string;
  sourceVersionId: string;
  passageId: string;
  blockId: string;

  annotationType:
    | "keynote"
    | "mental"
    | "general"
    | "modality"
    | "causation"
    | "clinical"
    | "differential"
    | "personal";

  selectedText?: string;
  noteText?: string;

  anchor: {
    startOffset: number;
    endOffset: number;
    textChecksum: string;
  };

  anchorState: AnnotationAnchorState;

  createdAt: string;
  updatedAt: string;
  revision: number;
}

export interface MateriaMedicaBookmark {
  id: string;
  practitionerId: string;
  bookId: string;
  sourceVersionId: string;
  passageId: string;
  blockId?: string;
  createdAt: string;
}

export interface MateriaMedicaReaderPosition {
  practitionerId: string;
  bookId: string;
  sourceVersionId: string;
  passageId: string;
  blockId?: string;
  relativeOffset?: number;
  updatedAt: string;
}
