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
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueEmbeddingJob = queueEmbeddingJob;
exports.getQueueJobs = getQueueJobs;
exports.processQueue = processQueue;
exports.retryFailedJobs = retryFailedJobs;
exports.runJob = runJob;
const vectorStore_1 = require("./vectorStore");
const embeddingProvider_1 = require("./embeddingProvider");
function sanitizePii(text) {
    if (!text)
        return text;
    // Redact email addresses
    let sanitized = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]");
    // Redact phone numbers
    sanitized = sanitized.replace(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, "[REDACTED_PHONE]");
    return sanitized;
}
// In-memory queue fallback
const memoryQueue = [];
async function getFirestoreDb() {
    try {
        const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("../../../lib/firebaseAdmin")));
        const db = getAdminDb();
        if (db)
            return db;
    }
    catch (e) {
        // Fallback
    }
    return null;
}
function generateId() {
    return Math.random().toString(36).substring(2, 15);
}
async function queueEmbeddingJob(articleId, title, entityType, contentText) {
    if (contentText.includes("Reviewer Notes:") || contentText.includes("Audit Trail:") || contentText.includes("workflow note")) {
        throw new Error("Job payload cannot contain reviewer notes or workflow audit logs.");
    }
    const cleanTitle = sanitizePii(title);
    const cleanContent = sanitizePii(contentText);
    const db = await getFirestoreDb();
    const now = new Date().toISOString();
    // Deduplicate: remove any existing pending or failed jobs for this article
    if (db) {
        try {
            const snap = await db.collection("knowledge_embedding_jobs")
                .where("articleId", "==", articleId)
                .get();
            for (const doc of snap.docs) {
                const data = doc.data();
                if (data.status === "pending" || data.status === "failed") {
                    await doc.ref.delete();
                }
            }
        }
        catch {
            // Ignore
        }
    }
    const existingIdx = memoryQueue.findIndex(j => j.articleId === articleId && (j.status === "pending" || j.status === "failed"));
    if (existingIdx !== -1) {
        memoryQueue.splice(existingIdx, 1);
    }
    const job = {
        id: generateId(),
        articleId,
        title: cleanTitle,
        entityType,
        contentText: cleanContent,
        status: "pending",
        createdAt: now,
        updatedAt: now,
        attempts: 0
    };
    if (db) {
        try {
            await db.collection("knowledge_embedding_jobs").doc(job.id).set(job);
            return job;
        }
        catch (err) {
            console.warn("[EmbeddingQueue] Failed to write job to Firestore, writing in-memory fallback.", err);
        }
    }
    memoryQueue.push(job);
    return job;
}
async function getQueueJobs() {
    const db = await getFirestoreDb();
    if (db) {
        try {
            const snap = await db.collection("knowledge_embedding_jobs").get();
            const list = [];
            snap.forEach(doc => list.push(doc.data()));
            return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        }
        catch {
            // Fallback
        }
    }
    return [...memoryQueue].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
async function processQueue() {
    const jobs = await getQueueJobs();
    const pendingJobs = jobs.filter(j => j.status === "pending");
    for (const job of pendingJobs) {
        await runJob(job);
    }
}
async function retryFailedJobs() {
    const jobs = await getQueueJobs();
    const failedJobs = jobs.filter(j => j.status === "failed");
    for (const job of failedJobs) {
        job.status = "pending";
        job.error = undefined;
        job.attempts = 0; // Reset attempts to allow fresh retrying
        job.updatedAt = new Date().toISOString();
        const db = await getFirestoreDb();
        if (db) {
            try {
                await db.collection("knowledge_embedding_jobs").doc(job.id).set(job);
            }
            catch {
                // memory sync
            }
        }
        const memIdx = memoryQueue.findIndex(j => j.id === job.id);
        if (memIdx !== -1) {
            memoryQueue[memIdx] = job;
        }
        await runJob(job);
    }
}
async function runJob(job) {
    const warnings = [];
    const errors = [];
    let providerName = "unknown";
    let dims = 0;
    let computedHash = "";
    let vectorUpserted = false;
    const db = await getFirestoreDb();
    const updateJobStatus = async (status, errorMsg) => {
        job.status = status;
        job.error = errorMsg;
        job.updatedAt = new Date().toISOString();
        if (db) {
            try {
                await db.collection("knowledge_embedding_jobs").doc(job.id).set(job);
            }
            catch {
                // fallback
            }
        }
        const memIdx = memoryQueue.findIndex(j => j.id === job.id);
        if (memIdx !== -1) {
            memoryQueue[memIdx] = job;
        }
    };
    if (job.attempts >= 3) {
        const errorMsg = "Max retries exceeded (3 attempts limit reached).";
        errors.push(errorMsg);
        await updateJobStatus("failed", errorMsg);
        return {
            success: false,
            jobId: job.id,
            articleId: job.articleId,
            vectorUpserted: false,
            warnings,
            errors
        };
    }
    job.status = "processing";
    job.attempts++;
    job.updatedAt = new Date().toISOString();
    await updateJobStatus("processing");
    try {
        const provider = await embeddingProvider_1.embeddingManager.getActiveProvider();
        providerName = provider.name;
        if (provider.name === "null-provider") {
            throw new Error("Active embedding provider is offline or null-provider.");
        }
        // Generate embedding
        const vector = await provider.getEmbeddings(job.contentText);
        if (!vector || vector.length === 0) {
            throw new Error("Generated embedding vector is empty.");
        }
        dims = vector.length;
        // Compute content hash
        const textToHash = `${job.title}\n${job.contentText}`;
        computedHash = Buffer.from(textToHash).toString("base64").slice(0, 16);
        const record = {
            id: job.articleId,
            articleId: job.articleId,
            entityType: job.entityType,
            title: job.title,
            vector,
            contentHash: computedHash,
            model: provider.name,
            dimensions: vector.length,
            updatedAt: new Date().toISOString(),
            status: "published"
        };
        await vectorStore_1.globalVectorStore.upsertVector(record);
        vectorUpserted = true;
        await updateJobStatus("completed");
        return {
            success: true,
            jobId: job.id,
            articleId: job.articleId,
            vectorUpserted: true,
            providerUsed: providerName,
            dimensions: dims,
            contentHash: computedHash,
            warnings,
            errors
        };
    }
    catch (err) {
        const errMsg = err.message || String(err);
        errors.push(errMsg);
        console.error(`[EmbeddingQueue] Job ${job.id} for article ${job.articleId} failed: ${errMsg}`);
        await updateJobStatus("failed", errMsg);
        return {
            success: false,
            jobId: job.id,
            articleId: job.articleId,
            vectorUpserted: false,
            providerUsed: providerName,
            warnings,
            errors
        };
    }
}
