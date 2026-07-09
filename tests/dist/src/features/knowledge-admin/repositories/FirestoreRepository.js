"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreRepository = void 0;
/**
 * Stub implementation of KnowledgeRepository for future migration to Cloud Firestore.
 * This ensures that switching persistence providers does not require changing admin UI components.
 */
class FirestoreRepository {
    async getEntities(filters) {
        throw new Error("FirestoreRepository.getEntities is not implemented yet.");
    }
    async getEntity(id) {
        throw new Error("FirestoreRepository.getEntity is not implemented yet.");
    }
    async saveEntity(entity, editor, role, reason) {
        throw new Error("FirestoreRepository.saveEntity is not implemented yet.");
    }
    async deleteEntity(id, editor, role) {
        throw new Error("FirestoreRepository.deleteEntity is not implemented yet.");
    }
    async getCitations() {
        throw new Error("FirestoreRepository.getCitations is not implemented yet.");
    }
    async getCitation(id) {
        throw new Error("FirestoreRepository.getCitation is not implemented yet.");
    }
    async saveCitation(citation) {
        throw new Error("FirestoreRepository.saveCitation is not implemented yet.");
    }
    async deleteCitation(id) {
        throw new Error("FirestoreRepository.deleteCitation is not implemented yet.");
    }
    async getAuditLogs(entityId) {
        throw new Error("FirestoreRepository.getAuditLogs is not implemented yet.");
    }
    async addAuditLog(entry) {
        throw new Error("FirestoreRepository.addAuditLog is not implemented yet.");
    }
}
exports.FirestoreRepository = FirestoreRepository;
exports.default = FirestoreRepository;
