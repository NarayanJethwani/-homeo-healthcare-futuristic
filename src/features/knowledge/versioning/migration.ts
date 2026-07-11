import { KnowledgeEntity } from "../types";
import { globalKmsRepository } from "../../knowledge-admin/repositories/MemoryRepository";

export interface DeprecationRedirect {
  deprecatedId: string;
  replacementId: string;
  redirectUrl: string;
}

/**
 * Validates and aggregates redirect routes for deprecated entities.
 */
export function buildDeprecationRedirectMap(entities: KnowledgeEntity[]): Map<string, DeprecationRedirect> {
  const redirectMap = new Map<string, DeprecationRedirect>();

  for (const entity of entities) {
    if (entity.versionInfo?.deprecated && entity.versionInfo.replacementEntityId) {
      const targetId = entity.versionInfo.replacementEntityId;
      const targetEntity = entities.find(e => e.id === targetId);
      
      if (targetEntity) {
        redirectMap.set(entity.id, {
          deprecatedId: entity.id,
          replacementId: targetId,
          redirectUrl: targetEntity.canonicalUrl,
        });
      }
    }
  }

  return redirectMap;
}

export interface MigrationLog {
  entityId: string;
  statusFrom: string;
  statusTo: string;
  legacyStatus: string;
  actionTaken: string;
  error?: string;
}

export interface MigrationResult {
  successCount: number;
  failureCount: number;
  logs: MigrationLog[];
  dryRun: boolean;
}

export async function runLegacyMigration(dryRun: boolean = true): Promise<MigrationResult> {
  const result: MigrationResult = {
    successCount: 0,
    failureCount: 0,
    logs: [],
    dryRun
  };

  try {
    const entities = await globalKmsRepository.getEntities();
    for (const entity of entities) {
      const log: MigrationLog = {
        entityId: entity.id,
        statusFrom: entity.editorialStatus || "unknown",
        statusTo: "draft",
        legacyStatus: "review-required",
        actionTaken: ""
      };

      try {
        let classification: any = "review-required";
        let targetStatus: any = "draft";

        if (entity.editorialStatus === "published") {
          const hasReviewer = !!entity.reviewer && (typeof entity.reviewer === "string" ? entity.reviewer.trim().length > 0 : !!entity.reviewer.name);
          const hasReviewDate = !!entity.lastClinicalReview || !!entity.versionInfo?.reviewed;
          
          if (hasReviewer && hasReviewDate) {
            classification = "verified-published";
            targetStatus = "published";
          } else {
            classification = "legacy-published-unverified";
            targetStatus = "published";
          }
        } else if (entity.editorialStatus === "archived") {
          classification = "archived";
          targetStatus = "archived";
        } else if (entity.editorialStatus === "draft") {
          classification = "review-required";
          targetStatus = "draft";
        } else {
          classification = "review-required";
          targetStatus = "draft";
        }

        log.statusTo = targetStatus;
        log.legacyStatus = classification;

        if (dryRun) {
          log.actionTaken = `[Dry Run] Would map entity to ${targetStatus} with classification ${classification}.`;
          result.successCount++;
        } else {
          if (entity.legacyVerificationStatus === classification) {
            log.actionTaken = `Already migrated with classification ${classification}. No action taken.`;
            result.successCount++;
          } else {
            const updatedEntity = {
              ...entity,
              editorialStatus: targetStatus,
              legacyVerificationStatus: classification,
              publishedVersionId: entity.publishedVersionId || (classification === "verified-published" ? `ver-${entity.id}-migration` : undefined),
              lastUpdated: new Date().toISOString()
            };

            await globalKmsRepository.saveEntity(
              updatedEntity,
              "Migration Script",
              "Administrator",
              `Migrated legacy entity with classification ${classification}`
            );
            log.actionTaken = `Successfully migrated entity to ${targetStatus} as ${classification}.`;
            result.successCount++;
          }
        }
      } catch (err: any) {
        log.error = err.message || err;
        log.actionTaken = "Failed to migrate entity.";
        result.failureCount++;
      }
      result.logs.push(log);
    }
  } catch (err: any) {
    console.error("Migration failed:", err);
  }

  return result;
}
