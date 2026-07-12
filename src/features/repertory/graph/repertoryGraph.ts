import { repertoryRepository } from '../database/repertoryDb';
import { RepertoryRubric, GraphTriple } from '../types';

export interface GraphNode {
  id: string;
  type: 'rubric' | 'remedy' | 'miasm' | 'disease' | 'organ_system' | 'modality' | 'etiology' | 'sensation' | 'constitution';
  label: string;
}

export interface GraphEdge {
  sourceId: string;
  targetId: string;
  type: string;
  weight: number;
}

export class RepertoryGraph {
  private static isInitialized = false;
  private static nodes: Map<string, GraphNode> = new Map();
  private static adjacencyList: Map<string, Map<string, { type: string; weight: number }>> = new Map();
  
  // Memoization Caches
  private static semanticNeighboursCache: Map<string, any[]> = new Map();
  private static pathCache: Map<string, string[] | null> = new Map();
  private static traversalCache: Map<string, Map<string, { distance: number; weight: number; path: string[] }>> = new Map();

  /**
   * Initializes the Clinical Knowledge Graph from seed rubrics and triples.
   */
  private static async ensureInitialized() {
    if (this.isInitialized) return;

    const rubrics = await repertoryRepository.getRubrics();
    const triples = await repertoryRepository.getTriples();

    // 1. Add Rubrics as Nodes
    for (const rub of rubrics) {
      this.addNode(rub.rubricId, 'rubric', rub.title);

      // Add category/organ nodes and link them
      if (rub.category) {
        let type: GraphNode['type'] = 'constitution';
        if (rub.category === 'Modalities') type = 'modality';
        else if (rub.category === 'Etiology / Causation') type = 'etiology';
        else if (rub.category === 'Pain') type = 'sensation';
        this.addNode(rub.category, type, rub.category);
        this.addEdge(rub.rubricId, rub.category, 'belongsToCategory', 1.0);
      }

      if (rub.organSystem) {
        this.addNode(rub.organSystem, 'organ_system', rub.organSystem);
        this.addEdge(rub.rubricId, rub.organSystem, 'belongsToOrgan', 1.0);
      }

      // Add related remedies and link them
      for (const rem of rub.relatedRemedies) {
        this.addNode(rem.remedyId, 'remedy', rem.remedyName);
        this.addEdge(rub.rubricId, rem.remedyId, 'hasRemedy', (rem.grade ?? 1) / 4.0);
      }

      // Add related diseases
      for (const dis of rub.relatedDiseases) {
        this.addNode(dis, 'disease', dis);
        this.addEdge(rub.rubricId, dis, 'mapsToDisease', 0.8);
      }
    }

    // 2. Add Triples as Edges
    for (const t of triples) {
      // Determine node types if not present
      if (!this.nodes.has(t.subjectId)) {
        this.addNode(t.subjectId, 'rubric', t.subjectId);
      }
      if (!this.nodes.has(t.objectId)) {
        let nodeType: GraphNode['type'] = 'rubric';
        if (t.predicate === 'suggestsMiasm') nodeType = 'miasm';
        else if (t.predicate === 'mapsToDisease') nodeType = 'disease';
        else if (t.predicate === 'belongsToOrgan') nodeType = 'organ_system';
        else if (t.predicate === 'differentiates') nodeType = 'remedy';
        this.addNode(t.objectId, nodeType, t.objectId);
      }

      this.addEdge(t.subjectId, t.objectId, t.predicate, t.weight || 1.0);
    }

    this.isInitialized = true;
  }

  private static addNode(id: string, type: GraphNode['type'], label: string) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, type, label });
    }
  }

  private static addEdge(sourceId: string, targetId: string, type: string, weight: number) {
    if (!this.adjacencyList.has(sourceId)) {
      this.adjacencyList.set(sourceId, new Map());
    }
    this.adjacencyList.get(sourceId)!.set(targetId, { type, weight });

    // Undirected complementary link mapping
    if (type === 'relatesTo') {
      if (!this.adjacencyList.has(targetId)) {
        this.adjacencyList.set(targetId, new Map());
      }
      this.adjacencyList.get(targetId)!.set(sourceId, { type, weight });
    }
  }

  /**
   * Clears all caches (useful if database updates occur).
   */
  public static clearCaches() {
    this.semanticNeighboursCache.clear();
    this.pathCache.clear();
    this.traversalCache.clear();
  }

  /**
   * Externally register a semantic relationship link in the in-memory graph at runtime.
   */
  public static async registerRelationship(
    sourceId: string,
    type: string,
    targetId: string,
    weight: number = 1.0
  ): Promise<void> {
    await this.ensureInitialized();
    if (!this.nodes.has(sourceId)) {
      this.addNode(sourceId, 'remedy', sourceId);
    }
    if (!this.nodes.has(targetId)) {
      this.addNode(targetId, 'disease', targetId);
    }
    this.addEdge(sourceId, targetId, type, weight);
    this.clearCaches();
  }

  /**
   * Performs BFS traversal to find all connected concepts up to maxDepth.
   */
  public static async traverseGraph(
    startId: string,
    maxDepth: number = 2
  ): Promise<Map<string, { distance: number; weight: number; path: string[] }>> {
    await this.ensureInitialized();
    const cacheKey = `${startId}-${maxDepth}`;
    if (this.traversalCache.has(cacheKey)) {
      return this.traversalCache.get(cacheKey)!;
    }

    const visited = new Map<string, { distance: number; weight: number; path: string[] }>();
    if (!this.nodes.has(startId)) return visited;

    const queue: Array<{ id: string; distance: number; currentWeight: number; path: string[] }> = [];
    queue.push({ id: startId, distance: 0, currentWeight: 1.0, path: [startId] });
    visited.set(startId, { distance: 0, weight: 1.0, path: [startId] });

    while (queue.length > 0) {
      const { id, distance, currentWeight, path } = queue.shift()!;

      if (distance >= maxDepth) continue;

      const neighbors = this.adjacencyList.get(id);
      if (!neighbors) continue;

      for (const [neighId, edge] of neighbors.entries()) {
        const nextWeight = currentWeight * edge.weight;
        const nextDistance = distance + 1;
        const existing = visited.get(neighId);

        if (!existing || existing.weight < nextWeight) {
          const nextPath = [...path, neighId];
          visited.set(neighId, {
            distance: nextDistance,
            weight: nextWeight,
            path: nextPath
          });
          queue.push({
            id: neighId,
            distance: nextDistance,
            currentWeight: nextWeight,
            path: nextPath
          });
        }
      }
    }

    this.traversalCache.set(cacheKey, visited);
    return visited;
  }

  /**
   * Finds the shortest weighted path between two concepts.
   */
  public static async findPath(startId: string, endId: string): Promise<string[] | null> {
    await this.ensureInitialized();
    const cacheKey = `${startId}->${endId}`;
    if (this.pathCache.has(cacheKey)) {
      return this.pathCache.get(cacheKey)!;
    }

    const traversal = await this.traverseGraph(startId, 4);
    const destination = traversal.get(endId);
    const path = destination ? destination.path : null;
    
    this.pathCache.set(cacheKey, path);
    return path;
  }

  /**
   * Retrieves semantic neighbors for query expansion or suggested rubrics.
   */
  public static async getSemanticNeighbours(rubricId: string): Promise<Array<{ rubricId: string; score: number; relationship: string; path: string[] }>> {
    await this.ensureInitialized();
    if (this.semanticNeighboursCache.has(rubricId)) {
      return this.semanticNeighboursCache.get(rubricId)!;
    }

    const rubric = await repertoryRepository.getRubricById(rubricId);
    if (!rubric) return [];

    const neighbors = new Map<string, { score: number; relationship: string; path: string[] }>();
    const traversal = await this.traverseGraph(rubricId, 2);

    for (const [neighId, nodeInfo] of traversal.entries()) {
      if (neighId === rubricId) continue;
      const node = this.nodes.get(neighId);
      if (!node || node.type !== 'rubric') continue;

      let relationship = 'indirect_connection';
      let baseScore = nodeInfo.weight * 20;

      // Classify relationships
      const directEdge = this.adjacencyList.get(rubricId)?.get(neighId);
      if (directEdge) {
        relationship = directEdge.type === 'relatesTo' ? 'complementary' : directEdge.type;
        baseScore += 30;
      }

      const otherRubric = await repertoryRepository.getRubricById(neighId);
      if (otherRubric) {
        if (otherRubric.category === rubric.category) {
          baseScore += 10;
          relationship = 'sibling_category';
        }
        if (otherRubric.organSystem === rubric.organSystem) {
          baseScore += 10;
          relationship = 'sibling_organ';
        }
        if (otherRubric.subCategory === rubric.subCategory) {
          baseScore += 15;
          relationship = 'sibling_subcategory';
        }
      }

      neighbors.set(neighId, {
        score: Math.min(Math.round(baseScore), 100),
        relationship,
        path: nodeInfo.path
      });
    }

    const results = Array.from(neighbors.entries()).map(([rId, info]) => ({
      rubricId: rId,
      score: info.score,
      relationship: info.relationship,
      path: info.path
    })).sort((a, b) => b.score - a.score);

    this.semanticNeighboursCache.set(rubricId, results);
    return results;
  }

  // --- STABLE RETROCOMPATIBLE METHODS REQUIRED BY CORE ENGINES ---

  /**
   * Retrieves all related rubrics (complementary relationships) for a given rubric.
   */
  static async getRelatedRubrics(rubricId: string): Promise<Array<{ rubricId: string; weight: number }>> {
    const triples = await repertoryRepository.getTriples();
    
    // Find relationships in both directions (undirected complementary link)
    const related = triples
      .filter(t => t.predicate === 'relatesTo' && (t.subjectId === rubricId || t.objectId === rubricId))
      .map(t => {
        const otherId = t.subjectId === rubricId ? t.objectId : t.subjectId;
        return {
          rubricId: otherId,
          weight: t.weight || 1.0
        };
      });

    return related;
  }

  /**
   * Retrieves miasms suggested by a rubric.
   */
  static async getSuggestedMiasms(rubricId: string): Promise<Array<{ miasm: string; weight: number }>> {
    const triples = await repertoryRepository.getTriples();
    return triples
      .filter(t => t.subjectId === rubricId && t.predicate === 'suggestsMiasm')
      .map(t => ({
        miasm: t.objectId,
        weight: t.weight || 1.0
      }));
  }

  /**
   * Retrieves modern diseases mapped to a rubric.
   */
  static async getDiseasesMapped(rubricId: string): Promise<Array<{ disease: string; weight: number }>> {
    const triples = await repertoryRepository.getTriples();
    return triples
      .filter(t => t.subjectId === rubricId && t.predicate === 'mapsToDisease')
      .map(t => ({
        disease: t.objectId,
        weight: t.weight || 1.0
      }));
  }

  /**
   * Finds rubrics where remedyA and remedyB have different coverage or grades.
   */
  static async getDifferentiatingRubrics(remedyA: string, remedyB: string): Promise<Array<{ rubric: RepertoryRubric; gradeA: number; gradeB: number; weight: number }>> {
    const allRubrics = await repertoryRepository.getRubrics();
    const diffs: Array<{ rubric: RepertoryRubric; gradeA: number; gradeB: number; weight: number }> = [];

    for (const rub of allRubrics) {
      const covA = rub.relatedRemedies.find(r => r.remedyId.toLowerCase() === remedyA.toLowerCase());
      const covB = rub.relatedRemedies.find(r => r.remedyId.toLowerCase() === remedyB.toLowerCase());

      const gradeA = covA ? (covA.grade ?? 0) : 0;
      const gradeB = covB ? (covB.grade ?? 0) : 0;

      if (Math.abs(gradeA - gradeB) >= 2 || (gradeA >= 3 && gradeB === 0) || (gradeB >= 3 && gradeA === 0)) {
        const diffWeight = Math.max(
          covA?.clinicalExperienceWeight || 0.5,
          covB?.clinicalExperienceWeight || 0.5
        ) * Math.abs(gradeA - gradeB);

        diffs.push({
          rubric: rub,
          gradeA,
          gradeB,
          weight: diffWeight
        });
      }
    }

    return diffs.sort((a, b) => b.weight - a.weight);
  }
}
