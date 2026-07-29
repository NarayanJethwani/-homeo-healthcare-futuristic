import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { hasPermission } from "@/lib/security/rbac";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { globalKmsRepository } from "@/features/knowledge-admin/repositories/MemoryRepository";
import { FirestoreControlledReleaseRepository } from "@/features/knowledge/governance/controlledReleaseFirestoreRepository";
import { FirestoreControlledReleaseExecutionRepository } from "@/features/knowledge/governance/controlledReleaseExecutionFirestoreRepository";
import { controlledReleaseExecutionActionSchema } from "@/features/knowledge/governance/controlledReleaseExecutionSchemas";
import {
  getControlledReleaseExecutionWorkspace,
  recordControlledReleaseExecution,
} from "@/features/knowledge/governance/controlledReleaseExecutionService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const releaseRepository = new FirestoreControlledReleaseRepository();
const executionRepository =
  new FirestoreControlledReleaseExecutionRepository();

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
  if (code === "CONTROLLED_EXECUTION_PAYLOAD_TOO_LARGE") return 413;
  if (code === "CONTROLLED_EXECUTION_UNSUPPORTED_CONTENT_TYPE") {
    return 415;
  }
  if (code === "CONTROLLED_EXECUTION_FORBIDDEN") return 403;
  if (code === "CONTROLLED_EXECUTION_ENTITY_NOT_FOUND") return 404;
  if (
    code.includes("CONFLICT") ||
    code.includes("IMMUTABLE") ||
    code.includes("STALE") ||
    code.includes("HASH_MISMATCH")
  ) {
    return 409;
  }
  if (code.startsWith("CONTROLLED_EXECUTION_")) return 400;
  return 500;
}

async function authorize(request: NextRequest) {
  return authorizeRequest(
    request,
    "knowledge.publish",
    "KNOWLEDGE_CONTROLLED_RELEASE_EXECUTION"
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
      workspace: await getControlledReleaseExecutionWorkspace(
        entities,
        releaseRepository,
        executionRepository
      ),
    });
  } catch {
    return response(
      {
        ok: false,
        error: { code: "CONTROLLED_EXECUTION_WORKSPACE_READ_FAILED" },
      },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      {
        ok: false,
        error: { code: "CONTROLLED_EXECUTION_CSRF_REJECTED" },
      },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error(
        "CONTROLLED_EXECUTION_UNSUPPORTED_CONTENT_TYPE"
      );
    }
    const raw = await readAndBoundRequestBody(
      request,
      MAX_BODY_BYTES
    );
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("CONTROLLED_EXECUTION_MALFORMED_JSON");
    }
    const input =
      controlledReleaseExecutionActionSchema.parse(parsed);
    const entities = await globalKmsRepository.getEntities();
    const now = new Date().toISOString();
    const execution = await recordControlledReleaseExecution(
      entities,
      releaseRepository,
      executionRepository,
      input,
      {
        actorId: auth.session.uid,
        actorName: auth.session.name,
        actorRole: auth.session.role,
        canExecutePublication: hasPermission(
          auth.session.role,
          "knowledge.publish"
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
        action: `knowledge_controlled_execution_${execution.outcome}`,
        resource: "KNOWLEDGE_CONTROLLED_RELEASE_EXECUTION",
        status: "success",
        timestamp: now,
        details: {
          executionId: execution.executionId,
          releaseId: execution.releaseId,
          entityId: execution.entityId,
          entityRevisionSha256:
            execution.entityRevisionSha256,
          publicationApplied: execution.publicationApplied,
          ragApplied: false,
        },
      });
    } catch {
      console.error(
        "Controlled-execution security-log mirror failed after durable audit."
      );
    }

    return response({ ok: true, result: { execution } });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "CONTROLLED_EXECUTION_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "CONTROLLED_EXECUTION_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "CONTROLLED_EXECUTION_BODY_READ_FAILED"
          : rawCode;
    return response(
      { ok: false, error: { code } },
      statusFor(code)
    );
  }
}
