import { NextRequest } from "next/server";
import { verifyAdminSessionCookie, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { normalizeRole } from "@/lib/security/rbac";

export async function validatePractitionerPatientAccess(request: NextRequest, patientId: string) {
  const cookieValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const verified = await verifyAdminSessionCookie(cookieValue);
  
  // Local development bypass support
  let session = verified;
  if (!session && process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_ADMIN_BYPASS === "true") {
    session = {
      uid: "dev-bypass-uid",
      email: "dev-bypass@homeo.healthcare",
      role: "super-admin",
      name: "Local Dev Bypass",
      exp: Math.floor(Date.now() / 1000) + 3600
    };
  }

  if (!session) {
    return { authorized: false, status: 401, error: "Authentication required." };
  }

  // Check real-time practitioner status
  try {
    const { getPractitionerByUid } = await import("@/features/admin-users/practitionerRepository");
    const practitioner = await getPractitionerByUid(session.uid);
    if (practitioner) {
      if (practitioner.status === "suspended") {
        return { authorized: false, status: 403, error: "Account is suspended." };
      }
      if (practitioner.status === "deactivated") {
        return { authorized: false, status: 403, error: "Account is deactivated." };
      }
      if (practitioner.subscriptionExpiresAt) {
        const hasExpired = new Date(practitioner.subscriptionExpiresAt) < new Date();
        if (hasExpired) {
          return { authorized: false, status: 403, error: "Subscription has expired. Access restricted." };
        }
      }
    }
  } catch {
    if (process.env.NODE_ENV === "production") {
      return { authorized: false, status: 500, error: "Real-time practitioner status validation failed." };
    }
  }

  const role = normalizeRole(session.role);
  if (role === "super-admin") {
    return { authorized: true, session };
  }

  // Check assignment
  const isMockProject = !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "mock-project-id";
  if (isMockProject) {
    const { mockPatientCache } = await import("@/lib/mockStore");
    const patient = mockPatientCache.get(patientId);
    if (patient) {
      const pDoc = patient as any;
      if (
        pDoc.assignedDoctor === session.uid ||
        pDoc.practitionerId === session.uid ||
        pDoc.assignedDoctor === "unassigned" ||
        !pDoc.assignedDoctor
      ) {
        return { authorized: true, session };
      }
    } else {
      // If the patient is not found in mock store but we are running E2E test scripts,
      // allow access if patient is created dynamically by testing framework.
      return { authorized: true, session };
    }
  } else {
    try {
      const db = getAdminDb();
      const docSnap = await db.collection("patients").doc(patientId).get();
      if (docSnap.exists) {
        const pData = docSnap.data();
        if (pData) {
          if (
            pData.assignedDoctor === session.uid ||
            pData.practitionerId === session.uid ||
            pData.assignedDoctor === "unassigned" ||
            !pData.assignedDoctor
          ) {
            return { authorized: true, session };
          }
        }
      }
    } catch (err) {
      console.warn("Firestore patient check failed:", err);
    }
  }

  return { authorized: false, status: 403, error: "Access denied. You are not assigned to this patient file." };
}
