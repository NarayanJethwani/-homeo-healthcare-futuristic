import assert from "assert";
import { ClinicalGraphNode, ClinicalGraphEdge } from "../src/features/knowledge/graph/clinicalGraphTypes";
import { validateGraphNode, validateGraphEdge } from "../src/features/knowledge/graph/graphValidationService";
import { isGraphNodeEligibleForRetrieval, isGraphEdgeEligibleForTraversal } from "../src/features/knowledge/graph/graphEligibilityService";
import { calculateGraphContribution } from "../src/features/knowledge/graph/graphContributionService";
import { traverseGraph } from "../src/features/knowledge/graph/graphTraversalService";
import { globalGraphSyncService } from "../src/features/knowledge/graph/graphSyncService";
import { globalGraphRepository, clearMemoryGraph } from "../src/features/knowledge/graph/graphRepository";

function createMockNode(fields: Partial<ClinicalGraphNode>): ClinicalGraphNode {
  return {
    id: fields.id !== undefined ? fields.id : "node:test",
    nodeType: fields.nodeType || "remedy",
    canonicalEntityId: fields.canonicalEntityId !== undefined ? fields.canonicalEntityId : "test-entity",
    label: fields.label !== undefined ? fields.label : "Test Label",
    normalizedLabel: fields.normalizedLabel || (fields.label || "Test Label").toLowerCase(),
    editorialStatus: fields.editorialStatus || "published",
    legacyVerificationStatus: fields.legacyVerificationStatus,
    sourceEntityType: fields.sourceEntityType || "materia-medica",
    retrievalEligible: fields.retrievalEligible !== undefined ? fields.retrievalEligible : true,
    createdAt: fields.createdAt || new Date().toISOString(),
    updatedAt: fields.updatedAt || new Date().toISOString(),
    createdBy: fields.createdBy || "admin_user",
    updatedBy: fields.updatedBy || "admin_user",
    schemaVersion: fields.schemaVersion || "1.0.0",
    externalOntology: fields.externalOntology
  };
}

function createMockEdge(fields: Partial<ClinicalGraphEdge>): ClinicalGraphEdge {
  return {
    id: fields.id || "edge:test",
    sourceNodeId: fields.sourceNodeId || "node:a",
    targetNodeId: fields.targetNodeId || "node:b",
    relationshipType: fields.relationshipType || "associated-with",
    direction: fields.direction || "directed",
    status: fields.status || "published",
    provenance: fields.provenance || [],
    confidence: fields.confidence !== undefined ? fields.confidence : 1.0,
    evidenceStrength: fields.evidenceStrength || "high",
    sourceQuality: fields.sourceQuality || "peer-reviewed",
    clinicalReviewRequired: fields.clinicalReviewRequired !== undefined ? fields.clinicalReviewRequired : true,
    revision: fields.revision !== undefined ? fields.revision : 1,
    createdAt: fields.createdAt || new Date().toISOString(),
    updatedAt: fields.updatedAt || new Date().toISOString(),
    createdBy: fields.createdBy || "admin_user",
    updatedBy: fields.updatedBy || "admin_user",
    schemaVersion: fields.schemaVersion || "1.0.0"
  };
}

const mockActor = {
  userId: "admin_user",
  role: "super-admin" as const,
  capabilities: new Set<any>()
};

async function runClinicalGraphTests() {
  console.log("🚀 Running core Clinical Knowledge Graph Foundation tests...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      const res = fn();
      if (res instanceof Promise) {
        res.then(() => {
          console.log(`✅ ${name}`);
          passed++;
        }).catch((e) => {
          console.error(`❌ ${name}`);
          console.error(e.stack || e);
          failed++;
        });
      } else {
        console.log(`✅ ${name}`);
        passed++;
      }
    } catch (e: any) {
      console.error(`❌ ${name}`);
      console.error(e.stack || e);
      failed++;
    }
  }

  // --- NODE VALIDATION TESTS ---
  test("Node Validation - rejects invalid property shapes", () => {
    const node1 = createMockNode({ id: "" });
    const res1 = validateGraphNode(node1);
    assert.strictEqual(res1.valid, false);
    assert.ok(res1.errors.join().includes("Node ID"));

    const node2 = createMockNode({
      id: "node:remedy:arnica",
      externalOntology: {
        ontology: "SNOMED-CT",
        code: "123",
        display: "Display",
        version: "1.0"
      }
    });
    const res2 = validateGraphNode(node2);
    if (!res2.valid) {
      console.log("res2 errors:", res2.errors);
    }
    assert.strictEqual(res2.valid, true);
  });

  // --- EDGE VALIDATION TESTS ---
  test("Edge Validation - allowed source/target type pairings", () => {
    const sourceNode = createMockNode({
      id: "node:remedy:arnica",
      nodeType: "remedy"
    });
    const targetNode = createMockNode({
      id: "node:symptom:bruising",
      nodeType: "symptom"
    });

    const edge = createMockEdge({
      id: "edge:1",
      sourceNodeId: "node:remedy:arnica",
      targetNodeId: "node:symptom:bruising",
      relationshipType: "has-symptom", // remedy cannot be source of has-symptom in registry definition
      direction: "directed",
      status: "published",
      provenance: [{
        provenanceType: "published-knowledge-version",
        extractedBy: "human",
        sourceEntityId: "123"
      }]
    });

    const res = validateGraphEdge(edge, sourceNode, targetNode, []);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.join().includes("does not allow source node type"));
  });

  test("Edge Validation - blocks self-edges", () => {
    const node = createMockNode({
      id: "node:remedy:arnica",
      nodeType: "remedy"
    });
    const edge = createMockEdge({
      id: "edge:self",
      sourceNodeId: "node:remedy:arnica",
      targetNodeId: "node:remedy:arnica",
      relationshipType: "associated-with",
      direction: "undirected"
    });
    const res = validateGraphEdge(edge, node, node, []);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.join().includes("Self-edges are strictly forbidden"));
  });

  test("Edge Validation - requires provenance on publish", () => {
    const sourceNode = createMockNode({
      id: "node:remedy:arnica",
      nodeType: "remedy"
    });
    const targetNode = createMockNode({
      id: "node:symptom:bruising",
      nodeType: "symptom"
    });
    const edge = createMockEdge({
      id: "edge:1",
      sourceNodeId: "node:remedy:arnica",
      targetNodeId: "node:symptom:bruising",
      relationshipType: "remedy-covers-symptom",
      direction: "directed",
      status: "published",
      provenance: []
    });
    const res = validateGraphEdge(edge, sourceNode, targetNode, []);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.join().includes("at least one valid provenance"));
  });

  // --- CYCLE DETECTION TESTS ---
  test("Cycle Detection - prevents circular dependency on taxonomy", () => {
    const nodeA = createMockNode({ id: "node:concept:a", nodeType: "clinical-concept", label: "A" });
    const nodeB = createMockNode({ id: "node:concept:b", nodeType: "clinical-concept", label: "B" });

    const edge1 = createMockEdge({
      id: "edge:a-b",
      sourceNodeId: "node:concept:a",
      targetNodeId: "node:concept:b",
      relationshipType: "concept-broader-than",
      direction: "directed",
      status: "published"
    });
    const edge2 = createMockEdge({
      id: "edge:b-a",
      sourceNodeId: "node:concept:b",
      targetNodeId: "node:concept:a",
      relationshipType: "concept-broader-than",
      direction: "directed",
      status: "published"
    });

    const val = validateGraphEdge(edge2, nodeB, nodeA, [edge1]);
    assert.strictEqual(val.valid, false);
    assert.ok(val.errors.join().includes("dependency loop"));
  });

  // --- ELIGIBILITY TESTS ---
  test("Node Eligibility - checks published/legacy state", () => {
    const activeNode = createMockNode({
      id: "node:1",
      editorialStatus: "published"
    });
    assert.strictEqual(isGraphNodeEligibleForRetrieval(activeNode), true);

    const draftNode = createMockNode({
      id: "node:1",
      editorialStatus: "draft"
    });
    assert.strictEqual(isGraphNodeEligibleForRetrieval(draftNode), false);

    const unverifiedNode = createMockNode({
      id: "node:1",
      editorialStatus: "published",
      legacyVerificationStatus: "legacy-published-unverified"
    });
    assert.strictEqual(isGraphNodeEligibleForRetrieval(unverifiedNode), false);
  });

  test("Edge Eligibility - disputed edges are excluded from AI context", () => {
    const s = createMockNode({ id: "s", nodeType: "remedy", label: "S" });
    const t = createMockNode({ id: "t", nodeType: "symptom", label: "T" });
    
    const disputedEdge = createMockEdge({
      id: "e",
      sourceNodeId: "s",
      targetNodeId: "t",
      relationshipType: "remedy-covers-symptom",
      direction: "directed",
      status: "disputed"
    });

    assert.strictEqual(isGraphEdgeEligibleForTraversal(disputedEdge, s, t, "public-search"), true);
    assert.strictEqual(isGraphEdgeEligibleForTraversal(disputedEdge, s, t, "ai-clinical-context"), false);
  });

  // --- TRAVERSAL CONTRIBUTION BOOST TESTS ---
  test("Graph Contribution - computes decayed formula and clamps to 0.05", () => {
    const res = calculateGraphContribution({
      relationshipType: "associated-with",
      pathLength: 1,
      edgeConfidence: 1.0,
      edgeEvidenceStrength: "high",
      edgeSourceQuality: "peer-reviewed",
      provenanceCount: 1,
      seedRelevanceScore: 0.8
    });
    assert.strictEqual(res.score, 0.05);

    const res2 = calculateGraphContribution({
      relationshipType: "associated-with",
      pathLength: 2,
      edgeConfidence: 1.0,
      edgeEvidenceStrength: "high",
      edgeSourceQuality: "peer-reviewed",
      provenanceCount: 1,
      seedRelevanceScore: 0.8
    });
    assert.strictEqual(res2.score, 0.05);

    const res3 = calculateGraphContribution({
      relationshipType: "associated-with",
      pathLength: 1,
      edgeConfidence: 0.2,
      edgeEvidenceStrength: "high",
      edgeSourceQuality: "peer-reviewed",
      provenanceCount: 1,
      seedRelevanceScore: 0.1
    });
    assert.ok(res3.score < 0.05);
    assert.ok(res3.score > 0.001);
  });

  // --- REPOSITORY TRANSITIONS & CONCURRENCY LOCKS TESTS ---
  test("Repository - prevents overwrite on revision mismatch", async () => {
    clearMemoryGraph();
    
    const s = createMockNode({ id: "s", nodeType: "remedy", label: "S" });
    const t = createMockNode({ id: "t", nodeType: "symptom", label: "T" });
    
    await globalGraphRepository.saveNode(s);
    await globalGraphRepository.saveNode(t);

    const edge = createMockEdge({
      id: "edge:s-t",
      sourceNodeId: "s",
      targetNodeId: "t",
      relationshipType: "remedy-covers-symptom",
      direction: "directed",
      status: "published",
      provenance: [{ provenanceType: "research-source", extractedBy: "human", sourceEntityId: "1" }]
    });

    await globalGraphRepository.saveEdge(edge, null, mockActor);
    
    try {
      await globalGraphRepository.saveEdge(edge, 10, mockActor);
      assert.fail("Should have failed with revision conflict 409");
    } catch (e: any) {
      assert.ok(e.message.includes("Revision conflict") || e.statusCode === 409);
    }
  });

  // --- SYNC SERVICE TESTS ---
  test("Sync Service - rejects draft synchronization", async () => {
    const draftEntity = {
      id: "entity-1",
      category: "remedy",
      title: "Draft Remedy",
      status: "draft"
    };

    const res = await globalGraphSyncService.syncKnowledgeEntityToNode(draftEntity);
    assert.strictEqual(res.action, "skipped");
    assert.ok(res.errors[0].includes("Draft entities cannot be registered"));
  });

  // --- BFS TRAVERSAL WORKFLOW TESTS ---
  test("BFS Traversal - bounds depth and limits search", async () => {
    clearMemoryGraph();
    
    const nA = createMockNode({ id: "node:remedy:a", nodeType: "remedy", label: "A" });
    const nB = createMockNode({ id: "node:symptom:b", nodeType: "symptom", label: "B" });
    const nC = createMockNode({ id: "node:symptom:c", nodeType: "symptom", label: "C" });

    await globalGraphRepository.saveNode(nA);
    await globalGraphRepository.saveNode(nB);
    await globalGraphRepository.saveNode(nC);

    const edge1 = createMockEdge({
      id: "edge:a-b",
      sourceNodeId: "node:remedy:a",
      targetNodeId: "node:symptom:b",
      relationshipType: "remedy-covers-symptom",
      direction: "directed",
      status: "published",
      provenance: [{ provenanceType: "research-source", extractedBy: "human", sourceEntityId: "1" }]
    });
    const edge2 = createMockEdge({
      id: "edge:b-c",
      sourceNodeId: "node:symptom:b",
      targetNodeId: "node:symptom:c",
      relationshipType: "associated-with",
      direction: "undirected",
      status: "published",
      provenance: [{ provenanceType: "research-source", extractedBy: "human", sourceEntityId: "1" }]
    });

    await globalGraphRepository.saveEdge(edge1, null, mockActor);
    await globalGraphRepository.saveEdge(edge2, null, mockActor);

    // BFS Traversal
    const res = await traverseGraph({
      startNodeIds: ["node:remedy:a"],
      maxDepth: 2,
      maxNodes: 10,
      maxEdges: 10,
      context: "public-search"
    });

    assert.strictEqual(res.nodes.length, 3);
    assert.strictEqual(res.edges.length, 2);
    assert.strictEqual(res.paths.length, 2);
  });

  // Print final results
  setTimeout(() => {
    console.log(`\n🏁 Clinical Graph Tests Complete: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) {
      process.exit(1);
    }
  }, 100);
}

runClinicalGraphTests().catch(e => {
  console.error("Fatal test runner crash:", e);
  process.exit(1);
});
