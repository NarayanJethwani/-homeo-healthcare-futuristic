import { NextRequest } from "next/server";
import { verifyPatientSessionCookie, PATIENT_SESSION_COOKIE } from "@/lib/patientSession";
import { verifyAdminSessionCookie, ADMIN_SESSION_COOKIE } from "@/lib/adminSession";

export type AccessProfile =
  | { mode: "public" }
  | { mode: "patient"; patientId: string; uid: string; email?: string }
  | { mode: "doctor"; doctorId: string; email: string; name: string };

export class AccessProfileResolver {
  static async resolve(request: NextRequest): Promise<{
    profile: AccessProfile | null;
    errorResponse?: { status: number; message: string };
  }> {
    const patientCookie = request.cookies.get(PATIENT_SESSION_COOKIE)?.value;
    const adminCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    // Reject ambiguity if both cookies are present
    if (patientCookie && adminCookie) {
      return {
        profile: null,
        errorResponse: { status: 400, message: "Ambiguous authentication state." }
      };
    }

    if (adminCookie) {
      const verified = await verifyAdminSessionCookie(adminCookie);
      if (!verified) {
        return {
          profile: null,
          errorResponse: { status: 401, message: "Invalid session credentials." }
        };
      }

      if (verified.role !== "doctor") {
        return {
          profile: null,
          errorResponse: { status: 403, message: "Access forbidden. Practitioner access required." }
        };
      }

      return {
        profile: {
          mode: "doctor",
          doctorId: verified.uid,
          email: verified.email || "unknown@homeo.healthcare",
          name: verified.name || "Doctor"
        }
      };
    }

    if (patientCookie) {
      const verified = await verifyPatientSessionCookie(patientCookie);
      if (!verified) {
        return {
          profile: null,
          errorResponse: { status: 401, message: "Invalid session credentials." }
        };
      }

      if (!verified.patientId) {
        return {
          profile: null,
          errorResponse: { status: 400, message: "Patient session missing linked patient record." }
        };
      }

      return {
        profile: {
          mode: "patient",
          patientId: verified.patientId,
          uid: verified.uid,
          email: verified.email || undefined
        }
      };
    }

    // Default to Public mode if no credentials present
    return {
      profile: { mode: "public" }
    };
  }
}
