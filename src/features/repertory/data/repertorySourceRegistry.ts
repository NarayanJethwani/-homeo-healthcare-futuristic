import { RepertorySourceCapabilities } from '../types';

export type RepertoryRightsStatus =
  | "public-domain"
  | "licensed"
  | "permission-required"
  | "copyrighted"
  | "uncertain";

export type RepertoryAcquisitionStatus =
  | "metadata-only"
  | "sample"
  | "partial"
  | "complete-unvalidated"
  | "complete-validated";

export type RepertoryEditorialStatus =
  | "not-submitted"
  | "clinical-review"
  | "editorial-review"
  | "approved"
  | "rejected";

export type RepertoryPublicationStatus =
  | "not-published"
  | "staged"
  | "active"
  | "superseded"
  | "blocked";

export type RepertorySourceRecord = {
  id: string;
  canonicalTitle: string;
  shortTitle: string;
  author: string;
  editor?: string;
  translator?: string;
  originalPublicationYear?: number;
  editionPublicationYear: number;
  editionLabel: string;
  publisher?: string;
  volumeCount?: number;
  language: string;

  rightsStatus: RepertoryRightsStatus;
  ingestionAllowed: boolean;
  aiIndexingAllowed: boolean;
  capabilities: RepertorySourceCapabilities;

  acquisitionStatus: RepertoryAcquisitionStatus;
  editorialStatus: RepertoryEditorialStatus;
  publicationStatus: RepertoryPublicationStatus;

  expectedVolumeCount?: number;
  processedVolumeCount?: number;

  expectedPageCount?: number;
  processedPageCount?: number;

  chapterCount?: number;
  rubricCount?: number;
  remedyEntryCount?: number;
  unresolvedMappingCount?: number;

  sourceChecksum?: string;
  sourceUrl?: string;
  archiveIdentifier?: string;
  rightsReviewNotes?: string;
  rightsReviewedBy?: string;
  rightsReviewedAt?: string;
  rightsEvidenceUrl?: string;
};

const VERIFIED_CAPABILITIES: RepertorySourceCapabilities = {
  searchable: true,
  citationEnabled: true,
  ragEnabled: true,
  scoringEnabled: true,
  normalizedScoringEnabled: true,
  canonicalRemedyClaimsEnabled: true,
  unresolvedRemedyDisclosureRequired: false,
  gradeStatus: "verified"
};

const UNRELIABLE_CAPABILITIES: RepertorySourceCapabilities = {
  searchable: true,
  citationEnabled: true,
  ragEnabled: true,
  scoringEnabled: false,
  normalizedScoringEnabled: false,
  canonicalRemedyClaimsEnabled: true,
  unresolvedRemedyDisclosureRequired: true,
  gradeStatus: "unreliable"
};

const INACTIVE_CAPABILITIES: RepertorySourceCapabilities = {
  searchable: false,
  citationEnabled: false,
  ragEnabled: false,
  scoringEnabled: false,
  normalizedScoringEnabled: false,
  canonicalRemedyClaimsEnabled: false,
  unresolvedRemedyDisclosureRequired: false,
  gradeStatus: "not-present"
};

export const REPERTORY_SOURCES: RepertorySourceRecord[] = [
  {
    id: "kent_1908",
    canonicalTitle: "Repertory of the Homoeopathic Materia Medica",
    shortTitle: "Kent Repertory",
    author: "James Tyler Kent",
    originalPublicationYear: 1897,
    editionPublicationYear: 1908,
    editionLabel: "Second Revised Edition",
    publisher: "Ehrhart & Karl",
    language: "en",
    volumeCount: 1,
    sourceUrl: "https://archive.org/details/repertoryofhomoe00kentuoft",
    archiveIdentifier: "repertoryofhomoe00kentuoft",
    rightsStatus: "public-domain",
    rightsReviewNotes: "First edition published 1897; second edition 1908. Published before the US copyright cutoff (1929). Public domain worldwide.",
    rightsReviewedBy: "CIE Editorial Board / Legal Counsel",
    rightsReviewedAt: "2026-07-10T12:00:00Z",
    ingestionAllowed: true,
    aiIndexingAllowed: true,
    capabilities: VERIFIED_CAPABILITIES,
    acquisitionStatus: "complete-validated",
    editorialStatus: "approved",
    publicationStatus: "active",
    expectedVolumeCount: 1,
    processedVolumeCount: 1,
    expectedPageCount: 1423,
    processedPageCount: 1423,
    chapterCount: 37,
    rubricCount: 65420,
    remedyEntryCount: 120531,
    unresolvedMappingCount: 0
  },
  {
    id: "boericke_1927",
    canonicalTitle: "Pocket Manual of Homoeopathic Materia Medica with Repertory",
    shortTitle: "Boericke Repertory",
    author: "William Boericke",
    editor: "Oscar E. Boericke",
    originalPublicationYear: 1901,
    editionPublicationYear: 1927,
    editionLabel: "Ninth Edition",
    publisher: "Boericke & Runyon",
    language: "en",
    volumeCount: 1,
    sourceUrl: "https://archive.org/details/pocketmanualofho00boer",
    archiveIdentifier: "pocketmanualofho00boer",
    rightsStatus: "public-domain",
    rightsReviewNotes: "The classical 9th edition was published in 1927, which is prior to the 1929 copyright threshold in the United States and has expired copyright worldwide.",
    rightsReviewedBy: "CIE Editorial Board / Legal Counsel",
    rightsReviewedAt: "2026-07-10T12:00:00Z",
    ingestionAllowed: true,
    aiIndexingAllowed: true,
    capabilities: VERIFIED_CAPABILITIES,
    acquisitionStatus: "complete-validated",
    editorialStatus: "approved",
    publicationStatus: "active",
    expectedVolumeCount: 1,
    processedVolumeCount: 1,
    expectedPageCount: 1045,
    processedPageCount: 1045,
    chapterCount: 26,
    rubricCount: 5410,
    remedyEntryCount: 14920,
    unresolvedMappingCount: 0
  },
  {
    id: "boger_boenninghausen_1905",
    canonicalTitle: "Boenninghausen's Characteristics and Repertory",
    shortTitle: "Boger Boenninghausen Characteristics",
    author: "Clemens von Boenninghausen",
    editor: "Cyrus Maxwell Boger",
    originalPublicationYear: 1905,
    editionPublicationYear: 1905,
    editionLabel: "First Edition",
    publisher: "Boericke & Tafel",
    language: "en",
    volumeCount: 1,
    sourceUrl: "https://wellcomecollection.org/works/mtw7nxyz",
    archiveIdentifier: "boenninghausensc00boenrich",
    rightsStatus: "public-domain",
    rightsEvidenceUrl: "https://wellcomecollection.org/works/mtw7nxyz",
    rightsReviewNotes: "Published in 1905 by Boericke & Tafel. Wellcome Collection explicitly documents this work as public domain. Fully eligible for ingestion.",
    rightsReviewedBy: "CIE Editorial Board",
    rightsReviewedAt: "2026-07-10T14:30:00Z",
    ingestionAllowed: true,
    aiIndexingAllowed: true,
    capabilities: INACTIVE_CAPABILITIES,
    acquisitionStatus: "sample",
    editorialStatus: "not-submitted",
    publicationStatus: "not-published"
  },
  {
    id: "boenninghausen_tpb_1891",
    canonicalTitle: "The Therapeutic Pocket Book for Homoeopathic Physicians",
    shortTitle: "Therapeutic Pocket Book",
    author: "Clemens von Boenninghausen",
    editor: "Timothy Field Allen",
    translator: "Timothy Field Allen",
    originalPublicationYear: 1846,
    editionPublicationYear: 1891,
    editionLabel: "Allen Revised Edition",
    publisher: "Boericke & Tafel",
    language: "en",
    volumeCount: 1,
    sourceUrl: "https://archive.org/details/therapeuticpock00allengoog",
    archiveIdentifier: "therapeuticpock00allengoog",
    rightsStatus: "public-domain",
    rightsReviewNotes: "Clemens von Boenninghausen's 1846 original. Timothy Field Allen's English translation published in 1891. Out of copyright worldwide.",
    rightsReviewedBy: "CIE Editorial Board",
    rightsReviewedAt: "2026-07-10T14:45:00Z",
    ingestionAllowed: true,
    aiIndexingAllowed: true,
    capabilities: INACTIVE_CAPABILITIES,
    acquisitionStatus: "sample",
    editorialStatus: "not-submitted",
    publicationStatus: "not-published"
  },
  {
    id: "boger_synoptic_1915",
    canonicalTitle: "A Synoptic Key of the Materia Medica",
    shortTitle: "Synoptic Key",
    author: "Cyrus Maxwell Boger",
    originalPublicationYear: 1915,
    editionPublicationYear: 1915,
    editionLabel: "First Edition",
    publisher: "Published by the Author",
    language: "en",
    volumeCount: 1,
    sourceUrl: "https://archive.org/details/synoptickeyofmat00boge",
    archiveIdentifier: "synoptickeyofmat00boge",
    rightsStatus: "public-domain",
    rightsReviewNotes: "First edition published 1915. Pre-1929 US publication. Public domain worldwide.",
    rightsReviewedBy: "CIE Editorial Board",
    rightsReviewedAt: "2026-07-10T15:00:00Z",
    ingestionAllowed: true,
    aiIndexingAllowed: true,
    capabilities: INACTIVE_CAPABILITIES,
    acquisitionStatus: "sample",
    editorialStatus: "not-submitted",
    publicationStatus: "not-published"
  },
  {
    id: "clarke_clinical_1904",
    canonicalTitle: "A Clinical Repertory to the Dictionary of Materia Medica",
    shortTitle: "Clarke Clinical Repertory",
    author: "John Henry Clarke",
    originalPublicationYear: 1904,
    editionPublicationYear: 1904,
    editionLabel: "First Edition",
    publisher: "The Homoeopathic Publishing Company",
    language: "en",
    volumeCount: 1,
    sourceUrl: "https://archive.org/details/aclinicalrepert00clargoog",
    archiveIdentifier: "aclinicalrepert00clargoog",
    rightsStatus: "public-domain",
    rightsEvidenceUrl: "https://archive.org/details/aclinicalrepert00clargoog",
    rightsReviewNotes: "Published in London in 1904. Pre-1929 edition. Public domain worldwide.",
    rightsReviewedBy: "CIE Editorial Board",
    rightsReviewedAt: "2026-07-10T15:15:00Z",
    ingestionAllowed: true,
    aiIndexingAllowed: true,
    capabilities: UNRELIABLE_CAPABILITIES,
    acquisitionStatus: "complete-validated",
    editorialStatus: "approved",
    publicationStatus: "staged"
  },
  {
    id: "knerr_1896",
    canonicalTitle: "Repertory of Hering's Guiding Symptoms of our Materia Medica",
    shortTitle: "Knerr Repertory",
    author: "Calvin B. Knerr",
    originalPublicationYear: 1896,
    editionPublicationYear: 1896,
    editionLabel: "First Edition",
    publisher: "The F.A. Davis Company",
    language: "en",
    volumeCount: 1,
    sourceUrl: "https://archive.org/details/guidingrepertory00kneruoft",
    archiveIdentifier: "guidingrepertory00kneruoft",
    rightsStatus: "public-domain",
    rightsReviewNotes: "First edition published 1896. Out of copyright globally.",
    rightsReviewedBy: "CIE Editorial Board",
    rightsReviewedAt: "2026-07-10T15:30:00Z",
    ingestionAllowed: true,
    aiIndexingAllowed: true,
    capabilities: INACTIVE_CAPABILITIES,
    acquisitionStatus: "sample",
    editorialStatus: "not-submitted",
    publicationStatus: "not-published"
  },
  {
    id: "gentry_1890",
    canonicalTitle: "The Concordance Repertory of the More Characteristic Symptoms of the Materia Medica",
    shortTitle: "Gentry Concordance",
    author: "William D. Gentry",
    originalPublicationYear: 1890,
    editionPublicationYear: 1890,
    editionLabel: "6 Volumes",
    publisher: "A.L. Chatterton & Co.",
    language: "en",
    volumeCount: 6,
    sourceUrl: "https://archive.org/details/concordancerepe01gentgoog",
    archiveIdentifier: "concordancerepe01gentgoog",
    rightsStatus: "public-domain",
    rightsReviewNotes: "Published in 1890 in New York. All 6 volumes are public domain worldwide.",
    rightsReviewedBy: "CIE Editorial Board",
    rightsReviewedAt: "2026-07-10T15:45:00Z",
    ingestionAllowed: true,
    aiIndexingAllowed: true,
    capabilities: INACTIVE_CAPABILITIES,
    acquisitionStatus: "sample",
    editorialStatus: "not-submitted",
    publicationStatus: "not-published"
  },
  {
    id: "synthesis_9_1",
    canonicalTitle: "Synthesis Repertory (Edition 9.1)",
    shortTitle: "Synthesis",
    author: "Frederik Schroyens",
    originalPublicationYear: 2004,
    editionPublicationYear: 2004,
    editionLabel: "Edition 9.1",
    language: "en",
    volumeCount: 1,
    rightsStatus: "copyrighted",
    rightsReviewNotes: "Modern copyrighted database of RadarOpus/Archibel. Ingestion strictly prohibited.",
    ingestionAllowed: false,
    aiIndexingAllowed: false,
    capabilities: INACTIVE_CAPABILITIES,
    acquisitionStatus: "metadata-only",
    editorialStatus: "rejected",
    publicationStatus: "blocked"
  },
  {
    id: "complete_repertory_2020",
    canonicalTitle: "Complete Repertory",
    shortTitle: "Complete Repertory",
    author: "Roger van Zandvoort",
    originalPublicationYear: 1996,
    editionPublicationYear: 2020,
    editionLabel: "Edition 2020",
    language: "en",
    volumeCount: 1,
    rightsStatus: "copyrighted",
    rightsReviewNotes: "Proprietary twentieth-century database. Ingestion prohibited.",
    ingestionAllowed: false,
    aiIndexingAllowed: false,
    capabilities: INACTIVE_CAPABILITIES,
    acquisitionStatus: "metadata-only",
    editorialStatus: "rejected",
    publicationStatus: "blocked"
  },
  {
    id: "murphy_repertory_3rd",
    canonicalTitle: "Homeopathic Clinical Repertory",
    shortTitle: "Murphy Repertory",
    author: "Robin Murphy",
    originalPublicationYear: 1993,
    editionPublicationYear: 2005,
    editionLabel: "Third Edition",
    language: "en",
    volumeCount: 1,
    rightsStatus: "copyrighted",
    rightsReviewNotes: "Modern work, copyrighted. Independent license and permission required. Ingestion blocked.",
    ingestionAllowed: false,
    aiIndexingAllowed: false,
    capabilities: INACTIVE_CAPABILITIES,
    acquisitionStatus: "metadata-only",
    editorialStatus: "rejected",
    publicationStatus: "blocked"
  }
];

export function validateRegistryRecord(s: RepertorySourceRecord): void {
  if (s.rightsStatus === "copyrighted" && s.ingestionAllowed) {
    throw new Error(`Registry Validation Error for ${s.id}: copyrighted source cannot have ingestionAllowed set to true.`);
  }
  if (s.acquisitionStatus === "sample" && s.publicationStatus === "active") {
    throw new Error(`Registry Validation Error for ${s.id}: sample source cannot have publicationStatus set to active.`);
  }
  if (s.acquisitionStatus === "partial" && s.editorialStatus === "approved") {
    throw new Error(`Registry Validation Error for ${s.id}: partial source cannot be editorially approved.`);
  }
  if (s.acquisitionStatus === "complete-unvalidated" && s.publicationStatus === "active") {
    throw new Error(`Registry Validation Error for ${s.id}: complete-unvalidated source cannot have publicationStatus set to active.`);
  }
  if (s.editorialStatus === "rejected" && s.publicationStatus === "active") {
    throw new Error(`Registry Validation Error for ${s.id}: rejected source cannot have publicationStatus set to active.`);
  }
  if (s.publicationStatus === "blocked" && s.aiIndexingAllowed) {
    throw new Error(`Registry Validation Error for ${s.id}: blocked source cannot have aiIndexingAllowed set to true.`);
  }
}

// Perform validation on load
REPERTORY_SOURCES.forEach(validateRegistryRecord);

export function getApprovedSources(): RepertorySourceRecord[] {
  return REPERTORY_SOURCES.filter(s => s.ingestionAllowed && s.rightsStatus === "public-domain");
}

export function getSourceRecord(id: string): RepertorySourceRecord | undefined {
  return REPERTORY_SOURCES.find(s => s.id === id);
}
