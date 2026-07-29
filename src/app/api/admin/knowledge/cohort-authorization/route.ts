import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { FirestoreKEP1DraftingRepository } from "@/features/knowledge/drafting/kep1DraftingFirestoreRepository";
import { FirestoreKEP1ReviewRepository } from "@/features/knowledge/review/kep1ReviewFirestoreRepository";
import { FirestoreKEP1EvaluationRepository } from "@/features/knowledge/evaluation/kep1EvaluationFirestoreRepository";
import { FirestoreKEP1PrivateOnboardingRepository } from "@/features/knowledge/onboarding/privateOnboardingFirestoreRepository";
import { FirestoreKEP1DecisionRepository } from "@/features/knowledge/decision/kep1DecisionFirestoreRepository";
import { FirestoreKEP3CohortPlanningRepository } from "@/features/knowledge/planning/kep3CohortPlanningFirestoreRepository";
import { FirestoreKEP3CohortAuthorizationRepository } from "@/features/knowledge/authorization/kep3CohortAuthorizationFirestoreRepository";
import { recordKEP3CohortAuthorizationSchema } from "@/features/knowledge/authorization/kep3CohortAuthorizationSchemas";
import {
  getKEP3CohortAuthorizationWorkspace,
  recordKEP3CohortAuthorization,
} from "@/features/knowledge/authorization/kep3CohortAuthorizationService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;
const authorizationRepository =
  new FirestoreKEP3CohortAuthorizationRepository();
const planningRepository = new FirestoreKEP3CohortPlanningRepository();
const onboardingRepository =
  new FirestoreKEP1PrivateOnboardingRepository();
const prerequisiteRepositories = {
  decisions: new FirestoreKEP1DecisionRepository(),
  evaluations: new FirestoreKEP1EvaluationRepository(),
  drafts: new FirestoreKEP1DraftingRepository(),
  reviews: new FirestoreKEP1ReviewRepository(),
  onboarding: onboardingRepository,
};

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
    "KEP3_COHORT_AUTHORIZATION"
  );
}

function statusFor(code: string): number {
  if (code === "KEP3_AUTHORIZATION_PAYLOAD_TOO_LARGE") return 413;
  if (code === "KEP3_AUTHORIZATION_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code.includes("CONFLICT") ||
    code.includes("MISMATCH") ||
    code.includes("SEPARATION") ||
    code.includes("LATEST")
  ) {
    return 409;
  }
  if (code.startsWith("KEP3_AUTHORIZATION_")) return 400;
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
      workspace: await getKEP3CohortAuthorizationWorkspace(
        authorizationRepository,
        planningRepository,
        prerequisiteRepositories,
        onboardingRepository,
        new Date().toISOString()
      ),
    });
  } catch {
    return response(
      {
        ok: false,
        error: { code: "KEP3_AUTHORIZATION_WORKSPACE_READ_FAILED" },
      },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "KEP3_AUTHORIZATION_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("KEP3_AUTHORIZATION_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("KEP3_AUTHORIZATION_MALFORMED_JSON");
    }
    const input = recordKEP3CohortAuthorizationSchema.parse(parsed);
    const now = new Date().toISOString();
    const authorization = await recordKEP3CohortAuthorization(
      authorizationRepository,
      planningRepository,
      prerequisiteRepositories,
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
        action: `knowledge_record_kep3_cohort_${authorization.decision}`,
        resource: "KEP3_COHORT_AUTHORIZATION",
        status: "success",
        timestamp: now,
        details: {
          authorizationId: authorization.authorizationId,
          decision: authorization.decision,
          proposalId: authorization.proposalId,
          proposalSha256: authorization.proposalSha256,
          selectedEntityCount: authorization.selectedEntityIds.length,
        },
      });
    } catch {
      console.error(
        "KEP-3 authorization security-log mirror failed after durable governance audit."
      );
    }
    return response({
      ok: true,
      result: {
        authorizationId: authorization.authorizationId,
        decision: authorization.decision,
      },
    });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "KEP3_AUTHORIZATION_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "KEP3_AUTHORIZATION_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "KEP3_AUTHORIZATION_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
