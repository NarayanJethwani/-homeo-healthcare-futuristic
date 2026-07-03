import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { createV2ClinicalFeedbackDocument, isValidV2FeedbackPayload } from "@/features/repertory/liveMode";

export const dynamic = "force-dynamic";

function noStoreJson(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(request: NextRequest) {
  const session = await requireAdminApiSession(request);
  if (!session) return unauthorizedApiResponse();

  const payload = await request.json().catch(() => null);
  if (!isValidV2FeedbackPayload(payload)) {
    return noStoreJson({ success: false, message: "Invalid V2 feedback payload." }, 400);
  }

  try {
    const document = createV2ClinicalFeedbackDocument(payload, {
      uid: session.uid,
      email: session.email,
      role: session.role,
      name: session.name,
    });
    const ref = await getAdminDb().collection("v2ClinicalFeedback").add(document);
    return noStoreJson({ success: true, feedbackId: ref.id });
  } catch (error: any) {
    return noStoreJson({
      success: false,
      message: "Unable to store V2 feedback.",
      error: error?.message || String(error),
    }, 500);
  }
}
