import { NextRequest, NextResponse } from "next/server";
import { aiRouterService } from "@/lib/aiRouter";
import { cacheService } from "@/lib/cacheService";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { getCorsHeaders, handleOptionsRequest, isOriginAllowed } from "@/features/ai-security/access/aiSecurityHeaders";

export interface AiRouterHealthResponseDTO {
  success: boolean;
  stats: {
    totalRequests: number;
    failures: number;
    cacheHits: number;
    knowledgeHits: number;
    averageLatencyMs: number;
    activeProvider: string;
    providerHealth: Record<string, string>;
  };
  cache: {
    type: string;
    size: number;
  };
  logs: {
    timestamp: string;
    provider: string;
    model: string;
    latencyMs: number;
    status: "Success" | "Failed";
    cacheHit: boolean;
    knowledgeHit: boolean;
  }[];
  metricScope: {
    type: "instance";
    resettable: boolean;
  };
}

const ALLOWED_METHODS = "GET, OPTIONS";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return handleOptionsRequest(origin, ALLOWED_METHODS);
}

export async function GET(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (origin && !isOriginAllowed(origin)) {
      return new NextResponse(JSON.stringify({ success: false, error: "Access denied." }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Vary": "Origin"
        }
      });
    }

    const corsHeaders = getCorsHeaders(origin, ALLOWED_METHODS);

    const auth = await authorizeRequest(request, "OBSERVABILITY_VIEW", "AI_ROUTER_HEALTH_API_GET");
    if (!auth.authorized) {
      return new NextResponse(auth.response.body, {
        status: auth.response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    }

    // Dynamically update Ollama and other health check statuses before returning
    await aiRouterService.updateProviderHealth();

    const stats = aiRouterService.getStats();
    const rawLogs = aiRouterService.getRequestLogs();
    const cacheStats = await cacheService.getStats();

    // DTO mapping to remove query, category, tokens, correlationId, failure details
    const sanitizedLogs = rawLogs.map(log => ({
      timestamp: log.timestamp || new Date().toISOString(),
      provider: log.provider,
      model: log.model,
      latencyMs: log.latencyMs,
      status: log.status,
      cacheHit: log.cacheHit,
      knowledgeHit: log.knowledgeHit
    }));

    const dto: AiRouterHealthResponseDTO = {
      success: true,
      stats: {
        totalRequests: stats.totalRequests,
        failures: stats.failures,
        cacheHits: stats.cacheHits,
        knowledgeHits: stats.knowledgeHits,
        averageLatencyMs: stats.averageLatencyMs,
        activeProvider: stats.activeProvider,
        providerHealth: stats.providerHealth
      },
      cache: {
        type: cacheStats.type || "memory",
        size: cacheStats.size || 0
      },
      logs: sanitizedLogs,
      metricScope: {
        type: "instance",
        resettable: true
      }
    };

    return NextResponse.json(dto, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    });
  } catch (error: any) {
    console.error("Error in AI Router Health endpoint: Internal Server Error");
    const origin = request.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin, ALLOWED_METHODS);
    return NextResponse.json({
      success: false,
      error: "An unexpected error occurred."
    }, {
      status: 500,
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    });
  }
}
