import { ClinicalGraphNode, ClinicalGraphEdge, ClinicalGraphNodeType, ClinicalGraphRelationshipType } from "./clinicalGraphTypes";
import { globalGraphRepository } from "./graphRepository";
import { createCanonicalGraphEdgeKey, validateGraphNode, validateGraphEdge } from "./graphValidationService";

/**
 * Maps document/entity category to the canonical Graph Node Type.
 */
export function mapCategoryToNodeType(category: string): ClinicalGraphNodeType {
  const cat = category.toLowerCase().trim();
  if (cat === "disease" || cat === "condition") return "condition";
  if (cat === "lab-test") return "terminology-code";
  if (cat === "symptom") return "symptom";
  if (cat === "remedy") return "remedy";
  if (cat === "rubric") return "rubric";
  return "knowledge-entity";
}

export interface GraphSyncResult {
  nodeId: string;
  action: "created" | "updated" | "skipped";
  errors: string[];
}

export interface MigrationReport {
  totalEntitiesProcessed: number;
  projectedNodes: number;
  warnings: string[];
  dryRunSucceeded: boolean;
}

export class GraphSyncService {
  /**
   * Synchronizes a published knowledge entity to its corresponding Graph Node representation.
   */
  async syncKnowledgeEntityToNode(entity: {
    id: string;
    category: string;
    title: string;
    status: string;
    legacyVerificationStatus?: string;
  }): Promise<GraphSyncResult> {
    // Drafts are strictly forbidden from entering the clinical graph nodes
    if (entity.status !== "published") {
      return { nodeId: "", action: "skipped", errors: ["Entity is not published. Draft entities cannot be registered in the graph."] };
    }

    const nodeType = mapCategoryToNodeType(entity.category);
    const nodeId = `node:${nodeType}:${entity.id}`;

    const existingNode = await globalGraphRepository.getNode(nodeId);
    
    const node: ClinicalGraphNode = {
      id: nodeId,
      canonicalEntityId: entity.id,
      nodeType,
      label: entity.title,
      normalizedLabel: entity.title.toLowerCase(),
      editorialStatus: "published",
      legacyVerificationStatus: entity.legacyVerificationStatus as any || "verified",
      sourceEntityType: "knowledge-entity",
      retrievalEligible: true,
      createdAt: existingNode?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "sync_service",
      updatedBy: "sync_service",
      schemaVersion: "1.0.0"
    };

    const val = validateGraphNode(node);
    if (!val.valid) {
      return { nodeId, action: "skipped", errors: val.errors };
    }

    await globalGraphRepository.saveNode(node);

    return {
      nodeId,
      action: existingNode ? "updated" : "created",
      errors: []
    };
  }

  /**
   * Parses AI-generated text extracting structured relationships.
   */
  parseRelationExtraction(aiGeneratedText: string): Partial<ClinicalGraphEdge>[] {
    const relations: Partial<ClinicalGraphEdge>[] = [];
    
    // 1. Try JSON block extraction
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/i;
    const match = jsonRegex.exec(aiGeneratedText);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item.sourceNodeId && item.relationshipType && item.targetNodeId) {
              relations.push({
                sourceNodeId: item.sourceNodeId,
                relationshipType: item.relationshipType,
                targetNodeId: item.targetNodeId,
                confidence: typeof item.confidence === "number" ? item.confidence : 0.8,
                direction: item.direction || "directed",
                status: (item.status === "proposed" ? "draft" : item.status) || "draft"
              });
            }
          }
          return relations;
        }
      } catch (e) {
        // Fallback to text parsing
      }
    }

    // 2. Line-by-line parsing: "SourceNodeId [RelationshipType] TargetNodeId"
    const lines = aiGeneratedText.split("\n");
    for (const line of lines) {
      const lineMatch = /^\s*([a-zA-Z0-9_:-]+)\s+\[([a-zA-Z0-9_-]+)\]\s+([a-zA-Z0-9_:-]+)\s*$/i.exec(line);
      if (lineMatch) {
        relations.push({
          sourceNodeId: lineMatch[1],
          relationshipType: lineMatch[2] as ClinicalGraphRelationshipType,
          targetNodeId: lineMatch[3],
          confidence: 0.7,
          direction: "directed",
          status: "draft"
        });
      }
    }

    return relations;
  }

  /**
   * Dry-run migration validator mapping existing knowledge items to potential graph nodes.
   */
  async runDryRunGraphMigration(entities: Array<{
    id: string;
    category: string;
    title: string;
    status: string;
    legacyVerificationStatus?: string;
  }>): Promise<MigrationReport> {
    let projectedNodes = 0;
    const warnings: string[] = [];

    for (const entity of entities) {
      if (entity.status !== "published") {
        warnings.push(`Skipped entity ${entity.id}: status is '${entity.status}' (not published)`);
        continue;
      }

      const nodeType = mapCategoryToNodeType(entity.category);
      const nodeId = `node:${nodeType}:${entity.id}`;

      const node: ClinicalGraphNode = {
        id: nodeId,
        canonicalEntityId: entity.id,
        nodeType,
        label: entity.title,
        normalizedLabel: entity.title.toLowerCase(),
        editorialStatus: "published",
        legacyVerificationStatus: entity.legacyVerificationStatus as any || "verified",
        sourceEntityType: "knowledge-entity",
        retrievalEligible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "sync_service",
        updatedBy: "sync_service",
        schemaVersion: "1.0.0"
      };

      const val = validateGraphNode(node);
      if (!val.valid) {
        warnings.push(`Entity ${entity.id} failed graph node validation: ${val.errors.join("; ")}`);
      } else {
        projectedNodes++;
      }
    }

    return {
      totalEntitiesProcessed: entities.length,
      projectedNodes,
      warnings,
      dryRunSucceeded: warnings.length < entities.length * 0.5 // Succeeded if > 50% are valid
    };
  }
}

export const globalGraphSyncService = new GraphSyncService();
