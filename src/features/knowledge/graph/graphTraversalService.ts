import { ClinicalGraphNode, ClinicalGraphEdge, ClinicalGraphRelationshipType } from "./clinicalGraphTypes";
import { globalGraphRepository } from "./graphRepository";
import { isGraphEdgeEligibleForTraversal } from "./graphEligibilityService";

export interface GraphTraversalRequest {
  startNodeIds: string[];
  relationshipTypes?: ClinicalGraphRelationshipType[];
  direction?: "outgoing" | "incoming" | "both";
  maxDepth: number;
  maxNodes: number;
  maxEdges: number;
  context: string;
}

export interface GraphPathExplanation {
  startNodeId: string;
  endNodeId: string;
  edges: Array<{
    edgeId: string;
    relationshipType: ClinicalGraphRelationshipType;
    sourceNodeId: string;
    targetNodeId: string;
    sourceVersionId?: string;
    provenanceSummary?: string;
  }>;
  pathLength: number;
  warnings: string[];
}

export interface GraphTraversalResult {
  nodes: ClinicalGraphNode[];
  edges: ClinicalGraphEdge[];
  paths: GraphPathExplanation[];
}

/**
 * Performs a deterministic bounded Breadth-First-Search traversal over the clinical graph.
 */
export async function traverseGraph(request: GraphTraversalRequest): Promise<GraphTraversalResult> {
  const { startNodeIds, relationshipTypes, direction = "both", context } = request;

  // Clamp limits to prevent memory/performance issues
  const maxDepth = Math.min(request.maxDepth, 5);
  const maxNodes = Math.min(request.maxNodes, 100);
  const maxEdges = Math.min(request.maxEdges, 250);

  const traversedNodes = new Map<string, ClinicalGraphNode>();
  const traversedEdges = new Map<string, ClinicalGraphEdge>();
  const paths: GraphPathExplanation[] = [];

  // Queue holds { nodeId, depth, edgeHistory }
  interface QueueItem {
    nodeId: string;
    depth: number;
    edgeHistory: ClinicalGraphEdge[];
  }

  const queue: QueueItem[] = [];
  const visited = new Set<string>();

  // Initialize BFS queue with start nodes
  for (const startId of startNodeIds) {
    const node = await globalGraphRepository.getNode(startId);
    if (node) {
      traversedNodes.set(startId, node);
      queue.push({ nodeId: startId, depth: 0, edgeHistory: [] });
      visited.add(startId);
    }
  }

  let nodeCount = traversedNodes.size;
  let edgeCount = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // Stop expansion if depth limit reached
    if (current.depth >= maxDepth) continue;

    // Retrieve active relationships for the node
    const candidateEdges = await globalGraphRepository.getEdgesForNode(current.nodeId, direction);

    for (const edge of candidateEdges) {
      // Check edge-limit cap
      if (edgeCount >= maxEdges) {
        break;
      }

      // Check relation filters
      if (relationshipTypes && relationshipTypes.length > 0 && !relationshipTypes.includes(edge.relationshipType)) {
        continue;
      }

      // Identify neighbor node ID
      const isOutgoing = edge.sourceNodeId === current.nodeId;
      const neighborId = isOutgoing ? edge.targetNodeId : edge.sourceNodeId;

      // Skip self-loops or backward tracking
      if (neighborId === current.nodeId) continue;

      // Resolve nodes
      const sourceNode = await globalGraphRepository.getNode(edge.sourceNodeId);
      const targetNode = await globalGraphRepository.getNode(edge.targetNodeId);
      if (!sourceNode || !targetNode) continue;

      // Eligibility validations
      const isEligible = isGraphEdgeEligibleForTraversal(edge, sourceNode, targetNode, context);
      if (!isEligible) continue;

      // Cycle/Repeat check for edge
      if (traversedEdges.has(edge.id)) continue;

      // Check node limits
      const isNeighborVisited = visited.has(neighborId);
      if (!isNeighborVisited && nodeCount >= maxNodes) {
        continue;
      }

      // Add to traversal results
      const neighborNode = isOutgoing ? targetNode : sourceNode;
      traversedNodes.set(neighborId, neighborNode);
      traversedEdges.set(edge.id, edge);
      edgeCount++;

      const newHistory = [...current.edgeHistory, edge];

      if (!isNeighborVisited) {
        visited.add(neighborId);
        queue.push({
          nodeId: neighborId,
          depth: current.depth + 1,
          edgeHistory: newHistory
        });
        nodeCount++;
      }

      // Generate explainable path for current step
      const pathExp: GraphPathExplanation = {
        startNodeId: current.edgeHistory.length > 0 ? current.edgeHistory[0].sourceNodeId : edge.sourceNodeId,
        endNodeId: neighborId,
        edges: newHistory.map(e => ({
          edgeId: e.id,
          relationshipType: e.relationshipType,
          sourceNodeId: e.sourceNodeId,
          targetNodeId: e.targetNodeId,
          sourceVersionId: e.sourceVersionId,
          provenanceSummary: e.provenance.map(p => `${p.provenanceType} (${p.sourceTitle || "N/A"})`).join(", ")
        })),
        pathLength: newHistory.length,
        warnings: []
      };

      if (edge.status === "disputed") {
        pathExp.warnings.push("This pathway contains disputed or unverified medical assertions.");
      }

      paths.push(pathExp);
    }
  }

  return {
    nodes: Array.from(traversedNodes.values()),
    edges: Array.from(traversedEdges.values()),
    paths
  };
}
