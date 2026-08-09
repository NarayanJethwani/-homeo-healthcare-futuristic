"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ConsultationWorkspaceShell } from "@/features/consultation/components/ConsultationWorkspaceShell";
import { Shield, AlertTriangle } from "lucide-react";

function ConsultationPageContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId")?.trim() || "";

  if (!patientId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-100 p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h1 className="text-xl font-bold mb-2">Patient ID Required</h1>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Please select a valid patient from the Clinical OS dashboard to initiate a consultation.
        </p>
        <a
          href="/admin/dashboard?tab=patients"
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm"
        >
          Return to Patient Dashboard
        </a>
      </div>
    );
  }

  return <ConsultationWorkspaceShell patientId={patientId} />;
}

export default function NativeConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-400">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm">Initializing Clinical Consultation Workspace...</p>
        </div>
      }
    >
      <ConsultationPageContent />
    </Suspense>
  );
}
