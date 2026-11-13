"use client";

/**
 * Isolated /store-v2 Care Fee Card & Calculator Route.
 * Implements the 3-level Care Fee Card single source of truth.
 * No payment at this step.
 * Non-emergency clinical care.
 */

import React from "react";
import { StoreClinicalCareV2View } from "@/features/store-clinical-care/components/StoreClinicalCareV2View";

export default function StoreV2Page() {
  return <StoreClinicalCareV2View />;
}
