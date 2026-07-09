import { NextRequest, NextResponse } from "next/server";
import { ProductionSearchConsoleAdapter } from "@/features/knowledge-admin/adapters/server/searchConsoleServer";
import { MockSearchConsoleAdapter } from "@/features/knowledge-admin/adapters/searchConsoleAdapter";

// Ensure this route runs purely on the server side
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "summary";

    const clientEmail = process.env.SEARCH_CONSOLE_CLIENT_EMAIL;
    const privateKey = process.env.SEARCH_CONSOLE_PRIVATE_KEY;

    const adapter = (clientEmail && privateKey)
      ? new ProductionSearchConsoleAdapter()
      : new MockSearchConsoleAdapter();

    let data: any = null;

    switch (action) {
      case "summary":
        data = await adapter.getSummary();
        return NextResponse.json({ summary: data });
      case "topPages":
        data = await adapter.getTopLandingPages();
        return NextResponse.json({ topPages: data });
      case "lowCtr":
        data = await adapter.getPagesWithLowCtr();
        return NextResponse.json({ lowCtr: data });
      case "poorRank":
        data = await adapter.getPagesWithImpressionsButPoorRanking();
        return NextResponse.json({ poorRank: data });
      case "improvements":
        data = await adapter.getPagesNeedingTitleMetaImprovement();
        return NextResponse.json({ improvements: data });
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("SEO Observability Route Error (sanitized):", err?.message || err);
    return NextResponse.json({ error: "Failed to retrieve SEO telemetry data safely." }, { status: 500 });
  }
}
