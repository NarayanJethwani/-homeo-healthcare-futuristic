import { NextResponse } from "next/server";
import { aiRouterService } from "@/lib/aiRouter";
import { cacheService } from "@/lib/cacheService";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS
  });
}

export async function GET() {
  try {
    // Dynamically update Ollama and other health check statuses before returning
    await aiRouterService.updateProviderHealth();

    const stats = aiRouterService.getStats();
    const requestLogs = aiRouterService.getRequestLogs();
    const cacheStats = await cacheService.getStats();

    return NextResponse.json({
      success: true,
      stats,
      cache: cacheStats,
      logs: requestLogs
    }, { headers: CORS_HEADERS });

  } catch (error: any) {
    console.error("Error in AI Router Health endpoint:", error);
    return NextResponse.json({
      success: false,
      error: error.message || String(error)
    }, { status: 500, headers: CORS_HEADERS });
  }
}
