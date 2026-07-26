import assert from "assert";
import fs from "fs";
import path from "path";
import { evaluateKEP1AssignmentReadiness } from "../src/features/knowledge/expansion/kep1AssignmentGate";
import { buildKEP1SourceDossierManifest } from "../src/features/knowledge/expansion/kep1SourceDossiers";
import type { KEP1SourceDossierManifest } from "../src/features/knowledge/expansion/types";

function cloneManifest(
  manifest: KEP1SourceDossierManifest
): KEP1SourceDossierManifest {
  return JSON.parse(JSON.stringify(manifest)) as KEP1SourceDossierManifest;
}

export function runKnowledgeKEP1SourceDossierTests(): void {
  const manifest = buildKEP1SourceDossierManifest();
  const committed = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../reports/knowledge-kep1-source-dossiers.json"
      ),
      "utf8"
    )
  ) as KEP1SourceDossierManifest;

  assert.deepStrictEqual(committed, manifest);
  assert.strictEqual(manifest.dossiers.length, 8);
  assert.deepStrictEqual(
    manifest.dossiers.map((dossier) => dossier.entityId),
    ["D0001", "D0002", "S0001", "S0002", "R0001", "R0002", "L0001", "L0002"]
  );
  assert.strictEqual(manifest.summary.assignedRoles, 0);
  assert.strictEqual(manifest.summary.unassignedRoles, 32);
  assert.strictEqual(manifest.summary.productionRagEntities, 0);
  assert.strictEqual(manifest.summary.approvedEvidenceProfiles, 0);
  assert.strictEqual(manifest.summary.approvedClinicalReviews, 0);
  assert.ok(
    manifest.dossiers.every(
      (dossier) =>
        dossier.evaluationQuestionTarget === 20 &&
        dossier.governedRelationshipTarget.minimum === 5 &&
        dossier.governedRelationshipTarget.maximum === 10 &&
        dossier.stateBoundaries.contentState === "planning-only" &&
        dossier.stateBoundaries.ragState === "inactive"
    )
  );

  const sourceIds = new Set(manifest.sources.map((source) => source.id));
  assert.strictEqual(sourceIds.size, manifest.sources.length);
  assert.ok(
    manifest.sources
      .filter((source) => source.usePolicy === "citation-only")
      .every(
        (source) =>
          source.ingestionStatus === "registered" &&
          source.licence.permitsExtraction === false &&
          source.licence.permitsDerivedData === false &&
          source.licence.permitsPublicDisplay === false
      )
  );
  assert.ok(
    manifest.sources
      .filter((source) => source.usePolicy === "governed-extraction")
      .every(
        (source) =>
          source.licence.status === "public-domain" &&
          Boolean(source.licence.evidenceLocation)
      )
  );

  const blocked = evaluateKEP1AssignmentReadiness(manifest);
  assert.strictEqual(blocked.ready, false);
  assert.deepStrictEqual(
    blocked.errors,
    manifest.dossiers.map(
      (dossier) => `${dossier.entityId}:editorial-assignments-incomplete`
    )
  );

  const assigned = cloneManifest(manifest);
  for (const dossier of assigned.dossiers) {
    for (const assignment of dossier.assignments) {
      assignment.contributorId = `CONTRIB-${dossier.entityId}-${assignment.role}`;
      assignment.status = "assigned";
    }
  }
  assigned.summary.assignedRoles = 32;
  assigned.summary.unassignedRoles = 0;
  assert.ok(
    evaluateKEP1AssignmentReadiness(assigned).errors.includes(
      "verified-contributor-intake-required"
    )
  );

  const conflicted = cloneManifest(assigned);
  const conflictAssignments = conflicted.dossiers[0].assignments;
  const author = conflictAssignments.find(
    (assignment) => assignment.role === "clinical-author"
  );
  const reviewer = conflictAssignments.find(
    (assignment) => assignment.role === "independent-clinical-reviewer"
  );
  assert.ok(author?.contributorId);
  assert.ok(reviewer);
  reviewer.contributorId = author.contributorId;
  assert.ok(
    evaluateKEP1AssignmentReadiness(conflicted).errors.includes(
      "D0001:author-reviewer-conflict"
    )
  );

  const unsafeSource = cloneManifest(assigned);
  const citationOnlySource = unsafeSource.sources.find(
    (source) => source.usePolicy === "citation-only"
  );
  assert.ok(citationOnlySource);
  citationOnlySource.licence.permitsExtraction = true;
  assert.ok(
    evaluateKEP1AssignmentReadiness(unsafeSource).errors.some((error) =>
      error.endsWith("citation-only-source-must-remain-registered")
    )
  );

  console.log(
    "✅ KEP-1 source dossiers, rights boundaries, coverage, assignment blocking, reviewer independence, and zero-RAG invariants verified."
  );
}

if (require.main === module) {
  runKnowledgeKEP1SourceDossierTests();
}
