export type RightsStatus =
  | "public-domain"
  | "licensed"
  | "rights-review-required"
  | "restricted";

export type EditorialStatus =
  | "draft"
  | "needs-review"
  | "approved"
  | "rejected";

export type CorrectionStatus =
  | "raw-ocr"
  | "machine-cleaned"
  | "human-reviewed";

export type LicensePermissions = {
  mayStoreLocally: boolean;
  mayDisplayFullText: boolean;
  mayIndexForSearch: boolean;
  mayUseForAiRetrieval: boolean;
  commercialUseAllowed: boolean;
  expiresAt?: string;
};

export type MateriaMedicaLicenseRecord = {
  licenseName: string;
  licenseVersion?: string;
  licensor: string;
  evidenceUrl?: string;
  evidenceDocumentId?: string;
  jurisdiction?: string;
  effectiveAt: string;
  expiresAt?: string;
  permissions: LicensePermissions;
  reviewedBy: string;
  reviewedAt: string;
};

export type IngestionStatus =
  | "registered"
  | "rights-review"
  | "rights-approved"
  | "download-pending"
  | "downloaded"
  | "checksum-verified"
  | "ocr-extracted"
  | "structurally-parsed"
  | "machine-validated"
  | "editorial-review"
  | "approved"
  | "search-indexed"
  | "blocked"
  | "deprecated";

export type IngestionBlockCode =
  | "rights-unverified"
  | "rights-restricted"
  | "download-failed"
  | "checksum-mismatch"
  | "ocr-failed"
  | "structure-invalid"
  | "editorial-rejected"
  | "source-version-changed";

export type RagPublicationState =
  | "not-evaluated"
  | "ineligible"
  | "eligible"
  | "index-pending"
  | "indexed"
  | "withdrawn";

export type MateriaMedicaBook = {
  id: string;
  versionId?: string;
  supersedesVersionId?: string;
  createdFromVersionId?: string;
  title: string;
  author: string;
  year: number;
  rightsStatus: RightsStatus;
  licensePermissions?: LicensePermissions;
  licenseRecord?: MateriaMedicaLicenseRecord;
  editorialStatus: EditorialStatus;
  ingestionStatus: IngestionStatus;
  blockCode?: IngestionBlockCode;
  checksum?: string;
  sourceUrl: string;
  archiveIdentifier?: string;
  provenanceNotes?: string;
  sourceVersion: number;
  deprecatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  ragPublicationState?: RagPublicationState;
  lastUpdated: string;
};

export type MateriaMedicaPassage = {
  id: string;
  bookId: string;
  remedyId: string;
  sourcePageStart: number;
  sourcePageEnd?: number;
  originalText: string;
  normalizedText: string;
  correctionStatus: CorrectionStatus;
  editorialStatus: EditorialStatus;
  searchable: boolean;
  ragState: RagPublicationState;
  sourceVersion: number;
  deprecatedAt?: string;
  lastUpdated: string;
};

export type MateriaMedicaAuditEntry = {
  id: string;
  entityId: string; // bookId or passageId
  entityType: "book" | "passage";
  action: string;
  previousState: string;
  newState: string;
  operatorId: string;
  operatorName: string;
  timestamp: string;
  notes?: string;
};

// Explicit license validation helper
export function licenseAllowsAiRetrieval(
  permissions: LicensePermissions | undefined,
  now = new Date(),
): boolean {
  if (!permissions) return false;

  if (
    !permissions.mayStoreLocally ||
    !permissions.mayIndexForSearch ||
    !permissions.mayUseForAiRetrieval
  ) {
    return false;
  }

  if (
    permissions.expiresAt &&
    new Date(permissions.expiresAt).getTime() <= now.getTime()
  ) {
    return false;
  }

  return true;
}

// Derived RAG eligibility calculation helper
export function isPassageRagEligible(
  book: MateriaMedicaBook,
  passage: MateriaMedicaPassage,
  now = new Date(),
): boolean {
  const rightsPermitRetrieval =
    book.rightsStatus === "public-domain" ||
    (book.rightsStatus === "licensed" &&
      licenseAllowsAiRetrieval(book.licensePermissions, now));

  return (
    !!rightsPermitRetrieval &&
    book.editorialStatus === "approved" &&
    passage.editorialStatus === "approved" &&
    passage.correctionStatus === "human-reviewed" &&
    passage.searchable === true &&
    passage.deprecatedAt == null &&
    book.deprecatedAt == null
  );
}

// Ingestion Block State Machine Matrix
export const blockRecoveryState: Record<IngestionBlockCode, IngestionStatus | null> = {
  "rights-unverified": "rights-review",
  "rights-restricted": null,
  "download-failed": "download-pending",
  "checksum-mismatch": "download-pending",
  "ocr-failed": "checksum-verified",
  "structure-invalid": "ocr-extracted",
  "editorial-rejected": "machine-validated",
  "source-version-changed": "rights-review",
};

// Ingestion state transition validation
export function isValidTransition(
  current: IngestionStatus,
  next: IngestionStatus,
): boolean {
  if (current === "deprecated") return false;
  if (next === "deprecated") return true; // any state can be deprecated
  if (next === "blocked") return true;    // any state can be blocked

  const transitions: Record<IngestionStatus, IngestionStatus[]> = {
    registered: ["rights-review", "blocked"],
    "rights-review": ["rights-approved", "blocked"],
    "rights-approved": ["download-pending", "blocked"],
    "download-pending": ["downloaded", "blocked"],
    downloaded: ["checksum-verified", "blocked"],
    "checksum-verified": ["ocr-extracted", "blocked"],
    "ocr-extracted": ["structurally-parsed", "blocked"],
    "structurally-parsed": ["machine-validated", "blocked"],
    "machine-validated": ["editorial-review", "blocked"],
    "editorial-review": ["approved", "blocked"],
    approved: ["search-indexed", "blocked"],
    "search-indexed": ["deprecated"],
    blocked: [], // recovery must happen via specific recovery states
    deprecated: [],
  };

  const allowed = transitions[current] || [];
  return allowed.includes(next);
}

// Modifying approved source metadata creates a new immutable source version
export function updateBookMetadata(
  book: MateriaMedicaBook,
  updates: Partial<Omit<MateriaMedicaBook, "id" | "sourceVersion" | "lastUpdated">>,
): { book: MateriaMedicaBook; versionBumped: boolean } {
  type UpdateableKeys = keyof Omit<MateriaMedicaBook, "id" | "sourceVersion" | "lastUpdated">;
  const keyFields: Array<UpdateableKeys> = [
    "title",
    "author",
    "year",
    "rightsStatus",
    "licensePermissions",
    "licenseRecord",
    "checksum",
    "sourceUrl",
    "archiveIdentifier"
  ];

  const hasKeyFieldChange = keyFields.some(
    (field) =>
      updates[field] !== undefined &&
      JSON.stringify(updates[field]) !== JSON.stringify(book[field])
  );

  if (book.editorialStatus === "approved" && hasKeyFieldChange) {
    const prevVersionId = book.versionId || `${book.id}_v${book.sourceVersion}`;
    const nextVersion = book.sourceVersion + 1;
    return {
      book: {
        ...book,
        ...updates,
        versionId: `${book.id}_v${nextVersion}`,
        sourceVersion: nextVersion,
        lastUpdated: new Date().toISOString(),
        editorialStatus: "draft", // Resets to draft for re-review
        ingestionStatus: "rights-review", // Resets state
        ragPublicationState: "not-evaluated",
        approvedBy: undefined,
        approvedAt: undefined,
        supersedesVersionId: prevVersionId,
        createdFromVersionId: prevVersionId,
      },
      versionBumped: true
    };
  }

  return {
    book: {
      ...book,
      ...updates,
      lastUpdated: new Date().toISOString()
    },
    versionBumped: false
  };
}

export type ReaderBookSelection =
  | { type: "legacy"; bookId: string }
  | { type: "governed"; book: MateriaMedicaBook };

export type SourcePageRange = {
  printedPageStart?: number;
  printedPageEnd?: number;
  scanPageIndexStart: number;
  scanPageIndexEnd: number;
  mappingConfidence: "verified" | "probable" | "uncertain";
};

export type PassageBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "section-label"; text: string };

export type SampleMateriaMedicaPassage = {
  id: string;
  bookId: string;
  sourceVersionId: string;
  remedyId: string;
  remedyDisplayName: string;
  editionId: string;
  sourcePageRange: SourcePageRange;

  originalText: string;
  normalizedText: string;
  blocks: PassageBlock[];

  sourceFileChecksum: string;
  originalTextChecksum: string;
  normalizedTextChecksum: string;
  blocksChecksum: string;

  correctionStatus: "human-reviewed";
  editorialStatus: "approved";

  transcription: {
    actorUid: string;
    completedAt: string;
  };
  review: {
    actorUid: string;
    completedAt: string;
    decision: "approved";
  };
};

export type MateriaMedicaSourceVersion = {
  sourceVersionId: string;
  bookId: string;
  provider: "internet-archive";
  providerItemId: string;
  sourceFilename: string;
  sourceFileChecksum: string;
  sourceFileType: "pdf" | "txt" | "html" | "xml";
  sourceFileSize: number;

  rightsStatus: RightsStatus;
  editorialStatus: EditorialStatus;
  ingestionStatus: IngestionStatus;

  approvedBy?: string;
  approvedAt?: string;
  deprecatedAt?: string;
};

export type SampleCorpusManifest = {
  manifestVersion: 1;
  sourceVersionId: string;
  passageIds: string[];
  manifestChecksum: string;
};

