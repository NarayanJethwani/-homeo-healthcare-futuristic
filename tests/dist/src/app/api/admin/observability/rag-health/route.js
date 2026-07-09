"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = OPTIONS;
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const vectorStore_1 = require("@/features/knowledge/retrieval/vectorStore");
const embeddingQueue_1 = require("@/features/knowledge/retrieval/embeddingQueue");
const MemoryRepository_1 = require("@/features/knowledge-admin/repositories/MemoryRepository");
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
async function OPTIONS() {
    return new server_1.NextResponse(null, {
        status: 200,
        headers: CORS_HEADERS
    });
}
async function GET() {
    try {
        const stats = await vectorStore_1.globalVectorStore.getIndexStats();
        const queue = await (0, embeddingQueue_1.getQueueJobs)();
        const stale = await vectorStore_1.globalVectorStore.listStaleVectors();
        return server_1.NextResponse.json({
            success: true,
            stats,
            queue,
            stale
        }, { headers: CORS_HEADERS });
    }
    catch (error) {
        console.error("[RAG Health API] GET Failure:", error);
        return server_1.NextResponse.json({
            success: false,
            error: error.message || "Internal Server Error"
        }, { status: 500, headers: CORS_HEADERS });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { action } = body;
        if (action === "processQueue") {
            await (0, embeddingQueue_1.processQueue)();
            return server_1.NextResponse.json({ success: true, message: "Queue processing completed." }, { headers: CORS_HEADERS });
        }
        if (action === "retryFailedJobs") {
            await (0, embeddingQueue_1.retryFailedJobs)();
            return server_1.NextResponse.json({ success: true, message: "Retrying failed jobs started." }, { headers: CORS_HEADERS });
        }
        if (action === "reindexStale") {
            const staleList = await vectorStore_1.globalVectorStore.listStaleVectors();
            for (const item of staleList) {
                const entity = await MemoryRepository_1.globalKmsRepository.getEntity(item.id);
                if (entity) {
                    const bodyText = typeof entity.content?.overview === "string"
                        ? entity.content.overview
                        : typeof entity.content?.description === "string"
                            ? entity.content.description
                            : "";
                    const titleStr = typeof entity.title === "string" ? entity.title : (entity.title.en || "");
                    await (0, embeddingQueue_1.queueEmbeddingJob)(entity.id, titleStr, entity.entityType, bodyText);
                }
            }
            // Process immediately
            await (0, embeddingQueue_1.processQueue)();
            return server_1.NextResponse.json({ success: true, message: "Stale vector reindexing completed." }, { headers: CORS_HEADERS });
        }
        return server_1.NextResponse.json({ success: false, error: "Invalid action" }, { status: 400, headers: CORS_HEADERS });
    }
    catch (error) {
        console.error("[RAG Health API] POST Failure:", error);
        return server_1.NextResponse.json({
            success: false,
            error: error.message || "Internal Server Error"
        }, { status: 500, headers: CORS_HEADERS });
    }
}
