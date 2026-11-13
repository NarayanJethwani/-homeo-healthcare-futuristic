"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Share2,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Shield,
  Layers,
  Lock,
  Calendar,
  Sparkles,
  Info,
  LogOut,
  Send,
} from "lucide-react";
import { normalizeRole } from "@/lib/security/rbac";
import { MetaConnectionStatus, SocialPostRecord } from "@/lib/meta/types";

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface UserSession {
  uid: string;
  email?: string;
  name?: string;
  role: string;
}

function SocialAdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<MetaConnectionStatus | null>(null);
  const [posts, setPosts] = useState<SocialPostRecord[]>([]);
  const [disconnecting, setDisconnecting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Composer state
  const [targetFb, setTargetFb] = useState(true);
  const [targetIg, setTargetIg] = useState(true);
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  // Check user session
  useEffect(() => {
    const saved = localStorage.getItem("admin_session");
    if (!saved) {
      router.push("/admin/login");
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setSession(parsed);
    } catch {
      router.push("/admin/login");
    }
  }, [router]);

  // Read URL query params for feedback
  useEffect(() => {
    const connected = searchParams.get("connected");
    const err = searchParams.get("error");
    const pageName = searchParams.get("page");
    const igUsername = searchParams.get("ig");

    if (connected === "true") {
      setBannerNotice({
        type: "success",
        message: `Successfully connected Meta integration! Page: ${pageName || "Homeo.Healthcare"}${
          igUsername ? ` • Instagram: @${igUsername}` : ""
        }`,
      });
    } else if (err) {
      setBannerNotice({
        type: "error",
        message: `Meta authentication error: ${err}`,
      });
    }
  }, [searchParams]);

  // Fetch connection status and recent posts
  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social/status", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setStatus(data.data);
      } else {
        setStatus({
          connected: false,
          status: "error",
          reconnectRequired: false,
          errorMessage: data.error?.message || "Failed to load connection status.",
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load status";
      setStatus({
        connected: false,
        status: "error",
        reconnectRequired: false,
        errorMessage: msg,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/social/history", { cache: "no-store" });
      const data = await res.json();
      if (data.ok && Array.isArray(data.data)) {
        setPosts(data.data);
      }
    } catch {
      // Non-critical, ignore
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchStatus();
      fetchHistory();
    }
  }, [session, fetchStatus, fetchHistory]);

  // Connect / Reconnect handler
  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/admin/social/auth", {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        setBannerNotice({
          type: "error",
          message: data.error?.message || "Failed to initiate Meta OAuth dialog.",
        });
        setConnecting(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed";
      setBannerNotice({ type: "error", message: msg });
      setConnecting(false);
    }
  };

  // Disconnect handler
  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Meta (Facebook & Instagram)? You can reconnect at any time.")) {
      return;
    }
    setDisconnecting(true);
    try {
      const res = await fetch("/api/admin/social/disconnect", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setBannerNotice({ type: "info", message: "Meta channels have been disconnected." });
        await fetchStatus();
      } else {
        setBannerNotice({ type: "error", message: data.error?.message || "Disconnect failed." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Disconnect failed";
      setBannerNotice({ type: "error", message: msg });
    } finally {
      setDisconnecting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Verifying administration credentials...
      </div>
    );
  }

  const role = normalizeRole(session.role);
  const isSuperAdmin = role === "super-admin";
  const hasAccess = isSuperAdmin || session.role === "admin";

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 p-8 flex flex-col items-center justify-center">
        <Shield className="w-12 h-12 text-rose-500 mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Access Restricted</h1>
        <p className="text-slate-400 max-w-md text-center text-sm mb-6">
          Only Administrators and Super Administrators can view or manage social media publishing channels.
        </p>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-16 antialiased selection:bg-teal-500/30 selection:text-teal-200">
      {/* Decorative gradient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 relative z-10">
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="p-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Return to Clinical OS Dashboard"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-teal-400 font-mono font-bold tracking-wider uppercase">
                  Administration Module
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                  Isolated from Patients
                </span>
              </div>
              <h1 className="text-lg font-bold text-white leading-tight flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                Social Media Publishing
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                fetchStatus();
                fetchHistory();
              }}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Status
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {bannerNotice && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              bannerNotice.type === "success"
                ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-300"
                : bannerNotice.type === "error"
                ? "bg-rose-950/40 border-rose-800/80 text-rose-300"
                : "bg-blue-950/40 border-blue-800/80 text-blue-300"
            }`}
          >
            {bannerNotice.type === "success" && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />}
            {bannerNotice.type === "error" && <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />}
            {bannerNotice.type === "info" && <Info className="w-5 h-5 shrink-0 text-blue-400" />}
            <div className="flex-1 text-xs leading-relaxed">{bannerNotice.message}</div>
            <button
              onClick={() => setBannerNotice(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Connection Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Connection State Card */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Meta Platform Integration</h2>
                    <p className="text-xs text-slate-400">Facebook Pages & Instagram Professional API</p>
                  </div>
                </div>

                {/* Live Connection Badge */}
                {loading ? (
                  <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 animate-pulse">
                    Checking...
                  </span>
                ) : status?.connected ? (
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Connected & Active
                  </span>
                ) : status?.status === "expired" ? (
                  <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Token Expired
                  </span>
                ) : status?.status === "unconfigured" ? (
                  <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 font-medium">
                    Credentials Needed
                  </span>
                ) : (
                  <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 font-medium flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" />
                    Disconnected
                  </span>
                )}
              </div>

              {/* Status details & Account Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Facebook Page Block */}
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <FacebookIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Facebook Page</span>
                  </div>
                  {status?.connected && status?.pageName ? (
                    <div>
                      <div className="text-sm font-semibold text-white">{status.pageName}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">ID: {status.pageId}</div>
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" /> Page Feed & Photos
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Target: <span className="text-slate-400">Homeo.Healthcare</span> (ID: 61559659413532)
                    </div>
                  )}
                </div>

                {/* Instagram Block */}
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-pink-400 mb-2">
                    <InstagramIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Instagram Professional</span>
                  </div>
                  {status?.connected && status?.instagramAccountId ? (
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {status.instagramUsername ? `@${status.instagramUsername}` : "Connected Account"}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">ID: {status.instagramAccountId}</div>
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" /> Content Publishing
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Discovered automatically via connected Facebook Page
                    </div>
                  )}
                </div>
              </div>

              {/* Expiration or Notice info */}
              {status?.connected && status.tokenExpiresAt && (
                <div className="mt-4 p-3 bg-slate-950/30 border border-slate-800/50 rounded-xl text-xs text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>
                      Token expiration:{" "}
                      <span className="text-slate-300 font-mono">
                        {new Date(status.tokenExpiresAt).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                  {status.reconnectRequired && (
                    <span className="text-amber-400 text-[11px] font-semibold">
                      Renewal recommended
                    </span>
                  )}
                </div>
              )}

              {status?.status === "unconfigured" && (
                <div className="mt-4 p-3 bg-purple-950/30 border border-purple-800/50 rounded-xl text-xs text-purple-200">
                  <div className="font-semibold mb-1">Environment Credentials Required</div>
                  <div>
                    Set <code className="bg-purple-900/60 px-1 py-0.5 rounded font-mono text-white">META_APP_ID</code> and{" "}
                    <code className="bg-purple-900/60 px-1 py-0.5 rounded font-mono text-white">META_APP_SECRET</code> in{" "}
                    <code className="bg-purple-900/60 px-1 py-0.5 rounded font-mono text-white">.env.local</code> to enable the Meta OAuth flow. Refer to{" "}
                    <code className="bg-purple-900/60 px-1 py-0.5 rounded font-mono text-white">docs/meta-social-setup.md</code>.
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Requires: <span className="text-slate-400 font-mono">pages_manage_posts, instagram_content_publish</span>
              </div>
              <div className="flex items-center gap-3">
                {status?.connected ? (
                  <>
                    <button
                      onClick={handleConnect}
                      disabled={connecting}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {connecting ? "Redirecting..." : "Reconnect / Refresh Permissions"}
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                      className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded-xl border border-rose-800 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {disconnecting ? "Disconnecting..." : "Disconnect Channels"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={connecting || status?.status === "unconfigured"}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {connecting ? "Opening Meta Authorization..." : "Connect Meta Account"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Security & Isolation Summary Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Shield className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold">Clinical Isolation Boundary</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Social publishing operations are strictly decoupled from patient health records, clinical intakes, and EMR data.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Zero access to <code className="text-teal-300 font-mono">patients/</code> collection</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Tokens stored in server-only Firestore</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Never exposed to client JavaScript or logs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Strict Super-Admin & Admin RBAC</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              Graph API Version: <span className="text-slate-400 font-mono">v21.0</span> (configurable)
            </div>
          </div>
        </div>

        {/* Social Post Composer (Stage 1 Interface) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Social Media Composer
              </h2>
              <p className="text-xs text-slate-400">Compose and preview updates for Homeo Healthcare</p>
            </div>

            {/* Platform Checkboxes */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={targetFb}
                  onChange={(e) => setTargetFb(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <FacebookIcon className="w-4 h-4 text-blue-400" />
                Facebook Page
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={targetIg}
                  onChange={(e) => setTargetIg(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-pink-600 focus:ring-pink-500 w-4 h-4"
                />
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                Instagram
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {/* Caption Area */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <label className="font-semibold text-slate-300">Post Caption</label>
                <div className="flex gap-3 text-[11px] font-mono">
                  <span className={caption.length > 2200 ? "text-rose-400 font-bold" : "text-slate-500"}>
                    IG: {caption.length}/2,200
                  </span>
                  <span className={caption.length > 63206 ? "text-rose-400 font-bold" : "text-slate-500"}>
                    FB: {caption.length}/63,206
                  </span>
                </div>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={5}
                placeholder="What would you like to share about Homeo Healthcare consultations, clinics, or holistic wellness?"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-y"
              />
            </div>

            {/* Media URL / Asset */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Media Image URL (Optional)</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://www.homeo.healthcare/images/consultation-cover.jpg"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Instagram requires a publicly accessible HTTPS image URL.
              </p>
            </div>

            {/* Stage 1 Checkpoint Notice */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  Stage 1 Verification Checkpoint: Connect your Meta account first to verify permissions and tokens.
                </span>
              </div>
              <button
                type="button"
                disabled={!status?.connected || (!targetFb && !targetIg) || !caption.trim()}
                className="px-5 py-2 bg-slate-800 text-slate-400 text-xs font-bold rounded-xl flex items-center gap-2 border border-slate-700 cursor-not-allowed opacity-60"
                title="Stage 2 will unlock live multi-channel automated publishing after Stage 1 verification."
              >
                <Send className="w-3.5 h-3.5" />
                Publish Update (Stage 2)
              </button>
            </div>
          </div>
        </div>

        {/* Publishing History */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Publishing Audit Log
            </h2>
            <span className="text-xs text-slate-500">{posts.length} entries recorded</span>
          </div>

          {posts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No publishing activity recorded yet in <code className="font-mono text-slate-400">social_posts</code>.
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          post.status === "success"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : post.status === "partial"
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : "bg-rose-950 text-rose-400 border border-rose-800"
                        }`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 line-clamp-2">{post.caption}</p>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 shrink-0">
                    {post.platforms.includes("facebook") && (
                      <span className="flex items-center gap-1 bg-blue-950/60 text-blue-300 px-2 py-1 rounded border border-blue-900/60">
                        <FacebookIcon className="w-3 h-3" /> FB
                      </span>
                    )}
                    {post.platforms.includes("instagram") && (
                      <span className="flex items-center gap-1 bg-pink-950/60 text-pink-300 px-2 py-1 rounded border border-pink-900/60">
                        <InstagramIcon className="w-3 h-3" /> IG
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SocialAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
          Loading social management portal...
        </div>
      }
    >
      <SocialAdminDashboardContent />
    </Suspense>
  );
}
