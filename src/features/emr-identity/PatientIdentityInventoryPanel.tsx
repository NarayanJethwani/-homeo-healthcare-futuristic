"use client";

import { useCallback, useEffect, useState } from "react";
import type { PatientIdentityInventoryReport } from "./types";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; report: PatientIdentityInventoryReport }
  | { status: "failed"; message: string };

function Metric({ label, value, tone = "neutral" }: {
  label: string;
  value: number;
  tone?: "neutral" | "warning";
}) {
  return (
    <div className={`rounded-2xl border p-5 ${tone === "warning" ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"}`}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export function PatientIdentityInventoryPanel() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/admin/emr/patient-identity-inventory", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("The inventory is unavailable.");
      setState({ status: "ready", report: await response.json() as PatientIdentityInventoryReport });
    } catch {
      setState({ status: "failed", message: "The read-only inventory could not be generated." });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (state.status === "loading") {
    return <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Preparing the read-only inventory…</p>;
  }

  if (state.status === "failed") {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <p className="font-medium text-rose-900">{state.message}</p>
        <button type="button" onClick={() => void load()} className="mt-4 min-h-11 rounded-xl bg-slate-950 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
          Try again
        </button>
      </div>
    );
  }

  const { report } = state;
  const blockingIssues = report.reconciliation.issues.filter(issue => issue.severity === "blocking");
  const reviewIssues = report.reconciliation.issues.filter(issue => issue.severity === "review");

  return (
    <div className="space-y-6">
      <section aria-labelledby="inventory-summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <h2 id="inventory-summary" className="sr-only">Inventory summary</h2>
        <Metric label="Patient records" value={report.patientCount} />
        <Metric label="Invalid portal links" value={report.invalidPortalLinkCount} tone={report.invalidPortalLinkCount ? "warning" : "neutral"} />
        <Metric label="Linked records" value={report.linkedRecordCount} />
        <Metric label="Orphaned linked records" value={report.orphanedLinkedRecordCount} tone={report.orphanedLinkedRecordCount ? "warning" : "neutral"} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Reconciliation review</h2>
            <p className="mt-1 text-sm text-slate-600">Identifiers only. No demographics, notes, laboratory values, billing amounts, or attachments are displayed.</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">Zero writes</span>
        </div>

        {blockingIssues.length === 0 && reviewIssues.length === 0 ? (
          <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-900">No reconciliation issues were detected.</p>
        ) : (
          <div className="mt-5 space-y-5">
            {[...blockingIssues, ...reviewIssues].map((issue, index) => (
              <article key={`${issue.code}-${index}`} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-slate-950">{issue.code.replaceAll("-", " ")}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${issue.severity === "blocking" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                    {issue.severity === "blocking" ? "Blocking" : "Human review"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{issue.explanation}</p>
                <ul className="mt-3 space-y-1 font-mono text-xs text-slate-700" aria-label="Affected record identifiers">
                  {issue.candidateKeys.map(key => <li key={key}>{key}</li>)}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      {report.truncatedCollections.length > 0 && (
        <section role="status" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
          <h2 className="font-semibold">Inventory scan limit reached</h2>
          <p className="mt-1 text-sm">The following collections reached the protected scan limit and require a paginated offline reconciliation before migration decisions are made:</p>
          <p className="mt-2 font-mono text-sm">{report.truncatedCollections.join(", ")}</p>
        </section>
      )}

      <p className="text-sm text-slate-500">Generated {new Date(report.generatedAt).toLocaleString()}. This screen cannot merge, edit, or delete patient records.</p>
    </div>
  );
}
