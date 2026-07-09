"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.GET = GET;
const server_1 = require("next/server");
const searchConsoleServer_1 = require("@/features/knowledge-admin/adapters/server/searchConsoleServer");
const searchConsoleAdapter_1 = require("@/features/knowledge-admin/adapters/searchConsoleAdapter");
// Ensure this route runs purely on the server side
exports.dynamic = "force-dynamic";
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action") || "summary";
        const clientEmail = process.env.SEARCH_CONSOLE_CLIENT_EMAIL;
        const privateKey = process.env.SEARCH_CONSOLE_PRIVATE_KEY;
        const adapter = (clientEmail && privateKey)
            ? new searchConsoleServer_1.ProductionSearchConsoleAdapter()
            : new searchConsoleAdapter_1.MockSearchConsoleAdapter();
        let data = null;
        switch (action) {
            case "summary":
                data = await adapter.getSummary();
                return server_1.NextResponse.json({ summary: data });
            case "topPages":
                data = await adapter.getTopLandingPages();
                return server_1.NextResponse.json({ topPages: data });
            case "lowCtr":
                data = await adapter.getPagesWithLowCtr();
                return server_1.NextResponse.json({ lowCtr: data });
            case "poorRank":
                data = await adapter.getPagesWithImpressionsButPoorRanking();
                return server_1.NextResponse.json({ poorRank: data });
            case "improvements":
                data = await adapter.getPagesNeedingTitleMetaImprovement();
                return server_1.NextResponse.json({ improvements: data });
            default:
                return server_1.NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    }
    catch (err) {
        console.error("SEO Observability Route Error (sanitized):", err?.message || err);
        return server_1.NextResponse.json({ error: "Failed to retrieve SEO telemetry data safely." }, { status: 500 });
    }
}
