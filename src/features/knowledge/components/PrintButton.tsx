"use client";

import React from "react";
import { Printer } from "lucide-react";

export default function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="print-hide inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-500/10 hover:bg-neutral-500/5 text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-all duration-300 cursor-pointer"
    >
      <Printer className="h-3.5 w-3.5" /> Print Article
    </button>
  );
}
