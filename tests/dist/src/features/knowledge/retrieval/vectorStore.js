"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalVectorStore = exports.HybridPersistentVectorStore = exports.FirestoreVectorStore = exports.MemoryVectorStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function getFirestoreDb() {
    try {
        const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("../../../lib/firebaseAdmin")));
        const db = getAdminDb();
        if (db)
            return db;
    }
    catch (e) {
        // Graceful degradation when Firebase Admin is unavailable
    }
    return null;
}
class MemoryVectorStore {
    constructor() {
        this.cache = new Map();
        this.seedLoaded = false;
        this.dimensions = 768; // Default to nomic-embed-text
        this.modelName = "nomic-embed-text";
        this.dimensionMismatches = 0;
        this.staticFilePath = path_1.default.join(process.cwd(), "src/features/knowledge/retrieval/vectors.json");
    }
    async loadSeedVectors() {
        if (this.seedLoaded) {
            return Array.from(this.cache.values());
        }
        try {
            if (fs_1.default.existsSync(this.staticFilePath)) {
                const fileContent = await fs_1.default.promises.readFile(this.staticFilePath, "utf-8");
                const records = JSON.parse(fileContent);
                if (Array.isArray(records)) {
                    records.forEach((record) => {
                        if (!record.id || !record.vector || !Array.isArray(record.vector) || record.vector.length === 0) {
                            console.warn(`[VectorStore] Ignoring invalid seed vector record for id: "${record.id || "unknown"}"`);
                            return;
                        }
                        if (record.vector.length < 768) {
                            const paddedVector = [...record.vector, ...new Array(768 - record.vector.length).fill(0.01)];
                            record.vector = paddedVector;
                        }
                        this.cache.set(record.id, record);
                        this.dimensions = record.vector.length;
                        if (record.model) {
                            this.modelName = record.model;
                        }
                    });
                    console.log(`[VectorStore] Successfully loaded ${this.cache.size} valid seed vectors from static file.`);
                }
            }
            else {
                console.warn(`[VectorStore] Seed file not found at ${this.staticFilePath}. Starting with empty cache.`);
            }
        }
        catch (error) {
            console.error("[VectorStore] Failed to load static seed vectors:", error);
        }
        this.seedLoaded = true;
        return Array.from(this.cache.values());
    }
    async getVector(id) {
        if (!this.seedLoaded) {
            await this.loadSeedVectors();
        }
        return this.cache.get(id) || null;
    }
    async getVectors(ids) {
        const list = [];
        for (const id of ids) {
            const v = await this.getVector(id);
            if (v)
                list.push(v);
        }
        return list;
    }
    async upsertVector(record) {
        if (!record || !record.id || !record.entityType || !record.title || !record.vector || !Array.isArray(record.vector) || record.vector.length === 0) {
            throw new Error(`Invalid VectorRecord: missing required fields or empty vector (ID: ${record?.id || "unknown"})`);
        }
        if (!this.seedLoaded) {
            await this.loadSeedVectors();
        }
        if (this.dimensions > 0 && record.vector.length !== this.dimensions) {
            this.dimensionMismatches++;
            console.warn(`[MemoryVectorStore] Dimension mismatch for entity ${record.id}: expected ${this.dimensions}, got ${record.vector.length}.`);
        }
        const updatedRecord = {
            ...record,
            articleId: record.articleId || record.id,
            updatedAt: record.updatedAt || new Date().toISOString()
        };
        this.cache.set(record.id, updatedRecord);
        if (record.vector && record.vector.length > 0) {
            this.dimensions = record.vector.length;
            if (record.model) {
                this.modelName = record.model;
            }
        }
        console.log(`[MemoryVectorStore] Upserted vector in-memory cache for entity: ${record.id}`);
    }
    async deleteVector(id) {
        if (!this.seedLoaded) {
            await this.loadSeedVectors();
        }
        this.cache.delete(id);
        console.log(`[MemoryVectorStore] Deleted vector for: ${id}`);
    }
    async getStats() {
        return await this.getIndexStats();
    }
    async getIndexStats() {
        if (!this.seedLoaded) {
            await this.loadSeedVectors();
        }
        return {
            totalVectors: this.cache.size,
            dimensions: this.dimensions,
            model: this.modelName,
            source: "memory",
            persistentStorageEnabled: false,
            coveragePercent: 100,
            staleCount: 0,
            failedCount: this.dimensionMismatches
        };
    }
    async listStaleVectors() {
        return [];
    }
}
exports.MemoryVectorStore = MemoryVectorStore;
class FirestoreVectorStore {
    constructor() {
        this.memoryFallback = new MemoryVectorStore();
        this.isOffline = false;
    }
    async loadSeedVectors() {
        return await this.memoryFallback.loadSeedVectors();
    }
    async getVector(id) {
        if (this.isOffline) {
            return await this.memoryFallback.getVector(id);
        }
        const db = await getFirestoreDb();
        if (!db) {
            this.isOffline = true;
            return await this.memoryFallback.getVector(id);
        }
        try {
            const doc = await db.collection("knowledge_vector_records").doc(id).get();
            if (doc.exists) {
                return doc.data();
            }
        }
        catch (err) {
            if (err.message?.includes("PERMISSION_DENIED") || err.code === 7) {
                this.isOffline = true;
            }
            console.warn(`[FirestoreVectorStore] Failed to get vector ${id}, falling back. Error: ${err.message || err}`);
        }
        return await this.memoryFallback.getVector(id);
    }
    async getVectors(ids) {
        if (this.isOffline) {
            return await this.memoryFallback.getVectors(ids);
        }
        const db = await getFirestoreDb();
        if (!db) {
            this.isOffline = true;
            return await this.memoryFallback.getVectors(ids);
        }
        try {
            const results = [];
            const chunks = [];
            for (let i = 0; i < ids.length; i += 10) {
                chunks.push(ids.slice(i, i + 10));
            }
            for (const chunk of chunks) {
                const snap = await db.collection("knowledge_vector_records").where("id", "in", chunk).get();
                snap.forEach(doc => results.push(doc.data()));
            }
            const foundIds = new Set(results.map(r => r.id));
            const missingIds = ids.filter(id => !foundIds.has(id));
            if (missingIds.length > 0) {
                const fallbackList = await this.memoryFallback.getVectors(missingIds);
                results.push(...fallbackList);
            }
            return results;
        }
        catch (err) {
            if (err.message?.includes("PERMISSION_DENIED") || err.code === 7) {
                this.isOffline = true;
            }
            console.warn(`[FirestoreVectorStore] Failed to batch get vectors, falling back. Error: ${err.message || err}`);
            return await this.memoryFallback.getVectors(ids);
        }
    }
    async upsertVector(record) {
        await this.memoryFallback.upsertVector(record);
        if (this.isOffline)
            return;
        const db = await getFirestoreDb();
        if (!db) {
            this.isOffline = true;
            return;
        }
        try {
            await db.collection("knowledge_vector_records").doc(record.id).set({
                ...record,
                updatedAt: record.updatedAt || new Date().toISOString()
            });
        }
        catch (err) {
            if (err.message?.includes("PERMISSION_DENIED") || err.code === 7) {
                this.isOffline = true;
            }
            console.warn(`[FirestoreVectorStore] Failed to upsert vector ${record.id} in Firestore. Error: ${err.message || err}`);
            throw err;
        }
    }
    async deleteVector(id) {
        await this.memoryFallback.deleteVector(id);
        if (this.isOffline)
            return;
        const db = await getFirestoreDb();
        if (!db) {
            this.isOffline = true;
            return;
        }
        try {
            await db.collection("knowledge_vector_records").doc(id).delete();
        }
        catch (err) {
            if (err.message?.includes("PERMISSION_DENIED") || err.code === 7) {
                this.isOffline = true;
            }
            console.warn(`[FirestoreVectorStore] Failed to delete vector ${id} in Firestore. Error: ${err.message || err}`);
            throw err;
        }
    }
    async getStats() {
        return await this.getIndexStats();
    }
    async getIndexStats() {
        if (this.isOffline) {
            return await this.memoryFallback.getIndexStats();
        }
        const db = await getFirestoreDb();
        if (!db) {
            this.isOffline = true;
            return await this.memoryFallback.getIndexStats();
        }
        try {
            const snap = await db.collection("knowledge_vector_records").get();
            let dimensions = 768;
            let model = "nomic-embed-text";
            if (!snap.empty) {
                const first = snap.docs[0].data();
                dimensions = first.dimensions || first.vector?.length || dimensions;
                model = first.model || model;
            }
            return {
                totalVectors: snap.size,
                dimensions,
                model,
                source: "firestore",
                persistentStorageEnabled: true,
                coveragePercent: 100,
                staleCount: 0,
                failedCount: 0
            };
        }
        catch (err) {
            if (err.message?.includes("PERMISSION_DENIED") || err.code === 7) {
                this.isOffline = true;
            }
            console.warn(`[FirestoreVectorStore] Failed to read index stats, falling back. Error: ${err.message || err}`);
            return await this.memoryFallback.getIndexStats();
        }
    }
    async listStaleVectors() {
        return [];
    }
}
exports.FirestoreVectorStore = FirestoreVectorStore;
class HybridPersistentVectorStore {
    constructor() {
        this.firestoreStore = new FirestoreVectorStore();
        this.memoryStore = new MemoryVectorStore();
    }
    async loadSeedVectors() {
        await this.memoryStore.loadSeedVectors();
        return await this.firestoreStore.loadSeedVectors();
    }
    async getVector(id) {
        const db = await getFirestoreDb();
        if (db) {
            try {
                const v = await this.firestoreStore.getVector(id);
                if (v)
                    return v;
            }
            catch {
                // Fall through
            }
        }
        return await this.memoryStore.getVector(id);
    }
    async getVectors(ids) {
        const db = await getFirestoreDb();
        if (db) {
            try {
                return await this.firestoreStore.getVectors(ids);
            }
            catch {
                // Fall through
            }
        }
        return await this.memoryStore.getVectors(ids);
    }
    async upsertVector(record) {
        await this.memoryStore.upsertVector(record);
        const db = await getFirestoreDb();
        if (db) {
            try {
                await this.firestoreStore.upsertVector(record);
                return;
            }
            catch (err) {
                console.warn("[HybridPersistentVectorStore] Firestore write failed. Kept in memory fallback cache.", err);
            }
        }
    }
    async deleteVector(id) {
        await this.memoryStore.deleteVector(id);
        const db = await getFirestoreDb();
        if (db) {
            try {
                await this.firestoreStore.deleteVector(id);
            }
            catch (err) {
                console.warn("[HybridPersistentVectorStore] Firestore delete failed.", err);
            }
        }
    }
    async getStats() {
        return await this.getIndexStats();
    }
    async getIndexStats() {
        // Public vector index must contain only published Knowledge content.
        const db = await getFirestoreDb();
        let stats;
        if (db) {
            try {
                stats = await this.firestoreStore.getIndexStats();
            }
            catch {
                stats = await this.memoryStore.getIndexStats();
            }
        }
        else {
            stats = await this.memoryStore.getIndexStats();
        }
        try {
            const { globalKmsRepository } = await Promise.resolve().then(() => __importStar(require("../../knowledge-admin/repositories/MemoryRepository")));
            const allEntities = await globalKmsRepository.getEntities();
            const publishedEntities = allEntities.filter(e => e.editorialStatus === "published");
            const totalPublished = publishedEntities.length;
            let covered = 0;
            let stale = 0;
            for (const entity of publishedEntities) {
                const vec = await this.getVector(entity.id);
                if (!vec) {
                    stale++;
                }
                else {
                    covered++;
                    const bodyText = typeof entity.content?.overview === "string"
                        ? entity.content.overview
                        : typeof entity.content?.description === "string"
                            ? entity.content.description
                            : "";
                    const textToHash = `${entity.title.en || entity.title}\n${bodyText}`;
                    const currentHash = Buffer.from(textToHash).toString("base64").slice(0, 16);
                    if (vec.contentHash !== currentHash) {
                        stale++;
                    }
                }
            }
            stats.coveragePercent = totalPublished > 0 ? Math.round((covered / totalPublished) * 100) : 100;
            stats.staleCount = stale;
            stats.indexedPublishedArticlesCount = covered;
            stats.persistenceMode = stats.persistentStorageEnabled ? "firestore-hybrid" : "memory-fallback";
        }
        catch (err) {
            console.warn("[HybridPersistentVectorStore] Failed to enrich coverage index statistics:", err);
        }
        return stats;
    }
    async listStaleVectors() {
        const staleList = [];
        try {
            const { globalKmsRepository } = await Promise.resolve().then(() => __importStar(require("../../knowledge-admin/repositories/MemoryRepository")));
            const allEntities = await globalKmsRepository.getEntities();
            const publishedEntities = allEntities.filter(e => e.editorialStatus === "published");
            for (const entity of publishedEntities) {
                const vec = await this.getVector(entity.id);
                const bodyText = typeof entity.content?.overview === "string"
                    ? entity.content.overview
                    : typeof entity.content?.description === "string"
                        ? entity.content.description
                        : "";
                const textToHash = `${entity.title.en || entity.title}\n${bodyText}`;
                const currentHash = Buffer.from(textToHash).toString("base64").slice(0, 16);
                if (!vec || vec.contentHash !== currentHash) {
                    staleList.push({
                        id: entity.id,
                        entityType: entity.entityType,
                        title: typeof entity.title === "string" ? entity.title : (entity.title.en || ""),
                        slug: entity.slug,
                        vector: vec ? vec.vector : [],
                        contentHash: vec ? vec.contentHash : "",
                        model: vec ? vec.model : "",
                        dimensions: vec ? vec.dimensions : 768,
                        updatedAt: vec ? vec.updatedAt : "",
                        version: entity.versionInfo ? parseInt(entity.versionInfo.version) : 1,
                        status: "published"
                    });
                }
            }
        }
        catch (err) {
            console.warn("[HybridPersistentVectorStore] Failed to list stale vectors:", err);
        }
        return staleList;
    }
}
exports.HybridPersistentVectorStore = HybridPersistentVectorStore;
exports.globalVectorStore = new HybridPersistentVectorStore();
