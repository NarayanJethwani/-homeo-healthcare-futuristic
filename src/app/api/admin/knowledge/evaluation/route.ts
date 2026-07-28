import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { FirestoreKEP1DraftingRepository } from "@/features/knowledge/drafting/kep1DraftingFirestoreRepository";
import { FirestoreKEP1ReviewRepository } from "@/features/knowledge/review/kep1ReviewFirestoreRepository";
import { FirestoreKEP1EvaluationRepository } from "@/features/knowledge/evaluation/kep1EvaluationFirestoreRepository";
import { submitKEP1OfflineEvaluationSchema } from "@/features/knowledge/evaluation/kep1EvaluationSchemas";
import {
  getKEP1EvaluationWorkspace,
  recordKEP1OfflineEvaluation,
} from "@/features/knowledge/evaluation/kep1EvaluationService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 512 * 1024;
const evaluationRepository = new FirestoreKEP1EvaluationRepository();
const draftingRepository = new FirestoreKEP1DraftingRepository();
const reviewRepository = new FirestoreKEP1ReviewRepository();

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

async function authorize(request: NextRequest) {
  return authorizeRequest(
    request,
    "knowledge.expansion.manage",
    "KEP1_OFFLINE_EVALUATION"
  );
}

function statusFor(code: string): number {
  if (code === "EVALUATION_PAYLOAD_TOO_LARGE") return 413;
  if (code === "EVALUATION_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code.includes("CONFLICT") ||
    code.includes("NOT_CURRENT") ||
    code.includes("HASH_MISMATCH")
  ) {
    return 409;
  }
  if (code.startsWith("EVALUATION_")) return 400;
  return 500;
}

export async function OPTIONS(request: NextRequest) {
  if (!sameOrigin(request)) return response({ ok: false }, 403);
  return new NextResponse(null, { status: 204, headers: headers() });
}

export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;
  try {
    return response({
      ok: true,
      workspace: await getKEP1EvaluationWorkspace(
        evaluationRepository,
        draftingRepository,
        reviewRepository
      ),
    });
  } catch {
    return response(
      { ok: false, error: { code: "EVALUATION_WORKSPACE_READ_FAILED" } },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "EVALUATION_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("EVALUATION_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("EVALUATION_MALFORMED_JSON");
    }
    const input = submitKEP1OfflineEvaluationSchema.parse(parsed);
    const now = new Date().toISOString();
    const evaluation = await recordKEP1OfflineEvaluation(
      evaluationRepository,
      draftingRepository,
      reviewRepository,
      input,
      { actorId: auth.session.uid },
      now
    );
    try {
      await logSecurityEvent({
        userId: auth.session.uid,
        userEmail: auth.session.email,
        userRole: auth.session.role,
        action: "knowledge_record_kep1_offline_evaluation",
        resource: "KEP1_OFFLINE_EVALUATION",
        status: "success",
        timestamp: now,
        details: {
          evaluationId: evaluation.evaluationId,
          evaluationStatus: evaluation.status,
          corpusManifestSha256: evaluation.corpusManifestSha256,
          querySetSha256: evaluation.querySetSha256,
        },
      });
    } catch {
      console.error(
        "KEP-1 evaluation security-log mirror failed after durable governance audit."
      );
    }
    return response({
      ok: true,
      result: {
        evaluationId: evaluation.evaluationId,
        status: evaluation.status,
        metrics: evaluation.metrics,
      },
    });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "EVALUATION_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "EVALUATION_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "EVALUATION_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
