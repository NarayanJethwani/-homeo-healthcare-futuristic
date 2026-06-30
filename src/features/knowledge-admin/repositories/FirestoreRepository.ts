import { KmsKnowledgeEntity, CitationRecord, AuditLogEntry } from "../types";
import { KnowledgeRepository, EntityFilters } from "./KnowledgeRepository";

/**
 * Stub implementation of KnowledgeRepository for future migration to Cloud Firestore.
 * This ensures that switching persistence providers does not require changing admin UI components.
 */
export class FirestoreRepository implements KnowledgeRepository {
  async getEntities(filters?: EntityFilters): Promise<KmsKnowledgeEntity[]> {
    throw new Error("FirestoreRepository.getEntities is not implemented yet.");
  }

  async getEntity(id: string): Promise<KmsKnowledgeEntity | null> {
    throw new Error("FirestoreRepository.getEntity is not implemented yet.");
  }

  async saveEntity(entity: KmsKnowledgeEntity, editor: string, role: string, reason?: string): Promise<void> {
    throw new Error("FirestoreRepository.saveEntity is not implemented yet.");
  }

  async deleteEntity(id: string, editor: string, role: string): Promise<void> {
    throw new Error("FirestoreRepository.deleteEntity is not implemented yet.");
  }

  async getCitations(): Promise<CitationRecord[]> {
    throw new Error("FirestoreRepository.getCitations is not implemented yet.");
  }

  async getCitation(id: string): Promise<CitationRecord | null> {
    throw new Error("FirestoreRepository.getCitation is not implemented yet.");
  }

  async saveCitation(citation: CitationRecord): Promise<void> {
    throw new Error("FirestoreRepository.saveCitation is not implemented yet.");
  }

  async deleteCitation(id: string): Promise<void> {
    throw new Error("FirestoreRepository.deleteCitation is not implemented yet.");
  }

  async getAuditLogs(entityId?: string): Promise<AuditLogEntry[]> {
    throw new Error("FirestoreRepository.getAuditLogs is not implemented yet.");
  }

  async addAuditLog(entry: Omit<AuditLogEntry, "id" | "performedAt">): Promise<void> {
    throw new Error("FirestoreRepository.addAuditLog is not implemented yet.");
  }
}
export default FirestoreRepository;
