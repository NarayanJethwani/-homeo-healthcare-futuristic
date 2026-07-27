import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { FirestoreKEP1AcquisitionRepository } from "@/features/knowledge/acquisition/kep1AcquisitionFirestoreRepository";
import { FirestoreKEP1PrivateOnboardingRepository } from "@/features/knowledge/onboarding/privateOnboardingFirestoreRepository";
import { FirestoreKEP1DraftingRepository } from "@/features/knowledge/drafting/kep1DraftingFirestoreRepository";
import { FirestoreKEP1ReviewRepository } from "@/features/knowledge/review/kep1ReviewFirestoreRepository";
import { submitKEP1IndependentReviewSchema } from "@/features/knowledge/review/kep1ReviewSchemas";
import {
  getKEP1ReviewWorkspace,
  submitKEP1IndependentReview,
} from "@/features/knowledge/review/kep1ReviewService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 64 * 1024;
const reviewRepository = new FirestoreKEP1ReviewRepository();
const draftingRepository = new FirestoreKEP1DraftingRepository();
const acquisitionRepository = new FirestoreKEP1AcquisitionRepository();
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
    "KEP1_INDEPENDENT_REVIEW"
  );
}

function statusFor(code: string): number {
  if (code === "REVIEW_PAYLOAD_TOO_LARGE") return 413;
  if (code === "REVIEW_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code.includes("CONFLICT") ||
    code.includes("IMMUTABLE") ||
    code.includes("HASH_MISMATCH") ||
    code.includes("RIGHTS_DRIFT")
  ) {
    return 409;
  }
  if (code.startsWith("REVIEW_")) return 400;
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
      workspace: await getKEP1ReviewWorkspace(
        reviewRepository,
        draftingRepository,
        acquisitionRepository
      ),
    });
  } catch {
    return response(
      { ok: false, error: { code: "REVIEW_WORKSPACE_READ_FAILED" } },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response({ ok: false, error: { code: "REVIEW_CSRF_REJECTED" } }, 403);
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("REVIEW_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("REVIEW_MALFORMED_JSON");
    }
    const input = submitKEP1IndependentReviewSchema.parse(parsed);
    const now = new Date().toISOString();
    const review = await submitKEP1IndependentReview(
      reviewRepository,
      draftingRepository,
      acquisitionRepository,
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
        action: `knowledge_submit_kep1_${review.reviewKind}_review`,
        resource: "KEP1_INDEPENDENT_REVIEW",
        status: "success",
        timestamp: now,
        details: {
          reviewId: review.reviewId,
          revisionId: review.revisionId,
          decision: review.decision,
          reviewedContentSha256: review.reviewedContentSha256,
        },
      });
    } catch {
      console.error(
        "KEP-1 review security-log mirror failed after durable governance audit."
      );
    }
    return response({ ok: true, result: { reviewId: review.reviewId } });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "REVIEW_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "REVIEW_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "REVIEW_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
