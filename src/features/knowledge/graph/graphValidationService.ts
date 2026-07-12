import { ClinicalGraphNode, ClinicalGraphEdge, ClinicalGraphRelationshipType } from "./clinicalGraphTypes";
import { RELATIONSHIP_REGISTRY } from "./relationshipRegistry";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Generates the unique deterministic edge identifier fingerprint key.
 */
export function createCanonicalGraphEdgeKey(input: {
  sourceNodeId: string;
  relationshipType: ClinicalGraphRelationshipType;
  targetNodeId: string;
  direction: "directed" | "undirected";
}): string {
  const { sourceNodeId, relationshipType, targetNodeId, direction } = input;
  if (direction === "undirected") {
    const sorted = [sourceNodeId, targetNodeId].sort();
    return `edge:${sorted[0]}:${relationshipType}:${sorted[1]}`;
  }
  return `edge:${sourceNodeId}:${relationshipType}:${targetNodeId}`;
}

/**
 * Validates a node structure.
 */
export function validateGraphNode(node: ClinicalGraphNode): ValidationResult {
  const errors: string[] = [];
  if (!node.id || !node.id.trim()) {
    errors.push("Node ID is required.");
  }
  if (!node.canonicalEntityId || !node.canonicalEntityId.trim()) {
    errors.push("Canonical Entity ID is required.");
  }
  if (!node.label || !node.label.trim()) {
    errors.push("Label is required.");
  }
  if (!node.nodeType) {
    errors.push("Node type is required.");
  }

  // Ontology reference checks
  if (node.externalOntology) {
    const { ontology, code, display } = node.externalOntology;
    if (!ontology || !code || !display) {
      errors.push("External ontology reference must have ontology, code, and display.");
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates an edge relationship against the Relationship Registry constraints.
 */
export function validateGraphEdge(
  edge: ClinicalGraphEdge,
  sourceNode: ClinicalGraphNode,
  targetNode: ClinicalGraphNode,
  existingEdges: ClinicalGraphEdge[] = []
): ValidationResult {
  const errors: string[] = [];

  // Check node identities
  if (edge.sourceNodeId !== sourceNode.id) {
    errors.push(`Source node ID mismatch. Edge expects ${edge.sourceNodeId}, but node is ${sourceNode.id}.`);
  }
  if (edge.targetNodeId !== targetNode.id) {
    errors.push(`Target node ID mismatch. Edge expects ${edge.targetNodeId}, but node is ${targetNode.id}.`);
  }

  // Self-edge check
  if (edge.sourceNodeId === edge.targetNodeId) {
    errors.push("Self-edges are strictly forbidden in this clinical knowledge graph.");
  }

  // Registry lookup
  const regDef = RELATIONSHIP_REGISTRY[edge.relationshipType];
  if (!regDef) {
    errors.push(`Unknown relationship type: ${edge.relationshipType}`);
    return { valid: false, errors };
  }

  // Allowed source/target pairings
  if (!regDef.allowedSourceTypes.includes(sourceNode.nodeType)) {
    errors.push(`Relationship '${edge.relationshipType}' does not allow source node type '${sourceNode.nodeType}'.`);
  }
  if (!regDef.allowedTargetTypes.includes(targetNode.nodeType)) {
    errors.push(`Relationship '${edge.relationshipType}' does not allow target node type '${targetNode.nodeType}'.`);
  }

  // Direction checks
  if (regDef.directed && edge.direction !== "directed") {
    errors.push(`Relationship '${edge.relationshipType}' must be directed.`);
  }
  if (!regDef.directed && edge.direction !== "undirected") {
    errors.push(`Relationship '${edge.relationshipType}' must be undirected.`);
  }

  // Provenance checks for publication
  if (edge.status === "published") {
    if (!edge.provenance || edge.provenance.length === 0) {
      errors.push("Published edges must carry at least one valid provenance record.");
    } else {
      edge.provenance.forEach((prov, i) => {
        if (!prov.provenanceType) {
          errors.push(`Provenance item #${i} is missing provenanceType.`);
        }
        if (!prov.extractedBy) {
          errors.push(`Provenance item #${i} is missing extractedBy attribution.`);
        }
        if (prov.provenanceType === "published-knowledge-version" || prov.provenanceType === "research-source") {
          if (!prov.sourceReferenceId && !prov.sourceEntityId) {
            errors.push(`Provenance item #${i} must have either sourceReferenceId or sourceEntityId for publication/research.`);
          }
        }
      });
    }
  }

  // Cardinality checks
  if (regDef.maxOutgoing) {
    const outgoingCount = existingEdges.filter(
      e => e.sourceNodeId === edge.sourceNodeId && e.relationshipType === edge.relationshipType && e.id !== edge.id
    ).length;
    if (outgoingCount >= regDef.maxOutgoing) {
      errors.push(`Relationship '${edge.relationshipType}' exceeds maximum outgoing cardinality limit of ${regDef.maxOutgoing}.`);
    }
  }
  if (regDef.maxIncoming) {
    const incomingCount = existingEdges.filter(
      e => e.targetNodeId === edge.targetNodeId && e.relationshipType === edge.relationshipType && e.id !== edge.id
    ).length;
    if (incomingCount >= regDef.maxIncoming) {
      errors.push(`Relationship '${edge.relationshipType}' exceeds maximum incoming cardinality limit of ${regDef.maxIncoming}.`);
    }
  }

  // Semantic Cycle checks (specifically for hierarchical/taxological edges like broader/narrower)
  const hierarchicalTypes: ClinicalGraphRelationshipType[] = [
    "concept-broader-than",
    "concept-narrower-than",
    "part-of",
    "contains"
  ];
  if (hierarchicalTypes.includes(edge.relationshipType)) {
    const cycleDetected = checkSemanticCycle(edge, existingEdges);
    if (cycleDetected) {
      errors.push(`Adding edge would introduce a semantic dependency loop for '${edge.relationshipType}'.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Detects cyclic dependencies in hierarchical edges using DFS.
 */
function checkSemanticCycle(newEdge: ClinicalGraphEdge, existingEdges: ClinicalGraphEdge[]): boolean {
  const adj = new Map<string, string[]>();
  
  // Build graph of existing eligible hierarchical edges
  const allEdges = [...existingEdges.filter(e => e.status !== "archived"), newEdge];
  
  for (const edge of allEdges) {
    const currentTargets = adj.get(edge.sourceNodeId) || [];
    currentTargets.push(edge.targetNodeId);
    adj.set(edge.sourceNodeId, currentTargets);
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (recStack.has(nodeId)) return true; // Cycle detected
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }

    recStack.delete(nodeId);
    return false;
  }

  // Run DFS checking from source node
  return dfs(newEdge.sourceNodeId);
}
