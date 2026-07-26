import type { RegisteredKnowledgeSource } from "./types";

export interface SourceRegistrationValidation {
  valid: boolean;
  errors: string[];
}

export function validateKnowledgeSourceRegistration(
  source: RegisteredKnowledgeSource
): SourceRegistrationValidation {
  const errors: string[] = [];

  if (!source.id.trim()) errors.push("source-id-required");
  if (!source.title.trim()) errors.push("source-title-required");
  if (!source.publisherOrCustodian.trim()) {
    errors.push("source-publisher-or-custodian-required");
  }
  if (source.licence.status === "pending") {
    if (source.ingestionStatus !== "registered") {
      errors.push("pending-licence-source-cannot-progress-beyond-registration");
    }
    if (
      source.licence.permitsExtraction ||
      source.licence.permitsDerivedData ||
      source.licence.permitsPublicDisplay
    ) {
      errors.push("pending-licence-cannot-grant-use-rights");
    }
  }
  if (
    source.ingestionStatus !== "registered" &&
    source.licence.status !== "verified" &&
    source.licence.status !== "public-domain"
  ) {
    errors.push("ingestion-requires-verified-or-public-domain-licence");
  }
  if (
    ["extracted", "normalised", "claims-identified", "review-pending"].includes(
      source.ingestionStatus
    ) &&
    !source.licence.permitsExtraction
  ) {
    errors.push("source-licence-does-not-permit-extraction");
  }
  if (
    source.licence.status === "public-domain" &&
    !source.licence.evidenceLocation
  ) {
    errors.push("public-domain-evidence-location-required");
  }

  return { valid: errors.length === 0, errors };
}
