"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = OPTIONS;
exports.GET = GET;
const server_1 = require("next/server");
const aiRouter_1 = require("@/lib/aiRouter");
const cacheService_1 = require("@/lib/cacheService");
const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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
        // Dynamically update Ollama and other health check statuses before returning
        await aiRouter_1.aiRouterService.updateProviderHealth();
        const stats = aiRouter_1.aiRouterService.getStats();
        const requestLogs = aiRouter_1.aiRouterService.getRequestLogs();
        const cacheStats = await cacheService_1.cacheService.getStats();
        return server_1.NextResponse.json({
            success: true,
            stats,
            cache: cacheStats,
            logs: requestLogs
        }, { headers: CORS_HEADERS });
    }
    catch (error) {
        console.error("Error in AI Router Health endpoint:", error);
        return server_1.NextResponse.json({
            success: false,
            error: error.message || String(error)
        }, { status: 500, headers: CORS_HEADERS });
    }
}
