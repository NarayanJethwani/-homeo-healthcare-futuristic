"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = OPTIONS;
exports.POST = POST;
const server_1 = require("next/server");
const vectorStore_1 = require("@/features/knowledge/retrieval/vectorStore");
const embeddingProvider_1 = require("@/features/knowledge/retrieval/embeddingProvider");
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
async function OPTIONS() {
    return new server_1.NextResponse(null, {
        status: 200,
        headers: CORS_HEADERS
    });
}
async function POST(request) {
    // TODO: Enforce admin session verification in middleware or central admin layout once session store is centralized.
    // Current admin API paths are restricted to internal localhost/origin access behind corporate workspace firewalls.
    try {
        const payload = await request.json();
        const { id, entityType, title, contentText } = payload;
        // Input Validation
        if (!id || typeof id !== "string") {
            return server_1.NextResponse.json({ success: false, error: "Invalid payload: 'id' string is required." }, { status: 400, headers: CORS_HEADERS });
        }
        if (!contentText || typeof contentText !== "string") {
            return server_1.NextResponse.json({ success: false, error: "Invalid payload: 'contentText' string is required." }, { status: 400, headers: CORS_HEADERS });
        }
        if (!entityType || typeof entityType !== "string") {
            return server_1.NextResponse.json({ success: false, error: "Invalid payload: 'entityType' string is required." }, { status: 400, headers: CORS_HEADERS });
        }
        if (!title || typeof title !== "string") {
            return server_1.NextResponse.json({ success: false, error: "Invalid payload: 'title' string is required." }, { status: 400, headers: CORS_HEADERS });
        }
        // Length limit checks (prevent excessive token usage or DOS)
        if (contentText.length > 100000) {
            return server_1.NextResponse.json({ success: false, error: "Content length exceeds the maximum limit of 100,000 characters." }, { status: 400, headers: CORS_HEADERS });
        }
        // 1. Get active embedding provider
        const provider = await embeddingProvider_1.embeddingManager.getActiveProvider();
        // 2. Generate Vector
        let vector = [];
        if (provider.name !== "null-provider") {
            try {
                vector = await provider.getEmbeddings(contentText);
            }
            catch (err) {
                console.warn(`[Sync Vector] Failed to generate embedding via provider ${provider.name}:`, err.message || err);
            }
        }
        // 3. Fallback check
        if (vector.length === 0) {
            return server_1.NextResponse.json({
                success: false,
                error: `Embedding service (${provider.name}) is currently offline or misconfigured. Cannot generate vector.`
            }, { status: 503, headers: CORS_HEADERS });
        }
        // 4. Upsert Vector to in-memory session store (no filesystem source writes)
        await vectorStore_1.globalVectorStore.upsertVector({
            id,
            entityType,
            title,
            vector,
            model: provider.name,
            dimensions: vector.length
        });
        const stats = await vectorStore_1.globalVectorStore.getStats();
        return server_1.NextResponse.json({
            success: true,
            message: "Session vector cache updated. Persistent vector storage pending.",
            stats: {
                totalVectors: stats.totalVectors,
                dimensions: vector.length,
                model: provider.name,
                source: stats.source,
                persistentStorageEnabled: false
            }
        }, { headers: CORS_HEADERS });
    }
    catch (error) {
        console.error("Error in sync-vector route:", error);
        return server_1.NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500, headers: CORS_HEADERS });
    }
}
