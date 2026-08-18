"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Users, Folder, FileSpreadsheet, ExternalLink,
  ShieldAlert, RefreshCw, X, CheckCircle, AlertCircle,
  IndianRupee, Stethoscope, Mail, Phone, ChevronRight,
  Loader, CreditCard, Clock, RotateCcw, Trash2,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, getDocs, where } from "firebase/firestore";
import { DOCTOR_PORTAL_MONTHLY_PRICE_INR, formatDoctorPortalMonthlyPrice } from "@/lib/doctorSubscriptionConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DoctorRecord {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  speciality?: string;
  driveFolderUrl?: string;
  masterSheetUrl?: string;
  subscription?: {
    plan: string;
    validUntil: string;
    status: string;
    renewedAt?: string;
    note?: string;
  };
  onboardedAt?: string;
  patientCount?: number;
  isMockWorkspace?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_LABELS: Record<string, string> = {
  trial:     "First Month Free",
  branch:    "Branch Doctor (Permanent)",
  monthly:   `Monthly — ₹${DOCTOR_PORTAL_MONTHLY_PRICE_INR.toLocaleString("en-IN")}`,
  quarterly: "Legacy Quarterly (renew monthly)",
  annual:    "Legacy Annual (renew monthly)",
};

const PLAN_PRICES: Record<string, string> = {
  trial:     "Free",
  branch:    "Branch (Free)",
  monthly:   formatDoctorPortalMonthlyPrice(),
  quarterly: "Legacy plan",
  annual:    "Legacy plan",
};

const MOCK_DOCTORS: DoctorRecord[] = [
  {
    uid: "mock-doctor-1", name: "Dr. Priya Sharma", email: "priya@homeo.healthcare",
    phone: "+91 98765 43210", speciality: "Paediatric Homeopathy",
    driveFolderUrl: "#", masterSheetUrl: "#",
    subscription: { plan: "trial", validUntil: (() => { const d = new Date(); d.setDate(d.getDate() + 9); return d.toISOString().split("T")[0]; })(), status: "active" },
    onboardedAt: new Date(Date.now() - 5 * 86400000).toISOString(), patientCount: 7,
  },
  {
    uid: "mock-doctor-2", name: "Dr. Maneesh Verma", email: "maneesh@clinic.com",
    phone: "+91 87654 32109", speciality: "Geriatric Care",
    driveFolderUrl: "#", masterSheetUrl: "#",
    subscription: { plan: "monthly", validUntil: (() => { const d = new Date(); d.setDate(d.getDate() + 22); return d.toISOString().split("T")[0]; })(), status: "active" },
    onboardedAt: new Date(Date.now() - 35 * 86400000).toISOString(), patientCount: 18,
  },
];

// ─── Badge helper ─────────────────────────────────────────────────────────────

function getSubscriptionBadge(sub?: DoctorRecord["subscription"]) {
  if (!sub) return { label: "Unknown", color: "bg-slate-100 text-slate-500 border-slate-200" };
  if (sub.plan === "branch") return { label: "Branch Doctor", color: "bg-violet-50 text-violet-700 border-violet-200" };
  const daysLeft = Math.floor((new Date(sub.validUntil).getTime() - Date.now()) / 86400000);
  if (daysLeft < 0)  return { label: "Expired",             color: "bg-rose-50   text-rose-700   border-rose-200",   daysLeft };
  if (daysLeft <= 3) return { label: `Expires in ${daysLeft}d`, color: "bg-red-50    text-red-700    border-red-200",    daysLeft };
  if (daysLeft <= 7) return { label: `Expires in ${daysLeft}d`, color: "bg-amber-50 text-amber-700 border-amber-200", daysLeft };
  if (sub.plan === "trial") return { label: `Trial — ${daysLeft}d left`, color: "bg-sky-50 text-sky-700 border-sky-200", daysLeft };
  return { label: "Active", color: "bg-emerald-50 text-emerald-700 border-emerald-200", daysLeft };
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManageDoctorsPanel() {
  const [doctors,       setDoctors]       = useState<DoctorRecord[]>([]);
  const [patientCounts, setPatientCounts] = useState<Record<string, number>>({});
  const [loading,       setLoading]       = useState(true);
  const [refreshKey,    setRefreshKey]    = useState(0);

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "", email: "", phone: "", speciality: "General Homeopathy", plan: "trial",
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult,  setInviteResult]  = useState<{ success: boolean; message: string; passwordSetupLink?: string } | null>(null);

  // Extend subscription modal
  const [extendTarget,  setExtendTarget]  = useState<DoctorRecord | null>(null);
  const [extendPlan,    setExtendPlan]    = useState("monthly");
  const [extendNote,    setExtendNote]    = useState("");
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendResult,  setExtendResult]  = useState<{ success: boolean; message: string } | null>(null);

  // Remove doctor modal
  const [removeTarget,  setRemoveTarget]  = useState<DoctorRecord | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeResult,  setRemoveResult]  = useState<{ success: boolean; message: string } | null>(null);

  const isFirebaseReady =
    typeof window !== "undefined" &&
    !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id";

  // ── Load doctors ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    if (!isFirebaseReady) {
      setDoctors(MOCK_DOCTORS);
      setLoading(false);
      return;
    }
    const q = query(collection(db, "doctors"), orderBy("onboardedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setDoctors(snap.docs.map(d => ({ uid: d.id, ...d.data() } as DoctorRecord)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [refreshKey]);

  // ── Count patients ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!doctors.length || !isFirebaseReady) return;
    const counts: Record<string, number> = {};
    Promise.all(
      doctors.map(async doc => {
        try {
          const snap = await getDocs(query(collection(db, "patients"), where("assignedDoctor", "==", doc.uid)));
          counts[doc.uid] = snap.size;
        } catch { counts[doc.uid] = doc.patientCount ?? 0; }
      })
    ).then(() => setPatientCounts({ ...counts }));
  }, [doctors]);

  const [now] = useState(() => Date.now());

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const activeCount   = doctors.filter(d => {
    if (d.subscription?.plan === "branch") return true;
    const daysLeft = Math.floor((new Date(d.subscription?.validUntil || "").getTime() - now) / 86400000);
    return daysLeft >= 0;
  }).length;
  const totalPatients = Object.values(patientCounts).reduce((a, b) => a + b, 0) ||
    doctors.reduce((s, d) => s + (d.patientCount ?? 0), 0);
  const monthlyRevenue = doctors.reduce((sum, d) => {
    if (!d.subscription || d.subscription.plan === "trial" || d.subscription.plan === "branch") return sum;
    const rates: Record<string, number> = { monthly: DOCTOR_PORTAL_MONTHLY_PRICE_INR, quarterly: DOCTOR_PORTAL_MONTHLY_PRICE_INR, annual: DOCTOR_PORTAL_MONTHLY_PRICE_INR };
    return sum + (rates[d.subscription.plan] ?? 0);
  }, 0);

  // ── Invite handler ─────────────────────────────────────────────────────────────
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteResult(null);
    try {
      const res  = await fetch("/api/onboard-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inviteForm),
      });
      const data = await res.json();
      if (data.success) {
        setInviteResult({
          success: true,
          message: `${inviteForm.name} was onboarded. Copy and securely share the password-setup link below.`,
          passwordSetupLink: data.passwordSetupLink,
        });
        setRefreshKey(k => k + 1);
      } else {
        setInviteResult({ success: false, message: data.message || "Onboarding failed." });
      }
    } catch (err: any) {
      setInviteResult({ success: false, message: err.message || "Network error." });
    } finally {
      setInviteLoading(false);
    }
  };

  // ── Extend subscription handler ───────────────────────────────────────────────
  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendTarget) return;
    setExtendLoading(true);
    setExtendResult(null);
    try {
      const res  = await fetch("/api/admin/extend-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorUid: extendTarget.uid, plan: extendPlan, note: extendNote }),
      });
      const data = await res.json();
      if (data.success) {
        setExtendResult({ success: true, message: `✅ ${extendTarget.name}'s subscription extended to ${extendPlan} plan. Valid until ${data.validUntil}.` });
        setRefreshKey(k => k + 1);
        setTimeout(() => { setExtendTarget(null); setExtendResult(null); setExtendNote(""); }, 3500);
      } else {
        setExtendResult({ success: false, message: data.message || "Extension failed." });
      }
    } catch (err: any) {
      setExtendResult({ success: false, message: err.message || "Network error." });
    } finally {
      setExtendLoading(false);
    }
  };

  // ── Remove doctor handler ──────────────────────────────────────────────────────
  const handleRemove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!removeTarget) return;
    setRemoveLoading(true);
    setRemoveResult(null);
    try {
      const res = await fetch("/api/admin/remove-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorUid: removeTarget.uid }),
      });
      const data = await res.json();
      if (data.success) {
        setRemoveResult({ success: true, message: `✅ ${removeTarget.name} has been removed. Patient records preserved.` });
        setRefreshKey(k => k + 1);
        setTimeout(() => { setRemoveTarget(null); setRemoveResult(null); }, 3000);
      } else {
        setRemoveResult({ success: false, message: data.message || "Removal failed." });
      }
    } catch (err: any) {
      setRemoveResult({ success: false, message: err.message || "Network error." });
    } finally {
      setRemoveLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/5 pb-5">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1A2421] flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-violet-600" />
            </span>
            Franchise Doctor Directory
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1 ml-12">
            {doctors.length} franchisee{doctors.length !== 1 ? "s" : ""} — each with isolated Drive folder &amp; records
            {!isFirebaseReady && <span className="ml-2 text-amber-500">(preview mode — mock data)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2.5 ml-12 sm:ml-0">
          <button
            onClick={() => setRefreshKey(k => k + 1)} title="Refresh"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => { setShowInviteModal(true); setInviteResult(null); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Invite New Doctor
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Doctors",    value: doctors.length, icon: Users,        color: "text-violet-600" },
          { label: "Active Plans",     value: activeCount,    icon: CheckCircle,  color: "text-emerald-600" },
          { label: "Total Patients",   value: totalPatients,  icon: Stethoscope,  color: "text-sky-600" },
          { label: "Est. Monthly Rev", value: `₹${monthlyRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-amber-600" },
        ].map(stat => (
          <div key={stat.label} className="glass-panel border-white/60 p-4 rounded-2xl">
            <div className={`${stat.color} mb-1`}><stat.icon className="w-4 h-4" /></div>
            <div className="text-lg font-bold text-[#1A2421] font-serif">{stat.value}</div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader className="w-6 h-6 text-violet-400 animate-spin mr-3" />
          <span className="text-sm text-slate-500 font-semibold">Loading franchise network…</span>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-violet-200 rounded-3xl">
          <UserPlus className="w-10 h-10 text-violet-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">No doctors onboarded yet</p>
          <p className="text-xs text-slate-400 mt-1">Click "Invite New Doctor" to add your first franchisee.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {doctors.map(doctor => {
            const badge    = getSubscriptionBadge(doctor.subscription);
            const count    = patientCounts[doctor.uid] ?? doctor.patientCount ?? 0;
            const isTrial  = doctor.subscription?.plan === "trial";
            const isExpired = (badge.daysLeft ?? 0) < 0;
            const urgentRenew = (badge.daysLeft ?? 99) <= 7;

            return (
              <motion.div
                key={doctor.uid}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className={`glass-panel p-5 rounded-3xl flex flex-col gap-4 border ${
                  isExpired ? "border-rose-200 bg-rose-50/20" :
                  urgentRenew ? "border-amber-200 bg-amber-50/10" :
                  "border-white/60"
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 border border-violet-200 flex items-center justify-center text-sm font-bold text-violet-700">
                      {initials(doctor.name)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A2421] leading-tight">{doctor.name}</h4>
                      <p className="text-[10px] text-violet-600 font-semibold">{doctor.speciality || "General Homeopathy"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <button
                      onClick={() => { setRemoveTarget(doctor); setRemoveResult(null); }}
                      title="Remove Doctor"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold">
                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" /><span className="truncate">{doctor.email}</span>
                  </div>
                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold">
                      <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" /><span>{doctor.phone}</span>
                    </div>
                  )}
                </div>

                {/* Trial limit bar */}
                {isTrial && (
                  <div className="bg-sky-50 border border-sky-100 rounded-2xl px-3.5 py-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] text-sky-600 font-bold uppercase tracking-wide">Trial Patients Used</span>
                      <span className="text-[10px] font-bold text-sky-700">{count}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-sky-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                      />
                    </div>
                    {count >= 8 && (
                      <p className="text-[9px] text-sky-700 font-bold mt-1.5">
                        ⚠️ {10 - count} patient slot{10 - count === 1 ? "" : "s"} remaining — suggest upgrading
                      </p>
                    )}
                  </div>
                )}

                {/* Patient count (non-trial) */}
                {!isTrial && (
                  <div className="flex items-center justify-between bg-slate-50/80 rounded-2xl px-4 py-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Patients</span>
                    <span className="text-sm font-bold text-[#1A2421]">{count}</span>
                  </div>
                )}

                {/* Workspace links */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: doctor.driveFolderUrl, label: "Drive Folder", Icon: Folder,          color: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100" },
                    { href: doctor.masterSheetUrl, label: "Master Sheet", Icon: FileSpreadsheet,  color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
                  ].map(({ href, label, Icon, color }) => (
                    <a
                      key={label}
                      href={href && !doctor.isMockWorkspace ? href : "#"}
                      target={href && !doctor.isMockWorkspace ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold transition-all ${
                        href && !doctor.isMockWorkspace
                          ? `${color} cursor-pointer`
                          : "border-slate-200 bg-slate-50 text-slate-400 cursor-default"
                      }`}
                    >
                      <Icon className="w-3 h-3 flex-shrink-0" />
                      {label}
                      {href && !doctor.isMockWorkspace && <ExternalLink className="w-2.5 h-2.5 ml-auto" />}
                    </a>
                  ))}
                </div>

                {/* Subscription row */}
                <div className="border-t border-slate-100 pt-3 grid grid-cols-3 gap-1 text-center">
                  {[
                    { label: "Plan",  value: PLAN_PRICES[doctor.subscription?.plan || ""] || doctor.subscription?.plan || "—" },
                    { label: "Valid Until", value: doctor.subscription?.validUntil ? new Date(doctor.subscription.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—" },
                    { label: "Joined", value: doctor.onboardedAt ? new Date(doctor.onboardedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }) : "—" },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">{item.label}</p>
                      <p className="text-[10px] text-slate-700 font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Extend / Mark as Paid button */}
                <button
                  onClick={() => { setExtendTarget(doctor); setExtendPlan("monthly"); setExtendNote(""); setExtendResult(null); }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    isExpired
                      ? "bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-[0_4px_12px_rgba(220,38,38,0.3)]"
                      : urgentRenew
                      ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
                      : isTrial
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.25)] hover:shadow-[0_6px_16px_rgba(124,58,237,0.4)]"
                      : "border-slate-200 text-slate-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700"
                  }`}
                >
                  {isExpired ? <><RotateCcw className="w-3.5 h-3.5" /> Restore Access — Collect Payment</> :
                   urgentRenew ? <><Clock className="w-3.5 h-3.5" /> Renew Before Expiry</> :
                   isTrial ? <><CreditCard className="w-3.5 h-3.5" /> Convert Trial → Paid Plan</> :
                   <><CreditCard className="w-3.5 h-3.5" /> Mark as Paid / Extend</>}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Security Notice */}
      <div className="p-4 border border-violet-100 bg-violet-50/50 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-4.5 h-4.5 text-violet-600 flex-shrink-0 mt-0.5" />
        <div className="text-[10px] text-slate-600 font-semibold leading-relaxed">
          <strong className="text-violet-700 block mb-1 uppercase tracking-wide">Server-Side Isolation Active</strong>
          Firestore rules enforce true data isolation — each doctor can <em>only</em> query patients with <code>assignedDoctor == their UID</code>.
          Their Drive folder and Master Sheet are separately provisioned. No shared data is ever visible across franchisees.
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          INVITE NEW DOCTOR MODAL
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowInviteModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] border border-slate-200/80 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white relative">
                <h3 className="font-serif font-bold text-lg">Invite New Doctor</h3>
                <p className="text-xs text-white/70 mt-1">Drive folder, Sheet &amp; login auto-provisioned on submit.</p>
                <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-all">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="p-6 space-y-4">
                {inviteResult && (
                  <div className={`p-3.5 rounded-2xl text-xs font-semibold ${inviteResult.success ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-rose-50 border border-rose-100 text-rose-700"}`}>
                    <div className="flex items-start gap-2.5">
                      {inviteResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />}
                      <span>{inviteResult.message}</span>
                    </div>
                    {inviteResult.passwordSetupLink && (
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(inviteResult.passwordSetupLink || "")}
                        className="mt-3 min-h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                      >
                        Copy password-setup link
                      </button>
                    )}
                  </div>
                )}

                {[
                  { label: "Full Name *", key: "name", type: "text",  placeholder: "Dr. Priya Sharma" },
                  { label: "Email *",     key: "email", type: "email", placeholder: "priya@clinic.com" },
                  { label: "Phone",       key: "phone", type: "tel",   placeholder: "+91 98765 43210" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">{field.label}</label>
                    <input
                      type={field.type} required={field.label.includes("*")} placeholder={field.placeholder}
                      value={(inviteForm as any)[field.key]}
                      onChange={e => setInviteForm({ ...inviteForm, [field.key]: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-1 focus:ring-violet-300 outline-none bg-white text-sm font-medium text-[#1A2421] transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Speciality</label>
                  <select
                    value={inviteForm.speciality}
                    onChange={e => setInviteForm({ ...inviteForm, speciality: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 outline-none bg-white text-sm font-medium text-[#1A2421] transition-all cursor-pointer"
                  >
                    {["General Homeopathy","Paediatric Homeopathy","Geriatric Care","Veterinary Homeopathy","Women's Health","Skin & Dermatology","Mental Health & Counselling"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Plan selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Starting Plan</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "trial",     label: "First Month Free",  sub: "Then ₹1,000/month", highlight: true },
                      { value: "branch",    label: "Branch Doctor", sub: "Permanent access" },
                      { value: "monthly",   label: "Monthly",     sub: "₹1,000/month" },
                    ].map(plan => (
                      <button key={plan.value} type="button"
                        onClick={() => setInviteForm({ ...inviteForm, plan: plan.value })}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                          inviteForm.plan === plan.value
                            ? "border-violet-400 bg-violet-50 text-violet-700"
                            : "border-slate-200 text-slate-600 hover:border-violet-200"
                        }`}
                      >
                        {plan.highlight && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">RECOMMENDED</span>}
                        <div className="text-[10px] font-bold mt-1">{plan.label}</div>
                        <div className="text-[9px] font-semibold text-slate-500">{plan.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-provision list */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-2">Auto-Provisioned On Invite:</p>
                  {["🔐 Firebase Auth account + password-setup email", "📁 Private Google Drive folder", "📊 Private Master Record Sheet", "🛡️ Firestore patient isolation rules"].map(item => (
                    <div key={item} className="flex items-start gap-2 text-[10px] text-slate-600 font-semibold mb-1">
                      <ChevronRight className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" />{item}
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={inviteLoading || !!inviteResult?.success}
                  className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:shadow-[0_10px_28px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {inviteLoading ? <><Loader className="w-4 h-4 animate-spin" />Provisioning…</> :
                   inviteResult?.success ? <><CheckCircle className="w-4 h-4" />Doctor Onboarded</> :
                   <><UserPlus className="w-4 h-4" />Onboard Doctor &amp; Send Invite</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          EXTEND SUBSCRIPTION MODAL (Mark as Paid)
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {extendTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setExtendTarget(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] border border-slate-200/80 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
                <h3 className="font-serif font-bold text-lg">Mark as Paid / Extend</h3>
                <p className="text-xs text-white/70 mt-1">
                  {extendTarget.name} — currently on <strong>{PLAN_LABELS[extendTarget.subscription?.plan || ""] || extendTarget.subscription?.plan}</strong>
                </p>
                <button onClick={() => setExtendTarget(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-all">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <form onSubmit={handleExtend} className="p-6 space-y-5">
                {extendResult && (
                  <div className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-semibold ${extendResult.success ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-rose-50 border border-rose-100 text-rose-700"}`}>
                    {extendResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />}
                    <span>{extendResult.message}</span>
                  </div>
                )}

                {/* Doctor summary */}
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 border border-violet-200 flex items-center justify-center text-sm font-bold text-violet-700">
                    {initials(extendTarget.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A2421]">{extendTarget.name}</p>
                    <p className="text-[10px] text-slate-500">{extendTarget.email}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      Current expiry: <strong>{extendTarget.subscription?.validUntil ? new Date(extendTarget.subscription.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</strong>
                    </p>
                  </div>
                </div>

                {/* Plan selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-2">Select New Plan</label>
                  <div className="space-y-2">
                    {[
                      { value: "branch",    label: "Branch Doctor (Permanent)", price: "Free", duration: "Permanent access" },
                      { value: "monthly",   label: "Doctor Portal Monthly", price: "₹1,000", duration: "1 month from today" },
                    ].map(plan => (
                      <button key={plan.value} type="button"
                        onClick={() => setExtendPlan(plan.value)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                          extendPlan === plan.value
                            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                        }`}
                      >
                        <div className="text-left">
                          <div className="text-[11px] font-bold">{plan.label}</div>
                          <div className="text-[9px] text-slate-400">{plan.duration}</div>
                        </div>
                        <div className="text-sm font-bold">{plan.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment note */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Payment Note <span className="text-slate-400 normal-case font-medium">(optional — e.g. "UPI screenshot received")</span>
                  </label>
                  <input
                    type="text" value={extendNote} onChange={e => setExtendNote(e.target.value)}
                    placeholder="Paid via UPI 9876543210 on 19 Jun 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300 outline-none bg-white text-sm font-medium text-[#1A2421] transition-all"
                  />
                </div>

                <button type="submit" disabled={extendLoading || !!extendResult?.success}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_28px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {extendLoading ? <><Loader className="w-4 h-4 animate-spin" />Updating…</> :
                   extendResult?.success ? <><CheckCircle className="w-4 h-4" />Done!</> :
                   <><CheckCircle className="w-4 h-4" />Confirm Payment &amp; Activate {extendPlan.charAt(0).toUpperCase() + extendPlan.slice(1)}</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════
          REMOVE DOCTOR MODAL (Delete / Archive)
      ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {removeTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setRemoveTarget(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] border border-slate-200/80 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-rose-600 to-red-600 p-6 text-white relative">
                <h3 className="font-serif font-bold text-lg">Remove Doctor Profile</h3>
                <p className="text-xs text-white/70 mt-1">
                  Revoke system access for {removeTarget.name}
                </p>
                <button onClick={() => setRemoveTarget(null)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-all">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <form onSubmit={handleRemove} className="p-6 space-y-5">
                {removeResult && (
                  <div className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-semibold ${removeResult.success ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-rose-50 border border-rose-100 text-rose-700"}`}>
                    {removeResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-500" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />}
                    <span>{removeResult.message}</span>
                  </div>
                )}

                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-xs font-medium space-y-2 leading-relaxed">
                  <p>⚠️ <strong>Warning:</strong> This action will permanently:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Delete this doctor's account from Firebase Auth (they won't be able to sign in).</li>
                    <li>Remove their profile and workspace metadata from the directory.</li>
                  </ul>
                  <p className="font-semibold text-rose-950 mt-2">Note: All patient records created by this doctor are fully preserved in Firestore.</p>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-red-100 border border-rose-200 flex items-center justify-center text-sm font-bold text-rose-700">
                    {initials(removeTarget.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A2421]">{removeTarget.name}</p>
                    <p className="text-[10px] text-slate-500">{removeTarget.email}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      Assigned Patients: <strong>{patientCounts[removeTarget.uid] ?? removeTarget.patientCount ?? 0}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setRemoveTarget(null)}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={removeLoading || !!removeResult?.success}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wider text-[10px] rounded-full shadow-[0_4px_12px_rgba(220,38,38,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {removeLoading ? <><Loader className="w-3.5 h-3.5 animate-spin" />Removing…</> :
                     removeResult?.success ? "Done" : "Confirm Removal"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
