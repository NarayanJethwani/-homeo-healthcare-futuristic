import { AdminRole } from "@/lib/security/rbac";
import { 
  PractitionerAccount, 
  PractitionerInvitation, 
  PractitionerAccountStatus, 
  PractitionerInviteStatus 
} from "./types";
import { 
  generateInvitationToken, 
  hashInvitationToken, 
  getInvitationExpiry,
  verifyInvitationToken
} from "./invitationTokenService";
import { logSecurityEvent } from "@/lib/security/auditLogger";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const memoryPractitionerAccounts: PractitionerAccount[] = [];
export const memoryPractitionerInvitations: PractitionerInvitation[] = [];

function isFirebaseAvailable(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id"
  );
}

export async function getPractitionerAccounts(): Promise<PractitionerAccount[]> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const snap = await db.collection("practitioner_accounts").get();
      return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as PractitionerAccount));
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore load failed, falling back to memory.");
    }
  }
  return memoryPractitionerAccounts;
}

export async function getPractitionerById(id: string): Promise<PractitionerAccount | null> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const doc = await db.collection("practitioner_accounts").doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as PractitionerAccount;
      }
      return null;
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore load failed, falling back to memory.");
    }
  }
  return memoryPractitionerAccounts.find(acc => acc.id === id) || null;
}

export async function getPractitionerByEmail(email: string): Promise<PractitionerAccount | null> {
  const normalizedEmail = email.toLowerCase().trim();
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const snap = await db.collection("practitioner_accounts")
        .where("email", "==", normalizedEmail)
        .limit(1)
        .get();
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as PractitionerAccount;
      }
      return null;
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore query failed, falling back to memory.");
    }
  }
  return memoryPractitionerAccounts.find(acc => acc.email.toLowerCase().trim() === normalizedEmail) || null;
}

export async function getPractitionerByUid(uid: string): Promise<PractitionerAccount | null> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const snap = await db.collection("practitioner_accounts")
        .where("uid", "==", uid)
        .limit(1)
        .get();
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as PractitionerAccount;
      }
      return null;
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore query failed, falling back to memory.");
    }
  }
  return memoryPractitionerAccounts.find(acc => acc.uid === uid) || null;
}

export async function createPractitionerInvite(input: {
  email: string;
  role: AdminRole;
  invitedBy: string;
}): Promise<{ invitation: PractitionerInvitation; rawToken: string }> {
  const email = input.email.toLowerCase().trim();
  
  // 1. Block duplicate active account
  const existingAccount = await getPractitionerByEmail(email);
  if (existingAccount && existingAccount.status === "active") {
    throw new Error("An active account already exists for this email address.");
  }

  // 2. Block duplicate pending invite
  let pendingInvite: PractitionerInvitation | null = null;
  const nowStr = new Date().toISOString();

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const snap = await db.collection("practitioner_invitations")
        .where("email", "==", email)
        .where("status", "==", "pending")
        .get();
      
      const invites = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as PractitionerInvitation));
      pendingInvite = invites.find((inv: PractitionerInvitation) => inv.expiresAt > nowStr) || null;
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore query failed, falling back to memory.");
      const invites = memoryPractitionerInvitations.filter(i => i.email.toLowerCase().trim() === email && i.status === "pending");
      pendingInvite = invites.find(inv => inv.expiresAt > nowStr) || null;
    }
  } else {
    const invites = memoryPractitionerInvitations.filter(i => i.email.toLowerCase().trim() === email && i.status === "pending");
    pendingInvite = invites.find(inv => inv.expiresAt > nowStr) || null;
  }

  if (pendingInvite) {
    throw new Error("A pending invitation already exists for this email address.");
  }

  // 3. Generate token
  const rawToken = generateInvitationToken();
  const tokenHash = hashInvitationToken(rawToken);
  const inviteId = "inv_" + Math.random().toString(36).substr(2, 9);
  
  const invitation: PractitionerInvitation = {
    id: inviteId,
    email,
    role: input.role,
    status: "pending",
    tokenHash,
    invitedBy: input.invitedBy,
    createdAt: nowStr,
    expiresAt: getInvitationExpiry()
  };

  // 4. Save
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("practitioner_invitations").doc(inviteId).set(invitation);
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore save failed, writing to memory.");
      memoryPractitionerInvitations.push(invitation);
    }
  } else {
    memoryPractitionerInvitations.push(invitation);
  }

  // 5. Audit
  await logSecurityEvent({
    userId: input.invitedBy,
    userEmail: "admin@homeo.healthcare",
    userRole: "admin",
    action: "practitioner_invited",
    resource: `/api/admin/users/invite/${inviteId}`,
    status: "success",
    timestamp: nowStr,
    details: { invitedEmail: email, assignedRole: input.role }
  });

  return { invitation, rawToken };
}

export async function getInvitationByTokenHash(tokenHash: string): Promise<PractitionerInvitation | null> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const snap = await db.collection("practitioner_invitations")
        .where("tokenHash", "==", tokenHash)
        .limit(1)
        .get();
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as PractitionerInvitation;
      }
      return null;
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore query failed, falling back to memory.");
    }
  }
  return memoryPractitionerInvitations.find(inv => inv.tokenHash === tokenHash) || null;
}

export async function getInvitations(): Promise<PractitionerInvitation[]> {
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const snap = await db.collection("practitioner_invitations").get();
      return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as PractitionerInvitation));
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore load failed, falling back to memory.");
    }
  }
  return memoryPractitionerInvitations;
}

export async function acceptPractitionerInvite(
  token: string,
  profileInput: {
    displayName?: string;
    specialties?: string[];
    clinicLocation?: string;
    uid?: string;
  }
): Promise<PractitionerAccount> {
  const hash = hashInvitationToken(token);
  const invitation = await getInvitationByTokenHash(hash);

  if (!invitation) {
    throw new Error("Invalid invitation token.");
  }

  if (invitation.status !== "pending") {
    throw new Error(`Invitation has already been ${invitation.status}.`);
  }

  const nowStr = new Date().toISOString();
  if (invitation.expiresAt < nowStr) {
    throw new Error("Invitation has expired.");
  }

  const accountId = "acc_" + Math.random().toString(36).substr(2, 9);
  const account: PractitionerAccount = {
    id: accountId,
    uid: profileInput.uid,
    email: invitation.email,
    displayName: profileInput.displayName,
    role: invitation.role, // Forced from invite, no override
    status: "active",
    specialties: profileInput.specialties || [],
    clinicLocation: profileInput.clinicLocation || "",
    createdAt: nowStr,
    updatedAt: nowStr,
    invitedBy: invitation.invitedBy,
    activatedAt: nowStr
  };

  // Update DB batch-like
  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const batch = db.batch();
      batch.set(db.collection("practitioner_accounts").doc(accountId), account);
      batch.update(db.collection("practitioner_invitations").doc(invitation.id), {
        status: "accepted",
        acceptedAt: nowStr
      });
      await batch.commit();
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore commit failed, writing to memory fallback.");
      invitation.status = "accepted";
      invitation.acceptedAt = nowStr;
      memoryPractitionerAccounts.push(account);
    }
  } else {
    invitation.status = "accepted";
    invitation.acceptedAt = nowStr;
    memoryPractitionerAccounts.push(account);
  }

  // Audit without exposing token
  await logSecurityEvent({
    userId: profileInput.uid || "onboarded-user",
    userEmail: invitation.email,
    userRole: invitation.role,
    action: "invitation_accepted",
    resource: `/api/admin/invitations/accept/${invitation.id}`,
    status: "success",
    timestamp: nowStr,
    details: { invitationId: invitation.id, email: invitation.email }
  });

  return account;
}

export async function revokePractitionerInvite(inviteId: string, actorId = "system"): Promise<boolean> {
  const nowStr = new Date().toISOString();
  let found = false;

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      const docRef = db.collection("practitioner_invitations").doc(inviteId);
      const doc = await docRef.get();
      if (doc.exists) {
        await docRef.update({
          status: "revoked",
          revokedAt: nowStr
        });
        found = true;
      }
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore update failed, falling back to memory.");
    }
  }

  if (!found) {
    const invite = memoryPractitionerInvitations.find(i => i.id === inviteId);
    if (invite) {
      invite.status = "revoked";
      invite.revokedAt = nowStr;
      found = true;
    }
  }

  if (found) {
    await logSecurityEvent({
      userId: actorId,
      userEmail: "admin@homeo.healthcare",
      userRole: "admin",
      action: "invitation_revoked",
      resource: `/api/admin/users/invitations/${inviteId}/revoke`,
      status: "success",
      timestamp: nowStr,
      details: { inviteId }
    });
    return true;
  }

  return false;
}

export async function updatePractitionerRole(
  accountId: string,
  role: AdminRole,
  actorId?: string
): Promise<PractitionerAccount> {
  const account = await getPractitionerById(accountId);
  if (!account) {
    throw new Error("Practitioner account not found.");
  }

  // Self-protection checks
  if (actorId && actorId === accountId) {
    throw new Error("Users cannot change or self-escalate their own roles.");
  }

  const nowStr = new Date().toISOString();
  const oldRole = account.role;
  account.role = role;
  account.updatedAt = nowStr;

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("practitioner_accounts").doc(accountId).update({
        role,
        updatedAt: nowStr
      });
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore update failed.");
    }
  }

  await logSecurityEvent({
    userId: actorId || "system",
    userEmail: "admin@homeo.healthcare",
    userRole: "admin",
    action: "role_changed",
    resource: `/api/admin/users/${accountId}/role`,
    status: "success",
    timestamp: nowStr,
    details: { accountId, oldRole, newRole: role }
  });

  return account;
}

export async function updatePractitionerProfile(
  accountId: string,
  patch: Partial<PractitionerAccount>
): Promise<PractitionerAccount> {
  const account = await getPractitionerById(accountId);
  if (!account) {
    throw new Error("Practitioner account not found.");
  }

  const nowStr = new Date().toISOString();
  
  // Safe update: ignore sensitive fields like role or status to prevent side-loading
  const safePatch: Partial<PractitionerAccount> = {
    displayName: patch.displayName !== undefined ? patch.displayName : account.displayName,
    specialties: patch.specialties !== undefined ? patch.specialties : account.specialties,
    clinicLocation: patch.clinicLocation !== undefined ? patch.clinicLocation : account.clinicLocation,
    notes: patch.notes !== undefined ? patch.notes : account.notes,
    updatedAt: nowStr
  };

  Object.assign(account, safePatch);

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("practitioner_accounts").doc(accountId).update(safePatch);
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore update failed.");
    }
  }

  await logSecurityEvent({
    userId: account.uid || "system",
    userEmail: account.email,
    userRole: account.role,
    action: "profile_updated",
    resource: `/api/admin/users/${accountId}`,
    status: "success",
    timestamp: nowStr,
    details: { accountId }
  });

  return account;
}

export async function suspendPractitioner(
  accountId: string,
  reason: string,
  actorId?: string
): Promise<PractitionerAccount> {
  const account = await getPractitionerById(accountId);
  if (!account) {
    throw new Error("Practitioner account not found.");
  }

  const nowStr = new Date().toISOString();
  account.status = "suspended";
  account.suspendedAt = nowStr;
  account.updatedAt = nowStr;

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("practitioner_accounts").doc(accountId).update({
        status: "suspended",
        suspendedAt: nowStr,
        updatedAt: nowStr
      });
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore update failed.");
    }
  }

  await logSecurityEvent({
    userId: actorId || "system",
    userEmail: "admin@homeo.healthcare",
    userRole: "admin",
    action: "account_suspended",
    resource: `/api/admin/users/${accountId}/suspend`,
    status: "success",
    timestamp: nowStr,
    details: { accountId, reason }
  });

  return account;
}

export async function reactivatePractitioner(
  accountId: string,
  actorId?: string
): Promise<PractitionerAccount> {
  const account = await getPractitionerById(accountId);
  if (!account) {
    throw new Error("Practitioner account not found.");
  }

  const nowStr = new Date().toISOString();
  account.status = "active";
  account.suspendedAt = undefined;
  account.updatedAt = nowStr;

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("practitioner_accounts").doc(accountId).update({
        status: "active",
        suspendedAt: null,
        updatedAt: nowStr
      });
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore update failed.");
    }
  }

  await logSecurityEvent({
    userId: actorId || "system",
    userEmail: "admin@homeo.healthcare",
    userRole: "admin",
    action: "account_reactivated",
    resource: `/api/admin/users/${accountId}/reactivate`,
    status: "success",
    timestamp: nowStr,
    details: { accountId }
  });

  return account;
}

export async function deactivatePractitioner(
  accountId: string,
  reason: string,
  actorId?: string
): Promise<PractitionerAccount> {
  const account = await getPractitionerById(accountId);
  if (!account) {
    throw new Error("Practitioner account not found.");
  }

  const nowStr = new Date().toISOString();
  account.status = "deactivated";
  account.deactivatedAt = nowStr;
  account.updatedAt = nowStr;

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("practitioner_accounts").doc(accountId).update({
        status: "deactivated",
        deactivatedAt: nowStr,
        updatedAt: nowStr
      });
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore update failed.");
    }
  }

  await logSecurityEvent({
    userId: actorId || "system",
    userEmail: "admin@homeo.healthcare",
    userRole: "admin",
    action: "account_deactivated",
    resource: `/api/admin/users/${accountId}/deactivate`,
    status: "success",
    timestamp: nowStr,
    details: { accountId, reason }
  });

  return account;
}

export async function extendPractitionerSubscription(
  accountId: string,
  expiresAt: string,
  actorId?: string
): Promise<PractitionerAccount> {
  const account = await getPractitionerById(accountId);
  if (!account) {
    throw new Error("Practitioner account not found.");
  }

  const nowStr = new Date().toISOString();
  account.subscriptionExpiresAt = expiresAt;
  account.updatedAt = nowStr;

  if (isFirebaseAvailable()) {
    try {
      const db = getAdminDb();
      await db.collection("practitioner_accounts").doc(accountId).update({
        subscriptionExpiresAt: expiresAt,
        updatedAt: nowStr
      });
    } catch (err) {
      console.warn("[Practitioner Repo] Firestore update failed.");
    }
  }

  await logSecurityEvent({
    userId: actorId || "system",
    userEmail: "admin@homeo.healthcare",
    userRole: "admin",
    action: "subscription_extended",
    resource: `/api/admin/users/${accountId}/subscription`,
    status: "success",
    timestamp: nowStr,
    details: { accountId, expiresAt }
  });

  return account;
}
