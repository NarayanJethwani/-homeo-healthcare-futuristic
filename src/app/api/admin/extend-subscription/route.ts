import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/security/apiAuth";
import {
  computeCurrentDoctorSubscriptionValidUntil,
  isCurrentDoctorSubscriptionPlan,
} from "@/lib/doctorSubscriptionConfig";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/admin/extend-subscription
 *
 * Admin-only: renews a doctor's subscription after onboarding.
 *
 * Body:
 *   doctorUid  – The doctor's Firebase UID
 *   plan       – "monthly" | "branch" (the one-month trial is created only during onboarding)
 *   note?      – Optional note (e.g. "Paid via UPI - screenshot confirmed")
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, "USER_MANAGE", "EXTEND_SUBSCRIPTION_API_POST");
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { doctorUid, plan, note = "" } = body;

    if (!doctorUid || !isCurrentDoctorSubscriptionPlan(plan) || plan === "trial") {
      return NextResponse.json(
        { success: false, message: "doctorUid and a renewable plan are required. Trials cannot be renewed." },
        { status: 400 }
      );
    }

    const validUntil = computeCurrentDoctorSubscriptionValidUntil(plan);
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
