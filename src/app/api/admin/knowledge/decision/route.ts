import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { FirestoreKEP1DraftingRepository } from "@/features/knowledge/drafting/kep1DraftingFirestoreRepository";
import { FirestoreKEP1ReviewRepository } from "@/features/knowledge/review/kep1ReviewFirestoreRepository";
import { FirestoreKEP1EvaluationRepository } from "@/features/knowledge/evaluation/kep1EvaluationFirestoreRepository";
import { FirestoreKEP1PrivateOnboardingRepository } from "@/features/knowledge/onboarding/privateOnboardingFirestoreRepository";
import { FirestoreKEP1DecisionRepository } from "@/features/knowledge/decision/kep1DecisionFirestoreRepository";
import { recordKEP1GoNoGoDecisionSchema } from "@/features/knowledge/decision/kep1DecisionSchemas";
import {
  getKEP1DecisionWorkspace,
  recordKEP1GoNoGoDecision,
} from "@/features/knowledge/decision/kep1DecisionService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;
const decisionRepository = new FirestoreKEP1DecisionRepository();
const evaluationRepository = new FirestoreKEP1EvaluationRepository();
const draftingRepository = new FirestoreKEP1DraftingRepository();
const reviewRepository = new FirestoreKEP1ReviewRepository();
const onboardingRepository = new FirestoreKEP1PrivateOnboardingRepository();

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
    "KEP1_GO_NO_GO_DECISION"
  );
}

function statusFor(code: string): number {
  if (code === "GO_NO_GO_PAYLOAD_TOO_LARGE") return 413;
  if (code === "GO_NO_GO_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code.includes("CONFLICT") ||
    code.includes("HASH_MISMATCH") ||
    code.includes("SEPARATION")
  ) {
    return 409;
  }
  if (code.startsWith("GO_NO_GO_")) return 400;
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
      workspace: await getKEP1DecisionWorkspace(
        decisionRepository,
        evaluationRepository,
        draftingRepository,
        reviewRepository,
        onboardingRepository
      ),
    });
  } catch {
    return response(
      { ok: false, error: { code: "GO_NO_GO_WORKSPACE_READ_FAILED" } },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "GO_NO_GO_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("GO_NO_GO_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("GO_NO_GO_MALFORMED_JSON");
    }
    const input = recordKEP1GoNoGoDecisionSchema.parse(parsed);
    const now = new Date().toISOString();
    const decision = await recordKEP1GoNoGoDecision(
      decisionRepository,
      evaluationRepository,
      draftingRepository,
      reviewRepository,
      onboardingRepository,
      input,
      { actorId: auth.session.uid },
      now
    );
    try {
      await logSecurityEvent({
        userId: auth.session.uid,
        userEmail: auth.session.email,
        userRole: auth.session.role,
        action: `knowledge_record_kep1_${decision.decision}`,
        resource: "KEP1_GO_NO_GO_DECISION",
        status: "success",
        timestamp: now,
        details: {
          decisionId: decision.decisionId,
          decision: decision.decision,
          evaluationId: decision.evaluationId,
          corpusManifestSha256: decision.corpusManifestSha256,
          programOwnerRecordId: decision.programOwnerRecordId,
        },
      });
    } catch {
      console.error(
        "KEP-1 decision security-log mirror failed after durable governance audit."
      );
    }
    return response({
      ok: true,
      result: {
        decisionId: decision.decisionId,
        decision: decision.decision,
      },
    });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "GO_NO_GO_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "GO_NO_GO_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "GO_NO_GO_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
