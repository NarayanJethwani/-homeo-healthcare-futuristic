import { EditorialRecord, EditorialSource } from './editorialTypes';
import { EDITORIAL_RECORDS_REGISTRY, SYSTEM_SOURCES_REGISTRY } from './editorialRegistry';
import { EditorialValidator } from './editorialValidator';

export class EditorialService {
  private static recordCache = new Map<string, EditorialRecord[]>();
  private static sourceCache = new Map<string, EditorialSource>();
  private static hasRunQA = false;

  /**
   * Performs quality gate audits at start.
   */
  public static performQualityChecks(): void {
    if (this.hasRunQA) return;
    const report = EditorialValidator.validateRegistry();
    if (!report.isValid) {
      console.warn(`[CIE QA WARNING]: Editorial validation issues detected:\n${report.issues.join('\n')}`);
    } else {
      console.log(`[CIE QA]: Editorial registry quality check PASSED.`);
    }
    this.hasRunQA = true;
  }

  /**
   * Retrieves editorial records for a given remedy, utilizing the lookup cache.
   */
  public static async getEditorialRecords(remedyId: string): Promise<EditorialRecord[]> {
    this.performQualityChecks();

    if (this.recordCache.has(remedyId)) {
      return this.recordCache.get(remedyId)!;
    }

    const records = EDITORIAL_RECORDS_REGISTRY[remedyId] || [];
    this.recordCache.set(remedyId, records);
    return records;
  }

  /**
   * Retrieves source metadata by identifier.
   */
  public static async getSourceMetadata(sourceId: string): Promise<EditorialSource | null> {
    this.performQualityChecks();

    if (this.sourceCache.has(sourceId)) {
      return this.sourceCache.get(sourceId)!;
    }

    const src = SYSTEM_SOURCES_REGISTRY[sourceId];
    if (src) {
      this.sourceCache.set(sourceId, src);
      return src;
    }

    return null;
  }
}
