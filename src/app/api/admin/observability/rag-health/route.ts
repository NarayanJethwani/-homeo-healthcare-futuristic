import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { globalVectorStore } from "@/features/knowledge/retrieval/vectorStore";
import {
  processQueue,
  retryFailedJobs,
  queueEmbeddingJob,
  getQueueStats
} from "@/features/knowledge/retrieval/embeddingQueue";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { getCorsHeaders, handleOptionsRequest, isOriginAllowed } from "@/features/ai-security/access/aiSecurityHeaders";

export interface RagHealthResponseDTO {
  success: boolean;
  vectorStats: {
    totalVectors: number;
    indexedPublishedArticlesCount: number;
    coveragePercent: number;
    staleCount: number;
    failedCount: number;
  };
  queueStats: {
    totalJobs: number;
    pendingJobs: number;
    failedJobs: number;
  };
}

const ALLOWED_METHODS = "GET, POST, OPTIONS";

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

    let auth = await authorizeRequest(request, "RAG_INDEX_MANAGE", "RAG_HEALTH_API_GET");
    if (!auth.authorized) {
      auth = await authorizeRequest(request, "OBSERVABILITY_VIEW", "RAG_HEALTH_API_GET");
    }
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

    const stats = await globalVectorStore.getIndexStats();
    const queue = await getQueueStats();

    const staleCount = stats.staleCount || 0;
    const failedCount = stats.failedCount || 0;

    const dto: RagHealthResponseDTO = {
      success: true,
      vectorStats: {
        totalVectors: stats.totalVectors || 0,
        indexedPublishedArticlesCount: stats.indexedPublishedArticlesCount || 0,
        coveragePercent: stats.coveragePercent || 0,
        staleCount,
        failedCount
      },
      queueStats: {
        totalJobs: queue.totalJobs,
        pendingJobs: queue.pendingJobs,
        failedJobs: queue.failedJobs
      }
    };

    return NextResponse.json(dto, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    });
  } catch (error: any) {
    console.error("[RAG Health API] GET Failure: Internal Server Error");
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

export async function POST(request: NextRequest) {
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

    const auth = await authorizeRequest(request, "RAG_INDEX_MANAGE", "RAG_HEALTH_API_POST");
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

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON format" }, {
        status: 400,
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store"
        }
      });
    }

    const schema = z.object({
      action: z.enum(["processQueue", "retryFailedJobs", "reindexStale"])
    }).strict();

    const parseResult = schema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ success: false, error: "Invalid action" }, {
        status: 400,
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store"
        }
      });
    }

    const { action } = parseResult.data;

    if (action === "processQueue") {
      await processQueue();
      return NextResponse.json({ success: true, message: "Queue processing completed." }, {
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store"
        }
      });
    }

    if (action === "retryFailedJobs") {
      await retryFailedJobs();
      return NextResponse.json({ success: true, message: "Retrying failed jobs started." }, {
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store"
        }
      });
    }

    if (action === "reindexStale") {
      const stats = await globalVectorStore.getIndexStats();
      if (stats.staleCount > 0) {
        const staleList = await globalVectorStore.listStaleVectors();
        for (const item of staleList) {
          const entity = await globalKmsRepository.getEntity(item.id);
          if (entity) {
            const bodyText = typeof entity.content?.overview === "string"
              ? entity.content.overview
              : typeof entity.content?.description === "string"
                ? entity.content.description
                : "";
            const titleStr = typeof entity.title === "string" ? entity.title : (entity.title.en || "");
            await queueEmbeddingJob(entity.id, titleStr, entity.entityType, bodyText);
          }
        }
        await processQueue();
      }
      return NextResponse.json({ success: true, message: "Stale vector reindexing completed." }, {
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store"
        }
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, {
      status: 400,
      headers: {
        ...corsHeaders,
        "Cache-Control": "no-store"
      }
    });
  } catch (error: any) {
    console.error("[RAG Health API] POST Failure: Internal Server Error");
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
