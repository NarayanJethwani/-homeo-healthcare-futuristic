"use client";

import { useCallback, useEffect, useState } from "react";

const RELEASE_VERSION = "v1.2.0";

type Readiness = {
  ready: boolean;
  version: string;
  activeVersion: string;
  totalRubrics: number;
  totalSources: number;
  governedArtifactCount: number;
  missingArtifactCount: number;
  sampleIndexReadable: boolean;
  checks: Record<string, boolean>;
};

async function restoreServerSession(): Promise<boolean> {
  const { auth } = await import("@/lib/firebase");
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) return false;
  const idToken = await user.getIdToken();
  const response = await fetch("/api/admin/session", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return response.ok;
}

function requestReadiness() {
  return fetch(`/api/admin/repertory-review?action=release-readiness&version=${RELEASE_VERSION}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
}

export default function RepertoryReleasePage() {
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      let response = await requestReadiness();
      if (response.status === 401 && await restoreServerSession()) {
        response = await requestReadiness();
      }
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || payload.error?.message || `Readiness check failed (${response.status}).`);
      }
      setReadiness(payload.readiness);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Readiness check failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function activate() {
    setActivating(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/repertory-review", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "activate-snapshot",
          version: RELEASE_VERSION,
          reason: "Activate verified public-domain repertory ingestion release v1.2.0",
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || payload.error?.message || `Activation failed (${response.status}).`);
      }
      setMessage(payload.message);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Activation failed.");
    } finally {
      setActivating(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Governed repertory release</p>
        <h1 className="mt-3 text-3xl font-black">Release {RELEASE_VERSION}</h1>
        <p className="mt-2 text-sm text-slate-400">Production readiness and atomic corpus activation.</p>

        {loading ? <p className="mt-8 text-sm">Checking production artifacts and approvals…</p> : null}

        {readiness ? (
          <div className="mt-8 space-y-6">
            <div className={`rounded-2xl border p-5 ${readiness.ready ? "border-emerald-700 bg-emerald-950/50" : "border-amber-700 bg-amber-950/50"}`}>
              <p className="text-lg font-bold">{readiness.ready ? "Ready to activate" : "Activation blocked"}</p>
              <p className="mt-1 text-sm text-slate-300">Active corpus: {readiness.activeVersion}</p>
              <p className="text-sm text-slate-300">{readiness.totalRubrics.toLocaleString()} rubrics · {readiness.totalSources} sources · {readiness.governedArtifactCount} governed artifacts</p>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              {Object.entries({ ...readiness.checks, sampleIndexReadable: readiness.sampleIndexReadable }).map(([name, passed]) => (
                <div key={name} className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3">
                  <dt className="text-sm text-slate-300">{name.replace(/([A-Z])/g, " $1")}</dt>
                  <dd className={passed ? "text-emerald-400" : "text-rose-400"}>{passed ? "Passed" : "Failed"}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => void refresh()} disabled={loading || activating} className="rounded-xl border border-slate-700 px-4 py-2 font-semibold disabled:opacity-50">Refresh checks</button>
              <button type="button" onClick={() => void activate()} disabled={!readiness.ready || activating || readiness.activeVersion === RELEASE_VERSION} className="rounded-xl bg-cyan-500 px-5 py-2 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">
                {readiness.activeVersion === RELEASE_VERSION ? "Release is live" : activating ? "Activating…" : `Activate ${RELEASE_VERSION}`}
              </button>
            </div>
          </div>
        ) : null}

        {message ? <p role="status" className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm">{message}</p> : null}
      </div>
    </main>
  );
}
