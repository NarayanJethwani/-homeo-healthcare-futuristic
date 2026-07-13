import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";
import { createDoctorWorkspace } from "@/lib/googleDrive";
import { computeDoctorPlanValidUntil, onboardDoctorSchema } from "@/features/doctor-onboarding/onboardingValidation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Creates a doctor account and its isolated workspace.
 * Only a signed-in super administrator may call this route.
 */
export async function POST(request: NextRequest) {
  const session = await requireAdminApiSession(request, ["super-admin"]);
  if (!session) return unauthorizedApiResponse("Super administrator access is required.");

  const parsed = onboardDoctorSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the doctor details and try again." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const { name, email, phone, speciality, plan } = parsed.data;
  const isFirebaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id";

  if (!isFirebaseConfigured && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, message: "Doctor onboarding is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!isFirebaseConfigured) {
    return NextResponse.json({
      success: true,
      isMockFirebase: true,
      isMockWorkspace: true,
      message: "Doctor onboarding preview completed. No production account was created.",
      doctor: {
        uid: `mock-${Date.now()}`,
        name,
        email,
        subscription: { plan, validUntil: computeDoctorPlanValidUntil(plan), status: "active" },
      },
    }, { headers: { "Cache-Control": "no-store" } });
  }

  const auth = getAdminAuth();
  let createdUid: string | null = null;

  try {
    try {
      await auth.getUserByEmail(email);
      return NextResponse.json(
        { success: false, message: "An account already exists for this email address." },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    } catch (error: unknown) {
      const code = typeof error === "object" && error && "code" in error
        ? String((error as { code?: unknown }).code)
        : "";
      if (code !== "auth/user-not-found") throw error;
    }

    const userRecord = await auth.createUser({
      email,
      displayName: name,
      emailVerified: false,
    });
    createdUid = userRecord.uid;
    const passwordSetupLink = await auth.generatePasswordResetLink(email);

    const workspace = await createDoctorWorkspace(name, email);
    if (workspace.isMock) {
      throw new Error("Doctor workspace provisioning is unavailable.");
    }

    const onboardedAt = new Date().toISOString();
    const validUntil = computeDoctorPlanValidUntil(plan);
    const subscription = { plan, validUntil, status: "active" };

    const userProfile = {
      uid: createdUid,
      name,
      email,
      phone,
      speciality,
      role: "doctor",
      driveFolderId: workspace.driveFolderId,
      driveFolderUrl: workspace.driveFolderUrl,
      masterSheetId: workspace.masterSheetId,
      masterSheetUrl: workspace.masterSheetUrl,
      subscription,
      onboardedAt,
      onboardedBy: session.uid,
      isMockWorkspace: false,
    };

    const db = getAdminDb();
    const batch = db.batch();
    batch.set(db.collection("users").doc(createdUid), userProfile, { merge: true });
    batch.set(db.collection("doctors").doc(createdUid), {
      uid: createdUid,
      name,
      email,
      driveFolderId: workspace.driveFolderId,
      driveFolderUrl: workspace.driveFolderUrl,
      masterSheetId: workspace.masterSheetId,
      masterSheetUrl: workspace.masterSheetUrl,
      subscription,
      onboardedAt,
      onboardedBy: session.uid,
      patientCount: 0,
    }, { merge: true });
    await batch.commit();

    return NextResponse.json({
      success: true,
      isMockFirebase: false,
      isMockWorkspace: false,
      message: `Doctor ${name} was onboarded. Copy and securely share the password-setup link.`,
      passwordSetupLink,
      doctor: {
        uid: createdUid,
        name,
        email,
        driveFolderUrl: workspace.driveFolderUrl,
        masterSheetUrl: workspace.masterSheetUrl,
        subscription,
        onboardedAt,
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error: unknown) {
    if (createdUid) {
      await auth.deleteUser(createdUid).catch(() => undefined);
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error("Doctor onboarding failed:", message);
    return NextResponse.json(
      { success: false, message: "Doctor onboarding failed. No active login was retained." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
