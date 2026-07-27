import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import {
  createPrivateOnboardingRecordSchema,
  verifyPrivateOnboardingRecordSchema,
} from "@/features/knowledge/onboarding/privateOnboardingSchemas";
import { FirestoreKEP1PrivateOnboardingRepository } from "@/features/knowledge/onboarding/privateOnboardingFirestoreRepository";
import {
  createIdentityHasher,
  createPrivateOnboardingRecord,
  getPrivateOnboardingWorkspace,
  verifyPrivateOnboardingRecord,
} from "@/features/knowledge/onboarding/privateOnboardingService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 24 * 1024;
const ALLOWED_METHODS = "GET, POST, PATCH, OPTIONS";
const repository = new FirestoreKEP1PrivateOnboardingRepository();

function headers(): Record<string, string> {
  return {
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

function response(body: unknown, status = 200): NextResponse {
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

function safeErrorStatus(code: string): number {
  if (code === "ONBOARDING_PAYLOAD_TOO_LARGE") return 413;
  if (code === "ONBOARDING_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (code.includes("VERSION_CONFLICT") || code.includes("ALREADY_EXISTS")) {
    return 409;
  }
  if (
    code.startsWith("ONBOARDING_") ||
    code === "GOVERNANCE_IDENTITY_HASH_SECRET_INVALID"
  ) {
    return 400;
  }
  return 500;
}

function productionHasher() {
  return createIdentityHasher(
    process.env.GOVERNANCE_IDENTITY_HASH_SECRET || ""
  );
}

async function authorize(request: NextRequest) {
  return authorizeRequest(
    request,
    "knowledge.contributor.manage",
    "KEP1_PRIVATE_ONBOARDING"
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
    return response({
      ok: true,
      workspace: await getPrivateOnboardingWorkspace(repository),
    });
  } catch {
    return response(
      { ok: false, error: { code: "ONBOARDING_READ_FAILED" } },
      500
    );
  }
}

async function parseBody(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("ONBOARDING_UNSUPPORTED_CONTENT_TYPE");
  }
  const rawBody = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error("ONBOARDING_MALFORMED_JSON");
  }
}

async function mutate(request: NextRequest, method: "POST" | "PATCH") {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "ONBOARDING_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const rawBody = await parseBody(request);
    const now = new Date().toISOString();
    const record =
      method === "POST"
        ? await createPrivateOnboardingRecord(
            repository,
            createPrivateOnboardingRecordSchema.parse(rawBody),
            { actorId: auth.session.uid },
            productionHasher(),
            now
          )
        : await verifyPrivateOnboardingRecord(
            repository,
            verifyPrivateOnboardingRecordSchema.parse(rawBody),
            { actorId: auth.session.uid },
            now
          );

    try {
      await logSecurityEvent({
        userId: auth.session.uid,
        userEmail: auth.session.email,
        userRole: auth.session.role,
        action:
          method === "POST"
            ? "knowledge_onboarding_record_created"
            : "knowledge_onboarding_record_verified",
        resource: "KEP1_PRIVATE_ONBOARDING",
        status: "success",
        timestamp: now,
        details: { recordId: record.recordId, version: record.version },
      });
    } catch {
      console.error(
        "KEP-1 onboarding security-log mirror failed after durable governance audit."
      );
    }

    return response({ ok: true, record });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "ONBOARDING_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "ONBOARDING_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "ONBOARDING_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, safeErrorStatus(code));
  }
}

export async function POST(request: NextRequest) {
  return mutate(request, "POST");
}

export async function PATCH(request: NextRequest) {
  return mutate(request, "PATCH");
}
