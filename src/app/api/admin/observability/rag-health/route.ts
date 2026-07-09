import { NextResponse } from "next/server";
import { globalVectorStore } from "@/features/knowledge/retrieval/vectorStore";
import { 
  getQueueJobs, 
  processQueue, 
  retryFailedJobs, 
  queueEmbeddingJob 
} from "@/features/knowledge/retrieval/embeddingQueue";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
    const stats = await globalVectorStore.getIndexStats();
    const queue = await getQueueJobs();
    const stale = await globalVectorStore.listStaleVectors();

    return NextResponse.json({
      success: true,
      stats,
      queue,
      stale
    }, { headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("[RAG Health API] GET Failure:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Internal Server Error"
    }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "processQueue") {
      await processQueue();
      return NextResponse.json({ success: true, message: "Queue processing completed." }, { headers: CORS_HEADERS });
    }

    if (action === "retryFailedJobs") {
      await retryFailedJobs();
      return NextResponse.json({ success: true, message: "Retrying failed jobs started." }, { headers: CORS_HEADERS });
    }

    if (action === "reindexStale") {
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
      // Process immediately
      await processQueue();
      return NextResponse.json({ success: true, message: "Stale vector reindexing completed." }, { headers: CORS_HEADERS });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400, headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("[RAG Health API] POST Failure:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Internal Server Error"
    }, { status: 500, headers: CORS_HEADERS });
  }
}
