import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { FirestoreKEP1PrivateOnboardingRepository } from "@/features/knowledge/onboarding/privateOnboardingFirestoreRepository";
import { FirestoreKEP1AcquisitionRepository } from "@/features/knowledge/acquisition/kep1AcquisitionFirestoreRepository";
import { kep1AcquisitionMutationSchema } from "@/features/knowledge/acquisition/kep1AcquisitionSchemas";
import {
  decideKEP1Assignment,
  decideKEP1SourceRights,
  getKEP1AcquisitionWorkspace,
  proposeKEP1Assignment,
} from "@/features/knowledge/acquisition/kep1AcquisitionService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const repository = new FirestoreKEP1AcquisitionRepository();
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
    "KEP1_ACQUISITION_CONTROL"
  );
}

function statusFor(code: string): number {
  if (code === "ACQUISITION_PAYLOAD_TOO_LARGE") return 413;
  if (code === "ACQUISITION_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code.includes("VERSION_CONFLICT") ||
    code.includes("ALREADY_EXISTS")
  ) {
    return 409;
  }
  if (code.startsWith("ACQUISITION_")) return 400;
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
      workspace: await getKEP1AcquisitionWorkspace(
        repository,
        onboardingRepository
      ),
    });
  } catch {
    return response(
      { ok: false, error: { code: "ACQUISITION_READ_FAILED" } },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "ACQUISITION_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("ACQUISITION_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("ACQUISITION_MALFORMED_JSON");
    }
    const input = kep1AcquisitionMutationSchema.parse(parsed);
    const now = new Date().toISOString();
    const actor = { actorId: auth.session.uid };
    const result =
      input.action === "propose-assignment"
        ? await proposeKEP1Assignment(
            repository,
            onboardingRepository,
            input,
            actor,
            now
          )
        : input.action === "decide-assignment"
          ? await decideKEP1Assignment(
              repository,
              onboardingRepository,
              input,
              actor,
              now
            )
          : await decideKEP1SourceRights(
              repository,
              onboardingRepository,
              input,
              actor,
              now
            );

    try {
      await logSecurityEvent({
        userId: auth.session.uid,
        userEmail: auth.session.email,
        userRole: auth.session.role,
        action: `knowledge_${input.action.replaceAll("-", "_")}`,
        resource: "KEP1_ACQUISITION_CONTROL",
        status: "success",
        timestamp: now,
        details: {
          recordId:
            "assignmentId" in result ? result.assignmentId : result.sourceId,
          version: result.version,
        },
      });
    } catch {
      console.error(
        "KEP-1 acquisition security-log mirror failed after durable governance audit."
      );
    }

    return response({
      ok: true,
      result: {
        recordId:
          "assignmentId" in result ? result.assignmentId : result.sourceId,
        status:
          "status" in result ? result.status : result.decision,
        version: result.version,
      },
    });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "ACQUISITION_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "ACQUISITION_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "ACQUISITION_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
