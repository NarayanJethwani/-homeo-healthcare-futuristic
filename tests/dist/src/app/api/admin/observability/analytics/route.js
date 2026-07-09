"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = void 0;
exports.GET = GET;
const server_1 = require("next/server");
const analyticsServer_1 = require("@/features/knowledge-admin/adapters/server/analyticsServer");
const analyticsAdapter_1 = require("@/features/knowledge-admin/adapters/analyticsAdapter");
// Ensure this route runs purely on the server side
exports.dynamic = "force-dynamic";
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action") || "summary";
        const clientEmail = process.env.GA4_CLIENT_EMAIL;
        const privateKey = process.env.GA4_PRIVATE_KEY;
        const adapter = (clientEmail && privateKey)
            ? new analyticsServer_1.ProductionAnalyticsAdapter()
            : new analyticsAdapter_1.MockAnalyticsAdapter();
        let data = null;
        switch (action) {
            case "summary":
                data = await adapter.getSummary();
                return server_1.NextResponse.json({ summary: data });
            case "mostRead":
                data = await adapter.getMostReadArticles();
                return server_1.NextResponse.json({ mostRead: data });
            case "commonQueries":
                data = await adapter.getCommonSearchQueries();
                return server_1.NextResponse.json({ commonQueries: data });
            case "highLow":
                data = await adapter.getHighTrafficLowEngagementArticles();
                return server_1.NextResponse.json({ highLow: data });
            case "lowHigh":
                data = await adapter.getLowTrafficHighImportanceArticles();
                return server_1.NextResponse.json({ lowHigh: data });
            default:
                return server_1.NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    }
    catch (err) {
        console.error("Analytics Observability Route Error (sanitized):", err?.message || err);
        return server_1.NextResponse.json({ error: "Failed to retrieve Analytics telemetry data safely." }, { status: 500 });
    }
}
