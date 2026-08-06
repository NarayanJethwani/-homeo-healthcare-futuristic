"use client";

/**
 * Isolated /store Clinical Care Route.
 * No payment at this step.
 * This service is not an emergency service.
 */

import React from "react";
import { isStoreClinicalCareV1Enabled } from "@/lib/featureFlags";
import { StoreClinicalCareView } from "@/features/store-clinical-care/components/StoreClinicalCareView";

export default function StorePage() {
  if (isStoreClinicalCareV1Enabled()) {
    return <StoreClinicalCareView />;
  }

  // Fallback view if feature flag is disabled
  return (
    <main className="min-h-screen p-8 text-center bg-slate-50 text-slate-800">
      <h1 className="text-2xl font-bold mb-4">Homeo Healthcare Store</h1>
      <p className="text-sm text-slate-600 max-w-md mx-auto">
        The Clinical Care Store is currently undergoing maintenance. Please contact our care team for consultation assistance.
      </p>
    </main>
  );
}
