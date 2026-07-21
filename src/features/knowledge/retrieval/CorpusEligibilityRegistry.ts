export interface CorpusEligibilityEntry {
  entityId: string;
  entityType?: string;
  publishedVersionId: string;
  dataClassification: "non-phi";
  provenance: string;
}

export interface ICorpusEligibilityRegistry {
  getEligibilityEntry(entityId: string): CorpusEligibilityEntry | null;
  isEligible(entityId: string, publishedVersionId: string, entityType?: string): boolean;
}

/**
 * Versioned application-layer eligibility projection for local Ollama embeddings caching.
 * Empty by default until explicit governance approval adds approved entries.
 * Do NOT infer eligibility or alter canonical KMS entity types.
 * Production registry instance is deeply frozen.
 */
const FROZEN_APPROVED_MAP = Object.freeze(new Map<string, CorpusEligibilityEntry>());

export class CorpusEligibilityRegistry implements ICorpusEligibilityRegistry {
  private static testRegistryOverride: ICorpusEligibilityRegistry | null = null;
  private readonly map: ReadonlyMap<string, CorpusEligibilityEntry>;

  constructor(entries?: CorpusEligibilityEntry[]) {
    if (entries && entries.length > 0) {
      const map = new Map<string, CorpusEligibilityEntry>();
      for (const entry of entries) {
        map.set(entry.entityId, Object.freeze({ ...entry }));
      }
      this.map = Object.freeze(map);
    } else {
      this.map = FROZEN_APPROVED_MAP;
    }
    Object.freeze(this);
  }

  static setTestRegistryOverride(override: ICorpusEligibilityRegistry | null): void {
    const env = process.env;
    if (env.NODE_ENV !== "test") {
      return;
    }
    this.testRegistryOverride = override;
  }

  /**
   * Look up eligibility record for a given entity ID.
   */
  getEligibilityEntry(entityId: string): CorpusEligibilityEntry | null {
    const env = process.env;
    if (env.NODE_ENV === "test" && CorpusEligibilityRegistry.testRegistryOverride) {
      return CorpusEligibilityRegistry.testRegistryOverride.getEligibilityEntry(entityId);
    }
    if (!entityId || typeof entityId !== "string") return null;
    return this.map.get(entityId) || null;
  }

  /**
   * Verify if an entity is authoritatively registered as non-PHI and matching the published version ID and entity type.
   */
  isEligible(entityId: string, publishedVersionId: string, entityType?: string): boolean {
    const env = process.env;
    if (env.NODE_ENV === "test" && CorpusEligibilityRegistry.testRegistryOverride) {
      return CorpusEligibilityRegistry.testRegistryOverride.isEligible(entityId, publishedVersionId, entityType);
    }
    const entry = this.getEligibilityEntry(entityId);
    if (!entry) return false;
    if (entry.entityType && entityType && entry.entityType !== entityType) return false;
    if (entry.dataClassification !== "non-phi") return false;
    if (!entry.publishedVersionId || entry.publishedVersionId !== publishedVersionId) return false;
    if (!entry.provenance || typeof entry.provenance !== "string") return false;
    return true;
  }
}

export const defaultCorpusEligibilityRegistry = new CorpusEligibilityRegistry();

/**
 * Injected test registry class for unit/integration testing environments.
 */
export class TestCorpusEligibilityRegistry implements ICorpusEligibilityRegistry {
  private map = new Map<string, CorpusEligibilityEntry>();

  registerTestEntry(entry: CorpusEligibilityEntry): void {
    this.map.set(entry.entityId, { ...entry });
  }

  clearTestRegistry(): void {
    this.map.clear();
  }

  getEligibilityEntry(entityId: string): CorpusEligibilityEntry | null {
    if (!entityId || typeof entityId !== "string") return null;
    return this.map.get(entityId) || null;
  }

  isEligible(entityId: string, publishedVersionId: string, entityType?: string): boolean {
    const entry = this.getEligibilityEntry(entityId);
    if (!entry) return false;
    if (entry.entityType && entityType && entry.entityType !== entityType) return false;
    if (entry.dataClassification !== "non-phi") return false;
    if (!entry.publishedVersionId || entry.publishedVersionId !== publishedVersionId) return false;
    if (!entry.provenance || typeof entry.provenance !== "string") return false;
    return true;
  }
}
