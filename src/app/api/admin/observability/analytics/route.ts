import { NextRequest, NextResponse } from "next/server";
import { ProductionAnalyticsAdapter } from "@/features/knowledge-admin/adapters/server/analyticsServer";
import { MockAnalyticsAdapter } from "@/features/knowledge-admin/adapters/analyticsAdapter";

// Ensure this route runs purely on the server side
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "summary";

    const clientEmail = process.env.GA4_CLIENT_EMAIL;
    const privateKey = process.env.GA4_PRIVATE_KEY;

    const adapter = (clientEmail && privateKey)
      ? new ProductionAnalyticsAdapter()
      : new MockAnalyticsAdapter();

    let data: any = null;

    switch (action) {
      case "summary":
        data = await adapter.getSummary();
        return NextResponse.json({ summary: data });
      case "mostRead":
        data = await adapter.getMostReadArticles();
        return NextResponse.json({ mostRead: data });
      case "commonQueries":
        data = await adapter.getCommonSearchQueries();
        return NextResponse.json({ commonQueries: data });
      case "highLow":
        data = await adapter.getHighTrafficLowEngagementArticles();
        return NextResponse.json({ highLow: data });
      case "lowHigh":
        data = await adapter.getLowTrafficHighImportanceArticles();
        return NextResponse.json({ lowHigh: data });
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Analytics Observability Route Error (sanitized):", err?.message || err);
    return NextResponse.json({ error: "Failed to retrieve Analytics telemetry data safely." }, { status: 500 });
  }
}
