import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { FirestoreKEP1PrivateOnboardingRepository } from "@/features/knowledge/onboarding/privateOnboardingFirestoreRepository";
import { FirestoreKEP1AcquisitionRepository } from "@/features/knowledge/acquisition/kep1AcquisitionFirestoreRepository";
import { FirestoreKEP1AcquisitionJobRepository } from "@/features/knowledge/acquisition/kep1AcquisitionJobFirestoreRepository";
import { kep1AcquisitionJobMutationSchema } from "@/features/knowledge/acquisition/kep1AcquisitionJobSchemas";
import {
  decideKEP1AcquisitionJob,
  getKEP1AcquisitionJobWorkspace,
  proposeKEP1AcquisitionJob,
  recordKEP1ImmutableArtifact,
  verifyKEP1ImmutableArtifact,
} from "@/features/knowledge/acquisition/kep1AcquisitionJobService";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const jobRepository = new FirestoreKEP1AcquisitionJobRepository();
const acquisitionRepository = new FirestoreKEP1AcquisitionRepository();
const onboardingRepository = new FirestoreKEP1PrivateOnboardingRepository();

function responseHeaders(): Record<string, string> {
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
    headers: responseHeaders(),
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

async function authorize(request: NextRequest) {
  return authorizeRequest(
    request,
    "knowledge.expansion.manage",
    "KEP1_ACQUISITION_JOB_CONTROL"
  );
}

function statusFor(code: string): number {
  if (code === "ACQUISITION_JOB_PAYLOAD_TOO_LARGE") return 413;
  if (code === "ACQUISITION_JOB_UNSUPPORTED_CONTENT_TYPE") return 415;
  if (
    code.includes("VERSION_CONFLICT") ||
    code.includes("ALREADY_EXISTS") ||
    code.includes("IMMUTABLE_CONFLICT") ||
    code.includes("RIGHTS_DECISION_DRIFT")
  ) {
    return 409;
  }
  if (code.startsWith("ACQUISITION_")) return 400;
  return 500;
}

export async function OPTIONS(request: NextRequest) {
  if (!sameOrigin(request)) return response({ ok: false }, 403);
  return new NextResponse(null, { status: 204, headers: responseHeaders() });
}

export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;
  try {
    return response({
      ok: true,
      workspace: await getKEP1AcquisitionJobWorkspace(
        jobRepository,
        acquisitionRepository,
        onboardingRepository
      ),
    });
  } catch {
    return response(
      { ok: false, error: { code: "ACQUISITION_JOB_READ_FAILED" } },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return response(
      { ok: false, error: { code: "ACQUISITION_JOB_CSRF_REJECTED" } },
      403
    );
  }
  const auth = await authorize(request);
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("ACQUISITION_JOB_UNSUPPORTED_CONTENT_TYPE");
    }
    const raw = await readAndBoundRequestBody(request, MAX_BODY_BYTES);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("ACQUISITION_JOB_MALFORMED_JSON");
    }
    const input = kep1AcquisitionJobMutationSchema.parse(parsed);
    const now = new Date().toISOString();
    const actor = { actorId: auth.session.uid };
    const result =
      input.action === "propose-job"
        ? await proposeKEP1AcquisitionJob(
            jobRepository,
            acquisitionRepository,
            input,
            actor,
            now
          )
        : input.action === "decide-job"
          ? await decideKEP1AcquisitionJob(
              jobRepository,
              acquisitionRepository,
              onboardingRepository,
              input,
              actor,
              now
            )
          : input.action === "record-artifact"
            ? await recordKEP1ImmutableArtifact(
                jobRepository,
                acquisitionRepository,
                input,
                actor,
                now
              )
            : await verifyKEP1ImmutableArtifact(
                jobRepository,
                acquisitionRepository,
                input,
                actor,
                now
              );

    const resultKey =
      input.action === "record-artifact"
        ? "artifactId"
        : input.action === "verify-artifact"
          ? "verificationId"
          : "jobId";
    const recordId = (result as unknown as Record<string, unknown>)[resultKey];
    if (typeof recordId !== "string") {
      throw new Error("ACQUISITION_JOB_RESULT_INVALID");
    }
    try {
      await logSecurityEvent({
        userId: auth.session.uid,
        userEmail: auth.session.email,
        userRole: auth.session.role,
        action: `knowledge_${input.action.replaceAll("-", "_")}`,
        resource: "KEP1_ACQUISITION_JOB_CONTROL",
        status: "success",
        timestamp: now,
        details: { recordId },
      });
    } catch {
      console.error(
        "KEP-1 acquisition-job security-log mirror failed after durable governance audit."
      );
    }

    return response({ ok: true, result: { recordId } });
  } catch (error) {
    const rawCode =
      error instanceof Error && /^[A-Z0-9_]+$/.test(error.message)
        ? error.message
        : "ACQUISITION_JOB_INVALID_INPUT";
    const code =
      rawCode === "PAYLOAD_TOO_LARGE"
        ? "ACQUISITION_JOB_PAYLOAD_TOO_LARGE"
        : rawCode === "STREAM_READ_FAILED"
          ? "ACQUISITION_JOB_BODY_READ_FAILED"
          : rawCode;
    return response({ ok: false, error: { code } }, statusFor(code));
  }
}
