import assert from "assert";
import fs from "fs";
import path from "path";
import {
  PUBLIC_INDEX_ALLOWLIST,
  RAG_INGESTION_ALLOWLIST,
  TRANSITIONAL_PUBLICATION_FREEZE,
  WITHDRAWN_SAFETY_ENTITIES,
} from "../src/features/knowledge/governance/publicationGuard";
import { buildFlagshipPilotManifest } from "../src/features/knowledge/expansion/flagshipPilot";
import {
  buildKnowledgeExpansionInventory,
  FLAGSHIP_ENTITY_IDS,
  generateKnowledgeExpansionInventory,
} from "../src/features/knowledge/expansion/inventoryService";
import { validateOfflineRetrievalEvaluationCase } from "../src/features/knowledge/expansion/retrievalEvaluation";
import { validateKnowledgeSourceRegistration } from "../src/features/knowledge/expansion/sourceRegistry";
import type {
  FlagshipPilotManifest,
  KnowledgeExpansionInventory,
  OfflineRetrievalEvaluationCase,
  RegisteredKnowledgeSource,
} from "../src/features/knowledge/expansion/types";

function readJson<T>(fileName: string): T {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../reports", fileName), "utf8")
  ) as T;
}

export function runKnowledgeExpansionInventoryTests(): void {
  const asOfDate = "2026-07-26";
  const inventory = generateKnowledgeExpansionInventory(asOfDate);
  const pilot = buildFlagshipPilotManifest(inventory);

  assert.strictEqual(inventory.summary.totalEntities, 343);
  assert.deepStrictEqual(inventory.summary.byEntityType, {
    disease: 75,
    remedy: 150,
    faq: 1,
    "lab-test": 40,
    symptom: 75,
    "case-study": 1,
    research: 1,
  });
  assert.strictEqual(inventory.summary.withdrawnEntities, 3);
  assert.strictEqual(inventory.summary.flagshipEntities, 8);
  assert.strictEqual(inventory.summary.legacyBulkGeneratedEntities, 256);
  assert.strictEqual(inventory.summary.independentlyReviewedEntities, 0);
  assert.strictEqual(inventory.summary.governedEvidenceProfiles, 0);
  assert.strictEqual(inventory.summary.claimCitationCompleteEntities, 0);
  assert.strictEqual(inventory.summary.isolatedEntities, 207);
  assert.strictEqual(inventory.summary.duplicateRelationshipRows, 178);
  assert.strictEqual(inventory.summary.activeRagEntities, 0);

  assert.strictEqual(TRANSITIONAL_PUBLICATION_FREEZE, true);
  assert.strictEqual(PUBLIC_INDEX_ALLOWLIST.size, 8);
  assert.strictEqual(RAG_INGESTION_ALLOWLIST.size, 0);
  assert.strictEqual(WITHDRAWN_SAFETY_ENTITIES.size, 3);
  assert.deepStrictEqual(
    pilot.entities.map((entity) => entity.entityId),
    [...FLAGSHIP_ENTITY_IDS]
  );
  assert.ok(
    pilot.entities.every(
      (entity) =>
        entity.stateBoundaries.evidenceApprovalState === "draft-only" &&
        entity.stateBoundaries.clinicalApprovalState === "unchanged" &&
        entity.stateBoundaries.ragState === "inactive"
    )
  );
  assert.strictEqual(pilot.invariants.productionRagEntities, 0);
  assert.strictEqual(pilot.targets.minimumGovernedRelationships, 40);
  assert.strictEqual(pilot.targets.maximumGovernedRelationships, 80);
  assert.strictEqual(pilot.targets.minimumOfflineEvaluationQuestions, 160);

  const withdrawnRecords = inventory.records.filter(
    (record) => record.safety.withdrawn
  );
  assert.deepStrictEqual(
    withdrawnRecords.map((record) => record.entityId).sort(),
    ["D0007", "FAQ-safety", "R0006"]
  );
  assert.ok(
    withdrawnRecords.every(
      (record) =>
        record.safety.riskTier === "critical" &&
        record.prioritisation.recommendation ===
          "withdrawn-safety-remediation" &&
        record.eligibility.eligibleForRag === false
    )
  );

  const customEntity = {
    id: "D9999",
    slug: "test-condition",
    entityType: "disease",
    title: { en: "Test condition" },
    summary: { en: "Test summary" },
    content: {
      overview: "A comprehensive clinical overview of a test condition.",
      references: ["CIT-MISSING"],
    },
    author: { name: "Same Reviewer" },
    reviewer: { name: "Same Reviewer" },
    audience: "patient",
    editorialStatus: "published",
    evidenceLevel: "Level-C",
    versionInfo: {
      version: "1",
      created: asOfDate,
      updated: asOfDate,
      reviewed: asOfDate,
    },
    tags: [],
    canonicalUrl: "/knowledge/diseases/test-condition",
    readingTimeMinutes: 1,
    license: "test-only",
  } as any;
  const customInventory = buildKnowledgeExpansionInventory({
    entities: [customEntity],
    relationships: [
      { source: "D9999", relation: "hasSymptom", target: "D9999" },
      { source: "D9999", relation: "hasSymptom", target: "D9999" },
      { source: "D9999", relation: "hasSymptom", target: "S4040" },
    ] as any,
    citationIds: new Set(),
    asOfDate,
  });
  const customRecord = customInventory.records[0];
  assert.strictEqual(customRecord.evidence.allReferencesResolvable, false);
  assert.strictEqual(customRecord.review.authorReviewerNameConflict, true);
  assert.strictEqual(customRecord.review.independentReviewProven, false);
  assert.strictEqual(customRecord.graph.duplicateRelationshipRows, 1);
  assert.strictEqual(customRecord.graph.brokenRelationshipRows, 1);
  assert.strictEqual(customRecord.content.genericTemplateDetected, true);

  const validSource: RegisteredKnowledgeSource = {
    id: "SRC-TEST-001",
    title: "Test public-domain source",
    sourceType: "classical-homeopathic-literature",
    publisherOrCustodian: "Test custodian",
    licence: {
      status: "public-domain",
      evidenceLocation: "docs/test-provenance.md",
      permitsExtraction: true,
      permitsDerivedData: true,
      permitsPublicDisplay: true,
    },
    ingestionStatus: "extracted",
  };
  assert.strictEqual(
    validateKnowledgeSourceRegistration(validSource).valid,
    true
  );
  assert.deepStrictEqual(
    validateKnowledgeSourceRegistration({
      ...validSource,
      licence: {
        status: "pending",
        permitsExtraction: true,
        permitsDerivedData: false,
        permitsPublicDisplay: false,
      },
      ingestionStatus: "extracted",
    }).errors,
    [
      "pending-licence-source-cannot-progress-beyond-registration",
      "pending-licence-cannot-grant-use-rights",
      "ingestion-requires-verified-or-public-domain-licence",
    ]
  );

  const redFlagCase: OfflineRetrievalEvaluationCase = {
    id: "EVAL-RED-FLAG-001",
    entityIds: ["D0001"],
    category: "red-flag-escalation",
    question: "What should happen with severe chest pain?",
    expectedBehavior: "escalate",
    expectedCitationIds: [],
    prohibitedClaims: [],
    expectedRevisionIds: [],
    reviewerStatus: "draft",
  };
  assert.strictEqual(
    validateOfflineRetrievalEvaluationCase(redFlagCase).valid,
    true
  );
  assert.ok(
    validateOfflineRetrievalEvaluationCase({
      ...redFlagCase,
      expectedBehavior: "answer-with-citations",
      reviewerStatus: "approved",
    }).errors.includes("kep-1-evaluation-cases-must-not-be-approved")
  );

  const committedInventory =
    readJson<KnowledgeExpansionInventory>("knowledge-expansion-inventory.json");
  const committedPilot = readJson<FlagshipPilotManifest>(
    "knowledge-flagship-pilot-manifest.json"
  );
  assert.deepStrictEqual(committedInventory, inventory);
  assert.deepStrictEqual(committedPilot, pilot);

  const secondInventory = generateKnowledgeExpansionInventory(asOfDate);
  assert.deepStrictEqual(secondInventory, inventory);

  console.log(
    "✅ Knowledge Expansion KEP-0 inventory, pilot boundaries, source licensing, retrieval evaluation, and deterministic artifacts verified."
  );
}

if (require.main === module) {
  runKnowledgeExpansionInventoryTests();
}
