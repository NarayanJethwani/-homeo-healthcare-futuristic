import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { hasPermission } from "@/lib/security/rbac";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { FirestoreFastTrackDecisionRepository } from "@/features/knowledge/governance/fastTrackDecisionFirestoreRepository";
import { FirestoreControlledReleaseRepository } from "@/features/knowledge/governance/controlledReleaseFirestoreRepository";
import { controlledReleaseActionSchema } from "@/features/knowledge/governance/controlledReleaseSchemas";
import {
  getControlledReleaseWorkspace,
  recordControlledReleaseAction,
} from "@/features/knowledge/governance/controlledReleaseService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const decisionRepository = new FirestoreFastTrackDecisionRepository();
const releaseRepository = new FirestoreControlledReleaseRepository();

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
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: headers(),
  });
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
  if (code === "CONTROLLED_RELEASE_PAYLOAD_TOO_LARGE") return 413;
  if (code === "CONTROLLED_RELEASE_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code === "CONTROLLED_RELEASE_FORBIDDEN" ||
    code === "CONTROLLED_RELEASE_CHANNEL_FORBIDDEN"
  ) {
    return 403;
  }
  if (code === "CONTROLLED_RELEASE_ENTITY_NOT_FOUND") return 404;
  if (
    code.includes("CONFLICT") ||
    code.includes("IMMUTABLE") ||
    code.includes("STALE") ||
    code.includes("HASH_MISMATCH")
  ) {
    return 409;
  }
  if (code.startsWith("CONTROLLED_RELEASE_")) return 400;
  return 500;
}

async function authorize(request: NextRequest) {
  return authorizeRequest(
    request,
    "knowledge.publish",
    "KNOWLEDGE_CONTROLLED_RELEASE"
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
      workspace: await getControlledReleaseWorkspace(
        entities,
        decisionRepository,
        releaseRepository
      ),
    });
  } catch {
    return response(
      {
        ok: false,
        error: { code: "CONTROLLED_RELEASE_WORKSPACE_READ_FAILED" },
      },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "CONTROLLED_RELEASE_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("CONTROLLED_RELEASE_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("CONTROLLED_RELEASE_MALFORMED_JSON");
    }
    const input = controlledReleaseActionSchema.parse(parsed);
    const entities = await globalKmsRepository.getEntities();
    const now = new Date().toISOString();
    const release = await recordControlledReleaseAction(
      entities,
      decisionRepository,
      releaseRepository,
      input,
      {
        actorId: auth.session.uid,
        actorName: auth.session.name,
        actorRole: auth.session.role,
        canAuthorizePublication: hasPermission(
          auth.session.role,
          "knowledge.publish"
        ),
        canAuthorizeRag: hasPermission(
          auth.session.role,
          "RAG_INDEX_MANAGE"
        ),
        canBypassSafetyWithdrawal: hasPermission(
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
        action: `knowledge_controlled_release_${release.outcome}`,
        resource: "KNOWLEDGE_CONTROLLED_RELEASE",
        status: "success",
        timestamp: now,
        details: {
          releaseId: release.releaseId,
          entityId: release.entityId,
          entityRevisionSha256: release.entityRevisionSha256,
          publicationReleaseAuthorized:
            release.publicationReleaseAuthorized,
          ragReleaseAuthorized: release.ragReleaseAuthorized,
          executionApplied: false,
        },
      });
    } catch {
      console.error(
        "Controlled-release security-log mirror failed after durable audit."
      );
    }

    return response({ ok: true, result: { release } });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "CONTROLLED_RELEASE_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "CONTROLLED_RELEASE_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "CONTROLLED_RELEASE_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
