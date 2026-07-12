import {
  buildClinicalWorkspaceReference,
  ClinicalKnowledgeReference,
  ClinicalWorkspaceReferenceView,
} from "./ClinicalKnowledgeReferenceService";

export function buildClinicalWorkspaceReferences(
  references: readonly ClinicalKnowledgeReference[],
  now = new Date(),
): ClinicalWorkspaceReferenceView[] {
  return references
    .map(reference => buildClinicalWorkspaceReference(reference, now))
    .filter((reference): reference is ClinicalWorkspaceReferenceView => reference !== null)
    .sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
}

