import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdminApiSession, unauthorizedApiResponse } from "@/lib/adminApiAuth";
import { normalizeRole } from "@/lib/security/rbac";
import {
  approvePatientPortalLinkSchema,
  candidatePatientIdsForEmail,
  normalizePortalEmail,
  practitionerMayLinkPatient,
  type PortalPatientCandidate,
} from "@/features/patient-portal-linking/patientPortalLinking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

function isSuperAdministrator(role: string | undefined): boolean {
  return role === "admin" || normalizeRole(role || "") === "super-admin";
}

export async function GET(request: NextRequest) {
  const session = await requireAdminApiSession(request, ["admin", "doctor"]);
  if (!session) return unauthorizedApiResponse();

  try {
    const db = getAdminDb();
    const superAdmin = isSuperAdministrator(session.role);
    const patientQuery = superAdmin
      ? db.collection("patients").orderBy("createdAt", "desc").limit(300)
      : db.collection("patients").where("assignedDoctor", "==", session.uid).limit(300);

    const [patientSnapshot, portalUserSnapshot] = await Promise.all([
      patientQuery.get(),
      db.collection("users").where("role", "==", "patient").get(),
    ]);

    const patients: PortalPatientCandidate[] = patientSnapshot.docs.map((document: { id: string; data: () => Record<string, unknown> }) => {
      const data = document.data() || {};
      return {
        id: typeof data.id === "string" && data.id ? data.id : document.id,
        name: typeof data.name === "string" ? data.name : "Unnamed patient",
        email: normalizePortalEmail(data.email),
        assignedDoctor: typeof data.assignedDoctor === "string" ? data.assignedDoctor : "unassigned",
      };
    });

    const allowedEmails = new Set(patients.map((patient) => normalizePortalEmail(patient.email)).filter(Boolean));
    const pending = portalUserSnapshot.docs
      .map((document: { id: string; data: () => Record<string, unknown> }) => {
        const data = document.data() || {};
        const email = normalizePortalEmail(data.email);
        return {
          uid: document.id,
          name: typeof data.name === "string" ? data.name : "Patient",
          email,
          createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
          status: typeof data.portalLinkStatus === "string" ? data.portalLinkStatus : "pending",
          patientId: typeof data.patientId === "string" ? data.patientId : "",
          candidatePatientIds: candidatePatientIdsForEmail(email, patients),
        };
      })
      .filter((account: { patientId: string; email: string }) =>
        !account.patientId && (superAdmin || (account.email && allowedEmails.has(account.email))),
      );

    return json({ success: true, pending, patients });
  } catch (error) {
    console.error("Patient portal link queue failed:", error instanceof Error ? error.message : String(error));
    return json({ success: false, message: "Unable to load pending portal registrations." }, 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdminApiSession(request, ["admin", "doctor"]);
  if (!session) return unauthorizedApiResponse();

  const parsed = approvePatientPortalLinkSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ success: false, message: "Select a valid portal account and clinical patient record." }, 400);

  const { portalUid, patientId } = parsed.data;
  const db = getAdminDb();
  const userRef = db.collection("users").doc(portalUid);
  const patientRef = db.collection("patients").doc(patientId);
  const linkRef = db.collection("patientPortalLinks").doc(portalUid);

  try {
    const [userSnapshot, patientSnapshot, existingPatientLinks] = await Promise.all([
      userRef.get(),
      patientRef.get(),
      db.collection("patientPortalLinks").where("patientId", "==", patientId).get(),
    ]);

    if (!userSnapshot.exists || userSnapshot.data()?.role !== "patient") {
      return json({ success: false, message: "The pending patient portal account was not found." }, 404);
    }
    if (!patientSnapshot.exists) {
      return json({ success: false, message: "The clinical patient record was not found." }, 404);
    }

    const patientData = patientSnapshot.data() || {};
    const superAdmin = isSuperAdministrator(session.role);
    if (!practitionerMayLinkPatient(session.uid, superAdmin, patientData.assignedDoctor)) {
      return json({ success: false, message: "You may only link patient records assigned to you." }, 403);
    }

    const userData = userSnapshot.data() || {};
    if (userData.patientId && userData.patientId !== patientId) {
      return json({ success: false, message: "This portal account is already linked to another clinical record." }, 409);
    }

    const conflictingLink = existingPatientLinks.docs.find((document: { id: string }) => document.id !== portalUid);
    if (conflictingLink) {
      return json({ success: false, message: "This clinical record is already linked to another portal account." }, 409);
    }

    const approvedAt = new Date().toISOString();
    const auditRef = db.collection("patientPortalLinkAuditEvents").doc(`approve-${portalUid}-${Date.now()}`);
    await db.runTransaction(async (transaction: {
      update: (reference: unknown, data: Record<string, unknown>) => void;
      set: (reference: unknown, data: Record<string, unknown>) => void;
    }) => {
      transaction.update(userRef, {
        patientId,
        portalLinkStatus: "approved",
        portalLinkedAt: approvedAt,
        portalLinkedBy: session.uid,
      });
      transaction.set(linkRef, {
        schemaVersion: "patient-portal-link-v1",
        portalUid,
        patientId,
        status: "approved",
        approvedAt,
        approvedBy: session.uid,
        approvedByRole: session.role || "doctor",
      });
      transaction.set(auditRef, {
        schemaVersion: "patient-portal-link-audit-v1",
        action: "patient-portal-link-approved",
        portalUid,
        patientId,
        actorUid: session.uid,
        actorRole: session.role || "doctor",
        occurredAt: approvedAt,
      });
    });

    return json({
      success: true,
      message: `${userData.name || userData.email || "Patient"} is now linked to ${patientData.name || patientId}.`,
      patientId,
    });
  } catch (error) {
    console.error("Patient portal link approval failed:", error instanceof Error ? error.message : String(error));
    return json({ success: false, message: "Unable to approve this portal link." }, 500);
  }
}
