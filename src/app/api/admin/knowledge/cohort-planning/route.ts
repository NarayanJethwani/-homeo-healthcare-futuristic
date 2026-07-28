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
import { recordKEP3CohortProposalSchema } from "@/features/knowledge/planning/kep3CohortPlanningSchemas";
import {
  getKEP3CohortPlanningWorkspace,
  recordKEP3CohortProposal,
} from "@/features/knowledge/planning/kep3CohortPlanningService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 128 * 1024;
const planningRepository = new FirestoreKEP3CohortPlanningRepository();
const prerequisiteRepositories = {
  decisions: new FirestoreKEP1DecisionRepository(),
  evaluations: new FirestoreKEP1EvaluationRepository(),
  drafts: new FirestoreKEP1DraftingRepository(),
  reviews: new FirestoreKEP1ReviewRepository(),
  onboarding: new FirestoreKEP1PrivateOnboardingRepository(),
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
    "KEP3_COHORT_PLANNING"
  );
}

function statusFor(code: string): number {
  if (code === "KEP3_PLANNING_PAYLOAD_TOO_LARGE") return 413;
  if (code === "KEP3_PLANNING_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code.includes("CONFLICT") ||
    code.includes("MISMATCH") ||
    code.includes("SEPARATION")
  ) {
    return 409;
  }
  if (code.startsWith("KEP3_PLANNING_")) return 400;
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
      workspace: await getKEP3CohortPlanningWorkspace(
        planningRepository,
        prerequisiteRepositories,
        new Date().toISOString()
      ),
    });
  } catch {
    return response(
      { ok: false, error: { code: "KEP3_PLANNING_WORKSPACE_READ_FAILED" } },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "KEP3_PLANNING_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("KEP3_PLANNING_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("KEP3_PLANNING_MALFORMED_JSON");
    }
    const input = recordKEP3CohortProposalSchema.parse(parsed);
    const now = new Date().toISOString();
    const proposal = await recordKEP3CohortProposal(
      planningRepository,
      prerequisiteRepositories,
      input,
      { actorId: auth.session.uid },
      now
    );
    try {
      await logSecurityEvent({
        userId: auth.session.uid,
        userEmail: auth.session.email,
        userRole: auth.session.role,
        action: "knowledge_record_kep3_cohort_planning_proposal",
        resource: "KEP3_COHORT_PLANNING",
        status: "success",
        timestamp: now,
        details: {
          proposalId: proposal.proposalId,
          selectedEntityCount: proposal.selections.length,
          kep1DecisionId: proposal.kep1DecisionId,
          inventorySha256: proposal.inventorySha256,
        },
      });
    } catch {
      console.error(
        "KEP-3 planning security-log mirror failed after durable governance audit."
      );
    }
    return response({
      ok: true,
      result: {
        proposalId: proposal.proposalId,
        selectedEntityCount: proposal.selections.length,
      },
    });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "KEP3_PLANNING_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "KEP3_PLANNING_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "KEP3_PLANNING_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
