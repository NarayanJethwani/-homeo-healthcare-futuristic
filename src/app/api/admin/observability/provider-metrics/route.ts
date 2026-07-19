import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { providerTelemetryService } from "@/features/ai/services/providerTelemetry";
import { isOriginAllowed, getCorsHeaders, handleOptionsRequest } from "@/features/ai-security/access/aiSecurityHeaders";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { z } from "zod";

export const dynamic = "force-dynamic";

const allowedMethods = "GET, POST, OPTIONS";

// OPTIONS handler
export const OPTIONS = async (request: NextRequest) => {
  const origin = request.headers.get("origin");
  return handleOptionsRequest(origin, allowedMethods);
};

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const isAllowed = isOriginAllowed(origin);

  const headers = getCorsHeaders(origin, allowedMethods);
  headers["Cache-Control"] = "no-store";
  headers["Content-Type"] = "application/json";

  // Check CORS Allowed
  if (origin && !isAllowed) {
    return new NextResponse(
      JSON.stringify({ error: "Access denied." }),
      { status: 403, headers }
    );
  }

  try {
    const auth = await authorizeRequest(request, "OBSERVABILITY_VIEW", "PROVIDER_METRICS_GET");
    if (!auth.authorized) {
      const response = auth.response;
      Object.entries(headers).forEach(([k, v]) => {
        response.headers.set(k, v);
      });
      return response;
    }

    const metricsDto = providerTelemetryService.getMetricsDTO();
    return new NextResponse(
      JSON.stringify(metricsDto),
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error("Provider Metrics Route GET Error: telemetry database read failure.");
    return new NextResponse(
      JSON.stringify({ error: "Failed to retrieve provider metrics telemetry safely." }),
      { status: 500, headers }
    );
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || "";
  const isAllowed = isOriginAllowed(origin);

  const headers = getCorsHeaders(origin, allowedMethods);
  headers["Cache-Control"] = "no-store";
  headers["Content-Type"] = "application/json";

  // Check CORS Allowed
  if (origin && !isAllowed) {
    return new NextResponse(
      JSON.stringify({ error: "Access denied." }),
      { status: 403, headers }
    );
  }

  try {
    // Same-Origin CSRF Check
    if (!origin) {
      return new NextResponse(
        JSON.stringify({ error: "CSRF check failed: Origin header is required." }),
        { status: 403, headers }
      );
    }

    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return new NextResponse(
          JSON.stringify({ error: "CSRF verification failed." }),
          { status: 403, headers }
        );
      }
    } catch {
      return new NextResponse(
        JSON.stringify({ error: "CSRF verification failed." }),
        { status: 403, headers }
      );
    }

    // Verify Content-Type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new NextResponse(
        JSON.stringify({ error: "Unsupported content type." }),
        { status: 415, headers }
      );
    }

    // Auth requirement: RAG_INDEX_MANAGE
    const auth = await authorizeRequest(request, "RAG_INDEX_MANAGE", "PROVIDER_METRICS_POST");
    if (!auth.authorized) {
      const response = auth.response;
      Object.entries(headers).forEach(([k, v]) => {
        response.headers.set(k, v);
      });
      return response;
    }

    // Stream-level body size limit: 100 bytes
    let rawBody = "";
    const reader = request.body?.getReader();
    if (reader) {
      let receivedLength = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          receivedLength += value.length;
          if (receivedLength > 100) {
            await reader.cancel();
            return new NextResponse(
              JSON.stringify({ error: "Payload size limit exceeded." }),
              { status: 413, headers }
            );
          }
          rawBody += new TextDecoder().decode(value);
        }
      }
    } else {
      rawBody = await request.text();
      if (Buffer.byteLength(rawBody, "utf8") > 100) {
        return new NextResponse(
          JSON.stringify({ error: "Payload size limit exceeded." }),
          { status: 413, headers }
        );
      }
    }

    // Parse and validate JSON payload
    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return new NextResponse(
        JSON.stringify({ error: "Malformed JSON payload." }),
        { status: 400, headers }
      );
    }

    const resetSchema = z.object({
      action: z.literal("reset")
    }).strict();

    const parseResult = resetSchema.safeParse(body);
    if (!parseResult.success) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid input schema." }),
        { status: 400, headers }
      );
    }

    // Log audit event directly
    try {
      await logSecurityEvent({
        userId: auth.session.uid || "sanitized",
        userEmail: auth.session.email || "sanitized@homeo.healthcare",
        userRole: auth.session.role || "sanitized",
        action: "provider_metrics_reset",
        resource: "/api/admin/observability/provider-metrics",
        status: "success",
        timestamp: new Date().toISOString(),
        details: {}
      });
    } catch (err: any) {
      console.error("Audit log writing failed during reset: security logger database connection failed.");
    }

    // Execute reset
    providerTelemetryService.reset();

    return new NextResponse(
      JSON.stringify({ success: true, message: "Provider metrics reset successfully." }),
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error("Provider Metrics Route POST Error: request processing failed.");
    return new NextResponse(
      JSON.stringify({ error: "Failed to process reset request safely." }),
      { status: 500, headers }
    );
  }
}
