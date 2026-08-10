import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  consumeDoctorAccessRateLimit,
  doctorAccessRequestSchema,
} from "@/features/doctor-access/doctorAccessRequest";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStoreHeaders = { "Cache-Control": "no-store" };

function clientAddress(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") || forwarded || "unknown";
}

function isCrossSite(request: NextRequest): boolean {
  return request.headers.get("sec-fetch-site") === "cross-site";
}

export async function POST(request: NextRequest) {
  if (isCrossSite(request)) {
    return NextResponse.json(
      { success: false, message: "This request must be submitted from the Homeo Healthcare portal." },
      { status: 403, headers: noStoreHeaders },
    );
  }

  const ip = clientAddress(request);
  if (!consumeDoctorAccessRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please wait before trying again." },
      { status: 429, headers: { ...noStoreHeaders, "Retry-After": "900" } },
    );
  }

  const parsed = doctorAccessRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the highlighted details and try again." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const { website: _honeypot, consent: _consent, ...details } = parsed.data;
  void _honeypot;
  void _consent;
  const now = new Date().toISOString();

  try {
    const db = getAdminDb();
    const existing = await db
      .collection("doctorAccessRequests")
      .where("emailNormalized", "==", details.email)
      .get();

    const openRequest = existing.docs.find((document: { data: () => { status?: string } }) =>
      ["pending-verification", "under-review"].includes(document.data()?.status || ""),
    );

    if (openRequest) {
      await db.collection("doctorAccessRequests").doc(openRequest.id).update({
        ...details,
        emailNormalized: details.email,
        updatedAt: now,
        lastSubmittedAt: now,
      });
    } else {
      await db.collection("doctorAccessRequests").add({
        ...details,
        emailNormalized: details.email,
        status: "pending-verification",
        source: "public-clinical-access",
        consentRecordedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Your request was received for verification. No clinical account has been activated yet.",
    }, { status: 202, headers: noStoreHeaders });
  } catch (error) {
    console.error("Doctor access request persistence failed:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { success: false, message: "We could not save the request. Please use the support options below." },
      { status: 503, headers: noStoreHeaders },
    );
  }
}
