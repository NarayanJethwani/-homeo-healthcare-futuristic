"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Link2, Loader2, Plus, RefreshCw, Search, ShieldCheck, UserCheck, Users } from "lucide-react";

type PendingPortalAccount = {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  status: string;
  candidatePatientIds: string[];
};

type ClinicalPatient = {
  id: string;
  name: string;
  email: string;
  assignedDoctor: string;
};

export default function PatientPortalLinksPage() {
  const router = useRouter();
  const [pending, setPending] = useState<PendingPortalAccount[]>([]);
  const [patients, setPatients] = useState<ClinicalPatient[]>([]);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [mappingUid, setMappingUid] = useState("");
  const [query, setQuery] = useState("");
  const [submittedPortalUid, setSubmittedPortalUid] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/patient-portal-links", { cache: "no-store" });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || result?.error?.message || "Unable to load portal requests.");
      setPending(result.pending || []);
      setPatients(result.patients || []);
      setSelections((current) => {
        const next = { ...current };
        for (const account of result.pending || []) {
          if (!next[account.uid] && account.candidatePatientIds?.length === 1) {
            next[account.uid] = account.candidatePatientIds[0];
          }
        }
        return next;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load portal requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const visiblePending = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pending;
    return pending.filter((account) =>
      account.name.toLowerCase().includes(normalized) ||
      account.email.toLowerCase().includes(normalized) ||
      account.uid.toLowerCase().includes(normalized),
    );
  }, [pending, query]);

  function addSubmittedPortalUid() {
    const uid = submittedPortalUid.trim();
    if (!/^[A-Za-z0-9_-]{8,160}$/.test(uid)) {
      setError("Enter the complete Portal UID shared by the patient.");
      return;
    }
    if (pending.some((account) => account.uid === uid)) {
      setQuery(uid);
      setSubmittedPortalUid("");
      setError("");
      return;
    }

    setPending((current) => [{
      uid,
      name: "Patient-submitted Portal UID",
      email: "Confirm identity directly with the patient",
      createdAt: "",
      status: "pending",
      candidatePatientIds: [],
    }, ...current]);
    setSubmittedPortalUid("");
    setQuery("");
    setError("");
  }

  function createClinicalPatient(account: PendingPortalAccount) {
    sessionStorage.setItem("patient_portal_new_case_draft", JSON.stringify({
      name: account.name === "Patient-submitted Portal UID" ? "" : account.name,
      email: account.email === "Confirm identity directly with the patient" ? "" : account.email,
    }));
    router.push("/admin/dashboard?tab=patients&newPatient=1&returnTo=patient-links");
  }

  async function approve(account: PendingPortalAccount) {
    const patientId = selections[account.uid];
    if (!patientId) {
      setError("Select the matching clinical patient record before approval.");
      return;
    }
    const patient = patients.find((item) => item.id === patientId);
    const confirmed = window.confirm(
      `Approve and link ${account.name} (${account.email}) to ${patient?.name || patientId} (${patientId})?`,
    );
    if (!confirmed) return;

    setMappingUid(account.uid);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/admin/patient-portal-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portalUid: account.uid, patientId }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || result?.error?.message || "Unable to approve portal access.");
      setSuccess(result.message);
      setPending((current) => current.filter((item) => item.uid !== account.uid));
    } catch (approvalError) {
      setError(approvalError instanceof Error ? approvalError.message : "Unable to approve portal access.");
    } finally {
      setMappingUid("");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf9] px-5 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin/dashboard?tab=patients" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-mint">
              <ArrowLeft className="h-4 w-4" /> Back to Clinical Database
            </Link>
            <h1 className="mt-4 flex items-center gap-3 font-serif text-3xl font-bold">
              <span className="rounded-2xl bg-purple-500/10 p-3 text-purple-600"><Link2 className="h-6 w-6" /></span>
              Patient Portal Link Requests
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Review newly registered patient portal accounts and map each verified identity to the correct clinical record.
            </p>
          </div>
          <button onClick={loadQueue} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold hover:border-mint disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh requests
          </button>
        </div>

        <section className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><p><strong>Verify before linking.</strong> Confirm the patient&apos;s identity and match against the clinical record. Email matches are suggestions only. Every approval is recorded in an audit event.</p></div>
        </section>

        <section className="mt-5 rounded-3xl border border-purple-200 bg-purple-50/70 p-5 dark:border-purple-900 dark:bg-purple-500/10">
          <label htmlFor="submitted-portal-uid" className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200">
            Portal UID received from patient
          </label>
          <p className="mt-1 text-xs leading-5 text-purple-800/75 dark:text-purple-300">
            Use this when the registration email does not match the clinical record. Confirm identity before mapping.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="submitted-portal-uid"
              value={submittedPortalUid}
              onChange={(event) => setSubmittedPortalUid(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") addSubmittedPortalUid(); }}
              placeholder="Paste the Portal UID from WhatsApp"
              className="min-w-0 flex-1 rounded-2xl border border-purple-200 bg-white px-4 py-3 font-mono text-sm outline-none focus:border-purple-500 dark:border-purple-800 dark:bg-slate-950"
            />
            <button type="button" onClick={addSubmittedPortalUid} className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-700">
              <Link2 className="h-4 w-4" /> Add UID for verification
            </button>
          </div>
        </section>

        {error && <div role="alert" className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}
        {success && <div role="status" className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200"><CheckCircle2 className="h-5 w-5" />{success}</div>}

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or Portal UID" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
          <span className="whitespace-nowrap rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300">{pending.length} pending</span>
        </div>

        <section className="mt-6 space-y-4" aria-label="Pending portal registrations">
          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900"><Loader2 className="h-5 w-5 animate-spin text-mint" /> Loading requests...</div>
          ) : visiblePending.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <UserCheck className="mx-auto h-12 w-12 text-emerald-500" />
              <h2 className="mt-4 text-lg font-bold">No pending link requests</h2>
              <p className="mt-2 text-sm text-slate-500">New eligible patient registrations will appear here automatically.</p>
            </div>
          ) : visiblePending.map((account) => (
            <article key={account.uid} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr_auto] lg:items-end">
                <div>
                  <div className="flex items-center gap-3"><span className="rounded-2xl bg-purple-500/10 p-2.5 text-purple-600"><Users className="h-5 w-5" /></span><div><h2 className="font-bold">{account.name}</h2><p className="text-sm text-slate-500">{account.email}</p></div></div>
                  <p className="mt-4 break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-600 dark:bg-slate-950 dark:text-slate-300">Portal UID: {account.uid}</p>
                  {account.createdAt && <p className="mt-2 text-[11px] text-slate-400">Registered: {new Date(account.createdAt).toLocaleString()}</p>}
                </div>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Map to clinical patient record
                  <select value={selections[account.uid] || ""} onChange={(event) => setSelections((current) => ({ ...current, [account.uid]: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm normal-case tracking-normal outline-none focus:border-mint dark:border-slate-700 dark:bg-slate-950">
                    <option value="">Select verified clinical record...</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>{patient.name} · {patient.id}{patient.email ? ` · ${patient.email}` : ""}{account.candidatePatientIds.includes(patient.id) ? " · Email match" : ""}</option>
                    ))}
                  </select>
                  {account.candidatePatientIds.length > 0 && <span className="mt-2 block text-[11px] normal-case tracking-normal text-emerald-600">Suggested match found by email—confirm identity before approval.</span>}
                  <button
                    type="button"
                    onClick={() => createClinicalPatient(account)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold normal-case tracking-normal text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New Clinical Patient
                  </button>
                </label>

                <button onClick={() => approve(account)} disabled={!selections[account.uid] || mappingUid === account.uid} className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-5 py-3.5 text-sm font-bold text-white hover:bg-mint-dark disabled:cursor-not-allowed disabled:opacity-50">
                  {mappingUid === account.uid ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                  {mappingUid === account.uid ? "Linking..." : "Approve & Map"}
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
