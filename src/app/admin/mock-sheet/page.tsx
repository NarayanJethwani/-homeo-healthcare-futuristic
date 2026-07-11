"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LegacyRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mockId = searchParams.get("mockId") || searchParams.get("id") || "";
    // Redirect to canonical clinical route, preserving patient ID info
    if (mockId) {
      router.replace(`/admin/clinical?patientId=${encodeURIComponent(mockId)}`);
    } else {
      router.replace("/admin/clinical");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-sans text-xs">
      <div className="text-center space-y-2">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-bold text-slate-300">Redirecting to Clinical Intelligence Platform...</p>
        <p className="text-[10px] text-slate-500">Legacy route: /admin/mock-sheet</p>
      </div>
    </div>
  );
}

export default function MockSheetRedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-500 p-8 text-center font-bold text-xs">Loading redirect...</div>}>
      <LegacyRedirectContent />
    </Suspense>
  );
}
