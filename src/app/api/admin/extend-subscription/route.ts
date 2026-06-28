import { NextRequest, NextResponse } from "next/server";
import { forbiddenApiResponse, requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/extend-subscription
 *
 * Admin-only: extends (or starts trial for) a doctor's subscription.
 *
 * Body:
 *   doctorUid  – The doctor's Firebase UID
 *   plan       – "trial" | "monthly" | "quarterly" | "annual"
 *   note?      – Optional note (e.g. "Paid via UPI - screenshot confirmed")
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminApiSession(request);
    if (!session) return unauthorizedApiResponse();
    if (session.role !== "admin") return forbiddenApiResponse();

    const body = await request.json();
    const { doctorUid, plan, note = "" } = body;

    if (!doctorUid || !plan) {
      return NextResponse.json(
        { success: false, message: "doctorUid and plan are required." },
        { status: 400 }
      );
    }

    const validUntil = computeValidUntil(plan);
    const renewedAt   = new Date().toISOString();

    const subscriptionUpdate = {
      "subscription.plan":       plan,
      "subscription.validUntil": validUntil,
      "subscription.status":     "active",
      "subscription.renewedAt":  renewedAt,
      "subscription.note":       note,
    };

    const isFirebaseConfigured =
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id";

    if (isFirebaseConfigured) {
      const { getAdminDb } = await import("@/lib/firebaseAdmin");

      // Update both users/{uid} and doctors/{uid} so both collections stay in sync
      const batch = getAdminDb().batch();
      batch.update(getAdminDb().collection("users").doc(doctorUid),   subscriptionUpdate);
      batch.update(getAdminDb().collection("doctors").doc(doctorUid), subscriptionUpdate);
      await batch.commit();
    } else {
      console.log("[MOCK] Would extend subscription for:", doctorUid, plan, validUntil);
    }

    return NextResponse.json({
      success:    true,
      message:    `Subscription extended to ${plan} plan. Valid until ${validUntil}.`,
      doctorUid,
      plan,
      validUntil,
      renewedAt,
    });
  } catch (error: any) {
    console.error("extend-subscription error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to extend subscription." },
      { status: 500 }
    );
  }
}

/** Compute ISO date (YYYY-MM-DD) from today based on plan */
function computeValidUntil(plan: string): string {
  if (plan === "branch") return "2099-12-31"; // Permanent access for branch doctors
  const d = new Date();
  switch (plan) {
    case "trial":     d.setDate(d.getDate() + 14);   break;  // 14-day trial
    case "monthly":   d.setMonth(d.getMonth() + 1);   break;
    case "quarterly": d.setMonth(d.getMonth() + 3);   break;
    case "annual":    d.setFullYear(d.getFullYear() + 1); break;
    default:          d.setMonth(d.getMonth() + 1);   break;
  }
  return d.toISOString().split("T")[0];
}
