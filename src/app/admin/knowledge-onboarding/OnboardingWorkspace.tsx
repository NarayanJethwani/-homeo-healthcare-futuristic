"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  KeyRound,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

type Role =
  | "clinical-author"
  | "independent-clinical-reviewer"
  | "evidence-reviewer"
  | "rights-reviewer";
type Expertise =
  | "gastroenterology"
  | "dermatology"
  | "laboratory-medicine"
  | "homeopathy-subject-matter"
  | "evidence-methodology"
  | "source-rights";

interface RecordDTO {
  recordId: string;
  kind: "contributor" | "program-owner";
  status: "verification-pending" | "eligible" | "suspended";
  eligibleRoles: Role[];
  expertiseDomains: Expertise[];
  credentialCount: number;
  verifiedCredentialCount: number;
  identityVerificationStatus: "pending" | "verified" | "rejected";
  attestationsComplete: boolean;
  version: number;
  updatedAt: string;
}

interface Workspace {
  records: RecordDTO[];
  operations: {
    status: "roster-incomplete" | "roster-covered";
    seats: Array<{
      seatId: string;
      role: string;
      expertiseDomain: string | null;
      status: "unfilled" | "covered";
      eligibleCandidateCount: number;
    }>;
    summary: {
      requiredOperatingSeats: 11;
      coveredOperatingSeats: number;
      unfilledOperatingSeats: number;
      requiredEditorialAssignmentSlots: 32;
      qualifiedAssignmentSlotsCovered: number;
      privateContributorRecordsAssessed: number;
      privateProgramOwnerRecordsAssessed: number;
      intakeGateReady: boolean;
    };
  };
  authority: {
    assignmentApprovalGranted: false;
    draftingAuthorityGranted: false;
    publicationAuthorityGranted: false;
    productionRagAuthorityGranted: false;
  };
}

const ROLES: Array<{ value: Role; label: string }> = [
  { value: "clinical-author", label: "Clinical author" },
  {
    value: "independent-clinical-reviewer",
    label: "Independent clinical reviewer",
  },
  { value: "evidence-reviewer", label: "Evidence reviewer" },
  { value: "rights-reviewer", label: "Source-rights reviewer" },
];
const EXPERTISE: Array<{ value: Expertise; label: string }> = [
  { value: "gastroenterology", label: "Gastroenterology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "laboratory-medicine", label: "Laboratory medicine" },
  {
    value: "homeopathy-subject-matter",
    label: "Homeopathy subject matter",
  },
  { value: "evidence-methodology", label: "Evidence methodology" },
  { value: "source-rights", label: "Source rights" },
];

const initialCreate = {
  recordId: "",
  kind: "contributor" as "contributor" | "program-owner",
  fullName: "",
  identityScheme: "staff-id" as "staff-id" | "orcid" | "github",
  identityValue: "",
  eligibleRoles: [] as Role[],
  expertiseDomains: [] as Expertise[],
  credentialId: "",
  credentialTitle: "",
  credentialIssuer: "",
  credentialEvidenceRef: "",
  credentialExpiresAt: "",
  acceptanceEvidenceRef: "",
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
        checked
          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100"
          : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
      }`}
    >
      {checked ? "✓ " : ""}
      {label}
    </button>
  );
}

export default function OnboardingWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(initialCreate);
  const [attestationsAccepted, setAttestationsAccepted] = useState(false);
  const [verifyForm, setVerifyForm] = useState({
    recordId: "",
    expectedVersion: "1",
    identityEvidenceRef: "",
    verifiedCredentialIds: "",
  });

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/knowledge/onboarding", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (response.status === 401 || response.status === 403) {
        setError("This workspace requires super-administrator access.");
        return;
      }
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error("Unable to load the private onboarding workspace.");
      }
      setWorkspace(payload.workspace);
    } catch {
      setError("Unable to load the private onboarding workspace.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    const developmentBypass =
      process.env.NEXT_PUBLIC_ALLOW_DEV_ADMIN_BYPASS === "true";
    if (!session && !developmentBypass) {
      router.replace("/admin/login");
      return;
    }
    void loadWorkspace();
  }, [loadWorkspace, router]);

  const unfilledSeats = useMemo(
    () => workspace?.operations.seats.filter((seat) => seat.status === "unfilled") ?? [],
    [workspace]
  );

  function toggleRole(role: Role) {
    setCreateForm((current) => ({
      ...current,
      eligibleRoles: current.eligibleRoles.includes(role)
        ? current.eligibleRoles.filter((candidate) => candidate !== role)
        : [...current.eligibleRoles, role],
    }));
  }

  function toggleExpertise(expertise: Expertise) {
    setCreateForm((current) => ({
      ...current,
      expertiseDomains: current.expertiseDomains.includes(expertise)
        ? current.expertiseDomains.filter(
            (candidate) => candidate !== expertise
          )
        : [...current.expertiseDomains, expertise],
    }));
  }

  async function sendMutation(method: "POST" | "PATCH", body: unknown) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/knowledge/onboarding", {
        method,
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "ONBOARDING_REQUEST_FAILED");
      }
      setMessage(
        method === "POST"
          ? "Record created. A different authorized verifier must complete verification."
          : "Verification recorded. Roster coverage has been recalculated."
      );
      await loadWorkspace();
      return true;
    } catch (reason) {
      const code =
        reason instanceof Error ? reason.message : "ONBOARDING_REQUEST_FAILED";
      setError(
        code === "ONBOARDING_MAKER_CHECKER_SEPARATION_REQUIRED"
          ? "The creator cannot verify the same record. Use a second authorized administrator."
          : `Request blocked: ${code}`
      );
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function createRecord(event: React.FormEvent) {
    event.preventDefault();
    if (!attestationsAccepted) {
      setError("All four contributor attestations must be evidenced.");
      return;
    }
    const owner = createForm.kind === "program-owner";
    const succeeded = await sendMutation("POST", {
      action: "create",
      recordId: createForm.recordId.trim().toUpperCase(),
      kind: createForm.kind,
      fullName: createForm.fullName.trim(),
      identityScheme: createForm.identityScheme,
      identityValue: createForm.identityValue.trim(),
      eligibleRoles: owner ? [] : createForm.eligibleRoles,
      expertiseDomains: owner ? [] : createForm.expertiseDomains,
      credentials: owner
        ? []
        : [
            {
              credentialId: createForm.credentialId.trim().toUpperCase(),
              title: createForm.credentialTitle.trim(),
              issuer: createForm.credentialIssuer.trim(),
              evidenceRef: createForm.credentialEvidenceRef.trim(),
              expiresAt: createForm.credentialExpiresAt || null,
            },
          ],
      attestations: {
        conflictOfInterestDeclared: true,
        editorialIndependenceAccepted: true,
        aiAssistanceDisclosureAccepted: true,
        sourceUsePolicyAccepted: true,
        acceptanceEvidenceRef: createForm.acceptanceEvidenceRef.trim(),
      },
    });
    if (succeeded) {
      setCreateForm(initialCreate);
      setAttestationsAccepted(false);
    }
  }

  async function verifyRecord(event: React.FormEvent) {
    event.preventDefault();
    const succeeded = await sendMutation("PATCH", {
      action: "verify",
      recordId: verifyForm.recordId.trim().toUpperCase(),
      expectedVersion: Number(verifyForm.expectedVersion),
      identityEvidenceRef: verifyForm.identityEvidenceRef.trim(),
      verifiedCredentialIds: verifyForm.verifiedCredentialIds
        .split(",")
        .map((value) => value.trim().toUpperCase())
        .filter(Boolean),
    });
    if (succeeded) {
      setVerifyForm({
        recordId: "",
        expectedVersion: "1",
        identityEvidenceRef: "",
        verifiedCredentialIds: "",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#07101d] px-4 py-8 text-slate-200 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:text-white"
              aria-label="Back to admin dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                <LockKeyhole className="h-4 w-4" />
                Private governance workspace
              </div>
              <h1 className="text-2xl font-bold text-white">
                KEP-1 Contributor Onboarding
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                Verify the eleven-person operating roster without exposing names,
                identifiers, or credential evidence in public reports.
              </p>
            </div>
          </div>
          <button
            onClick={() => void loadWorkspace()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500/50 hover:text-cyan-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh readiness
          </button>
        </header>

        {message && (
          <div
            role="status"
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            {message}
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
          >
            {error}
          </div>
        )}

        {loading && !workspace ? (
          <div className="flex min-h-72 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/60">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              {[
                {
                  label: "Operating seats",
                  value: `${workspace?.operations.summary.coveredOperatingSeats ?? 0}/11`,
                  icon: UsersRound,
                },
                {
                  label: "Assignment coverage",
                  value: `${workspace?.operations.summary.qualifiedAssignmentSlotsCovered ?? 0}/32`,
                  icon: UserRoundCheck,
                },
                {
                  label: "Verified records",
                  value: `${
                    workspace?.records.filter(
                      (record) => record.status === "eligible"
                    ).length ?? 0
                  }`,
                  icon: ShieldCheck,
                },
                {
                  label: "Drafting authority",
                  value: "Locked",
                  icon: KeyRound,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
                >
                  <Icon className="mb-4 h-5 w-5 text-cyan-400" />
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <form
                onSubmit={createRecord}
                className="space-y-5 rounded-3xl border border-slate-800 bg-slate-950/70 p-6"
              >
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    1. Create verification-pending record
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Raw identity values are keyed-hashed immediately and are never
                    returned by the API.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    value={createForm.recordId}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        recordId: event.target.value,
                      }))
                    }
                    placeholder="Stable record ID"
                    className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                  />
                  <select
                    value={createForm.kind}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        kind: event.target.value as typeof current.kind,
                      }))
                    }
                    className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                  >
                    <option value="contributor">Contributor</option>
                    <option value="program-owner">Program owner</option>
                  </select>
                  <input
                    required
                    value={createForm.fullName}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="Full legal/professional name"
                    className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                  />
                  <select
                    value={createForm.identityScheme}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        identityScheme: event.target
                          .value as typeof current.identityScheme,
                      }))
                    }
                    className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                  >
                    <option value="staff-id">Staff ID</option>
                    <option value="orcid">ORCID</option>
                    <option value="github">GitHub identity</option>
                  </select>
                  <input
                    required
                    type="password"
                    autoComplete="off"
                    value={createForm.identityValue}
                    onChange={(event) =>
                      setCreateForm((current) => ({
                        ...current,
                        identityValue: event.target.value,
                      }))
                    }
                    placeholder="Identity value (not retained in browser)"
                    className="sm:col-span-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                  />
                </div>

                {createForm.kind === "contributor" && (
                  <>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Eligible role
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {ROLES.map((role) => (
                          <Toggle
                            key={role.value}
                            label={role.label}
                            checked={createForm.eligibleRoles.includes(role.value)}
                            onChange={() => toggleRole(role.value)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Verified expertise scope
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {EXPERTISE.map((expertise) => (
                          <Toggle
                            key={expertise.value}
                            label={expertise.label}
                            checked={createForm.expertiseDomains.includes(
                              expertise.value
                            )}
                            onChange={() => toggleExpertise(expertise.value)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["credentialId", "Credential ID"],
                        ["credentialTitle", "Credential title"],
                        ["credentialIssuer", "Issuing authority"],
                        ["credentialEvidenceRef", "Private evidence reference"],
                      ].map(([field, placeholder]) => (
                        <input
                          key={field}
                          required
                          value={
                            createForm[field as keyof typeof createForm] as string
                          }
                          onChange={(event) =>
                            setCreateForm((current) => ({
                              ...current,
                              [field]: event.target.value,
                            }))
                          }
                          placeholder={placeholder}
                          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                        />
                      ))}
                      <label className="text-xs text-slate-500">
                        Credential expiry (optional)
                        <input
                          type="date"
                          value={createForm.credentialExpiresAt}
                          onChange={(event) =>
                            setCreateForm((current) => ({
                              ...current,
                              credentialExpiresAt: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                        />
                      </label>
                    </div>
                  </>
                )}

                <input
                  required
                  value={createForm.acceptanceEvidenceRef}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      acceptanceEvidenceRef: event.target.value,
                    }))
                  }
                  placeholder="Private attestation evidence reference"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                />
                <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={attestationsAccepted}
                    onChange={(event) =>
                      setAttestationsAccepted(event.target.checked)
                    }
                    className="mt-0.5"
                  />
                  Conflict declaration, editorial independence, AI-assistance
                  disclosure, and source-use policy acceptances are all evidenced
                  by the private reference above.
                </label>
                <button
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                  Create pending record
                </button>
              </form>

              <div className="space-y-6">
                <form
                  onSubmit={verifyRecord}
                  className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      2. Independent verification
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Must be completed by a different authorized administrator.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      required
                      value={verifyForm.recordId}
                      onChange={(event) =>
                        setVerifyForm((current) => ({
                          ...current,
                          recordId: event.target.value,
                        }))
                      }
                      placeholder="Record ID"
                      className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                    />
                    <input
                      required
                      min="1"
                      type="number"
                      value={verifyForm.expectedVersion}
                      onChange={(event) =>
                        setVerifyForm((current) => ({
                          ...current,
                          expectedVersion: event.target.value,
                        }))
                      }
                      placeholder="Expected version"
                      className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                    />
                    <input
                      required
                      value={verifyForm.identityEvidenceRef}
                      onChange={(event) =>
                        setVerifyForm((current) => ({
                          ...current,
                          identityEvidenceRef: event.target.value,
                        }))
                      }
                      placeholder="Identity verification evidence reference"
                      className="sm:col-span-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                    />
                    <input
                      value={verifyForm.verifiedCredentialIds}
                      onChange={(event) =>
                        setVerifyForm((current) => ({
                          ...current,
                          verifiedCredentialIds: event.target.value,
                        }))
                      }
                      placeholder="Verified credential IDs, comma separated"
                      className="sm:col-span-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    disabled={busy}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Record independent verification
                  </button>
                </form>

                <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                  <h2 className="text-lg font-semibold text-white">
                    Unfilled operating seats
                  </h2>
                  <div className="mt-4 grid gap-2">
                    {!workspace ? (
                      <p className="text-sm text-slate-400">
                        Readiness data is unavailable until the private registry
                        can be loaded.
                      </p>
                    ) : unfilledSeats.length === 0 ? (
                      <p className="text-sm text-emerald-300">
                        All operating seats have qualified coverage.
                      </p>
                    ) : (
                      unfilledSeats.map((seat) => (
                        <div
                          key={seat.seatId}
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2"
                        >
                          <span className="text-xs text-slate-300">
                            {seat.seatId}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-amber-400">
                            unfilled
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Redacted private-registry index
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Names, identity hashes, and evidence references are excluded.
                  </p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {workspace?.records.length ?? 0} records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-500">
                    <tr>
                      {[
                        "Record",
                        "Type",
                        "Status",
                        "Identity",
                        "Credentials",
                        "Version",
                      ].map((heading) => (
                        <th key={heading} className="px-3 py-3 font-medium">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {workspace?.records.map((record) => (
                      <tr key={record.recordId} className="border-b border-slate-900">
                        <td className="px-3 py-3 font-mono text-cyan-300">
                          {record.recordId}
                        </td>
                        <td className="px-3 py-3 text-slate-300">{record.kind}</td>
                        <td className="px-3 py-3 text-slate-300">{record.status}</td>
                        <td className="px-3 py-3 text-slate-300">
                          {record.identityVerificationStatus}
                        </td>
                        <td className="px-3 py-3 text-slate-300">
                          {record.verifiedCredentialCount}/{record.credentialCount}
                        </td>
                        <td className="px-3 py-3 text-slate-300">{record.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
