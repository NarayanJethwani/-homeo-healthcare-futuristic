"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreRepertoryRepository = void 0;
class FirestoreRepertoryRepository {
    async getRubrics(filters) {
        console.warn("FirestoreRepertoryRepository.getRubrics: stub only, not connected in Phase 1.");
        return [];
    }
    async getRubricById(id) {
        console.warn("FirestoreRepertoryRepository.getRubricById: stub only, not connected in Phase 1.");
        return null;
    }
    async saveRubric(rubric) {
        console.warn("FirestoreRepertoryRepository.saveRubric: stub only, not connected in Phase 1.");
        return rubric;
    }
    async deleteRubric(id) {
        console.warn("FirestoreRepertoryRepository.deleteRubric: stub only, not connected in Phase 1.");
        return false;
    }
    async getTriples() {
        console.warn("FirestoreRepertoryRepository.getTriples: stub only, not connected in Phase 1.");
        return [];
    }
    async saveTriple(triple) {
        console.warn("FirestoreRepertoryRepository.saveTriple: stub only, not connected in Phase 1.");
    }
    async deleteTriple(subjectId, predicate, objectId) {
        console.warn("FirestoreRepertoryRepository.deleteTriple: stub only, not connected in Phase 1.");
        return false;
    }
}
exports.FirestoreRepertoryRepository = FirestoreRepertoryRepository;
