import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/adminSession";
export async function GET(request: NextRequest) {
  const session = await verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || !["admin", "doctor", "super-admin", "operations"].includes(session.role)) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  try { const { getAdminDb } = await import("@/lib/firebaseAdmin"); const snapshot = await getAdminDb().collection("clinicalActivity").get(); const activities = snapshot.docs.map((item: any) => item.data()).sort((a: any, b: any) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))).slice(0, 30); return NextResponse.json({ success: true, activities }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { console.error("Activity lookup failed", error); return NextResponse.json({ success: false, message: "Unable to load activity." }, { status: 500 }); }
}
