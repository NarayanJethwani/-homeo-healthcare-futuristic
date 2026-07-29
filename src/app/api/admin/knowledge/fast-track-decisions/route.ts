import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { hasPermission } from "@/lib/security/rbac";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { FirestoreFastTrackDecisionRepository } from "@/features/knowledge/governance/fastTrackDecisionFirestoreRepository";
import { recordFastTrackDecisionSchema } from "@/features/knowledge/governance/fastTrackDecisionSchemas";
import {
  getFastTrackDecisionWorkspace,
  recordFastTrackDecision,
} from "@/features/knowledge/governance/fastTrackDecisionService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const decisionRepository = new FirestoreFastTrackDecisionRepository();

function headers(): Record<string, string> {
  return {
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

function response(body: unknown, status = 200) {
  return new NextResponse(JSON.stringify(body), { status, headers: headers() });
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function statusFor(code: string): number {
  if (code === "FAST_TRACK_PAYLOAD_TOO_LARGE") return 413;
  if (code === "FAST_TRACK_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (code === "FAST_TRACK_SAFETY_RESOLUTION_FORBIDDEN") return 403;
  if (code === "FAST_TRACK_ENTITY_NOT_FOUND") return 404;
  if (
    code.includes("CONFLICT") ||
    code.includes("IMMUTABLE") ||
    code.includes("HASH_MISMATCH")
  ) {
    return 409;
  }
  if (code.startsWith("FAST_TRACK_")) return 400;
  return 500;
}

async function authorize(request: NextRequest) {
  return authorizeRequest(
    request,
    "knowledge.approve",
    "KNOWLEDGE_FAST_TRACK_DECISION"
  );
}

export async function OPTIONS(request: NextRequest) {
  if (!sameOrigin(request)) return response({ ok: false }, 403);
  return new NextResponse(null, { status: 204, headers: headers() });
}

export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;
  try {
    const entities = await globalKmsRepository.getEntities();
    return response({
      ok: true,
      workspace: await getFastTrackDecisionWorkspace(
        entities,
        decisionRepository
      ),
    });
  } catch {
    return response(
      { ok: false, error: { code: "FAST_TRACK_WORKSPACE_READ_FAILED" } },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "FAST_TRACK_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("FAST_TRACK_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("FAST_TRACK_MALFORMED_JSON");
    }
    const input = recordFastTrackDecisionSchema.parse(parsed);
    const entity = await globalKmsRepository.getEntity(input.entityId);
    if (!entity) throw new Error("FAST_TRACK_ENTITY_NOT_FOUND");

    const now = new Date().toISOString();
    const decision = await recordFastTrackDecision(
      decisionRepository,
      entity,
      input,
      {
        actorId: auth.session.uid,
        actorName: auth.session.name,
        actorRole: auth.session.role,
        canResolveSafetyWithdrawal: hasPermission(
          auth.session.role,
          "knowledge.bypassReview"
        ),
      },
      now
    );

    try {
      await logSecurityEvent({
        userId: auth.session.uid,
        userEmail: auth.session.email,
        userRole: auth.session.role,
        action: `knowledge_fast_track_${decision.outcome}`,
        resource: "KNOWLEDGE_FAST_TRACK_DECISION",
        status: "success",
        timestamp: now,
        details: {
          decisionId: decision.decisionId,
          entityId: decision.entityId,
          entityRevisionSha256: decision.entityRevisionSha256,
          publicationAuthorityGranted: false,
          ragAuthorityGranted: false,
        },
      });
    } catch {
      console.error(
        "Fast-track security-log mirror failed after durable governance audit."
      );
    }

    return response({ ok: true, result: { decision } });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "FAST_TRACK_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "FAST_TRACK_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "FAST_TRACK_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
