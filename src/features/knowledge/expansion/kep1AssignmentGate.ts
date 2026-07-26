import { validateKnowledgeSourceRegistration } from "./sourceRegistry";
import type {
  KEP1FlagshipSourceDossier,
  KEP1SourceDossierManifest,
} from "./types";

export interface KEP1AssignmentGateResult {
  ready: boolean;
  errors: string[];
}

function validateDossierAssignments(
  dossier: KEP1FlagshipSourceDossier
): string[] {
  const errors: string[] = [];
  const roles = new Set(dossier.assignments.map((assignment) => assignment.role));

  if (roles.size !== 4 || dossier.assignments.length !== 4) {
    errors.push(`${dossier.entityId}:all-editorial-roles-required`);
  }

  const assigned = dossier.assignments.filter(
    (assignment) =>
      assignment.status === "assigned" && Boolean(assignment.contributorId)
  );
  if (assigned.length !== dossier.assignments.length) {
    errors.push(`${dossier.entityId}:editorial-assignments-incomplete`);
  }

  const author = dossier.assignments.find(
    (assignment) => assignment.role === "clinical-author"
  );
  const reviewer = dossier.assignments.find(
    (assignment) => assignment.role === "independent-clinical-reviewer"
  );
  if (
    author?.contributorId &&
    reviewer?.contributorId &&
    author.contributorId === reviewer.contributorId
  ) {
    errors.push(`${dossier.entityId}:author-reviewer-conflict`);
  }

  return errors;
}

export function evaluateKEP1AssignmentReadiness(
  manifest: KEP1SourceDossierManifest
): KEP1AssignmentGateResult {
  const errors: string[] = [];
  const sourceIds = new Set(manifest.sources.map((source) => source.id));

  if (sourceIds.size !== manifest.sources.length) {
    errors.push("duplicate-source-id");
  }

  for (const source of manifest.sources) {
    const sourceResult = validateKnowledgeSourceRegistration(source);
    errors.push(
      ...sourceResult.errors.map((error) => `${source.id}:${error}`)
    );
    if (
      source.usePolicy === "citation-only" &&
      (source.licence.permitsExtraction ||
        source.ingestionStatus !== "registered")
    ) {
      errors.push(`${source.id}:citation-only-source-must-remain-registered`);
    }
  }

  for (const dossier of manifest.dossiers) {
    if (dossier.sourceIds.some((sourceId) => !sourceIds.has(sourceId))) {
      errors.push(`${dossier.entityId}:unknown-source`);
    }
    const coverage = new Set(
      manifest.sources
        .filter((source) => dossier.sourceIds.includes(source.id))
        .flatMap((source) => source.coverageDomains)
    );
    if (
      dossier.requiredCoverageDomains.some((domain) => !coverage.has(domain))
    ) {
      errors.push(`${dossier.entityId}:source-coverage-incomplete`);
    }
    errors.push(...validateDossierAssignments(dossier));
  }

  if (
    manifest.summary.productionRagEntities !== 0 ||
    manifest.summary.approvedEvidenceProfiles !== 0 ||
    manifest.summary.approvedClinicalReviews !== 0
  ) {
    errors.push("approval-or-rag-state-must-remain-zero");
  }

  return { ready: errors.length === 0, errors };
}
