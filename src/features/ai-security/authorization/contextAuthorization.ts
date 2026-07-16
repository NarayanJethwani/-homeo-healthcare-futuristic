import { getAdminDb } from "@/lib/firebaseAdmin";

export type ContextAuthorizationResult =
  | { authorized: true; organizationId: string; clinicId: string; resolvedPatientId?: string }
  | { authorized: false; errorReason: string };

export class ContextAuthorization {
  /**
   * Decoupled doctor AI entitlement check verifying practitioner profiles,
   * active tenant bounds, AI capabilities, and validity dates.
   */
  static async authorizeDoctorContext(
    doctorId: string,
    context: { patientContextId?: string; encounterId?: string }
  ): Promise<ContextAuthorizationResult> {
    const db = getAdminDb();

    // 1. Fetch Practitioner record to resolve organization and clinic context
    const practitionerDoc = await db.collection("practitioners").doc(doctorId).get();
    if (!practitionerDoc.exists) {
      return { authorized: false, errorReason: "Doctor profile not found." };
    }
    const practitionerData = practitionerDoc.data();
    if (!practitionerData || practitionerData.status !== "active") {
      return { authorized: false, errorReason: "Doctor profile is inactive." };
    }
    const { organizationId, clinicId } = practitionerData;

    // 2. Validate dedicated AI capability entitlement
    const aiEntitlementDoc = await db.collection("ai_practitioner_entitlements").doc(doctorId).get();
    if (!aiEntitlementDoc.exists) {
      return { authorized: false, errorReason: "AI clinical consultation entitlement is missing or inactive." };
    }
    const aiData = aiEntitlementDoc.data();
    if (!aiData || aiData.status !== "active") {
      return { authorized: false, errorReason: "AI clinical consultation entitlement is missing or inactive." };
    }

    // Tenant binding validation
    if (aiData.organizationId !== organizationId || aiData.clinicId !== clinicId) {
      return { authorized: false, errorReason: "AI entitlement tenant mismatch." };
    }

    // AI Capability check
    if (!aiData.capabilities || !aiData.capabilities.includes("consult-ai")) {
      return { authorized: false, errorReason: "AI entitlement lacks the consult-ai capability." };
    }

    // Validity dates checks (missing/malformed fail closed)
    if (!aiData.effectiveDate || !aiData.expiryDate) {
      return { authorized: false, errorReason: "AI entitlement dates are missing or malformed." };
    }
    const now = Date.now();
    const effectiveTime = new Date(aiData.effectiveDate).getTime();
    const expiryTime = new Date(aiData.expiryDate).getTime();
    if (isNaN(effectiveTime) || isNaN(expiryTime)) {
      return { authorized: false, errorReason: "AI entitlement dates are missing or malformed." };
    }
    if (now < effectiveTime || now > expiryTime) {
      return { authorized: false, errorReason: "AI entitlement is expired or not yet active." };
    }

    let resolvedPatientId = context.patientContextId;

    // 3. Authorize Encounter Context if provided
    if (context.encounterId) {
      const encounterDoc = await db.collection("encounters").doc(context.encounterId).get();
      if (!encounterDoc.exists) {
        return { authorized: false, errorReason: "Access denied. Encounter record not found or inaccessible." };
      }

      const encounterData = encounterDoc.data();
      if (!encounterData) {
        return { authorized: false, errorReason: "Access denied. Encounter record not found or inaccessible." };
      }

      // Check organization boundary
      if (encounterData.organizationId !== organizationId) {
        return { authorized: false, errorReason: "Access denied. Organization boundary mismatch." };
      }

      // Clinic alignment check
      if (encounterData.clinicId !== clinicId) {
        return { authorized: false, errorReason: "Access denied. Clinic boundary mismatch." };
      }

      // Practitioner ownership check
      if (encounterData.practitionerId !== doctorId) {
        return { authorized: false, errorReason: "Access denied. Encounter practitioner owner mismatch." };
      }

      // Linkage alignment check
      if (context.patientContextId && encounterData.patientId !== context.patientContextId) {
        return { authorized: false, errorReason: "Access denied. Encounter patient mismatch." };
      }

      resolvedPatientId = encounterData.patientId;
    }

    // 4. Authorize Patient Context if provided (or resolved from encounter)
    if (resolvedPatientId) {
      const patientDoc = await db.collection("patients").doc(resolvedPatientId).get();
      if (!patientDoc.exists) {
        return { authorized: false, errorReason: "Access denied. Patient record not found or inaccessible." };
      }

      const patientData = patientDoc.data();
      if (!patientData) {
        return { authorized: false, errorReason: "Access denied. Patient record not found or inaccessible." };
      }

      // Organization boundary check
      if (patientData.organizationId !== organizationId) {
        return { authorized: false, errorReason: "Access denied. Organization boundary mismatch." };
      }

      // Clinic alignment check
      if (patientData.clinicId !== clinicId) {
        return { authorized: false, errorReason: "Access denied. Clinic boundary mismatch." };
      }

      // Doctor assignment check
      const assignedDoctor = patientData.assignedDoctor;
      const practitionerId = patientData.practitionerId;
      const isAssigned = (assignedDoctor === doctorId) || (practitionerId === doctorId);

      if (!isAssigned) {
        return { authorized: false, errorReason: "Access denied. Patient not assigned to this doctor." };
      }
    }

    return {
      authorized: true,
      organizationId,
      clinicId,
      resolvedPatientId
    };
  }
}
