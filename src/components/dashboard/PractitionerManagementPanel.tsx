import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Shield, 
  UserCheck, 
  UserX, 
  Clock, 
  Key, 
  AlertTriangle,
  Clipboard,
  Calendar,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  Edit2
} from "lucide-react";
import { AdminUsersClient } from "@/features/admin-users/adminUsersClient";
import { PractitionerAccount, PractitionerInvitation } from "@/features/admin-users/types";
import { AdminRole, normalizeRole, hasPermission } from "@/lib/security/rbac";

interface PractitionerManagementPanelProps {
  session: any;
}

export function PractitionerManagementPanel({ session }: PractitionerManagementPanelProps) {
  const [accounts, setAccounts] = useState<PractitionerAccount[]>([]);
  const [invitations, setInvitations] = useState<PractitionerInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("read-only-admin");
  const [newInviteToken, setNewInviteToken] = useState<string | null>(null);
  const [newInviteLink, setNewInviteLink] = useState<string | null>(null);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);

  // Modals / Action states
  const [selectedUser, setSelectedUser] = useState<PractitionerAccount | null>(null);
  const [actionType, setActionType] = useState<"role" | "suspend" | "deactivate" | "extend" | "profile" | null>(null);
  
  const [targetRole, setTargetRole] = useState<AdminRole>("read-only-admin");
  const [suspendReason, setSuspendReason] = useState("");
  const [deactivateReason, setDeactivateReason] = useState("");
  const [subExpiryDate, setSubExpiryDate] = useState("");
  
  // Profile edit patch state
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editClinicLocation, setEditClinicLocation] = useState("");
  const [editSpecialties, setEditSpecialties] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const userRole = session?.role ? normalizeRole(session.role) : "read-only-admin";
  const hasUserManage = hasPermission(userRole, "USER_MANAGE");
  const hasSubscriptionManage = hasPermission(userRole, "SUBSCRIPTION_MANAGE");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const accRes = await AdminUsersClient.listPractitioners();
      const invRes = await AdminUsersClient.listInvitations();
      setAccounts(accRes.accounts || []);
      setInvitations(invRes.invitations || []);
    } catch (err: any) {
      setError(err.message || "Failed to load user management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNewInviteToken(null);
    setNewInviteLink(null);
    setInviteSuccessMsg(null);
    
    try {
      const res = await AdminUsersClient.createInvitation({
        email: inviteEmail,
        role: inviteRole
      });
      setNewInviteToken(res.rawToken);
      setNewInviteLink(res.inviteLink);
      setInviteSuccessMsg(res.warning || "Invitation successfully generated!");
      setInviteEmail("");
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to create invitation.");
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    if (!window.confirm("Are you sure you want to revoke this invitation?")) return;
    try {
      await AdminUsersClient.revokeInvitation(inviteId);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to revoke invitation.");
    }
  };

  const executeUserAction = async () => {
    if (!selectedUser) return;
    setError(null);
    try {
      if (actionType === "role") {
        if (selectedUser.id === session.uid) {
          alert("Safety Block: You cannot change your own role.");
          return;
        }
        const confirmMsg = `WARNING: Changing ${selectedUser.displayName || selectedUser.email}'s role to ${targetRole} will modify their administrative permissions. Confirm role change?`;
        if (!window.confirm(confirmMsg)) return;

        await AdminUsersClient.updateRole(selectedUser.id, targetRole);
      } else if (actionType === "suspend") {
        if (!suspendReason.trim()) {
          alert("Reason is required to suspend an account.");
          return;
        }
        await AdminUsersClient.suspendUser(selectedUser.id, suspendReason);
      } else if (actionType === "deactivate") {
        if (!deactivateReason.trim()) {
          alert("Reason is required to deactivate an account.");
          return;
        }
        if (!window.confirm("Deactivating an account will permanently revoke their access. Continue?")) return;
        await AdminUsersClient.deactivateUser(selectedUser.id, deactivateReason);
      } else if (actionType === "extend") {
        if (!subExpiryDate) {
          alert("Expiry date is required.");
          return;
        }
        await AdminUsersClient.extendSubscription(selectedUser.id, new Date(subExpiryDate).toISOString());
      } else if (actionType === "profile") {
        const specialtiesArray = editSpecialties.split(",").map(s => s.trim()).filter(Boolean);
        await AdminUsersClient.updatePractitionerProfile(selectedUser.id, {
          displayName: editDisplayName,
          clinicLocation: editClinicLocation,
          specialties: specialtiesArray,
          notes: editNotes
        });
      }
      
      // Reset action states
      setActionType(null);
      setSelectedUser(null);
      setSuspendReason("");
      setDeactivateReason("");
      setSubExpiryDate("");
      loadData();
    } catch (err: any) {
      setError(err.message || "Action failed.");
    }
  };

  const handleReactivate = async (userId: string) => {
    try {
      await AdminUsersClient.reactivateUser(userId);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to reactivate account.");
    }
  };

  const openActionModal = (user: PractitionerAccount, type: "role" | "suspend" | "deactivate" | "extend" | "profile") => {
    setSelectedUser(user);
    setActionType(type);
    if (type === "role") {
      setTargetRole(user.role);
    } else if (type === "profile") {
      setEditDisplayName(user.displayName || "");
      setEditClinicLocation(user.clinicLocation || "");
      setEditSpecialties(user.specialties?.join(", ") || "");
      setEditNotes(user.notes || "");
    }
  };

  // Metrics rollup
  const totalPractitioners = accounts.length;
  const activeCount = accounts.filter(a => a.status === "active").length;
  const invitedCount = accounts.filter(a => a.status === "invited").length;
  const suspendedCount = accounts.filter(a => a.status === "suspended").length;
  const deactivatedCount = accounts.filter(a => a.status === "deactivated").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Premium Glassmorphic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/[0.02] border border-slate-900/5 rounded-3xl p-6 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-serif font-extrabold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Practitioner Account Lifecycle & Admin Cockpit
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Manage operational access, role-based boundaries, and subscriptions. All events are logged to the security audit trail.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 text-xs font-bold bg-slate-950 text-white rounded-xl hover:bg-slate-800 transition cursor-pointer border-none"
        >
          Refresh Ledger
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* A. Account Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Accounts", val: totalPractitioners, grad: "from-blue-500 to-indigo-500" },
          { label: "Active", val: activeCount, grad: "from-emerald-500 to-teal-500" },
          { label: "Pending Invites", val: invitedCount + invitations.filter(i => i.status === "pending").length, grad: "from-amber-500 to-orange-500" },
          { label: "Suspended", val: suspendedCount, grad: "from-rose-500 to-pink-500" },
          { label: "Deactivated", val: deactivatedCount, grad: "from-slate-600 to-slate-700" }
        ].map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">{card.label}</span>
            <div className="text-2xl font-serif font-extrabold text-slate-800 mt-2">{card.val}</div>
            <div className={`absolute right-0 bottom-0 w-1.5 h-12 bg-gradient-to-t ${card.grad} rounded-l-md`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* B. Practitioner List (Left/Main Column) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Registered Practitioners
            </h3>
            
            {loading ? (
              <div className="text-center py-8 text-xs text-slate-400">Loading ledger...</div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">No registered accounts found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase font-extrabold text-slate-400">
                      <th className="pb-3 pl-2">Practitioner</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Subscription</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(acc => (
                      <tr key={acc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition text-xs">
                        <td className="py-3.5 pl-2">
                          <div className="font-bold text-slate-800">{acc.displayName || "Awaiting Setup"}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{acc.email}</div>
                        </td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase">
                            <Shield className="w-3 h-3" />
                            {acc.role}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            acc.status === "active" ? "bg-emerald-50 text-emerald-700" :
                            acc.status === "suspended" ? "bg-rose-50 text-rose-700" :
                            acc.status === "deactivated" ? "bg-slate-100 text-slate-700" :
                            "bg-amber-50 text-amber-700"
                          }`}>
                            {acc.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-500 font-sans">
                          {acc.subscriptionExpiresAt ? (
                            <span className={new Date(acc.subscriptionExpiresAt) < new Date() ? "text-rose-600 font-bold" : ""}>
                              {new Date(acc.subscriptionExpiresAt).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-slate-300">Lifetime</span>
                          )}
                        </td>
                        <td className="py-3.5 text-right pr-2 space-x-1">
                          {acc.id !== session.uid && acc.status === "active" && (
                            <>
                              <button
                                onClick={() => openActionModal(acc, "profile")}
                                className="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md border-none cursor-pointer hover:bg-slate-200"
                                title="Edit Profile"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => openActionModal(acc, "role")}
                                className="px-2 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md border-none cursor-pointer hover:bg-indigo-100"
                                title="Change Role"
                              >
                                Role
                              </button>
                              <button
                                onClick={() => openActionModal(acc, "suspend")}
                                className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-md border-none cursor-pointer hover:bg-amber-100"
                                title="Suspend Account"
                              >
                                Suspend
                              </button>
                              <button
                                onClick={() => openActionModal(acc, "deactivate")}
                                className="px-2 py-1 text-[10px] font-bold bg-rose-50 text-rose-700 rounded-md border-none cursor-pointer hover:bg-rose-100"
                                title="Deactivate"
                              >
                                Deactivate
                              </button>
                            </>
                          )}
                          {acc.status === "suspended" && (
                            <button
                              onClick={() => handleReactivate(acc.id)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-md border-none cursor-pointer hover:bg-emerald-100"
                            >
                              Reactivate
                            </button>
                          )}
                          {hasSubscriptionManage && acc.status === "active" && (
                            <button
                              onClick={() => openActionModal(acc, "extend")}
                              className="px-2 py-1 text-[10px] font-bold bg-teal-50 text-teal-700 rounded-md border-none cursor-pointer hover:bg-teal-100"
                              title="Extend Subscription"
                            >
                              Expiry
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* C. Invitation Management (Right Column) */}
        <div className="space-y-6">
          {/* Create Invite Form */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              Invite Practitioner
            </h3>
            
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@clinic.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  <option value="super-admin">Super Admin</option>
                  <option value="clinical-reviewer">Clinical Reviewer</option>
                  <option value="editorial-editor">Editorial Editor</option>
                  <option value="support-operator">Support Operator</option>
                  <option value="read-only-admin">Read-Only Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer border-none"
              >
                Generate Secure Token
              </button>
            </form>

            {/* One-time Token Presentation Box */}
            {newInviteToken && (
              <div className="mt-4 p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-2 border border-slate-800 relative overflow-hidden">
                <div className="text-[9px] uppercase font-extrabold text-amber-400 tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  One-Time Cryptographic Token
                </div>
                <div className="font-mono bg-slate-950 p-2 rounded-lg break-all select-all flex items-center justify-between border border-slate-800">
                  <span className="text-[10px] text-teal-300">{newInviteToken}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newInviteToken);
                      alert("Token copied!");
                    }}
                    className="p-1 hover:bg-slate-800 rounded bg-transparent border-none cursor-pointer text-slate-400 hover:text-white ml-2"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {newInviteLink && (
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Acceptance Link</div>
                    <div className="font-mono bg-slate-950 p-2 rounded-lg break-all select-all text-[9px] text-slate-300 border border-slate-800">
                      {newInviteLink}
                    </div>
                  </div>
                )}
                
                <p className="text-[9px] text-slate-400 italic">
                  {inviteSuccessMsg}
                </p>
              </div>
            )}
          </div>

          {/* Pending Invitations list */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending Invitations
            </h3>

            {loading ? (
              <div className="text-center py-4 text-xs text-slate-400">Loading ledger...</div>
            ) : invitations.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">No invitations.</div>
            ) : (
              <div className="space-y-3">
                {invitations.map(inv => (
                  <div key={inv.id} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{inv.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Role: <span className="font-bold">{inv.role}</span></div>
                      <div className="text-[9px] text-slate-400">Expires: {new Date(inv.expiresAt).toLocaleDateString()}</div>
                      <div className="text-[9px] mt-1 font-bold">
                        Status: <span className={`uppercase text-[9px] ${
                          inv.status === "pending" ? "text-amber-600" :
                          inv.status === "accepted" ? "text-emerald-600" :
                          "text-rose-600"
                        }`}>{inv.status}</span>
                      </div>
                    </div>
                    {inv.status === "pending" && (
                      <button
                        onClick={() => handleRevokeInvite(inv.id)}
                        className="py-1 bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-bold cursor-pointer transition w-full"
                      >
                        Revoke Invitation
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* D. Action Modals (Simulated inline for clean single page view) */}
      {selectedUser && actionType && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl max-w-md w-full space-y-4 animate-in zoom-in duration-200">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Configure {selectedUser.displayName || selectedUser.email}
            </h4>

            {actionType === "role" && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Role changes affect administrative access. Use only after approval. Downgrades or privilege modifications trigger real-time alerts.
                  </span>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Select Administrative Role</label>
                  <select
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="super-admin">Super Admin</option>
                    <option value="clinical-reviewer">Clinical Reviewer</option>
                    <option value="editorial-editor">Editorial Editor</option>
                    <option value="support-operator">Support Operator</option>
                    <option value="read-only-admin">Read-Only Admin</option>
                  </select>
                </div>
              </div>
            )}

            {actionType === "suspend" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Suspension blocks the practitioner's access immediately. Their session cookies will be rejected.
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Reason for Suspension</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Account audit in progress"
                    value={suspendReason}
                    onChange={e => setSuspendReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {actionType === "deactivate" && (
              <div className="space-y-3">
                <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100">
                  Deactivation is terminal. Access will be revoked.
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Reason for Deactivation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Practitioner left the clinic"
                    value={deactivateReason}
                    onChange={e => setDeactivateReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {actionType === "extend" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Extend clinical licensing access and portal tools for this user. Gated by subscription controls.
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={subExpiryDate}
                    onChange={e => setSubExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {actionType === "profile" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={e => setEditDisplayName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl mb-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Clinic Location</label>
                  <input
                    type="text"
                    value={editClinicLocation}
                    onChange={e => setEditClinicLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl mb-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Specialties (comma-separated)</label>
                  <input
                    type="text"
                    value={editSpecialties}
                    onChange={e => setEditSpecialties(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl mb-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-1">Internal Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl h-20"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => {
                  setActionType(null);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={executeUserAction}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer border-none"
              >
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
