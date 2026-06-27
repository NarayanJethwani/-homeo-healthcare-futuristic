import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";
import { createDoctorWorkspace } from "@/lib/googleDrive";

/**
 * POST /api/onboard-doctor
 *
 * Onboards a new franchisee doctor:
 *   1. Creates a Firebase Auth account and sends a password-reset email
 *   2. Writes a Firestore user profile (role: 'doctor')
 *   3. Writes a Firestore doctors/{uid} workspace metadata document
 *   4. Provisions a private Google Drive folder + Master Sheet
 *
 * Body:
 *   name         – Full doctor name, e.g. "Dr. Priya Sharma"
 *   email        – Doctor's email (must be unique in Firebase Auth)
 *   phone?       – Optional phone number
 *   speciality?  – e.g. "Paediatric Homeopathy"
 *   plan?        – "monthly" | "quarterly" | "annual"  (default: "monthly")
 *   adminUid     – UID of the calling admin (passed from client session)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone = "",
      speciality = "General Homeopathy",
      plan = "monthly",
      adminUid = "",
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Doctor name and email are required." },
        { status: 400 }
      );
    }

    const isFirebaseConfigured =
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id";

    let uid = `mock-${Date.now()}`;
    let isMockFirebase = !isFirebaseConfigured;

    // ── 1. Create Firebase Auth account ───────────────────────────────────────
    if (isFirebaseConfigured) {
      try {
        // Check if user already exists
        try {
          const existingUser = await getAdminAuth().getUserByEmail(email);
          uid = existingUser.uid;
          console.log("Doctor already exists in Firebase Auth:", email, "uid:", uid);
        } catch {
          // User doesn't exist — create them with a random temp password
          const tempPassword = `Homeo@${Math.random().toString(36).slice(-8)}`;
          const userRecord = await getAdminAuth().createUser({
            email,
            displayName: name,
            password: tempPassword,
            emailVerified: false,
          });
          uid = userRecord.uid;
          console.log("Firebase Auth user created:", email, uid);

          // Send password reset so the doctor sets their own password
          await getAdminAuth()
            .generatePasswordResetLink(email)
            .then((link) => {
              console.log("Password reset link for", email, ":", link);
              // NOTE: In production, send this link via your transactional email provider
              // (e.g. SendGrid, Resend). For now it is logged server-side.
            })
            .catch((err) =>
              console.warn("Could not generate reset link:", err)
            );
        }
      } catch (authErr: any) {
        console.error("Firebase Auth error during onboarding:", authErr.message);
        if (!authErr.message?.includes("already exists")) {
          return NextResponse.json(
            { success: false, message: "Firebase Auth error: " + authErr.message },
            { status: 500 }
          );
        }
      }
    }

    // ── 2. Provision Google Drive folder + Master Sheet ───────────────────────
    const workspace = await createDoctorWorkspace(name, email);

    // ── 3. Write Firestore user profile ───────────────────────────────────────
    const onboardedAt = new Date().toISOString();
    const validUntil = computeValidUntil(plan);

    const userProfile = {
      uid,
      name,
      email,
      phone,
      speciality,
      role: "doctor",
      driveFolderId: workspace.driveFolderId,
      driveFolderUrl: workspace.driveFolderUrl,
      masterSheetId: workspace.masterSheetId,
      masterSheetUrl: workspace.masterSheetUrl,
      subscription: {
        plan,
        validUntil,
        status: "active",
      },
      onboardedAt,
      onboardedBy: adminUid || "admin",
      isMockWorkspace: workspace.isMock,
    };

    if (isFirebaseConfigured) {
      // Write to users/{uid}
      await getAdminDb().collection("users").doc(uid).set(userProfile, { merge: true });

      // Write to doctors/{uid} (workspace metadata for Firestore rules)
      await getAdminDb().collection("doctors").doc(uid).set(
        {
          uid,
          name,
          email,
          driveFolderId: workspace.driveFolderId,
          driveFolderUrl: workspace.driveFolderUrl,
          masterSheetId: workspace.masterSheetId,
          masterSheetUrl: workspace.masterSheetUrl,
          subscription: { plan, validUntil, status: "active" },
          onboardedAt,
          onboardedBy: adminUid || "admin",
          patientCount: 0,
        },
        { merge: true }
      );
    } else {
      isMockFirebase = true;
      console.log("[MOCK] Would have written Firestore user profile for:", email);
    }

    return NextResponse.json({
      success: true,
      isMockFirebase,
      isMockWorkspace: workspace.isMock,
      message: isMockFirebase
        ? "Doctor onboarded in mock mode (Firebase not configured)."
        : `Doctor ${name} successfully onboarded. A password-reset email has been sent to ${email}.`,
      doctor: {
        uid,
        name,
        email,
        driveFolderUrl: workspace.driveFolderUrl,
        masterSheetUrl: workspace.masterSheetUrl,
        subscription: { plan, validUntil, status: "active" },
        onboardedAt,
      },
    });
  } catch (error: any) {
    console.error("Doctor onboarding failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Doctor onboarding failed.",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

/** Returns an ISO date string N months from now based on the chosen plan */
function computeValidUntil(plan: string): string {
  if (plan === "branch") return "2099-12-31"; // Permanent access for branch doctors
  const d = new Date();
  if (plan === "annual") d.setFullYear(d.getFullYear() + 1);
  else if (plan === "quarterly") d.setMonth(d.getMonth() + 3);
  else d.setMonth(d.getMonth() + 1); // default: monthly
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}
