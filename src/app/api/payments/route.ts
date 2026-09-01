import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";

const json = (body: Record<string, unknown>, status = 200) => {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  return response;
};

export async function GET(request: NextRequest) {
  const session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || !["admin", "doctor", "super-admin", "operations"].includes(session.role)) return json({ success: false, message: "Authentication required." }, 401);
  try {
    const date = request.nextUrl.searchParams.get("date");
    const { getAdminDb } = await import("@/lib/firebaseAdmin");
    const snapshot = await getAdminDb().collection("paymentReceipts").get();
    const payments = snapshot.docs.map((item: any) => item.data()).filter((payment: any) => {
      if (payment.status === "reversed") return false;
      return !date || String(payment.receivedAt || "").slice(0, 10) === date;
    }).sort((a: any, b: any) => String(b.receivedAt || "").localeCompare(String(a.receivedAt || "")));
    return json({ success: true, payments });
  } catch (error) {
    console.error("Payment receipt lookup failed", error);
    return json({ success: false, message: "Unable to load confirmed payments." }, 500);
  }
}
