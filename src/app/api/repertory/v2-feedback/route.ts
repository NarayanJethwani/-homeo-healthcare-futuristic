import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { authorizeRepertoryRequest } from "@/features/repertory/access/RepertoryRequestAuthorization";
import { isOriginAllowed, getCorsHeaders, handleOptionsRequest } from "@/features/ai-security/access/aiSecurityHeaders";
import { consumeRepertoryRateLimit, rateLimitResponse, readAndBoundRequestBody } from "@/features/repertory/security/RepertoryApiSecurity";
import { resolveDoctorRepertoryEntitlement } from "@/features/repertory/access/DoctorEntitlementRepository";
import repertoryRepository from "@/features/repertory/database/repertoryDb";
import { REMEDIES_METADATA } from "@/lib/repertoryData";
import { z } from "zod";

export const dynamic = "force-dynamic";

const SAFE_IDENTIFIER = /^[A-Za-z0-9_\-.:]{1,100}$/;

const comparisonSummarySchema = z.object({
  commonRubricIds: z.array(z.string().max(100).regex(SAFE_IDENTIFIER)).max(50).optional(),
  v1OnlyRubricIds: z.array(z.string().max(100).regex(SAFE_IDENTIFIER)).max(50).optional(),
  v2OnlyRubricIds: z.array(z.string().max(100).regex(SAFE_IDENTIFIER)).max(50).optional(),
}).strict().optional();

const feedbackFiltersSchema = z.object({
  category: z.string().max(100).optional(),
  organSystem: z.string().max(100).optional(),
  miasm: z.string().max(100).optional(),
  remedy: z.string().max(100).optional(),
}).strict().optional();

const feedbackSchema = z.object({
  mode: z.enum(["compare", "v2-live"]),
  decision: z.enum([
    "v2_better",
    "v1_better",
    "both_acceptable",
    "v2_missed_important_rubric",
    "v2_found_useful_rubric",
    "needs_correction",
    "clinical_note",
  ]),
  note: z.string().max(500).optional(),
  query: z.string().max(100),
  filters: feedbackFiltersSchema,
  v1TopRubricIds: z.array(z.string().max(100).regex(SAFE_IDENTIFIER)).max(50).optional(),
  v2TopRubricIds: z.array(z.string().max(100).regex(SAFE_IDENTIFIER)).max(50).optional(),
  v2TopRemedyIds: z.array(z.string().max(100).regex(SAFE_IDENTIFIER)).max(50).optional(),
  comparisonSummary: comparisonSummarySchema,
}).strict();

// Helper to compute HMAC
function keyedHmac(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

// Helper to validate rubric ID against known corpus identifiers
async function isValidRubricId(id: string): Promise<boolean> {
  const firestoreDoc = await getAdminDb().collection("rubrics").doc(id).get();
  if (firestoreDoc.exists) {
    const data = firestoreDoc.data();
    if (data?.status === "active" || data?.status === "published") {
      return true;
    }
  }

  try {
    const staticDoc = await repertoryRepository.getRubricById(id);
    if (staticDoc !== null) {
      return true;
    }
  } catch (e) {
    // ignore
  }
  return false;
}

// Helper to validate remedy ID against known corpus identifiers
function isValidRemedyId(id: string): boolean {
  const clean = id.trim().toLowerCase();
  return Object.keys(REMEDIES_METADATA).some(k => k.toLowerCase() === clean);
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return handleOptionsRequest(origin, "POST, OPTIONS");
}

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ ok: false, error: { code: "METHOD_NOT_ALLOWED", message: "GET not allowed on this endpoint" } }, { status: 405 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  // 1. Exact-Origin check
  if (!isOriginAllowed(origin)) {
    const response = NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Disallowed Origin" } }, { status: 403 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const corsHeaders = getCorsHeaders(origin, "POST, OPTIONS");

  try {
    // 2. Doctor Pilot Clinician Authorization (runs before rate limits or body stream reads)
    const auth = await authorizeRepertoryRequest(request, "repertory.repertorize", "REPERTORY_V2_FEEDBACK");
    if (!auth.authorized) {
      const response = auth.response;
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 3. Rate Limiting
    const rateLimit = consumeRepertoryRateLimit("feedback_post", auth.session.uid, {
      maxRequests: 20,
      windowMs: 60_000,
    });
    if (!rateLimit.allowed) {
      const response = rateLimitResponse(rateLimit.retryAfterSeconds);
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 4. Fail closed if clinical pseudonymization secret is missing
    const clinicalSecret = process.env.CLINICAL_PSEUDONYMIZATION_SECRET;
    if (!clinicalSecret) {
      const response = NextResponse.json({ success: false, message: "System security configuration error." }, { status: 500 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    // 5. Resolve reviewer and tenant contexts inside the protected boundary
    const uid = auth.session.uid;
    const role = auth.session.role;
    let tenantOrg = "system";
    let tenantClinic = "admin";

    if (auth.authorizationPath === "doctor-entitlement") {
      const doctorEntitlement = await resolveDoctorRepertoryEntitlement(uid);
      if (!doctorEntitlement) {
        const response = NextResponse.json({ success: false, message: "Active EMR entitlement required for pilot doctors." }, { status: 403 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
      tenantOrg = doctorEntitlement.organizationId;
      tenantClinic = doctorEntitlement.clinicId;
    }

    // 6. Secure stream-bound request body reading (4KB limit)
    let rawBody = "";
    try {
      rawBody = await readAndBoundRequestBody(request, 4096);
    } catch (err: any) {
      if (err.message === "PAYLOAD_TOO_LARGE") {
        const response = NextResponse.json({ ok: false, error: { code: "PAYLOAD_TOO_LARGE", message: "Payload too large" } }, { status: 413 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
      throw err;
    }

    const parsedJson = JSON.parse(rawBody);
    const parsed = feedbackSchema.safeParse(parsedJson);
    if (!parsed.success) {
      const response = NextResponse.json({ success: false, message: "Invalid payload schema." }, { status: 400 });
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    const data = parsed.data;

    // 7. Semantic validation of rubric and remedy IDs against known corpus identifiers (deduplicated)
    const allRubricIds = Array.from(
      new Set([
        ...(data.v1TopRubricIds || []),
        ...(data.v2TopRubricIds || []),
        ...(data.comparisonSummary?.commonRubricIds || []),
        ...(data.comparisonSummary?.v1OnlyRubricIds || []),
        ...(data.comparisonSummary?.v2OnlyRubricIds || []),
      ])
    );

    for (const rId of allRubricIds) {
      const isValid = await isValidRubricId(rId);
      if (!isValid) {
        const response = NextResponse.json({ success: false, message: "Invalid rubric identifier." }, { status: 400 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
    }

    const allRemedyIds = Array.from(new Set(data.v2TopRemedyIds || []));
    for (const remId of allRemedyIds) {
      if (!isValidRemedyId(remId)) {
        const response = NextResponse.json({ success: false, message: "Invalid remedy identifier." }, { status: 400 });
        Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
    }

    // 8. HMAC Pseudonymization
    const reviewer = {
      reviewerHash: keyedHmac(uid, `${clinicalSecret}:reviewer`),
      roleHash: keyedHmac(role, `${clinicalSecret}:role`),
      organizationHash: keyedHmac(tenantOrg, `${clinicalSecret}:org`),
      clinicHash: keyedHmac(tenantClinic, `${clinicalSecret}:clinic`),
    };

    // 9. PHI Strip & Allowlist Save to Firestore (v2ClinicalFeedback collection)
    // Note: filters, query, and note are completely omitted from persistence for PHI security
    const feedbackRecord = {
      mode: data.mode,
      decision: data.decision,
      v1TopRubricIds: data.v1TopRubricIds || [],
      v2TopRubricIds: data.v2TopRubricIds || [],
      v2TopRemedyIds: data.v2TopRemedyIds || [],
      comparisonSummary: {
        commonRubricIds: data.comparisonSummary?.commonRubricIds || [],
        v1OnlyRubricIds: data.comparisonSummary?.v1OnlyRubricIds || [],
        v2OnlyRubricIds: data.comparisonSummary?.v2OnlyRubricIds || [],
      },
      createdAt: new Date().toISOString(),
      reviewer,
      safety: {
        clinicianReviewed: true,
        autoPrescribed: false,
        patientRecordModified: false,
      },
    };

    const ref = await getAdminDb().collection("v2ClinicalFeedback").add(feedbackRecord);

    const response = NextResponse.json({
      success: true,
      feedbackId: ref.id,
    });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error: any) {
    console.error("Repertory Feedback API failed. Details redacted.");

    const response = NextResponse.json({
      success: false,
      message: "Unable to store V2 feedback."
    }, { status: 500 });
    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}
