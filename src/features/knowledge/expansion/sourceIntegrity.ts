import type { CitationRecord } from "../types";
import type { KEP1SourceRecord } from "./types";
import { validateKnowledgeSourceRegistration } from "./sourceRegistry";

export type SourceIntegritySeverity = "blocker" | "review";

export interface SourceIntegrityIssue {
  severity: SourceIntegritySeverity;
  code: string;
  recordType: "citation" | "source";
  recordId: string;
  detail: string;
}

export interface KnowledgeSourceIntegrityReport {
  schemaVersion: "1.0.0";
  asOfDate: string;
  status: "staging-only";
  summary: {
    citationsAudited: number;
    sourcesAudited: number;
    eligibleCitationRecords: number;
    eligibleRegisteredSources: number;
    blockerCount: number;
    reviewCount: number;
  };
  eligibleCitationIds: string[];
  eligibleSourceIds: string[];
  quarantinedCitationIds: string[];
  quarantinedSourceIds: string[];
  issues: SourceIntegrityIssue[];
  invariants: {
    publicationState: "unchanged";
    ragState: "inactive";
    automaticClinicalApprovalForbidden: true;
    internalSourcesCannotIndependentlyValidateMedicalClaims: true;
  };
}

function normaliseUrl(value: string): string | null {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return null;
  }
}

function getNiceIdentifierFromUrl(value: string): string | null {
  const normalised = normaliseUrl(value);
  if (!normalised) return null;

  const match = normalised.match(
    /^https:\/\/www\.nice\.org\.uk\/guidance\/([a-z]+\d+)$/
  );
  return match?.[1]?.toUpperCase() ?? null;
}

function validateCitation(citation: CitationRecord): SourceIntegrityIssue[] {
  const issues: SourceIntegrityIssue[] = [];
  const issue = (
    severity: SourceIntegritySeverity,
    code: string,
    detail: string
  ) =>
    issues.push({
      severity,
      code,
      recordType: "citation",
      recordId: citation.id,
      detail,
    });

  if (citation.category === "Clinical-Guidelines") {
    if (!citation.canonicalUrl) {
      issue("blocker", "guideline-canonical-url-required", "A guideline must have a canonical source URL.");
    }
    if (!citation.sourceIdentifier) {
      issue("blocker", "guideline-source-identifier-required", "A guideline must have a stable source identifier.");
    }
  }

  if (citation.canonicalUrl && !normaliseUrl(citation.canonicalUrl)) {
    issue("blocker", "citation-canonical-url-invalid", "The canonical URL is not a valid absolute URL.");
  }

  if (
    citation.canonicalUrl?.includes("nice.org.uk/guidance/") &&
    citation.sourceIdentifier
  ) {
    const urlIdentifier = getNiceIdentifierFromUrl(citation.canonicalUrl);
    const declaredIdentifier = citation.sourceIdentifier
      .replace(/^NICE-/i, "")
      .toUpperCase();
    if (!urlIdentifier || urlIdentifier !== declaredIdentifier) {
      issue(
        "blocker",
        "nice-identifier-url-mismatch",
        `Declared ${citation.sourceIdentifier} does not match ${citation.canonicalUrl}.`
      );
    }
  }

  if (
    citation.sourceAuthority === "external-authoritative" &&
    citation.verificationStatus !== "verified"
  ) {
    issue("blocker", "authoritative-source-not-verified", "Authoritative evidence must be explicitly verified.");
  }

  if (citation.sourceAuthority === "internal-context") {
    issue(
      "review",
      "internal-source-context-only",
      "Internal material may provide context but cannot independently validate a medical claim."
    );
  }

  if (!citation.sourceAuthority || !citation.verificationStatus) {
    issue(
      "review",
      "legacy-citation-metadata-incomplete",
      "Source authority and verification metadata must be completed before new claim mapping."
    );
  }

  return issues;
}

function validateRegisteredSource(source: KEP1SourceRecord): SourceIntegrityIssue[] {
  const issues: SourceIntegrityIssue[] = [];
  const registration = validateKnowledgeSourceRegistration(source);

  for (const error of registration.errors) {
    issues.push({
      severity: "blocker",
      code: error,
      recordType: "source",
      recordId: source.id,
      detail: "The registered source failed the existing rights and ingestion boundary.",
    });
  }

  if (!source.canonicalUrl || !normaliseUrl(source.canonicalUrl)) {
    issues.push({
      severity: "blocker",
      code: "registered-source-canonical-url-required",
      recordType: "source",
      recordId: source.id,
      detail: "Expansion sources require a valid canonical URL.",
    });
  }

  const declaredNiceIdentifier = source.id.match(/NICE-([A-Z]+\d+)$/)?.[1];
  if (declaredNiceIdentifier && source.canonicalUrl) {
    const urlIdentifier = getNiceIdentifierFromUrl(source.canonicalUrl);
    if (urlIdentifier !== declaredNiceIdentifier) {
      issues.push({
        severity: "blocker",
        code: "registered-nice-identifier-url-mismatch",
        recordType: "source",
        recordId: source.id,
        detail: `Registry identifier ${declaredNiceIdentifier} does not match ${source.canonicalUrl}.`,
      });
    }
  }

  if (source.usePolicy === "citation-only" && source.ingestionStatus !== "registered") {
    issues.push({
      severity: "blocker",
      code: "citation-only-source-left-registration-state",
      recordType: "source",
      recordId: source.id,
      detail: "Citation-only sources cannot enter extraction or drafting states.",
    });
  }

  return issues;
}

export function buildKnowledgeSourceIntegrityReport(input: {
  citations: readonly CitationRecord[];
  sources: readonly KEP1SourceRecord[];
  asOfDate: string;
}): KnowledgeSourceIntegrityReport {
  const issues = [
    ...input.citations.flatMap(validateCitation),
    ...input.sources.flatMap(validateRegisteredSource),
  ];

  const canonicalOwners = new Map<string, string>();
  for (const citation of input.citations) {
    if (!citation.canonicalUrl) continue;
    const canonicalUrl = normaliseUrl(citation.canonicalUrl);
    if (!canonicalUrl) continue;
    const existing = canonicalOwners.get(canonicalUrl);
    if (existing) {
      issues.push({
        severity: "blocker",
        code: "duplicate-citation-canonical-url",
        recordType: "citation",
        recordId: citation.id,
        detail: `Canonical URL is already registered by ${existing}.`,
      });
    } else {
      canonicalOwners.set(canonicalUrl, citation.id);
    }
  }

  const blockedCitations = new Set(
    issues
      .filter((item) => item.recordType === "citation" && item.severity === "blocker")
      .map((item) => item.recordId)
  );
  const blockedSources = new Set(
    issues
      .filter((item) => item.recordType === "source" && item.severity === "blocker")
      .map((item) => item.recordId)
  );

  const eligibleCitationIds = input.citations
    .filter(
      (citation) =>
        !blockedCitations.has(citation.id) &&
        citation.sourceAuthority !== "internal-context" &&
        citation.verificationStatus === "verified"
    )
    .map((citation) => citation.id)
    .sort();
  const eligibleSourceIds = input.sources
    .filter((source) => !blockedSources.has(source.id))
    .map((source) => source.id)
    .sort();

  return {
    schemaVersion: "1.0.0",
    asOfDate: input.asOfDate,
    status: "staging-only",
    summary: {
      citationsAudited: input.citations.length,
      sourcesAudited: input.sources.length,
      eligibleCitationRecords: eligibleCitationIds.length,
      eligibleRegisteredSources: eligibleSourceIds.length,
      blockerCount: issues.filter((item) => item.severity === "blocker").length,
      reviewCount: issues.filter((item) => item.severity === "review").length,
    },
    eligibleCitationIds,
    eligibleSourceIds,
    quarantinedCitationIds: input.citations
      .filter((citation) => !eligibleCitationIds.includes(citation.id))
      .map((citation) => citation.id)
      .sort(),
    quarantinedSourceIds: input.sources
      .filter((source) => !eligibleSourceIds.includes(source.id))
      .map((source) => source.id)
      .sort(),
    issues: issues.sort((a, b) =>
      `${a.recordType}:${a.recordId}:${a.code}`.localeCompare(
        `${b.recordType}:${b.recordId}:${b.code}`
      )
    ),
    invariants: {
      publicationState: "unchanged",
      ragState: "inactive",
      automaticClinicalApprovalForbidden: true,
      internalSourcesCannotIndependentlyValidateMedicalClaims: true,
    },
  };
}
