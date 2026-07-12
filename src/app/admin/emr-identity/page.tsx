import { notFound } from "next/navigation";
import { featureFlags } from "@/features/dashboard/constants/featureFlags";
import { PatientIdentityInventoryPanel } from "@/features/emr-identity/PatientIdentityInventoryPanel";

export default function EmrIdentityInventoryPage() {
  if (!featureFlags.emrPatientIdentityReconciliationEnabled) notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">EMR migration safety</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Patient identity reconciliation</h1>
        <p className="mt-3 max-w-3xl text-slate-600">A read-only inventory for identifying broken links and duplicate candidates before any migration is authorized.</p>
        <div className="mt-8">
          <PatientIdentityInventoryPanel />
        </div>
      </div>
    </main>
  );
}
