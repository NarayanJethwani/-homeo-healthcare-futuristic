import { ClinicalGraphNode, ClinicalGraphEdge, ClinicalGraphEdgeStatus } from "./clinicalGraphTypes";
import { validateGraphEdge, createCanonicalGraphEdgeKey } from "./graphValidationService";
import { AuthenticatedKnowledgeActor } from "@/features/knowledge-admin/cms/types";

// In-memory fallback stores
export const memoryGraphNodes: ClinicalGraphNode[] = [];
export const memoryGraphEdges: ClinicalGraphEdge[] = [];
export const memoryGraphEdgeVersions: ClinicalGraphEdge[] = [];
export const memoryGraphReviews: any[] = [];
export const memoryGraphAuditEvents: any[] = [];

async function getFirestoreDb() {
  try {
    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const db = getAdminDb();
    if (db) return db;
  } catch (e) {
    // Graceful fallback to memory store
  }
  return null;
}

export function clearMemoryGraph() {
  memoryGraphNodes.length = 0;
  memoryGraphEdges.length = 0;
  memoryGraphEdgeVersions.length = 0;
  memoryGraphReviews.length = 0;
  memoryGraphAuditEvents.length = 0;
}

export class GraphRepository {
  /**
   * Resolves a graph node by ID.
   */
  async getNode(nodeId: string): Promise<ClinicalGraphNode | null> {
    const db = await getFirestoreDb();
    if (db) {
      try {
        const snap = await db.collection("clinical_graph_nodes").doc(nodeId).get();
        if (snap.exists) return snap.data() as ClinicalGraphNode;
      } catch (e) {
        console.warn("GraphRepository: Failed to get node from Firestore. Falling back to memory.");
      }
    }
    return memoryGraphNodes.find(n => n.id === nodeId) || null;
  }

  /**
   * Resolves a graph node by canonical entity ID and type.
   */
  async getNodeByCanonical(canonicalEntityId: string, nodeType: string): Promise<ClinicalGraphNode | null> {
    const db = await getFirestoreDb();
    if (db) {
      try {
        const snap = await db.collection("clinical_graph_nodes")
          .where("canonicalEntityId", "==", canonicalEntityId)
          .where("nodeType", "==", nodeType)
          .get();
        if (!snap.empty) {
          return snap.docs[0].data() as ClinicalGraphNode;
        }
      } catch (e) {
        console.warn("GraphRepository: Failed to query node by canonical from Firestore. Falling back to memory.");
      }
    }
    return memoryGraphNodes.find(
      n => n.canonicalEntityId === canonicalEntityId && n.nodeType === nodeType
    ) || null;
  }

  /**
   * Creates or updates a graph node.
   */
  async saveNode(node: ClinicalGraphNode): Promise<void> {
    const db = await getFirestoreDb();
    if (db) {
      try {
        await db.collection("clinical_graph_nodes").doc(node.id).set(node);
      } catch (e) {
        console.warn("GraphRepository: Failed to save node to Firestore.");
      }
    }
    const idx = memoryGraphNodes.findIndex(n => n.id === node.id);
    if (idx !== -1) {
      memoryGraphNodes[idx] = node;
    } else {
      memoryGraphNodes.push(node);
    }
  }

  /**
   * Resolves a graph edge by deterministic ID.
   */
  async getEdge(edgeId: string): Promise<ClinicalGraphEdge | null> {
    const db = await getFirestoreDb();
    if (db) {
      try {
        const snap = await db.collection("clinical_graph_edges").doc(edgeId).get();
        if (snap.exists) return snap.data() as ClinicalGraphEdge;
      } catch (e) {
        console.warn("GraphRepository: Failed to get edge from Firestore. Falling back to memory.");
      }
    }
    return memoryGraphEdges.find(e => e.id === edgeId) || null;
  }

  /**
   * Atomic mutation for saving an edge (under revision control and validations).
   */
  async saveEdge(
    edge: ClinicalGraphEdge,
    expectedRevision: number | null,
    actor: AuthenticatedKnowledgeActor,
    reason?: string
  ): Promise<void> {
    const db = await getFirestoreDb();
    
    // Resolve source & target nodes
    const sourceNode = await this.getNode(edge.sourceNodeId);
    const targetNode = await this.getNode(edge.targetNodeId);
    if (!sourceNode || !targetNode) {
      throw new Error(`Invalid edge nodes. Source exists: ${!!sourceNode}, Target exists: ${!!targetNode}`);
    }

    // Validation against Relationship Schema Registry
    const allEdges = await this.getAllEdges();
    const valResult = validateGraphEdge(edge, sourceNode, targetNode, allEdges);
    if (!valResult.valid) {
      throw new Error(`Graph edge validation failed: ${valResult.errors.join("; ")}`);
    }

    const performSave = (currentEdges: ClinicalGraphEdge[]) => {
      const edgeId = edge.id;
      const idx = currentEdges.findIndex(e => e.id === edgeId);
      const existing = idx !== -1 ? currentEdges[idx] : null;

      // Concurrency check
      if (existing) {
        if (expectedRevision !== null && existing.revision !== expectedRevision) {
          const err = new Error("Revision conflict: Another user has modified this edge.");
          (err as any).statusCode = 409;
          throw err;
        }
        edge.revision = existing.revision + 1;
      } else {
        edge.revision = 1;
      }

      edge.updatedAt = new Date().toISOString();
      edge.updatedBy = actor.userId;

      if (idx !== -1) {
        currentEdges[idx] = edge;
      } else {
        currentEdges.push(edge);
      }

      // If published, write to edge versions snapshot
      if (edge.status === "published") {
        const verSnapshot = { ...edge, id: `${edge.id}_v_${edge.revision}` };
        memoryGraphEdgeVersions.push(verSnapshot);
      }

      // Log audit trail
      const audit = {
        id: `aud_${Math.random().toString(36).substring(2)}`,
        actorId: actor.userId,
        actorRole: actor.role,
        edgeId: edge.id,
        action: existing ? "graph_edge_updated" : "graph_edge_proposed",
        timestamp: new Date().toISOString(),
        details: {
          relationshipType: edge.relationshipType,
          status: edge.status,
          revision: edge.revision,
          reason: reason || ""
        }
      };
      memoryGraphAuditEvents.push(audit);
    };

    if (db) {
      try {
        await db.runTransaction(async (transaction: any) => {
          const edgeRef = db.collection("clinical_graph_edges").doc(edge.id);
          const edgeSnap = await transaction.get(edgeRef);
          
          let revision = 1;
          if (edgeSnap.exists) {
            const data = edgeSnap.data();
            if (expectedRevision !== null && data.revision !== expectedRevision) {
              const err = new Error("Revision conflict: Another user has modified this edge.");
              (err as any).statusCode = 409;
              throw err;
            }
            revision = data.revision + 1;
          }

          edge.revision = revision;
          edge.updatedAt = new Date().toISOString();
          edge.updatedBy = actor.userId;

          transaction.set(edgeRef, edge);

          // Write immutable version if published
          if (edge.status === "published") {
            const verRef = db.collection("clinical_graph_edge_versions").doc(`${edge.id}_v_${edge.revision}`);
            const verSnapshot = { ...edge, id: `${edge.id}_v_${edge.revision}` };
            transaction.set(verRef, verSnapshot);
          }

          // Write audit log entry
          const auditId = `aud_${Math.random().toString(36).substring(2)}`;
          const auditRef = db.collection("clinical_graph_audit_events").doc(auditId);
          const audit = {
            id: auditId,
            actorId: actor.userId,
            actorRole: actor.role,
            edgeId: edge.id,
            action: expectedRevision !== null ? "graph_edge_updated" : "graph_edge_proposed",
            timestamp: new Date().toISOString(),
            details: {
              relationshipType: edge.relationshipType,
              status: edge.status,
              revision: edge.revision,
              reason: reason || ""
            }
          };
          transaction.set(auditRef, audit);
        });
      } catch (err: any) {
        if (err.statusCode === 409) throw err;
        throw new Error(`GraphRepository: Firestore transaction write failed closed: ${err.message}`);
      }
    }

    performSave(memoryGraphEdges);
  }

  /**
   * Traversal helper: resolves all outgoing and/or incoming edges for a given node.
   */
  async getEdgesForNode(nodeId: string, direction: "outgoing" | "incoming" | "both" = "both"): Promise<ClinicalGraphEdge[]> {
    const db = await getFirestoreDb();
    if (db) {
      try {
        const queryOutgoing = db.collection("clinical_graph_edges").where("sourceNodeId", "==", nodeId).get();
        const queryIncoming = db.collection("clinical_graph_edges").where("targetNodeId", "==", nodeId).get();
        const [outSnap, inSnap] = await Promise.all([queryOutgoing, queryIncoming]);

        const edgesMap = new Map<string, ClinicalGraphEdge>();
        if (direction === "outgoing" || direction === "both") {
          outSnap.docs.forEach((doc: any) => edgesMap.set(doc.id, doc.data() as ClinicalGraphEdge));
        }
        if (direction === "incoming" || direction === "both") {
          inSnap.docs.forEach((doc: any) => edgesMap.set(doc.id, doc.data() as ClinicalGraphEdge));
        }
        return Array.from(edgesMap.values());
      } catch (e) {
        console.warn("GraphRepository: Failed to traversal query edges from Firestore. Falling back to memory.");
      }
    }

    const results: ClinicalGraphEdge[] = [];
    for (const edge of memoryGraphEdges) {
      if (edge.status === "archived") continue;
      if (direction === "outgoing" && edge.sourceNodeId === nodeId) {
        results.push(edge);
      } else if (direction === "incoming" && edge.targetNodeId === nodeId) {
        results.push(edge);
      } else if (direction === "both" && (edge.sourceNodeId === nodeId || edge.targetNodeId === nodeId)) {
        results.push(edge);
      }
    }
    return results;
  }

  /**
   * Helper to retrieve all edges (used for cardinality validations).
   */
  private async getAllEdges(): Promise<ClinicalGraphEdge[]> {
    const db = await getFirestoreDb();
    if (db) {
      try {
        const snap = await db.collection("clinical_graph_edges").get();
        return snap.docs.map((doc: any) => doc.data() as ClinicalGraphEdge);
      } catch (e) {
        // Fallback
      }
    }
    return [...memoryGraphEdges];
  }
}

export const globalGraphRepository = new GraphRepository();
