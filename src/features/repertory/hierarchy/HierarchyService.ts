import { RepertoryRetrievalRepository } from "../repositories/RepertoryRetrievalRepository";
import {
  RepertoryRubricRecord,
  RepertoryAccessContext,
  RubricRecordId,
  RepertoryEditionId,
  RepertoryChapterId
} from "../types/repertoryTypes";

export interface DescendantTraversalOptions {
  maxDepth?: number;
  maxItems?: number;
}

export interface ValidationReport {
  valid: boolean;
  errors: string[];
}

export class HierarchyService {
  // Simple in-memory cache for built hierarchies to prevent reload per traversal call
  private hierarchyCache = new Map<string, {
    rubrics: RepertoryRubricRecord[];
    parentToChildren: Map<string, RepertoryRubricRecord[]>;
    idToRecord: Map<string, RepertoryRubricRecord>;
  }>();

  constructor(private repository: RepertoryRetrievalRepository) {}

  private async getOrBuildChapterHierarchy(
    context: RepertoryAccessContext,
    editionId: RepertoryEditionId,
    chapterId: RepertoryChapterId
  ) {
    const cacheKey = `${editionId}:${chapterId}`;
    const cached = this.hierarchyCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Load all rubrics in the chapter (using large limit to retrieve all items)
    const result = await this.repository.getRubricsByChapter(context, editionId, chapterId, { limit: 100000 });
    const rubrics = result.items;

    const parentToChildren = new Map<string, RepertoryRubricRecord[]>();
    const idToRecord = new Map<string, RepertoryRubricRecord>();

    for (const rubric of rubrics) {
      idToRecord.set(rubric.id, rubric);
      if (rubric.parentRecordId) {
        const list = parentToChildren.get(rubric.parentRecordId) || [];
        list.push(rubric);
        parentToChildren.set(rubric.parentRecordId, list);
      }
    }

    // Update hasChildren dynamically on records
    for (const rubric of rubrics) {
      rubric.hasChildren = parentToChildren.has(rubric.id);
    }

    const value = { rubrics, parentToChildren, idToRecord };
    this.hierarchyCache.set(cacheKey, value);
    return value;
  }

  async getParent(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord | null> {
    const selfRecord = await this.repository.getRubricById(context, rubricId);
    if (!selfRecord || !selfRecord.parentRecordId) return null;
    return this.repository.getRubricById(context, selfRecord.parentRecordId);
  }

  async getChildren(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord[]> {
    const selfRecord = await this.repository.getRubricById(context, rubricId);
    if (!selfRecord) return [];

    const { parentToChildren } = await this.getOrBuildChapterHierarchy(
      context,
      selfRecord.editionId,
      selfRecord.chapterId
    );

    return parentToChildren.get(rubricId) || [];
  }

  async getAncestors(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<RepertoryRubricRecord[]> {
    const ancestors: RepertoryRubricRecord[] = [];
    let currentId: RubricRecordId | undefined = rubricId;
    const visited = new Set<string>();

    while (currentId) {
      if (visited.has(currentId)) {
        // Cycle detected
        break;
      }
      visited.add(currentId);

      const record = await this.repository.getRubricById(context, currentId);
      if (!record) break;

      // Don't include the target rubric itself in ancestors
      if (currentId !== rubricId) {
        ancestors.push(record);
      }

      currentId = record.parentRecordId;
    }

    return ancestors.reverse(); // nearest parent last
  }

  async getDescendants(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId,
    options?: DescendantTraversalOptions
  ): Promise<RepertoryRubricRecord[]> {
    const selfRecord = await this.repository.getRubricById(context, rubricId);
    if (!selfRecord) return [];

    const { parentToChildren } = await this.getOrBuildChapterHierarchy(
      context,
      selfRecord.editionId,
      selfRecord.chapterId
    );

    const maxDepth = options?.maxDepth ?? 10;
    const maxItems = options?.maxItems ?? 500;
    const result: RepertoryRubricRecord[] = [];
    const visited = new Set<string>();

    const traverse = (nodeId: string, depth: number) => {
      if (depth > maxDepth || result.length >= maxItems || visited.has(nodeId)) {
        return;
      }
      visited.add(nodeId);

      const children = parentToChildren.get(nodeId) || [];
      for (const child of children) {
        if (result.length >= maxItems) break;
        result.push(child);
        traverse(child.id, depth + 1);
      }
    };

    traverse(rubricId, 1);
    return result;
  }

  async buildBreadcrumb(
    context: RepertoryAccessContext,
    rubricId: RubricRecordId
  ): Promise<{ id: RubricRecordId; label: string }[]> {
    const ancestors = await this.getAncestors(context, rubricId);
    const selfRecord = await this.repository.getRubricById(context, rubricId);

    const breadcrumbs = ancestors.map(a => ({ id: a.id, label: a.displayText }));
    if (selfRecord) {
      breadcrumbs.push({ id: selfRecord.id, label: selfRecord.displayText });
    }
    return breadcrumbs;
  }

  async validateCorpus(
    context: RepertoryAccessContext,
    editionId: RepertoryEditionId,
    chapterId: RepertoryChapterId
  ): Promise<ValidationReport> {
    const errors: string[] = [];
    const { rubrics, idToRecord } = await this.getOrBuildChapterHierarchy(context, editionId, chapterId);

    for (const rubric of rubrics) {
      // 1. Missing parent/Orphan records (excluding root nodes)
      if (rubric.parentRecordId) {
        const parent = idToRecord.get(rubric.parentRecordId);
        if (!parent) {
          errors.push(`Orphan record detected: rubric ${rubric.id} refers to missing parent ${rubric.parentRecordId}`);
        } else {
          // 2. Cross-edition parent references
          if (parent.editionId !== rubric.editionId) {
            errors.push(`Cross-edition parent reference: rubric ${rubric.id} in ${rubric.editionId} refers to parent in ${parent.editionId}`);
          }
        }
      }

      // 3. Excessive depth checks
      if (rubric.depth > 10) {
        errors.push(`Excessive depth boundary exceeded: rubric ${rubric.id} is at depth ${rubric.depth} (max is 10)`);
      }
    }

    // 4. Cycle detection
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const checkCycle = (id: string): boolean => {
      visited.add(id);
      recStack.add(id);

      const record = idToRecord.get(id);
      if (record && record.parentRecordId) {
        if (!visited.has(record.parentRecordId)) {
          if (checkCycle(record.parentRecordId)) return true;
        } else if (recStack.has(record.parentRecordId)) {
          return true; // Cycle found
        }
      }

      recStack.delete(id);
      return false;
    };

    for (const rubric of rubrics) {
      if (!visited.has(rubric.id)) {
        if (checkCycle(rubric.id)) {
          errors.push(`Hierarchy loop/cycle detected involving rubric ${rubric.id}`);
          break;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
