import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { FirestoreKEP1AcquisitionRepository } from "@/features/knowledge/acquisition/kep1AcquisitionFirestoreRepository";
import { FirestoreKEP1AcquisitionJobRepository } from "@/features/knowledge/acquisition/kep1AcquisitionJobFirestoreRepository";
import { FirestoreKEP1PrivateOnboardingRepository } from "@/features/knowledge/onboarding/privateOnboardingFirestoreRepository";
import { FirestoreKEP1DraftingRepository } from "@/features/knowledge/drafting/kep1DraftingFirestoreRepository";
import { createKEP1DraftRevisionSchema } from "@/features/knowledge/drafting/kep1DraftingSchemas";
import {
  createKEP1DraftRevision,
  getKEP1DraftingWorkspace,
} from "@/features/knowledge/drafting/kep1DraftingService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 256 * 1024;
const draftingRepository = new FirestoreKEP1DraftingRepository();
const acquisitionRepository = new FirestoreKEP1AcquisitionRepository();
const jobRepository = new FirestoreKEP1AcquisitionJobRepository();
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
    "KEP1_PRIVATE_DRAFTING"
  );
}

function statusFor(code: string): number {
  if (code === "DRAFT_PAYLOAD_TOO_LARGE") return 413;
  if (code === "DRAFT_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code.includes("CONFLICT") ||
    code.includes("ALREADY_EXISTS") ||
    code.includes("RIGHTS_DRIFT")
  ) {
    return 409;
  }
  if (code.startsWith("DRAFT_")) return 400;
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
      workspace: await getKEP1DraftingWorkspace(
        draftingRepository,
        acquisitionRepository,
        jobRepository
      ),
    });
  } catch {
    return response(
      { ok: false, error: { code: "DRAFT_WORKSPACE_READ_FAILED" } },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response({ ok: false, error: { code: "DRAFT_CSRF_REJECTED" } }, 403);
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("DRAFT_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("DRAFT_MALFORMED_JSON");
    }
    const input = createKEP1DraftRevisionSchema.parse(parsed);
    const now = new Date().toISOString();
    const revision = await createKEP1DraftRevision(
      draftingRepository,
      acquisitionRepository,
      jobRepository,
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
        action: "knowledge_create_kep1_draft_revision",
        resource: "KEP1_PRIVATE_DRAFTING",
        status: "success",
        timestamp: now,
        details: {
          revisionId: revision.revisionId,
          entityId: revision.entityId,
          contentSha256: revision.contentSha256,
        },
      });
    } catch {
      console.error(
        "KEP-1 drafting security-log mirror failed after durable governance audit."
      );
    }
    return response({
      ok: true,
      result: {
        revisionId: revision.revisionId,
        contentSha256: revision.contentSha256,
      },
    });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "DRAFT_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "DRAFT_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "DRAFT_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
