import "server-only";

import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { FirestoreControlledReleaseRepository } from "./controlledReleaseFirestoreRepository";
import { FirestoreControlledReleaseExecutionRepository } from "./controlledReleaseExecutionFirestoreRepository";
import { getActiveControlledPublicationOverride } from "./controlledReleaseExecutionService";

const releaseRepository = new FirestoreControlledReleaseRepository();
const executionRepository =
  new FirestoreControlledReleaseExecutionRepository();

export async function loadActiveControlledPublicationOverride(
  entityId: string,
  now = new Date().toISOString()
) {
  try {
    const entity = await globalKmsRepository.getEntity(entityId);
    if (!entity) return null;
    return await getActiveControlledPublicationOverride(
      entity,
      releaseRepository,
      executionRepository,
      now
    );
  } catch {
    console.error(
      "Controlled publication activation read failed closed."
    );
    return null;
  }
}
