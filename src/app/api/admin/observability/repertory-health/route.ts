import { NextRequest, NextResponse } from "next/server";
import { PublishedCorpusRepository } from "@/features/repertory/repositories/PublishedCorpusRepository";
import { getRuntimeEnvironment } from "@/features/repertory/config/runtimeEnv";
import { authorizeRequest } from "@/lib/security/apiAuth";
import {
  consumeRepertoryRateLimit,
  rateLimitResponse,
} from "@/features/repertory/security/RepertoryApiSecurity";
import { buildRepertoryHealthReport } from "@/features/repertory/observability/RepertoryHealthService";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  try {
    const auth = await authorizeRequest(request, "OBSERVABILITY_VIEW", "REPERTORY_HEALTH_API_GET");
    if (!auth.authorized) return auth.response;

    const rateLimit = consumeRepertoryRateLimit("health", auth.session.uid, {
      maxRequests: 12,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

    const environment = getRuntimeEnvironment();
    const activeVersion = await PublishedCorpusRepository.getActiveVersion();
    const manifest = await PublishedCorpusRepository.getManifest();
    const sampleIndex = await PublishedCorpusRepository.loadLexicalShard("fever");
    const report = buildRepertoryHealthReport({
      storageAdapter: environment.artifactStoreAdapter,
      activeVersion,
      manifest,
      sampleIndex,
    });

    return NextResponse.json(
      {
        ...report,
        durationMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      },
      {
        status: report.success ? 200 : 503,
        headers: { "Cache-Control": "private, no-store" },
      }
    );
  } catch (error) {
    console.error("[Repertory Health API] Health check failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      {
        success: false,
        status: "unavailable",
        checks: {
          manifestHealthy: false,
          sampleIndexReadable: false,
        },
        durationMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
